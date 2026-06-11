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

        const flush = () => {
            frame = 0;
            if (!pending) return;
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${pending.x - rect.left}px`);
            card.style.setProperty('--mouse-y', `${pending.y - rect.top}px`);
            pending = null;
        };

        card.addEventListener('mousemove', e => {
            pending = { x: e.clientX, y: e.clientY };
            if (!frame) frame = requestAnimationFrame(flush);
        }, { passive: true });

        // Reset on mouse leave so glow doesn't get stuck on the edge.
        card.addEventListener('mouseleave', () => {
            if (frame) { cancelAnimationFrame(frame); frame = 0; }
            pending = null;
            card.style.setProperty('--mouse-x', `-1000px`);
            card.style.setProperty('--mouse-y', `-1000px`);
        });
    });
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
