import { Link, Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Sidebar } from '@/components/Sidebar';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function ConditionalLayout() {
  // Check if user is logged in
  const token = localStorage.getItem('token');
  const isLoggedIn = !!token;
  const location = useLocation();

  // Always show layout with sidebar (sidebar content changes based on login status)
  return (
    <div className="min-h-screen bg-background flex w-full">
      <Sidebar />
      
      <main className="flex-1 p-6 pb-20 md:pb-6 max-w-7xl mx-auto w-full">
        <Outlet />
      </main>

      <Navigation />
    </div>
  );
}