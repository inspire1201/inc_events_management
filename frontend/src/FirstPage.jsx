

import React, { useState, useEffect } from 'react';

const FirstPage = ({ onStart }) => {
  const [isLoaded, setIsLoaded] = useState(false);
  const [particles, setParticles] = useState([]);

  useEffect(() => {
    setIsLoaded(true);
    
    const particleArray = [];
    for (let i = 0; i < 50; i++) {
      particleArray.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 4 + 1,
        duration: Math.random() * 20 + 10
      });
    }
    setParticles(particleArray);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-orange-50 via-white to-green-50">
      <div className="absolute inset-0 overflow-hidden">
        {particles.map((particle) => (
          <div
            key={particle.id}
            className="absolute w-1 h-1 bg-gradient-to-r from-orange-400 to-green-400 rounded-full opacity-30"
            style={{
              left: `${particle.x}%`,
              top: `${particle.y}%`,
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              animation: `float ${particle.duration}s ease-in-out infinite alternate`
            }}
          />
        ))}
      </div>

      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-br from-orange-200 to-orange-300 rounded-full opacity-20 animate-pulse" />
        <div className="absolute top-40 right-20 w-24 h-24 bg-gradient-to-br from-green-200 to-green-300 rounded-full opacity-20 animate-bounce" style={{ animationDuration: '3s' }} />
        <div className="absolute bottom-32 left-20 w-28 h-28 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full opacity-20 animate-pulse" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-20 right-10 w-36 h-36 bg-gradient-to-br from-orange-100 to-green-100 rounded-full opacity-30 animate-spin" style={{ animationDuration: '20s' }} />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        
        <div className={`transform transition-all duration-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="relative mb-8">
            <div className="w-24 h-24 mx-auto bg-gradient-to-br from-orange-400 via-white to-green-400 rounded-full flex items-center justify-center shadow-2xl transform hover:scale-110 transition-transform duration-300">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-inner">
                <span className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-green-600 bg-clip-text text-transparent">
                  INC
                </span>
              </div>
            </div>
            <div className="absolute inset-0 w-24 h-24 mx-auto border-2 border-transparent border-t-orange-400 border-r-green-400 rounded-full animate-spin" style={{ animationDuration: '4s' }} />
          </div>
        </div>

        <div className={`text-center mb-4 transform transition-all duration-1000 delay-300 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <h1 className="text-3xl md:text-5xl font-bold mb-4">
            <span className="block text-orange-600 mb-2 animate-fadeInUp">Welcome to</span>
            <span className="block bg-gradient-to-r from-orange-500 via-orange-600 to-green-600 bg-clip-text text-transparent animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
              Indian National Congress
            </span>
            <span className="block text-green-600 mt-2 animate-fadeInUp" style={{ animationDelay: '1s' }}>
              Party
            </span>
          </h1>
        </div>

        {/* <div className={`text-center mb-8 transform transition-all duration-1000 delay-500 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <p className="text-xl md:text-2xl text-blue-600 font-semibold mb-2">
            भारतीय कांग्रेस पार्टी में
          </p>
          <p className="text-lg md:text-xl text-blue-500">
            आपका स्वागत है
          </p>
        </div> */}

        <div className={`text-center mb-5 transform transition-all duration-1000 delay-700 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <div className="inline-block px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full shadow-lg border border-gray-200">
            <h2 className="text-lg md:text-xl font-semibold text-gray-700">
              Event Management System
            </h2>
          </div>
        </div>

        <div className={`transform transition-all duration-1000 delay-1000 ${isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
          <button onClick={onStart} className="group relative px-12 py-4 bg-gradient-to-r from-orange-500 to-green-600 text-white font-bold text-lg rounded-full shadow-2xl transform hover:scale-105 transition-all duration-300 hover:shadow-3xl overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-400 to-green-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-full blur-xl" />
            
            <span className="relative z-10 flex items-center justify-center">
              START
              <svg className="ml-2 w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
            
            <div className="absolute inset-0 rounded-full bg-white opacity-0 group-active:opacity-20 group-active:animate-ping" />
          </button>
        </div>

        <div className="absolute top-1/2 left-4 transform -translate-y-1/2">
          <div className="w-1 h-24 bg-gradient-to-b from-orange-400 to-green-400 rounded-full opacity-30 animate-pulse" />
        </div>
        <div className="absolute top-1/2 right-4 transform -translate-y-1/2">
          <div className="w-1 h-32 bg-gradient-to-b from-green-400 to-orange-400 rounded-full opacity-30 animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
      </div>

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="flex space-x-2 opacity-50">
          <div className="w-2 h-2 bg-orange-400 rounded-full animate-bounce" />
          <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 bg-blue-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>

      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(180deg); }
        }
        
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fadeInUp {
          animation: fadeInUp 0.8s ease-out forwards;
        }
        
        .shadow-3xl {
          box-shadow: 0 35px 60px -12px rgba(0, 0, 0, 0.25);
        }
      `}</style>
    </div>
  );
};

export default FirstPage;