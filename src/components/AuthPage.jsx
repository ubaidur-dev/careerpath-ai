import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, XCircle, CheckCircle2, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import AuthImage from '../assets/Authentication.PNG'; 

export default function AuthPage({ mode, setMode, onSuccess, onBackHome }) {
  const [role, setRole] = useState('student'); 
  const [showPass, setShowPass] = useState(false);
  const [showAdminPass, setShowAdminPass] = useState(false);
  
  const [countriesList, setCountriesList] = useState([]);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    country_code: '+92',
    phone: '',
    password: '',
    confirmPassword: '',
    admin_id: '',
    security_passcode: ''
  });

  const [selectedCountry, setSelectedCountry] = useState(null);
  const [isCountryOpen, setIsCountryOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  
  const dropdownRef = useRef(null);
  const searchInputRef = useRef(null);
  const scrollContainerRef = useRef(null);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const isLogin = mode === 'login';

  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/countries');
        setCountriesList(response.data);
        
        const defaultCountry = response.data.find(c => c.code === '+92') || response.data[0];
        if (defaultCountry) {
          setSelectedCountry(defaultCountry);
          setFormData(prev => ({ ...prev, country_code: defaultCountry.code }));
        }
      } catch (error) {
        console.error("Failed to load countries list", error);
      }
    };
    fetchCountries();
  }, []);

  useEffect(() => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollTop = 0;
    }
    setErrorMsg('');
    setSuccessMsg('');
  }, [mode, role]);

  useEffect(() => {
    if (errorMsg) {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: 'smooth' });
      }
      const timer = setTimeout(() => setErrorMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [errorMsg]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCountryOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (isCountryOpen && searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, [isCountryOpen]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectCountry = (country) => {
    setSelectedCountry(country);
    setFormData(prev => ({
      ...prev,
      country_code: country.code,
      phone: '' 
    }));
    setIsCountryOpen(false);
    setCountrySearch('');
  };

  const handlePhoneChange = (e) => {
    const rawVal = e.target.value.replace(/\D/g, ''); 
    if (selectedCountry && rawVal.length <= selectedCountry.maxLen) {
      setFormData(prev => ({ ...prev, phone: rawVal }));
    }
  };

  const filteredCountries = countriesList.filter(c => {
    const query = countrySearch.toLowerCase().replace('+', '').trim();
    return c.name.toLowerCase().includes(query) || c.code.replace('+', '').includes(query);
  });

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!isLogin && formData.password !== formData.confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));
      return;
    }

    setLoading(true);

    const endpoint = isLogin ? '/api/login' : '/api/register';
    
    const payload = isLogin 
      ? { email: formData.email, password: formData.password, role } 
      : { 
          name: formData.name, 
          email: formData.email, 
          country_name: selectedCountry?.name || '',
          country_code: formData.country_code,
          phone: formData.phone,
          password: formData.password, 
          role,
          ...(role === 'admin' && { 
            admin_id: formData.admin_id, 
            security_passcode: formData.security_passcode 
          })
        };

    try {
      const response = await axios.post(`http://localhost:8000${endpoint}`, payload);
      setLoading(false);
      setSuccessMsg(isLogin ? 'Login successful!' : 'Account created successfully!');

      if (onSuccess) {
        setTimeout(() => {
          const userObj = response.data?.user || { role };
          onSuccess(userObj);
        }, 1000);
      }
    } catch (err) {
      setLoading(false);

      setFormData(prev => ({ 
        ...prev, 
        password: '', 
        confirmPassword: '', 
        security_passcode: '' 
      }));

      const rawMessage = err.response?.data?.message || err.response?.data?.error || '';
      const validationErrors = err.response?.data?.errors;
      const lowerMsg = rawMessage.toLowerCase();

      if (validationErrors) {
        if (validationErrors.email && validationErrors.phone) {
          setErrorMsg('This email address or phone number is already registered.');
        } else if (validationErrors.email) {
          setErrorMsg('This email address is already registered.');
        } else if (validationErrors.phone) {
          setErrorMsg('This phone number is already registered.');
        } else {
          setErrorMsg(Object.values(validationErrors)[0][0] || 'Validation error occurred.');
        }
      } 
      else if (!isLogin && lowerMsg.match(/(already|exist|taken|registered|duplicate)/)) {
        if (lowerMsg.includes('phone') && lowerMsg.includes('email')) {
          setErrorMsg('This email address or phone number is already registered.');
        } else if (lowerMsg.includes('phone')) {
          setErrorMsg('This phone number is already registered.');
        } else {
          setErrorMsg('This email address is already registered.');
        }
      } else if (!isLogin && role === 'admin' && (lowerMsg.includes('passcode') || lowerMsg.includes('admin') || lowerMsg.includes('unauthorized') || lowerMsg.includes('invalid id'))) {
        setErrorMsg('Invalid Admin ID or Security Passcode.');
      } else if (isLogin || lowerMsg.match(/(email|password|role|unauthorized|credentials)/)) {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(rawMessage || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleBackAction = () => {
    if (isLogin) {
      if (onBackHome) onBackHome();
    } else {
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative font-poppins overflow-hidden">
      
      <div className="absolute hidden lg:block top-6 left-6 z-50">
        <button onClick={handleBackAction} className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[14px] font-semibold text-gray-700 shadow-sm cursor-pointer">
          {isLogin ? '← Back To Home' : '← Back To Login'}
        </button>
      </div>

      <div ref={scrollContainerRef} className={`w-full lg:w-[55%] flex flex-col justify-start items-center px-8 sm:px-16 lg:px-24 py-10 lg:py-16 h-screen overflow-y-auto ${isLogin ? 'order-1' : 'order-2'}`}>
        <div className="w-full max-w-[420px] space-y-6 pt-4">
          
          <div className="text-center space-y-2 mt-4 lg:mt-6">
            <h1 className="text-[30px] lg:text-[35px] font-bold text-black tracking-tight">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-[20px] font-light text-[#000000]">
              {isLogin ? 'Sign in to continue your career journey' : 'Start your journey to your dream career'}
            </p>
          </div>

          <div className="flex bg-gray-100/80 p-1.5 rounded-full items-center w-[320px] mx-auto border border-gray-200 mt-[30px]">
            <button type="button" onClick={() => setRole('student')} className={`flex-1 py-2 text-[20px] font-semibold rounded-full cursor-pointer ${role === 'student' ? 'bg-white text-[#83047A] shadow-sm' : 'text-black'}`}>Student</button>
            <button type="button" onClick={() => setRole('admin')} className={`flex-1 py-2 text-[20px] font-semibold rounded-full cursor-pointer ${role === 'admin' ? 'bg-white text-[#83047A] shadow-sm' : 'text-black'}`}>Admin</button>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] sm:text-[13px] font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm animate-fade-in whitespace-nowrap">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-[12px] sm:text-[13px] font-medium py-2.5 px-3 rounded-xl flex items-center justify-center gap-2 shadow-sm animate-fade-in whitespace-nowrap">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
              <span>{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5 mt-[30px]">
            
            {!isLogin && role === 'admin' && (
              <>
                <div className="space-y-1">
                  <label className="text-[16px] font-semibold text-black block">Admin ID / Reg No</label>
                  <input type="text" name="admin_id" value={formData.admin_id} onChange={handleChange} required placeholder="Enter Admin ID (e.g. XYZ-2026-09)" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                </div>
                <div className="space-y-1">
                  <label className="text-[16px] font-semibold text-black block">Security Passcode</label>
                  <div className="relative">
                    <input type={showAdminPass ? "text" : "password"} name="security_passcode" value={formData.security_passcode} onChange={handleChange} required placeholder="Enter Security Passcode" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                    <button type="button" onClick={() => setShowAdminPass(!showAdminPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showAdminPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                  </div>
                </div>
              </>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[16px] font-semibold text-black block">Full Name</label>
                <input type="text" name="name" value={formData.name} onChange={handleChange} required placeholder="Enter Full Name" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[16px] font-semibold text-black block">Email</label>
              <input type="email" name="email" value={formData.email} onChange={handleChange} required placeholder="Enter email address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
            </div>

            {!isLogin && selectedCountry && (
              <div className="space-y-1">
                <label className="text-[16px] font-semibold text-black block">Phone Number</label>
                <div className="flex gap-2">
                  <div className="relative w-[130px] shrink-0" ref={dropdownRef}>
                    <button type="button" onClick={() => setIsCountryOpen(!isCountryOpen)} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-3 py-3.5 text-[14px] font-medium text-gray-700 flex items-center justify-between cursor-pointer">
                      <span className="truncate">{selectedCountry.flag} {selectedCountry.code}</span>
                      <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform ${isCountryOpen ? 'rotate-180' : ''}`} />
                    </button>
                    {isCountryOpen && (
                      <div className="absolute top-full left-0 mt-1 w-[260px] bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                        <div className="p-2 border-b border-gray-100 flex items-center gap-2 bg-gray-50/80">
                          <Search className="w-4 h-4 text-gray-400 shrink-0 ml-1" />
                          <input ref={searchInputRef} type="text" value={countrySearch} onChange={(e) => setCountrySearch(e.target.value)} placeholder="Search country or code..." className="w-full bg-transparent text-[13px] font-medium focus:outline-none" />
                        </div>
                        <div className="max-h-56 overflow-y-auto divide-y divide-gray-50">
                          {filteredCountries.length > 0 ? filteredCountries.map((c, idx) => (
                            <button key={idx} type="button" onClick={() => handleSelectCountry(c)} className={`w-full px-3 py-2.5 text-left text-[13px] font-medium flex items-center justify-between hover:bg-pink-50 cursor-pointer ${selectedCountry.code === c.code ? 'bg-pink-50/60 text-[#83047A] font-semibold' : 'text-gray-700'}`}>
                              <span>{c.flag} {c.name}</span>
                              <span className="text-gray-400 text-[12px] font-mono">{c.code}</span>
                            </button>
                          )) : <div className="p-3 text-center text-[12px] text-gray-400">No country found</div>}
                        </div>
                      </div>
                    )}
                  </div>
                  <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} required placeholder={selectedCountry.placeholder} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label className="text-[16px] font-semibold text-black block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required placeholder="Enter Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label className="text-[16px] font-semibold text-black block">Confirm Password</label>
                <div className="relative">
                  <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required placeholder="Enter Confirm Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between text-[15px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-black text-[14px]"><input type="checkbox" className="rounded border-gray-300 w-4 h-4" /> Remember Me</label>
                <button type="button" className="text-red-500 font-medium text-[14px] hover:underline cursor-pointer">Forgot Password?</button>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-[12px] pt-1 leading-normal text-gray-600 font-medium text-[14px]">
                <input type="checkbox" required className="rounded border-gray-300 w-4 h-4 mt-0.5 shrink-0" />
                <span>I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.</span>
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-[#890080] font-medium py-3.5 rounded-full text-[18px] tracking-wider cursor-pointer disabled:opacity-50">
              {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
            </button>
          </form>
          
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-[#ffffff] px-4 text-[16px] font-normal text-gray-500 lowercase">or continue with</span>
          </div>

          <button type="button" className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-black py-3 rounded-[20px] font-medium flex items-center justify-center gap-3 cursor-pointer shadow-sm">
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span className="font-medium text-[20px]">{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          <p className="text-center text-[15px] font-normal text-black mt-[20px]">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={() => setMode(isLogin ? 'signup' : 'login')} className="text-[#0063CC] font-normal hover:underline ml-1 cursor-pointer">{isLogin ? 'Sign Up' : 'Login'}</button>
          </p>
        </div>
      </div>

      <div className={`hidden lg:flex w-[45%] bg-[#FCEDF7] h-screen items-center justify-center relative select-none ${isLogin ? 'order-2' : 'order-1'}`}>
        <img src={AuthImage} alt="Robotic Hand Touch" className="w-full h-full object-cover mix-blend-multiply" />
      </div>

    </div>
  );
}
