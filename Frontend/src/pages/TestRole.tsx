import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { userAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function TestRole() {
  const [currentRole, setCurrentRole] = useState<string>('USER');
  const [loading, setLoading] = useState(false);

  const switchRole = async (role: string) => {
    try {
      setLoading(true);
      await userAPI.updateRole(role);
      setCurrentRole(role);
      
      // Update localStorage user data
      const userStr = localStorage.getItem('user');
      if (userStr) {
        const user = JSON.parse(userStr);
        user.role = role;
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      toast({
        title: 'Role Updated!',
        description: `Your role has been changed to ${role}`,
      });
      
      // Refresh the page to update navigation
      window.location.reload();
    } catch (error: any) {
      console.error('Failed to update role:', error);
      toast({
        title: 'Error',
        description: error.response?.data?.message || 'Failed to update role',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">
          Role Testing
        </h1>
        <p className="text-muted-foreground">
          Switch between different user roles to test functionality
        </p>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Switch User Role</h2>
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm font-medium">Current Role:</span>
            <Badge variant="default">{currentRole}</Badge>
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => switchRole('USER')}
              disabled={loading || currentRole === 'USER'}
              variant={currentRole === 'USER' ? 'default' : 'outline'}
            >
              Switch to USER
            </Button>
            <Button
              onClick={() => switchRole('BUSINESS')}
              disabled={loading || currentRole === 'BUSINESS'}
              variant={currentRole === 'BUSINESS' ? 'default' : 'outline'}
            >
              Switch to BUSINESS
            </Button>
            <Button
              onClick={() => switchRole('ADMIN')}
              disabled={loading || currentRole === 'ADMIN'}
              variant={currentRole === 'ADMIN' ? 'default' : 'outline'}
            >
              Switch to ADMIN
            </Button>
          </div>
        </div>
      </Card>

      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-3">Role Features:</h3>
        <div className="space-y-2 text-sm">
          <div><strong>USER:</strong> Can view ads, redeem coupons, schedule pickups</div>
          <div><strong>BUSINESS:</strong> Can create ads and coupons, view all waste submissions</div>
          <div><strong>ADMIN:</strong> Can view all schedules, manage all content</div>
        </div>
      </Card>
    </div>
  );
}