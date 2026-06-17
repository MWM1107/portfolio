// Projects page: step the per-app screenshot carousels left/right, wrapping at the ends.
(function () {
    window.scrollScreenshots = function (trackId, dir) {
        var track = document.getElementById(trackId);
        var img = track.querySelector('img');
        var slideWidth = img.getBoundingClientRect().width + 10;
        var maxScroll = track.scrollWidth - track.clientWidth;

        if (dir > 0 && track.scrollLeft >= maxScroll - 1) {
            track.scrollLeft = 0;
        } else if (dir < 0 && track.scrollLeft <= 1) {
            track.scrollLeft = maxScroll;
        } else {
            track.scrollBy({ left: dir * slideWidth, behavior: 'smooth' });
        }
    };
})();
