// Execute as early as possible to prevent flash of unstyled content
(function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'system';

    function applyTheme(theme) {
        if (theme === 'dark') {
            document.documentElement.setAttribute('data-theme', 'dark');
        } else if (theme === 'light') {
            document.documentElement.setAttribute('data-theme', 'light');
        } else {
            // System
            const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (prefersDark) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    }

    applyTheme(savedTheme);
})();

document.addEventListener('DOMContentLoaded', () => {
    const themeBtns = document.querySelectorAll('.theme-btn');
    const savedTheme = localStorage.getItem('theme') || 'system';

    // Set initial active state
    themeBtns.forEach(btn => {
        if (btn.getAttribute('data-theme-val') === savedTheme) {
            btn.classList.add('active');
        }
    });

    themeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const val = btn.getAttribute('data-theme-val');

            // Update active state classes
            themeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Save to localStorage
            localStorage.setItem('theme', val);

            // Apply immediately
            if (val === 'light') {
                document.documentElement.setAttribute('data-theme', 'light');
            } else if (val === 'dark') {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                // system
                const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                if (prefersDark) {
                    document.documentElement.setAttribute('data-theme', 'dark');
                } else {
                    document.documentElement.setAttribute('data-theme', 'light');
                }
            }
        });
    });

    // Listen for system preference changes (if set to system)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', e => {
        const currentTheme = localStorage.getItem('theme') || 'system';
        if (currentTheme === 'system') {
            if (e.matches) {
                document.documentElement.setAttribute('data-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-theme', 'light');
            }
        }
    });
});
