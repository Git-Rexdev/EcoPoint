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
  id: string;
  title: string;
  description: string;
  icon: string;
  pointsRequired: number;
  unlocked: boolean;
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
