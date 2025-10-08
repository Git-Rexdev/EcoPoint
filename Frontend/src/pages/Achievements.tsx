import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Trophy, 
  Star, 
  Recycle, 
  Leaf, 
  Zap, 
  Target, 
  Award, 
  CheckCircle, 
  Lock, 
  Loader2,
  Sparkles,
  Calendar,
  Weight,
  Flame,
  Droplets,
  TreePine,
  Wind,
  Cloud,
  Clock,
  Share2
} from 'lucide-react';
import { pointsAPI, wasteAPI, achievementsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { User, Achievement as AchievementType, RecyclingRecord } from '@/types';
import { calculateEnvironmentalImpact } from '@/lib/impactUtils';

interface AchievementDisplay extends AchievementType {
  icon: React.ComponentType<any>;
}

export default function Achievements() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<AchievementDisplay[]>([]);
  const [loading, setLoading] = useState(true);
  const [claiming, setClaiming] = useState<string | null>(null);

  // Icon mapping for achievements
  const getAchievementIcon = (achievementId: string): React.ComponentType<any> => {
    const iconMap: Record<string, React.ComponentType<any>> = {
      'first-pickup': Calendar,
      'level-5': Star,
      'level-10': Award,
      'level-25': Trophy,
      'first-recycle': Recycle,
      'weight-5kg': Weight,
      'weight-25kg': Target,
      'weight-100kg': Award,
      'weight-500kg': Trophy,
      'pickup-5': Calendar,
      'pickup-15': Star,
      'pickup-50': Award,
      'variety-3': Leaf,
      'variety-5': Zap,
      'co2-10': Cloud,
      'co2-50': Cloud,
      'trees-5': TreePine,
      'water-100': Droplets,
      'streak-7': Flame,
      'streak-30': Trophy,
    };
    return iconMap[achievementId] || Award;
  };

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pointsRes, achievementsRes] = await Promise.all([
        pointsAPI.getBalance(),
        achievementsAPI.getUserAchievements(),
      ]);

      const userPoints = pointsRes.data.balance || 0;
      const userLevel = pointsRes.data.level || 1;
      
      setUser({ 
        points: userPoints, 
        level: userLevel,
        ...pointsRes.data 
      });

      // Convert backend achievements to display format
      const backendAchievements = achievementsRes.data.achievements || [];
      const displayAchievements: AchievementDisplay[] = backendAchievements.map((ach: AchievementType) => ({
        ...ach,
        icon: getAchievementIcon(ach.achievementId)
      }));
      
      setAchievements(displayAchievements);
    } catch (error: any) {
      console.error('Failed to load achievements data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };



  const handleClaimAchievement = async (achievementId: string) => {
    try {
      setClaiming(achievementId);
      
      const response = await achievementsAPI.claimAchievement(achievementId);
      
      setAchievements(prev => prev.map(achievement => 
        achievement.achievementId === achievementId 
          ? { ...achievement, claimed: true, claimedAt: new Date().toISOString() }
          : achievement
      ));
      
      const achievement = achievements.find(a => a.achievementId === achievementId);
      if (achievement) {
        toast({
          title: 'EPIC ACHIEVEMENT UNLOCKED! 🎉',
          description: `You earned ${achievement.pointsReward} points for "${achievement.title}" - You're absolutely crushing it!`,
          duration: 5000,
        });
        
        // Update user points
        if (user) {
          setUser(prev => prev ? {
            ...prev,
            points: (prev.points || 0) + achievement.pointsReward
          } : null);
        }
      }
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to claim achievement',
        variant: 'destructive',
      });
    } finally {
      setClaiming(null);
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
      case 'rare': return 'text-blue-700 bg-gradient-to-r from-blue-100 to-blue-200 border-blue-300';
      case 'epic': return 'text-purple-700 bg-gradient-to-r from-purple-100 to-purple-200 border-purple-300';
      case 'legendary': return 'text-yellow-700 bg-gradient-to-r from-yellow-100 to-yellow-200 border-yellow-300 animate-pulse';
      default: return 'text-gray-700 bg-gradient-to-r from-gray-100 to-gray-200 border-gray-300';
    }
  };

  const getRarityGlow = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'shadow-sm';
      case 'rare': return 'shadow-md shadow-blue-200';
      case 'epic': return 'shadow-lg shadow-purple-200';
      case 'legendary': return 'shadow-xl shadow-yellow-200 animate-pulse';
      default: return 'shadow-sm';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'recycling': return <Recycle className="w-4 h-4" />;
      case 'environmental': return <Leaf className="w-4 h-4" />;
      case 'milestone': return <Trophy className="w-4 h-4" />;
      case 'streak': return <Zap className="w-4 h-4" />;
      case 'variety': return <Star className="w-4 h-4" />;
      default: return <Award className="w-4 h-4" />;
    }
  };

  const groupedAchievements = achievements.reduce((acc, achievement) => {
    if (!acc[achievement.category]) {
      acc[achievement.category] = [];
    }
    acc[achievement.category].push(achievement);
    return acc;
  }, {} as Record<string, AchievementDisplay[]>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  const totalAchievements = achievements.length;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const claimedAchievements = achievements.filter(a => a.claimed).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-foreground mb-3 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          Achievement Hub
        </h1>
        <p className="text-lg text-muted-foreground mb-2">
          Level up your recycling game and unlock epic rewards!
        </p>
        <p className="text-sm text-muted-foreground">
          Complete challenges, earn points, and become the ultimate eco-warrior!
        </p>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 mb-1 font-medium">Total Achievements</p>
              <h2 className="text-4xl font-bold">{totalAchievements}</h2>
              <p className="text-white/80 text-sm">Ready to unlock!</p>
            </div>
            <Trophy size={56} className="text-white/30" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-500 to-emerald-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 mb-1 font-medium">Unlocked</p>
              <h2 className="text-4xl font-bold">{unlockedAchievements}</h2>
              <p className="text-white/80 text-sm">You're crushing it!</p>
            </div>
            <CheckCircle size={56} className="text-white/30" />
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-yellow-500 to-orange-600 text-white transform hover:scale-105 transition-all duration-300 shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/90 mb-1 font-medium">Claimed</p>
              <h2 className="text-4xl font-bold">{claimedAchievements}</h2>
              <p className="text-white/80 text-sm">Rewards earned!</p>
            </div>
            <Sparkles size={56} className="text-white/30" />
          </div>
        </Card>
      </div>

      {/* Special Effects Background */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '2s'}}></div>
        <div className="absolute bottom-1/4 left-1/3 w-64 h-64 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse" style={{animationDelay: '4s'}}></div>
      </div>

      {/* Achievements by Category */}
      <div className="space-y-8 relative z-10">
        {Object.entries(groupedAchievements).map(([category, categoryAchievements]) => (
          <div key={category}>
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-full bg-gradient-to-r from-blue-100 to-purple-100">
                {getCategoryIcon(category)}
              </div>
              <div>
                <h2 className="text-2xl font-bold text-foreground capitalize">
                  {category} Achievements
                </h2>
                <p className="text-sm text-muted-foreground">
                  {category === 'recycling' && 'Crush waste and level up!'}
                  {category === 'environmental' && 'Save the planet, one action at a time!'}
                  {category === 'milestone' && 'Hit those big goals and celebrate!'}
                  {category === 'streak' && 'Keep the momentum going strong!'}
                  {category === 'variety' && 'Mix it up and collect them all!'}
                </p>
              </div>
              <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold text-sm px-3 py-1">
                {categoryAchievements.filter(a => a.unlocked).length}/{categoryAchievements.length}
              </Badge>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoryAchievements.map((achievement) => {
                const Icon = achievement.icon;
                const isClaiming = claiming === achievement.achievementId;
                
                return (
                  <Card
                    key={achievement.achievementId}
                    className={`p-6 transition-all duration-300 transform hover:scale-105 ${
                      achievement.unlocked 
                        ? achievement.claimed 
                          ? 'bg-gradient-to-br from-green-50 to-emerald-100 border-green-300 shadow-lg' 
                          : `bg-gradient-to-br from-blue-50 to-cyan-100 border-blue-300 hover:shadow-xl ${getRarityGlow(achievement.rarity)}`
                        : 'opacity-60 bg-gradient-to-br from-gray-50 to-gray-100 border-gray-200'
                    }`}
                  >
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-all duration-300 ${
                          achievement.unlocked 
                            ? achievement.claimed
                              ? 'bg-gradient-to-br from-green-400 to-emerald-500 text-white shadow-lg animate-pulse'
                              : `bg-gradient-to-br from-blue-400 to-cyan-500 text-white shadow-lg ${getRarityGlow(achievement.rarity)}`
                            : 'bg-gradient-to-br from-gray-300 to-gray-400 text-gray-600'
                        }`}>
                          {achievement.unlocked ? (
                            <Icon size={28} className="drop-shadow-sm" />
                          ) : (
                            <Lock size={28} className="drop-shadow-sm" />
                          )}
                        </div>
                        <div className="flex flex-col items-end gap-1">
                          <Badge className={getRarityColor(achievement.rarity)}>
                            {achievement.rarity}
                          </Badge>
                          <div className="text-right">
                            <p className="text-sm font-bold text-primary flex items-center gap-1">
                              <Sparkles size={14} className="text-yellow-500" />
                              +{achievement.pointsReward} pts
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      <div>
                        <h3 className="font-bold text-foreground mb-2 text-lg">
                          {achievement.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
                          {achievement.description}
                        </p>
                        
                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground font-medium">Progress</span>
                            <span className="font-bold text-foreground text-lg">
                              {achievement.progress}%
                            </span>
                          </div>
                          <div className="relative">
                            <Progress 
                              value={achievement.progress} 
                              className="h-3 bg-gray-200" 
                            />
                            <div 
                              className={`absolute top-0 left-0 h-3 rounded-full transition-all duration-500 ${
                                achievement.progress === 100 
                                  ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                                  : 'bg-gradient-to-r from-blue-400 to-cyan-500'
                              }`}
                              style={{ width: `${achievement.progress}%` }}
                            />
                          </div>
                          <p className="text-xs text-muted-foreground font-medium">
                            {achievement.requirement.target} {achievement.requirement.unit}
                          </p>
                        </div>
                      </div>
                      
                      <Button
                        className={`w-full font-bold text-sm transition-all duration-300 ${
                          achievement.unlocked && !achievement.claimed 
                            ? 'bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white shadow-lg hover:shadow-xl transform hover:scale-105' 
                            : achievement.claimed
                            ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white'
                            : 'bg-gray-300 text-gray-500'
                        }`}
                        disabled={!achievement.unlocked || achievement.claimed || isClaiming}
                        onClick={() => handleClaimAchievement(achievement.achievementId)}
                      >
                        {isClaiming ? (
                          <>
                            <Loader2 size={16} className="mr-2 animate-spin" />
                            Claiming...
                          </>
                        ) : achievement.claimed ? (
                          <>
                            <CheckCircle size={16} className="mr-2" />
                            Claimed!
                          </>
                        ) : achievement.unlocked ? (
                          <>
                            <Sparkles size={16} className="mr-2" />
                            Claim Reward!
                          </>
                        ) : (
                          <>
                            <Lock size={16} className="mr-2" />
                            Locked
                          </>
                        )}
                      </Button>
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
