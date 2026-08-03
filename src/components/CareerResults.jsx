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
  Award,
  Percent,
  TrendingUp,
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
        icon: <Terminal className="text-[#6366f1]" size={31} />,
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
        icon: <Terminal className="text-[#6366f1]" size={31} />,
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
        icon: <Brain className="text-[#6366f1]" size={31} />,
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
        icon: <Palette className="text-[#6366f1]" size={31} />,
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
            <div className="w-8 h-8 rounded-lg bg-[#6366f1] flex items-center justify-center text-white font-bold text-xl">¢</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#6366f1]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 text-gray-600 hover:text-[#6366f1] px-4 py-2 rounded-xl text-sm font-semibold transition cursor-pointer">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-[#6366f1] font-semibold text-sm border-l border-r border-gray-200 px-4 bg-blue-50/50 py-2 rounded-lg cursor-pointer">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border border-[#f2c6fa]">
                <User size={18} className="text-[#6366f1]" />
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

      <main className="max-w-6xl mx-auto px-4 py-10 flex flex-col gap-10">
        
        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-2 border border-[#FF00ED] text-gray-800 font-light px-5 py-1.5 rounded-full bg-white shadow-sm">
            <Sparkles size={16} className="flex-shrink-0 text-[#83047A]" />
            <span className="text-base leading-3 flex items-center">
              AI Career Assessment Form
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
            Your Top Career Matches
          </h1>
          <p className="text-gray-500 max-w-xl mx-auto font-light text-xl">
            Our AI has analyzed your skills, interests, and personality to find careers that perfectly match your unique profile.
          </p>
        </div>

        <div className="w-full min-h-[104px] bg-[#840094] rounded-2xl px-6 py-5 flex flex-col sm:flex-row items-center justify-between text-white relative overflow-hidden gap-6 shadow-[5px_5px_5px_rgba(0,0,0,0.35)] ring-[3px] ring-inset ring-[#FFD0F3]">
          <div className="flex flex-col justify-center text-center sm:text-left w-full sm:w-auto">
            <h2 className="text-[26px] font-bold text-white leading-tight">
              Assessment Complete! 🎉
            </h2>
            <p className="text-[19px] font-medium text-white leading-tight mt-1">
              We've analyzed your responses and found your 5 career matches
            </p>
          </div>
          <div className="flex items-center gap-12 w-full sm:w-auto justify-center sm:justify-end border-t sm:border-t-0 pt-4 sm:pt-0 border-purple-400/30">
            <div className="flex flex-col items-center">
              <div className="text-[32px] font-bold text-[#59FF9C] leading-none">
                {matchedCareer.matchPercentage}%
              </div>
              <div className="text-[19px] font-semibold text-[#00E55C] mt-1.5">
                Best Match
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div className="text-[32px] font-bold text-[#FFF959] leading-none">
                5
              </div>
              <div className="text-[19px] font-semibold text-[#F0E802] mt-1.5">
                Careers
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white border border-[#FFD2F7] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] rounded-[32px] p-6 md:p-10 flex flex-col w-full relative">
          
          <div className="flex flex-col md:flex-row justify-between items-start w-full gap-6">
            
            <div className="flex-1 flex flex-col gap-5">
              
              <div className="flex flex-row items-center gap-5">
              <div className="w-[65px] h-[60px] rounded-[18px] border-[1.4px] border-[#FF00ED] bg-[#FFE7F2] flex items-center justify-center flex-shrink-0">
                {matchedCareer.icon}
              </div>
                <div className="flex flex-col justify-center">
                  <div className="flex flex-wrap items-center gap-3">
                    <h3 className="text-[26px] md:text-[26px] mt-1 font-bold text-gray-900 leading-none">{matchedCareer.title}</h3>
                    <div className="flex items-center gap-2.5 -top-2 relative ml-1.5">
                      <span className="inline-flex items-center justify-between px-2.5 w-[100px] h-[19px] bg-[#FBFFBC] text-[#CF7900] border-[1px] border-[#CF7900] rounded-[25px] text-[12px] font-medium tracking-wide">
                        <Award size={11} strokeWidth={2.5} className="text-[#CF7900]" />
                        {matchedCareer.tag}
                      </span>
                      <span className="inline-flex items-center justify-between px-2.5 w-[110px] h-[19px] bg-[#E2FFE2] text-[#00B14A] border-[1px] border-[#00D057] rounded-[25px] text-[12px] font-medium tracking-wide">
                        <TrendingUp size={11} strokeWidth={2.5} className="text-[#00B14A]" />
                        {matchedCareer.matchPercentage}% Match
                      </span>
                    </div>
                  </div>
                  <p className="text-[17px] font-regular text-[#707070] mt-3">{matchedCareer.description}</p>
                </div>
              </div>

              <div className="space-y-2.5">
                <div className="text-[14px] font-medium text-gray-500">Key Skills:</div>
                <div className="flex flex-wrap gap-2.5">
                  {matchedCareer.skills.map((skill) => (
                  <span key={skill} className="flex items-center justify-start gap-1.5 h-[19px] bg-[#F7F7F7] border border-gray-100 px-3.5 py-1.5 rounded-full text-[13px] font-regular text-[#000000]">                      <CheckCircle2 size={13} strokeWidth={2.5} className="text-[#83047A]" />
                      {skill}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <div className="w-full sm:w-[360px] h-[60px] bg-[#F7F7F7] rounded-[16px] px-5 py-2 flex flex-col justify-center">
                  <div className="text-[12px] font-regular text-[#5E5E5E] mb-0.5">Salary Range</div>
                  <div className="text-[13px] font-medium text-[#000000]">{matchedCareer.salary}</div>
                </div>
                <div className="w-full sm:w-[360px] h-[60px] bg-[#F7F7F7] rounded-[13px] px-5 py-2 flex flex-col justify-center">
                  <div className="text-[12px] font-regular text-[#5E5E5E] mb-0.5">Job Growth</div>
                  <div className="text-[13px] font-medium text-[#000000]">{matchedCareer.growth}</div>
                </div>
              </div>

            </div>

            <div className="flex flex-col items-center flex-shrink-0 md:pr-8 pt-0">
              <div className="w-[175px] h-[175px] flex flex-col items-center justify-center rounded-full bg-[#F0FFF6] ring-[4.5px] ring-inset ring-[#81FFB5] shadow-sm">
                <span className="text-[44px] font-bold text-[#16a34a] leading-none mb-1.5 mt-2">
                  {matchedCareer.matchPercentage}%
                </span>
                <span className="text-[22.5px] font-medium text-[#16a34a] leading-none mt-1">
                  Match
                </span>
              </div>
              <span className="text-[18px] font-normal text-[#1f2937] text-center mt-4">
                {matchedCareer.matchLevel}
              </span>
            </div>

          </div>

          <hr className="border-gray-200 my-8" />

          <div className="flex flex-col gap-5">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center text-[#FF00ED]">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 8V4H8" />
                  <rect width="16" height="12" x="4" y="8" rx="2" />
                  <path d="M2 14h2" />
                  <path d="M20 14h2" />
                  <path d="M15 13v2" />
                  <path d="M9 13v2" />
                  <path d="M8 22l4-4 4 4" />
                </svg>
              </div>
              <h4 className="text-[21px] font-semibold text-gray-900 tracking-tight">Why AI Recommends This Career</h4>
            </div>

            <div className="bg-[#FCF5FF] border-[1px] border-[#EEC9FF] shadow-[0px_2px_3px_0.5px_rgba(0,0,0,0.25)] rounded-[25px] p-6 md:p-8">
              <p className="text-[14.5px] font-regular text-[#000000] mb-6">
                Based on our comprehensive AI analysis of your assessment responses:
              </p>
              <ul className="space-y-4">
                {matchedCareer.whyRecommendPoints.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-[14.5px] text-[#F30092] font-medium mt-0.5">{index + 1}.</span>
                    <span className="text-[14.5px] text-[#000000] leading-relaxed font-regular">
                      {point}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="flex justify-end pt-13">
            <button
              onClick={() => onNavigate('career-details', { careerData: matchedCareer })}
              className="flex items-center justify-between px-5 w-[248px] h-[47px] rounded-[15px] text-[18px] font-regular bg-[#FFD0F3] text-[#83047A] border-[0.3px] border-[#83047A] hover:bg-[#fbcfe8] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
            >
              <span>Get Career Roadmap</span>
              <ArrowRight size={19} strokeWidth={2.5} />
            </button>
          </div>

        </div>

      </main>
    </div>
  );  
}
