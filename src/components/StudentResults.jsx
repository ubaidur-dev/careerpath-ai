import { useState, useEffect, useMemo, useCallback } from 'react';
import useModalHistory from '../utils/useModalHistory';
import useRestoredState from '../utils/useRestoredState';
import { createPortal, flushSync } from 'react-dom';
import axios from 'axios';
import Header from './Header';
import Dropdown from './Dropdown';
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
  XCircle,
  User,
  Loader2,
  Filter,
  History,
  TrendingUp,
  AlertTriangle,
  BadgeCheck
} from 'lucide-react';
import { getScoreColorClass } from '../utils/scoreColors';
import Signature from './Signature';

const POLL_MS = 3000;

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

function Avatar({ name, src, className = '', onClick }) {
  const [failedSrc, setFailedSrc] = useState(null);

  if (src && failedSrc !== src) {
    return (
      <img
        src={src}
        alt={name || 'Student'}
        onClick={onClick}
        onError={() => setFailedSrc(src)}
        className={`rounded-full object-cover ${className}`}
      />
    );
  }

  return (
    <div className={`rounded-full bg-[#FFBFF4] text-[#83047A] font-bold flex items-center justify-center select-none text-[14px] ${className}`}>
      {getInitials(name) || <User size={18} />}
    </div>
  );
}

const mapResult = (r) => ({
  rowId: r.id,
  serial: r.serial,
  userId: r.userId,
  name: r.name || '',
  email: r.email || '',
  avatar: r.avatar || '',
  status: r.status || 'In Progress', 
  score: r.score,
  matchCareer: r.careerMatch,
  matchPct: r.matchPercent,
  startedAt: r.startedAt || null,
  completedAt: r.completedAt || null,
  date: r.date || '',
  time: r.time || '',
});


const formatEventTime = (student) => {
  if (student.status === 'In Progress') return { primary: 'Just now', secondary: '' };
  return { primary: student.date || '—', secondary: student.time || '' };
};

export default function StudentResults({ onNavigate, onLogout }) {
  const [searchQuery, setSearchQuery] = useRestoredState('StudentResults.searchQuery', '');
  const [statusFilter, setStatusFilter] = useRestoredState('StudentResults.statusFilter', 'All Status');
  const [dateFilter, setDateFilter] = useRestoredState('StudentResults.dateFilter', 'All Dates');

  const [selectedStudentUserId, setSelectedStudentUserId] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentPage, setCurrentPage] = useRestoredState('StudentResults.currentPage', 1);
  const itemsPerPage = 20;

  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [historyData, setHistoryData] = useState(null);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [historyError, setHistoryError] = useState('');
  const [approvingId, setApprovingId] = useState(null);
  const [approveMsg, setApproveMsg] = useState({ type: '', text: '' });

  const loadResults = useCallback(async ({ initial = false } = {}) => {
    try {
      if (initial) setLoading(true);
      const response = await axios.get('/admin/student-results');
      const list = Array.isArray(response.data?.results) ? response.data.results : [];
      setResults(list.map(mapResult));
      setError('');
    } catch (err) {
      console.error('Failed to load student results', err);
      if (initial) setError('Unable to load student results right now. Please try again.');
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = (opts) => { if (active) loadResults(opts); };
    run({ initial: true });
    const timer = setInterval(() => run({ initial: false }), POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, [loadResults]);

  const allStudents = useMemo(
    () => results.map((student, index) => ({ ...student, displayRank: index + 1 })),
    [results]
  );

  const statusesList = ['All Status', 'Completed', 'In Progress', 'Error'];
  const datesList = useMemo(() => {
    const unique = Array.from(new Set(allStudents.map((s) => s.date).filter(Boolean))).sort().reverse();
    return ['All Dates', ...unique];
  }, [allStudents]);

  const getMatchColorClass = getScoreColorClass;

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allStudents.filter((student) => {
      const searchableValues = [
        student.displayRank,
        student.name,
        student.email,
        student.status,
        student.score !== null && student.score !== undefined ? `${student.score}%` : null,
        student.matchCareer,
        student.matchPct !== null && student.matchPct !== undefined ? `${student.matchPct}%` : null,
        student.date,
        student.time,
      ];
      const matchQuery = !q || searchableValues.some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );

      const matchStatus = statusFilter === 'All Status' || student.status === statusFilter;
      const matchDate = dateFilter === 'All Dates' || student.date === dateFilter;

      return matchQuery && matchStatus && matchDate;
    });
  }, [allStudents, searchQuery, statusFilter, dateFilter]);

  const hasActiveFilter = searchQuery.trim() !== '' || statusFilter !== 'All Status' || dateFilter !== 'All Dates';

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = hasActiveFilter ? 0 : (activePage - 1) * itemsPerPage;
  const endIndex = hasActiveFilter ? filteredStudents.length : Math.min(startIndex + itemsPerPage, filteredStudents.length);
  const displayedStudents = useMemo(
    () => filteredStudents.slice(startIndex, endIndex),
    [filteredStudents, startIndex, endIndex]
  );

  const selectedStudent = selectedStudentUserId
    ? results.find((s) => s.userId === selectedStudentUserId) || null
    : null;

  const loadHistory = useCallback(async (userId, { initial = false } = {}) => {
    try {
      if (initial) setHistoryLoading(true);
      const response = await axios.get(`/admin/student-results/${userId}/history`);
      setHistoryData(response.data || null);
      setHistoryError('');
    } catch (err) {
      console.error('Failed to load student history', err);
      if (initial) setHistoryError('Unable to load this student\'s history right now. Please try again.');
    } finally {
      if (initial) setHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!selectedStudentUserId) return undefined;
    let active = true;
    const run = (opts) => { if (active) loadHistory(selectedStudentUserId, opts); };
    run({ initial: true });
    const timer = setInterval(() => run({ initial: false }), POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, [selectedStudentUserId, loadHistory]);

  const handleApproveCertificate = async (attempt) => {
    setApprovingId(attempt.id);
    setApproveMsg({ type: '', text: '' });
    try {
      const token = sessionStorage.getItem('token');
      const res = await axios.post(`/admin/student-results/${attempt.id}/approve-certificate`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setApproveMsg({ type: 'success', text: res.data?.message || 'Certificate approved.' });
      await loadHistory(selectedStudentUserId);
    } catch (err) {
      setApproveMsg({ type: 'error', text: err?.response?.data?.message || 'Could not approve this certificate. Please try again.' });
      await loadHistory(selectedStudentUserId);
    } finally {
      setApprovingId(null);
      setTimeout(() => setApproveMsg({ type: '', text: '' }), 4000);
    }
  };

  const handleCloseHistoryModal = () => {
    setSelectedStudentUserId(null);
    setHistoryData(null);
    setHistoryError('');
  };

  useModalHistory(!!selectedStudent, () => handleCloseHistoryModal());
  useModalHistory(!!zoomedImage, () => setZoomedImage(null));

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setDateFilter('All Dates');
    setCurrentPage(1);
  };

  const [printedAt, setPrintedAt] = useState(null);

  const handleBulkDataExportPDF = async () => {
    const now = new Date();
    flushSync(() => setPrintedAt(now));

    const images = Array.from(document.querySelectorAll('.results-print-area img'));
    await Promise.race([
      Promise.all(images.map((img) => (img.complete ? Promise.resolve() : new Promise((resolve) => {
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
      })))),
      new Promise((resolve) => setTimeout(resolve, 3000)),
    ]);

    setTimeout(() => window.print(), 50);
  };

  const handleSendEmail = (student) => {
    const targetEmail = student.email;
    const mailSubject = encodeURIComponent('CareerPathAI Assessment Summary Results');
    const bodyLines = [`Dear ${student.name},`, ''];
    if (student.status === 'Completed') {
      bodyLines.push('We have compiled your diagnostic assessment matrix details.');
      bodyLines.push('');
      bodyLines.push(`Overall Profile Score: ${student.score}%`);
      bodyLines.push(`Primary Career Vector Match: ${student.matchCareer} (${student.matchPct}% Match Rating)`);
      bodyLines.push(`Assessment Verification Date: ${student.date} ${student.time}`);
    } else if (student.status === 'In Progress') {
      bodyLines.push(`Your career assessment attempt started on ${student.date} ${student.time} is still in progress.`);
    } else {
      bodyLines.push(`Your career assessment attempt started on ${student.date} ${student.time} was left incomplete.`);
    }
    bodyLines.push('', 'Sincerely,', 'Operations Management Team');
    const mailBody = encodeURIComponent(bodyLines.join('\n'));
    window.open(`mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`, '_self');
  };

  const summary = useMemo(() => {
    const totalAssessments = allStudents.length;
    const todayStr = new Date().toISOString().slice(0, 10);
    const completed = allStudents.filter((s) => s.status === 'Completed');
    const completedToday = completed.filter((s) => s.date === todayStr).length;
    const avgScore = completed.length
      ? Math.round(completed.reduce((sum, s) => sum + (s.score || 0), 0) / completed.length)
      : null;

    const durations = completed
      .filter((s) => s.startedAt && s.completedAt)
      .map((s) => (new Date(s.completedAt).getTime() - new Date(s.startedAt).getTime()) / 60000)
      .filter((m) => m >= 0);
    const avgDuration = durations.length
      ? Math.max(1, Math.round(durations.reduce((sum, m) => sum + m, 0) / durations.length))
      : null;

    return {
      totalAssessments,
      completedToday,
      avgScore,
      avgDuration,
    };
  }, [allStudents]);

  const statCards = [
    { id: 1, label: 'Total Assessments', value: summary.totalAssessments.toLocaleString(), emoji: '👥' },
    { id: 2, label: 'Completed Today', value: String(summary.completedToday), emoji: '✅' },
    { id: 3, label: 'Average Score', value: summary.avgScore !== null ? `${summary.avgScore}%` : '—', emoji: '📈' },
    { id: 4, label: 'Avg. Completion Time', value: summary.avgDuration !== null ? `${summary.avgDuration} min` : '—', emoji: '⏱️' },
  ];

  return (
    <div className="w-full bg-[#fcf8fe] text-gray-900 antialiased pb-10 relative min-h-screen">
      <style>
        {`
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
          .results-print-area { display: none; }
          @media print {
            @page { size: A4 portrait; margin: 12mm 10mm; }
            html, body { background: #ffffff !important; }
            body > *:not(.results-print-area) { display: none !important; }
            .results-print-area {
              display: block !important;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .results-print-area .print-avoid { break-inside: avoid; page-break-inside: avoid; }
            .results-print-area thead { display: table-header-group; }
            .results-print-area tr { break-inside: avoid; page-break-inside: avoid; }
            .results-print-area .print-table-card {
              -webkit-box-decoration-break: clone;
              box-decoration-break: clone;
            }
          }
        `}
      </style>

      <Header onNavigate={onNavigate} onLogout={onLogout} currentView="results" />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="space-y-2">
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Student Results
            </h1>
            <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {statCards.map((stat) => (
            <div
              key={stat.id}
              className="relative bg-[#ffffff] h-[145px] w-full px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
            >
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

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[25px] prototype-card-border shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)]">
          <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto sm:flex-1">

            <div className="relative w-full sm:w-96">
              <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setCurrentPage(1); }}
                placeholder="Search by name, email..."
                className="w-full pl-11 pr-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 placeholder-gray-400 font-normal"
              />
            </div>

            <Dropdown
              value={statusFilter}
              onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
              options={statusesList}
              ariaLabel="Filter by status"
              className="w-full sm:w-[160px] flex-shrink-0"
              triggerClassName="bg-[#FCF8FE] border-[#FFD2F7] rounded-xl px-4 py-3 text-[16px]"
            />

            <Dropdown
              value={dateFilter}
              onChange={(v) => { setDateFilter(v); setCurrentPage(1); }}
              options={datesList}
              ariaLabel="Filter by date"
              className="w-full sm:w-[160px] flex-shrink-0"
              triggerClassName="bg-[#FCF8FE] border-[#FFD2F7] rounded-xl px-4 py-3 text-[16px]"
            />

            {hasActiveFilter && (
              <button
                type="button"
                onClick={handleResetFilters}
                className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-[15px] font-semibold transition-colors cursor-pointer flex-shrink-0"
              >
                <RotateCcw size={16} />
                Reset
              </button>
            )}
          </div>

          <div className="text-[16px] font-normal text-[#545454] flex items-center gap-2 flex-shrink-0">
            <Filter size={18} className="text-gray-400" />
            <span>
              Showing <strong className="text-gray-900 font-semibold">{filteredStudents.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{filteredStudents.length}</strong>
            </span>
          </div>
        </div>

        <div className="bg-[#ffffff] rounded-[25px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[900px]">
              <thead>
                <tr className="border-b border-gray-100 text-[#545454] text-[15px] font-normal">
                  <th className="pb-4 pl-2 pr-2 font-normal w-12">#</th>
                  <th className="pb-4 font-normal">Student</th>
                  <th className="pb-4 font-normal">Status</th>
                  <th className="pb-4 font-normal">Score</th>
                  <th className="pb-4 font-normal">Top Career Match</th>
                  <th className="pb-4 font-normal">Match %</th>
                  <th className="pb-4 font-normal">Completed</th>
                  <th className="pb-4 text-center font-normal">Actions</th>
                </tr>
              </thead>

              <tbody className="divide-y divide-gray-50/80">
                {loading ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center text-gray-500">
                      <Loader2 size={30} className="mx-auto mb-3 animate-spin text-[#83047A]" />
                      Loading student results...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="8" className="py-14 text-center text-gray-500">
                      <div className="text-4xl mb-2">⚠️</div>
                      <div className="text-lg font-semibold text-gray-700">{error}</div>
                      <button
                        type="button"
                        onClick={() => loadResults({ initial: true })}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] transition-colors text-[13px] font-medium cursor-pointer"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : displayedStudents.length > 0 ? (
                  displayedStudents.map((student) => (
                    <tr key={student.rowId} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 pl-2 pr-2 text-[15px] font-medium text-gray-500">
                        {student.displayRank}
                      </td>

                      <td className="py-4">
                        <div className="flex items-center gap-3">
                          <Avatar
                            name={student.name}
                            src={student.avatar}
                            onClick={student.avatar ? () => setZoomedImage(student.avatar) : undefined}
                            className={`w-11 h-11 flex-shrink-0 border border-pink-100 ${student.avatar ? 'cursor-pointer hover:scale-[1.1] transition-transform duration-200' : ''}`}
                          />
                          <div>
                            <div className="font-medium text-[#000000] text-[18px]">{student.name || '—'}</div>
                            <div className="text-[13px] text-[#373737] font-normal">{student.email || '—'}</div>
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
                            Error
                          </span>
                        )}
                      </td>

                      <td className="py-4 font-medium text-gray-900 text-[16px]">
                        {student.score !== null && student.score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span
                              style={{ width: '10px', height: '10px', backgroundColor: '#7E06AD' }}
                              className="rounded-[2px] inline-block flex-shrink-0"
                            />
                            <span>{student.score}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-4 font-normal text-gray-800 text-[17px]">
                        {student.matchCareer ? (
                          <div className="flex items-center gap-2.5">
                            <Award size={20} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                            <span>{student.matchCareer}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-4">
                        {student.matchPct !== null && student.matchPct !== undefined ? (
                          <span className={`font-medium text-[22px] ${getMatchColorClass(student.matchPct)}`}>
                            {student.matchPct}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[22px]">—</span>
                        )}
                      </td>

                      <td className="py-4 text-gray-500 font-light text-[16px]">
                        {(() => {
                          const t = formatEventTime(student);
                          return (
                            <>
                              <div className={student.status === 'In Progress' ? 'text-[#9F5603] font-medium' : ''}>{t.primary}</div>
                              {t.secondary && (
                                <div className="text-[13px] text-gray-400">{t.secondary}</div>
                              )}
                            </>
                          );
                        })()}
                      </td>

                      <td className="py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSelectedStudentUserId(student.userId)}
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
                    <td colSpan="8" className="py-12 text-center text-gray-500">
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

        {!hasActiveFilter && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
              activePage === 1
                ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed'
                : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
            }`}
          >
            Previous
          </button>

          <div className="flex items-center gap-2 mx-1">
            {visiblePageNumbers.map((pageNum) => {
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[15px] font-medium transition-all cursor-pointer ${
                    activePage === pageNum
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
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className={`px-6 py-2 rounded-full border transition-all text-[15px] font-medium ${
              activePage === totalPages
                ? 'border-gray-200 text-gray-300 bg-transparent cursor-not-allowed'
                : 'border-[#FF34DC] text-[#890080] bg-white hover:bg-pink-50 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
        )}
      </div>

      {selectedStudent && (
        <div
          className="fixed inset-0 m-0! z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={handleCloseHistoryModal}
        >
          <div
            className="bg-white rounded-[25px] prototype-card-border custom-card-shadow w-full max-w-4xl max-h-[90vh] flex flex-col text-left relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={handleCloseHistoryModal}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#FFEDF8] flex items-center justify-center text-[#83047A] hover:bg-[#ffdef9] hover:scale-105 transition-all cursor-pointer shadow-sm z-20 flex-shrink-0"
              title="Close"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            <div className="overflow-y-auto p-8 sm:p-10 space-y-8">

            <div className="pb-10 border-b border-[#FFD2F7]">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 text-left">
                Student Assessment History
              </h1>
              <p className="text-[#000000] font-light text-[21px] mb-9 text-left">
                Every quiz attempt this student has ever made — live and complete.
              </p>
              <div className="flex items-center gap-7">
                <Avatar
                  name={selectedStudent.name}
                  src={selectedStudent.avatar}
                  onClick={selectedStudent.avatar ? () => setZoomedImage(selectedStudent.avatar) : undefined}
                  className={`w-[150px] h-[150px] !text-[42px] border-[3px] border-[#FFD2F7] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.15)] flex-shrink-0 ${selectedStudent.avatar ? 'cursor-pointer hover:scale-[1.03] transition-transform duration-300' : ''}`}
                />
                <div className="space-y-1.5">
                  <h2 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">{selectedStudent.name || '—'}</h2>
                  <p className="text-[17px] text-[#83047A] font-medium">{selectedStudent.email || '—'}</p>
                </div>
              </div>
            </div>

            {historyLoading ? (
              <div className="py-14 text-center text-gray-500">
                <Loader2 size={30} className="mx-auto mb-3 animate-spin text-[#83047A]" />
                Loading assessment history...
              </div>
            ) : historyError ? (
              <div className="py-14 text-center">
                <div className="text-lg font-semibold text-gray-700">{historyError}</div>
                <button
                  type="button"
                  onClick={() => loadHistory(selectedStudentUserId, { initial: true })}
                  className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] transition-colors text-[13px] font-medium cursor-pointer"
                >
                  Retry
                </button>
              </div>
            ) : (
              <>
                <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-6 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
                  <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <TrendingUp size={22} className="text-[#83047A]" /> Lifetime Summary
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                    <div className="bg-[#F9F9F9] px-4 py-4 rounded-xl border border-gray-100 text-center">
                      <span className="text-[12px] font-normal text-[#525252] block mb-1">Total Attempts</span>
                      <span className="text-[22px] font-bold text-gray-900 block">{historyData?.summary?.totalAttempts ?? 0}</span>
                    </div>
                    <div className="bg-[#E0FFEE] px-4 py-4 rounded-xl border border-[#BFF3D8] text-center">
                      <span className="text-[12px] font-normal text-[#046B33] block mb-1">Completed</span>
                      <span className="text-[22px] font-bold text-[#008A39] block">{historyData?.summary?.completedCount ?? 0}</span>
                    </div>
                    <div className="bg-[#FFFEDE] px-4 py-4 rounded-xl border border-[#F3EBBF] text-center">
                      <span className="text-[12px] font-normal text-[#7A5100] block mb-1">In Progress</span>
                      <span className="text-[22px] font-bold text-[#9F5603] block">{historyData?.summary?.inProgressCount ?? 0}</span>
                    </div>
                    <div className="bg-[#FFECEC] px-4 py-4 rounded-xl border border-[#F3C9C9] text-center">
                      <span className="text-[12px] font-normal text-[#8A1414] block mb-1">Errors</span>
                      <span className="text-[22px] font-bold text-[#B91C1C] block">{historyData?.summary?.errorCount ?? 0}</span>
                    </div>
                    <div className="bg-[#F5F3FF] px-4 py-4 rounded-xl border border-[#E7DEFF] text-center">
                      <span className="text-[12px] font-normal text-[#4B3B8F] block mb-1">Best Score</span>
                      <span className="text-[22px] font-bold text-[#3E2E8E] block">
                        {historyData?.summary?.bestScore !== null && historyData?.summary?.bestScore !== undefined ? `${historyData.summary.bestScore}%` : '—'}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-5 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
                  <div className="flex items-center justify-between">
                    <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                      <History size={22} className="text-[#83047A]" /> Assessment History
                    </h3>
                    <span className="text-[13px] font-normal text-gray-400">
                      {(historyData?.attempts || []).length} attempt{(historyData?.attempts || []).length === 1 ? '' : 's'}
                    </span>
                  </div>

                  {approveMsg.text && (
                    <div className={`flex items-center gap-2 p-3 mb-3 rounded-[12px] text-[14px] font-medium border ${
                      approveMsg.type === 'error' ? 'bg-red-50 text-red-600 border-red-200' : 'bg-green-50 text-green-700 border-green-200'
                    }`}>
                      {approveMsg.type === 'error' ? <XCircle size={18} className="flex-shrink-0" /> : <CheckCircle2 size={18} className="flex-shrink-0" />}
                      <span>{approveMsg.text}</span>
                    </div>
                  )}
                  {(historyData?.attempts || []).length > 0 ? (
                    <div className="max-h-[420px] overflow-y-auto rounded-xl border border-gray-50">
                      <table className="w-full text-left border-collapse min-w-[720px]">
                        <thead className="sticky top-0 bg-white z-10">
                          <tr className="border-b border-gray-100 text-[#545454] text-[13px] font-normal">
                            <th className="py-3 pl-3 pr-2 font-normal w-10">#</th>
                            <th className="py-3 px-2 font-normal">Status</th>
                            <th className="py-3 px-2 font-normal">Score</th>
                            <th className="py-3 px-2 font-normal">Career Match</th>
                            <th className="py-3 px-2 font-normal">Match %</th>
                            <th className="py-3 px-2 font-normal">Date &amp; Time</th>
                            <th className="py-3 pl-2 pr-3 font-normal">Certificate</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {historyData.attempts.map((attempt, index) => (
                            <tr key={attempt.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="py-3.5 pl-3 pr-2 text-[13px] font-medium text-gray-500">{index + 1}</td>

                              <td className="py-3.5 px-2">
                                {attempt.status === 'Completed' ? (
                                  <span className="bg-[#E0FFEE] text-[#008A39] rounded-full text-[13px] font-normal inline-flex items-center gap-[6px] px-3 py-1">
                                    <CheckCircle2 size={12} className="flex-shrink-0" /> Completed
                                  </span>
                                ) : attempt.status === 'In Progress' ? (
                                  <span className="bg-[#FFFEDE] text-[#9F5603] rounded-full text-[13px] font-normal inline-flex items-center gap-[6px] px-3 py-1">
                                    <Clock size={12} className="flex-shrink-0" /> In Progress
                                  </span>
                                ) : (
                                  <span className="bg-[#FFECEC] text-[#B91C1C] rounded-full text-[13px] font-normal inline-flex items-center gap-[6px] px-3 py-1">
                                    <XCircle size={12} className="flex-shrink-0" /> Error
                                  </span>
                                )}
                              </td>

                              <td className="py-3.5 px-2 font-medium text-gray-900 text-[14px]">
                                {attempt.score !== null && attempt.score !== undefined ? (
                                  <div className="flex items-center gap-2">
                                    <span style={{ width: '8px', height: '8px', backgroundColor: '#7E06AD' }} className="rounded-[2px] inline-block flex-shrink-0" />
                                    <span>{attempt.score}%</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>

                              <td className="py-3.5 px-2 font-normal text-gray-800 text-[14px] max-w-[180px]">
                                {attempt.careerMatch ? (
                                  <div className="flex items-center gap-1.5 min-w-0">
                                    <Award size={15} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                                    <span className="truncate">{attempt.careerMatch}</span>
                                  </div>
                                ) : (
                                  <span className="text-gray-400">—</span>
                                )}
                              </td>

                              <td className="py-3.5 px-2">
                                {attempt.matchPercent !== null && attempt.matchPercent !== undefined ? (
                                  <span className={`font-medium text-[14px] ${getMatchColorClass(attempt.matchPercent)}`}>
                                    {attempt.matchPercent}%
                                  </span>
                                ) : (
                                  <span className="text-gray-400 text-[14px]">—</span>
                                )}
                              </td>

                              <td className="py-3.5 px-2 text-gray-500 font-light text-[13px] whitespace-nowrap">
                                {attempt.status === 'In Progress' ? (
                                  <span className="text-[#9F5603] font-medium">Just now</span>
                                ) : (
                                  <>
                                    <div>{attempt.date || '—'}</div>
                                    {attempt.time && <div className="text-[12px] text-gray-400">{attempt.time}</div>}
                                  </>
                                )}
                              </td>

                              <td className="py-3.5 pl-2 pr-3 align-top w-[172px]">
                                {attempt.status === 'Completed' && attempt.certificate ? (
                                  <div className="space-y-2">
                                    <div className="space-y-1">
                                      {(attempt.certificate.careers || []).map((career) => (
                                        <div key={career.careerId} className="flex items-center gap-1.5 text-[12px]" title={`${career.careerTitle}: ${career.completedSteps} of ${career.totalSteps} steps`}>
                                          <span className="truncate w-[76px] text-gray-700">{career.careerTitle}</span>
                                          <div className="w-[34px] h-[5px] bg-gray-200 rounded-full overflow-hidden flex-shrink-0">
                                            <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${career.percent}%` }} />
                                          </div>
                                          <span className="w-[34px] text-right font-semibold text-emerald-600 flex-shrink-0">{career.percent}%</span>
                                        </div>
                                      ))}
                                    </div>
                                    {attempt.certificate.status === 'approved' ? (
                                      <span className="bg-[#E0FFEE] text-[#008A39] rounded-full text-[12.5px] font-medium inline-flex items-center gap-[6px] px-3 py-1">
                                        <BadgeCheck size={13} className="flex-shrink-0" /> Approved
                                      </span>
                                    ) : attempt.certificate.status === 'pending_approval' ? (
                                      <button
                                        type="button"
                                        onClick={() => handleApproveCertificate(attempt)}
                                        disabled={approvingId !== null}
                                        className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] text-[12.5px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition-all shadow-sm cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                                      >
                                        {approvingId === attempt.id
                                          ? <Loader2 size={13} className="animate-spin" />
                                          : <CheckCircle2 size={13} />}
                                        Approve
                                      </button>
                                    ) : (
                                      <span className="bg-[#FFFEDE] text-[#9F5603] rounded-full text-[12.5px] font-medium inline-flex items-center gap-[6px] px-3 py-1">
                                        <Clock size={12} className="flex-shrink-0" /> In progress {attempt.certificate.completedCareers}/{attempt.certificate.totalCareers}
                                      </span>
                                    )}
                                  </div>
                                ) : (
                                  <span className="text-gray-300 text-[13px]">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  ) : (
                    <div className="py-8 text-center text-gray-400">
                      <AlertTriangle size={26} className="mx-auto mb-2" />
                      No assessment attempts recorded yet.
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => handleSendEmail(selectedStudent)}
                    className="inline-flex items-center justify-center gap-2 font-medium text-[15px] px-5 py-2.5 rounded-[15px] border border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Mail size={17} strokeWidth={2.2} />
                    Send Email
                  </button>

                  <button
                    type="button"
                    onClick={() => alert(`Exporting report for ${selectedStudent.name}`)}
                    style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                    className="inline-flex items-center justify-center gap-2 font-medium text-[15px] px-5 py-2.5 rounded-[15px] custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer shadow-sm"
                  >
                    <Download size={17} strokeWidth={2.5} />
                    Export Report
                  </button>
                </div>
              </>
            )}
            </div>
          </div>
        </div>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 m-0! z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
          onClick={() => setZoomedImage(null)}
        >
          <div className="relative inline-flex items-center justify-center">
            <button
              type="button"
              onClick={() => setZoomedImage(null)}
              className="absolute -top-4 -right-4 w-10 h-10 bg-white/10 hover:bg-white/20 rounded-full flex items-center justify-center text-white backdrop-blur-sm transition-colors z-10 cursor-pointer border border-white/30"
              title="Close Image"
            >
              <X size={24} strokeWidth={2} />
            </button>
            <img
              src={zoomedImage}
              alt="Expanded view"
              className="max-w-[78vw] max-h-[75vh] object-contain shadow-2xl cursor-default animate-in zoom-in-95 duration-200"
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </div>
      )}

      {createPortal(
        <div className="results-print-area bg-white text-gray-900 text-left font-['Inter',sans-serif] antialiased">
          <div className="print-avoid flex items-center justify-between pb-5 border-b-2 border-[#FFD2F7]">
            <img src="/logoo.png" alt="CareerPathAI" className="h-14 w-auto object-contain" />
            <div className="text-right text-[13px] text-gray-500 font-medium">
              <div>{(printedAt || new Date()).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>{(printedAt || new Date()).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <div className="print-avoid pt-7 pb-6">
            <h1 className="text-[30px] font-bold tracking-tight text-gray-900 mb-1">Student Results</h1>
            <p className="text-[15px] font-light text-[#525252]">
              Complete record of student assessment results at the time of export.
            </p>
          </div>

          <div className="print-avoid grid grid-cols-4 gap-3 mb-7">
            {statCards.map((stat) => (
              <div
                key={stat.id}
                className="bg-white h-[84px] px-3 rounded-[16px] prototype-card-border shadow-[0px_2px_3px_rgba(0,0,0,0.18)] flex items-center gap-2.5"
              >
                <div className="text-[24px] select-none flex-shrink-0">{stat.emoji}</div>
                <div className="flex flex-col justify-center min-w-0">
                  <div className="text-[21px] font-bold text-gray-900 tracking-tight leading-tight">{stat.value}</div>
                  <div className="text-[10.5px] font-normal text-[#545454] leading-tight whitespace-nowrap">{stat.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="print-table-card bg-[#ffffff] rounded-[25px] px-4 py-3 border border-[#FFD2F7] shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] mr-[4px] mb-[8px]">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[#545454] text-[11px] font-normal whitespace-nowrap">
                  <th className="py-2.5 pl-1 pr-2 font-normal w-8">#</th>
                  <th className="py-2.5 pr-2 font-normal">Student</th>
                  <th className="py-2.5 pr-2 font-normal">Status</th>
                  <th className="py-2.5 pr-2 font-normal">Score</th>
                  <th className="py-2.5 pr-2 font-normal">Top Career Match</th>
                  <th className="py-2.5 pr-2 font-normal">Match %</th>
                  <th className="py-2.5 font-normal">Completed</th>
                </tr>
              </thead>
              <tbody>
                {filteredStudents.length > 0 ? filteredStudents.map((student) => {
                  const t = formatEventTime(student);
                  return (
                    <tr key={student.rowId} className="border-b border-gray-50 last:border-0 align-middle">
                      <td className="py-2.5 pl-1 pr-2 text-[11px] font-medium text-gray-500">{student.displayRank}</td>

                      <td className="py-2.5 pr-2">
                        <div className="flex items-center gap-2">
                          <Avatar
                            name={student.name}
                            src={student.avatar}
                            className="w-8 h-8 flex-shrink-0 border border-pink-100 !text-[11px]"
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-[#000000] text-[12.5px] leading-tight">{student.name || '—'}</div>
                            <div className="text-[10px] text-[#373737] font-normal break-all leading-tight">{student.email || '—'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-2.5 pr-2 whitespace-nowrap">
                        {student.status === 'Completed' ? (
                          <span className="px-2 py-0.5 bg-[#E0FFEE] text-[#008A39] rounded-full text-[10.5px] font-normal inline-flex items-center gap-1">
                            <CheckCircle2 size={10} className="flex-shrink-0" /> Completed
                          </span>
                        ) : student.status === 'In Progress' ? (
                          <span className="px-2 py-0.5 bg-[#FFFEDE] text-[#9F5603] rounded-full text-[10.5px] font-normal inline-flex items-center gap-1">
                            <Clock size={10} className="flex-shrink-0" /> In Progress
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 bg-[#FFECEC] text-[#B91C1C] rounded-full text-[10.5px] font-normal inline-flex items-center gap-1">
                            <XCircle size={10} className="flex-shrink-0" /> Error
                          </span>
                        )}
                      </td>

                      <td className="py-2.5 pr-2 font-medium text-gray-900 text-[11.5px] whitespace-nowrap">
                        {student.score !== null && student.score !== undefined ? (
                          <div className="flex items-center gap-1.5">
                            <span style={{ width: '7px', height: '7px', backgroundColor: '#7E06AD' }} className="rounded-[2px] inline-block flex-shrink-0" />
                            <span>{student.score}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-2.5 pr-2 font-normal text-gray-800 text-[12px]">
                        {student.matchCareer ? (
                          <div className="flex items-center gap-1.5">
                            <Award size={13} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                            <span>{student.matchCareer}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-2.5 pr-2 whitespace-nowrap">
                        {student.matchPct !== null && student.matchPct !== undefined ? (
                          <span className={`font-medium text-[14px] ${getMatchColorClass(student.matchPct)}`}>{student.matchPct}%</span>
                        ) : (
                          <span className="text-gray-400 text-[14px]">—</span>
                        )}
                      </td>

                      <td className="py-2.5 text-gray-500 font-light text-[11px] whitespace-nowrap">
                        <div className={student.status === 'In Progress' ? 'text-[#9F5603] font-medium' : ''}>{t.primary}</div>
                        {t.secondary && <div className="text-[10px] text-gray-400">{t.secondary}</div>}
                      </td>
                    </tr>
                  );
                }) : (
                  <tr>
                    <td colSpan="7" className="py-10 text-center text-[13px] text-gray-500">No student results to export.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="print-avoid pt-8 mt-10 border-t border-gray-200 flex items-center justify-between">
            <p className="text-[11px] text-gray-400 mb-8">© {new Date().getFullYear()} CareerPathAI. All rights reserved.</p>
            <div className="text-center">
              <div className="flex justify-center -mb-2"><Signature width={180} /></div>
              <div className="w-[200px] border-b border-gray-400 mb-1.5 mx-auto"></div>
              <p className="text-[13px] font-semibold text-gray-700">Authorized Signature</p>
              <p className="text-[12px] text-gray-400">CareerPath AI Team</p>
            </div>
          </div>
        </div>,
        document.body
      )}
    </div>
  );
}
