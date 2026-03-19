interface ProgressBarProps {
  current: number; // 1-based
  total: number;
  label?: string;
}

export function ProgressBar({ current, total, label }: ProgressBarProps) {
  const pct = Math.round((current / total) * 100);

  return (
    <div className="w-full mb-8">
      {/* Step label + percentage */}
      <div className="flex justify-between items-center mb-2">
        <span className="text-xs font-semibold tracking-widest uppercase text-orange-400">
          {label ?? `Step ${current} of ${total}`}
        </span>
        <span className="text-xs font-medium text-orange-400/70">{pct}%</span>
      </div>

      {/* Track */}
      <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden border border-white/5">
        <div
          className="h-full bg-gradient-to-r from-orange-500 to-yellow-400 rounded-full transition-all duration-700 ease-out shadow-[0_0_12px_rgba(249,115,22,0.6)]"
          style={{ width: `${pct}%` }}
        />
      </div>

      {/* Step dots */}
      <div className="flex justify-between mt-2.5">
        {Array.from({ length: total }).map((_, i) => (
          <div
            key={i}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              i + 1 <= current
                ? 'bg-orange-400 shadow-[0_0_6px_rgba(249,115,22,0.7)]'
                : 'bg-gray-700'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
