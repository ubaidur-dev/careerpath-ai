import React, { useState, useEffect } from 'react';
import axios from 'axios';

import LandingPage from './components/LandingPage';
import AuthPage from './components/AuthPage';
import StudentDashboard from "./components/StudentDashboard";
import AdminDashboard from "./components/AdminDashboard";
import StudentResults from "./components/StudentResults"; 
import BrowseCareers from "./components/BrowseCareers";
import CareerDetails from "./components/CareerDetails";
import UserProfile from "./components/UserProfile";
import CareerAssessment from "./components/CareerAssessment"; 
import CareerResults from './components/CareerResults'; 

axios.defaults.baseURL = 'http://127.0.0.1:8000/api';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [selectedCareerData, setSelectedCareerData] = useState(null); 
  const [selectedCareerId, setSelectedCareerId] = useState(null); 
  
  const [backendStatus, setBackendStatus] = useState('checking');

  const [quizAnswers, setQuizAnswers] = useState({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null
  });

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [currentScreen, authMode]);

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
            🟢 Laravel Backend Connected
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
          onSuccess={(selectedRole) => {
            if (selectedRole === 'admin') {
              setCurrentScreen('admin-dash');
            } else {
              setCurrentScreen('student-dash');
            }
          }}
        />
      )}

      {currentScreen === 'student-dash' && (
        <StudentDashboard 
          onLogout={() => setCurrentScreen('home')} 
          onNavigate={(target) => {
            if (target === 'browse') {
              setSelectedCareerId(null); 
              setCurrentScreen('browse-careers');
            } else if (target === 'profile') {
              setCurrentScreen('profile');
            } else if (target === 'quiz') {
              setCurrentScreen('quiz'); 
            } else {
              setCurrentScreen('student-dash');
            }
          }}
        />
      )}

      {currentScreen === 'admin-dash' && (
        <AdminDashboard 
          onLogout={() => setCurrentScreen('home')} 
          onNavigateToResults={() => setCurrentScreen('student-results')} 
        />
      )}

      {currentScreen === 'student-results' && (
        <div className="p-6 max-w-7xl mx-auto">
          <button 
            onClick={() => setCurrentScreen('admin-dash')} 
            className="mb-6 text-sm font-bold text-[#bd24df] hover:text-[#a11ebe] flex items-center gap-1 cursor-pointer transition-all font-sans"
          >
            Back to Admin Dashboard
          </button>
          <StudentResults />
        </div>
      )}

      {currentScreen === 'browse-careers' && (
        <BrowseCareers 
          activeCareerId={selectedCareerId} 
          onLogout={() => setCurrentScreen('home')}
          onNavigate={(target, data) => {
            if (target === 'dashboard') {
              setCurrentScreen('student-dash');
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
            if (target === 'dashboard') setCurrentScreen('student-dash');
          }}
        />
      )}

      {currentScreen === 'profile' && (
        <UserProfile 
          onNavigate={(target) => {
            if (target === 'dashboard') setCurrentScreen('student-dash');
          }}
          onLogout={() => setCurrentScreen('home')}
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
