const sounds = {
  move: new Audio('/sounds/move.mp3'),
  win: new Audio('/sounds/win.mp3'),
};

export const playSound = (type) => {
  try {
    sounds[type].currentTime = 0;
    sounds[type].play().catch(err => console.log('Sound error:', err));
  } catch (err) {
    console.log('Sound error:', err);
  }
};