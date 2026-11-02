import { useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Minus, Plus } from 'lucide-react';
import { SCALES, parseCgpa } from '../utils/cgpa';

const formatCgpa = (value, scale) => {
  const text = String(value ?? '').replace(/\.$/, '');
  if (text === '') return '';
  value = text;
  return scale.key === '%' ? `${value}%` : `${value}/${scale.key}`;
};

const clean = (num, scale) => {
  const bounded = Math.min(scale.max, Math.max(0, num));
  return String(Number(bounded.toFixed(scale.decimals)));
};

export default function CgpaPicker({ value, onChange, disabled = false, hasError = false, dataField }) {
  const [open, setOpen] = useState(false);
  const [draft, setDraft] = useState('');
  const rootRef = useRef(null);
  const listRef = useRef(null);
  const inputRef = useRef(null);
  const { scale, value: current } = parseCgpa(value);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('mousedown', onDown);
    document.addEventListener('keydown', onKey);
    return () => { document.removeEventListener('mousedown', onDown); document.removeEventListener('keydown', onKey); };
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector('[aria-selected="true"]')?.scrollIntoView({ block: 'center' });
  }, [open, scale.key]);

  const openMenu = () => {
    if (disabled) return;
    setDraft(current);
    setOpen(true);
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const commit = (next, nextScale = scale) => {
    setDraft(next);
    onChange(formatCgpa(next, nextScale));
  };

  const changeScale = (next) => {
    const num = parseFloat(draft);
    commit(Number.isNaN(num) ? '' : clean(num, next), next);
  };

  const stepBy = (dir) => {
    const num = parseFloat(draft);
    commit(clean((Number.isNaN(num) ? 0 : num) + dir * scale.step, scale));
  };

  const onType = (e) => {
    const text = e.target.value.replace(',', '.');
    const pattern = scale.key === '%' ? /^\d{0,3}(\.\d{0,2})?$/ : /^\d{0,2}(\.\d{0,2})?$/;
    if (!pattern.test(text)) return;
    if (text !== '' && parseFloat(text) > scale.max) return;
    commit(text);
  };

  const steps = Math.round(scale.max / scale.step);
  const options = Array.from({ length: steps + 1 }, (_, i) => clean(scale.max - i * scale.step, scale));
  const selectedValue = current === '' ? null : String(Number(parseFloat(current)));

  return (
    <div ref={rootRef} className="relative" data-field={dataField}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="dialog"
        aria-expanded={open}
        aria-label="Current CGPA / Grade"
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`w-full h-[45px] flex items-center justify-between gap-2 text-left bg-[#FDFDFD] border text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 cursor-pointer disabled:cursor-default disabled:bg-gray-50/60 disabled:text-gray-600 transition-all ${
          open ? 'border-[#890080] ring-2 ring-[#FFD2F7]' : hasError ? 'border-red-400' : 'border-gray-200/90'
        }`}
      >
        <span className={`truncate ${value ? '' : 'text-gray-400'}`}>
          {value ? (scale.key === '%' ? `${current}%` : `${current} / ${scale.label}`) : 'Select your CGPA'}
        </span>
        {!disabled && (
          <ChevronDown size={18} className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full bg-white border border-[#FFD2F7] rounded-[15px] shadow-[0_16px_44px_-10px_rgba(137,0,128,0.28)] overflow-hidden animate-fade-in">
          <div className="p-3 border-b border-[#FFD2F7]/70 space-y-3">
            <div className="grid grid-cols-2 gap-1.5 p-1 bg-[#FCF8FE] border border-[#FFD2F7] rounded-[12px]">
              {SCALES.map((s) => (
                <button
                  key={s.key}
                  type="button"
                  onClick={() => changeScale(s)}
                  className={`py-1.5 rounded-[9px] text-[13px] font-medium transition-colors cursor-pointer ${
                    s.key === scale.key ? 'bg-[#890080] text-white' : 'text-gray-600 hover:bg-[#FDF2FA]'
                  }`}
                >
                  {s.tab}
                </button>
              ))}
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => stepBy(-1)}
                aria-label="Decrease"
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[10px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#890080] hover:bg-[#FDF2FA] transition-colors cursor-pointer"
              >
                <Minus size={16} strokeWidth={2.4} />
              </button>
              <div className="relative flex-1">
                <input
                  ref={inputRef}
                  type="text"
                  inputMode="decimal"
                  value={draft}
                  onChange={onType}
                  onKeyDown={(e) => {
                    if (e.key === 'ArrowUp') { e.preventDefault(); stepBy(1); }
                    else if (e.key === 'ArrowDown') { e.preventDefault(); stepBy(-1); }
                    else if (e.key === 'Enter') { e.preventDefault(); setOpen(false); }
                  }}
                  placeholder={scale.key === '%' ? 'e.g. 85' : 'e.g. 3.5'}
                  className="w-full h-10 pl-3 pr-16 bg-[#FCF8FE] border border-[#FFD2F7] rounded-[10px] text-[15px] font-semibold text-gray-800 text-center placeholder-gray-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-[#890080]/20"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[13px] text-gray-400 pointer-events-none">
                  {scale.key === '%' ? '%' : `/ ${scale.label}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => stepBy(1)}
                aria-label="Increase"
                className="w-10 h-10 flex-shrink-0 flex items-center justify-center rounded-[10px] border border-[#FFD2F7] bg-[#FCF8FE] text-[#890080] hover:bg-[#FDF2FA] transition-colors cursor-pointer"
              >
                <Plus size={16} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          <div ref={listRef} role="listbox" className="max-h-[220px] overflow-y-auto py-1.5">
            {options.map((option) => {
              const isSelected = option === selectedValue;
              return (
                <button
                  key={option}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => { commit(option); setOpen(false); }}
                  className={`w-full px-4 py-2 text-left text-[15px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected ? 'bg-[#FDF2FA] text-[#890080] font-semibold' : 'text-gray-800 hover:bg-[#FDF2FA]/70'
                  }`}
                >
                  <span>{scale.key === '%' ? `${option}%` : Number(option).toFixed(2)}</span>
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
