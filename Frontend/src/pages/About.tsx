import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Recycle, Code, Zap, Shield, Users, Heart, Sparkles, Leaf } from 'lucide-react';

export default function About() {
  const features = [
    {
      icon: Recycle,
      title: 'Dashboard',
      description: "Overview of user's eco-activities and statistics",
    },
    {
      icon: Users,
      title: 'Centers',
      description: 'Find and explore nearby recycling centers',
    },
    {
      icon: Code,
      title: 'Pickup Scheduling',
      description: 'Schedule waste collection at your convenience',
    },
    {
      icon: Shield,
      title: 'Guide',
      description: 'Educational resources on waste management and recycling',
    },
    {
      icon: Zap,
      title: 'Rewards',
      description: 'Earn points and rewards for sustainable practices',
    },
    {
      icon: Heart,
      title: 'Profile Management',
      description: 'Manage user account and preferences',
    },
  ];

  const techStack = [
    { category: 'Frontend Framework', items: ['React 18.3.1', 'TypeScript 5.8.3', 'Vite 5.4.19'] },
    { category: 'UI & Styling', items: ['Tailwind CSS 3.4.17', 'Radix UI', 'Shadcn/ui', 'Lucide React'] },
    { category: 'State & Data', items: ['TanStack Query 5.83.0', 'React Hook Form 7.61', 'Zod 3.25'] },
    { category: 'Additional', items: ['React Router DOM 6.30', 'Axios 1.12', 'Date-fns 3.6', 'Recharts 2.15'] },
  ];

  const impactPoints = [
    'Connecting users with local recycling centers',
    'Streamlining waste collection processes',
    'Educating users about proper waste management',
    'Rewarding eco-friendly behaviors',
    'Reducing environmental footprint through efficient logistics',
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-green-50/30 to-blue-50 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-10 right-20 w-64 h-64 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/3 left-10 w-64 h-64 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 right-1/4 w-64 h-64 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="absolute top-20 left-1/4 animate-float-slow">
          <Code className="w-12 h-12 text-blue-300 opacity-20" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float-slow animation-delay-2000">
          <Sparkles className="w-10 h-10 text-green-300 opacity-20" />
        </div>
        <div className="absolute bottom-1/4 left-1/3 animate-float-slow animation-delay-3000">
          <Leaf className="w-14 h-14 text-emerald-300 opacity-20" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-12 animate-fade-in-up">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">About EcoPoint</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A modern, eco-friendly waste management web application built with React, TypeScript, and Tailwind CSS
          </p>
        </div>

        <Card className="mb-12 backdrop-blur-sm bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in">
          <CardHeader>
            <CardTitle className="text-2xl flex items-center gap-2">
              <Heart className="w-6 h-6 text-red-500 animate-pulse" />
              Our Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg text-gray-700 leading-relaxed">
              EcoPoint is a comprehensive waste management platform that connects users with recycling centers,
              enables efficient waste pickup scheduling, and promotes sustainable practices through a reward system.
              The application features a modern, responsive design with a focus on user experience and environmental impact.
            </p>
          </CardContent>
        </Card>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={feature.title}
                  className="hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm bg-white/80 animate-fade-in-up border-2 hover:border-green-400"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <CardContent className="pt-6">
                    <div className="flex flex-col items-center text-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center mb-4 transform hover:scale-110 hover:rotate-6 transition-all duration-300">
                        <Icon className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="text-lg font-semibold mb-2 text-gray-900">{feature.title}</h3>
                      <p className="text-gray-600 text-sm">{feature.description}</p>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        <div className="mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center animate-fade-in">Tech Stack</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {techStack.map((tech, index) => (
              <Card
                key={tech.category}
                className="backdrop-blur-sm bg-white/80 hover:shadow-xl transition-all duration-300 hover:scale-105 animate-slide-in-left"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CardHeader>
                  <CardTitle className="text-xl flex items-center gap-2">
                    <Code className="w-5 h-5 text-blue-600" />
                    {tech.category}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {tech.items.map((item) => (
                      <li key={item} className="flex items-center gap-2 text-gray-700 hover:translate-x-2 transition-transform duration-200">
                        <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500"></div>
                        {item}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white relative overflow-hidden animate-fade-in shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <CardHeader className="relative z-10">
            <CardTitle className="text-2xl flex items-center gap-2">
              <Recycle className="w-6 h-6 animate-spin-slow" />
              Environmental Impact
            </CardTitle>
          </CardHeader>
          <CardContent className="relative z-10">
            <p className="mb-4 text-white/90">EcoPoint is designed to promote sustainable practices by:</p>
            <ul className="space-y-3">
              {impactPoints.map((point, index) => (
                <li
                  key={point}
                  className="flex items-start gap-3 animate-slide-in-right"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="w-6 h-6 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-0.5 hover:bg-white/30 transition-colors">
                    <Recycle className="w-4 h-4" />
                  </div>
                  <span className="text-white/95">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float-slow {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(10deg); }
        }
        @keyframes fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes fade-in-up {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes scale-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes slide-in-left {
          from { opacity: 0; transform: translateX(-30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes slide-in-right {
          from { opacity: 0; transform: translateX(30px); }
          to { opacity: 1; transform: translateX(0); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animate-float-slow {
          animation: float-slow 6s ease-in-out infinite;
        }
        .animate-fade-in {
          animation: fade-in 1s ease-out forwards;
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.8s ease-out forwards;
        }
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
        .animate-slide-in-left {
          animation: slide-in-left 0.8s ease-out forwards;
        }
        .animate-slide-in-right {
          animation: slide-in-right 0.5s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animate-spin-slow {
          animation: spin-slow 8s linear infinite;
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
      `}</style>
    </div>
  );
}
