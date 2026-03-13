import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement> {
  label?: string;
  error?: string;
  type?: string;
  isSelect?: boolean;
  options?: { label: string; value: string }[];
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  type = 'text',
  isSelect = false,
  options = [],
  className = '',
  ...props
}) => {
  const commonStyles = `
    w-full px-6 py-4 bg-slate-50 border-none rounded-2xl 
    focus:ring-4 focus:ring-primary-50 outline-none 
    transition-all font-bold text-slate-700 placeholder:text-slate-300
    ${error ? 'ring-2 ring-red-100' : ''}
    ${className}
  `;

  return (
    <div className="space-y-2 w-full">
      {label && (
        <label className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] ml-2">
          {label}
        </label>
      )}
      
      {isSelect ? (
        <div className="relative">
          <select 
            className={`${commonStyles} appearance-none cursor-pointer`}
            {...(props as any)}
          >
            {options.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>
      ) : type === 'textarea' ? (
        <textarea
          className={commonStyles}
          {...(props as any)}
        />
      ) : (
        <input
          type={type}
          className={commonStyles}
          {...(props as any)}
        />
      )}

      {error && <p className="text-[10px] font-bold text-red-500 ml-2 uppercase tracking-tight">{error}</p>}
    </div>
  );
};
