import { Zap, Calendar, Infinity as InfinityIcon, Settings, Trophy, Flame } from 'lucide-react';
import type { GameMode, GameProgressState, DailyChallengeState } from '@/types';
import { ActionButton } from '@/components/ActionButton';
import { StreakDisplay } from '@/components/StreakDisplay';
import { StreakCalendar } from '@/components/StreakCalendar';
import { getDateString } from '@/utils/helpers';
import { AnimatedNumber } from '@/components/AnimatedNumber';

interface HomeScreenProps {
  progress: GameProgressState;
  dailyState: DailyChallengeState | null;
  onStartGame: (mode: GameMode) => void;
  onOpenSettings: () => void;
}

export function HomeScreen({ progress, dailyState, onStartGame, onOpenSettings }: HomeScreenProps) {
  const today = getDateString();
  const dailyCompletedToday = dailyState?.date === today && dailyState.solved;
  const dailyAvailable = !dailyCompletedToday;

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between pt-4">
          <div className="flex items-center gap-2">
            <Flame className="w-6 h-6 text-secondary-500 animate-flame" fill="currentColor" />
            <StreakDisplay streak={progress.streak} size="md" />
          </div>
          <button
            onClick={onOpenSettings}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 hover:shadow-lg transition-all active:scale-95"
          >
            <Settings className="w-5 h-5" />
          </button>
        </div>

        {/* Logo / Title */}
        <div className="text-center py-6 animate-fade-in-up">
          <h1 className="font-display font-bold text-5xl sm:text-6xl tracking-tight">
            <span className="bg-gradient-to-br from-primary-500 to-primary-700 bg-clip-text text-transparent">WORD</span>
            {' '}
            <span className="bg-gradient-to-br from-secondary-500 to-secondary-600 bg-clip-text text-transparent">FLIP</span>
          </h1>
          <p className="text-gray-400 font-semibold text-sm mt-2">
            Unscramble. Guess. Beat Your Score.
          </p>
        </div>

        {/* Best Score Card */}
        <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '100ms' }}>
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-warning-100 to-warning-200 flex items-center justify-center">
            <Trophy className="w-6 h-6 text-warning-600" fill="currentColor" />
          </div>
          <div className="flex-1">
            <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Best Score</p>
            <p className="font-display font-bold text-2xl text-gray-800">
              <AnimatedNumber value={progress.bestScore} />
            </p>
          </div>
          {progress.streak > 0 && (
            <div className="text-right">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wide">Streak</p>
              <div className="flex items-center gap-1">
                <Flame className="w-4 h-4 text-secondary-500 animate-flame" fill="currentColor" />
                <span className="font-display font-bold text-lg text-secondary-600">{progress.streak}</span>
              </div>
            </div>
          )}
        </div>

        {/* Mode Buttons */}
        <div className="flex flex-col gap-3">
          <ModeButton
            icon={<Zap className="w-6 h-6" fill="currentColor" />}
            title="QUICK WORD"
            subtitle="Fast-paced scrambled words"
            gradient="from-primary-400 to-primary-600"
            shadow="shadow-primary-200"
            delay={150}
            onClick={() => onStartGame('quick')}
          />
          <ModeButton
            icon={<Calendar className="w-6 h-6" fill="currentColor" />}
            title="DAILY CHALLENGE"
            subtitle={dailyCompletedToday ? 'Completed today!' : '10 puzzles. New every day.'}
            gradient="from-secondary-400 to-secondary-600"
            shadow="shadow-secondary-200"
            delay={200}
            badge={dailyCompletedToday ? 'DONE' : dailyAvailable ? 'NEW' : undefined}
            onClick={() => onStartGame('daily')}
            disabled={dailyCompletedToday}
          />
          <ModeButton
            icon={<InfinityIcon className="w-6 h-6" />}
            title="ENDLESS"
            subtitle="Play until 3 mistakes"
            gradient="from-accent-400 to-accent-600"
            shadow="shadow-accent-200"
            delay={250}
            onClick={() => onStartGame('endless')}
          />
        </div>

        {/* Streak Calendar */}
        <div className="animate-fade-in-up" style={{ animationDelay: '300ms' }}>
          <StreakCalendar streak={progress.streak} lastStreakDate={progress.lastStreakDate} />
        </div>

        <div className="h-4" />
      </div>
    </div>
  );
}

interface ModeButtonProps {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  gradient: string;
  shadow: string;
  delay: number;
  onClick: () => void;
  disabled?: boolean;
  badge?: string;
}

function ModeButton({
  icon,
  title,
  subtitle,
  gradient,
  shadow,
  delay,
  onClick,
  disabled,
  badge,
}: ModeButtonProps) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`group relative overflow-hidden bg-gradient-to-br ${gradient} ${shadow} text-white rounded-2xl p-4 shadow-lg hover:shadow-xl active:scale-[0.98] transition-all duration-200 animate-fade-in-up ${
        disabled ? 'opacity-60' : ''
      }`}
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center flex-shrink-0">
          {icon}
        </div>
        <div className="flex-1 text-left">
          <h3 className="font-display font-bold text-lg leading-tight">{title}</h3>
          <p className="text-white/80 text-xs font-semibold mt-0.5">{subtitle}</p>
        </div>
        {badge && (
          <span
            className={`px-2 py-1 rounded-full text-[10px] font-bold ${
              badge === 'DONE'
                ? 'bg-white/20 text-white/80'
                : 'bg-white text-secondary-600'
            }`}
          >
            {badge}
          </span>
        )}
      </div>
      <div className="absolute -right-8 -top-8 w-24 h-24 bg-white/10 rounded-full group-hover:scale-150 transition-transform duration-700" />
    </button>
  );
}
