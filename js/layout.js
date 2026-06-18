// Shared site chrome: injects the nav and footer on every page so they live in
// one place instead of being copy-pasted into each HTML file. Also adds the
// back-to-top button site-wide. Requires theme.js to be loaded first (for
// toggleTheme + updateThemeIcon).
(function () {
    var NAV_LINKS = [
        ['index.html', 'Home'],
        ['projects.html', 'Projects'],
        ['about.html', 'About'],
        ['resume.html', 'Resume'],
        ['contact.html', 'Contact'],
        ['blog.html', 'Blog'],
        ['uses.html', 'Uses']
    ];

    // Pages that should highlight a nav item other than themselves.
    var ACTIVE_ALIASES = { 'apple-developer-fee.html': 'blog.html' };

    var GITHUB_URL = 'https://github.com/MWM1107';
    var LINKEDIN_URL = 'https://www.linkedin.com/in/kevin-struna/';

    var GITHUB_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2A10 10 0 0 0 2 12C2 16.42 4.87 20.17 8.84 21.5C9.34 21.58 9.5 21.27 9.5 21C9.5 20.77 9.5 20.14 9.5 19.31C6.73 19.91 6.14 17.97 6.14 17.97C5.68 16.81 5.03 16.5 5.03 16.5C4.12 15.88 5.1 15.9 5.1 15.9C6.1 15.97 6.63 16.93 6.63 16.93C7.5 18.45 8.97 18 9.54 17.76C9.63 17.11 9.89 16.67 10.17 16.42C7.95 16.17 5.62 15.31 5.62 11.5C5.62 10.39 6 9.5 6.65 8.79C6.55 8.54 6.2 7.5 6.75 6.15C6.75 6.15 7.59 5.88 9.5 7.17C10.29 6.95 11.15 6.84 12 6.84C12.85 6.84 13.71 6.95 14.5 7.17C16.41 5.88 17.25 6.15 17.25 6.15C17.8 7.5 17.45 8.54 17.35 8.79C18 9.5 18.38 10.39 18.38 11.5C18.38 15.32 16.04 16.16 13.81 16.41C14.17 16.72 14.5 17.33 14.5 18.26C14.5 19.6 14.5 20.68 14.5 21C14.5 21.27 14.66 21.59 15.17 21.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2Z"/></svg>';
    var LINKEDIN_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M19 3A2 2 0 0 1 21 5V19A2 2 0 0 1 19 21H5A2 2 0 0 1 3 19V5A2 2 0 0 1 5 3H19M18.5 18.5V13.2A3.26 3.26 0 0 0 15.24 9.94C14.39 9.94 13.4 10.46 12.92 11.24V10.13H10.13V18.5H12.92V13.57C12.92 12.8 13.54 12.17 14.31 12.17A1.4 1.4 0 0 1 15.71 13.57V18.5H18.5M6.88 8.56A1.68 1.68 0 0 0 8.56 6.88C8.56 5.95 7.81 5.19 6.88 5.19A1.69 1.69 0 0 0 5.19 6.88C5.19 7.81 5.95 8.56 6.88 8.56M8.27 18.5V10.13H5.5V18.5H8.27Z"/></svg>';
    var TOP_SVG = '<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="18 15 12 9 6 15"></polyline></svg>';

    function currentPage() {
        var file = location.pathname.split('/').pop();
        return file === '' ? 'index.html' : file;
    }

    function buildNav() {
        var page = currentPage();
        var active = ACTIVE_ALIASES[page] || page;
        var html = '<nav aria-label="Primary navigation">';
        NAV_LINKS.forEach(function (link) {
            var cls = link[0] === active ? ' class="active"' : '';
            html += '<a href="' + link[0] + '"' + cls + '>' + link[1] + '</a>';
        });
        html += '<span class="sep">|</span>';
        html += '<button id="theme-toggle" onclick="toggleTheme()" class="theme-toggle-btn" aria-label="Toggle dark mode"></button>';
        html += '</nav>';
        return html;
    }

    function buildFooter() {
        var html = '<footer>';
        html += '<div class="footer-socials">';
        html += '<a href="' + GITHUB_URL + '" target="_blank" rel="noopener noreferrer" aria-label="GitHub">' + GITHUB_SVG + '</a>';
        html += '<a href="' + LINKEDIN_URL + '" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">' + LINKEDIN_SVG + '</a>';
        html += '</div>';
        html += '<p>&copy; 2026 Kevin Struna. All rights reserved.</p>';
        html += '<div class="footer-links">';
        NAV_LINKS.forEach(function (link, i) {
            if (i) html += '<span class="sep">|</span>';
            html += '<a href="' + link[0] + '">' + link[1] + '</a>';
        });
        html += '</div>';
        html += '</footer>';
        return html;
    }

    function addSkipLink() {
        var main = document.querySelector('main');
        if (!main) return;
        if (!main.id) main.id = 'main-content';
        if (!main.hasAttribute('tabindex')) main.setAttribute('tabindex', '-1');
        var skip = document.createElement('a');
        skip.href = '#' + main.id;
        skip.className = 'skip-link';
        skip.textContent = 'Skip to main content';
        document.body.insertBefore(skip, document.body.firstChild);
    }

    function addBackToTop() {
        var btn = document.createElement('button');
        btn.id = 'back-to-top';
        btn.setAttribute('aria-label', 'Back to top');
        btn.title = 'Back to top';
        btn.innerHTML = TOP_SVG;
        document.body.appendChild(btn);
        window.addEventListener('scroll', function () {
            btn.classList.toggle('visible', window.scrollY > 300);
        }, { passive: true });
        btn.addEventListener('click', function () {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    function mount() {
        addSkipLink();
        var navHost = document.getElementById('site-nav');
        if (navHost) navHost.outerHTML = buildNav();
        var footHost = document.getElementById('site-footer');
        if (footHost) footHost.outerHTML = buildFooter();
        addBackToTop();
        // Populate the theme toggle icon now that the button exists.
        if (typeof updateThemeIcon === 'function') updateThemeIcon();
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', mount);
    } else {
        mount();
    }
})();
