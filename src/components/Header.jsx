import React, { useState, useEffect, useRef } from 'react';
import { LayoutDashboard, User, LogOut, Bell, Briefcase, ClipboardList, BellOff, Activity, Menu, ChevronDown, Award } from 'lucide-react';
import axios from 'axios';

const STUDENT_NOTIFICATION_STYLE = {
  career_added: { icon: Briefcase, bg: '#EAEEFF', color: '#000ACF' },
  quiz_updated: { icon: ClipboardList, bg: '#FDF2FF', color: '#890080' },
  certificate_approved: { icon: Award, bg: '#E3F6ED', color: '#05A660' },
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
      ts: Date.parse(item.timestamp) || 0,
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
    text: (score) => (score !== null && score !== undefined ? `Scored ${score}% on the career assessment` : 'Assessment completed'),
  },
  'Error': {
    title: (name) => `${name} left an assessment incomplete`,
    text: () => 'Assessment was abandoned before finishing',
  },
  'Certificate Pending': {
    title: (name) => `${name} completed all career roadmaps`,
    text: (score, item) => `${item?.email ? `${item.email} · ` : ''}Assessment #${item?.assessment ?? ''} certificate is waiting for your approval`,
    link: 'results',
  },
};

const NAV_ITEMS = {
  student: [
    { key: 'browse', label: 'Careers' },
    { key: 'roadmap', label: 'Progress' },
    { key: 'assessment-history', label: 'Results' },
    { key: 'profile', label: 'Profile' },
  ],
  admin: [
    { key: 'careers', label: 'Careers' },
    { key: 'quiz', label: 'Quiz' },
    { key: 'results', label: 'Results' },
    { key: 'total-students', label: 'Students' },
    { key: 'recent-activity', label: 'Activity' },
  ],
};

const getStoredRole = () => {
  try {
    return JSON.parse(sessionStorage.getItem('user') || '{}')?.role || null;
  } catch {
    return null;
  }
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
      text: copy.text(item.score, item),
      link: copy.link || null,
      time: item.time,
      ts: Date.parse(item.timestamp) || 0,
    };
  });

export default function Header({ onNavigate, onLogout, currentView = 'dashboard', userRole }) {
  const [displayName, setDisplayName] = useState('User');
  const [role, setRole] = useState(() => getStoredRole() || userRole || 'student');
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [notifTab, setNotifTab] = useState('all');
  const [adminNotifications, setAdminNotifications] = useState([]);
  const [studentNotifications, setStudentNotifications] = useState([]);
  const notifRef = useRef(null);
  const effectiveRole = getStoredRole() || userRole || role;

  const navItems = NAV_ITEMS[effectiveRole === 'admin' ? 'admin' : 'student'];
  const [viewportWidth, setViewportWidth] = useState(() => (typeof window !== 'undefined' ? window.innerWidth : 1280));
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const MAX_INLINE = 4;
  const navSpace = viewportWidth - 726;
  const maxInline = viewportWidth < 1024
    ? 0
    : navItems.length <= MAX_INLINE && navItems.length * 105 <= navSpace
      ? navItems.length
      : Math.max(1, Math.min(MAX_INLINE, Math.floor((navSpace - 95) / 105)));
  const inlineItems = navItems.slice(0, maxInline);
  const overflowItems = navItems.slice(maxInline);
  const moreActive = overflowItems.some((item) => item.key === currentView);

  useEffect(() => {
    const onResize = () => setViewportWidth(window.innerWidth);
    const onDocClick = (e) => {
      if (!e.target.closest?.('[data-navmenu]')) setIsMoreOpen(false);
    };
    window.addEventListener('resize', onResize);
    document.addEventListener('mousedown', onDocClick);
    return () => {
      window.removeEventListener('resize', onResize);
      document.removeEventListener('mousedown', onDocClick);
    };
  }, []);

  const handleNavClick = (key) => {
    setIsMoreOpen(false);
    if (onNavigate) onNavigate(key);
  };
  const [readMark, setReadMark] = useState(null);
  const [serverUnread, setServerUnread] = useState({ admin: 0, student: 0 });
  const [serverMark, setServerMark] = useState(0);
  const authHeaders = () => ({ Authorization: `Bearer ${sessionStorage.getItem('token')}` });

  const rawNotifications = effectiveRole === 'admin' ? adminNotifications : studentNotifications;
  const notificationsSource = rawNotifications.map((n) => ({ ...n, unread: readMark !== null && n.ts > readMark }));
  const markReadUpTo = (ms) => {
    if (!ms || (readMark !== null && ms <= readMark)) return;
    setReadMark(ms);
    axios.post('/notifications/mark-read', { until: new Date(ms).toISOString() }, { headers: authHeaders() })
      .catch(() => {});
  };
  const locallyRead = rawNotifications.filter((n) => n.ts > serverMark && readMark !== null && n.ts <= readMark).length;
  const unreadCount = Math.max(0, serverUnread[effectiveRole === 'admin' ? 'admin' : 'student'] - locallyRead);
  const visibleNotifications = notifTab === 'unread' ? notificationsSource.filter((n) => n.unread) : notificationsSource;

  useEffect(() => {
    if (effectiveRole !== 'admin') return undefined;
    if (!sessionStorage.getItem('token')) return undefined;

    const fetchAdminActivity = () => {
      axios.get('/admin/notifications', { headers: authHeaders() })
        .then((res) => {
          const list = buildAdminNotifications(res.data?.activity);
          const serverReadUntil = Date.parse(res.data?.read_until) || 0;
          setServerMark(serverReadUntil);
          setReadMark((prev) => Math.max(prev || 0, serverReadUntil));
          setServerUnread((prev) => ({ ...prev, admin: res.data?.unread_count ?? 0 }));
          setAdminNotifications(list);
        })
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
        .then((res) => {
          const list = buildStudentNotifications(res.data?.notifications);
          const serverReadUntil = Date.parse(res.data?.read_until) || 0;
          setServerMark(serverReadUntil);
          setReadMark((prev) => Math.max(prev || 0, serverReadUntil));
          setServerUnread((prev) => ({ ...prev, student: res.data?.unread_count ?? 0 }));
          setStudentNotifications(list);
        })
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
        if (userObj.name) setDisplayName(userObj.name.split(' ')[0]); 
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

        <nav className="hidden lg:flex flex-1 items-center justify-center px-4 min-w-0" aria-label="Primary">
          <div className="flex items-center gap-1 bg-gray-50/80 border border-gray-100/90 rounded-2xl p-1.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.6)]">
          {inlineItems.map((item) => {
            const active = currentView === item.key;
            return (
              <button
                key={item.key}
                type="button"
                onClick={() => handleNavClick(item.key)}
                className={`flex items-center justify-center h-10 w-[100px] rounded-xl text-sm font-semibold whitespace-nowrap transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  active
                    ? 'bg-white text-[#bd24df] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]'
                    : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-[#bd24df]'
                }`}
              >
                {item.label}
              </button>
            );
          })}
          {maxInline > 0 && overflowItems.length > 0 && (
            <div data-navmenu className="relative">
              <button
                type="button"
                onClick={() => setIsMoreOpen((prev) => !prev)}
                className={`flex items-center gap-1.5 h-10 px-3.5 rounded-xl text-sm font-semibold transition-all duration-200 cursor-pointer flex-shrink-0 ${
                  moreActive || isMoreOpen
                    ? 'bg-white text-[#bd24df] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]'
                    : 'bg-transparent text-gray-600 hover:bg-white/70 hover:text-[#bd24df]'
                }`}
              >
                More
                <ChevronDown size={16} strokeWidth={2.5} className={`transition-transform ${isMoreOpen ? 'rotate-180' : ''}`} />
              </button>
              {isMoreOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 mt-2.5 w-[220px] bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50">
                  {(() => { const items = overflowItems; return (<>{items.map((item) => {
                const active = currentView === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-left transition-colors cursor-pointer ${
                      active ? 'bg-[#FDF2FA] text-[#890080]' : 'text-gray-700 hover:bg-gray-50 hover:text-[#890080]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}</>); })()}
                </div>
              )}
            </div>
          )}
          </div>
        </nav>

        <div className="flex items-center gap-2 sm:gap-3">
        <div data-navmenu className="relative lg:hidden">
          <button
            type="button"
            onClick={() => setIsMoreOpen((prev) => !prev)}
            title="Menu"
            className={`flex items-center justify-center w-10 h-10 rounded-full transition-all duration-200 cursor-pointer flex-shrink-0 ${
              isMoreOpen ? 'bg-white text-[#890080] shadow-[0_1px_3px_rgba(16,24,40,0.08)] ring-1 ring-[#f5dbfc]' : 'text-gray-600 hover:bg-gray-50 hover:text-[#890080]'
            }`}
          >
            <Menu size={20} strokeWidth={2.2} />
          </button>
          {isMoreOpen && (
            <div className="absolute right-0 mt-2.5 w-[220px] bg-white rounded-2xl border border-gray-200 shadow-xl p-2 z-50">
              {(() => { const items = navItems; return (<>{items.map((item) => {
                const active = currentView === item.key;
                return (
                  <button
                    key={item.key}
                    type="button"
                    onClick={() => handleNavClick(item.key)}
                    className={`w-full flex items-center px-3.5 py-2.5 rounded-xl text-[14px] font-medium text-left transition-colors cursor-pointer ${
                      active ? 'bg-[#FDF2FA] text-[#890080]' : 'text-gray-700 hover:bg-gray-50 hover:text-[#890080]'
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}</>); })()}
            </div>
          )}
        </div>


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
                {unreadCount > 99 ? '99+' : unreadCount}
              </span>
            )}
          </button>

          {isNotifOpen && (
            <div className="absolute right-0 mt-2.5 w-[calc(100vw-24px)] sm:w-[360px] max-w-[360px] bg-white rounded-2xl border border-gray-200 shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-150 origin-top-right">

              <div className="flex items-center justify-between px-4 py-3 border-b border-gray-100">
                <h3 className="text-[14px] font-semibold text-gray-900">Notifications</h3>
                <button
                  type="button"
                  disabled={unreadCount === 0}
                  onClick={() => markReadUpTo(notificationsSource.reduce((m, n) => Math.max(m, n.ts || 0), 0))}
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
                    <p className="text-[12.5px] text-gray-400">{notifTab === 'unread' ? "You're all caught up" : 'No notifications yet'}</p>
                  </div>
                ) : (
                  visibleNotifications.map((n) => {
                    const NotifIcon = n.icon;
                    return (
                      <div
                        key={n.id}
                        onClick={() => {
                          markReadUpTo(n.ts || 0);
                          if (n.link && onNavigate) { setIsNotifOpen(false); onNavigate(n.link); }
                        }}
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
                            <p className="text-[13px] font-medium text-gray-900 line-clamp-2">{n.title}</p>
                            {n.unread && <span className="w-1.5 h-1.5 rounded-full bg-[#890080] flex-shrink-0" />}
                          </div>
                          {n.text && <p className="text-[12px] text-gray-500 leading-snug mt-0.5 line-clamp-2">{n.text}</p>}
                          <span className="text-[11px] text-gray-400 mt-0.5 block">{n.time}</span>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {effectiveRole === 'admin' && (
                <button
                  type="button"
                  onClick={() => { setIsNotifOpen(false); if (onNavigate) onNavigate('recent-activity'); }}
                  className="w-full py-2.5 border-t border-gray-100 text-[12.5px] font-medium text-[#890080] hover:bg-gray-50 transition-colors cursor-pointer"
                >
                  View all student activity
                </button>
              )}
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
              size={18}
              strokeWidth={2.2}
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
              size={18}
              strokeWidth={2.2}
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
              size={18}
              strokeWidth={2.2}
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