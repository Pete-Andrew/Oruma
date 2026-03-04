const words = ['Centralise', 'Standardise', 'Simplify', 'Organise', 'Control'];
let currentIndex = 0;

// DOMContentLoaded prevents the HTML loading before the js which can cause uncaught type errors and other issues. 
document.addEventListener('DOMContentLoaded', () => {

    const slot = document.getElementById('word-slot');
    const measureContainer = document.getElementById('measure-container');
    const heading = document.getElementById('heading');

    // Build hidden spans for measurement
    const measureSpans = {};
    words.forEach(word => {
        const span = document.createElement('span');
        span.className = 'font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400';
        // Match heading font size for accurate measurement
        span.style.fontSize = getComputedStyle(heading).fontSize;
        span.style.fontWeight = getComputedStyle(heading).fontWeight;
        span.textContent = word;
        measureContainer.appendChild(span);
        measureSpans[word] = span;
    });

    function getWordWidth(word) {
        // Re-sync font size in case of resize
        measureSpans[word].style.fontSize = getComputedStyle(heading).fontSize;
        return measureSpans[word].offsetWidth;
    }

    function setSlotWidth(word) {
        slot.style.width = getWordWidth(word) + 'px';
    }

    // Set initial width
    setSlotWidth(words[0]);

    function cycleWord() {
        const nextIndex = (currentIndex + 1) % words.length;
        const nextWord = words[nextIndex];

        // Get current word element
        const currentWord = slot.querySelector('.animated-word.active');

        // Create next word element
        const nextEl = document.createElement('span');
        nextEl.className = 'animated-word font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-violet-400';
        nextEl.textContent = nextWord;
        slot.appendChild(nextEl);

        // Trigger exit on current
        currentWord.classList.remove('active');
        currentWord.classList.add('exit');

        // Animate width
        setSlotWidth(nextWord);

        // Small delay so width transition starts before word appears
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                nextEl.classList.add('active');
            });
        });

        // Clean up exited word after transition
        setTimeout(() => {
            currentWord.remove();
        }, 400);

        currentIndex = nextIndex;
    }

    // Recalculate width on resize
    window.addEventListener('resize', () => {
        setSlotWidth(words[currentIndex]);
    });

    setInterval(cycleWord, 2200);
});