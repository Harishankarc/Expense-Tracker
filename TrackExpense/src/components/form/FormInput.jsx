import { DollarIcon, DescriptionIcon } from './Icons';

export default function FormInput({ 
  id, 
  label, 
  type = 'text', 
  value, 
  onChange, 
  placeholder, 
  error,
  icon,
  ...props 
}) {
  const getIcon = () => {
    switch (icon) {
      case 'dollar':
        return <DollarIcon />;
      case 'description':
        return <DescriptionIcon />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative rounded-lg shadow-sm">
        {icon && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {getIcon()}
          </div>
        )}
        <input
          id={id}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full rounded-lg shadow-sm transition-all duration-200
            ${icon ? 'pl-10' : 'pl-4'} pr-4 py-3
            ${error 
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
              : 'border-gray-300 focus:ring-blue-500 focus:border-blue-500'
            }
            border-2 focus:ring-2 outline-none`}
          {...props}
        />
      </div>
      {error && (
        <p className="text-sm text-red-600 flex items-center">
          <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
          </svg>
          {error}
        </p>
      )}
    </div>
  );
}