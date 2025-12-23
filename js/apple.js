document.addEventListener('DOMContentLoaded', () => {
    // 1. Generic Fade In
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

    // 2. Sticky Scroll Logic
    const stickySection = document.querySelector('.sticky-scroll-container');
    const cards = document.querySelectorAll('.info-card');

    if (stickySection && cards.length > 0) {
        window.addEventListener('scroll', () => {
            const rect = stickySection.getBoundingClientRect();
            // We want the interaction to happen while the section is passing through the viewport
            // The section is 300vh tall.
            // When rect.top is 0, we are at start.
            // When rect.top is -200vh, we are at end (assuming 100vh sticky content).

            const viewportHeight = window.innerHeight;
            const travelDistance = rect.height - viewportHeight;
            const progressPx = -rect.top;

            let progress = progressPx / travelDistance;

            // Clamp progress between 0 and slightly less than 1 to ensure last card stays
            progress = Math.max(0, Math.min(progress, 0.99));

            const totalCards = cards.length;
            const activeIndex = Math.floor(progress * totalCards);

            cards.forEach((card, index) => {
                if (index === activeIndex) {
                    card.classList.add('active');
                    card.classList.remove('inactive');
                } else if (index < activeIndex) {
                    card.classList.add('inactive');
                    card.classList.remove('active');
                } else {
                    card.classList.remove('active');
                    card.classList.remove('inactive');
                }
            });
        });
    }
});
