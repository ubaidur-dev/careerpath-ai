import React, { useState, useMemo } from 'react';

export default function StudentResults({ onBack }) {
  // --- SEARCH & FILTER CONTROLS STATE ---
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [dateFilter, setDateFilter] = useState('All');
  const [activeDropdown, setActiveDropdown] = useState(null);

  // --- MODAL DETAILED INTERACTION STATE ---
  const [selectedStudent, setSelectedStudent] = useState(null);

  // --- PAGINATION SYSTEMS CONTROL ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // --- COMPLETE RAW DATABASE MATRIX (30 RECORDS WITH UNIQUE IMAGE SCHEMAS) ---
  const initialStudents = [
    { id: 1, name: 'Sarah Johnson', email: 'sarah.j@gmail.com', status: 'Completed', score: 92, matchCareer: 'Software Developer', matchPct: 92, secondCareer: 'Data Analyst', secondPct: 87, time: '12 min', questions: '25/25', date: '2025-03-10', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 2, name: 'Michael Chen', email: 'michael.c@email.com', status: 'Completed', score: 87, matchCareer: 'UX Designer', matchPct: 87, secondCareer: 'Product Manager', secondPct: 81, time: '15 min', questions: '24/25', date: '2025-03-10', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 3, name: 'Emma Williams', email: 'emma.w@email.com', status: 'Completed', score: 95, matchCareer: 'Data Analyst', matchPct: 95, secondCareer: 'AI Engineer', secondPct: 89, time: '10 min', questions: '25/25', date: '2025-03-09', img: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150' },
    { id: 4, name: 'James Brown', email: 'james.b@gmail.com', status: 'In Progress', score: 74, matchCareer: 'Business Analyst', matchPct: 74, secondCareer: 'Digital Marketer', secondPct: 68, time: '18 min', questions: '19/25', date: '2025-03-09', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 5, name: 'Olivia Davis', email: 'olivia.d@email.com', status: 'Completed', score: 89, matchCareer: 'Digital Marketer', matchPct: 89, secondCareer: 'UX Designer', secondPct: 82, time: '14 min', questions: '23/25', date: '2025-03-08', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 6, name: 'Ali Rahman', email: 'ali.r@email.com', status: 'Completed', score: 91, matchCareer: 'Software Developer', matchPct: 91, secondCareer: 'Cloud Architect', secondPct: 85, time: '13 min', questions: '25/25', date: '2025-03-07', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: 7, name: 'Sophia Martinez', email: 'sophia.m@gmail.com', status: 'Completed', score: 94, matchCareer: 'AI Engineer', matchPct: 94, secondCareer: 'Software Developer', secondPct: 90, time: '11 min', questions: '25/25', date: '2025-03-07', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 8, name: 'David Wilson', email: 'david.w@yahoo.com', status: 'In Progress', score: 76, matchCareer: 'Cloud Architect', matchPct: 76, secondCareer: 'Network Engineer', secondPct: 70, time: '20 min', questions: '20/25', date: '2025-03-06', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: 9, name: 'Fatima Ahmed', email: 'fatima.a@outlook.com', status: 'Completed', score: 65, matchCareer: 'UX Designer', matchPct: 65, secondCareer: 'Graphic Designer', secondPct: 60, time: '16 min', questions: '18/25', date: '2025-03-06', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' },
    { id: 10, name: 'Ryan Garcia', email: 'ryan.g@tech.com', status: 'Failed', score: 58, matchCareer: 'Network Engineer', matchPct: 58, secondCareer: 'Cybersecurity Specialist', secondPct: 51, time: '22 min', questions: '14/25', date: '2025-03-05', img: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150' },
    { id: 11, name: 'Zain Khan', email: 'zain.k@gmail.com', status: 'Completed', score: 90, matchCareer: 'Software Developer', matchPct: 90, secondCareer: 'AI Engineer', secondPct: 83, time: '12 min', questions: '24/25', date: '2025-03-05', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 12, name: 'Chloe Miller', email: 'chloe.m@email.com', status: 'Completed', score: 85, matchCareer: 'Data Scientist', matchPct: 85, secondCareer: 'Business Analyst', secondPct: 78, time: '15 min', questions: '23/25', date: '2025-03-04', img: 'https://images.unsplash.com/photo-1554151228-14d9def656e4?w=150' },
    { id: 13, name: 'Daniel Craig', email: 'daniel.c@gmail.com', status: 'In Progress', score: 72, matchCareer: 'Cybersecurity Analyst', matchPct: 70, secondCareer: 'Network Admin', secondPct: 64, time: '19 min', questions: '19/25', date: '2025-03-04', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
    { id: 14, name: 'Ayesha Omer', email: 'ayesha.o@email.com', status: 'Completed', score: 96, matchCareer: 'AI Engineer', matchPct: 96, secondCareer: 'Data Scientist', secondPct: 91, time: '9 min', questions: '25/25', date: '2025-03-03', img: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=150' },
    { id: 15, name: 'William Smith', email: 'will.s@yahoo.com', status: 'Completed', score: 82, matchCareer: 'Business Analyst', matchPct: 82, secondCareer: 'Project Manager', secondPct: 75, time: '16 min', questions: '22/25', date: '2025-03-03', img: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150' },
    { id: 16, name: 'Grace Taylor', email: 'grace.t@tech.com', status: 'Completed', score: 89, matchCareer: 'UX Designer', matchPct: 89, secondCareer: 'UI Engineer', secondPct: 84, time: '14 min', questions: '24/25', date: '2025-03-02', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 17, name: 'Omar Farooq', email: 'omar.f@gmail.com', status: 'In Progress', score: 68, matchCareer: 'Digital Marketer', matchPct: 65, secondCareer: 'SEO Specialist', secondPct: 60, time: '17 min', questions: '17/25', date: '2025-03-02', img: 'https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150' },
    { id: 18, name: 'Lily Evans', email: 'lily.e@gmail.com', status: 'Completed', score: 93, matchCareer: 'Data Analyst', matchPct: 93, secondCareer: 'Business Intelligence', secondPct: 86, time: '11 min', questions: '25/25', date: '2025-03-01', img: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150' },
    { id: 19, name: 'Bilal Shah', email: 'bilal.s@outlook.com', status: 'Completed', score: 81, matchCareer: 'Cloud Architect', matchPct: 81, secondCareer: 'DevOps Engineer', secondPct: 76, time: '15 min', questions: '21/25', date: '2025-03-01', img: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150' },
    { id: 20, name: 'Mia Wong', email: 'mia.w@email.com', status: 'Failed', score: 55, matchCareer: 'UX Designer', matchPct: 55, secondCareer: 'Graphic Architect', secondPct: 50, time: '21 min', questions: '13/25', date: '2025-02-28', img: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150' },
    { id: 21, name: 'Hamza Khan', email: 'hamza.k@gmail.com', status: 'Completed', score: 88, matchCareer: 'Software Developer', matchPct: 88, secondCareer: 'Cloud Architect', secondPct: 82, time: '13 min', questions: '24/25', date: '2025-02-28', img: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150' },
    { id: 22, name: 'Jessica Taylor', email: 'jess.t@email.com', status: 'Completed', score: 91, matchCareer: 'UX Designer', matchPct: 91, secondCareer: 'Product Manager', secondPct: 85, time: '14 min', questions: '25/25', date: '2025-02-27', img: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150' },
    { id: 23, name: 'Arsalan Shafi', email: 'arsalan.s@outlook.com', status: 'In Progress', score: 70, matchCareer: 'Network Engineer', matchPct: 70, secondCareer: 'Cybersecurity Specialist', secondPct: 63, time: '19 min', questions: '18/25', date: '2025-02-27', img: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150' },
    { id: 24, name: 'Zoya Malik', email: 'zoya.m@gmail.com', status: 'Completed', score: 94, matchCareer: 'AI Engineer', matchPct: 94, secondCareer: 'Software Developer', secondPct: 88, time: '11 min', questions: '25/25', date: '2025-02-26', img: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150' },
    { id: 25, name: 'Rohit Sharma', email: 'rohit.s@tech.com', status: 'Completed', score: 83, matchCareer: 'Business Analyst', matchPct: 83, secondCareer: 'Digital Marketer', secondPct: 78, time: '15 min', questions: '22/25', date: '2025-02-26', img: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150' },
    { id: 26, name: 'Sana Javed', email: 'sana.j@email.com', status: 'Completed', score: 86, matchCareer: 'Digital Marketer', matchPct: 86, secondCareer: 'UX Designer', secondPct: 80, time: '14 min', questions: '23/25', date: '2025-02-25', img: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150' },
    { id: 27, name: 'Alex Mercer', email: 'alex.m@gmail.com', status: 'Failed', score: 59, matchCareer: 'Cybersecurity Analyst', matchPct: 59, secondCareer: 'Network Admin', secondPct: 52, time: '20 min', questions: '15/25', date: '2025-02-25', img: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150' },
    { id: 28, name: 'Maria Rodriguez', email: 'maria.r@yahoo.com', status: 'Completed', score: 90, matchCareer: 'Data Scientist', matchPct: 90, secondCareer: 'AI Engineer', secondPct: 84, time: '12 min', questions: '24/25', date: '2025-02-24', img: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150' },
    { id: 29, name: 'Daniyal Khan', email: 'daniyal.k@outlook.com', status: 'In Progress', score: 75, matchCareer: 'Cloud Architect', matchPct: 75, secondCareer: 'DevOps Engineer', secondPct: 69, time: '18 min', questions: '20/25', date: '2025-02-24', img: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150' },
    { id: 30, name: 'Elena Petrova', email: 'elena.p@email.com', status: 'Completed', score: 93, matchCareer: 'UX Designer', matchPct: 93, secondCareer: 'UI Engineer', secondPct: 87, time: '13 min', questions: '25/25', date: '2025-02-23', img: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150' }
  ];

  const getColorClass = (value) => {
    if (value >= 80) return 'text-emerald-700'; 
    if (value >= 70) return 'text-amber-600';   
    return 'text-red-600';                      
  };

  const filteredStudents = useMemo(() => {
    return initialStudents.filter((student) => {
      const matchQuery =
        student.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        student.matchCareer.toLowerCase().includes(searchQuery.toLowerCase());

      const matchStatus = statusFilter === 'All' || student.status === statusFilter;
      const matchDate = dateFilter === 'All' || student.date === dateFilter;

      return matchQuery && matchStatus && matchDate;
    });
  }, [searchQuery, statusFilter, dateFilter]);

  const totalPages = Math.ceil(filteredStudents.length / itemsPerPage) || 1;
  const displayedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredStudents.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredStudents, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
    }
  };

  // --- COMPREHENSIVE 30 STUDENTS BATCH PDF EXPORT SYSTEM ---
  const handleBulkDataExportPDF = () => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });
      
      let processedCount = 0;
      const totalRecords = initialStudents.length;

      // Inner helper to execute sequential page layout production loop
      const generatePage = (index) => {
        if (index >= totalRecords) {
          doc.save(`Complete_Student_Matrix_Report_30.pdf`);
          return;
        }

        const student = initialStudents[index];
        const img = new Image();
        img.crossOrigin = 'Anonymous';
        img.src = student.img;

        img.onload = () => {
          const canvas = document.createElement('canvas');
          canvas.width = img.width;
          canvas.height = img.height;
          const ctx = canvas.getContext('2d');
          ctx.drawImage(img, 0, 0);
          const dataURL = canvas.toDataURL('image/jpeg');

          // If not the first student, add a clean break canvas page
          if (index > 0) {
            doc.addPage();
          }

          // Strict Background Frame Style Injection
          doc.setFillColor(248, 250, 252);
          doc.rect(0, 0, 210, 297, 'F');
          
          // Original Top Header Line Accent
          doc.setDrawColor(219, 39, 119); // Brand Pink Color
          doc.setLineWidth(1.5);
          doc.line(15, 15, 195, 15);

          // Student Picture Block Rendering
          doc.addImage(dataURL, 'JPEG', 15, 23, 24, 24);
          
          // Header Text Elements
          doc.setTextColor(17, 24, 39);
          doc.setFont('Helvetica', 'bold');
          doc.setFontSize(19);
          doc.text(student.name, 44, 32);

          doc.setTextColor(156, 163, 175);
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(11);
          doc.text(student.email, 44, 39);

          doc.setDrawColor(241, 245, 249);
          doc.setLineWidth(0.5);
          doc.line(15, 54, 195, 54);

          // Table Metric Labels Header Array
          doc.setTextColor(107, 114, 128);
          doc.setFontSize(10);
          doc.setFont('Helvetica', 'bold');
          doc.text('EVALUATION PARAMETER', 15, 65);
          doc.text('METRIC SUMMARY DATA', 115, 65);

          doc.line(15, 69, 195, 69);

          const evaluationData = [
            ['Student Matrix Identity Key', `ID Row - #00${student.id}`],
            ['Assessment Evaluation Status', `${student.status}`],
            ['Overall Competency Score Index', `${student.score}%`],
            ['Total Execution Window Time', student.time],
            ['Validated Index Question Count', student.questions],
            ['Assessment Record Verification Date', student.date],
            ['Primary Career Track Vector Path', `${student.matchCareer} (${student.matchPct}% Match)`],
            ['Secondary Advisory Profile Track', `${student.secondCareer} (${student.secondPct}% Match)`]
          ];

          let currentLineY = 79;
          evaluationData.forEach(([label, value]) => {
            doc.setFont('Helvetica', 'normal');
            doc.setTextColor(55, 65, 81);
            doc.text(label, 15, currentLineY);
            
            // Highlight styling rules for precise colors logic
            if (label.includes('Score') || label.includes('Primary')) {
              doc.setTextColor(27, 67, 50); // Deep professional variant green
            } else if (value === 'Failed') {
              doc.setTextColor(185, 28, 28);
            } else if (value === 'In Progress') {
              doc.setTextColor(180, 83, 9);
            } else {
              doc.setTextColor(17, 24, 39);
            }
            
            doc.setFont('Helvetica', 'bold');
            doc.text(value, 115, currentLineY);
            
            doc.setDrawColor(241, 245, 249);
            doc.line(15, currentLineY + 4, 195, currentLineY + 4);
            currentLineY += 12;
          });

          // Master Corporate Professional Footer Stamp
          doc.setFont('Helvetica', 'normal');
          doc.setFontSize(9);
          doc.setTextColor(156, 163, 175);
          doc.text(`Page ${index + 1} of ${totalRecords} — CareerPathAI Global Analytics Engine Automated Record.`, 15, 275);

          // Run Next Item Execution Sequence
          generatePage(index + 1);
        };

        // Fallback execution handler for any local canvas image block exceptions
        img.onerror = () => {
          if (index > 0) doc.addPage();
          doc.setFont('Helvetica', 'bold');
          doc.text(`Data Backup Entry for ${student.name}`, 15, 30);
          generatePage(index + 1);
        };
      };

      // Trigger structural execution matrix
      generatePage(0);
    };
    document.body.appendChild(script);
  };

  // --- INDIVIDUAL ROW ACTION HANDLERS ---
  const handleSendEmail = (student) => {
    const targetEmail = student.email;
    const mailSubject = encodeURIComponent(`CareerPathAI Assessment Summary Results`);
    const mailBody = encodeURIComponent(`Dear ${student.name},\n\nWe have compiled your diagnostic assessment matrix details.\n\nOverall Profile Score: ${student.score}%\nPrimary Career Vector Match: ${student.matchCareer} (${student.matchPct}% Match Rating)\nAssessment Verification Date: ${student.date}\n\nSincerely,\nOperations Management Team`);
    
    window.open(`mailto:${targetEmail}?subject=${mailSubject}&body=${mailBody}`, '_self');
  };

  const handleExportPDFReport = (student) => {
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js';
    script.onload = () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF({ orientation: 'p', unit: 'mm', format: 'a4' });

      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.src = student.img;
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');

        doc.setFillColor(248, 250, 252);
        doc.rect(0, 0, 210, 297, 'F');
        
        doc.setDrawColor(219, 39, 119);
        doc.setLineWidth(1.5);
        doc.line(15, 15, 195, 15);

        doc.addImage(dataURL, 'JPEG', 15, 25, 24, 24);
        doc.setTextColor(17, 24, 39);
        doc.setFont('Helvetica', 'bold');
        doc.setFontSize(20);
        doc.text(student.name, 44, 34);

        doc.setTextColor(156, 163, 175);
        doc.setFont('Helvetica', 'normal');
        doc.setFontSize(11);
        doc.text(student.email, 44, 41);

        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.5);
        doc.line(15, 56, 195, 56);

        doc.setTextColor(107, 114, 128);
        doc.setFontSize(10);
        doc.setFont('Helvetica', 'bold');
        doc.text('EVALUATION PARAMETER', 15, 67);
        doc.text('METRIC SUMMARY DATA', 115, 67);

        doc.line(15, 71, 195, 71);

        const evaluationData = [
          ['Overall Competency Score', `${student.score}%`],
          ['Total Execution Window Time', student.time],
          ['Validated Index Question Count', student.questions],
          ['Assessment Record Verification Date', student.date],
          ['Primary Career Track Vector Path', `${student.matchCareer} (${student.matchPct}% Match)`],
          ['Secondary Advisory Profile Track', `${student.secondCareer} (${student.secondPct}% Match)`]
        ];

        let currentLineY = 81;
        doc.setFont('Helvetica', 'normal');
        doc.setTextColor(55, 65, 81);

        evaluationData.forEach(([label, value]) => {
          doc.text(label, 15, currentLineY);
          doc.setFont('Helvetica', 'bold');
          doc.text(value, 115, currentLineY);
          doc.setFont('Helvetica', 'normal');
          
          doc.line(15, currentLineY + 4, 195, currentLineY + 4);
          currentLineY += 12;
        });

        doc.setFontSize(9);
        doc.setTextColor(156, 163, 175);
        doc.text('This diagnostic asset is automatically compiled and verified by CareerPathAI Records.', 15, 275);

        doc.save(`${student.name.replace(/\s+/g, '_')}_VerificationReport.pdf`);
      };
    };
    document.body.appendChild(script);
  };

  return (
    <div className="space-y-7 antialiased text-[#111111] font-sans relative">
      
      {/* ================= HEADER ACTIONS SECTION ================= */}
      <div className="flex items-center justify-between border-b border-gray-100 pb-6">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 px-4 py-2.5 bg-[#f8fafc] border border-gray-200 hover:border-gray-300 rounded-xl font-semibold text-sm text-gray-600 hover:bg-gray-100 transition-all cursor-pointer shadow-3xs w-fit"
        >
          <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          Back to Dashboard
        </button>

        {/* ULTRA-BADA, EXTRA BOLD MASSIVE EXPORT DATA BUTTON */}
        <button 
          onClick={handleBulkDataExportPDF}
          className="flex items-center gap-3 px-8 py-4 bg-[#db2777] border border-[#db2777] hover:bg-[#be185d] text-white rounded-xl font-black text-base tracking-wider transition-all cursor-pointer shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 duration-200"
        >
          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export Data
        </button>
      </div>

      {/* ================= EXTRA LARGE CARDS METRICS INFO GRID WITH LARGE EMOJIS ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 tracking-wider uppercase">Total Assessments</div>
              {/* BIG GIGANTIC EMOJI INTEGRATION */}
              <span className="text-4xl sm:text-5xl select-none transform hover:scale-110 transition-transform duration-200">📊</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">30</div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">+100%</span>
            <span className="text-[11px] font-medium text-gray-400">active entries loaded</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 tracking-wider uppercase">Completed Today</div>
              <span className="text-4xl sm:text-5xl select-none transform hover:scale-110 transition-transform duration-200">✅</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">24</div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">Success</span>
            <span className="text-[11px] font-medium text-gray-400">finished states</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 tracking-wider uppercase">Average Score</div>
              <span className="text-4xl sm:text-5xl select-none transform hover:scale-110 transition-transform duration-200">📈</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">83.4%</div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-100">High Score</span>
            <span className="text-[11px] font-medium text-gray-400">performance margin</span>
          </div>
        </div>

        <div className="bg-white border border-gray-200/80 p-5 rounded-2xl shadow-2xs flex flex-col justify-between relative overflow-hidden">
          <div>
            <div className="flex items-center justify-between">
              <div className="text-xs font-bold text-gray-400 tracking-wider uppercase">Avg. Completion Time</div>
              <span className="text-4xl sm:text-5xl select-none transform hover:scale-110 transition-transform duration-200">⏱️</span>
            </div>
            <div className="text-3xl font-bold text-gray-900 mt-2 tracking-tight">14.8 min</div>
          </div>
          <div className="mt-4 flex items-center gap-1.5">
            <span className="text-xs font-bold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-100">Optimal</span>
            <span className="text-[11px] font-medium text-gray-400">speed threshold</span>
          </div>
        </div>
      </div>

      {/* ================= SEARCH & INTERACTIVE FILTERS ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="relative">
          <input 
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value) || setCurrentPage(1)}
            placeholder="Search by student name, email, or core match..."
            className="w-full bg-white border border-gray-200 focus:border-[#db2777] text-sm font-medium pl-11 pr-4 py-2.5 rounded-xl outline-none transition-all placeholder:text-gray-400"
          />
          <svg className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>

        <div className="relative">
          <select 
            value={statusFilter} 
            onChange={(e) => setStatusFilter(e.target.value) || setCurrentPage(1)}
            onFocus={() => setActiveDropdown('status')}
            onBlur={() => setActiveDropdown(null)}
            className={`w-full bg-white border text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all appearance-none cursor-pointer text-gray-600 ${
              activeDropdown === 'status' ? 'border-[#db2777] ring-1 ring-[#db2777]/10' : 'border-gray-200'
            }`}
          >
            <option value="All">All Status</option>
            <option value="Completed">Completed</option>
            <option value="In Progress">In Progress</option>
            <option value="Failed">Failed</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        <div className="relative">
          <select 
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value) || setCurrentPage(1)}
            onFocus={() => setActiveDropdown('date')}
            onBlur={() => setActiveDropdown(null)}
            className={`w-full bg-white border text-sm font-medium px-4 py-2.5 rounded-xl outline-none transition-all appearance-none cursor-pointer text-gray-600 ${
              activeDropdown === 'date' ? 'border-[#db2777] ring-1 ring-[#db2777]/10' : 'border-gray-200'
            }`}
          >
            <option value="All">All Dates</option>
            <option value="2025-03-10">2025-03-10</option>
            <option value="2025-03-09">2025-03-09</option>
            <option value="2025-03-08">2025-03-08</option>
            <option value="2025-03-07">2025-03-07</option>
          </select>
          <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      </div>

      {/* ================= RESULTS MATRIX TABLE CONTAINER ================= */}
      <div className="bg-white border border-gray-100 rounded-2xl p-4 shadow-3xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#fafbfc] border-b border-gray-100 text-gray-400 font-semibold text-[12px] tracking-wider uppercase">
                <th className="px-5 py-3.5">Student</th>
                <th className="px-5 py-3.5 text-center">Status</th>
                <th className="px-5 py-3.5 text-center">Score</th>
                <th className="px-5 py-3.5">Top Career Match</th>
                <th className="px-5 py-3.5 text-center">Match %</th>
                <th className="px-5 py-3.5 text-center">Completed</th>
                <th className="px-5 py-3.5 text-center">Actions</th>
              </tr>
            </thead>
            
            <tbody className="divide-y divide-gray-50 text-sm font-medium text-gray-600">
              {displayedStudents.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50/40 transition-colors">
                  
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <img 
                        src={student.img} 
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover border border-gray-50"
                      />
                      <div>
                        <div className="font-semibold text-gray-900 text-base leading-tight">{student.name}</div>
                        <div className="text-xs text-gray-400 font-normal mt-0.5">{student.email}</div>
                      </div>
                    </div>
                  </td>

                  <td className="px-5 py-4 text-center">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-semibold border ${
                      student.status === 'Completed' 
                        ? 'text-green-600 bg-green-50 border-green-100' 
                        : student.status === 'In Progress'
                        ? 'text-amber-600 bg-amber-50 border-amber-100'
                        : 'text-red-600 bg-red-50 border-red-100'
                    }`}>
                      {student.status}
                    </span>
                  </td>

                  <td className={`px-5 py-4 text-center font-bold text-base ${getColorClass(student.score)}`}>
                    {student.score}%
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center gap-2">
                      {/* Clean isolated dark blue suitcase vector */}
                      <svg className="w-4 h-4 text-[#1e3a8a] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-3V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1-.9 2-2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 5h6v2H9V5zm11 14H4V9h16v10z" />
                      </svg>
                      <span className="font-semibold text-gray-800">{student.matchCareer}</span>
                    </div>
                  </td>

                  <td className={`px-5 py-4 text-center text-sm font-bold ${getColorClass(student.matchPct)}`}>
                    {student.matchPct}%
                  </td>

                  <td className="px-5 py-4 text-center text-gray-400 text-xs font-normal">
                    {student.date}
                  </td>

                  <td className="px-5 py-4">
                    <div className="flex items-center justify-center gap-2">
                      <button 
                        onClick={() => setSelectedStudent(student)}
                        className="w-8 h-8 rounded-lg border border-pink-100 bg-white hover:bg-pink-50 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4 text-[#db2777]" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                      </button>

                      <button 
                        onClick={() => handleSendEmail(student)}
                        className="w-8 h-8 rounded-lg border border-gray-200 bg-white hover:bg-gray-50 flex items-center justify-center transition-all cursor-pointer shadow-2xs"
                      >
                        <svg className="w-4 h-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </td>

                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ================= PAGINATION NAVIGATION CONTROLS ================= */}
      <div className="flex items-center justify-center pt-1">
        <div className="flex items-center gap-1 text-xs font-semibold">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              currentPage === 1 
                ? 'border-gray-100 text-gray-300 bg-transparent cursor-not-allowed' 
                : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 cursor-pointer'
            }`}
          >
            Previous
          </button>

          {[...Array(totalPages)].map((_, index) => {
            const pageNum = index + 1;
            return (
              <button
                key={pageNum}
                onClick={() => handlePageChange(pageNum)}
                className={`w-7.5 h-7.5 rounded-lg flex items-center justify-center transition-all cursor-pointer border ${
                  currentPage === pageNum
                    ? 'bg-[#db2777] text-white border-[#db2777]'
                    : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                }`}
              >
                {pageNum}
              </button>
            );
          })}

          <button 
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className={`px-3 py-1.5 rounded-lg border transition-all ${
              currentPage === totalPages 
                ? 'border-gray-100 text-gray-300 bg-transparent cursor-not-allowed' 
                : 'border-gray-200 text-gray-600 bg-white hover:bg-gray-50 cursor-pointer'
            }`}
          >
            Next
          </button>
        </div>
      </div>

      {/* ================= DYNAMIC DETAILED MODAL ================= */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-7 relative shadow-2xl border border-gray-100">
            
            <button 
              onClick={() => setSelectedStudent(null)}
              className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 cursor-pointer p-1.5 hover:bg-gray-50 rounded-xl transition-all"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <h2 className="text-xl font-bold text-gray-800 tracking-tight mb-6">Assessment Details</h2>

            <div className="flex items-center gap-4 mb-6 pb-6 border-b border-gray-50">
              <img 
                src={selectedStudent.img} 
                alt={selectedStudent.name} 
                className="w-14 h-14 rounded-full object-cover border-2 border-pink-50"
              />
              <div>
                <h3 className="text-lg font-bold text-gray-900 leading-tight">{selectedStudent.name}</h3>
                <p className="text-sm font-medium text-gray-400 mt-0.5">{selectedStudent.email}</p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3.5 mb-6">
              <div className="bg-[#fafbfc] border border-gray-100 p-3.5 rounded-2xl">
                <span className="text-xs font-semibold text-gray-400 block mb-1">Overall Score</span>
                <span className="text-lg font-extrabold text-gray-950 block">{selectedStudent.score}%</span>
              </div>
              <div className="bg-[#fafbfc] border border-gray-100 p-3.5 rounded-2xl">
                <span className="text-xs font-semibold text-gray-400 block mb-1">Completion Time</span>
                <span className="text-lg font-extrabold text-gray-950 block">{selectedStudent.time}</span>
              </div>
              <div className="bg-[#fafbfc] border border-gray-100 p-3.5 rounded-2xl">
                <span className="text-xs font-semibold text-gray-400 block mb-1">Questions</span>
                <span className="text-lg font-extrabold text-gray-950 block">{selectedStudent.questions}</span>
              </div>
            </div>

            <div className="mb-7">
              <h4 className="text-xs uppercase font-bold tracking-wider text-gray-400 mb-3.5">Career Recommendations</h4>
              <div className="space-y-2.5">
                
                <div className="bg-blue-50/60 border border-blue-100 px-4 py-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-5 h-5 text-[#1e3a8a] shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M20 7h-3V5c0-1.1-.9-2-2-2H9c-1.1 0-2 .9-2 2v2H4c-1.1 0-2 .9-2 2v10c0 1.1-.9 2-2 2h16c1.1 0 2-.9 2-2V9c0-1.1-.9-2-2-2zM9 5h6v2H9V5zm11 14H4V9h16v10z" />
                    </svg>
                    <span className="text-sm font-bold text-[#1e3a8a]">{selectedStudent.matchCareer}</span>
                  </div>
                  <span className="text-sm font-extrabold text-[#1e3a8a]">{selectedStudent.matchPct}%</span>
                </div>

                <div className="bg-white border border-gray-100 px-4 py-3.5 rounded-xl flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <svg className="w-4 h-4 text-gray-400 shrink-0" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                    <span className="text-sm font-semibold text-gray-700">{selectedStudent.secondCareer}</span>
                  </div>
                  <span className="text-sm font-bold text-gray-500">{selectedStudent.secondPct}%</span>
                </div>

              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <button 
                onClick={() => handleSendEmail(selectedStudent)}
                className="flex items-center justify-center gap-2 py-3 bg-[#fdf2f8] border border-pink-100 hover:border-pink-200 text-[#db2777] font-bold text-sm rounded-xl transition-all cursor-pointer shadow-3xs"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Send Email
              </button>

              <button 
                onClick={() => handleExportPDFReport(selectedStudent)}
                className="flex items-center justify-center gap-2 py-3 bg-white border border-gray-200 hover:border-gray-300 text-gray-700 font-bold text-sm rounded-xl transition-all cursor-pointer shadow-3xs hover:bg-gray-50"
              >
                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                </svg>
                Export Report
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}