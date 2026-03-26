// Get all required elements
const counterValue = document.querySelector('.counter__value');
const increaseBtn = document.querySelector('.counter__button--increase');
const decreaseBtn = document.querySelector('.counter__button--decrease');
const resetBtn = document.querySelector('.counter__reset-button');
const counterContainer = document.querySelector('.counter');
const maxLimitMessage = document.querySelector('.counter__max-limit');

// Initialize counter
let count = 0;
const MAX_LIMIT = 10;
let playedMaxChime = false;

// Simple voice alert for the max limit
function playMaxReachedSound() {
    const phrase = 'oh no';
    // Use Web Speech API if available; otherwise fall back to a short beep
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(phrase);
        utterance.rate = 0.9;
        utterance.pitch = 0.6;
        window.speechSynthesis.cancel();
        window.speechSynthesis.speak(utterance);
    } else {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.value = 220;
            gain.gain.setValueAtTime(0.0001, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.01);
            gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.5);
            osc.connect(gain).connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 0.5);
        } catch (err) {
            // If audio fails, silently ignore to avoid blocking UI
            console.warn('Audio not available', err);
        }
    }
}

// Increase counter
increaseBtn.addEventListener('click', () => {
    if (count < MAX_LIMIT) {
        count++;
        updateCounter();
    }
});

// Decrease counter
decreaseBtn.addEventListener('click', () => {
    if (count > 0) {
        count--;
        updateCounter();
    }
});

// Reset counter
resetBtn.addEventListener('click', () => {
    count = 0;
    updateCounter();
});

// // Keyboard controls
// document.addEventListener('keydown', (event) => {
//     const key = event.key.toUpperCase();
    
//     // Any key increases counter (except R for reset)
//     if (key !== 'R' && key !== 'BACKSPACE' && key !== 'ESCAPE') {
//         if (count < MAX_LIMIT) {
//             count++;
//             updateCounter();
//         }
//     }
    
//     // R key or ESC key resets counter
//     if (key === 'R' || key === 'ESCAPE') {
//         count = 0;
//         updateCounter();
//     }
    
//     // Backspace decreases counter
//     if (key === 'BACKSPACE') {
//         event.preventDefault();
//         if (count > 0) {
//             count--;
//             updateCounter();
//         }
//     }
// });
// Keyboard controls
document.addEventListener('keydown', (event) => {
    const key = event.key;
    
    // Up Arrow increases counter
    if (key === 'ArrowUp') {
        event.preventDefault(); // Prevents the browser from scrolling up
        if (count < MAX_LIMIT) {
            count++;

            updateCounter();
        }
    }
    
    // Down Arrow decreases counter
    if (key === 'ArrowDown') {
        event.preventDefault(); // Prevents the browser from scrolling down
        if (count > 0) {
            count--;
            updateCounter();
        }
    }
    
    // R key or ESC key resets counter
    if (key.toUpperCase() === 'R' || key === 'Escape') {
        count = 0;
        updateCounter();
    }
});

// Update counter display and apply styling
function updateCounter() {
    counterValue.textContent = count;
    
    // Apply darker shade when count reaches 10
    if (count === MAX_LIMIT) {
        counterContainer.classList.add('counter--max-reached');
        maxLimitMessage.style.display = 'block';
        if (!playedMaxChime) {
            playMaxReachedSound();
            playedMaxChime = true;
        }
    } else {
        counterContainer.classList.remove('counter--max-reached');
        maxLimitMessage.style.display = 'none';
        playedMaxChime = false;
    }
}
