import { Home, RotateCcw, Trophy, Target, Flame, Calendar, CheckCircle2 } from 'lucide-react';
import type { GameResult } from '@/types';
import { ActionButton } from '@/components/ActionButton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { CelebrationOverlay } from '@/components/CelebrationOverlay';
import { useEffect, useState } from 'react';

interface ResultScreenProps {
  result: GameResult;
  onPlayAgain: () => void;
  onHome: () => void;
}

export function ResultScreen({ result, onPlayAgain, onHome }: ResultScreenProps) {
  const [showCelebration, setShowCelebration] = useState(false);
  const isDaily = result.mode === 'daily';
  const isNewBest = result.score >= result.bestScore && result.score > 0;
  const accuracy = result.total > 0 ? Math.round((result.correct / result.total) * 100) : 0;

  useEffect(() => {
    if (result.correct > 0) {
      setShowCelebration(true);
      const timer = setTimeout(() => setShowCelebration(false), 4000);
      return () => clearTimeout(timer);
    }
  }, [result.correct]);

  const headerText = isDaily && result.correct === result.total
    ? 'PERFECT!'
    : accuracy >= 80 ? 'GREAT JOB!'
    : accuracy >= 50 ? 'NICE TRY!'
    : 'KEEP GOING!';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex items-center justify-center p-4 safe-top safe-bottom">
      <CelebrationOverlay show={showCelebration} />

      <div className="w-full max-w-md flex flex-col gap-4">
        {/* Header */}
        <div className="text-center py-6 animate-celebrate">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-warning-300 to-warning-500 shadow-xl shadow-warning-200 mb-3">
            <Trophy className="w-10 h-10 text-white" fill="currentColor" />
          </div>
          <h1 className="font-display font-bold text-3xl text-gray-800">{headerText}</h1>
          {isNewBest && (
            <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-success-100 rounded-full animate-pop">
              <CheckCircle2 className="w-4 h-4 text-success-600" />
              <span className="text-sm font-bold text-success-600">New Best Score!</span>
            </div>
          )}
        </div>

        {/* Score Card */}
        <div className="bg-white rounded-3xl p-6 shadow-lg border border-gray-100 animate-fade-in-up">
          <p className="text-xs font-bold text-gray-400 uppercase tracking-wide text-center mb-1">Your Score</p>
          <p className="font-display font-bold text-5xl text-center bg-gradient-to-br from-primary-500 to-primary-700 bg-clip-text text-transparent tabular-nums">
            <AnimatedNumber value={result.score} />
          </p>

          <div className="grid grid-cols-2 gap-3 mt-6">
            <StatCard
              icon={<Trophy className="w-4 h-4" fill="currentColor" />}
              label="Best Score"
              value={result.bestScore.toLocaleString()}
              color="text-warning-600 bg-warning-100"
            />
            <StatCard
              icon={<Target className="w-4 h-4" />}
              label="Accuracy"
              value={`${accuracy}%`}
              color="text-primary-600 bg-primary-100"
            />
            <StatCard
              icon={<CheckCircle2 className="w-4 h-4" />}
              label="Correct"
              value={`${result.correct} / ${result.total}`}
              color="text-success-600 bg-success-100"
            />
            <StatCard
              icon={<Flame className="w-4 h-4" fill="currentColor" />}
              label="Streak"
              value={`${result.streak} days`}
              color="text-secondary-600 bg-secondary-100"
            />
          </div>
        </div>

        {/* Daily challenge message */}
        {isDaily && (
          <div className="bg-gradient-to-br from-secondary-50 to-secondary-100 rounded-2xl p-4 flex items-center gap-3 animate-fade-in-up" style={{ animationDelay: '150ms' }}>
            <Calendar className="w-8 h-8 text-secondary-500 flex-shrink-0" />
            <p className="text-sm font-semibold text-secondary-700">
              Come back tomorrow for a new challenge!
            </p>
          </div>
        )}

        {/* Buttons */}
        <div className="flex flex-col gap-3 animate-fade-in-up" style={{ animationDelay: '200ms' }}>
          <ActionButton
            variant="primary"
            size="lg"
            fullWidth
            onClick={onPlayAgain}
          >
            <span className="flex items-center justify-center gap-2">
              <RotateCcw className="w-5 h-5" />
              PLAY AGAIN
            </span>
          </ActionButton>
          <ActionButton
            variant="ghost"
            size="lg"
            fullWidth
            onClick={onHome}
          >
            <span className="flex items-center justify-center gap-2">
              <Home className="w-5 h-5" />
              HOME
            </span>
          </ActionButton>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center text-center gap-1 py-2">
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${color}`}>
        {icon}
      </div>
      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">{label}</p>
      <p className="font-display font-bold text-lg text-gray-800">{value}</p>
    </div>
  );
}
