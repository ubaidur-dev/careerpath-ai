import { Lightbulb } from 'lucide-react';
import { suggestEmail } from '../utils/emailSuggest';

export default function EmailSuggestion({ email, onAccept, className = '' }) {
  const suggestion = suggestEmail(email);
  if (!suggestion) return null;

  return (
    <p className={`flex items-start gap-1.5 text-[13px] font-medium text-gray-600 mt-1 ${className}`} role="status">
      <Lightbulb size={14} className="flex-shrink-0 mt-[2px] text-[#890080]" />
      <span>
        Did you mean{' '}
        <button
          type="button"
          onClick={() => onAccept(suggestion)}
          className="font-semibold text-[#890080] hover:underline underline-offset-2 cursor-pointer break-all"
        >
          {suggestion}
        </button>
        ?
      </span>
    </p>
  );
}
