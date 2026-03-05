export default class Slice {
    constructor() {
        this.points = [];
        this.lifetime = 12;
    }

    addPoint(x, y) {
        this.points.push({ x, y, life: this.lifetime });
    }

    update() {
        for (let i = this.points.length - 1; i >= 0; i--) {
            this.points[i].life--;
            if (this.points[i].life <= 0) {
                this.points.splice(i, 1);
            }
        }
    }

    draw(ctx) {
        if (this.points.length < 2) return;

        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        // Outer Glow
        ctx.shadowBlur = 15;
        ctx.shadowColor = "#00e5ff"; // Cyan glow

        // Draw the blade trail
        for (let i = 0; i < this.points.length - 1; i++) {
            const p1 = this.points[i];
            const p2 = this.points[i + 1];

            const lifePc = p1.life / this.lifetime;
            const width = lifePc * 6;

            ctx.lineWidth = width;
            ctx.strokeStyle = `rgba(220, 250, 255, ${lifePc})`; // White-ish center

            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.stroke();
        }

        ctx.shadowBlur = 0;
    }

    clear() {
        this.points = [];
    }
}
