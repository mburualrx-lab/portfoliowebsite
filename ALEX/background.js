const colors = [
    '113, 183, 255',
    '160, 118, 255',
    '86, 230, 215'
];
const particles = [];
let canvas;
let ctx;

function resizeCanvas() {
    if (!canvas || !ctx) return;
    const dpr = window.devicePixelRatio || 1;
    const width = window.innerWidth;
    const height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + 'px';
    canvas.style.height = height + 'px';
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
}

class Particle {
    constructor() {
        this.reset();
    }

    reset() {
        this.x = Math.random() * window.innerWidth;
        this.y = Math.random() * window.innerHeight;
        this.size = 8 + Math.random() * 16;
        this.speed = 0.2 + Math.random() * 0.8;
        this.angle = Math.random() * Math.PI * 2;
        this.color = colors[Math.floor(Math.random() * colors.length)];
        this.alpha = 0.3 + Math.random() * 0.4;
        this.drift = 0.5 + Math.random() * 1.5;
        this.osc = Math.random() * 0.02 + 0.02;
    }

    update() {
        this.y -= this.speed;
        this.x += Math.sin(this.angle) * this.drift;
        this.angle += this.osc;
        if (this.y + this.size < 0 || this.x < -50 || this.x > window.innerWidth + 50) {
            this.reset();
            this.y = window.innerHeight + this.size;
        }
    }

    draw() {
        if (!ctx) return;
        const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.size);
        gradient.addColorStop(0, `rgba(${this.color}, ${this.alpha.toFixed(2)})`);
        gradient.addColorStop(0.6, `rgba(${this.color}, ${(this.alpha * 0.4).toFixed(2)})`);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

function createParticles() {
    particles.length = 0;
    const count = Math.max(30, Math.round(window.innerWidth / 40));
    for (let i = 0; i < count; i++) {
        particles.push(new Particle());
    }
}

function animate() {
    if (!canvas || !ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = 'rgba(3, 7, 18, 0.32)';
    ctx.fillRect(0, 0, window.innerWidth, window.innerHeight);
    particles.forEach(p => {
        p.update();
        p.draw();
    });
    requestAnimationFrame(animate);
}

function initCanvasBackground() {
    canvas = document.getElementById('bgCanvas');
    if (!canvas) return;
    ctx = canvas.getContext('2d');
    if (!ctx) return;

    resizeCanvas();
    createParticles();
    animate();
}

window.addEventListener('DOMContentLoaded', () => {
    initCanvasBackground();
});

window.addEventListener('resize', () => {
    resizeCanvas();
    createParticles();
});