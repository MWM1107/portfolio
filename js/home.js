// Homepage: hero depth parallax. As the page scrolls, each hero layer
// drifts down at its own rate (photo deepest, socials shallowest) and the
// whole group fades, so the hero recedes in z rather than just sliding off.
// Transform + opacity only, rAF-throttled, and skipped entirely for
// reduced-motion users. The layers' entrance animation (hero-rise in
// layout.css) uses `backwards` fill, so once it ends these inline
// transforms take over cleanly.
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    var hero = document.querySelector('.hero-section');
    if (!hero) return;

    var layers = [
        [hero.querySelector('.hero-photo'), 0.18],
        [hero.querySelector('h1'), 0.12],
        [hero.querySelector('.tagline'), 0.07],
        [hero.querySelector('.hero-socials'), 0.03]
    ].filter(function (layer) { return layer[0]; });

    // Each layer permanently lives at translateZ(--rest-z) (see the hero
    // depth block in layout.css); capture it so the scroll transform
    // composes with the depth instead of flattening the layer back to z=0.
    layers.forEach(function (layer) {
        layer.push(getComputedStyle(layer[0]).getPropertyValue('--rest-z').trim() || '0px');
    });

    var ticking = false;
    var wasPast = false;

    function apply() {
        ticking = false;
        var y = window.scrollY;
        var bottom = hero.offsetTop + hero.offsetHeight;
        // Once the hero has fully scrolled away there's nothing to see;
        // pin the final state once and skip the per-frame work.
        var past = y > bottom;
        if (past && wasPast) return;
        wasPast = past;
        var fade = Math.min(1, Math.max(0, 1 - y / (bottom * 0.85)));
        layers.forEach(function (layer) {
            layer[0].style.transform =
                'translateY(' + (y * layer[1]).toFixed(1) + 'px) translateZ(' + layer[2] + ')';
            layer[0].style.opacity = fade.toFixed(3);
        });
    }

    window.addEventListener('scroll', function () {
        if (!ticking) {
            ticking = true;
            requestAnimationFrame(apply);
        }
    }, { passive: true });
})();

// Homepage: hero pointer tilt. The hero's layers rest on different
// z-planes (--rest-z in layout.css, preserve-3d on the section), so
// rotating the card a few degrees toward the cursor makes the planes
// shear against each other through real perspective projection; that
// shear is the depth cue, not the rotation itself. Hover-capable
// fine-pointer devices only, and never under reduced motion.
(function () {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    var hero = document.querySelector('.hero-section');
    if (!hero) return;

    var MAX_DEG = 7;
    var frame = null;
    var lastEvent = null;

    hero.addEventListener('pointermove', function (event) {
        lastEvent = event;
        if (frame) return;
        frame = requestAnimationFrame(function () {
            frame = null;
            var rect = hero.getBoundingClientRect();
            var dx = (lastEvent.clientX - rect.left) / rect.width - 0.5;
            var dy = (lastEvent.clientY - rect.top) / rect.height - 0.5;
            hero.style.transform =
                'perspective(1200px)' +
                ' rotateX(' + (-dy * MAX_DEG).toFixed(2) + 'deg)' +
                ' rotateY(' + (dx * MAX_DEG).toFixed(2) + 'deg)';
        });
    });
    hero.addEventListener('pointerleave', function () {
        if (frame) { cancelAnimationFrame(frame); frame = null; }
        hero.style.transform = '';
    });
})();

// Homepage: pause/resume the auto-scrolling app catalog carousel.
(function () {
    var paused = false;
    window.toggleCarousel = function () {
        var track = document.querySelector('.carousel-track');
        var btn = document.getElementById('carousel-pause-btn');
        var icon = document.getElementById('carousel-btn-icon');
        paused = !paused;
        track.style.animationPlayState = paused ? 'paused' : 'running';
        btn.setAttribute('aria-label', paused ? 'Resume auto-scroll' : 'Pause auto-scroll');
        icon.innerHTML = paused
            ? '<polygon points="5 3 19 12 5 21 5 3"/>'
            : '<rect x="6" y="4" width="4" height="16"/><rect x="14" y="4" width="4" height="16"/>';
    };
})();
