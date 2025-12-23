document.addEventListener('DOMContentLoaded', () => {

    // --- 1. Sticky Storytelling Observer ---
    const observerOptions = {
        root: null,
        rootMargin: '-10% 0px -10% 0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            } else {
                entry.target.classList.remove('active');
            }
        });
    }, observerOptions);

    const scrollItems = document.querySelectorAll('.scroll-item');
    scrollItems.forEach(el => observer.observe(el));


    // --- 2. Hero Scatter Animation ---
    const heroSection = document.querySelector('.hero-container');
    const heroSticky = document.querySelector('.hero-sticky');
    const heroTitle = document.getElementById('hero-title');
    const heroDesc = document.querySelector('.hero-desc');
    const heroSub = document.querySelector('.hero-sub');

    if (heroSection && heroTitle) {

        // Split text into letters
        const text = heroTitle.textContent;
        heroTitle.textContent = '';
        heroTitle.style.perspective = '1000px'; // Enable 3D space

        const chars = [];

        text.split('').forEach((char) => {
            const span = document.createElement('span');
            span.textContent = char;
            span.classList.add('char-span');

            if (char === ' ') {
                span.classList.add('space-span');
            }

            // Assign random scatter trajectories
            // Range: -500 to 500 px for X and Y
            const xDir = (Math.random() - 0.5) * 2000;
            const yDir = (Math.random() - 0.5) * 1500 - 500; // Bias slightly upwards
            const zDir = Math.random() * 1000; // Zooming towards screen
            const rot = (Math.random() - 0.5) * 360;

            span.dataset.x = xDir;
            span.dataset.y = yDir;
            span.dataset.z = zDir;
            span.dataset.r = rot;

            heroTitle.appendChild(span);
            chars.push(span);
        });

        // Scroll Handler
        window.addEventListener('scroll', () => {
            const rect = heroSection.getBoundingClientRect();
            const viewportHeight = window.innerHeight;

            // Calculate progress: 0 when top is at top, 1 when bottom reaches top
            // Actually, we want animation to finish before the section is done.

            const startOffset = 0;
            const endOffset = rect.height - viewportHeight;

            // Current scroll position relative to the section start
            const scrollY = -rect.top;

            let progress = Math.max(0, Math.min(1, scrollY / endOffset));

            // Ease the progress for smoother feel? Linear is usually fine for scroll-linked.
            // Let's modify the curve slightly x^2
            const easedProgress = progress * progress;

            if (rect.top <= 0 && rect.bottom >= 0) {
                // Animate Letters
                chars.forEach(span => {
                    const x = parseFloat(span.dataset.x) * easedProgress;
                    const y = parseFloat(span.dataset.y) * easedProgress;
                    const z = parseFloat(span.dataset.z) * easedProgress;
                    const r = parseFloat(span.dataset.r) * easedProgress;
                    const opacity = 1 - (easedProgress * 1.5); // Fade out faster

                    // Apply Transform
                    span.style.transform = `translate3d(${x}px, ${y}px, ${z}px) rotate(${r}deg)`;
                    span.style.opacity = Math.max(0, opacity);
                });

                // Fade out other elements quickly
                if (heroDesc) heroDesc.style.opacity = 1 - (progress * 5);
                if (heroSub) heroSub.style.opacity = 1 - (progress * 5);
            }
        });
    }
});
