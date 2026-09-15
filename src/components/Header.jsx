import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, User, LogOut, Bell, Briefcase, ClipboardList, BellOff } from 'lucide-react';
import axios from 'axios';

const STUDENT_NOTIFICATION_STYLE = {
  career_added: { icon: Briefcase, bg: '#EAEEFF', color: '#000ACF' },
  quiz_updated: { icon: ClipboardList, bg: '#FDF2FF', color: '#890080' },
};

const buildStudentNotifications = (items) =>
  (items || []).slice(0, 8).map((item, idx) => {
    const style = STUDENT_NOTIFICATION_STYLE[item.type] || STUDENT_NOTIFICATION_STYLE.career_added;
    return {
      id: `student-${item.timestamp}-${idx}`,
      icon: style.icon,
      bg: style.bg,
      color: style.color,
      title: item.text,
      text: item.detail,
      time: item.time,
      unread: idx < 2,
    };
  });


const ADMIN_ACTIVITY_COPY = {
  'New Student': {
    title: (name) => `${name} joined CareerPath`,
    text: () => 'New student registration',
  },
  'In Progress': {
    title: (name) => `${name} started an assessment`,
    text: () => 'Career assessment in progress',
  },
  'Completed': {
    title: (name) => `${name} completed an assessment`,
    text: (score) => (score !== null && score !== undefined ? `Scored ${score}% on the career quiz` : 'Assessment completed'),
  },
  'Error': {
    title: (name) => `${name} left an assessment incomplete`,
    text: () => 'Assessment was abandoned before finishing',
  },
};

const getInitials = (name) => {
  if (!name) return '';
  const parts = name.trim().split(/\s+/);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.substring(0, 2).toUpperCase();
};

const buildAdminNotifications = (items) =>
  (items || []).slice(0, 8).map((item, idx) => {
    const copy = ADMIN_ACTIVITY_COPY[item.status] || ADMIN_ACTIVITY_COPY['New Student'];
    return {
      id: `admin-${item.timestamp}-${idx}`,
      isPerson: true,
      avatarUrl: item.avatar || null,
      name: item.name,
      title: copy.title(item.name),
      text: copy.text(item.score),
      time: item.time,
      unread: idx < 2,
    };
  });

export default function Header({ onNavigate, onLogout, currentView = 'dashboard', userRole }) {
  const [displayName, setDisplayName] = useState('User');
  const [role, setRole] = useState(userRole || 'student');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all');
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const notifRef = useRef(null);
  const effectiveRole = userRole || role;
  const notificationsSource = effectiveRole === 'admin' ? adminNotifications : studentNotifications;
  const unreadCount = notificationsSource.filter((n) => n.unread).length;
  const visibleNotifications = notifTab === 'unread' ? notificationsSource.filter((n) => n.unread) : notificationsSource;

  useEffect(() => {
    if (effectiveRole !== 'admin') return undefined;

    
    const fetchAdminActivity = () => {
      axios.get('/admin/notifications')
        .then((res) => setAdminNotifications(buildAdminNotifications(res.data?.activity)))
        .catch(() => {});
    };

    fetchAdminActivity();
    const interval = setInterval(fetchAdminActivity, 5000);
    return () => clearInterval(interval);
  }, [effectiveRole]);

  useEffect(() => {
    if (effectiveRole === 'admin') return undefined;
    const token = sessionStorage.getItem('token');
    if (!token) return undefined;

    
    const fetchStudentActivity = () => {
      axios.get('/student/notifications', { headers: { Authorization: `Bearer ${token}` } })
        .then((res) => setStudentNotifications(buildStudentNotifications(res.data?.notifications)))
        .catch(() => {});
    };

    fetchStudentActivity();
    const interval = setInterval(fetchStudentActivity, 5000);
    return () => clearInterval(interval);
  }, [effectiveRole]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setIsNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
  
    const applyStoredUser = () => {
      const storedUser = sessionStorage.getItem('user');
      if (!storedUser) return null;
      try {
        const userObj = JSON.parse(storedUser);
        if (userObj.role) setRole(userObj.role);
        if (userObj.name) setDisplayName(userObj.name.split(' ')[0]); // Get first name
        setAvatarUrl(userObj.avatar_url || userObj.avatar || null);
        return userObj;
      } catch {
        return null;
      }
    };

    const fetchUserData = async () => {
      try {
        const userObj = applyStoredUser();
        const detectedRole = userObj?.role || userRole;

        if (!userObj?.name) {
          setDisplayName(detectedRole === 'admin' ? 'Admin' : 'Student');
        }

        const token = sessionStorage.getItem('token');
        if (token) {
          const response = await axios.get('/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          const freshUser = response.data;
          if (freshUser) {
            if (freshUser.name) setDisplayName(freshUser.name.split(' ')[0]);
            if (freshUser.role) setRole(freshUser.role);
            setAvatarUrl(freshUser.avatar_url || freshUser.avatar || null);

            const merged = { ...(userObj || {}), ...freshUser };
            sessionStorage.setItem('user', JSON.stringify(merged));
          }
        }
      } catch (error) {
        console.error("Error fetching user name in Header:", error);
        setDisplayName(role === 'admin' ? 'Admin' : 'Student');
      }
    };

    fetchUserData();

    window.addEventListener('user-profile-updated', applyStoredUser);
    return () => {
      window.removeEventListener('user-profile-updated', applyStoredUser);
    };
  }, [userRole]);

  const isProfileOrSettingsActive = currentView === 'profile' || currentView === 'settings' || currentView === 'admin-settings';
  const isDashboardActive = currentView === 'dashboard';

  const handleProfileClick = () => {
    if (!onNavigate) return;
  
    const effectiveRole = userRole || role;
    if (effectiveRole === 'admin') {
      onNavigate('settings');
    } else {
      onNavigate('profile');
    }
  };

  const handleDashboardClick = () => {
    if (!onNavigate) return;
    onNavigate('dashboard');
  };

  const roleAccent = effectiveRole === 'admin' ? '#bd24df' : '#890080';
  const initial = (displayName || 'U').trim().charAt(0).toUpperCase();

  return (
    <header className="sticky top-0 z-50 bg-white/85 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70 border-b border-gray-100 shadow-[0_1px_2px_rgba(16,24,40,0.04)] w-full font-inter">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .hd-clear-logo {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: auto;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">

        <div
          className="flex items-center select-none cursor-pointer my-auto transition-opacity duration-200 hover:opacity-85"
          onClick={handleDashboardClick}
        >
          <img
            src="/logoo.png"
            alt="CareerPath AI Logo"
            className="h-11 xs:h-12 sm:h-16 w-auto object-contain hd-clear-logo"
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-3">

        <div ref={notifRef} className="relative">
          <button
            type="button"
            onClick={() => setIsNotifOpen((prev) => !prev)}
            className={`relative flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ${
              isNotifOpen ? 'bg-white text-[#890080] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#890080]'
            }`}
            title="Notifications"
          >
            <Bell size={20} strokeWidth={2.2} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 min-w-[16px] h-[16px] px-[3px] rounded-full bg-red-800 text-white text-[9.5px] font-bold flex items-center justify-center ring-2 ring-white">
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-[360px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">

              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-[14px] font-semibold text-gray-900">Notifications</h3>
                <button
                  type="button"
                  disabled={unreadCount === 0}
                  className="text-[12px] font-medium text-[#890080] hover:underline cursor-pointer disabled:text-gray-300 disabled:no-underline disabled:cursor-not-allowed"
                >
                  Mark all read
                </button>
              </div>

              <div className="flex items-center gap-4 px-4 border-b border-gray-100">
                {['all', 'unread'].map((tab) => (
                  <button
                    key={tab}
                    type="button"
                    onClick={() => setNotifTab(tab)}
                    className={`py-2 text-[12.5px] font-medium capitalize border-b-2 -mb-px transition-colors cursor-pointer ${
                      notifTab === tab
                        ? 'border-[#890080] text-[#890080]'
                        : 'border-transparent text-gray-400 hover:text-gray-600'
                    }`}
                  >
                    {tab}
                  </button>
                ))}
              </div>

              <div className="max-h-[300px] overflow-y-auto divide-y divide-gray-100">
                {visibleNotifications.length === 0 ? (
                  <div className="flex flex-col items-center justify-center gap-1.5 py-10 px-4 text-center">
                    <BellOff size={20} strokeWidth={1.8} className="text-gray-300" />
                    <p className="text-[12.5px] text-gray-400">No unread notifications</p>
                  </div>
                ) : (
                  visibleNotifications.map((n) => {
                    const NotifIcon = n.icon;
                    return (
                      <div
                        key={n.id}
                        className="flex items-start gap-3 px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer"
                      >
                        {n.isPerson ? (
                          <div className="w-8 h-8 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0 bg-gradient-to-br from-[#FFE1FD] to-[#FFD2F7]">
                            {n.avatarUrl ? (
                              <img src={n.avatarUrl} alt={n.name} className="w-full h-full object-cover" />
                            ) : (
                              <span className="text-[10.5px] font-bold text-[#890080]">{getInitials(n.name)}</span>
                            )}
                          </div>
                        ) : (
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                            style={{ backgroundColor: n.bg, color: n.color }}
                          >
                            <NotifIcon size={15} strokeWidth={2.2} />
                          </div>
                        )}
                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-1.5">
                            <p className="text-[13px] font-medium text-gray-900 truncate">{n.title}</p>
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#890080] flex-shrink-0" />}
                          </div>
                          <span className="text-[11px] text-gray-400">{n.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              <button
                type="button"
                onClick={() => setIsNotifOpen(false)}
                className="w-full py-2.5 border-t border-gray-100 text-[12.5px] font-medium text-[#890080] hover:bg-gray-50 transition-colors cursor-pointer"
              >
                {effectiveRole === 'admin' ? 'View all student activity' : 'View all notifications'}
              </button>
            </div>
          )}
        </div>

        <div className="flex items-center gap-1 sm:gap-1.5 h-full bg-gray-50/80 border border-gray-100/90 rounded-2xl p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">

          <button
            type="button"
            onClick={handleDashboardClick}
            className={`flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:px-4 rounded-xl text-sm font-semibold transition-all duration-200 font-inter cursor-pointer flex-shrink-0 ${
              isDashboardActive
                ? 'bg-white text-[#bd24df] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]'
                : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-[#bd24df]'
            }`}
          >
            <LayoutDashboard
              size={20}
              strokeWidth={2.5}
              className={isDashboardActive ? 'text-[#bd24df]' : 'text-gray-500'}
            />
            <span className="hidden sm:inline">Dashboard</span>
          </button>

          <div className="w-px h-6 bg-gray-200/80 mx-0.5 hidden sm:block" />

          <div
            onClick={handleProfileClick}
            className={`flex items-center justify-center gap-2.5 text-sm font-medium rounded-xl h-10 w-10 sm:w-auto sm:pl-1.5 sm:pr-4 transition-all duration-200 font-inter cursor-pointer flex-shrink-0 ${
              isProfileOrSettingsActive
                ? 'bg-white text-[#bd24df] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]'
                : 'bg-transparent text-gray-700 hover:bg-white/70 hover:text-[#bd24df]'
            }`}
          >
            <User
              size={20}
              strokeWidth={2.5}
              className={`${isProfileOrSettingsActive ? 'text-[#bd24df]' : 'text-gray-500'} sm:hidden`}
            />
            <div
              style={{ boxShadow: `0 0 0 2px ${isProfileOrSettingsActive ? '#f5dbfc' : '#ffffff'}, 0 0 0 3px ${roleAccent}33` }}
              className="hidden sm:flex w-8 h-8 rounded-full bg-gradient-to-br from-[#FFE1FD] to-[#FFD2F7] items-center justify-center overflow-hidden flex-shrink-0"
            >
              {avatarUrl ? (
                <img
                  src={avatarUrl}
                  alt={`${displayName}'s avatar`}
                  className="w-full h-full object-cover"
                  onError={() => setAvatarUrl(null)}
                />
              ) : (
                <span className="text-[13px] font-bold" style={{ color: roleAccent }}>{initial}</span>
              )}
            </div>
            <span className="hidden sm:inline">{displayName}!</span>
          </div>

          <div className="w-px h-6 bg-gray-200/80 mx-0.5 hidden sm:block" />

          <button
            type="button"
            onClick={onLogout}
            className="flex items-center justify-center gap-1.5 text-gray-600 h-10 w-10 sm:w-auto sm:px-4 rounded-xl text-sm font-medium cursor-pointer hover:bg-red-50 hover:text-red-600 transition-all duration-200 font-inter flex-shrink-0"
          >
            <LogOut
              size={20}
              strokeWidth={2.5}
              className="transition-colors"
            />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
        </div>
      </div>
    </header>
  );
}
