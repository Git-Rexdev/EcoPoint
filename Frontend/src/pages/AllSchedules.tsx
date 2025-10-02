import { useEffect, useState } from 'react';
import { wasteAPI, userAPI } from '@/lib/api';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Loader2, Lock, AlertCircle } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { User } from '@/types';

export default function AllSchedules() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [authorized, setAuthorized] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkAuthorizationAndLoadData();
  }, []);

  const checkAuthorizationAndLoadData = async () => {
    setLoading(true);
    try {
      // First, get the current user to check their role
      const userRes = await userAPI.getProfile();
      const currentUser = userRes.data;
      setUser(currentUser);
      
      // Check if user has BUSINESS or ADMIN role
      if (currentUser.role === 'BUSINESS' || currentUser.role === 'ADMIN') {
        setAuthorized(true);
        await loadSchedules();
      } else {
        setAuthorized(false);
        setError(`Access denied. This page requires BUSINESS or ADMIN role. Your role: ${currentUser.role}`);
      }
    } catch (e: any) {
      console.error('Authorization check failed:', e);
      setError('Failed to verify authorization. Please ensure you are logged in.');
      setAuthorized(false);
    } finally {
      setLoading(false);
    }
  };

  const loadSchedules = async () => {
    try {
      const res = await wasteAPI.getAllPickups();
      setSchedules(res.data || []);
    } catch (e: any) {
      console.error('Failed to load schedules:', e);
      
      if (e.response?.status === 403) {
        setError(`Access denied. Server response: ${e.response?.data?.message || 'Insufficient permissions'}`);
        setAuthorized(false);
      } else {
        setError(`Failed to load schedules. Error: ${e.response?.data?.message || e.message}`);
      }
      setSchedules([]);
    }
  };

  const markComplete = async (id: string) => {
    setUpdatingId(id);
    try {
      await wasteAPI.reviewWaste(id, { decision: 'APPROVE', points: 10 });
      toast({ title: 'Marked as complete', description: 'Pickup marked as complete and user rewarded.' });
      setSchedules(s => s.map(p => p._id === id ? { ...p, status: 'completed' } : p));
    } catch (e) {
      toast({ title: 'Error', description: 'Failed to mark as complete', variant: 'destructive' });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-2xl font-bold mb-6">All Scheduled Pickups</h1>
      
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
        </div>
      ) : !authorized ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <Lock className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Access Denied</h2>
              <p className="text-muted-foreground mb-4">
                {error || 'You need BUSINESS or ADMIN role to view all scheduled pickups.'}
              </p>
              {user && (
                <div className="text-sm text-muted-foreground">
                  Current role: <Badge variant="outline">{user.role}</Badge>
                </div>
              )}
            </div>
          </div>
        </Card>
      ) : error ? (
        <Card className="p-8 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-destructive/10 flex items-center justify-center">
              <AlertCircle className="w-8 h-8 text-destructive" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-foreground mb-2">Error</h2>
              <p className="text-muted-foreground mb-4">{error}</p>
              <Button onClick={checkAuthorizationAndLoadData} variant="outline">
                Try Again
              </Button>
            </div>
          </div>
        </Card>
      ) : schedules.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-muted-foreground">
            <p className="mb-4">No scheduled pickups found.</p>
            <Button onClick={loadSchedules} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-muted-foreground">
              Showing {schedules.length} pickup{schedules.length !== 1 ? 's' : ''}
            </p>
            <Button onClick={loadSchedules} variant="outline" size="sm">
              Refresh
            </Button>
          </div>
          
          {schedules.map((pickup) => (
            <Card key={pickup._id} className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-foreground capitalize">{pickup.type}</div>
                  <div className="text-sm text-muted-foreground">
                    {pickup.weightKg}kg • {new Date(pickup.createdAt).toLocaleDateString()}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    User: {typeof pickup.userId === 'object' && pickup.userId !== null 
                      ? pickup.userId.$oid || pickup.userId.toString() 
                      : pickup.userId}
                  </div>
                </div>
                <div className="flex flex-col items-end gap-2">
                  {(() => {
                    const status = pickup.status?.toLowerCase() || '';
                    const isCompleted = status === 'completed' || status === 'approved';
                    
                    return (
                      <>
                        <Badge variant={isCompleted ? 'default' : 'secondary'}>
                          {status === 'approved' ? 'APPROVED' : pickup.status?.toUpperCase() || 'UNKNOWN'}
                        </Badge>
                        {!isCompleted && (
                          <Button 
                            size="sm" 
                            disabled={updatingId === pickup._id} 
                            onClick={() => markComplete(pickup._id)}
                          >
                            {updatingId === pickup._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              'Mark Complete'
                            )}
                          </Button>
                        )}
                      </>
                    );
                  })()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
