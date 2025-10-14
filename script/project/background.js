import { Shape } from './shape.js';

export class Background {
    static COLOR_FONCEE1 = "#291c3a";
    static COLOR_FONCEE2 = "#331c52";
    static SHAPES_COUNT = 50;

    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.hue = 0;

        // Couche offscreen pour dessiner uniquement les formes (laisse le fond intact)
        this.layer = document.createElement('canvas');
        this.layer.width = canvas.width;
        this.layer.height = canvas.height;
        this.layerCtx = this.layer.getContext('2d');

        Shape.canvas = canvas; 
        this.shapes = Array.from({ length: Background.SHAPES_COUNT }, () => new Shape(true));
    }

    // (optionnel) à appeler si le canvas change de taille
    resize(w, h) {
        this.canvas.width = w;
        this.canvas.height = h;
        this.layer.width = w;
        this.layer.height = h;
    }

    draw() {
        // 1) Fond dégradé (sur le canvas principal)
        const gradient = this.ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, Background.COLOR_FONCEE1);
        gradient.addColorStop(1, Background.COLOR_FONCEE2);
        this.ctx.fillStyle = gradient;
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // 2) Efface la couche formes (transparent)
        this.layerCtx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        // 3) Tri par profondeur (du plus loin au plus proche)
        this.shapes.sort((a, b) => a.z - b.z);

        // 4) Update + rendu « effacer les lointaines sous moi » puis dessiner ma forme
        for (let i = 0; i < this.shapes.length; i++) {
            const shape = this.shapes[i];
            shape.update();
            shape.eraseFootprint(this.layerCtx); // enlève ce qui est derrière sous mon empreinte
            shape.drawTo(this.layerCtx);         // dessine ma forme avec MON opacité uniquement

            if (!shape.isAlive()) {
                this.shapes[i] = new Shape();
            }
        }

        // 5) Composite final : couche formes au-dessus du fond
        this.ctx.drawImage(this.layer, 0, 0);
    }
}
