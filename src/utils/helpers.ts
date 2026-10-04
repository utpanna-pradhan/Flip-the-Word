export function shuffle<T>(array: T[]): T[] {
  const result = [...array];
  for (let i = result.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [result[i], result[j]] = [result[j], result[i]];
  }
  return result;
}

export function shuffleWord(word: string): string[] {
  const letters = word.split('');
  let shuffled = shuffle(letters);
  let attempts = 0;
  while (shuffled.join('') === word && attempts < 20) {
    shuffled = shuffle(letters);
    attempts++;
  }
  return shuffled;
}

export function getMissingLetterOptions(word: string, missingIndex: number): string[] {
  const correct = word[missingIndex];
  const allVowels = ['A', 'E', 'I', 'O', 'U'];
  const allConsonants = 'BCDFGHJKLMNPQRSTVWXYZ'.split('');

  const isVowel = allVowels.includes(correct);
  const pool = isVowel ? allVowels : allConsonants;

  const distractors = shuffle(pool.filter(l => l !== correct)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

export function getMissingIndex(word: string): number {
  return Math.floor(Math.random() * word.length);
}

export function getDateString(date: Date = new Date()): string {
  return date.toISOString().split('T')[0];
}

export function isSameDay(date1: string, date2: string): boolean {
  return date1 === date2;
}

export function getDayDifference(date1: string, date2: string): number {
  const d1 = new Date(date1);
  const d2 = new Date(date2);
  const diff = Math.abs(d2.getTime() - d1.getTime());
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function formatDateShort(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}
