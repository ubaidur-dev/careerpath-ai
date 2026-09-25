import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Header from './Header';
import { Search, Zap, ArrowRight, Filter } from 'lucide-react';
import {
  getCareerIcon,
  getDemandBadgeProps,
  CAREER_CARD_ICON_BG,
  CAREER_CARD_ICON_COLOR
} from '../utils/careerVisuals';
import BackToDashboardButton from './BackToDashboardButton';

export default function BrowseCareers({ onNavigate, onLogout, activeCareerId }) {
  const [careers, setCareers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

  useEffect(() => {
    const fetchCareers = async () => {
      try {
        const response = await axios.get('http://localhost:8000/api/career-details');
        setCareers(response.data || []);
      } catch (error) {
        console.error("Error fetching careers:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCareers();
    const intervalId = setInterval(fetchCareers, 5000);
    return () => clearInterval(intervalId);
  }, []);

  useEffect(() => {
    if (activeCareerId && typeof activeCareerId === 'string' && careers.length > 0) {
      const matchedCareer = careers.find(c => c.title === activeCareerId);
      if (matchedCareer) {
        onNavigate('details', matchedCareer);
      }
    }
  }, [activeCareerId, careers, onNavigate]);

  const totalPages = Math.ceil(careers.length / itemsPerPage) || 1;
  const activePage = currentPage > totalPages ? totalPages : currentPage;
  const maxVisiblePages = 9;
  let pageWindowStart = Math.max(1, activePage - Math.floor(maxVisiblePages / 2));
  let pageWindowEnd = Math.min(totalPages, pageWindowStart + maxVisiblePages - 1);
  pageWindowStart = Math.max(1, pageWindowEnd - maxVisiblePages + 1);
  const visiblePageNumbers = Array.from({ length: pageWindowEnd - pageWindowStart + 1 }, (_, i) => pageWindowStart + i);
  const startIndex = (activePage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, careers.length);
  const displayedCareers = careers.slice(startIndex, endIndex);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

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

      <Header onNavigate={onNavigate} onLogout={onLogout} currentView="browse" />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 relative">

        <BackToDashboardButton onClick={() => onNavigate('dashboard')} />

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
            className="text-[#525252] max-w-xl mx-auto font-light"
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

        <div className="pt-2 flex items-center text-left">
          {loading ? (
            <p className="text-sm font-bold text-gray-500">Loading careers...</p>
          ) : (
            <div className="text-[16px] font-normal text-[#545454] flex items-center gap-2">
              <Filter size={18} className="text-gray-400" />
              <span>
                Showing <strong className="text-gray-900 font-semibold">{careers.length === 0 ? 0 : startIndex + 1}</strong> - <strong className="text-gray-900 font-semibold">{endIndex}</strong> of <strong className="text-gray-900 font-semibold">{careers.length}</strong> careers
              </span>
            </div>
          )}
        </div>

        {!loading && careers.length === 0 && (
          <div className="text-center py-16 text-gray-400 font-medium">
            No career profiles available yet. Please check back soon.
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-9 px-2">
          {displayedCareers.map((career) => {
            const CareerCardIcon = getCareerIcon(career.icon);
            const demandBadge = getDemandBadgeProps(career.demand);
            const DemandIcon = demandBadge.Icon;

            return (
              <div
                key={career.id}
                className="bg-white rounded-[20px] figma-9-cards-prototype p-6 flex flex-col justify-between transition-all hover:translate-y-[-2px] min-w-0"
              >

                <div className="space-y-4">
                  <div className="flex items-start gap-4">
                    <div className={`w-14 h-14 rounded-[17px] ${CAREER_CARD_ICON_BG} flex items-center justify-center flex-shrink-0 shadow-sm`}>
                      <CareerCardIcon size={30} className={CAREER_CARD_ICON_COLOR} />
                    </div>
                    <div className="text-left space-y-1.5 pt-0.5 flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-lg leading-snug break-words">{career.title}</h3>
                      <span
                        className={`inline-flex items-center gap-1 text-[11px] font-medium tracking-wide px-2.5 py-0.5 rounded-full border whitespace-nowrap ${demandBadge.textClass} ${demandBadge.bgClass} ${demandBadge.borderClass}`}
                      >
                        <DemandIcon size={12} className={`${demandBadge.iconColor} flex-shrink-0`} />
                        {career.demand}
                      </span>
                    </div>
                  </div>
                  <p className="text-[#525252] text-sm leading-relaxed min-h-[60px] text-left font-normal break-words">{career.description}</p>

                  <div className="space-y-2 text-left">
                    <span className="text-[13px] font-bold text-[#525252] block">Key Skills:</span>
                    <div className="flex flex-wrap gap-1 items-center whitespace-nowrap overflow-hidden">
                      {(career.skills || []).slice(0, 3).map((sk, sIdx) => (
                        <span
                          key={sIdx}
                          style={{ border: '0.3px solid #A3A3A3', fontSize: '11.5px' }}
                          className="font-normal text-[#525252] bg-[#A3A3A3]/10 px-2 py-0.2 rounded-[11px]"
                        >
                          {sk.name}
                        </span>
                      ))}
                      {(career.skills || []).length > 3 && (
                        <span
                          style={{ border: '0.3px solid #A3A3A3', fontSize: '11.5px' }}
                          className="font-normal text-[#525252] bg-[#A3A3A3]/10 px-2 py-0.2 rounded-[15px]"
                        >
                          +{career.skills.length - 3}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-4">
                  <div className="grid grid-cols-5 gap-3 text-left">
                    <div className="col-span-3 bg-[#F9F9F9] px-3 py-1.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[45px] overflow-hidden">
                      <span className="text-[13px] font-normal text-[#525252] block leading-tight mb-0.5">Salary</span>
                      <span className="text-[12.5px] font-bold text-gray-800 leading-tight whitespace-nowrap">{career.salary}</span>
                    </div>
                    <div className="col-span-2 bg-[#F9F9F9] px-3 py-1.5 rounded-xl border border-gray-100 flex flex-col justify-center min-h-[45px] overflow-hidden">
                      <span className="text-[13px] font-normal text-[#525252] block leading-tight mb-0.5">Growth</span>
                      <span className="text-[13px] font-bold text-gray-800 leading-tight whitespace-nowrap">{career.growth}</span>
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

        {!loading && careers.length > 0 && (
          <div className="flex justify-center items-center gap-2 pt-2">
            <button
              type="button"
              onClick={() => handlePageChange(activePage - 1)}
              disabled={activePage === 1}
              className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Previous
            </button>

            <div className="flex items-center gap-2 mx-1">
              {visiblePageNumbers.map((pageNum) => {
                return (
                  <button
                    key={pageNum}
                    type="button"
                    onClick={() => handlePageChange(pageNum)}
                    className={`w-10 h-10 rounded-full flex items-center justify-center text-[16px] font-medium transition-all cursor-pointer ${
                      activePage === pageNum
                        ? 'bg-[#F45EE4] text-white shadow-sm'
                        : 'bg-white text-gray-700 border border-gray-200 hover:border-[#F45EE4] hover:text-[#890080]'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() => handlePageChange(activePage + 1)}
              disabled={activePage === totalPages}
              className="px-6 py-2 rounded-full border border-[#F45EE4]/40 text-[#890080] bg-[#FFE1FD] hover:bg-[#fae6f4] text-[16px] font-medium transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        )}

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
                        maxWidth: '432px',
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
