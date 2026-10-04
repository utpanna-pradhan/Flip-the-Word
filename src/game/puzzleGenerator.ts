import type { Difficulty, Puzzle, PuzzleType } from '@/types';
import { getRandomWord, getRandomWordByLength } from '@/data/words';
import { shuffleWord, getMissingLetterOptions, getMissingIndex } from '@/utils/helpers';

export function generatePuzzle(type: PuzzleType, difficulty: Difficulty, exclude: string[] = []): Puzzle {
  const word = getRandomWord(difficulty, exclude);

  if (type === 'missing') {
    const missingIndex = getMissingIndex(word);
    const missingOptions = getMissingLetterOptions(word, missingIndex);
    return {
      type: 'missing',
      word,
      difficulty,
      scramble: [],
      missingIndex,
      missingOptions,
    };
  }

  if (type === 'rearrange') {
    return {
      type: 'rearrange',
      word,
      difficulty,
      scramble: shuffleWord(word),
      missingIndex: -1,
      missingOptions: [],
    };
  }

  // scramble
  return {
    type: 'scramble',
    word,
    difficulty,
    scramble: shuffleWord(word),
    missingIndex: -1,
    missingOptions: [],
  };
}

export function generatePuzzleForEndlessLevel(level: number, exclude: string[] = []): Puzzle {
  let difficulty: Difficulty;
  let types: PuzzleType[];

  if (level < 5) {
    difficulty = 'easy';
    types = ['scramble', 'missing'];
  } else if (level < 12) {
    difficulty = 'medium';
    types = ['scramble', 'missing', 'rearrange'];
  } else {
    difficulty = 'hard';
    types = ['scramble', 'missing', 'rearrange'];
  }

  const type = types[Math.floor(Math.random() * types.length)];
  return generatePuzzle(type, difficulty, exclude);
}

export function generateDailyPuzzles(): Puzzle[] {
  const today = new Date();
  const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();

  const puzzles: Puzzle[] = [];
  const usedWords: string[] = [];

  const pattern: { type: PuzzleType; difficulty: Difficulty }[] = [
    { type: 'scramble', difficulty: 'easy' },
    { type: 'missing', difficulty: 'easy' },
    { type: 'scramble', difficulty: 'medium' },
    { type: 'missing', difficulty: 'medium' },
    { type: 'rearrange', difficulty: 'medium' },
    { type: 'scramble', difficulty: 'medium' },
    { type: 'missing', difficulty: 'hard' },
    { type: 'rearrange', difficulty: 'hard' },
    { type: 'scramble', difficulty: 'hard' },
    { type: 'rearrange', difficulty: 'hard' },
  ];

  for (let i = 0; i < 10; i++) {
    const p = pattern[i];
    const puzzle = generatePuzzle(p.type, p.difficulty, usedWords);
    usedWords.push(puzzle.word);
    puzzles.push(puzzle);
  }

  // Simple seeded shuffle of puzzle order (keeps same daily set)
  let s = seed;
  for (let i = puzzles.length - 1; i > 0; i--) {
    s = (s * 9301 + 49297) % 233280;
    const j = Math.floor((s / 233280) * (i + 1));
    [puzzles[i], puzzles[j]] = [puzzles[j], puzzles[i]];
  }

  return puzzles;
}

export function generateQuickPuzzle(exclude: string[] = []): Puzzle {
  const types: PuzzleType[] = ['scramble', 'missing'];
  const type = types[Math.floor(Math.random() * types.length)];
  const difficulties: Difficulty[] = ['easy', 'medium', 'hard'];
  const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
  return generatePuzzle(type, difficulty, exclude);
}

export function generateEndlessPuzzle(level: number, exclude: string[] = []): Puzzle {
  // Use word length-based selection for gradual difficulty
  let minLen: number, maxLen: number;
  let types: PuzzleType[];

  if (level < 4) {
    minLen = 3; maxLen = 4;
    types = ['scramble', 'missing'];
  } else if (level < 10) {
    minLen = 4; maxLen = 6;
    types = ['scramble', 'missing', 'rearrange'];
  } else if (level < 18) {
    minLen = 5; maxLen = 7;
    types = ['scramble', 'missing', 'rearrange'];
  } else {
    minLen = 6; maxLen = 8;
    types = ['scramble', 'missing', 'rearrange'];
  }

  const type = types[Math.floor(Math.random() * types.length)];
  const word = getRandomWordByLength(minLen, maxLen, exclude);

  if (type === 'missing') {
    const missingIndex = getMissingIndex(word);
    const missingOptions = getMissingLetterOptions(word, missingIndex);
    return { type: 'missing', word, difficulty: 'hard', scramble: [], missingIndex, missingOptions };
  }

  if (type === 'rearrange') {
    return { type: 'rearrange', word, difficulty: 'hard', scramble: shuffleWord(word), missingIndex: -1, missingOptions: [] };
  }

  return { type: 'scramble', word, difficulty: 'hard', scramble: shuffleWord(word), missingIndex: -1, missingOptions: [] };
}

export function checkAnswer(puzzle: Puzzle, answer: string): boolean {
  return puzzle.word.toUpperCase() === answer.toUpperCase().trim();
}

export function getEndlessDifficultyLabel(level: number): string {
  if (level < 4) return 'Easy';
  if (level < 10) return 'Medium';
  if (level < 18) return 'Hard';
  return 'Expert';
}
