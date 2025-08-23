import { Star } from './star.js';

export class Background {
    static COLOR_FONCEE1 = "#291c3a";
    static COLOR_FONCEE2 = "#331c52";
    static STAR_COUNT = 500;

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hue = 0;
        Star.canvas = canvas; // Assure que Star utilise ce canvas
        this.stars = Array.from({ length: Background.STAR_COUNT }, () => new Star());
    }

    draw() {
        // Create a linear gradient from top-left to bottom-right
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, Background.COLOR_FONCEE1);
        gradient.addColorStop(1, Background.COLOR_FONCEE2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        this.ctx.save();
        this.ctx.globalAlpha = 0.8;
        this.ctx.fillStyle = "white";
        for (const star of this.stars) {
            star.update();
            star.draw(this.ctx);
        }
        this.ctx.restore();
    }
}