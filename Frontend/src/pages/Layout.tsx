import { Outlet } from 'react-router-dom';
import { Navigation } from '@/components/Navigation';
import { Sidebar } from '@/components/Sidebar';

export default function Layout() {
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
