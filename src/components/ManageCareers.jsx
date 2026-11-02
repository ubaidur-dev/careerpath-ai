import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import {
  Plus,
  Search,
  Edit3,
  Trash2,
  Eye,
  X,
  Check,
  Layers,
  BookOpen,
  Award,
  AlertCircle,
  HelpCircle,
  ArrowLeft,
  ArrowRight,
  Filter,
  RotateCcw,
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Search as SearchIcon,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity,
  Clock
} from 'lucide-react';
import { getDemandBadgeProps } from '../utils/careerVisuals';
import BackToDashboardButton from './BackToDashboardButton';

const ICON_MAP = {
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  TrendingDown,
  Target,
  Users,
  DollarSign,
  Search: SearchIcon,
  Zap,
  ShieldCheck,
  Smartphone,
  Globe,
  Cpu,
  Brain,
  Microscope,
  Lightbulb,
  Stethoscope,
  Bot,
  Flame,
  GraduationCap,
  Building2,
  HeartPulse,
  Scale,
  Wrench,
  Palette,
  Camera,
  Film,
  Plane,
  Truck,
  Compass,
  Headphones,
  FileText,
  Database,
  Server,
  Terminal,
  Lock,
  Activity
};

const PRESET_ICONS = [
  { id: "Code2", label: "Software & Web" },
  { id: "BarChart3", label: "Data & Analytics" },
  { id: "PenTool", label: "UI/UX & Design" },
  { id: "Briefcase", label: "Business & Ops" },
  { id: "TrendingUp", label: "Marketing & Growth" },
  { id: "Target", label: "Product Strategy" },
  { id: "Users", label: "HR & Recruitment" },
  { id: "DollarSign", label: "Finance & Banking" },
  { id: "Search", label: "Research & Science" },
  { id: "Stethoscope", label: "Healthcare & Doctor" },
  { id: "HeartPulse", label: "Medical & Clinical" },
  { id: "Brain", label: "AI & Data Science" },
  { id: "Bot", label: "Robotics & Automation" },
  { id: "Cpu", label: "Hardware & Electronics" },
  { id: "Microscope", label: "Laboratory & Bio" },
  { id: "GraduationCap", label: "Education & Teaching" },
  { id: "Building2", label: "Corporate & Real Estate" },
  { id: "ShieldCheck", label: "Cybersecurity & Legal" },
  { id: "Palette", label: "Creative Arts" },
  { id: "Camera", label: "Photography & Media" },
  { id: "Film", label: "Video Production" },
  { id: "Plane", label: "Aviation & Travel" },
  { id: "Wrench", label: "Engineering & Trades" },
  { id: "Globe", label: "Networks & Web Services" }
];

const RenderCareerIcon = ({ iconName, size = 28 }) => {
  if (!iconName) {
    return <HelpCircle size={size} className="text-[#FF2D55] flex-shrink-0" />;
  }
  const IconComponent = ICON_MAP[iconName] || Code2;
  return <IconComponent size={size} className="text-[#FF2D55] flex-shrink-0" />;
};

const API_BASE_URL = 'http://localhost:8000/api';

const mapApiCareerToLocal = (career) => ({
  ...career,
  id: career.id,
  roleOverview: career.role_overview ?? career.roleOverview ?? '',
  skills: career.skills || [],
  roadmap: career.roadmap || [],
  courses: career.courses || []
});

const mapLocalCareerToApi = (career) => {
  const { roleOverview, id, created_at, updated_at, ...rest } = career;
  return {
    ...rest,
    role_overview: roleOverview
  };
};

export default function ManageCareers({ onNavigate }) {
  const [careersList, setCareersList] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [previewCareer, setPreviewCareer] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [activeFormTab, setActiveFormTab] = useState('basic');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const emptyFormState = {
    title: '',
    match: '90% Match',
    demand: 'High Demand',
    icon: '',
    description: '',
    roleOverview: '',
    salary: '$85,000 - $150,000',
    growth: 'High',
    timeline: '12 - 18 months',
    openings: '20,000+',
    experience: '1-3 years',
    flexibility: 'Remote OK',
    skills: [
      { name: '', value: 80 }
    ],
    roadmap: [
      { title: '', duration: '', desc: '', tagsInput: '' }
    ],
    courses: [
      { title: '', platform: '', rating: '4.8', cost: 'Free' }
    ]
  };

  const [formData, setFormData] = useState(emptyFormState);

  const formTabs = [
    { id: 'basic', label: '1. Basic Info & Icon' },
    { id: 'metrics', label: '2. Career Metrics' },
    { id: 'skills', label: '3. Required Skills' },
    { id: 'roadmap', label: '4. Learning Roadmap' },
    { id: 'courses', label: '5. Recommended Courses' }
  ];

  const filteredCareers = careersList.filter((c) => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return true;
    const searchableValues = [
      c.title,
      c.demand,
      c.match,
      c.salary,
      c.timeline,
      c.experience,
      c.growth,
      c.description,
      ...(Array.isArray(c.skills) ? c.skills.map((sk) => sk.name) : []),
    ];
    return searchableValues.some(
      (val) => val !== null && val !== undefined && String(val).toLowerCase().includes(q)
    );
  });

  const totalPages = Math.ceil(filteredCareers.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredCareers.length);
  const paginatedCareers = filteredCareers.slice(startIndex, endIndex);

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [filteredCareers.length, totalPages, currentPage]);

  const fetchCareers = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/career-details`);
      setCareersList((response.data || []).map(mapApiCareerToLocal));
    } catch (error) {
      console.error("Error fetching careers:", error);
    }
  };

  useEffect(() => {
    fetchCareers();
    const interval = setInterval(fetchCareers, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handleCreateNew = () => {
    setEditingId(null);
    setFormData(emptyFormState);
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleEdit = (career) => {
    setEditingId(career.id);
    setFormData({
      ...career,
      icon: career.icon || career.iconText || '',
      roadmap: career.roadmap.map(r => ({
        ...r,
        tagsInput: Array.isArray(r.tags) ? r.tags.join(', ') : r.tags || ''
      }))
    });
    setActiveFormTab('basic');
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this career profile?")) {
      try {
        await axios.delete(`${API_BASE_URL}/career-details/${id}`);
        setCareersList(prev => prev.filter(c => c.id !== id));
      } catch (error) {
        console.error("Error deleting career:", error);
      }
    }
  };

  const handleAddSkill = () => {
    setFormData(prev => ({
      ...prev,
      skills: [...prev.skills, { name: '', value: 75 }]
    }));
  };

  const handleRemoveSkill = (index) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index, field, val) => {
    const updated = [...formData.skills];
    updated[index][field] = field === 'value' ? Number(val) : val;
    setFormData(prev => ({ ...prev, skills: updated }));
  };

  const handleAddRoadmapStep = () => {
    setFormData(prev => ({
      ...prev,
      roadmap: [...prev.roadmap, { title: '', duration: '', desc: '', tagsInput: '' }]
    }));
  };

  const handleRemoveRoadmapStep = (index) => {
    setFormData(prev => ({
      ...prev,
      roadmap: prev.roadmap.filter((_, i) => i !== index)
    }));
  };

  const handleRoadmapChange = (index, field, val) => {
    const updated = [...formData.roadmap];
    updated[index][field] = val;
    setFormData(prev => ({ ...prev, roadmap: updated }));
  };

  const handleAddCourse = () => {
    setFormData(prev => ({
      ...prev,
      courses: [...prev.courses, { title: '', platform: '', rating: '4.7', cost: 'Free' }]
    }));
  };

  const handleRemoveCourse = (index) => {
    setFormData(prev => ({
      ...prev,
      courses: prev.courses.filter((_, i) => i !== index)
    }));
  };

  const handleCourseChange = (index, field, val) => {
    const updated = [...formData.courses];
    updated[index][field] = val;
    setFormData(prev => ({ ...prev, courses: updated }));
  };

  const handleNextTab = () => {
    const currentIndex = formTabs.findIndex(t => t.id === activeFormTab);
    if (currentIndex < formTabs.length - 1) {
      setActiveFormTab(formTabs[currentIndex + 1].id);
    }
  };

  const handlePrevTab = () => {
    const currentIndex = formTabs.findIndex(t => t.id === activeFormTab);
    if (currentIndex > 0) {
      setActiveFormTab(formTabs[currentIndex - 1].id);
    }
  };

  const handleSaveForm = async (e) => {
    e.preventDefault();
    const cleanedRoadmap = formData.roadmap.map(step => ({
      title: step.title,
      duration: step.duration,
      desc: step.desc,
      tags: typeof step.tagsInput === 'string'
        ? step.tagsInput.split(',').map(t => t.trim()).filter(Boolean)
        : step.tags || []
    }));

    const finalPayload = {
      ...formData,
      icon: formData.icon || '',
      roadmap: cleanedRoadmap
    };

    const apiPayload = mapLocalCareerToApi(finalPayload);

    try {
      if (editingId) {
        const response = await axios.put(`${API_BASE_URL}/career-details/${editingId}`, apiPayload);
        const updated = mapApiCareerToLocal(response.data.data);
        setCareersList(prev => prev.map(c => c.id === editingId ? updated : c));
      } else {
        const response = await axios.post(`${API_BASE_URL}/career-details`, apiPayload);
        const created = mapApiCareerToLocal(response.data.data);
        setCareersList(prev => [created, ...prev]);
      }
      setIsModalOpen(false);
    } catch (error) {
      console.error("Error saving career:", error);
    }
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 sm:px-6 lg:px-8 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 text-left">
      <style>
        {`
          .custom-quiz-border { border: 0.7px solid #FF00D3; }
          .prototype-card-border { border: 0.5px solid #FFD2F7; }
          .custom-card-shadow { box-shadow: 3px 8px 8px 2px rgba(0, 0, 0, 0.25); }
        `}
      </style>

      <BackToDashboardButton onClick={() => onNavigate && onNavigate('dashboard')} />

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2"> 
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
            Manage Careers
          </h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Organize, update, and deploy new careers for AI recommendations
          </p>
        </div>
        <button 
          type="button"
          onClick={handleCreateNew}
          style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
          className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center sm:self-center"
        >
          <Plus size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
          <span className="leading-none">Add New Career</span>
        </button>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[25px] prototype-card-border custom-card-shadow">
        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1">
          <div className="relative w-full sm:w-96">
            <Search size={20} className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by career title or demand..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="w-full pl-11 pr-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 placeholder-gray-400 font-normal"
            />
          </div>
          {searchQuery !== '' && (
            <button
              type="button"
              onClick={() => { setSearchQuery(''); setCurrentPage(1); }}
              className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl border border-gray-300 hover:bg-gray-100 text-gray-700 text-[15px] font-semibold transition-colors cursor-pointer flex-shrink-0"
            >
              <RotateCcw size={16} />
              Reset
            </button>
          )}
        </div>
        <div className="text-[16px] font-normal text-[#545454] flex items-center gap-2 flex-shrink-0">
          <Filter size={18} className="text-gray-400" />
          <span>
            Showing <strong className="text-gray-900 font-semibold">{filteredCareers.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{filteredCareers.length}</strong>
          </span>
        </div>
      </div>

      {filteredCareers.length === 0 ? (
        <div className="bg-white rounded-[25px] p-10 prototype-card-border custom-card-shadow mt-6 text-center">
          <div className="flex flex-col items-center justify-center py-16">
            <AlertCircle size={52} className="text-[#890080]/40 mb-3" />
            <h3 className="text-[30px] font-semibold text-gray-900 tracking-tight mb-2">No Careers Found</h3>
            <p className="text-[#545454] font-normal text-[18px] mb-6">No matching records found. Create a new career profile to populate frontend views.</p>
            <button 
              type="button"
              onClick={handleCreateNew}
              style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
              className="inline-flex items-center justify-center font-medium text-[20px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm"
            >
              <Plus size={22} className="mr-2" />
              <span>Create Career Profile</span>
            </button>
          </div>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6">
            {paginatedCareers.map((career, index) => {
              const globalIndex = startIndex + index + 1;
              const currentIconName = career.icon || career.iconText || '';
              const demandProps = getDemandBadgeProps(career.demand);
              const DemandIcon = demandProps.Icon;

              return (
                <div 
                  key={career.id} 
                  className="bg-white rounded-[25px] prototype-card-border custom-card-shadow p-7 sm:p-9 transition-all flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  <div className="space-y-4 flex-1 min-w-0">
                    <div className="flex items-center gap-4 flex-wrap">
                      <div className="w-9 h-9 rounded-full bg-[#890080] text-white font-bold text-sm flex items-center justify-center shadow-xs flex-shrink-0">
                        {globalIndex}
                      </div>
                      <div className="w-14 h-14 rounded-[17px] bg-[#FFE7F2] border-[0.5px] border-[#FF00ED] flex items-center justify-center flex-shrink-0 shadow-sm">
                        <RenderCareerIcon iconName={currentIconName} size={28} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-3 flex-wrap">
                          <h3 title={career.title} className="text-[26px] font-bold text-gray-900 tracking-tight break-words">{career.title}</h3>
                          <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide text-[#05A660] bg-[#E3F6ED] inline-flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap">
                            <Award size={14} className="text-[#05A660] flex-shrink-0" />
                            {career.match}
                          </span>
                          <span className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-wide ${demandProps.textClass} ${demandProps.bgClass} border ${demandProps.borderClass} inline-flex items-center gap-1.5 flex-shrink-0 whitespace-nowrap`}>
                            <DemandIcon size={14} className={`${demandProps.iconColor} flex-shrink-0`} />
                            {career.demand}
                          </span>
                        </div>
                        <p
                          title={`Salary: ${career.salary ?? ''} • Timeline: ${career.timeline ?? ''} • Experience: ${career.experience ?? ''}`}
                          className="text-[16px] font-normal text-[#545454] mt-1 break-words"
                        >
                          Salary: <strong className="text-gray-900 font-semibold">{career.salary}</strong> &bull; Timeline: <strong className="text-gray-900 font-semibold">{career.timeline}</strong> &bull; Experience: <strong className="text-gray-900 font-semibold">{career.experience}</strong>
                        </p>
                      </div>
                    </div>
                    <p className="text-[#545454] text-[16px] font-normal leading-relaxed pl-0 lg:pl-18 break-words">
                      {career.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-3 text-[15px] font-normal text-[#545454] pt-1 pl-0 lg:pl-18">
                      <span className="flex items-center gap-1.5 bg-[#FCF8FE] px-4 py-1.5 rounded-xl border border-[#FFD2F7]">
                        <Award size={16} className="text-[#890080]" /> {career.skills?.length || 0} Key Skills
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#FCF8FE] px-4 py-1.5 rounded-xl border border-[#FFD2F7]">
                        <Layers size={16} className="text-[#890080]" /> {career.roadmap?.length || 0} Roadmap Steps
                      </span>
                      <span className="flex items-center gap-1.5 bg-[#FCF8FE] px-4 py-1.5 rounded-xl border border-[#FFD2F7]">
                        <BookOpen size={16} className="text-[#890080]" /> {career.courses?.length || 0} Recommended Courses
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2.5 self-start lg:self-start shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 w-full lg:w-auto justify-end">
                    <button 
                      type="button"
                      onClick={() => setPreviewCareer(career)}
                      className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-[#FFD2F7] bg-[#FCF8FE] text-[#890080] hover:bg-[#FFE1FD] hover:border-[#F45EE4]/50 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Eye size={15} className="mr-1.5 text-[#890080]" /> Preview
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleEdit(career)}
                      className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-[#F45EE4]/40 bg-[#FFE1FD] text-[#890080] hover:bg-[#890080] hover:text-white hover:border-[#890080] transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Edit3 size={15} className="mr-1.5" /> Edit
                    </button>
                    <button 
                      type="button"
                      onClick={() => handleDelete(career.id)}
                      className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                    >
                      <Trash2 size={15} className="mr-1.5" /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredCareers.length > 0 && (
            <div className="flex justify-center items-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => { setCurrentPage(prev => Math.max(prev - 1, 1)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={activePage === 1}
                className={`px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Previous
              </button>
              <div className="flex items-center gap-2 mx-1">
                {visiblePageNumbers.map((pageNum) => {
                  return (
                    <button
                      key={pageNum}
                      type="button"
                      onClick={() => { setCurrentPage(pageNum); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-medium transition-all cursor-pointer ${
                        activePage === pageNum
                          ? 'bg-[#F45EE4] text-white shadow-sm'
                          : 'bg-white text-gray-700 border border-gray-200 hover:border-[#F45EE4] hover:text-[#890080]'
                      }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => { setCurrentPage(prev => Math.min(prev + 1, totalPages)); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                disabled={activePage === totalPages}
                className={`px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}

      {isModalOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setIsModalOpen(false)}
        >
          <div
            className="bg-white rounded-[25px] prototype-card-border custom-card-shadow w-full max-w-5xl h-[88vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="px-8 py-5 bg-[#FCF8FE] border-b border-[#FFD2F7] flex items-center justify-between flex-shrink-0">
              <div>
                <h2 className="text-[30px] font-semibold text-gray-900 tracking-tight">
                  {editingId ? `Edit Career: ${formData.title}` : 'Add New Career'}
                </h2>
                <p className="text-[#545454] font-normal text-[16px] mt-0.5">
                  Fill in career details and select a Lucide SVG icon to sync with frontend.
                </p>
              </div>
              <button 
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-11 h-11 rounded-full bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-all cursor-pointer shadow-sm flex-shrink-0"
                title="Close"
              >
                <X size={22} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex items-center justify-between border-b border-gray-100 bg-white px-8 pt-4 overflow-x-auto scrollbar-none flex-shrink-0">
              {formTabs.map(tab => (
                <button 
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveFormTab(tab.id)}
                  className={`pb-3.5 px-3 sm:px-4 text-[16px] border-b-2 whitespace-nowrap transition-all cursor-pointer flex-1 text-center ${
                    activeFormTab === tab.id 
                      ? 'border-[#890080] text-[#890080] font-semibold' 
                      : 'border-transparent text-[#545454] font-normal hover:text-gray-800'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            <form onSubmit={handleSaveForm} className="p-8 overflow-y-auto space-y-6 flex-1 text-left [scrollbar-gutter:stable]">
              
              {activeFormTab === 'basic' && (
                <div className="space-y-6">
                  <div className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] text-[15px] font-normal text-[#545454] flex items-center gap-3">
                    <HelpCircle size={20} className="text-[#890080] flex-shrink-0" />
                    <span>Enter basic career profile details, title, Lucide icon, badges, and descriptions.</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Career Title *</label>
                      <input 
                        type="text" 
                        required
                        value={formData.title} 
                        onChange={e => setFormData({...formData, title: e.target.value})}
                        placeholder="e.g. Software Developer"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Selected Profession Icon</label>
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-[17px] bg-[#FFE7F2] border-[0.5px] border-[#FF00ED] flex items-center justify-center flex-shrink-0 shadow-sm">
                          <RenderCareerIcon iconName={formData.icon} size={28} />
                        </div>
                        <input 
                          type="text" 
                          value={formData.icon} 
                          onChange={e => setFormData({...formData, icon: e.target.value})}
                          placeholder="Click an icon below or type key"
                          className="w-full px-3 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] font-mono focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">AI Match Score Badge</label>
                      <input 
                        type="text" 
                        value={formData.match} 
                        onChange={e => setFormData({...formData, match: e.target.value})}
                        placeholder="e.g. 92% Match"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Demand Level Badge</label>
                      <Dropdown
                        triggerClassName="bg-[#FCF8FE] rounded-xl px-4 py-3 text-[16px]"
                        value={formData.demand}
                        onChange={(v) => setFormData({ ...formData, demand: v })}
                        options={['Very High Demand', 'High Demand', 'Medium Demand', 'Low Demand']}
                        ariaLabel="Demand level"
                      />
                    </div>
                  </div>

                  <div className="space-y-3 bg-[#FCF8FE] p-5 rounded-2xl border border-[#FFD2F7]">
                    <label className="text-[16px] font-medium text-gray-900 block">
                      Select Profession Icon from Global Library
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-1">
                      {PRESET_ICONS.map((item) => {
                        const isSelected = formData.icon === item.id;
                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setFormData({...formData, icon: item.id})}
                            className={`flex flex-col items-center justify-center p-3.5 rounded-xl border transition-all duration-200 cursor-pointer gap-2 ${
                              isSelected 
                                ? 'bg-[#FFE7F2] border-[#FF00ED] shadow-sm ring-2 ring-[#FF00ED]/30 scale-[1.02]' 
                                : 'bg-white border-[#FFD2F7] hover:border-[#FF00ED] hover:bg-[#FFE7F2]/40 hover:shadow-xs'
                            }`}
                          >
                            <RenderCareerIcon iconName={item.id} size={24} />
                            <span className={`text-xs font-medium text-center leading-tight truncate w-full ${
                              isSelected ? 'text-[#890080] font-semibold' : 'text-gray-700'
                            }`}>
                              {item.label}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Card Short Description (Browse Page) *</label>
                      <textarea 
                        rows={2}
                        required
                        value={formData.description} 
                        onChange={e => setFormData({...formData, description: e.target.value})}
                        placeholder="Concise overview visible on the main card listing..."
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Role Overview Statement (Details Page) *</label>
                      <textarea 
                        rows={4}
                        required
                        value={formData.roleOverview} 
                        onChange={e => setFormData({...formData, roleOverview: e.target.value})}
                        placeholder="Detailed breakdown paragraph explaining core responsibilities..."
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFormTab === 'metrics' && (
                <div className="space-y-6">
                  <div className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] text-[15px] font-normal text-[#545454] flex items-center gap-3">
                    <HelpCircle size={20} className="text-[#890080] flex-shrink-0" />
                    <span>Enter clear estimated values for career prospective metrics.</span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Expected Salary Range</label>
                      <input 
                        type="text" 
                        value={formData.salary} 
                        onChange={e => setFormData({...formData, salary: e.target.value})}
                        placeholder="e.g. $85,000 - $150,000"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Growth Velocity</label>
                      <input 
                        type="text" 
                        value={formData.growth} 
                        onChange={e => setFormData({...formData, growth: e.target.value})}
                        placeholder="e.g. High or Very High"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Track Learning Timeline</label>
                      <input 
                        type="text" 
                        value={formData.timeline} 
                        onChange={e => setFormData({...formData, timeline: e.target.value})}
                        placeholder="e.g. 12 - 18 months"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Estimated Job Openings</label>
                      <input 
                        type="text" 
                        value={formData.openings} 
                        onChange={e => setFormData({...formData, openings: e.target.value})}
                        placeholder="e.g. 45,000+"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Required Experience Level</label>
                      <input 
                        type="text" 
                        value={formData.experience} 
                        onChange={e => setFormData({...formData, experience: e.target.value})}
                        placeholder="e.g. 3-5 years or Entry Level"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[16px] font-medium text-gray-900 block">Work Environment Flexibility (Comma Separated)</label>
                      <input 
                        type="text" 
                        value={formData.flexibility} 
                        onChange={e => setFormData({...formData, flexibility: e.target.value})}
                        placeholder="e.g. Remote OK, Hybrid, On-site"
                        className="w-full px-4 py-3 bg-[#FCF8FE] border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                      />
                    </div>
                  </div>
                </div>
              )}

              {activeFormTab === 'skills' && (
                <div className="space-y-6">
                  <div className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] text-[15px] font-normal text-[#545454] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={20} className="text-[#890080] flex-shrink-0" />
                      <span>Define key required technical skills and their weighted competency percentages.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={handleAddSkill}
                      style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                      className="inline-flex items-center justify-center font-medium text-[16px] px-5 py-2.5 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm flex-shrink-0"
                    >
                      <Plus size={18} className="mr-1.5" /> Add Skill Field
                    </button>
                  </div>
                  <div className="space-y-4">
                    {formData.skills.map((sk, idx) => (
                      <div key={idx} className="bg-[#FCF8FE] p-6 rounded-[20px] border border-[#FFD2F7] flex flex-col sm:flex-row items-center gap-6 relative">
                        <div className="flex-1 w-full space-y-2">
                          <label className="text-[16px] font-medium text-gray-900 block">Skill Name</label>
                          <input 
                            type="text"
                            placeholder="e.g. Python Scripting or Problem Solving"
                            value={sk.name}
                            onChange={e => handleSkillChange(idx, 'name', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                          />
                        </div>
                        <div className="w-full sm:w-44 space-y-2">
                          <label className="text-[16px] font-medium text-gray-900 block text-center">Weight %</label>
                          <div className="flex items-center gap-2">
                            <input 
                              type="number"
                              min="1"
                              max="100"
                              value={sk.value}
                              onChange={e => handleSkillChange(idx, 'value', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] text-center font-bold focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                            />
                            <span className="text-base font-semibold text-[#890080]">%</span>
                          </div>
                        </div>
                        <div className="pt-2 sm:pt-7 self-end sm:self-center">
                          <button 
                            type="button"
                            onClick={() => handleRemoveSkill(idx)}
                            className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                            title="Remove Skill"
                          >
                            <Trash2 size={15} className="mr-1.5" /> Remove
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeFormTab === 'roadmap' && (
                <div className="space-y-6">
                  <div className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] text-[15px] font-normal text-[#545454] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={20} className="text-[#890080] flex-shrink-0" />
                      <span>Define sequential learning roadmap phases, timelines, and study resources.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={handleAddRoadmapStep}
                      style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                      className="inline-flex items-center justify-center font-medium text-[16px] px-5 py-2.5 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm flex-shrink-0"
                    >
                      <Plus size={18} className="mr-1.5" /> Add Roadmap Phase
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.roadmap.map((step, idx) => (
                      <div key={idx} className="bg-[#FCF8FE] p-6 sm:p-7 rounded-[22px] border border-[#FFD2F7] space-y-6 relative">
                        <div className="flex items-center justify-between border-b border-[#FFD2F7] pb-4">
                          <span className="text-xs font-bold text-[#890080] bg-[#FFE1FD] px-3.5 py-1.5 rounded-full border border-[#F45EE4]/40 tracking-wider uppercase flex items-center gap-1.5">
                            <Layers size={13} /> Phase {String(idx + 1).padStart(2, '0')}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveRoadmapStep(idx)}
                            className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Trash2 size={15} className="mr-1.5" /> Remove Phase
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                          <div className="sm:col-span-2 space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Phase Title</label>
                            <input 
                              type="text"
                              placeholder="e.g. Master Programming Fundamentals"
                              value={step.title}
                              onChange={e => handleRoadmapChange(idx, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Estimated Duration</label>
                            <input 
                              type="text"
                              placeholder="e.g. 2-3 months"
                              value={step.duration}
                              onChange={e => handleRoadmapChange(idx, 'duration', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                            />
                          </div>
                        </div>
                        <div className="space-y-2">
                          <label className="text-[16px] font-medium text-gray-900 block">Learning Objectives & Overview</label>
                          <textarea 
                            rows={3}
                            placeholder="Provide actionable guidance for completing this roadmap phase..."
                            value={step.desc}
                            onChange={e => handleRoadmapChange(idx, 'desc', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 leading-relaxed"
                          />
                        </div>
                        <div className="space-y-2">
                          <label className="text-[16px] font-medium text-gray-900 block">Recommended Platforms / Tags (Separated by comma)</label>
                          <input 
                            type="text"
                            placeholder="e.g. Codecademy, freeCodeCamp, Python.org"
                            value={step.tagsInput}
                            onChange={e => handleRoadmapChange(idx, 'tagsInput', e.target.value)}
                            className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeFormTab === 'courses' && (
                <div className="space-y-6">
                  <div className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] text-[15px] font-normal text-[#545454] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <HelpCircle size={20} className="text-[#890080] flex-shrink-0" />
                      <span>Curate top recommended certification courses, providers, ratings, and pricing.</span>
                    </div>
                    <button 
                      type="button"
                      onClick={handleAddCourse}
                      style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                      className="inline-flex items-center justify-center font-medium text-[16px] px-5 py-2.5 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm flex-shrink-0"
                    >
                      <Plus size={18} className="mr-1.5" /> Add Course Resource
                    </button>
                  </div>
                  <div className="space-y-6">
                    {formData.courses.map((crs, idx) => (
                      <div key={idx} className="bg-[#FCF8FE] p-6 sm:p-7 rounded-[22px] border border-[#FFD2F7] space-y-6 relative">
                        <div className="flex items-center justify-between border-b border-[#FFD2F7] pb-3">
                          <span className="text-xs font-bold text-[#890080] bg-[#FFE1FD] px-3.5 py-1.5 rounded-full border border-[#F45EE4]/40 tracking-wider uppercase flex items-center gap-1.5">
                            <BookOpen size={13} /> Resource {String(idx + 1).padStart(2, '0')}
                          </span>
                          <button 
                            type="button"
                            onClick={() => handleRemoveCourse(idx)}
                            className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                          >
                            <Trash2 size={15} className="mr-1.5" /> Remove Resource
                          </button>
                        </div>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Course Title</label>
                            <input 
                              type="text"
                              placeholder="e.g. Complete Web Development Bootcamp"
                              value={crs.title}
                              onChange={e => handleCourseChange(idx, 'title', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Offering Platform / Provider</label>
                            <input 
                              type="text"
                              placeholder="e.g. Udemy, Coursera, Harvard / edX"
                              value={crs.platform}
                              onChange={e => handleCourseChange(idx, 'platform', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Rating</label>
                            <input 
                              type="text"
                              placeholder="e.g. 4.8"
                              value={crs.rating}
                              onChange={e => handleCourseChange(idx, 'rating', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 font-semibold"
                            />
                          </div>
                          <div className="space-y-2">
                            <label className="text-[16px] font-medium text-gray-900 block">Pricing Model</label>
                            <input 
                              type="text"
                              placeholder="e.g. Free or $19.99"
                              value={crs.cost}
                              onChange={e => handleCourseChange(idx, 'cost', e.target.value)}
                              className="w-full px-4 py-3 bg-white border border-[#FFD2F7] rounded-xl text-[16px] focus:outline-none focus:ring-2 focus:ring-[#890080]/30 text-gray-800 font-semibold"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="pt-6 border-t border-gray-100 flex items-center justify-between">
                <div>
                  {activeFormTab === 'basic' ? (
                    <button 
                      type="button"
                      onClick={() => setIsModalOpen(false)}
                      className="px-5 py-2.5 rounded-[15px] text-[15px] font-medium bg-gray-100 text-[#545454] hover:bg-gray-200 border border-gray-200 transition cursor-pointer"
                    >
                      Cancel
                    </button>
                  ) : (
                    <button 
                      type="button"
                      onClick={handlePrevTab}
                      className="inline-flex items-center justify-center font-medium text-[15px] px-5 py-2.5 rounded-[15px] bg-gray-100 text-[#545454] hover:bg-gray-200 border border-gray-200 transition cursor-pointer"
                    >
                      <ArrowLeft size={16} className="mr-1.5" /> Back
                    </button>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {activeFormTab !== 'courses' && (
                    <button 
                      type="button"
                      onClick={handleNextTab}
                      className="inline-flex items-center justify-center font-medium text-[15px] px-6 py-2.5 rounded-[15px] cursor-pointer bg-[#FCF8FE] text-[#890080] border border-[#FFD2F7] hover:bg-[#FFE1FD] transition-all duration-300 transform hover:scale-105 active:scale-95"
                    >
                      <span>Next Step</span>
                      <ArrowRight size={16} className="ml-1.5" />
                    </button>
                  )}
                  <button 
                    type="submit"
                    style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                    className="inline-flex items-center justify-center font-medium text-[16px] px-7 py-2.5 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm"
                  >
                    <Check size={18} className="mr-1.5" strokeWidth={2.5} />
                    <span>{editingId ? 'Save Changes' : 'Save Career'}</span>
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}

      {previewCareer && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 overflow-y-auto"
          onClick={() => setPreviewCareer(null)}
        >
          <div
            className="bg-white rounded-[25px] prototype-card-border custom-card-shadow w-full max-w-5xl max-h-[90vh] flex flex-col text-left relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setPreviewCareer(null)}
              className="absolute top-8 right-8 w-11 h-11 rounded-full bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-all cursor-pointer shadow-sm z-20 flex-shrink-0"
              title="Close"
            >
              <X size={22} strokeWidth={2.5} />
            </button>
            <div className="overflow-y-auto p-8 sm:p-10 pt-16 sm:pt-20 space-y-8">
            <div className="space-y-6 pt-2">
              <div className="flex items-start gap-5 flex-row">
                <div className="w-16 h-16 rounded-[20px] bg-[#FFE7F2] border-[0.5px] border-[#FF00ED] flex items-center justify-center flex-shrink-0 shadow-sm mt-[3px]">
                  <RenderCareerIcon iconName={previewCareer.icon || previewCareer.iconText || ''} size={32} />
                </div>
                <div className="space-y-2.5 flex-1 min-w-0">
                  <div className="flex items-center gap-3 flex-wrap pt-[1px]">
                    <h2 className="text-[32px] font-bold text-gray-900 tracking-tight leading-none break-words">{previewCareer.title}</h2>
                    {previewCareer.match && (
                      <span className="px-3.5 py-1 rounded-full text-xs font-medium tracking-wide text-[#05A660] bg-[#E3F6ED] inline-flex items-center gap-1.5">
                        <Award size={14} className="text-[#05A660] flex-shrink-0" />
                        {previewCareer.match}
                      </span>
                    )}
                    {previewCareer.demand && (() => {
                      const prevDemandProps = getDemandBadgeProps(previewCareer.demand);
                      const PrevDemandIcon = prevDemandProps.Icon;
                      return (
                        <span className={`px-3.5 py-1 rounded-full text-xs font-medium tracking-wide ${prevDemandProps.textClass} ${prevDemandProps.bgClass} border ${prevDemandProps.borderClass} inline-flex items-center gap-1.5`}>
                          <PrevDemandIcon size={14} className={`${prevDemandProps.iconColor} flex-shrink-0`} />
                          {previewCareer.demand}
                        </span>
                      );
                    })()}
                  </div>
                  <p className="text-[#545454] text-[18px] font-normal leading-relaxed pt-1.5 break-words">
                    {previewCareer.roleOverview || previewCareer.description}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-6 mt-6 border-t border-[#FFD2F7]">
                <div className="flex items-center gap-3">
                  <DollarSign size={20} className="text-[#890080] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-gray-500 block">Salary</span>
                    <p className="text-[15px] font-bold text-gray-900">{previewCareer.salary}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <TrendingUp size={20} className="text-[#890080] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-gray-500 block">Growth</span>
                    <p className="text-[15px] font-bold text-gray-900">{previewCareer.growth}</p>
                  </div>
                </div>
                {(() => {
                  const prevDemandProps = getDemandBadgeProps(previewCareer.demand);
                  const PrevDemandIcon = prevDemandProps.Icon;
                  return (
                    <div className="flex items-center gap-3">
                      <PrevDemandIcon size={20} className={`${prevDemandProps.iconColor} flex-shrink-0`} />
                      <div>
                        <span className="text-xs font-medium text-gray-500 block">Demand</span>
                        <p className="text-[15px] font-bold text-gray-900">{previewCareer.demand}</p>
                      </div>
                    </div>
                  );
                })()}
                <div className="flex items-center gap-3">
                  <Clock size={20} className="text-[#890080] flex-shrink-0" />
                  <div>
                    <span className="text-xs font-medium text-gray-500 block">Timeline</span>
                    <p className="text-[15px] font-bold text-gray-900">{previewCareer.timeline}</p>
                  </div>
                </div>
              </div>
            </div>

            {previewCareer.skills?.length > 0 && (
              <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5 mt-16">
                <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <Award size={22} className="text-[#890080]" /> Required Skills
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  {previewCareer.skills.map((sk, i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="flex justify-between text-[16px] font-medium text-gray-900 gap-2">
                        <span className="break-words">{sk.name}</span>
                        <span className="text-[#890080] font-semibold flex-shrink-0">{sk.value}%</span>
                      </div>
                      <div className="w-full bg-[#D9D9D9] h-[10px] rounded-full overflow-hidden">
                        <div 
                          className="bg-[#F45EE4] h-full rounded-full transition-all duration-500" 
                          style={{ width: `${sk.value}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {previewCareer.roadmap?.length > 0 && (
              <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
                <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <Layers size={22} className="text-[#890080]" /> Your Learning Roadmap
                </h3>
                <div className="space-y-4">
                  {previewCareer.roadmap.map((st, i) => (
                    <div key={i} className="bg-[#FCF8FE] p-5 rounded-2xl border border-[#FFD2F7] space-y-2">
                      <div className="flex items-center justify-between text-[18px] font-medium text-gray-900 gap-3">
                        <span className="flex items-center gap-2.5 min-w-0 break-words">
                          <span className="w-6 h-6 rounded-full bg-[#890080] text-white flex items-center justify-center text-xs font-bold flex-shrink-0">
                            {i + 1}
                          </span>
                          {st.title}
                        </span>
                        <span className="text-[#890080] bg-[#FFE1FD] px-3 py-1 rounded-full border border-[#F45EE4]/40 text-xs font-medium flex-shrink-0">
                          {st.duration}
                        </span>
                      </div>
                      <p className="text-[#545454] text-[15px] font-normal pl-8 leading-relaxed break-words">{st.desc}</p>
                      {st.tags?.length > 0 && (
                        <div className="flex flex-wrap gap-2 pl-8 pt-1">
                          {st.tags.map((tg, idx) => (
                            <span key={idx} className="text-xs font-medium bg-white text-[#545454] px-2.5 py-1 rounded-lg border border-[#FFD2F7] break-words">
                              {tg}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5 max-w-xl mx-auto">
              <h3 className="text-[22px] font-bold text-gray-900 tracking-tight text-center mb-6">
                Career Outlook
              </h3>
              <div className="space-y-4">
                <div className="bg-[#F0FDF4] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-1">Job Openings</span>
                  <span className="text-[#16A34A] font-bold text-[19px]">{previewCareer.openings}</span>
                </div>
                <div className="bg-[#EFF6FF] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-1">Average Experience</span>
                  <span className="text-[#1D4ED8] font-bold text-[19px]">{previewCareer.experience}</span>
                </div>
                <div className="bg-[#FAF5FF] p-4 rounded-xl">
                  <span className="text-[15px] text-gray-600 font-medium block mb-2">Work Flexibility</span>
                  <div className="flex flex-wrap gap-2">
                    {previewCareer.flexibility?.split(',').map((flex, idx) => (
                      <span key={idx} className="text-[#9333EA] font-bold text-[19px] block">
                        {flex.trim()}{idx < (previewCareer.flexibility.split(',').length - 1) ? ',' : ''}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {previewCareer.courses?.length > 0 && (
              <div className="bg-white p-7 rounded-[25px] prototype-card-border custom-card-shadow space-y-5">
                <h3 className="text-[22px] font-semibold text-gray-900 tracking-tight flex items-center gap-2">
                  <BookOpen size={22} className="text-[#890080]" /> Recommended Courses
                </h3>
                <div className="space-y-3">
                  {previewCareer.courses.map((course, i) => (
                    <div key={i} className="bg-[#FCF8FE] p-4.5 rounded-2xl border border-[#FFD2F7] flex items-center justify-between gap-3">
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
                  ))}
                </div>
              </div>
            )}

            </div>
          </div>
        </div>
      )}
    </div>
  );
}