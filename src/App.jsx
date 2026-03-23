import React, { useState, useEffect, useCallback, useRef } from "react";
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

function isSolvable(board, size) {
  const arr = board.filter(x => x !== null);
  let inversions = 0;
  for (let i = 0; i < arr.length; i++) {
    for (let j = i + 1; j < arr.length; j++) {
      if (arr[i] > arr[j]) inversions++;
    }
  }
  if (size % 2 !== 0) return inversions % 2 === 0;
  const emptyRow = Math.floor(board.indexOf(null) / size);
  const fromBottom = size - emptyRow;
  if (fromBottom % 2 === 0) return inversions % 2 !== 0;
  return inversions % 2 === 0;
}

function makeBoard(size) {
  let arr;
  do {
    arr = [...Array(size * size).keys()].map(n => n + 1);
    arr[arr.length - 1] = null;
    arr = shuffle(arr);
  } while (!isSolvable(arr, size));
  return arr;
}

function getBestScore(level) {
  const saved = localStorage.getItem(`best_${level}`);
  return saved ? JSON.parse(saved) : null;
}

function saveBestScore(level, moves, time) {
  const existing = getBestScore(level);
  if (!existing || moves < existing.moves) {
    localStorage.setItem(`best_${level}`, JSON.stringify({ moves, time }));
  }
}

function App() {
  const [level, setLevel] = useState('easy');
  const [timeLeft, setTimeLeft] = useState(LEVELS['easy'].time);
  const [gameOver, setGameOver] = useState(false);
  const [board, setBoard] = useState([]);
  const [moves, setMoves] = useState(0);
  const [won, setWon] = useState(false);
  const [bestScore, setBestScore] = useState(getBestScore('easy'));
  const [animatingTile, setAnimatingTile] = useState(null);

  const touchStart = useRef(null);
  const size = LEVELS[level].size;

  useEffect(() => {
    setBoard(makeBoard(size));
  }, []);

  useEffect(() => {
    if (gameOver || won) return;
    if (board.length === 0) return;
    if (timeLeft === 0) {
      setGameOver(true);
      return;
    }
    const timer = setTimeout(() => setTimeLeft(t => t - 1), 1000);
    return () => clearTimeout(timer);
  }, [timeLeft, gameOver, won, board]);

  const handleLevelChange = (e) => {
    const newLevel = e.target.value;
    setLevel(newLevel);
    setTimeLeft(LEVELS[newLevel].time);
    setGameOver(false);
    setWon(false);
    setMoves(0);
    setBestScore(getBestScore(newLevel));
    setBoard(makeBoard(LEVELS[newLevel].size));
  };

  const handleShuffle = () => {
    setBoard(makeBoard(size));
    setTimeLeft(LEVELS[level].time);
    setGameOver(false);
    setWon(false);
    setMoves(0);
  };

  const moveTile = useCallback((index) => {
    if (gameOver || won) return;
    const emptyIndex = board.indexOf(null);
    const row = Math.floor(index / size);
    const emptyRow = Math.floor(emptyIndex / size);
    const col = index % size;
    const emptyCol = emptyIndex % size;

    const isAdjacent =
      (row === emptyRow && Math.abs(col - emptyCol) === 1) ||
      (col === emptyCol && Math.abs(row - emptyRow) === 1);

    if (isAdjacent) {
      moveAudio.currentTime = 0;
      moveAudio.play();
      setAnimatingTile(index);
      setTimeout(() => setAnimatingTile(null), 150);
      let newBoard = [...board];
      [newBoard[index], newBoard[emptyIndex]] = [newBoard[emptyIndex], newBoard[index]];
      setBoard(newBoard);
      setMoves(m => m + 1);
    }
  }, [board, gameOver, won, size]);

  const handleTouchStart = (e) => {
    touchStart.current = {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  };

  const handleTouchEnd = (e) => {
    if (!touchStart.current) return;
    const dx = e.changedTouches[0].clientX - touchStart.current.x;
    const dy = e.changedTouches[0].clientY - touchStart.current.y;
    touchStart.current = null;

    const emptyIndex = board.indexOf(null);
    const emptyRow = Math.floor(emptyIndex / size);
    const emptyCol = emptyIndex % size;

    let targetIndex = null;

    if (Math.abs(dx) > Math.abs(dy)) {
      if (dx > 30 && emptyCol > 0) targetIndex = emptyIndex - 1;
      else if (dx < -30 && emptyCol < size - 1) targetIndex = emptyIndex + 1;
    } else {
      if (dy > 30 && emptyRow > 0) targetIndex = emptyIndex - size;
      else if (dy < -30 && emptyRow < size - 1) targetIndex = emptyIndex + size;
    }

    if (targetIndex !== null) moveTile(targetIndex);
  };

  useEffect(() => {
    if (board.length === 0 || gameOver) return;
    const solvedBoard = [...Array(size * size).keys()].map(n => n + 1);
    solvedBoard[solvedBoard.length - 1] = null;
    if (JSON.stringify(board) === JSON.stringify(solvedBoard)) {
      winAudio.play();
      setWon(true);
      setGameOver(true);
      saveBestScore(level, moves, LEVELS[level].time - timeLeft);
      setBestScore(getBestScore(level));
      const today = new Date().toISOString().split("T")[0];
      saveDailyActivity({ date: today, solved: true });
    }
  }, [board]);

  const minutes = Math.floor(timeLeft / 60);
  const seconds = String(timeLeft % 60).padStart(2, '0');

  return (
    <div className="container">
      <div className="header">
        <h1>🧩 Puzzle App</h1>
        <p className="subtitle">Slide tiles to solve the puzzle!</p>
      </div>

      <div className="controls">
        <select value={level} onChange={handleLevelChange}>
          <option value="easy">🟢 Easy (3x3)</option>
          <option value="medium">🟡 Medium (4x4)</option>
          <option value="hard">🔴 Hard (5x5)</option>
        </select>

        <span className={`timer ${timeLeft <= 10 ? 'danger' : ''}`}>
          ⏱ {minutes}:{seconds}
        </span>

        <span className="move-count">
          👣 {moves} moves
        </span>
      </div>

      {bestScore && (
        <div className="best-score">
          🏆 Best: {bestScore.moves} moves in {bestScore.time}s
        </div>
      )}

      {won && (
        <div className="win-banner">
          🎉 Solved in {moves} moves!
        </div>
      )}

      {gameOver && !won && (
        <div className="lose-banner">
          ⏰ Time Over! Try Again!
        </div>
      )}

      <div
        className="board"
        style={{ gridTemplateColumns: `repeat(${size}, 1fr)` }}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        {board.map((tile, i) => (
          <div
            key={i}
            className={`tile ${tile === null ? "empty" : ""} ${won ? "won" : ""} ${animatingTile === i ? "sliding" : ""}`}
            onClick={() => moveTile(i)}
          >
            {tile}
          </div>
        ))}
      </div>

      <button className="shuffle-btn" onClick={handleShuffle}>
        🔀 New Game
      </button>

      <div className="heatmap-section">
        <h2>🔥 Your Activity</h2>
        <Heatmap />
      </div>
    </div>
  );
}

export default App;