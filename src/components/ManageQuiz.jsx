import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  AlertTriangle
} from 'lucide-react';
import AddNewQuestion from './AddNewQuestion';
import EditQuestion from './EditQuestion';

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
          <p className="text-[#000000] font-light text-[21.3px] mt-[5px] mb-[15px]">
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
              <div className="text-[36px] font-bold text-gray-900 tracking-tight leading-tight">{stat.value}</div>
              <div className="text-[15px] font-normal text-[#545454] mt-[2px]">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="w-full h-auto min-h-[130px] rounded-[25px] bg-white p-6 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] flex flex-wrap items-center gap-4 border border-[#FFD2F7]">
        {[
          { state: selectedCategory, setState: setSelectedCategory, options: dynamicCategories },
          { state: selectedType, setState: setSelectedType, options: ['All Types', 'Multiple Choice'] },
          { state: selectedStatus, setState: setSelectedStatus, options: ['All Status', 'Active', 'Inactive'] },
          { state: selectedWeight, setState: setSelectedWeight, options: ['All Weights', 'High', 'Medium', 'Low'] }
        ].map((filter, idx) => (
          <div key={idx} className="relative w-full sm:w-[214px] h-[57px] text-[20px] font-regular rounded-[15px] flex-shrink-0">
            <select 
              value={filter.state}
              onChange={(e) => filter.setState(e.target.value)}
              className="w-full sm:w-[214px] h-[57px] bg-white border-[1px] border-[#C0C0C0] text-regular text-[20px] font-[20px] rounded-[15px] px-5 pr-10 appearance-none cursor-pointer outline-none hover:border-gray-400 focus:border-[#bd24df] transition-all"
              style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
            >
              {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
            </select>
          </div>
        ))}
      </div>

      <div className="space-y-6">
        {loading ? (
          <div className="bg-white rounded-3xl p-16 text-center text-gray-500 text-lg">Loading questions...</div>
        ) : filteredQuestions.length > 0 ? (
          filteredQuestions.map((q, index) => (
            <div key={q.id} className="w-full h-auto rounded-[25px] bg-white p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] flex flex-col gap-6 relative">
              <div className="flex items-start gap-4">
                <div className="w-[45px] h-[45px] bg-[#FFE1FD] border-[1px] border-[#FF34DC] text-[#890080] font-bold text-[23px] text-xl rounded-[15px] flex items-center justify-center flex-shrink-0">
                  {index + 1}
                </div>
                <h2 className="text-[23px] font-medium text-gray-900 tracking-tight mt-1">{q.question_text || q.questionText}</h2>
              </div>

              <div className="flex flex-wrap gap-3 pl-[62px]">
                <span className="px-5 py-1.5 bg-[#F9F9F9] text-[#B6005B] rounded-full text-[16px] font-regular">{q.type || 'Multiple Choice'}</span>
                <span className="px-5 py-1.5 bg-[#F9F9F9] text-[#890080] rounded-full text-[16px] font-regular">{q.category || 'Technical Skills'}</span>
                <span className={`px-5 py-1.5 rounded-full text-[16px] font-regular ${(q.weight || 'Medium') === 'High' ? 'bg-[#F9F9F9] text-[#D80000]' : 'bg-[#fff7ed] text-[#ea580c]'}`}>
                  Weight: {q.weight || 'Medium'}
                </span>
                <span className={`px-5 py-1.5 rounded-full text-[16px] font-regular ${(q.status || 'Active') === 'Active' ? 'bg-[#F9F9F9] text-[#039527]' : 'bg-[#fff1f2] text-[#e11d48]'}`}>
                  {q.status || 'Active'}
                </span>
              </div>

              <div className="flex flex-col md:flex-row gap-6 items-stretch pl-[62px]">
                <div className="flex-1 bg-[#F9F9F9] rounded-[15px] p-6 border border-gray-100">
                  <div className="text-[16px] font-regular text-[#000000] mb-4">Options:</div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pl-1">
                    {Array.isArray(q.options) && q.options.map((opt, i) => (
                      <div key={i} className="w-auto h-auto text-[14px] font-regular text-[#000000] flex items-center gap-3">
                        <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full flex-shrink-0"></div>
                        {opt}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex items-center gap-4 self-center flex-shrink-0">
                  <button onClick={() => setEditingId(q.id)} className="w-[79px] h-[113px] rounded-full border-[0.7px] border-[#FF34DC] bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-colors cursor-pointer group shadow-sm">
                    <Edit2 size={48} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
                  </button>
                  <button onClick={() => setDeleteConfirmId(q.id)} className="w-[79px] h-[113px] rounded-full border-[0.7px] border-[#FF0000] bg-[#FFEDED] flex items-center justify-center text-[#000000] hover:bg-[#ffe5e5] transition-colors cursor-pointer group shadow-sm">
                    <Trash2 size={48} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
                  </button>
                </div>
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
    </div>
  );
};

export default ManageQuiz;
