// Avatar "coin spin" click animation
// Kept separate from layout/navigation logic for easier maintenance.

(() => {
  const avatar = document.querySelector('.avatar');
  const avatarContainer = document.querySelector('.avatar-container');
  const mertCounterEl = document.getElementById('mertCounter');

  if (!avatar || !avatarContainer) return;

  let isSpinning = false;
  let clickCount = 0;
  let spinCount = 0;
  let spinStreak = 0;
  let maxSpinStreak = 0;

  function rand(min, max) {
    return Math.random() * (max - min) + min;
  }

  function triggerSpin() {
    if (isSpinning) return;
    clickCount += 1;

    const shouldSpin = Math.random() < 0.1;
    const spinDur = 1000; // keep in sync with animations.css default

    if (shouldSpin) {
      isSpinning = true;
      avatar.style.setProperty('--coin-dur', `${spinDur}ms`);
      spinCount += 1;
      spinStreak += 1;
      if (spinStreak > maxSpinStreak) maxSpinStreak = spinStreak;
    } else {
      spinStreak = 0;
    }

    if (mertCounterEl) {
      mertCounterEl.classList.remove('is-hidden');
      mertCounterEl.textContent = `Clicks: ${clickCount} • Spins: ${spinCount} • Max Streak: ${maxSpinStreak}`;
    }

    // Always show click pulse; only glow/spin sometimes
    avatarContainer.classList.add('clicked');
    if (shouldSpin) avatarContainer.classList.add('spinning');

    if (shouldSpin) {
      // Restart animation reliably
      avatar.classList.remove('coin-spin');
      // Force reflow so the same class can retrigger smoothly
      void avatar.offsetWidth;
      avatar.classList.add('coin-spin');
    }

    // Remove click pulse after it completes
    window.setTimeout(() => {
      avatarContainer.classList.remove('clicked');
    }, 450);

    // Cleanup after animation ends
    window.setTimeout(() => {
      avatarContainer.classList.remove('clicked');
    }, 450);

    if (shouldSpin) {
      window.setTimeout(() => {
        avatar.classList.remove('coin-spin');
        avatarContainer.classList.remove('spinning');
        isSpinning = false;
      }, spinDur);
    }
  }

  avatarContainer.addEventListener('click', triggerSpin);
})();

