import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  AlertTriangle
} from 'lucide-react';

const ManageQuiz = ({ onNavigate, onLogout, initialView = 'list' }) => {
  const [questions, setQuestions] = useState([
    {
      id: 1,
      questionText: 'Do you enjoy programming or working with code?',
      type: 'Multiple Choice',
      category: 'Technical Skills',
      weight: 'High',
      status: 'Active',
      options: ['Yes, I love it!', 'Somewhat', 'Not really', 'No preference']
    },
    {
      id: 2,
      questionText: 'Do you prefer working with people or working independently?',
      type: 'Multiple Choice',
      category: 'Work Style',
      weight: 'Medium',
      status: 'Active',
      options: ['With people', 'Independently', 'Hybrid approach', 'It depends']
    },
    {
      id: 3,
      questionText: 'Are you more interested in creative work or analytical tasks?',
      type: 'Multiple Choice',
      category: 'Interests',
      weight: 'High',
      status: 'Active',
      options: ['Creative work', 'Analytical tasks', 'Both equally', 'Neither specifically']
    },
    {
      id: 4,
      questionText: 'How comfortable are you with math and statistics?',
      type: 'Multiple Choice',
      category: 'Technical Skills',
      weight: 'Medium',
      status: 'Active',
      options: ['Very comfortable', 'Somewhat comfortable', 'Not comfortable', 'Willing to learn']
    },
    {
      id: 5,
      questionText: 'Do you enjoy solving complex problems and puzzles?',
      type: 'Multiple Choice',
      category: 'Work Style',
      weight: 'Medium',
      status: 'Active',
      options: ['Absolutely!', 'Yes', 'Sometimes', 'Not particularly']
    },
    {
      id: 6,
      questionText: 'On a scale of 1-10, how important is work-life balance to you?',
      type: 'Multiple Choice',
      category: 'Interests',
      weight: 'High',
      status: 'Active',
      options: ['Absolutely!', 'Yes', 'Sometimes', 'Not particularly']
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(initialView === 'add');
  
  useEffect(() => {
    setShowAddForm(initialView === 'add');
  }, [initialView]);

  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedType, setSelectedType] = useState('All Types');
  const [selectedStatus, setSelectedStatus] = useState('All Status');
  const [selectedWeight, setSelectedWeight] = useState('All Weights');
  
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ options: [] });

  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('Technical Skills');
  const [newWeight, setNewWeight] = useState('Medium');
  const [newOptionsString, setNewOptionsString] = useState('');

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'All Categories' || q.category === selectedCategory;
    const matchType = selectedType === 'All Types' || q.type === selectedType;
    const matchStatus = selectedStatus === 'All Status' || q.status === selectedStatus;
    const matchWeight = selectedWeight === 'All Weights' || q.weight === selectedWeight;
    return matchCategory && matchType && matchStatus && matchWeight;
  });

  const handleEdit = (q) => {
    setEditingId(q.id);
    setEditFormData({ ...q, options: [...q.options] });
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...editFormData.options];
    newOptions[index] = value;
    setEditFormData({ ...editFormData, options: newOptions });
  };

  const handleRemoveOption = (index) => {
    const newOptions = editFormData.options.filter((_, i) => i !== index);
    setEditFormData({ ...editFormData, options: newOptions });
  };

  const handleAddOption = () => {
    setEditFormData({ ...editFormData, options: [...editFormData.options, ''] });
  };

  const handleSave = () => {
    const cleanedOptions = editFormData.options.map(o => o.trim()).filter(Boolean);
    
    setQuestions(questions.map(q => q.id === editingId ? {
      ...editFormData,
      options: cleanedOptions.length > 0 ? cleanedOptions : ['Option 1'] 
    } : q));
    
    setEditingId(null);
    triggerToast("Question details successfully updated!");
  };

  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const parsedOptions = newOptionsString
      ? newOptionsString.split(',').map(o => o.trim()).filter(Boolean)
      : ['Yes, absolutely!', 'Somewhat', 'No, not really', 'No preference'];

    const nextId = questions.length > 0 ? Math.max(...questions.map(q => q.id)) + 1 : 1;

    const newQuestionObj = {
      id: nextId,
      questionText: newQuestionText.trim(),
      type: 'Multiple Choice',
      category: newCategory,
      weight: newWeight,
      status: 'Active',
      options: parsedOptions
    };

    setQuestions([...questions, newQuestionObj]);
    
    setNewQuestionText('');
    setNewOptionsString('');
    setNewCategory('Technical Skills');
    setNewWeight('Medium');
    
    setShowAddForm(false);
    triggerToast("New career question successfully saved!");
  };

  const triggerDeleteConfirm = (id) => {
    setDeleteConfirmId(id);
  };

  const executeDelete = () => {
    if (deleteConfirmId !== null) {
      setQuestions(questions.filter(q => q.id !== deleteConfirmId));
      setDeleteConfirmId(null);
      triggerToast("Question has been successfully deleted.");
    }
  };

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
          /* Custom scrollbar for modal */
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
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[24px] p-8 max-w-sm w-full shadow-2xl space-y-6 text-center border border-[#FFD2F7]">
            <div className="w-16 h-16 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle size={32} strokeWidth={2} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-900">Delete Question?</h3>
              <p className="text-sm font-medium text-gray-500 leading-relaxed">
                Are you sure you want to delete question #{deleteConfirmId}? This cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirmId(null)} className="flex-1 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-sm rounded-xl transition-colors cursor-pointer">Cancel</button>
              <button onClick={executeDelete} className="flex-1 py-3.5 bg-red-500 hover:bg-red-600 text-white font-semibold text-sm rounded-xl transition-colors shadow-sm cursor-pointer">Delete</button>
            </div>
          </div>
        </div>
      )}

      {editingId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-[32px] p-8 max-w-2xl w-full shadow-[0_10px_40px_-10px_rgba(0,0,0,0.2)] border-[1.5px] border-[#FFD2F7] max-h-[90vh] overflow-y-auto modal-scrollbar">
            
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-[#FFE1FD] text-[#890080] border border-[#FF34DC] flex items-center justify-center shadow-sm">
                  <Edit2 size={22} strokeWidth={2.5} />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">Edit Question</h2>
                  <p className="text-sm text-[#890080] font-medium">Question #{editFormData.id}</p>
                </div>
              </div>
              <button onClick={() => setEditingId(null)} className="w-10 h-10 rounded-full bg-gray-50 hover:bg-gray-100 flex items-center justify-center text-gray-500 transition-colors cursor-pointer">
                <X size={20} strokeWidth={2.5} />
              </button>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Question Title / Text</label>
                <input 
                  type="text" 
                  value={editFormData.questionText}
                  onChange={(e) => setEditFormData({...editFormData, questionText: e.target.value})}
                  className="w-full bg-[#F9F9F9] border border-gray-200 rounded-[15px] px-5 py-4 text-[16px] focus:outline-none focus:border-[#FF34DC] focus:bg-white transition-all text-gray-800 font-medium"
                />
              </div>

              <div className="space-y-3 bg-[#fdfdfd] border border-gray-100 p-6 rounded-[20px]">
                <label className="text-sm font-semibold text-gray-700 block mb-2">Options Available</label>
                
                {editFormData.options.map((opt, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <div className="w-[30px] flex justify-center text-gray-400 font-bold text-sm">
                      {i + 1}.
                    </div>
                    <input 
                      type="text"
                      value={opt}
                      onChange={(e) => handleOptionChange(i, e.target.value)}
                      placeholder={`Option ${i + 1}`}
                      className="flex-1 bg-white border border-gray-200 rounded-[12px] px-4 py-3 text-[15px] focus:outline-none focus:border-[#FF34DC] transition-all text-gray-800"
                    />
                    <button 
                      onClick={() => handleRemoveOption(i)} 
                      title="Remove Option"
                      className="w-11 h-11 rounded-[12px] border border-red-200 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex-shrink-0 group"
                    >
                      <Trash2 size={20} className="group-hover:scale-110 transition-transform" />
                    </button>
                  </div>
                ))}

                <div className="pl-[42px] pt-2">
                  <button 
                    onClick={handleAddOption}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-[#FFD2F7] bg-[#FFE1FD] text-[#890080] font-semibold text-sm hover:bg-[#FF34DC] hover:text-white transition-colors cursor-pointer"
                  >
                    <Plus size={16} strokeWidth={3} /> Add New Option
                  </button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-8 mt-4 border-t border-gray-100">
              <button 
                onClick={() => setEditingId(null)} 
                className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-[15px] transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave}
                className="px-8 py-3.5 bg-[#bd24df] hover:bg-[#890080] text-white font-semibold rounded-[15px] shadow-[0px_4px_10px_rgba(189,36,223,0.3)] transition-all cursor-pointer flex items-center gap-2"
              >
                <Check size={18} strokeWidth={3} /> Save Changes
              </button>
            </div>
          </div>
        </div>
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
          onClick={() => setShowAddForm(!showAddForm)}
          style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
          className="inline-flex items-center justify-center font-medium text-[22px] px-6 py-3 rounded-[15px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm max-w-xs sm:max-w-none text-center sm:self-center"
        >
          {showAddForm ? (
            <X size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
          ) : (
            <Plus size={26} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
          )}
          <span className="leading-none">{showAddForm ? 'Cancel' : 'Add New Question'}</span>
        </button>
      </div>

      {showAddForm ? (
        <div className="bg-white rounded-[32px] p-8 sm:p-10 space-y-8 shadow-[0_4px_24px_-6px_rgba(0,0,0,0.06)] border border-gray-100/50 max-w-4xl mx-auto">
          <div className="flex items-center gap-4 pb-6 border-b border-gray-100">
            <div className="w-12 h-12 rounded-full bg-pink-50 flex items-center justify-center">
              <Sparkles size={24} className="text-[#bd24df]" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-black">Add Assessment Question</h2>
              <p className="text-sm text-gray-500 mt-1">Define new career indicators for evaluation</p>
            </div>
          </div>

          <form onSubmit={handleAddQuestionSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Question Title / Text</label>
                <input type="text" required value={newQuestionText} onChange={(e) => setNewQuestionText(e.target.value)} placeholder="e.g. Do you enjoy working in fast-paced corporate environments?" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all text-gray-800" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Category Type</label>
                <select value={newCategory} onChange={(e) => setNewCategory(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all">
                  <option value="Technical Skills">Technical Skills</option>
                  <option value="Work Style">Work Style</option>
                  <option value="Interests">Interests</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-700 block">Evaluation Weight</label>
                <select value={newWeight} onChange={(e) => setNewWeight(e.target.value)} className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all">
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                </select>
              </div>
              <div className="space-y-2 md:col-span-2">
                <label className="text-sm font-semibold text-gray-700 block">Options (Comma Separated)</label>
                <input type="text" required value={newOptionsString} onChange={(e) => setNewOptionsString(e.target.value)} placeholder="Option 1, Option 2, Option 3" className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-5 py-4 text-base focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all text-gray-800" />
              </div>
            </div>
            <div className="flex justify-end gap-4 pt-6 border-t border-gray-100">
              <button type="button" onClick={() => setShowAddForm(false)} className="px-8 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-full transition cursor-pointer">Cancel</button>
              <button type="submit" className="px-8 py-3.5 bg-[#bd24df] hover:bg-[#a61fc4] text-white font-semibold rounded-full shadow-md transition cursor-pointer">Save Question</button>
            </div>
          </form>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 justify-items-center">
            {[
              { id: 1, label: 'Total Questions', value: questions.length, emoji: '📝', trend: '+12%' },
              { id: 2, label: 'Active Questions', value: questions.filter(q => q.status === 'Active').length, emoji: '⚡', trend: '+5%' },
              { id: 3, label: 'Categories', value: new Set(questions.map(q => q.category)).size, emoji: '🗂️', trend: '+18%' },
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

          <div className="w-full h-[130px] rounded-[25px] bg-white p-6 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] flex flex-wrap items-center gap-4 border border-[#FFD2F7]">
            {[
              { state: selectedCategory, setState: setSelectedCategory, options: ['All Categories', 'Technical Skills', 'Work Style', 'Interests'] },
              { state: selectedType, setState: setSelectedType, options: ['All Types', 'Multiple Choice'] },
              { state: selectedStatus, setState: setSelectedStatus, options: ['All Status', 'Active'] },
              { state: selectedWeight, setState: setSelectedWeight, options: ['All Weights', 'High', 'Medium'] }
            ].map((filter, idx) => (
              <div key={idx} className="relative w-full sm:w-[214px] h-[57px] text-[20px] font-regular rounded-[15px] flex-shrink-0">
                <select 
                  value={filter.state}
                  onChange={(e) => filter.setState(e.target.value)}
                  className="w-[214px] h-[57px] bg-white border-[1px] border-[#C0C0C0] text-regular text-[20px] font-[20px] rounded-[15px] px-5 pr-10 appearance-none cursor-pointer outline-none hover:border-gray-400 focus:border-[#bd24df] transition-all"
                  style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='20' height='20' fill='none' stroke='%236b7280' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 16px center', backgroundRepeat: 'no-repeat' }}
                >
                  {filter.options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
                </select>
              </div>
            ))}
          </div>

          <div className="space-y-6">
            {filteredQuestions.length > 0 ? (
              filteredQuestions.map((q) => (
                <div key={q.id} className="w-full h-auto rounded-[25px] bg-white p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] border border-[#FFD2F7] flex flex-col gap-6 relative">
                  
                  <div className="flex items-start gap-4">
                    <div className="w-[45px] h-[45px] bg-[#FFE1FD] border-[1px] border-[#FF34DC] text-[#890080] font-bold text-[23px] text-xl rounded-[15px] flex items-center justify-center flex-shrink-0">
                      {q.id}
                    </div>
                    <h2 className="text-[23px] font-medium text-gray-900 tracking-tight mt-1">{q.questionText}</h2>
                  </div>

                  <div className="flex flex-wrap gap-3 pl-[62px]">
                    <span className="px-5 py-1.5 bg-[#F9F9F9] text-[#B6005B] rounded-full text-[16px] font-regular">{q.type}</span>
                    <span className="px-5 py-1.5 bg-[#F9F9F9] text-[#890080] rounded-full text-[16px] font-regular">{q.category}</span>
                    <span className={`px-5 py-1.5 rounded-full text-[16px] font-regular ${q.weight === 'High' ? 'bg-[#F9F9F9] text-[#D80000]' : 'bg-[#fff7ed] text-[#ea580c]'}`}>
                      Weight: {q.weight}
                    </span>
                    <span className="px-5 py-1.5 bg-[#F9F9F9] text-[#039527] rounded-full text-[16px] font-regular">{q.status}</span>
                  </div>

                  <div className="flex flex-col md:flex-row gap-6 items-stretch pl-[62px]">
                    
                    <div className="flex-1 bg-[#F9F9F9] rounded-[15px] p-6 border border-gray-100">
                      <div className="text-[16px] font-regular text-[#000000] mb-4">Options:</div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8 gap-y-3 pl-1">
                        {q.options.map((opt, i) => (
                          <div key={i} className="w-auto h-auto text-[14px] font-regular text-[#000000] flex items-center gap-3">
                            <div className="w-1.5 h-1.5 bg-[#3b82f6] rounded-full flex-shrink-0"></div>
                            {opt}
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 self-center flex-shrink-0">
                      <button onClick={() => handleEdit(q)} className="w-[79px] h-[113px] rounded-full border-[0.7px] border-[#FF34DC] bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-colors cursor-pointer group shadow-sm">
                        <Edit2 size={48} strokeWidth={2.2} className="group-hover:scale-110 transition-transform" />
                      </button>
                      <button onClick={() => triggerDeleteConfirm(q.id)} className="w-[79px] h-[113px] rounded-full border-[0.7px] border-[#FF0000] bg-[#FFEDED] flex items-center justify-center text-[#000000] hover:bg-[#ffe5e5] transition-colors cursor-pointer group shadow-sm">
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
        </>
      )}
    </div>
  );
};

export default ManageQuiz;
