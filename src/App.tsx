import { useState } from 'react';
import { useGameEngine } from '@/hooks/useGameEngine';
import { HomeScreen } from '@/screens/HomeScreen';
import { GameScreen } from '@/screens/GameScreen';
import { ResultScreen } from '@/screens/ResultScreen';
import { SettingsPanel } from '@/components/SettingsPanel';

const QUICK_WORD_TIME = 20;
const MISSING_WORD_TIME = 15;
const REARRANGE_TIME = 30;
const DAILY_TIME = 20;
const ENDLESS_TIME = 20;

function getMaxTime(puzzleType: string, mode: string): number {
  if (mode === 'daily') return DAILY_TIME;
  if (mode === 'endless') return ENDLESS_TIME;
  if (puzzleType === 'missing') return MISSING_WORD_TIME;
  if (puzzleType === 'rearrange') return REARRANGE_TIME;
  return QUICK_WORD_TIME;
}

function App() {
  const [settingsOpen, setSettingsOpen] = useState(false);
  const engine = useGameEngine();

  const handlePlayAgain = () => {
    if (engine.config?.mode) {
      engine.startGame(engine.config.mode);
    }
  };

  if (engine.screen === 'home') {
    return (
      <>
        <HomeScreen
          progress={engine.progress}
          dailyState={engine.dailyState}
          onStartGame={engine.startGame}
          onOpenSettings={() => setSettingsOpen(true)}
        />
        <SettingsPanel
          open={settingsOpen}
          onClose={() => setSettingsOpen(false)}
          soundEnabled={engine.soundEnabled}
          onToggleSound={engine.toggleSound}
          onResetProgress={engine.resetProgress}
        />
      </>
    );
  }

  if (engine.screen === 'result' && engine.result) {
    return (
      <ResultScreen
        result={engine.result}
        onPlayAgain={handlePlayAgain}
        onHome={engine.goHome}
      />
    );
  }

  if (engine.screen === 'game' && engine.currentPuzzle && engine.config) {
    return (
      <GameScreen
        mode={engine.config.mode}
        puzzle={engine.currentPuzzle}
        puzzleIndex={engine.currentIndex}
        totalPuzzles={engine.totalPuzzles}
        score={engine.score}
        lives={engine.lives}
        maxLives={3}
        timeLeft={engine.timeLeft}
        maxTime={getMaxTime(engine.currentPuzzle.type, engine.config.mode)}
        combo={engine.combo}
        level={engine.level}
        feedback={engine.feedback}
        onAnswer={engine.handleAnswer}
        onNext={engine.nextPuzzle}
        onHome={engine.goHome}
      />
    );
  }

  // Fallback to home
  return (
    <HomeScreen
      progress={engine.progress}
      dailyState={engine.dailyState}
      onStartGame={engine.startGame}
      onOpenSettings={() => setSettingsOpen(true)}
    />
  );
}

export default App;
