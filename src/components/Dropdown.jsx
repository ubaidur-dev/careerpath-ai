import React, { useState, useRef, useEffect, useCallback } from 'react';
import { ChevronDown, Check } from 'lucide-react';

export default function Dropdown({
  value,
  onChange,
  options = [],
  className = '',
  variant = 'filter',
  triggerClassName = '',
  placeholder = 'Select…',
  disabled = false,
  ariaLabel,
}) {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const optionRefs = useRef([]);

  const items = options.map((o) =>
    o !== null && typeof o === 'object' ? o : { value: o, label: String(o) }
  );
  const selected = items.find((i) => i.value === value);

  const close = useCallback(() => setOpen(false), []);
  const pick = useCallback(
    (v) => {
      onChange?.(v);
      setOpen(false);
    },
    [onChange]
  );

  useEffect(() => {
    if (!open) return;

    const onDocPointer = (e) => {
      if (rootRef.current && !rootRef.current.contains(e.target)) close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') {
        e.preventDefault();
        close();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        setActiveIndex((i) => Math.min(i + 1, items.length - 1));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setActiveIndex((i) => Math.max(i - 1, 0));
      } else if (e.key === 'Enter' && activeIndex >= 0) {
        e.preventDefault();
        pick(items[activeIndex].value);
      }
    };

    document.addEventListener('mousedown', onDocPointer);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDocPointer);
      document.removeEventListener('keydown', onKey);
    };
  }, [open, activeIndex, items, close, pick]);

  useEffect(() => {
    if (open) optionRefs.current[activeIndex]?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const openMenu = () => {
    if (disabled) return;
    setActiveIndex(items.findIndex((i) => i.value === value));
    setOpen(true);
  };
  const toggle = () => (open ? setOpen(false) : openMenu());

  const isProfile = variant === 'profile';
  const variantCls =
    triggerClassName ||
    (isProfile
      ? 'h-[45px] bg-[#FDFDFD] rounded-[14px] px-4 py-2.5 text-[15px] disabled:bg-gray-50/60 disabled:text-gray-600'
      : variant === 'form'
      ? 'bg-[#F9F9F9] rounded-[18px] px-5 py-4 text-[17px] sm:text-[18px]'
      : 'bg-white rounded-[15px] h-[57px] px-5 text-[18px] sm:text-[20px]');
  const stateCls = isProfile
    ? `transition-all disabled:cursor-default ${open ? 'border-[#890080] ring-2 ring-[#FFD2F7]' : 'border-gray-200/90'}`
    : variant === 'settings'
    ? `transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${open ? 'border-pink-300 ring-1 ring-pink-300' : 'border-gray-200'}`
    : `transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
        open ? 'border-[#bd24df] ring-1 ring-[#bd24df]/20' : 'border-[#C0C0C0] hover:border-gray-400'
      }`;

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={toggle}
        className={`w-full flex items-center justify-between gap-2 text-left font-medium text-gray-800 border cursor-pointer outline-none ${variantCls} ${stateCls}`}
      >
        <span className={`truncate ${selected ? '' : 'text-gray-400'}`}>
          {selected ? selected.label : placeholder}
        </span>
        {!(isProfile && disabled) && (
          <ChevronDown
            size={isProfile ? 18 : 20}
            className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          />
        )}
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 top-full left-0 mt-2 w-full min-w-full bg-white border border-[#FFD2F7] rounded-[15px] shadow-[0_16px_44px_-10px_rgba(137,0,128,0.28)] overflow-hidden animate-fade-in"
        >
          <div className="max-h-[280px] overflow-y-auto py-1.5">
            {items.map((item, idx) => {
              const isSelected = item.value === value;
              const isActive = idx === activeIndex;
              return (
                <button
                  key={item.value}
                  ref={(el) => (optionRefs.current[idx] = el)}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => pick(item.value)}
                  className={`w-full ${isProfile ? 'px-4 text-[15px] cursor-pointer' : 'px-5 text-[16px]'} py-2.5 text-left flex items-center justify-between gap-2 transition-colors ${
                    isSelected
                      ? 'bg-[#FDF2FA] text-[#890080] font-semibold'
                      : isActive
                      ? 'bg-[#FDF2FA] text-gray-900'
                      : 'text-gray-800 hover:bg-[#FDF2FA]/70'
                  }`}
                >
                  <span className="truncate">{item.label}</span>
                  {isSelected && <Check size={16} className="flex-shrink-0 text-[#890080]" />}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
