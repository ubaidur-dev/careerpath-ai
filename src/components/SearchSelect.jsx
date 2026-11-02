import { useCallback, useEffect, useRef, useState } from 'react';
import { Check, ChevronDown, Loader2, Search } from 'lucide-react';

export default function SearchSelect({
  value,
  onChange,
  loadOptions,
  disabled = false,
  placeholder = 'Select',
  searchPlaceholder = 'Search...',
  emptyText = 'No results found',
  allowCustom = false,
  hasError = false,
  dataField,
  ariaLabel,
  renderValue,
}) {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const rootRef = useRef(null);
  const searchRef = useRef(null);
  const listRef = useRef(null);
  const requestRef = useRef(0);

  const load = useCallback(async (query, nextPage) => {
    const requestId = ++requestRef.current;
    setLoading(true);
    try {
      const result = await loadOptions(query, nextPage);
      if (requestId !== requestRef.current) return;
      setItems((prev) => (nextPage === 1 ? result.items : [...prev, ...result.items]));
      setHasMore(result.hasMore);
      setPage(nextPage);
    } catch {
      if (requestId === requestRef.current && nextPage === 1) setItems([]);
    } finally {
      if (requestId === requestRef.current) setLoading(false);
    }
  }, [loadOptions]);

  useEffect(() => {
    if (!open) return undefined;
    const timer = setTimeout(() => load(search.trim(), 1), search ? 250 : 0);
    return () => clearTimeout(timer);
  }, [open, search, load]);

  useEffect(() => {
    if (!open) return undefined;
    const onDown = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, [open]);

  useEffect(() => {
    if (open) listRef.current?.querySelector(`[data-index="${activeIndex}"]`)?.scrollIntoView({ block: 'nearest' });
  }, [activeIndex, open]);

  const trimmed = search.trim();
  const showCustom = allowCustom && trimmed !== '' && !loading
    && !items.some((i) => i.value.toLowerCase() === trimmed.toLowerCase());
  const options = showCustom ? [...items, { value: trimmed, label: `Use "${trimmed}"`, custom: true }] : items;

  const openMenu = () => {
    if (disabled) return;
    setSearch('');
    setItems([]);
    setActiveIndex(-1);
    setOpen(true);
    setTimeout(() => searchRef.current?.focus(), 0);
  };

  const pick = (option) => {
    onChange(option.value);
    setOpen(false);
  };

  const onScroll = (e) => {
    const el = e.currentTarget;
    if (hasMore && !loading && el.scrollTop + el.clientHeight >= el.scrollHeight - 60) load(trimmed, page + 1);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') { e.preventDefault(); setActiveIndex((i) => Math.min(i + 1, options.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActiveIndex((i) => Math.max(i - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); const option = options[activeIndex] || (options.length === 1 ? options[0] : null); if (option) pick(option); }
    else if (e.key === 'Escape') { e.preventDefault(); setOpen(false); }
  };

  return (
    <div ref={rootRef} className="relative" data-field={dataField}>
      <button
        type="button"
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-label={ariaLabel}
        onClick={() => (open ? setOpen(false) : openMenu())}
        className={`w-full h-[45px] flex items-center justify-between gap-2 text-left bg-[#FDFDFD] border text-[15px] font-medium px-4 py-2.5 rounded-[14px] outline-none text-gray-800 cursor-pointer disabled:cursor-default disabled:bg-gray-50/60 disabled:text-gray-600 transition-all ${
          open ? 'border-[#890080] ring-2 ring-[#FFD2F7]' : hasError ? 'border-red-400' : 'border-gray-200/90'
        }`}
      >
        <span className={`truncate ${value ? '' : 'text-gray-400'}`}>
          {value ? (renderValue ? renderValue(value) : value) : placeholder}
        </span>
        {!disabled && (
          <ChevronDown size={18} className={`flex-shrink-0 text-gray-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`} />
        )}
      </button>

      {open && (
        <div className="absolute z-50 top-full left-0 mt-2 w-full bg-white border border-[#FFD2F7] rounded-[15px] shadow-[0_16px_44px_-10px_rgba(137,0,128,0.28)] overflow-hidden animate-fade-in">
          <div className="p-2.5 border-b border-[#FFD2F7]/70">
            <div className="relative">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input
                ref={searchRef}
                type="text"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setActiveIndex(0); }}
                onKeyDown={onKeyDown}
                placeholder={searchPlaceholder}
                className="w-full pl-9 pr-3 py-2 bg-[#FCF8FE] border border-[#FFD2F7] rounded-[10px] text-[14px] font-normal text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#890080]/20"
              />
            </div>
          </div>

          <div ref={listRef} role="listbox" onScroll={onScroll} className="max-h-[260px] overflow-y-auto py-1.5">
            {options.map((option, idx) => {
              const isSelected = !option.custom && option.value === value;
              return (
                <button
                  key={`${option.custom ? 'custom-' : ''}${option.value}`}
                  data-index={idx}
                  type="button"
                  role="option"
                  aria-selected={isSelected}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => pick(option)}
                  className={`w-full px-4 py-2.5 text-left text-[15px] flex items-center justify-between gap-2 transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-[#FDF2FA] text-[#890080] font-semibold'
                      : idx === activeIndex
                      ? 'bg-[#FDF2FA] text-gray-900'
                      : 'text-gray-800 hover:bg-[#FDF2FA]/70'
                  } ${option.custom ? 'italic text-[#890080]' : ''}`}
                >
                  <span className="truncate">{option.flag ? `${option.flag}  ${option.label}` : option.label}</span>
                  {isSelected && <Check size={16} className="flex-shrink-0 text-[#890080]" />}
                </button>
              );
            })}

            {loading && (
              <div className="flex items-center justify-center gap-2 py-3 text-[13px] text-gray-400">
                <Loader2 size={15} className="animate-spin" /> Loading...
              </div>
            )}
            {!loading && options.length === 0 && (
              <div className="py-4 text-center text-[14px] text-gray-400">{emptyText}</div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}
