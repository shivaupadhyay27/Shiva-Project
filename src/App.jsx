import React, { useState, useEffect } from "react";
import "./App.css";
import Heatmap from "./components/Heatmap";
import { saveDailyActivity } from "./utils/activity";

const moveAudio = new Audio('/sounds/mixkit-hard-pop-click-2364.wav');
const winAudio = new Audio('/sounds/mixkit-achievement-bell-600.wav');

const LEVELS = {
  easy:   { size: 3, time: 300 },
  medium: { size: 4, time: 180 },
  hard:   { size: 5, time: 60  },
};

function shuffle(array) {
  let arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

function makeBoard(size) {
  const arr = [...Array(size * size).keys()].map(n => n + 1);
  arr[arr.length - 1] = null;
  return shuffle(arr);
}

function App() {

  const [level, setLevel] = useState('easy');
  const [timeLeft, setTimeLeft] = useState(LEVELS['easy'].time);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([]);

  const size = LEVELS[level].size;

  useEffect(() => {
    setBoard(makeBoard(size));
  }, []);

  useEffect(() => {
    if (gameOver) return;
    if (board.length === 0) return;
    if (timeLeft === 0) {
      alert("⏰ Time Over! Try again!");
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, board]);

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setLevel(newLevel);
    setTimeLeft(LEVELS[newLevel].time);
    setGameOver(false);
    setBoard(makeBoard(LEVELS[newLevel].size));
  };

  const handleShuffle = () => {
    setBoard(makeBoard(size));
    setTimeLeft(LEVELS[level].time);
    setGameOver(false);
  };

  const moveTile = (index) => {
    if (gameOver) return;
    const emptyIndex = board.indexOf(null);
    const validMoves = [
      emptyIndex - 1,
      emptyIndex + 1,
      emptyIndex - size,
      emptyIndex + size,
    ];
    if (validMoves.includes(index)) {
      moveAudio.play();
      let newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
    }
  };

  useEffect(() => {
    if (board.length === 0) return;
    if (gameOver) return;
    const solvedBoard = [...Array(size * size).keys()].map(n => n + 1);
    solvedBoard[solvedBoard.length - 1] = null;
    const isSolved = JSON.stringify(board) === JSON.stringify(solvedBoard);
    if (isSolved) {
      winAudio.play();
      setGameOver(true);
      const today = new Date().toISOString().split("T")[0];
      saveDailyActivity({ date: today, solved: true });
      alert("🎉 Puzzle Completed!");
    }
  }, [board]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

 return (
    <div className="container">

      <h1>🧩 My Puzzle App</h1>

      <div className="controls">
        <select value={level} onChange={handleLevelChange}>
          <option value="easy">🟢 Easy (3x3 - 5 min)</option>
          <option value="medium">🟡 Medium (4x4 - 3 min)</option>
          <option value="hard">🔴 Hard (5x5 - 1 min)</option>
        </select>

        <span className={`timer ${timeLeft <= 10 ? 'danger' : ''}`}>
          ⏱ {minutes}:{seconds}
        </span>
      </div>

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
      >
        {board.map((tile, i) => (
          <div
            key={i}
            className={`tile ${tile === null ? "empty" : ""}`}
            onClick={() => moveTile(i)}
          >
            {tile}
          </div>
        ))}
      </div>

      <button onClick={handleShuffle}>
        🔀 Shuffle Puzzle
      </button>

      <div className="heatmap-section">
        <h2>🔥 Your Activity</h2>
        <Heatmap />
      </div>

    </div>
  );
}

export default App;


// 

// function App() {
//   const [count, setCount] = useState(0)

//   return (
//     <>
//       <div>
//         <a href="https://vite.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React</h1>
//       <div className="card">
//         <button onClick={() => setCount((count) => count + 1)}>
//           count is {count}
//         </button>
//         <p>
//           Edit <code>src/App.jsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//     </>
//   )
// }

// export default App
