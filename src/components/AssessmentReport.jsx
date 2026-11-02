import { Sparkles, UserRound } from 'lucide-react';
import { formatIssueDate } from '../utils/issueDate';
import Signature from './Signature';
import { CareerMatchCard } from './CareerResults';

export const PAGE_WIDTH = 1120;
const PAGE_HEIGHT = Math.round(PAGE_WIDTH * 297 / 210);

function SignOff({ report }) {
  return (
    <div className="flex items-end justify-between mt-10">
      <div className="text-left text-[14px] text-gray-500 font-medium leading-relaxed">
        <div>Issue Date: <span className="text-gray-800">{report.issuedAt || formatIssueDate()}</span></div>
        <div>Certificate ID: <span className="text-gray-800">{report.certificateId}</span></div>
        <div>Assessment: <span className="text-gray-800">#{report.number}</span></div>
        <div>Certified As: <span className="text-gray-800">CareerPath AI Team</span></div>
      </div>
      <div className="text-center">
        <div className="flex justify-center -mb-2"><Signature /></div>
        <div className="w-[230px] border-b border-gray-400 mb-1.5 mx-auto"></div>
        <p className="text-[14px] font-semibold text-gray-700">Authorized Signature</p>
        <p className="text-[13px] text-gray-400">CareerPath AI Team</p>
      </div>
    </div>
  );
}

function ReportPage({ report, studentName, pageNumber, totalPages, children }) {
  return (
    <div
      data-pdf-page
      className="bg-[#fcf8fe] text-gray-800 antialiased flex flex-col px-12 py-10"
      style={{ width: PAGE_WIDTH, minHeight: PAGE_HEIGHT, fontFamily: "'Inter', sans-serif" }}
    >
      <div className="flex items-center justify-between pb-6 mb-8 border-b border-[#FFD2F7]">
        <img src="/logoo.png" alt="CareerPath AI" className="h-14 w-auto object-contain" />
        <div className="text-right">
          <div className="text-[17px] font-semibold text-gray-900">Assessment #{report.number} Report</div>
          <div className="text-[14px] text-gray-500 font-light">{studentName} · {report.date} at {report.time}</div>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-10">{children}</div>

      {pageNumber === totalPages && <SignOff report={report} />}

      <div className="flex items-center justify-between pt-5 mt-10 border-t border-[#FFD2F7] text-[13px] text-gray-500">
        <span>CareerPath AI · Smart Counselling For Your Future</span>
        <span>Page {pageNumber} of {totalPages}</span>
      </div>
    </div>
  );
}

function SummaryBars({ title, items }) {
  if (!items?.length) return null;
  return (
    <div className="bg-[#FCF5FF] border-[1px] border-[#EEC9FF] shadow-[0px_2px_3px_0.5px_rgba(0,0,0,0.25)] rounded-[25px] p-6 space-y-4">
      <h4 className="text-[17px] font-semibold text-gray-900 tracking-tight">{title}</h4>
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="space-y-1.5">
            <div className="flex items-center justify-between text-[14px]">
              <span className="text-[#000000] font-regular">{item.label}</span>
              <span className="text-[#7E06AD] font-semibold">{item.percent}%</span>
            </div>
            <div className="w-full h-[8px] bg-[#F3E4FF] rounded-full overflow-hidden">
              <div className="h-full bg-[#F45EE4] rounded-full" style={{ width: `${item.percent}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function ProfileSummary({ summary }) {
  return (
    <div className="bg-white border border-[#FFD2F7] shadow-[4px_6px_6px_1px_rgba(0,0,0,0.25)] rounded-[32px] p-10 flex flex-col gap-8">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 flex items-center justify-center text-[#FF00ED]">
          <UserRound size={36} strokeWidth={1.5} />
        </div>
        <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">Your Profile Summary</h2>
      </div>
      <p className="text-[17px] font-regular text-[#707070] -mt-4">
        What your assessment responses revealed about you. These traits are what our AI matched against every career.
      </p>

      <div className="flex items-center gap-8 bg-[#840094] rounded-2xl px-8 py-6 text-white shadow-[5px_5px_5px_rgba(0,0,0,0.35)] ring-[3px] ring-inset ring-[#FFD0F3]">
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="text-[44px] font-bold text-[#FFF959] leading-none tracking-wider">{summary.hollandCode}</div>
          <div className="text-[15px] font-semibold text-[#F0E802] mt-2">Holland Code</div>
        </div>
        <div className="space-y-1">
          <div className="text-[22px] font-bold text-white leading-tight">Your Personality Type</div>
          <p className="text-[16px] font-medium text-white leading-snug">
            {summary.personality.map((p) => p.label).join(' · ')}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <SummaryBars title="Personality (RIASEC)" items={summary.personality} />
        <SummaryBars title="Top Interests" items={summary.interests} />
        <SummaryBars title="Your Strengths" items={summary.strengths} />
        <SummaryBars title="Preferred Work Style" items={summary.workStyle} />
        <SummaryBars title="What Matters to You" items={summary.values} />
        <SummaryBars title="Preferred Workplace" items={summary.workplace} />
      </div>

      <p className="text-[13px] text-gray-500 text-center">
        This summary is generated from your responses. Your individual answers are kept private.
      </p>
    </div>
  );
}

export default function AssessmentReport({ report, studentName }) {
  const matches = report.recommendations || [];
  const topMatch = matches[0];
  const careerCount = matches.length;

  const summary = report.profileSummary;
  const totalPages = Math.max(matches.length, 1) + (summary ? 1 : 0);
  const page = (number, content) => (
    <ReportPage key={number} report={report} studentName={studentName} pageNumber={number} totalPages={totalPages}>
      {content}
    </ReportPage>
  );

  return (
    <div>
      {page(1, (
        <>
          <div className="text-center space-y-4 max-w-2xl mx-auto">
            <div className="inline-flex items-center gap-2 border border-[#FF00ED] text-gray-800 font-light px-5 py-1.5 rounded-full bg-white shadow-sm">
              <Sparkles size={16} className="flex-shrink-0 text-[#83047A]" />
              <span className="text-base leading-3 flex items-center">AI Career Assessment Report</span>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight text-gray-900">Your Top Career Matches</h1>
            <p className="text-gray-500 max-w-xl mx-auto font-light text-xl">
              Our AI has analyzed your skills, interests, and personality to find careers that perfectly match your unique profile.
            </p>
          </div>

          <div className="w-full min-h-[104px] bg-[#840094] rounded-2xl px-6 py-5 flex flex-row items-center justify-between text-white relative overflow-hidden gap-6 shadow-[5px_5px_5px_rgba(0,0,0,0.35)] ring-[3px] ring-inset ring-[#FFD0F3]">
            <div className="flex flex-col justify-center text-left">
              <h2 className="text-[26px] font-bold text-white leading-tight">Assessment Complete! 🎉</h2>
              <p className="text-[19px] font-medium text-white leading-tight mt-1">
                We've analyzed your responses and found your {careerCount === 1 ? 'best career match' : `${careerCount} best career matches`}
              </p>
            </div>
            <div className="flex items-center gap-12 justify-end">
              <div className="flex flex-col items-center">
                <div className="text-[32px] font-bold text-[#59FF9C] leading-none">{topMatch?.match ?? report.score ?? 0}%</div>
                <div className="text-[19px] font-semibold text-[#00E55C] mt-1.5">Best Match</div>
              </div>
              <div className="flex flex-col items-center">
                <div className="text-[32px] font-bold text-[#FFF959] leading-none">{careerCount}</div>
                <div className="text-[19px] font-semibold text-[#F0E802] mt-1.5">{careerCount === 1 ? 'Career' : 'Careers'}</div>
              </div>
            </div>
          </div>

          {topMatch && <CareerMatchCard match={topMatch} isTop onNavigate={() => {}} hideRoadmapButton />}
        </>
      ))}

      {matches.slice(1).map((m, i) => page(i + 2, (
        <>
          {i === 0 && (
            <div className="text-center space-y-2">
              <h2 className="text-[26px] font-bold text-gray-900 tracking-tight">Other Careers That Match You</h2>
              <p className="text-gray-500 font-light text-[18px]">Strong alternatives based on the same assessment responses</p>
            </div>
          )}
          <CareerMatchCard match={m} isTop={false} onNavigate={() => {}} hideRoadmapButton />
        </>
      )))}

      {summary && page(totalPages, <ProfileSummary summary={summary} />)}
    </div>
  );
}
