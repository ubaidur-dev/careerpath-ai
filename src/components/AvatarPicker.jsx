import { useState, useRef, useEffect } from 'react';
import { Camera, Upload, Trash2, AlertTriangle, X } from 'lucide-react';

export default function AvatarPicker({
  src,
  fallback,
  sizeClass = 'w-[140px] h-[140px]',
  circleClass = '',
  uploading = false,
  onUpload,
  onRemove,
  onImageError,
  confirmRemove = true,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const rootRef = useRef(null);

  useEffect(() => {
    if (!menuOpen) return undefined;
    const onDoc = (e) => { if (rootRef.current && !rootRef.current.contains(e.target)) setMenuOpen(false); };
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false); };
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
    };
  }, [menuOpen]);

  const handleTrigger = () => {
    if (uploading) return;
    if (src) setMenuOpen((open) => !open);
    else onUpload?.();
  };

  const handleUpload = () => {
    setMenuOpen(false);
    onUpload?.();
  };

  const handleRemove = () => {
    setMenuOpen(false);
    if (confirmRemove) setConfirmOpen(true);
    else onRemove?.();
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        onClick={handleTrigger}
        disabled={uploading}
        aria-haspopup={src ? 'menu' : undefined}
        aria-expanded={src ? menuOpen : undefined}
        aria-label={src ? 'Change profile picture' : 'Upload profile picture'}
        className={`group relative block rounded-full cursor-pointer disabled:cursor-wait outline-none focus-visible:ring-4 focus-visible:ring-[#FFD2F7] ${sizeClass}`}
      >
        <div className={`w-full h-full rounded-full bg-[#FFBFF4] text-[#000000] font-extrabold flex items-center justify-center shadow-sm overflow-hidden ${circleClass}`}>
          {uploading ? (
            <div className="w-8 h-8 border-[3px] border-white border-t-transparent rounded-full animate-spin" />
          ) : src ? (
            <img src={src} alt="Profile" className="w-full h-full object-cover" onError={onImageError} />
          ) : (
            fallback
          )}
        </div>

        {!uploading && (
          <div className="absolute inset-0 rounded-full bg-black/45 text-white flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity duration-200">
            <Camera size={22} strokeWidth={2} />
            <span className="text-[12px] font-semibold tracking-wide">{src ? 'Change' : 'Upload'}</span>
          </div>
        )}

        <span className="absolute bottom-1 right-1 w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-700 shadow-[0_2px_6px_rgba(0,0,0,0.15)] flex items-center justify-center group-hover:text-[#890080] transition-colors">
          <Camera size={17} strokeWidth={2} />
        </span>
      </button>

      {menuOpen && (
        <div
          role="menu"
          className="absolute z-30 left-1/2 -translate-x-1/2 top-full mt-2 w-[210px] bg-white border border-[#FFD2F7] rounded-[15px] shadow-[0_16px_44px_-10px_rgba(137,0,128,0.28)] p-1.5 text-left animate-fade-in"
        >
          <button
            type="button"
            role="menuitem"
            onClick={handleUpload}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium text-gray-800 hover:bg-[#FDF2FA] hover:text-[#890080] transition-colors cursor-pointer"
          >
            <Upload size={16} strokeWidth={2} />
            Upload new photo
          </button>
          <button
            type="button"
            role="menuitem"
            onClick={handleRemove}
            className="w-full flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-[14px] font-medium text-[#DC2626] hover:bg-[#FFECEC] transition-colors cursor-pointer"
          >
            <Trash2 size={16} strokeWidth={2} />
            Remove photo
          </button>
        </div>
      )}

      {confirmOpen && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4" onClick={() => setConfirmOpen(false)}>
          <div
            className="bg-white border border-[#FFD2F7] rounded-[28px] p-6 sm:p-8 max-w-md w-full shadow-[3px_6px_12px_0.5px_rgba(0,0,0,0.2)] text-left space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button type="button" onClick={() => setConfirmOpen(false)} className="absolute top-5 right-5 text-gray-400 hover:text-gray-700 p-1 rounded-full transition cursor-pointer" title="Close">
              <X size={20} />
            </button>
            <div className="flex items-start gap-4 pr-6">
              <div className="w-12 h-12 rounded-full bg-[#FFECEC] border border-[#F3C9C9] flex items-center justify-center flex-shrink-0">
                <AlertTriangle size={22} strokeWidth={2} className="text-[#DC2626]" />
              </div>
              <div className="space-y-1.5 pt-0.5">
                <h3 className="text-[21px] font-semibold text-[#000000] leading-tight">Remove profile picture?</h3>
                <p className="text-[15px] text-gray-600 leading-relaxed">
                  Your initials will be shown instead. You can upload a new picture anytime.
                </p>
              </div>
            </div>
            <div className="flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-3 pt-1">
              <button
                type="button"
                onClick={() => setConfirmOpen(false)}
                className="px-5 py-2.5 rounded-full text-[14px] font-semibold text-gray-700 bg-white border border-gray-300 hover:bg-gray-50 hover:border-gray-400 transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => { setConfirmOpen(false); onRemove?.(); }}
                className="px-6 py-2.5 rounded-full text-[14px] font-semibold text-white bg-[#DC2626] hover:bg-[#B91C1C] shadow-sm transition-all cursor-pointer"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
