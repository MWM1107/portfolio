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
