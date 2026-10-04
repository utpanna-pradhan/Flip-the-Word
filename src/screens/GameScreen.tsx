import { useCallback, useEffect, useState } from 'react';
import { Home as HomeIcon, Zap, Infinity as InfinityIcon, Calendar, Star } from 'lucide-react';
import type { Puzzle, GameMode } from '@/types';
import { PuzzleView } from '@/components/PuzzleView';
import { TimerBar } from '@/components/TimerBar';
import { ProgressBar } from '@/components/ProgressBar';
import { LivesDisplay } from '@/components/LivesDisplay';
import { FeedbackOverlay } from '@/components/FeedbackOverlay';
import { ActionButton } from '@/components/ActionButton';
import { AnimatedNumber } from '@/components/AnimatedNumber';
import { getEndlessDifficultyLabel } from '@/game/puzzleGenerator';
import { getMultiplier } from '@/game/scoring';

interface GameScreenProps {
  mode: GameMode;
  puzzle: Puzzle;
  puzzleIndex: number;
  totalPuzzles: number;
  score: number;
  lives: number;
  maxLives: number;
  timeLeft: number;
  maxTime: number;
  combo: number;
  level: number;
  feedback: { correct: boolean; answer: string } | null;
  onAnswer: (answer: string) => void;
  onNext: () => void;
  onHome: () => void;
}

export function GameScreen({
  mode,
  puzzle,
  puzzleIndex,
  totalPuzzles,
  score,
  lives,
  maxLives,
  timeLeft,
  maxTime,
  combo,
  level,
  feedback,
  onAnswer,
  onNext,
  onHome,
}: GameScreenProps) {
  const [selectedLetters, setSelectedLetters] = useState<number[]>([]);

  // Reset when puzzle changes
  useEffect(() => {
    setSelectedLetters([]);
  }, [puzzleIndex, puzzle]);

  const handleTileClick = useCallback((index: number) => {
    if (feedback) return;
    setSelectedLetters(prev => {
      // If already selected, remove it (toggle off)
      if (prev.includes(index)) {
        return prev.filter(i => i !== index);
      }
      return [...prev, index];
    });
  }, [feedback]);

  const handleCheck = useCallback(() => {
    if (feedback) return;
    if (puzzle.type === 'missing') return; // missing uses direct answer click

    const answer = selectedLetters
      .map(i => puzzle.scramble[i])
      .join('');
    if (answer.length === 0) return;
    onAnswer(answer);
  }, [feedback, puzzle, selectedLetters, onAnswer]);

  const handleMissingAnswer = useCallback((letter: string) => {
    if (feedback) return;
    const chars = puzzle.word.split('');
    chars[puzzle.missingIndex] = letter;
    onAnswer(chars.join(''));
  }, [feedback, puzzle, onAnswer]);

  const handleClear = useCallback(() => {
    if (feedback) return;
    setSelectedLetters([]);
  }, [feedback]);

  const modeIcon = mode === 'quick' ? <Zap className="w-4 h-4" /> : mode === 'daily' ? <Calendar className="w-4 h-4" /> : <InfinityIcon className="w-4 h-4" />;
  const modeLabel = mode === 'quick' ? 'Quick Word' : mode === 'daily' ? 'Daily Challenge' : 'Endless';
  const isEndless = mode === 'endless';
  const isDaily = mode === 'daily';

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-white flex flex-col items-center p-4 safe-top safe-bottom">
      <div className="w-full max-w-md flex flex-col flex-1 gap-4">
        {/* Top Bar */}
        <div className="flex items-center justify-between pt-2">
          <button
            onClick={onHome}
            className="w-10 h-10 rounded-full bg-white shadow-md flex items-center justify-center text-gray-400 hover:text-gray-600 active:scale-95 transition-all"
          >
            <HomeIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2 px-3 py-1.5 bg-white rounded-full shadow-sm">
            {modeIcon}
            <span className="text-sm font-display font-bold text-gray-600">{modeLabel}</span>
          </div>
          <div className="w-10 h-10 flex items-center justify-center">
            {combo >= 3 && (
              <div className="flex items-center gap-1 px-2 py-1 bg-secondary-100 rounded-full animate-pop">
                <Star className="w-3 h-3 text-secondary-500" fill="currentColor" />
                <span className="text-xs font-bold text-secondary-600">x{getMultiplier(combo).toFixed(1)}</span>
              </div>
            )}
          </div>
        </div>

        {/* Stats Row */}
        <div className="flex items-center justify-between gap-3">
          {/* Score */}
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100 flex-1">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Score</p>
            <p className="font-display font-bold text-xl text-gray-800 tabular-nums">
              <AnimatedNumber value={score} duration={500} />
            </p>
          </div>

          {/* Lives */}
          <div className="bg-white rounded-2xl px-4 py-2 shadow-sm border border-gray-100">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wide">Lives</p>
            <LivesDisplay lives={lives} maxLives={maxLives} />
          </div>
        </div>

        {/* Endless level indicator */}
        {isEndless && (
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wide">Level {level + 1}</span>
            <span className="text-xs font-bold text-primary-500">·</span>
            <span className="text-xs font-bold text-primary-500">{getEndlessDifficultyLabel(level)}</span>
          </div>
        )}

        {/* Progress Bar */}
        {isDaily && (
          <ProgressBar current={puzzleIndex} total={totalPuzzles} />
        )}

        {/* Timer */}
        {!feedback && (
          <TimerBar timeLeft={timeLeft} maxTime={maxTime} />
        )}

        {/* Puzzle Area */}
        <div className="flex-1 flex items-center justify-center relative py-4">
          <div key={puzzleIndex} className="w-full animate-fade-in-up">
            <PuzzleView
              puzzle={puzzle}
              selectedLetters={selectedLetters}
              onTileClick={handleTileClick}
              onAnswerClick={handleMissingAnswer}
              feedback={feedback}
            />
          </div>

          {feedback && <FeedbackOverlay correct={feedback.correct} answer={feedback.answer} />}
        </div>

        {/* Bottom Actions */}
        <div className="flex gap-3 pb-2">
          {puzzle.type !== 'missing' && !feedback && (
            <>
              <ActionButton
                variant="ghost"
                size="lg"
                onClick={handleClear}
                className="flex-shrink-0"
              >
                Clear
              </ActionButton>
              <ActionButton
                variant="primary"
                size="lg"
                fullWidth
                onClick={handleCheck}
                disabled={selectedLetters.length === 0}
                className={selectedLetters.length === 0 ? 'opacity-40' : ''}
              >
                CHECK
              </ActionButton>
            </>
          )}
          {puzzle.type === 'missing' && !feedback && (
            <div className="w-full text-center">
              <p className="text-sm text-gray-400 font-semibold">Tap the correct letter</p>
            </div>
          )}
          {feedback && (
            <ActionButton
              variant={feedback.correct ? 'success' : 'danger'}
              size="lg"
              fullWidth
              onClick={onNext}
            >
              {feedback.correct ? 'Next' : 'Continue'}
            </ActionButton>
          )}
        </div>
      </div>
    </div>
  );
}
