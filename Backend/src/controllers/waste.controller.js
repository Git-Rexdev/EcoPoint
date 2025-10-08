
import { z } from 'zod';
import { WasteSubmission } from '../models/WasteSubmission.js';
import { User } from '../models/User.js';
import { PointLedger } from '../models/PointLedger.js';
import { ApiError } from '../utils/error.js';

const submitSchema = z.object({
  body: z.object({
    type: z.enum(['PLASTIC','PAPER','METAL','E_WASTE','GLASS','OTHER']),
    weightKg: z.number().min(0.1).max(200),
    location: z.object({
      lat: z.number(), lng: z.number(), address: z.string().optional()
    }).optional()
  })
});

export async function submitWaste(req, res, next) {
  try {
    const parsed = submitSchema.parse({ body: req.body });

    // Find user
    const user = await User.findById(req.user.sub);
    if (!user) return res.status(404).json({ message: 'User not found.' });

    // Award 10 points per kg
    const pts = Math.round(parsed.body.weightKg * 10);

    // Create submission as approved and record awarded points
    const sub = await WasteSubmission.create({
      userId: req.user.sub,
      ...parsed.body,
      status: 'APPROVED',
      pointsAwarded: pts
    });

    // Update user points and total earned
    user.points = (user.points || 0) + pts;
    user.totalPointsEarned = (user.totalPointsEarned || 0) + pts;

    // Update level if applicable
    const levelUpdate = user.updateLevel();

    // Save submission, user and ledger entry
    await Promise.all([
      sub.save(),
      user.save(),
      PointLedger.create({ userId: user._id, type: 'EARN', amount: pts, ref: sub._id.toString(), note: `Waste ${parsed.body.type} ${parsed.body.weightKg}kg` })
    ]);

    const response = { id: sub._id.toString(), status: sub.status, pointsAwarded: pts };
    if (levelUpdate?.leveledUp) {
      response.leveledUp = true;
      response.newLevel = levelUpdate.newLevel;
    }

    res.status(201).json(response);
  } catch (e) { next(e); }
}

const reviewSchema = z.object({
  body: z.object({
    decision: z.enum(['APPROVE','REJECT']),
    points: z.number().int().min(0).max(10000).optional()
  }),
  params: z.object({ id: z.string() })
});

export async function reviewWaste(req, res, next) {
  try {
    const { body, params } = reviewSchema.parse({ body: req.body, params: req.params });
    const sub = await WasteSubmission.findById(params.id);
    if (!sub) throw new ApiError(404, 'Not found');
    if (sub.status !== 'PENDING') throw new ApiError(400, 'Already reviewed');
    if (body.decision === 'REJECT') {
      sub.status = 'REJECTED';
      await sub.save();
      return res.json({ ok: true, status: sub.status });
    }
    const user = await User.findById(sub.userId);
    const pts = body.points ?? Math.round(sub.weightKg * 10);
    sub.status = 'APPROVED';
    sub.pointsAwarded = pts;
    user.points += pts;
    user.totalPointsEarned += pts; // Track total points earned for level calculation
    
    // Update user level after points change
    const levelUpdate = user.updateLevel();
    
    await Promise.all([sub.save(), user.save(), PointLedger.create({ userId: user._id, type: 'EARN', amount: pts, ref: sub._id.toString(), note: `Waste ${sub.type} ${sub.weightKg}kg` })]);
    
    // Include level info in response if user leveled up
    const response = { ok: true, status: sub.status, pointsAwarded: pts };
    if (levelUpdate.leveledUp) {
      response.leveledUp = true;
      response.newLevel = levelUpdate.newLevel;
    }
    res.json(response);
  } catch (e) { next(e); }
}
