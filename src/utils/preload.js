import { generateDailyCards } from "./generator";

export function preloadPuzzles(currentDay, levels) {
  const cache = {};

  for (let i = 0; i < 7; i++) {
    const daySeed = currentDay + i;

    cache[daySeed] = {
      easy: generateDailyCards(levels.easy, daySeed),
      medium: generateDailyCards(levels.medium, daySeed),
      hard: generateDailyCards(levels.hard, daySeed)
    };
  }

  return cache;
}