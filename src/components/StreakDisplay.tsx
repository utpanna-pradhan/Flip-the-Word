import { Flame } from 'lucide-react';

interface StreakDisplayProps {
  streak: number;
  size?: 'sm' | 'md' | 'lg';
}

export function StreakDisplay({ streak, size = 'md' }: StreakDisplayProps) {
  const sizes = {
    sm: { icon: 'w-4 h-4', text: 'text-sm', gap: 'gap-1' },
    md: { icon: 'w-6 h-6', text: 'text-lg', gap: 'gap-2' },
    lg: { icon: 'w-8 h-8', text: 'text-2xl', gap: 'gap-2' },
  };

  const s = sizes[size];

  if (streak === 0) return null;

  return (
    <div className={`inline-flex items-center ${s.gap} font-display font-bold`}>
      <Flame className={`${s.icon} text-secondary-500 animate-flame`} fill="currentColor" />
      <span className={`${s.text} text-secondary-600`}>
        {streak} {streak === 1 ? 'DAY' : 'DAYS'}
      </span>
    </div>
  );
}
