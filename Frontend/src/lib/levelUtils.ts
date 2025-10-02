// Level system utilities
// Every 200 points = 1 level

export const POINTS_PER_LEVEL = 200;

export interface LevelInfo {
  level: number;
  currentLevelPoints: number;
  pointsToNextLevel: number;
  levelProgress: number;
  totalPointsForCurrentLevel: number;
  totalPointsForNextLevel: number;
}

export function calculateLevel(totalPoints: number): LevelInfo {
  // Level starts from 1, so level = floor(points / 200) + 1
  const level = Math.floor(totalPoints / POINTS_PER_LEVEL) + 1;
  
  // Points at the start of current level
  const totalPointsForCurrentLevel = (level - 1) * POINTS_PER_LEVEL;
  
  // Points needed for next level
  const totalPointsForNextLevel = level * POINTS_PER_LEVEL;
  
  // Points earned in current level (0-199)
  const currentLevelPoints = totalPoints - totalPointsForCurrentLevel;
  
  // Points needed to reach next level
  const pointsToNextLevel = totalPointsForNextLevel - totalPoints;
  
  // Progress percentage in current level (0-100)
  const levelProgress = (currentLevelPoints / POINTS_PER_LEVEL) * 100;
  
  return {
    level,
    currentLevelPoints,
    pointsToNextLevel,
    levelProgress,
    totalPointsForCurrentLevel,
    totalPointsForNextLevel
  };
}

export function getLevelTitle(level: number): string {
  if (level >= 50) return 'Eco Champion';
  if (level >= 40) return 'Environmental Guardian';
  if (level >= 30) return 'Green Master';
  if (level >= 25) return 'Sustainability Expert';
  if (level >= 20) return 'Eco Warrior';
  if (level >= 15) return 'Green Enthusiast';
  if (level >= 10) return 'Environmental Advocate';
  if (level >= 8) return 'Recycling Pro';
  if (level >= 5) return 'Green Contributor';
  if (level >= 3) return 'Eco Explorer';
  if (level >= 2) return 'Green Starter';
  return 'Eco Beginner';
}

export function getLevelIcon(level: number): string {
  if (level >= 50) return '🏆';
  if (level >= 40) return '👑';
  if (level >= 30) return '⭐';
  if (level >= 25) return '🎖️';
  if (level >= 20) return '🥇';
  if (level >= 15) return '🥈';
  if (level >= 10) return '🥉';
  if (level >= 8) return '🎯';
  if (level >= 5) return '📈';
  if (level >= 3) return '🌟';
  if (level >= 2) return '🌱';
  return '🌿';
}

export function getLevelBadgeColor(level: number): string {
  if (level >= 50) return 'from-purple-500 to-pink-500';
  if (level >= 40) return 'from-yellow-400 to-orange-500';
  if (level >= 30) return 'from-blue-500 to-purple-600';
  if (level >= 25) return 'from-green-500 to-blue-500';
  if (level >= 20) return 'from-red-500 to-pink-500';
  if (level >= 15) return 'from-indigo-500 to-purple-500';
  if (level >= 10) return 'from-green-400 to-blue-500';
  if (level >= 8) return 'from-teal-400 to-green-500';
  if (level >= 5) return 'from-blue-400 to-teal-500';
  if (level >= 3) return 'from-green-400 to-teal-400';
  if (level >= 2) return 'from-emerald-400 to-green-500';
  return 'from-green-300 to-emerald-400';
}