
import { User } from '../models/User.js';
import { PointLedger } from '../models/PointLedger.js';

export async function getBalance(req, res, next) {
  try {
    const user = await User.findById(req.user.sub);

    const levelUpdate = user.updateLevel();
    if (levelUpdate.leveledUp) {
      await user.save();
    }

    const ledger = await PointLedger.find({ userId: req.user.sub })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    const POINTS_PER_LEVEL = 200;
    const currentLevelPoints =
      user.totalPointsEarned - (user.level - 1) * POINTS_PER_LEVEL;
    const pointsToNextLevel =
      user.level * POINTS_PER_LEVEL - user.totalPointsEarned;
    const levelProgress = (currentLevelPoints / POINTS_PER_LEVEL) * 100;

    res.json({
      balance: user.points,
      points: user.points, // For backward compatibility
      level: user.level,
      levelInfo: {
        level: user.level,
        currentLevelPoints,
        pointsToNextLevel,
        levelProgress,
        leveledUp: levelUpdate.leveledUp,
      },
      last50: ledger,
    });
  } catch (e) {
    next(e);
  }
}

export async function addRecyclePoints(req, res, next) {
  try {
    let { weight, unit } = req.body; // weight in kg by default
    if (weight === undefined || weight === null) {
      return res.status(400).json({ message: 'Weight is required.' });
    }

    // Normalize types
    weight = Number(weight);
    if (!Number.isFinite(weight) || weight <= 0) {
      return res.status(400).json({ message: 'Invalid weight value.' });
    }

    // Support grams if client sends unit: 'g'
    if (unit === 'g') {
      weight = weight / 1000; // convert to kg
    }

    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // 10 points per kg — round to nearest integer to allow fractional kg to count fairly
    const POINTS_PER_KG = 10;
    const pointsEarned = Math.round(weight * POINTS_PER_KG);

    // Update balances
    user.points = (user.points || 0) + pointsEarned;
    user.totalPointsEarned = (user.totalPointsEarned || 0) + pointsEarned;

    // Update level if applicable (mirrors your balance logic)
    const levelUpdate = user.updateLevel();
    await user.save();

    // Record in ledger
    await PointLedger.create({
      userId: req.user.sub,
      type: 'recycle',
      points: pointsEarned,
      description: `Recycled ${weight.toFixed(3)} kg — earned ${pointsEarned} points`,
      meta: {
        weightKg: weight,
        unit: unit || 'kg',
        rate: `${POINTS_PER_KG} pts/kg`,
      },
    });

    return res.json({
      message: 'Points added successfully.',
      pointsEarned,
      newBalance: user.points,
      level: user.level,
      leveledUp: !!levelUpdate?.leveledUp,
    });
  } catch (e) {
    next(e);
  }
}

export async function getLedger(req, res, next) {
  try {
    const limit = Math.min(Number(req.query.limit) || 50, 200);
    const ledger = await PointLedger.find({ userId: req.user.sub })
      .sort({ createdAt: -1 })
      .limit(limit)
      .lean();

    return res.json({ items: ledger });
  } catch (e) {
    next(e);
  }
}
