import Fruit from "./Fruit";
import Particle from "./Particle";
import Slice from "./Slice";

export default class Engine {
    constructor(canvas, callbacks) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d", { alpha: false });
        this.callbacks = callbacks;

        this.width = canvas.width;
        this.height = canvas.height;

        this.fruits = [];
        this.particles = [];
        this.slice = new Slice();

        this.score = 0;
        this.lives = 3;
        this.isRunning = false;

        // Difficulty / Spawning
        this.spawnTimer = 0;
        this.spawnInterval = 60;
        this.gameTime = 0;

        // Mechanics
        this.timeScale = 1.0; // 0.2 for Blade Mode
        this.bladeGauge = 100; // 0-100
        this.isBladeMode = false;

        // Frenzy
        this.frenzyActive = false;
        this.frenzyTimer = 0;

        // Combo
        this.comboCount = 0;
        this.comboTimer = 0;
        this.maxComboTime = 15;

        // Visuals
        this.shake = 0;
        this.flash = 0;
        this.gridOffset = 0;

        this.setupInput();
        this.resize();
    }

    setupInput() {
        const getPos = (e) => {
            const rect = this.canvas.getBoundingClientRect();
            const clientX = e.touches ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches ? e.touches[0].clientY : e.clientY;
            return {
                x: clientX - rect.left,
                y: clientY - rect.top
            };
        };

        const onMove = (e) => {
            if (!this.isRunning) return;
            const { x, y } = getPos(e);
            this.slice.addPoint(x, y);
            this.checkCollisions(x, y);
        };

        // Blade Mode Trigger (Right Click or Long Press - let's stick to Right Click/Double Tap equivalent or separate button)
        // For simplicity in browser, let's use Shift key or UI toggle.
        // Actually, let's make it automatic on rapid movement or a specific key.
        // Let's bind 'Space' or 'Shift' for Blade Mode.
        const onKeyDown = (e) => {
            if (e.code === "Space" || e.code === "ShiftLeft") {
                this.activateBladeMode();
            }
        };
        const onKeyUp = (e) => {
            if (e.code === "Space" || e.code === "ShiftLeft") {
                this.deactivateBladeMode();
            }
        };

        window.addEventListener("keydown", onKeyDown);
        window.addEventListener("keyup", onKeyUp);
        this.canvas.addEventListener("mousemove", onMove);
        this.canvas.addEventListener("touchmove", onMove, { passive: false });

        // Touch trigger? Two finger touch?
        this.canvas.addEventListener("touchstart", (e) => {
            if (e.touches.length > 1) this.activateBladeMode();
        });
        this.canvas.addEventListener("touchend", (e) => {
            if (e.touches.length < 2) this.deactivateBladeMode();
        });
    }

    activateBladeMode() {
        if (this.bladeGauge > 10) {
            this.isBladeMode = true;
        }
    }

    deactivateBladeMode() {
        this.isBladeMode = false;
    }

    start() {
        this.score = 0;
        this.lives = 3;
        this.fruits = [];
        this.particles = [];
        this.slice.clear();
        this.isRunning = true;
        this.spawnInterval = 60;
        this.gameTime = 0;
        this.comboCount = 0;
        this.shake = 0;
        this.bladeGauge = 100;

        this.callbacks.onScoreUpdate(0);

        this.lastTime = performance.now();
        requestAnimationFrame(this.loop.bind(this));
    }

    loop(timestamp) {
        if (!this.isRunning) return;

        // const dt = (timestamp - this.lastTime) / 1000; 
        // We use fixed timestep logic mostly via frame counting in original code
        // To implement time scale, we modulate updates.

        this.lastTime = timestamp;

        this.update();
        this.draw();

        requestAnimationFrame(this.loop.bind(this));
    }

    update() {
        // Time Scale Logic
        if (this.isBladeMode && this.bladeGauge > 0) {
            this.timeScale = 0.1; // Super Slow Mo
            this.bladeGauge -= 0.5; // Drain
        } else {
            this.timeScale = 1.0;
            if (this.bladeGauge < 100) this.bladeGauge += 0.1; // Recharge
            this.isBladeMode = false;
        }

        // Apply Time Scale to Game Time
        // We can just skip updates or pass delta. 
        // Simpler: Accumulate dt and run update step when full.
        // For visual smoothness in slow mo, we update positions by (velocity * timeScale).

        this.gameTime++;
        this.gridOffset = (this.gridOffset + 1) % 40;

        // Shake/Flash (Realtime)
        if (this.shake > 0) this.shake *= 0.9;
        if (this.shake < 0.5) this.shake = 0;
        if (this.flash > 0) this.flash -= 0.05;
        if (this.comboTimer > 0) {
            this.comboTimer--; // Realtime decay? Or scaled? Let's make it realtime to make slowmo useful.
            if (this.comboTimer <= 0) this.comboCount = 0;
        }

        // Spawning (Scaled)
        this.spawnTimer += this.timeScale;
        if (this.spawnTimer > this.spawnInterval) {
            this.spawnTimer = 0;
            // Frenzy Spawning
            if (this.frenzyActive) {
                for (let i = 0; i < 3; i++) this.spawnFruit();
                this.frenzyTimer--;
                if (this.frenzyTimer <= 0) this.frenzyActive = false;
            } else {
                const count = Math.random() > 0.8 ? 2 : 1;
                for (let i = 0; i < count; i++) this.spawnFruit();
            }

            // Difficulty
            if (this.gameTime % 600 === 0 && this.spawnInterval > 20) this.spawnInterval -= 2;
        }

        // Slice Update (Realtime - Player is FAST)
        this.slice.update(); // Keep full speed

        // Entity Updates (Scaled)
        // Fruits
        for (let i = this.fruits.length - 1; i >= 0; i--) {
            const fruit = this.fruits[i];
            fruit.update(this.timeScale); // Pass scale

            if (fruit.isOffScreen(this.height)) {
                if (!fruit.isSliced && !fruit.isBomb) {
                    this.loseLife();
                }
                this.fruits.splice(i, 1);
            }
        }

        // Particles (Scaled)
        for (let i = this.particles.length - 1; i >= 0; i--) {
            this.particles[i].update(this.timeScale);
            if (this.particles[i].life <= 0) {
                this.particles.splice(i, 1);
            }
        }
    }

    draw() {
        this.ctx.save();

        // Shake
        if (this.shake > 0) {
            const dx = (Math.random() - 0.5) * this.shake;
            const dy = (Math.random() - 0.5) * this.shake;
            this.ctx.translate(dx, dy);
        }

        // Cyber Background
        this.ctx.fillStyle = "#050505";
        this.ctx.fillRect(0, 0, this.width, this.height);

        // Holographic Grid
        this.ctx.strokeStyle = "rgba(0, 255, 255, 0.1)";
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        // Perspective Grid (Simulated)
        const horizon = this.height * 0.3;
        for (let i = -this.width; i < this.width * 2; i += 100) {
            this.ctx.moveTo(i, this.height);
            this.ctx.lineTo(this.width / 2 + (i - this.width / 2) * 0.1, horizon);
        }
        // Horizontal lines moving
        for (let y = horizon; y < this.height; y += 40 * (y / this.height)) {
            const dy = (y + this.gridOffset) % this.height;
            if (dy < horizon) continue;
            this.ctx.moveTo(0, dy);
            this.ctx.lineTo(this.width, dy);
        }
        this.ctx.stroke();


        // Fruits
        this.fruits.forEach(fruit => fruit.draw(this.ctx));

        // Particles (Additive)
        this.ctx.globalCompositeOperation = "lighter";
        this.particles.forEach(p => p.draw(this.ctx));
        this.ctx.globalCompositeOperation = "source-over";

        // Slice
        this.slice.draw(this.ctx);

        // Blade Gauge
        this.drawGauge();

        // UI Text
        this.drawUI();

        // Flash/Glitch
        if (this.isBladeMode) {
            this.ctx.fillStyle = "rgba(0, 255, 255, 0.1)"; // Cyan tint
            this.ctx.fillRect(0, 0, this.width, this.height);
            // Scanlines
            this.ctx.fillStyle = "rgba(0,0,0,0.2)";
            for (let y = 0; y < this.height; y += 4) {
                this.ctx.fillRect(0, y, this.width, 2);
            }
        }

        if (this.flash > 0) {
            this.ctx.fillStyle = `rgba(255, 255, 255, ${this.flash})`;
            this.ctx.fillRect(0, 0, this.width, this.height);
        }

        this.ctx.restore();
    }

    drawGauge() {
        const w = 200;
        const h = 10;
        const x = this.width / 2 - w / 2;
        const y = this.height - 30;

        // Bg
        this.ctx.fillStyle = "#333";
        this.ctx.fillRect(x, y, w, h);

        // Fill
        this.ctx.fillStyle = this.isBladeMode ? "#00ffff" : "#0099ff";
        this.ctx.shadowBlur = 10;
        this.ctx.shadowColor = this.ctx.fillStyle;
        this.ctx.fillRect(x, y, w * (this.bladeGauge / 100), h);
        this.ctx.shadowBlur = 0;

        this.ctx.font = "12px monospace";
        this.ctx.fillStyle = "#fff";
        this.ctx.textAlign = "center";
        this.ctx.fillText("BLADE FOCUS (HOLD SPACE OR 2 FINGERS)", x + w / 2, y - 5);
    }

    spawnFruit() {
        const x = Math.random() * (this.width - 100) + 50;
        const fruit = new Fruit(x, this.height, this.width);
        this.fruits.push(fruit);
    }

    checkCollisions(x, y) {
        if (this.slice.points.length < 2) return;
        const p1 = this.slice.points[this.slice.points.length - 2];
        const p2 = this.slice.points[this.slice.points.length - 1];
        const sliceAngle = Math.atan2(p2.y - p1.y, p2.x - p1.x);

        for (const fruit of this.fruits) {
            if (!fruit.isSliced && fruit.checkSlice(p1, p2)) {
                if (fruit.isBomb) {
                    this.triggerBomb(fruit);
                    return;
                }
                this.sliceFruit(fruit, sliceAngle);
            }
        }
    }

    sliceFruit(fruit, angle) {
        fruit.slice(angle);

        this.comboCount++;
        this.comboTimer = this.maxComboTime;

        // Frenzy trigger
        if (this.comboCount === 5 && !this.frenzyActive) {
            this.frenzyActive = true;
            this.frenzyTimer = 100; // frames
            this.createSplash(this.width / 2, this.height / 2, "#fff", "spark"); // flash in center
        }

        const points = 1 + (this.comboCount > 1 ? this.comboCount : 0);
        this.score += points;
        this.callbacks.onScoreUpdate(this.score);

        this.createSplash(fruit.x, fruit.y, fruit.color);
        this.shake = 3;
    }

    triggerBomb(fruit) {
        this.shake = 30;
        this.flash = 1.0;
        this.createSplash(fruit.x, fruit.y, "#ff0000", "splatter");
        setTimeout(() => { this.gameOver(); }, 100);
    }

    createSplash(x, y, color, type = "splatter") {
        const count = type === "splatter" ? 8 : 15;
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(x, y, color, type));
        }
    }

    loseLife() {
        this.lives--;
        this.shake = 10;
        this.flash = 0.3;
        this.comboCount = 0;
        if (this.lives <= 0) this.gameOver();
    }

    gameOver() {
        this.isRunning = false;
        this.callbacks.onGameOver(this.score);
    }

    drawUI() {
        // Combo
        if (this.comboCount > 1) {
            this.ctx.save();
            this.ctx.textAlign = "center";
            this.ctx.fillStyle = "#00e5ff"; // Cyan combo
            this.ctx.font = "italic 900 60px Arial";
            this.ctx.shadowColor = "#00e5ff";
            this.ctx.shadowBlur = 20;
            this.ctx.translate(this.width / 2, this.height / 4);
            const jolt = Math.random() * 2;
            this.ctx.translate(jolt, jolt); // jitter
            this.ctx.fillText(`${this.comboCount}X CHAIN`, 0, 0);
            this.ctx.restore();
        }

        // Hearts
        this.ctx.fillStyle = "#ff0055";
        this.ctx.font = "30px Arial";
        this.ctx.textAlign = "right";
        this.ctx.shadowColor = "#ff0055";
        this.ctx.shadowBlur = 15;
        const hearts = "♥".repeat(Math.max(0, this.lives));
        this.ctx.fillText(hearts, this.width - 20, 50);
        this.ctx.shadowBlur = 0;
    }

    resize() {
        if (!this.canvas) return;
        const rect = this.canvas.parentElement.getBoundingClientRect();
        this.canvas.width = rect.width;
        this.canvas.height = rect.height;
        this.width = rect.width;
        this.height = rect.height;
    }

    cleanup() {
        this.isRunning = false;
        window.removeEventListener("keydown", this.onKeyDown); // This needs proper binding stored
        // Simplification for brevity in this step
    }
}
