// Apply saved theme immediately to prevent flash of wrong theme
(function () {
    var saved = localStorage.getItem('theme');
    var theme = saved || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
})();

var MOON_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>';
var SUN_SVG  = '<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>';

function isDarkMode() {
    var explicit = document.documentElement.getAttribute('data-theme');
    if (explicit === 'dark') return true;
    if (explicit === 'light') return false;
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
}

function updateThemeIcon() {
    var btn = document.getElementById('theme-toggle');
    if (!btn) return;
    var dark = isDarkMode();
    btn.innerHTML = dark ? SUN_SVG : MOON_SVG;
    btn.setAttribute('aria-label', dark ? 'Switch to light mode' : 'Switch to dark mode');
}

// The two media-scoped <meta name="theme-color"> tags follow the OS on their
// own; this re-points both at the active theme so the mobile address bar
// also tracks a manual toggle that overrides the OS preference.
function updateThemeColor() {
    var color = isDarkMode() ? '#000000' : '#f5f5f7';
    document.querySelectorAll('meta[name="theme-color"]').forEach(function (m) {
        m.setAttribute('content', color);
    });
}

function toggleTheme() {
    var newTheme = isDarkMode() ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    updateThemeIcon();
    updateThemeColor();
}

document.addEventListener('DOMContentLoaded', updateThemeIcon);
updateThemeColor(); // the theme-color metas are parsed before this script (see chrome:head order)

// Keep data-theme in sync if the OS preference changes and no manual override is saved
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    if (!localStorage.getItem('theme')) {
        document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
        updateThemeIcon();
        updateThemeColor();
    }
});
