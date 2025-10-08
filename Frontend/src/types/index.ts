export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  points: number;
  level: number;
  totalRecycled: number;
  role: 'USER' | 'BUSINESS' | 'ADMIN';
}

export interface RecyclingCenter {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  acceptedMaterials: string[];
  rating: number;
  distance?: number;
  hours: string;
  phone?: string;
}

export interface RecyclingRecord {
  id: string;
  userId: string;
  type: 'plastic' | 'paper' | 'glass' | 'metal' | 'electronics' | 'organic';
  weight: number;
  points: number;
  date: string;
  centerId?: string;
  status: 'completed' | 'pending' | 'scheduled';
}

export interface Pickup {
  id: string;
  userId: string;
  scheduledDate: string;
  address: string;
  wasteTypes: string[];
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  notes?: string;
}

export interface Achievement {
  _id: string;
  achievementId: string;
  title: string;
  description: string;
  category: 'recycling' | 'environmental' | 'milestone' | 'streak' | 'variety';
  pointsReward: number;
  requirement: {
    type: 'weight' | 'count' | 'streak' | 'variety' | 'co2' | 'trees' | 'water' | 'energy' | 'pickup' | 'level';
    target: number;
    unit?: string;
  };
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  unlocked: boolean;
  claimed: boolean;
  progress: number;
  unlockedAt?: string;
  claimedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface RecyclingGuide {
  id: string;
  category: string;
  title: string;
  description: string;
  recyclable: boolean;
  tips: string[];
  icon: string;
}

export interface LeaderboardEntry {
  rank: number;
  userId: string;
  name: string;
  points: number;
  level: number;
}

export interface LeaderboardData {
  leaderboard: LeaderboardEntry[];
  me: LeaderboardEntry & {
    inTop10: boolean;
  };
}
