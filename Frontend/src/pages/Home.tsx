import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Recycle, MapPin, Calendar, Trophy, BookOpen, Leaf, Sparkles } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';



export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  const features = [
    {
      icon: Recycle,
      title: 'Waste Management',
      description: 'Efficient and sustainable waste collection and recycling solutions',
    },
    {
      icon: MapPin,
      title: 'Find Centers',
      description: 'Locate nearby recycling centers with ease',
    },
    {
      icon: Calendar,
      title: 'Schedule Pickups',
      description: 'Book waste collection at your convenience',
    },
    {
      icon: Trophy,
      title: 'Earn Rewards',
      description: 'Get points and rewards for sustainable practices',
    },
    {
      icon: BookOpen,
      title: 'Learn & Grow',
      description: 'Educational resources on waste management',
    },
    {
      icon: Leaf,
      title: 'Go Green',
      description: 'Reduce environmental footprint together',
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white relative overflow-hidden">
      {/* Eco-friendly animated background elements */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Floating leaves */}
        <div className="absolute top-10 left-10 animate-float-slow">
          <Leaf className="w-12 h-12 text-green-400/30 rotate-12" />
        </div>
        <div className="absolute top-20 right-20 animate-float-medium">
          <Leaf className="w-8 h-8 text-emerald-300/40 -rotate-45" />
        </div>
        <div className="absolute bottom-32 left-1/4 animate-float-fast">
          <Leaf className="w-10 h-10 text-green-500/25 rotate-90" />
        </div>
        <div className="absolute top-1/3 right-1/3 animate-float-slow">
          <Leaf className="w-6 h-6 text-lime-400/35 rotate-180" />
        </div>
        
        {/* Recycling symbols */}
        <div className="absolute top-1/4 left-1/3 animate-spin-slow">
          <Recycle className="w-16 h-16 text-blue-400/20" />
        </div>
        <div className="absolute bottom-1/3 right-1/4 animate-spin-reverse">
          <Recycle className="w-12 h-12 text-teal-500/25" />
        </div>
        <div className="absolute top-2/3 left-20 animate-spin-slow">
          <Recycle className="w-8 h-8 text-cyan-400/30" />
        </div>
        
        {/* Sparkles for clean energy */}
        <div className="absolute top-16 right-1/2 animate-twinkle">
          <Sparkles className="w-6 h-6 text-yellow-400/40" />
        </div>
        <div className="absolute bottom-20 right-16 animate-twinkle-delayed">
          <Sparkles className="w-8 h-8 text-amber-300/35" />
        </div>
        <div className="absolute top-1/2 left-16 animate-twinkle-slow">
          <Sparkles className="w-5 h-5 text-green-400/45" />
        </div>
        
        {/* Animated gradient orbs */}
        <div className="absolute top-1/4 right-10 w-32 h-32 bg-gradient-to-br from-green-300/20 to-blue-300/20 rounded-full animate-pulse-gentle blur-sm"></div>
        <div className="absolute bottom-1/4 left-10 w-24 h-24 bg-gradient-to-tr from-emerald-400/15 to-teal-400/15 rounded-full animate-pulse-gentle-delayed blur-md"></div>
        <div className="absolute top-1/2 right-1/3 w-20 h-20 bg-gradient-to-bl from-lime-300/25 to-green-400/25 rounded-full animate-pulse-gentle blur-lg"></div>
      </div>

      <div className="absolute inset-0 overflow-hidden pointer-events-none z-20">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/3 w-72 h-72 bg-emerald-300 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-blob animation-delay-4000"></div>

        <div className="absolute top-10 left-1/4 animate-float">
          <Leaf className="w-8 h-8 text-green-400 opacity-40" />
        </div>
        <div className="absolute top-1/3 right-1/4 animate-float animation-delay-2000">
          <Recycle className="w-10 h-10 text-blue-400 opacity-40" />
        </div>
        <div className="absolute bottom-1/4 left-1/2 animate-float animation-delay-4000">
          <Sparkles className="w-6 h-6 text-emerald-400 opacity-40" />
        </div>
        <div className="absolute top-1/2 left-10 animate-float animation-delay-3000">
          <Leaf className="w-7 h-7 text-green-300 opacity-30" />
        </div>
        <div className="absolute bottom-1/3 right-20 animate-float animation-delay-1000">
          <Sparkles className="w-8 h-8 text-blue-300 opacity-30" />
        </div>
      </div>

  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-30">
          <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-green-500 to-blue-500 flex items-center justify-center p-2 animate-pulse-slow shadow-lg">
              <img
                src="/icon.png"
                alt="EcoPoint Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <h1 className="text-5xl font-bold text-gray-900 animate-slide-in-right">EcoPoint</h1>
          </div>
          <p className="text-2xl text-gray-600 mb-8 animate-fade-in animation-delay-500">
            Making waste management efficient and rewarding
          </p>
          <p className="text-lg text-gray-500 max-w-3xl mx-auto mb-12 animate-fade-in animation-delay-1000">
            Join our eco-friendly platform to manage waste collection, discover recycling centers,
            schedule pickups, and earn rewards for sustainable practices.
          </p>
          <div className="flex gap-4 justify-center animate-fade-in animation-delay-1500">
            {isLoggedIn ? (
              <>
                <Link to="/dashboard">
                  <Button size="lg" className="text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    Dashboard
                  </Button>
                </Link>
                <Link to="/dashboard/pickup">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    Schedule Pickup
                  </Button>
                </Link>
              </>
            ) : (
              <>
                <Link to="/register">
                  <Button size="lg" className="text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    Get Started
                  </Button>
                </Link>
                <Link to="/login">
                  <Button size="lg" variant="outline" className="text-lg px-8 py-6 transform hover:scale-105 transition-all duration-300 hover:shadow-xl">
                    Sign In
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <Card
                key={feature.title}
                className="border-2 hover:border-green-500 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 backdrop-blur-sm bg-white/80 animate-fade-in-up"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mb-4 transform hover:rotate-12 transition-transform duration-300">
                      <Icon className="w-7 h-7 text-green-600" />
                    </div>
                    <h3 className="text-xl font-semibold mb-2 text-gray-900">{feature.title}</h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 rounded-2xl p-12 text-center text-white relative overflow-hidden animate-fade-in shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <h2 className="text-3xl font-bold mb-4 relative z-10">Ready to Make a Difference?</h2>
          <p className="text-xl mb-8 opacity-90 relative z-10">
            Start your journey towards a cleaner, greener future today
          </p>
          {isLoggedIn ? (
            <Link to="/dashboard">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 relative z-10 transform hover:scale-110 transition-all duration-300 hover:shadow-2xl">
                Go to Dashboard
              </Button>
            </Link>
          ) : (
            <Link to="/register">
              <Button size="lg" variant="secondary" className="text-lg px-10 py-6 relative z-10 transform hover:scale-110 transition-all duration-300 hover:shadow-2xl">
                Join EcoPoint Now
              </Button>
            </Link>
          )}
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-20px); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.05); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animation-delay-500 {
          animation-delay: 500ms;
        }
        .animation-delay-1000 {
          animation-delay: 1000ms;
        }
        .animation-delay-1500 {
          animation-delay: 1500ms;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-3000 {
          animation-delay: 3s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .glow {
          text-shadow: 0 2px 12px rgba(16, 185, 129, 0.25), 0 4px 24px rgba(16, 185, 129, 0.12), 0 0 40px rgba(16,185,129,0.08);
          color: #ffffff;
        }
        .glow-sub {
          text-shadow: 0 1px 8px rgba(0,0,0,0.45), 0 0 20px rgba(16,185,129,0.06);
          color: #f8fafc;
        }
        
        /* Eco-friendly animations */
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-15px) rotate(5deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(-3deg); }
        }
        @keyframes float-fast {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-25px) rotate(8deg); }
        }
        @keyframes spin-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes spin-reverse {
          0% { transform: rotate(360deg); }
          100% { transform: rotate(0deg); }
        }
        @keyframes twinkle {
          0%, 100% { opacity: 0.4; transform: scale(1); }
          50% { opacity: 1; transform: scale(1.2); }
        }
        @keyframes twinkle-delayed {
          0%, 100% { opacity: 0.3; transform: scale(0.8); }
          50% { opacity: 0.9; transform: scale(1.1); }
        }
        @keyframes twinkle-slow {
          0%, 100% { opacity: 0.45; transform: scale(1); }
          50% { opacity: 0.8; transform: scale(1.15); }
        }
        @keyframes pulse-gentle {
          0%, 100% { opacity: 0.15; transform: scale(1); }
          50% { opacity: 0.25; transform: scale(1.05); }
        }
        @keyframes pulse-gentle-delayed {
          0%, 100% { opacity: 0.12; transform: scale(0.95); }
          50% { opacity: 0.22; transform: scale(1.02); }
        }
        
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-float-medium {
          animation: float-medium 4s ease-in-out infinite;
        }
        .animate-float-fast {
          animation: float-fast 3s ease-in-out infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 20s linear infinite;
        }
        .animate-spin-reverse {
          animation: spin-reverse 15s linear infinite;
        }
        .animate-twinkle {
          animation: twinkle 2s ease-in-out infinite;
        }
        .animate-twinkle-delayed {
          animation: twinkle-delayed 2.5s ease-in-out infinite 1s;
        }
        .animate-twinkle-slow {
          animation: twinkle-slow 3s ease-in-out infinite 0.5s;
        }
        .animate-pulse-gentle {
          animation: pulse-gentle 4s ease-in-out infinite;
        }
        .animate-pulse-gentle-delayed {
          animation: pulse-gentle-delayed 5s ease-in-out infinite 2s;
        }
      `}</style>
    </div>
  );
}
