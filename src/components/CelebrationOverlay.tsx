import { useEffect, useState } from 'react';

interface ConfettiPiece {
  id: number;
  x: number;
  y: number;
  rotation: number;
  color: string;
  size: number;
  delay: number;
  duration: number;
  shape: 'square' | 'circle' | 'triangle';
}

const colors = [
  '#27a8ff', '#fd6a16', '#10b851', '#fbbf24', '#ef4444', '#8ad9ff',
  '#ffaf70', '#6ee7a3', '#fcd34d', '#f87171',
];

export function CelebrationOverlay({ show }: { show: boolean }) {
  const [pieces, setPieces] = useState<ConfettiPiece[]>([]);

  useEffect(() => {
    if (!show) {
      setPieces([]);
      return;
    }

    const newPieces: ConfettiPiece[] = [];
    for (let i = 0; i < 60; i++) {
      const shapes: ('square' | 'circle' | 'triangle')[] = ['square', 'circle', 'triangle'];
      newPieces.push({
        id: i,
        x: Math.random() * 100,
        y: -20 - Math.random() * 30,
        rotation: Math.random() * 360,
        color: colors[Math.floor(Math.random() * colors.length)],
        size: 8 + Math.random() * 12,
        delay: Math.random() * 0.5,
        duration: 2 + Math.random() * 1.5,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }
    setPieces(newPieces);
  }, [show]);

  if (!show || pieces.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {pieces.map((piece) => (
        <div
          key={piece.id}
          className="absolute"
          style={{
            left: `${piece.x}%`,
            top: `${piece.y}%`,
            width: `${piece.size}px`,
            height: `${piece.size}px`,
            backgroundColor: piece.shape !== 'triangle' ? piece.color : 'transparent',
            borderRadius: piece.shape === 'circle' ? '50%' : '0',
            borderLeft: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderRight: piece.shape === 'triangle' ? `${piece.size / 2}px solid transparent` : undefined,
            borderBottom: piece.shape === 'triangle' ? `${piece.size}px solid ${piece.color}` : undefined,
            transform: `rotate(${piece.rotation}deg)`,
            animation: `confettiFall ${piece.duration}s ease-in ${piece.delay}s forwards`,
          }}
        />
      ))}
      <style>{`
        @keyframes confettiFall {
          0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  );
}
