import React, { useState, useEffect } from 'react';
import { X, Trash2, Plus, Check } from 'lucide-react';

const EditQuestion = ({ question, onSave, onCancel }) => {
  const [editFormData, setEditFormData] = useState({ 
    ...question, 
    options: [...question.options] 
  });

  useEffect(() => {
    if (question) {
      setEditFormData({ ...question, options: [...question.options] });
    }
  }, [question]);

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
    onSave({
      ...editFormData,
      options: cleanedOptions.length > 0 ? cleanedOptions : ['Option 1'] 
    });
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 sm:p-6 backdrop-blur-sm animate-in fade-in duration-200 cursor-pointer"
      onClick={onCancel}
    >
      <div 
        className="bg-white rounded-[32px] p-6 sm:p-10 max-w-3xl w-full shadow-[0_20px_50px_rgba(0,0,0,0.15)] border-[1.5px] border-[#FFD2F7] max-h-[90vh] overflow-y-auto modal-scrollbar cursor-default"
        onClick={(e) => e.stopPropagation()}
      >
        
        <div className="flex justify-between items-start mb-8 border-b border-gray-100 pb-6 text-left">
          <div className="space-y-1.5">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">Edit Question</h2>
            <p className="text-[#890080] font-medium text-[16px] sm:text-[17px]">Question # {editFormData.id}</p>
          </div>
          <button 
            type="button"
            onClick={onCancel} 
            className="w-11 h-11 rounded-full border-[#FF34DC] bg-[#FFEDF8] flex items-center justify-center text-[#890080] hover:bg-[#ffdef9] transition-all cursor-pointer shadow-sm flex-shrink-0"
            title="Close"
          >
            <X size={22} strokeWidth={2.5} />
          </button>
        </div>

        <div className="space-y-6 sm:space-y-8">
          <div className="space-y-3">
            <label className="text-base sm:text-lg font-semibold text-gray-800 block">Question Title / Text</label>
            <input 
              type="text" 
              value={editFormData.questionText}
              onChange={(e) => setEditFormData({...editFormData, questionText: e.target.value})}
              className="w-full bg-[#F9F9F9] border border-gray-200 rounded-[18px] px-5 py-4 text-[17px] sm:text-[18px] focus:outline-none focus:border-[#FF34DC] focus:bg-white transition-all text-gray-900 font-medium shadow-sm"
            />
          </div>

          <div className="space-y-4 bg-[#fdfdfd] border border-gray-100 p-6 sm:p-8 rounded-[24px]">
            <label className="text-base sm:text-lg font-semibold text-gray-800 block mb-3">Options Available</label>
            
            {editFormData.options.map((opt, i) => (
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

        <div className="flex justify-end items-center gap-4 pt-8 mt-6 border-t border-gray-100">
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
            className="inline-flex items-center justify-center font-medium text-[17px] sm:text-[18px] px-7 py-3.5 rounded-[16px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-105 hover:shadow-lg active:scale-95 shadow-sm"
          >
            <Check size={24} strokeWidth={2.5} className="mr-2 flex-shrink-0" />
            <span className="leading-none">Save Changes</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditQuestion;