import React, { useState } from 'react';
import Header from './Header'; 
import ManageQuiz from './ManageQuiz';
import SystemSettings from './SystemSettings';
import { Plus, Briefcase, ClipboardList, FileText, Settings } from 'lucide-react'; 

export default function AdminDashboard({ onLogout, onNavigateToResults }) {
  const [currentView, setCurrentView] = useState('dashboard');
  const [showAllStudents, setShowAllStudents] = useState(false);

  const studentsData = [
    { name: 'Sarah Johnson', email: 'sarah.j@gmail.com', score: 92, time: '5 min ago' },
    { name: 'Michael Chen', email: 'michael.c@email.com', score: 87, time: '12 min ago' },
    { name: 'Emma Williams', email: 'emma.w@email.com', score: 95, time: '25 min ago' },
    { name: 'James Brown', email: 'james.b@gmail.com', score: 78, time: '35 min ago' },
    { name: 'Olivia Davis', email: 'olivia.d@gmail.com', score: 89, time: '1 hour ago' },
    { name: 'David Miller', email: 'david.m@yahoo.com', score: 61, time: '55 min ago' },
    { name: 'Ayesha Khan', email: 'ayesha.k@hotmail.com', score: 97, time: '1 hr ago' },
    { name: 'Omar Farooq', email: 'omar.f@gmail.com', score: 75, time: '3 hr ago' },
  ];

  const displayedStudents = showAllStudents ? studentsData : studentsData.slice(0, 5);

  const getStatusDetails = (score) => {
    if (score >= 90) {
      return { 
        status: 'Completed', 
        scoreColor: 'text-[#05A660]',
        pillClasses: 'text-[#05A660] bg-[#E3F6ED]' 
      };
    } else if (score >= 80) {
      return { 
        status: 'Completed', 
        scoreColor: 'text-[#84CC16]', 
        pillClasses: 'text-[#05A660] bg-[#E3F6ED]' 
      };
    } else if (score >= 70) {
      return { 
        status: 'In Progress', 
        scoreColor: 'text-[#0047FF]', 
        pillClasses: 'text-[#E88B00] bg-[#FFF2E0]' 
      };
    } else {
      return { 
        status: 'Error', 
        scoreColor: 'text-red-500',
        pillClasses: 'text-red-600 bg-red-50' 
      };
    }
  };

  return (
    <div className="relative min-h-screen bg-[#fcf8fe] text-gray-800 antialiased selection:bg-pink-200">
      
      <style>
        {`
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
          /* Custom drop shadow strictly matching Figma specs (X:3, Y:8, Blur:8, Spread:2, #000000 @ 25%) */
          .custom-card-shadow {
            box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25);
          }
        `}
      </style>

      <Header onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        
        {currentView === 'dashboard' && (
          <>
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
              <div className="space-y-2"> 
                <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
                  Admin Dashboard
                </h1>
                <p className="text-[#000000] font-light text-[21.3px] mt-[5px] mb-[15px]">
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
              {[
                { id: 1, label: 'Total Students', value: '10,482', emoji: '👥', trend: '+12%' },
                { id: 2, label: 'Career Profiles', value: '52', emoji: '💼', trend: '+5%' },
                { id: 3, label: 'Quiz Questions', value: '245', emoji: '📝', trend: '+18%' },
                { id: 4, label: 'Assessments Today', value: '127', emoji: '📅', trend: '+8%' },
              ].map((stat) => (
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
                    <div className="text-[36px] font-bold text-gray-900 tracking-tight leading-tight">{stat.value}</div>
                    <div className="text-[15px] font-normal text-[#545454] mt-[2px]">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-10">
              
              <div className="lg:col-span-7 xl:col-span-8 space-y-8">
                
                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-[30px] font-semibold text-gray-900 tracking-tight">Recent Student Activity</h2>
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
                        {displayedStudents.map((row, idx) => {
                          const ruleConfig = getStatusDetails(row.score);
                          return (
                            <tr key={idx} className="border-b border-gray-50 last:border-0 hover:bg-gray-50/30 transition-colors">
                              <td className="py-5">
                                <div className="text-[#111827] text-[18px] font-medium">{row.name}</div>
                                <div className="text-[#545454] text-[16px] font-regular mt-0.5">{row.email}</div>
                              </td>
                              <td className="py-5 text-center">
                              <span className={`font-semibold text-[22px] ${ruleConfig.scoreColor}`}>
                                {row.score}%
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
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <div className="flex items-center justify-between mb-9">
                    <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight">Most Popular Careers</h2>
                    <svg className="w-[32px] h-[32px]" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <rect x="3" y="14" width="3.5" height="7" rx="1.75" fill="#635BFF" />
                      <rect x="10.25" y="8" width="3.5" height="13" rx="1.75" fill="#635BFF" />
                      <rect x="17.5" y="2" width="3.5" height="19" rx="1.75" fill="#635BFF" />
                    </svg>
                  </div>

                  <div className="space-y-7.5">
                    {[
                      { name: 'Software Developer', count: '3245 students', width: '90%' },
                      { name: 'Data Analyst', count: '2156 students', width: '65%' },
                      { name: 'UX Designer', count: '1834 students', width: '55%' },
                      { name: 'Business Analyst', count: '1523 students', width: '45%' },
                      { name: 'Digital Marketer', count: '1724 students', width: '50%' }
                    ].map((bar, i) => (
                      <div key={i} className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-medium text-[18px] font-[500]">{bar.name}</span>
                          <span className="text-regular text-[17px] text-[#545454] font-[400]">{bar.count}</span>
                        </div>
                        <div className="w-full h-[12px] bg-[#D9D9D9] rounded-full overflow-hidden">
                          <div className="bg-[#F45EE4] h-full rounded-full" style={{ width: bar.width }}></div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="lg:col-span-5 xl:col-span-4 space-y-8">
                
                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                  <h2 className="text-[32px] font-semibold text-gray-900 tracking-tight mb-9 ">Quick Actions</h2>
                  <div className="space-y-2">
                    
                    <button className="w-[323px] h-[45px] bg-[#FDF2FA] text-[#890080] py-3.5 px-5 rounded-2xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer">
                      <Briefcase size={25} strokeWidth={2} />
                      <span className="text-[21px]">Manage Careers</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView('quiz')}
                     className="w-[323px] h-[45px] bg-transparent hover:bg-gray-50 text-gray-900 py-3.5 px-5 rounded-2xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                    >
                      <ClipboardList size={25} strokeWidth={2} />
                      <span className="text-[21px]">Manage Quiz</span>
                    </button>

                    <button 
                      onClick={onNavigateToResults} 
                      className="w-[323px] h-[45px] bg-transparent hover:bg-gray-50 text-gray-900 py-3.5 px-5 rounded-2xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
                    >
                      <FileText size={25} strokeWidth={2} />
                      <span className="text-[21px]">Students Results</span>
                    </button>

                    <button 
                      onClick={() => setCurrentView('settings')}
                      className="w-[323px] h-[45px] bg-transparent hover:bg-gray-50 text-gray-900 py-3.5 px-5 rounded-2xl text-left font-regular flex items-center gap-4 transition-all cursor-pointer"
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
                      <div className="text-[25px] font-semibold text-[#039527]">Online</div>
                    </div>

                    <div className="w-[100%] h-[105px] bg-[#EBF4FF] p-5 rounded-2xl">
                      <div className="text-[18px] text-[#000000] font-regular text-sm mb-1">Uptime</div>
                      <div className="text-[25px] font-semibold text-[#0057C2]">99.9%</div>
                    </div>

                    <div className="w-[100%] h-[105px] bg-[#F9EDFF] p-5 rounded-2xl">
                      <div className="text-[18px] text-[#000000] font-regular text-sm mb-1">Response Time</div>
                      <div className="text-[25px] font-semibold text-[#7E06AD]">245ms</div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow">
                <h2 className="text-[32px] font-semibold text-[#000000] tracking-tight mb-9">This Month</h2>
                <div className="space-y-5">
                  {[
                    { name: 'New Students', total: '1,234' },
                    { name: 'Assessments', total: '3,456' },
                    { name: 'Avg. Score', total: '84%' },
                    { name: 'Completion Rate', total: '92%' },
                  ].map((m, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <span className="text-[#000000] text-[18px] font-regular whitespace-nowrap">{m.name}</span>
                      <div className="w-[130px] border-b-[1px] border-[#e5e7eb] mx-[12px]"></div>
                      <span className="text-[#000000] text-[19px] font-semibold whitespace-nowrap">{m.total}</span>
                    </div>
                  ))}
                </div>
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