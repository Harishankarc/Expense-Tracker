export default function RadioGroup({ options, value, onChange, label }) {
  return (
    <div className="space-y-2">
      <label className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="grid grid-cols-2 gap-4">
        {options.map((option) => (
          <label
            key={option.value}
            className={`
              relative flex items-center justify-center p-4 cursor-pointer
              rounded-lg border-2 transition-all duration-200
              ${value === option.value
                ? option.value === 'expense'
                  ? 'border-pink-500 bg-pink-50'
                  : 'border-violet-500 bg-violet-50'
                : 'border-gray-200 hover:border-gray-300'
              }
            `}
          >
            <input
              type="radio"
              name={option.name}
              value={option.value}
              checked={value === option.value}
              onChange={(e) => onChange(e.target.value)}
              className="sr-only"
            />
            <div className="flex items-center">
              <div className={`
                w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center
                ${value === option.value
                  ? option.value === 'expense'
                    ? 'border-pink-500 bg-pink-500'
                    : 'border-violet-500 bg-violet-500'
                  : 'border-gray-300 bg-white'
                }
              `}>
                {value === option.value && (
                  <div className="w-2 h-2 rounded-full bg-white" />
                )}
              </div>
              <span className={`font-medium ${
                value === option.value
                  ? option.value === 'expense'
                    ? 'text-pink-700'
                    : 'text-violet-700'
                  : 'text-gray-700'
              }`}>
                {option.label}
              </span>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
}