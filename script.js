// Initialize Lucide icons
lucide.createIcons();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;
const iconLight = document.getElementById('icon-light');
const iconDark = document.getElementById('icon-dark');
const iconSystem = document.getElementById('icon-system');

let currentTheme = localStorage.getItem('cv-theme') || 'system';

function updateTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    if (currentTheme === 'dark' || (currentTheme === 'system' && prefersDark)) {
        html.classList.add('dark');
    } else {
        html.classList.remove('dark');
    }

    iconLight.classList.toggle('hidden', currentTheme !== 'light');
    iconDark.classList.toggle('hidden', currentTheme !== 'dark');
    iconSystem.classList.toggle('hidden', currentTheme !== 'system');
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
    
    if (currentTheme === 'system') {
        localStorage.removeItem('cv-theme');
    } else {
        localStorage.setItem('cv-theme', currentTheme);
    }
    updateTheme();
});

// Mouse Move Glow Effect for Bento Cards
document.querySelectorAll('.spotlight-card').forEach(card => {
    card.addEventListener('mousemove', e => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);
    });
    
    // Reset on mouse leave so glow doesn't get stuck on the edge
    card.addEventListener('mouseleave', () => {
        card.style.setProperty('--mouse-x', `-1000px`);
        card.style.setProperty('--mouse-y', `-1000px`);
    });
});
