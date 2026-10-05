import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import Dropdown from './Dropdown';
import { 
  User,
  Settings, 
  Shield, 
  Save, 
  Globe, 
  Database, 
  Lock, 
  KeyRound,
  Check,
  Eye,
  EyeOff
} from 'lucide-react';
import BackToDashboardButton from './BackToDashboardButton';
import AvatarPicker from './AvatarPicker';

const DEFAULT_GENERAL_SETTINGS = {
  siteName: 'AI Career Advisor',
  supportEmail: 'support@aicareeradvisor.com',
  allowRegistration: true,
  emailVerification: true,
  maintenanceMode: false,
  language: 'English',
  timezone: 'UTC+5 (Pakistan)',
  dateFormat: 'DD/MM/YYYY'
};

const DEFAULT_SECURITY_SETTINGS = {
  twoFactorAuth: false,
  sessionTimeout: '35',
  minPasswordLength: '8'
};

const SAVED_SETTINGS_KEY = 'admin_system_settings';

const loadSavedSettings = () => {
  try {
    const saved = JSON.parse(localStorage.getItem(SAVED_SETTINGS_KEY) || '{}');
    return {
      general: { ...DEFAULT_GENERAL_SETTINGS, ...(saved.general || {}) },
      security: { ...DEFAULT_SECURITY_SETTINGS, ...(saved.security || {}) },
    };
  } catch {
    return { general: DEFAULT_GENERAL_SETTINGS, security: DEFAULT_SECURITY_SETTINGS };
  }
};

export default function SystemSettings({ onBack }) {
  const [activeTab, setActiveTab] = useState('Admin Profile');

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'instant' });
  }, [activeTab]);

  const [profile, setProfile] = useState({
    fullName: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [initialSaved] = useState(loadSavedSettings);
  const savedRef = useRef({ profile: { fullName: '', email: '' }, avatar: null, ...initialSaved });

  const [generalSettings, setGeneralSettings] = useState(initialSaved.general);
  const [security, setSecurity] = useState(initialSaved.security);

  const discardUnsavedChanges = () => {
    const saved = savedRef.current;
    setProfile({ ...saved.profile, currentPassword: '', newPassword: '', confirmPassword: '' });
    setAvatarPreview(saved.avatar);
    setAvatarFile(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    setShowCurrentPassword(false);
    setShowNewPassword(false);
    setShowConfirmPassword(false);
    setGeneralSettings(saved.general);
    setSecurity(saved.security);
  };

  const switchTab = (tab) => {
    if (tab === activeTab) return;
    discardUnsavedChanges();
    setActiveTab(tab);
  };

  const [toastMessage, setToastMessage] = useState('');
  const [showToast, setShowToast] = useState(false);

  const triggerToast = (msg) => {
    setToastMessage(msg);
    setShowToast(true);
    setTimeout(() => {
      setShowToast(false);
    }, 3500);
  };

 
  const getAuthToken = () => {
    const directToken = sessionStorage.getItem('token') || sessionStorage.getItem('access_token') || sessionStorage.getItem('auth_token');
    if (directToken) return directToken;

    try {
      const storedUser = sessionStorage.getItem('user');
      if (storedUser) {
        const parsed = JSON.parse(storedUser);
        if (parsed.token) return parsed.token;
        if (parsed.access_token) return parsed.access_token;
        if (parsed.data?.token) return parsed.data.token;
      }
    } catch (e) {
      console.error("Error parsing stored user object", e);
    }

    return null;
  };

  
  const syncStoredUser = ({ name, email, avatar } = {}) => {
    try {
      const raw = sessionStorage.getItem('user');
      const existing = raw ? JSON.parse(raw) : {};
      const merged = {
        ...existing,
        ...(name !== undefined ? { name } : {}),
        ...(email !== undefined ? { email } : {}),
        ...(avatar !== undefined ? { avatar, avatar_url: avatar } : {}),
      };
      sessionStorage.setItem('user', JSON.stringify(merged));
      window.dispatchEvent(new Event('user-profile-updated'));
    } catch (e) {
      console.error('Failed to sync stored user', e);
    }
  };

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = getAuthToken();
        if (!token) {
          console.warn("No authentication token found in storage!");
          triggerToast("Warning: No auth token found. Please login again.");
          return;
        }

        const response = await axios.get('/admin/profile', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (response.data) {
          setProfile(prev => ({
            ...prev,
            fullName: response.data.name || response.data.full_name || '',
            email: response.data.email || ''
          }));
          setAvatarPreview(response.data.avatar || null);
          savedRef.current = {
            ...savedRef.current,
            profile: { fullName: response.data.name || response.data.full_name || '', email: response.data.email || '' },
            avatar: response.data.avatar || null,
          };
          syncStoredUser({
            name: response.data.name || response.data.full_name,
            email: response.data.email,
            avatar: response.data.avatar || null,
          });
        }
      } catch (error) {
        console.error("Failed to load admin profile", error);
        triggerToast(error.response?.data?.message || "Unauthenticated session.");
      }
    };
    fetchAdminProfile();
  }, []);

  const handleProfileChange = (key, value) => {
    setProfile(prev => ({ ...prev, [key]: value }));
  };

  const handleGeneralChange = (key, value) => {
    setGeneralSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSecurityChange = (key, value) => {
    setSecurity(prev => ({ ...prev, [key]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleDeleteImage = (e) => {
    e?.stopPropagation();
    setAvatarPreview(null);
    setAvatarFile('DELETE');
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  const getInitials = (name) => {
    if (!name) return "AU";
    const parts = name.trim().split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  };

  const handleSaveChanges = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        triggerToast("Authentication token missing. Please log in.");
        return;
      }

      if (profile.newPassword || profile.confirmPassword || profile.currentPassword) {
        if (!profile.currentPassword) {
          triggerToast("Please enter your current password.");
          return;
        }
        if (profile.newPassword.length < 8) {
          triggerToast("New password must be at least 8 characters.");
          return;
        }
        if (profile.newPassword !== profile.confirmPassword) {
          triggerToast("New password and confirm password do not match.");
          return;
        }
      }

      const formData = new FormData();
      formData.append('name', profile.fullName);
      formData.append('email', profile.email);

      if (avatarFile === 'DELETE') {
        formData.append('remove_avatar', '1');
      } else if (avatarFile instanceof File) {
        formData.append('avatar', avatarFile);
      }

      if (profile.newPassword) {
        formData.append('current_password', profile.currentPassword);
        formData.append('password', profile.newPassword);
        formData.append('password_confirmation', profile.confirmPassword);
      }

      const response = await axios.post('/admin/profile/update', formData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'multipart/form-data'
        }
      });

      triggerToast(response.data.message || "Profile updated successfully!");

      setProfile(prev => ({
        ...prev,
        fullName: response.data.name ?? prev.fullName,
        email: response.data.email ?? prev.email,
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      }));

      setAvatarPreview(response.data.avatar || null);
      syncStoredUser({
        name: response.data.name,
        email: response.data.email,
        avatar: response.data.avatar || null,
      });

      setAvatarFile(null);

      savedRef.current = {
        profile: { fullName: response.data.name ?? profile.fullName, email: response.data.email ?? profile.email },
        avatar: response.data.avatar || null,
        general: generalSettings,
        security,
      };
      try {
        localStorage.setItem(SAVED_SETTINGS_KEY, JSON.stringify({ general: generalSettings, security }));
      } catch {
      }
    } catch (error) {
      console.error(error);
      triggerToast(error.response?.data?.message || "Failed to update profile settings");
    }
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

      <BackToDashboardButton onClick={() => onBack && onBack()} />

      <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
        <div className="space-y-2"> 
          <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
            System Settings
          </h1>
          <p className="text-[#525252] font-light text-[21.3px] mt-[5px] mb-[15px]">
            Configure platform settings and preferences
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        <div className="lg:col-span-3 space-y-4">
          <div className="w-[256px] h-[200px] bg-white border border-[#FFD2F7] rounded-[20px] p-3 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-1.5 flex flex-col justify-center">
            
            <button
              type="button"
              onClick={() => switchTab('Admin Profile')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'Admin Profile'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <User size={18} strokeWidth={1.8} className={activeTab === 'Admin Profile' ? 'text-[#890080]' : 'text-[#000000]'} />
              Admin Profile
            </button>

            <button
              type="button"
              onClick={() => switchTab('General')}
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
              onClick={() => switchTab('Security')}
              className={`w-[203px] h-[45px] mx-auto flex items-center gap-3 px-5 py-3.5 rounded-[16px] text-[16px] transition-all cursor-pointer ${
                activeTab === 'Security'
                  ? 'bg-[#FFEDF9] text-[#890080] font-medium border-[0.2px] border-[#DBD9D9]'
                  : 'text-[#000000] font-regular hover:bg-gray-50 border-[0.2px] border-transparent'
              }`}
            >
              <Shield size={18} strokeWidth={1.8} className={activeTab === 'Security' ? 'text-[#890080]' : 'text-[#000000]'} />
              Security
            </button>

          </div>

          <button 
            type="button"
            onClick={handleSaveChanges}
            style={{ backgroundColor: '#FFD7FC', color: '#890080' }}
            className="w-[256px] h-[55px] inline-flex items-center justify-center font-semibold text-[18px] px-6 py-3.5 gap-2 rounded-[16px] cursor-pointer custom-quiz-border transition-all duration-300 transform hover:scale-[1.02] active:scale-95 shadow-sm"
          >
            <Save size={18} strokeWidth={2.2} className="mr-2 flex-shrink-0" />
            <span>Save Changes</span>
          </button>
        </div>

        <div className="lg:col-span-9 bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] text-left space-y-8">
          
          {activeTab === 'Admin Profile' && (
            <div className="space-y-7">
              <div className="space-y-1.5">
                <div className="flex items-center gap-2.5">
                  <div className="text-[#5B50E5]">
                    <User size={23} strokeWidth={1.7} />
                  </div>
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight ml-2">Admin Profile</h2>
                </div>
                <p className="text-[18px] font-regular text-[#707070]">
                  Manage your account credentials and personal profile information
                </p>
              </div>

              <div className="flex flex-col sm:flex-row items-center gap-6 p-5 bg-[#FDFDFD] border border-gray-200/80 rounded-[20px]">
                <input 
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                />

                <div className="flex-shrink-0">
                  <AvatarPicker
                    src={avatarPreview}
                    onUpload={() => fileInputRef.current?.click()}
                    onRemove={handleDeleteImage}
                    onImageError={() => setAvatarPreview(null)}
                    confirmRemove={false}
                    sizeClass="w-[120px] h-[120px]"
                    circleClass="text-[32px]"
                    fallback={getInitials(profile.fullName)}
                  />
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-[19px] font-semibold text-[#000000]">Profile Picture</h3>
                  <p className="text-[15px] font-regular text-[#707070]">
                    Upload a picture to personalize your account. JPG, PNG or GIF up to 5MB.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <User size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Account Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Full Name</label>
                    <input
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Email Address</label>
                    <input
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-gray-200/80 space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Lock size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Change Password</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Current Password</label>
                    <div className="relative">
                      <input
                        type={showCurrentPassword ? "text" : "password"}
                        placeholder="Enter current password"
                        value={profile.currentPassword}
                        onChange={(e) => handleProfileChange('currentPassword', e.target.value)}
                        autoComplete="off"
                        name="admin-current-password"
                        readOnly
                        onFocus={(e) => e.target.removeAttribute('readonly')}
                        className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                      >
                        {showCurrentPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[16px] font-semibold text-black block">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={profile.newPassword}
                          onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                          autoComplete="new-password"
                          name="admin-new-password"
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowNewPassword(!showNewPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                        >
                          {showNewPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[16px] font-semibold text-black block">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={profile.confirmPassword}
                          onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                          autoComplete="new-password"
                          name="admin-confirm-password"
                          className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 cursor-pointer focus:outline-none"
                        >
                          {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          )}

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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Site Name</label>
                    <input
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => handleGeneralChange('siteName', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Support Email</label>
                    <input
                      type="email"
                      value={generalSettings.supportEmail}
                      onChange={(e) => handleGeneralChange('supportEmail', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
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
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Language</label>
                    <Dropdown
                      variant="settings"
                      triggerClassName="bg-gray-50/50 rounded-xl px-4 py-3.5 text-[14px] font-medium"
                      value={generalSettings.language}
                      onChange={(v) => handleGeneralChange('language', v)}
                      options={['English', 'Urdu', 'Spanish']}
                      ariaLabel="Language"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Timezone</label>
                    <Dropdown
                      variant="settings"
                      triggerClassName="bg-gray-50/50 rounded-xl px-4 py-3.5 text-[14px] font-medium"
                      value={generalSettings.timezone}
                      onChange={(v) => handleGeneralChange('timezone', v)}
                      options={['UTC+5 (Pakistan)', 'UTC+0 (GMT)', 'UTC-5 (EST)']}
                      ariaLabel="Timezone"
                    />
                  </div>
                </div>

                <div className="space-y-1 w-full md:w-1/2 pr-0 md:pr-2">
                  <label className="text-[16px] font-semibold text-black block">Date Format</label>
                  <Dropdown
                    variant="settings"
                    triggerClassName="bg-gray-50/50 rounded-xl px-4 py-3.5 text-[14px] font-medium"
                    value={generalSettings.dateFormat}
                    onChange={(v) => handleGeneralChange('dateFormat', v)}
                    options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']}
                    ariaLabel="Date format"
                  />
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
                  <h2 className="text-[25px] font-semibold text-[#000000] leading-tight ml-2">Security Settings</h2>
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

                <div 
                  onClick={() => handleSecurityChange('twoFactorAuth', !security.twoFactorAuth)}
                  className="h-[62px] flex items-center justify-between bg-[#F9F9F9] border border-gray-100 p-4 rounded-[16px] cursor-pointer hover:bg-gray-100/60 transition-colors"
                >
                  <div>
                    <span className="text-[18px] font-medium text-[#000000] block">Two-Factor Authentication</span>
                    <span className="text-[15px] text-[#000000] font-regular mt-0.3 block">Require 2FA for admin accounts</span>
                  </div>
                  <div className={`w-5 h-5 rounded-[5px] flex items-center justify-center transition-all ${
                    security.twoFactorAuth ? 'bg-[#5B50E5] text-white' : 'border-2 border-gray-300 bg-white'
                  }`}>
                    {security.twoFactorAuth && <Check size={14} strokeWidth={3} />}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Session Timeout (minutes)</label>
                    <input
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[16px] font-semibold text-black block">Min Password Length</label>
                    <input
                      type="number"
                      value={security.minPasswordLength}
                      onChange={(e) => handleSecurityChange('minPasswordLength', e.target.value)}
                      className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400 text-gray-800"
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

        </div>

      </div>

    </div>
  );
}
