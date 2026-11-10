import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useRestoredState from '../utils/useRestoredState';
import axios from 'axios';
import { createPortal, flushSync } from 'react-dom';
import Header from './Header';
import Dropdown from './Dropdown';
import { formatIssueDate } from '../utils/issueDate';
import Signature from './Signature';
import AssessmentReport from './AssessmentReport';
import {
  Search,
  Download,
  RotateCcw,
  Award,
  CheckCircle2,
  Clock,
  XCircle,
  Loader2,
  Filter,
  History,
  TrendingUp,
  AlertTriangle,
  Eye,
  Lock
} from 'lucide-react';
import { getScoreColorClass } from '../utils/scoreColors';

const POLL_MS = 4000;

const getAuthToken = () => sessionStorage.getItem('token');

const getMatchColorClass = getScoreColorClass;

export default function StudentAssessmentHistory({ onNavigate, onLogout }) {
  const [searchQuery, setSearchQuery] = useRestoredState('StudentAssessmentHistory.searchQuery', '');
  const [statusFilter, setStatusFilter] = useRestoredState('StudentAssessmentHistory.statusFilter', 'All Status');
  const [dateFilter, setDateFilter] = useRestoredState('StudentAssessmentHistory.dateFilter', 'All Dates');
  const [currentPage, setCurrentPage] = useRestoredState('StudentAssessmentHistory.currentPage', 1);
  const itemsPerPage = 20;

  const [historyData, setHistoryData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [certificateAttempt, setCertificateAttempt] = useState(null);
  const [reportPrint, setReportPrint] = useState(null);
  const [reportLoadingId, setReportLoadingId] = useState(null);
  const [lockTip, setLockTip] = useState(null);
  const [reportError, setReportError] = useState('');

  const loadHistory = useCallback(async ({ initial = false } = {}) => {
    const token = getAuthToken();
    if (!token) {
      if (initial) { setError('Session expired. Please log in again.'); setLoading(false); }
      return;
    }
    try {
      if (initial) setLoading(true);
      const response = await axios.get('/student/assessment-history', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setHistoryData(response.data || null);
      setError('');
    } catch (err) {
      console.error('Failed to load assessment history', err);
      if (initial) setError('Unable to load your assessment history right now. Please try again.');
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = (opts) => { if (active) loadHistory(opts); };
    run({ initial: true });
    const timer = setInterval(() => run({ initial: false }), POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, [loadHistory]);

  const attempts = historyData?.attempts || [];
  const summary = historyData?.summary || {};
  const studentName = historyData?.user?.name || 'Student';

  const statusesList = ['All Status', 'Completed', 'In Progress', 'Error'];
  const datesList = useMemo(() => {
    const unique = Array.from(new Set(attempts.map((a) => a.date).filter(Boolean))).sort().reverse();
    return ['All Dates', ...unique];
  }, [attempts]);

  const filteredAttempts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return attempts.filter((attempt) => {
      const searchableValues = [
        attempt.serial,
        attempt.status,
        attempt.score !== null && attempt.score !== undefined ? `${attempt.score}%` : null,
        attempt.careerMatch,
        attempt.matchPercent !== null && attempt.matchPercent !== undefined ? `${attempt.matchPercent}%` : null,
        attempt.date,
        attempt.time,
      ];
      const matchQuery = !q || searchableValues.some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );
      const matchStatus = statusFilter === 'All Status' || attempt.status === statusFilter;
      const matchDate = dateFilter === 'All Dates' || attempt.date === dateFilter;
      return matchQuery && matchStatus && matchDate;
    });
  }, [attempts, searchQuery, statusFilter, dateFilter]);

  const hasActiveFilter = searchQuery.trim() !== '' || statusFilter !== 'All Status' || dateFilter !== 'All Dates';

  const totalPages = Math.ceil(filteredAttempts.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = hasActiveFilter ? 0 : (activePage - 1) * itemsPerPage;
  const endIndex = hasActiveFilter ? filteredAttempts.length : Math.min(startIndex + itemsPerPage, filteredAttempts.length);
  const displayedAttempts = useMemo(
    () => filteredAttempts.slice(startIndex, endIndex),
    [filteredAttempts, startIndex, endIndex]
  );

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

  const handleViewReport = async (attempt) => {
    if (reportLoadingId) return;
    setReportLoadingId(attempt.id);
    setReportError('');
    try {
      const token = getAuthToken();
      const { data } = await axios.get(`/quiz/results/${attempt.id}`, { headers: { Authorization: `Bearer ${token}` } });
      flushSync(() => setReportPrint({ ...data, issuedAt: formatIssueDate(new Date()) }));
      await document.fonts.ready;
      await Promise.all([...document.querySelectorAll('.report-print-root img')].map((img) => (
        img.complete ? null : new Promise((resolve) => { img.onload = resolve; img.onerror = resolve; })
      )));
      const restore = () => {
        setReportPrint(null);
        window.removeEventListener('afterprint', restore);
      };
      window.addEventListener('afterprint', restore);
      window.print();
    } catch (err) {
      console.error('Failed to create assessment report', err);
      setReportError(err?.response?.data?.message || 'We could not create this report right now. Please try again.');
      setTimeout(() => setReportError(''), 3500);
    } finally {
      setReportLoadingId(null);
    }
  };

  const handleDownloadCertificate = (attempt) => {
    if (!attempt.certificate?.eligible) return;
    setCertificateAttempt({
      ...attempt,
      issuedAt: formatIssueDate(new Date()),
      certificates: attempt.certificate.certificates,
    });
    setTimeout(() => window.print(), 50);
  };

  const showLockTip = (event, attempt) => {
    const rect = event.currentTarget.getBoundingClientRect();
    setLockTip({ attempt, top: rect.top, right: window.innerWidth - rect.right });
  };

  const statCards = [
    { id: 1, label: 'Total Attempts', value: String(summary.totalAttempts ?? 0), emoji: '📝' },
    { id: 2, label: 'Completed', value: String(summary.completedCount ?? 0), emoji: '✅' },
    { id: 3, label: 'Best Score', value: summary.bestScore !== null && summary.bestScore !== undefined ? `${summary.bestScore}%` : '—', emoji: '🏆' },
    { id: 4, label: 'Average Score', value: summary.avgScore !== null && summary.avgScore !== undefined ? `${summary.avgScore}%` : '—', emoji: '📈' },
  ];

  return (
    <div className="assessment-history-root w-full bg-[#fcf8fe] text-gray-900 antialiased space-y-8 pb-10 relative min-h-screen">
      <style>
        {`
          .custom-quiz-border { border: 0.7px solid #FF00D3; }
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          @media print {
            @page { size: 297mm 210mm; margin: 0; }
            html, body { margin: 0 !important; padding: 0 !important; background: #ffffff !important; }
            body > *:not(.certificate-print-root):not(.report-print-root) { display: none !important; }
            .certificate-print-root, .report-print-root { display: block !important; }
            .certificate-print-page {
              display: flex !important;
              width: 297mm;
              height: 210mm;
              overflow: hidden;
              box-sizing: border-box;
              padding: 10mm;
              background: #ffffff;
              break-after: page;
              page-break-after: always;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .certificate-print-page:last-child { break-after: auto; page-break-after: auto; }
          }
        `}
      </style>

      <div className="no-print">
      <Header onNavigate={onNavigate} onLogout={onLogout} userRole="student" currentView="assessment-history" />

      {lockTip && (
        <div
          className="fixed z-[100] w-[270px] -translate-y-full -mt-2 px-4 py-3 rounded-[12px] bg-white border border-[#FFD2F7] shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-left pointer-events-none animate-fade-in"
          style={{ top: lockTip.top, right: lockTip.right }}
        >
          {lockTip.attempt.certificate?.status === 'pending_approval' ? (
            <>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#890080]">
                <Clock size={15} /> Awaiting approval
              </div>
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                Thank you for your patience! You've completed every career roadmap of this assessment. Our team is
                reviewing it, and you'll get a notification as soon as your certificate is approved.
              </p>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2 text-[14px] font-semibold text-[#890080]">
                <Lock size={15} /> Certificate locked
              </div>
              <p className="text-[13px] text-gray-600 mt-1 leading-relaxed">
                Complete any one career's roadmap on the Progress page to unlock that career's certificate - finish more to unlock more.
              </p>
            </>
          )}
          <div className="mt-2.5 space-y-1">
            <div className="flex justify-between text-[12px] font-medium">
              <span className="text-gray-500">Careers completed</span>
              <span className="text-[#890080]">{lockTip.attempt.certificate?.completedCareers ?? 0} of {lockTip.attempt.certificate?.totalCareers ?? 0}</span>
            </div>
            <div className="w-full h-[6px] bg-[#F7E8FF] rounded-full overflow-hidden">
              <div
                className="h-full bg-[#890080] rounded-full"
                style={{ width: `${lockTip.attempt.certificate?.totalCareers ? (100 * lockTip.attempt.certificate.completedCareers) / lockTip.attempt.certificate.totalCareers : 0}%` }}
              />
            </div>
          </div>
        </div>
      )}

      {reportError && (
        <div className="fixed top-6 right-6 z-[100] flex items-center gap-2 px-4 py-3 rounded-[12px] border text-[14px] font-medium shadow-lg bg-red-50 text-red-600 border-red-200">
          <XCircle size={18} />
          <span>{reportError}</span>
        </div>
      )}

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 space-y-8">

        <div className="space-y-2 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Assessment History</h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Every quiz attempt you've ever made — live and complete.
          </p>
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
                placeholder="Search by status, career, score, date..."
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
              Showing <strong className="text-gray-900 font-semibold">{filteredAttempts.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{filteredAttempts.length}</strong>
            </span>
          </div>
        </div>

        <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-5 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
          <div className="flex items-center justify-between">
            <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
              <History size={22} className="text-[#83047A]" /> Assessment History
            </h3>
            <TrendingUp size={22} className="text-[#635BFF]" />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[720px]">
              <thead>
                <tr className="border-b border-gray-100 text-[#545454] text-[14px] font-normal">
                  <th className="py-3 pl-2 pr-2 font-normal w-10">#</th>
                  <th className="py-3 px-2 font-normal">Status</th>
                  <th className="py-3 px-2 font-normal">Score</th>
                  <th className="py-3 px-2 font-normal">Career Match</th>
                  <th className="py-3 px-2 font-normal">Match %</th>
                  <th className="py-3 px-2 font-normal">Date &amp; Time</th>
                  <th className="py-3 px-2 text-center font-normal">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50/80">
                {loading ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-gray-500">
                      <Loader2 size={30} className="mx-auto mb-3 animate-spin text-[#83047A]" />
                      Loading your assessment history...
                    </td>
                  </tr>
                ) : error ? (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-gray-500">
                      <div className="text-4xl mb-2">⚠️</div>
                      <div className="text-lg font-semibold text-gray-700">{error}</div>
                      <button
                        type="button"
                        onClick={() => loadHistory({ initial: true })}
                        className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] transition-colors text-[13px] font-medium cursor-pointer"
                      >
                        Retry
                      </button>
                    </td>
                  </tr>
                ) : displayedAttempts.length > 0 ? (
                  displayedAttempts.map((attempt) => (
                    <tr key={attempt.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3.5 pl-2 pr-2 text-[14px] font-medium text-gray-500">{attempt.serial}</td>

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

                      <td className="py-3.5 px-2 font-medium text-gray-900 text-[15px]">
                        {attempt.score !== null && attempt.score !== undefined ? (
                          <div className="flex items-center gap-2">
                            <span style={{ width: '9px', height: '9px', backgroundColor: '#7E06AD' }} className="rounded-full inline-block flex-shrink-0" />
                            <span>{attempt.score}%</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-2 font-normal text-gray-800 text-[15px] max-w-[200px]">
                        {attempt.careerMatch ? (
                          <div className="flex items-center gap-1.5 min-w-0">
                            <Award size={16} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                            <span className="truncate">{attempt.careerMatch}</span>
                          </div>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-2">
                        {attempt.matchPercent !== null && attempt.matchPercent !== undefined ? (
                          <span className={`font-medium text-[15px] ${getMatchColorClass(attempt.matchPercent)}`}>
                            {attempt.matchPercent}%
                          </span>
                        ) : (
                          <span className="text-gray-400 text-[15px]">—</span>
                        )}
                      </td>

                      <td className="py-3.5 px-2 text-gray-500 font-light text-[14px]">
                        {attempt.status === 'In Progress' ? (
                          <span className="text-[#9F5603] font-medium">Just now</span>
                        ) : (
                          <>
                            <div>{attempt.date || '—'}</div>
                            {attempt.time && <div className="text-[12px] text-gray-400">{attempt.time}</div>}
                          </>
                        )}
                      </td>

                      <td className="py-3.5 px-2 text-center">
                        {attempt.status === 'Completed' ? (
                          <div className="inline-flex items-center justify-center gap-2">
                            <button
                              type="button"
                              onClick={() => handleViewReport(attempt)}
                              disabled={reportLoadingId !== null}
                              title="View full report (PDF)"
                              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] border border-gray-200 bg-gray-100 text-gray-700 hover:bg-gray-200 transition-all text-[13px] font-medium cursor-pointer whitespace-nowrap disabled:cursor-wait disabled:opacity-70"
                            >
                              {reportLoadingId === attempt.id
                                ? <Loader2 size={14} strokeWidth={2.2} className="animate-spin" />
                                : <Eye size={14} strokeWidth={2.2} />}
                              View
                            </button>
                            {attempt.certificate?.eligible ? (
                              <button
                                type="button"
                                onClick={() => handleDownloadCertificate(attempt)}
                                title="Download Certificate"
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] border border-[#D9B8FF] bg-[#F3E4FF] text-[#7E06AD] hover:bg-[#E9D2FF] transition-all text-[13px] font-medium cursor-pointer whitespace-nowrap"
                              >
                                <Download size={14} strokeWidth={2.2} /> Certificate
                              </button>
                            ) : (
                              <span
                                role="button"
                                aria-disabled="true"
                                tabIndex={0}
                                onMouseEnter={(e) => showLockTip(e, attempt)}
                                onMouseLeave={() => setLockTip(null)}
                                onFocus={(e) => showLockTip(e, attempt)}
                                onBlur={() => setLockTip(null)}
                                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] text-[13px] font-medium whitespace-nowrap cursor-not-allowed select-none"
                              >
                                <span className="inline-flex items-center gap-1.5 opacity-50 blur-[1.2px]">
                                  <Download size={14} strokeWidth={2.2} /> Certificate
                                </span>
                                {attempt.certificate?.status === 'pending_approval'
                                  ? <Clock size={13} strokeWidth={2.4} className="text-[#83047A]" />
                                  : <Lock size={13} strokeWidth={2.4} className="text-[#83047A]" />}
                              </span>
                            )}
                          </div>
                        ) : (
                          <span className="text-gray-300 text-[13px]">—</span>
                        )}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="py-14 text-center text-gray-500">
                      <AlertTriangle size={28} className="mx-auto mb-2 text-gray-300" />
                      <div className="text-lg font-semibold text-gray-700">
                        {attempts.length === 0 ? 'No assessment attempts recorded yet.' : 'No attempts match your filters.'}
                      </div>
                      <p className="text-sm text-gray-400 mt-1">
                        {attempts.length === 0 ? 'Take your first career assessment to start building your history.' : 'Try resetting the status, date, or search terms.'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {!hasActiveFilter && !loading && !error && filteredAttempts.length > 0 && (
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
      </div>

      {reportPrint && createPortal(
        <div className="report-print-root" style={{ display: 'none' }}>
          <style>
            {`@media print {
              @page { size: A4 portrait; margin: 0; }
              .report-print-root [data-pdf-page] {
                zoom: 0.7087;
                height: 1580px !important;
                min-height: 0 !important;
                overflow: hidden;
                break-after: page;
                page-break-after: always;
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .report-print-root [data-pdf-page]:last-child { break-after: auto; page-break-after: auto; }
            }`}
          </style>
          <AssessmentReport report={reportPrint} studentName={studentName || 'Student'} />
        </div>,
        document.body
      )}

      {certificateAttempt && createPortal(
        <div className="certificate-print-root" style={{ display: 'none' }}>
          {(certificateAttempt.certificates || []).map((cert) => (
            <div key={cert.certificateId} className="certificate-print-page items-center justify-center">
              <div className="w-full h-full border-[10px] border-[#890080] rounded-[6px] flex items-center justify-center p-3">
                <div className="w-full h-full border-[1.5px] border-[#F45EE4] rounded-[4px] flex flex-col items-center justify-between text-center font-['Inter',sans-serif] px-20 py-12">

                  <img src="/logoo.png" alt="CareerPathAI" className="h-24 w-auto object-contain" />

                  <div className="space-y-4 max-w-3xl">
                    <p className="text-[16px] font-bold uppercase tracking-[6px] text-[#bd24df]">This certifies that</p>
                    <h1 className="text-[54px] font-extrabold tracking-tight text-gray-900 leading-tight">{studentName}</h1>
                    <p className="text-[18px] text-gray-500 leading-relaxed">
                      has been assessed and successfully matched to the career path of
                    </p>
                    {cert.careerTitle && (
                      <h2 className="text-[36px] font-extrabold tracking-tight text-[#890080]">{cert.careerTitle}</h2>
                    )}
                    <p className="text-[16px] text-gray-400 font-medium pt-1">
                      Overall Assessment Score: <span className="font-bold text-gray-700">{cert.score}%</span>
                    </p>
                  </div>

                  <div className="flex items-end justify-between w-full">
                    <div className="text-left text-[14px] text-gray-500 font-medium leading-relaxed">
                      <div>Issue Date: <span className="text-gray-800">{certificateAttempt.issuedAt}</span></div>
                      <div>Certificate ID: <span className="text-gray-800">{cert.certificateId}</span></div>
                      <div>Certified As: <span className="text-gray-800">CareerPath AI Team</span></div>
                    </div>

                    <div className="text-center">
                      <div className="flex justify-center -mb-2"><Signature width={220} /></div>
                      <div className="w-[240px] border-b border-gray-400 mb-1.5 mx-auto"></div>
                      <p className="text-[15px] font-semibold text-gray-700">Authorized Signature</p>
                      <p className="text-[13px] text-gray-400">CareerPath AI Team</p>
                    </div>

                    <div className="flex flex-col items-center gap-1.5">
                      <img src="/Certificate_Sticker.png" alt="CareerPath AI Certified" className="h-[120px] w-auto object-contain" />
                    </div>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}
