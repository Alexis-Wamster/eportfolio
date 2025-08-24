import { Line } from './line.js';

export class Background {
    static COLOR_FONCEE1 = "#291c3a";
    static COLOR_FONCEE2 = "#331c52";
    static LINE_COLOR = "rgba(255,255,255,0.3)";

    constructor(canvas, ctx, case_size) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.case_size = case_size;
        this.hue = 0;
        this.lines = [];
        Line.canvas = canvas;

        // Prépare les lignes verticales et horizontales
        
    }

    resize() {
        // Recrée les lignes en fonction de la nouvelle taille
        this.lines = [];
        for (let x = this.case_size; x < this.canvas.width; x += this.case_size) {
            this.lines.push(new Line(x, 0, x, this.canvas.height, {already_animated: true}));
        }
        for (let y = this.case_size; y < this.canvas.height; y += this.case_size) {
            this.lines.push(new Line(0, y, this.canvas.width, y, {already_animated: true}));
        }
    }

    // ...existing code...
    draw() {
        // Fond dégradé
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, Background.COLOR_FONCEE1);
        gradient.addColorStop(1, Background.COLOR_FONCEE2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Animation des lignes (pulsation)
        this.ctx.save();

        // Pulse aléatoirement quelques lignes
        for (const line of this.lines) {
            if (!line.animation_playing && Math.random() < 0.0005*this.lines.length) {
                line.animation_playing = true;
            }
            line.update();
            line.draw(this.ctx);
        }
        this.ctx.restore();
    }
//
}