import React from 'react';
import { RefreshCw } from 'lucide-react';

export default function RefreshButton({
  onClick,
  spinning = false,
  disabled = false,
  size = 'md',
  className = '',
}) {
  const sizeCls =
    size === 'lg'
      ? 'h-[57px] px-5 text-[16px] rounded-[15px]'
      : 'h-[46px] px-4 text-[15px] rounded-xl';

  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled || spinning}
      title="Refresh"
      aria-label="Refresh"
      className={`inline-flex items-center justify-center gap-2 font-semibold border border-[#FFD2F7] bg-[#FCF8FE] text-[#83047A] hover:bg-[#FFE1FD] hover:border-[#F45EE4]/50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex-shrink-0 ${sizeCls} ${className}`}
    >
      <RefreshCw size={16} className={spinning ? 'animate-spin' : ''} />
      <span>Refresh</span>
    </button>
  );
}
