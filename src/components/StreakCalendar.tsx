import { Flame } from 'lucide-react';
import { getDateString } from '@/utils/helpers';

interface StreakCalendarProps {
  streak: number;
  lastStreakDate: string | null;
}

function getLast7Days(): { date: string; dayLabel: string; dayNum: number }[] {
  const days: { date: string; dayLabel: string; dayNum: number }[] = [];
  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const dateStr = getDateString(d);
    days.push({
      date: dateStr,
      dayLabel: dayLabels[d.getDay()],
      dayNum: d.getDate(),
    });
  }

  return days;
}

export function StreakCalendar({ streak, lastStreakDate }: StreakCalendarProps) {
  const days = getLast7Days();

  const isDayCompleted = (dayDate: string): boolean => {
    if (!lastStreakDate) return false;

    const today = getDateString();
    if (dayDate === today) return streak > 0;

    // Check if this day is within the streak range
    const dayDateObj = new Date(dayDate);
    const lastDateObj = new Date(lastStreakDate);
    const diff = Math.floor(Math.abs(lastDateObj.getTime() - dayDateObj.getTime()) / (1000 * 60 * 60 * 24));

    return diff < streak;
  };

  return (
    <div className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-3">
        <span className="font-display font-semibold text-gray-700 text-sm">Weekly Streak</span>
        <div className="flex items-center gap-1">
          <Flame className="w-4 h-4 text-secondary-500 animate-flame" fill="currentColor" />
          <span className="font-display font-bold text-secondary-600 text-sm">{streak}</span>
        </div>
      </div>
      <div className="flex justify-between gap-1">
        {days.map((day, i) => {
          const completed = isDayCompleted(day.date);
          const isToday = i === 6;
          return (
            <div key={i} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-bold text-gray-400">{day.dayLabel}</span>
              <div
                className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold transition-all ${
                  completed
                    ? 'bg-gradient-to-br from-secondary-400 to-secondary-500 text-white shadow-md shadow-secondary-200'
                    : isToday
                    ? 'bg-primary-50 text-primary-400 ring-2 ring-primary-200'
                    : 'bg-gray-100 text-gray-400'
                }`}
              >
                {completed ? (
                  <Flame className="w-4 h-4" fill="currentColor" />
                ) : (
                  day.dayNum
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
