import { Link, useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { Chrome as Home, MapPin, Calendar, BookOpen, User, Trophy, Building2, Star, Users, ShieldCheck, Heart, Code, Info, UserCheck, ChevronDown, ChevronRight, TrendingUp, Award } from 'lucide-react';
import { cn } from '@/lib/utils';

const publicNavItems = [
  { icon: Home, label: 'Home', path: '/home' },
  { icon: Info, label: 'About', path: '/about' },
  { icon: UserCheck, label: 'Team', path: '/team' },
];

const dashboardNavItems = [
  { icon: Home, label: 'Dashboard', path: '/dashboard' },
  { icon: MapPin, label: 'Recycling Centers', path: '/dashboard/centers' },
  { icon: Calendar, label: 'Schedule Pickup', path: '/dashboard/pickup' },
  { icon: BookOpen, label: 'Recycling Guide', path: '/dashboard/guide' },
  { icon: Star, label: 'Offers & Ads', path: '/dashboard/ads' },
  { icon: Trophy, label: 'Rewards & Points', path: '/dashboard/rewards' },
  { icon: TrendingUp, label: 'Leaderboard', path: '/dashboard/leaderboard' },
  { icon: Award, label: 'Achievements', path: '/dashboard/achievements' },
  { icon: User, label: 'My Profile', path: '/dashboard/profile' },
];

// Home sub-items for logged-in users
const homeSubItems = [
  { icon: Info, label: 'About', path: '/about' },
  { icon: UserCheck, label: 'Team', path: '/team' },
];

export function Sidebar() {
  const location = useLocation();
  const [role, setRole] = useState<string | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [homeExpanded, setHomeExpanded] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);

    // Try to get user role from localStorage (set after login/profile fetch)
    const userStr = localStorage.getItem('user');
    if (userStr) {
      try {
        const user = JSON.parse(userStr);
        setRole(user.role || null);
      } catch {}
    }

    // Auto-expand Home section when on home page and logged in
    if (!!token && location.pathname === '/home') {
      setHomeExpanded(true);
    }
  }, [location.pathname]);

  // Build navigation items based on login status
  let navItems = [];
  
  if (isLoggedIn) {
    // For logged-in users, start with just Home from public items (About & Team will be sub-items)
    navItems = [{ icon: Home, label: 'Home', path: '/home' }];
    
    // Add dashboard items
    navItems.push(...dashboardNavItems);
    
    // Add role-specific items
    if (role === 'BUSINESS') {
      navItems.splice(navItems.length - 1, 0, {
        icon: Building2,
        label: 'Business Dashboard',
        path: '/dashboard/business',
      });
    }
    if (role === 'ADMIN') {
      navItems.splice(navItems.length - 1, 0, {
        icon: Calendar,
        label: 'All Schedules',
        path: '/dashboard/all-schedules',
      });
      navItems.splice(navItems.length - 1, 0, {
        icon: Users,
        label: 'Manage Users',
        path: '/dashboard/manage-users',
      });
      navItems.splice(navItems.length - 1, 0, {
        icon: ShieldCheck,
        label: 'Overall Management',
        path: '/dashboard/overall-management',
      });
    }
  } else {
    // For logged-out users, show all public items including About & Team at top level
    navItems = [...publicNavItems];
  }

  return (
    <aside className="hidden md:flex flex-col w-64 bg-card border-r border-border min-h-screen h-full sticky top-0 z-40">
      <div className="p-4 border-b border-border">
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center p-1">
            <img 
              src="/icon.png" 
              alt="EcoPoint Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h1 className="font-bold text-lg text-foreground">EcoPoint</h1>
            <p className="text-xs text-muted-foreground">Make Earth Green</p>
          </div>
        </Link>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto max-h-[calc(100vh-140px)]">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          const isHomeItem = item.path === '/home' && isLoggedIn;
          const isHomeOrSubActive = isHomeItem && (location.pathname === '/home' || location.pathname === '/about' || location.pathname === '/team');

          return (
            <div key={item.path}>
              {/* Main nav item */}
              {isHomeItem ? (
                <button
                  onClick={() => {
                    setHomeExpanded(!homeExpanded);
                    // If clicking on Home while on a sub-page, navigate to Home
                    if (location.pathname !== '/home') {
                      window.location.href = '/home';
                    }
                  }}
                  className={cn(
                    'flex items-center justify-between w-full px-3 py-2 rounded-lg transition-all duration-200',
                    isHomeOrSubActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <div className="flex items-center gap-2">
                    <Icon size={18} />
                    <span className="font-medium text-sm">{item.label}</span>
                  </div>
                  {homeExpanded ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
                </button>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    'flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200',
                    isActive
                      ? 'bg-primary text-primary-foreground shadow-md'
                      : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                  )}
                >
                  <Icon size={18} />
                  <span className="font-medium text-sm">{item.label}</span>
                </Link>
              )}

              {/* Sub-items for Home when logged in */}
              {isHomeItem && homeExpanded && (
                <div className="ml-4 mt-1 space-y-1">
                  {homeSubItems.map((subItem) => {
                    const SubIcon = subItem.icon;
                    const isSubActive = location.pathname === subItem.path;
                    return (
                      <Link
                        key={subItem.path}
                        to={subItem.path}
                        className={cn(
                          'flex items-center gap-2 px-2 py-1.5 rounded-md transition-all duration-200 text-xs',
                          isSubActive
                            ? 'bg-primary/10 text-primary font-medium'
                            : 'text-muted-foreground hover:bg-secondary/50 hover:text-foreground'
                        )}
                      >
                        <SubIcon size={14} />
                        <span>{subItem.label}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })}
      </nav>

      {/* Made by Section */}
      <div className="p-3 border-t border-border bg-gradient-to-br from-green-50/50 to-blue-50/50 mt-auto">
        <div className="text-center space-y-2">
          <div className="flex items-center justify-center gap-1 text-xs text-muted-foreground">
            <Code size={10} />
            <span className="text-xs">Made with</span>
            <Heart size={10} className="text-red-500 animate-pulse" />
            <span className="text-xs">by</span>
          </div>
          <div className="flex items-center justify-center gap-1">
            <span className="text-xs font-semibold text-foreground">Manmohan</span>
            <div className="text-xs text-muted-foreground font-medium">&</div>
            <span className="text-xs font-semibold text-foreground">Piyush</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
