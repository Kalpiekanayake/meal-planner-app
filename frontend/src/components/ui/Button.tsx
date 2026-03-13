import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger' | 'white';
  size?: 'sm' | 'md' | 'lg' | 'xl';
  isLoading?: boolean;
  icon?: React.ReactNode;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading,
  icon,
  className = '',
  ...props
}) => {
  const baseStyles = 'inline-flex items-center justify-center font-black transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none tracking-tight';
  
  const variants = {
    primary: 'bg-primary-500 text-white shadow-xl shadow-primary-100 hover:bg-primary-600',
    secondary: 'bg-primary-50 text-primary-600 hover:bg-primary-100',
    white: 'bg-white text-slate-800 border border-slate-100 shadow-sm hover:bg-slate-50',
    ghost: 'bg-transparent text-slate-500 hover:bg-slate-50 hover:text-primary-600',
    danger: 'bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-600',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs rounded-xl gap-1.5',
    md: 'px-5 py-3 text-sm rounded-2xl gap-2',
    lg: 'px-7 py-4 text-base rounded-[1.5rem] gap-3',
    xl: 'px-8 py-5 text-lg rounded-[2rem] gap-4',
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`}
      disabled={isLoading}
      {...props}
    >
      {isLoading ? (
        <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
      ) : (
        <>
          {icon && <span className="shrink-0">{icon}</span>}
          {children}
        </>
      )}
    </button>
  );
};
