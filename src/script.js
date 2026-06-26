// --- Theme Toggle Logic ---
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const metaThemeColor = document.querySelector('meta[name="theme-color"]');
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
        // Storage unavailable (e.g., incognito), fallback to current session
    }
}

let currentTheme = getStoredTheme();

function updateTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = currentTheme === 'dark' || (currentTheme === 'system' && prefersDark);
    
    html.classList.toggle('dark', isDark);
    if (metaThemeColor) metaThemeColor.setAttribute('content', isDark ? '#09090b' : '#f4f4f5');

    iconLight.classList.toggle('hidden', currentTheme !== 'light');
    iconDark.classList.toggle('hidden', currentTheme !== 'dark');
    iconSystem.classList.toggle('hidden', currentTheme !== 'system');

    const themeName = currentTheme.charAt(0).toUpperCase() + currentTheme.slice(1);
    themeToggle.setAttribute('aria-label', `Change color theme. Current setting: ${themeName}`);
    themeToggle.title = `Theme: ${themeName}`;
}

updateTheme();

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (currentTheme === 'system') updateTheme();
});

themeToggle.addEventListener('click', () => {
    const transitions = { 'system': 'light', 'light': 'dark', 'dark': 'system' };
    currentTheme = transitions[currentTheme];
    storeTheme(currentTheme);
    updateTheme();
});


// --- Mouse-move Glow Effect (Desktop) ---
// Coalesces pointer updates into one rAF-driven style write per frame.
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

        card.addEventListener('mouseenter', e => move(e.clientX, e.clientY), { passive: true });
        card.addEventListener('mousemove', e => {
            pending = { x: e.clientX, y: e.clientY };
            if (!frame) frame = requestAnimationFrame(flush);
        }, { passive: true });

        card.addEventListener('mouseleave', () => {
            if (frame) { cancelAnimationFrame(frame); frame = 0; }
            pending = null;
        });
    });
}


// --- Scroll-driven Active State (Touch) ---
// Highlights the card closest to the vertical center of the screen.
if (window.matchMedia('(hover: none)').matches) {
    const cards = document.querySelectorAll('.timeline-item, .project-item');
    let active = null;
    let ticking = false;

    const update = () => {
        ticking = false;
        const vh = window.innerHeight;
        const mid = vh / 2;
        let best = null;
        let bestDist = Infinity;

        for (let i = 0; i < cards.length; i++) {
            const rect = cards[i].getBoundingClientRect();
            if (rect.bottom < 0 || rect.top > vh) continue;

            if (rect.top <= mid && rect.bottom >= mid) { 
                best = cards[i]; 
                break; 
            }
            
            const dist = Math.min(Math.abs(rect.top - mid), Math.abs(rect.bottom - mid));
            if (dist < bestDist) { 
                bestDist = dist; 
                best = cards[i]; 
            }
        }

        if (best !== active) {
            if (active) active.classList.remove('active');
            if (best) best.classList.add('active');
            active = best;
        }
    };

    const onScroll = () => {
        if (!ticking) { ticking = true; requestAnimationFrame(update); }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    update();
}


// --- Anti-Scraping Email Obfuscation ---
setTimeout(() => {
    // Construct dynamically to evade static regex scrapers
    const user = 'robert_dimitrov';
    const domain = 'me.com';
    const email = user + '@' + domain;
    
    const webEmail = document.getElementById('web-email');
    const printEmail = document.getElementById('print-email');
    
    if (webEmail) webEmail.href = `mailto:${email}`;
    if (printEmail) printEmail.textContent = email;
}, 100);


// --- Storefront Dual-Direction Sticky Sidebar ---
const sidebar = document.getElementById('profile-column');
if (sidebar) {
    let isSticking = ''; // 'top', 'bottom', or ''
    let lastScrollY = window.scrollY;

    const main = sidebar.parentElement;
    const offsetTop = 48; // 3rem (top-12)
    const offsetBottom = 48; // 3rem (pb-12)

    const unstick = (rect) => {
        isSticking = '';
        sidebar.style.position = 'relative';
        sidebar.style.top = `${rect.top - main.getBoundingClientRect().top - offsetTop}px`;
    };

    const updatePosition = (isInit = false) => {
        if (window.innerWidth < 1024) {
            if (sidebar.style.position) {
                sidebar.style.position = '';
                sidebar.style.top = '';
            }
            return;
        }

        const scrollY = window.scrollY;
        const scrollDelta = scrollY - lastScrollY;
        lastScrollY = scrollY;

        const viewportHeight = window.innerHeight;
        const sidebarHeight = sidebar.getBoundingClientRect().height;

        // If sidebar fits within viewport, act as a standard top-sticky element
        if (sidebarHeight + offsetTop + offsetBottom <= viewportHeight) {
            if (isSticking !== 'top') {
                isSticking = 'top';
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${offsetTop}px`;
            }
            return;
        }

        // Initialize relative scroll state on load/refresh
        if (isInit) {
            const maxTop = main.getBoundingClientRect().height - sidebarHeight - (offsetTop * 2);
            let initialTop = scrollY;
            
            if (initialTop > maxTop) initialTop = maxTop;
            if (initialTop < 0) initialTop = 0;
            
            isSticking = '';
            sidebar.style.position = 'relative';
            sidebar.style.top = `${initialTop}px`;
            return;
        }

        if (scrollDelta === 0) return;
        const rect = sidebar.getBoundingClientRect();

        if (scrollDelta > 0) {
            // Scrolling DOWN
            if (isSticking === 'top') unstick(rect);

            if (isSticking !== 'bottom' && rect.bottom <= viewportHeight - offsetBottom) {
                isSticking = 'bottom';
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${viewportHeight - sidebarHeight - offsetBottom}px`;
            }
        } else {
            // Scrolling UP
            if (isSticking === 'bottom') unstick(rect);

            if (isSticking !== 'top' && rect.top >= offsetTop) {
                isSticking = 'top';
                sidebar.style.position = 'sticky';
                sidebar.style.top = `${offsetTop}px`;
            }
        }
    };

    // Run synchronously to prevent 1-frame overshoot/jitter during native scrolling
    window.addEventListener('scroll', () => updatePosition(false), { passive: true });
    window.addEventListener('resize', () => requestAnimationFrame(() => updatePosition(true)), { passive: true });
    
    updatePosition(true);
}
