import mongoose from 'mongoose'

const AchievementSchema = new mongoose.Schema(
  {
    userId: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'User', 
      required: true, 
      index: true 
    },
    achievementId: { 
      type: String, 
      required: true 
    },
    title: { 
      type: String, 
      required: true 
    },
    description: { 
      type: String, 
      required: true 
    },
    category: {
      type: String,
      enum: ['recycling', 'environmental', 'milestone', 'streak', 'variety'],
      required: true
    },
    pointsReward: { 
      type: Number, 
      required: true, 
      default: 100 
    },
    requirement: {
      type: {
        type: String,
        enum: ['weight', 'count', 'streak', 'variety', 'co2', 'trees', 'water', 'energy', 'pickup', 'level'],
        required: true
      },
      target: {
        type: Number,
        required: true
      },
      unit: {
        type: String
      }
    },
    rarity: {
      type: String,
      enum: ['common', 'rare', 'epic', 'legendary'],
      default: 'common'
    },
    unlocked: { 
      type: Boolean, 
      default: false 
    },
    claimed: { 
      type: Boolean, 
      default: false 
    },
    progress: { 
      type: Number, 
      default: 0, 
      min: 0, 
      max: 100 
    },
    unlockedAt: { 
      type: Date 
    },
    claimedAt: { 
      type: Date 
    }
  },
  { timestamps: true }
)

// Compound index to ensure one achievement per user per achievement type
AchievementSchema.index({ userId: 1, achievementId: 1 }, { unique: true })

export const Achievement = mongoose.model('Achievement', AchievementSchema)