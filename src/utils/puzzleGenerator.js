export function generatePuzzle(level) {

  const emojis = {
    easy: ["🍎","🍌","🍇","🍓"],
    medium: ["🍎","🍌","🍇","🍓","🍍","🥝"],
    hard: ["🍎","🍌","🍇","🍓","🍍","🥝","🍒","🥥"]
  }

  const selected = emojis[level]

  const cards = [...selected, ...selected]

  const shuffled = cards
    .map((emoji,i)=>({
      id:i,
      emoji,
      flipped:false,
      matched:false
    }))
    .sort(()=>Math.random()-0.5)

  return shuffled
}