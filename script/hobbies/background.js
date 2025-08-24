import { Wave } from './wave.js';

export class Background {
    static COLOR_FONCEE1 = "#291c3a";
    static COLOR_FONCEE2 = "#331c52";
    static MAX_WAVES = 10; // Limite le nombre d'ondes simultanées
    static MIN_WAVES = 2; // Limite le nombre d'ondes simultanées

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hue = 0;
        Wave.canvas = canvas; // Assure que Star utilise ce canvas
        console.log("Canvas pour les ondes défini dans Wave.");
        const wave_count = Math.floor(Math.random() * (Background.MAX_WAVES - Background.MIN_WAVES + 1)) + Background.MIN_WAVES;
        this.waves = Array.from({ length: wave_count }, () => new Wave({already_ring: true}));
    }

    draw() {
        // Fond dégradé
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, Background.COLOR_FONCEE1);
        gradient.addColorStop(1, Background.COLOR_FONCEE2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Ajoute aléatoirement des ondes si le nombre est inférieur à MAX_WAVES
        if (this.waves.length < Background.MIN_WAVES || (Math.random() < 0.01 && this.waves.length < Background.MAX_WAVES)) {
            this.waves.push(new Wave());
        }

        // Dessine et met à jour les ondes
        this.ctx.save();
        for (let i = this.waves.length - 1; i >= 0; i--) {
            const wave = this.waves[i];
            wave.update();
            wave.draw(this.ctx);
            if (!wave.isAlive()) this.waves.splice(i, 1);
        }
        this.ctx.restore();
    }
}