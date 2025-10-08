
import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { getGlobalLeaderboard, getMyRank } from '../controllers/leaderboard.controller.js'

export const router = Router()

router.get('/global', requireAuth, getGlobalLeaderboard)
router.get('/me', requireAuth, getMyRank)
