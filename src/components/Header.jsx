import React from 'react';
import { LayoutDashboard, User, LogOut } from 'lucide-react';

export default function Header({ onNavigate, onLogout }) {
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '';
  const isProfileActive = currentPath.includes('profile');
  const isDashboardActive = !isProfileActive; 

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full font-inter">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          
          /* Advanced Multi-Layer HD Scaling to keep small subtext clean and sharp */
          .hd-perfect-logo {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: auto;
            backface-visibility: hidden;
            transform: translateZ(0);
            content-visibility: auto;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div 
          className="flex items-center select-none cursor-pointer" 
          onClick={() => { if(onNavigate) onNavigate('dashboard'); }}
        >
          <img 
            src="/logoo.png" 
            alt="CareerPath AI Logo" 
            className="h-13.5 sm:h-17 w-auto object-contain hd-perfect-logo" 
          />
        </div>

        <div className="flex items-center gap-4 sm:gap-6">
          <button 
            onClick={() => { if(onNavigate) onNavigate('dashboard'); }} 
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold border transition-all duration-200 font-inter cursor-pointer ${
              isDashboardActive 
                ? 'bg-[#fdf2ff] text-[#bd24df] border-[#f5dbfc]' 
                : 'bg-transparent text-[#000000] border-transparent hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc]'
            }`}
          >
            <LayoutDashboard size={18} className={isDashboardActive ? 'text-[#bd24df]' : 'text-gray-500'} />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <div 
            onClick={() => { if(onNavigate) onNavigate('profile'); }}
            className={`flex items-center gap-2 text-sm font-medium border rounded-xl px-4 py-2 transition-all duration-200 font-inter cursor-pointer ${
              isProfileActive 
                ? 'bg-[#fdf2ff] text-[#bd24df] border-[#f5dbfc]' 
                : 'bg-transparent text-[#000000] border-transparent hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc]'
            }`}
          >
            <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden flex-shrink-0">
              <User size={18} className={isProfileActive ? 'text-[#bd24df]' : 'text-gray-500'} />
            </div>
            <span className="hidden sm:inline">Ahmed!</span>
          </div>
          
          <button 
            onClick={onLogout} 
            className="flex items-center gap-1.5 text-[#000000] px-4 py-2 rounded-xl text-sm font-medium border border-transparent cursor-pointer hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc] transition-all duration-200 font-inter"
          >
            <LogOut size={18} className="text-gray-500 hover:text-[#bd24df] transition-colors" />
            <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
