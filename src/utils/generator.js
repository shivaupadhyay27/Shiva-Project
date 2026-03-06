export function generateDailyCards(emojis, daySeed) {
  const seed = daySeed;

  const duplicated = [...emojis, ...emojis];

  for (let i = duplicated.length - 1; i > 0; i--) {
    const j = (seed + i * 7) % duplicated.length;
    [duplicated[i], duplicated[j]] = [duplicated[j], duplicated[i]];
  }

  return duplicated.map((emoji, index) => ({
    id: index,
    emoji,
    flipped: false,
    matched: false
  }));
}