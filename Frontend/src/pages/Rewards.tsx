import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trophy, Gift, Lock, Star, TrendingUp, Loader2, Copy, CheckCircle, Sparkles, PartyPopper } from 'lucide-react';
import { pointsAPI, couponsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { User, Achievement } from '@/types';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { calculateLevel, getLevelTitle, getLevelIcon, getLevelBadgeColor } from '@/lib/levelUtils';

export default function Rewards() {
  const [user, setUser] = useState<User | null>(null);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [rewards, setRewards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [redeemedCode, setRedeemedCode] = useState<{
    code: string;
    couponTitle: string;
  } | null>(null);
  const [showRedemptionPopup, setShowRedemptionPopup] = useState(false);
  const [recentRedemption, setRecentRedemption] = useState<{
    code: string;
    couponTitle: string;
    pointsUsed: number;
  } | null>(null);

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
      const userPoints = pointsRes.data.balance || 0;
      const userLevel = pointsRes.data.level || 1;
      
      setUser({ 
        points: userPoints, 
        level: userLevel,
        ...pointsRes.data 
      });
      setRewards(couponsRes.data.items || []);
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

  const handleRedeem = async (rewardId: string, couponTitle: string) => {
    try {
      const reward = rewards.find(r => r._id === rewardId);
      const response = await couponsAPI.redeemCoupon({ 
        couponId: rewardId, 
        idempotencyKey: `redeem-${rewardId}-${Date.now()}` 
      });
      
      // Set data for the new redemption popup
      setRecentRedemption({
        code: response.data.code,
        couponTitle: couponTitle,
        pointsUsed: reward?.pointsCost || 0,
      });
      setShowRedemptionPopup(true);
      
      // Also set the code dialog data for later viewing
      setRedeemedCode({
        code: response.data.code,
        couponTitle: couponTitle,
      });
      
      loadData();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to redeem reward',
        variant: 'destructive',
      });
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      toast({
        title: 'Copied!',
        description: 'Coupon code copied to clipboard',
      });
    } catch (error) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      toast({
        title: 'Copied!',
        description: 'Coupon code copied to clipboard',
      });
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
        <p className="text-muted-foreground">Failed to load data</p>
      </div>
    );
  }

  // staticRewards removed; rewards now come from backend coupons

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Rewards & Achievements
        </h1>
        <p className="text-muted-foreground">
          Earn points and unlock exclusive rewards
        </p>
      </div>

      {/* Points & Level Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6 bg-gradient-to-br from-primary to-accent text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Your Points</p>
              <h2 className="text-4xl font-bold mb-2">{user.points.toLocaleString()}</h2>
              <p className="text-white/80 text-sm">
                Keep recycling to earn more rewards!
              </p>
            </div>
            <Trophy size={64} className="text-white/20" />
          </div>
        </Card>
        
        <Card className="p-6 bg-gradient-to-br from-green-500 to-teal-600 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-white/80 mb-1">Current Level</p>
              <div className="flex items-center gap-3 mb-2">
                <span className="text-3xl">{getLevelIcon(user.level)}</span>
                <div>
                  <h2 className="text-2xl font-bold">Level {user.level}</h2>
                  <p className="text-white/90 text-sm">{getLevelTitle(user.level)}</p>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                {Math.floor((user.points % 200))} / 200 pts to next level
              </p>
            </div>
            <div className="text-white/20">
              <Star size={64} />
            </div>
          </div>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Available Rewards */}
        <div className="lg:col-span-2 space-y-6">
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Available Rewards
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Array.isArray(rewards) && rewards.length > 0 ? (
                rewards.map((reward) => {
                  try {
                    const canRedeem = user.points >= reward.pointsCost && reward.stock > 0;
                    return (
                      <Card
                        key={reward._id}
                        className={`p-6 ${canRedeem ? 'hover:shadow-lg' : 'opacity-60'} transition-all`}
                      >
                        <div className="space-y-4">
                          <div className="flex items-start justify-between">
                            <div className="text-5xl">🎁</div>
                            <Badge variant={reward.stock > 0 ? 'secondary' : 'destructive'}>
                              {reward.stock} left
                            </Badge>
                          </div>
                          <div>
                            <h3 className="font-bold text-foreground mb-1">
                              {reward.title}
                            </h3>
                            {reward.description && (
                              <p className="text-sm text-muted-foreground mb-2">
                                {reward.description}
                              </p>
                            )}
                            <div className="flex items-center gap-2">
                              <Star size={16} className="text-warning fill-warning" />
                              <span className="text-sm font-medium text-primary">
                                {reward.pointsCost.toLocaleString()} points
                              </span>
                            </div>
                          </div>
                          <Progress
                            value={(user.points / reward.pointsCost) * 100}
                            className="h-2"
                          />
                          {(reward.validFrom || reward.validTo) && (
                            <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                              {reward.validFrom && (
                                <p>Valid from: {new Date(reward.validFrom).toLocaleDateString()}</p>
                              )}
                              {reward.validTo && (
                                <p>Valid until: {new Date(reward.validTo).toLocaleDateString()}</p>
                              )}
                            </div>
                          )}
                          <Button
                            className="w-full"
                            disabled={!canRedeem}
                            variant={canRedeem ? 'default' : 'secondary'}
                            onClick={() => canRedeem && handleRedeem(reward._id, reward.title)}
                          >
                            {canRedeem ? (
                              <>
                                <Gift size={16} className="mr-2" />
                                Redeem Now
                              </>
                            ) : reward.stock === 0 ? (
                              'Out of Stock'
                            ) : (
                              <>Need {(reward.pointsCost - user.points).toLocaleString()} more</>
                            )}
                          </Button>
                        </div>
                      </Card>
                    );
                  } catch (err) {
                    return <Card key={reward._id || reward.id}><div className="p-4 text-red-500">Invalid reward data</div></Card>;
                  }
                })
              ) : (
                <div className="col-span-2 text-center text-muted-foreground py-8">No rewards available at this time.</div>
              )}
            </div>
          </div>
        </div>

        {/* Achievements and progress removed (no backend support) */}
      </div>

      {/* Redemption Success Popup */}
      <Dialog open={showRedemptionPopup} onOpenChange={setShowRedemptionPopup}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <PartyPopper className="w-8 h-8 text-green-600" />
            </div>
            <DialogTitle className="text-2xl font-bold text-green-700">
              Congratulations! 🎉
            </DialogTitle>
            <DialogDescription className="text-lg">
              You've successfully redeemed your coupon!
            </DialogDescription>
          </DialogHeader>
          
          {recentRedemption && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-green-50 to-blue-50 p-4 rounded-lg border">
                <h3 className="font-semibold text-gray-900 mb-2">
                  {recentRedemption.couponTitle}
                </h3>
                <div className="flex items-center justify-between bg-white p-3 rounded border-2 border-dashed border-gray-300">
                  <code className="text-lg font-mono font-bold text-blue-600">
                    {recentRedemption.code}
                  </code>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => copyToClipboard(recentRedemption.code)}
                    className="ml-2"
                  >
                    <Copy size={16} className="mr-1" />
                    Copy
                  </Button>
                </div>
              </div>
              
              <div className="flex items-center justify-center space-x-4 text-sm text-gray-600">
                <div className="flex items-center">
                  <Sparkles size={16} className="mr-1 text-yellow-500" />
                  <span>{recentRedemption.pointsUsed} points used</span>
                </div>
              </div>
              
              <div className="bg-blue-50 p-3 rounded-lg">
                <p className="text-sm text-blue-800">
                  <strong>📱 What's next?</strong>
                  <br />
                  Show this code to the business to claim your reward. 
                  You can also find this code later in your redeemed coupons.
                </p>
              </div>
              
              <div className="flex space-x-2">
                <Button
                  onClick={() => copyToClipboard(recentRedemption.code)}
                  className="flex-1"
                  variant="outline"
                >
                  <Copy size={16} className="mr-2" />
                  Copy Code
                </Button>
                <Button
                  onClick={() => setShowRedemptionPopup(false)}
                  className="flex-1"
                >
                  Got it!
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
