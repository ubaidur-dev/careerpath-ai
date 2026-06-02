import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  ChevronRight, 
  Check, 
  Sparkles,
  AlertCircle
} from 'lucide-react';

export default function CareerAssessment({ onNavigate }) {
  const [currentStep, setCurrentStep] = useState(1);
  
  const [error, setError] = useState('');

  const [answers, setAnswers] = useState({
    q1: null,
    q2: null,
    q3: null,
    q4: null,
    q5: null,
    q6: null,
    q7: null,
    q8: null,
    q9: null,
    q10: null
  });

  const getQuestionsAnsweredText = () => {
    const totalSelected = Object.values(answers).filter(val => val !== null).length;
    return `${totalSelected} of 10 questions answered`;
  };

  const getProgressPercentage = () => {
    if (currentStep === 1) return "25%";
    if (currentStep === 2) return "50%";
    if (currentStep === 3) return "75%";
    return "100%";
  };

  const handleOptionSelect = (qKey, optionValue) => {
    setError(''); // Clear error when an option is selected
    setAnswers(prev => ({ ...prev, [qKey]: optionValue }));
  };

  const validateCurrentStep = () => {
    if (currentStep === 1 && (!answers.q1 || !answers.q2)) {
      setError('Please answer all questions on this step before proceeding.');
      return false;
    }
    if (currentStep === 2 && (!answers.q3 || !answers.q4)) {
      setError('Please answer all questions on this step before proceeding.');
      return false;
    }
    if (currentStep === 3 && (!answers.q5 || !answers.q6 || !answers.q7)) {
      setError('Please answer all questions on this step before proceeding.');
      return false;
    }
    if (currentStep === 4 && (!answers.q8 || !answers.q9 || !answers.q10)) {
      setError('Please complete all remaining questions to get your career suggestions.');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (currentStep < 4) {
      setCurrentStep(prev => prev + 1);
      setError(''); 
    } else {
      if (onNavigate) {
        onNavigate('career-results', answers); 
      }
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
      setError(''); 
    }
  };

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-sans antialiased">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#bd24df] flex items-center justify-center text-white font-bold text-xl">¢</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#bd24df]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-[#bd24df] font-semibold text-sm border-l border-r border-gray-200 px-4 bg-purple-50/50 py-2 rounded-lg cursor-pointer" onClick={() => onNavigate('profile')}>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                <User size={18} className="text-[#bd24df]" />
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        
        <div className="flex justify-between items-center text-sm font-bold text-gray-600 px-1">
          <span>{getQuestionsAnsweredText()}</span>
          <span className="text-[#bd24df]">{getProgressPercentage()} Complete</span>
        </div>

        <div className="w-full h-2.5 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="h-full bg-[#bd24df] rounded-full transition-all duration-500 ease-out" 
            style={{ width: getProgressPercentage() }}
          ></div>
        </div>

        <div className="text-center space-y-2 pt-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white border border-purple-200 rounded-full shadow-sm text-xs font-bold text-[#bd24df]">
            <Sparkles size={12} />
            AI Career Assessment Form
          </div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Your Top Career Matches</h1>
          <p className="text-gray-500 text-sm max-w-xl mx-auto font-medium">
            Complete this form and our AI will analyze your profile to suggest the best career matches
          </p>
        </div>

        <div className="flex items-center justify-center max-w-xs mx-auto py-4 relative">
          {[1, 2, 3, 4].map((step, idx) => (
            <React.Fragment key={step}>
              <button 
                type="button"
                onClick={() => {
                  if (step < currentStep) {
                    setCurrentStep(step);
                    setError('');
                  } else if (step === currentStep) {
                  } else {
                    validateCurrentStep();
                  }
                }}
                className="relative z-10 focus:outline-none transition transform active:scale-95 cursor-pointer"
              >
                <div className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm border-2 shadow-sm transition-all duration-300 ${
                  currentStep === step 
                    ? 'bg-[#fde8ff] border-[#bd24df] text-[#bd24df]' 
                    : currentStep > step 
                    ? 'bg-[#dcffd6] border-[#4ade80] text-[#16a34a]' 
                    : 'bg-gray-100 border-gray-200 text-gray-400'
                }`}>
                  {currentStep > step ? <Check size={16} strokeWidth={3} /> : step}
                </div>
              </button>
              
              {idx < 3 && (
                <div className="flex-1 h-1 bg-gray-200 mx-1 rounded relative overflow-hidden">
                  <div className={`absolute top-0 left-0 h-full bg-emerald-500 transition-all duration-500 ${
                    currentStep > step ? 'w-full' : 'w-0'
                  }`}></div>
                </div>
              )}
            </React.Fragment>
          ))}
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm font-semibold shadow-sm animate-fade-in text-left">
            <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className={`bg-white border shadow-md rounded-3xl p-6 sm:p-8 space-y-6 text-left transition-all duration-300 ${error ? 'border-red-300 ring-4 ring-red-50' : 'border-gray-100'}`}>
          
          {currentStep === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Technical Interests</h2>
                <p className="text-xs font-bold text-gray-400 mt-0.5">Step 1 of 4</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">1. Do you enjoy programming or working with code?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Yes, I love it!', 'Somewhat interested', 'Not really!', 'No preference'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q1', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q1 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q1 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">2. How comfortable are you with learning new technologies?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Very comfortable', 'Somewhat comfortable', 'Prefer familiar tools', 'Need guidance'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q2', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q2 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q2 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Work Preferences</h2>
                <p className="text-xs font-bold text-gray-400 mt-0.5">Step 2 of 4</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">1. Do you prefer working with people or independently?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['With People', 'Independently', 'Hybrid approach', 'Flexible'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q3', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q3 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q3 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">2. What type of work environment do you prefer?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Fast-paced startup', 'Structured corporate', 'Creative agency', 'Flexible remote'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q4', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q4 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q4 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Skills & Abilities</h2>
                <p className="text-xs font-bold text-gray-400 mt-0.5">Step 3 of 4</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">1. Are you more interested in creative work or analytical tasks?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Creative work', 'Analytical tasks', 'Both equally', 'Task-dependent'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q5', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q5 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q5 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">2. How comfortable are you with math and statistics?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Very comfortable', 'Somewhat comfortable', 'Not comfortable', 'Willing to learn'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q6', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q6 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q6 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">3. Do you enjoy solving complex problems and puzzles?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Absolutely love it!', 'Yes, most of the time', 'Sometimes', 'Not, particularly'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q7', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q7 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q7 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Communication & Goals</h2>
                <p className="text-xs font-bold text-gray-400 mt-0.5">Step 4 of 4</p>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">1. How would you rate your communication skills?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Excellent', 'Good', 'Average', 'Need improvement'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q8', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q8 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q8 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">2. What is your preferred learning style?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['Hands-on practice', 'Reading & research', 'Video tutorials', 'Mentorship'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q9', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q9 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q9 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm font-bold text-gray-700">3. What is your primary career goal?</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {['High salary', 'Work-life balance', 'Making an impact', 'Continuous learning'].map((opt) => (
                    <button
                      key={opt}
                      onClick={() => handleOptionSelect('q10', opt)}
                      className={`w-full flex items-center justify-between text-left text-sm font-semibold px-4 py-3 rounded-xl border transition cursor-pointer ${
                        answers.q10 === opt 
                          ? 'bg-[#fdf2ff] border-[#bd24df] text-[#bd24df]' 
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span>{opt}</span>
                      {answers.q10 === opt && <div className="w-4 h-4 rounded-full border-4 border-[#bd24df] bg-white flex-shrink-0" />}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <button
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="px-5 py-2.5 bg-white border border-gray-200 text-gray-600 font-bold text-xs rounded-xl shadow-sm hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>

            {currentStep < 4 ? (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-white border border-[#f5dbfc] text-[#bd24df] font-bold text-xs rounded-xl shadow-sm hover:bg-[#fdf2ff] transition cursor-pointer"
              >
                Next
                <ChevronRight size={14} />
              </button>
            ) : (
              <button
                onClick={handleNext}
                className="inline-flex items-center gap-1.5 px-5 py-2.5 bg-[#bd24df] text-white font-bold text-xs rounded-xl shadow-md hover:bg-[#a61fc5] transition cursor-pointer"
              >
                Get Career Suggestions
                <ChevronRight size={14} />
              </button>
            )}
          </div>

        </div>
      </main>
    </div>
  );
}