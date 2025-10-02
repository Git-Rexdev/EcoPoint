import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, CheckCircle, XCircle, Loader2 } from 'lucide-react';
// import { guideAPI } from '@/lib/api'; // No backend endpoint for guides
import { toast } from '@/hooks/use-toast';
import { RecyclingGuide } from '@/types';

export default function Guide() {
  const [guides, setGuides] = useState<RecyclingGuide[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    loadGuides();
  }, []);

  const loadGuides = async () => {
    try {
      setLoading(true);
  // No backend endpoint for guides. Implement if needed.
  setGuides([]);
    } catch (error: any) {
      console.error('Failed to load guides:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load recycling guides',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredGuides = guides.filter(
    (guide) =>
      guide.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      guide.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Recycling Guide
        </h1>
        <p className="text-muted-foreground">
          Learn what can and can't be recycled
        </p>
      </div>

      {/* Search */}
      <Card className="p-6">
        <div className="relative">
          <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
          <Input
            placeholder="Search recycling information..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </Card>

      {/* Info Banner */}
      <Card className="p-6 bg-gradient-to-br from-primary/10 to-accent/10 border-primary/20">
        <div className="flex items-start gap-4">
          <div className="text-4xl">♻️</div>
          <div>
            <h3 className="font-semibold text-foreground mb-1">
              Why Recycling Matters
            </h3>
            <p className="text-sm text-muted-foreground">
              Recycling reduces landfill waste, conserves natural resources, saves energy, 
              and helps combat climate change. Every item you recycle makes a difference!
            </p>
          </div>
        </div>
      </Card>

      {/* Guides Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredGuides.map((guide) => (
          <Card key={guide.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <div className="text-5xl">{guide.icon}</div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-foreground">
                      {guide.title}
                    </h3>
                    {guide.recyclable ? (
                      <CheckCircle className="text-success flex-shrink-0" size={24} />
                    ) : (
                      <XCircle className="text-destructive flex-shrink-0" size={24} />
                    )}
                  </div>
                  <Badge variant="secondary" className="mb-2">
                    {guide.category}
                  </Badge>
                  <p className="text-sm text-muted-foreground">
                    {guide.description}
                  </p>
                </div>
              </div>

              <div className="pt-4 border-t border-border">
                <p className="text-sm font-medium text-foreground mb-2">
                  ✨ Recycling Tips:
                </p>
                <ul className="space-y-2">
                  {guide.tips.map((tip, index) => (
                    <li key={index} className="flex items-start gap-2 text-sm text-muted-foreground">
                      <span className="text-primary mt-0.5">•</span>
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        ))}
        </div>
      )}

      {filteredGuides.length === 0 && (
        <Card className="p-12 text-center">
          <Search size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No results found
          </h3>
          <p className="text-muted-foreground">
            Try searching with different keywords
          </p>
        </Card>
      )}
    </div>
  );
}
