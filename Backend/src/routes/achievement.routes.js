import { Router } from 'express'
import { requireAuth } from '../middleware/auth.js'
import { 
  getUserAchievements, 
  claimAchievement, 
  getAchievementStats,
  initializeUserAchievements 
} from '../controllers/achievement.controller.js'

export const router = Router()

// Get user's achievements
router.get('/', requireAuth, getUserAchievements)

// Initialize achievements for user (optional, will auto-initialize)
router.post('/initialize', requireAuth, initializeUserAchievements)

// Claim achievement reward
router.post('/:achievementId/claim', requireAuth, claimAchievement)

// Get achievement statistics
router.get('/stats', requireAuth, getAchievementStats)