import { useEffect, useState } from 'react';

interface LetterTileProps {
  letter: string;
  state?: 'idle' | 'selected' | 'correct' | 'wrong' | 'disabled';
  size?: 'sm' | 'md' | 'lg';
  onClick?: () => void;
  index?: number;
}

export function LetterTile({
  letter,
  state = 'idle',
  size = 'md',
  onClick,
  index = 0,
}: LetterTileProps) {
  const [animState, setAnimState] = useState<'enter' | 'normal'>('enter');

  useEffect(() => {
    setAnimState('enter');
    const timer = setTimeout(() => setAnimState('normal'), 400 + index * 50);
    return () => clearTimeout(timer);
  }, [letter, index]);

  const sizes = {
    sm: 'w-12 h-12 text-xl rounded-xl',
    md: 'w-14 h-14 text-2xl rounded-2xl',
    lg: 'w-16 h-16 text-3xl rounded-2xl',
  };

  const states = {
    idle: 'bg-white text-gray-700 shadow-md border border-gray-100 active:scale-95',
    selected: 'bg-primary-500 text-white shadow-lg shadow-primary-200 border-primary-400 scale-105',
    correct: 'bg-success-500 text-white shadow-lg shadow-success-200 border-success-400 animate-pop',
    wrong: 'bg-error-500 text-white shadow-lg shadow-error-200 border-error-400 animate-shake',
    disabled: 'bg-gray-100 text-gray-300 shadow-none border-gray-100 opacity-50',
  };

  const s = sizes[size];

  return (
    <button
      onClick={onClick}
      disabled={state === 'disabled' || state === 'correct' || state === 'wrong'}
      className={`${s} ${states[state]} font-display font-bold flex items-center justify-center transition-all duration-200 ${
        animState === 'enter' ? 'animate-bounce-in' : ''
      } ${onClick && state === 'idle' ? 'cursor-pointer hover:shadow-lg hover:scale-105' : ''}`}
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {letter}
    </button>
  );
}
