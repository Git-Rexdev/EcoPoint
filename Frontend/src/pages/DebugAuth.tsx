import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { userAPI, authAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';

export default function DebugAuth() {
  const [tokenInfo, setTokenInfo] = useState<any>(null);
  const [userInfo, setUserInfo] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    checkToken();
    loadUser();
  }, []);

  const checkToken = () => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        // Decode JWT payload (middle part)
        const payload = JSON.parse(atob(token.split('.')[1]));
        setTokenInfo(payload);
      } catch (e) {
        console.error('Failed to decode token:', e);
        setTokenInfo({ error: 'Invalid token format' });
      }
    } else {
      setTokenInfo({ error: 'No token found' });
    }
  };

  const loadUser = async () => {
    try {
      const response = await userAPI.getProfile();
      setUserInfo(response.data);
    } catch (e: any) {
      console.error('Failed to load user:', e);
      setUserInfo({ error: e.message });
    }
  };

  const refreshToken = async () => {
    try {
      setLoading(true);
      const refreshToken = localStorage.getItem('refreshToken');
      if (!refreshToken) {
        toast({
          title: 'Error',
          description: 'No refresh token found. Please login again.',
          variant: 'destructive',
        });
        return;
      }

      const response = await authAPI.refresh(refreshToken);
      localStorage.setItem('token', response.data.access);
      
      toast({
        title: 'Success',
        description: 'Token refreshed successfully',
      });
      
      checkToken();
      loadUser();
    } catch (e: any) {
      console.error('Failed to refresh token:', e);
      toast({
        title: 'Error',
        description: 'Failed to refresh token. Please login again.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const testWasteAPI = async () => {
    try {
      setLoading(true);
      const response = await fetch('http://localhost:5000/api/waste/all', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });
      
      if (response.ok) {
        const data = await response.json();
        toast({
          title: 'Success',
          description: `API call successful. Got ${data.length} records.`,
        });
      } else {
        const errorData = await response.text();
        toast({
          title: 'API Error',
          description: `${response.status}: ${errorData}`,
          variant: 'destructive',
        });
      }
    } catch (e: any) {
      toast({
        title: 'Network Error',
        description: e.message,
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
          Auth Debug
        </h1>
        <p className="text-muted-foreground">
          Debug authentication and authorization issues
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">JWT Token Info</h2>
          {tokenInfo ? (
            <div className="space-y-2">
              {tokenInfo.error ? (
                <p className="text-destructive">{tokenInfo.error}</p>
              ) : (
                <>
                  <p><strong>User ID:</strong> {tokenInfo.sub}</p>
                  <p><strong>Role:</strong> <Badge>{tokenInfo.role}</Badge></p>
                  <p><strong>Expires:</strong> {new Date(tokenInfo.exp * 1000).toLocaleString()}</p>
                  <p><strong>Issued:</strong> {new Date(tokenInfo.iat * 1000).toLocaleString()}</p>
                </>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
          
          <div className="mt-4 space-x-2">
            <Button onClick={checkToken} size="sm" variant="outline">
              Refresh Token Info
            </Button>
            <Button onClick={refreshToken} size="sm" disabled={loading}>
              Refresh JWT Token
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <h2 className="text-xl font-bold text-foreground mb-4">User Profile</h2>
          {userInfo ? (
            <div className="space-y-2">
              {userInfo.error ? (
                <p className="text-destructive">{userInfo.error}</p>
              ) : (
                <>
                  <p><strong>Name:</strong> {userInfo.name}</p>
                  <p><strong>Email:</strong> {userInfo.email}</p>
                  <p><strong>Role:</strong> <Badge>{userInfo.role}</Badge></p>
                  <p><strong>ID:</strong> {userInfo._id}</p>
                </>
              )}
            </div>
          ) : (
            <p>Loading...</p>
          )}
          
          <div className="mt-4">
            <Button onClick={loadUser} size="sm" variant="outline">
              Reload User Info
            </Button>
          </div>
        </Card>
      </div>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">API Test</h2>
        <p className="text-muted-foreground mb-4">
          Test the /api/waste/all endpoint directly
        </p>
        <Button onClick={testWasteAPI} disabled={loading}>
          Test Waste API
        </Button>
      </Card>

      <Card className="p-6">
        <h2 className="text-xl font-bold text-foreground mb-4">Debug Info</h2>
        <div className="space-y-2 text-sm">
          <p><strong>Token exists:</strong> {localStorage.getItem('token') ? 'Yes' : 'No'}</p>
          <p><strong>Refresh token exists:</strong> {localStorage.getItem('refreshToken') ? 'Yes' : 'No'}</p>
          <p><strong>API URL:</strong> {import.meta.env.VITE_API_URL || 'http://localhost:5000'}</p>
        </div>
      </Card>
    </div>
  );
}