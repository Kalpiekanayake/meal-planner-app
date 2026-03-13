import React from 'react';

interface SectionHeaderProps {
  title: string;
  badge?: string | number;
  className?: string;
  dotColor?: string;
}

export const SectionHeader: React.FC<SectionHeaderProps> = ({
  title,
  badge,
  className = '',
  dotColor = 'bg-primary-400',
}) => {
  return (
    <div className={`flex items-center gap-3 px-2 ${className}`}>
      <div className={`w-2 h-2 ${dotColor} rounded-full shadow-lg shadow-primary-200`}></div>
      <h2 className="text-sm font-black text-slate-400 uppercase tracking-[0.3em]">{title}</h2>
      <div className="flex-grow h-px bg-slate-100"></div>
      {badge !== undefined && (
        <span className="text-[10px] font-black bg-slate-50 text-slate-400 px-2.5 py-1 rounded-lg">
          {badge}
        </span>
      )}
    </div>
  );
};
