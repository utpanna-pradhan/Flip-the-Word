import type { GameMode } from '@/types';

export function calculateScore(timeLeft: number, maxTime: number, correct: boolean): number {
  if (!correct) return 0;
  const base = 100;
  const speedRatio = timeLeft / maxTime;
  const speedBonus = Math.round(25 + speedRatio * 75);
  return base + speedBonus;
}

export function calculateEndlessScore(timeLeft: number, maxTime: number, combo: number): number {
  const base = calculateScore(timeLeft, maxTime, true);
  const multiplier = 1 + Math.floor(combo / 3) * 0.5;
  return Math.round(base * multiplier);
}

export function getDailyBonus(correct: number, total: number): number {
  if (correct === total) return 500;
  if (correct >= total * 0.8) return 200;
  return 0;
}

export function getMultiplier(combo: number): number {
  return 1 + Math.floor(combo / 3) * 0.5;
}
