import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Edit, Trash2, Eye, Calendar, Loader2, Building2, Trophy, CheckCircle, XCircle, Scan } from 'lucide-react';
import { adsAPI, wasteAPI, couponsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { Link } from 'react-router-dom';

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

interface WasteSubmission {
  _id: string;
  userId: string;
  type: string;
  weightKg: number;
  status: string;
  createdAt: string;
  location?: {
    address: string;
  };
}

interface Coupon {
  _id: string;
  title: string;
  description?: string;
  pointsCost: number;
  stock: number;
  validFrom?: string;
  validTo?: string;
  isActive: boolean;
  createdAt: string;
}

export default function Business() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [wasteSubmissions, setWasteSubmissions] = useState<WasteSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [showAdForm, setShowAdForm] = useState(false);
  const [showCouponForm, setShowCouponForm] = useState(false);
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    mediaUrl: '',
    activeFrom: '',
    activeTo: '',
    tags: '',
  });

  const [couponFormData, setCouponFormData] = useState({
    title: '',
    description: '',
    pointsCost: '',
    stock: '',
    validFrom: '',
    validTo: '',
  });

  const [verificationCode, setVerificationCode] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [verificationResult, setVerificationResult] = useState<{
    success: boolean;
    message: string;
    alreadyUsed?: boolean;
  } | null>(null);
  const [verificationHistory, setVerificationHistory] = useState<any[]>([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [adsRes, couponsRes, wasteRes, verificationRes] = await Promise.all([
        adsAPI.getMyAds(),
        couponsAPI.getMyCoupons(),
        wasteAPI.getAllPickups(),
        couponsAPI.getVerificationHistory(),
      ]);
      setAds(adsRes.data.items || []);
      setCoupons(couponsRes.data.items || []);
      setWasteSubmissions(wasteRes.data || []);
      setVerificationHistory(verificationRes.data.items || []);
    } catch (error: any) {
      console.error('Failed to load business data:', error);
      
      if (error.response?.status === 403) {
        toast({
          title: 'Access Denied',
          description: 'You need BUSINESS role to access this page. Use the Test Roles page to switch your role.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Error',
          description: error.response?.data?.message || 'Failed to load data',
          variant: 'destructive',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitAd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      toast({
        title: 'Missing Information',
        description: 'Please enter an ad title',
        variant: 'destructive',
      });
      return;
    }

    // Validate URL if provided
    if (formData.mediaUrl && formData.mediaUrl.trim()) {
      try {
        new URL(formData.mediaUrl);
      } catch {
        toast({
          title: 'Invalid URL',
          description: 'Please enter a valid media URL',
          variant: 'destructive',
        });
        return;
      }
    }

    try {
      setSubmitting(true);
      const payload: any = {
        title: formData.title.trim(),
      };

      // Only add fields if they have values
      if (formData.description && formData.description.trim()) {
        payload.description = formData.description.trim();
      }
      
      if (formData.mediaUrl && formData.mediaUrl.trim()) {
        payload.mediaUrl = formData.mediaUrl.trim();
      }

      if (formData.tags && formData.tags.trim()) {
        const tagArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        if (tagArray.length > 0) {
          payload.tags = tagArray;
        }
      }

      // Only add dates if they are provided and valid
      if (formData.activeFrom && formData.activeFrom.trim()) {
        payload.activeFrom = new Date(formData.activeFrom + 'T00:00:00.000Z').toISOString();
      }
      if (formData.activeTo && formData.activeTo.trim()) {
        payload.activeTo = new Date(formData.activeTo + 'T23:59:59.999Z').toISOString();
      }

      if (editingAd) {
        await adsAPI.updateAd(editingAd._id, payload);
        toast({ title: 'Ad updated successfully!' });
      } else {
        await adsAPI.createAd(payload);
        toast({ title: 'Ad created successfully!' });
      }

      setFormData({
        title: '',
        description: '',
        mediaUrl: '',
        activeFrom: '',
        activeTo: '',
        tags: '',
      });
      setShowAdForm(false);
      setEditingAd(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to save ad:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save ad',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditAd = (ad: Ad) => {
    setEditingAd(ad);
    setFormData({
      title: ad.title,
      description: ad.description || '',
      mediaUrl: ad.mediaUrl || '',
      activeFrom: ad.activeFrom ? new Date(ad.activeFrom).toISOString().split('T')[0] : '',
      activeTo: ad.activeTo ? new Date(ad.activeTo).toISOString().split('T')[0] : '',
      tags: ad.tags?.join(', ') || '',
    });
    setShowAdForm(true);
  };

  const handleDeleteAd = async (id: string) => {
    if (!confirm('Are you sure you want to delete this ad?')) return;

    try {
      await adsAPI.deleteAd(id);
      toast({ title: 'Ad deleted successfully!' });
      loadData();
    } catch (error: any) {
      console.error('Failed to delete ad:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete ad',
        variant: 'destructive',
      });
    }
  };

  const handleSubmitCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponFormData.title.trim() || !couponFormData.pointsCost || !couponFormData.stock) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }

    try {
      setSubmitting(true);
      const payload: any = {
        title: couponFormData.title.trim(),
        pointsCost: parseInt(couponFormData.pointsCost),
        stock: parseInt(couponFormData.stock),
      };

      if (couponFormData.description && couponFormData.description.trim()) {
        payload.description = couponFormData.description.trim();
      }

      if (couponFormData.validFrom && couponFormData.validFrom.trim()) {
        payload.validFrom = new Date(couponFormData.validFrom + 'T00:00:00.000Z').toISOString();
      }
      if (couponFormData.validTo && couponFormData.validTo.trim()) {
        payload.validTo = new Date(couponFormData.validTo + 'T23:59:59.999Z').toISOString();
      }

      if (editingCoupon) {
        await couponsAPI.updateCoupon(editingCoupon._id, payload);
        toast({ title: 'Coupon updated successfully!' });
      } else {
        await couponsAPI.createCoupon(payload);
        toast({ title: 'Coupon created successfully!' });
      }

      setCouponFormData({
        title: '',
        description: '',
        pointsCost: '',
        stock: '',
        validFrom: '',
        validTo: '',
      });
      setShowCouponForm(false);
      setEditingCoupon(null);
      loadData();
    } catch (error: any) {
      console.error('Failed to save coupon:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to save coupon',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditCoupon = (coupon: Coupon) => {
    setEditingCoupon(coupon);
    setCouponFormData({
      title: coupon.title,
      description: coupon.description || '',
      pointsCost: coupon.pointsCost.toString(),
      stock: coupon.stock.toString(),
      validFrom: coupon.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
      validTo: coupon.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : '',
    });
    setShowCouponForm(true);
  };

  const handleDeleteCoupon = async (id: string) => {
    if (!confirm('Are you sure you want to delete this coupon?')) return;

    try {
      await couponsAPI.deleteCoupon(id);
      toast({ title: 'Coupon deleted successfully!' });
      loadData();
    } catch (error: any) {
      console.error('Failed to delete coupon:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to delete coupon',
        variant: 'destructive',
      });
    }
  };

  const handleVerifyCoupon = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!verificationCode.trim()) {
      toast({
        title: 'Missing Code',
        description: 'Please enter a coupon code',
        variant: 'destructive',
      });
      return;
    }

    try {
      setVerifying(true);
      setVerificationResult(null);
      
      await couponsAPI.verifyAndUse({ code: verificationCode.trim().toUpperCase() });
      
      setVerificationResult({
        success: true,
        message: 'Coupon successfully redeemed!',
        alreadyUsed: false,
      });
      
      toast({
        title: 'Success! ✅',
        description: 'Coupon has been successfully redeemed',
      });
      
      setVerificationCode('');
      
      // Reload verification history
      try {
        const verificationRes = await couponsAPI.getVerificationHistory();
        setVerificationHistory(verificationRes.data.items || []);
      } catch (error) {
        console.error('Failed to reload verification history:', error);
      }
    } catch (error: any) {
      console.error('Failed to verify coupon:', error);
      
      const errorMessage = error.response?.data?.message || 'Failed to verify coupon';
      const isAlreadyUsed = errorMessage.toLowerCase().includes('already used') || 
                           errorMessage.toLowerCase().includes('invalid');
      
      setVerificationResult({
        success: false,
        message: isAlreadyUsed ? 'Coupon already redeemed or invalid' : errorMessage,
        alreadyUsed: isAlreadyUsed,
      });
      
      toast({
        title: isAlreadyUsed ? 'Already Redeemed ❌' : 'Error',
        description: errorMessage,
        variant: 'destructive',
      });
    } finally {
      setVerifying(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-success/10 text-success border-success/20';
      case 'pending':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'rejected':
        return 'bg-destructive/10 text-destructive border-destructive/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  // Check user role
  const userStr = localStorage.getItem('user');
  const userRole = userStr ? JSON.parse(userStr)?.role : null;

  if (userRole !== 'BUSINESS' && userRole !== 'ADMIN') {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
              <Building2 size={32} />
              Business Dashboard
            </h1>
            <p className="text-muted-foreground">
              Access denied - Business role required
            </p>
          </div>
        </div>

        <Card className="p-12 text-center">
          <Building2 size={64} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            Business Access Required
          </h3>
          <p className="text-muted-foreground mb-6">
            You need a BUSINESS role to access this dashboard. Please contact your administrator or use the Test Roles page to switch your role for testing.
          </p>
          <div className="flex gap-2 justify-center">
            <Link to="/test-role">
              <Button>
                Switch Role for Testing
              </Button>
            </Link>
            <Link to="/">
              <Button variant="outline">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
            <Building2 size={32} />
            Business Dashboard
          </h1>
          <p className="text-muted-foreground">
            Manage your advertisements and monitor waste submissions
          </p>
        </div>
      </div>

      <Tabs defaultValue="ads" className="space-y-6">
        <TabsList>
          <TabsTrigger value="ads">My Advertisements</TabsTrigger>
          <TabsTrigger value="coupons">My Coupons</TabsTrigger>
          <TabsTrigger value="verify">Verify Coupons</TabsTrigger>
          <TabsTrigger value="waste">Waste Submissions</TabsTrigger>
        </TabsList>

        <TabsContent value="ads" className="space-y-6">
          {/* Ad Management */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Advertisement Management</h2>
            <Button
              onClick={() => {
                setShowAdForm(true);
                setEditingAd(null);
                setFormData({
                  title: '',
                  description: '',
                  mediaUrl: '',
                  activeFrom: '',
                  activeTo: '',
                  tags: '',
                });
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Ad
            </Button>
          </div>

          {/* Ad Form */}
          {showAdForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingAd ? 'Edit Advertisement' : 'Create New Advertisement'}
              </h3>
              <form onSubmit={handleSubmitAd} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="title">Title *</Label>
                    <Input
                      id="title"
                      value={formData.title}
                      onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                      placeholder="Enter ad title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="mediaUrl">Media URL</Label>
                    <Input
                      id="mediaUrl"
                      type="url"
                      value={formData.mediaUrl}
                      onChange={(e) => setFormData({ ...formData, mediaUrl: e.target.value })}
                      placeholder="https://example.com/image.jpg"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    placeholder="Describe your advertisement"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="activeFrom">Active From</Label>
                    <Input
                      id="activeFrom"
                      type="date"
                      value={formData.activeFrom}
                      onChange={(e) => setFormData({ ...formData, activeFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="activeTo">Active Until</Label>
                    <Input
                      id="activeTo"
                      type="date"
                      value={formData.activeTo}
                      onChange={(e) => setFormData({ ...formData, activeTo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="tags">Tags (comma-separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                    placeholder="recycling, eco-friendly, sustainable"
                  />
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      editingAd ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />
                    )}
                    {submitting ? 'Saving...' : (editingAd ? 'Update Ad' : 'Create Ad')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowAdForm(false);
                      setEditingAd(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Ads List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {ads.map((ad) => (
                <Card key={ad._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{ad.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditAd(ad)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteAd(ad._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    {ad.description && (
                      <p className="text-sm text-muted-foreground">{ad.description}</p>
                    )}

                    {ad.mediaUrl && (
                      <img
                        src={ad.mediaUrl}
                        alt={ad.title}
                        className="w-full h-32 object-cover rounded"
                      />
                    )}

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {new Date(ad.createdAt).toLocaleDateString()}</span>
                      <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                        {ad.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>

                    {ad.tags && ad.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {ad.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    )}
                  </div>
                </Card>
              ))}

              {ads.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Eye size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No ads yet</h3>
                  <p className="text-muted-foreground">Create your first advertisement to get started</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="coupons" className="space-y-6">
          {/* Coupon Management */}
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-bold text-foreground">Coupon Management</h2>
            <Button
              onClick={() => {
                setShowCouponForm(true);
                setEditingCoupon(null);
                setCouponFormData({
                  title: '',
                  description: '',
                  pointsCost: '',
                  stock: '',
                  validFrom: '',
                  validTo: '',
                });
              }}
            >
              <Plus size={16} className="mr-2" />
              Create Coupon
            </Button>
          </div>

          {/* Coupon Form */}
          {showCouponForm && (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">
                {editingCoupon ? 'Edit Coupon' : 'Create New Coupon'}
              </h3>
              <form onSubmit={handleSubmitCoupon} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="coupon-title">Title *</Label>
                    <Input
                      id="coupon-title"
                      value={couponFormData.title}
                      onChange={(e) => setCouponFormData({ ...couponFormData, title: e.target.value })}
                      placeholder="Enter coupon title"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="points-cost">Points Cost *</Label>
                    <Input
                      id="points-cost"
                      type="number"
                      min="1"
                      value={couponFormData.pointsCost}
                      onChange={(e) => setCouponFormData({ ...couponFormData, pointsCost: e.target.value })}
                      placeholder="100"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="coupon-description">Description</Label>
                  <Textarea
                    id="coupon-description"
                    value={couponFormData.description}
                    onChange={(e) => setCouponFormData({ ...couponFormData, description: e.target.value })}
                    placeholder="Describe your coupon offer"
                    rows={3}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="stock">Stock Quantity *</Label>
                    <Input
                      id="stock"
                      type="number"
                      min="1"
                      value={couponFormData.stock}
                      onChange={(e) => setCouponFormData({ ...couponFormData, stock: e.target.value })}
                      placeholder="50"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coupon-valid-from">Valid From</Label>
                    <Input
                      id="coupon-valid-from"
                      type="date"
                      value={couponFormData.validFrom}
                      onChange={(e) => setCouponFormData({ ...couponFormData, validFrom: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="coupon-valid-to">Valid Until</Label>
                    <Input
                      id="coupon-valid-to"
                      type="date"
                      value={couponFormData.validTo}
                      onChange={(e) => setCouponFormData({ ...couponFormData, validTo: e.target.value })}
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button type="submit" disabled={submitting}>
                    {submitting ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      editingCoupon ? <Edit size={16} className="mr-2" /> : <Plus size={16} className="mr-2" />
                    )}
                    {submitting ? 'Saving...' : (editingCoupon ? 'Update Coupon' : 'Create Coupon')}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowCouponForm(false);
                      setEditingCoupon(null);
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </Card>
          )}

          {/* Coupons List */}
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {coupons.map((coupon) => (
                <Card key={coupon._id} className="p-4">
                  <div className="space-y-3">
                    <div className="flex items-start justify-between">
                      <h3 className="font-semibold text-foreground">{coupon.title}</h3>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleEditCoupon(coupon)}
                        >
                          <Edit size={14} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleDeleteCoupon(coupon._id)}
                        >
                          <Trash2 size={14} />
                        </Button>
                      </div>
                    </div>

                    {coupon.description && (
                      <p className="text-sm text-muted-foreground">{coupon.description}</p>
                    )}

                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Points Cost:</span>
                        <Badge variant="secondary">{coupon.pointsCost} pts</Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium text-foreground">Stock:</span>
                        <Badge variant={coupon.stock > 0 ? 'default' : 'destructive'}>
                          {coupon.stock} left
                        </Badge>
                      </div>
                    </div>

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

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Created: {new Date(coupon.createdAt).toLocaleDateString()}</span>
                      <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                        {coupon.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </div>
                  </div>
                </Card>
              ))}

              {coupons.length === 0 && (
                <div className="col-span-full text-center py-12">
                  <Trophy size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No coupons yet</h3>
                  <p className="text-muted-foreground">Create your first coupon to reward your customers</p>
                </div>
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="verify" className="space-y-6">
          {/* Coupon Verification */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Verify Coupon Codes</h2>
            <p className="text-muted-foreground mb-6">
              Enter coupon codes to verify and mark them as used
            </p>
          </div>

          <Card className="p-6">
            <form onSubmit={handleVerifyCoupon} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="verification-code">Coupon Code</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Scan className="absolute left-3 top-3 text-muted-foreground" size={20} />
                    <Input
                      id="verification-code"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value.toUpperCase())}
                      placeholder="Enter coupon code (e.g., ABC123DEF4)"
                      className="pl-10 font-mono text-lg"
                      maxLength={15}
                    />
                  </div>
                  <Button 
                    type="submit" 
                    disabled={verifying || !verificationCode.trim()}
                    className="px-8"
                  >
                    {verifying ? (
                      <Loader2 size={16} className="mr-2 animate-spin" />
                    ) : (
                      <CheckCircle size={16} className="mr-2" />
                    )}
                    {verifying ? 'Verifying...' : 'Verify'}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground">
                  Codes are case-insensitive and will be automatically converted to uppercase
                </p>
              </div>

              {/* Verification Result */}
              {verificationResult && (
                <div className={`p-4 rounded-lg border ${
                  verificationResult.success 
                    ? 'bg-success/10 border-success/20 text-success' 
                    : verificationResult.alreadyUsed
                      ? 'bg-warning/10 border-warning/20 text-warning'
                      : 'bg-destructive/10 border-destructive/20 text-destructive'
                }`}>
                  <div className="flex items-center gap-3">
                    {verificationResult.success ? (
                      <CheckCircle size={24} className="text-success" />
                    ) : (
                      <XCircle size={24} className={verificationResult.alreadyUsed ? 'text-warning' : 'text-destructive'} />
                    )}
                    <div>
                      <h3 className="font-semibold">
                        {verificationResult.success 
                          ? 'Successfully Redeemed' 
                          : verificationResult.alreadyUsed 
                            ? 'Already Redeemed' 
                            : 'Verification Failed'
                        }
                      </h3>
                      <p className="text-sm opacity-90">{verificationResult.message}</p>
                    </div>
                  </div>
                </div>
              )}
            </form>
          </Card>

          {/* Instructions Card */}
          <Card className="p-6 bg-muted/50">
            <h3 className="text-lg font-semibold text-foreground mb-3">How to Use Coupon Verification</h3>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">1</span>
                <p>Customer shows you their redeemed coupon code</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">2</span>
                <p>Enter the coupon code in the field above</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xs font-bold mt-0.5">3</span>
                <p>Click "Verify" to check if the coupon is valid and mark it as used</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-success text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">✓</span>
                <p><strong>Green:</strong> Coupon successfully redeemed</p>
              </div>
              <div className="flex items-start gap-2">
                <span className="w-6 h-6 bg-warning text-white rounded-full flex items-center justify-center text-xs font-bold mt-0.5">!</span>
                <p><strong>Yellow:</strong> Coupon already used or invalid</p>
              </div>
            </div>
          </Card>

          {/* Recent Verifications */}
          <Card className="p-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Recent Verifications</h3>
            <div className="space-y-3">
              {verificationHistory.length > 0 ? (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    {verificationHistory.map((verification) => (
                      <div
                        key={verification._id}
                        className="flex items-center justify-between p-4 bg-muted/50 rounded-lg border"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-success/10 rounded-full flex items-center justify-center">
                            <CheckCircle size={20} className="text-success" />
                          </div>
                          <div>
                            <p className="font-medium text-foreground">
                              {verification.couponTitle}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Code: <span className="font-mono font-bold">{verification.code}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              User: {verification.userEmail}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                            <Trophy size={14} />
                            <span>{verification.pointsCost} pts</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {new Date(verification.usedAt).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {verificationHistory.length >= 50 && (
                    <p className="text-xs text-muted-foreground text-center pt-2">
                      Showing last 50 verifications
                    </p>
                  )}
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Scan size={48} className="mx-auto mb-3 opacity-50" />
                  <p>No verifications yet</p>
                  <p className="text-xs">Verified coupons will appear here</p>
                </div>
              )}
            </div>
          </Card>
        </TabsContent>

        <TabsContent value="waste" className="space-y-6">
          {/* Waste Submissions */}
          <div>
            <h2 className="text-xl font-bold text-foreground mb-4">Waste Submissions Monitor</h2>
            <p className="text-muted-foreground mb-6">
              Monitor all waste submissions from users for pickup and processing
            </p>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {wasteSubmissions.map((submission) => (
                <Card key={submission._id} className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="space-y-2">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-foreground capitalize">
                          {submission.type.replace('_', ' ').toLowerCase()}
                        </h3>
                        <Badge className={getStatusColor(submission.status)}>
                          {submission.status || 'Pending'}
                        </Badge>
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <p>Weight: {submission.weightKg}kg</p>
                        {submission.location?.address && (
                          <p>Location: {submission.location.address}</p>
                        )}
                        <p>Submitted: {new Date(submission.createdAt).toLocaleDateString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={16} className="text-muted-foreground" />
                      <span className="text-sm text-muted-foreground">
                        {new Date(submission.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </Card>
              ))}

              {wasteSubmissions.length === 0 && (
                <div className="text-center py-12">
                  <Calendar size={48} className="mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No submissions yet</h3>
                  <p className="text-muted-foreground">
                    Waste submissions from users will appear here
                  </p>
                </div>
              )}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}