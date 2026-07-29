const betaLinks = {
    'stock-market-sim': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luL1Jhc0p6SFlY',
    'rogue-roll': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luL011SnBOamNt',
    'kodou': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luL1IxRGU0R1pE',
    'type-kana': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luLzcxZkNuNmdt',
    'wordly': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luL2d4ZEI1NEg5',
    'idea-vault': 'aHR0cHM6Ly90ZXN0ZmxpZ2h0LmFwcGxlLmNvbS9qb2luL25RM245eEpk'
};

let currentBetaApp = null;
let turnstileWidgetId = null;

function openBetaModal(appId) {
    currentBetaApp = appId;
    const modal = document.getElementById('beta-modal');
    modal.classList.add('active');
    document.body.style.overflow = 'hidden'; // Prevent background scrolling

    // Reset or render Turnstile
    const turnstileContainer = document.getElementById('turnstile-container');
    if (turnstileWidgetId !== null) {
        // Reset the widget if it was already rendered
        turnstile.reset(turnstileWidgetId);
    } else {
        // Render Turnstile widget for the first time
        turnstileWidgetId = turnstile.render(turnstileContainer, {
            sitekey: '0x4AAAAAAEBJcFPB6QoWdFzg',
            callback: function(token) {
                onTurnstileSuccess(token);
            }
        });
    }
}

function closeBetaModal() {
    const modal = document.getElementById('beta-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    currentBetaApp = null;
    
    // Reset modal content
    const modalContent = document.getElementById('beta-modal-content');
    modalContent.style.display = 'block';
    const successMsg = document.getElementById('beta-success-msg');
    successMsg.style.display = 'none';
}

function onTurnstileSuccess(token) {
    if (currentBetaApp && betaLinks[currentBetaApp]) {
        // Decode the base64 URL
        const decodedUrl = atob(betaLinks[currentBetaApp]);
        
        // Hide the turnstile widget and show success message
        const modalContent = document.getElementById('beta-modal-content');
        modalContent.style.display = 'none';
        
        const successMsg = document.getElementById('beta-success-msg');
        successMsg.style.display = 'block';
        
        // Wait a brief moment so the user sees the success state, then redirect
        setTimeout(() => {
            window.location.href = decodedUrl;
        }, 1200);
    }
}

// Close modal when clicking outside the box
window.addEventListener('click', (e) => {
    const modal = document.getElementById('beta-modal');
    if (e.target === modal) {
        closeBetaModal();
    }
});
