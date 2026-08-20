import React, { useState, useMemo } from 'react';
import Header from './Header';
import { 
  Search, 
  Download, 
  Mail, 
  Eye, 
  X, 
  RotateCcw,
  Award,
  CheckCircle2,
  Clock,
  XCircle
} from 'lucide-react';

export default function StudentResults({ onNavigate, onLogout }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Status');
  const [dateFilter, setDateFilter] = useState('All Dates');
  
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const initialStudents = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@gmail.com', status: 'Completed', score: 92, matchCareer: 'Software Developer', matchPct: 92, secondCareer: 'Data Analyst', secondPct: 87, time: '12 min', questions: '25/25', date: '2025-03-10', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@email.com', status: 'Completed', score: 87, matchCareer: 'UX Designer', matchPct: 87, secondCareer: 'Product Manager', secondPct: 81, time: '15 min', questions: '24/25', date: '2025-03-10', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 3, name: 'Emma Williams', email: 'emma.w@email.com', status: 'Completed', score: 95, matchCareer: 'Data Analyst', matchPct: 95, secondCareer: 'AI Engineer', secondPct: 89, time: '10 min', questions: '25/25', date: '2025-03-09', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { id: 4, name: 'James Brown', email: 'james.b@gmail.com', status: 'In Progress', score: 87, matchCareer: 'Business Analyst', matchPct: 78, secondCareer: 'Digital Marketer', secondPct: 68, time: '18 min', questions: '19/25', date: '2025-03-09', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 5, name: 'Olivia Davis', email: 'olivia.d@email.com', status: 'Completed', score: 89, matchCareer: 'Digital Marketer', matchPct: 89, secondCareer: 'UX Designer', secondPct: 82, time: '14 min', questions: '23/25', date: '2025-03-08', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 6, name: 'Ali Rahman', email: 'ali.r@email.com', status: 'Completed', score: 91, matchCareer: 'Software Developer', matchPct: 91, secondCareer: 'Cloud Architect', secondPct: 85, time: '13 min', questions: '25/25', date: '2025-03-07', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: 7, name: 'Sophia Martinez', email: 'sophia.m@gmail.com', status: 'Completed', score: 94, matchCareer: 'AI Engineer', matchPct: 94, secondCareer: 'Software Developer', secondPct: 90, time: '11 min', questions: '25/25', date: '2025-03-07', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 8, name: 'David Wilson', email: 'david.w@yahoo.com', status: 'In Progress', score: 76, matchCareer: 'Cloud Architect', matchPct: 76, secondCareer: 'Network Engineer', secondPct: 70, time: '20 min', questions: '20/25', date: '2025-03-06', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: 9, name: 'Fatima Ahmed', email: 'fatima.a@outlook.com', status: 'Completed', score: 65, matchCareer: 'UX Designer', matchPct: 65, secondCareer: 'Graphic Designer', secondPct: 60, time: '16 min', questions: '18/25', date: '2025-03-06', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
    { id: 10, name: 'Ryan Garcia', email: 'ryan.g@tech.com', status: 'Failed', score: 58, matchCareer: 'Network Engineer', matchPct: 58, secondCareer: 'Cybersecurity Specialist', secondPct: 51, time: '22 min', questions: '14/25', date: '2025-03-05', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' }
  ];

  const statusesList = ['All Status', 'Completed', 'In Progress', 'Failed'];
  const datesList = useMemo(() => {
    const unique = Array.from(new Set(initialStudents.map(s => s.date).filter(Boolean)));
    return ['All Dates', ...unique];
  }, [initialStudents]);

  const getMatchColorClass = (value) => {
    if (value >= 90) return 'text-[#05A660]'; 
    if (value >= 80) return 'text-[#A7A100]';   
    if (value >= 70) return 'text-[#0047FF]';
    return 'text-red-500';                      
  };

  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      const matchQuery =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matchCareer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All Status' || student.status === statusFilter;
      const matchDate = dateFilter === 'All Dates' || student.date === dateFilter;

      return matchQuery && matchStatus && matchDate;
    });
  }, [searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const displayedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setDateFilter('All Dates');
  };

  const handleBulkDataExportPDF = () => {
    alert("Data Export Initiated");
  };

  const handleSendEmail = (student) => {
    const targetEmail = student.email;
    const mailSubject = encodeURIComponent(`CareerPathAI Assessment Summary Results`);
    const mailBody = encodeURIComponent(`Dear ${student.name},\n\nWe have compiled your diagnostic assessment matrix details.\n\nOverall Profile Score: ${student.score}%\nPrimary Career Vector Match: ${student.matchCareer} (${student.matchPct}% Match Rating)\nAssessment Verification Date: ${student.date}\n\nSincerely,\nOperations Management Team`);
    window.open(`mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`, '_self');
  };

  return (
    <div className="w-full bg-transparent text-gray-900 antialiased space-y-8 pb-10 relative">
      <style>
        {`
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
        `}
      </style>

      <Header onNavigate={onNavigate} onLogout={onLogout} />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        
        <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="space-y-2"> 
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Student Results
            </h1>
            <p className="text-[#000000] font-light text-[21.3px] mt-[5px] mb-[15px]">
              View and analyze student assessment results
            </p>
          </div>
          
          <button 
            type="button"
            onClick={handleBulkDataExportPDF}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center sm:self-center"
          >
            <Download size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
            <span className="leading-none">Export Data</span>
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
          {[
            { id: 1, label: 'Total Assessments', value: '10,482', emoji: '👥', trend: '+245' },
            { id: 2, label: 'Completed Today', value: '127', emoji: '✅', trend: '+23' },
            { id: 3, label: 'Average Score', value: '87%', emoji: '📈', trend: '+2.3%' },
            { id: 4, label: 'Avg. Completion Time', value: '12 min', emoji: '⏱️', trend: '-1 min' },
          ].map((stat) => (
            <div 
              key={stat.id} 
              className="relative bg-[#ffffff] h-[145px] w-full max-w-[303px] px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
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

        <div className="w-full min-h-[130px] rounded-[25px] bg-[#ffffff] p-6 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] flex flex-wrap lg:flex-nowrap items-center justify-between gap-4 border border-[#FFD2F7]">
          <div className="flex items-center gap-4 flex-wrap sm:flex-nowrap w-full lg:w-auto flex-1">
            
            <div className="relative flex-1 min-w-[260px] max-w-[500px] h-[57px]">
              <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none text-gray-400">
                <Search size={22} />
              </div>
              <input 
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name, email..."
                className="w-full h-[57px] bg-[#ffffff] border-[1px] border-[#C0C0C0] text-[18px] sm:text-[20px] rounded-[15px] pl-12 pr-4 outline-none hover:border-gray-400 focus:border-[#bd24df] transition-all font-medium text-gray-800 placeholder:text-gray-400"
              />
            </div>

            <div className="relative w-full sm:w-[170px] h-[57px] flex-shrink-0">
              <select 
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
                className="w-full h-[57px] bg-[#ffffff] border-[1px] border-[#C0C0C0] text-[18px] sm:text-[20px] rounded-[15px] px-3 pr-8 appearance-none cursor-pointer outline-none hover:border-gray-400 focus:border-[#bd24df] transition-all font-medium text-gray-800"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, 
                  backgroundPosition: 'right 12px center', 
                  backgroundRepeat: 'no-repeat' 
                }}
              >
                {statusesList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>

            <div className="relative w-full sm:w-[170px] h-[57px] flex-shrink-0">
              <select 
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
                className="w-full h-[57px] bg-[#ffffff] border-[1px] border-[#C0C0C0] text-[18px] sm:text-[20px] rounded-[15px] px-3 pr-8 appearance-none cursor-pointer outline-none hover:border-gray-400 focus:border-[#bd24df] transition-all font-medium text-gray-800"
                style={{ 
                  backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='18' height='18' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, 
                  backgroundPosition: 'right 12px center', 
                  backgroundRepeat: 'no-repeat' 
                }}
              >
                {datesList.map(opt => <option key={opt} value={opt}>{opt}</option>)}
              </select>
            </div>
          </div>

          {(searchQuery !== '' || statusFilter !== 'All Status' || dateFilter !== 'All Dates') && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="flex items-center justify-center gap-2 h-[57px] px-5 rounded-[15px] border border-gray-300 hover:bg-gray-100 text-gray-700 text-[16px] font-semibold transition-colors cursor-pointer flex-shrink-0 ml-auto"
            >
              <RotateCcw size={18} />
              Reset Filters
            </button>
          )}
        </div>

        <div className="bg-[#ffffff] rounded-[25px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-gray-100 text-[#545454] text-[16px] font-normal">
                  <th className="pb-4 pl-2 font-normal">Student</th>
                  <th className="pb-4 font-normal">Status</th>
                  <th className="pb-4 font-normal">Score</th>
                  <th className="pb-4 font-normal">Top Career Match</th>
                  <th className="pb-4 font-normal">Match %</th>
                  <th className="pb-4 font-normal">Completed</th>
                  <th className="pb-4 text-center font-normal">Actions</th>
                </tr>
              </thead>
              
              <tbody className="divide-y divide-gray-50/80">
                {displayedStudents.length > 0 ? (
                  displayedStudents.map((student) => (
                    <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 pl-2">
                        <div className="flex items-center gap-3">
                          <img 
                            src={student.img} 
                            alt={student.name}
                            className="w-11 h-11 rounded-full object-cover border border-pink-100"
                          />
                          <div>
                            <div className="font-medium text-[#000000] text-[18px]">{student.name}</div>
                            <div className="text-[13px] text-[#373737] font-normal">{student.email}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-4">
                        {student.status === 'Completed' ? (
                          <span className="w-[117px] h-[26px] bg-[#E0FFEE] text-[#008A39] rounded-full text-[16px] font-normal inline-flex items-center justify-center gap-[6px]">
                            <CheckCircle2 size={14} className="text-[#008A39] flex-shrink-0" />
                            Completed
                          </span>
                        ) : student.status === 'In Progress' ? (
                          <span className="w-[129px] h-[26px] bg-[#FFFEDE] text-[#9F5603] rounded-full text-[16px] font-normal inline-flex items-center justify-center gap-[6px]">
                            <Clock size={14} className="text-[#9F5603] flex-shrink-0" />
                            In Progress
                          </span>
                        ) : (
                          <span className="w-[92px] h-[26px] bg-[#FFECEC] text-[#B91C1C] rounded-full text-[16px] font-normal inline-flex items-center justify-center gap-[6px]">
                            <XCircle size={14} className="text-[#B91C1C] flex-shrink-0" />
                            Failed
                          </span>
                        )}
                      </td>

                      <td className="py-4 font-medium text-gray-900 text-[16px]">
                        <div className="flex items-center gap-2">
                          <span 
                            style={{ width: '10px', height: '10px', backgroundColor: '#7E06AD' }} 
                            className="rounded-[2px] inline-block flex-shrink-0"
                          />
                          <span>{student.score}%</span>
                        </div>
                      </td>

                      <td className="py-4 font-normal text-gray-800 text-[17px]">
                        <div className="flex items-center gap-2.5">
                          <Award size={20} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                          <span>{student.matchCareer}</span>
                        </div>
                      </td>

                      <td className="py-4">
                        <span className={`font-medium text-[22px] ${getMatchColorClass(student.matchPct)}`}>
                          {student.matchPct}%
                        </span>
                      </td>

                      <td className="py-4 text-gray-500 font-light text-[17px]">
                        {student.date}
                      </td>

                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button 
                            type="button"
                            onClick={() => setSelectedStudent(student)}
                            title="View Result Details"
                            className="w-9 h-9 rounded-full border border-pink-200 bg-[#FFEDF8] text-[#890080] flex items-center justify-center hover:bg-[#ffdef9] transition-all cursor-pointer"
                          >
                            <Eye size={18} strokeWidth={2.2} />
                          </button>

                          <button 
                            type="button"
                            onClick={() => handleSendEmail(student)}
                            title="Send Email"
                            className="w-9 h-9 rounded-full border border-gray-200 bg-gray-50 text-gray-600 flex items-center justify-center hover:bg-gray-100 transition-all cursor-pointer"
                          >
                            <Mail size={18} strokeWidth={2.2} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-12 text-center text-gray-500">
                      <div className="text-4xl mb-2">🔍</div>
                      <div className="text-lg font-semibold text-gray-700">No student results found matching your filters.</div>
                      <p className="text-sm text-gray-400 mt-1">Try resetting the status, date, or search terms.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <div className="flex justify-center items-center gap-2 pt-2">
          <button 
            type="button"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
              currentPage === 1 
                ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed' 
                : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2 mx-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-medium transition-all cursor-pointer ${
                    currentPage === pageNum
                      ? 'bg-[#FF34DC] text-white'
                      : 'bg-white text-gray-500 border border-gray-200 hover:border-[#FF34DC] hover:text-[#890080]'
                  }`}
                >
                  {pageNum}
                </button>
              );
            })}
          </div>

          <button 
            type="button"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
              currentPage === totalPages 
                ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed' 
                : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] max-w-xl w-full p-8 relative shadow-2xl border border-pink-100">
            <button 
              type="button"
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer p-2 hover:bg-gray-100 rounded-full transition-all"
            >
              <X size={20} />
            </button>

            <h2 className="text-[22px] font-bold text-gray-900 tracking-tight mb-6">Assessment Details</h2>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-100">
              <img 
                src={selectedStudent.img} 
                alt={selectedStudent.name} 
                className="w-16 h-16 rounded-full object-cover border-2 border-pink-50"
              />
              <div>
                <h3 className="text-[19px] font-bold text-gray-900">{selectedStudent.name}</h3>
                <p className="text-[14px] text-gray-500 mt-0.5">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-8">
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-gray-500 block mb-1">Overall Score</span>
                <span className="text-[20px] font-bold text-gray-900 block">{selectedStudent.score}%</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-gray-500 block mb-1">Completion Time</span>
                <span className="text-[20px] font-bold text-gray-900 block">{selectedStudent.time}</span>
              </div>
              <div className="bg-gray-50 border border-gray-100 p-4 rounded-2xl text-center">
                <span className="text-[12px] font-semibold text-gray-500 block mb-1">Questions</span>
                <span className="text-[20px] font-bold text-gray-900 block">{selectedStudent.questions}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8">
              <button 
                type="button"
                onClick={() => handleSendEmail(selectedStudent)}
                className="flex items-center justify-center gap-2 py-3.5 bg-[#FCE7F3] text-[#D9169F] font-semibold text-[15px] rounded-xl transition-all cursor-pointer hover:bg-pink-200"
              >
                <Mail size={18} />
                Send Email
              </button>

              <button 
                type="button"
                onClick={() => alert(`Exporting report for ${selectedStudent.name}`)}
                className="flex items-center justify-center gap-2 py-3.5 bg-white border border-gray-200 text-gray-700 font-semibold text-[15px] rounded-xl transition-all cursor-pointer hover:bg-gray-50"
              >
                <Download size={18} />
                Export Report
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
