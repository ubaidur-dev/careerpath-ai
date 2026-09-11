import React, { useState, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';
import {
  LayoutDashboard,
  User,
  LogOut,
  ChevronRight,
  Check,
  CheckCircle,
  Sparkles,
  AlertCircle,
  Zap
} from 'lucide-react';

export default function CareerAssessment({ onNavigate }) {
  const [steps, setSteps] = useState([]);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState('');

  const [currentStep, setCurrentStep] = useState(1);
  const [error, setError] = useState('');

  const [answers, setAnswers] = useState({});

  const loadAssessment = useCallback(async () => {
    try {
      setLoading(true);
      const res = await axios.get('/quiz/assessment');
      const nextSteps = Array.isArray(res.data?.steps) ? res.data.steps : [];
      setSteps(nextSteps);
      setTotalQuestions(Number(res.data?.totalQuestions) || 0);
      setLoadError('');
      setCurrentStep((prev) => Math.min(Math.max(prev, 1), nextSteps.length || 1));

      const token = sessionStorage.getItem('token');
      if (token && nextSteps.length > 0) {
        axios.post('/quiz/start', {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
      }
    } catch (err) {
      console.error('Failed to load assessment', err);
      setLoadError('Unable to load the assessment right now. Please try again.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadAssessment();
  }, [loadAssessment]);

  const goingToResults = useRef(false);

  const abandonQuiz = useCallback(() => {
    if (goingToResults.current) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const url = `${axios.defaults.baseURL || ''}/quiz/abandon`;
    const body = new URLSearchParams({ token });
    try {
      if (navigator.sendBeacon && navigator.sendBeacon(url, body)) return;
    } catch {  }
    fetch(url, { method: 'POST', body, keepalive: true }).catch(() => {});
  }, []);

  const leaveQuiz = useCallback((destination) => {
    abandonQuiz();
    if (onNavigate) onNavigate(destination);
  }, [abandonQuiz, onNavigate]);

  useEffect(() => {
    const token = sessionStorage.getItem('token');
    if (!token) return;

    const sendPing = () => {
      if (document.visibilityState !== 'visible') return;
      axios.post('/quiz/ping', {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
    };

    sendPing();
    const heartbeat = setInterval(sendPing, 5000);
    document.addEventListener('visibilitychange', sendPing);
    window.addEventListener('pagehide', abandonQuiz);

    return () => {
      clearInterval(heartbeat);
      document.removeEventListener('visibilitychange', sendPing);
      window.removeEventListener('pagehide', abandonQuiz);
    };
  }, [abandonQuiz]);

  const totalSteps = steps.length;
  const safeStep = Math.min(Math.max(currentStep, 1), totalSteps || 1);
  const currentStepData = steps[safeStep - 1] || null;

  const answeredCount = Object.values(answers).filter(
    (val) => Array.isArray(val) && val.length > 0
  ).length;

  const progressPercent = totalQuestions > 0
    ? Math.round((answeredCount / totalQuestions) * 100)
    : 0;

  const getQuestionsAnsweredText = () => `${answeredCount} of ${totalQuestions} questions answered`;

  const getProgressPercentage = () => `${progressPercent}%`;

  const handleOptionSelect = (questionId, optionValue) => {
    setError('');
    setAnswers((prev) => {
      const current = Array.isArray(prev[questionId]) ? prev[questionId] : [];
      const next = current.includes(optionValue)
        ? current.filter((opt) => opt !== optionValue)
        : [...current, optionValue];
      return { ...prev, [questionId]: next };
    });
  };

  const validateCurrentStep = () => {
    if (!currentStepData) return false;
    const hasUnanswered = currentStepData.questions.some(
      (q) => !Array.isArray(answers[q.id]) || answers[q.id].length === 0
    );
    if (hasUnanswered) {
      setError(
        safeStep === totalSteps
          ? 'Please complete all remaining questions to get your career suggestions.'
          : 'Please answer all questions on this step before proceeding.'
      );
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (!validateCurrentStep()) return;

    if (safeStep < totalSteps) {
      setCurrentStep(safeStep + 1);
      setError('');
    } else if (onNavigate) {
      goingToResults.current = true;
      onNavigate('career-results', answers);
    }
  };

  const handlePrevious = () => {
    if (safeStep > 1) {
      setCurrentStep(safeStep - 1);
      setError('');
    }
  };

  const showForm = !loading && !loadError && totalSteps > 0;

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 antialiased">

      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => leaveQuiz('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#bd24df] flex items-center justify-center text-white font-bold text-xl">¢</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#bd24df]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => leaveQuiz('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-[#bd24df] font-semibold text-sm border-l border-r border-gray-200 px-4 bg-purple-50/50 py-2 rounded-lg cursor-pointer" onClick={() => leaveQuiz('profile')}>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                <User size={18} className="text-[#bd24df]" />
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            <button onClick={() => leaveQuiz('home')} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-[32px]">

        <div className="flex justify-between items-center px-1 text-[14px] mb-[12px]">
          <span className="text-[#303030] text-[20px] text-regular">
            {getQuestionsAnsweredText()}
          </span>

          <span className="text-[#CC0088] text-[20px] font-semibold">
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
          <div className="inline-flex items-center justify-center gap-2  w-[239px] h-[31px] px-3 py-1.5 bg-white border border-[#FF00ED] rounded-full shadow-sm text-gray-800 font-light">
            <Sparkles
              size={13}
              className="text-[#83047A] flex-shrink-0 animate-pulse"
            />
            <span className="leading-none text-[#000000] flex items-center text-[15px] whitespace-nowrap">
              AI Career Assessment Form
            </span>
          </div>

            <h1 className="text-[semi-bold] tracking-tight text-[31px] font-[600]">
              Your Top Career Matches
            </h1>

            <p className="text-[#525252] mx-auto whitespace-nowrap sm:whitespace-normal text-[18.5px] text-[regular] -mt-[5px]">
              Complete this form and our AI will analyze your profile to suggest the best career matches
            </p>
          </div>

         {showForm && (
            <div className="flex flex-wrap items-center justify-center gap-y-3 max-w-3xl mx-auto py-6 relative">
              {steps.map((stepItem, idx) => {
                const stepNumber = idx + 1;
                return (
                  <React.Fragment key={stepItem.category + '-' + stepNumber}>
                    <button
                      type="button"
                      onClick={() => {
                        if (stepNumber < safeStep) {
                          setCurrentStep(stepNumber);
                          setError('');
                        } else if (stepNumber === safeStep) {
                        } else {
                          validateCurrentStep();
                        }
                      }}
                      className="relative z-10 focus:outline-none transition transform active:scale-95 cursor-pointer"
                    >
                      <div className={`w-[50px] h-[50px] font-[600] rounded-full flex items-center justify-center transition-all duration-300 ${
                          safeStep === stepNumber
                            ? 'bg-[#FFD7FC] border-[#83047A] border-[1px] text-[#83047A] shadow-sm'
                            : safeStep > stepNumber
                            ? 'bg-[#dcffd6] border-[#00D057] border-[1px] text-[#00D057]'
                            : 'bg-[#E8E8E8] border-[#707070] border-[1px] text-[#707070]'
                        }`}
                      >
                        {safeStep > stepNumber ? (
                          <CheckCircle size={20} className="text-[#00D057]" />
                        ) : (
                          <span className="text-[20px]">{stepNumber}</span>
                        )}
                      </div>
                    </button>

                    {idx < steps.length - 1 && (
                      <div className="w-[40px] h-[3.5px] flex-shrink-0 bg-[#C8C8C8] ml-0.5 mr-2 relative overflow-hidden">
                        <div
                          className={`absolute top-0 left-0 h-full bg-[#00D057] transition-all duration-500 ${
                            safeStep > stepNumber ? 'w-full' : 'w-0'
                          }`}
                        ></div>
                      </div>
                    )}
                  </React.Fragment>
                );
              })}
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-4 flex items-center gap-3 text-red-700 text-sm font-semibold shadow-sm animate-fade-in text-left">
              <AlertCircle size={20} className="text-red-500 flex-shrink-0" />
              <span className="">{error}</span>
            </div>
          )}

            <div className={`bg-white border-[1px] border-[#FFD2F7] rounded-3xl p-6 sm:p-10 space-y-8 text-left transition-all duration-300 mx-auto w-full max-w-[1050px] min-h-[520px] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] ${
                error ? 'border-red-300 ring-4 ring-red-50' : 'border-[#fae8ff]'
              }`}
            >

            {loading && (
              <div className="flex flex-col items-center justify-center py-24 gap-4">
                <div className="w-10 h-10 border-[3px] border-[#83047A] border-t-transparent rounded-full animate-spin"></div>
                <p className="text-gray-500 text-[17.5px] font-[400]">Loading assessment questions...</p>
              </div>
            )}

            {!loading && loadError && (
              <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
                <AlertCircle size={42} className="text-red-400" />
                <p className="text-gray-700 text-[18px] font-[500]">{loadError}</p>
                <button
                  type="button"
                  onClick={loadAssessment}
                  className="flex items-center justify-center gap-2 h-[46px] px-6 rounded-[16px] text-[17px] font-[400] bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
                >
                  Try Again
                </button>
              </div>
            )}

            {!loading && !loadError && totalSteps === 0 && (
              <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
                <Sparkles size={42} className="text-[#83047A]" />
                <p className="text-gray-800 text-[20px] font-[600]">No assessment questions available yet</p>
                <p className="text-gray-500 text-[16.5px] font-[400]">
                  Please check back once questions have been added.
                </p>
              </div>
            )}

            {showForm && currentStepData && (
            <>
              <div className="mb-6">
                <h2 className="text-black tracking-tight text-[25px] font-[600] mb-[4px]">
                  {currentStepData.category}
                </h2>
                <p className="text-[#4B4B4B] text-[16px] font-regular">
                  Step {safeStep} of {totalSteps}
                </p>
              </div>

              <div className="space-y-8">
                {currentStepData.questions.map((q, qIdx) => (
                  <div key={q.id} className="space-y-4">
                    <p className="text-[#303030] text-[16.5px] font-regular mb-[12px] text-left">
                      {qIdx + 1}. {q.questionText}
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-x-32 gap-y-4 w-full">
                      {(q.options || []).map((opt, oIdx) => {
                        const isSelected = Array.isArray(answers[q.id]) && answers[q.id].includes(opt);
                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleOptionSelect(q.id, opt)}
                            className={`flex items-center justify-between text-left border transition cursor-pointer w-full min-h-[47px] pt-[16px] pb-[16px] pl-[20px] pr-[20px] text-[16.5px] font-[400] rounded-[15px] ${
                              isSelected
                                ? 'bg-[#FFF0FB] border-[0.5px] border-[#83047A] text-[#83047A]'
                                : 'bg-[#FDFDFD] border-[0.5px] border-[#A8A8A8] text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            <span className="">{opt}</span>
                            {isSelected && <CheckCircle size={20} className="text-[#83047A] flex-shrink-0" />}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          </div>

          {showForm && (
            <div className="pt-6 flex flex-col items-center gap-5">
              <div className="w-full flex items-center justify-between relative">

                <button
                  onClick={handlePrevious}
                  disabled={safeStep === 1}
                  className="flex items-center justify-center w-[120px] h-[50px] ml-[57px] rounded-[16px] text-[19px] font-[500] bg-white border border-[#83047A] text-[#83047A] hover:bg-gray-50 hover:-translate-y-1 transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"              >
                  Previous
                </button>

                <span className="absolute left-1/2 -translate-x-1/2 text-[#303030] text-regular text-[17px]">
                  Section {safeStep} of {totalSteps}
                </span>

                {safeStep < totalSteps ? (
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
                <span className="text-center text-[#5C5C5C] text-[17.5px] text-regular">
                  Your responses are analyzed by our AI to find the perfect career matches for you
                </span>
              </div>
            </div>
          )}

        </div>
      </main>
    </div>
  );
}
