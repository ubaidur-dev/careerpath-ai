import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Header from './Header'; 
import ManageQuiz from './ManageQuiz';
import SystemSettings from './SystemSettings';
import ManageCareers from './ManageCareers';
import TotalStudents from './TotalStudents';
import RecentActivity from './RecentActivity';
import { Plus, Briefcase, ClipboardList, FileText, Settings, LayoutDashboard, Users, Activity, Search, Filter, RotateCcw } from 'lucide-react';
import { getScoreColorClass } from '../utils/scoreColors';

export default function AdminDashboard({ onLogout, onNavigateToResults, initialView = 'dashboard', onInitialViewConsumed }) {
  const [currentView, setCurrentView] = useState(initialView);

  useEffect(() => {
    if (onInitialViewConsumed) onInitialViewConsumed();
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentView]);

  const [showAllStudents, setShowAllStudents] = useState(false);
  const [careerSearch, setCareerSearch] = useState('');
  const [careerPage, setCareerPage] = useState(1);
  const POPULAR_LIMIT = 10;
  
  const [dashboardData, setDashboardData] = useState({
    stats: { students: '0', careers: '0', questions: '0', today: '0' },
    recentActivity: [],
    popularCareers: [],
    thisMonth: [],
    systemHealth: { status: 'Loading...', uptime: '-', responseTime: '-' }
  });

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/admin/dashboard-stats');
        
        const apiStats = response.data.stats || [];
        let mappedStats = { students: '0', careers: '0', questions: '0', today: '0' };

        if (Array.isArray(apiStats)) {
          mappedStats = {
            students: apiStats[0]?.value ?? '0',
            careers: apiStats[1]?.value ?? '0',
            questions: apiStats[2]?.value ?? '0',
            today: apiStats[3]?.value ?? '0'
          };
        }

        setDashboardData({
          stats: mappedStats,
          recentActivity: response.data.recentActivity || [],
          popularCareers: response.data.popularCareers || [],
          thisMonth: response.data.thisMonth || [],
          systemHealth: response.data.systemHealth || { status: 'Online', uptime: '99.9%', responseTime: '180ms' }
        });

      } catch (error) {
        console.error("Error fetching dashboard stats:", error);
      }
    };

    fetchDashboardData();

    const intervalId = setInterval(() => {
      fetchDashboardData();
    }, 5000);

    return () => clearInterval(intervalId);
  }, []);

  const displayedStudents = showAllStudents
    ? dashboardData.recentActivity
    : dashboardData.recentActivity.slice(0, 10);

  const getStatusDetails = (score, apiStatus) => {
    if (apiStatus === 'New Student') return { status: 'New Student', scoreColor: 'text-[#7E06AD]', pillClasses: 'text-[#7E06AD] bg-[#F9EDFF]' };
    if (apiStatus === 'In Progress') return { status: 'In Progress', scoreColor: 'text-[#0047FF]', pillClasses: 'text-[#E88B00] bg-[#FFF2E0]' };
    if (apiStatus === 'Error') return { status: 'Error', scoreColor: 'text-red-500', pillClasses: 'text-red-600 bg-red-50' };
    return { status: 'Completed', scoreColor: getScoreColorClass(score), pillClasses: 'text-[#05A660] bg-[#E3F6ED]' };
  };

  const getInitials = (name) => {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name.substring(0, 2).toUpperCase();
  };

  const staticTopBoxes = [
    { id: 1, label: 'Total Students', value: dashboardData.stats.students, emoji: '👥', trend: '+12%' },
    { id: 2, label: 'Career Profiles', value: dashboardData.stats.careers, emoji: '💼', trend: '+5%' },
    { id: 3, label: 'Quiz Questions', value: dashboardData.stats.questions, emoji: '📝', trend: '+18%' },
    { id: 4, label: 'Assessments Today', value: dashboardData.stats.today, emoji: '📅', trend: '+8%' },
  ];

  return (
    <div className="relative min-h-screen bg-[#fcf8fe] text-gray-800 antialiased selection:bg-pink-200">
      <style>
        {`
          .custom-quiz-border { border: 0.7px solid #FF00D3; }
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          .custom-card-shadow { box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25); }
        `}
      </style>

      <Header
        currentView={currentView}
        onLogout={onLogout}
        onNavigate={(target) => (target === 'results' ? onNavigateToResults && onNavigateToResults() : setCurrentView(target))}
        userRole="admin"
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {currentView === 'dashboard' && (
          <>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
              <div className="space-y-2"> 
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
                  Admin Dashboard
                </h1>
                <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
                  Manage your AI Career Advisor platform
                </p>
              </div>
              
              <button 
                type="button"
                onClick={() => setCurrentView('quiz')}
                style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center sm:self-center"
              >
                <Plus size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
                <span className="leading-none">Add New Question</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
              {staticTopBoxes.map((stat) => (
                <div 
                  key={stat.id} 
                  className="relative bg-white h-[145px] w-full max-w-[303px] px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
                >
                  <div className="absolute top-5 right-5 text-[#05A660] bg-[#E3F6ED] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
                    {stat.trend}
                  </div>

                  <div className="text-[45px] select-none flex-shrink-0 filter drop-shadow-sm flex items-center justify-center">
                    {stat.emoji}
                  </div>
                  
                  <div className="flex flex-col justify-center mt-2">
                    <div 
                      className="text-[36px] font-bold text-gray-900 tracking-tight leading-tight"
                      style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
                    >
                      {stat.value}
                    </div>
                    <div className="text-[15px] font-normal text-[#545454] mt-[2px]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>            
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                
                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">Recent Student Activity</h2>
                    <button 
                      onClick={() => setShowAllStudents(!showAllStudents)} 
                      className="w-[109px] h-[43px] border border-[#F45EE4]/40 bg-[#FFE1FD] text-[#890080] hover:bg-[#fae6f4] inline-flex items-center justify-center text-center rounded-xl text-[18px] font-regular transition-all cursor-pointer whitespace-nowrap"
                    >
                      {showAllStudents ? 'View Less' : 'View All'}
                    </button>
                  </div>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full text-left">
                      <thead>
                        <tr className="border-b border-gray-100">
                          <th className="pb-4 text-gray-500 font-normal text-[16px] w-[40%]">Student</th>
                          <th className="pb-4 text-gray-500 font-normal text-[16px] w-[20%] text-center">Score</th>
                          <th className="pb-4 text-gray-500 font-normal text-[16px] w-[20%] text-center">Status</th>
                          <th className="pb-4 text-gray-500 font-normal text-[16px] w-[20%] text-right">Time</th>
                        </tr>
                      </thead>
                      <tbody>
                        {displayedStudents.length > 0 ? displayedStudents.map((row, idx) => {
                          const ruleConfig = getStatusDetails(row.score, row.status);
                          return (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                              <td className="py-5">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-full bg-[#F7E8FF] text-[#890080] text-[13px] font-semibold flex items-center justify-center overflow-hidden flex-shrink-0">
                                    {row.avatar ? (
                                      <img src={row.avatar} alt={row.name} className="w-full h-full object-cover" />
                                    ) : (
                                      getInitials(row.name)
                                    )}
                                  </div>
                                  <div>
                                    <div className="text-[#111827] text-[18px] font-medium">{row.name}</div>
                                    <div className="text-[#545454] text-[16px] font-regular mt-0.5">{row.email}</div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-5 text-center">
                                <span className={`font-semibold text-[22px] ${ruleConfig.scoreColor}`}>
                                  {typeof row.score === 'number' ? `${row.score}%` : '—'}
                                </span>
                              </td>
                              <td className="py-5 text-center">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-medium tracking-wide ${ruleConfig.pillClasses}`}>
                                  {ruleConfig.status}
                                </span>
                              </td>
                              <td className="py-5 text-right text-[#545454] text-[16px] font-regular">
                                {row.time}
                              </td>
                            </tr>
                          );
                        }) : (
                          <tr><td colSpan="4" className="py-5 text-center text-gray-500 text-lg">No recent assessments found</td></tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <div className="flex items-center justify-between mb-10">
                    <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">Most Popular Careers</h2>
                    <svg className="w-[32px] h-[32px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="14" width="3.5" height="7" rx="1.75" fill="#635BFF" />
                      <rect x="10.25" y="8" width="3.5" height="13" rx="1.75" fill="#635BFF" />
                      <rect x="17.5" y="2" width="3.5" height="19" rx="1.75" fill="#635BFF" />
                    </svg>
                  </div>

                  {(() => {
                    const query = careerSearch.trim().toLowerCase();
                    const words = query.split(/\s+/).filter(Boolean);
                    const matches = words.length
                      ? dashboardData.popularCareers.filter((c) => {
                          const name = String(c.name || '').toLowerCase();
                          return words.every((w) => name.includes(w));
                        })
                      : dashboardData.popularCareers;
                    const totalPages = Math.max(1, Math.ceil(matches.length / POPULAR_LIMIT));
                    const page = Math.min(careerPage, totalPages);
                    const start = (page - 1) * POPULAR_LIMIT;
                    const pageItems = matches.slice(start, start + POPULAR_LIMIT);
                    const firstPage = Math.max(1, Math.min(page - 2, totalPages - 4));
                    const pageNumbers = Array.from({ length: Math.min(5, totalPages) }, (_, i) => firstPage + i);
                    return (
                  <>
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                    <div className="relative w-full sm:w-72">
                      <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                      <input
                        type="text"
                        value={careerSearch}
                        onChange={(e) => { setCareerSearch(e.target.value); setCareerPage(1); }}
                        onKeyDown={(e) => { if (e.key === 'Escape') { setCareerSearch(''); setCareerPage(1); } }}
                        placeholder="Search careers..."
                        className="w-full pl-11 pr-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 placeholder-gray-400 font-normal"
                      />
                    </div>
                    {careerSearch && (
                      <button
                        type="button"
                        onClick={() => { setCareerSearch(''); setCareerPage(1); }}
                        className="flex items-center gap-2 px-5 py-3 rounded-xl border border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 transition-all text-[15px] font-medium cursor-pointer flex-shrink-0"
                      >
                        <RotateCcw size={16} />
                        Reset
                      </button>
                    )}
                    </div>
                    <div className="text-[16px] font-normal text-[#545454] flex items-center gap-2 flex-shrink-0">
                      <Filter size={18} className="text-gray-400" />
                      Showing <strong className="text-gray-900 font-semibold">{matches.length === 0 ? 0 : start + 1}</strong> - <strong className="text-gray-900 font-semibold">{start + pageItems.length}</strong> of <strong className="text-gray-900 font-semibold">{matches.length}</strong>
                    </div>
                  </div>

                  <div className="space-y-7.5">
                    {pageItems.length > 0 ? pageItems.map((bar, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-medium text-[18px] font-[500]">{bar.name}</span>
                          <span className="text-regular text-[17px] text-[#545454] font-[400]">{bar.count}</span>
                        </div>
                        <div className="w-full h-[12px] bg-[#D9D9D9] rounded-full overflow-hidden">
                          <div className="bg-[#F45EE4] h-full rounded-full transition-all duration-1000" style={{ width: bar.width }}></div>
                        </div>
                      </div>
                    )) : (
                      <div className="text-gray-500 text-center py-4 text-lg">
                        {query ? 'No careers match your search' : 'No career data available yet'}
                      </div>
                    )}
                  </div>

                  {totalPages > 1 && (
                    <div className="flex justify-center items-center gap-2 pt-9 flex-wrap">
                      <button
                        type="button"
                        onClick={() => setCareerPage(page - 1)}
                        disabled={page === 1}
                        className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
                          page === 1 ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed' : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
                        }`}
                      >
                        Previous
                      </button>
                      <div className="flex items-center gap-2 mx-1">
                        {pageNumbers.map((n) => (
                          <button
                            key={n}
                            type="button"
                            onClick={() => setCareerPage(n)}
                            className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-medium transition-all cursor-pointer ${
                              page === n ? 'bg-[#FF34DC] text-white' : 'bg-white text-gray-500 border border-gray-200 hover:border-[#FF34DC] hover:text-[#890080]'
                            }`}
                          >
                            {n}
                          </button>
                        ))}
                      </div>
                      <button
                        type="button"
                        onClick={() => setCareerPage(page + 1)}
                        disabled={page === totalPages}
                        className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
                          page === totalPages ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed' : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
                        }`}
                      >
                        Next
                      </button>
                    </div>
                  )}
                  </>
                    );
                  })()}
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 space-y-8">
                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-9 ">Quick Actions</h2>
                  <div className="space-y-2">
                    <button
                      onClick={() => setCurrentView('dashboard')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'dashboard' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <LayoutDashboard size={25} strokeWidth={2} />
                      <span className="text-[21px]">Dashboard</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('careers')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'careers' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <Briefcase size={25} strokeWidth={2} />
                      <span className="text-[21px]">Manage Careers</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('quiz')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'quiz' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <ClipboardList size={25} strokeWidth={2} />
                      <span className="text-[21px]">Manage Quiz</span>
                    </button>
                    <button 
                      onClick={onNavigateToResults} 
                      className="w-full h-[45px] bg-gray-50 border border-gray-100 hover:bg-[#FFE1FD] hover:text-[#890080] text-gray-900 py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                    >
                      <FileText size={25} strokeWidth={2} />
                      <span className="text-[21px]">Students Results</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('total-students')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'total-students' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <Users size={25} strokeWidth={2} />
                      <span className="text-[21px]">Total Students</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('recent-activity')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'recent-activity' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <Activity size={25} strokeWidth={2} />
                      <span className="text-[21px]">Recent Activity</span>
                    </button>
                    <button
                      onClick={() => setCurrentView('settings')}
                      className={`w-full h-[45px] py-3.5 px-5 rounded-xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer ${currentView === 'settings' ? 'bg-[#FDF2FA] text-[#890080] border border-[#FFD2F7] hover:bg-pink-100' : 'bg-gray-50 border border-gray-100 text-gray-900 hover:bg-[#FFE1FD] hover:text-[#890080]'}`}
                    >
                      <Settings size={25} strokeWidth={2} />
                      <span className="text-[21px]">Settings</span>
                    </button>
                  </div>
                </div>

                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-6">System Health</h2>
                  <div className="space-y-4">
                    <div className="w-[100%] h-[105px] bg-[#EBFFF0] p-5 rounded-2xl">
                      <div className="text-[#000000] text-[18px] font-regular text-sm flex items-center gap-2 mb-1">
                        <div className="w-2.5 h-2.5 rounded-full bg-[#05A660]"></div> 
                        System Status
                      </div>
                      <div className="text-[25px] font-semibold text-[#039527]">{dashboardData.systemHealth.status}</div>
                    </div>
                    <div className="w-[100%] h-[105px] bg-[#EBF4FF] p-5 rounded-2xl">
                      <div className="text-[18px] text-[#000000] font-regular text-sm mb-1">Uptime</div>
                      <div className="text-[25px] font-semibold text-[#0057C2]">{dashboardData.systemHealth.uptime}</div>
                    </div>
                    <div className="w-[100%] h-[105px] bg-[#F9EDFF] p-5 rounded-2xl">
                      <div className="text-[18px] text-[#000000] font-regular text-sm mb-1">Response Time</div>
                      <div className="text-[25px] font-semibold text-[#7E06AD]">{dashboardData.systemHealth.responseTime}</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <h2 className="text-[32px] font-semibold text-[#000000] tracking-tight mb-9">This Month</h2>
                  <div className="space-y-5">
                    {dashboardData.thisMonth.length > 0 ? dashboardData.thisMonth.map((m, i) => (
                      <div key={i} className="flex justify-between items-center">
                        <span className="text-[#000000] text-[18px] font-regular whitespace-nowrap">{m.name}</span>
                        <div className="w-[130px] border-b-[1px] border-[#e5e7eb] mx-[12px]"></div>
                        <span className="text-[#000000] text-[19px] font-semibold whitespace-nowrap">{m.total}</span>
                      </div>
                    )) : (
                      <div className="text-gray-500">Loading data...</div>
                    )}
                  </div>
                </div>

              </div>
            </div>
          </>
        )}

        {currentView === 'quiz' && <ManageQuiz onNavigate={setCurrentView} onLogout={onLogout} />}
        {currentView === 'settings' && <SystemSettings onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'careers' && <ManageCareers onNavigate={setCurrentView} />}
        {currentView === 'total-students' && <TotalStudents onBack={() => setCurrentView('dashboard')} />}
        {currentView === 'recent-activity' && <RecentActivity onBack={() => setCurrentView('dashboard')} />}

      </main>
    </div>
  );
}
