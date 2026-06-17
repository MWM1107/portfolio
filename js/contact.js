// Contact page: submit the form via fetch and swap in a success panel.
(function () {
    var form = document.getElementById('contact-form');
    if (!form) return;

    function showError(msg) {
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = false;
        btn.textContent = 'Send Message';
        var el = form.querySelector('.form-error');
        if (!el) {
            el = document.createElement('p');
            el.className = 'form-error';
            el.style.cssText = 'color:#ff3b30;font-size:0.9rem;text-align:center;margin:12px 0 0;';
            form.appendChild(el);
        }
        el.textContent = msg;
    }

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        var btn = form.querySelector('button[type="submit"]');
        btn.disabled = true;
        btn.textContent = 'Sending…';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(function (res) {
            if (res.ok) {
                form.style.display = 'none';
                document.getElementById('form-success').style.display = 'block';
            } else {
                showError('Something went wrong. Please try again or email me directly.');
            }
        })
        .catch(function () {
            showError('Network error. Please check your connection and try again.');
        });
    });
})();
