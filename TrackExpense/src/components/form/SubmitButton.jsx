export default function SubmitButton({ type, disabled }) {
  return (
    <button
      type="submit"
      disabled={disabled}
      className={`
        w-full px-6 py-4 rounded-lg text-white font-semibold text-sm
        transform transition-all duration-200
        flex items-center justify-center space-x-2
        ${disabled
          ? 'bg-gray-300 cursor-not-allowed opacity-60'
          : type === 'expense'
            ? 'bg-gradient-to-r from-pink-500 to-pink-600 hover:from-pink-600 hover:to-pink-700 active:scale-[0.98]'
            : 'bg-gradient-to-r from-violet-500 to-violet-600 hover:from-violet-600 hover:to-violet-700 active:scale-[0.98]'
        }
        shadow-lg hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-offset-2
        ${type === 'expense' ? 'focus:ring-pink-500' : 'focus:ring-violet-500'}
      `}
    >
      <span>{type === 'expense' ? 'Add Expense' : 'Add Income'}</span>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    </button>
  );
}