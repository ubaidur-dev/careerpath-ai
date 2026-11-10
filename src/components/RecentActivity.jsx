import React, { useState, useEffect, useMemo, useCallback } from 'react';
import useModalHistory from '../utils/useModalHistory';
import useRestoredState from '../utils/useRestoredState';
import axios from 'axios';
import Dropdown from './Dropdown';
import {
  Search,
  Filter,
  RotateCcw,
  Loader2,
  RefreshCw,
  CheckCircle2,
  XCircle,
  Monitor,
  Smartphone,
  Tablet,
  User,
  X
} from 'lucide-react';

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
    <div
      onClick={onClick}
      className={`rounded-full bg-[#FFBFF4] text-[#83047A] font-bold flex items-center justify-center select-none text-[13px] ${className}`}
    >
      {getInitials(name) || <User size={16} />}
    </div>
  );
}

const DEVICE_ICON = {
  Mobile: Smartphone,
  Tablet: Tablet,
  Desktop: Monitor,
};

const mapEntry = (e) => ({
  id: e.id,
  name: e.name || '',
  email: e.email || '',
  avatar: e.avatar || '',
  ipAddress: e.ipAddress || '',
  deviceType: e.deviceType || 'Desktop',
  browser: e.browser || '',
  platform: e.platform || '',
  status: e.status,
  failureReason: e.failureReason || '',
  loginAt: e.loginAt || null,
  loginTime: e.loginTime || '—',
  logoutTime: e.logoutTime || null,
  isActive: !!e.isActive,
  durationLabel: e.durationLabel || null,
});

const DATE_RANGE_OPTIONS = ['All Time', 'Today', 'Yesterday', 'Last 7 Days', 'Last 30 Days'];

const matchesDateRange = (isoString, range) => {
  if (range === 'All Time' || !isoString) return true;
  const loginDate = new Date(isoString);
  const now = new Date();

  if (range === 'Today') {
    return loginDate.toDateString() === now.toDateString();
  }
  if (range === 'Yesterday') {
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    return loginDate.toDateString() === yesterday.toDateString();
  }
  if (range === 'Last 7 Days') {
    return now.getTime() - loginDate.getTime() <= 7 * 24 * 60 * 60 * 1000;
  }
  if (range === 'Last 30 Days') {
    return now.getTime() - loginDate.getTime() <= 30 * 24 * 60 * 60 * 1000;
  }
  return true;
};

export default function RecentActivity({ onBack }) {
  const [searchQuery, setSearchQuery] = useRestoredState('RecentActivity.searchQuery', '');
  const [statusFilter, setStatusFilter] = useRestoredState('RecentActivity.statusFilter', 'All Status');
  const [dateRangeFilter, setDateRangeFilter] = useRestoredState('RecentActivity.dateRangeFilter', 'All Time');
  const [currentPage, setCurrentPage] = useRestoredState('RecentActivity.currentPage', 1);
  const [zoomedImage, setZoomedImage] = useState(null);
  useModalHistory(!!zoomedImage, () => setZoomedImage(null));
  const itemsPerPage = 20;

  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivity = useCallback(async ({ initial = false } = {}) => {
    try {
      if (initial) setLoading(true);
      const response = await axios.get('/admin/student-login-activity');
      const list = Array.isArray(response.data?.activity) ? response.data.activity : [];
      setActivity(list.map(mapEntry));
      setError('');
    } catch (err) {
      console.error('Failed to load recent activity', err);
      if (initial) setError('Unable to load recent activity right now. Please try again.');
    } finally {
      if (initial) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let active = true;
    const run = (opts) => { if (active) loadActivity(opts); };
    run({ initial: true });
    const timer = setInterval(() => run({ initial: false }), POLL_MS);
    return () => { active = false; clearInterval(timer); };
  }, [loadActivity]);

  const allActivity = useMemo(
    () => activity.map((entry, index) => ({ ...entry, displayRank: index + 1 })),
    [activity]
  );

  const statusesList = ['All Status', 'Completed', 'Error'];

  const filteredActivity = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return allActivity.filter((entry) => {
      const searchableValues = [
        entry.displayRank,
        entry.name,
        entry.email,
        entry.ipAddress,
        entry.deviceType,
        entry.browser,
        entry.platform,
        entry.status,
        entry.loginTime,
        entry.logoutTime,
        entry.durationLabel,
        entry.isActive ? 'Active now' : null,
      ];
      const matchQuery = !q || searchableValues.some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );
      const matchStatus = statusFilter === 'All Status' || entry.status === statusFilter;
      const matchDateRange = matchesDateRange(entry.loginAt, dateRangeFilter);
      return matchQuery && matchStatus && matchDateRange;
    });
  }, [allActivity, searchQuery, statusFilter, dateRangeFilter]);

  const hasActiveFilter = searchQuery.trim() !== '' || statusFilter !== 'All Status' || dateRangeFilter !== 'All Time';

  const totalPages = Math.ceil(filteredActivity.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = hasActiveFilter ? 0 : (activePage - 1) * itemsPerPage;
  const endIndex = hasActiveFilter ? filteredActivity.length : Math.min(startIndex + itemsPerPage, filteredActivity.length);
  const displayedActivity = useMemo(
    () => filteredActivity.slice(startIndex, endIndex),
    [filteredActivity, startIndex, endIndex]
  );

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setSearchQuery('');
    setStatusFilter('All Status');
    setDateRangeFilter('All Time');
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div className="space-y-6 text-left">
      <style>
        {`
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
        `}
      </style>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
            Recent Activity
          </h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Monitor student sign-in and sign-out activity in real time
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[25px] prototype-card-border shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto sm:flex-1">
          <div className="relative flex-1 min-w-[180px]">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              placeholder="Search by name, email, IP, device..."
              className="w-full pl-11 pr-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 placeholder-gray-400 font-normal"
            />
          </div>

          <Dropdown
            value={dateRangeFilter}
            onChange={(v) => { setDateRangeFilter(v); setCurrentPage(1); }}
            options={DATE_RANGE_OPTIONS}
            ariaLabel="Filter by date range"
            className="w-full sm:w-[160px] flex-shrink-0"
            triggerClassName="bg-[#FCF8FE] border-[#FFD2F7] rounded-xl px-4 py-3 text-[16px]"
          />

          <Dropdown
            value={statusFilter}
            onChange={(v) => { setStatusFilter(v); setCurrentPage(1); }}
            options={statusesList}
            ariaLabel="Filter by status"
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
            Showing <strong className="text-gray-900 font-semibold">{filteredActivity.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{filteredActivity.length}</strong>
          </span>
        </div>
      </div>

      <div className="bg-[#ffffff] rounded-[25px] p-5 sm:p-6 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[1000px]">
            <thead>
              <tr className="border-b border-gray-100 text-[#545454] text-[14px] font-normal">
                <th className="py-3 px-3 font-normal w-12">#</th>
                <th className="py-3 px-3 font-normal">Student</th>
                <th className="py-3 px-3 font-normal">IP Address</th>
                <th className="py-3 px-3 font-normal">Device</th>
                <th className="py-3 px-3 font-normal">Status</th>
                <th className="py-3 px-3 font-normal">Login</th>
                <th className="py-3 px-3 font-normal">Logout</th>
                <th className="py-3 px-3 font-normal">Duration</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50/80">
              {loading ? (
                <tr>
                  <td colSpan="8" className="py-16 text-center text-gray-500">
                    <Loader2 size={30} className="mx-auto mb-3 animate-spin text-[#83047A]" />
                    <div className="text-[15px] font-medium text-gray-600">Loading recent activity...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="8" className="py-14 text-center">
                    <div className="text-lg font-semibold text-gray-700">{error}</div>
                    <button
                      type="button"
                      onClick={() => loadActivity({ initial: true })}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] transition-colors text-[13px] font-medium cursor-pointer"
                    >
                      <RefreshCw size={14} /> Try again
                    </button>
                  </td>
                </tr>
              ) : displayedActivity.length > 0 ? (
                displayedActivity.map((entry) => {
                  const DeviceIcon = DEVICE_ICON[entry.deviceType] || Monitor;
                  return (
                    <tr key={entry.id} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-3 px-3 text-[14px] font-normal text-gray-600">
                        {entry.displayRank}
                      </td>

                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2.5">
                          <Avatar
                            name={entry.name}
                            src={entry.avatar}
                            onClick={entry.avatar ? () => setZoomedImage(entry.avatar) : undefined}
                            className={`w-10 h-10 border-[1.5px] border-[#FFD2F7] flex-shrink-0 ${entry.avatar ? 'cursor-pointer hover:scale-[1.1] transition-transform duration-200' : ''}`}
                          />
                          <div className="min-w-0">
                            <div className="font-medium text-[#000000] text-[15px] truncate">{entry.name || '—'}</div>
                            <div className="text-[13px] text-[#373737] font-normal truncate">{entry.email || '—'}</div>
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-3 font-normal text-gray-700 text-[14px]">{entry.ipAddress || '—'}</td>

                      <td className="py-3 px-3 font-normal text-gray-700 text-[14px]">
                        <div className="flex items-center gap-2">
                          <DeviceIcon size={16} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                          <span>{entry.deviceType}{entry.browser ? ` · ${entry.browser}` : ''}</span>
                        </div>
                      </td>

                      <td className="py-3 px-3">
                        {entry.status === 'Completed' ? (
                          <span className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#E0FFEE] text-[#008A39] whitespace-nowrap">
                            <CheckCircle2 size={13} className="flex-shrink-0" /> Completed
                          </span>
                        ) : (
                          <span
                            className="inline-flex items-center justify-center gap-1.5 px-3 py-1 rounded-full text-[13px] font-medium bg-[#FFECEC] text-[#B91C1C] whitespace-nowrap"
                            title={entry.failureReason || 'Login failed'}
                          >
                            <XCircle size={13} className="flex-shrink-0" /> Error
                          </span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-normal text-gray-700 text-[14px] whitespace-nowrap">{entry.loginTime}</td>

                      <td className="py-3 px-3 font-normal text-[14px] whitespace-nowrap">
                        {entry.status !== 'Completed' ? (
                          <span className="text-gray-400">—</span>
                        ) : entry.isActive ? (
                          <span className="inline-flex items-center gap-1.5 text-[#890080] font-medium">
                            <span className="w-2 h-2 rounded-full bg-[#890080] animate-pulse flex-shrink-0" />
                            Active now
                          </span>
                        ) : (
                          <span className="text-gray-700">{entry.logoutTime}</span>
                        )}
                      </td>

                      <td className="py-3 px-3 font-medium text-gray-900 text-[14px] whitespace-nowrap">
                        {entry.durationLabel || <span className="text-gray-400 font-normal">—</span>}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="8" className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="text-lg font-semibold text-gray-700">
                      {activity.length === 0 ? 'No login activity recorded yet.' : 'No activity found matching your filters.'}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {activity.length === 0 ? 'Student sign-ins will appear here automatically.' : 'Try resetting the search or status filter.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!hasActiveFilter && !loading && !error && filteredActivity.length > 0 && (
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
    </div>
  );
}
