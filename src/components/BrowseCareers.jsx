import React, { useEffect } from 'react';
import Header from './Header';
import { 
  Search, 
  Zap, 
  ArrowRight,
  Code2,
  BarChart3,
  PenTool,
  Briefcase,
  TrendingUp,
  Target,
  Users,
  DollarSign,
  Sparkles,
  Search as SearchIcon
} from 'lucide-react';

const careers = [
  {
    title: "Software Developer",
    match: "92% Match",
    demand: "Very High Demand",
    demandColor: "text-emerald-600 bg-emerald-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-blue-600 bg-blue-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-blue-600 bg-blue-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-amber-600 bg-amber-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-blue-600 bg-blue-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-blue-600 bg-blue-50",
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
    icon: Target,
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-amber-600 bg-amber-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-amber-600 bg-amber-50",
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
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    demandColor: "text-amber-600 bg-amber-50",
    description: "Design rigorous experimental loops and mathematical hypothesis arrays to isolate structural variances and publish industrial innovations.",
    skills: [
      { name: "Data Analytics", value: 85 },
      { name: "Statistical Modeling", value: 90 },
      { name: "Technical Writing", value: 95 },
      { name: "Hypothesis Design", value: 88 }
    ],
    salary: "$70,000 - $120,000",
    growth: "Medium",
    timeline: "24 - 36 months",
    openings: "8,000+",
    experience: "3-6 years",
    flexibility: "On-site Lab",
    icon: SearchIcon,
    iconColor: "text-[#FF2D55]",
    iconBg: "bg-[#FFE7F2] border-[0.5px] border-[#FF00ED]",
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
    if (activeCareerId && typeof activeCareerId === 'string') {
      const matchedCareer = careers.find(c => c.title === activeCareerId);
      if (matchedCareer) {
        onNavigate('details', matchedCareer);
      }
    }
  }, [activeCareerId, onNavigate]);

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-['Inter',sans-serif] antialiased">
      
      <style>
        {`
          .figma-personalized-box-shadow {
            box-shadow: 4px 6px 6px 1px rgba(0, 0, 0, 0.25);
          }
          .figma-9-cards-prototype {
            border: 1px solid #FFD2F7;
            box-shadow: 1px 5px 5px 0.2px rgba(0, 0, 0, 0.25);
          }
          .figma-assessment-btn-prototype {
            border: 1px solid #83047A;
            background-color: #FFE7F2;
            color: #83047A;
          }
        `}
      </style>

      <Header onNavigate={onNavigate} onLogout={onLogout} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative">
        
        <div className="absolute hidden lg:block top-6 left-8 z-40">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            &larr; Back To Dashboard
          </button>
        </div>

        <div className="block lg:hidden w-full text-left mb-2">
          <button 
            onClick={() => onNavigate('dashboard')} 
            className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer"
          >
            &larr; Back To Dashboard
          </button>
        </div>

        <div className="text-center space-y-4 max-w-2xl mx-auto">
          <div 
            style={{ borderColor: '#FF00ED' }}
            className="inline-flex items-center gap-2 border text-gray-800 font-light px-5 py-1.5 rounded-full bg-white shadow-sm"
          >
            <Search 
              size={16}
              style={{ color: '#83047A' }} 
              className="flex-shrink-0" 
            />
            <span 
              style={{ fontSize: '16px' }} 
              className="leading-3 flex items-center"
            >
              Explore Career Options
            </span>
          </div>
          <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">Browse Career Paths</h1>
          <p 
            style={{ fontSize: '19px' }} 
            className="text-gray-500 max-w-xl mx-auto font-light"
          >
            Discover various career opportunities and find the path that matches your interests and goals
          </p>
        </div>

        <div 
          style={{ backgroundColor: '#83047A', width: '800px', minHeight: '60px' }} 
          className="rounded-[30px] border-[2.5px] border-[#FFD0F3] figma-personalized-box-shadow p-8 text-center text-white max-w-4xl mx-auto my-auto relative overflow-hidden left-0 right-0 mb-9"
        >
          <div className="relative z-10 space-y-5">
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center mx-auto text-yellow-300">
              <Zap size={25} className="animate-pulse" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl sm:text-2xl font-bold">Want Personalized Career Recommendations?</h2>
              <p 
                style={{ fontSize: '20.5px' }} 
                className="text-purple-100 max-w-none whitespace-nowrap mx-auto font-light"
              >
                Take our AI-powered assessment to get careers matched to your unique profile
              </p>
            </div>
            <button 
              onClick={() => onNavigate('quiz')} 
              style={{ backgroundColor: '#FFDAF6', width: '310px', height: '48px', fontSize: '21px' }}
              className="inline-flex items-center justify-center gap-2 text-[#83047A] hover:opacity-95 font-normal rounded-xl shadow-md hover:scale-[1.02] hover:shadow-lg active:scale-[0.98] transition-all duration-300 cursor-pointer mx-auto"
            >
              <span>Take Career Assessment</span>
              <ArrowRight size={18} className="flex-shrink-0" />
            </button>
          </div>
        </div>

        <div className="pt-2 text-left">
          <p className="text-sm font-bold text-gray-500">Showing {careers.length} careers</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-9 px-2">
          {careers.map((career, idx) => {
            const CareerCardIcon = career.icon;
            
            let demandBadgeStroke = '#FFD2F7'; 
            if (career.demand === "Medium Demand") demandBadgeStroke = '#CF7900';
            else if (career.demand === "High Demand") demandBadgeStroke = '#000ACF';
            else if (career.demand === "Very High Demand") demandBadgeStroke = '#00CF56';

            return (
              <div 
                key={idx} 
                className="bg-white rounded-[20px] figma-9-cards-prototype p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px]"
              >
                
                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-[17px] ${career.iconBg} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <CareerCardIcon size={30} className={career.iconColor} />
                    </div>
                    <div className="text-left space-y-1.5 pt-0.5">
                      <h3 className="font-semibold text-gray-900 text-lg leading-snug">{career.title}</h3>
                      <span 
                        style={{ border: `0.3px solid ${demandBadgeStroke}` }}
                        className={`inline-block text-[11px] font-medium px-2.5 py-0.5 rounded-[12px] border border-[0.1px] ${career.demandColor}`}
                      >
                        {career.demand}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#525252] text-sm leading-relaxed min-h-[60px] text-left font-normal">{career.description}</p>
                  
                  <div className="space-y-2 text-left">
                    <span className="text-[13px] font-bold text-[#525252] block">Key Skills:</span>
                    <div className="flex flex-wrap gap-1 items-center whitespace-nowrap overflow-hidden">
                      {career.skills.slice(0, 3).map((sk, sIdx) => (
                        <span 
                          key={sIdx} 
                          style={{ border: '0.3px solid #A3A3A3', fontSize: '11.5px' }}
                          className="font-normal text-[#525252] bg-[#A3A3A3]/10 px-2 py-0.2 rounded-[11px]"
                        >
                          {sk.name}
                        </span>
                      ))}
                      <span 
                        style={{ border: '0.3px solid #A3A3A3', fontSize: '11.5px' }}
                        className="font-normal text-[#525252] bg-[#A3A3A3]/10 px-2 py-0.2 rounded-[15px]"
                      >
                        +1
                      </span>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-2 gap-3 text-left">
                    <div className="bg-[#F9F9F9] px-3 py-1.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[45px]">
                      <span className="text-[13px] font-normal text-[#525252] block leading-tight mb-0.5">Salary</span>
                      <span className="text-[13px] font-bold text-gray-800 leading-tight">{career.salary}</span>
                    </div>
                    <div className="bg-[#F9F9F9] px-3 py-1.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[45px]">
                      <span className="text-[13px] font-normal text-[#525252] block leading-tight mb-0.5">Growth</span>
                      <span className="text-[13px] font-bold text-gray-800 leading-tight">{career.growth}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex justify-center w-full">
                    <button 
                      onClick={() => onNavigate('details', career)} 
                      className="w-full sm:w-[250px] h-[45px] inline-flex items-center justify-center gap-2 bg-[#FFE7F2] border-[0.5px] border-[#83047A] text-[#83047A] font-inter text-[17px] font-medium rounded-[17px] hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer shadow-sm px-4"
                    >
                      <span>View Career Details</span>
                      <ArrowRight size={23} className="text-[#83047A] flex-shrink-0" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>

                <div className="pt-12 border-t border-gray-100 w-full flex flex-col items-center justify-center text-center">
          
                  <h3 
                    style={{ fontSize: '17.3px', marginBottom: '26px', marginTop: '-5px' }} 
                    className="text-black-900 font-regular font-['Inter',sans-serif] tracking-normal px-4"
                  >
                    Not sure which career is right for you?
                  </h3>
                  
                  <div className="w-full px-4 flex justify-center items-center">
                    <button 
                      onClick={() => onNavigate('quiz')} 
                      style={{ 
                        fontSize: '18.5px',
                        maxWidth: '420px',
                        height: '56px' 
                      }} 
                      className="w-full xs:w-auto px-8 inline-flex items-center justify-center gap-3 figma-assessment-btn-prototype rounded-[20px] font-medium font-['Inter',sans-serif] tracking-wide shadow-sm hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer"
                    >
                      <span>Get AI-Powered Career Suggestions</span>
                      <ArrowRight size={17} className="text-[#83047A] flex-shrink-0" />
                    </button>
                  </div>

                </div>

      </main> 
    </div>
  );
}
