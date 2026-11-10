import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { TrendingUp, ChevronDown, ChevronUp, Check, Calendar, Clock } from 'lucide-react';
import { getCareerIcon, CAREER_DETAILS_ICON_BG, CAREER_DETAILS_ICON_COLOR } from '../utils/careerVisuals';

const getAuthToken = () => sessionStorage.getItem('token');

export default function CareerRoadmapProgress({ onNavigate, onLogout }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [stepsByCareer, setStepsByCareer] = useState({});
  const [togglingKey, setTogglingKey] = useState(null);
  const [assessments, setAssessments] = useState([]);
  const [assessmentsLoading, setAssessmentsLoading] = useState(true);
  const [openAssessmentId, setOpenAssessmentId] = useState(null);
  const [openChecklist, setOpenChecklist] = useState(null);
  const autoOpenedRef = useRef(false);

  useEffect(() => {
    const token = getAuthToken();
    if (!token) return undefined;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSummary = () => {
      axios.get('/student/roadmap-progress', { headers })
        .then(res => setRoadmaps(Array.isArray(res.data?.roadmaps) ? res.data.roadmaps : []))
        .catch(() => {})
        .finally(() => setLoading(false));
    };

    const fetchAssessments = () => {
      axios.get('/student/assessment-journey', { headers })
        .then(res => {
          const list = Array.isArray(res.data?.assessments) ? res.data.assessments : [];
          setAssessments(list);
          if (!autoOpenedRef.current && list.length > 0) {
            autoOpenedRef.current = true;
            setOpenAssessmentId(list[0].id);
          }
        })
        .catch(() => {})
        .finally(() => setAssessmentsLoading(false));
    };

    fetchSummary();
    fetchAssessments();
    const interval = setInterval(() => {
      fetchSummary();
      fetchAssessments();
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const checklistCareerId = openChecklist?.careerId ?? null;
  useEffect(() => {
    const careerIds = [...new Set([expandedId, checklistCareerId].filter(Boolean))];
    if (careerIds.length === 0) return undefined;
    const token = getAuthToken();
    if (!token) return undefined;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchSteps = () => {
      careerIds.forEach((careerId) => {
        axios.get(`/career-roadmap/${careerId}`, { headers })
          .then(res => setStepsByCareer(prev => ({ ...prev, [careerId]: res.data.steps || [] })))
          .catch(() => {});
      });
    };

    fetchSteps();
    const interval = setInterval(fetchSteps, 4000);
    return () => clearInterval(interval);
  }, [expandedId, checklistCareerId]);

  const handleExpandToggle = (careerId) => {
    setExpandedId((prev) => (prev === careerId ? null : careerId));
  };

  const handleToggleStep = (careerId, stepIndex) => {
    const token = getAuthToken();
    if (!token) return;
    if ((stepsByCareer[careerId] || []).some((s) => s.index === stepIndex && s.completed)) return;
    const key = `${careerId}-${stepIndex}`;
    setTogglingKey(key);

    axios.post(`/career-roadmap/${careerId}/toggle`, { step_index: stepIndex }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setStepsByCareer(prev => ({ ...prev, [careerId]: res.data.steps || [] }));
        setRoadmaps(prev => prev.map((r) => (
          r.careerId === careerId
            ? { ...r, completedSteps: res.data.completedSteps, percent: res.data.percent }
            : r
        )));
        setAssessments(prev => prev.map((a) => ({
          ...a,
          careers: a.careers.map((c) => (
            c.careerId === careerId
              ? { ...c, completedSteps: res.data.completedSteps, percent: res.data.percent }
              : c
          )),
        })));
      })
      .catch(() => {})
      .finally(() => setTogglingKey(null));
  };

  const renderChecklist = (careerId) => {
    const steps = stepsByCareer[careerId] || [];
    return (
      <div className="p-5 sm:p-6 space-y-3 bg-white border-t border-gray-100">
        {steps.length > 0 ? steps.map((step) => {
          const key = `${careerId}-${step.index}`;
          return (
            <div
              key={step.index}
              className={`flex items-start gap-3 p-4 rounded-xl border transition-all ${
                step.completed ? 'border-emerald-200 bg-emerald-50/40' : 'border-gray-100 bg-gray-50/30'
              }`}
            >
              <button
                type="button"
                onClick={() => handleToggleStep(careerId, step.index)}
                disabled={togglingKey === key || step.completed}
                title={step.completed ? 'Completed' : 'Mark as complete'}
                className={`w-6 h-6 mt-0.5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all cursor-pointer disabled:cursor-default ${
                  step.completed ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300 hover:border-emerald-400'
                } ${togglingKey === key ? 'opacity-50 cursor-wait' : ''}`}
              >
                {step.completed && <Check size={13} strokeWidth={3} />}
              </button>
              <div className="min-w-0">
                <div className="font-bold text-gray-900 text-[14px] break-words">{step.title}</div>
                <p className="text-gray-500 text-[13px] leading-relaxed mt-0.5 break-words">{step.desc}</p>
              </div>
            </div>
          );
        }) : (
          <div className="text-gray-400 text-sm text-center py-4">Loading steps...</div>
        )}
      </div>
    );
  };

  const assessedCareerIds = new Set(assessments.flatMap((a) => a.careers.map((c) => c.careerId)));
  const otherRoadmaps = roadmaps.filter((r) => !assessedCareerIds.has(r.careerId));

  const totalCareers = roadmaps.length;
  const fullyCompleted = roadmaps.filter((r) => r.percent === 100).length;
  const totalStepsCompleted = roadmaps.reduce((sum, r) => sum + (r.completedSteps || 0), 0);
  const overallPercent = totalCareers > 0
    ? Math.round(roadmaps.reduce((sum, r) => sum + (r.percent || 0), 0) / totalCareers)
    : 0;

  const summaryStats = [
    { id: 1, label: 'Careers Tracked', value: totalCareers, emoji: '🎯' },
    { id: 2, label: 'Fully Completed', value: fullyCompleted, emoji: '🏆' },
    { id: 3, label: 'Steps Completed', value: totalStepsCompleted, emoji: '✅' },
    { id: 4, label: 'Overall Progress', value: `${overallPercent}%`, emoji: '📈' },
  ];

  return (
    <div className="relative min-h-screen bg-[#fcf8fe] text-gray-800 antialiased">
      <style>
        {`
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          .custom-card-shadow { box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25); }
        `}
      </style>

      <Header onNavigate={onNavigate} onLogout={onLogout} userRole="student" currentView="roadmap" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8 space-y-8">

        <div className="space-y-2 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">My Learning Progress</h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Track every skill, course, and certification step across all your career roadmaps — for life.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {summaryStats.map((stat) => (
            <div
              key={stat.id}
              className="bg-white h-[145px] w-full px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
            >
              <div className="text-[45px] select-none flex-shrink-0 filter drop-shadow-sm flex items-center justify-center">
                {stat.emoji}
              </div>
              <div className="flex flex-col justify-center">
                <div
                  className="text-[36px] font-bold text-gray-900 tracking-tight leading-tight"
                  style={{ filter: 'drop-shadow(0px 4px 4px rgba(0, 0, 0, 0.25))' }}
                >
                  {stat.value}
                </div>
                <div className="text-[15px] font-normal text-[#545454] mt-[2px]">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-[25px] p-7 sm:p-9 prototype-card-border custom-card-shadow space-y-6 text-left">
          <div className="flex items-center justify-between border-b border-gray-100 pb-5">
            <div>
              <h2 className="text-[28px] font-semibold text-gray-900 tracking-tight">Career Roadmaps</h2>
              <p className="text-[15px] text-[#545454] font-normal mt-1">Every assessment you completed and the careers it suggested. Check off each step as you prepare.</p>
            </div>
            <TrendingUp size={28} className="text-[#635BFF] flex-shrink-0" />
          </div>

          {assessmentsLoading || loading ? (
            <div className="text-gray-500 text-center py-10 text-lg">Loading your progress...</div>
          ) : assessments.length === 0 && otherRoadmaps.length === 0 ? (
            <div className="text-center py-12 space-y-2">
              <div className="text-4xl mb-2">📝</div>
              <div className="text-lg font-semibold text-gray-700">No completed assessments yet</div>
              <p className="text-sm text-gray-400">Complete the Career Assessment to see your suggested careers and a preparation checklist here.</p>
              <button
                type="button"
                onClick={() => onNavigate && onNavigate('quiz')}
                className="mt-4 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition shadow-sm cursor-pointer"
              >
                Take Career Assessment
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {assessments.map((a, index) => {
                const isOpen = openAssessmentId === a.id;
                const prepPercent = a.careers.length > 0
                  ? Math.round(a.careers.reduce((sum, c) => sum + (c.percent || 0), 0) / a.careers.length)
                  : 0;

                return (
                  <div key={a.id} className="border border-gray-100 rounded-2xl overflow-hidden">
                    <button
                      type="button"
                      onClick={() => setOpenAssessmentId(isOpen ? null : a.id)}
                      className="w-full flex items-center justify-between gap-4 p-5 bg-gray-50/40 hover:bg-gray-50 transition text-left cursor-pointer"
                    >
                      <div className="flex items-center gap-4 min-w-0">
                        <div className="w-12 h-12 rounded-xl bg-[#F3E4FF] flex items-center justify-center flex-shrink-0 text-[16px] font-bold text-[#7E06AD]">
                          #{a.number}
                        </div>
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <span className="font-bold text-gray-900 text-[17px] truncate">Assessment #{a.number}</span>
                            {index === 0 && (
                              <span className="px-2.5 py-0.5 rounded-full text-[12px] font-semibold text-[#890080] bg-[#FFE4FF] border border-[#FFD2F7]">Latest</span>
                            )}
                          </div>
                          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px] text-gray-500 font-medium mt-0.5">
                            <span className="inline-flex items-center gap-1"><Calendar size={13} />{a.date}</span>
                            <span className="inline-flex items-center gap-1"><Clock size={13} />{a.time}</span>
                            <span>{a.careers.length} {a.careers.length === 1 ? 'career' : 'careers'} suggested</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 flex-shrink-0">
                        <span className="hidden md:inline-flex px-3 py-1 rounded-full text-[14px] font-semibold text-[#7E06AD] bg-[#F3E4FF]">
                          Score {a.score ?? 0}%
                        </span>
                        <div className="w-32 hidden sm:block">
                          <div className="w-full h-[8px] bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${prepPercent}%` }} />
                          </div>
                        </div>
                        <span className="text-[15px] font-bold text-emerald-600 w-12 text-right">{prepPercent}%</span>
                        {isOpen ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                      </div>
                    </button>

                    {isOpen && (
                      <div className="p-4 sm:p-5 space-y-3 bg-white border-t border-gray-100">
                        {a.careers.length === 0 ? (
                          <div className="text-gray-400 text-sm text-center py-4">The careers suggested in this assessment are no longer available.</div>
                        ) : a.careers.map((c) => {
                          const CareerIcon = getCareerIcon(c.icon);
                          const isChecklistOpen = openChecklist?.assessmentId === a.id && openChecklist?.careerId === c.careerId;

                          return (
                            <div key={c.careerId} className="border border-gray-100 rounded-xl overflow-hidden">
                              <button
                                type="button"
                                onClick={() => setOpenChecklist(isChecklistOpen ? null : { assessmentId: a.id, careerId: c.careerId })}
                                className="w-full flex items-center justify-between gap-4 p-4 hover:bg-gray-50 transition text-left cursor-pointer"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <span className="w-7 h-7 rounded-full bg-[#890080] text-white text-[13px] font-bold flex items-center justify-center flex-shrink-0">
                                    {c.rank}
                                  </span>
                                  <div className={`w-10 h-10 rounded-xl ${CAREER_DETAILS_ICON_BG} flex items-center justify-center flex-shrink-0`}>
                                    <CareerIcon size={19} className={CAREER_DETAILS_ICON_COLOR} />
                                  </div>
                                  <div className="min-w-0">
                                    <div className="font-bold text-gray-900 text-[15px] truncate">{c.careerTitle}</div>
                                    <div className="text-[13px] text-gray-500 font-medium">
                                      {c.match !== null && <span className="text-[#7E06AD] font-semibold">{c.match}% match · </span>}
                                      {c.completedSteps} of {c.totalSteps} steps completed
                                    </div>
                                  </div>
                                </div>
                                <div className="flex items-center gap-4 flex-shrink-0">
                                  <div className="w-24 hidden sm:block">
                                    <div className="w-full h-[8px] bg-gray-200 rounded-full overflow-hidden">
                                      <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${c.percent}%` }} />
                                    </div>
                                  </div>
                                  <span className="text-[14px] font-bold text-emerald-600 w-11 text-right">{c.percent}%</span>
                                  {isChecklistOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                                </div>
                              </button>
                              {isChecklistOpen && renderChecklist(c.careerId)}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}

              {otherRoadmaps.length > 0 && (
                <div className="space-y-4 pt-2">
                  <div className="pt-4 border-t border-gray-100">
                    <h3 className="text-[21px] font-semibold text-gray-900 tracking-tight">Other Roadmaps You Follow</h3>
                    <p className="text-[14px] text-[#545454] font-normal mt-1">Careers you started preparing for from Browse Careers.</p>
                  </div>
                  {otherRoadmaps.map((r) => {
                    const CareerIcon = getCareerIcon(r.icon);
                    const isExpanded = expandedId === r.careerId;

                    return (
                      <div key={r.careerId} className="border border-gray-100 rounded-2xl overflow-hidden">
                        <button
                          type="button"
                          onClick={() => handleExpandToggle(r.careerId)}
                          className="w-full flex items-center justify-between gap-4 p-5 bg-gray-50/40 hover:bg-gray-50 transition text-left cursor-pointer"
                        >
                          <div className="flex items-center gap-4 min-w-0">
                            <div className={`w-12 h-12 rounded-xl ${CAREER_DETAILS_ICON_BG} flex items-center justify-center flex-shrink-0`}>
                              <CareerIcon size={22} className={CAREER_DETAILS_ICON_COLOR} />
                            </div>
                            <div className="min-w-0">
                              <div className="font-bold text-gray-900 text-[17px] truncate">{r.careerTitle}</div>
                              <div className="text-[13px] text-gray-500 font-medium">{r.completedSteps} of {r.totalSteps} steps completed</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-4 flex-shrink-0">
                            <div className="w-32 hidden sm:block">
                              <div className="w-full h-[8px] bg-gray-200 rounded-full overflow-hidden">
                                <div className="h-full bg-emerald-500 rounded-full transition-all duration-700" style={{ width: `${r.percent}%` }} />
                              </div>
                            </div>
                            <span className="text-[15px] font-bold text-emerald-600 w-12 text-right">{r.percent}%</span>
                            {isExpanded ? <ChevronUp size={20} className="text-gray-400" /> : <ChevronDown size={20} className="text-gray-400" />}
                          </div>
                        </button>

                        {isExpanded && renderChecklist(r.careerId)}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

      </main>
    </div>
  );
}
