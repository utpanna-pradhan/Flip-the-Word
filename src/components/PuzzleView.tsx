import type { Puzzle } from '@/types';
import { LetterTile } from '@/components/LetterTile';
import { AnswerOptionButton } from '@/components/AnswerOptionButton';

interface PuzzleViewProps {
  puzzle: Puzzle;
  selectedLetters: number[];
  onTileClick?: (index: number) => void;
  onAnswerClick?: (letter: string) => void;
  feedback?: { correct: boolean; answer: string } | null;
}

export function PuzzleView({
  puzzle,
  selectedLetters,
  onTileClick,
  onAnswerClick,
  feedback,
}: PuzzleViewProps) {
  // Scramble type: show scrambled letters that need to be rearranged
  if (puzzle.type === 'scramble') {
    const answerLetters = selectedLetters
      .map(i => puzzle.scramble[i])
      .join('');

    return (
      <div className="flex flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Unscramble the word</p>
          <div className="flex flex-wrap justify-center gap-2">
            {puzzle.scramble.map((letter, i) => {
              const isSelected = selectedLetters.includes(i);
              return (
                <LetterTile
                  key={i}
                  letter={letter}
                  index={i}
                  state={
                    feedback
                      ? feedback.correct
                        ? 'correct'
                        : 'wrong'
                      : isSelected
                      ? 'disabled'
                      : 'idle'
                  }
                  size="lg"
                  onClick={feedback ? undefined : () => onTileClick?.(i)}
                />
              );
            })}
          </div>
        </div>

        <div className="min-h-[80px] flex items-center justify-center">
          {answerLetters ? (
            <div className="flex flex-wrap justify-center gap-2 animate-fade-in-up">
              {answerLetters.split('').map((letter, i) => (
                <div
                  key={i}
                  className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-primary-100 to-primary-200 border-2 border-primary-300 flex items-center justify-center text-2xl font-display font-bold text-primary-700 shadow-sm"
                >
                  {letter}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-300 text-sm font-semibold">Tap letters to build your answer</p>
          )}
        </div>
      </div>
    );
  }

  // Missing letter type
  if (puzzle.type === 'missing') {
    const wordChars = puzzle.word.split('');

    return (
      <div className="flex flex-col items-center gap-10">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Fill in the missing letter</p>
          <div className="flex flex-wrap justify-center gap-2">
            {wordChars.map((char, i) => {
              if (i === puzzle.missingIndex) {
                return (
                  <div
                    key={i}
                    className={`w-16 h-16 sm:w-20 sm:h-20 rounded-2xl border-4 border-dashed flex items-center justify-center text-3xl font-display font-bold transition-all ${
                      feedback
                        ? feedback.correct
                          ? 'bg-success-100 border-success-400 text-success-600 animate-pop'
                          : 'bg-error-100 border-error-400 text-error-600 animate-shake'
                        : 'border-primary-300 bg-primary-50 text-primary-400'
                    }`}
                  >
                    {feedback ? puzzle.word[puzzle.missingIndex] : '?'}
                  </div>
                );
              }
              return (
                <div
                  key={i}
                  className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-white border-2 border-gray-100 shadow-sm flex items-center justify-center text-3xl font-display font-bold text-gray-700"
                >
                  {char}
                </div>
              );
            })}
          </div>
        </div>

        <div className="grid grid-cols-4 gap-3 sm:gap-4">
          {puzzle.missingOptions.map((letter, i) => (
            <AnswerOptionButton
              key={i}
              letter={letter}
              index={i}
              state={
                feedback
                  ? letter === puzzle.word[puzzle.missingIndex]
                    ? 'correct'
                    : 'disabled'
                  : 'idle'
              }
              onClick={feedback ? undefined : () => onAnswerClick?.(letter)}
            />
          ))}
        </div>
      </div>
    );
  }

  // Rearrange type
  if (puzzle.type === 'rearrange') {
    const answerLetters = selectedLetters
      .map(i => puzzle.scramble[i])
      .join('');

    const remainingIndices = puzzle.scramble
      .map((_, i) => i)
      .filter(i => !selectedLetters.includes(i));

    return (
      <div className="flex flex-col items-center gap-6">
        <div className="text-center">
          <p className="text-sm font-bold text-gray-400 uppercase tracking-wider mb-3">Rearrange to form a word</p>
        </div>

        {/* Answer slots */}
        <div className="min-h-[72px] flex flex-wrap justify-center gap-2">
          {puzzle.word.split('').map((_, i) => {
            const letter = answerLetters[i];
            const slotIndex = selectedLetters[i];
            return (
              <button
                key={i}
                onClick={letter && !feedback ? () => onTileClick?.(slotIndex) : undefined}
                className={`w-12 h-12 sm:w-14 sm:h-14 rounded-2xl border-2 flex items-center justify-center text-xl font-display font-bold transition-all ${
                  letter
                    ? 'bg-gradient-to-br from-primary-400 to-primary-600 text-white shadow-md border-primary-500 animate-bounce-in active:scale-95'
                    : 'border-dashed border-gray-300 bg-gray-50'
                }`}
              >
                {letter || ''}
              </button>
            );
          })}
        </div>

        {/* Available tiles */}
        <div className="flex flex-wrap justify-center gap-2 pt-2">
          {remainingIndices.length === 0 ? (
            <p className="text-gray-300 text-sm font-semibold py-4">All letters placed!</p>
          ) : (
            remainingIndices.map((i, displayIdx) => (
              <LetterTile
                key={i}
                letter={puzzle.scramble[i]}
                index={displayIdx}
                state="idle"
                size="lg"
                onClick={feedback ? undefined : () => onTileClick?.(i)}
              />
            ))
          )}
        </div>

        {selectedLetters.length > 0 && !feedback && (
          <p className="text-sm font-semibold text-gray-400">
            Tap a placed letter to remove it
          </p>
        )}
      </div>
    );
  }

  return null;
};
