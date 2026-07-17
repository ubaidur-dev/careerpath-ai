import React, { useState } from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  ChevronRight, 
  Check, 
  Sparkles,
  AlertCircle,
  Zap
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
    setError(''); 
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
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 antialiased">
      
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[32px]">
        
        <div className="flex justify-between items-center px-1 text-[14px] mb-[12px]">
          <span className="text-[#303030] text-[20px] font-[400]">
            {getQuestionsAnsweredText()}
          </span>
          
          <span className="text-[#CC0088] text-[20px] font-[600]">
            {getProgressPercentage()} Complete
          </span>
        </div>

        <div className="w-full bg-gray-200 rounded-full overflow-hidden shadow-inner h-[12px] mt-[8px]">
          <div 
            className="h-full bg-[#83047A] rounded-full transition-all duration-500 ease-out" 
            style={{ width: getProgressPercentage() }}
          ></div>
        </div>

        <div className="max-w-6xl mx-auto w-full space-y-6 pt-13">

          <div className="text-center space-y-3"> 
            <div className="inline-flex items-center gap-2 px-5 py-1.5 bg-white border border-[#FF00ED] rounded-full shadow-sm text-gray-800 font-light">
              <Sparkles 
                size={16} 
                className="text-[#83047A] flex-shrink-0 animate-pulse" 
              />
              <span className="leading-3 flex items-center text-[16px]">
                AI Career Assessment Form
              </span>
            </div>

            <h1 className="text-gray-900 tracking-tight text-[35.5px] font-[600]">
              Your Top Career Matches
            </h1>

            <p className="text-gray-500 mx-auto whitespace-nowrap sm:whitespace-normal text-[20.5px] font-[400] -mt-[5px]">
              Complete this form and our AI will analyze your profile to suggest the best career matches
            </p>
          </div>

          <div className="flex items-center justify-center max-w-sm mx-auto py-6 relative">
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
                  <div className={`w-[61px] h-[61px] font-[600] rounded-full flex items-center justify-center text-base transition-all duration-300 border-[0.3px] ${
                      currentStep === step 
                        ? 'bg-[#fde8ff] border-[#bd24df] text-[#bd24df] shadow-sm' 
                        : currentStep > step 
                        ? 'bg-[#dcffd6] border-[#4ade80] text-[#16a34a]' 
                        : 'bg-gray-100 border-gray-200 text-gray-400'
                    }`}
                  >
                    {currentStep > step ? <Check size={24} strokeWidth={3} /> : <span className="text-[24px]">{step}</span>}
                  </div>
                </button>
                
                {idx < 3 && (
                  <div className="w-[47px] h-[4px] flex-shrink-0 bg-gray-200 mx-1 rounded relative overflow-hidden">
                    <div 
                      className={`absolute top-0 left-0 h-full bg-[#16a34a] transition-all duration-500 ${
                        currentStep > step ? 'w-full' : 'w-0'
                      }`}
                    ></div>
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm font-semibold shadow-sm animate-fade-in text-left">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <span className="">{error}</span>
            </div>
          )}

            <div className={`bg-white border rounded-3xl p-6 sm:p-10 space-y-8 text-left transition-all duration-300 mx-auto w-full max-w-[1050px] min-h-[520px] shadow-[0_10px_30px_-5px_rgba(189,36,223,0.08),0_4px_6px_-2px_rgba(189,36,223,0.03)] ${
                error ? 'border-red-300 ring-4 ring-red-50' : 'border-[#fae8ff]'
              }`}
            >
            
            <div className="mb-6">
              <h2 className="text-black tracking-tight text-[27px] font-[600] mb-[4px]">
                {currentStep === 1 && "Technical Interests"}
                {currentStep === 2 && "Work Preferences"}
                {currentStep === 3 && "Skills & Abilities"}
                {currentStep === 4 && "Communication & Goals"}
              </h2>
              <p className="text-gray-500 text-[18px] font-[400]">
                Step {currentStep} of 4
              </p>
            </div>

            {currentStep === 1 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    1. Do you enjoy programming or working with code?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Yes, I love it!', 'Somewhat interested', 'Not really!', 'No preference'].map((opt, idx) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q1', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[18px] ${
                          answers.q1 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q1 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    2. How comfortable are you with learning new technologies?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Very comfortable', 'Somewhat comfortable', 'Prefer familiar tools', 'Need guidance'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q2', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[18px] ${
                          answers.q2 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q2 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 2 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    1. Do you prefer working with people or independently?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['With People', 'Independently', 'Hybrid approach', 'Flexible'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q3', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[18px] ${
                          answers.q3 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q3 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    2. What type of work environment do you prefer?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Fast-paced startup', 'Structured corporate', 'Creative agency', 'Flexible remote'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q4', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[18px] ${
                          answers.q4 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q4 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 3 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    1. Are you more interested in creative work or analytical tasks?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Creative work', 'Analytical tasks', 'Both equally', 'Task-dependent'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q5', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q5 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q5 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    2. How comfortable are you with math and statistics?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Very comfortable', 'Somewhat comfortable', 'Not comfortable', 'Willing to learn'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q6', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q6 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q6 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    3. Do you enjoy solving complex problems and puzzles?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Absolutely love it!', 'Yes, most of the time', 'Sometimes', 'Not, particularly'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q7', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q7 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q7 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {currentStep === 4 && (
              <div className="space-y-8">
                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    1. How would you rate your communication skills?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Excellent', 'Good', 'Average', 'Need improvement'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q8', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q8 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q8 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    2. What is your preferred learning style?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['Hands-on practice', 'Reading & research', 'Video tutorials', 'Mentorship'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q9', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q9 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q9 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-gray-800 text-[17.5px] font-[500] mb-[12px] text-left">
                    3. What is your primary career goal?
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-20 gap-y-4 w-full">
                    {['High salary', 'Work-life balance', 'Making an impact', 'Continuous learning'].map((opt) => (
                      <button
                        key={opt}
                        onClick={() => handleOptionSelect('q10', opt)}
                        className={`w-full flex items-center justify-between text-left border transition cursor-pointer w-[450px] min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[17.5px] font-[400] rounded-[12px] ${
                          answers.q10 === opt 
                            ? 'bg-[#FFF0FB] border-[0.3px] border-[#83047A] text-[#83047A]' 
                            : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                        }`}
                      >
                        <span className="">{opt}</span>
                        {answers.q10 === opt && <Check size={18} strokeWidth={3} className="text-[#83047A] flex-shrink-0" />}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

          </div> 

          <div className="pt-6 flex flex-col items-center gap-5">
            <div className="w-full flex items-center justify-between relative">
              
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="flex items-center justify-center w-[120px] h-[50px] ml-[57px] rounded-[16px] text-[19px] font-[500] bg-white border border-[#83047A] text-[#83047A] hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"              >
                Previous
              </button>

              <span className="absolute left-1/2 -translate-x-1/2 text-gray-600 font-[500] text-[17px]">
                Section {currentStep} of 4
              </span>

              {currentStep < 4 ? (
                <button
                  onClick={handleNext}
                  className="flex items-center justify-center gap-[6px] w-[100px] h-[50px] mr-[57px] rounded-[16px] text-[19px] font-[400] bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer"                >
                  <span className="leading-none">Next</span>
                  
                  <ChevronRight size={19} strokeWidth={2} className="text-[#83047A] flex-shrink-0" />
                </button>
              ) : (
                <button onClick={handleNext} className="flex items-center justify-center gap-2 w-[275px] h-[52px] mr-[60px] rounded-[16px] text-[19px] font-[400] bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer">
                  <span>Get Career Suggestions</span>
                  <svg className="w-[19px] h-[19px]" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
                  </svg>
                </button>
              )}
            </div>
            
            <div className="flex items-center justify-center gap-2 text-gray-500 font-normal pt-1">
              <Zap size={16} className="text-purple-600 flex-shrink-0 animate-pulse" />
              <span className="text-center text-[17.5px]">
                Your responses are analyzed by our AI to find the perfect career matches for you
              </span>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
