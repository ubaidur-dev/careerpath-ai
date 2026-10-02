import { createElement, useEffect, useRef, useState, useCallback } from 'react';
import axios from 'axios';
import Header from './Header';
import {
  ArrowRight,
  CheckCircle2,
  Sparkles,
  Award,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { getCareerIcon } from '../utils/careerVisuals';

const RANK_TAGS = ['Top Match', '2nd Match', '3rd Match'];

const hasSubmittedAnswers = (answers) =>
  !!answers &&
  Object.entries(answers).some(([key, value]) => /^\d+$/.test(key) && Array.isArray(value) && value.length > 0);

export function CareerMatchCard({ match, isTop, onNavigate }) {
  const { career } = match;
  const skills = (career.skills || []).map((s) => (typeof s === 'string' ? s : s?.name)).filter(Boolean).slice(0, 3);

  return (
    <div className="bg-white border border-[#FFD2F7] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] rounded-[32px] p-6 md:p-10 flex flex-col w-full relative">

      <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6">

        <div className="flex-1 flex flex-col gap-5">

          <div className="flex flex-row items-center gap-5">
          <div className="w-[65px] h-[60px] rounded-[18px] border-[1.4px] border-[#FF00ED] bg-[#FFE7F2] flex items-center justify-center flex-shrink-0">
            {createElement(getCareerIcon(career.icon), { className: 'text-[#6366f1]', size: 31 })}
          </div>
            <div className="flex flex-col justify-center">
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[26px] md:text-[26px] mt-1 font-bold text-gray-900 leading-none">{career.title}</h3>
                <div className="flex items-center gap-2.5 -top-2 relative ml-1.5">
                  <span className="inline-flex items-center justify-between px-2.5 w-[100px] h-[19px] whitespace-nowrap bg-[#FBFFBC] text-[#CF7900] border-[1px] border-[#CF7900] rounded-[25px] text-[12px] font-medium tracking-wide">
                    <Award size={11} strokeWidth={2.5} className="text-[#CF7900]" />
                    {RANK_TAGS[match.rank - 1] || `#${match.rank} Match`}
                  </span>
                  <span className="inline-flex items-center justify-between px-2.5 w-[110px] h-[19px] whitespace-nowrap bg-[#E2FFE2] text-[#00B14A] border-[1px] border-[#00D057] rounded-[25px] text-[12px] font-medium tracking-wide">
                    <TrendingUp size={11} strokeWidth={2.5} className="text-[#00B14A]" />
                    {match.match}% Match
                  </span>
                </div>
              </div>
              <p className="text-[17px] font-regular text-[#707070] mt-3">{career.description}</p>
            </div>
          </div>

          {skills.length > 0 && (
            <div className="space-y-2.5">
              <div className="text-[14px] font-medium text-gray-500">Key Skills:</div>
              <div className="flex flex-wrap gap-2.5">
                {skills.map((skill) => (
                <span key={skill} className="flex items-center justify-start gap-1.5 h-[19px] whitespace-nowrap flex-shrink-0 bg-[#F7F7F7] border border-gray-100 px-3.5 py-1.5 rounded-full text-[13px] font-regular text-[#000000]">                      <CheckCircle2 size={13} strokeWidth={2.5} className="text-[#83047A]" />
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-[360px] h-[60px] bg-[#F7F7F7] rounded-[16px] px-5 py-2 flex flex-col justify-center">
              <div className="text-[12px] font-regular text-[#5E5E5E] mb-0.5">Salary Range</div>
              <div className="text-[13px] font-medium text-[#000000]">{career.salary}</div>
            </div>
            <div className="w-full sm:w-[360px] h-[60px] bg-[#F7F7F7] rounded-[13px] px-5 py-2 flex flex-col justify-center">
              <div className="text-[12px] font-regular text-[#5E5E5E] mb-0.5">Job Growth</div>
              <div className="text-[13px] font-medium text-[#000000]">{career.growth}</div>
            </div>
          </div>

        </div>

        <div className="flex flex-col items-center flex-shrink-0 md:pr-8 pt-0">
          <div className="w-[175px] h-[175px] flex flex-col items-center justify-center rounded-full bg-[#F0FFF6] ring-[4.5px] ring-inset ring-[#81FFB5] shadow-sm">
            <span className="text-[44px] font-bold text-[#16a34a] leading-none mb-1.5 mt-2">
              {match.match}%
            </span>
            <span className="text-[22.5px] font-medium text-[#16a34a] leading-none mt-1">
              Match
            </span>
          </div>
          <span className="text-[18px] font-normal text-[#1f2937] text-center mt-4">
            {match.matchLevel}
          </span>
        </div>

      </div>

      <hr className="border-gray-200 my-8" />

      <div className="flex flex-col gap-5">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 flex items-center justify-center text-[#FF00ED]">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 8V4H8" />
              <rect width="16" height="12" x="4" y="8" rx="2" />
              <path d="M2 14h2" />
              <path d="M20 14h2" />
              <path d="M15 13v2" />
              <path d="M9 13v2" />
              <path d="M8 22l4-4 4 4" />
            </svg>
          </div>
          <h4 className="text-[21px] font-semibold text-gray-900 tracking-tight">Why AI Recommends This Career</h4>
        </div>

        <div className="bg-[#FCF5FF] border-[1px] border-[#EEC9FF] shadow-[0px_2px_3px_0.5px_rgba(0,0,0,0.25)] rounded-[25px] p-6 md:p-8">
          <p className="text-[14.5px] font-regular text-[#000000] mb-6">
            Based on our comprehensive AI analysis of your assessment responses:
          </p>
          <ul className="space-y-4">
            {(match.reasons || []).map((point, index) => (
              <li key={index} className="flex items-start gap-3">
                <span className="text-[14.5px] text-[#F30092] font-medium mt-0.5">{index + 1}.</span>
                <span className="text-[14.5px] text-[#000000] leading-relaxed font-regular">
                  {point}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex justify-end pt-13">
        <button
          onClick={() => onNavigate('career-details', { careerData: career })}
          className="flex items-center justify-between px-5 w-[248px] h-[47px] rounded-[15px] text-[18px] font-regular bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
        >
          <span>{isTop ? 'Get Career Roadmap' : 'View Career Roadmap'}</span>
          <ArrowRight size={19} strokeWidth={2.5} />
        </button>
      </div>

    </div>
  );
}

export default function CareerResults({ onNavigate, onLogout, answers = {} }) {
  const [matches, setMatches] = useState([]);
  const [status, setStatus] = useState('loading');
  const [errorMessage, setErrorMessage] = useState('');
  const hasRequested = useRef(false);

  const loadResults = useCallback(async () => {
    const token = sessionStorage.getItem('token');
    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    setStatus('loading');
    setErrorMessage('');

    try {
      const res = hasSubmittedAnswers(answers)
        ? await axios.post('/quiz/submit', { answers }, { headers })
        : await axios.get('/quiz/latest-result', { headers });

      const next = Array.isArray(res.data?.recommendations) ? res.data.recommendations : [];
      setMatches(next);
      setStatus(next.length > 0 ? 'ready' : 'empty');
    } catch (err) {
      if (err?.response?.status === 404) {
        setStatus('empty');
      } else {
        console.error('Failed to load career matches', err);
        setErrorMessage(err?.response?.data?.message || 'We could not analyze your responses right now. Please try again.');
        setStatus('error');
      }
    }
  }, [answers]);

  useEffect(() => {
    if (hasRequested.current) return;
    hasRequested.current = true;
    loadResults();
  }, [loadResults]);

  const topMatch = matches[0];
  const careerCount = matches.length;

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 antialiased pb-12">

      <Header onNavigate={onNavigate} onLogout={onLogout} userRole="student" currentView="quiz" />

      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#FF00ED] text-gray-800 font-light px-5 py-1.5 rounded-full bg-white shadow-sm">
            <Sparkles size={16} className="flex-shrink-0 text-[#83047A]" />
            <span className="text-base leading-3 flex items-center">
              AI Career Assessment Form
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Top Career Matches
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light text-xl">
            Our AI has analyzed your skills, interests, and personality to find careers that perfectly match your unique profile.
          </p>
        </div>

        {status === 'loading' && (
          <div className="bg-white border border-[#FFD2F7] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] rounded-[32px] p-6 md:p-10 flex flex-col items-center justify-center py-24 gap-4">
            <div className="w-10 h-10 border-[3px] border-[#83047A] border-t-transparent rounded-full animate-spin"></div>
            <p className="text-gray-500 text-[17.5px] font-[400]">Analyzing your responses...</p>
          </div>
        )}

        {(status === 'error' || status === 'empty') && (
          <div className="bg-white border border-[#FFD2F7] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] rounded-[32px] p-6 md:p-10 flex flex-col items-center justify-center py-24 gap-4 text-center">
            <AlertCircle size={42} className={status === 'error' ? 'text-red-400' : 'text-[#83047A]'} />
            <p className="text-gray-700 text-[18px] font-[500]">
              {status === 'error' ? errorMessage : 'You have no career matches yet. Complete the assessment to discover your best-fit careers.'}
            </p>
            <button
              type="button"
              onClick={status === 'error' ? loadResults : () => onNavigate('quiz')}
              className="flex items-center justify-center gap-2 h-[46px] px-6 rounded-[16px] text-[17px] font-[400] bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              {status === 'error' ? 'Try Again' : 'Take Assessment'}
            </button>
          </div>
        )}

        {status === 'ready' && topMatch && (
          <>
            <div className="w-full min-h-[104px] bg-[#840094] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-white relative overflow-hidden gap-6 shadow-[5px_5px_5px_rgba(0,0,0,0.35)] ring-[3px] ring-inset ring-[#FFD0F3]">
              <div className="flex flex-col justify-center text-center sm:text-left w-full sm:w-auto">
                <h2 className="text-[26px] font-bold text-white leading-tight">
                  Assessment Complete! 🎉
                </h2>
                <p className="text-[19px] font-medium text-white leading-tight mt-1">
                  We've analyzed your responses and found your {careerCount === 1 ? 'best career match' : `${careerCount} best career matches`}
                </p>
              </div>
              <div className="flex items-center gap-12 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-purple-400/30">
                <div className="flex flex-col items-center">
                  <div className="text-[32px] font-bold text-[#59FF9C] leading-none">
                    {topMatch.match}%
                  </div>
                  <div className="text-[19px] font-semibold text-[#00E55C] mt-1.5">
                    Best Match
                  </div>
                </div>
                <div className="flex flex-col items-center">
                  <div className="text-[32px] font-bold text-[#FFF959] leading-none">
                    {careerCount}
                  </div>
                  <div className="text-[19px] font-semibold text-[#F0E802] mt-1.5">
                    {careerCount === 1 ? 'Career' : 'Careers'}
                  </div>
                </div>
              </div>
            </div>

            <CareerMatchCard match={topMatch} isTop onNavigate={onNavigate} />

            {matches.length > 1 && (
              <div className="flex flex-col gap-10">
                <div className="text-center space-y-2">
                  <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">
                    Other Careers That Match You
                  </h2>
                  <p className="text-gray-500 font-light text-[18px]">
                    Strong alternatives based on the same assessment responses
                  </p>
                </div>
                {matches.slice(1).map((m) => (
                  <CareerMatchCard key={m.career.id} match={m} isTop={false} onNavigate={onNavigate} />
                ))}
              </div>
            )}
          </>
        )}

      </main>
    </div>
  );
}
