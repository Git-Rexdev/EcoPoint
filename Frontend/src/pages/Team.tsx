import { Card, CardContent } from '@/components/ui/card';
import { Github, Code, Heart, Leaf, Users, Sparkles, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function Team() {
  const developers = [
    {
      name: 'Manmohan',
      role: 'Developer',
      description: 'Full-stack developer passionate about creating sustainable technology solutions',
      github: 'Git-Rexdev',
      avatar: 'M',
      image: '/manmohan.jpg',           
    },
    {
      name: 'Piyush',
      role: 'Developer',
      description: 'Dedicated to building user-friendly applications that make a positive impact',
      github: 'ByteSmithTheDev',
      avatar: 'P',
      image: '/bytesmith.png',
    },
  ];

  const teamMembers = [
    {
      name: 'Akshit Parmar',
      role: 'Marketing Lead',
      description: 'Contributing to the EcoPoint project development and sustainability initiatives',
      github: '',
      avatar: 'AP',
      image: '/akshit.png',
    },
    {
      name: 'Vedant Gunda',
      role: 'Project Lead',
      description: 'Contributing to the EcoPoint project development and sustainability initiatives',
      github: '',
      avatar: 'VG',
    },
    {
      name: 'Sakshi Baldawa',
      role: 'Business Lead',
      description: 'Contributing to the EcoPoint project development and sustainability initiatives',
      github: '',
      avatar: 'SB',
      image: '/sakshi.jpg',
    },
    {
      name: 'Jacinth Jebaraj',
      role: 'Tech Lead',
      description: 'Contributing to the EcoPoint project development and sustainability initiatives',
      github: '',
      avatar: 'JJ',
    },
  ];

  const projectStats = [
    { label: 'Lines of Code', value: '10,000+' },
    { label: 'Components', value: '50+' },
    { label: 'Pages', value: '15+' },
    { label: 'Technologies', value: '20+' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 via-white to-blue-50 py-12 relative overflow-hidden">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-0 w-96 h-96 bg-green-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-1/4 right-0 w-96 h-96 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>

        <div className="absolute top-10 left-10 animate-float">
          <Star className="w-6 h-6 text-yellow-400 opacity-40" />
        </div>
        <div className="absolute top-1/4 right-20 animate-float animation-delay-2000">
          <Heart className="w-8 h-8 text-red-400 opacity-40" />
        </div>
        <div className="absolute bottom-1/3 left-1/4 animate-float animation-delay-3000">
          <Sparkles className="w-7 h-7 text-blue-400 opacity-40" />
        </div>
        <div className="absolute top-1/2 right-1/3 animate-float animation-delay-1000">
          <Code className="w-9 h-9 text-green-400 opacity-40" />
        </div>
        <div className="absolute bottom-20 right-10 animate-float animation-delay-4000">
          <Leaf className="w-6 h-6 text-emerald-400 opacity-40" />
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16 animate-fade-in-up">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Users className="w-10 h-10 text-green-600 animate-bounce-slow" />
            <h1 className="text-4xl font-bold text-gray-900">Our Team</h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Meet the passionate developers behind EcoPoint, working together to make waste management efficient and rewarding
          </p>
        </div>

        {/* Team Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Team</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-500 backdrop-blur-sm bg-white/90 hover:-translate-y-3 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 rounded-full mb-4 shadow-2xl animate-pulse-slow transform hover:rotate-6 transition-transform duration-300 overflow-hidden border-2 border-blue-500">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center text-white text-2xl font-bold">
                          {member.avatar}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                    <p className="text-blue-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Developers Section */}
        <div className="mb-16">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Developers</h2>
            <div className="w-20 h-1 bg-gradient-to-r from-green-500 to-blue-500 mx-auto rounded-full"></div>
          </div>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-2xl">
            {developers.map((member, index) => (
              <Card
                key={member.name}
                className="hover:shadow-2xl transition-all duration-500 border-2 hover:border-green-500 backdrop-blur-sm bg-white/90 hover:-translate-y-3 hover:scale-105 animate-scale-in"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                <CardContent className="pt-6">
                  <div className="flex flex-col items-center text-center h-full">
                    <div className="w-24 h-24 rounded-full mb-4 shadow-2xl animate-pulse-slow transform hover:rotate-6 transition-transform duration-300 overflow-hidden border-2 border-green-500">
                      {member.image ? (
                        <img 
                          src={member.image} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-500 via-emerald-500 to-blue-500 flex items-center justify-center text-white text-2xl font-bold">
                          {member.avatar}
                        </div>
                      )}
                    </div>
                    <h3 className="text-xl font-bold mb-2 text-gray-900">{member.name}</h3>
                    <p className="text-green-600 font-semibold mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm leading-relaxed mb-4">{member.description}</p>
                    {member.github && (
                      <a
                        href={`https://github.com/${member.github}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-auto"
                      >
                        <Button variant="outline" size="sm" className="gap-2 transform hover:scale-110 transition-all duration-300 hover:bg-green-50">
                          <Github className="w-3 h-3" />
                          @{member.github}
                        </Button>
                      </a>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {projectStats.map((stat, index) => (
            <Card
              key={stat.label}
              className="text-center hover:shadow-xl transition-all duration-300 hover:-translate-y-2 backdrop-blur-sm bg-white/80 animate-fade-in-up"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <CardContent className="pt-6">
                <div className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-blue-600 mb-2 animate-pulse-slow">
                  {stat.value}
                </div>
                <div className="text-sm text-gray-600">{stat.label}</div>
              </CardContent>
            </Card>
          ))}
        </div>

        <Card className="bg-gradient-to-r from-green-500 via-emerald-500 to-blue-500 text-white mb-12 relative overflow-hidden animate-fade-in shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent animate-shimmer"></div>
          <CardContent className="py-12 text-center relative z-10">
            <div className="flex items-center justify-center gap-2 mb-4">
              <Code className="w-8 h-8 animate-wiggle" />
              <h2 className="text-3xl font-bold">Built with Passion</h2>
              <Heart className="w-8 h-8 text-red-300 animate-heartbeat" />
            </div>
            <p className="text-xl mb-6 text-white/90 max-w-2xl mx-auto">
              EcoPoint represents countless hours of dedication to creating a platform that makes a real difference
              in waste management and environmental sustainability
            </p>
            <div className="flex items-center justify-center gap-3 text-white/95">
              <Leaf className="w-6 h-6 animate-wiggle animation-delay-1000" />
              <span className="text-lg font-semibold">Making Earth Green, One Line of Code at a Time</span>
            </div>
          </CardContent>
        </Card>

        <Card className="backdrop-blur-sm bg-white/90 shadow-xl hover:shadow-2xl transition-all duration-500 animate-scale-in">
          <CardContent className="py-8">
            <div className="text-center">
              <h3 className="text-2xl font-bold mb-4 text-gray-900 flex items-center justify-center gap-2">
                <Github className="w-6 h-6" />
                Open Source Project
              </h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                EcoPoint is an open-source project. We welcome contributions from developers who share our vision
                of creating sustainable technology solutions.
              </p>
              <a
                href="https://github.com/ByteSmithTheDev/EcoPoint-Frontend"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button size="lg" className="gap-2 transform hover:scale-110 transition-all duration-300 hover:shadow-xl">
                  <Github className="w-5 h-5" />
                  View on GitHub
                </Button>
              </a>
            </div>
          </CardContent>
        </Card>

        <div className="mt-12 text-center text-gray-500 text-sm animate-fade-in">
          <p>Copyright © 2025 RexDev & ByteSmith</p>
          <p className="mt-2">Licensed under the MIT License</p>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
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
          from { opacity: 0; transform: scale(0.9); }
          to { opacity: 1; transform: scale(1); }
        }
        @keyframes pulse-slow {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.9; transform: scale(1.05); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-10deg); }
          75% { transform: rotate(10deg); }
        }
        @keyframes heartbeat {
          0%, 100% { transform: scale(1); }
          25% { transform: scale(1.2); }
          50% { transform: scale(1); }
          75% { transform: scale(1.1); }
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
        .animate-scale-in {
          animation: scale-in 0.8s ease-out forwards;
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s ease-in-out infinite;
        }
        .animate-shimmer {
          animation: shimmer 3s infinite;
        }
        .animate-wiggle {
          animation: wiggle 2s ease-in-out infinite;
        }
        .animate-heartbeat {
          animation: heartbeat 1.5s ease-in-out infinite;
        }
        .animation-delay-1000 {
          animation-delay: 1s;
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
