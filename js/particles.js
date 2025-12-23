const mouse = { x: null, y: null };

window.addEventListener('mousemove', (e) => {
    mouse.x = e.clientX;
    mouse.y = e.clientY;
});

class Particle {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
        this.size = Math.random() * 2 + 1; // Small dots (1px - 3px)
        this.density = (Math.random() * 30) + 1;
        this.color = this.getRandomColor();
        this.vx = (Math.random() - 0.5) * 0.5; // Constant separate velocity x
        this.vy = (Math.random() - 0.5) * 0.5; // Constant separate velocity y
    }

    getRandomColor() {
        const colors = [
            'rgba(255, 255, 255, 0.9)',
            'rgba(41, 151, 255, 0.9)',
            'rgba(191, 90, 242, 0.9)',
            'rgba(255, 99, 71, 0.9)'
        ];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    update() {
        // Continuous gentle background drift
        this.baseX += this.vx;
        this.baseY += this.vy;

        // Wrap/Reset base position so they don't drift off screen forever
        if (this.baseX < -50) this.baseX = this.canvas.width + 50;
        if (this.baseX > this.canvas.width + 50) this.baseX = -50;
        if (this.baseY < -50) this.baseY = this.canvas.height + 50;
        if (this.baseY > this.canvas.height + 50) this.baseY = -50;

        // Mouse Interaction
        let startDrifting = true;

        if (mouse.x != null) {
            let dx = mouse.x - this.x;
            let dy = mouse.y - this.y;
            let distance = Math.sqrt(dx * dx + dy * dy);
            const maxDistance = 200;

            if (distance < maxDistance) {
                startDrifting = false;
                // Determine direction to move
                const forceDirectionX = dx / distance;
                const forceDirectionY = dy / distance;
                const force = (maxDistance - distance) / maxDistance;

                // Attraction force
                const directionX = forceDirectionX * force * this.density * 0.5;
                const directionY = forceDirectionY * force * this.density * 0.5;

                this.x += directionX;
                this.y += directionY;
            }
        }

        if (startDrifting) {
            // Return to original position (elastic effect) smoothly
            if (this.x !== this.baseX) {
                let dx = this.x - this.baseX;
                this.x -= dx / 20;
            }
            if (this.y !== this.baseY) {
                let dy = this.y - this.baseY;
                this.y -= dy / 20;
            }
        }
    }

    draw() {
        this.ctx.beginPath();
        this.ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);

        // Strong Glow Effect
        this.ctx.shadowBlur = 15;
        this.ctx.shadowColor = this.color;

        this.ctx.fillStyle = this.color;
        this.ctx.fill();
        this.ctx.shadowBlur = 0;
    }
}

function initParticles() {
    const canvas = document.getElementById('bg-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let particles = [];
    // Increase count for a dense field
    const particleCount = 100;

    function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    window.addEventListener('resize', resize);
    resize();

    // Create particles
    for (let i = 0; i < particleCount; i++) {
        particles.push(new Particle(canvas, ctx));
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        particles.forEach(p => {
            p.update();
            p.draw();
        });

        requestAnimationFrame(animate);
    }

    animate();
}

// Init on load
document.addEventListener('DOMContentLoaded', initParticles);
