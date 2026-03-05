export default class Fruit {
    constructor(x, y, canvasWidth) {
        this.x = x;
        this.y = y;

        const centerX = canvasWidth / 2;
        const dirX = x < centerX ? 1 : -1;
        this.vx = (Math.random() * 4 + 2) * dirX;
        this.vy = -(Math.random() * 6 + 12);

        this.type = this.pickType();
        this.isBomb = this.type === "bomb";

        this.radius = this.getRadius(this.type);
        this.color = this.getColor(this.type);
        this.innerColor = this.getInnerColor(this.type);

        this.rotation = 0;
        this.rotationSpeed = Math.random() * 0.3 - 0.15;
        this.gravity = 0.25;

        this.isSliced = false;
        this.leftPart = { x: 0, y: 0, vx: 0, vy: 0, rot: 0 };
        this.rightPart = { x: 0, y: 0, vx: 0, vy: 0, rot: 0 };
    }

    pickType() {
        const rand = Math.random();
        if (rand < 0.15) return "bomb";
        const types = ["neon-red", "neon-blue", "neon-green", "neon-purple", "neon-yellow"];
        return types[Math.floor(Math.random() * types.length)];
    }

    getRadius(type) {
        return this.isBomb ? 45 : 35 + Math.random() * 15;
    }

    getColor(type) {
        if (type === "bomb") return "#000";
        const map = {
            "neon-red": "#ff0055", // Pinkish Red
            "neon-blue": "#00ccff", // Cyan
            "neon-green": "#00ff66", // lime
            "neon-purple": "#bc13fe", // purple
            "neon-yellow": "#fcee0a"  // yellow
        };
        return map[type];
    }

    getInnerColor(type) {
        if (type === "bomb") return "#ff0000";
        return "#ffffff"; // White glowing core
    }

    update(timeScale = 1.0) {
        this.vy += this.gravity * timeScale;
        this.x += this.vx * timeScale;
        this.y += this.vy * timeScale;
        this.rotation += this.rotationSpeed * timeScale;

        if (this.isSliced) {
            this.leftPart.vy += this.gravity * timeScale;
            this.leftPart.x += this.leftPart.vx * timeScale;
            this.leftPart.y += this.leftPart.vy * timeScale;

            this.rightPart.vy += this.gravity * timeScale;
            this.rightPart.x += this.rightPart.vx * timeScale;
            this.rightPart.y += this.rightPart.vy * timeScale;
        }
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.x, this.y);
        ctx.rotate(this.rotation);

        if (this.isSliced) {
            this.drawHalf(ctx, this.leftPart, -1);
            this.drawHalf(ctx, this.rightPart, 1);
        } else {
            this.drawRaw(ctx);
        }
        ctx.restore();
    }

    drawRaw(ctx) {
        if (this.isBomb) {
            // Spike Mine Look
            ctx.fillStyle = "#111";
            ctx.strokeStyle = "#ff0000";
            ctx.lineWidth = 2;
            ctx.beginPath();
            const spikes = 8;
            for (let i = 0; i < spikes; i++) {
                const a = (i / spikes) * Math.PI * 2;
                const r = this.radius + (i % 2 === 0 ? 10 : 0);
                // Draw spike
                // Simple circle for now with glowing outline
            }
            ctx.shadowColor = "red";
            ctx.shadowBlur = 20;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
            ctx.shadowBlur = 0;

            // Skull
            ctx.fillStyle = "red";
            ctx.textAlign = "center";
            ctx.font = "30px Arial";
            ctx.textBaseline = "middle";
            ctx.fillText("☠", 0, 0);
        } else {
            // Neon Fruit
            // Outer glow
            ctx.shadowBlur = 20;
            ctx.shadowColor = this.color;

            // Stroke only? Or Dark fill?
            ctx.fillStyle = "rgba(0,0,0,0.8)";
            ctx.strokeStyle = this.color;
            ctx.lineWidth = 4;

            ctx.beginPath();
            ctx.arc(0, 0, this.radius, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            // Inner Core
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(0, 0, this.radius * 0.4, 0, Math.PI * 2);
            ctx.fill();

            ctx.shadowBlur = 0;
        }
    }

    drawHalf(ctx, part, direction) {
        ctx.save();
        ctx.translate(part.x, part.y);
        ctx.rotate(part.rot);

        ctx.shadowBlur = 10;
        ctx.shadowColor = this.color;

        ctx.fillStyle = "rgba(0,0,0,0.8)";
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 4;

        ctx.beginPath();
        if (direction === -1) ctx.arc(0, 0, this.radius, Math.PI * 0.5, Math.PI * 1.5);
        else ctx.arc(0, 0, this.radius, Math.PI * 1.5, Math.PI * 0.5);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
    }

    slice(angle) {
        this.isSliced = true;

        const force = 5;
        const splitAngle = angle + Math.PI / 2;

        this.leftPart.vx = Math.cos(splitAngle) * force;
        this.leftPart.vy = Math.sin(splitAngle) * force;
        this.leftPart.rot = -0.15;

        this.rightPart.vx = Math.cos(splitAngle + Math.PI) * force;
        this.rightPart.vy = Math.sin(splitAngle + Math.PI) * force;
        this.rightPart.rot = 0.15;

        this.leftPart.vx += this.vx * 0.5;
        this.leftPart.vy += this.vy * 0.5;
        this.rightPart.vx += this.vx * 0.5;
        this.rightPart.vy += this.vy * 0.5;
    }

    checkSlice(p1, p2) {
        // Simple circle collision
        const dx = p2.x - p1.x;
        const dy = p2.y - p1.y;
        const lenSq = dx * dx + dy * dy;
        const u = ((this.x - p1.x) * dx + (this.y - p1.y) * dy) / lenSq;
        let cx, cy;
        if (u < 0) { cx = p1.x; cy = p1.y }
        else if (u > 1) { cx = p2.x; cy = p2.y }
        else { cx = p1.x + u * dx; cy = p1.y + u * dy }
        const dist = (this.x - cx) * (this.x - cx) + (this.y - cy) * (this.y - cy);
        return dist < this.radius * this.radius;
    }

    isOffScreen(height) { return this.y > height + 100 && this.vy > 0; }
}
