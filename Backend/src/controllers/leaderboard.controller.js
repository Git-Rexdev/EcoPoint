
import { User } from '../models/User.js'

const baseProjection = 'name totalPointsEarned level'

function mapTop(list) {
  return list.map((u, i) => ({
    rank: i + 1,
    userId: u._id,
    name: u.name ?? 'Anonymous',
    points: u.totalPointsEarned ?? 0,
    level: u.level ?? 1,
  }))
}

export async function getGlobalLeaderboard(req, res, next) {
  try {
    const viewer = await User.findById(req.user.sub).select(baseProjection)
    if (!viewer) return res.status(404).json({ error: true, message: 'User not found' })

    const top = await User.find({}, baseProjection)
      .sort({ totalPointsEarned: -1, _id: 1 })
      .limit(10)

    const higherCount = await User.countDocuments({
      $or: [
        { totalPointsEarned: { $gt: viewer.totalPointsEarned || 0 } },
        { totalPointsEarned: viewer.totalPointsEarned || 0, _id: { $lt: viewer._id } },
      ],
    })

    const me = {
      rank: higherCount + 1,
      userId: viewer._id,
      name: viewer.name ?? 'You',
      points: viewer.totalPointsEarned ?? 0,
      level: viewer.level ?? 1,
      inTop10: top.some((u) => String(u._id) === String(viewer._id)),
    }

    res.json({
      leaderboard: mapTop(top),
      me,
    })
  } catch (e) {
    next(e)
  }
}

export async function getMyRank(req, res, next) {
  try {
    const viewer = await User.findById(req.user.sub).select(baseProjection)
    if (!viewer) return res.status(404).json({ error: true, message: 'User not found' })

    const higherCount = await User.countDocuments({
      $or: [
        { totalPointsEarned: { $gt: viewer.totalPointsEarned || 0 } },
        { totalPointsEarned: viewer.totalPointsEarned || 0, _id: { $lt: viewer._id } },
      ],
    })

    res.json({
      rank: higherCount + 1,
      userId: viewer._id,
      name: viewer.name ?? 'You',
      points: viewer.totalPointsEarned ?? 0,
      level: viewer.level ?? 1,
    })
  } catch (e) {
    next(e)
  }
}
