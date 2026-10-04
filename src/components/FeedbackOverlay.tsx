import { Check, X } from 'lucide-react';

interface FeedbackOverlayProps {
  correct: boolean;
  answer: string;
}

export function FeedbackOverlay({ correct, answer }: FeedbackOverlayProps) {
  return (
    <div className="absolute inset-0 flex items-center justify-center z-30 pointer-events-none animate-fade-in">
      <div
        className={`flex flex-col items-center gap-3 px-8 py-6 rounded-3xl shadow-2xl ${
          correct
            ? 'bg-white/95'
            : 'bg-white/95'
        }`}
      >
        <div
          className={`w-16 h-16 rounded-full flex items-center justify-center ${
            correct
              ? 'bg-gradient-to-br from-success-400 to-success-500 shadow-lg shadow-success-200 animate-pop'
              : 'bg-gradient-to-br from-error-400 to-error-500 shadow-lg shadow-error-200 animate-shake'
          }`}
        >
          {correct ? (
            <Check className="w-9 h-9 text-white" strokeWidth={3} />
          ) : (
            <X className="w-9 h-9 text-white" strokeWidth={3} />
          )}
        </div>
        <div className="text-center">
          <p
            className={`font-display font-bold text-lg ${
              correct ? 'text-success-600' : 'text-error-600'
            }`}
          >
            {correct ? 'Correct!' : 'Oops!'}
          </p>
          {!correct && (
            <p className="text-sm text-gray-500 mt-1">
              Answer: <span className="font-bold text-gray-700 tracking-wider">{answer}</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
