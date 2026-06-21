/**
 * typing.js — Typewriter effect for the hero section
 */
(function () {
  const phrases = [
    'API Integration Specialist',
    'GIS & WebGIS Developer',
    'AI Tool Builder',
    'Oracle OIC Engineer',
  ];

  const el = document.getElementById('typed-text');
  if (!el) return;

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let isPaused = false;

  const TYPING_SPEED   = 70;   // ms per character (typing)
  const DELETE_SPEED   = 35;   // ms per character (deleting)
  const PAUSE_AFTER    = 2000; // ms to hold complete phrase
  const PAUSE_BEFORE   = 400;  // ms before starting to type next

  function tick() {
    const current = phrases[phraseIndex];

    if (isPaused) {
      isPaused = false;
      isDeleting = true;
      setTimeout(tick, PAUSE_AFTER);
      return;
    }

    if (isDeleting) {
      el.textContent = current.slice(0, charIndex - 1);
      charIndex--;

      if (charIndex === 0) {
        isDeleting = false;
        phraseIndex = (phraseIndex + 1) % phrases.length;
        setTimeout(tick, PAUSE_BEFORE);
        return;
      }

      setTimeout(tick, DELETE_SPEED);
    } else {
      el.textContent = current.slice(0, charIndex + 1);
      charIndex++;

      if (charIndex === current.length) {
        isPaused = true;
        setTimeout(tick, 0);
        return;
      }

      setTimeout(tick, TYPING_SPEED);
    }
  }

  // Small initial delay so hero animations can settle first
  setTimeout(tick, 1200);
})();
