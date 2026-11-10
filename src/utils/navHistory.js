// Maps app screens to real URLs so the browser Back/Forward buttons,
// reloads and shared links all land on the right page.

const SCREEN_PATHS = {
  home: '/',
  auth: '/login',
  'forgot-password': '/forgot-password',
  'reset-password': '/reset-password',
  'student-dash': '/dashboard',
  'browse-careers': '/careers',
  'career-details': '/careers/details',
  'career-roadmap': '/progress',
  'assessment-history': '/results',
  quiz: '/assessment',
  'career-results': '/assessment/results',
  profile: '/profile',
  settings: '/profile',
  'admin-settings': '/profile',
  'admin-dash': '/admin',
  'student-results': '/admin/results',
};

const ADMIN_VIEW_PATHS = {
  dashboard: '/admin',
  careers: '/admin/careers',
  quiz: '/admin/quiz',
  'total-students': '/admin/students',
  'recent-activity': '/admin/activity',
  settings: '/admin/settings',
};

const PUBLIC_SCREENS = ['home', 'auth', 'forgot-password', 'reset-password'];
const ADMIN_ONLY = ['admin-dash', 'student-results'];
const STUDENT_ONLY = ['student-dash', 'career-roadmap', 'assessment-history', 'quiz', 'career-results'];

export const getAuth = () => {
  try {
    const token = sessionStorage.getItem('token');
    const user = JSON.parse(sessionStorage.getItem('user') || 'null');
    return { isAuthed: !!(token && user), role: user?.role || null };
  } catch {
    return { isAuthed: false, role: null };
  }
};

export const pathFor = (screen, adminView) =>
  screen === 'admin-dash'
    ? ADMIN_VIEW_PATHS[adminView] || '/admin'
    : SCREEN_PATHS[screen] || '/';

export const resolveFromPath = (pathname) => {
  const clean = (pathname || '/').replace(/\/+$/, '') || '/';
  const adminView = Object.keys(ADMIN_VIEW_PATHS).find((v) => ADMIN_VIEW_PATHS[v] === clean);
  if (adminView) return { screen: 'admin-dash', adminView };
  const screen = Object.keys(SCREEN_PATHS).find((s) => SCREEN_PATHS[s] === clean);
  return { screen: screen || 'home', adminView: 'dashboard' };
};

// Keeps logged-out users on public pages and each role on its own pages.
export const guardScreen = (screen, { isAuthed, role }, hasResetLink = false) => {
  if (!isAuthed) {
    if (screen === 'reset-password') return hasResetLink ? screen : 'home';
    return PUBLIC_SCREENS.includes(screen) ? screen : 'home';
  }
  const home = role === 'admin' ? 'admin-dash' : 'student-dash';
  if (PUBLIC_SCREENS.includes(screen)) return home;
  if (role === 'admin' ? STUDENT_ONLY.includes(screen) : ADMIN_ONLY.includes(screen)) return home;
  return screen;
};

export const writeHistory = (method, state, path) => {
  const key = state.key || (method === 'replaceState' ? currentKey() : null) || newKey();
  try {
    window.history[method]({ ...state, key }, '', path);
  } catch {
    // State too large or not cloneable: keep the URL, drop the payload.
    try {
      window.history[method]({ screen: state.screen, adminView: state.adminView, key }, '', path);
    } catch { /* ignore */ }
  }
  activeKey = currentKey();
};

export const pushAdminView = (view) => {
  const st = window.history.state || {};
  if (st.screen === 'admin-dash' && (st.adminView || 'dashboard') === view) return;
  writeHistory('pushState', { screen: 'admin-dash', adminView: view }, pathFor('admin-dash', view));
};

// ---- Entry keys, scroll position and per-entry UI state -------------------
// Each history entry gets a unique key. Scroll position and page state
// (search, filters, page number) are saved under it, so Back/Forward bring
// the user to exactly where they were, while a fresh click starts clean.

let activeKey = null;
let cancelRestore = null;

const newKey = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 7)}`;
export const currentKey = () => window.history.state?.key || null;

export const ensureEntryKey = () => {
  if (!currentKey()) {
    try {
      window.history.replaceState({ ...(window.history.state || {}), key: newKey() }, '');
    } catch { /* ignore */ }
  }
  activeKey = currentKey();
};

export const enterEntry = () => {
  activeKey = currentKey();
};

export const saveScroll = () => {
  const key = activeKey || currentKey();
  if (!key) return;
  try {
    sessionStorage.setItem(`scroll:${key}`, String(Math.round(window.scrollY)));
  } catch { /* ignore */ }
};

// Scrolls to where the user was on this entry (top for a brand-new one).
// Pages load data after mounting, so retry until the page is tall enough.
export const restoreScroll = () => {
  if (cancelRestore) cancelRestore();
  const key = currentKey();
  let y = 0;
  try {
    y = Number(sessionStorage.getItem(`scroll:${key}`)) || 0;
  } catch { /* ignore */ }

  if (!y) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  let tries = 0;
  let timer = null;
  const events = ['wheel', 'touchstart', 'keydown', 'mousedown'];
  const stop = () => {
    clearTimeout(timer);
    events.forEach((e) => window.removeEventListener(e, stop));
    cancelRestore = null;
  };
  cancelRestore = stop;
  events.forEach((e) => window.addEventListener(e, stop, { passive: true }));

  const tick = () => {
    window.scrollTo({ top: y, behavior: 'instant' });
    tries += 1;
    if (Math.abs(window.scrollY - y) < 2 || tries > 40) {
      stop();
      return;
    }
    timer = setTimeout(tick, 50);
  };
  tick();
};
