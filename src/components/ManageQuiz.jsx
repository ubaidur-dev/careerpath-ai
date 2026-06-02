import React, { useState } from 'react';

const ManageQuiz = ({ onBack }) => {
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

  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedWeight, setSelectedWeight] = useState('All');
  const [activeFilter, setActiveFilter] = useState('category');
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({});

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
  };

  const handleDelete = (id) => {
    if(window.confirm("Are you sure you want to delete this question?")) {
      setQuestions(questions.filter(q => q.id !== id));
    }
  };

  return (
    <div className="space-y-7 animate-in fade-in duration-500 font-sans text-gray-900 antialiased selection:bg-pink-200">
      
      <button 
        onClick={onBack} 
        className="bg-white hover:bg-gray-50 text-gray-700 font-semibold text-sm px-5 py-2.5 rounded-xl transition-all cursor-pointer border border-gray-200 shadow-3xs"
      >
        ← Back to Dashboard
      </button>

      <div className="space-y-1.5">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-950 tracking-tight">Manage Quiz Questions</h1>
        <p className="text-gray-400 text-xs sm:text-sm font-medium">Create and edit assessment questions</p>
      </div>

      {/* 4 Analytics Counter Grid - Refined Light Gray Shadow Effect */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[
          { label: 'Total Questions', val: '245', icon: '📝' },
          { label: 'Active Questions', val: '238', icon: '🎯' },
          { label: 'Categories', val: '12', icon: '📊' },
          { label: 'Response Rate', val: '94%', icon: '👍' }
        ].map((stat, i) => (
          <div 
            key={i} 
            className="bg-white border border-gray-100 p-5 sm:p-6 rounded-2xl flex items-center gap-4 cursor-pointer transition-all duration-300 hover:scale-[1.01]"
            style={{ boxShadow: '0 10px 20px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.03)' }}
          >
            <span className="text-3xl filter drop-shadow-xs select-none">{stat.icon}</span>
            <div>
              <div className="text-2xl font-bold text-gray-950 leading-none">{stat.val}</div>
              <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mt-2">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Control Filter Toolbar Panel - Refined Light Gray Shadow Effect */}
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
              className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
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
              className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
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
              className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
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
              className={`w-full sm:w-auto bg-white border text-gray-800 text-sm font-medium rounded-xl px-4 py-2.5 pr-8 appearance-none cursor-pointer outline-none transition-all ${
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

      {/* Main Database Render Pipeline */}
      <div className="space-y-5">
        {filteredQuestions.length > 0 ? (
          filteredQuestions.map((q) => (
            <div key={q.id} className="bg-white border border-gray-100 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row justify-between gap-5 hover:shadow-sm transition-all duration-200">
              <div className="flex-1 space-y-4">
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
                    <h2 className="text-base sm:text-lg font-semibold text-gray-900 pt-1 leading-snug tracking-tight">{q.questionText}</h2>
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
                            <div key={i} className="text-sm font-medium text-gray-600 flex items-center gap-2">
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

              <div className="flex md:flex-col items-center justify-end gap-3 self-center pl-12.5 md:pl-0">
                {editingId === q.id ? (
                  <button onClick={() => handleSave(q.id)} className="bg-[#bd24df] text-white font-bold text-sm px-5 py-2.5 rounded-xl shadow-sm hover:bg-[#a61fc4] transition-colors cursor-pointer">Save</button>
                ) : (
                  <button onClick={() => handleEdit(q)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-pink-50 hover:text-[#bd24df] hover:border-[#bd24df]/40 transition-all cursor-pointer">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                  </button>
                )}
                <button onClick={() => handleDelete(q.id)} className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-red-50 hover:text-red-600 hover:border-red-200/60 transition-all cursor-pointer">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.2" viewBox="0 0 24 24"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
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
  );
};

export default ManageQuiz;