import { Link, Outlet, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Leaf } from 'lucide-react';

export default function PublicLayout() {
  const location = useLocation();
  const isLoginPage = location.pathname === '/login';
  const isRegisterPage = location.pathname === '/register';

  const navLinks = [
    { path: '/home', label: 'Home' },
    { path: '/about', label: 'About Us' },
    { path: '/team', label: 'Team' },
  ];

  return (
    <div className="min-h-screen bg-background">
      <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <Link to="/home" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center p-1">
                <img
                  src="/icon.png"
                  alt="EcoPoint Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-xl text-gray-900">EcoPoint</span>
                <Leaf className="w-5 h-5 text-green-600" />
              </div>
            </Link>

            <nav className="hidden md:flex items-center gap-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-green-600 ${
                    location.pathname === link.path
                      ? 'text-green-600'
                      : 'text-gray-700'
                  }`}
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            <div className="flex items-center gap-3">
              {!isLoginPage && !isRegisterPage && (
                <>
                  <Link to="/login">
                    <Button variant="ghost" className="hidden sm:inline-flex">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button className="bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
              {isLoginPage && (
                <Link to="/register">
                  <Button>Sign Up</Button>
                </Link>
              )}
              {isRegisterPage && (
                <Link to="/login">
                  <Button variant="outline">Sign In</Button>
                </Link>
              )}
            </div>
          </div>

          <nav className="md:hidden flex items-center gap-4 pb-3 overflow-x-auto">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`text-sm font-medium whitespace-nowrap transition-colors hover:text-green-600 ${
                  location.pathname === link.path
                    ? 'text-green-600'
                    : 'text-gray-700'
                }`}
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t bg-gray-50 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center p-1">
                <img
                  src="/icon.png"
                  alt="EcoPoint Logo"
                  className="w-full h-full object-contain"
                />
              </div>
              <span className="font-semibold text-gray-900">EcoPoint</span>
            </div>
            <div className="text-sm text-gray-600 text-center">
              <p>© 2025 RexDev & ByteSmith. All rights reserved.</p>
              <p className="mt-1">Making waste management efficient and rewarding</p>
            </div>
            <div className="flex gap-4">
              <a
                href="https://github.com/ByteSmithTheDev/EcoPoint-Frontend"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-600 hover:text-gray-900 transition-colors"
              >
                GitHub
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
