import React, { useState } from 'react';

export default function SystemSettings({ onBack }) {
  // --- MASTER STATE FOR ALL EDITABLE FIELDS ---
  const [activeTab, setActiveTab] = useState('General'); // General, Notifications, Security, Appearance

  // 1. General Settings State
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AI Career Advisor',
    adminEmail: 'admin@aicareeradvisor.com',
    supportEmail: 'support@aicareeradvisor.com',
    allowRegistration: true,
    emailVerification: true,
    maintenanceMode: false,
    language: 'English',
    timezone: 'UTC+5 (Pakistan)',
    dateFormat: 'DD/MM/YYYY'
  });

  // 2. Notification Settings State
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyReports: true,
    monthlyStatistics: true,
    securityAlerts: true,
    pushNotifications: false
  });

  // 3. Security Settings State
  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '35',
    minPasswordLength: '8'
  });

  // 4. Appearance Settings State
  const [appearance, setAppearance] = useState({
    theme: 'Light', // Light, Dark, Auto
    primaryColor: '#8405CD',
    secondaryColor: '#FFB8FA'
  });

  // --- HANDLERS FOR REALTIME EDITING ---
  const handleGeneralChange = (key, value) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleNotificationToggle = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handleSaveChanges = () => {
    alert('System Settings Saved Successfully! (Professionally Compiled)');
  };

  return (
    <div className="min-h-screen bg-[#fafbfc] p-6 antialiased" style={{ fontFamily: "'Poppins', sans-serif" }}>
      
      {/* --- TOP BACK NAVIGATION LINK --- */}
      <div className="mb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 font-semibold text-sm text-[#bc29e6] hover:text-[#9c1bc2] transition-colors cursor-pointer"
        >
          <svg className="w-4 h-4 stroke-current" fill="none" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to Admin Dashboard
        </button>
      </div>

      {/* --- HEADER TITLE SECTION --- */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 tracking-tight">System Settings</h1>
        <p className="text-sm font-medium text-gray-400 mt-1">Configure platform settings and preferences</p>
      </div>

      {/* --- MAIN DOUBLE PANEL GRID LAYOUT --- */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* LEFT CONTROL PANEL: TABS NAVIGATION & QUICK SAVE */}
        <div className="lg:col-span-3 space-y-4">
          <div className="bg-white border border-gray-100 rounded-2xl p-3 shadow-[0_2px_12px_rgba(0,0,0,0.03)] space-y-1">
            
            <button
              onClick={() => setActiveTab('General')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'General'
                  ? 'bg-[#fdf2f8] text-[#db2777]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              General
            </button>

            <button
              onClick={() => setActiveTab('Notifications')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'Notifications'
                  ? 'bg-[#fdf2f8] text-[#db2777]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              Notifications
            </button>

            <button
              onClick={() => setActiveTab('Security')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'Security'
                  ? 'bg-[#fdf2f8] text-[#db2777]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              Security
            </button>

            <button
              onClick={() => setActiveTab('Appearance')}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeTab === 'Appearance'
                  ? 'bg-[#fdf2f8] text-[#db2777]'
                  : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
              </svg>
              Appearance
            </button>

          </div>

          <button 
            onClick={handleSaveChanges}
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-[#db2777] hover:bg-[#be185d] text-white font-bold text-sm rounded-xl transition-all cursor-pointer shadow-md hover:shadow-lg"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
            </svg>
            Save Changes
          </button>
        </div>

        {/* RIGHT CONTENT WORKPLACE: DYNAMIC INNER SECTIONS FORM */}
        <div className="lg:col-span-9 bg-white border border-gray-100 rounded-3xl p-6 sm:p-8 shadow-[0_4px_20px_rgba(0,0,0,0.02)]">
          
          {/* ================= TAB 1: GENERAL SETTING COMPONENT ================= */}
          {activeTab === 'General' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <svg className="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">General Setting</h2>
                  <p className="text-xs font-medium text-gray-400 mt-1">Manage basic platform configuration</p>
                </div>
              </div>

              {/* Sub-Section 1: Site Information inputs */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 7v5l3 3" />
                  </svg>
                  Site Information
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700">Site Name</label>
                  <input 
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Admin Email</label>
                    <input 
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Support Email</label>
                    <input 
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-Section 2: Platform Toggles */}
              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Platform Settings
                </div>

                <div className="space-y-3">
                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Allow New Registration</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Enable new users to create accounts</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={generalSettings.allowRegistration}
                      onChange={(e) => handleGeneralChange('allowRegistration', e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-indigo-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Email Verification</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Require email verification for new accounts</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={generalSettings.emailVerification}
                      onChange={(e) => handleGeneralChange('emailVerification', e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-indigo-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Maintenance Mode</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Put the platform in maintenance mode</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={generalSettings.maintenanceMode}
                      onChange={(e) => handleGeneralChange('maintenanceMode', e.target.checked)}
                      className="w-4 h-4 mt-0.5 accent-indigo-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Sub-Section 3: Regional Custom Dropdowns */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="text-sm font-bold text-gray-800">Regional Settings</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Language</label>
                    <select
                      value={generalSettings.language}
                      onChange={(e) => handleGeneralChange('language', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none cursor-pointer text-gray-700"
                    >
                      <option value="English">English</option>
                      <option value="Urdu">Urdu</option>
                      <option value="Spanish">Spanish</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Timezone</label>
                    <select
                      value={generalSettings.timezone}
                      onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none cursor-pointer text-gray-700"
                    >
                      <option value="UTC+5 (Pakistan)">UTC+5 (Pakistan)</option>
                      <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                      <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-1.5 w-full md:w-1/2">
                  <label className="text-xs font-bold text-gray-700">Date Format</label>
                  <select
                    value={generalSettings.dateFormat}
                    onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                    className="w-full bg-white border border-gray-200 focus:border-indigo-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none cursor-pointer text-gray-700"
                  >
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 2: NOTIFICATION SETTING COMPONENT ================= */}
          {activeTab === 'Notifications' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Notification Settings</h2>
                  <p className="text-xs font-medium text-gray-400 mt-1">Manage how you receive notifications</p>
                </div>
              </div>

              {/* Sub-Section 1: Email Triggers */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  Email Notifications
                </div>

                <div className="space-y-3">
                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Email Notifications</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Enable new users to create accounts</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationToggle('emailNotifications')}
                      className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Weekly Reports</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Get weekly activity summaries</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.weeklyReports}
                      onChange={() => handleNotificationToggle('weeklyReports')}
                      className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Monthly Statistics</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Receive monthly platform statistics</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.monthlyStatistics}
                      onChange={() => handleNotificationToggle('monthlyStatistics')}
                      className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              {/* Sub-Section 2: System Direct Signals */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  System Alerts
                </div>

                <div className="space-y-3">
                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Security Alerts</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Get notified of security events</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.securityAlerts}
                      onChange={() => handleNotificationToggle('securityAlerts')}
                      className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                  </label>

                  <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                    <div>
                      <span className="text-sm font-semibold text-gray-800 block">Push Notifications</span>
                      <span className="text-xs text-gray-400 font-medium mt-0.5">Receive browser push notifications</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.pushNotifications}
                      onChange={() => handleNotificationToggle('pushNotifications')}
                      className="w-4 h-4 mt-0.5 accent-blue-600 cursor-pointer"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 3: SECURITY SETTING COMPONENT ================= */}
          {activeTab === 'Security' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Security Settings</h2>
                  <p className="text-xs font-medium text-gray-400 mt-1">Configure security and authentication options</p>
                </div>
              </div>

              {/* Sub-Section 1: Identity Locks */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-bold text-gray-800">
                  <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15 7a2 2 0 012 2v4a2 2 0 01-2 2H5a2 2 0 01-2-2V9a2 2 0 012-2m14 0V5a2 2 0 00-2-2H5a2 2 0 00-2 2v2m14 0h2a2 2 0 012 2v4a2 2 0 01-2 2h-2M5 7h2a2 2 0 002-2V3a2 2 0 012-2h4a2 2 0 012 2v2a2 2 0 002 2h2" />
                  </svg>
                  Authentication
                </div>

                <label className="flex items-start justify-between bg-white border border-gray-100 p-4 rounded-xl cursor-pointer hover:bg-gray-50/50 transition-colors">
                  <div>
                    <span className="text-sm font-semibold text-gray-800 block">Two-Factor Authentication</span>
                    <span className="text-xs text-gray-400 font-medium mt-0.5">Require 2FA for admin accounts</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={security.twoFactorAuth}
                    onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    className="w-4 h-4 mt-0.5 accent-emerald-600 cursor-pointer"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Session Timeout (minutes)</label>
                    <input 
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-emerald-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-700">Min Password Length</label>
                    <input 
                      type="number"
                      value={security.minPasswordLength}
                      onChange={(e) => handleSecurityChange('minPasswordLength', e.target.value)}
                      className="w-full bg-white border border-gray-200 focus:border-emerald-500 text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>

              {/* Sub-Section 2: Policy Directives */}
              <div className="pt-4 border-t border-gray-100 space-y-3">
                <div className="text-sm font-bold text-gray-800">Password Policy</div>
                
                <div className="bg-[#fff5f9] border border-pink-50 p-4 rounded-2xl space-y-2.5 text-xs font-semibold text-gray-700">
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 text-base">✓</span> Minimum 8 characters required
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 text-base">✓</span> Must contain uppercase and lowercase letters
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 text-base">✓</span> Must contain at least one number
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-emerald-600 text-base">✓</span> Must contain at least one special character
                  </div>
                </div>
              </div>

            </div>
          )}

          {/* ================= TAB 4: APPEARANCE SETTING COMPONENT ================= */}
          {activeTab === 'Appearance' && (
            <div className="space-y-6">
              <div className="flex items-center gap-2.5 pb-4 border-b border-gray-50">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
                <div>
                  <h2 className="text-lg font-bold text-gray-900 leading-none">Appearance Settings</h2>
                  <p className="text-xs font-medium text-gray-400 mt-1">Customize the look and feel of the platform</p>
                </div>
              </div>

              {/* Sub-Section 1: Theme Blocks Choice */}
              <div className="space-y-4">
                <div className="text-sm font-bold text-gray-800">Theme Preferences</div>
                
                <div className="grid grid-cols-3 gap-3">
                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Light' }))}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      appearance.theme === 'Light'
                        ? 'border-pink-300 bg-white ring-1 ring-pink-300/30 text-pink-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">☀️</span>
                    <span className="text-xs font-bold">Light</span>
                  </button>

                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Dark' }))}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      appearance.theme === 'Dark'
                        ? 'border-pink-300 bg-white ring-1 ring-pink-300/30 text-pink-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">🌙</span>
                    <span className="text-xs font-bold">Dark</span>
                  </button>

                  <button
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Auto' }))}
                    className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all cursor-pointer ${
                      appearance.theme === 'Auto'
                        ? 'border-pink-300 bg-white ring-1 ring-pink-300/30 text-pink-600'
                        : 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <span className="text-xl">🖥️</span>
                    <span className="text-xs font-bold">Auto</span>
                  </button>
                </div>
              </div>

              {/* Sub-Section 2: Color Palette Input Pickers */}
              <div className="pt-4 border-t border-gray-100 space-y-4">
                <div className="text-sm font-bold text-gray-800">Color Palette</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 bg-white border border-gray-100 p-5 rounded-2xl">
                  
                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Primary Color</label>
                    <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl">
                      <input 
                        type="color" 
                        value={appearance.primaryColor}
                        onChange={(e) => setAppearance(prev => ({ ...prev, primaryColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent outline-none shrink-0"
                      />
                      <span className="text-sm font-bold text-gray-700 uppercase">{appearance.primaryColor}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-xs font-bold text-gray-400 uppercase tracking-wider">Secondary Color</label>
                    <div className="flex items-center gap-3 bg-gray-50/50 border border-gray-100 px-3 py-2 rounded-xl">
                      <input 
                        type="color" 
                        value={appearance.secondaryColor}
                        onChange={(e) => setAppearance(prev => ({ ...prev, secondaryColor: e.target.value }))}
                        className="w-8 h-8 rounded-lg cursor-pointer border-0 bg-transparent outline-none shrink-0"
                      />
                      <span className="text-sm font-bold text-gray-700 uppercase">{appearance.secondaryColor}</span>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>

      </div>

    </div>
  );
}