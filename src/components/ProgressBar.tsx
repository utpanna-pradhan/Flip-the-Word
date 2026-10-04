interface ProgressBarProps {
  current: number;
  total: number;
}

export function ProgressBar({ current, total }: ProgressBarProps) {
  const percentage = total > 0 ? Math.min(100, ((current + 1) / total) * 100) : 0;

  return (
    <div className="flex items-center gap-2">
      <span className="text-xs font-bold text-gray-500 tabular-nums">
        {Math.min(current + 1, total)}/{total}
      </span>
      <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-accent-400 to-accent-500 rounded-full transition-all duration-500 ease-out"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
