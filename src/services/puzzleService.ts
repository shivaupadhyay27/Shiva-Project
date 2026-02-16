import LZString from 'lz-string';

const PUZZLE_KEY = 'cachedPuzzles';

// Simulated puzzle data
const allPuzzles = [
  { title: 'Puzzle 1', date: '2026-02-16' },
  { title: 'Puzzle 2', date: '2026-02-17' },
  { title: 'Puzzle 3', date: '2026-02-18' },
  { title: 'Puzzle 4', date: '2026-02-19' },
  { title: 'Puzzle 5', date: '2026-02-20' },
  { title: 'Puzzle 6', date: '2026-02-21' },
  { title: 'Puzzle 7', date: '2026-02-22' },
  { title: 'Puzzle 8', date: '2026-02-23' },
];

// Save puzzles to localStorage (compressed)
export function savePuzzles(puzzles: typeof allPuzzles) {
  const compressed = LZString.compress(JSON.stringify(puzzles));
  localStorage.setItem(PUZZLE_KEY, compressed);
}

// Load puzzles from localStorage
export function loadPuzzles() {
  const compressed = localStorage.getItem(PUZZLE_KEY);
  if (!compressed) return null;
  try {
    return JSON.parse(LZString.decompress(compressed) || '[]');
  } catch {
    return null;
  }
}

// Return today + next 7 puzzles
export function getPuzzlesForWeek() {
  const cached = loadPuzzles();
  if (cached) return cached.slice(0, 8);
  savePuzzles(allPuzzles);
  return allPuzzles.slice(0, 8);
}
let progressCounter = 0; // count puzzles completed since last save

// Increment progress for a puzzle
export function incrementProgress() {
  progressCounter += 1;

  // Save only every 5 puzzles
  if (progressCounter >= 5) {
    saveProgress();
    progressCounter = 0; // reset counter
  }
}

// Save current progress to localStorage
export function saveProgress() {
  const puzzles = loadPuzzles() || [];
  localStorage.setItem('puzzleProgress', JSON.stringify(puzzles));
  console.log('Progress saved!');
}

// Optionally, load progress
export function loadProgress() {
  const saved = localStorage.getItem('puzzleProgress');
  return saved ? JSON.parse(saved) : [];
}
