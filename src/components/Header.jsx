import React from 'react';
import { LayoutDashboard, User, LogOut } from 'lucide-react';

export default function Header({ onNavigate, onLogout }) {
  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div 
          className="flex items-center select-none cursor-pointer" 
          onClick={() => { if(onNavigate) onNavigate('dashboard'); }}
        >
          <img 
            src="/logoo.png" 
            alt="CareerPath AI Logo" 
            className="h-13.5 sm:h-17 w-auto object-contain transition-transform hover:scale-105" 
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => { if(onNavigate) onNavigate('dashboard'); }} 
            className="flex items-center gap-2 bg-[#fdf2ff] text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold border border-[#f5dbfc] cursor-pointer hover:bg-[#f5dbfc] transition-colors"
          >
            <LayoutDashboard size={18} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <div 
            className="flex items-center gap-2 text-gray-700 font-medium text-sm border-l border-r border-gray-200 px-4 cursor-pointer hover:text-[#bd24df] transition-colors" 
            onClick={() => { if(onNavigate) onNavigate('profile'); }}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
              <User size={18} className="text-gray-500" />
            </div>
            <span className="hidden sm:inline">Ahmed!</span>
          </div>
          
          <button 
            onClick={onLogout} 
            className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer"
          >
            <LogOut size={18} />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}