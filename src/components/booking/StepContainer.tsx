import { type ReactNode } from 'react';

interface OptionCardProps {
  icon?: string;
  label: string;
  sublabel?: string;
  selected: boolean;
  onClick: () => void;
}

export function OptionCard({ icon, label, sublabel, selected, onClick }: OptionCardProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`
        group relative w-full text-left p-4 rounded-xl border
        transition-all duration-200 cursor-pointer
        hover:scale-[1.02]
        focus:outline-none focus:ring-2 focus:ring-orange-400/40
        ${selected
          ? 'border-orange-500 bg-orange-500/10 ring-2 ring-orange-400 shadow-[0_0_20px_rgba(249,115,22,0.15)]'
          : 'border-gray-700 bg-white/5 hover:border-orange-400 hover:bg-white/10 hover:shadow-[0_4px_20px_rgba(0,0,0,0.3)]'}
      `}
    >
      <div className="flex items-center gap-4">
        {icon && (
          <span className={`text-3xl transition-transform duration-200 group-hover:scale-110 ${selected ? 'scale-110' : ''}`}>
            {icon}
          </span>
        )}
        <div className="flex-1 min-w-0">
          <p className={`font-semibold text-base leading-tight transition-colors duration-200 ${selected ? 'text-orange-400' : 'text-gray-100 group-hover:text-white'}`}>
            {label}
          </p>
          {sublabel && (
            <p className="text-sm text-gray-500 mt-0.5 truncate group-hover:text-gray-400 transition-colors">{sublabel}</p>
          )}
        </div>

        {/* Check indicator */}
        <div className={`
          w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all duration-200
          ${selected ? 'border-orange-400 bg-orange-400 shadow-[0_0_10px_rgba(249,115,22,0.4)]' : 'border-gray-600 group-hover:border-orange-400/60'}
        `}>
          {selected && (
            <svg className="w-3 h-3 text-black" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>
      </div>
    </button>
  );
}

interface StepContainerProps {
  title: string;
  subtitle?: string;
  children: ReactNode;
}

export function StepContainer({ title, subtitle, children }: StepContainerProps) {
  return (
    <div className="animate-fadeInUp">
      <div className="mb-6">
        <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight tracking-tight">{title}</h2>
        {subtitle && <p className="text-gray-400 text-sm mt-2">{subtitle}</p>}
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  );
}
