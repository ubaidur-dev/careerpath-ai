import React from 'react';
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

export default function StudentDashboard({ onLogout, onNavigate }) {
  
  const stats = [
    { id: 1, label: 'Quizzes Completed', value: '3', icon: Target, iconColor: 'text-red-500', bgColor: 'bg-red-50' },
    { id: 2, label: 'Careers Explored', value: '12', icon: Search, iconColor: 'text-gray-600', bgColor: 'bg-gray-100' },
    { id: 3, label: 'Skills Assessed', value: '25', icon: Award, iconColor: 'text-amber-500', bgColor: 'bg-amber-50' },
    { id: 4, label: 'Hours Saved', value: '8', icon: Zap, iconColor: 'text-amber-400', bgColor: 'bg-amber-50' },
  ];

  // FIXED: No require(). Straight JavaScript object reference mapping.
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
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-sans antialiased">
      
      {/* YAHAN HUMNE NAYA HEADER CALL KIYA HAI */}
      <Header onNavigate={onNavigate} onLogout={onLogout} />

      {/* MAIN BODY */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div className="space-y-4 text-left">
          <div className="space-y-1">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-gray-900">Hello, Ahmed! 👋</h1>
            <p className="text-gray-500 text-base sm:text-lg">Ready to take the next step in your career journey?</p>
          </div>
          <button 
            type="button"
            onClick={() => {
              if(onNavigate) onNavigate('quiz');
            }}
            className="inline-flex items-center justify-center bg-[#bd24df] text-white font-semibold px-6 py-3 rounded-full shadow-md cursor-pointer hover:bg-[#a61fc5] transition"
          >
            🎯 Start Career Quiz
          </button>
        </div>

        {/* FOUR CARDS GRID */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {stats.map((stat) => {
            const IconComponent = stat.icon;
            return (
              <div key={stat.id} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center gap-5 text-left">
                <div className={`p-4 rounded-xl ${stat.bgColor} flex-shrink-0`}><IconComponent className={stat.iconColor} size={28} /></div>
                <div>
                  <div className="text-3xl font-bold text-gray-900 tracking-tight">{stat.value}</div>
                  <div className="text-sm font-medium text-gray-500 mt-0.5">{stat.label}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* SPLIT LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="lg:col-span-2 space-y-6">
            {/* Journey */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-6 text-left">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-bold text-gray-900">Your Career Journey</h2>
                <TrendingUp size={20} className="text-[#bd24df]" />
              </div>
              <div className="space-y-2">
                <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                  <div className="bg-[#bd24df] h-full rounded-full" style={{ width: '75%' }} />
                </div>
                <div className="text-right text-xs font-bold text-[#bd24df]">75%</div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-[#fcf5fe] p-4 rounded-xl border border-[#f5e6fa]">
                  <div className="text-2xl font-bold text-gray-900">87%</div>
                  <div className="text-xs font-medium text-gray-500 mt-0.5">Last Quiz Score</div>
                </div>
                <div className="bg-[#fcf5fe] p-4 rounded-xl border border-[#f5e6fa]">
                  <div className="text-2xl font-bold text-gray-900">5</div>
                  <div className="text-xs font-medium text-gray-500 mt-0.5">Matching Careers</div>
                </div>
              </div>
            </div>

            {/* Top Career Matches */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5 text-left">
              <h2 className="text-lg font-bold text-gray-900">Top Career Matches</h2>
              <div className="space-y-3">
                {careerMatches.map((career, index) => {
                  const CareerIcon = dynamicIconMap[career.iconKey] || Code2;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition cursor-pointer group border border-gray-100">
                      <div className="flex items-center gap-4">
                        <div className={`p-2.5 rounded-lg ${career.bgColor}`}><CareerIcon size={20} className="text-purple-600" /></div>
                        <div>
                          <div className="font-bold text-gray-900 text-sm">{career.title}</div>
                          <div className="text-xs font-semibold text-gray-500 mt-0.5">Match: <span className="text-[#bd24df]">{career.match}</span></div>
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
                className="w-full text-center py-3 border border-[#f2c6fa] text-[#bd24df] font-semibold text-sm rounded-xl hover:bg-[#fdf2ff] transition block cursor-pointer"
              >
                View All Recommendations
              </button>
            </div>
          </div>

          {/* RIGHT SIDEBAR */}
          <div className="space-y-6 text-left">
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-5">
              <h2 className="text-lg font-bold text-gray-900">Recent Activity</h2>
              <div className="space-y-5 relative before:absolute before:inset-y-1 before:left-[11px] before:w-[2px] before:bg-gray-100">
                {recentActivity.map((activity) => {
                  const ActivityIcon = activity.icon;
                  return (
                    <div key={activity.id} className="flex gap-4 relative items-start">
                      <div className="bg-white rounded-full p-0.5 z-10 text-blue-500 mt-0.5"><ActivityIcon size={20} className="fill-white" /></div>
                      <div className="space-y-0.5">
                        <p className="text-sm font-semibold text-gray-800 leading-snug">{activity.text}</p>
                        <span className="text-xs text-gray-400 font-medium">{activity.time}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* QUICK ACTIONS SECTION (Ab Hover Effects Completely Dynamic & Fixed!) */}
            <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4">
              <h2 className="text-lg font-bold text-gray-900">Quick Actions</h2>
              <div className="flex flex-col gap-2.5">
                
                {/* 1. Retake Assessment */}
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('quiz');
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Retake Assessment</span>
                  <RefreshCw size={16} className="text-gray-400 group-hover:text-[#bd24df] transition-colors" />
                </button>
                
                {/* 2. Browse Careers */}
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('browse');
                  }} 
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Browse Careers</span>
                  <ChevronRight size={16} className="text-gray-400 group-hover:text-[#bd24df] transition-colors" />
                </button>
                
                {/* 3. Update Profile */}
                <button 
                  type="button"
                  onClick={() => {
                    if(onNavigate) onNavigate('profile');
                  }}
                  className="w-full inline-flex items-center justify-between px-4 py-3 bg-gray-50 text-gray-700 hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc] text-sm font-semibold hover:font-bold rounded-xl border border-gray-100 cursor-pointer transition-all duration-200 group"
                >
                  <span>Update Profile</span>
                  <User size={16} className="text-gray-400 group-hover:text-[#bd24df] transition-colors" />
                </button>
                
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}