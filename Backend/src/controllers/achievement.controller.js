import mongoose from 'mongoose'
import { Achievement } from '../models/Achievement.js'
import { User } from '../models/User.js'
import { WasteSubmission } from '../models/WasteSubmission.js'

// Predefined achievements list
const PREDEFINED_ACHIEVEMENTS = [
  // First-time and milestone achievements
  {
    id: 'first-pickup',
    title: 'First Step Hero',
    description: 'Schedule your 1st pickup - welcome to the eco-squad!',
    category: 'milestone',
    pointsReward: 100,
    requirement: { type: 'pickup', target: 1, unit: 'pickup' },
    rarity: 'common'
  },
  {
    id: 'level-5',
    title: 'Rising Star',
    description: 'Reach level 5 - you are leveling up fast!',
    category: 'milestone',
    pointsReward: 250,
    requirement: { type: 'level', target: 5, unit: 'level' },
    rarity: 'common'
  },
  {
    id: 'level-10',
    title: 'Eco Champion',
    description: 'Reach level 10 - you are becoming a legend!',
    category: 'milestone',
    pointsReward: 500,
    requirement: { type: 'level', target: 10, unit: 'level' },
    rarity: 'rare'
  },
  {
    id: 'level-25',
    title: 'Planet Guardian',
    description: 'Reach level 25 - you are a true eco-warrior!',
    category: 'milestone',
    pointsReward: 1000,
    requirement: { type: 'level', target: 25, unit: 'level' },
    rarity: 'epic'
  },

  // Weight-based achievements
  {
    id: 'first-recycle',
    title: 'Green Newbie',
    description: 'Drop your first 1kg of waste - welcome to the squad!',
    category: 'recycling',
    pointsReward: 100,
    requirement: { type: 'weight', target: 1, unit: 'kg' },
    rarity: 'common'
  },
  {
    id: 'weight-5kg',
    title: 'Eco Rookie',
    description: 'Recycle 5kg - you are getting the hang of this!',
    category: 'recycling',
    pointsReward: 250,
    requirement: { type: 'weight', target: 5, unit: 'kg' },
    rarity: 'common'
  },
  {
    id: 'weight-25kg',
    title: 'Waste Destroyer',
    description: 'Crush 25kg of waste - you are on fire!',
    category: 'recycling',
    pointsReward: 500,
    requirement: { type: 'weight', target: 25, unit: 'kg' },
    rarity: 'rare'
  },
  {
    id: 'weight-100kg',
    title: 'Eco Legend',
    description: '100kg recycled - you are basically a superhero now!',
    category: 'recycling',
    pointsReward: 1000,
    requirement: { type: 'weight', target: 100, unit: 'kg' },
    rarity: 'epic'
  },
  {
    id: 'weight-500kg',
    title: 'Planet Savior',
    description: '500kg?! You are the GOAT of recycling!',
    category: 'recycling',
    pointsReward: 2500,
    requirement: { type: 'weight', target: 500, unit: 'kg' },
    rarity: 'legendary'
  },

  // Count-based achievements
  {
    id: 'pickup-5',
    title: 'Consistency Starter',
    description: 'Complete 5 pickups - building that habit!',
    category: 'recycling',
    pointsReward: 200,
    requirement: { type: 'count', target: 5, unit: 'pickups' },
    rarity: 'common'
  },
  {
    id: 'pickup-15',
    title: 'Pickup Pro',
    description: 'Complete 15 pickups - you are getting addicted!',
    category: 'recycling',
    pointsReward: 400,
    requirement: { type: 'count', target: 15, unit: 'pickups' },
    rarity: 'rare'
  },
  {
    id: 'pickup-50',
    title: 'Recycling Machine',
    description: '50 pickups - you are absolutely unstoppable!',
    category: 'recycling',
    pointsReward: 800,
    requirement: { type: 'count', target: 50, unit: 'pickups' },
    rarity: 'epic'
  },

  // Variety achievements
  {
    id: 'variety-3',
    title: 'Waste Artist',
    description: 'Recycle 3 different waste types - getting creative!',
    category: 'variety',
    pointsReward: 200,
    requirement: { type: 'variety', target: 3, unit: 'types' },
    rarity: 'common'
  },
  {
    id: 'variety-5',
    title: 'Collection Master',
    description: 'Recycle 5 waste types - you love variety!',
    category: 'variety',
    pointsReward: 400,
    requirement: { type: 'variety', target: 5, unit: 'types' },
    rarity: 'rare'
  },

  // Environmental impact achievements
  {
    id: 'co2-10',
    title: 'Carbon Crusher',
    description: 'Save 10kg CO₂ - literally saving the planet!',
    category: 'environmental',
    pointsReward: 400,
    requirement: { type: 'co2', target: 10, unit: 'kg' },
    rarity: 'common'
  },
  {
    id: 'co2-50',
    title: 'Climate Hero',
    description: 'Save 50kg CO₂ - climate change warrior!',
    category: 'environmental',
    pointsReward: 800,
    requirement: { type: 'co2', target: 50, unit: 'kg' },
    rarity: 'rare'
  },
  {
    id: 'trees-5',
    title: 'Tree Hugger Pro',
    description: 'Save 5 trees equivalent - nature thanks you!',
    category: 'environmental',
    pointsReward: 600,
    requirement: { type: 'trees', target: 5, unit: 'trees' },
    rarity: 'rare'
  },
  {
    id: 'water-100',
    title: 'Aqua Guardian',
    description: 'Conserve 100L water - every drop counts!',
    category: 'environmental',
    pointsReward: 500,
    requirement: { type: 'water', target: 100, unit: 'L' },
    rarity: 'rare'
  },

  // Streak achievements
  {
    id: 'streak-7',
    title: 'Week Warrior',
    description: 'Recycle for 7 days straight - dedication 100!',
    category: 'streak',
    pointsReward: 800,
    requirement: { type: 'streak', target: 7, unit: 'days' },
    rarity: 'rare'
  },
  {
    id: 'streak-30',
    title: 'Monthly Master',
    description: '30-day streak - absolutely unstoppable!',
    category: 'streak',
    pointsReward: 2000,
    requirement: { type: 'streak', target: 30, unit: 'days' },
    rarity: 'legendary'
  }
]

// Environmental impact calculation helper
function calculateEnvironmentalImpact(submissions) {
  const totalWeight = submissions.reduce((sum, sub) => sum + (sub.weightKg || 0), 0)
  
  // Simplified environmental impact calculations
  const co2Saved = totalWeight * 2.5  // kg CO2 per kg waste
  const treesSaved = totalWeight * 0.05 // trees saved per kg
  const waterConserved = totalWeight * 15 // liters per kg
  const energySaved = totalWeight * 8 // kWh per kg
  
  return {
    co2Saved: Math.round(co2Saved * 100) / 100,
    treesSaved: Math.round(treesSaved * 100) / 100,
    waterConserved: Math.round(waterConserved * 100) / 100,
    energySaved: Math.round(energySaved * 100) / 100
  }
}

// Calculate achievement progress
async function calculateAchievementProgress(userId, achievement) {
  const user = await User.findById(userId)
  if (!user) return 0

  const submissions = await WasteSubmission.find({ 
    userId, 
    status: { $in: ['approved', 'completed'] } 
  })

  let current = 0
  
  switch (achievement.requirement.type) {
    case 'weight':
      current = submissions.reduce((sum, sub) => sum + (sub.weightKg || 0), 0)
      break
    case 'count':
    case 'pickup':
      current = submissions.length
      break
    case 'variety':
      const uniqueTypes = new Set(submissions.map(sub => sub.type))
      current = uniqueTypes.size
      break
    case 'level':
      current = user.level || 1
      break
    case 'co2':
    case 'trees':
    case 'water':
    case 'energy':
      const impact = calculateEnvironmentalImpact(submissions)
      current = impact[achievement.requirement.type === 'co2' ? 'co2Saved' : 
                      achievement.requirement.type === 'trees' ? 'treesSaved' :
                      achievement.requirement.type === 'water' ? 'waterConserved' : 'energySaved']
      break
    case 'streak':
      // Calculate current streak (simplified)
      current = await calculateCurrentStreak(userId)
      break
  }
  
  const progress = Math.min((current / achievement.requirement.target) * 100, 100)
  return Math.round(progress)
}

async function calculateCurrentStreak(userId) {
  const submissions = await WasteSubmission.find({ 
    userId, 
    status: { $in: ['approved', 'completed'] } 
  }).sort({ createdAt: -1 })
  
  if (submissions.length === 0) return 0
  
  let streak = 1
  let currentDate = new Date(submissions[0].createdAt)
  
  for (let i = 1; i < submissions.length; i++) {
    const prevDate = new Date(submissions[i].createdAt)
    const dayDiff = Math.floor((currentDate - prevDate) / (1000 * 60 * 60 * 24))
    
    if (dayDiff === 1) {
      streak++
      currentDate = prevDate
    } else if (dayDiff > 1) {
      break
    }
  }
  
  return streak
}

// Initialize achievements for a user
export async function initializeUserAchievements(req, res, next) {
  try {
    const userId = req.user.sub
    
    // Check if user already has achievements initialized
    const existingCount = await Achievement.countDocuments({ userId })
    if (existingCount > 0) {
      return res.json({ message: 'Achievements already initialized' })
    }
    
    // Create achievement records for user
    const userAchievements = await Promise.all(
      PREDEFINED_ACHIEVEMENTS.map(async (ach) => {
        const progress = await calculateAchievementProgress(userId, ach)
        const unlocked = progress >= 100
        
        return Achievement.create({
          userId,
          achievementId: ach.id,
          title: ach.title,
          description: ach.description,
          category: ach.category,
          pointsReward: ach.pointsReward,
          requirement: ach.requirement,
          rarity: ach.rarity,
          progress,
          unlocked,
          unlockedAt: unlocked ? new Date() : undefined
        })
      })
    )
    
    res.json({ 
      message: 'Achievements initialized successfully',
      count: userAchievements.length 
    })
  } catch (error) {
    next(error)
  }
}

// Get user achievements
export async function getUserAchievements(req, res, next) {
  try {
    const userId = req.user.sub
    
    // Get or initialize achievements
    let achievements = await Achievement.find({ userId }).sort({ createdAt: 1 })
    
    if (achievements.length === 0) {
      // Initialize achievements first
      achievements = await Promise.all(
        PREDEFINED_ACHIEVEMENTS.map(async (ach) => {
          const progress = await calculateAchievementProgress(userId, ach)
          const unlocked = progress >= 100
          
          return Achievement.create({
            userId,
            achievementId: ach.id,
            title: ach.title,
            description: ach.description,
            category: ach.category,
            pointsReward: ach.pointsReward,
            requirement: ach.requirement,
            rarity: ach.rarity,
            progress,
            unlocked,
            unlockedAt: unlocked ? new Date() : undefined
          })
        })
      )
    } else {
      // Update progress for existing achievements
      achievements = await Promise.all(
        achievements.map(async (achievement) => {
          if (!achievement.claimed) {
            const newProgress = await calculateAchievementProgress(userId, achievement)
            const wasUnlocked = achievement.unlocked
            const isNowUnlocked = newProgress >= 100
            
            achievement.progress = newProgress
            if (!wasUnlocked && isNowUnlocked) {
              achievement.unlocked = true
              achievement.unlockedAt = new Date()
            }
            
            await achievement.save()
          }
          return achievement
        })
      )
    }
    
    res.json({ achievements })
  } catch (error) {
    next(error)
  }
}

// Claim achievement reward
export async function claimAchievement(req, res, next) {
  try {
    const userId = req.user.sub
    const { achievementId } = req.params
    
    const achievement = await Achievement.findOne({ 
      userId, 
      achievementId,
      unlocked: true,
      claimed: false 
    })
    
    if (!achievement) {
      return res.status(404).json({ 
        error: true, 
        message: 'Achievement not found or already claimed' 
      })
    }
    
    // Mark as claimed
    achievement.claimed = true
    achievement.claimedAt = new Date()
    await achievement.save()
    
    // Award points to user
    const user = await User.findById(userId)
    if (user) {
      user.points = (user.points || 0) + achievement.pointsReward
      user.totalPointsEarned = (user.totalPointsEarned || 0) + achievement.pointsReward
      
      // Update level based on total points
      const levelInfo = user.updateLevel()
      await user.save()
      
      res.json({ 
        achievement,
        pointsAwarded: achievement.pointsReward,
        newBalance: user.points,
        levelInfo
      })
    } else {
      res.status(404).json({ error: true, message: 'User not found' })
    }
  } catch (error) {
    next(error)
  }
}

// Get achievement stats
export async function getAchievementStats(req, res, next) {
  try {
    const userId = req.user.sub
    
    const stats = await Achievement.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          unlocked: { $sum: { $cond: ['$unlocked', 1, 0] } },
          claimed: { $sum: { $cond: ['$claimed', 1, 0] } },
          totalPointsAvailable: { $sum: '$pointsReward' },
          pointsClaimed: { 
            $sum: { 
              $cond: ['$claimed', '$pointsReward', 0] 
            } 
          }
        }
      }
    ])
    
    const result = stats[0] || {
      total: 0,
      unlocked: 0,
      claimed: 0,
      totalPointsAvailable: 0,
      pointsClaimed: 0
    }
    
    res.json(result)
  } catch (error) {
    next(error)
  }
}