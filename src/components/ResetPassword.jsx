import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, XCircle, CheckCircle2 } from 'lucide-react';
import axios from 'axios';
import AuthImage from '../assets/Authentication.PNG';

export default function ResetPassword({ email, token, onDone }) {
  const [step, setStep] = useState('new'); 
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

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

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (newPassword !== confirmPassword) {
      setErrorMsg('Passwords do not match. Please try again.');
      setNewPassword('');
      setConfirmPassword('');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:8000/api/reset-password', {
        email,
        token,
        new_password: newPassword,
      });
      setLoading(false);
      setStep('done');
      setSuccessMsg('Password reset! Redirecting to login...');
      setTimeout(() => {
        if (onDone) onDone();
      }, 2000);
    } catch (err) {
      setLoading(false);
      setNewPassword('');
      setConfirmPassword('');
      setErrorMsg(err.response?.data?.message || 'This reset link is invalid or has expired.');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative font-poppins overflow-hidden">

      <div className="absolute hidden lg:block top-6 left-6 z-50">
        <button onClick={onDone} className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-[14px] font-semibold text-gray-700 shadow-sm cursor-pointer">
          ← Back To Login
        </button>
      </div>

      <div className="w-full lg:w-[55%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-10 lg:py-16 h-screen overflow-y-auto order-1">
        <div className="w-full max-w-[420px] space-y-6">

          <div className="text-center space-y-2 mt-4 lg:mt-6">
            <h1 className="text-[30px] lg:text-[35px] font-bold text-black tracking-tight">
              Reset Password
            </h1>
            <p className="text-[20px] font-light text-[#000000]">
              {step === 'new' && 'Choose a new password for your account'}
              {step === 'done' && 'All set!'}
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

          {step === 'new' && (
            <form onSubmit={handleResetPassword} autoComplete="off" className="space-y-5 mt-[30px] animate-step-in">
              <div className="space-y-1">
                <label htmlFor="reset-new-password" className="text-[16px] font-semibold text-black block">New Password</label>
                <div className="relative">
                  <input id="reset-new-password" type={showNew ? 'text' : 'password'} value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="Enter new password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                  <button type="button" onClick={() => setShowNew(!showNew)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showNew ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <div className="space-y-1">
                <label htmlFor="reset-confirm-password" className="text-[16px] font-semibold text-black block">Confirm New Password</label>
                <div className="relative">
                  <input id="reset-confirm-password" type={showConfirm ? 'text' : 'password'} value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required minLength={6} autoComplete="new-password" placeholder="Re-enter new password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-[14px] font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 placeholder-gray-400" />
                  <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer">{showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button>
                </div>
              </div>
              <button type="submit" disabled={loading} className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-[#890080] font-medium py-3.5 rounded-full text-[18px] tracking-wider cursor-pointer disabled:opacity-50">
                {loading ? 'Saving...' : 'Reset Password'}
              </button>
            </form>
          )}

          {step === 'done' && (
            <div className="flex items-center justify-center mt-[30px]">
              <CheckCircle2 className="w-12 h-12 text-green-500 animate-step-in" />
            </div>
          )}

          <p className="text-center text-[15px] font-normal text-black mt-[20px]">
            Remembered your password?{' '}
            <button type="button" onClick={onDone} className="text-[#0063CC] font-normal hover:underline ml-1 cursor-pointer">Login</button>
          </p>
        </div>
      </div>

      <div className="hidden lg:flex w-[45%] bg-[#FCEDF7] h-screen items-center justify-center relative select-none order-2">
        <img src={AuthImage} alt="Robotic Hand Touch" className="w-full h-full object-cover mix-blend-multiply" />
      </div>

    </div>
  );
}
