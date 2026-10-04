import { useCallback, useEffect, useRef, useState } from 'react';
import type { GameMode, Puzzle, GameResult, DailyChallengeState, GameProgressState } from '@/types';
import {
  generateDailyPuzzles,
  generateQuickPuzzle,
  generateEndlessPuzzle,
  checkAnswer,
} from '@/game/puzzleGenerator';
import { calculateScore, calculateEndlessScore, getDailyBonus } from '@/game/scoring';
import { getDateString, getDayDifference } from '@/utils/helpers';
import { useLocalStorage } from '@/hooks/useLocalStorage';
import { soundManager } from '@/utils/sound';

const QUICK_WORD_TIME = 20;
const MISSING_WORD_TIME = 15;
const REARRANGE_TIME = 30;
const DAILY_TIME = 20;
const ENDLESS_TIME = 20;
const MAX_LIVES = 3;

type GameState = 'playing' | 'feedback' | 'finished';

interface GameConfig {
  mode: GameMode;
  soundEnabled: boolean;
}

export function useGameEngine() {
  const [screen, setScreen] = useState<'home' | 'game' | 'result'>('home');
  const [gameState, setGameState] = useState<GameState>('playing');
  const [config, setConfig] = useState<GameConfig | null>(null);

  const [puzzles, setPuzzles] = useState<Puzzle[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [lives, setLives] = useState(MAX_LIVES);
  const [correctCount, setCorrectCount] = useState(0);
  const [combo, setCombo] = useState(0);
  const [level, setLevel] = useState(0);
  const [timeLeft, setTimeLeft] = useState(QUICK_WORD_TIME);
  const [feedback, setFeedback] = useState<{ correct: boolean; answer: string } | null>(null);
  const [result, setResult] = useState<GameResult | null>(null);

  const [progress, setProgress] = useLocalStorage<GameProgressState>('wordflip-progress', {
    streak: 0,
    bestScore: 0,
    dailyCompletedDate: null,
    lastStreakDate: null,
  });

  const [dailyState, setDailyState] = useLocalStorage<DailyChallengeState | null>('wordflip-daily', null);
  const [soundEnabled, setSoundEnabled] = useLocalStorage<boolean>('wordflip-sound', false);

  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const usedWordsRef = useRef<string[]>([]);

  const currentPuzzle = puzzles[currentIndex] || null;

  const stopTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, []);

  const getMaxTime = useCallback((puzzle: Puzzle | null, mode: GameMode): number => {
    if (mode === 'daily') return DAILY_TIME;
    if (mode === 'endless') return ENDLESS_TIME;
    if (puzzle?.type === 'missing') return MISSING_WORD_TIME;
    if (puzzle?.type === 'rearrange') return REARRANGE_TIME;
    return QUICK_WORD_TIME;
  }, []);

  const playSound = useCallback((fn: () => void) => {
    if (soundEnabled) fn();
  }, [soundEnabled]);

  const finishGame = useCallback((finalScore: number, finalCorrect: number, totalPuzzles: number) => {
    stopTimer();
    setGameState('finished');

    const today = getDateString();
    let newStreak = progress.streak;
    let newBestScore = progress.bestScore;

    if (finalScore > newBestScore) {
      newBestScore = finalScore;
    }

    if (config?.mode === 'daily') {
      const lastDate = progress.lastStreakDate;
      if (lastDate) {
        const diff = getDayDifference(lastDate, today);
        if (diff === 1) {
          newStreak = progress.streak + 1;
        } else if (diff > 1) {
          newStreak = 1;
        }
      } else {
        newStreak = 1;
      }

      setProgress({
        streak: newStreak,
        bestScore: newBestScore,
        dailyCompletedDate: today,
        lastStreakDate: today,
      });

      setDailyState(prev => prev ? {
        ...prev,
        solved: true,
        score: finalScore,
        correct: finalCorrect,
      } : null);
    } else {
      setProgress({
        ...progress,
        bestScore: newBestScore,
      });
    }

    setResult({
      mode: config?.mode || 'quick',
      score: finalScore,
      correct: finalCorrect,
      total: totalPuzzles,
      bestScore: newBestScore,
      streak: newStreak,
    });
    setScreen('result');

    playSound(soundManager.levelComplete);
  }, [stopTimer, progress, config, setProgress, setDailyState, playSound]);

  const generateNextPuzzle = useCallback((mode: GameMode, idx: number): Puzzle => {
    if (mode === 'quick') {
      return generateQuickPuzzle(usedWordsRef.current);
    }
    if (mode === 'endless') {
      return generateEndlessPuzzle(idx, usedWordsRef.current);
    }
    return puzzles[idx];
  }, [puzzles]);

  const handleAnswer = useCallback((answer: string) => {
    if (gameState !== 'playing' || !currentPuzzle) return;

    stopTimer();
    const isCorrect = checkAnswer(currentPuzzle, answer);
    const maxTime = getMaxTime(currentPuzzle, config?.mode || 'quick');
    const earned = config?.mode === 'endless'
      ? calculateEndlessScore(timeLeft, maxTime, combo)
      : calculateScore(timeLeft, maxTime, isCorrect);

    setFeedback({ correct: isCorrect, answer: currentPuzzle.word });

    if (isCorrect) {
      setScore(s => s + earned);
      setCorrectCount(c => c + 1);
      setCombo(c => c + 1);
      playSound(soundManager.correct);
    } else {
      setLives(l => l - 1);
      setCombo(0);
      playSound(soundManager.wrong);
    }

    setGameState('feedback');
  }, [gameState, currentPuzzle, stopTimer, getMaxTime, config, timeLeft, combo, playSound]);

  const nextPuzzle = useCallback(() => {
    setFeedback(null);

    const mode = config?.mode || 'quick';

    if (mode === 'daily') {
      const nextIdx = currentIndex + 1;
      if (nextIdx >= puzzles.length) {
        const bonus = getDailyBonus(correctCount, puzzles.length);
        const finalScore = score + bonus;
        finishGame(finalScore, correctCount, puzzles.length);
        return;
      }
      setCurrentIndex(nextIdx);
      setTimeLeft(DAILY_TIME);
      setGameState('playing');
      return;
    }

    if (mode === 'endless') {
      if (lives <= 0) {
        finishGame(score, correctCount, level);
        return;
      }
      const nextLevel = level + 1;
      setLevel(nextLevel);
      const next = generateNextPuzzle('endless', nextLevel);
      usedWordsRef.current.push(next.word);
      setPuzzles(prev => [...prev, next]);
      setCurrentIndex(prev => prev + 1);
      setTimeLeft(ENDLESS_TIME);
      setGameState('playing');
      return;
    }

    // quick mode — endless until lives run out
    if (lives <= 0) {
      finishGame(score, correctCount, currentIndex + 1);
      return;
    }
    const nextIdx = currentIndex + 1;
    const next = generateNextPuzzle('quick', nextIdx);
    usedWordsRef.current.push(next.word);
    setPuzzles(prev => [...prev, next]);
    setCurrentIndex(prev => prev + 1);
    setTimeLeft(getMaxTime(next, 'quick'));
    setGameState('playing');
  }, [config, currentIndex, puzzles.length, correctCount, score, lives, level, finishGame, generateNextPuzzle, getMaxTime]);

  const startGame = useCallback((mode: GameMode) => {
    stopTimer();
    usedWordsRef.current = [];

    if (mode === 'daily') {
      const today = getDateString();
      let daily = dailyState;

      if (!daily || daily.date !== today) {
        const generated = generateDailyPuzzles();
        daily = {
          date: today,
          puzzles: generated,
          solved: false,
          score: 0,
          correct: 0,
          currentIndex: 0,
          mistakes: 0,
        };
        setDailyState(daily);
      }

      if (daily.solved) {
        // Already solved today — show result
        setResult({
          mode: 'daily',
          score: daily.score,
          correct: daily.correct,
          total: 10,
          bestScore: Math.max(progress.bestScore, daily.score),
          streak: progress.streak,
        });
        setScreen('result');
        return;
      }

      setConfig({ mode, soundEnabled });
      setPuzzles(daily.puzzles);
      setCurrentIndex(0);
      setScore(0);
      setLives(MAX_LIVES);
      setCorrectCount(0);
      setCombo(0);
      setLevel(0);
      setTimeLeft(DAILY_TIME);
      setFeedback(null);
      setResult(null);
      setGameState('playing');
      setScreen('game');
      return;
    }

    let initialPuzzles: Puzzle[] = [];
    if (mode === 'quick') {
      const p = generateQuickPuzzle();
      initialPuzzles = [p];
      usedWordsRef.current.push(p.word);
    } else if (mode === 'endless') {
      const p = generateEndlessPuzzle(0);
      initialPuzzles = [p];
      usedWordsRef.current.push(p.word);
    }

    setConfig({ mode, soundEnabled });
    setPuzzles(initialPuzzles);
    setCurrentIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setCorrectCount(0);
    setCombo(0);
    setLevel(0);
    setTimeLeft(getMaxTime(initialPuzzles[0] || null, mode));
    setFeedback(null);
    setResult(null);
    setGameState('playing');
    setScreen('game');
  }, [stopTimer, dailyState, setDailyState, progress, soundEnabled, getMaxTime]);

  // Timer
  useEffect(() => {
    if (gameState !== 'playing' || !currentPuzzle) return;

    stopTimer();
    setTimeLeft(getMaxTime(currentPuzzle, config?.mode || 'quick'));

    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          stopTimer();
          // Time's up — wrong answer
          setFeedback({ correct: false, answer: currentPuzzle.word });
          setLives(l => l - 1);
          setCombo(0);
          setGameState('feedback');
          playSound(soundManager.wrong);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => stopTimer();
  }, [gameState, currentIndex, currentPuzzle, config, getMaxTime, stopTimer, playSound]);

  // Auto-advance after feedback
  useEffect(() => {
    if (gameState !== 'feedback') return;

    const timer = setTimeout(() => {
      nextPuzzle();
    }, 1500);

    return () => clearTimeout(timer);
  }, [gameState, nextPuzzle]);

  const goHome = useCallback(() => {
    stopTimer();
    setScreen('home');
    setGameState('playing');
    setFeedback(null);
    setResult(null);
    setPuzzles([]);
    setCurrentIndex(0);
    setScore(0);
    setLives(MAX_LIVES);
    setCorrectCount(0);
    setCombo(0);
    setLevel(0);
  }, [stopTimer]);

  const resetProgress = useCallback(() => {
    setProgress({
      streak: 0,
      bestScore: 0,
      dailyCompletedDate: null,
      lastStreakDate: null,
    });
    setDailyState(null);
  }, [setProgress, setDailyState]);

  const toggleSound = useCallback(() => {
    setSoundEnabled(prev => !prev);
  }, [setSoundEnabled]);

  // Update daily state when daily game progresses
  useEffect(() => {
    if (config?.mode === 'daily' && screen === 'game' && gameState === 'playing') {
      setDailyState(prev => prev ? {
        ...prev,
        currentIndex,
        score,
        correct: correctCount,
        mistakes: MAX_LIVES - lives,
      } : null);
    }
  }, [config, screen, gameState, currentIndex, score, correctCount, lives, setDailyState]);

  return {
    screen,
    gameState,
    config,
    currentPuzzle,
    currentIndex,
    totalPuzzles: puzzles.length,
    score,
    lives,
    correctCount,
    combo,
    level,
    timeLeft,
    feedback,
    result,
    progress,
    soundEnabled,
    dailyState,
    startGame,
    handleAnswer,
    nextPuzzle,
    goHome,
    resetProgress,
    toggleSound,
    setScreen,
  };
}
