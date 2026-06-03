import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import HomeImage from '../assets/Home.png'; 

export default function LandingPage({ onNavigate }) {
  return (
    <div className="min-h-screen bg-[#030712] text-white font-poppins antialiased selection:bg-fuchsia-500/30 overflow-x-hidden relative flex flex-col justify-between">
      
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700;800&display=swap');
          .font-poppins {
            font-family: 'Poppins', sans-serif;
          }
        `}
      </style>

      <div className="absolute inset-0 z-0">
        <img 
          src={HomeImage} 
          alt="Futuristic Robot Matrix Backdrop" 
          className="w-full h-full object-cover object-center brightness-[0.8]"
        />
        <div className="absolute inset-0 bg-black/40"></div>
      </div>

      <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none z-10"></div>
      <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-fuchsia-500/15 blur-[150px] rounded-full pointer-events-none z-10"></div>

      <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between relative z-30">
        <div className="flex items-center select-none cursor-pointer" onClick={() => onNavigate('home')}>
          <img 
            src="/logoo.png" 
            alt="CareerPath AI Logo" 
            className="h-10 sm:h-12 lg:h-16 w-auto object-contain transition-transform hover:scale-105" 
          />
        </div>

        <div className="hidden sm:block">
          <span className="text-xs text-gray-400 font-semibold tracking-widest uppercase bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full backdrop-blur-md">
            Secure AI Gateway
          </span>
        </div>
      </header>

      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-6 pb-12 space-y-12 relative z-20 flex-1 flex flex-col justify-center">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center my-auto">
          
          <div className="col-span-1 lg:col-span-7 xl:col-span-6">
            <div className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-12 shadow-[0_30px_80px_-15px_rgba(0,0,0,0.8)] space-y-6 sm:space-y-8 animate-fadeIn">
              
              <h1 className="text-4xl sm:text-5xl xl:text-6xl font-extrabold tracking-tight leading-[1.12] text-white font-poppins">
                Your Dream Career with AI Guidance
              </h1>
              
              <p className="text-base sm:text-lg text-gray-200 font-medium tracking-wide leading-relaxed max-w-xl">
                Your personal co-pilot for professional growth. We analyze your interests and skills to build a customized roadmap that leads you to success.
              </p>

              <div className="pt-2">
                <button 
                  onClick={() => onNavigate('login')} 
                  className="w-full sm:w-auto px-8 py-4 rounded-full bg-[#f08fe7] hover:bg-[#fa9eed] text-gray-950 text-base font-extrabold tracking-wide transition-all duration-300 shadow-[0_4px_25px_rgba(217,70,239,0.4)] hover:shadow-[0_6px_30px_rgba(217,70,239,0.75)] cursor-pointer hover:scale-[1.01]"
                >
                  Find My Career Path
                </button>
              </div>

            </div>
          </div>

          <div className="hidden lg:grid lg:col-span-5 xl:col-span-6 h-10 select-none pointer-events-none"></div>
        </div>

        <div className="w-full bg-black/45 backdrop-blur-lg border border-white/10 rounded-[24px] p-6 sm:p-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-6 shadow-[0_20px_50px_rgba(0,0,0,0.5)]">
          
          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide font-poppins">Find Your Path</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed pl-6">
              Let AI match your interests with the most rewarding career options
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide font-poppins">Quick Quiz</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed pl-6">
              Answer a few logical questions to unlock personalized career insights.
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide font-poppins">Growth Maps</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed pl-6">
              Get a step-by-step learning guide to reach your professional goals.
            </p>
          </div>

          <div className="space-y-3 group cursor-pointer" onClick={() => onNavigate('login')}>
            <div className="flex items-center gap-2 text-cyan-400 font-bold">
              <ArrowUpRight size={18} className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              <h3 className="text-base sm:text-lg font-bold text-gray-200 tracking-wide font-poppins">Skill Checker</h3>
            </div>
            <p className="text-sm text-gray-400 font-medium tracking-wide leading-relaxed pl-6">
              Identify exactly which courses and skills you need to stay competitive.
            </p>
          </div>

        </div>

      </main>
    </div>
  );
}