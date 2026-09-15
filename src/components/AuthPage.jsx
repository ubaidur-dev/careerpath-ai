import React, { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, XCircle, CheckCircle2, ChevronDown, Search } from 'lucide-react';
import axios from 'axios';
import AuthImage from '../assets/Authentication.PNG'; 

export default function AuthPage({ mode, setMode, onBackHome, onForgotPassword }) {
  const [role, setRole] = useState('student'); 
  const [showPass, setShowPass] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
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

  const [adminAuthStep, setAdminAuthStep] = useState('email');
  const [otpDigits, setOtpDigits] = useState(['', '', '', '', '']);
  const otpRefs = useRef([]);
  const inAdminGate = isLogin && role === 'admin' && adminAuthStep !== 'credentials';

  useEffect(() => {
    if (adminAuthStep === 'otp' && otpRefs.current[0]) {
      otpRefs.current[0].focus();
    }
  }, [adminAuthStep]);

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

    setFormData(prev => ({
      name: '',
      email: '',
      country_code: prev.country_code,
      phone: '',
      password: '',
      confirmPassword: '',
      admin_id: '',
      security_passcode: ''
    }));

    setAdminAuthStep('email');
    setOtpDigits(['', '', '', '', '']);
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
    if (successMsg) {
      const timer = setTimeout(() => setSuccessMsg(''), 5000);
      return () => clearTimeout(timer);
    }
  }, [successMsg]);

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

  const toTitleCase = (value) =>
    value.toLowerCase().replace(/(^|[\s'-])(\p{L})/gu, (_, sep, char) => sep + char.toUpperCase());

  const handleChange = (e) => {
    const { value } = e.target;
  
    const field = e.target.dataset.field || e.target.name;
    setFormData(prev => ({
      ...prev,
      [field]: field === 'name' ? toTitleCase(value) : value,
    }));
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
      ? {
          email: formData.email,
          password: formData.password,
          role,
          ...(role === 'admin' && { admin_id: formData.admin_id })
        }
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

      if (response.data?.login_history_id) {
        sessionStorage.setItem('login_history_id', response.data.login_history_id);
      }

      if (response.data?.token) {
        sessionStorage.setItem('token', response.data.token);
      }
      if (response.data?.user) {
        sessionStorage.setItem('user', JSON.stringify(response.data.user));
      }

      if (response.data?.token) {
        setTimeout(() => {
        
          window.location.reload();
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
      } else if (isLogin && role === 'admin' && lowerMsg.includes('admin id')) {
        setErrorMsg('Invalid Admin ID for this account.');
      } else if (isLogin || lowerMsg.match(/(email|password|role|unauthorized|credentials)/)) {
        setErrorMsg('Invalid email or password.');
      } else {
        setErrorMsg(rawMessage || 'An unexpected error occurred. Please try again.');
      }
    }
  };

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/admin/otp/request', { email: formData.email });
      setLoading(false);
      setSuccessMsg('Verification code sent to your email.');
      setAdminAuthStep('otp');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Failed to send verification code. Please try again.');
    }
  };

  const handleResendOtp = async () => {
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/admin/otp/request', { email: formData.email });
      setLoading(false);
      setSuccessMsg('A new verification code has been sent.');
      setOtpDigits(['', '', '', '', '']);
      if (otpRefs.current[0]) otpRefs.current[0].focus();
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Failed to resend verification code.');
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    const code = otpDigits.join('');
    if (code.length !== 5) {
      setErrorMsg('Please enter the 5-digit verification code.');
      return;
    }
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/admin/otp/verify', { email: formData.email, code });
      setLoading(false);
      setSuccessMsg('');
      setAdminAuthStep('credentials');
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Invalid or expired verification code.');
    }
  };

  const handleOtpDigitChange = (index, rawValue) => {
    const value = rawValue.replace(/\D/g, '').slice(-1);
    setOtpDigits((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
    if (value && index < otpDigits.length - 1 && otpRefs.current[index + 1]) {
      otpRefs.current[index + 1].focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otpDigits[index] && index > 0 && otpRefs.current[index - 1]) {
      otpRefs.current[index - 1].focus();
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

          {inAdminGate && adminAuthStep === 'email' && (
            <form onSubmit={handleRequestOtp} autoComplete="off" className="space-y-5 mt-[30px]">
              <div className="space-y-1">
                <label htmlFor="admin-gate-email" className="text-[16px] font-semibold text-black block">Admin Email</label>
                <input id="admin-gate-email" type="email" name="admin_gate_email" data-field="email" value={formData.email} onChange={handleChange} required autoComplete="username" placeholder="Enter your registered admin email" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
              </div>
              <p className="text-[13px] text-gray-500 leading-relaxed">For security, we'll email a verification code to confirm it's really you before showing the admin login form.</p>
              <button type="submit" disabled={loading} className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-[#890080] font-medium py-3.5 rounded-full text-[18px] tracking-wider cursor-pointer disabled:opacity-50">
                {loading ? 'Sending...' : 'Send Verification Code'}
              </button>
            </form>
          )}

          {inAdminGate && adminAuthStep === 'otp' && (
            <form onSubmit={handleVerifyOtp} autoComplete="off" className="space-y-5 mt-[30px]">
              <div className="space-y-2">
                <label className="text-[16px] font-semibold text-black block">Verification Code</label>
                <p className="text-[13px] text-gray-500">Enter the 5-digit code sent to <span className="font-semibold text-black">{formData.email}</span></p>
                <div className="flex items-center justify-center gap-3 pt-2">
                  {otpDigits.map((digit, idx) => (
                    <input
                      key={idx}
                      ref={(el) => (otpRefs.current[idx] = el)}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handleOtpDigitChange(idx, e.target.value)}
                      onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                      className="w-12 h-14 text-center text-[22px] font-bold bg-gray-50/50 border border-gray-200 rounded-xl focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300"
                    />
                  ))}
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-[#890080] font-medium py-3.5 rounded-full text-[18px] tracking-wider cursor-pointer disabled:opacity-50">
                {loading ? 'Verifying...' : 'Verify Code'}
              </button>
              <div className="flex items-center justify-between text-[14px] pt-1">
                <button type="button" onClick={() => { setAdminAuthStep('email'); setOtpDigits(['', '', '', '', '']); }} className="text-gray-500 font-medium hover:underline cursor-pointer">Change email</button>
                <button type="button" onClick={handleResendOtp} disabled={loading} className="text-[#0063CC] font-medium hover:underline cursor-pointer disabled:opacity-50">Resend Code</button>
              </div>
            </form>
          )}

          {!inAdminGate && (
          <>
          <form key={`${role}-${mode}`} onSubmit={handleFormSubmit} autoComplete="off" className="space-y-5 mt-[30px]">

            {role === 'admin' && (
              <>
                <div className="space-y-1">
                  <label htmlFor={`${role}-${mode}-admin_id`} className="text-[16px] font-semibold text-black block">Admin ID</label>
                  <input id={`${role}-${mode}-admin_id`} type="text" name={`admin_id_${mode}`} data-field="admin_id" value={formData.admin_id} onChange={handleChange} required autoComplete="off" placeholder="Enter Admin ID" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                </div>
                {!isLogin && (
                  <div className="space-y-1">
                    <label htmlFor={`${role}-${mode}-security_passcode`} className="text-[16px] font-semibold text-black block">Security Passcode</label>
                    <div className="relative">
                      <input id={`${role}-${mode}-security_passcode`} type={showAdminPass ? "text" : "password"} name="admin_security_passcode" data-field="security_passcode" value={formData.security_passcode} onChange={handleChange} required autoComplete="new-password" placeholder="Enter Security Passcode" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                      <button type="button" onClick={() => setShowAdminPass(!showAdminPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showAdminPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                    </div>
                  </div>
                )}
              </>
            )}

            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor={`${role}-${mode}-name`} className="text-[16px] font-semibold text-black block">Full Name</label>
                <input id={`${role}-${mode}-name`} type="text" name={`${role}_name`} data-field="name" value={formData.name} onChange={handleChange} required autoCapitalize="words" autoComplete="name" placeholder="Enter Full Name" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor={`${role}-${mode}-email`} className="text-[16px] font-semibold text-black block">Email</label>
              <input id={`${role}-${mode}-email`} type="email" name={`${role}_email`} data-field="email" value={formData.email} onChange={handleChange} required autoComplete={isLogin ? 'username' : 'email'} placeholder="Enter email address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
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
                  <input type="tel" name="phone" value={formData.phone} onChange={handlePhoneChange} required autoComplete="tel-national" placeholder={selectedCountry.placeholder} className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                </div>
              </div>
            )}

            <div className="space-y-1">
              <label htmlFor={`${role}-${mode}-password`} className="text-[16px] font-semibold text-black block">Password</label>
              <div className="relative">
                <input id={`${role}-${mode}-password`} type={showPass ? "text" : "password"} name={`${role}_password`} data-field="password" value={formData.password} onChange={handleChange} required autoComplete={isLogin ? 'current-password' : 'new-password'} placeholder="Enter Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1">
                <label htmlFor={`${role}-${mode}-confirmPassword`} className="text-[16px] font-semibold text-black block">Confirm Password</label>
                <div className="relative">
                  <input id={`${role}-${mode}-confirmPassword`} type={showConfirmPass ? "text" : "password"} name={`${role}_confirm_password`} data-field="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required autoComplete="new-password" placeholder="Enter Confirm Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                  <button type="button" onClick={() => setShowConfirmPass(!showConfirmPass)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showConfirmPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between text-[15px] pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-black text-[14px]"><input type="checkbox" className="rounded border-gray-300 w-4 h-4" /> Remember Me</label>
                <button type="button" onClick={() => onForgotPassword && onForgotPassword(role)} className="text-red-500 font-medium text-[14px] hover:underline cursor-pointer">Forgot Password?</button>
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
          </>
          )}
        </div>
      </div>

      <div className={`hidden lg:flex w-[45%] bg-[#FCEDF7] h-screen items-center justify-center relative select-none ${isLogin ? 'order-2' : 'order-1'}`}>
        <img src={AuthImage} alt="Robotic Hand Touch" className="w-full h-full object-cover mix-blend-multiply" />
      </div>

    </div>
  );
}
