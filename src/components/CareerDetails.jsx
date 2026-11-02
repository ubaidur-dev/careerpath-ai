import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import {
  DollarSign,
  TrendingUp,
  BookOpen,
  Award,
  CheckCircle2,
  Clock,
  Layers,
  HelpCircle,
  Check
} from 'lucide-react';
import { getCareerIcon, getDemandBadgeProps } from '../utils/careerVisuals';
import BackToDashboardButton from './BackToDashboardButton';

export default function CareerDetails({ careerData, onBack, onNavigate, onLogout }) {
  const [dbCareer, setDbCareer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [progressSteps, setProgressSteps] = useState(null);
  const [progressPercent, setProgressPercent] = useState(0);
  const [togglingStep, setTogglingStep] = useState(null);

  useEffect(() => {
    if (!careerData) return;

    const fetchCareerDetails = async () => {
      setLoading(true);
      try {
        const response = await axios.get('http://localhost:8000/api/career-details');
        const matched = (response.data || []).find(c => c.title === careerData.title);
        setDbCareer(matched || null);

        const token = sessionStorage.getItem('token');
        if (matched?.id && token) {
          axios.post(`/careers/${matched.id}/view`, {}, { headers: { Authorization: `Bearer ${token}` } }).catch(() => {});
        }
      } catch (error) {
        console.error("Error fetching career details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareerDetails();
  }, [careerData]);

  useEffect(() => {
    if (!dbCareer?.id) return undefined;
    const token = sessionStorage.getItem('token');
    if (!token) return undefined;
    const headers = { Authorization: `Bearer ${token}` };

    const fetchProgress = () => {
      axios.get(`/career-roadmap/${dbCareer.id}`, { headers })
        .then(res => {
          setProgressSteps(res.data.steps || []);
          setProgressPercent(res.data.percent ?? 0);
        })
        .catch(() => {});
    };

    fetchProgress();
    const interval = setInterval(fetchProgress, 4000);
    return () => clearInterval(interval);
  }, [dbCareer?.id]);

  const handleToggleStep = (stepIndex) => {
    if (!dbCareer?.id) return;
    const token = sessionStorage.getItem('token');
    if (!token) return;
    if ((progressSteps || []).some((s) => s.index === stepIndex && s.completed)) return;

    setTogglingStep(stepIndex);
    axios.post(`/career-roadmap/${dbCareer.id}/toggle`, { step_index: stepIndex }, { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        setProgressSteps(res.data.steps || []);
        setProgressPercent(res.data.percent ?? 0);
      })
      .catch(() => {})
      .finally(() => setTogglingStep(null));
  };

  if (!careerData) {
    return (
      <div className="min-h-screen bg-[#fcf8fe] flex items-center justify-center font-sans">
        <div className="text-center space-y-4 max-w-sm p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HelpCircle size={40} className="text-gray-400 mx-auto" />
          <p className="text-gray-600 font-bold text-sm">No career path selected. Please navigate back to choose one.</p>
          <button onClick={onBack} className="bg-[#bd24df] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const roleOverview = dbCareer?.role_overview || careerData.description || '';
  const roadmap = dbCareer?.roadmap || [];
  const displaySteps = progressSteps !== null
    ? progressSteps
    : roadmap.map((step, idx) => ({ ...step, index: idx, completed: false }));
  const courses = dbCareer?.courses || [];
  const skills = careerData.skills || dbCareer?.skills || [];
  const CareerIcon = getCareerIcon(dbCareer?.icon);

  const demandBadge = getDemandBadgeProps(careerData.demand);
  const DemandIcon = demandBadge.Icon;
  const match = careerData.match;

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 antialiased">
      <style>
        {`
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          .custom-card-shadow { box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25); }
        `}
      </style>

      <Header onNavigate={onNavigate} onLogout={onLogout} userRole="student" currentView="browse" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

        <BackToDashboardButton onClick={() => onNavigate && onNavigate('dashboard')} />

        <div className="pt-1 space-y-2 text-left">
          <h1 className="text-4xl font-bold tracking-tight text-gray-900">Career Details</h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Explore the skills, learning roadmap and outlook of this career.
          </p>
        </div>

        <div className="bg-white p-7 sm:p-9 rounded-[25px] prototype-card-border custom-card-shadow text-left space-y-6">
          <div className="flex items-start gap-5 flex-row">
            <div className="w-16 h-16 rounded-[20px] bg-[#FFE7F2] border-[0.5px] border-[#FF00ED] flex items-center justify-center flex-shrink-0 shadow-sm mt-[3px]">
              <CareerIcon size={32} className="text-[#FF2D55] flex-shrink-0" />
            </div>
            <div className="space-y-2.5 flex-1 min-w-0">
              <div className="flex items-center gap-3 flex-wrap pt-[1px]">
                <h2 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none break-words">{careerData.title}</h2>
                {match && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide text-[#05A660] bg-[#E3F6ED] inline-flex items-center gap-1.5 whitespace-nowrap">
                    <Award size={14} className="text-[#05A660] flex-shrink-0" />
                    {String(match).toLowerCase().includes('match') ? match : `${match} Match`}
                  </span>
                )}
                {careerData.demand && (
                  <span className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-wide ${demandBadge.textClass} ${demandBadge.bgClass} border ${demandBadge.borderClass} inline-flex items-center gap-1.5 whitespace-nowrap`}>
                    <DemandIcon size={14} className={`${demandBadge.iconColor} flex-shrink-0`} />
                    {careerData.demand}
                  </span>
                )}
              </div>
              <p className="text-[#545454] text-[18px] font-normal leading-relaxed pt-1.5 break-words">
                {loading && !roleOverview ? 'Loading role overview...' : (roleOverview || 'No role overview available yet.')}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 border-t border-[#FFD2F7]">
            <div className="flex items-center gap-3">
              <DollarSign size={20} className="text-[#890080] flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-500 block">Salary</span>
                <p className="text-[15px] font-bold text-gray-900">{careerData.salary}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <TrendingUp size={20} className="text-[#890080] flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-500 block">Growth</span>
                <p className="text-[15px] font-bold text-gray-900">{careerData.growth}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <DemandIcon size={20} className={`${demandBadge.iconColor} flex-shrink-0`} />
              <div>
                <span className="text-xs font-medium text-gray-500 block">Demand</span>
                <p className="text-[15px] font-bold text-gray-900">{careerData.demand}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock size={20} className="text-[#890080] flex-shrink-0" />
              <div>
                <span className="text-xs font-medium text-gray-500 block">Timeline</span>
                <p className="text-[15px] font-bold text-gray-900">{careerData.timeline}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

          <div className="lg:col-span-2 space-y-8 text-left">

            <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <Layers size={22} className="text-[#890080]" /> Your Learning Roadmap
                </h3>
                {displaySteps.length > 0 && (
                  <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide text-[#05A660] bg-[#E3F6ED] inline-flex items-center gap-1.5 whitespace-nowrap">
                    <CheckCircle2 size={14} className="flex-shrink-0" /> {progressPercent}% Complete
                  </span>
                )}
              </div>

              {displaySteps.length > 0 && (
                <div className="w-full bg-[#D9D9D9] h-[10px] rounded-full overflow-hidden">
                  <div className="bg-emerald-500 h-full rounded-full transition-all duration-700" style={{ width: `${progressPercent}%` }} />
                </div>
              )}

              <div className="space-y-4">
                {displaySteps.length > 0 ? displaySteps.map((step, idx) => {
                  const stepIndex = step.index ?? idx;
                  return (
                    <div
                      key={idx}
                      className={`p-5 rounded-2xl border space-y-2 transition-all ${
                        step.completed ? 'bg-emerald-50/40 border-emerald-200' : 'bg-[#FCF8FE] border-[#FFD2F7]'
                      }`}
                    >
                      <div className="flex items-center justify-between text-[18px] font-medium text-gray-900 gap-3">
                        <span className="flex items-center gap-2.5 min-w-0 break-words">
                          <span className={`w-6 h-6 rounded-full text-white flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            step.completed ? 'bg-emerald-500' : 'bg-[#890080]'
                          }`}>
                            {step.completed ? <Check size={13} strokeWidth={3} /> : idx + 1}
                          </span>
                          {step.title}
                        </span>
                        {step.duration && (
                          <span className="text-[#890080] bg-[#FFE1FD] px-3 py-1 rounded-full border border-[#F45EE4]/40 text-xs font-medium flex-shrink-0">
                            {step.duration}
                          </span>
                        )}
                      </div>
                      <p className="text-[#545454] text-[15px] font-normal pl-8 leading-relaxed break-words">{step.desc}</p>
                      {(step.tags || []).length > 0 && (
                        <div className="flex flex-wrap gap-2 pl-8 pt-1">
                          {step.tags.map((tag, tIdx) => (
                            <span key={tIdx} className="text-xs font-medium bg-white text-[#545454] px-2.5 py-1 rounded-lg border border-[#FFD2F7] break-words">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <div className="pl-8 pt-1">
                        {step.completed ? (
                          <span className="inline-flex items-center gap-1.5 text-[13px] font-semibold text-emerald-600">
                            <CheckCircle2 size={15} /> Completed
                          </span>
                        ) : (
                          <button
                            type="button"
                            onClick={() => handleToggleStep(stepIndex)}
                            disabled={togglingStep === stepIndex}
                            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-[13px] font-semibold text-[#890080] bg-white border border-[#FFD2F7] hover:bg-[#890080] hover:text-white transition-all cursor-pointer disabled:opacity-60 disabled:cursor-wait"
                          >
                            <Check size={14} strokeWidth={2.5} /> Mark as complete
                          </button>
                        )}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="text-gray-500 text-center py-4 text-[15px]">
                    {loading ? 'Loading roadmap...' : 'No learning roadmap available yet for this career.'}
                  </div>
                )}
              </div>
            </div>

            <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
              <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                <BookOpen size={22} className="text-[#890080]" /> Recommended Courses
              </h3>
              <div className="space-y-3">
                {courses.length > 0 ? courses.map((course, cIdx) => (
                  <div key={cIdx} className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] flex items-center justify-between gap-3">
                    <div className="space-y-1 min-w-0">
                      <h4 className="text-[17px] font-bold text-gray-900 break-words">{course.title}</h4>
                      <div className="flex items-center gap-4 text-[14px] text-[#545454]">
                        <span>{course.platform}</span>
                        <span className="flex items-center gap-1.5 text-[#F59E0B] font-medium">
                          <Award size={15} /> {course.rating}
                        </span>
                      </div>
                    </div>
                    <div className="text-[#2563EB] font-bold text-[16px] flex-shrink-0">
                      {course.cost}
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4 text-[15px]">
                    {loading ? 'Loading courses...' : 'No recommended courses available yet for this career.'}
                  </div>
                )}
              </div>
            </div>

          </div>

          <div className="space-y-8 text-left">

            <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
              <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                <Award size={22} className="text-[#890080]" /> Required Skills
              </h3>
              <div className="space-y-5">
                {skills.length > 0 ? skills.map((skill, skIdx) => (
                  <div key={skIdx} className="space-y-1.5">
                    <div className="flex justify-between text-[16px] font-medium text-gray-900 gap-2">
                      <span className="break-words">{skill.name}</span>
                      <span className="text-[#890080] font-semibold flex-shrink-0">{skill.value}%</span>
                    </div>
                    <div className="w-full bg-[#D9D9D9] h-[10px] rounded-full overflow-hidden">
                      <div className="bg-[#F45EE4] h-full rounded-full transition-all duration-500" style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                )) : (
                  <div className="text-gray-500 text-center py-4 text-[15px]">No skills listed yet for this career.</div>
                )}
              </div>
            </div>

            <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
              <h3 className="text-[22px] font-bold text-gray-900 tracking-tight text-center mb-6">
                Career Outlook
              </h3>
              <div className="space-y-4">
                <div className="bg-[#F0FDF4] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-1">Job Openings</span>
                  <span className="text-[#16A34A] font-bold text-[19px]">{careerData.openings || '—'}</span>
                </div>
                <div className="bg-[#EFF6FF] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-1">Average Experience</span>
                  <span className="text-[#1D4ED8] font-bold text-[19px]">{careerData.experience || '—'}</span>
                </div>
                <div className="bg-[#FAF5FF] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-1">Work Flexibility</span>
                  <span className="text-[#9333EA] font-bold text-[19px]">{careerData.flexibility || '—'}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}
