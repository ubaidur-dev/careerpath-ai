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
  ChevronLeft,
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
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-sans antialiased">
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          .font-sans {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      {}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <img src="logo.png" alt="Logo" className="w-8 h-8 object-contain" />
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#bd24df]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-[#bd24df] font-semibold text-sm border-l border-r border-gray-200 px-4 bg-purple-50/50 py-2 rounded-lg">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                {profileImage ? (
                  <img src={profileImage} alt="Nav Avatar" className="w-full h-full object-cover" />
                ) : (
                  <User size={18} className="text-[#bd24df]" />
                )}
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            
            <button 
              onClick={() => onLogout && onLogout()} 
              className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer"
            >
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      {}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
        
        <div className="flex items-center justify-between">
          <button 
            onClick={() => onNavigate('dashboard')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-600 text-xs font-bold rounded-xl shadow-sm hover:bg-gray-50 transition cursor-pointer"
          >
            <ChevronLeft size={14} />
            Back to Dashboard
          </button>
        </div>

        <div className="text-left space-y-1">
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">Your Profile</h1>
          <p className="text-gray-500 text-sm">Manage your personal information and preferences</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          
          <div className="lg:col-span-4 space-y-6">
            
            <div className="bg-white border border-gray-100 rounded-3xl p-6 shadow-sm text-center flex flex-col items-center justify-center relative">
              
              <input 
                type="file"
                ref={fileInputRef}
                onChange={handleImageChange}
                accept="image/*"
                className="hidden"
              />

              <div className="relative mt-4 group">
                <div className="w-28 h-28 rounded-full bg-[#fde8ff] text-[#bd24df] font-extrabold text-3xl flex items-center justify-center border-4 border-white shadow-md overflow-hidden relative">
                  {profileImage ? (
                    <>
                      <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
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
                    className="absolute bottom-0 right-1 p-2 bg-white border border-gray-200 text-gray-500 hover:text-[#bd24df] rounded-full shadow-sm transition cursor-pointer"
                    title="Upload Picture"
                  >
                    <Camera size={14} />
                  </button>
                )}
              </div>

              <div className="mt-4 space-y-1">
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">{profileData.fullName}</h2>
                <p className="text-sm font-medium text-gray-400">Student Member</p>
              </div>

              <div className="w-full border-t border-gray-100 my-5"></div>

              <div className="w-full space-y-3.5 text-left text-xs font-semibold text-gray-600 px-2">
                <div className="flex items-center gap-3">
                  <Mail size={16} className="text-gray-400 flex-shrink-0" />
                  <span className="truncate">{profileData.email}</span>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{profileData.phone}</span>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin size={16} className="text-gray-400 flex-shrink-0" />
                  <span>{profileData.location}</span>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm space-y-4 text-left">
              <h3 className="text-sm font-extrabold text-gray-900 uppercase tracking-wider">Quick Stats</h3>
              <div className="space-y-2.5">
                <div className="flex items-center justify-between p-3 bg-[#fdf2ff] rounded-xl border border-[#fdf2ff]">
                  <div className="flex items-center gap-2.5">
                    <FileText size={16} className="text-[#bd24df]" />
                    <span className="text-xs font-bold text-gray-700">Quizzes</span>
                  </div>
                  <span className="text-xs font-extrabold text-[#bd24df] bg-white px-2.5 py-1 rounded-lg border border-[#f5dbfc]">3</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-purple-50/40 rounded-xl border border-purple-50/10">
                  <div className="flex items-center gap-2.5">
                    <Briefcase size={16} className="text-purple-600" />
                    <span className="text-xs font-bold text-gray-700">Careers</span>
                  </div>
                  <span className="text-xs font-extrabold text-purple-600 bg-white px-2.5 py-1 rounded-lg border border-purple-100">12</span>
                </div>
              </div>
            </div>

          </div>

          {}
          <div className="lg:col-span-8 bg-white border border-gray-100 rounded-3xl shadow-sm p-6 sm:p-8 space-y-8">
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-gray-100 text-left">
              <div>
                <h2 className="text-xl font-extrabold text-gray-900 tracking-tight">Personal Information</h2>
                <p className="text-xs text-gray-400 mt-0.5">Keep your metrics updated for precise AI trajectory evaluation</p>
              </div>
              <button 
                onClick={() => setIsEditing(!isEditing)}
                className={`inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-xl transition shadow-sm cursor-pointer border ${
                  isEditing 
                  ? 'bg-[#bd24df] text-white border-[#bd24df] hover:bg-[#a61fc5]' 
                  : 'bg-white text-[#bd24df] border-[#f5dbfc] hover:bg-[#fdf2ff]'
                }`}
              >
                <Edit2 size={12} />
                {isEditing ? "Save Profile" : "Edit Profile"}
              </button>
            </div>

            <form className="space-y-8 text-left" onSubmit={(e) => e.preventDefault()}>
              
              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 tracking-tight">
                  <User size={18} className="text-[#bd24df]" />
                  <h3>Basic Information</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Full Name</label>
                    <input 
                      type="text"
                      name="fullName"
                      value={profileData.fullName}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Email Address</label>
                    <input 
                      type="email"
                      name="email"
                      value={profileData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Phone Number</label>
                    <input 
                      type="text"
                      name="phone"
                      value={profileData.phone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Location</label>
                    <input 
                      type="text"
                      name="location"
                      value={profileData.location}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 block">Date of Birth</label>
                    <input 
                      type="date"
                      name="dob"
                      value={profileData.dob}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-100 my-2"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 tracking-tight">
                  <GraduationCap size={18} className="text-[#bd24df]" />
                  <h3>Education</h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="space-y-1.5 md:col-span-3">
                    <label className="text-xs font-bold text-gray-500 block">Current Education</label>
                    <input 
                      type="text"
                      name="currentEducation"
                      value={profileData.currentEducation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5 md:col-span-2">
                    <label className="text-xs font-bold text-gray-500 block">University/College</label>
                    <input 
                      type="text"
                      name="university"
                      value={profileData.university}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Expected Graduation</label>
                    <input 
                      type="text"
                      name="expectedGraduation"
                      value={profileData.expectedGraduation}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>
                </div>
              </div>

              <div className="w-full border-t border-gray-100 my-2"></div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-extrabold text-gray-900 tracking-tight">
                  <Briefcase size={18} className="text-[#bd24df]" />
                  <h3>Career Information</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Career Interests / Domains</label>
                    <input 
                      type="text"
                      name="interests"
                      value={profileData.interests}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Core Skills & Libraries</label>
                    <input 
                      type="text"
                      name="skills"
                      value={profileData.skills}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-500 block">Professional Summary / Bio</label>
                    <textarea 
                      name="bio"
                      value={profileData.bio}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows={4}
                      className="w-full text-sm font-medium text-gray-800 bg-gray-50 border border-gray-200 px-3.5 py-2.5 rounded-xl outline-none focus:border-[#bd24df] focus:bg-white disabled:opacity-80 transition resize-none leading-relaxed"
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