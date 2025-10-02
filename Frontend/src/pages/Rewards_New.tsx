import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Gift, Star, Loader2, Calendar } from 'lucide-react';
import { pointsAPI, couponsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { User, Achievement } from '@/types';

interface Coupon {
  _id: string;
  title: string;
  description?: string;
  pointsCost: number;
  validFrom?: string;
  validTo?: string;
  stock: number;
  isActive: boolean;
  createdAt: string;
}

export default function Rewards() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [redeeming, setRedeeming] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [pointsRes, couponsRes] = await Promise.all([
        pointsAPI.getBalance(),
        couponsAPI.getCoupons(),
      ]);
      setUser({ points: pointsRes.data.balance, ...pointsRes.data });
      setCoupons(couponsRes.data.items || []);
      setAchievements([]); // No achievements endpoint in backend, set empty or implement if needed
    } catch (error: any) {
      console.error('Failed to load rewards data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRedeem = async (couponId: string, pointsCost: number) => {
    if (!user || user.points < pointsCost) {
      toast({
        title: 'Insufficient Points',
        description: `You need ${pointsCost} points to redeem this coupon`,
        variant: 'destructive',
      });
      return;
    }

    try {
      setRedeeming(couponId);
      // Generate a simple idempotency key
      const idempotencyKey = Date.now().toString() + Math.random().toString(36).substr(2, 9);
      const response = await couponsAPI.redeemCoupon({ 
        couponId, 
        idempotencyKey 
      });
      
      toast({
        title: 'Success! 🎉',
        description: `Coupon redeemed! Your code is: ${response.data.code}`,
        duration: 10000,
      });
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to redeem coupon',
        variant: 'destructive',
      });
    } finally {
      setRedeeming(null);
    }
  };

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
        <p className="text-muted-foreground">Failed to load user data</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Rewards & Points
        </h1>
        <p className="text-muted-foreground">
          Redeem your points for exclusive eco-friendly rewards
        </p>
      </div>

      {/* Points Balance */}
      <Card className="p-6">
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
            <Trophy className="text-white" size={32} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-foreground">
              {user.points.toLocaleString()} Points
            </h2>
            <p className="text-muted-foreground">Available for redemption</p>
          </div>
        </div>
      </Card>

      {/* Available Coupons */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-foreground flex items-center gap-2">
          <Gift size={24} />
          Available Coupons
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {coupons.length > 0 ? (
            coupons.map((coupon) => {
              const canRedeem = user.points >= coupon.pointsCost && coupon.stock > 0;
              const isRedeeming = redeeming === coupon._id;
              
              return (
                <Card
                  key={coupon._id}
                  className={`p-6 ${canRedeem ? 'hover:shadow-lg' : 'opacity-60'} transition-all`}
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Gift size={24} className="text-primary" />
                        <Badge variant={coupon.stock > 0 ? 'default' : 'destructive'}>
                          {coupon.stock} left
                        </Badge>
                      </div>
                      {(coupon.validFrom || coupon.validTo) && (
                        <div className="text-xs text-muted-foreground">
                          <Calendar size={12} className="inline mr-1" />
                          Limited time
                        </div>
                      )}
                    </div>
                    
                    <div>
                      <h3 className="font-bold text-foreground mb-1">
                        {coupon.title}
                      </h3>
                      {coupon.description && (
                        <p className="text-sm text-muted-foreground mb-2">
                          {coupon.description}
                        </p>
                      )}
                      <div className="flex items-center gap-2">
                        <Star size={16} className="text-warning fill-warning" />
                        <span className="text-sm font-medium text-primary">
                          {coupon.pointsCost.toLocaleString()} points
                        </span>
                      </div>
                    </div>
                    
                    <Progress
                      value={Math.min((user.points / coupon.pointsCost) * 100, 100)}
                      className="h-2"
                    />
                    
                    <Button
                      className="w-full"
                      disabled={!canRedeem || isRedeeming}
                      variant={canRedeem ? 'default' : 'secondary'}
                      onClick={() => canRedeem && handleRedeem(coupon._id, coupon.pointsCost)}
                    >
                      {isRedeeming ? (
                        <>
                          <Loader2 size={16} className="mr-2 animate-spin" />
                          Redeeming...
                        </>
                      ) : canRedeem ? (
                        <>
                          <Gift size={16} className="mr-2" />
                          Redeem Now
                        </>
                      ) : coupon.stock === 0 ? (
                        'Out of Stock'
                      ) : (
                        `Need ${(coupon.pointsCost - user.points).toLocaleString()} more`
                      )}
                    </Button>
                    
                    {(coupon.validFrom || coupon.validTo) && (
                      <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                        {coupon.validFrom && (
                          <p>Valid from: {new Date(coupon.validFrom).toLocaleDateString()}</p>
                        )}
                        {coupon.validTo && (
                          <p>Valid until: {new Date(coupon.validTo).toLocaleDateString()}</p>
                        )}
                      </div>
                    )}
                  </div>
                </Card>
              );
            })
          ) : (
            <div className="col-span-full text-center py-12">
              <Gift size={48} className="mx-auto text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                No coupons available
              </h3>
              <p className="text-muted-foreground">
                Check back later for exciting rewards!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* How to Earn Points */}
      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">
          How to Earn Points
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
              <Trophy size={24} className="text-primary" />
            </div>
            <h3 className="font-semibold text-foreground">Recycle Waste</h3>
            <p className="text-sm text-muted-foreground">
              Submit waste for recycling and earn points based on weight and type
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-accent/10 flex items-center justify-center mx-auto">
              <Calendar size={24} className="text-accent" />
            </div>
            <h3 className="font-semibold text-foreground">Regular Pickups</h3>
            <p className="text-sm text-muted-foreground">
              Schedule regular waste pickups to maintain consistent point earning
            </p>
          </div>
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto">
              <Star size={24} className="text-success" />
            </div>
            <h3 className="font-semibold text-foreground">Special Bonuses</h3>
            <p className="text-sm text-muted-foreground">
              Earn bonus points for eco-friendly actions and community participation
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}