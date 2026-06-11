// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const iconLight = document.getElementById('icon-light');
const iconDark = document.getElementById('icon-dark');
const iconSystem = document.getElementById('icon-system');

function getStoredTheme() {
    try {
        return localStorage.getItem('cv-theme') || 'system';
    } catch {
        return 'system';
    }
}

function storeTheme(theme) {
    try {
        if (theme === 'system') {
            localStorage.removeItem('cv-theme');
        } else {
            localStorage.setItem('cv-theme', theme);
        }
    } catch {
        // The selected theme still applies for the current page load.
    }
}

let currentTheme = getStoredTheme();

function updateTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && prefersDark);
    
    if (isDark) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', isDark ? '#09090b' : '#f4f4f5');

    iconLight.classList.toggle('hidden', currentTheme !== 'light');
    iconDark.classList.toggle('hidden', currentTheme !== 'dark');
    iconSystem.classList.toggle('hidden', currentTheme !== 'system');

    const themeName = currentTheme[0].toUpperCase() + currentTheme.slice(1);
    themeToggle.setAttribute('aria-label', `Change color theme. Current setting: ${themeName}`);
    themeToggle.title = `Theme: ${themeName}`;
}

updateTheme();

// Listen for system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') {
        updateTheme();
    }
});

themeToggle.addEventListener('click', () => {
    if (currentTheme === 'system') {
        currentTheme = 'light';
    } else if (currentTheme === 'light') {
        currentTheme = 'dark';
    } else {
        currentTheme = 'system';
    }
    
    storeTheme(currentTheme);
    updateTheme();
});

// Mouse-move glow effect. Hover-capable devices only; pointer updates are
// coalesced into one rAF-driven style write per frame to avoid layout thrash.
if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
    document.querySelectorAll('.spotlight-card').forEach(card => {
        let pending = null;
        let frame = 0;
        let resetTimer = 0;

        const flush = () => {
            frame = 0;
            if (!pending) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${pending.x - rect.left}px`);
            card.style.setProperty('--mouse-y', `${pending.y - rect.top}px`);
            pending = null;
        };

        card.addEventListener('mousemove', e => {
            if (resetTimer) { clearTimeout(resetTimer); resetTimer = 0; }
            pending = { x: e.clientX, y: e.clientY };
            if (!frame) frame = requestAnimationFrame(flush);
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            if (frame) { cancelAnimationFrame(frame); frame = 0; }
            pending = null;
            // The ::after glow fades out via its opacity transition; let it fade
            // in place and only park the gradient off-card once that's done, so
            // the fade isn't cut short (and a re-enter cancels the reset).
            resetTimer = setTimeout(() => {
                card.style.setProperty('--mouse-x', `-1000px`);
                card.style.setProperty('--mouse-y', `-1000px`);
            }, 300);
        });
    });
}

// Touch devices have no hover, so the emerald flourish that follows the cursor
// on desktop follows scroll instead: the job/project card currently centered in
// the viewport is marked `.active`. (Link icons are shown permanently via CSS.)
if (window.matchMedia('(hover: none)').matches) {
    const cards = [...document.querySelectorAll('.timeline-item, .project-item')];
    let active = null;
    let ticking = false;

    const update = () => {
        ticking = false;
        const mid = window.innerHeight / 2;
        let best = null;
        let bestDist = Infinity;
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > window.innerHeight) continue;
            // A card spanning the viewport midline wins outright; otherwise the
            // one whose nearest edge sits closest to the midline takes it. This
            // keeps exactly one card active, with no flicker in the gaps.
            if (rect.top <= mid && rect.bottom >= mid) { best = card; break; }
            const dist = Math.min(Math.abs(rect.top - mid), Math.abs(rect.bottom - mid));
            if (dist < bestDist) { bestDist = dist; best = card; }
        }
        if (best !== active) {
            active?.classList.remove('active');
            best?.classList.add('active');
            active = best;
        }
    };

    // Coalesce scroll/resize into one rAF-driven measurement per frame.
    const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
}

// Anti-Scraping Email Obfuscation
setTimeout(() => {
    // Construct email dynamically to hide from basic HTML scrapers
    const user = 'robert_dimitrov';
    const domain = 'me.com';
    const email = user + '@' + domain;
    
    const webEmail = document.getElementById('web-email');
    if (webEmail) webEmail.href = 'mailto:' + email;
    
    const printEmail = document.getElementById('print-email');
    if (printEmail) printEmail.textContent = email;
}, 100);
