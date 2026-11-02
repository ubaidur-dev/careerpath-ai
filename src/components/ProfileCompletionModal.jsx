import React, { useEffect } from 'react';
import { X, UserCog, Settings, Lock } from 'lucide-react';
import { REQUIRED_PROFILE_PERCENT } from '../utils/profileCompletion';

export default function ProfileCompletionModal({ completion, onClose, onGoToProfile }) {
  const percent = completion?.percent ?? 0;
  const required = completion?.required ?? REQUIRED_PROFILE_PERCENT;
  const missing = completion?.missing ?? [];

  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [onClose]);

  return (
    <div
      className="fixed inset-0 z-[100] bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 animate-fade-in"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="profile-required-title"
        className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-center relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          title="Close"
          className="absolute top-5 right-5 w-8 h-8 rounded-full bg-[#FFEDF8] flex items-center justify-center text-[#83047A] hover:bg-[#ffdef9] hover:scale-105 transition-all cursor-pointer shadow-sm z-20 flex-shrink-0"
        >
          <X size={16} strokeWidth={2.5} />
        </button>

        <div className="mx-auto w-16 h-16 rounded-full bg-[#F7E8FF] border border-[#FFD2F7] flex items-center justify-center">
          <UserCog size={30} className="text-[#890080]" />
        </div>

        <h2 id="profile-required-title" className="mt-5 text-[25px] font-semibold text-[#000000] tracking-tight">
          Complete Your Profile First
        </h2>
        <p className="mt-2 text-[15px] font-regular text-gray-600 leading-relaxed">
          Our AI uses your profile together with your quiz answers to recommend the right careers.
          Please complete at least <span className="font-semibold text-[#890080]">{required}%</span> of your
          profile to unlock the Career Assessment.
        </p>

        <div className="mt-6 text-left space-y-2">
          <div className="flex items-center justify-between text-[14px]">
            <span className="font-medium text-[#000000]">Profile completion</span>
            <span className="font-semibold text-[#890080]">{percent}% <span className="font-regular text-gray-500">/ {required}% required</span></span>
          </div>
          <div className="relative h-2.5 w-full bg-[#F7E8FF] rounded-full overflow-hidden">
            <div
              className="h-full rounded-full bg-[#890080] transition-all duration-700 ease-out"
              style={{ width: `${Math.min(percent, 100)}%` }}
            />
            <div className="absolute top-0 h-full w-0.5 bg-[#FF00ED]" style={{ left: `${required}%` }} />
          </div>
          <div className="inline-flex items-center gap-1.5 text-[13px] font-medium text-red-600">
            <Lock size={13} />
            <span>Incomplete profile</span>
          </div>
        </div>

        {missing.length > 0 && (
          <div className="mt-5 text-left">
            <p className="text-[14px] font-medium text-[#000000] mb-2">Still missing</p>
            <div className="flex flex-wrap gap-2">
              {missing.slice(0, 6).map((label) => (
                <span key={label} className="px-3 py-1 rounded-full text-[13px] font-medium text-[#890080] bg-[#F7E8FF] border border-[#FFD2F7]">
                  {label}
                </span>
              ))}
              {missing.length > 6 && (
                <span className="px-3 py-1 rounded-full text-[13px] font-medium text-gray-500 bg-gray-50 border border-gray-200">
                  +{missing.length - 6} more
                </span>
              )}
            </div>
          </div>
        )}

        <div className="mt-7 flex flex-col gap-3">
          <button
            type="button"
            onClick={onGoToProfile}
            className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-full text-[15px] font-semibold text-white bg-[#890080] hover:bg-[#700068] transition shadow-sm cursor-pointer"
          >
            <Settings size={17} />
            <span>Go to Profile Settings</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full px-6 py-2.5 rounded-full text-[14px] font-semibold text-[#890080] bg-white border border-[#FFD2F7] hover:bg-[#F7E8FF] transition cursor-pointer"
          >
            Maybe Later
          </button>
        </div>
      </div>
    </div>
  );
}
