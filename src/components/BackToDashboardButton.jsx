export default function BackToDashboardButton({ onClick }) {
  return (
    <div className="w-full text-left !mb-4">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-2 px-4 py-2 border border-gray-200 bg-white hover:bg-gray-50 rounded-xl text-sm font-semibold text-gray-700 hover:scale-[1.02] hover:shadow-md active:scale-[0.98] transition-all duration-300 cursor-pointer"
      >
        &larr; Back To Dashboard
      </button>
    </div>
  );
}
