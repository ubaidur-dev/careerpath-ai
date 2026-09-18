import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Plus,
  Trash2,
  Edit2,
  Check,
  AlertTriangle,
  Layers,
  Tag,
  Gauge,
  Filter,
  RotateCcw
} from 'lucide-react';
import AddNewQuestion from './AddNewQuestion';
import EditQuestion from './EditQuestion';
import Dropdown from './Dropdown';

const API_BASE_URL = 'http://localhost:8000/api';

const ManageQuiz = ({ onNavigate, onLogout, initialView = 'list' }) => {
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddForm, setShowAddForm] = useState(initialView === 'add');
  
  useEffect(() => {
    setShowAddForm(initialView === 'add');
  }, [initialView]);

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedWeight, setSelectedWeight] = useState('All Weights');

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 7;

  const [editingId, setEditingId] = useState(null);

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const fetchQuestions = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/admin/questions`);
      setQuestions(response.data || []);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching questions:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
    const interval = setInterval(fetchQuestions, 5000);
    return () => clearInterval(interval);
  }, []);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };
  const dynamicCategories = ['All Categories', ...Array.from(new Set(questions.map(q => q.category).filter(Boolean)))];

  const filteredQuestions = questions.filter(q => {
    const qCategory = q.category || 'General';
    const qType = q.type || 'Multiple Choice';
    const qStatus = q.status || 'Active';
    const qWeight = q.weight || 'Medium';

    const matchCategory = selectedCategory === 'All Categories' || qCategory === selectedCategory;
    const matchType = selectedType === 'All Types' || qType === selectedType;
    const matchStatus = selectedStatus === 'All Status' || qStatus === selectedStatus;
    const matchWeight = selectedWeight === 'All Weights' || qWeight === selectedWeight;
    
    return matchCategory && matchType && matchStatus && matchWeight;
  });

  const hasActiveFilter = selectedCategory !== 'All Categories'
    || selectedType !== 'All Types'
    || selectedStatus !== 'All Status'
    || selectedWeight !== 'All Weights';

  const handleResetFilters = () => {
    setSelectedCategory('All Categories');
    setSelectedType('All Types');
    setSelectedStatus('All Status');
    setSelectedWeight('All Weights');
    setCurrentPage(1);
  };

  const totalPages = Math.ceil(filteredQuestions.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredQuestions.length);
  const paginatedQuestions = filteredQuestions.slice(startIndex, endIndex);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSaveEditedQuestion = async (updatedQuestion) => {
    try {
      await axios.put(`${API_BASE_URL}/admin/questions/${editingId}`, updatedQuestion);
      setEditingId(null);
      triggerToast("Question details successfully updated!");
      fetchQuestions();
    } catch (error) {
      console.error("Error updating question:", error);
    }
  };


  const handleSaveNewQuestion = async (newQuestionData) => {
    try {
      await axios.post(`${API_BASE_URL}/admin/questions`, newQuestionData);
      setShowAddForm(false);
      triggerToast("New career question successfully saved!");
      fetchQuestions();
    } catch (error) {
      console.error("Error saving new question:", error);
    }
  };

  const executeDelete = async () => {
    if (deleteConfirmId !== null) {
      try {
        await axios.delete(`${API_BASE_URL}/admin/questions/${deleteConfirmId}`);
        setDeleteConfirmId(null);
        triggerToast("Question has been successfully deleted.");
        fetchQuestions();
      } catch (error) {
        console.error("Error deleting question:", error);
      }
    }
  };
  const totalQuestions = questions.length;
  const activeQuestionsCount = questions.filter(q => (q.status || 'Active') === 'Active').length;
  const uniqueCategoriesCount = new Set(questions.map(q => q.category).filter(Boolean)).size;

  return (
    <div className="w-full bg-transparent text-gray-900 antialiased space-y-8 pb-10 relative">

      <style>
        {`
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
          .modal-scrollbar::-webkit-scrollbar {
            width: 6px;
          }
          .modal-scrollbar::-webkit-scrollbar-track {
            background: #f8fafc;
            border-radius: 10px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb {
            background: #FFD2F7;
            border-radius: 10px;
          }
          .modal-scrollbar::-webkit-scrollbar-thumb:hover {
            background: #FF34DC;
          }
        `}
      </style>

      {deleteConfirmId !== null && (
        <div className="fixed inset-0 w-screen h-screen z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center border border-[#FFD2F7]">
            <div className="w-16 h-16 rounded-full bg-[#FFEDF8] text-[#890080] flex items-center justify-center mx-auto border border-[#FF34DC]">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Delete Question?</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Are you sure you want to delete this question? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                className="flex-1 py-3.5 font-semibold text-sm rounded-xl transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 custom-quiz-border shadow-sm cursor-pointer inline-flex items-center justify-center gap-2"
              >
                <Trash2 size={16} strokeWidth={2.2} />
                <span>Delete</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {showAddForm && (
        <AddNewQuestion 
          onSave={handleSaveNewQuestion}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingId !== null && (
        <EditQuestion 
          question={questions.find(q => q.id === editingId)}
          existingCategories={dynamicCategories.filter(c => c !== 'All Categories')}
          onSave={handleSaveEditedQuestion}
          onCancel={() => setEditingId(null)}
        />
      )}

      {showToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-[#bd24df] flex items-center justify-center text-white">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2"> 
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
            Manage Quiz Questions
          </h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Manage your AI Career Advisor platform
          </p>
        </div>
        
        <button 
          type="button"
          onClick={() => setShowAddForm(true)}
          style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
          className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center sm:self-center"
        >
          <Plus size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
          <span className="leading-none">Add New Question</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
        {[
          { id: 1, label: 'Total Questions', value: totalQuestions, emoji: '📝', trend: '+12%' },
          { id: 2, label: 'Active Questions', value: activeQuestionsCount, emoji: '⚡', trend: '+5%' },
          { id: 3, label: 'Categories', value: uniqueCategoriesCount, emoji: '🗂️', trend: '+18%' },
          { id: 4, label: 'Response Rate', value: '94%', emoji: '📊', trend: '+8%' },
        ].map((stat) => (
          <div 
            key={stat.id} 
            className="relative bg-white h-[145px] w-full max-w-[303px] px-[25px] rounded-[25px] prototype-card-border shadow-[0px_5px_5px_rgba(0,0,0,0.25)] flex items-center gap-[16px] text-left"
          >
            <div className="absolute top-5 right-5 text-[#05A660] bg-[#E3F6ED] px-2.5 py-1 rounded-md text-xs font-bold tracking-wide">
              {stat.trend}
            </div>
            <div className="text-[45px] select-none flex-shrink-0 filter drop-shadow-sm flex items-center justify-center">
              {stat.emoji}
            </div>
            <div className="flex flex-col justify-center mt-2">
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

      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-6 rounded-[25px] prototype-card-border shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)]">
        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap w-full sm:w-auto sm:flex-1">
          {[
            { label: 'Category', state: selectedCategory, setState: setSelectedCategory, options: dynamicCategories, width: 'sm:w-[200px]' },
            { label: 'Type', state: selectedType, setState: setSelectedType, options: ['All Types', 'Multiple Choice'], width: 'sm:w-[160px]' },
            { label: 'Status', state: selectedStatus, setState: setSelectedStatus, options: ['All Status', 'Active', 'Inactive'], width: 'sm:w-[160px]' },
            { label: 'Weight', state: selectedWeight, setState: setSelectedWeight, options: ['All Weights', 'High', 'Medium', 'Low'], width: 'sm:w-[160px]' }
          ].map((filter, idx) => (
            <Dropdown
              key={idx}
              value={filter.state}
              onChange={(v) => { filter.setState(v); setCurrentPage(1); }}
              options={filter.options}
              ariaLabel={`Filter by ${filter.label}`}
              className={`w-full ${filter.width} flex-shrink-0`}
              triggerClassName="bg-[#FCF8FE] border-[#FFD2F7] rounded-xl px-4 py-3 text-[16px]"
            />
          ))}
          {hasActiveFilter && (
            <button
              type="button"
              onClick={handleResetFilters}
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
            Showing <strong className="text-gray-900 font-semibold">{filteredQuestions.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{filteredQuestions.length}</strong>
          </span>
        </div>
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-gray-500 text-lg">Loading questions...</div>
        ) : filteredQuestions.length > 0 ? (
          paginatedQuestions.map((q, index) => (
            <div
              key={q.id}
              className="bg-white rounded-[25px] prototype-card-border shadow-[0_4px_20px_-4px_rgba(137,0,128,0.12)] p-7 sm:p-9 flex flex-col lg:flex-row lg:items-start justify-between gap-6"
            >
              <div className="space-y-4 flex-1 min-w-0">
                <div className="flex items-start gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#890080] text-white font-bold text-sm flex items-center justify-center flex-shrink-0 shadow-xs mt-0.5">
                    {startIndex + index + 1}
                  </div>
                  <h2 className="text-[22px] font-bold text-gray-900 tracking-tight leading-snug break-words">
                    {q.question_text || q.questionText}
                  </h2>
                </div>

                <div className="flex flex-wrap items-center gap-2.5 pl-0 lg:pl-[52px]">
                  <span className="inline-flex items-center gap-1.5 bg-[#FCF8FE] px-3.5 py-1.5 rounded-xl border border-[#FFD2F7] text-[14px] font-normal text-[#890080]">
                    <Layers size={15} className="text-[#890080]" /> {q.type || 'Multiple Choice'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#FCF8FE] px-3.5 py-1.5 rounded-xl border border-[#FFD2F7] text-[14px] font-normal text-[#890080]">
                    <Tag size={15} className="text-[#890080]" /> {q.category || 'Technical Skills'}
                  </span>
                  <span className="inline-flex items-center gap-1.5 bg-[#FCF8FE] px-3.5 py-1.5 rounded-xl border border-[#FFD2F7] text-[14px] font-normal text-[#890080]">
                    <Gauge size={15} className="text-[#890080]" /> Weight: {q.weight || 'Medium'}
                  </span>
                  <span className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-[14px] font-medium border ${
                    (q.status || 'Active') === 'Active'
                      ? 'bg-[#E3F6ED] border-[#05A660]/30 text-[#05A660]'
                      : 'bg-[#FEF3C7] border-[#F59E0B]/40 text-[#B45309]'
                  }`}>
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${(q.status || 'Active') === 'Active' ? 'bg-[#05A660]' : 'bg-[#F59E0B]'}`}></span>
                    {q.status || 'Active'}
                  </span>
                </div>

                <div className="pl-0 lg:pl-[52px]">
                  <div className="bg-[#FEF7FB] rounded-[15px] p-5 border border-[#FFD2F7]">
                    <div className="text-[13px] font-semibold uppercase tracking-wider text-[#CC0088] mb-3">Options</div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-2.5">
                      {Array.isArray(q.options) && q.options.map((opt, i) => (
                        <div key={i} className="flex items-start gap-2.5 text-[15px] font-normal text-gray-700">
                          <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#F45EE4] flex-shrink-0"></span>
                          <span className="break-words">{opt}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2.5 shrink-0 border-t lg:border-t-0 pt-4 lg:pt-0 border-gray-100 w-full lg:w-auto justify-end">
                <button
                  type="button"
                  onClick={() => setEditingId(q.id)}
                  className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-[#F45EE4]/40 bg-[#FFE1FD] text-[#890080] hover:bg-[#890080] hover:text-white hover:border-[#890080] transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Edit2 size={15} strokeWidth={2.2} className="mr-1.5" /> Edit
                </button>
                <button
                  type="button"
                  onClick={() => setDeleteConfirmId(q.id)}
                  className="inline-flex items-center justify-center font-medium text-sm px-3.5 py-2 rounded-xl border border-rose-200/80 bg-rose-50/70 text-rose-600 hover:bg-rose-600 hover:text-white hover:border-rose-600 transition-all duration-200 cursor-pointer shadow-2xs active:scale-95"
                >
                  <Trash2 size={15} strokeWidth={2.2} className="mr-1.5" /> Delete
                </button>
              </div>
            </div>
          ))
        ) : (
          <div className="bg-white rounded-3xl p-16 text-center shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)]">
            <div className="text-5xl mb-4 select-none">🔍</div>
            <h3 className="text-xl font-bold text-gray-800">No questions found</h3>
            <p className="text-gray-500 mt-2">Adjust your filters to see results.</p>
          </div>
        )}
      </div>

      {!loading && filteredQuestions.length > 0 && (
        <div className="flex justify-center items-center gap-2 pt-2">
          <button
            type="button"
            onClick={() => handlePageChange(activePage - 1)}
            disabled={activePage === 1}
            className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Previous
          </button>

          <div className="flex items-center gap-2 mx-1">
            {[...Array(totalPages)].map((_, index) => {
              const pageNum = index + 1;
              return (
                <button
                  key={pageNum}
                  type="button"
                  onClick={() => handlePageChange(pageNum)}
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
            onClick={() => handlePageChange(activePage + 1)}
            disabled={activePage === totalPages}
            className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default ManageQuiz;
