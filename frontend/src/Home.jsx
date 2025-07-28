import React, { useState, useEffect } from 'react';
import { ChevronRight, Users, Calendar, Settings, BarChart3, FileText, MessageSquare, Globe, Shield, Award } from 'lucide-react';

const Page = () => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [selectedPanel, setSelectedPanel] = useState(null);

  const panels = [
    {
      id: 1,
      title: 'Event Management',
      titleHindi: 'कार्यक्रम प्रबंधन',
      description: 'Organize and manage Congress events efficiently',
      icon: Calendar,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50'
    },
    {
      id: 2,
      title: 'Member Portal',
      titleHindi: 'सदस्य पोर्टल',
      description: 'Access member services and information',
      icon: Users,
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50'
    },
    {
      id: 3,
      title: 'Administration',
      titleHindi: 'प्रशासन',
      description: 'Administrative tools and controls',
      icon: Settings,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      id: 4,
      title: 'Analytics & Reports',
      titleHindi: 'विश्लेषण और रिपोर्ट',
      description: 'Data insights and performance metrics',
      icon: BarChart3,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      id: 5,
      title: 'Documentation',
      titleHindi: 'दस्तावेज़',
      description: 'Important documents and resources',
      icon: FileText,
      color: 'from-indigo-500 to-indigo-600',
      bgColor: 'bg-indigo-50'
    },
    {
      id: 6,
      title: 'Communication',
      titleHindi: 'संचार',
      description: 'Internal messaging and announcements',
      icon: MessageSquare,
      color: 'from-teal-500 to-teal-600',
      bgColor: 'bg-teal-50'
    }
  ];

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div style={{top:70}} className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-pulse" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full opacity-10 animate-spin" style={{ animationDuration: '30s' }} />
      </div>

      <header className="relative z-10 px-4 py-6">
        <div className="max-w-7xl mx-auto">
          <div className={`flex items-center justify-between transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : '-translate-y-10 opacity-0'}`}>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-400 via-white to-green-400 rounded-full flex items-center justify-center shadow-lg">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-inner">
                    <span className="text-sm font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">INC</span>
                  </div>
                </div>
                <div className="absolute inset-0 border-2 border-transparent border-t-orange-400 border-r-green-400 rounded-full animate-spin" style={{ animationDuration: '8s' }} />
              </div>
              <div className="hidden md:block">
                <h1 className="text-xl font-bold text-gray-800">Indian National Congress</h1>
                <p className="text-sm text-gray-600">भारतीय राष्ट्रीय कांग्रेस</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                <Globe className="w-5 h-5 text-gray-600" />
              </div>
              <div className="p-2 bg-white/80 backdrop-blur-sm rounded-full shadow-md hover:shadow-lg transition-shadow duration-300">
                <Shield className="w-5 h-5 text-gray-600" />
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="relative z-10 px-4 py-8">
        <div className="max-w-7xl mx-auto">
          
          <div className={`text-center mb-16 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            <div className="inline-block mb-6">
              <div className="p-4 bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20">
                <Award className="w-12 h-12 mx-auto mb-4 text-orange-500" />
                <h2 className="text-3xl md:text-5xl font-bold mb-4">
                  <span className="bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 bg-clip-text text-transparent">
                    भारतीय राष्ट्रीय कांग्रेस में
                  </span>
                </h2>
                <h3 className="text-2xl md:text-4xl font-bold text-green-600 mb-6">
                  आपका स्वागत है
                </h3>
                <div className="h-1 w-24 bg-gradient-to-r from-orange-400 to-green-400 rounded-full mx-auto" />
              </div>
            </div>
          </div>

          <div className={`transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
            {/* <div className="text-center mb-12">
              <h3 className="text-2xl md:text-3xl font-bold text-gray-800 mb-4">पैनल का चयन करें</h3>
              <p className="text-lg text-gray-600">Select Your Panel</p>
              <div className="mt-4 h-0.5 w-32 bg-gradient-to-r from-orange-400 to-green-400 rounded-full mx-auto" />
            </div> */}

            {/* <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {panels.map((panel, index) => {
                const IconComponent = panel.icon;
                return (
                  <div
                    key={panel.id}
                    className={`group relative bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-white/20 hover:shadow-2xl transform hover:-translate-y-2 transition-all duration-500 cursor-pointer ${panel.bgColor} hover:scale-105`}
                    style={{ animationDelay: `${index * 100}ms` }}
                    onClick={() => setSelectedPanel(panel.id)}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${panel.color} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-300`} />
                    
                    <div className={`w-16 h-16 bg-gradient-to-br ${panel.color} rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                      <IconComponent className="w-8 h-8 text-white" />
                    </div>

                    <h4 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-gray-900">
                      {panel.title}
                    </h4>
                    <h5 className="text-lg font-semibold text-gray-600 mb-3">
                      {panel.titleHindi}
                    </h5>
                    <p className="text-gray-600 mb-6 leading-relaxed">
                      {panel.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex space-x-1">
                        <div className={`w-2 h-2 bg-gradient-to-r ${panel.color} rounded-full`} />
                        <div className={`w-2 h-2 bg-gradient-to-r ${panel.color} rounded-full opacity-60`} />
                        <div className={`w-2 h-2 bg-gradient-to-r ${panel.color} rounded-full opacity-30`} />
                      </div>
                      <ChevronRight className={`w-6 h-6 text-gray-400 group-hover:text-gray-600 transform group-hover:translate-x-1 transition-all duration-300`} />
                    </div>

                    {selectedPanel === panel.id && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 bg-gradient-to-r from-orange-400 to-green-400 rounded-full flex items-center justify-center animate-pulse">
                        <div className="w-3 h-3 bg-white rounded-full" />
                      </div>
                    )}
                  </div>
                );
              })}
            </div> */}

            {/* {selectedPanel && ( */}
              <div className="text-center animate-fadeIn">
                <button className="group px-10 py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl">
                  <span className="flex items-center justify-center">
                    Admin Panel
                    <ChevronRight className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" />
                  </span>
                </button>
              </div>
            {/* )} */}
          </div>
        </div>
      </main>

      <footer className="relative z-10 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center">
            <div className="flex justify-center space-x-2 mb-4">
              <div className="w-3 h-3 bg-orange-400 rounded-full animate-bounce" />
              <div className="w-3 h-3 bg-white rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
              <div className="w-3 h-3 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
            </div>
            <p className="text-gray-600 text-sm">
              © 2025 Indian National Congress. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default Page;