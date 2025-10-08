import { useState, useEffect } from 'react';
import { StatsCard } from '@/components/StatsCard';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Recycle, Trophy, TrendingUp, Calendar, MapPin, ArrowRight, Loader2, Star, ExternalLink } from 'lucide-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLeaf, faCrown } from '@fortawesome/free-solid-svg-icons';
import { pointsAPI, wasteAPI, adsAPI, userAPI, leaderboardAPI, achievementsAPI } from '@/lib/api';
import { Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';
import { calculateLevel, getLevelTitle, getLevelBadgeColor } from '@/lib/levelUtils';
import LevelIcon from '@/components/ui/level-icon';
import { calculateEnvironmentalImpact, EnvironmentalImpact } from '@/lib/impactUtils';
import { User, RecyclingRecord } from '@/types';

interface Ad {
  _id: string;
  title: string;
  description?: string;
  mediaUrl?: string;
  activeFrom?: string;
  activeTo?: string;
  isActive: boolean;
  tags?: string[];
  createdAt: string;
}

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [stats, setStats] = useState<any>(null);
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [ads, setAds] = useState<Ad[]>([]);
  const [topUsers, setTopUsers] = useState<any[]>([]);
  const [recentAchievements, setRecentAchievements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [userRes, pointsRes, wasteRes, adsRes, leaderboardRes, achievementsRes] = await Promise.all([
        userAPI.getProfile(),
        pointsAPI.getBalance(),
        wasteAPI.getMyPickups(),
        adsAPI.getAds(),
        leaderboardAPI.getGlobalLeaderboard(),
        achievementsAPI.getUserAchievements().catch(() => ({ data: { achievements: [] } })),
      ]);
      // Calculate totalRecycled from all user's waste submissions
      const wasteList = Array.isArray(wasteRes.data) ? wasteRes.data : [];
      console.log('Raw waste data from API:', wasteList); // Debug log
      
      const totalRecycled = wasteList.reduce((sum, w) => sum + (w.weightKg || 0), 0);
      const userPoints = pointsRes.data.balance || 0;
      const userLevel = pointsRes.data.level || 1;
      const levelInfo = pointsRes.data.levelInfo || {};
      
      // Convert waste data to recycling records format - keep original DB values
      const recyclingRecords = wasteList.map(w => {
        console.log('Individual waste record:', w); // Debug individual records
        return {
          id: w._id,
          userId: w.userId,
          type: w.type,
          weight: w.weightKg,
          date: w.createdAt,
          status: w.status, // Use exact DB status
          points: w.points, // Use exact DB points (don't default to 0)
        };
      });
      
      setUser({ 
        ...userRes.data, // This includes name, email, etc.
        points: userPoints, 
        level: userLevel,
        totalRecycled 
      });
      setRecords(recyclingRecords);
      
      // Calculate environmental impact from real waste data
      const environmentalImpact = calculateEnvironmentalImpact(recyclingRecords);
      setImpact(environmentalImpact);
      setStats({
        levelProgress: levelInfo.levelProgress || 0,
        pointsToNextLevel: levelInfo.pointsToNextLevel || 0,
        currentLevelPoints: levelInfo.currentLevelPoints || 0,
        pointsThisMonth: 0, // Could be calculated from recent records
        monthlyPoints: 0,
        monthlyRecycled: 0
      }); 
      setAds(adsRes.data.items || []);
      setTopUsers(leaderboardRes.data.leaderboard.slice(0, 3) || []);
      
      // Get recent unlocked but unclaimed achievements
      const achievements = achievementsRes.data.achievements || [];
      const recentUnlocked = achievements
        .filter(ach => ach.unlocked && !ach.claimed)
        .slice(0, 3);
      setRecentAchievements(recentUnlocked);
    } catch (error: any) {
      console.error('Failed to load dashboard data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!user || !stats || !impact) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  const recentRecords = records.slice(0, 3);
  const monthlyRecycled = stats.monthlyRecycled || 0;
  const monthlyPoints = stats.monthlyPoints || 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <span>Welcome back, {user.name}!</span>
          <FontAwesomeIcon icon={faLeaf} className="text-green-500 w-5 h-5" />
        </h1>
        <p className="text-muted-foreground">
          Your recycling journey is making a real impact
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Points"
          value={user.points.toLocaleString()}
          icon={Trophy}
          trend={`+${stats.pointsThisMonth || 0} this month`}
          color="primary"
        />
        <StatsCard
          title="Total Recycled"
          value={`${user.totalRecycled != null ? user.totalRecycled : 0}kg`}
          icon={Recycle}
          trend={`+${monthlyRecycled.toFixed(1)}kg this month`}
          color="accent"
        />
        <StatsCard
          title="Current Level"
          value={<><LevelIcon level={user.level} className="inline mr-1" /> {user.level}</>}
          icon={TrendingUp}
          trend={`${getLevelTitle(user.level)} • ${stats.pointsToNextLevel || 0} pts to next`}
          color="success"
        />
        <StatsCard
          title="This Month"
          value={`${monthlyRecycled.toFixed(1)}kg`}
          icon={Calendar}
          trend={`${monthlyPoints} points earned`}
          color="warning"
        />
      </div>

      {/* Quick Achievements Preview */}
      <Card className="p-6 bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
            <Trophy className="text-yellow-600" size={24} />
            Ready to Claim!
          </h2>
          <Link to="/dashboard/achievements">
            <Button variant="ghost" size="sm">
              View All <ArrowRight size={16} className="ml-2" />
            </Button>
          </Link>
        </div>
        
        {recentAchievements.length > 0 ? (
          <div className="space-y-3">
            {recentAchievements.map((achievement) => (
              <div key={achievement._id} className="flex items-center gap-3 p-3 rounded-lg bg-white/60 border border-yellow-200">
                <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center">
                  <Trophy size={20} className="text-white" />
                </div>
                <div className="flex-1">
                  <h4 className="font-semibold text-foreground text-sm">{achievement.title}</h4>
                  <p className="text-xs text-muted-foreground">{achievement.description}</p>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-yellow-600 font-bold text-sm">
                    <Star size={12} />
                    +{achievement.pointsReward}
                  </div>
                  <p className="text-xs text-muted-foreground">Ready!</p>
                </div>
              </div>
            ))}
            <Link to="/dashboard/achievements">
              <Button size="sm" className="w-full bg-yellow-600 hover:bg-yellow-700">
                <Trophy size={16} className="mr-2" />
                Claim All Rewards
              </Button>
            </Link>
          </div>
        ) : (
          <div className="text-center py-4">
            <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-3">
              <Trophy size={32} className="text-yellow-600" />
            </div>
            <h3 className="text-lg font-medium text-foreground mb-2">Unlock Your Potential!</h3>
            <p className="text-muted-foreground text-sm mb-4">
              Complete recycling activities to earn achievements and rewards
            </p>
            <Link to="/dashboard/achievements">
              <Button size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                <Trophy size={16} className="mr-2" />
                View Achievements
              </Button>
            </Link>
          </div>
        )}
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground">Recent Activity</h2>
            <Link to="/profile">
              <Button variant="ghost" size="sm">
                View All <ArrowRight size={16} className="ml-2" />
              </Button>
            </Link>
          </div>

          <div className="space-y-4">
            {recentRecords.length > 0 ? (
              recentRecords.map((record) => {
                const getIcon = (type: string) => {
                  switch (type.toLowerCase()) {
                    case 'plastic':
                      return <Recycle className="w-6 h-6 text-blue-600" />;
                    case 'paper':
                      return <div className="w-6 h-6 bg-amber-600 rounded flex items-center justify-center text-white text-xs font-bold">P</div>;
                    case 'glass':
                      return <div className="w-6 h-6 bg-green-600 rounded flex items-center justify-center text-white text-xs font-bold">G</div>;
                    case 'metal':
                      return <div className="w-6 h-6 bg-gray-600 rounded flex items-center justify-center text-white text-xs font-bold">M</div>;
                    case 'electronics':
                      return <div className="w-6 h-6 bg-purple-600 rounded flex items-center justify-center text-white text-xs font-bold">E</div>;
                    case 'organic':
                      return <div className="w-6 h-6 bg-emerald-600 rounded flex items-center justify-center text-white text-xs font-bold">O</div>;
                    default:
                      return <Recycle className="w-6 h-6 text-primary" />;
                  }
                };

                // Use actual database values - don't override them
                const displayPoints = record.points || 0;
                
                // Map database status to display format - use actual DB status
                const getStatusDisplay = (status: string) => {
                  switch (status?.toLowerCase()) {
                    case 'approved':
                      return { text: 'APPROVED', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
                    case 'completed':
                      return { text: 'APPROVED', variant: 'default' as const, color: 'bg-green-100 text-green-800' };
                    case 'pending':
                      return { text: 'PENDING', variant: 'secondary' as const, color: 'bg-yellow-100 text-yellow-800' };
                    case 'rejected':
                      return { text: 'REJECTED', variant: 'destructive' as const, color: 'bg-red-100 text-red-800' };
                    case 'scheduled':
                      return { text: 'SCHEDULED', variant: 'secondary' as const, color: 'bg-blue-100 text-blue-800' };
                    default:
                      return { text: status?.toUpperCase() || 'PENDING', variant: 'secondary' as const, color: 'bg-gray-100 text-gray-800' };
                  }
                };

                const statusDisplay = getStatusDisplay(record.status);

                return (
                  <div
                    key={record.id}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center">
                        {getIcon(record.type)}
                      </div>
                      <div>
                        <p className="font-medium text-foreground capitalize">{record.type}</p>
                        <p className="text-sm text-muted-foreground">
                          {record.weight}kg • {new Date(record.date).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <Badge
                        variant={statusDisplay.variant}
                        className={`mb-1 ${statusDisplay.color}`}
                      >
                        {statusDisplay.text}
                      </Badge>
                      {displayPoints > 0 && (
                        <p className="text-sm font-medium text-green-600">+{displayPoints} pts</p>
                      )}
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <Recycle size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Recent Activity</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  Start recycling to see your activity here
                </p>
                <Link to="/pickup">
                  <Button size="sm">
                    Schedule Pickup
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </Card>

        {/* Quick Actions */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">Quick Actions</h2>
          
          <div className="space-y-3">
            <Link to="/centers">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <MapPin size={20} className="mr-3" />
                Find Recycling Center
              </Button>
            </Link>
            
            <Link to="/pickup">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Calendar size={20} className="mr-3" />
                Schedule Pickup
              </Button>
            </Link>
            
            <Link to="/guide">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Recycle size={20} className="mr-3" />
                What Can I Recycle?
              </Button>
            </Link>
            
            <Link to="/dashboard/achievements">
              <Button className="w-full justify-start" variant="outline" size="lg">
                <Trophy size={20} className="mr-3" />
                View Achievements
              </Button>
            </Link>
          </div>

          {/* Environmental Impact */}
          <div className="mt-6 p-4 rounded-lg bg-gradient-to-br from-success/10 to-accent/10 border border-success/20">
            <h3 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              Your Impact 🌍
              <Link to="/profile" className="ml-auto">
                <Button size="sm" variant="ghost" className="text-xs">
                  View Details <ArrowRight size={12} className="ml-1" />
                </Button>
              </Link>
            </h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• Saved <span className="font-medium text-success">{impact.co2Saved}kg CO₂</span></p>
              <p>• Protected <span className="font-medium text-success">{impact.treesSaved} trees</span></p>
              <p>• Conserved <span className="font-medium text-success">{impact.waterConserved}L water</span></p>
              <p>• Saved <span className="font-medium text-success">{impact.energySaved} kWh energy</span></p>
            </div>
            {impact.co2Saved === 0 && (
              <p className="text-xs text-muted-foreground mt-2 italic">
                Start recycling to see your environmental impact!
              </p>
            )}
          </div>
        </Card>
      </div>

      {/* Progress Bar */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getLevelBadgeColor(user.level)} flex items-center justify-center text-white font-bold text-lg`}>
                <LevelIcon level={user.level} />
              </div>
              <div>
                <h3 className="font-semibold text-foreground">Level {user.level}</h3>
                <p className="text-sm text-muted-foreground">{getLevelTitle(user.level)}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-foreground">{stats.currentLevelPoints || 0}/200 pts</p>
              <p className="text-xs text-muted-foreground">This level</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Progress to Level {user.level + 1}</span>
              <span className="font-medium text-foreground">{Math.round(stats.levelProgress || 0)}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 overflow-hidden">
              <div
                className={`h-full bg-gradient-to-r ${getLevelBadgeColor(user.level + 1)} rounded-full transition-all duration-500`}
                style={{ width: `${stats.levelProgress || 0}%` }}
              />
            </div>
            <p className="text-xs text-muted-foreground">
              {stats.pointsToNextLevel || 0} more points to reach {getLevelTitle(user.level + 1)}
            </p>
          </div>
        </div>
      </Card>

      {/* Quick Leaderboard Preview */}
      {topUsers.length > 0 && (
        <Card className="p-6 bg-gradient-to-r from-primary/5 to-accent/5">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Trophy className="text-yellow-500 animate-pulse" size={20} />
              <h2 className="text-lg font-bold text-foreground">Top Eco Warriors</h2>
            </div>
            <Link to="/dashboard/leaderboard">
              <Button size="sm" variant="outline" className="text-xs gap-1">
                <TrendingUp size={12} />
                Full Leaderboard
              </Button>
            </Link>
          </div>
          
          <div className="space-y-3">
            {topUsers.slice(0, 3).map((user, index) => (
              <div key={user.userId} className="flex items-center gap-3 p-3 rounded-lg bg-background/50 hover:bg-background/80 transition-colors">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                  index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-amber-600'
                }`}>
                  {index === 0 ? '👑' : `#${user.rank}`}
                </div>
                <div className="flex-1">
                  <p className="font-medium text-foreground text-sm">{user.name}</p>
                  <p className="text-xs text-muted-foreground">Level {user.level}</p>
                </div>
                <div className="text-right">
                  <p className="font-bold text-primary text-sm">{user.points.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground">pts</p>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-4 pt-3 border-t border-border">
            <div className="text-center">
              <p className="text-xs text-muted-foreground">
                <span className="text-primary font-medium">Compete now!</span> Recycle more to climb the ranks
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* Featured Ads */}
      {ads.length > 0 && (
        <Card className="p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
              <Star className="text-warning" size={24} />
              Featured Eco-Friendly Offers
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {ads.slice(0, 6).map((ad) => (
              <div
                key={ad._id}
                className="rounded-lg border border-border hover:border-primary/50 transition-all duration-200 overflow-hidden bg-card"
              >
                {ad.mediaUrl && (
                  <div className="aspect-video overflow-hidden">
                    <img
                      src={ad.mediaUrl}
                      alt={ad.title}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                )}
                
                <div className="p-4 space-y-3">
                  <div>
                    <h3 className="font-semibold text-foreground mb-1 line-clamp-1">
                      {ad.title}
                    </h3>
                    {ad.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {ad.description}
                      </p>
                    )}
                  </div>

                  {ad.tags && ad.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {ad.tags.slice(0, 3).map((tag, index) => (
                        <Badge key={index} variant="secondary" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                      {ad.tags.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{ad.tags.length - 3} more
                        </Badge>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between pt-2">
                    <span className="text-xs text-muted-foreground">
                      {new Date(ad.createdAt).toLocaleDateString()}
                    </span>
                    <Button size="sm" variant="outline" className="text-xs">
                      Learn More
                      <ExternalLink size={12} className="ml-1" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {ads.length > 6 && (
            <div className="text-center mt-6">
              <Link to="/ads">
                <Button variant="outline">
                  View All Offers
                  <ArrowRight size={16} className="ml-2" />
                </Button>
              </Link>
            </div>
          )}
        </Card>
      )}

      {/* Team Attribution */}
      <div className="flex justify-center mt-8 mb-4">
        <div className="text-center">
          <p className="text-sm text-muted-foreground animate-pulse" 
             style={{ 
               animation: 'breathe 3s ease-in-out infinite',
               textShadow: '0 0 10px rgba(34, 197, 94, 0.3)'
             }}>
            By Team Vigilantes, SGIS
          </p>
        </div>
      </div>

      <style>{`
        @keyframes breathe {
          0%, 100% { 
            opacity: 0.6; 
            transform: scale(1);
          }
          50% { 
            opacity: 1; 
            transform: scale(1.05);
          }
        }
      `}</style>
    </div>
  );
}
