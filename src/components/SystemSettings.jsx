import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
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
  ChevronDown,
  Eye,
  EyeOff,
  Camera,
  Trash2,
  Upload
} from 'lucide-react';

export default function SystemSettings({ onBack }) {
  const [activeTab, setActiveTab] = useState('Admin Profile'); 

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

  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'AI Career Advisor',
    supportEmail: 'support@aicareeradvisor.com',
    allowRegistration: true,
    emailVerification: true,
    maintenanceMode: false,
    language: 'English',
    timezone: 'UTC+5 (Pakistan)',
    dateFormat: 'DD/MM/YYYY'
  });

  const [security, setSecurity] = useState({
    twoFactorAuth: false,
    sessionTimeout: '35',
    minPasswordLength: '8'
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

  const getAuthToken = () => {
    const directToken = localStorage.getItem('token') || 
                        sessionStorage.getItem('token') || 
                        localStorage.getItem('access_token') || 
                        sessionStorage.getItem('access_token') || 
                        localStorage.getItem('auth_token') || 
                        sessionStorage.getItem('auth_token');
    if (directToken) return directToken;

    try {
      const storedUser = localStorage.getItem('user') || sessionStorage.getItem('user') || localStorage.getItem('auth');
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
          if (response.data.avatar) {
            const avatarUrl = response.data.avatar.startsWith('http')
              ? response.data.avatar
              : `http://127.0.0.1:8000/storage/${response.data.avatar}`;
            setAvatarPreview(avatarUrl);
          } else {
            setAvatarPreview(null);
          }
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
    e.stopPropagation(); 
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

      if (response.data.avatar) {
        const avatarUrl = response.data.avatar.startsWith('http')
          ? response.data.avatar
          : `http://127.0.0.1:8000/storage/${response.data.avatar}`;
        setAvatarPreview(avatarUrl);
      } else {
        setAvatarPreview(null);
      }

      setAvatarFile(null);
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
          <div className="w-[256px] h-[200px] bg-white border border-[#FFD2F7] rounded-[20px] p-3 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-1.5 flex flex-col justify-center">
            
            <button
              type="button"
              onClick={() => setActiveTab('Admin Profile')}
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

                <div className="relative group flex-shrink-0">
                  <div className="w-[120px] h-[120px] rounded-full bg-[#FFBFF4] text-[#000000] font-extrabold text-[32px] flex items-center justify-center shadow-sm overflow-hidden relative">
                    {avatarPreview ? (
                      <>
                        <img src={avatarPreview} alt="Admin Avatar" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition duration-200">
                          <button 
                            type="button"
                            onClick={handleDeleteImage}
                            className="p-2 bg-red-600 text-white rounded-full hover:bg-red-700 transition transform hover:scale-110 cursor-pointer"
                            title="Delete Picture"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </>
                    ) : (
                      getInitials(profile.fullName)
                    )}
                  </div>

                  {!avatarPreview && (
                    <button 
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="absolute bottom-0 right-0 w-[42px] h-[42px] flex items-center justify-center bg-white border border-gray-300 text-gray-600 hover:text-[#bd24df] rounded-full shadow-md transition cursor-pointer"
                      title="Upload Picture"
                    >
                      <Camera size={18} />
                    </button>
                  )}
                </div>

                <div className="space-y-1.5 text-center sm:text-left">
                  <h3 className="text-[19px] font-semibold text-[#000000]">Profile Picture</h3>
                  <p className="text-[15px] font-regular text-[#707070]">
                    Upload a picture to personalize your account. JPG, PNG or GIF up to 5MB.
                  </p>
                  <div className="pt-1.5 flex items-center gap-3 justify-center sm:justify-start">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current.click()}
                      className="px-4 py-2 bg-[#FFEDF9] text-[#bd24df] border border-[#f2c6fa] hover:bg-[#bd24df] hover:text-white rounded-[12px] text-[14px] font-semibold transition cursor-pointer inline-flex items-center gap-2"
                    >
                      <Upload size={16} strokeWidth={2} />
                      <span>{avatarPreview ? "Change Photo" : "Upload Photo"}</span>
                    </button>
                    {avatarPreview && (
                      <button
                        type="button"
                        onClick={handleDeleteImage}
                        className="px-4 py-2 bg-red-50 text-red-600 border border-red-200 hover:bg-red-600 hover:text-white rounded-[12px] text-[14px] font-medium transition cursor-pointer inline-flex items-center gap-2"
                      >
                        <Trash2 size={16} strokeWidth={2} />
                        <span>Remove Photo</span>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <User size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Account Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Full Name</label>
                    <input 
                      type="text"
                      value={profile.fullName}
                      onChange={(e) => handleProfileChange('fullName', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Email Address</label>
                    <input 
                      type="email"
                      value={profile.email}
                      onChange={(e) => handleProfileChange('email', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
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
                  {/* Current Password */}
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Current Password</label>
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
                        className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
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
                    {/* New Password */}
                    <div className="space-y-1.5">
                      <label className="text-[17px] font-medium text-[#000000]">New Password</label>
                      <div className="relative">
                        <input
                          type={showNewPassword ? "text" : "password"}
                          placeholder="Enter new password"
                          value={profile.newPassword}
                          onChange={(e) => handleProfileChange('newPassword', e.target.value)}
                          autoComplete="new-password"
                          name="admin-new-password"
                          className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
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

                    <div className="space-y-1.5">
                      <label className="text-[17px] font-medium text-[#000000]">Confirm New Password</label>
                      <div className="relative">
                        <input
                          type={showConfirmPassword ? "text" : "password"}
                          placeholder="Confirm new password"
                          value={profile.confirmPassword}
                          onChange={(e) => handleProfileChange('confirmPassword', e.target.value)}
                          autoComplete="new-password"
                          name="admin-confirm-password"
                          className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium pl-4 pr-11 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
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
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Site Name</label>
                    <input 
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => handleGeneralChange('siteName', e.target.value)}
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
                  <div className="space-y-2">
                    <label className="text-[17px] font-medium text-[#000000]">Session Timeout (minutes)</label>
                    <input 
                      type="number"
                      value={security.sessionTimeout}
                      onChange={(e) => handleSecurityChange('sessionTimeout', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[17px] font-medium text-[#000000]">Min Password Length</label>
                    <input 
                      type="number"
                      value={security.minPasswordLength}
                      onChange={(e) => handleSecurityChange('minPasswordLength', e.target.value)}
                      className="w-full h-[45px] bg-[#FDFDFD] border-[#A8A8A8] border-[0.5px] text-[15px] font-medium px-4 py-2.5 rounded-[10px] outline-none transition-all text-gray-800"
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
