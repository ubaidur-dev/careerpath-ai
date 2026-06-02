import React, { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function AuthPage({ mode, setMode, onSuccess, onBackHome }) {
  const [role, setRole] = useState('student'); // 'student' | 'admin'
  const [showPass, setShowPass] = useState(false);
  const isLogin = mode === 'login';

  const handleFormSubmit = (e) => {
    e.preventDefault();
    onSuccess(role);
  };

  return (
    <div className="min-h-screen bg-[#fef9f9] flex flex-col md:flex-row relative animate-fadeIn">
      <button onClick={onBackHome} className="absolute top-5 left-5 text-xs font-bold tracking-wider text-gray-500 hover:text-black transition-all cursor-pointer z-50">
        ← BACK TO HOME
      </button>

      <div className={`w-full md:w-1/2 flex items-center justify-center p-6 sm:p-12 md:p-16 bg-white ${isLogin ? 'order-1' : 'order-2'}`}>
        <div className="w-full max-w-[420px] space-y-6">
          <div className="text-center space-y-1.5">
            <h2 className="text-3xl font-bold tracking-tight text-gray-900">
              {isLogin ? 'Welcome Back' : 'Create Your Account'}
            </h2>
            <p className="text-sm text-gray-500">
              {isLogin ? 'Sign in to continue your career journey' : 'Start your journey to your dream career'}
            </p>
          </div>

          {isLogin && (
            <div className="flex justify-center pt-1">
              <div className="bg-[#f3f4f6] p-1 rounded-full flex items-center w-[240px] border border-gray-200">
                <button
                  type="button"
                  onClick={() => setRole('student')}
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer ${role === 'student' ? 'bg-white text-purple-700 shadow-xs font-bold' : 'text-gray-700'}`}
                >
                  Student
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`flex-1 py-1.5 text-sm font-semibold rounded-full transition-all cursor-pointer ${role === 'admin' ? 'bg-white text-gray-900 shadow-xs font-bold' : 'text-gray-700'}`}
                >
                  Admin
                </button>
              </div>
            </div>
          )}

          <form onSubmit={handleFormSubmit} className="space-y-4 pt-1">
            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Full Name</label>
                <input type="text" required placeholder="Enter Full Name" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all" />
              </div>
            )}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Email</label>
              <input type="email" required placeholder="Enter email address" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all" />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Password</label>
              <div className="relative">
                <input type={showPass ? "text" : "password"} required placeholder="Enter Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl pl-4 pr-10 py-3 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all" />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 cursor-pointer">
                  {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {!isLogin && (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wide block">Confirm Password</label>
                <div className="relative">
                  <input type="password" required placeholder="Enter Confirm Password" className="w-full bg-gray-50/50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-pink-400 focus:bg-white transition-all" />
                </div>
              </div>
            )}

            {isLogin ? (
              <div className="flex items-center justify-between text-xs pt-1">
                <label className="flex items-center gap-1.5 cursor-pointer font-medium text-gray-600 select-none">
                  <input type="checkbox" className="rounded border-gray-300 accent-pink-400 cursor-pointer w-3.5 h-3.5" />
                  Remember Me
                </label>
                <button type="button" className="text-red-500 font-bold hover:underline cursor-pointer">Forgot Password?</button>
              </div>
            ) : (
              <div className="flex items-start gap-2 text-xs pt-1 leading-normal text-gray-600">
                <input type="checkbox" required className="rounded border-gray-300 accent-pink-400 cursor-pointer mt-0.5 w-3.5 h-3.5 shrink-0" />
                <span>I agree to the <span className="text-blue-600 hover:underline cursor-pointer">Terms of Service</span> and <span className="text-blue-600 hover:underline cursor-pointer">Privacy Policy</span>.</span>
              </div>
            )}

            <button type="submit" className="w-full bg-[#fbc2eb] sm:bg-[#ffb7f5] hover:bg-[#fa9eed] text-gray-800 font-bold py-3.5 rounded-full text-sm tracking-wide transition-all shadow-xs mt-3 cursor-pointer">
              {isLogin ? 'Sign In' : 'Create Account'}
            </button>
          </form>

          <div className="relative flex items-center justify-center py-1">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-100"></div></div>
            <span className="relative bg-white px-3 text-[11px] font-medium text-gray-400 uppercase tracking-widest">or continue with</span>
          </div>

          <button type="button" onClick={() => onSuccess(role)} className="w-full border border-gray-200 bg-white hover:bg-gray-50 text-gray-700 py-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer shadow-xs">
            <svg className="w-4 h-4" viewBox="0 0 24 24"><path fill="#EA4335" d="M12 5.04c1.64 0 3.12.56 4.28 1.67l3.2-3.2C17.52 1.58 14.92 1 12 1 7.35 1 3.32 3.68 1.32 7.6l3.78 2.93c.88-2.65 3.38-4.49 6.9-4.49z"/><path fill="#4285F4" d="M23.49 12.27c0-.81-.07-1.59-.2-2.36H12v4.51h6.46c-.28 1.48-1.12 2.73-2.38 3.58l3.7 2.87c2.16-2 3.41-4.94 3.41-8.6z"/><path fill="#FBBC05" d="M5.1 14.73c-.24-.73-.38-1.51-.38-2.33s.14-1.6.38-2.33L1.32 7.14C.48 8.8 0 10.65 0 12.6s.48 3.8 1.32 5.46l3.78-3.33z"/><path fill="#34A853" d="M12 23c3.24 0 5.97-1.07 7.96-2.91l-3.7-2.87c-1.03.69-2.35 1.11-4.26 1.11-3.52 0-6.02-1.84-6.9-4.49L1.32 16.77C3.32 20.68 7.35 23 12 23z"/></svg>
            <span className="font-bold">{isLogin ? 'Sign in with Google' : 'Sign up with Google'}</span>
          </button>

          <p className="text-center text-xs font-medium text-gray-500">
            {isLogin ? "Don't have an account?" : "Already have an account?"}{' '}
            <button type="button" onClick={() => setMode(isLogin ? 'signup' : 'login')} className="text-blue-600 font-bold hover:underline ml-0.5 cursor-pointer">
              {isLogin ? 'Sign Up' : 'Login'}
            </button>
          </p>
        </div>
      </div>

      <div className={`hidden md:flex w-1/2 bg-pink-50/40 items-center justify-center p-8 relative overflow-hidden select-none ${isLogin ? 'order-2' : 'order-1'}`}>
        <div className="w-[85%] max-w-[480px] h-auto aspect-square relative flex items-center justify-center">
          <div className="absolute inset-0 bg-radial from-pink-200/50 to-transparent blur-2xl"></div>
          <span className="text-xs font-mono text-pink-400 tracking-widest uppercase">Robotic Cyber Matrix Render</span>
        </div>
      </div>
    </div>
  );
}