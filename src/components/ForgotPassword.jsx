import React, { useState, useEffect } from 'react';
import { CheckCircle2, XCircle } from 'lucide-react';
import axios from 'axios';
import AuthImage from '../assets/Authentication.PNG';

export default function ForgotPassword({ role, onBackToLogin }) {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  useEffect(() => {
    if (!errorMsg) return;
    const timer = setTimeout(() => setErrorMsg(''), 5000);
    return () => clearTimeout(timer);
  }, [errorMsg]);

  useEffect(() => {
    if (!successMsg) return;
    const timer = setTimeout(() => setSuccessMsg(''), 5000);
    return () => clearTimeout(timer);
  }, [successMsg]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/forgot-password', { email });
      setLoading(false);
      setSuccessMsg("If that email exists, we've sent a reset link.");
    } catch (err) {
      setLoading(false);
      setErrorMsg(err.response?.data?.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative font-poppins overflow-hidden">

      <div className="absolute hidden lg:block top-6 left-6 z-50">
        <button onClick={onBackToLogin} className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[14px] font-semibold text-gray-700 shadow-sm cursor-pointer">
          ← Back To Login
        </button>
      </div>

      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-10 lg:py-16 h-screen overflow-y-auto order-1">
        <div className="w-full max-w-[420px] space-y-6">

          <div className="text-center space-y-2 mt-4 lg:mt-6">
            <h1 className="text-[30px] lg:text-[35px] font-bold text-black tracking-tight">
              Forgot Password?
            </h1>
            <p className="text-[20px] font-light text-[#000000]">
              {role === 'admin'
                ? 'Enter your admin email to reset your password'
                : 'Enter your email to reset your password'}
            </p>
          </div>

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-[12px] sm:text-[13px] font-medium py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm animate-fade-in mt-[30px]">
              <XCircle className="w-4 h-4 sm:w-5 sm:h-5 text-red-600 shrink-0" />
              <span className="text-center leading-snug">{errorMsg}</span>
            </div>
          )}

          {successMsg && (
            <div className="bg-green-50 border border-green-200 text-green-700 text-[12px] sm:text-[13px] font-medium py-2.5 px-3.5 rounded-xl flex items-center justify-center gap-2 shadow-sm animate-fade-in mt-[30px]">
              <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 shrink-0" />
              <span className="text-center leading-snug">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5 mt-[30px]">

            <div className="space-y-1">
              <label className="text-[16px] font-semibold text-black block">Email</label>
              <input type="email" name="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="username" placeholder="Enter email address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
            </div>

            <button type="submit" disabled={loading} className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-[#890080] font-medium py-3.5 rounded-full text-[18px] tracking-wider cursor-pointer disabled:opacity-50">
              {loading ? 'Processing...' : 'Send Reset Link'}
            </button>
          </form>

          <p className="text-center text-[15px] font-normal text-black mt-[20px]">
            Remembered your password?{' '}
            <button type="button" onClick={onBackToLogin} className="text-[#0063CC] font-normal hover:underline ml-1 cursor-pointer">Login</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-[45%] bg-[#FCEDF7] h-screen items-center justify-center relative select-none order-2">
        <img src={AuthImage} alt="Robotic Hand Touch" className="w-full h-full object-cover mix-blend-multiply" />
      </div>

    </div>
  );
}
