import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Package, CheckCircle, Loader2 } from 'lucide-react';
// import { pickupAPI } from '@/lib/api'; // No backend endpoint for pickups
import { toast } from '@/hooks/use-toast';
import { wasteAPI } from '@/lib/api';
import type { Pickup } from '@/types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faRecycle, 
  faNewspaper, 
  faWineGlass, 
  faIndustry, 
  faMicrochip, 
  faLeaf 
} from '@fortawesome/free-solid-svg-icons';

export default function Pickup() {
  const [pickups, setPickups] = useState<Pickup[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    date: '',
    address: '',
    wasteTypes: [] as string[],
    notes: '',
  });
  // Store weights for each waste type
  const [weights, setWeights] = useState<{ [type: string]: string }>({});
  const [showWeightPrompt, setShowWeightPrompt] = useState(false);
  const [currentTypeIndex, setCurrentTypeIndex] = useState(0);

  useEffect(() => {
    loadPickups();
  }, []);

  const loadPickups = async () => {
    try {
      setLoading(true);
      const res = await wasteAPI.getMyPickups();
      // Adapt backend waste submission to Pickup type for display
      setPickups(res.data.map((w: any) => ({
        id: w._id,
        scheduledDate: w.createdAt,
        address: w.location?.address || '',
        wasteTypes: [w.type],
        status: w.status?.toLowerCase() || 'pending',
      })));
    } catch (error: any) {
      console.error('Failed to load pickups:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to load pickups',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const wasteTypes = [
    { value: 'plastic', label: 'Plastic', icon: faRecycle },
    { value: 'paper', label: 'Paper', icon: faNewspaper },
    { value: 'glass', label: 'Glass', icon: faWineGlass },
    { value: 'metal', label: 'Metal', icon: faIndustry },
    { value: 'electronics', label: 'Electronics', icon: faMicrochip },
    { value: 'organic', label: 'Organic', icon: faLeaf },
  ];

  const toggleWasteType = (type: string) => {
    setFormData((prev) => ({
      ...prev,
      wasteTypes: prev.wasteTypes.includes(type)
        ? prev.wasteTypes.filter((t) => t !== type)
        : [...prev.wasteTypes, type],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.date || !formData.address || formData.wasteTypes.length === 0) {
      toast({
        title: 'Missing Information',
        description: 'Please fill in all required fields',
        variant: 'destructive',
      });
      return;
    }
    // Start weight prompt flow
    setWeights({});
    setCurrentTypeIndex(0);
    setShowWeightPrompt(true);
  };

  // Handle weight prompt submission
  const handleWeightSubmit = async () => {
    try {
      setSubmitting(true);
      const typeMap = {
        plastic: 'PLASTIC',
        paper: 'PAPER',
        glass: 'GLASS',
        metal: 'METAL',
        electronics: 'E_WASTE',
        organic: 'OTHER',
      };
      await Promise.all(
        formData.wasteTypes.map(type => {
          const weight = parseFloat(weights[type]);
          const payload = {
            type: typeMap[type] || 'OTHER',
            weightKg: isNaN(weight) ? 1 : weight,
          };
          return wasteAPI.submitWaste(payload);
        })
      );
      toast({
        title: 'Pickup Scheduled! 📦',
        description: `Your pickup has been scheduled for ${new Date(formData.date).toLocaleDateString()}`,
      });
      setFormData({
        date: '',
        address: '',
        wasteTypes: [],
        notes: '',
      });
      setWeights({});
      setShowWeightPrompt(false);
      loadPickups();
    } catch (error: any) {
      console.error('Failed to schedule pickup:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to schedule pickup',
        variant: 'destructive',
      });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled':
        return 'bg-primary/10 text-primary border-primary/20';
      case 'in-progress':
        return 'bg-warning/10 text-warning border-warning/20';
      case 'completed':
        return 'bg-success/10 text-success border-success/20';
      default:
        return 'bg-secondary text-secondary-foreground';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Schedule Pickup
        </h1>
        <p className="text-muted-foreground">
          Request a waste collection from your doorstep
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Schedule Form */}
        <Card className="lg:col-span-2 p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            New Pickup Request
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="date">Preferred Date *</Label>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  id="date"
                  type="date"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                  className="pl-10"
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>
              <p className="text-xs text-muted-foreground">
                Select a date at least 2 days from now
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Pickup Address *</Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-muted-foreground" size={20} />
                <Input
                  id="address"
                  placeholder="123 Main Street, City"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Waste Types *</Label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {wasteTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => toggleWasteType(type.value)}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      formData.wasteTypes.includes(type.value)
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <div className="text-3xl mb-2">
                      <FontAwesomeIcon icon={type.icon} />
                    </div>
                    <p className="text-sm font-medium text-foreground">{type.label}</p>
                  </button>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Additional Notes</Label>
              <Textarea
                id="notes"
                placeholder="Any special instructions for the pickup team..."
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                rows={4}
              />
            </div>

            <Button type="submit" className="w-full" size="lg" disabled={submitting}>
              {submitting ? (
                <Loader2 size={20} className="mr-2 animate-spin" />
              ) : (
                <Package size={20} className="mr-2" />
              )}
              {submitting ? 'Scheduling...' : 'Schedule Pickup'}
            </Button>

            {/* Weight Prompt Modal */}
            {showWeightPrompt && (
              <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
                <div className="bg-white p-6 rounded shadow-lg w-full max-w-xs space-y-4">
                  <h3 className="text-lg font-bold mb-2">Enter Weight</h3>
                  <p className="mb-2">How much {wasteTypes.find(w => w.value === formData.wasteTypes[currentTypeIndex])?.label || ''} are you submitting? (kg)</p>
                  <Input
                    type="number"
                    min={0.1}
                    step={0.1}
                    value={weights[formData.wasteTypes[currentTypeIndex]] || ''}
                    onChange={e => setWeights(w => ({ ...w, [formData.wasteTypes[currentTypeIndex]]: e.target.value }))}
                    autoFocus
                  />
                  <div className="flex gap-2 mt-4">
                    <Button
                      type="button"
                      variant="secondary"
                      onClick={() => {
                        setShowWeightPrompt(false);
                        setWeights({});
                      }}
                    >Cancel</Button>
                    {currentTypeIndex < formData.wasteTypes.length - 1 ? (
                      <Button
                        type="button"
                        onClick={() => setCurrentTypeIndex(i => i + 1)}
                        disabled={!weights[formData.wasteTypes[currentTypeIndex]]}
                      >Next</Button>
                    ) : (
                      <Button
                        type="button"
                        onClick={handleWeightSubmit}
                        disabled={!weights[formData.wasteTypes[currentTypeIndex]]}
                      >Submit</Button>
                    )}
                  </div>
                </div>
              </div>
            )}
          </form>
        </Card>

        {/* Upcoming Pickups */}
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-6">
            Your Pickups
          </h2>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-6 h-6 animate-spin text-primary" />
            </div>
          ) : (
            <div className="space-y-4">
              {pickups.length === 0 ? (
                <p className="text-sm text-muted-foreground text-center py-8">
                  No pickups scheduled yet
                </p>
              ) : (
                pickups.map((pickup) => (
              <div
                key={pickup.id}
                className="p-4 rounded-lg border border-border space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="font-medium text-foreground">
                      {new Date(pickup.scheduledDate).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric',
                        year: 'numeric',
                      })}
                    </p>
                    <p className="text-sm text-muted-foreground">{pickup.address}</p>
                  </div>
                  <Badge className={getStatusColor(pickup.status)}>
                    {pickup.status === 'completed' && <CheckCircle size={14} className="mr-1" />}
                    {pickup.status}
                  </Badge>
                </div>

                <div className="flex flex-wrap gap-1">
                  {pickup.wasteTypes.map((type) => (
                    <Badge key={type} variant="outline" className="text-xs capitalize">
                      {type}
                    </Badge>
                  ))}
                </div>

                {pickup.notes && (
                  <p className="text-xs text-muted-foreground italic">
                    Note: {pickup.notes}
                  </p>
                )}
                </div>
              ))
            )}
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
