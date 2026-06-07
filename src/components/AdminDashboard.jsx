import React, { useState } from 'react';
import ManageQuiz from './ManageQuiz';
import SystemSettings from './SystemSettings';

export default function AdminDashboard({ onLogout, onNavigateToResults }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAllStudents, setShowAllStudents] = useState(false);

  const studentsData = [
    { name: 'Sarah Johnson', email: 'sarah.j@gmail.com', score: 92, time: '5 min ago' },
    { name: 'Michael Chen', email: 'michael.c@email.com', score: 87, time: '12 min ago' },
    { name: 'Emma Williams', email: 'emma.w@email.com', score: 95, time: '25 min ago' },
    { name: 'Zain Ahmed', email: 'zain.ahmed@outlook.com', score: 82, time: '34 min ago' },
    { name: 'Fatima Ali', email: 'fatima.ali@gmail.com', score: 72, time: '41 min ago' },
    { name: 'David Miller', email: 'david.m@yahoo.com', score: 61, time: '55 min ago' },
    { name: 'Ayesha Khan', email: 'ayesha.k@hotmail.com', score: 97, time: '1 hr ago' },
    { name: 'James Wilson', email: 'james.w@gmail.com', score: 84, time: '2 hr ago' },
    { name: 'Omar Farooq', email: 'omar.f@gmail.com', score: 75, time: '3 hr ago' },
    { name: 'Ryan Garcia', email: 'ryan.g@tech.com', score: 65, time: '4 hr ago' },
  ];

  const displayedStudents = showAllStudents ? studentsData : studentsData.slice(0, 5);

  const getStatusDetails = (score) => {
    if (score >= 90) {
      return { 
        status: 'Completed', 
        classes: 'text-green-600 bg-green-50 border-green-200/40' 
      };
    } else if (score >= 80) {
      return { 
        status: 'Completed', 
        classes: 'text-[#9a6a16] bg-[#fdf8eb] border-[#f5e6c4]/50' 
      };
    } else if (score >= 70) {
      return { 
        status: 'In Progress', 
        classes: 'text-[#1d4ed8] bg-[#eff6ff] border-[#bfdbfe]/50' 
      };
    } else {
      return { 
        status: 'Error', 
        classes: 'text-[#dc2626] bg-[#fef2f2] border-[#fecaca]/50' 
      };
    }
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] flex flex-col font-sans text-[#111111] antialiased selection:bg-pink-200">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          
          <div 
            className="flex items-center select-none cursor-pointer" 
            onClick={() => setCurrentView('dashboard')}
          >
            <img 
              src="/logoo.png" 
              alt="CareerPath AI Logo" 
              className="h-12 sm:h-14 w-auto object-contain transition-transform hover:scale-105" 
            />
          </div>

          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => setCurrentView('dashboard')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border cursor-pointer transition-colors ${
                currentView === 'dashboard'
                  ? 'bg-[#fdf2ff] text-[#bd24df] border-[#f5dbfc]'
                  : 'bg-transparent text-gray-600 border-transparent hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <rect x="3" y="3" width="7" height="9" rx="1" />
                <rect x="14" y="3" width="7" height="5" rx="1" />
                <rect x="14" y="12" width="7" height="9" rx="1" />
                <rect x="3" y="16" width="7" height="5" rx="1" />
              </svg>
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            
            <div 
              className="flex items-center gap-2 text-gray-700 font-medium text-sm border-l border-r border-gray-200 px-4 cursor-pointer hover:text-[#bd24df] transition-colors"
              onClick={() => setCurrentView('settings')}
            >
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  <circle cx="12" cy="7" r="4" />
                </svg>
              </div>
              <span className="hidden sm:inline">Admin!</span>
            </div>
            
            <button 
              onClick={onLogout} 
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer bg-transparent border-none p-0"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-[1440px] w-full mx-auto p-4 sm:p-8 space-y-8 flex-1">
        
        {currentView === 'dashboard' && (
          <>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-100 pb-5">
              <div className="space-y-1">
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900">
                  Admin Dashboard
                </h1>
                <p className="text-xs sm:text-sm text-gray-500 font-medium">Manage your AI Career Advisor platform</p>
              </div>
              
              <button 
                onClick={() => setCurrentView('quiz')}
                className="bg-[#fff5fa] text-[#bd24df] border border-[#ff2299] px-7 py-3 rounded-full text-sm font-extrabold tracking-wide transition-all shadow-2xs hover:bg-[#fdecf7] flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap sm:self-center"
              >
                <svg className="w-4 h-4 text-[#bd24df]" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                  Add New Question
              </button>
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { title: 'Total Students', metric: '10,482', change: '12.5%', icon: '👥' },
                { title: 'Career Profiles', metric: '52', change: '+3', icon: '💼' },
                { title: 'Quiz Questions', metric: '245', change: '+15', icon: '📝' },
                { title: 'Assessments Today', metric: '127', change: '8.2%', icon: '📅' },
              ].map((card, key) => (
                <div key={key} className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl relative shadow-xs flex items-center gap-5 transition-transform hover:translate-y-[-2px]">
                  <span className="text-3xl sm:text-4xl filter drop-shadow-sm select-none">{card.icon}</span>
                  <div>
                    <div className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none flex items-center gap-2">
                      {card.metric}
                      <span className="text-[10px] font-bold bg-green-50 text-green-600 px-1.5 py-0.5 rounded-md">{card.change}</span>
                    </div>
                    <div className="text-xs font-bold text-gray-400 mt-1.5 tracking-wide uppercase">{card.title}</div>
                  </div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-5 shadow-xs">
                <div className="flex items-center justify-between border-b border-gray-50 pb-3">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-tight">Recent Student Activity</h3>
                  <button 
                    onClick={() => setShowAllStudents(!showAllStudents)} 
                    className="bg-[#fff5fa] border-[0.2px] border-[#ff2299] text-[#bd24df] hover:bg-[#fdecf7] px-4 py-1.5 rounded-full text-xs font-extrabold tracking-wide transition-all cursor-pointer whitespace-nowrap"
                  >
                    {showAllStudents ? 'View Less' : 'View All'}
                  </button>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="border-b border-gray-100 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                        <th className="pb-3.5 font-semibold">Student</th>
                        <th className="pb-3.5 font-semibold text-center">Score</th>
                        <th className="pb-3.5 font-semibold text-center">Status</th>
                        <th className="pb-3.5 font-semibold text-right">Time</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50 font-medium">
                      {displayedStudents.map((row, idx) => {
                        const ruleConfig = getStatusDetails(row.score);
                        return (
                          <tr key={idx} className="text-gray-700 hover:bg-gray-50/40 transition-colors">
                            <td className="py-4">
                              <div className="font-bold text-gray-900 text-base">{row.name}</div>
                              <div className="text-xs text-gray-400 font-normal mt-0.5">{row.email}</div>
                            </td>
                            <td className={`py-4 text-center font-black text-base transition-colors ${ruleConfig.classes.split(' ')[0]}`}>
                              {row.score}%
                            </td>
                            <td className="py-4 text-center">
                              <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-wide border border-transparent transition-all ${ruleConfig.classes}`}>
                                {ruleConfig.status}
                              </span>
                            </td>
                            <td className="py-4 text-right text-gray-400 font-normal text-sm">{row.time}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-4 shadow-2xs">
                  <h3 className="text-base font-bold text-gray-950 tracking-tight px-1">Quick Actions</h3>
                  <div className="space-y-1 text-sm font-medium">
                    
                    <button className="w-full bg-transparent hover:bg-[#fff0fa]/50 text-gray-600 hover:text-[#bd24df] py-2.5 px-4 rounded-xl text-left font-semibold flex items-center gap-3.5 transition-all duration-200 cursor-pointer group">
                      <svg className="w-[18px] h-[18px] text-gray-400 group-hover:text-[#bd24df] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-3V5a2 2 0 00-2-2H9a2 2 0 00-2-2v2H4a2 2 0 00-2-2v10a2 2 0 002 2h16a2 2 0 002-2V9a2 2 0 00-2-2z" />
                      </svg>
                      <span>Manage Careers</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView('quiz')}
                      className={`w-full py-2.5 px-4 rounded-xl text-left flex items-center gap-3.5 transition-all duration-200 cursor-pointer group ${
                        currentView === 'quiz'
                          ? 'bg-[#fff0fa] text-[#bd24df] font-bold'
                          : 'bg-transparent text-gray-600 hover:bg-[#fff0fa]/50 hover:text-[#bd24df] font-semibold'
                      }`}
                    >
                      <svg className={`w-[18px] h-[18px] transition-colors ${currentView === 'quiz' ? 'text-[#bd24df]' : 'text-gray-400 group-hover:text-[#bd24df]'}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2-2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                      </svg>
                      <span>Manage Quiz</span>
                    </button>

                    <button 
                      onClick={onNavigateToResults} 
                      className="w-full bg-transparent hover:bg-[#fff0fa]/50 text-gray-600 hover:text-[#bd24df] py-2.5 px-4 rounded-xl text-left font-semibold flex items-center gap-3.5 transition-all duration-200 cursor-pointer group"
                    >
                      <svg className="w-[18px] h-[18px] text-gray-400 group-hover:text-[#bd24df] transition-colors" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                      </svg>
                      <span>Students Results</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView('settings')}
                      className={`w-full py-2.5 px-4 rounded-xl text-left flex items-center gap-3.5 transition-all duration-200 cursor-pointer group ${
                        currentView === 'settings'
                          ? 'bg-[#fff0fa] text-[#bd24df] font-bold'
                          : 'bg-transparent text-gray-600 hover:bg-[#fff0fa]/50 hover:text-[#bd24df] font-semibold'
                      }`}
                    >
                      <svg className={`w-[18px] h-[18px] transition-colors ${currentView === 'settings' ? 'text-[#bd24df]' : 'text-gray-400 group-hover:text-[#bd24df]'}`} fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                      <span>Settings</span>
                    </button>

                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white border border-gray-100 rounded-2xl p-6 space-y-4.5 shadow-xs">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm sm:text-base font-bold text-gray-800 uppercase tracking-tight">Most Popular Careers</h3>
                  <svg className="w-5 h-5 text-blue-700" fill="currentColor" viewBox="0 0 24 24">
                    <rect x="3" y="16" width="3" height="4" rx="0.5" />
                    <rect x="8" y="12" width="3" height="8" rx="0.5" />
                    <rect x="13" y="8" width="3" height="12" rx="0.5" />
                    <rect x="18" y="3" width="3" height="17" rx="0.5" />
                  </svg>
                </div>

                <div className="space-y-4.5">
                  {[
                    { name: 'Software Developer', count: '3245 students', width: '90%' },
                    { name: 'Data Analyst', count: '2156 students', width: '68%' },
                    { name: 'UX Designer', count: '1834 students', width: '55%' },
                    { name: 'Business Analyst', count: '1523 students', width: '45%' },
                    { name: 'Digital Marketer', count: '1724 students', width: '50%' },
                    { name: 'AI / Machine Learning Engineer', count: '1412 students', width: '42%' },
                    { name: 'Cybersecurity Analyst', count: '1195 students', width: '35%' },
                    { name: 'Cloud Architect', count: '980 students', width: '28%' }
                  ].map((bar, i) => (
                    <div key={i} className="space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold text-gray-700">
                        <span className="font-bold text-sm sm:text-base text-gray-800">{bar.name}</span>
                        <span className="text-gray-400 font-normal text-xs sm:text-sm">{bar.count}</span>
                      </div>
                      <div className="w-full bg-gray-100 h-2.5 rounded-full overflow-hidden">
                        <div className="bg-[#f45ee4] h-full rounded-full transition-all duration-500" style={{ width: bar.width }}></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 shadow-xs">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight">System Health</h3>
                  <div className="bg-green-50 border border-green-100 p-4 rounded-xl">
                    <div className="text-xs text-green-700 font-bold flex items-center gap-1.5 uppercase tracking-wider">
                      <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span> System Status
                    </div>
                    <div className="text-xl font-black text-green-900 mt-1">Online</div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 text-xs font-bold">
                    <div className="bg-blue-50/50 p-3.5 rounded-xl border border-blue-100/30">
                      <div className="text-gray-400 font-semibold uppercase text-[10px]">Uptime</div>
                      <div className="text-base sm:text-lg font-black text-blue-900 mt-0.5">99.9%</div>
                    </div>
                    <div className="bg-purple-50/50 p-3.5 rounded-xl border border-purple-100/30">
                      <div className="text-gray-400 font-semibold uppercase text-[10px]">Response</div>
                      <div className="text-base sm:text-lg font-black text-purple-900 mt-0.5">245ms</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white border border-gray-100 rounded-2xl p-6 space-y-4 text-xs font-medium shadow-xs">
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-tight pb-1 border-b border-gray-50">This Month</h3>
                  {[
                    { name: 'New Students', total: '1,234' },
                    { name: 'Assessments', total: '3,456' },
                    { name: 'Avg. Score', total: '84%' },
                    { name: 'Completion Rate', total: '92%' },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center py-1 text-sm">
                      <span className="text-gray-500 font-medium">{m.name}</span>
                      <span className="font-extrabold text-gray-900">{m.total}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </>
        )}

        {currentView === 'quiz' && (
          <ManageQuiz onBack={() => setCurrentView('dashboard')} />
        )}

        {currentView === 'settings' && (
          <SystemSettings onBack={() => setCurrentView('dashboard')} />
        )}

      </main>
    </div>
  );
}