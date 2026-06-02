import React from 'react';
import { 
  LayoutDashboard, 
  User, 
  LogOut, 
  DollarSign, 
  TrendingUp, 
  Briefcase, 
  Calendar,
  BookOpen,
  Award,
  ChevronLeft,
  CheckCircle2,
  Clock,
  Layers,
  MapPin,
  HelpCircle
} from 'lucide-react';

export default function CareerDetails({ careerData, onBack, onNavigate }) {
  
  if (!careerData) {
    return (
      <div className="min-h-screen bg-[#fcf8fe] flex items-center justify-center font-sans">
        <div className="text-center space-y-4 max-w-sm p-6 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <HelpCircle size={40} className="text-gray-400 mx-auto" />
          <p className="text-gray-600 font-bold text-sm">No career path selected. Please navigate back to choose one.</p>
          <button onClick={onBack} className="bg-[#bd24df] text-white px-4 py-2 rounded-xl text-xs font-bold shadow-md">
            Go Back
          </button>
        </div>
      </div>
    );
  }

  const extendedDatabase = {
    "Software Developer": {
      iconText: "</>",
      roleOverview: "Design, build, and deploy production-grade software applications. This role requires breaking complex business problems down into scalable, maintainable logic structures, writing testable code, optimizing application delivery pipelines, and managing relational data schemas.",
      fullRoadmap: [
        { title: "Learn Programming Fundamentals", duration: "2-3 months", desc: "Master the absolute basics of core programming syntax, control structures, variables, loops, arrays, and functions with Python or JavaScript.", tags: ["Codecademy", "freeCodeCamp", "Python.org"] },
        { title: "Build Your First Projects", duration: "2 months", desc: "Create 3-5 frontend and full-stack projects using semantic markup and component-driven layouts to demonstrate your responsive skills.", tags: ["GitHub", "Personal Portfolio", "Open Source"] },
        { title: "Learn Data Structures & Algorithms", duration: "3-4 months", desc: "Understand core CS concepts, time complexity analytics ($O(n)$ metrics), stacks, queues, trees, and hash maps for technical interviews.", tags: ["LeetCode", "HackerRank", "CS50"] },
        { title: "Master a Framework & DevOps", duration: "3-4 months", desc: "Learn modern reactive state trees with React, Angular, or Vue along with server deployment models, continuous optimization, and container routing.", tags: ["Official Docs", "YouTube", "Udemy"] }
      ],
      fullCourses: [
        { title: "Complete Web Development Bootcamp", platform: "Udemy", rating: "4.7", cost: "Free" },
        { title: "CS50: Introduction to Computer Science", platform: "Harvard/edX", rating: "4.9", cost: "Free" },
        { title: "The Odin Project Full-Stack Path", platform: "Free Online", rating: "4.8", cost: "Free" },
        { title: "Full Stack Open Ecosystem Certification", platform: "University of Helsinki", rating: "4.9", cost: "Free" }
      ]
    },
    "Data Analyst": {
      iconText: "📊",
      roleOverview: "Transform raw corporate database payloads into actionable business intelligence strategies. Responsibilities include auditing backend pipelines, engineering mathematical metrics, processing statistical matrices, and styling clear data visualization dashboards.",
      fullRoadmap: [
        { title: "Advanced Spreadsheets & Modeling", duration: "2 months", desc: "Master multi-conditional logical lookups, complex pivot tables, structural data formatting, statistical regression models, and trend sheets.", tags: ["Excel Advanced", "Google Sheets Core"] },
        { title: "Relational Databases & Advanced SQL", duration: "2-3 months", desc: "Write production-grade multi-join operations, nested sub-queries, CTE windows, window ranking metrics, and complex relational view schemas.", tags: ["PostgreSQL Engine", "SQLZoo", "Mode Analytics"] },
        { title: "Programmatic Analytics Processing", duration: "3 months", desc: "Ingest, scrub, clean, and structure massive unstructured datasets using Python scripting modules, handling null entries, and pandas data frames.", tags: ["Pandas Library", "NumPy Modules", "Jupyter Workspace"] },
        { title: "Business Intelligence Reporting Platforms", duration: "2-3 months", desc: "Design interactive real-time visual executive data experiences, cross-model blending grids, data storytelling pathways, and refresh systems.", tags: ["Tableau Enterprise", "Microsoft PowerBI", "Looker Studio"] }
      ],
      fullCourses: [
        { title: "Google Data Analytics Professional Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
        { title: "Data Analysis with Python Applied Specialization", platform: "freeCodeCamp Labs", rating: "4.9", cost: "Free" },
        { title: "SQL for Data Science Complex Queries Course", platform: "UC Davis / Coursera", rating: "4.6", cost: "Free" },
        { title: "Advanced Tableau Dashboard Design Architecture", platform: "Udemy Academic", rating: "4.7", cost: "Free" }
      ]
    },
    "UX Designer": {
      iconText: "🎨",
      roleOverview: "Architect clean, friction-free user interaction journeys and product designs across cross-platform environments. This requires behavioral psychology alignment, structural wireframing, component tokens, and iterative user testing.",
      fullRoadmap: [
        { title: "UX Psychology & Interaction Principles", duration: "2 months", desc: "Study core behavioral design rules, cognitive load maps, accessibility compliance criteria, and heuristic evaluation matrices.", tags: ["Nielsen Norman Group", "UX Collective"] },
        { title: "Mastering Figma UI Ecosystem", duration: "2-3 months", desc: "Learn comprehensive components assembly, auto-layout parameters, variant variables, responsive design tokens, and functional interaction prototyping.", tags: ["Figma Design Academy", "YouTube Labs"] },
        { title: "User Research & User Testing", duration: "2 months", desc: "Conduct qualitative user discovery sessions, user persona profile design, affinity sort mapping, and multi-stage empathy journey tracing.", tags: ["User Testing Labs", "Interaction Design Org"] },
        { title: "Wireframing & High-Fidelity Case Studies", duration: "3 months", desc: "Assemble low-fidelity layout concepts into structural high-fidelity screen maps. Build 3 detailed end-to-end multi-platform portfolio case studies.", tags: ["Balsamiq UI", "Behance Showcase", "Dribbble"] }
      ],
      fullCourses: [
        { title: "Google UX Design Professional Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
        { title: "Product Design Core Frameworks Specialization", platform: "Udacity Nanodegree", rating: "4.5", cost: "Free" },
        { title: "Figma UI/UX Advanced Design Essentials Masterclass", platform: "Skillshare Premium", rating: "4.7", cost: "Free" },
        { title: "UI Architecture & Interface Token Systems", platform: "Interaction Design Org", rating: "4.8", cost: "Free" }
      ]
    },
    "Business Analyst": {
      iconText: "💼",
      roleOverview: "Bridge the communication gap between business managers and product software engineering execution. Responsible for extracting company needs and translating them into technical specifications, flow charts, and functional requirements.",
      fullRoadmap: [
        { title: "Requirements Elicitation & Matrix Mapping", duration: "2 months", desc: "Learn structured user requirements gathering, strategic stakeholder matrix tracking, gap analysis blueprints, and core SWOT parameters.", tags: ["IIBA Guide", "Udemy Business"] },
        { title: "Process Modeling & Diagram Standards", duration: "2-3 months", desc: "Master professional Business Process Model and Notation (BPMN) parameters, technical user workflow charting, and system boundary maps.", tags: ["Lucidchart", "MS Visio Systems"] },
        { title: "Agile Project Framework Engineering", duration: "2 months", desc: "Learn functional sprint planning mechanics, backlog item grooming protocols, project lifecycle tracking, and explicit acceptance rule building.", tags: ["Scrum Alliance", "Atlassian Docs"] },
        { title: "Enterprise Data Analytics Fundamentals", duration: "2-3 months", desc: "Study core corporate database extraction patterns, basic SQL reporting syntax, metric key performance indicators, and data interpretation arrays.", tags: ["SQL Queries", "Tableau Reporting"] }
      ],
      fullCourses: [
        { title: "Business Analysis Foundations & System Scopes", platform: "LinkedIn Learning", rating: "4.6", cost: "Free" },
        { title: "Agile Software Product Planning with Jira Systems", platform: "Coursera", rating: "4.7", cost: "Free" },
        { title: "IIBA Certified Business Analysis Practitioner Prep", platform: "Udemy Academic", rating: "4.8", cost: "Free" },
        { title: "Corporate Business Intelligence & Data Mapping", platform: "Microsoft Learn", rating: "4.5", cost: "Free" }
      ]
    },
    "Digital Marketing Specialist": {
      iconText: "📈",
      roleOverview: "Maximize customer growth conversion metrics across omni-channel acquisition funnels. Responsibilities include indexing crawler logic, programmatic advertising systems management, analytical pixel tracking, and targeted campaign allocation.",
      fullRoadmap: [
        { title: "Search Engine Optimization Indexing", duration: "2 months", desc: "Learn semantic structural on-page tags optimization, search engine crawling architecture, keyword matrix intents, and backlinks indexing data.", tags: ["HubSpot Systems", "Moz SEO Academy"] },
        { title: "Paid Programmatic Ads Frameworks", duration: "2-3 months", desc: "Master performance budget distribution profiles, target match setups, remarketing tracking pixel mechanics, and bid optimization routines.", tags: ["Google Skillshop", "Meta Blueprint Engine"] },
        { title: "Content Strategy & Copywriting Funnels", duration: "2 months", desc: "Build high-converting consumer retention emails, structured brand messaging scripts, automated workflows, and brand awareness schedules.", tags: ["Mailchimp Tech", "Copywriting Basics"] },
        { title: "Marketing Analytics & Attribution Tracking", duration: "2-3 months", desc: "Analyze customer lifetime values, tracking acquisition cohorts, attribution model configurations, and data reporting schedules.", tags: ["Google Analytics 4", "Mixpanel Engine"] }
      ],
      fullCourses: [
        { title: "Google Digital Marketing & E-Commerce Corporate Certificate", platform: "Coursera", rating: "4.8", cost: "Free" },
        { title: "Inbound Marketing Automation Methodology Cert", platform: "HubSpot Academy", rating: "4.7", cost: "Free" },
        { title: "Advanced Google Ads Paid Search Masterclass", platform: "Udemy Professional", rating: "4.6", cost: "Free" },
        { title: "Web Analytics Data Tracking and Audience Cohorts", platform: "SimpliLearn Portal", rating: "4.5", cost: "Free" }
      ]
    },
    "Product Manager": {
      iconText: "🎯",
      roleOverview: "Own the absolute lifecycle and resource priority boundaries of software products. This demands evaluating development constraints across engineering, UX design, and market operations teams to ship minimal viable models.",
      fullRoadmap: [
        { title: "Product Discovery & Market Fit Mechanics", duration: "3 months", desc: "Evaluate customer retention loops, run automated user discovery sessions, map product feature validations, and structure competitive analytics profiles.", tags: ["Product School", "Mind the Product"] },
        { title: "Product Roadmapping & Prioritization Matrix", duration: "2 months", desc: "Master RICE or MoSCoW prioritization, design user experience stories, and structure cross-functional product roadmap goals.", tags: ["Jira Software", "Productboard Tool"] },
        { title: "UX Wireframing & Product Specifications", duration: "2-3 months", desc: "Write technical product requirement documents, design layout wireframe structures, and specify component metrics for engineering teams.", tags: ["Figma Wireframes", "Confluence Docs"] },
        { title: "Product Analytics & Growth Metrics", duration: "3 months", desc: "Track conversion funnels, coordinate $A/B$ split tests, compute net promoter scores, and manage product optimization loops.", tags: ["Mixpanel Data", "Amplitude Systems"] }
      ],
      fullCourses: [
        { title: "Brand Management & Agile Product Delivery Lifecycles", platform: "Coursera", rating: "4.6", cost: "Free" },
        { title: "Product Management 101: Strategy and Launch Methods", platform: "Udemy", rating: "4.5", cost: "Free" },
        { title: "Product Analytics Core Engineering Frameworks", platform: "Amplitude Academy", rating: "4.8", cost: "Free" },
        { title: "Enterprise Product Manager Master Certification", platform: "Product School", rating: "4.7", cost: "Free" }
      ]
    },
    "Human Resources Specialist": {
      iconText: "👥",
      roleOverview: "Architect corporate employee talent optimization frameworks. This includes coordinating algorithmic candidate tracking files, refining company communication, and managing corporate legal compliance portfolios.",
      fullRoadmap: [
        { title: "Talent Acquisition Funnels Sourcing", duration: "2 months", desc: "Master complex boolean indexing queries on corporate databases, job specifications engineering, and structural applicant tracking processes.", tags: ["SHRM Core Path", "LinkedIn Recruiter"] },
        { title: "Employee Performance Operations", duration: "2-3 months", desc: "Design data-driven corporate feedback loops, professional goal tracking structures, talent calibration templates, and training plans.", tags: ["BambooHR Tools", "Glint Analytics"] },
        { title: "Labor Compliance & Policy Formulation", duration: "3 months", desc: "Study modern enterprise labor safety law frames, workplace compliance criteria, contract drafting models, and policy enforcement codes.", tags: ["HRCI Handbooks", "Legal Frameworks"] },
        { title: "Corporate Culture & Engagement Metrics", duration: "2 months", desc: "Implement structured organizational sentiment tracking indices, conflict resolution strategies, and corporate employee well-being systems.", tags: ["CultureAmp", "Workday Modules"] }
      ],
      fullCourses: [
        { title: "Human Resources Associate Professional Systems Track", platform: "Coursera", rating: "4.7", cost: "Free" },
        { title: "Strategic Human Resource Operations Frameworks", platform: "LinkedIn Learning", rating: "4.6", cost: "Free" },
        { title: "People Analytics: Data-Driven Workforce Planning", platform: "Wharton / Coursera", rating: "4.8", cost: "Free" },
        { title: "Enterprise Talent Management Sourcing Specialist", platform: "Udemy Academic", rating: "4.5", cost: "Free" }
      ]
    },
    "Financial Analyst": {
      iconText: "💵",
      roleOverview: "Design systematic financial forecasting equations and investment yield indices to model corporate growth variables, evaluate cash distributions, and compute portfolio valuations.",
      fullRoadmap: [
        { title: "Corporate Financial Statements Accounting", duration: "3 months", desc: "Model three-statement ledger accounting frameworks, match balancing statements, organize cash flows, and trace corporate tax distributions.", tags: ["Investopedia Labs", "CFI Frameworks"] },
        { title: "Financial Modeling & Valuation Systems", duration: "3-4 months", desc: "Construct fully dynamic Discounted Cash Flow models, sensitivity tables, asset valuation equations, and merger transaction spreadsheets.", tags: ["Excel Macros", "WallStreetPrep"] },
        { title: "Capital Budgeting & Risk Assessment", duration: "2-3 months", desc: "Analyze Internal Rate of Return (IRR), Net Present Value equations, financial risk variances, and cost of capital metrics.", tags: ["Financial Formulas", "CFA Guides"] },
        { title: "Macroeconomic Trend Ingestion Strategies", duration: "3 months", desc: "Analyze industry valuation indices, inflation metrics adjustments, cross-market telemetry, and executive investment advisory reporting.", tags: ["Bloomberg Terminal", "FactSet Tools"] }
      ],
      fullCourses: [
        { title: "Introduction to Corporate Finance Data Ingestion", platform: "Coursera", rating: "4.8", cost: "Free" },
        { title: "Advanced Financial Modeling and Valuation Methods", platform: "CFI Academy", rating: "4.9", cost: "Free" },
        { title: "Financial Markets and Investment Security Analysis", platform: "Yale University / edX", rating: "4.7", cost: "Free" },
        { title: "Python for Finance and Algorithmic Trading Systems", platform: "Udemy Premium", rating: "4.6", cost: "Free" }
      ]
    },
    "Research Scientist": {
      iconText: "🔬",
      roleOverview: "Formulate rigorous, empirical research methodologies and experimental pipelines to test multi-variable hypotheses and engineer industrial technological innovations.",
      fullRoadmap: [
        { title: "Experimental Design & Hypothesis Testing", duration: "6 months", desc: "Master double-blind empirical testing parameters, control groups selection rules, statistical significance validation ($p$-values), and logic models.", tags: ["Nature Journals", "MIT OpenCourseWare"] },
        { title: "Data Collection & Lab Instrumentation", duration: "4-5 months", desc: "Learn to interface precision laboratory diagnostics arrays, stream high-volume tracking sensors logs, and store structured clean datasets.", tags: ["Lab Equipment", "MATLAB Analysis"] },
        { title: "Technical Writing & Patent Filing", duration: "4 months", desc: "Structure high-impact scientific peer-review manuscripts, organize patent data claim parameters, and design reproducible reference architectures.", tags: ["IEEE Formats", "WIPO Standards"] },
        { title: "Grant Acquisition & Project Coordination", duration: "5-6 months", desc: "Formulate research grant proposal packets, define programmatic milestone trajectories, manage regulatory compliance audits, and align institutional resources.", tags: ["Research Portals", "Academic Frameworks"] }
      ],
      fullCourses: [
        { title: "Understanding Complex Academic Research Methodologies", platform: "Coursera", rating: "4.6", cost: "Free" },
        { title: "Biostatistics and Empirical Data Processing Systems", platform: "Harvard / edX", rating: "4.8", cost: "Free" },
        { title: "Technical Writing and Scientific Documentation Formats", platform: "Stanford Online", rating: "4.7", cost: "Free" },
        { title: "Data Analysis and Modeling Foundations for Scientists", platform: "MIT Web", rating: "4.9", cost: "Free" }
      ]
    }
  };

  const staticContext = extendedDatabase[careerData.title] || extendedDatabase["Software Developer"];

  return (
    <div className="min-h-screen bg-[#fcf8fe] text-gray-800 font-sans antialiased">
      
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => onNavigate('dashboard')}>
            <div className="w-8 h-8 rounded-lg bg-[#bd24df] flex items-center justify-center text-white font-bold text-xl">¢</div>
            <span className="font-bold text-xl tracking-tight text-gray-900">CareerPath<span className="text-[#bd24df]">AI</span></span>
          </div>
          <div className="flex items-center gap-4 sm:gap-6">
            <button onClick={() => onNavigate('dashboard')} className="flex items-center gap-2 bg-[#fdf2ff] text-[#bd24df] px-4 py-2 rounded-xl text-sm font-semibold border border-[#f5dbfc]">
              <LayoutDashboard size={18} />
              <span className="hidden sm:inline">Dashboard</span>
            </button>
            <div className="flex items-center gap-2 text-gray-700 font-medium text-sm border-l border-r border-gray-200 px-4">
              <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                <User size={18} className="text-gray-500" />
              </div>
              <span className="hidden sm:inline">Ahmed!</span>
            </div>
            <button className="flex items-center gap-1.5 text-gray-500 hover:text-red-600 text-sm font-medium transition">
              <LogOut size={18} />
              <span className="hidden sm:inline">Logout</span>
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        <div className="text-left">
          <button 
            onClick={onBack}
            className="inline-flex items-center gap-1.5 bg-white border border-gray-200 px-4 py-2 rounded-xl text-xs font-bold text-gray-600 hover:bg-gray-50 transition shadow-sm cursor-pointer"
          >
            <ChevronLeft size={14} strokeWidth={2.5} />
            Back to Recommendations
          </button>
        </div>

        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm text-left space-y-4">
          <div className="flex items-start sm:items-center gap-5">
            <div className="w-16 h-16 rounded-2xl border-2 border-pink-200 bg-pink-50/40 flex items-center justify-center text-purple-600 flex-shrink-0 text-xl font-mono font-extrabold shadow-sm">
              {staticContext.iconText}
            </div>
            <div className="space-y-1">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-gray-900">{careerData.title}</h1>
                <span className="inline-flex items-center text-xs font-bold px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-full shadow-sm">
                  ✓ {careerData.match || "92% Match"}
                </span>
              </div>
              <p className="text-gray-400 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={12} /> Personalized Learning Paths &bull; Tech Frameworks 2026
              </p>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-50 space-y-1.5">
            <h4 className="text-xs font-extrabold text-gray-400 uppercase tracking-wider">Role Overview Statement</h4>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              {staticContext.roleOverview}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-left">
          <div className="flex items-center gap-3 border-r border-gray-50 pr-2">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600"><DollarSign size={20} strokeWidth={2.5} /></div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Salary Range</span>
              <span className="text-sm font-extrabold text-gray-900">{careerData.salary}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-50 pr-2">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600"><TrendingUp size={20} strokeWidth={2.5} /></div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Growth Velocity</span>
              <span className="text-sm font-extrabold text-gray-900">{careerData.growth} Growth</span>
            </div>
          </div>
          <div className="flex items-center gap-3 border-r border-gray-50 pr-2">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600"><Briefcase size={20} strokeWidth={2.5} /></div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Market Demand</span>
              <span className="text-sm font-extrabold text-gray-900">{careerData.demand}</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-50 text-purple-600"><Calendar size={20} strokeWidth={2.5} /></div>
            <div>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider block">Track Timeline</span>
              <span className="text-sm font-extrabold text-gray-900">{careerData.timeline || "12-18 Months"}</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          
          <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-6 text-left">
            <div className="flex items-center justify-between border-b border-gray-50 pb-4">
              <div className="flex items-center gap-2">
                <Layers size={18} className="text-gray-800" />
                <h2 className="text-base font-extrabold text-gray-900">Your Learning Roadmap</h2>
              </div>
              <span className="text-[11px] font-bold bg-[#fdf2ff] text-[#bd24df] border border-[#f5dbfc] px-2.5 py-0.5 rounded-md flex items-center gap-1">
                <Clock size={12} /> Sequence Map
              </span>
            </div>

            <div className="relative pl-6 sm:pl-10 space-y-6 before:absolute before:inset-y-2 before:left-[11px] sm:before:left-[19px] before:w-[2px] before:bg-gray-100">
              {staticContext.fullRoadmap.map((step, idx) => (
                <div key={idx} className="relative bg-white border border-gray-100 rounded-2xl p-5 shadow-sm space-y-3 transition-all hover:shadow-md hover:border-pink-200">
                  
                  <div className="absolute top-5 left-[-33px] sm:left-[-41px] w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-white border-2 border-[#bd24df] text-gray-800 font-extrabold text-[10px] flex items-center justify-center z-10 shadow-sm">
                    {idx === 0 ? "◎" : idx + 1}
                  </div>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <h3 className="font-extrabold text-gray-900 text-sm sm:text-base tracking-tight">{step.title}</h3>
                    <div className="text-xs font-bold text-gray-400 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Clock size={11} /> {step.duration}
                    </div>
                  </div>
                  
                  <p className="text-gray-500 text-xs sm:text-sm leading-relaxed">{step.desc}</p>
                  
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {step.tags.map((tag, tIdx) => (
                      <span key={tIdx} className="text-[11px] font-bold text-gray-500 bg-gray-50 border border-gray-200 px-2.5 py-0.5 rounded-md">
                        {tag}
                      </span>
                    ))}
                  </div>

                </div>
              ))}
            </div>

            <div className="pt-4 space-y-4">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <BookOpen size={18} className="text-purple-600" />
                <h3 className="text-base font-extrabold text-gray-900">Recommended Courses</h3>
              </div>
              
              <div className="grid grid-cols-1 gap-2">
                {staticContext.fullCourses.map((course, cIdx) => (
                  <div key={cIdx} className="flex items-center justify-between p-4 bg-gray-50/40 border border-gray-100 rounded-xl hover:bg-gray-50 transition text-left">
                    <div className="space-y-1 pr-2">
                      <div className="font-bold text-gray-900 text-xs sm:text-sm leading-tight flex items-center gap-1.5">
                        <CheckCircle2 size={13} className="text-purple-500 flex-shrink-0" />
                        {course.title}
                      </div>
                      <div className="text-[11px] text-gray-400 font-bold flex items-center gap-3 pl-4">
                        <span>{course.platform}</span>
                        <span className="text-amber-500 flex items-center gap-0.5">★ {course.rating}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-md border border-blue-100 flex-shrink-0">
                      {course.cost}
                    </span>
                  </div>
                ))}
              </div>
            </div>

          </div>

          <div className="space-y-6 text-left">
            
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-5">
              <div className="flex items-center gap-2 border-b border-gray-50 pb-3">
                <Award size={18} className="text-purple-600" />
                <h2 className="text-base font-extrabold text-gray-900">Required Skills</h2>
              </div>
              
              <div className="space-y-4">
                {careerData.skills?.map((skill, skIdx) => (
                  <div key={skIdx} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span className="text-gray-500">{skill.name}</span>
                      <span className="text-[#bd24df]">{skill.value}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                      <div className="bg-[#bd24df] h-full rounded-full transition-all duration-500" style={{ width: `${skill.value}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
              <h3 className="text-base font-extrabold text-gray-900 text-center">Career Outlook</h3>
              
              <div className="space-y-2.5">
                <div className="bg-emerald-50/60 border border-emerald-100 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">Job Openings</span>
                  <span className="text-sm font-extrabold text-emerald-600">{careerData.openings || "45,000+"}</span>
                </div>

                <div className="bg-blue-50/60 border border-blue-100 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">Average Experience</span>
                  <span className="text-sm font-extrabold text-blue-600">{careerData.experience || "3-5 years"}</span>
                </div>

                <div className="bg-purple-50/60 border border-purple-100 p-3 rounded-xl">
                  <span className="text-[10px] uppercase font-bold text-gray-400 block tracking-wide">Work Flexibility</span>
                  <span className="text-sm font-extrabold text-purple-600">{careerData.flexibility || "Remote OK"}</span>
                </div>
              </div>
            </div>

          </div>

        </div>

      </main>
    </div>
  );
}