import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Star, Search, Filter, Calendar, ExternalLink, Loader2, X, Clock, Tag } from 'lucide-react';
import { adsAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

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

export default function Ads() {
  const [ads, setAds] = useState<Ad[]>([]);
  const [filteredAds, setFilteredAds] = useState<Ad[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAdModal, setShowAdModal] = useState(false);

  useEffect(() => {
    loadAds();
  }, []);

  useEffect(() => {
    filterAds();
  }, [ads, searchQuery, selectedTags]);

  const loadAds = async () => {
    try {
      setLoading(true);
      const response = await adsAPI.getAds();
      setAds(response.data.items || []);
    } catch (error: any) {
      console.error('Failed to load ads:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load advertisements',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filterAds = () => {
    let filtered = ads;

    if (searchQuery.trim()) {
      filtered = filtered.filter(ad =>
        ad.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        ad.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }

    if (selectedTags.length > 0) {
      filtered = filtered.filter(ad =>
        ad.tags?.some(tag => selectedTags.includes(tag))
      );
    }

    setFilteredAds(filtered);
  };

  const allTags = Array.from(
    new Set(ads.flatMap(ad => ad.tags || []))
  ).sort();

  const toggleTag = (tag: string) => {
    setSelectedTags(prev =>
      prev.includes(tag)
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };

  const handleLearnMore = (ad: Ad) => {
    setSelectedAd(ad);
    setShowAdModal(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2 flex items-center gap-2">
          <Star className="text-warning" size={32} />
          Eco-Friendly Offers & Ads
        </h1>
        <p className="text-muted-foreground">
          Discover sustainable products and services from our business partners
        </p>
      </div>

      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search ads by title, description, or tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {allTags.length > 0 && (
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Filter size={16} className="text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">Filter by Tags</p>
              </div>
              <div className="flex flex-wrap gap-2">
                {allTags.map((tag) => (
                  <Badge
                    key={tag}
                    variant={selectedTags.includes(tag) ? 'default' : 'outline'}
                    className="cursor-pointer capitalize"
                    onClick={() => toggleTag(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          )}

          {(searchQuery || selectedTags.length > 0) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Showing {filteredAds.length} of {ads.length} ads
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedTags([]);
                }}
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </Card>

      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAds.map((ad) => (
            <Card key={ad._id} className="overflow-hidden hover:shadow-lg transition-shadow">
              {ad.mediaUrl && (
                <div className="aspect-video overflow-hidden">
                  <img
                    src={ad.mediaUrl}
                    alt={ad.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              
              <div className="p-6 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-2">
                    {ad.title}
                  </h3>
                  {ad.description && (
                    <p className="text-muted-foreground leading-relaxed">
                      {ad.description}
                    </p>
                  )}
                </div>

                {ad.tags && ad.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {ad.tags.map((tag, index) => (
                      <Badge key={index} variant="secondary" className="capitalize">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-border">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Calendar size={14} />
                    <span>{new Date(ad.createdAt).toLocaleDateString()}</span>
                  </div>
                  
                  <Button 
                    size="sm" 
                    className="gap-2"
                    onClick={() => handleLearnMore(ad)}
                  >
                    Learn More
                    <ExternalLink size={16} />
                  </Button>
                </div>

                {(ad.activeFrom || ad.activeTo) && (
                  <div className="text-xs text-muted-foreground bg-muted p-2 rounded">
                    {ad.activeFrom && (
                      <p>Valid from: {new Date(ad.activeFrom).toLocaleDateString()}</p>
                    )}
                    {ad.activeTo && (
                      <p>Valid until: {new Date(ad.activeTo).toLocaleDateString()}</p>
                    )}
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {filteredAds.length === 0 && !loading && (
        <Card className="p-12 text-center">
          <Star size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            {searchQuery || selectedTags.length > 0 ? 'No ads match your filters' : 'No ads available'}
          </h3>
          <p className="text-muted-foreground">
            {searchQuery || selectedTags.length > 0
              ? 'Try adjusting your search or filter criteria'
              : 'Check back later for exciting eco-friendly offers!'
            }
          </p>
        </Card>
      )}

      <Dialog open={showAdModal} onOpenChange={setShowAdModal}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          {selectedAd && (
            <>
              <DialogHeader>
                <DialogTitle className="text-2xl font-bold text-foreground mb-2">
                  {selectedAd.title}
                </DialogTitle>
              </DialogHeader>
              
              <div className="space-y-6">
                {selectedAd.mediaUrl && (
                  <div className="w-full aspect-video overflow-hidden rounded-lg">
                    <img
                      src={selectedAd.mediaUrl}
                      alt={selectedAd.title}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {selectedAd.description && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Star size={20} className="text-warning" />
                      About This Offer
                    </h3>
                    <p className="text-muted-foreground leading-relaxed text-base">
                      {selectedAd.description}
                    </p>
                  </div>
                )}

                {selectedAd.tags && selectedAd.tags.length > 0 && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Tag size={20} className="text-primary" />
                      Categories
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedAd.tags.map((tag, index) => (
                        <Badge key={index} variant="secondary" className="capitalize text-sm px-3 py-1">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {(selectedAd.activeFrom || selectedAd.activeTo) && (
                  <div className="space-y-2">
                    <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                      <Clock size={20} className="text-blue-500" />
                      Validity Period
                    </h3>
                    <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg space-y-1">
                      {selectedAd.activeFrom && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Valid from:</strong> {new Date(selectedAd.activeFrom).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                      {selectedAd.activeTo && (
                        <p className="text-sm text-blue-700 dark:text-blue-300">
                          <strong>Valid until:</strong> {new Date(selectedAd.activeTo).toLocaleDateString('en-US', {
                            weekday: 'long',
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                          })}
                        </p>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-2">
                  <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
                    <Calendar size={20} className="text-green-500" />
                    Posted On
                  </h3>
                  <p className="text-muted-foreground">
                    {new Date(selectedAd.createdAt).toLocaleDateString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </p>
                </div>

                <div className="flex justify-center pt-4 border-t border-border">
                  <Button 
                    variant="outline" 
                    onClick={() => setShowAdModal(false)}
                  >
                    <X size={16} className="mr-2" />
                    Close
                  </Button>
                </div>

                <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="text-green-600 dark:text-green-400" size={20} />
                    <h4 className="font-semibold text-green-800 dark:text-green-200">
                      Eco-Friendly Choice
                    </h4>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    By supporting this business, you're contributing to a more sustainable future. 
                    Every eco-friendly choice makes a difference!
                  </p>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}