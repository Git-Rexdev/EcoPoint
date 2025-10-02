
import { User } from '../models/User.js';
import { PointLedger } from '../models/PointLedger.js';

export async function getBalance(req, res, next) {
  try {
    const user = await User.findById(req.user.sub);
    
    // Update level based on current points
    const levelUpdate = user.updateLevel();
    if (levelUpdate.leveledUp) {
      await user.save();
    }
    
    const ledger = await PointLedger.find({ userId: req.user.sub }).sort({ createdAt: -1 }).limit(50).lean();
    
    // Calculate level progress info based on totalPointsEarned
    const POINTS_PER_LEVEL = 200;
    const currentLevelPoints = user.totalPointsEarned - ((user.level - 1) * POINTS_PER_LEVEL);
    const pointsToNextLevel = (user.level * POINTS_PER_LEVEL) - user.totalPointsEarned;
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
        leveledUp: levelUpdate.leveledUp
      },
      last50: ledger 
    });
  } catch (e) { next(e); }
}
