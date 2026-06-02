import React from 'react';
import { LayoutGrid, LogOut } from 'lucide-react';

export default function DashboardHeader({ name, role, onLogout, currentTab, setCurrentTab }) {
  return (
    <header className="w-full bg-white border-b border-gray-100 px-6 py-3.5 flex items-center justify-between sticky top-0 z-50 select-none">
      <div className="flex items-center gap-2">
        <div className="text-[#D946EF] font-bold text-lg flex items-center gap-1.5 font-sans tracking-tight">
          <svg className="w-6 h-6 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M4.5 16.5c-1.5 1.26-2.5 3.19-2.5 5.5h20c0-2.31-1-4.24-2.5-5.5" />
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-3.31 0-6-2.69-6-6s2.69-6 6-6 6 2.69 6 6-2.69 6-6 6z" />
          </svg>
          <span className="text-gray-900 font-extrabold text-base tracking-tight">CareerPath<span className="text-[#D946EF]">AI</span></span>
        </div>
      </div>

      <div className="flex items-center gap-4 sm:gap-6">
        <button 
          onClick={() => setCurrentTab && setCurrentTab('dashboard')}
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border ${
            currentTab === 'dashboard' 
              ? 'bg-[#FDF2F8] text-[#C026D3] border-[#FBCFE8]' 
              : 'bg-transparent text-gray-500 border-transparent hover:text-gray-900'
          }`}
        >
          <LayoutGrid className="w-3.5 h-3.5 text-[#C026D3]" />
          Dashboard
        </button>

        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-[#FFE4E6] border border-pink-100 overflow-hidden flex items-center justify-center text-[10px] shrink-0 font-bold text-pink-700">
            {role === 'admin' ? '👨‍💼' : '🧑‍🎓'}
          </div>
          <span className="text-xs font-semibold text-gray-800 hidden sm:inline">
            {name || (role === 'admin' ? 'Admin!' : 'Ahmed!')}
          </span>
        </div>

        <div className="h-4 w-px bg-gray-200 hidden sm:block"></div>

        <button 
          onClick={onLogout}
          className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-red-600 transition cursor-pointer"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  );
}