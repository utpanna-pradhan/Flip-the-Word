interface TimerBarProps {
  timeLeft: number;
  maxTime: number;
}

export function TimerBar({ timeLeft, maxTime }: TimerBarProps) {
  const percentage = Math.max(0, (timeLeft / maxTime) * 100);
  const isUrgent = timeLeft <= 5;
  const isWarning = timeLeft <= 10 && timeLeft > 5;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs font-bold text-gray-400">TIME</span>
        <span
          className={`text-sm font-display font-bold tabular-nums transition-colors ${
            isUrgent ? 'text-error-500' : isWarning ? 'text-warning-500' : 'text-gray-600'
          }`}
        >
          {timeLeft}s
        </span>
      </div>
      <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-1000 ease-linear ${
            isUrgent
              ? 'bg-gradient-to-r from-error-400 to-error-500'
              : isWarning
              ? 'bg-gradient-to-r from-warning-400 to-warning-500'
              : 'bg-gradient-to-r from-primary-400 to-primary-500'
          }`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
