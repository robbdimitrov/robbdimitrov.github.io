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

        const move = (x, y) => {
            const rect = card.getBoundingClientRect();
            card.style.setProperty('--mouse-x', `${x - rect.left}px`);
            card.style.setProperty('--mouse-y', `${y - rect.top}px`);
        };

        const flush = () => {
            frame = 0;
            if (!pending) return;
            move(pending.x, pending.y);
            pending = null;
        };

        // Position the glow at the entry point up front so it fades in where the
        // cursor actually is, not at a stale spot from a previous hover.
        card.addEventListener('mouseenter', e => move(e.clientX, e.clientY), { passive: true });

        card.addEventListener('mousemove', e => {
            pending = { x: e.clientX, y: e.clientY };
            if (!frame) frame = requestAnimationFrame(flush);
        }, { passive: true });

        // No position reset on leave: the CSS opacity transition fades the glow
        // out in place. Just drop any queued position write.
        card.addEventListener('mouseleave', () => {
            if (frame) { cancelAnimationFrame(frame); frame = 0; }
            pending = null;
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
        const vh = window.innerHeight;
        const mid = vh / 2;
        let best = null;
        let bestDist = Infinity;
        for (const card of cards) {
            const rect = card.getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > vh) continue;
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

// Storefront Dual-Direction Sticky Sidebar
const sidebar = document.getElementById('profile-column');
if (sidebar) {
    let isSticking = ''; // 'top', 'bottom', or ''
    let lastScrollY = window.scrollY;

    let viewportHeight = window.innerHeight;
    let sidebarHeight = sidebar.getBoundingClientRect().height;
    const main = sidebar.parentElement;
    let mainOffsetHeight = main.getBoundingClientRect().height;

    const updateDimensions = () => {
        viewportHeight = window.innerHeight;
        sidebarHeight = sidebar.getBoundingClientRect().height;
        mainOffsetHeight = main.getBoundingClientRect().height;
    };

    const updatePosition = (isInit = false) => {
        if (window.innerWidth < 1024) {
            sidebar.style.position = '';
            sidebar.style.top = '';
            sidebar.style.bottom = '';
            return;
        }

        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;

        const rect = sidebar.getBoundingClientRect();
        const mainRect = main.getBoundingClientRect();
        
        const offsetTop = 48; // 3rem (top-12)
        const offsetBottom = 48; // 3rem (pb-12)

        // If sidebar is shorter than viewport, it behaves like a normal top-sticky element
        if (sidebarHeight + offsetTop + offsetBottom <= viewportHeight) {
            sidebar.style.position = 'sticky';
            sidebar.style.top = `${offsetTop}px`;
            sidebar.style.bottom = '';
            return;
        }

        if (isInit) {
            // Prevent overflowing the bottom of the grid on refresh
            // 96px accounts for the lg:p-12 (48px top + 48px bottom padding)
            const maxTop = mainOffsetHeight - sidebarHeight - 96;
            let initialTop = scrollY;
            if (initialTop > maxTop) initialTop = maxTop;
            if (initialTop < 0) initialTop = 0;
            sidebar.style.position = 'relative';
            sidebar.style.top = `${initialTop}px`;
            sidebar.style.bottom = '';
            return;
        }

        // Taller than viewport logic (Storefront gallery behavior)
        if (scrollDelta > 0) {
            // Scrolling DOWN
            if (isSticking === 'top') {
                isSticking = '';
                sidebar.style.position = 'relative';
                sidebar.style.top = `${rect.top - mainRect.top - 48}px`; 
                sidebar.style.bottom = '';
            }

            if (isSticking !== 'bottom' && rect.bottom <= viewportHeight - offsetBottom) {
                isSticking = 'bottom';
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${viewportHeight - sidebarHeight - offsetBottom}px`;
                sidebar.style.bottom = '';
            }
        } else if (scrollDelta < 0) {
            // Scrolling UP
            if (isSticking === 'bottom') {
                isSticking = '';
                sidebar.style.position = 'relative';
                sidebar.style.top = `${rect.top - mainRect.top - 48}px`;
                sidebar.style.bottom = '';
            }

            if (isSticking !== 'top' && rect.top >= offsetTop) {
                isSticking = 'top';
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${offsetTop}px`;
                sidebar.style.bottom = '';
            }
        }
    };

    // Run synchronously to prevent 1-frame overshoot/jitter during native scrolling
    window.addEventListener('scroll', () => updatePosition(false), { passive: true });
    
    // Use ResizeObserver for bulletproof dimension tracking
    const ro = new ResizeObserver(() => {
        updateDimensions();
        updatePosition(true);
    });
    ro.observe(main);
    ro.observe(sidebar);
    
    // Trigger once on load
    updateDimensions();
    updatePosition(true);
}


