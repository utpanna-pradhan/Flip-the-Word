import { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface LivesDisplayProps {
  lives: number;
  maxLives: number;
}

export function LivesDisplay({ lives, maxLives }: LivesDisplayProps) {
  const [lostLife, setLostLife] = useState(false);

  useEffect(() => {
    if (lives < maxLives) {
      setLostLife(true);
      const timer = setTimeout(() => setLostLife(false), 400);
      return () => clearTimeout(timer);
    }
  }, [lives, maxLives]);

  return (
    <div className="flex items-center gap-1">
      {Array.from({ length: maxLives }).map((_, i) => {
        const isAlive = i < lives;
        const isJustLost = lostLife && i === lives;
        return (
          <Heart
            key={i}
            className={`w-6 h-6 transition-all duration-300 ${
              isAlive
                ? 'text-error-500 fill-error-400'
                : isJustLost
                ? 'text-error-500 fill-error-300 animate-shake'
                : 'text-gray-300 fill-gray-200'
            }`}
          />
        );
      })}
    </div>
  );
}
