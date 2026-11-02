import { useState, useMemo, useEffect } from 'react';
import { createPortal } from 'react-dom';
import axios from 'axios';
import {
  Search,
  Filter,
  Eye,
  X,
  GraduationCap,
  FileText,
  User,
  Globe,
  Target,
  Loader2,
  RefreshCw,
  RotateCcw,
  KeyRound,
  Ban,
  CheckCircle2,
  Download,
  Check
} from 'lucide-react';
import BackToDashboardButton from './BackToDashboardButton';
import Signature from './Signature';


const mapStudent = (s) => ({
  id: s.id,
  name: s.name || '',
  email: s.email || '',
  phone: s.phone || '',
  country: s.country || '',
  city: s.city || '',
  avatar: s.avatar || '',
  joinedAt: s.joinedAt || '',
  isSuspended: !!s.isSuspended,
  hasProfile: !!s.hasProfile,
  dob: s.dob || '',
  address: s.address || '',
  gender: s.gender || '',
  degree: s.currentEducation || '',
  field: s.fieldOfStudy || '',
  university: s.university || '',
  cgpa: s.cgpa || '',
  gradYear: s.expectedGraduation || '',
  careerInterests: Array.isArray(s.interests) ? s.interests : [],
  targetRoles: Array.isArray(s.targetRoles) ? s.targetRoles : [],
  skills: Array.isArray(s.skills) ? s.skills : [],
  workMode: Array.isArray(s.workPreference) ? s.workPreference.join(', ') : (s.workPreference || ''),
  bio: s.bio || '',
  linkedin: s.linkedin || '',
  github: s.github || '',
  portfolio: s.portfolio || '',
  twitter: s.twitter || ''
});

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

function Avatar({ name, src, className = '', textClass = 'text-[13px]', onClick }) {
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
      className={`rounded-full bg-[#FFBFF4] text-[#83047A] font-bold flex items-center justify-center select-none ${textClass} ${className}`}
    >
      {getInitials(name) || <User size={18} />}
    </div>
  );
}

export default function TotalStudents({ onBack }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudentId, setSelectedStudentId] = useState(null);
  const [zoomedImage, setZoomedImage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [actionLoading, setActionLoading] = useState('');

  const showToast = (message) => {
    setToast(message);
    setTimeout(() => setToast(''), 3500);
  };

  const loadStudents = async ({ initial = false } = {}) => {
    try {
      if (initial) setLoading(true);
      const response = await axios.get('/admin/students');
      const list = Array.isArray(response.data?.students) ? response.data.students : [];
      setStudents(list.map(mapStudent));
      setError('');
    } catch (err) {
      console.error('Failed to load students', err);
      if (initial) setError('Unable to load students right now. Please try again.');
    } finally {
      if (initial) setLoading(false);
    }
  };

  const handleToggleSuspension = async (student) => {
    setActionLoading('suspend');
    try {
      const response = await axios.post(`/admin/students/${student.id}/toggle-suspension`);
      setStudents((prev) => prev.map((s) => (
        s.id === student.id ? { ...s, isSuspended: response.data?.isSuspended ?? !s.isSuspended } : s
      )));
      showToast(response.data?.message || 'Student status updated.');
    } catch (err) {
      console.error('Failed to toggle suspension', err);
      showToast(err.response?.data?.message || 'Failed to update student status.');
    } finally {
      setActionLoading('');
    }
  };

  const handleSendPasswordReset = async (student) => {
    setActionLoading('reset');
    try {
      const response = await axios.post(`/admin/students/${student.id}/send-password-reset`);
      showToast(response.data?.message || 'Password reset link sent.');
    } catch (err) {
      console.error('Failed to send password reset', err);
      showToast(err.response?.data?.message || 'Failed to send password reset link.');
    } finally {
      setActionLoading('');
    }
  };

  const handleExportPdf = () => {
    const now = new Date();
    const date = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
    const name = String(selectedStudent?.name || 'Student').replace(/[\\/:*?"<>|]+/g, ' ').replace(/\s+/g, ' ').trim();
    const previousTitle = document.title;
    const restoreTitle = () => {
      document.title = previousTitle;
      window.removeEventListener('afterprint', restoreTitle);
    };
    window.addEventListener('afterprint', restoreTitle);
    document.title = `${name} - Student Details - CareerPath AI - ${date}`;
    window.print();
  };

  useEffect(() => {
    let active = true;
    const run = (opts) => { if (active) loadStudents(opts); };
    run({ initial: true });
    const timer = setInterval(() => run({ initial: false }), 30000);
    return () => { active = false; clearInterval(timer); };
  }, []);

  const selectedStudent = selectedStudentId
    ? students.find((s) => s.id === selectedStudentId) || null
    : null;

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return students;
    return students.filter((student) => {
      const searchableValues = [
        student.name,
        student.email,
        student.phone,
        student.city,
        student.country,
        student.degree,
        student.field,
      ];
      return searchableValues.some(
        (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
      );
    });
  }, [searchQuery, students]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredStudents.length);
  const displayedStudents = filteredStudents.slice(startIndex, endIndex);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const formatLocation = (student) => {
    const parts = [student.city, student.country].filter(Boolean);
    return parts.length ? parts.join(', ') : '';
  };

  const InfoField = ({ label, value }) => (
    <div className="print-avoid bg-[#F9F9F9] px-4 py-3 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[60px]">
      <span className="text-[13px] font-normal text-[#525252] block leading-tight mb-1">{label}</span>
      <span className="text-[14px] font-bold text-gray-800 leading-tight break-words">{value || '—'}</span>
    </div>
  );

  return (
    <div className="w-full space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left font-['Inter',sans-serif]">
      <style>
        {`
          .custom-quiz-border { border: 0.7px solid #FF00D3; }
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          .custom-card-shadow { box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25); }
          .student-print-area { display: none; }
          @media print {
            body * { visibility: hidden; }
            .student-print-area, .student-print-area * { visibility: visible; }
            .student-print-area {
              display: block !important;
              position: absolute;
              top: 0; left: 0;
              width: 100%;
              background: #ffffff;
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .student-print-area .print-avoid { break-inside: avoid; page-break-inside: avoid; }
            .student-print-area h1, .student-print-area h3 { break-after: avoid; page-break-after: avoid; }
            .student-print-area p { orphans: 3; widows: 3; overflow-wrap: anywhere; }
          }
        `}
      </style>

      {toast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-[#83047A] flex items-center justify-center text-white flex-shrink-0">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-medium">{toast}</span>
        </div>
      )}

      <BackToDashboardButton onClick={() => onBack && onBack()} />

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2">
          <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 inline-flex items-center gap-2">
            Total Students
          </h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            View and manage all registered student accounts
          </p>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[25px] prototype-card-border custom-card-shadow">
        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
          <div className="relative w-full sm:w-96">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by student name or email..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 placeholder-gray-400 font-normal"
            />
          </div>
          {searchQuery !== '' && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
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

      <div className="bg-[#ffffff] rounded-[25px] p-5 sm:p-6 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[900px]">
            <thead>
              <tr className="border-b border-gray-100 text-[#545454] text-[14px] font-normal">
                <th className="py-3 px-3 font-normal w-12">#</th>
                <th className="py-3 px-3 font-normal">Student</th>
                <th className="py-3 px-3 font-normal">Email</th>
                <th className="py-3 px-3 font-normal">Phone</th>
                <th className="py-3 px-3 font-normal">Location</th>
                <th className="py-3 px-3 font-normal">Degree / Field</th>
                <th className="py-3 px-3 text-center font-normal">Action</th>
              </tr>
            </thead>

            <tbody className="divide-y divide-gray-50/80">
              {loading ? (
                <tr>
                  <td colSpan="7" className="py-16 text-center text-gray-500">
                    <Loader2 size={30} className="mx-auto mb-3 animate-spin text-[#83047A]" />
                    <div className="text-[15px] font-medium text-gray-600">Loading students...</div>
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan="7" className="py-14 text-center">
                    <div className="text-lg font-semibold text-gray-700">{error}</div>
                    <button
                      type="button"
                      onClick={() => loadStudents({ initial: true })}
                      className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] transition-colors text-[13px] font-medium cursor-pointer"
                    >
                      <RefreshCw size={14} /> Try again
                    </button>
                  </td>
                </tr>
              ) : displayedStudents.length > 0 ? (
                displayedStudents.map((student, index) => (
                  <tr key={student.id} className="hover:bg-gray-50/60 transition-colors">
                    <td className="py-3 px-3 text-[14px] font-normal text-gray-600">
                      {startIndex + index + 1}
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-2.5">
                        <Avatar
                          name={student.name}
                          src={student.avatar}
                          onClick={student.avatar ? () => setZoomedImage(student.avatar) : undefined}
                          className={`w-10 h-10 border-[1.5px] border-[#FFD2F7] flex-shrink-0 ${student.avatar ? 'cursor-pointer hover:scale-[1.1] transition-transform duration-200' : ''}`}
                        />
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-[#000000] text-[15px] truncate">{student.name || '—'}</span>
                            {student.isSuspended && (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-[#FFECEC] text-[#B91C1C] whitespace-nowrap flex-shrink-0">
                                <Ban size={10} /> Suspended
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 font-normal text-gray-700 text-[14px]">{student.email || '—'}</td>
                    <td className="py-3 px-3 font-normal text-gray-700 text-[14px]">{student.phone || '—'}</td>
                    <td className="py-3 px-3 font-normal text-gray-700 text-[14px]">
                      {formatLocation(student) || '—'}
                    </td>

                    <td className="py-3 px-3 font-normal text-gray-800 text-[14px]">
                      <div className="flex items-center gap-2">
                        <GraduationCap size={17} className="text-[#000DFF] flex-shrink-0" strokeWidth={2.2} />
                        <span className="truncate">{student.degree || student.field || '—'}</span>
                      </div>
                    </td>

                    <td className="py-3 px-3 text-center">
                      <button
                        type="button"
                        onClick={() => setSelectedStudentId(student.id)}
                        className="inline-flex items-center justify-center font-medium text-[13px] px-4 py-1.5 rounded-[12px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] hover:border-[#83047A]/50 hover:scale-[1.02] transition-all duration-200 cursor-pointer shadow-sm active:scale-95 whitespace-nowrap"
                      >
                        <Eye size={15} className="mr-2 text-[#83047A]" /> View
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="py-12 text-center text-gray-500">
                    <div className="text-4xl mb-2">🔍</div>
                    <div className="text-lg font-semibold text-gray-700">
                      {students.length === 0 ? 'No students have registered yet.' : 'No students found matching your search.'}
                    </div>
                    <p className="text-sm text-gray-400 mt-1">
                      {students.length === 0 ? 'New sign-ups will appear here automatically.' : 'Try a different name, email, or city.'}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {!loading && !error && filteredStudents.length > 0 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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
                  className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-medium transition-all cursor-pointer ${
                    activePage === pageNum
                      ? 'bg-[#F45EE4] text-white shadow-sm'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-[#F45EE4] hover:text-[#890080]'
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
            className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}

      {selectedStudent && createPortal(
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setSelectedStudentId(null)}
        >
          <div
            className="bg-white rounded-[25px] prototype-card-border custom-card-shadow w-full max-w-4xl max-h-[90vh] flex flex-col text-left relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setSelectedStudentId(null)}
              className="absolute top-6 right-6 w-11 h-11 rounded-full bg-[#FFEDF8] flex items-center justify-center text-[#83047A] hover:bg-[#ffdef9] hover:scale-105 transition-all cursor-pointer shadow-sm z-20 flex-shrink-0"
              title="Close"
            >
              <X size={22} strokeWidth={2.5} />
            </button>

            <div className="overflow-y-auto p-8 sm:p-10 space-y-8">

           <div className="pb-10 border-b border-[#FFD2F7]">
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 mb-2 text-left">
                Student Details
              </h1>
              <p className="text-[#000000] font-light text-[21px] mb-9 text-left">
                Review complete student profile, academic background, and career details.
              </p>
              <div className="flex items-center gap-7">
                <Avatar
                  name={selectedStudent.name}
                  src={selectedStudent.avatar}
                  textClass="text-[42px]"
                  onClick={selectedStudent.avatar ? () => setZoomedImage(selectedStudent.avatar) : undefined}
                  className={`w-[150px] h-[150px] border-[3px] border-[#FFD2F7] shadow-[2px_4px_6px_0px_rgba(0,0,0,0.15)] flex-shrink-0 ${selectedStudent.avatar ? 'cursor-pointer hover:scale-[1.03] transition-transform duration-300' : ''}`}
                />
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <h2 className="text-[26px] font-bold text-gray-900 tracking-tight leading-none">{selectedStudent.name || '—'}</h2>
                    {selectedStudent.isSuspended ? (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#FFECEC] text-[#B91C1C]">
                        <Ban size={12} /> Suspended
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[12px] font-semibold bg-[#E0FFEE] text-[#008A39]">
                        <CheckCircle2 size={12} /> Active
                      </span>
                    )}
                  </div>
                  <p className="text-[17px] text-[#83047A] font-medium">{selectedStudent.email || '—'}</p>
                  {!selectedStudent.hasProfile && (
                    <p className="text-[13px] text-gray-400 font-normal pt-1">
                      This student hasn't completed their profile yet — only sign-up details are available.
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-6 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
              <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <User size={22} className="text-[#83047A]" /> Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Full Name" value={selectedStudent.name} />
                <InfoField label="Phone Number" value={selectedStudent.phone} />
                <InfoField label="Date of Birth" value={selectedStudent.dob} />
                <InfoField label="City" value={selectedStudent.city} />
                <InfoField label="Country" value={selectedStudent.country} />
                <InfoField label="Gender" value={selectedStudent.gender} />
                <div className="col-span-1 md:col-span-2 lg:col-span-3 bg-[#F9F9F9] px-4 py-3 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <span className="text-[13px] font-normal text-[#525252] block mb-1">Residential Address</span>
                  <span className="text-[14px] font-bold text-gray-800 break-words">{selectedStudent.address || '—'}</span>
                </div>
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-6 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
              <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <GraduationCap size={22} className="text-[#83047A]" /> Education Background
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                <InfoField label="Current Education / Degree" value={selectedStudent.degree} />
                <InfoField label="Field of Study / Major" value={selectedStudent.field} />
                <InfoField label="University / College" value={selectedStudent.university} />
                <InfoField label="Current CGPA / Grade" value={selectedStudent.cgpa} />
                <InfoField label="Expected Graduation Year" value={selectedStudent.gradYear} />
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-6 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
              <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Target size={22} className="text-[#83047A]" /> Career Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <InfoField label="Career Interests / Domains" value={selectedStudent.careerInterests?.join(', ')} />
                <InfoField label="Target Job Roles" value={selectedStudent.targetRoles?.join(', ')} />

                <div className="bg-[#FFFFFF] px-4 py-3 rounded-xl border border-gray-100 flex flex-col justify-center">
                  <span className="text-[13px] font-normal text-[#525252] block mb-2">Core Skills & Frameworks</span>
                  <div className="flex flex-wrap gap-1.5 items-center">
                    {(selectedStudent.skills || []).length > 0 ? (
                      (selectedStudent.skills || []).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          style={{ border: '0.5px solid #A3A3A3', fontSize: '12px' }}
                          className="font-medium text-[#525252] bg-[#A3A3A3]/10 px-2.5 py-0.5 rounded-[12px]"
                        >
                          {sk}
                        </span>
                      ))
                    ) : (
                      <span className="text-[14px] font-bold text-gray-800">—</span>
                    )}
                  </div>
                </div>

                <InfoField label="Preferred Work Mode" value={selectedStudent.workMode} />
              </div>
            </div>

            <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-4 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
              <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <FileText size={22} className="text-[#83047A]" /> Professional Summary
              </h3>
              <p className="text-[15px] font-normal text-[#525252] leading-relaxed">
                {selectedStudent.bio || 'No professional summary provided yet.'}
              </p>
            </div>

            <div className="bg-[#FFFFFF] p-7 rounded-[20px] border border-[#FFD2F7] space-y-5 shadow-[0px_4px_4px_1px_rgba(0,0,0,0.25)]">
              <h3 className="text-[21px] font-bold text-gray-900 tracking-tight flex items-center gap-2">
                <Globe size={22} className="text-[#83047A]" /> Social & Professional Links
              </h3>
              <div className="flex flex-wrap gap-3.5">
                {selectedStudent.linkedin && (
                  <a href={selectedStudent.linkedin} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] border border-[#FFD2F7] bg-white text-[#83047A] hover:bg-[#FFE7F2] hover:scale-[1.02] transition-all text-[14.5px] font-semibold shadow-sm">
                    <svg className="w-4 h-4 shrink-0 fill-current text-[#0A66C2]" viewBox="0 0 24 24"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg> LinkedIn
                  </a>
                )}
                {selectedStudent.github && (
                  <a href={selectedStudent.github} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] border border-[#FFD2F7] bg-white text-[#83047A] hover:bg-[#FFE7F2] hover:scale-[1.02] transition-all text-[14.5px] font-semibold shadow-sm">
                    <svg className="w-4 h-4 shrink-0 fill-current text-[#24292e]" viewBox="0 0 24 24"><path d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34-.46-1.16-1.11-1.47-1.11-1.47-.91-.62.07-.6.07-.6 1 .07 1.53 1.03 1.53 1.03.87 1.52 2.34 1.07 2.91.83.1-.65.35-1.09.63-1.34-2.22-.25-4.55-1.11-4.55-4.92 0-1.11.38-2 1.03-2.71-.1-.25-.45-1.29.1-2.64 0 0 .84-.27 2.75 1.02.79-.22 1.65-.33 2.5-.33.85 0 1.71.11 2.5.33 1.91-1.29 2.75-1.02 2.75-1.02.55 1.35.2 2.39.1 2.64.65.71 1.03 1.6 1.03 2.71 0 3.82-2.34 4.66-4.57 4.91.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2z"/></svg> GitHub
                  </a>
                )}
                {selectedStudent.portfolio && (
                  <a href={selectedStudent.portfolio} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] border border-[#FFD2F7] bg-white text-[#83047A] hover:bg-[#FFE7F2] hover:scale-[1.02] transition-all text-[14.5px] font-semibold shadow-sm">
                    <Globe size={17} className="shrink-0 text-[#83047A]" /> Portfolio
                  </a>
                )}
                {selectedStudent.twitter && (
                  <a href={selectedStudent.twitter} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-[15px] border border-[#FFD2F7] bg-white text-[#83047A] hover:bg-[#FFE7F2] hover:scale-[1.02] transition-all text-[14.5px] font-semibold shadow-sm">
                    <svg className="w-4 h-4 shrink-0 fill-current text-[#000000]" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg> Twitter / X
                  </a>
                )}
                {!selectedStudent.linkedin && !selectedStudent.github && !selectedStudent.portfolio && !selectedStudent.twitter && (
                  <span className="text-[14px] text-gray-400 font-medium">No links provided</span>
                )}
              </div>
            </div>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3 p-6 border-t border-[#FFD2F7] flex-shrink-0">
              <button
                type="button"
                onClick={() => handleSendPasswordReset(selectedStudent)}
                disabled={actionLoading === 'reset'}
                className="inline-flex items-center justify-center gap-2 font-medium text-[15px] px-5 py-2.5 rounded-[15px] border border-gray-200 bg-gray-50 text-gray-700 hover:bg-gray-100 transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100"
              >
                <KeyRound size={17} strokeWidth={2.2} />
                {actionLoading === 'reset' ? 'Sending...' : 'Send Password Reset Link'}
              </button>

              <button
                type="button"
                onClick={() => handleToggleSuspension(selectedStudent)}
                disabled={actionLoading === 'suspend'}
                className={`inline-flex items-center justify-center gap-2 font-medium text-[15px] px-5 py-2.5 rounded-[15px] border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer shadow-sm disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:scale-100 ${
                  selectedStudent.isSuspended
                    ? 'border-[#05A660]/40 bg-[#E0FFEE] text-[#008A39] hover:bg-[#c9ffe4]'
                    : 'border-red-200 bg-red-50 text-red-600 hover:bg-red-100'
                }`}
              >
                {selectedStudent.isSuspended ? <CheckCircle2 size={17} strokeWidth={2.2} /> : <Ban size={17} strokeWidth={2.2} />}
                {actionLoading === 'suspend' ? 'Updating...' : selectedStudent.isSuspended ? 'Reactivate Account' : 'Suspend Account'}
              </button>

              <button
                type="button"
                onClick={handleExportPdf}
                style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                className="inline-flex items-center justify-center gap-2 font-medium text-[15px] px-5 py-2.5 rounded-[15px] custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer shadow-sm"
              >
                <Download size={17} strokeWidth={2.5} />
                Export Data
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {selectedStudent && (
        <div className="student-print-area px-14 py-12 text-left font-['Inter',sans-serif]">
          <div className="print-avoid flex items-center justify-between pb-6 border-b border-[#FFD2F7]">
            <div className="flex items-center">
              <img src="/logoo.png" alt="CareerPathAI" className="h-14 w-auto object-contain" />
            </div>
            <div className="text-right text-[13px] text-gray-500 font-medium">
              <div>{new Date().toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>{new Date().toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}</div>
            </div>
          </div>

          <div className="pt-8 pb-8 border-b border-[#FFD2F7]">
            <h1 className="text-[30px] font-extrabold tracking-tight text-gray-900 mb-1">Student Details</h1>
            <p className="text-[15px] font-light text-gray-600 mb-6">Review complete student profile, academic background, and career details.</p>
            <div className="flex items-center gap-6">
              <Avatar
                name={selectedStudent.name}
                src={selectedStudent.avatar}
                textClass="text-[32px]"
                className="w-[100px] h-[100px] border-[3px] border-[#FFD2F7] flex-shrink-0"
              />
              <div className="space-y-1">
                <div className="flex items-center gap-2.5">
                  <h2 className="text-[22px] font-bold text-gray-900 tracking-tight">{selectedStudent.name || '—'}</h2>
                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-semibold ${selectedStudent.isSuspended ? 'bg-[#FFECEC] text-[#B91C1C]' : 'bg-[#E0FFEE] text-[#008A39]'}`}>
                    {selectedStudent.isSuspended ? 'Suspended' : 'Active'}
                  </span>
                </div>
                <p className="text-[15px] text-[#83047A] font-medium">{selectedStudent.email || '—'}</p>
              </div>
            </div>
          </div>

          <div className="pt-8 space-y-7">
            <div className="space-y-4">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Personal Information</h3>
              <div className="grid grid-cols-3 gap-4">
                <InfoField label="Full Name" value={selectedStudent.name} />
                <InfoField label="Phone Number" value={selectedStudent.phone} />
                <InfoField label="Date of Birth" value={selectedStudent.dob} />
                <InfoField label="City" value={selectedStudent.city} />
                <InfoField label="Country" value={selectedStudent.country} />
                <InfoField label="Gender" value={selectedStudent.gender} />
              </div>
              <InfoField label="Residential Address" value={selectedStudent.address} />
            </div>

            <div className="space-y-4">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Education Background</h3>
              <div className="grid grid-cols-3 gap-4">
                <InfoField label="Current Education / Degree" value={selectedStudent.degree} />
                <InfoField label="Field of Study / Major" value={selectedStudent.field} />
                <InfoField label="University / College" value={selectedStudent.university} />
                <InfoField label="Current CGPA / Grade" value={selectedStudent.cgpa} />
                <InfoField label="Expected Graduation Year" value={selectedStudent.gradYear} />
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Career Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <InfoField label="Career Interests / Domains" value={selectedStudent.careerInterests?.join(', ')} />
                <InfoField label="Target Job Roles" value={selectedStudent.targetRoles?.join(', ')} />
                <InfoField label="Core Skills & Frameworks" value={selectedStudent.skills?.join(', ')} />
                <InfoField label="Preferred Work Mode" value={selectedStudent.workMode} />
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Professional Summary</h3>
              <p className="text-[13.5px] font-normal text-[#525252] leading-relaxed">
                {selectedStudent.bio || 'No professional summary provided yet.'}
              </p>
            </div>

            <div className="space-y-3">
              <h3 className="text-[17px] font-bold text-gray-900 tracking-tight">Social & Professional Links</h3>
              <p className="text-[13.5px] font-normal text-[#525252] break-all">
                {[
                  selectedStudent.linkedin && `LinkedIn: ${selectedStudent.linkedin}`,
                  selectedStudent.github && `GitHub: ${selectedStudent.github}`,
                  selectedStudent.portfolio && `Portfolio: ${selectedStudent.portfolio}`,
                  selectedStudent.twitter && `Twitter/X: ${selectedStudent.twitter}`,
                ].filter(Boolean).join('  •  ') || 'No links provided'}
              </p>
            </div>
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
        </div>
      )}

      {zoomedImage && (
        <div
          className="fixed inset-0 z-[100] bg-black/50 backdrop-blur-md flex items-center justify-center p-4 cursor-pointer animate-in fade-in duration-200"
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
