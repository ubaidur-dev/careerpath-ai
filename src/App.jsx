import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import ForgotPassword from './components/ForgotPassword';
import ResetPassword from './components/ResetPassword';
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StudentResults from "./components/StudentResults"; 
import BrowseCareers from "./components/BrowseCareers";
import CareerDetails from "./components/CareerDetails";
import UserProfile from "./components/UserProfile";
import CareerAssessment from "./components/CareerAssessment"; 
import CareerResults from './components/CareerResults'; 

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

const getResetLinkParams = () => {
  try {
    const params = new URLSearchParams(window.location.search);
    const email = params.get('reset_email');
    const token = params.get('reset_token');
    return email && token ? { email, token } : null;
  } catch {
    return null;
  }
};

const ADMIN_VIEWS = ['dashboard', 'careers', 'quiz', 'total-students', 'recent-activity'];

const getInitialScreen = () => {
  if (getResetLinkParams()) return 'reset-password';

  try {
    const token = sessionStorage.getItem('token');
    const storedUser = sessionStorage.getItem('user');
    if (!token || !storedUser) return 'home';
    const user = JSON.parse(storedUser);
    return user?.role === 'admin' ? 'admin-dash' : 'student-dash';
  } catch {
    return 'home';
  }
};

export default function App() {
  const [currentScreen, setCurrentScreen] = useState(getInitialScreen);
  const [authMode, setAuthMode] = useState('login');
  const [forgotPasswordRole, setForgotPasswordRole] = useState('student');
  const [adminInitialView, setAdminInitialView] = useState('dashboard');
  const [resetLinkParams] = useState(getResetLinkParams);
  const [selectedCareerData, setSelectedCareerData] = useState(null); 
  const [selectedCareerId, setSelectedCareerId] = useState(null); 
  
  const [backendStatus, setBackendStatus] = useState('checking');

  const [quizAnswers, setQuizAnswers] = useState({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null
  });

  const handleLogout = async () => {
    const historyId = sessionStorage.getItem('login_history_id');
    if (historyId) {
      try {
        await axios.post('/logout', { login_history_id: historyId });
      } catch (err) {
        console.error("Logout error:", err);
      }
    }
    sessionStorage.clear();
    window.location.reload();
  };

  useEffect(() => {
    const handleTabClose = () => {
      const historyId = sessionStorage.getItem('login_history_id');
      if (historyId) {
        const url = 'http://127.0.0.1:8000/api/logout';
        const data = new FormData();
        data.append('login_history_id', historyId);
        navigator.sendBeacon(url, data);
      }
    };

    window.addEventListener('beforeunload', handleTabClose);
    return () => {
      window.removeEventListener('beforeunload', handleTabClose);
    };
  }, []);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen, authMode]);

  useEffect(() => {
    if (resetLinkParams) {
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, [resetLinkParams]);

  useEffect(() => {
    axios.get('/test-connection')
      .then((res) => {
        console.log("Backend Connected:", res.data);
        setBackendStatus('connected');
      })
      .catch((err) => {
        console.warn("Backend Not Connected Yet:", err.message);
        setBackendStatus('disconnected');
      });
  }, []);

  useEffect(() => {
    const FLUSH_INTERVAL_MS = 20000;
    const HEARTBEAT_URL = 'http://127.0.0.1:8000/api/student/activity-heartbeat';

    let pendingSeconds = 0;

    const getAuth = () => {
      const token = sessionStorage.getItem('token');
      if (!token) return null;
      let storedUser;
      try {
        storedUser = JSON.parse(sessionStorage.getItem('user') || 'null');
      } catch {
        storedUser = null;
      }
      if (storedUser?.role === 'admin') return null;
      return token;
    };

    const isActiveNow = () =>
      document.visibilityState === 'visible' && document.hasFocus();

    const tickInterval = setInterval(() => {
      if (getAuth() && isActiveNow()) {
        pendingSeconds += 1;
      }
    }, 1000);

    const flush = (useKeepalive = false) => {
      if (pendingSeconds <= 0) return;
      const token = getAuth();
      if (!token) {
        pendingSeconds = 0;
        return;
      }
      const seconds = pendingSeconds;
      pendingSeconds = 0;

      if (useKeepalive && typeof fetch === 'function') {
        fetch(HEARTBEAT_URL, {
          method: 'POST',
          keepalive: true,
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({ seconds }),
        }).catch(() => {});
        return;
      }

      axios.post('/student/activity-heartbeat', { seconds }, {
        headers: { Authorization: `Bearer ${token}` }
      }).catch(() => {});
    };

    const flushInterval = setInterval(() => flush(false), FLUSH_INTERVAL_MS);

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') flush(true);
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);
    window.addEventListener('beforeunload', () => flush(true));

    return () => {
      clearInterval(tickInterval);
      clearInterval(flushInterval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      flush(true);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111] relative">
      
      <div className="fixed bottom-4 right-4 z-50 text-xs px-3 py-1.5 rounded-full shadow-lg font-medium border transition-all">
        {backendStatus === 'checking' && (
          <span className="bg-yellow-100 text-yellow-800 border-yellow-300">
            🟡 Connecting Backend...
          </span>
        )}
        {backendStatus === 'connected' && (
          <span className="bg-green-100 text-green-800 border-green-300">
            🟢 Laravel Connected
          </span>
        )}
        {backendStatus === 'disconnected' && (
          <span className="bg-red-100 text-red-800 border-red-300">
            🔴 Laravel Offline (Start php artisan serve)
          </span>
        )}
      </div>
      
      {currentScreen === 'home' && (
        <LandingPage 
          onNavigate={() => {
            setAuthMode('login');
            setCurrentScreen('auth');
          }} 
        />
      )}
      
      {currentScreen === 'auth' && (
        <AuthPage
          mode={authMode}
          setMode={setAuthMode}
          onBackHome={() => setCurrentScreen('home')}
          onForgotPassword={(role) => {
            setForgotPasswordRole(role);
            setCurrentScreen('forgot-password');
          }}
        />
      )}

      {currentScreen === 'forgot-password' && (
        <ForgotPassword
          role={forgotPasswordRole}
          onBackToLogin={() => {
            setAuthMode('login');
            setCurrentScreen('auth');
          }}
        />
      )}

      {currentScreen === 'reset-password' && resetLinkParams && (
        <ResetPassword
          email={resetLinkParams.email}
          token={resetLinkParams.token}
          onDone={() => {
            setAuthMode('login');
            setCurrentScreen('auth');
          }}
        />
      )}

      {currentScreen === 'student-dash' && (
        <StudentDashboard
          onLogout={handleLogout}
          onNavigate={(target, data) => {
            if (target === 'browse') {
              setSelectedCareerId(null);
              setCurrentScreen('browse-careers');
            } else if (target === 'profile') {
              setCurrentScreen('profile');
            } else if (target === 'quiz') {
              setCurrentScreen('quiz');
            } else if (target === 'details') {
              setSelectedCareerData(data);
              setCurrentScreen('career-details');
            } else {
              setCurrentScreen('student-dash');
            }
          }}
        />
      )}

      {currentScreen === 'admin-dash' && (
        <AdminDashboard 
          onLogout={handleLogout} 
          initialView={adminInitialView}
          onInitialViewConsumed={() => setAdminInitialView('dashboard')}
          onNavigateToResults={() => setCurrentScreen('student-results')} 
          onNavigate={(target) => {
            if (target === 'student-results') {
              setCurrentScreen('student-results');
            } else if (target === 'settings' || target === 'profile' || target === 'admin-settings') {
              setCurrentScreen('profile');
            } else {
              setCurrentScreen('admin-dash');
            }
          }}
        />
      )}

      {currentScreen === 'student-results' && (
        <StudentResults
          onLogout={handleLogout}
          onNavigate={(target) => {
            if (target === 'settings' || target === 'profile' || target === 'admin-settings') {
              setCurrentScreen('profile');
            } else if (target === 'results') {
              setCurrentScreen('student-results');
            } else {
              if (ADMIN_VIEWS.includes(target)) setAdminInitialView(target);
              setCurrentScreen('admin-dash');
            }
          }}
        />
      )}

      {currentScreen === 'browse-careers' && (
        <BrowseCareers 
          activeCareerId={selectedCareerId} 
          onLogout={handleLogout}
          onNavigate={(target, data) => {
            if (target === 'dashboard') {
              const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
              setCurrentScreen(storedUser.role === 'admin' ? 'admin-dash' : 'student-dash');
            } else if (target === 'profile') {
              setCurrentScreen('profile'); 
            } else if (target === 'quiz') {
              setCurrentScreen('quiz'); 
            } else if (target === 'details') {
              setSelectedCareerData(data); 
              setCurrentScreen('career-details'); 
            }
          }} 
        />
      )}

      {currentScreen === 'career-details' && (
        <CareerDetails 
          careerData={selectedCareerData}
          onBack={() => setCurrentScreen('browse-careers')}
          onNavigate={(target) => {
            if (target === 'dashboard') {
              const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
              setCurrentScreen(storedUser.role === 'admin' ? 'admin-dash' : 'student-dash');
            }
          }}
        />
      )}

      {(currentScreen === 'profile' || currentScreen === 'settings' || currentScreen === 'admin-settings') && (
        <UserProfile 
          onNavigate={(target) => {
            const storedUser = JSON.parse(sessionStorage.getItem('user') || '{}');
            const isAdmin = storedUser.role === 'admin';
            if (target === 'dashboard') {
              setCurrentScreen(isAdmin ? 'admin-dash' : 'student-dash');
            } else if (isAdmin && target === 'results') {
              setCurrentScreen('student-results');
            } else if (isAdmin && ADMIN_VIEWS.includes(target)) {
              setAdminInitialView(target);
              setCurrentScreen('admin-dash');
            } else if (target === 'browse') {
              setCurrentScreen('browse-careers');
            } else {
              setCurrentScreen(target);
            }
          }}
          onLogout={handleLogout}
        />
      )}

      {currentScreen === 'quiz' && (
        <CareerAssessment 
          onNavigate={(target, answersData) => {
            if (target === 'dashboard') {
              setCurrentScreen('student-dash');
            } else if (target === 'profile') {
              setCurrentScreen('profile');
            } else if (target === 'home') {
              setCurrentScreen('home'); 
            } else if (target === 'career-results') {
              setQuizAnswers(answersData);
              setCurrentScreen('career-results');
            } else {
              setCurrentScreen('student-dash');
            }
          }}
        />
      )}

      {currentScreen === 'career-results' && (
        <CareerResults 
          answers={quizAnswers}
          onNavigate={(target, data) => {
            if (target === 'dashboard') {
              setCurrentScreen('student-dash');
            } else if (target === 'browse-careers') {
              setCurrentScreen('browse-careers');
            } else if (target === 'details' || target === 'career-details') {
              setSelectedCareerData(data?.careerData || data);
              setCurrentScreen('career-details');
            } else if (target === 'home') {
              setCurrentScreen('home');
            } else if (target === 'roadmap-detail') {
              if (data && data.careerId) {
                setSelectedCareerId(data.careerId);
              }
              setCurrentScreen('browse-careers');
            }
          }}
        />
      )}

    </div>
  );
}
