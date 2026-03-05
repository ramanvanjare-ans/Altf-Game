export default class Particle {
    constructor(x, y, color, type = "splatter") {
        this.x = x;
        this.y = y;
        this.color = color;
        this.type = type;

        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 8 + 4; // Faster

        this.vx = Math.cos(angle) * speed;
        this.vy = Math.sin(angle) * speed;

        this.size = Math.random() * 3 + 2;
        this.life = 1.0;
        this.decay = Math.random() * 0.03 + 0.02;
    }

    update(timeScale = 1.0) {
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;

        if (this.type !== "spark") {
            this.vy += 0.2 * timeScale;
        }

        this.life -= this.decay * timeScale;
        this.size *= 0.98;
    }

    draw(ctx) {
        ctx.globalAlpha = this.life;
        ctx.fillStyle = this.color;

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();

        ctx.shadowBlur = 0;
        ctx.globalAlpha = 1.0;
    }
}
