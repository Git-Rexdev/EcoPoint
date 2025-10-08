import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Edit, Mail, Award, TrendingUp, Calendar, Package, Loader2, Gift, ShoppingBag } from 'lucide-react';
import { pointsAPI, wasteAPI, userAPI, couponsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { User, RecyclingRecord } from '@/types';
import { calculateLevel, getLevelTitle, getLevelBadgeColor } from '@/lib/levelUtils';
import LevelIcon from '@/components/ui/level-icon';
import { calculateEnvironmentalImpact, getMaterialColor, EnvironmentalImpact } from '@/lib/impactUtils';

export default function Profile() {
  const navigate = useNavigate();
  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('deviceId');
    localStorage.removeItem('deviceSecret');
    navigate('/login');
  };
  const [user, setUser] = useState<User | null>(null);
  const [records, setRecords] = useState<RecyclingRecord[]>([]);
  const [impact, setImpact] = useState<EnvironmentalImpact | null>(null);
  const [redeemedCoupons, setRedeemedCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [profileRes, pointsRes, wasteRes, couponsRes, verificationRes] = await Promise.all([
        userAPI.getProfile(),
        pointsAPI.getBalance(),
        wasteAPI.getMyPickups(),
        couponsAPI.getMyCoupons().catch(() => ({ data: [] })),
        couponsAPI.getVerificationHistory().catch(() => ({ data: [] })),
      ]);
      // Calculate totalRecycled from all user's waste submissions
      const wasteList = Array.isArray(wasteRes.data) ? wasteRes.data : [];
      const totalRecycled = wasteList.reduce((sum, w) => sum + (w.weightKg || 0), 0);
      const userPoints = pointsRes.data.balance || 0;
      const userLevel = profileRes.data.level || pointsRes.data.level || 1;
      
      const userData = { 
        ...profileRes.data, 
        points: userPoints, 
        level: userLevel,
        totalRecycled 
      };
      setUser(userData);
      // Store user with role in localStorage for sidebar
      localStorage.setItem('user', JSON.stringify(userData));
      const recyclingRecords = wasteList.map(w => ({
        id: w._id,
        userId: w.userId,
        type: w.type,
        weight: w.weightKg,
        date: w.createdAt,
        status: w.status,
        points: w.points || 0,
      }));
      
      setRecords(recyclingRecords);
      
      // Set redeemed coupons data - try multiple sources
      console.log('Raw coupons API response:', couponsRes);
      console.log('Raw verification API response:', verificationRes);
      
      // Try different data sources and structures
      let couponsData = [];
      
      // First try getMyCoupons
      if (couponsRes?.data) {
        if (Array.isArray(couponsRes.data)) {
          couponsData = couponsRes.data;
        } else if (couponsRes.data.coupons) {
          couponsData = couponsRes.data.coupons;
        } else if (couponsRes.data.items) {
          couponsData = couponsRes.data.items;
        }
      }
      
      // If that's empty, try verification history
      if (couponsData.length === 0 && verificationRes?.data) {
        if (Array.isArray(verificationRes.data)) {
          couponsData = verificationRes.data;
        } else if (verificationRes.data.history) {
          couponsData = verificationRes.data.history;
        } else if (verificationRes.data.items) {
          couponsData = verificationRes.data.items;
        }
      }
      
      console.log('Final processed coupons data:', couponsData);
      setRedeemedCoupons(couponsData);
      
      // Calculate environmental impact from real waste data
      const environmentalImpact = calculateEnvironmentalImpact(recyclingRecords);
      setImpact(environmentalImpact);
    } catch (error: any) {
      console.error('Failed to load profile data:', error);
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

  if (!user || !impact) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  const levelInfo = calculateLevel(user.points);
  const profileStats = [
    { label: 'Total Points', value: (user.points != null ? user.points.toLocaleString() : '0'), icon: Award },
    { label: 'Total Recycled', value: (user.totalRecycled != null ? `${user.totalRecycled.toFixed(1)}kg` : '0kg'), icon: Package },
  { label: 'Current Level', value: <><LevelIcon level={user.level} className="inline mr-1" /> Level {user.level}</>, icon: TrendingUp },
    { label: 'Next Level', value: `${levelInfo.pointsToNextLevel} pts to go`, icon: Calendar },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          My Profile
        </h1>
        <p className="text-muted-foreground">
          Manage your account and view your recycling history
        </p>
      </div>

      {/* Profile Header */}
      <Card className="p-4 md:p-6">
        <div className="flex flex-col space-y-4">
          {/* Avatar and Basic Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
            <Avatar className="w-20 h-20 md:w-24 md:h-24">
              <AvatarImage src={user?.avatar || ''} alt={user?.name || 'User'} />
              <AvatarFallback className="text-xl md:text-2xl">
                {user?.name ? user.name.split(' ').map((n) => n[0]).join('') : 'U'}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-1">
                {user?.name || 'User'}
              </h2>
              <div className="flex items-center justify-center sm:justify-start gap-2 text-muted-foreground text-sm md:text-base">
                <Mail size={16} />
                <span className="break-all">{user?.email || ''}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button variant="outline" className="flex-1 sm:flex-none">
              <Edit size={16} className="mr-2" />
              Edit Profile
            </Button>
            <Button variant="destructive" onClick={handleLogout} className="flex-1 sm:flex-none">
              Logout
            </Button>
          </div>

          {/* Badges */}
          <div className="flex flex-col sm:flex-row items-center gap-2 flex-wrap">
            <div className={`px-3 py-1 rounded-full bg-gradient-to-r ${getLevelBadgeColor(user.level)} text-white font-medium flex items-center gap-2 text-sm`}>
              <span><LevelIcon level={user.level} className="inline mr-1" /></span>
              <span>Level {user.level}</span>
            </div>
            <Badge variant="secondary" className="px-3 py-1 text-xs">
              {getLevelTitle(user.level)}
            </Badge>
            <Badge variant="outline" className="px-3 py-1 text-xs">
              {user.points.toLocaleString()} pts
            </Badge>
          </div>
        </div>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        {profileStats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.label} className="p-3 md:p-4">
              <div className="flex flex-col sm:flex-row items-center sm:items-start gap-2 sm:gap-3 text-center sm:text-left">
                <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center flex-shrink-0">
                  <Icon size={16} className="sm:w-5 sm:h-5 text-primary" />
                </div>
                <div className="min-w-0">
                  <p className="text-lg sm:text-xl lg:text-2xl font-bold text-foreground break-words">{stat.value}</p>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      {/* Activity Tabs */}
      <Card className="p-4 md:p-6">
        <Tabs defaultValue="history" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 md:mb-6 h-auto">
            <TabsTrigger value="history" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Recycling History</span>
              <span className="sm:hidden">History</span>
            </TabsTrigger>
            <TabsTrigger value="coupons" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Redeemed Coupons</span>
              <span className="sm:hidden">Coupons</span>
            </TabsTrigger>
            <TabsTrigger value="impact" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">Environmental Impact</span>
              <span className="sm:hidden">Impact</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="history" className="space-y-4">
            {Array.isArray(records) && records.length > 0 ? (
              records.map((record) => {
                try {
                  const getIcon = (type: string) => {
                    switch (type.toLowerCase()) {
                      case 'plastic':
                        return <Package className="w-6 h-6 text-blue-600" />;
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
                        return <Package className="w-6 h-6 text-primary" />;
                    }
                  };

                  // Use actual database values
                  const displayPoints = record.points || 0;
                  
                  // Map database status to display format
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
                          <p className="font-medium text-foreground capitalize">
                            {record.type}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {record.weight}kg • {new Date(record.date).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
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
                } catch (err) {
                  return <div key={record.id} className="p-4 text-red-500">Invalid record data</div>;
                }
              })
            ) : (
              <div className="text-center text-muted-foreground py-8">No recycling records found.</div>
            )}
          </TabsContent>

          <TabsContent value="coupons" className="space-y-4">
            {Array.isArray(redeemedCoupons) && redeemedCoupons.length > 0 ? (
              redeemedCoupons.map((coupon, index) => {
                // Handle different possible field names for various properties
                const couponId = coupon._id || coupon.id || index;
                const couponTitle = coupon.title || coupon.name || coupon.couponTitle || coupon.coupon?.title || 'Coupon';
                const couponDescription = coupon.description || coupon.desc || coupon.coupon?.description || 'Discount coupon';
                const redeemedDate = coupon.redeemedAt || coupon.redeemed_at || coupon.createdAt || coupon.created_at || coupon.date;
                const expiryDate = coupon.expiresAt || coupon.expires_at || coupon.expiry || coupon.coupon?.expiresAt;

                return (
                  <div
                    key={couponId}
                    className="flex items-center justify-between p-4 rounded-lg border border-border hover:border-primary/50 transition-colors bg-gradient-to-r from-white to-gray-50"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-100 to-red-100 flex items-center justify-center">
                        <Gift className="w-6 h-6 text-orange-600" />
                      </div>
                      <div>
                        <p className="font-medium text-foreground">
                          {couponTitle}
                        </p>
                        <p className="text-sm text-muted-foreground">
                          {couponDescription}
                        </p>
                        {(redeemedDate || expiryDate) && (
                          <p className="text-xs text-muted-foreground mt-1">
                            {redeemedDate && (
                              <>
                                {new Date(redeemedDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </>
                            )}
                            {expiryDate && (
                              <span className={redeemedDate ? "ml-2" : ""}>
                                {redeemedDate ? "• Expires: " : "Expires: "}{new Date(expiryDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric',
                                  year: 'numeric',
                                })}
                              </span>
                            )}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
                  <ShoppingBag size={32} className="text-muted-foreground" />
                </div>
                <h3 className="text-lg font-medium text-foreground mb-2">No Coupons Redeemed</h3>
                <p className="text-muted-foreground text-sm mb-4">
                  You haven't redeemed any coupons yet. Start earning points and redeem exciting offers!
                </p>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/rewards')}
                  className="flex items-center gap-2"
                >
                  <Gift size={16} />
                  Browse Rewards
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="impact">
            <div className="space-y-6">
              <Card className="p-6 bg-gradient-to-br from-success/10 to-accent/10 border-success/20">
                <h3 className="font-bold text-foreground text-xl mb-4">
                  Your Environmental Impact 🌍
                </h3>
                <div className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🌱</div>
                    <div>
                      <p className="font-semibold text-foreground">Carbon Footprint Reduced</p>
                      <p className="text-2xl font-bold text-success">{impact.co2Saved}kg CO₂</p>
                      <p className="text-sm text-muted-foreground">
                        Equivalent to driving {impact.milesEquivalent} miles less
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-3xl">🌳</div>
                    <div>
                      <p className="font-semibold text-foreground">Trees Saved</p>
                      <p className="text-2xl font-bold text-success">{impact.treesSaved} trees</p>
                      <p className="text-sm text-muted-foreground">
                        Through paper recycling efforts
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-3xl">💧</div>
                    <div>
                      <p className="font-semibold text-foreground">Water Conserved</p>
                      <p className="text-2xl font-bold text-success">{impact.waterConserved} liters</p>
                      <p className="text-sm text-muted-foreground">
                        From recycling plastic and paper
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <div className="text-3xl">⚡</div>
                    <div>
                      <p className="font-semibold text-foreground">Energy Saved</p>
                      <p className="text-2xl font-bold text-success">{impact.energySaved} kWh</p>
                      <p className="text-sm text-muted-foreground">
                        Enough to power a home for {impact.daysEquivalent} days
                      </p>
                    </div>
                  </div>
                </div>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold text-foreground mb-4">
                  Material Breakdown
                </h4>
                <div className="space-y-3">
                  {impact.materialBreakdown.length > 0 ? (
                    impact.materialBreakdown.map((material) => (
                      <div key={material.type}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-muted-foreground">
                            {material.type} ({material.weight.toFixed(1)}kg)
                          </span>
                          <span className="font-medium text-foreground">{material.percentage}%</span>
                        </div>
                        <div className="w-full bg-secondary rounded-full h-2">
                          <div
                            className={`h-full rounded-full ${getMaterialColor(material.type)}`}
                            style={{ width: `${material.percentage}%` }}
                          />
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center text-muted-foreground py-4">
                      No recycling data available yet. Start recycling to see your impact!
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}
