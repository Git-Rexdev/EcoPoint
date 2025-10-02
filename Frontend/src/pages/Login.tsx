import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/lib/api';
import { toast } from '@/hooks/use-toast';
import { storeDevice } from '@/lib/hmac';

export default function Login() {
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user was auto-logged out and show message
    const logoutReason = sessionStorage.getItem('logoutReason');
    if (logoutReason) {
      sessionStorage.removeItem('logoutReason');
      toast({
        title: 'Session Expired',
        description: logoutReason,
        variant: 'destructive',
      });
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await authAPI.login(identifier, password, 'web-client');
      localStorage.setItem('token', res.data.access);
      if (res.data.device) storeDevice(res.data.device);
      // Fetch user profile and store in localStorage for sidebar role
      try {
        const profileRes = await import('@/lib/api').then(m => m.userAPI.getProfile());
        localStorage.setItem('user', JSON.stringify(profileRes.data));
      } catch {}
      toast({ title: 'Login successful!' });
      
      // Check if there's a redirect path from auto-logout
      const redirectPath = sessionStorage.getItem('redirectPath');
      if (redirectPath) {
        sessionStorage.removeItem('redirectPath');
        navigate(redirectPath);
      } else {
        navigate('/');
      }
    } catch (error: any) {
      toast({
        title: 'Login failed',
        description: error.response?.data?.message || 'Invalid credentials',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-green-50 to-blue-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded-lg shadow-lg w-full max-w-sm space-y-6">
        {/* Logo and Brand Name */}
        <div className="text-center mb-6">
          <img 
            src="/icon.png" 
            alt="EcoPoint Logo" 
            className="h-30 w-40 mx-auto mb-3 animate-spin"
            style={{ 
              animationDuration: '8s', 
              animationIterationCount: 'infinite',
              filter: 'drop-shadow(0 0 12px rgba(0, 0, 0, 0.4)) drop-shadow(0 0 20px rgba(0, 0, 0, 0.2))'
            }}
          />
          <h1 className="text-3xl font-bold text-green-600 mb-2">EcoPoint</h1>
          <p className="text-gray-600 text-sm">Your sustainable recycling partner</p>
        </div>
        
        <h2 className="text-xl font-semibold text-center text-gray-800">Welcome Back</h2>
        <div className="space-y-4">
          <div>
            <input
              type="text"
              placeholder="Email or Name"
              value={identifier}
              onChange={e => setIdentifier(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>
          <div>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
              required
            />
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors font-medium"
          disabled={loading}
        >
          {loading ? 'Signing in...' : 'Sign In'}
        </button>
        
        <div className="text-center">
          <span className="text-gray-600 text-sm">Don't have an account? </span>
          <button
            type="button"
            className="text-green-600 hover:text-green-700 font-medium text-sm transition-colors"
            onClick={() => navigate('/register')}
          >
            Create one
          </button>
        </div>
      </form>
    </div>
  );
}
