import React, { useState } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';
import Dropdown from './Dropdown';

const AddNewQuestion = ({ onSave, onCancel }) => {
  const [newQuestionText, setNewQuestionText] = useState('');
  const [categories, setCategories] = useState(['Technical Skills', 'Work Style', 'Interests']);
  const [newCategory, setNewCategory] = useState('Technical Skills');
  const [isCustomCategory, setIsCustomCategory] = useState(false);
  const [customCategoryInput, setCustomCategoryInput] = useState('');
  const [newWeight, setNewWeight] = useState('Medium');
  const [newStatus, setNewStatus] = useState('Active');
  const [options, setOptions] = useState(['', '']);

  const handleCategorySelectChange = (e) => {
    const val = e.target.value;
    if (val === '__ADD_NEW__') {
      setIsCustomCategory(true);
      setCustomCategoryInput('');
    } else {
      setIsCustomCategory(false);
      setNewCategory(val);
    }
  };

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index] = value;
    setOptions(newOptions);
  };

  const handleRemoveOption = (index) => {
    const newOptions = options.filter((_, i) => i !== index);
    setOptions(newOptions);
  };

  const handleAddOption = () => {
    setOptions([...options, '']);
  };

  const handleSave = () => {
    if (!newQuestionText.trim()) return;

    const finalCategory = isCustomCategory 
      ? (customCategoryInput.trim() || 'General')
      : newCategory;

    const cleanedOptions = options.map(o => o.trim()).filter(Boolean);
    
    onSave({
      questionText: newQuestionText.trim(),
      type: 'Multiple Choice',
      category: finalCategory,
      weight: newWeight,
      status: newStatus,
      options: cleanedOptions.length > 0 ? cleanedOptions : ['Option 1'],
      correct_answer: cleanedOptions[0] || 'Option 1'
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onCancel}
    >
      <div
        className="bg-white rounded-[32px] max-w-3xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[1.5px] border-[#FFD2F7] max-h-[90vh] flex flex-col cursor-default"
        onClick={(e) => e.stopPropagation()}
      >

        <div className="flex justify-between items-start p-6 sm:p-10 pb-6 border-b border-gray-100 text-left flex-shrink-0">
          <div className="space-y-1">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Add New Question
            </h2>
            <p className="text-[#890080] font-medium text-[15px] sm:text-[16px]">
              Create a new career indicator
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            className="w-11 h-11 rounded-full border-[0.7px] border-[#FF34DC] bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="Close"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="overflow-y-auto modal-scrollbar px-6 sm:px-10 py-6 sm:py-8 space-y-6 sm:space-y-8">

          <div className="space-y-3">
            <label className="text-base sm:text-lg font-semibold text-gray-800 block">Question Title / Text</label>
            <input 
              type="text" 
              required
              value={newQuestionText}
              onChange={(e) => setNewQuestionText(e.target.value)}
              placeholder="e.g. Do you enjoy working in fast-paced corporate environments?"
              className="w-full bg-[#F9F9F9] border border-gray-200 rounded-[18px] px-5 py-4 text-[17px] sm:text-[18px] focus:outline-none focus:border-[#FF34DC] focus:bg-white transition-all text-gray-900 font-medium shadow-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <label className="text-base sm:text-lg font-semibold text-gray-800 block">Category Type</label>
                {isCustomCategory && (
                  <button
                    type="button"
                    onClick={() => setIsCustomCategory(false)}
                    className="text-xs font-semibold text-[#890080] hover:underline cursor-pointer"
                  >
                    ← Choose Existing
                  </button>
                )}
              </div>

              {isCustomCategory ? (
                <input
                  type="text"
                  value={customCategoryInput}
                  onChange={(e) => setCustomCategoryInput(e.target.value)}
                  placeholder="Enter new category name..."
                  className="w-full bg-[#F9F9F9] border border-[#FF34DC] rounded-[18px] px-5 py-4 text-[17px] sm:text-[18px] focus:outline-none focus:bg-white transition-all text-gray-900 font-medium shadow-sm"
                  autoFocus
                />
              ) : (
                <Dropdown
                  variant="form"
                  value={newCategory}
                  onChange={(v) => handleCategorySelectChange({ target: { value: v } })}
                  options={[
                    ...categories.map((cat) => ({ value: cat, label: cat })),
                    { value: '__ADD_NEW__', label: '+ Add Custom Category...' },
                  ]}
                  ariaLabel="Question category"
                />
              )}
            </div>

            <div className="space-y-3">
              <label className="text-base sm:text-lg font-semibold text-gray-800 block">Evaluation Weight</label>
              <Dropdown
                variant="form"
                value={newWeight}
                onChange={setNewWeight}
                options={['High', 'Medium', 'Low']}
                ariaLabel="Evaluation weight"
              />
            </div>
          </div>

          {/* Status Toggle Section */}
          <div className="flex items-center justify-between bg-[#F9F9F9] border border-gray-200 rounded-[18px] px-5 py-4">
            <div>
              <label className="text-base sm:text-lg font-semibold text-gray-800 block">Question Status</label>
              <p className="text-sm text-gray-500">Enable or disable this question for student assessments</p>
            </div>
            <button
              type="button"
              onClick={() => setNewStatus(newStatus === 'Active' ? 'Inactive' : 'Active')}
              className={`relative inline-flex h-8 w-14 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none ${newStatus === 'Active' ? 'bg-[#890080]' : 'bg-gray-300'}`}
            >
              <span className={`pointer-events-none inline-block h-7 w-7 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${newStatus === 'Active' ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
          </div>

          <div className="space-y-4 bg-[#fdfdfd] border border-gray-100 p-6 sm:p-8 rounded-[24px]">
            <label className="text-base sm:text-lg font-semibold text-gray-800 block mb-3">Add Options</label>
            
            {options.map((opt, i) => (
              <div key={i} className="flex items-center gap-3.5">
                <div className="w-[35px] flex justify-center text-gray-500 font-bold text-base">
                  {i + 1}.
                </div>
                <input 
                  type="text"
                  value={opt}
                  onChange={(e) => handleOptionChange(i, e.target.value)}
                  placeholder={`Option ${i + 1}`}
                  className="flex-1 bg-white border border-gray-200 rounded-[14px] px-4.5 py-3.5 text-[16px] sm:text-[17px] focus:outline-none focus:border-[#FF34DC] transition-all text-gray-900 shadow-sm"
                />
                <button 
                  type="button"
                  onClick={() => handleRemoveOption(i)} 
                  title="Remove Option"
                  className="w-12 h-12 rounded-[14px] border border-red-200 bg-red-50 text-red-500 flex items-center justify-center hover:bg-red-500 hover:text-white transition-colors cursor-pointer flex-shrink-0 group shadow-sm"
                >
                  <Trash2 size={22} className="group-hover:scale-110 transition-transform" />
                </button>
              </div>
            ))}

            <div className="pl-[46px] pt-4">
              <button 
                type="button"
                onClick={handleAddOption}
                style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
                className="inline-flex items-center justify-center font-medium text-[16px] px-5 py-2.5 rounded-[14px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm"
              >
                <Plus size={20} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
                <span className="leading-none">Add New Option</span>
              </button>
            </div>
          </div>
        </div>

        <div className="flex justify-end items-center gap-4 p-6 sm:p-10 pt-6 border-t border-gray-100 flex-shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-7 py-3.5 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-[16px] transition-colors cursor-pointer text-[17px] sm:text-[18px]"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className={`inline-flex items-center justify-center font-medium text-[17px] sm:text-[18px] px-7 py-3.5 rounded-[16px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm ${!newQuestionText.trim() ? 'opacity-50 cursor-not-allowed hover:scale-100 hover:shadow-sm' : ''}`}
            disabled={!newQuestionText.trim()}
          >
            <Check size={24} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
            <span className="leading-none">Save Question</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddNewQuestion;
