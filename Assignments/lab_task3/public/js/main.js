// public/js/main.js
document.addEventListener('DOMContentLoaded', () => {
    // Scroll to top functionality
    const topBtn = document.querySelector('.go-to-top');
    if(topBtn) {
        topBtn.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // Active link handling
    const path = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if(link.getAttribute('href') === path) {
            link.classList.add('active');
            link.style.fontWeight = '700';
        }
    });
});