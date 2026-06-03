import React, { useState } from 'react';
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

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [authMode, setAuthMode] = useState('login');
  const [selectedCareerData, setSelectedCareerData] = useState(null); 
  
  // NAYI STATE: Yahan hum selected career ki ID save karenge jo Result page se aayegi
  const [selectedCareerId, setSelectedCareerId] = useState(null); 
  
  // Global state to store user MCQ selections dynamically
  const [quizAnswers, setQuizAnswers] = useState({
    q1: null, q2: null, q3: null, q4: null, q5: null,
    q6: null, q7: null, q8: null, q9: null, q10: null
  });

  return (
    <div className="min-h-screen bg-[#fafafa] text-[#111111]">
      
      {/* LANDING PAGE SCREEN */}
      {currentScreen === 'home' && (
        <LandingPage 
          onNavigate={() => {
            setAuthMode('login');
            setCurrentScreen('auth');
          }} 
        />
      )}
      
      {/* AUTHENTICATION SCREEN */}
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

      {/* STUDENT DASHBOARD SCREEN */}
      {currentScreen === 'student-dash' && (
        <StudentDashboard 
          onLogout={() => setCurrentScreen('home')} 
          onNavigate={(target) => {
            if (target === 'browse') {
              setSelectedCareerId(null); // Dashboard se jayen to id clear kar dein
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

      {/* ADMIN DASHBOARD SCREEN */}
      {currentScreen === 'admin-dash' && (
        <AdminDashboard 
          onLogout={() => setCurrentScreen('home')} 
          onNavigateToResults={() => setCurrentScreen('student-results')} 
        />
      )}

      {/* STUDENT RESULTS SCREEN */}
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

      {/* BROWSE CAREERS SCREEN */}
      {currentScreen === 'browse-careers' && (
        <BrowseCareers 
          activeCareerId={selectedCareerId} // YEH DEKHEIN: Yahan ID bhej di BrowseCareers ko!
          onNavigate={(target, data) => {
            if (target === 'dashboard') {
              setCurrentScreen('student-dash');
            } else if (target === 'quiz') {
              setCurrentScreen('quiz'); 
            } else if (target === 'details') {
              setSelectedCareerData(data); 
              setCurrentScreen('career-details'); 
            }
          }} 
        />
      )}

      {/* DYNAMIC CAREER DETAILS SCREEN */}
      {currentScreen === 'career-details' && (
        <CareerDetails 
          careerData={selectedCareerData}
          onBack={() => setCurrentScreen('browse-careers')}
          onNavigate={(target) => {
            if (target === 'dashboard') setCurrentScreen('student-dash');
          }}
        />
      )}

      {/* STUDENT PROFILE SCREEN - FIXED LOGOUT PROP ADDED */}
      {currentScreen === 'profile' && (
        <UserProfile 
          onNavigate={(target) => {
            if (target === 'dashboard') setCurrentScreen('student-dash');
          }}
          onLogout={() => setCurrentScreen('home')}
        />
      )}

      {/* QUIZ WIZARD SCREEN */}
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

      {/* AI CAREER SUGGESTION RESULTS SCREEN */}
      {currentScreen === 'career-results' && (
        <CareerResults 
          answers={quizAnswers}
          onNavigate={(target, data) => {
            if (target === 'dashboard') {
              setCurrentScreen('student-dash');
            } else if (target === 'browse-careers') {
              setCurrentScreen('browse-careers');
            } else if (target === 'details') {
              setSelectedCareerData(data);
              setCurrentScreen('career-details');
            } else if (target === 'home') {
              setCurrentScreen('home');
            } else if (target === 'roadmap-detail') {
              // YEH DEKHEIN: Result page se button daba toh id pakar li aur browse-careers khol diya
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