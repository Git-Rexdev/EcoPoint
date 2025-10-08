  import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Trophy, Medal, Award, Crown, Star, TrendingUp, Users, Loader2, Zap, Flame, Target, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import LevelIcon from '@/components/ui/level-icon';
import { leaderboardAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { LeaderboardData } from '@/types';
import { getLevelIcon, getLevelBadgeColor } from '@/lib/levelUtils';
import { Link } from 'react-router-dom';

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  const fetchLeaderboard = async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }
      const response = await leaderboardAPI.getGlobalLeaderboard();
      setLeaderboardData(response.data);
      if (isRefresh) {
        toast({
          title: 'Updated!',
          description: 'Leaderboard has been refreshed',
        });
      }
    } catch (error: any) {
      console.error('Error fetching leaderboard:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load leaderboard',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const getRankIcon = (rank: number) => {
    switch (rank) {
      case 1:
        return <Crown className="w-6 h-6 text-yellow-500" />;
      case 2:
        return <Medal className="w-6 h-6 text-gray-400" />;
      case 3:
        return <Award className="w-6 h-6 text-amber-600" />;
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-sm font-bold text-muted-foreground">#{rank}</span>;
    }
  };

  const getRankBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'from-yellow-400 to-yellow-600';
      case 2:
        return 'from-gray-300 to-gray-500';
      case 3:
        return 'from-amber-400 to-amber-600';
      default:
        return 'from-blue-400 to-blue-600';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const getCompetitiveTitle = (rank: number) => {
    switch (rank) {
      case 1:
        return { title: 'ECO CHAMPION', icon: Crown, color: 'text-yellow-500' };
      case 2:
        return { title: 'GREEN GUARDIAN', icon: Medal, color: 'text-gray-400' };
      case 3:
        return { title: 'EARTH DEFENDER', icon: Award, color: 'text-amber-600' };
      default:
        if (rank <= 10) return { title: 'ECO WARRIOR', icon: Zap, color: 'text-green-500' };
        if (rank <= 50) return { title: 'GREEN HERO', icon: Target, color: 'text-blue-500' };
        return { title: 'ECO ENTHUSIAST', icon: Star, color: 'text-purple-500' };
    }
  };

  // use LevelIcon component for level icons

  const getPointsDifference = (currentPoints: number, nextPoints: number) => {
    const diff = nextPoints - currentPoints;
    return diff;
  };

  const getRankMovement = () => {
    // This would require historical data, for now we'll simulate
    const movements = [ArrowUp, ArrowDown, Minus];
    return movements[Math.floor(Math.random() * movements.length)];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!leaderboardData) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <Trophy className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">Arena Temporarily Unavailable</h2>
          <p className="text-muted-foreground max-w-md">
            The competitive arena is currently being updated. Please try again in a moment.
          </p>
        </div>
        <Button onClick={() => fetchLeaderboard()} className="gap-2">
          <TrendingUp className="w-4 h-4" />
          Try Again
        </Button>
      </div>
    );
  }

  if (!leaderboardData.leaderboard || leaderboardData.leaderboard.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
        <div className="text-center space-y-2">
          <Users className="w-16 h-16 text-muted-foreground mx-auto opacity-50" />
          <h2 className="text-xl font-semibold text-foreground">Be the First Champion!</h2>
          <p className="text-muted-foreground max-w-md">
            The arena awaits its first warriors. Start recycling to claim your place on the leaderboard!
          </p>
        </div>
        <Link to="/dashboard/pickup">
          <Button className="gap-2">
            <Zap className="w-4 h-4" />
            Start Your Journey
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">

      {/* My Competitive Status */}
      <Card className={`relative overflow-hidden ${leaderboardData.me.inTop10 ? 'bg-gradient-to-r from-yellow-500/10 to-orange-500/10 border-yellow-500/30' : 'bg-gradient-to-r from-primary/10 to-accent/10 border-primary/20'}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent animate-pulse" />
        <div className="relative p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className={`relative w-16 h-16 rounded-full bg-gradient-to-r ${getRankBadgeColor(leaderboardData.me.rank)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                #{leaderboardData.me.rank}
                <div className="absolute -top-1 -right-1">
                  {React.createElement(getRankMovement(), { className: "w-5 h-5 text-white bg-green-500 rounded-full p-1" })}
                </div>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-foreground">YOUR BATTLE STATUS</h3>
                  {leaderboardData.me.inTop10 && <Flame className="w-5 h-5 text-orange-500 animate-pulse" />}
                </div>
                <div className="flex items-center gap-2">
                  {React.createElement(getCompetitiveTitle(leaderboardData.me.rank).icon, { 
                    className: `w-4 h-4 ${getCompetitiveTitle(leaderboardData.me.rank).color}` 
                  })}
                  <span className={`text-sm font-semibold ${getCompetitiveTitle(leaderboardData.me.rank).color}`}>
                    {getCompetitiveTitle(leaderboardData.me.rank).title}
                  </span>
                </div>
              </div>
            </div>
            <div className="text-right space-y-2">
              <div className="flex items-center justify-end gap-2">
                <Badge className="px-3 py-1 bg-green-600 text-white border-none">
                  <LevelIcon level={leaderboardData.me.level} className="inline mr-1" /> Level {leaderboardData.me.level}
                </Badge>
              </div>
              <div>
                <p className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  {leaderboardData.me.points.toLocaleString()}
                </p>
                <p className="text-xs text-muted-foreground font-medium">BATTLE POINTS</p>
              </div>
              {leaderboardData.me.rank > 1 && leaderboardData.leaderboard[leaderboardData.me.rank - 2] && (
                <div className="text-xs text-muted-foreground">
                  <span className="text-red-500 font-bold">
                    {getPointsDifference(leaderboardData.me.points, leaderboardData.leaderboard[leaderboardData.me.rank - 2].points).toLocaleString()}
                  </span> points behind #{leaderboardData.me.rank - 1}
                </div>
              )}
            </div>
          </div>
        </div>
      </Card>

      {/* Elite Champions Podium */}
      <div className="space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground flex items-center justify-center gap-2">
            <Crown className="w-6 h-6 text-yellow-500" />
            HALL OF CHAMPIONS
            <Crown className="w-6 h-6 text-yellow-500" />
          </h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">The ultimate eco-warriors leading the charge</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          {leaderboardData.leaderboard.slice(0, 3).map((entry, index) => {
            const actualRank = entry.rank;
            const isCurrentUser = entry.userId === leaderboardData.me.userId;
            const competitiveInfo = getCompetitiveTitle(actualRank);
            
            return (
              <Card
                key={entry.userId}
                className={`relative overflow-visible transform transition-all duration-300 hover:scale-105 ${
                  actualRank === 1 ? 'md:order-2 md:scale-110 md:z-10' : actualRank === 2 ? 'md:order-1' : 'md:order-3'
                } ${isCurrentUser ? 'ring-4 ring-primary animate-pulse' : ''} ${
                  actualRank === 1 ? 'shadow-2xl shadow-yellow-500/20' : 'shadow-xl'
                }`}
              >
                {/* Animated background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${
                  actualRank === 1 ? 'from-yellow-500/20 via-orange-500/10 to-red-500/20' :
                  actualRank === 2 ? 'from-gray-400/20 via-gray-300/10 to-gray-500/20' :
                  'from-amber-600/20 via-amber-500/10 to-yellow-600/20'
                } animate-pulse`} />
                
                {/* Rank indicator */}
                <div className={`absolute top-0 left-0 right-0 h-3 bg-gradient-to-r ${getRankBadgeColor(actualRank)}`} />
                
                <div className="relative p-8 text-center space-y-5">
                  {/* Rank Number Display */}
                  <div className="relative flex justify-center mb-4">
                    <div className={`w-16 h-16 rounded-full flex items-center justify-center text-2xl font-bold text-white shadow-lg ${
                      actualRank === 1 ? 'bg-gradient-to-br from-yellow-400 to-yellow-600' :
                      actualRank === 2 ? 'bg-gradient-to-br from-gray-300 to-gray-500' :
                      'bg-gradient-to-br from-amber-400 to-amber-600'
                    }`}>
                      #{actualRank}
                    </div>
                    {actualRank === 1 && (
                      <div className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full flex items-center justify-center">
                        <Crown className="w-3 h-3 text-yellow-300" />
                      </div>
                    )}
                  </div>
                  
                  {/* Champion Avatar */}
                  <div className="relative">
                    <Avatar className={`w-24 h-24 mx-auto border-4 shadow-xl ${
                      actualRank === 1 ? 'border-yellow-500' :
                      actualRank === 2 ? 'border-gray-400' :
                      'border-amber-600'
                    }`}>
                      <AvatarFallback className={`bg-gradient-to-br ${getRankBadgeColor(actualRank)} text-white text-xl font-bold`}>
                        {getInitials(entry.name)}
                      </AvatarFallback>
                    </Avatar>
                    {isCurrentUser && (
                      <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2">
                        <Badge className="bg-primary text-primary-foreground animate-bounce">YOU</Badge>
                      </div>
                    )}
                  </div>
                  
                  {/* Champion Details */}
                  <div className="space-y-3">
                    <h3 className="font-bold text-lg text-foreground px-2">{entry.name}</h3>
                    
                    {/* Title Badge */}
                    <div className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold shadow-md ${
                      actualRank === 1 ? 'bg-yellow-500 text-yellow-900' :
                      actualRank === 2 ? 'bg-gray-400 text-gray-900' :
                      'bg-amber-500 text-amber-900'
                    }`}>
                      {React.createElement(competitiveInfo.icon, { className: "w-3 h-3" })}
                      {competitiveInfo.title}
                    </div>
                    
                    {/* Level Display */}
                      <div className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white text-sm font-medium shadow-md">
                      <LevelIcon level={entry.level} className="inline mr-1" />
                      Level {entry.level}
                    </div>
                    
                    {/* Points Display */}
                    <div className="space-y-1 mt-4">
                      <p className={`text-3xl font-bold ${
                        actualRank === 1 ? 'text-yellow-600' :
                        actualRank === 2 ? 'text-gray-600' :
                        'text-amber-600'
                      }`}>
                        {entry.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600 font-medium">BATTLE POINTS</p>
                    </div>
                  </div>
                </div>
                
              </Card>
            );
          })}
        </div>
      </div>

      {/* Elite Warriors Division */}
      {leaderboardData.leaderboard.length > 3 && (
        <Card className="overflow-hidden">
          <div className="bg-gradient-to-r from-blue-500/10 to-purple-500/10 p-6 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-foreground">ELITE WARRIORS DIVISION</h2>
                  <p className="text-sm text-muted-foreground">Battle-tested eco champions</p>
                </div>
              </div>
              <Badge variant="outline" className="bg-gradient-to-r from-blue-500 to-purple-500 text-white border-none">
                {leaderboardData.leaderboard.length - 3} FIGHTERS
              </Badge>
            </div>
          </div>
          
          <div className="p-6">
            <div className="space-y-3">
              {leaderboardData.leaderboard.slice(3).map((entry, index) => {
                const isCurrentUser = entry.userId === leaderboardData.me.userId;
                const competitiveInfo = getCompetitiveTitle(entry.rank);
                const MovementIcon = getRankMovement();
                
                return (
                  <div
                    key={entry.userId}
                    className={`group relative flex items-center justify-between p-4 rounded-xl transition-all duration-300 hover:scale-[1.02] ${
                      isCurrentUser
                        ? 'bg-gradient-to-r from-primary/20 to-accent/20 border-2 border-primary/30 shadow-lg'
                        : 'bg-gradient-to-r from-muted/30 to-muted/10 hover:from-muted/50 hover:to-muted/30 border border-border'
                    }`}
                  >
                    {/* Rank & Movement */}
                    <div className="flex items-center gap-4">
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-full bg-gradient-to-r ${getRankBadgeColor(entry.rank)} flex items-center justify-center text-white font-bold text-lg shadow-lg`}>
                          #{entry.rank}
                        </div>
                        <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full p-1 shadow-md">
                          <MovementIcon className="w-3 h-3 text-white" />
                        </div>
                      </div>
                      
                      {/* Avatar & Info */}
                      <Avatar className={`w-12 h-12 border-3 shadow-lg ${isCurrentUser ? 'border-primary' : 'border-background'}`}>
                        <AvatarFallback className="bg-gradient-to-br from-muted to-muted-foreground text-background text-sm font-bold">
                          {getInitials(entry.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-foreground group-hover:text-primary transition-colors">
                            {entry.name}
                          </p>
                          {isCurrentUser && (
                            <Badge className="bg-primary text-primary-foreground animate-pulse text-xs">
                              YOU
                            </Badge>
                          )}
                        </div>
                        
                        <div className="flex items-center gap-2">
                          {/* Competitive Title */}
                          <div className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-xs font-bold text-white shadow-sm ${
                            entry.rank <= 10 ? 'bg-green-500' :
                            entry.rank <= 50 ? 'bg-blue-500' :
                            'bg-purple-500'
                          }`}>
                            {React.createElement(competitiveInfo.icon, { className: "w-3 h-3" })}
                            {competitiveInfo.title}
                          </div>
                          
                          {/* Level Badge */}
                          <Badge className="text-xs bg-green-600 text-white border-none">
                            <LevelIcon level={entry.level} className="inline mr-1" /> Level {entry.level}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    
                    {/* Points & Stats */}
                    <div className="text-right space-y-1">
                      <p className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                        {entry.points.toLocaleString()}
                      </p>
                      <p className="text-xs text-muted-foreground font-medium">BATTLE PTS</p>
                      {/* Gap to next rank */}
                      {index > 0 && (
                        <p className="text-xs text-green-500 font-medium">
                          +{(entry.points - leaderboardData.leaderboard[entry.rank]?.points || 0).toLocaleString()} ahead
                        </p>
                      )}
                    </div>
                    
                    {/* Competitive Glow Effect */}
                    {isCurrentUser && (
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-accent/5 animate-pulse pointer-events-none" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </Card>
      )}

      {/* Battle Arena Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-600/10 border-green-500/20">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-green-500 rounded-full">
                <Target className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-green-600">DAILY</p>
              <p className="text-sm text-muted-foreground">Battle Reset</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-600/10 border-blue-500/20">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-blue-500 rounded-full animate-pulse">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">LIVE</p>
              <p className="text-sm text-muted-foreground">Real-time Updates</p>
            </div>
          </div>
        </Card>

        <Card className="p-6 bg-gradient-to-br from-purple-500/10 to-purple-600/10 border-purple-500/20">
          <div className="text-center space-y-3">
            <div className="flex justify-center">
              <div className="p-3 bg-purple-500 rounded-full">
                <Flame className="w-6 h-6 text-white animate-bounce" />
              </div>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">COMPETE</p>
              <p className="text-sm text-muted-foreground">Climb the Ranks</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Motivational Footer */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 border-primary/10">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Zap className="w-6 h-6 text-primary animate-pulse" />
            <h3 className="text-xl font-bold text-foreground bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              JOIN THE ECO REVOLUTION
            </h3>
            <Zap className="w-6 h-6 text-primary animate-pulse" />
          </div>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every bottle recycled, every gram of waste diverted makes you stronger in the battle for our planet. 
            <strong className="text-primary"> Rise through the ranks and become a champion!</strong>
          </p>
          <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
              <span>Live Rankings</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
              <span>Real-time Points</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse" />
              <span>Global Competition</span>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}