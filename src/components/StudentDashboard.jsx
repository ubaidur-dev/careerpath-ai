import React, { useState, useEffect } from 'react';
import Header from './Header';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Target, 
  Search, 
  Award, 
  Zap, 
  TrendingUp, 
  CheckCircle2, 
  BookOpen, 
  RefreshCw, 
  ChevronRight,
  Code2, 
  BarChart3, 
  PenTool 
} from 'lucide-react';

export default function StudentDashboard({ onLogout, onNavigate, isFirstTimeLogin = true }) {
  const [renderOverlay, setRenderOverlay] = useState(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcomeOverlay');
    return hasSeenWelcome !== 'true';
  });
  
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(renderOverlay);
  const [greeting, setGreeting] = useState('Hello');

  useEffect(() => {
    const currentHour = new Date().getHours();
    if (currentHour >= 5 && currentHour < 12) {
      setGreeting('Good Morning');
    } else if (currentHour >= 12 && currentHour < 17) {
      setGreeting('Good Afternoon');
    } else if (currentHour >= 17 && currentHour < 21) {
      setGreeting('Good Evening');
    } else {
      setGreeting('Good Night');
    }

    if (renderOverlay) {
      const fadeTimeout = setTimeout(() => {
        setShowWelcomeOverlay(false);
      }, 3000);

      const removeTimeout = setTimeout(() => {
        setRenderOverlay(false);
        sessionStorage.setItem('hasSeenWelcomeOverlay', 'true');
      }, 3500);

      return () => {
        clearTimeout(fadeTimeout);
        clearTimeout(removeTimeout);
      };
    }
  }, [renderOverlay]);

  const handleEnhancedLogout = () => {
    sessionStorage.removeItem('hasSeenWelcomeOverlay');
    if (onLogout) onLogout();
  };

  const stats = [
    { id: 1, label: 'Quizzes Completed', value: '3', emoji: '🎯' },
    { id: 2, label: 'Careers Explored', value: '12', emoji: '🔍' },
    { id: 3, label: 'Skills Assessed', value: '25', emoji: '🥇' },
    { id: 4, label: 'Hours Saved', value: '8', emoji: '⚡' },
  ];

  const dynamicIconMap = {
    'Software Developer': Code2,
    'Data Analyst': BarChart3,
    'UX Designer': PenTool,
  };

  const careerMatches = [
    { title: 'Software Developer', match: '92%', iconKey: 'Software Developer', bgColor: 'bg-purple-50' },
    { title: 'Data Analyst', match: '87%', iconKey: 'Data Analyst', bgColor: 'bg-purple-50' },
    { title: 'UX Designer', match: '82%', iconKey: 'UX Designer', bgColor: 'bg-purple-50' },
  ];

  const recentActivity = [
    { id: 1, text: 'Completed Career Assessment', time: '2 hours ago', icon: CheckCircle2 },
    { id: 2, text: 'Viewed Software Developer Path', time: '1 day ago', icon: BookOpen },
    { id: 3, text: 'Updated Profile Skills', time: '3 days ago', icon: User },
  ];

  return (
    <div className="relative min-h-screen bg-[#fcf8fe] text-gray-800 font-inter antialiased">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
          .custom-recommendation-btn {
            border: 0.7px solid #FF34DC;
            color: #890080;
          }
          
          /* Figma Drop Shadow Config (x:4, y:4, blur:4) with Smooth Opacity */
          .figma-drop-shadow {
            box-shadow: 4px 4px 4px rgba(0, 0, 0, 0.06);
          }
          
          /* Full Screen Overlay Hand Wave Animation */
          @keyframes overlayWave {
            0% { transform: rotate( 0.0deg) }
            15% { transform: rotate(14.0deg) }
            30% { transform: rotate(-8.0deg) }
            45% { transform: rotate(14.0deg) }
            60% { transform: rotate(-4.0deg) }
            75% { transform: rotate(10.0deg) }
            100% { transform: rotate( 0.0deg) }
          }
          .animate-overlay-wave {
            animation: overlayWave 1.5s ease-in-out infinite;
            transform-origin: 70% 70%;
          }

          /* Smooth CSS Loading Strip Bar Animation */
          @keyframes loadStrip {
            0% { width: 0%; }
            100% { width: 100%; }
          }
          .animate-loading-strip {
            animation: loadStrip 3s cubic-bezier(0.4, 0, 0.2, 1) forwards;
          }
        `}
      </style>

      {renderOverlay && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#fcf8fe]/95 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            showWelcomeOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center space-y-6 px-6 max-w-2xl mx-auto w-full flex flex-col items-center">
            <div className="text-6xl sm:text-7xl inline-block animate-overlay-wave select-none mb-2">
              👋🏼
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight font-inter">
              {greeting}, Ahmed!
            </h2>
            
            <div className="space-y-3 max-w-lg mx-auto">
              <p className="text-[#D200AD] text-base sm:text-lg md:text-xl font-semibold tracking-wide font-inter">
                You are exactly where you need to be.
              </p>
              <p className="text-gray-600 text-sm sm:text-base md:text-lg font-medium leading-relaxed font-inter">
                Welcome to your real-time career counseling platform—a dedicated space built to understand your true potential, clear your doubts, and craft the most beautiful path for your future success.
              </p>
            </div>
            
            <div className="w-full max-w-xs bg-gray-200 h-1.5 rounded-full overflow-hidden mt-6 shadow-inner">
              <div 
                style={{ backgroundColor: '#83047A' }} 
                className="h-full rounded-full animate-loading-strip"
              />
            </div>
          </div>
        </div>
      )}
      
      <Header onNavigate={onNavigate} onLogout={handleEnhancedLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Hello, Ahmed! <span className="select-none">👋🏼</span>
            </h1>
            <p className="text-gray-500 text-base sm:text-lg">Ready to take the next step in your career journey?</p>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              if(onNavigate) onNavigate('quiz');
            }}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className="inline-flex items-center justify-center font-medium text-xl px-5 py-2 rounded-full cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center"
          >
            <span className="mr-1.5 text-2xl filter drop-shadow-sm flex-shrink-0">🎯</span> 
            <span className="leading-none">Start Career Quiz</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            return (
              <div key={stat.id} className="bg-white py-8 px-6 rounded-[25px] prototype-card-border figma-drop-shadow flex items-center gap-5 text-left">
                <div className="text-5xl select-none flex-shrink-0 filter drop-shadow-sm">
                  {stat.emoji}
                </div>
                <div>
                  <div className="text-4xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="text-base font-medium text-gray-500 mt-1">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            
            <div className="bg-white p-6 rounded-[25px] prototype-card-border figma-drop-shadow space-y-5 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-xl font-semibold text-gray-900">Your Career Journey</h2>
                <TrendingUp size={24} strokeWidth={2.5} className="text-indigo-600" />
              </div>
              
              <div className="space-y-1.5">
                <div className="flex justify-end">
                  <span style={{ color: '#83047A' }} className="text-sm font-normal">75%</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div style={{ backgroundColor: '#83047A', width: '75%' }} className="h-full rounded-full" />
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
                <div style={{ backgroundColor: '#F3E4FF' }} className="p-4 rounded-[20px] border border-[#e2ccf0]">
                  <div className="text-2xl font-bold text-gray-900">87%</div>
                  <div className="text-xs font-medium text-gray-500 mt-0.5">Last Quiz Score</div>
                </div>
                <div style={{ backgroundColor: '#FFE4FF' }} className="p-4 rounded-[20px] border border-[#f5ccf5]">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-xs font-medium text-gray-500 mt-0.5">Matching Careers</div>
                </div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-[25px] prototype-card-border figma-drop-shadow space-y-5 text-left">
              <h2 className="text-xl font-semibold text-gray-900">Top Career Matches</h2>
              <div className="space-y-3">
                {careerMatches.map((career, index) => {
                  const CareerIcon = dynamicIconMap[career.iconKey] || Code2;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer group border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-3 rounded-xl ${career.bgColor}`}><CareerIcon size={26} className="text-purple-600" /></div>
                        <div>
                          <div style={{ color: '#BE007F' }} className="font-semibold text-base">{career.title}</div>
                          <div className="text-sm font-semibold text-black mt-0.5">Match: {career.match}</div>
                        </div>
                      </div>
                      <ChevronRight size={18} className="text-gray-400 group-hover:text-[#bd24df]" />
                    </div>
                  );
                })}
              </div>
              
              <button 
                type="button"
                onClick={() => {
                  if(onNavigate) onNavigate('browse');
                }} 
                className="w-full text-center py-3 custom-recommendation-btn font-semibold text-sm rounded-xl hover:bg-[#fdf2ff] transition block cursor-pointer"
              >
                View All Recommendations
              </button>
            </div>
          </div>

          <div className="space-y-6 text-left">
            
            <div className="bg-white p-6 rounded-[25px] prototype-card-border figma-drop-shadow space-y-5">
              <h2 className="text-xl font-semibold text-gray-900">Recent Activity</h2>
              <div className="space-y-5 relative before:absolute before:inset-y-1 before:left-[11px] before:w-[2px] before:bg-gray-100">
                {recentActivity.map((activity) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-4 relative items-start">
                      <div className="bg-white rounded-full p-0.5 z-10 text-indigo-600 mt-0.5">
                        <ActivityIcon size={20} className="fill-white" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{activity.text}</p>
                        <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="bg-white p-6 rounded-[25px] prototype-card-border figma-drop-shadow space-y-4">
              <h2 className="text-xl font-semibold text-gray-900">Quick Actions</h2>
              <div className="flex flex-col gap-2.5">
                
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('quiz');
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#FFE1FD] hover:text-[#890080] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Retake Assessment</span>
                  <RefreshCw size={16} className="text-gray-400 group-hover:text-[#890080] transition-colors" />
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('browse');
                  }} 
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#FFE1FD] hover:text-[#890080] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Browse Careers</span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#890080] transition-colors" />
                </button>
                
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('profile');
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#FFE1FD] hover:text-[#890080] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Update Profile</span>
                  <User size={16} className="text-gray-400 group-hover:text-[#890080] transition-colors" />
                </button>
                
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}
