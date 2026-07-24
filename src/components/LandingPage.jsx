import React from 'react';
import { ArrowUpRight, LogIn, Mail, MapPin, Phone } from 'lucide-react';
import HomeImage from '../assets/Home.png'; 

export default function LandingPage({ onNavigate }) {
  const scrollToSection = (sectionId) => {
    if (sectionId === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      const element = document.getElementById(sectionId);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

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

      <div id="home" className="relative overflow-hidden bg-[#030712]">
        
        <div className="absolute inset-0 z-0">
          <img 
            src={HomeImage} 
            alt="Futuristic Robot Matrix Backdrop" 
            className="w-full h-full object-cover object-center brightness-[0.8]"
          />
          <div className="absolute inset-0 bg-black/60"></div>
        </div>

        <div className="absolute top-[-5%] left-[-5%] w-[50%] h-[40%] bg-blue-500/10 blur-[130px] rounded-full pointer-events-none z-10"></div>
        <div className="absolute bottom-[5%] right-[-5%] w-[40%] h-[40%] bg-fuchsia-500/15 blur-[150px] rounded-full pointer-events-none z-10"></div>

        <header className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-6 flex items-center justify-between relative z-30">
          <div className="flex items-center select-none cursor-pointer" onClick={() => scrollToSection('home')}>
            <img 
              src="/logoo.png" 
              alt="CareerPath AI Logo" 
              className="h-10 sm:h-12 lg:h-16 w-auto object-contain transition-transform hover:scale-105" 
            />
          </div>

          <div className="flex items-center gap-8 lg:gap-12">
            <nav className="hidden md:flex items-center gap-8 text-base lg:text-lg font-semibold text-gray-200">
              <button 
                onClick={() => scrollToSection('home')} 
                className="relative pb-1 hover:text-white transition cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f08fe7] hover:after:w-full after:transition-all duration-300"
              >
                Home
              </button>
              <button 
                onClick={() => scrollToSection('about')} 
                className="relative pb-1 hover:text-white transition cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f08fe7] hover:after:w-full after:transition-all duration-300"
              >
                About Us
              </button>
              <button 
                onClick={() => scrollToSection('goal')} 
                className="relative pb-1 hover:text-white transition cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f08fe7] hover:after:w-full after:transition-all duration-300"
              >
                Our Goal
              </button>
              <button 
                onClick={() => scrollToSection('contact')} 
                className="relative pb-1 hover:text-white transition cursor-pointer after:absolute after:bottom-0 after:left-0 after:w-0 after:h-[2px] after:bg-[#f08fe7] hover:after:w-full after:transition-all duration-300"
              >
                Contact Us
              </button>
            </nav>

            <button 
              onClick={() => onNavigate('login')} 
              className="flex items-center gap-2 px-7 py-3 rounded-full text-base lg:text-lg font-bold bg-[#f08fe7] hover:bg-[#fa9eed] text-gray-950 shadow-[0_0_25px_rgba(240,143,231,0.5)] transition cursor-pointer hover:scale-105"
            >
              <LogIn size={20} />
              <span>Login</span>
            </button>
          </div>
        </header>

        <div className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 pt-6 pb-20 space-y-20 relative z-20">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
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

        </div>
      </div>

      <main className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-16 space-y-20 relative z-20 flex-1">
        
        <section id="about" className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">About Us</h2>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                CareerPath AI Careers is a pioneering platform dedicated to revolutionizing professional development through advanced artificial intelligence and predictive analytics. Founded by industry experts and AI researchers, our goal is to eliminate career ambiguity by pairing individuals with global career pathways in real-time. By combining hyper-personalized career planning, live mentoring curves, and market-driven insights, we empower students, career switchers, and seasoned professionals to achieve their ultimate career ambitions with absolute precision.
              </p>
            </div>
            
            <div className="lg:col-span-5 flex justify-center items-center">
              <div className="w-60 h-60 rounded-full bg-gradient-to-tr from-cyan-500/20 via-fuchsia-500/20 to-blue-600/30 border border-white/20 flex items-center justify-center relative shadow-[0_0_60px_rgba(34,211,238,0.25)] animate-pulse">
                <div className="absolute inset-2 rounded-full border border-dashed border-cyan-400/40 animate-spin" style={{ animationDuration: '25s' }}></div>
                <div className="text-center space-y-1 z-10">
                  <div className="w-16 h-16 mx-auto rounded-full bg-cyan-500/20 border border-cyan-400/50 flex items-center justify-center text-cyan-300 font-extrabold text-xl shadow-[0_0_20px_rgba(34,211,238,0.5)]">
                    AI
                  </div>
                  <span className="text-xs font-semibold text-gray-300 tracking-wider uppercase block pt-2">Global Network</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="goal" className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-12 space-y-8">
          <div>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              Our Goal: Empowering 1 Million Careers by 2026
            </h2>
            <p className="text-gray-400 text-base mt-2">A clear roadmap toward global professional transformation.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
              <span className="text-xs font-bold text-fuchsia-400 uppercase tracking-widest">Phase 1</span>
              <h3 className="text-xl font-bold text-white">Launch (2026)</h3>
              <p className="text-sm text-gray-300">Deploy AI matching algorithms with the most in-demand global tech options.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
              <span className="text-xs font-bold text-cyan-400 uppercase tracking-widest">Phase 2</span>
              <h3 className="text-xl font-bold text-white">Scale (2027)</h3>
              <p className="text-sm text-gray-300">Introduce step-by-step custom learning guides customized for efficiency.</p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3 relative overflow-hidden">
              <span className="text-xs font-bold text-purple-400 uppercase tracking-widest">Phase 3</span>
              <h3 className="text-xl font-bold text-white">Expansion (2028)</h3>
              <p className="text-sm text-gray-300">Identify precise courses and certifications to maintain market competitiveness.</p>
            </div>
          </div>
        </section>

        <section id="contact" className="w-full bg-black/40 backdrop-blur-md border border-white/10 rounded-[32px] p-8 sm:p-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
            <div className="lg:col-span-6 space-y-6">
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">Contact Us</h2>
              <p className="text-gray-300 text-base">Have questions or want to collaborate? Send us a message and our team will get back to you shortly.</p>
              
              <div className="space-y-4 max-w-md">
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Name</label>
                  <input type="text" placeholder="Your Name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Email</label>
                  <input type="email" placeholder="your.email@example.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 text-sm" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-gray-400 mb-1">Message</label>
                  <textarea rows="4" placeholder="Type your message here..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-fuchsia-500 text-sm resize-none"></textarea>
                </div>
                <button className="w-full sm:w-auto px-8 py-3 rounded-xl bg-[#f08fe7] hover:bg-[#fa9eed] text-gray-950 font-bold transition shadow-lg cursor-pointer">
                  Send Message
                </button>
              </div>
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 h-64 flex items-center justify-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-tr from-fuchsia-500/10 to-blue-500/10"></div>
                <span className="text-gray-400 font-medium tracking-wide relative z-10">Global Operations & AI Hub</span>
              </div>

              <div className="flex items-center gap-4 text-gray-400 text-sm font-medium">
                <span className="hover:text-white cursor-pointer transition">LinkedIn</span>
                <span>•</span>
                <span className="hover:text-white cursor-pointer transition">Twitter</span>
                <span>•</span>
                <span className="hover:text-white cursor-pointer transition">GitHub</span>
              </div>
            </div>
          </div>
        </section>

      </main>

      <footer className="w-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 py-14 border-t border-white/15 relative z-20 bg-[#030712] space-y-10">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 items-start justify-between">
          
          <div className="md:col-span-5 space-y-5">
            <img 
              src="/logoo.png" 
              alt="CareerPath AI Logo" 
              className="h-16 sm:h-20 w-auto object-contain select-none" 
            />
            <p className="text-gray-300 text-base leading-relaxed max-w-md font-medium">
              Your personal co-pilot for professional growth, powered by advanced AI guidance and cutting-edge career pathways.
            </p>
          </div>

          <div className="md:col-span-3 space-y-4">
            <h4 className="text-white font-extrabold text-lg tracking-wide">Quick Links</h4>
            <nav className="flex flex-col space-y-3 text-base text-gray-300 font-medium">
              <button onClick={() => scrollToSection('home')} className="text-left hover:text-[#f08fe7] transition cursor-pointer">Home</button>
              <button onClick={() => scrollToSection('about')} className="text-left hover:text-[#f08fe7] transition cursor-pointer">About Us</button>
              <button onClick={() => scrollToSection('goal')} className="text-left hover:text-[#f08fe7] transition cursor-pointer">Our Goal</button>
              <button onClick={() => scrollToSection('contact')} className="text-left hover:text-[#f08fe7] transition cursor-pointer">Contact Us</button>
            </nav>
          </div>

          <div className="md:col-span-4 space-y-4">
            <h4 className="text-white font-extrabold text-lg tracking-wide">Get in Touch</h4>
            <div className="flex items-center gap-3 text-gray-300 text-base font-medium">
              <Mail size={20} className="text-[#f08fe7]" />
              <span>support@careerpathaicareers.com</span>
            </div>
            <div className="flex items-center gap-3 text-gray-300 text-base font-medium">
              <Phone size={20} className="text-[#f08fe7]" />
              <span>+92 (315) 811-9936</span>
            </div>
            <div className="flex items-start gap-3 text-gray-300 text-base font-medium">
              <MapPin size={20} className="text-[#f08fe7] mt-0.5 shrink-0" />
              <span>Suite 402, Innovation Tower, Tech Park, Global Hub</span>
            </div>
          </div>

        </div>

        <div className="pt-8 border-t border-white/10 text-center">
          <p className="text-sm font-medium text-gray-400 tracking-wide">
            &copy; 2026 CareerPath AI. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}
