export type Difficulty = 'easy' | 'medium' | 'hard';

export type GameMode = 'quick' | 'missing' | 'rearrange' | 'daily' | 'endless';

export type PuzzleType = 'scramble' | 'missing' | 'rearrange';

export type Screen = 'home' | 'game' | 'result';

export interface Puzzle {
  type: PuzzleType;
  word: string;
  difficulty: Difficulty;
  scramble: string[];
  missingIndex: number;
  missingOptions: string[];
}

export interface GameResult {
  mode: GameMode;
  score: number;
  correct: number;
  total: number;
  bestScore: number;
  streak: number;
}

export interface PuzzleResult {
  correct: boolean;
  earnedPoints: number;
  timeLeft: number;
}

export interface DailyChallengeState {
  date: string;
  puzzles: Puzzle[];
  solved: boolean;
  score: number;
  correct: number;
  currentIndex: number;
  mistakes: number;
}

export interface GameProgressState {
  streak: number;
  bestScore: number;
  dailyCompletedDate: string | null;
  lastStreakDate: string | null;
}
