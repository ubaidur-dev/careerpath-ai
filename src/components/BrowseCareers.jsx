import React, { useEffect } from 'react';
import Header from './Header';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  Search, 
  Zap, 
  ArrowRight,
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  CircleDot,
  Users,
  DollarSign,
  Binary,
  Sparkles
} from 'lucide-react';

const careers = [
  {
    title: "Software Developer",
    match: "92% Match",
    demand: "Very High Demand",
    demandColor: "text-emerald-600 bg-emerald-50 border-emerald-100",
    description: "Design, build, and deploy production-grade applications. Break down complex business logic into scalable code, handle databases, and optimize software systems.",
    skills: [
      { name: "JavaScript/Python", value: 90 },
      { name: "HTML/CSS", value: 85 },
      { name: "Git & GitHub", value: 75 },
      { name: "React/Vue", value: 70 },
      { name: "Problem Solving", value: 95 },
      { name: "Databases", value: 65 }
    ],
    salary: "$85,000 - $150,000",
    growth: "High",
    timeline: "12 - 18 months",
    openings: "45,000+",
    experience: "3-5 years",
    flexibility: "Remote OK",
    icon: Code2,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    roadmap: [
      { title: "Learn Programming Fundamentals", duration: "2-3 months", desc: "Master the absolute basics of core programming syntax, control structures, loops, and functions using Python or JavaScript.", tags: ["Codecademy", "freeCodeCamp", "Python.org"] },
      { title: "Build Your First Projects", duration: "2 months", desc: "Create 3-5 structural full-stack projects using semantic markup and component layouts to showcase responsive logic.", tags: ["GitHub", "Personal Portfolio", "Open Source"] },
      { title: "Learn Data Structures & Algorithms", duration: "3-4 months", desc: "Understand runtime complexities (O(n) metrics), sorting algorithms, memory profiles, and core trees for elite engineering steps.", tags: ["LeetCode", "HackerRank", "CS50"] },
      { title: "Master a Framework & DevOps Tools", duration: "3-4 months", desc: "Deep dive into modern reactive state models like React, deployment pipelines, container engines, and continuous integration flows.", tags: ["Official Docs", "YouTube", "Udemy"] }
    ],
    courses: [
      { title: "Complete Web Development Bootcamp", platform: "Udemy", rating: "4.7", cost: "Free" },
      { title: "CS50: Introduction to Computer Science", platform: "Harvard/edX", rating: "4.9", cost: "Free" },
      { title: "The Odin Project Full-Stack Path", platform: "Free Online", rating: "4.8", cost: "Free" },
      { title: "Full Stack Open Ecosystem Certification", platform: "University of Helsinki", rating: "4.9", cost: "Free" }
    ]
  },
  {
    title: "Data Analyst",
    match: "87% Match",
    demand: "High Demand",
    demandColor: "text-blue-600 bg-blue-50 border-blue-100",
    description: "Transform raw organizational database payloads into actionable corporate intelligence. Audit pipelines and engineer premium executive dashboards.",
    skills: [
      { name: "SQL Data Queries", value: 88 },
      { name: "Python/R", value: 75 },
      { name: "Excel Advanced", value: 90 },
      { name: "Tableau/PowerBI", value: 85 },
      { name: "Statistics", value: 80 },
      { name: "Data Warehousing", value: 60 }
    ],
    salary: "$65,000 - $110,000",
    growth: "Very High",
    timeline: "6 - 12 months",
    openings: "32,000+",
    experience: "1-3 years",
    flexibility: "Hybrid",
    icon: BarChart3,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    roadmap: [
      { title: "Master Spreadsheet Software & Statistical Modeling", duration: "1-2 months", desc: "Learn conditional logic lookups, array metrics formulas, dynamic formatting, and multi-variable analytics models in Excel.", tags: ["Chandoo", "Coursera"] },
      { title: "Learn SQL Database Querying & Architecture", duration: "2 months", desc: "Write production relational schemas, multi-table joins, subqueries, and advanced window partition functions flawlessly.", tags: ["SQLZoo", "Mode Analytics"] },
      { title: "Data Visualization & Dashboard Tooling", duration: "2 months", desc: "Build professional interactive executive monitoring experiences using structural configurations inside Tableau or PowerBI.", tags: ["Tableau Public", "Udemy"] },
      { title: "Python Data Science Core Libraries", duration: "3 months", desc: "Ingest and process complex data arrays with mathematical Pandas, numerical NumPy arrays, and customized plots.", tags: ["Kaggle", "DataCamp"] }
    ],
    courses: [
      { title: "Google Data Analytics Professional Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
      { title: "Data Analysis with Python Applied Specialization", platform: "freeCodeCamp", rating: "4.9", cost: "Free" },
      { title: "SQL for Data Science Complex Queries Course", platform: "UC Davis/Coursera", rating: "4.6", cost: "Free" },
      { title: "Advanced Tableau Dashboard Design Architecture", platform: "Udemy Academic", rating: "4.7", cost: "Free" }
    ]
  },
  {
    title: "UX Designer",
    match: "82% Match",
    demand: "High Demand",
    demandColor: "text-blue-600 bg-blue-50 border-blue-100",
    description: "Architect flawless user interactions and interface behaviors for cross-platform products using cognitive psychology maps and prototype flows.",
    skills: [
      { name: "Figma/Adobe XD", value: 95 },
      { name: "User Research", value: 80 },
      { name: "Wireframing", value: 90 },
      { name: "Prototyping", value: 85 },
      { name: "UI Design", value: 88 },
      { name: "Interaction Design", value: 70 }
    ],
    salary: "$70,000 - $120,000",
    growth: "High",
    timeline: "8 - 14 months",
    openings: "20,000+",
    experience: "2-4 years",
    flexibility: "Remote OK",
    icon: PenTool,
    iconColor: "text-purple-600",
    iconBg: "bg-purple-50",
    roadmap: [
      { title: "Understand UX Design Principles & Psychology", duration: "1-2 months", desc: "Study core interaction structures, behavioral layout laws (Jakob's Law), cognitive patterns, and usability matrices.", tags: ["Interaction Design Org", "Medium"] },
      { title: "Master Figma UI Design & Systems Technology", duration: "2 months", desc: "Learn responsive design layout constraints, variant component sets, unified color tokens, and structural prototyping states.", tags: ["Figma YouTube", "Udemy"] },
      { title: "User Research Execution & Telemetry Analysis", duration: "2 months", desc: "Perform qualitative feedback validation, build complex user personas tracking matrices, and configure interactive journey charts.", tags: ["Coursera", "UX Collective"] },
      { title: "Wireframing, Hi-Fi Layouts & Production Case Studies", duration: "2 months", desc: "Develop detailed interaction blueprints and document 3 comprehensive production-grade case study profiles for review panels.", tags: ["Figma", "Behance"] }
    ],
    courses: [
      { title: "Google UX Design Professional Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
      { title: "Product Design Course Frameworks Specialization", platform: "Udacity", rating: "4.5", cost: "Free" },
      { title: "Figma UI/UX Essentials Masterclass Track", platform: "Skillshare", rating: "4.7", cost: "Free" },
      { title: "UI Architecture & Interface Token Systems", platform: "Interaction Design Org", rating: "4.8", cost: "Free" }
    ]
  },
  {
    title: "Business Analyst",
    match: "78% Match",
    demand: "Medium Demand",
    demandColor: "text-amber-600 bg-amber-50 border-amber-100",
    description: "Translate company needs into explicit engineering user stories, business charts, systemic flowcharts, and functional specifications.",
    skills: [
      { name: "Requirements Gathering", value: 92 },
      { name: "Process Modeling", value: 85 },
      { name: "Agile/Scrum", value: 80 },
      { name: "Communication", value: 95 },
      { name: "Jira/Confluence", value: 75 }
    ],
    salary: "$68,000 - $105,000",
    growth: "Medium",
    timeline: "6 - 12 months",
    openings: "18,000+",
    experience: "2-5 years",
    flexibility: "On-site",
    icon: Briefcase,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "Business Analysis Fundamentals", duration: "1-2 months", desc: "Learn BA lifecycle core values, stakeholder matrix layouts, and requirements elicitation methodologies.", tags: ["IIBA Guide", "Udemy"] },
      { title: "Process Mapping & Documentation Standards", duration: "2 months", desc: "Master professional functional flowcharting protocols, process flow diagrams, and advanced BPMN notations.", tags: ["Lucidchart", "Visio"] },
      { title: "Agile & Scrum Delivery Frameworks", duration: "2 months", desc: "Understand granular user stories formulation rules, product backlog grooming sessions, and sprint release rhythms.", tags: ["Scrum Alliance", "Atlassian"] },
      { title: "Enterprise Data Analytics Fundamentals", duration: "2-3 months", desc: "Study structural relational data extractions, baseline data modeling parameters, and key metric indicator computations.", tags: ["SQL Queries", "Tableau Reporting"] }
    ],
    courses: [
      { title: "Business Analysis Foundations", platform: "LinkedIn Learning", rating: "4.6", cost: "Free" },
      { title: "Agile Planning with Jira Systems", platform: "Coursera", rating: "4.7", cost: "Free" },
      { title: "IIBA Certified Business Analysis Practitioner Prep", platform: "Udemy Academic", rating: "4.8", cost: "Free" },
      { title: "Corporate Business Intelligence & Data Mapping", platform: "Microsoft Learn", rating: "4.5", cost: "Free" }
    ]
  },
  {
    title: "Digital Marketing Specialist",
    match: "75% Match",
    demand: "High Demand",
    demandColor: "text-blue-600 bg-blue-50 border-blue-100",
    description: "Configure programmatic tracking networks, search engine index parameters, digital ads funnels, and performance conversion pixels.",
    skills: [
      { name: "SEO Optimization", value: 88 },
      { name: "Google Analytics", value: 85 },
      { name: "Paid Ads Management", value: 90 },
      { name: "Content Creation", value: 80 },
      { name: "Email Marketing", value: 75 }
    ],
    salary: "$55,000 - $95,000",
    growth: "High",
    timeline: "6 - 10 months",
    openings: "28,000+",
    experience: "1-3 years",
    flexibility: "Remote OK",
    icon: TrendingUp,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "SEO Fundamentals & Index Structuring", duration: "2 months", desc: "Learn semantic structural schema alterations, user intent index parameters, backend link profiling, and site performance tuning.", tags: ["HubSpot", "Moz"] },
      { title: "PPC & Paid Social Programmatic Ads Engines", duration: "2 months", desc: "Master target distribution matrices, audience tracking parameters, pixel deployment layers, and automated bid logic dashboards.", tags: ["Google Skillshop"] },
      { title: "Content Copywriting Funnels & Automated Pipelines", duration: "2 months", desc: "Formulate strategic multi-step retention triggers, drip automation matrices, and structural user landing pages design setups.", tags: ["Mailchimp Tech", "Copywriting Basics"] },
      { title: "Marketing Analytics & Multi-Touch Attribution", duration: "2 months", desc: "Analyze customer acquisition streams, cohort lifecycle properties, tracking pixels data payload, and performance report layouts.", tags: ["Google Analytics 4", "Mixpanel Engine"] }
    ],
    courses: [
      { title: "Google Digital Marketing Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
      { title: "Inbound Marketing Certification", platform: "HubSpot Academy", rating: "4.7", cost: "Free" },
      { title: "Advanced Google Ads Paid Search Masterclass", platform: "Udemy Professional", rating: "4.6", cost: "Free" },
      { title: "Web Analytics Data Tracking and Audience Cohorts", platform: "SimpliLearn Portal", rating: "4.5", cost: "Free" }
    ]
  },
  {
    title: "Product Manager",
    match: "85% Match",
    demand: "High Demand",
    demandColor: "text-blue-600 bg-blue-50 border-blue-100",
    description: "Own product lifecycle frameworks. Govern development constraints across design, engineering, and sales squads to launch viable software models.",
    skills: [
      { name: "Product Strategy", value: 92 },
      { name: "Roadmapping", value: 90 },
      { name: "Market Research", value: 85 },
      { name: "A/B Metrics Testing", value: 78 },
      { name: "Leadership", value: 95 }
    ],
    salary: "$95,000 - $160,000",
    growth: "High",
    timeline: "12 - 24 months",
    openings: "15,000+",
    experience: "4-7 years",
    flexibility: "Hybrid",
    icon: CircleDot,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "Product Discovery & Market Fit Mechanics", duration: "3 months", desc: "Evaluate target user retention cohorts, manage continuous discovery loops, model minimum viable concepts, and chart market analysis grids.", tags: ["Product School", "Medium"] },
      { title: "Product Roadmapping & Prioritization Matrix Engineering", duration: "2 months", desc: "Master RICE parameter configurations, coordinate dynamic value matrices, and configure multi-stage milestone tracking views.", tags: ["Jira Software", "Productboard Tool"] },
      { title: "UX Layout Blueprinting & Product Spec Writing", duration: "2-3 months", desc: "Draft high-level functional product requirement document catalogs and translate user requirements patterns into technical features logs.", tags: ["Figma Wireframes", "Confluence Docs"] },
      { title: "Product Telemetry & Post-Launch Growth Performance", duration: "3 months", desc: "Track funnel telemetry properties, administer A/B programmatic split matrix tests, and analyze active acquisition churn loops.", tags: ["Mixpanel Data", "Amplitude Systems"] }
    ],
    courses: [
      { title: "Brand Management & Product Delivery", platform: "Coursera", rating: "4.6", cost: "Free" },
      { title: "Product Management 101", platform: "Udemy", rating: "4.5", cost: "Free" },
      { title: "Product Analytics Core Engineering Frameworks", platform: "Amplitude Academy", rating: "4.8", cost: "Free" },
      { title: "Enterprise Product Manager Master Certification", platform: "Product School", rating: "4.7", cost: "Free" }
    ]
  },
  {
    title: "Human Resources Specialist",
    match: "70% Match",
    demand: "Medium Demand",
    demandColor: "text-amber-600 bg-amber-50 border-amber-100",
    description: "Govern company employment loops, structural candidate screening protocols, workforce metrics, and labor legal compliance catalogs.",
    skills: [
      { name: "Talent Acquisition", value: 90 },
      { name: "Employee Relations", value: 88 },
      { name: "Conflict Resolution", value: 85 },
      { name: "HRIS Tool Management", value: 70 },
      { name: "Labor Compliance", value: 78 }
    ],
    salary: "$60,000 - $95,000",
    growth: "Medium",
    timeline: "6 - 12 months",
    openings: "12,000+",
    experience: "1-4 years",
    flexibility: "On-site",
    icon: Users,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "Talent Sourcing Systems & Boolean Queries", duration: "2 months", desc: "Master custom boolean matching strings execution over corporate directories, structure applicant profiles tracking pipelines, and verify interview parameters.", tags: ["SHRM", "LinkedIn"] },
      { title: "Employee Performance Operations & Feedback Frameworks", duration: "2-3 months", desc: "Configure key performance indicators blueprints, run organizational goal alignment evaluations, and organize systematic skill calibration matrices.", tags: ["BambooHR Tools", "Glint Analytics"] },
      { title: "Labor Compliance, Law Registries & Policy Structures", duration: "3 months", desc: "Study corporate employment security rules, accessibility criteria, organizational risk profiles, and code enforcement files.", tags: ["HRCI Handbooks", "Legal Frameworks"] },
      { title: "Corporate Culture Matrices & Interaction Indexing", duration: "2 months", desc: "Administer structured worker sentiment trackers, implement resolution models, and track company engagement parameters.", tags: ["CultureAmp", "Workday Modules"] }
    ],
    courses: [
      { title: "Human Resources Associate Certificate", platform: "Coursera", rating: "4.7", cost: "Free" },
      { title: "Strategic Human Resource Operations Frameworks", platform: "LinkedIn Learning", rating: "4.6", cost: "Free" },
      { title: "People Analytics: Data-Driven Workforce Planning", platform: "Wharton / Coursera", rating: "4.8", cost: "Free" },
      { title: "Enterprise Talent Management Sourcing Specialist", platform: "Udemy Academic", rating: "4.5", cost: "Free" }
    ]
  },
  {
    title: "Financial Analyst",
    match: "74% Match",
    demand: "Medium Demand",
    demandColor: "text-amber-600 bg-amber-50 border-amber-100",
    description: "Build systematic financial ledger equations and multi-statement cash projections to audit capital parameters and forecast investment returns.",
    skills: [
      { name: "Financial Modeling", value: 92 },
      { name: "Corporate Valuation", value: 85 },
      { name: "Excel Macro Engines", value: 90 },
      { name: "Data Forecasting", value: 82 }
    ],
    salary: "$68,000 - $115,000",
    growth: "Medium",
    timeline: "12 - 18 months",
    openings: "14,000+",
    experience: "2-5 years",
    flexibility: "Hybrid",
    icon: DollarSign,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "Accounting Foundations & Multi-Statement Ledgering", duration: "3 months", desc: "Master the integration mechanics behind dynamic corporate cash statements, balance files auditing protocols, and performance spreadsheets.", tags: ["Investopedia", "CFI"] },
      { title: "Financial Valuation Systems & Dynamic Engineering", duration: "3-4 months", desc: "Construct comprehensive Discounted Cash Flow models, analyze transactional valuations arrays, and configure automated sensitivity analysis dashboards.", tags: ["Excel Macros", "WallStreetPrep"] },
      { title: "Capital Budgeting Analytics & Risk Optimization", duration: "2-3 months", desc: "Examine Internal Rate of Return vectors, evaluate net present value metrics, map asset depreciation lines, and audit capital variances.", tags: ["Financial Formulas", "CFA Guides"] },
      { title: "Macro Trend Data Ingestion & Analytics Portfolios", duration: "3 months", desc: "Track interest index fluctuations, calibrate inflation modeling sheets, track target microeconomics telemetry, and assemble summary investment brief cards.", tags: ["Bloomberg Terminal", "FactSet Tools"] }
    ],
    courses: [
      { title: "Introduction to Corporate Finance", platform: "Coursera", rating: "4.8", cost: "Free" },
      { title: "Advanced Financial Modeling and Valuation Methods", platform: "CFI Academy", rating: "4.9", cost: "Free" },
      { title: "Financial Markets and Investment Security Analysis", platform: "Yale University / edX", rating: "4.7", cost: "Free" },
      { title: "Python for Finance and Algorithmic Trading Systems", platform: "Udemy Premium", rating: "4.6", cost: "Free" }
    ]
  },
  {
    title: "Research Scientist",
    match: "81% Match",
    demand: "Medium Demand",
    demandColor: "text-amber-600 bg-amber-50 border-amber-100",
    description: "Design rigorous experimental loops and mathematical hypothesis arrays to isolate structural variances and publish industrial innovations.",
    skills: [
      { name: "Data Analytics", value: 85 },
      { name: "Statistical Modeling", value: 90 },
      { name: "Technical Writing", value: 95 },
      { name: "Hypothesis Design", value: 88 }
    ],
    salary: "$75,000 - $130,000",
    growth: "Medium",
    timeline: "24 - 36 months",
    openings: "8,000+",
    experience: "3-6 years",
    flexibility: "On-site Lab",
    icon: Binary,
    iconColor: "text-pink-600",
    iconBg: "bg-pink-50",
    roadmap: [
      { title: "Advanced Academic Methods & Double-Blind Frameworks", duration: "6 months", desc: "Formulate systematic analytical checks, handle complex control population samples data, and review statistical validations rules metrics.", tags: ["Nature", "MIT OpenCourseWare"] },
      { title: "Data Collection Procedures & Instrument Configurations", duration: "4-5 months", desc: "Integrate specialized physical diagnostic arrays pipelines, write sensor monitoring scripts logs, and store structured multi-variant data blocks cleanly.", tags: ["Lab Equipment", "MATLAB Analysis"] },
      { title: "Technical Drafting & Proprietary Patent Structuring", duration: "4 months", desc: "Compose comprehensive research publications layouts, design structural legal asset patent formulations records, and compile open replication guidelines logs.", tags: ["IEEE Formats", "WIPO Standards"] },
      { title: "Grant Ingestion Protocols & Program Coordination", duration: "5-6 months", desc: "Assemble precise analytical funding packets, layout milestone expectations trajectories, audit institutional compliance records, and direct multi-stage asset distributions.", tags: ["Research Portals", "Academic Frameworks"] }
    ],
    courses: [
      { title: "Understanding Research Methods", platform: "Coursera", rating: "4.6", cost: "Free" },
      { title: "Biostatistics and Empirical Data Processing Systems", platform: "Harvard / edX", rating: "4.8", cost: "Free" },
      { title: "Technical Writing and Scientific Documentation Formats", platform: "Stanford Online", rating: "4.7", cost: "Free" },
      { title: "Data Analysis and Modeling Foundations for Scientists", platform: "MIT Web", rating: "4.9", cost: "Free" }
    ]
  }
];

export default function BrowseCareers({ onNavigate, onLogout, activeCareerId }) {
  
  useEffect(() => {
    if (activeCareerId) {
      const matchedCareer = careers.find(c => c.title === activeCareerId);
      if (matchedCareer) {
        onNavigate('details', matchedCareer);
      }
    }
  }, [activeCareerId, onNavigate]);

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-sans antialiased">
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
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm border-l border-r border-gray-200 px-4 cursor-pointer" onClick={() => onNavigate('profile')}>
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User size={18} className="text-gray-500" />
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            <button onClick={onLogout} className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition cursor-pointer">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 border border-[#f2c6fa] text-[#bd24df] text-xs font-semibold px-3 py-1 rounded-full bg-white shadow-sm">
            <Search size={12} />
            Explore Career Options
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Browse Career Paths</h1>
          <p className="text-gray-500 text-sm sm:text-base">
            Discover various career opportunities and find the path that matches your interests and goals
          </p>
        </div>

        <div className="bg-[#8504a3] rounded-3xl p-8 text-center text-white shadow-xl max-w-4xl mx-auto relative overflow-hidden">
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-yellow-300">
              <Zap size={22} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Want Personalized Career Recommendations?</h2>
              <p className="text-purple-100 text-sm max-w-xl mx-auto">
                Take our AI-powered assessment to get careers matched to your unique profile
              </p>
            </div>
            <button onClick={() => onNavigate('quiz')} className="inline-flex items-center gap-2 bg-white text-[#8504a3] hover:bg-purple-50 font-bold px-6 py-3 rounded-xl shadow-md transition text-sm cursor-pointer">
              Take Career Assessment
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-100 text-left">
          <p className="text-sm font-bold text-gray-500">Showing {careers.length} careers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {careers.map((career, idx) => {
            const CareerCardIcon = career.icon;
            return (
              <div key={idx} className="bg-white rounded-3xl border border-gray-100 shadow-sm p-6 flex flex-col justify-between transition-all hover:shadow-md hover:translate-y-[-2px]">
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`p-3 rounded-xl ${career.iconBg} flex-shrink-0`}><CareerCardIcon size={24} className={career.iconColor} /></div>
                    <div className="text-left space-y-1.5">
                      <h3 className="font-bold text-gray-900 text-lg leading-snug">{career.title}</h3>
                      <span className={`inline-block text-[11px] font-bold px-2.5 py-0.5 rounded-full border ${career.demandColor}`}>{career.demand}</span>
                    </div>
                  </div>
                  <p className="text-gray-500 text-sm leading-relaxed min-h-[60px] text-left">{career.description}</p>
                  <div className="space-y-1.5 text-left">
                    <span className="text-xs font-bold text-gray-400 block">Key Skills:</span>
                    <div className="flex flex-wrap gap-1.5">
                      {career.skills.slice(0, 3).map((sk, sIdx) => (
                        <span key={sIdx} className="text-xs font-medium text-gray-600 bg-gray-50 px-2.5 py-1 rounded-md border border-gray-100">{sk.name}</span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 bg-gray-50 p-3 rounded-xl border border-gray-100 text-left">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Salary</span>
                      <span className="text-xs font-bold text-gray-800">{career.salary}</span>
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-bold text-gray-400 block">Growth</span>
                      <span className="text-xs font-bold text-gray-800">{career.growth}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => onNavigate('details', career)} 
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 bg-white border border-[#f5dbfc] text-[#bd24df] font-bold text-xs rounded-xl hover:bg-[#fdf2ff] transition cursor-pointer shadow-sm"
                  >
                    View Career Details
                    <ArrowRight size={14} />
                  </button>
                </div>

              </div>
            );
          })}
        </div>

        <div className="pt-10 border-t border-gray-100">
          <div className="bg-white rounded-3xl border border-gray-100 p-8 max-w-4xl mx-auto shadow-sm flex flex-col sm:flex-row items-center justify-between gap-6 text-left">
            <div className="space-y-2 max-w-xl">
              <div className="flex items-center gap-1.5 text-xs font-extrabold text-gray-400 uppercase tracking-wider">
                <Sparkles size={14} className="text-[#bd24df]" />
                <span>Not sure which career is best for you?</span>
              </div>
              <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                Get AI-Powered Career Suggestions
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed">
                Answer a few quick behavioral questions about your premium technical skills, core personal strengths, and work environments to generate an absolute mapped vector report.
              </p>
            </div>
            <button 
              onClick={() => onNavigate('quiz')} 
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#bd24df] text-white font-extrabold text-sm rounded-xl hover:bg-[#a61fc5] transition whitespace-nowrap shadow-md cursor-pointer"
            >
              <span>Get AI-Powered Career Suggestions</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>

      </main>
    </div>
  );
}