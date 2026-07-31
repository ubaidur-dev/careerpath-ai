import React, { useMemo } from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Terminal, 
  Brain, 
  Palette, 
  ArrowRight, 
  CheckCircle2,
  Sparkles,
  Search 
} from 'lucide-react';

export default function CareerResults({ onNavigate, answers = {} }) {
  
  const matchedCareer = useMemo(() => {
    if (!answers || Object.keys(answers).length === 0) {
      return {
        title: "Software Developer",
        slug: "software-developer",
        tag: "Top Match",
        matchPercentage: 92,
        matchLevel: "Excellent Match",
        description: "Create innovative software solutions and applications",
        icon: <Terminal className="text-[#bd24df]" size={28} />,
        skills: ["Programming", "Problem Solving", "Logic"],
        salary: "$85,000 - $150,000",
        growth: "High",
        whyRecommendPoints: [
          "Your strong interest in programming indicates a natural aptitude for software development.",
          "Excellent problem-solving abilities align perfectly with designing complex system architectures.",
          "You have a high comfort level with continuous learning, which is essential for evolving tech stacks.",
          "Your preference for logical, analytical tasks matches the systematic debugging process.",
          "The desire to see immediate, tangible results is fulfilled by compiling and deploying functional code.",
          "Your appreciation for a flexible work environment fits the remote nature of modern tech roles.",
          "An independent work style preference suits the deep focus required for writing complex algorithms.",
          "You possess the strong communication skills needed to translate client needs into robust digital products.",
          "The high salary potential of this field perfectly aligns with your financial stability goals.",
          "Your hands-on learning approach is ideal for project-based software engineering and practical coding.",
          "Comfort with mathematical logic provides a strong foundation for algorithmic efficiency.",
          "Your goal for continuous improvement guarantees you will never feel stagnant in this dynamic career."
        ]
      };
    }

    if (answers.q1 === 'Yes, I love it!' && answers.q7 === 'Absolutely love it!') {
      return {
        title: "Software Developer",
        slug: "software-developer", 
        tag: "Top Match",
        matchPercentage: 98,
        matchLevel: "Excellent Match",
        description: "Create innovative software solutions and applications",
        icon: <Terminal className="text-[#bd24df]" size={28} />,
        skills: ["Programming", "Problem Solving", "Logic"],
        salary: "$85,000 - $150,000",
        growth: "High",
        whyRecommendPoints: [
          "Your strong interest in programming indicates a natural aptitude for software development.",
          "Excellent problem-solving abilities align perfectly with designing complex system architectures.",
          "You have a high comfort level with continuous learning, which is essential for evolving tech stacks.",
          "Your preference for logical, analytical tasks matches the systematic debugging process.",
          "The desire to see immediate, tangible results is fulfilled by compiling and deploying functional code.",
          "Your appreciation for a flexible work environment fits the remote nature of modern tech roles.",
          "An independent work style preference suits the deep focus required for writing complex algorithms.",
          "You possess the strong communication skills needed to translate client needs into robust digital products.",
          "The high salary potential of this field perfectly aligns with your financial stability goals.",
          "Your hands-on learning approach is ideal for project-based software engineering and practical coding.",
          "Comfort with mathematical logic provides a strong foundation for algorithmic efficiency.",
          "Your goal for continuous improvement guarantees you will never feel stagnant in this dynamic career."
        ]
      };
    } else if (answers.q6 === 'Very comfortable' || answers.q5 === 'Analytical tasks') {
      return {
        title: "Data Scientist",
        slug: "data-scientist", 
        tag: "Top Match",
        matchPercentage: 89,
        matchLevel: "Excellent Match",
        description: "Analyze complex data patterns to drive business decisions",
        icon: <Brain className="text-[#bd24df]" size={28} />,
        skills: ["Analytics", "Statistics", "Python"],
        salary: "$95,000 - $160,000",
        growth: "Very High",
        whyRecommendPoints: [
          "Your high comfort level with mathematics and statistics is foundational for data modeling.",
          "A strong preference for complex analytical tasks maps perfectly to raw data processing.",
          "You naturally enjoy structured puzzles, which is the core of extracting actionable business insights.",
          "Your systematic approach fits the meticulous process of cleaning and organizing large datasets.",
          "The desire to make a significant impact is met by driving high-stakes, data-driven company decisions.",
          "Your aptitude for pattern recognition is exactly what is needed for machine learning algorithms.",
          "Working with cutting-edge AI technologies aligns with your passion for technological innovation.",
          "Your ability to maintain deep focus supports the creation of complex predictive models.",
          "This field offers skyrocketing global demand, providing you with unparalleled long-term job security.",
          "The lucrative compensation in data science perfectly matches your career trajectory and financial goals.",
          "Your logical mindset is your biggest asset for translating business problems into mathematical solutions.",
          "Continuous learning in data science ensures your intellectual curiosity is always thoroughly satisfied."
        ]
      };
    } else {
      return {
        title: "Digital Marketer",
        slug: "digital-marketer", 
        tag: "Top Match",
        matchPercentage: 85,
        matchLevel: "Strong Match",
        description: "Design strategic cross-channel campaigns and manage brand value",
        icon: <Palette className="text-[#bd24df]" size={28} />,
        skills: ["Creativity", "Strategy", "Ad-Ops"],
        salary: "$60,000 - $110,000",
        growth: "Stable",
        whyRecommendPoints: [
          "Your profile reveals a strong appreciation for creative work combined with strategic planning.",
          "Excellent communication skills make you ideal for audience research and compelling brand storytelling.",
          "Your empathy-driven approach allows you to deeply understand consumer psychology and behavior.",
          "You have a knack for bridging the gap between innovative products and their target end-users.",
          "A preference for a collaborative environment suits cross-functional marketing teams perfectly.",
          "You enjoy visual impact, which aligns completely with designing highly engaging ad campaigns.",
          "Your analytical side will thrive when evaluating campaign metrics and optimizing ad spend strategies.",
          "The hybrid nature of modern marketing provides the flexibility and work-life balance you value.",
          "Continuous learning in the ever-changing social media landscape will keep you engaged and proactive.",
          "Your goal-oriented workflow ensures marketing campaigns are structured, focused, and results-driven.",
          "You possess the adaptability required to quickly pivot strategies based on sudden market trends.",
          "This career satisfies both your creative itch and your ultimate desire for measurable business success."
        ]
      };
    }
  }, [answers]);

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 antialiased pb-12">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#bd24df] flex items-center justify-center text-white font-bold text-xl">¢</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#bd24df]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-[#bd24df] font-semibold text-sm border-l border-r border-gray-200 px-4 bg-purple-50/50 py-2 rounded-lg cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                <User size={18} className="text-[#bd24df]" />
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            <button onClick={() => onNavigate('home')} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 py-8 space-y-8">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div 
            className="inline-flex items-center gap-2 border border-[#FF00ED] text-gray-800 font-light px-5 py-1.5 rounded-full bg-white shadow-sm"
          >
            <Sparkles 
              size={16}
              className="flex-shrink-0 text-[#83047A]" 
            />
            <span 
              className="text-base leading-3 flex items-center"
            >
              AI Career Assessment Form
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Top Career Matches
          </h1>
          <p 
            className="text-gray-500 max-w-xl mx-auto font-light text-xl"
          >
            Our AI has analyzed your skills, interests, and personality to find careers that perfectly match your unique profile.
          </p>
        </div>

        <div 
          className="w-full bg-[#840094] rounded-2xl p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between text-white shadow-md relative overflow-hidden gap-4"
          style={{ height: '104px', width: '100%' }}
        >
          <div>
            <h2 style={{ fontSize: '26px', fontWeight: 'semi-bold', color: '#FFFFFF', lineHeight: '24px' }}>
              Assessment Complete! 🎉
            </h2>
            <p style={{ fontSize: '19px', fontWeight: '500', color: '#E9D5FF', lineHeight: '20px', marginTop: '4px' }}>
              We've analyzed your responses and found your ideal match
            </p>
          </div>
          <div className="flex items-center gap-8 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 pt-3 sm:pt-0 border-purple-400/30">
            <div className="text-center sm:text-right">
              <div style={{ fontSize: '30px', fontWeight: '700', color: '#4ade80', lineHeight: '36px' }}>
                {matchedCareer.matchPercentage}%
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#D8B4FE', lineHeight: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                Best Match
              </div>
            </div>
            <div className="text-center sm:text-right">
              <div style={{ fontSize: '30px', fontWeight: '700', color: '#FBCFE8', lineHeight: '36px' }}>
                Top 1
              </div>
              <div style={{ fontSize: '12px', fontWeight: '700', color: '#D8B4FE', lineHeight: '16px', textTransform: 'uppercase', letterSpacing: '0.05em', marginTop: '4px' }}>
                Recommendation
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-gray-100 shadow-xl rounded-3xl p-6 md:p-10 space-y-8">
          
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-8 border-b border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              <div className="w-16 h-16 rounded-2xl bg-purple-50 flex items-center justify-center border border-purple-100 flex-shrink-0">
                {matchedCareer.icon}
              </div>
              <div className="space-y-2">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-2xl md:text-3xl font-bold text-gray-900 tracking-tight">{matchedCareer.title}</h3>
                  <span className="px-3 py-1 bg-amber-50 text-amber-600 border border-amber-200 rounded-lg text-xs font-bold uppercase tracking-wide">
                    {matchedCareer.tag}
                  </span>
                </div>
                <p className="text-base font-medium text-gray-500">{matchedCareer.description}</p>
                
                <div className="flex flex-wrap items-center gap-4 pt-3">
                  <span className="text-sm font-bold text-gray-400">Key Skills:</span>
                  {matchedCareer.skills.map((skill) => (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-gray-700 bg-gray-50 border border-gray-200 px-3 py-1.5 rounded-lg" key={skill}>
                      <CheckCircle2 size={14} className="text-purple-600" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center bg-green-50 border border-green-100 rounded-3xl p-6 shadow-sm min-w-[160px] self-center md:self-auto">
              <div className="relative w-24 h-24 flex items-center justify-center rounded-full border-[6px] border-emerald-400 bg-white text-center shadow-inner">
                <span className="text-3xl font-bold text-gray-900">{matchedCareer.matchPercentage}%</span>
                <span className="absolute -bottom-3 bg-emerald-400 text-white font-bold text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">Match</span>
              </div>
              <span className="text-sm font-bold text-emerald-700 mt-5">{matchedCareer.matchLevel}</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Estimated Salary Range</div>
              <div className="text-xl font-bold text-gray-800 mt-2">{matchedCareer.salary}</div>
            </div>
            <div className="bg-gray-50/70 border border-gray-100 rounded-2xl p-5">
              <div className="text-sm font-bold text-gray-400 uppercase tracking-wider">Industry Job Growth</div>
              <div className="text-xl font-bold text-gray-800 mt-2">{matchedCareer.growth}</div>
            </div>
          </div>

          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center border border-purple-100">
                <Sparkles size={20} className="text-[#bd24df]" />
              </div>
              <h4 className="text-xl font-bold text-gray-900 tracking-tight">Why AI Recommends This Career</h4>
            </div>

            <div className="bg-purple-50/40 border border-purple-100/60 rounded-3xl p-6 md:p-8">
              <p className="text-sm font-bold text-purple-600 mb-6">Based on your detailed profile analysis, here are 12 reasons why this is a perfect match:</p>
              
              <ul className="space-y-4 text-left text-base font-medium text-gray-700">
                {matchedCareer.whyRecommendPoints.map((point, index) => (
                  <li className="flex items-start gap-4 leading-relaxed" key={index}>
                    <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[#bd24df] text-white flex items-center justify-center text-xs font-bold mt-0.5 shadow-sm">
                      {index + 1}
                    </span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-6 border-t border-gray-100">
            <button
              onClick={() => onNavigate('roadmap-detail', { careerId: matchedCareer.slug })}
              className="inline-flex items-center gap-2 px-8 py-4 bg-[#bd24df] text-white font-bold text-base md:text-lg rounded-2xl shadow-lg hover:bg-[#a61fc5] hover:-translate-y-1 transition-all duration-200 cursor-pointer"
            >
              Get Career Roadmap
              <ArrowRight size={20} />
            </button>
          </div>

        </div>
      </main>
    </div>
  );
}
