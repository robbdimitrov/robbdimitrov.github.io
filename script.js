// Initialize Lucide icons
lucide.createIcons();

// Theme Toggle Logic
const themeToggle = document.getElementById('theme-toggle');
const html = document.documentElement;

// Check local storage or system preference
const savedTheme = localStorage.getItem('cv-theme');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

if (savedTheme === 'light' || (!savedTheme && !prefersDark)) {
    html.classList.remove('dark');
} else {
    html.classList.add('dark');
}

themeToggle.addEventListener('click', () => {
    if (html.classList.contains('dark')) {
        html.classList.remove('dark');
        localStorage.setItem('cv-theme', 'light');
    } else {
        html.classList.add('dark');
        localStorage.setItem('cv-theme', 'dark');
    }
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
