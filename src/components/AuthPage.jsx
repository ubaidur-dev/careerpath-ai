import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import AuthImage from '../assets/Authentication.PNG'; 

export default function AuthPage({ mode, setMode, onSuccess, onBackHome }) {
  const [role, setRole] = useState('student'); 
  const [showPass, setShowPass] = useState(false);
  const isLogin = mode === 'login';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (onSuccess) onSuccess(role);
  };

  // Dynamic handler for the top navigation button
  const handleBackAction = () => {
    if (isLogin) {
      if (onBackHome) onBackHome();
    } else {
      setMode('login');
    }
  };

  return (
    <div className="min-h-screen bg-white flex flex-col lg:flex-row relative font-poppins overflow-hidden">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght=400;500;600;700&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      <div className="absolute hidden lg:block top-6 left-6 z-50">
        <button 
          onClick={handleBackAction} 
          className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-colors shadow-sm cursor-pointer"
        >
          {isLogin ? '← Back To Home' : '← Back To Login'}
        </button>
      </div>

      <div className={`w-full lg:w-[55%] flex flex-col justify-center items-center px-8 sm:px-16 lg:px-24 py-12 h-screen overflow-y-auto ${isLogin ? 'order-1' : 'order-2'}`}>
        <div className="w-full max-w-[420px] space-y-6">
          
          <div className="block lg:hidden w-full mb-2">
            <button 
              onClick={handleBackAction} 
              className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 transition-colors shadow-sm cursor-pointer"
            >
              {isLogin ? '← Back To Home' : '← Back To Login'}
            </button>
          </div>

          <div className="text-center space-y-2">
            <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h1>
            <p className="text-sm text-gray-500 font-medium">
              {isLogin ? 'Sign in to continue your career journey' : 'Start your journey to your dream career'}
            </p>
          </div>

          {isLogin && (
            <div className="flex bg-gray-100/80 p-1.5 rounded-full items-center w-[250px] mx-auto border border-gray-200">
              <button
                type="button"
                onClick={() => setRole('student')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
                  role === 'student' 
                    ? 'bg-white text-[#bd24df] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Student
              </button>
              <button
                type="button"
                onClick={() => setRole('admin')}
                className={`flex-1 py-2 text-sm font-bold rounded-full transition-all cursor-pointer ${
                  role === 'admin' 
                    ? 'bg-white text-[#bd24df] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-900'
                }`}
              >
                Admin
              </button>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-5">
            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Full Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Enter Full Name" 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all placeholder-gray-400" 
                />
              </div>
            )}

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Email</label>
              <input 
                type="email" 
                required 
                placeholder="Enter email address" 
                className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all placeholder-gray-400" 
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Password</label>
              <div className="relative">
                <input 
                  type={showPass ? "text" : "password"} 
                  required 
                  placeholder="Enter Password" 
                  className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-12 py-3.5 text-sm font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all placeholder-gray-400" 
                />
                <button 
                  type="button" 
                  onClick={() => { setShowPass(!showPass); }} 
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  {showPass ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-800 uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <input 
                    type="password" 
                    required 
                    placeholder="Enter Confirm Password" 
                    className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 transition-all placeholder-gray-400" 
                  />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-2 cursor-pointer font-bold text-gray-600 select-none">
                  <input type="checkbox" className="rounded border-gray-300 accent-pink-400 cursor-pointer w-4 h-4" />
                  Remember Me
                </label>
                <button type="button" className="text-red-500 font-bold hover:underline cursor-pointer">Forgot Password?</button>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs pt-1 leading-normal text-gray-600 font-bold">
                <input type="checkbox" required className="rounded border-gray-300 accent-pink-400 cursor-pointer mt-0.5 w-4 h-4 shrink-0" />
                <span>
                  I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.
                </span>
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-[#ffa3f5] hover:bg-[#f88def] text-gray-900 font-bold py-3.5 rounded-full text-sm tracking-wider transition-all shadow-sm mt-4 cursor-pointer"
            >
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>
          
          <div className="relative flex items-center justify-center py-2">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
            <span className="relative bg-white px-4 text-xs font-bold text-gray-400 uppercase tracking-widest">or continue with</span>
          </div>

          <button 
            type="button" 
            onClick={() => { if (onSuccess) onSuccess(role); }} 
            className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-full font-bold text-sm flex items-center justify-center gap-3 transition-all cursor-pointer shadow-sm"
          >
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="Google" className="w-5 h-5" />
            <span>{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          <p className="text-center text-sm font-bold text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button 
              type="button" 
              onClick={() => setMode(isLogin ? 'signup' : 'login')} 
              className="text-blue-600 font-bold hover:underline ml-1 cursor-pointer"
            >
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <div className={`hidden lg:flex w-[45%] bg-[#FCEDF7] h-screen items-center justify-center relative select-none ${isLogin ? 'order-2' : 'order-1'}`}>
        <img 
          src={AuthImage} 
          alt="Robotic Hand Touch" 
          className="w-full h-full object-cover mix-blend-multiply" 
        />
      </div>

    </div>
  );
}
