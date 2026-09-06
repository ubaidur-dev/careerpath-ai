import React, { useState, useEffect } from 'react';
import { LayoutDashboard, User, LogOut } from 'lucide-react';
import axios from 'axios';

export default function Header({ onNavigate, onLogout, currentView = 'dashboard', userRole }) {
  const [displayName, setDisplayName] = useState('User');
  const [role, setRole] = useState(userRole || 'student');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        let detectedRole = userRole;

        if (storedUser) {
          const userObj = JSON.parse(storedUser);
          if (userObj.role) {
            detectedRole = userObj.role;
            setRole(userObj.role);
          }
          if (userObj.name) {
            setDisplayName(userObj.name.split(' ')[0]); // Get first name
            return;
          }
        }

        if (!detectedRole && userRole) {
          detectedRole = userRole;
        }

        setDisplayName(detectedRole === 'admin' ? 'Admin' : 'Student');

        const token = localStorage.getItem('token');
        if (token) {
          const response = await axios.get('http://127.0.0.1:8000/api/user', {
            headers: { Authorization: `Bearer ${token}` }
          });
          if (response.data && response.data.name) {
            setDisplayName(response.data.name.split(' ')[0]);
          }
          if (response.data && response.data.role) {
            setRole(response.data.role);
          }
        }
      } catch (error) {
        console.error("Error fetching user name in Header:", error);
        setDisplayName(role === 'admin' ? 'Admin' : 'Student');
      }
    };

    fetchUserData();
  }, [userRole]);

  const isProfileOrSettingsActive = currentView === 'profile' || currentView === 'settings' || currentView === 'admin-settings';
  const isDashboardActive = currentView === 'dashboard';

  const handleProfileClick = () => {
    if (!onNavigate) return;
    if (role === 'admin' || userRole === 'admin') {
      onNavigate('settings');
    } else {
      onNavigate('profile');
    }
  };

  const handleDashboardClick = () => {
    if (!onNavigate) return;
    onNavigate('dashboard');
  };

  return (
    <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm w-full font-inter">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          .font-inter {
            font-family: 'Inter', sans-serif;
          }
          .hd-clear-logo {
            image-rendering: -webkit-optimize-contrast;
            image-rendering: auto;
          }
        `}
      </style>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        <div 
          className="flex items-center select-none cursor-pointer my-auto" 
          onClick={handleDashboardClick}
        >
          <img 
            src="/logoo.png" 
            alt="CareerPath AI Logo" 
            className="h-11 xs:h-12 sm:h-16 w-auto object-contain hd-clear-logo" 
          />
        </div>

        <div className="flex items-center gap-2 sm:gap-6 h-full">
          
          <button 
            type="button"
            onClick={handleDashboardClick} 
            className={`flex items-center justify-center gap-2 h-10 w-10 sm:w-auto sm:px-4 rounded-xl text-sm font-semibold border transition-all duration-200 font-inter cursor-pointer flex-shrink-0 ${
              isDashboardActive 
                ? 'bg-[#fdf2ff] text-[#bd24df] border-[#f5dbfc]' 
                : 'bg-transparent text-[#000000] border-transparent hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc]'
            }`}
          >
            <LayoutDashboard 
              size={20} 
              strokeWidth={2.5} 
              className={isDashboardActive ? 'text-[#bd24df]' : 'text-gray-700'} 
            />
            <span className="hidden sm:inline">Dashboard</span>
          </button>
          
          <div 
            onClick={handleProfileClick}
            className={`flex items-center justify-center gap-2 text-sm font-medium border rounded-xl h-10 w-10 sm:w-auto sm:px-4 transition-all duration-200 font-inter cursor-pointer flex-shrink-0 ${
              isProfileOrSettingsActive 
                ? 'bg-[#fdf2ff] text-[#bd24df] border-[#f5dbfc]' 
                : 'bg-transparent text-[#000000] border-transparent hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc]'
            }`}
          >
            <User 
              size={20} 
              strokeWidth={2.5} 
              className={`${isProfileOrSettingsActive ? 'text-[#bd24df]' : 'text-gray-700'} sm:hidden`} 
            />
            <div className="hidden sm:flex w-8 h-8 rounded-full bg-gray-200 items-center justify-center overflow-hidden flex-shrink-0">
              <User size={18} className={isProfileOrSettingsActive ? 'text-[#bd24df]' : 'text-gray-500'} />
            </div>
            <span className="hidden sm:inline">{displayName}!</span>
          </div>
          
          <button 
            type="button"
            onClick={onLogout} 
            className="flex items-center justify-center gap-1.5 text-[#000000] h-10 w-10 sm:w-auto sm:px-4 rounded-xl text-sm font-medium border border-transparent cursor-pointer hover:bg-[#fdf2ff] hover:text-[#bd24df] hover:border-[#f5dbfc] transition-all duration-200 font-inter flex-shrink-0"
          >
            <LogOut 
              size={20} 
              strokeWidth={2.5} 
              className="text-gray-700 hover:text-[#bd24df] transition-colors" 
            />
            <span className="hidden sm:inline">Logout</span>
          </button>

        </div>
      </div>
    </header>
  );
}
