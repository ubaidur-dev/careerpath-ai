import React, { useState, useEffect } from 'react';
import axios from 'axios';
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
  ArrowRight,
  Code2, 
  BarChart3, 
  PenTool,
  Briefcase,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity,
  HelpCircle,
  ListChecks,
  History
} from 'lucide-react';
import { getScoreColorClass } from '../utils/scoreColors';

const ICON_MAP = {
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  TrendingDown: TrendingUp,
  Target,
  Users: User,
  DollarSign: Award,
  Search,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity
};

const ACTIVITY_ICON = {
  account_created: GraduationCap,
  assessment_started: Target,
  assessment_completed: CheckCircle2,
  assessment_incomplete: HelpCircle,
};

const RenderCareerIcon = ({ iconName, size = 32 }) => {
  if (!iconName) {
    return <Code2 size={size} className="text-purple-600" />;
  }
  const IconComponent = ICON_MAP[iconName] || Code2;
  return <IconComponent size={size} className="text-purple-600" />;
};

export default function StudentDashboard({ onLogout, onNavigate, isFirstTimeLogin = true, user }) {
  const [renderOverlay, setRenderOverlay] = useState(() => {
    const hasSeenWelcome = sessionStorage.getItem('hasSeenWelcomeOverlay');
    return hasSeenWelcome !== 'true';
  });
  
  const [showWelcomeOverlay, setShowWelcomeOverlay] = useState(renderOverlay);
  const [greeting, setGreeting] = useState('Hello');
  const [careerMatches, setCareerMatches] = useState([
    { title: 'Software Development', match: '92%', icon: 'Code2' },
    { title: 'Data Science & AI', match: '87%', icon: 'BarChart3' },
    { title: 'Business & Marketing', match: '82%', icon: 'Briefcase' },
  ]);

  const currentUser = user || (() => {
    try {
      const stored = sessionStorage.getItem('user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  })();

  const rawName = currentUser?.name || 'Student';
  const firstName = rawName.trim().split(' ')[0] || 'Student';

  const fetchCareerMatches = () => {
    const token = sessionStorage.getItem('token');
    const showCatalogCareers = () => axios.get('http://localhost:8000/api/career-details', { params: { limit: 3 } })
      .then(res => {
        if (res.data && Array.isArray(res.data) && res.data.length > 0) {
          const topThree = res.data.slice(0, 3).map(c => ({
            ...c,
            match: c.match || '90%',
            icon: c.icon || c.iconText || 'Code2'
          }));
          setCareerMatches(topThree);
        }
      })
      .catch(err => {
        console.error("Error fetching dynamic career matches for dashboard:", err);
      });

    if (!token) {
      showCatalogCareers();
      return;
    }
    axios.get('/quiz/latest-result', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        const matches = Array.isArray(res.data?.recommendations) ? res.data.recommendations : [];
        if (matches.length === 0) {
          showCatalogCareers();
          return;
        }
        setCareerMatches(matches.map(m => ({
          ...m.career,
          match: `${m.match}% Match`,
          icon: m.career?.icon || 'Code2'
        })));
      })
      .catch(() => showCatalogCareers());
  };

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

    fetchCareerMatches();

    const careerChannel = new BroadcastChannel('career_updates_channel');
    careerChannel.onmessage = (event) => {
      if (event.data === 'refresh_careers') {
        fetchCareerMatches();
      }
    };

    const handleInstantSync = () => fetchCareerMatches();
    window.addEventListener('careerDataUpdated', handleInstantSync);
    window.addEventListener('storage', handleInstantSync);
    window.addEventListener('focus', handleInstantSync);
    const syncInterval = setInterval(fetchCareerMatches, 500);

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
        careerChannel.close();
        window.removeEventListener('careerDataUpdated', handleInstantSync);
        window.removeEventListener('storage', handleInstantSync);
        window.removeEventListener('focus', handleInstantSync);
        clearInterval(syncInterval);
      };
    }

    return () => {
      careerChannel.close();
      window.removeEventListener('careerDataUpdated', handleInstantSync);
      window.removeEventListener('storage', handleInstantSync);
      window.removeEventListener('focus', handleInstantSync);
      clearInterval(syncInterval);
    };
  }, [renderOverlay]);

  const handleEnhancedLogout = () => {
    sessionStorage.removeItem('hasSeenWelcomeOverlay');
    if (onLogout) onLogout();
  };

  const [dashboardStats, setDashboardStats] = useState({
    quizzesCompleted: 0,
    careersExplored: 0,
    skillsAssessed: 0,
    activeSecondsToday: 0,
    lastQuizScore: null,
    averageScore: null,
    matchingCareers: 0,
    lastMatchingCareers: 0,
  });

  const formatActiveTime = (totalSeconds) => {
    const minutes = Math.floor((totalSeconds || 0) / 60);
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    return `${hours} ${hours === 1 ? 'hour' : 'hours'}`;
  };

  const stats = [
    { id: 1, label: 'Quizzes Completed', value: String(dashboardStats.quizzesCompleted), emoji: '🎯' },
    { id: 2, label: 'Careers Explored', value: String(dashboardStats.careersExplored), emoji: '🔍' },
    { id: 3, label: 'Skills Assessed', value: String(dashboardStats.skillsAssessed), emoji: '🥇' },
    { id: 4, label: "Today's Active Time", value: formatActiveTime(dashboardStats.activeSecondsToday), emoji: '⚡' },
  ];

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return undefined;
    const authHeaders = { headers: { Authorization: `Bearer ${token}` } };

    const fetchDashboardStats = () => {
      axios.get('/student/dashboard-stats', authHeaders)
        .then(res => setDashboardStats((prev) => ({ ...prev, ...res.data })))
        .catch(() => {});
    };
    fetchDashboardStats();
    const statsInterval = setInterval(fetchDashboardStats, 3000);

    return () => {
      clearInterval(statsInterval);
    };
  }, []);

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const fetchRecentActivity = () => {
      axios.get('/student/activity', { headers: { Authorization: `Bearer ${token}` } })
        .then(res => setRecentActivity(Array.isArray(res.data?.activity) ? res.data.activity : []))
        .catch(() => {});
    };

    fetchRecentActivity();
    const activityInterval = setInterval(fetchRecentActivity, 5000);
    return () => clearInterval(activityInterval);
  }, []);

  return (
    <div className="relative min-h-screen bg-[#fcf8fe] text-gray-800 font-inter antialiased">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
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
          .custom-card-shadow {
            box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25);
          }
          .figma-section-shadow {
            box-shadow: 0px 3px 3px rgba(0, 0, 0, 0.25);
          }
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
          className={`fixed inset-0 m-0! z-50 flex flex-col items-center justify-center bg-[#fcf8fe]/95 backdrop-blur-md transition-opacity duration-500 ease-in-out ${
            showWelcomeOverlay ? 'opacity-100' : 'opacity-0 pointer-events-none'
          }`}
        >
          <div className="text-center space-y-6 px-6 max-w-2xl mx-auto w-full flex flex-col items-center">
            <div className="text-6xl sm:text-7xl inline-block animate-overlay-wave select-none mb-2">
              👋🏼
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-gray-900 leading-tight font-inter">
              {greeting}, {firstName}!
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
      
      <Header onNavigate={onNavigate} onLogout={handleEnhancedLogout} userRole="student" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 space-y-8">
        <div className="space-y-7 text-left">
          <div className="space-y-2"> 
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Hello, {firstName}! <span className="select-none">👋🏼</span>
            </h1>
            <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
              Ready to take the next step in your career journey?
            </p>
          </div>
          
          <button 
            type="button"
            onClick={() => {
              if(onNavigate) onNavigate('quiz');
            }}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-full cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center"
          >
            <span className="mr-2 text-3xl filter drop-shadow-sm flex-shrink-0">🎯</span> 
            <span className="leading-none">Start Career Quiz</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => (
            <div 
              key={stat.id} 
              className="bg-white h-[145px] w-full px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
            >
              <div className="text-[45px] select-none flex-shrink-0 filter drop-shadow-sm flex items-center justify-center">
                {stat.emoji}
              </div>
              <div className="flex flex-col justify-center">
                <div
                  className="text-gray-900 tracking-tight leading-tight"
                  style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
                >
                  {stat.id === 4 ? (
                    <>
                      <span className="text-[36px] font-bold">{stat.value.split(' ')[0]}</span>{' '}
                      <span className="text-[28px] font-bold">{stat.value.split(' ').slice(1).join(' ')}</span>
                    </>
                  ) : (
                    <span className="text-[36px] font-bold">{stat.value}</span>
                  )}
                </div>
                <div className="text-[15px] font-normal text-[#545454] mt-[2px]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10 items-start">
          <div className="lg:col-span-7 xl:col-span-8 space-y-8 text-left">
            <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">Your Career Journey</h2>
                <TrendingUp size={32} strokeWidth={2.5} className="text-[#635BFF]" />
              </div>
              <div className="space-y-2 mb-8">
                <div className="flex justify-between items-center">
                  <span className="text-[#000000] text-[16px] font-regular">Overall Score</span>
                  <span className="text-[16px] text-[#545454] font-[400] transition-all duration-700 ease-out">
                    {dashboardStats.averageScore ?? 0}%
                  </span>
                </div>
                <div className="w-full h-[12px] bg-[#D9D9D9] rounded-full overflow-hidden">
                  <div
                    style={{ width: `${dashboardStats.averageScore ?? 0}%` }}
                    className="bg-[#F45EE4] h-full rounded-full transition-all duration-1000"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div style={{ backgroundColor: '#F3E4FF' }} className="p-4 rounded-2xl">
                  <div className="text-[#000000] text-[16px] font-regular mb-0.5">Last Assessment Score</div>
                  <div className="text-[22px] font-semibold text-[#7E06AD] transition-all duration-500">
                    {dashboardStats.lastQuizScore !== null ? `${dashboardStats.lastQuizScore}%` : '—'}
                  </div>
                </div>
                <div style={{ backgroundColor: '#FFE4FF' }} className="p-4 rounded-2xl">
                  <div className="text-[#000000] text-[16px] font-regular mb-0.5">Matching Careers</div>
                  <div className="text-[22px] font-semibold text-[#7E06AD] transition-all duration-500">
                    {dashboardStats.lastMatchingCareers}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
              <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-8">Top Career Matches</h2>
              <div className="space-y-4">
                {careerMatches.map((career, index) => {
                  const cleanMatchNumber = career.match ? career.match.replace(/match/gi, '').replace('%', '').trim() : '90';
                  return (
                    <div
                      key={index}
                      onClick={() => { if (onNavigate) onNavigate('details', career); }}
                      className="flex items-center justify-between p-5 bg-gray-50 hover:bg-gray-100 rounded-2xl transition cursor-pointer group border border-gray-100"
                    >
                      <div className="flex items-center gap-4">
                        <div className="flex items-center justify-center">
                          <RenderCareerIcon iconName={career.icon} size={32} />
                        </div>
                        <div>
                          <div style={{ color: '#BE007F' }} className="text-[18px] font-medium">{career.title}</div>
                          <div className="text-[#545454] text-[16px] font-regular mt-0.5">
                            Match: <span className={`font-semibold ${getScoreColorClass(cleanMatchNumber)}`}>{cleanMatchNumber}%</span>
                          </div>
                        </div>
                      </div>
                      <ArrowRight size={22} className="text-indigo-600 group-hover:text-[#890080] transition-colors" />
                    </div>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => {
                  if(onNavigate) onNavigate('browse');
                }}
                className="w-fit mx-auto mt-8 py-3 px-16 border border-[#F45EE4]/40 bg-[#FFE1FD] text-[#890080] hover:bg-[#fae6f4] text-center text-[18px] font-regular rounded-xl block cursor-pointer shadow-sm transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95"
              >
                View All Recommendations
              </button>
            </div>
          </div>

          <div className="lg:col-span-5 xl:col-span-4 space-y-8 text-left">
            <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
              <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-9">Quick Actions</h2>
              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('quiz');
                  }}
                  className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                >
                  <RefreshCw size={25} strokeWidth={2} />
                  <span className="text-[21px]">Retake Assessment</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('browse');
                  }}
                  className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                >
                  <Briefcase size={25} strokeWidth={2} />
                  <span className="text-[21px]">Browse Careers</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('profile');
                  }}
                  className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                >
                  <User size={25} strokeWidth={2} />
                  <span className="text-[21px]">Update Profile</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('roadmap');
                  }}
                  className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                >
                  <ListChecks size={25} strokeWidth={2} />
                  <span className="text-[21px]">My Learning Progress</span>
                </button>
                <button
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('assessment-history');
                  }}
                  className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                >
                  <History size={25} strokeWidth={2} />
                  <span className="text-[21px]">My Assessment History</span>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
              <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-8">Recent Activity</h2>
              <div className="space-y-6 relative before:absolute before:inset-y-1 before:left-[15px] before:w-[2px] before:bg-gray-100">
                {recentActivity.length > 0 ? recentActivity.map((activity, idx) => {
                  const ActivityIcon = ACTIVITY_ICON[activity.type] || Activity;
                  return (
                    <div key={`${activity.type}-${activity.timestamp}-${idx}`} className="flex gap-4 relative items-start">
                      <div className="bg-white rounded-full p-0.5 z-10 text-indigo-600 mt-0.5">
                        <ActivityIcon size={28} className="fill-white" />
                      </div>
                      <div className="space-y-0.5">
                        <p className="text-gray-800 text-[16px] font-normal leading-snug">{activity.text}</p>
                        <span className="text-[#777777] text-[14px] font-normal">{activity.time}</span>
                      </div>
                    </div>
                  );
                }) : (
                  <p className="text-[#777777] text-[14px] font-normal pl-1">No activity yet — take your Career Assessment to get started.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}