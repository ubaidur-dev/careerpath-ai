import React, { useState } from 'react';
import { 
  Settings, 
  Bell, 
  KeyRound,
  Shield, 
  Eye, 
  Save, 
  Globe, 
  Database, 
  Mail, 
  Lock, 
  Sun, 
  Moon, 
  Monitor, 
  Check,
  ChevronDown
} from 'lucide-react';

export default function SystemSettings({ onBack }) {
  const [activeTab, setActiveTab] = useState('General'); 

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

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    weeklyReports: true,
    monthlyStatistics: true,
    securityAlerts: true,
    pushNotifications: false
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '35',
    minPasswordLength: '8'
  });

  const [appearance, setAppearance] = useState({
    theme: 'Light', 
    primaryColor: '#8405CD',
    secondaryColor: '#FFB8FA'
  });

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

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
    triggerToast("System Settings saved successfully!");
  };

  return (
    <div className="w-full bg-transparent text-gray-900 antialiased space-y-6 pb-10 relative text-left">
      
      <style>
        {`
          .custom-quiz-border {
            border: 0.7px solid #FF00D3;
          }
          .prototype-card-border {
            border: 0.5px solid #FFD2F7;
          }
        `}
      </style>

      {showToast && (
        <div className="fixed bottom-6 right-6 z-[100] bg-gray-900 text-white px-5 py-3.5 rounded-2xl flex items-center gap-3 shadow-2xl animate-in slide-in-from-bottom duration-300">
          <div className="w-6 h-6 rounded-full bg-[#bd24df] flex items-center justify-center text-white">
            <Check size={14} strokeWidth={3} />
          </div>
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2"> 
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
            System Settings
          </h1>
          <p className="text-[#000000] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Configure platform settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-3 space-y-4">
          <div className="w-[256px] h-[248px] bg-white border border-[#FFD2F7] rounded-[20px] p-3 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-1.5 flex flex-col justify-center">
            
            <button
              type="button"
              onClick={() => setActiveTab('General')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'General'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <Settings size={18} strokeWidth={1.8} className={activeTab === 'General' ? 'text-[#890080]' : 'text-[#000000]'} />
              General
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Notifications')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'Notifications'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <Bell size={18} strokeWidth={1.8} className={activeTab === 'Notifications' ? 'text-[#890080]' : 'text-[#000000]'} />
              Notifications
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Security')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'Security'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <Shield size={18} strokeWidth={1.8} className={activeTab === 'Security' ? 'text-[#890080]' : 'text-[#000000]'} />
              Security
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('Appearance')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'Appearance'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <Eye size={18} strokeWidth={1.8} className={activeTab === 'Appearance' ? 'text-[#890080]' : 'text-[#000000]'} />
              Appearance
            </button>

          </div>

          <button 
            type="button"
            onClick={handleSaveChanges}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className="w-[256px] h[55px] inline-flex items-center justify-center font-semibold text-[18px] px-6 py-3.5 gap-2 rounded-[16px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Save size={18} strokeWidth={2.2} className="mr-2 flex-shrink-0" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="lg:col-span-9 bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] text-left space-y-8">
          
          {activeTab === 'General' && (
            <div className="space-y-7">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="text-[#5B50E5]">
                    <Settings size={23} strokeWidth={1.7} />
                  </div>
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight ml-2">General Setting</h2>
                </div>
                <p className="text-[18px] font-regular text-[#707070]">
                  Manage basic platform configuration
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Globe size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Site Information</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-[17px] font-medium text-[#000000]">Site Name</label>
                  <input 
                    type="text"
                    value={generalSettings.siteName}
                    onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                    className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Admin Email</label>
                    <input 
                      type="email"
                      value={generalSettings.adminEmail}
                      onChange={(e) => handleGeneralChange('adminEmail', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Support Email</label>
                    <input 
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Database size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Platform Settings</span>
                </div>

                <div className="space-y-6">
                  <div 
                    onClick={() => handleGeneralChange('allowRegistration', !generalSettings.allowRegistration)}
                    className="flex items-center h-[62px] justify-between bg-[#F9F9F9] p-4 rounded-[14px] cursor-pointer hover:bg-gray-100/70 transition-colors"
                  >
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Allow New Registration</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.3 block">Enable new users to create accounts</span>
                    </div>
                    <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all ${
                      generalSettings.allowRegistration ? 'bg-[#5B50E5] text-white' : 'border-2 border-gray-300 bg-white'
                    }`}>
                      {generalSettings.allowRegistration && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  <div 
                    onClick={() => handleGeneralChange('emailVerification', !generalSettings.emailVerification)}
                    className="flex items-center h-[62px] justify-between bg-[#F9F9F9] p-4 rounded-[14px] cursor-pointer hover:bg-gray-100/70 transition-colors"
                  >
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Email Verification</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.3 block">Require email verification for new accounts</span>
                    </div>
                    <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all ${
                      generalSettings.emailVerification ? 'bg-[#5B50E5] text-white' : 'border-2 border-gray-300 bg-white'
                    }`}>
                      {generalSettings.emailVerification && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>

                  <div 
                    onClick={() => handleGeneralChange('maintenanceMode', !generalSettings.maintenanceMode)}
                    className="flex items-center h-[62px] justify-between bg-[#F9F9F9] p-3 rounded-[14px] cursor-pointer hover:bg-gray-100/70 transition-colors"
                  >
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Maintenance Mode</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.3 block">Put the platform in maintenance mode</span>
                    </div>
                    <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all ${
                      generalSettings.maintenanceMode ? 'bg-[#5B50E5] text-white' : 'border-2 border-gray-300 bg-white'
                    }`}>
                      {generalSettings.maintenanceMode && <Check size={14} strokeWidth={3} />}
                    </div>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/80 space-y-4">
                <div className="text-[20px] font-semibold text-[#000000]">Regional Settings</div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Language</label>
                    <div className="relative">
                      <select
                        value={generalSettings.language}
                        onChange={(e) => handleGeneralChange('language', e.target.value)}
                        className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[12px] appearance-none cursor-pointer outline-none text-gray-800 pr-10"
                      >
                        <option value="English">English</option>
                        <option value="Urdu">Urdu</option>
                        <option value="Spanish">Spanish</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Timezone</label>
                    <div className="relative">
                      <select
                        value={generalSettings.timezone}
                        onChange={(e) => handleGeneralChange('timezone', e.target.value)}
                        className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[12px] appearance-none cursor-pointer outline-none text-gray-800 pr-10"
                      >
                        <option value="UTC+5 (Pakistan)">UTC+5 (Pakistan)</option>
                        <option value="UTC+0 (GMT)">UTC+0 (GMT)</option>
                        <option value="UTC-5 (EST)">UTC-5 (EST)</option>
                      </select>
                      <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 w-full md:w-1/2 pr-0 md:pr-2">
                  <label className="text-[17px] font-medium text-[#000000]">Date Format</label>
                  <div className="relative">
                    <select
                      value={generalSettings.dateFormat}
                      onChange={(e) => handleGeneralChange('dateFormat', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[12px] appearance-none cursor-pointer outline-none text-gray-800 pr-10"
                    >
                      <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                      <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                      <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                    </select>
                    <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none" />
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Notifications' && (
            <div className="space-y-7">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="text-[#5B50E5]">
                    <Bell size={23} strokeWidth={1.7} />                  
                  </div>
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight ml-2">Notification Settings</h2>
                </div>
                <p className="text-[18px] font-regular text-[#707070]">
                  Manage how you receive notifications
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Mail size={23} strokeWidth={1.7} className="text-[#4F46E5]" />
                  <span>Email Notifications</span>
                </div>

                <div className="space-y-6">
                  <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Email Notifications</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.5 block">Enable new users to create accounts</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.emailNotifications}
                      onChange={() => handleNotificationToggle('emailNotifications')}
                      className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </label>

                  <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Weekly Reports</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.5 block">Get weekly activity summaries</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.weeklyReports}
                      onChange={() => handleNotificationToggle('weeklyReports')}
                      className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </label>

                  <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Monthly Statistics</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.5 block">Receive monthly platform statistics</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.monthlyStatistics}
                      onChange={() => handleNotificationToggle('monthlyStatistics')}
                      className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Shield size={23} strokeWidth={1.7} className="text-[#4F46E5]" />
                  <span>System Alerts</span>
                </div>

                <div className="space-y-6">
                  <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Security Alerts</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.5 block">Get notified of security events</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.securityAlerts}
                      onChange={() => handleNotificationToggle('securityAlerts')}
                      className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </label>

                  <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                    <div>
                      <span className="text-[18px] font-medium text-[#000000] block">Push Notifications</span>
                      <span className="text-[15px] text-[#000000] font-regular mt-0.5 block">Receive browser push notifications</span>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={notifications.pushNotifications}
                      onChange={() => handleNotificationToggle('pushNotifications')}
                      className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                    />
                  </label>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Security' && (
            <div className="space-y-7">
              <div className="space-y-1.5">
                <div className="flex items-center gap-4.5">
                  <div className="text-[#6155F5]">
                    <Shield size={23} strokeWidth={1.7} />
                  </div>
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight">Security Settings</h2>
                </div>
                <p className="text-[18px] font-regular text-[#707070]">
                  Configure security and authentication options
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Lock size={23} strokeWidth={1.7} className="text-[#6155F5]" />
                  <span>Authentication</span>
                </div>

                <label className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors">
                  <div>
                    <span className="text-[18px] font-medium text-[#000000] block">Two-Factor Authentication</span>
                    <span className="text-[15px] text-[#000000] font-regular mt-0.3 block">Require 2FA for admin accounts</span>
                  </div>
                  <input 
                    type="checkbox" 
                    checked={security.twoFactorAuth}
                    onChange={(e) => handleSecurityChange('twoFactorAuth', e.target.checked)}
                    className="w-6 h-6 rounded accent-[#4F46E5] cursor-pointer"
                  />
                </label>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[17px] font-medium text-[#000000]">Session Timeout (minutes)</label>
                    <input 
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#FF34DC] text-[16px] font-normal px-4 py-3 rounded-[14px] outline-none transition-all text-gray-900"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[17px] font-medium text-[#000000]">Min Password Length</label>
                    <input 
                      type="number"
                      value={security.minPasswordLength}
                      onChange={(e) => handleSecurityChange('minPasswordLength', e.target.value)}
                      className="w-full bg-[#FAFAFA] border border-gray-200 focus:border-[#FF34DC] text-[16px] font-normal px-4 py-3 rounded-[14px] outline-none transition-all text-gray-900"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <KeyRound size={23} strokeWidth={1.7} className="text-[#6155F5]" />
                  <span>Password Policy</span>
                </div>
                
                <div className="bg-[#FEF4FF] border border-[#FFC8ED] border-[0.5px] p-6 rounded-[20px] space-y-3">
                  <div className="flex items-center gap-3 text-[16.5px] font-regular text-[#000000]">
                    <Check size={18} className="text-[#890080]" strokeWidth={2.3} />
                    <span>Minimum 8 characters required</span>
                  </div>      
                  <div className="flex items-center gap-3 text-[16.5px] font-regular text-[#000000]">
                    <Check size={18} className="text-[#890080]" strokeWidth={2.3} />
                    <span>Must contain uppercase and lowercase letters</span>
                  </div>
                  <div className="flex items-center gap-3 text-[16.5px] font-regular text-[#000000]">
                    <Check size={18} className="text-[#890080]" strokeWidth={2.3} />
                    <span>Must contain at least one number</span>
                  </div>
                  <div className="flex items-center gap-3 text-[16.5px] font-regular text-[#000000]">
                    <Check size={18} className="text-[#890080]" strokeWidth={2.3} />
                    <span>Must contain at least one special character</span>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'Appearance' && (
            <div className="space-y-7">
              <div className="space-y-1.5">
                <div className="flex items-center gap-4.5">
                  <div className="text-[#5b50e5]">
                    <Eye size={23} strokeWidth={1.7} />
                  </div>
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight">Appearance Settings</h2>
                </div>
                <p className="text-[18px] font-regular text-[#707070]">
                  Customize the look and feel of the platform
                </p>
              </div>

              <div className="space-y-4">
                <div className="text-[20px] font-semibold text-[#000000]">Theme Preferences</div>
                
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <button
                    type="button"
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Light' }))}
                    className={`p-6 rounded-[20px] border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      appearance.theme === 'Light'
                        ? 'border-[#FF34DC] bg-[#FFF8FE] text-[#890080] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Sun size={28} className={appearance.theme === 'Light' ? 'text-[#FF34DC]' : 'text-gray-500'} />
                    <span className="text-[16px] font-semibold">Light</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Dark' }))}
                    className={`p-6 rounded-[20px] border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      appearance.theme === 'Dark'
                        ? 'border-[#FF34DC] bg-[#FFF8FE] text-[#890080] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Moon size={28} className={appearance.theme === 'Dark' ? 'text-[#FF34DC]' : 'text-gray-500'} />
                    <span className="text-[16px] font-semibold">Dark</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAppearance(prev => ({ ...prev, theme: 'Auto' }))}
                    className={`p-6 rounded-[20px] border flex flex-col items-center justify-center gap-3 transition-all cursor-pointer ${
                      appearance.theme === 'Auto'
                        ? 'border-[#FF34DC] bg-[#FFF8FE] text-[#890080] shadow-sm'
                        : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <Monitor size={28} className={appearance.theme === 'Auto' ? 'text-[#FF34DC]' : 'text-gray-500'} />
                    <span className="text-[16px] font-semibold">Auto</span>
                  </button>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200 space-y-4">
                <div className="text-[18px] font-bold text-gray-900">Color Palette</div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-[#FAFAFA] border border-gray-200 p-6 rounded-[20px]">
                  
                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Primary Color</label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-[12px] shadow-sm flex-shrink-0" 
                        style={{ backgroundColor: appearance.primaryColor }}
                      />
                      <span className="text-[16px] font-semibold text-gray-900 uppercase">{appearance.primaryColor}</span>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2">
                    <label className="text-[13px] font-medium text-gray-500 uppercase tracking-wider">Secondary Color</label>
                    <div className="flex items-center gap-3">
                      <div 
                        className="w-10 h-10 rounded-[12px] shadow-sm flex-shrink-0" 
                        style={{ backgroundColor: appearance.secondaryColor }}
                      />
                      <span className="text-[16px] font-semibold text-gray-900 uppercase">{appearance.secondaryColor}</span>
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
