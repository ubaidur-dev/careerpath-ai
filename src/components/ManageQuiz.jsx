import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  X, 
  AlertTriangle,
  HelpCircle,
  BarChart3,
  CheckCircle2,
  Layers,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';

const ManageQuiz = ({ onBack, onNavigate, onLogout, initialView = 'list' }) => {
  // Main Questions State
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
      questionText: 'How comfortable are you with public speaking or presentations?',
      type: 'Multiple Choice',
      category: 'Interests',
      weight: 'Medium',
      status: 'Active',
      options: ['Very comfortable', 'Somewhat comfortable', 'Nervous but can do it', 'Avoid it if possible']
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

  // Show Add Form either as a full page or toggle based on navigation
  const [showAddForm, setShowAddForm] = useState(initialView === 'add');
  
  // Synchronize state if parent changes initialView prop dynamically
  useEffect(() => {
    setShowAddForm(initialView === 'add');
  }, [initialView]);

  // Filters State
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWeight, setSelectedWeight] = useState('All');
  const [activeFilter, setActiveFilter] = useState('category');
  
  // Edit State
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

  // Add New Question Form States
  const [newQuestionText, setNewQuestionText] = useState('');
  const [newCategory, setNewCategory] = useState('Technical Skills');
  const [newWeight, setNewWeight] = useState('Medium');
  const [newOptionsString, setNewOptionsString] = useState('');

  // Custom UI Notifications / Alerts (Safe inside iframes!)
  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Trigger Toast Notification
  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

  const filteredQuestions = questions.filter(q => {
    const matchCategory = selectedCategory === 'All' || q.category === selectedCategory;
    const matchType = selectedType === 'All' || q.type === selectedType;
    const matchStatus = selectedStatus === 'All' || q.status === selectedStatus;
    const matchWeight = selectedWeight === 'All' || q.weight === selectedWeight;
    return matchCategory && matchType && matchStatus && matchWeight;
  });

  const handleEdit = (q) => {
    setEditingId(q.id);
    setEditFormData({ ...q, optionsString: q.options.join(', ') });
  };

  const handleSave = (id) => {
    setQuestions(questions.map(q => q.id === id ? {
      ...editFormData,
      options: editFormData.optionsString ? editFormData.optionsString.split(',').map(o => o.trim()).filter(Boolean) : []
    } : q));
    setEditingId(null);
    triggerToast("Question details successfully updated!");
  };

  // Add Question Core Pipeline
  const handleAddQuestionSubmit = (e) => {
    e.preventDefault();
    if (!newQuestionText.trim()) return;

    const parsedOptions = newOptionsString
      ? newOptionsString.split(',').map(o => o.trim()).filter(Boolean)
      : ['Yes, absolutely!', 'Somewhat', 'No, not really', 'No preference'];

    // Generate continuous next sequential ID logic (Even if middle items deleted, it behaves gracefully)
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
    
    // Reset Form Input states
    setNewQuestionText('');
    setNewOptionsString('');
    setNewCategory('Technical Skills');
    setNewWeight('Medium');
    
    // Automatically close form to show the newly added question in the dashboard list
    setShowAddForm(false);

    triggerToast("New career question successfully saved!");
  };

  // Delete Core Action
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
    <div className="w-full bg-transparent font-poppins text-gray-900 antialiased selection:bg-pink-200 min-h-screen">
      
      {/* Styles to support fonts globally */}
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      {/* SUCCESS TOAST ALERTS */}
      {showToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-950 text-white border border-white/10 px-5 py-3 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-[#bd24df] flex items-center justify-center text-white text-xs">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-semibold tracking-wide">{toastMessage}</span>
        </div>
      )}

      {/* CONFIRMATION DELETE MODAL */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-sm w-full border border-gray-100 shadow-2xl space-y-6 text-center">
            <div className="w-14 h-14 rounded-full bg-red-50 text-red-500 flex items-center justify-center mx-auto border border-red-100">
              <AlertTriangle size={28} />
            </div>
            <div className="space-y-2">
              <h3 className="text-xl font-bold text-gray-950">Confirm Deletion</h3>
              <p className="text-sm font-medium text-gray-400 leading-relaxed">
                Are you sure you want to permanently delete question #{deleteConfirmId}? This action cannot be undone.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setDeleteConfirmId(null)} 
                className="flex-1 py-3 bg-gray-100 hover:bg-gray-200/70 text-gray-700 font-bold text-sm rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={executeDelete} 
                className="flex-1 py-3 bg-red-500 hover:bg-red-600 text-white font-bold text-sm rounded-xl transition-colors shadow-sm cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Main Container Wrapper */}
      <div className="max-w-7xl mx-auto py-4 space-y-8 animate-in fade-in duration-500">
        
        {/* Navigation Row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <button 
            onClick={onBack} 
            className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer border border-gray-200 shadow-xs"
          >
            &larr; Back to Dashboard
          </button>

          {/* Dynamic Switcher Button based on active mode */}
          <button 
            onClick={() => setShowAddForm(!showAddForm)}
            className="inline-flex items-center gap-2 bg-[#bd24df] hover:bg-[#a61fc4] text-white font-bold text-sm px-5 py-2.5 rounded-xl transition-all shadow-md hover:scale-[1.01] active:scale-95 cursor-pointer"
          >
            {showAddForm ? <X size={16} /> : <Plus size={16} />}
            {showAddForm ? 'Back to Question List' : 'Add New Question'}
          </button>
        </div>

        {}
        {showAddForm ? (
          /* DEDICATED HIGHLY ATTRACTIVE FOCUSED ADD QUESTION INTERFACE */
          <div 
            className="bg-white border border-purple-100 rounded-3xl p-6 sm:p-10 space-y-8 text-left animate-in slide-in-from-top duration-300 max-w-3xl mx-auto"
            style={{ boxShadow: '0 20px 45px -8px rgba(189, 36, 223, 0.08)' }}
          >
            <div className="flex items-center gap-3 pb-5 border-b border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#fff0fa] flex items-center justify-center border border-[#fcdbf3]/50">
                <Sparkles size={20} className="text-[#bd24df]" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-950">Add Assessment Question</h2>
                <p className="text-xs font-semibold text-gray-400 mt-0.5">Define new career indicators for evaluation</p>
              </div>
            </div>

            <form onSubmit={handleAddQuestionSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Question Input */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Question Title / Text</label>
                  <input 
                    type="text" 
                    required 
                    value={newQuestionText}
                    onChange={(e) => setNewQuestionText(e.target.value)}
                    placeholder="e.g. Do you enjoy working in fast-paced corporate environments?"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#bd24df] focus:bg-white focus:ring-1 focus:ring-purple-200 transition-all text-gray-800"
                  />
                </div>

                {/* Category Selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Category Type</label>
                  <select 
                    value={newCategory}
                    onChange={(e) => setNewCategory(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Work Style">Work Style</option>
                    <option value="Interests">Interests</option>
                  </select>
                </div>

                {/* Weight selection */}
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Evaluation Weight</label>
                  <select 
                    value={newWeight}
                    onChange={(e) => setNewWeight(e.target.value)}
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-semibold text-gray-700 focus:outline-none focus:border-[#bd24df] focus:bg-white transition-all cursor-pointer"
                  >
                    <option value="High">High (Core Weight)</option>
                    <option value="Medium">Medium (Regular Weight)</option>
                  </select>
                </div>

                {/* Options Input */}
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-xs font-bold text-gray-500 uppercase tracking-wider block">Multiple Choice Options (Comma Separated)</label>
                  <input 
                    type="text" 
                    required 
                    value={newOptionsString}
                    onChange={(e) => setNewOptionsString(e.target.value)}
                    placeholder="Yes, Somewhat, No preference, Not really"
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#bd24df] focus:bg-white focus:ring-1 focus:ring-purple-200 transition-all text-gray-800"
                  />
                  <p className="text-[10px] font-bold text-gray-400">Separate multiple options with commas to format individual selection buttons.</p>
                </div>

              </div>

              {/* Form Action Row */}
              <div className="flex justify-end gap-3 pt-6 border-t border-gray-100">
                <button 
                  type="button" 
                  onClick={() => setShowAddForm(false)}
                  className="px-6 py-3 bg-gray-50 hover:bg-gray-100 text-gray-600 font-bold text-xs rounded-xl transition cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="px-6 py-3 bg-[#bd24df] hover:bg-[#a61fc4] text-white font-bold text-xs rounded-xl shadow-md hover:scale-[1.01] active:scale-95 transition cursor-pointer flex items-center gap-1.5"
                >
                  <span>Save Question</span>
                  <Check size={14} strokeWidth={2.5} />
                </button>
              </div>

            </form>
          </div>
        ) : (
          /* MAIN QUESTION LIST & DATABASE WORKSPACE */
          <div className="space-y-8">
            {/* Header Section */}
            <div className="space-y-1 text-left">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Active Assessment Database</h2>
              <p className="text-gray-400 text-xs font-semibold">Monitor, filter, and modify live indicators</p>
            </div>

            {}
            {/* 4 Analytics Counter Grid (Recalculating Live Based on State!) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {[
                { label: 'Total Questions', val: questions.length, icon: <HelpCircle className="text-[#bd24df]" size={24} />, bgColor: 'bg-purple-50' },
                { label: 'Active Questions', val: questions.filter(q => q.status === 'Active').length, icon: <CheckCircle2 className="text-emerald-500" size={24} />, bgColor: 'bg-emerald-50' },
                { label: 'Total Categories', val: new Set(questions.map(q => q.category)).size, icon: <Layers className="text-amber-500" size={24} />, bgColor: 'bg-amber-50' },
                { label: 'Response Rate', val: '94%', icon: <BarChart3 className="text-blue-500" size={24} />, bgColor: 'bg-blue-50' }
              ].map((stat, i) => (
                <div 
                  key={i} 
                  className="bg-white border border-gray-100 p-6 rounded-2xl flex items-center gap-5 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
                  style={{ boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)' }}
                >
                  <div className={`p-3.5 rounded-xl ${stat.bgColor} flex-shrink-0`}>
                    {stat.icon}
                  </div>
                  <div className="text-left">
                    <div className="text-2xl font-bold text-gray-950 leading-none">{stat.val}</div>
                    <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">{stat.label}</div>
                  </div>
                </div>
              ))}
            </div>

            {}
            {/* Control Filter Toolbar Panel */}
            <div 
              className="bg-white border border-gray-100 rounded-2xl p-4 sm:p-5"
              style={{ boxShadow: '0 12px 25px -4px rgba(0, 0, 0, 0.04), 0 8px 12px -6px rgba(0, 0, 0, 0.02)' }}
            >
              <div className="flex flex-wrap items-center gap-3.5">
                <div className="w-full sm:w-auto">
                  <select 
                    value={selectedCategory}
                    onClick={() => setActiveFilter('category')}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                    className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
                      activeFilter === 'category' 
                        ? 'border-[#bd24df] ring-2 ring-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 10px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="All">All Categories</option>
                    <option value="Technical Skills">Technical Skills</option>
                    <option value="Work Style">Work Style</option>
                    <option value="Interests">Interests</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <select 
                    value={selectedType}
                    onClick={() => setActiveFilter('type')}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
                      activeFilter === 'type' 
                        ? 'border-[#bd24df] ring-2 ring-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 10px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="All">All Types</option>
                    <option value="Multiple Choice">Multiple Choice</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <select 
                    value={selectedStatus}
                    onClick={() => setActiveFilter('status')}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                    className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
                      activeFilter === 'status' 
                        ? 'border-[#bd24df] ring-2 ring-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 10px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="All">All Status</option>
                    <option value="Active">Active</option>
                  </select>
                </div>

                <div className="w-full sm:w-auto">
                  <select 
                    value={selectedWeight}
                    onClick={() => setActiveFilter('weight')}
                    onChange={(e) => setSelectedWeight(e.target.value)}
                    className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-semibold rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
                      activeFilter === 'weight' 
                        ? 'border-[#bd24df] ring-2 ring-pink-50' 
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{ backgroundImage: `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='24' height='24' fill='none' stroke='%234b5563' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 9l6 6 6-6'/></svg>")`, backgroundPosition: 'right 10px center', backgroundSize: '16px', backgroundRepeat: 'no-repeat' }}
                  >
                    <option value="All">All Weights</option>
                    <option value="High">High</option>
                    <option value="Medium">Medium</option>
                  </select>
                </div>
              </div>
            </div>

            {}
            {/* Main Database Render Pipeline */}
            <div className="space-y-5">
              {filteredQuestions.length > 0 ? (
                filteredQuestions.map((q) => (
                  <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row justify-between gap-5 hover:shadow-sm transition-all duration-200">
                    <div className="flex-1 space-y-4 text-left">
                      <div className="flex items-start gap-3.5">
                        <div className="w-9 h-9 bg-[#fff0fa] text-[#bd24df] font-bold text-sm rounded-xl flex items-center justify-center flex-shrink-0 border border-[#fcdbf3]/30 select-none">
                          {q.id}
                        </div>
                        {editingId === q.id ? (
                          <input 
                            className="w-full text-base font-semibold border-2 border-purple-200 rounded-xl px-4 py-2 focus:border-[#bd24df] outline-none transition-colors"
                            value={editFormData.questionText}
                            onChange={(e) => setEditFormData({...editFormData, questionText: e.target.value})}
                          />
                        ) : (
                          <h2 className="text-base sm:text-lg font-bold text-gray-900 pt-1 leading-snug tracking-tight">{q.questionText}</h2>
                        )}
                      </div>

                      <div className="flex flex-wrap gap-2 pl-12.5">
                        <span className="px-3 py-1 bg-pink-50 text-pink-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-pink-100/40">{q.type}</span>
                        <span className="px-3 py-1 bg-purple-50 text-purple-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-purple-100/40">{q.category}</span>
                        <span className="px-3 py-1 bg-amber-50 text-amber-700 rounded-full text-[10px] font-bold uppercase tracking-wider border border-amber-100/40">Weight: {q.weight}</span>
                        <span className="px-3 py-1 bg-green-50 text-green-600 rounded-full text-[10px] font-bold uppercase tracking-wider border border-green-100/40">{q.status}</span>
                      </div>

                      {editingId === q.id ? (
                        <div className="pl-12.5 pt-1">
                          <label className="text-xs text-gray-400 font-bold uppercase block mb-1">Options (Comma Separated)</label>
                          <input 
                            className="w-full text-sm border-2 border-gray-200 rounded-xl px-4 py-2 focus:border-[#bd24df] outline-none"
                            value={editFormData.optionsString}
                            onChange={(e) => setEditFormData({...editFormData, optionsString: e.target.value})}
                            placeholder="e.g. Option 1, Option 2, Option 3"
                          />
                        </div>
                      ) : (
                        q.options.length > 0 && (
                          <div className="pl-12.5 pt-1">
                            <div className="bg-[#fafbfc] rounded-xl p-4 border border-gray-50">
                              <div className="text-xs font-bold text-gray-400 uppercase tracking-wide mb-2.5">Options:</div>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2">
                                {q.options.map((opt, i) => (
                                  <div key={i} className="text-sm font-semibold text-gray-600 flex items-center gap-2">
                                    <div className="w-1.5 h-1.5 bg-[#bd24df]/60 rounded-full"></div>
                                    {opt}
                                  </div>
                                ))}
                              </div>
                            </div>
                          </div>
                        )
                      )}
                    </div>

                    {/* Action buttons inside list */}
                    <div className="flex md:flex-col items-center justify-end gap-3 self-center pl-12.5 md:pl-0">
                      {editingId === q.id ? (
                        <button onClick={() => handleSave(q.id)} className="bg-[#bd24df] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#a61fc4] transition-colors cursor-pointer">Save</button>
                      ) : (
                        <button onClick={() => handleEdit(q)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-[#bd24df] hover:border-[#bd24df]/40 transition-all cursor-pointer">
                          <Edit2 size={16} strokeWidth={2.2} />
                        </button>
                      )}
                      <button onClick={() => triggerDeleteConfirm(q.id)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200/60 transition-all cursor-pointer">
                        <Trash2 size={16} strokeWidth={2.2} />
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                /* Enterprise Level Pure English Fallback State Layout */
                <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-3xs">
                  <div className="text-4xl mb-3 select-none">🔍</div>
                  <h3 className="text-base font-semibold text-gray-800">No questions found matching the filter</h3>
                  <p className="text-gray-400 text-xs mt-1">Please adjust your criteria and try filters again.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageQuiz;