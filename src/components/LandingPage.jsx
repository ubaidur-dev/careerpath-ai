import React from 'react';
import { ArrowUpRight } from 'lucide-react';

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-sans antialiased selection:bg-fuchsia-500/30 overflow-x-hidden relative">
      
      <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[50%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[50%] h-[50%] bg-purple-500/10 blur-[150px] rounded-full pointer-events-none"></div>

      <header className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between relative z-20">
        <div className="flex items-center gap-2 select-none cursor-pointer" onClick={() => onNavigate('home')}>
          <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.7)]"></span>
          <span className="text-sm font-bold uppercase tracking-[0.2em] text-gray-200">AI.PATH</span>
        </div>

        <div className="hidden sm:block">
          <span className="text-xs text-gray-500 font-medium tracking-widest uppercase">Secure AI Gateway</span>
        </div>
      </header>

      <main className="w-full max-w-[1440px] mx-auto px-6 sm:px-12 lg:px-16 pt-10 pb-20 space-y-16 relative z-10 flex flex-col justify-between min-h-[calc(100vh-90px)]">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
          <div className="grid col-span-1 lg:col-span-7 xl:col-span-6">
            
            <div className="w-full bg-white/[0.03] backdrop-blur-2xl border border-white/[0.08] rounded-[32px] p-8 sm:p-12 shadow-[0_30px_70px_-15px_rgba(0,0,0,0.8)] space-y-6 sm:space-y-8 animate-fadeIn">
              
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-bold tracking-tight leading-[1.12] text-white">
                Your Dream Career with AI Guidance
              </h1>
              
              <p className="text-base sm:text-lg text-gray-400 font-normal tracking-wide leading-relaxed max-w-xl">
                Your personal co-pilot for professional growth. We analyze your interests and skills to build a customized roadmap that leads you to success.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('login')} // Sends user directly to login screen
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-linear-to-r from-fuchsia-400 to-pink-500 hover:from-fuchsia-500 hover:to-pink-600 text-white text-base font-extrabold tracking-wide transition-all duration-300 shadow-[0_4px_25px_rgba(217,70,239,0.35)] hover:shadow-[0_6px_30px_rgba(217,70,239,0.6)] cursor-pointer hover:scale-[1.01]"
                >
                  Find My Career Path
                </button>
              </div>

            </div>

          </div>

          <div className="hidden lg:grid lg:col-span-5 xl:col-span-6 justify-center items-center opacity-30 select-none pointer-events-none">
            <div className="w-[450px] h-[350px] border border-dashed border-gray-800 rounded-3xl flex items-center justify-center">
              <span className="text-xs font-mono text-gray-600">3D Futuristic Blockchain Space</span>
            </div>
          </div>
        </div>

        <div className="w-full bg-white/[0.01] backdrop-blur-xl border border-white/[0.05] rounded-[24px] p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 shadow-2xl">
          
          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide">Find Your Path</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium tracking-wide leading-relaxed pl-6">
              Let AI match your interests with the most rewarding career options
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide">Quick Quiz</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium tracking-wide leading-relaxed pl-6">
              Answer a few logical questions to unlock personalized career insights.
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide">Growth Maps</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium tracking-wide leading-relaxed pl-6">
              Get a step-by-step learning guide to reach your professional goals.
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide">Skill Checker</h3>
            </div>
            <p className="text-sm text-gray-500 font-medium tracking-wide leading-relaxed pl-6">
              Identify exactly which courses and skills you need to stay competitive.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}