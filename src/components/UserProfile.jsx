import React, { useState, useRef } from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Mail, 
  Phone, 
  MapPin, 
  GraduationCap, 
  Briefcase, 
  FileText, 
  Camera, 
  Trash2,
  Edit2
} from 'lucide-react';

export default function UserProfile({ onNavigate, onLogout }) {
  const [profileData, setProfileData] = useState({
    fullName: "Ahmed Raza",
    email: "ahmed.r19@gmail.com",
    phone: "+92 300 7867860",
    location: "Karachi, Pakistan",
    dob: "2002-12-06",
    currentEducation: "Bachelor of Science in Software Engineering",
    university: "Ziauddin University Faculty of Engineering & Management",
    expectedGraduation: "2027",
    interests: "Software Development, AI, Data Science",
    skills: "Python, JavaScript, React, Machine Learning",
    bio: "Passionate software engineering student interested in AI and software development. Looking to explore career opportunities in tech."
  });

  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const fileInputRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result); 
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDeleteImage = (e) => {
    e.stopPropagation(); 
    setProfileImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = ''; 
    }
  };

  return (
    <div className="w-full bg-transparent text-gray-900 antialiased space-y-6 pb-10 relative text-left">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate && onNavigate('dashboard')}>
            <img src="logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-[20px] tracking-tight text-gray-900">
              CareerPath<span className="text-[#bd24df] font-bold text-[20px]">AI</span>
            </span>
          </div>
          
          <div className="flex items-center gap-4 sm:gap-6">
            <button 
              onClick={() => onNavigate && onNavigate('dashboard')} 
              className="flex items-center gap-2 text-gray-600 hover:text-[#bd24df] px-4 py-2 rounded-xl text-[14px] font-semibold transition cursor-pointer"
            >
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline font-semibold text-[14px]">Dashboard</span>
            </button>
            
            <div className="flex items-center gap-2 text-[#bd24df] font-semibold text-[14px] border-l border-r border-gray-200 px-4 bg-purple-50/50 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                {profileImage ? (
                  <img src={profileImage} alt="Nav Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-[#bd24df]" />
                )}
              </div>
              <span className="hidden sm:inline font-semibold text-[14px]">Ahmed!</span>
            </div>
            
            <button 
              onClick={() => onLogout && onLogout()} 
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-[14px] font-medium transition cursor-pointer"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline font-medium text-[14px]">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">

        <div className="pt-1 flex flex-col sm:flex-row sm:items-center justify-between gap-6 text-left">
          <div className="space-y-2"> 
            <h1 className="text-4xl font-bold tracking-tight text-gray-900 inline-flex items-center gap-2">
              Your Profile
            </h1>
            <p className="text-[#000000] font-light text-[21.3px] mt-[5px] mb-[15px]">
              Manage your personal information and preferences
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] flex flex-col items-center text-center relative">
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="relative mt-2 group">
                <div className="w-[140px] h-[140px] rounded-full bg-[#FFBFF4] text-[#000000] font-extrabold text-[38px] flex items-center justify-center shadow-sm overflow-hidden relative">
                  {profileImage ? (
                    <>
                      <img src={profileImage} alt="Profile" className="w-fu h-full object-cover" />
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
                    "AR"
                  )}
                </div>

                {!profileImage && (
                  <button 
                    type="button"
                    onClick={() => fileInputRef.current.click()}
                    className="absolute bottom-0 right-0 w-[50px] h-[50px] flex items-center justify-center bg-white border border-gray-300 text-gray-600 hover:text-[#bd24df] rounded-full shadow-md transition cursor-pointer"
                    title="Upload Picture"
                  >
                    <Camera size={20} />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-[26px] font-bold text-[#000000] tracking-tight">{profileData.fullName}</h2>
                <p className="text-[18px] font-regular text-[#000000]">Student Member</p>
              </div>

              <div className="w-full border-t border-gray-100 my-5"></div>

              <div className="w-full space-y-3.5 text-left text-[16px] font-regular text-[#000000] px-2">
                <div className="flex items-center gap-3">
                  <Mail size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={17} className="text-[#1300FF] flex-shrink-0" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-[#FFD2F7] rounded-[24px] p-5 shadow-[3px_4px_4px_0.2px_rgba(0,0,0,0.25)] space-y-4 text-left">
              <h3 className="text-[21px] font-semibold text-[#000000] tracking-tight">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-[#F7E8FF] rounded-[15px]">
                  <div className="flex items-center gap-3">
                    <FileText size={18} className="text-[#1300FF]" />
                    <span className="text-[16px] font-regular text-gray-800">Quizzes</span>
                  </div>
                  <span className="text-[17px] font-semibold text-[#890080]">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-[#F7E8FF] rounded-[15px]">
                  <div className="flex items-center gap-3">
                    <Briefcase size={18} className="text-[#1300FF]" />
                    <span className="text-[16px] font-regular text-gray-800">Careers</span>
                  </div>
                  <span className="text-[17px] font-semibold text-[#890080]">12</span>
                </div>
              </div>
            </div>

          </div>

          <div className="lg:col-span-8 bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 shadow-[3px_6px_6px_0.5px_rgba(0,0,0,0.25)] text-left space-y-7">
            
            <div className="flex items-center justify-between pb-2">
              <h2 className="text-[25px] font-semibold text-[#000000]">Personal Information</h2>
              
              <button 
                type="button"
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-2 px-5 py-2 rounded-full text-[15px] font-medium border transition-all cursor-pointer ${
                  isEditing 
                    ? 'bg-[#890080] text-white border-[#890080] hover:bg-[#700068]' 
                    : 'border-[#bd24df] text-[#bd24df] bg-white hover:bg-[#FFEDF9]'
                }`}
              >
                <Edit2 size={16} />
                <span>{isEditing ? "Save Profile" : "Edit Profile"}</span>
              </button>
            </div>

            <form className="space-y-7" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <User size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Basic Information</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Full Name</label>
                    <input 
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Phone Number</label>
                    <input 
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Location</label>
                    <input 
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[17px] font-medium text-[#000000]">Date of Birth</label>
                    <input 
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-200/80 my-4"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <GraduationCap size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Education</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[17px] font-medium text-[#000000]">Current Education</label>
                    <input 
                      type="text"
                      name="currentEducation"
                      value={profileData.currentEducation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">University/College</label>
                    <input 
                      type="text"
                      name="university"
                      value={profileData.university}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Expected Graduation</label>
                    <input 
                      type="text"
                      name="expectedGraduation"
                      value={profileData.expectedGraduation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-200/80 my-4"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-4.5 text-[20px] font-semibold text-[#000000]">
                  <Briefcase size={23} strokeWidth={1.7} className="text-[#5B50E5]" />
                  <span>Career Information</span>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Career Interests / Domains</label>
                    <input 
                      type="text"
                      name="interests"
                      value={profileData.interests}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Core Skills & Libraries</label>
                    <input 
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full h-[45px] bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[17px] font-medium text-[#000000]">Professional Summary / Bio</label>
                    <textarea 
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full bg-[#FDFDFD] border border-gray-200/90 focus:border-[#5B50E5] text-[15px] font-medium p-4 rounded-[14px] outline-none text-gray-800 disabled:bg-gray-50/60 disabled:text-gray-600 transition-all resize-none leading-relaxed"
                    />
                  </div>
                </div>
              </div>

            </form>
          </div>

        </div>
      </main>
    </div>
  );
}
