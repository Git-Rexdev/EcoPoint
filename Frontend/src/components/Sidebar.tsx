import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Home, MapPin, Calendar, BookOpen, User, Trophy, Building2, Star, Users, ShieldCheck, Heart, Code } from 'lucide-react';
import { cn } from '@/lib/utils';

const baseNavItems = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: MapPin, label: 'Recycling Centers', path: '/centers' },
  { icon: Calendar, label: 'Schedule Pickup', path: '/pickup' },
  { icon: BookOpen, label: 'Recycling Guide', path: '/guide' },
  { icon: Star, label: 'Offers & Ads', path: '/ads' },
  { icon: Trophy, label: 'Rewards & Points', path: '/rewards' },
  { icon: User, label: 'My Profile', path: '/profile' },
];

export function Sidebar() {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);

  useEffect(() => {
    // Try to get user role from localStorage (set after login/profile fetch)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role || null);
      } catch {}
    }
  }, []);

  const navItems = [...baseNavItems];
  if (role === 'BUSINESS') {
    navItems.splice(navItems.length - 1, 0, {
      icon: Building2,
      label: 'Business Dashboard',
      path: '/business',
    });
  }
  if (role === 'ADMIN') {
    navItems.splice(navItems.length - 1, 0, {
      icon: Calendar,
      label: 'All Schedules',
      path: '/all-schedules',
    });
    navItems.splice(navItems.length - 1, 0, {
      icon: Users,
      label: 'Manage Users',
      path: '/manage-users',
    });
    navItems.splice(navItems.length - 1, 0, {
      icon: ShieldCheck,
      label: 'Overall Management',
      path: '/overall-management',
    });
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border h-screen sticky top-0">
      <div className="p-6 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center p-1">
            <img 
              src="/icon.png" 
              alt="EcoPoint Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-xl text-foreground">EcoPoint</h1>
            <p className="text-xs text-muted-foreground">Make Earth Green</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200',
                isActive
                  ? 'bg-primary text-primary-foreground shadow-md'
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon size={20} />
              <span className="font-medium">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* Made by Section */}
      <div className="p-4 border-t border-border bg-gradient-to-br from-green-50/50 to-blue-50/50">
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Code size={12} />
            <span>Made with</span>
            <Heart size={12} className="text-red-500 animate-pulse" />
            <span>by</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-semibold text-foreground">Manmohan</span>
            <div className="text-xs text-muted-foreground font-medium">&</div>
            <span className="text-sm font-semibold text-foreground">Piyush</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
