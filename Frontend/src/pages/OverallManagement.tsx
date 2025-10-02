import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  Eye,
  Calendar,
  Star,
  Gift,
  Loader2,
  AlertTriangle
} from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { adsAPI, couponsAPI } from '@/lib/api';

interface Ad {
  _id: string;
  title: string;
  description: string;
  mediaUrl: string;
  isActive: boolean;
  activeFrom: string | null;
  activeTo: string | null;
  tags: string[];
  businessId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface Coupon {
  _id: string;
  title: string;
  description: string;
  pointsCost: number;
  stock: number;
  validFrom: string | null;
  validTo: string | null;
  isActive: boolean;
  businessId: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
  updatedAt: string;
}

export default function OverallManagement() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [editingAd, setEditingAd] = useState<Ad | null>(null);
  const [editingCoupon, setEditingCoupon] = useState<Coupon | null>(null);
  const [isAdDialogOpen, setIsAdDialogOpen] = useState(false);
  const [isCouponDialogOpen, setIsCouponDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      // Load real data from API
      const [adsResponse, couponsResponse] = await Promise.all([
        adsAPI.getAllAds(),
        couponsAPI.getAllCoupons()
      ]);

      setAds(adsResponse.data.items || []);
      setCoupons(couponsResponse.data.items || []);
    } catch (error: any) {
      console.error('Failed to load data:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to load management data',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSaveAd = async (adData: any) => {
    try {
      if (editingAd) {
        // Update existing ad
        await adsAPI.updateAd(editingAd._id, adData);
        toast({ title: 'Success', description: 'Ad updated successfully' });
      } else {
        // Create new ad
        await adsAPI.createAd(adData);
        toast({ title: 'Success', description: 'Ad created successfully' });
      }
      setIsAdDialogOpen(false);
      setEditingAd(null);
      loadData(); // Reload data
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save ad',
        variant: 'destructive',
      });
    }
  };

  const handleSaveCoupon = async (couponData: any) => {
    try {
      if (editingCoupon) {
        // Update existing coupon
        await couponsAPI.updateCoupon(editingCoupon._id, couponData);
        toast({ title: 'Success', description: 'Coupon updated successfully' });
      } else {
        // Create new coupon
        await couponsAPI.createCoupon(couponData);
        toast({ title: 'Success', description: 'Coupon created successfully' });
      }
      setIsCouponDialogOpen(false);
      setEditingCoupon(null);
      loadData(); // Reload data
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to save coupon',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteAd = async (adId: string) => {
    try {
      await adsAPI.deleteAd(adId);
      toast({ title: 'Success', description: 'Ad deleted successfully' });
      loadData(); // Reload data
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete ad',
        variant: 'destructive',
      });
    }
  };

  const handleDeleteCoupon = async (couponId: string) => {
    try {
      await couponsAPI.deleteCoupon(couponId);
      toast({ title: 'Success', description: 'Coupon deleted successfully' });
      loadData(); // Reload data
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.response?.data?.error || 'Failed to delete coupon',
        variant: 'destructive',
      });
    }
  };

  const filteredAds = ads.filter(ad => {
    const matchesSearch = ad.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (ad.description || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && ad.isActive) ||
                          (statusFilter === 'inactive' && !ad.isActive);
    return matchesSearch && matchesStatus;
  });

  const filteredCoupons = coupons.filter(coupon => {
    const matchesSearch = coupon.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || 
                          (statusFilter === 'active' && coupon.isActive) ||
                          (statusFilter === 'inactive' && !coupon.isActive);
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Overall Management
        </h1>
        <p className="text-muted-foreground">
          Manage ads, coupons, and promotional content
        </p>
      </div>

      {/* Search and Filter Controls */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Search ads and coupons..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={(value: any) => setStatusFilter(value)}>
            <SelectTrigger className="w-full md:w-48">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </Card>

      {/* Management Tabs */}
      <Card className="p-6">
        <Tabs defaultValue="ads" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="ads" className="flex items-center gap-2">
              <Star className="w-4 h-4" />
              Manage Ads
            </TabsTrigger>
            <TabsTrigger value="coupons" className="flex items-center gap-2">
              <Gift className="w-4 h-4" />
              Manage Coupons
            </TabsTrigger>
          </TabsList>

          {/* Ads Management Tab */}
          <TabsContent value="ads" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Advertisement Management</h3>
              <Dialog open={isAdDialogOpen} onOpenChange={setIsAdDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingAd(null); setIsAdDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Ad
                  </Button>
                </DialogTrigger>
                <AdFormDialog
                  ad={editingAd}
                  onSave={handleSaveAd}
                  onCancel={() => { setIsAdDialogOpen(false); setEditingAd(null); }}
                />
              </Dialog>
            </div>

            <div className="space-y-4">
              {filteredAds.map((ad) => (
                <Card key={ad._id} className="p-4">
                  <div className="flex items-start gap-4">
                    {ad.mediaUrl && (
                      <img
                        src={ad.mediaUrl}
                        alt={ad.title}
                        className="w-20 h-20 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).style.display = 'none';
                        }}
                      />
                    )}
                    {!ad.mediaUrl && (
                      <div className="w-20 h-20 bg-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No Image</span>
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h4 className="font-semibold text-foreground">{ad.title}</h4>
                          <p className="text-sm text-muted-foreground">{ad.description || 'No description'}</p>
                          <p className="text-xs text-muted-foreground">Business: {ad.businessId?.name || 'Unknown'}</p>
                        </div>
                        <Badge variant={ad.isActive ? 'default' : 'secondary'}>
                          {ad.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
                        <span>Valid: {ad.activeFrom ? new Date(ad.activeFrom).toLocaleDateString() : 'No start'} - {ad.activeTo ? new Date(ad.activeTo).toLocaleDateString() : 'No end'}</span>
                        <span>Created: {new Date(ad.createdAt).toLocaleDateString()}</span>
                        {ad.tags && ad.tags.length > 0 && <span>Tags: {ad.tags.join(', ')}</span>}
                      </div>
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => { setEditingAd(ad); setIsAdDialogOpen(true); }}
                        >
                          <Edit className="w-4 h-4 mr-1" />
                          Edit
                        </Button>
                        {ad.mediaUrl && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => window.open(ad.mediaUrl, '_blank')}
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            View Media
                          </Button>
                        )}
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="destructive">
                              <Trash2 className="w-4 h-4 mr-1" />
                              Delete
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>Delete Advertisement</AlertDialogTitle>
                              <AlertDialogDescription>
                                Are you sure you want to delete "{ad.title}"? This action cannot be undone.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <AlertDialogAction onClick={() => handleDeleteAd(ad._id)}>
                                Delete
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
              {filteredAds.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No ads found matching your criteria
                </div>
              )}
            </div>
          </TabsContent>

          {/* Coupons Management Tab */}
          <TabsContent value="coupons" className="space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-semibold">Coupon Management</h3>
              <Dialog open={isCouponDialogOpen} onOpenChange={setIsCouponDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={() => { setEditingCoupon(null); setIsCouponDialogOpen(true); }}>
                    <Plus className="w-4 h-4 mr-2" />
                    Create Coupon
                  </Button>
                </DialogTrigger>
                <CouponFormDialog
                  coupon={editingCoupon}
                  onSave={handleSaveCoupon}
                  onCancel={() => { setIsCouponDialogOpen(false); setEditingCoupon(null); }}
                />
              </Dialog>
            </div>

            <div className="space-y-4">
              {filteredCoupons.map((coupon) => (
                <Card key={coupon._id} className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <div className="flex items-center gap-3 mb-2">
                        <h4 className="font-semibold text-foreground">{coupon.title}</h4>
                        <Badge variant={coupon.isActive ? 'default' : 'secondary'}>
                          {coupon.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">{coupon.description || 'No description'}</p>
                      <p className="text-xs text-muted-foreground mb-2">Business: {coupon.businessId?.name || 'Unknown'}</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>{coupon.pointsCost} points required</span>
                        <span>Stock: {coupon.stock}</span>
                        <span>Valid from: {coupon.validFrom ? new Date(coupon.validFrom).toLocaleDateString() : 'No start'}</span>
                        <span>Valid until: {coupon.validTo ? new Date(coupon.validTo).toLocaleDateString() : 'No end'}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => { setEditingCoupon(coupon); setIsCouponDialogOpen(true); }}
                    >
                      <Edit className="w-4 h-4 mr-1" />
                      Edit
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button size="sm" variant="destructive">
                          <Trash2 className="w-4 h-4 mr-1" />
                          Delete
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete Coupon</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete coupon "{coupon.title}"? This action cannot be undone and will affect users who have this coupon.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteCoupon(coupon._id)}>
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </Card>
              ))}
              {filteredCoupons.length === 0 && (
                <div className="text-center py-8 text-muted-foreground">
                  No coupons found matching your criteria
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
}

// Ad Form Dialog Component
function AdFormDialog({ 
  ad, 
  onSave, 
  onCancel 
}: { 
  ad: Ad | null; 
  onSave: (data: Partial<Ad>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: ad?.title || '',
    description: ad?.description || '',
    mediaUrl: ad?.mediaUrl || '',
    isActive: ad?.isActive !== undefined ? ad.isActive : true,
    activeFrom: ad?.activeFrom ? new Date(ad.activeFrom).toISOString().split('T')[0] : '',
    activeTo: ad?.activeTo ? new Date(ad.activeTo).toISOString().split('T')[0] : '',
    tags: ad?.tags?.join(', ') || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const submitData = {
      title: formData.title,
      description: formData.description,
      mediaUrl: formData.mediaUrl,
      isActive: formData.isActive,
      activeFrom: formData.activeFrom || null,
      activeTo: formData.activeTo || null,
      tags: formData.tags ? formData.tags.split(',').map(t => t.trim()).filter(t => t.length > 0) : []
    };
    onSave(submitData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{ad ? 'Edit Advertisement' : 'Create New Advertisement'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tags">Tags (comma-separated)</Label>
          <Input
            id="tags"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            placeholder="eco, green, sustainable"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="activeFrom">Start Date (optional)</Label>
            <Input
              id="activeFrom"
              type="date"
              value={formData.activeFrom}
              onChange={(e) => setFormData({ ...formData, activeFrom: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="activeTo">End Date (optional)</Label>
            <Input
              id="activeTo"
              type="date"
              value={formData.activeTo}
              onChange={(e) => setFormData({ ...formData, activeTo: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {ad ? 'Update' : 'Create'} Ad
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}

// Coupon Form Dialog Component
function CouponFormDialog({ 
  coupon, 
  onSave, 
  onCancel 
}: { 
  coupon: Coupon | null; 
  onSave: (data: Partial<Coupon>) => void; 
  onCancel: () => void;
}) {
  const [formData, setFormData] = useState({
    title: coupon?.title || '',
    description: coupon?.description || '',
    pointsCost: coupon?.pointsCost || 100,
    stock: coupon?.stock || 1,
    validFrom: coupon?.validFrom ? new Date(coupon.validFrom).toISOString().split('T')[0] : '',
    validTo: coupon?.validTo ? new Date(coupon.validTo).toISOString().split('T')[0] : '',
    isActive: coupon?.isActive !== undefined ? coupon.isActive : true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <DialogContent className="max-w-2xl">
      <DialogHeader>
        <DialogTitle>{coupon ? 'Edit Coupon' : 'Create New Coupon'}</DialogTitle>
      </DialogHeader>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.isActive ? 'active' : 'inactive'} onValueChange={(value) => setFormData({ ...formData, isActive: value === 'active' })}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input
            id="title"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="pointsCost">Points Required</Label>
            <Input
              id="pointsCost"
              type="number"
              min="1"
              value={formData.pointsCost}
              onChange={(e) => setFormData({ ...formData, pointsCost: parseInt(e.target.value) })}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="stock">Stock Available</Label>
            <Input
              id="stock"
              type="number"
              min="1"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: parseInt(e.target.value) })}
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="validFrom">Valid From (optional)</Label>
            <Input
              id="validFrom"
              type="date"
              value={formData.validFrom}
              onChange={(e) => setFormData({ ...formData, validFrom: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="validTo">Valid Until (optional)</Label>
            <Input
              id="validTo"
              type="date"
              value={formData.validTo}
              onChange={(e) => setFormData({ ...formData, validTo: e.target.value })}
            />
          </div>
        </div>

        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            {coupon ? 'Update' : 'Create'} Coupon
          </Button>
        </div>
      </form>
    </DialogContent>
  );
}