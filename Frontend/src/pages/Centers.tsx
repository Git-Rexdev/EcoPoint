import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Phone, Clock, Star, Navigation, Search, Loader2 } from 'lucide-react';
// import { centersAPI } from '@/lib/api'; // No backend endpoint for centers
import { toast } from '@/hooks/use-toast';
import { RecyclingCenter } from '@/types';

export default function Centers() {
  const [centers, setCenters] = useState<RecyclingCenter[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);

  const materials = ['plastic', 'paper', 'glass', 'metal', 'electronics', 'organic'];

  useEffect(() => {
    loadCenters();
  }, []);

  const loadCenters = async () => {
    try {
      setLoading(true);
  // No backend endpoint for centers. Implement if needed.
  setCenters([]);
    } catch (error: any) {
      console.error('Failed to load centers:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load recycling centers',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const filteredCenters = centers.filter((center) => {
    const matchesSearch = center.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      center.address.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesMaterials = selectedMaterials.length === 0 ||
      selectedMaterials.some((m) => center.acceptedMaterials.includes(m));

    return matchesSearch && matchesMaterials;
  });

  const toggleMaterial = (material: string) => {
    setSelectedMaterials((prev) =>
      prev.includes(material)
        ? prev.filter((m) => m !== material)
        : [...prev, material]
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Recycling Centers
        </h1>
        <p className="text-muted-foreground">
          Find nearby drop-off locations for your recyclables
        </p>
      </div>

      {/* Search and Filter */}
      <Card className="p-6">
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-3 text-muted-foreground" size={20} />
            <Input
              placeholder="Search by name or address..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-2">Filter by Material</p>
            <div className="flex flex-wrap gap-2">
              {materials.map((material) => (
                <Badge
                  key={material}
                  variant={selectedMaterials.includes(material) ? 'default' : 'outline'}
                  className="cursor-pointer capitalize"
                  onClick={() => toggleMaterial(material)}
                >
                  {material}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Centers List */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredCenters.map((center) => (
          <Card key={center.id} className="p-6 hover:shadow-lg transition-shadow">
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-xl font-bold text-foreground mb-1">
                    {center.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Star size={16} className="text-warning fill-warning" />
                    <span>{center.rating.toFixed(1)}</span>
                  </div>
                </div>
                {center.distance && (
                  <Badge variant="secondary">
                    {center.distance.toFixed(1)} km
                  </Badge>
                )}
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-start gap-2">
                  <MapPin size={16} className="text-muted-foreground mt-0.5 flex-shrink-0" />
                  <span className="text-muted-foreground">{center.address}</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground flex-shrink-0" />
                  <span className="text-muted-foreground">{center.hours}</span>
                </div>

                {center.phone && (
                  <div className="flex items-center gap-2">
                    <Phone size={16} className="text-muted-foreground flex-shrink-0" />
                    <span className="text-muted-foreground">{center.phone}</span>
                  </div>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Accepted Materials
                </p>
                <div className="flex flex-wrap gap-2">
                  {center.acceptedMaterials.map((material) => (
                    <Badge key={material} variant="outline" className="capitalize">
                      {material}
                    </Badge>
                  ))}
                </div>
              </div>

              <div className="flex gap-2 pt-2">
                <Button className="flex-1" variant="default">
                  <Navigation size={16} className="mr-2" />
                  Get Directions
                </Button>
                <Button variant="outline">
                  <Phone size={16} />
                </Button>
              </div>
            </div>
          </Card>
        ))}
        </div>
      )}

      {filteredCenters.length === 0 && (
        <Card className="p-12 text-center">
          <MapPin size={48} className="mx-auto text-muted-foreground mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">
            No centers found
          </h3>
          <p className="text-muted-foreground">
            Try adjusting your search or filter criteria
          </p>
        </Card>
      )}
    </div>
  );
}
