import React, { useEffect, useState } from 'react';
import PuzzleCard from './components/PuzzleCard';
import { getPuzzlesForWeek, incrementProgress } from './services/puzzleService';

const App: React.FC = () => {
  const [puzzles, setPuzzles] = useState<{ title: string; date: string }[]>([]);

  useEffect(() => {
    const weekPuzzles = getPuzzlesForWeek();
    setPuzzles(weekPuzzles);
  }, []);

  const handleComplete = (date: string) => {
    incrementProgress();
    console.log(`Puzzle completed: ${date}`);
    
  };

  return (
    <div style={{ padding: '20px' }}>
      <h1>My Puzzle App</h1>
      {puzzles.map((puzzle) => (
        <div key={puzzle.date}>
          <PuzzleCard title={puzzle.title} date={puzzle.date} />
          <button onClick={() => handleComplete(puzzle.date)}>
            Mark Complete
          </button>
        </div>
      ))}
    </div>
  );
};

export default App;
