interface AnswerOptionButtonProps {
  letter: string;
  state?: 'idle' | 'correct' | 'wrong' | 'disabled';
  onClick?: () => void;
  index?: number;
}

export function AnswerOptionButton({
  letter,
  state = 'idle',
  onClick,
  index = 0,
}: AnswerOptionButtonProps) {
  const states = {
    idle: 'bg-white text-gray-700 shadow-md border-gray-100 hover:shadow-lg hover:scale-105 active:scale-95',
    correct: 'bg-success-500 text-white shadow-lg shadow-success-200 border-success-400 animate-pop',
    wrong: 'bg-error-500 text-white shadow-lg shadow-error-200 border-error-400 animate-shake',
    disabled: 'bg-gray-100 text-gray-300 shadow-none border-gray-100 opacity-50',
  };

  return (
    <button
      onClick={onClick}
      disabled={state === 'disabled' || state === 'correct' || state === 'wrong'}
      className={`w-20 h-20 sm:w-24 sm:h-24 text-4xl font-display font-bold rounded-3xl border-2 transition-all duration-200 animate-bounce-in flex items-center justify-center ${states[state]}`}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {letter}
    </button>
  );
}
