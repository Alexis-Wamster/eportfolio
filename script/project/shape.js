export class Shape {
    static canvas = null;

    static SHAPES = [
        [[[1, 1, 1, 1]], [[1],[1],[1],[1]]],            // I
        [[[1, 1],[1, 1]]],                               // O
        [[[0,1,0],[1,1,1]], [[1,0],[1,1],[1,0]], [[1,1,1],[0,1,0]], [[0,1],[1,1],[0,1]]], // T
        [[[1,0],[1,0],[1,1]], [[1,1,1],[1,0,0]], [[1,1],[0,1],[0,1]], [[0,0,1],[1,1,1]]], // L
        [[[0,1],[0,1],[1,1]], [[1,0,0],[1,1,1]], [[1,1],[1,0],[1,0]], [[1,1,1],[0,0,1]]], // J
        [[[0,1,1],[1,1,0]], [[1,0],[1,1],[0,1]]],       // S
        [[[1,1,0],[0,1,1]], [[0,1],[1,1],[1,0]]]        // Z
    ];

    constructor(random_y=false) {
        this.z = Math.random();                // 0 (loin) → 1 (près)
        this.opacity = 0 + 0.5 * this.z;
        this.speed = 0.3 + 0.8 * this.z;
        this.size = 5 + 20 * this.z;

        const shapeIdx = Math.floor(Math.random() * Shape.SHAPES.length);
        const rotations = Shape.SHAPES[shapeIdx];
        this.matrix = rotations[Math.floor(Math.random() * rotations.length)];

        this.x = Math.random() * (Shape.canvas.width - this.matrix[0].length * this.size);
        // éparpille dans la colonne de chute
        if (random_y) {
            this.y = Math.random() * Shape.canvas.height - this.matrix.length * this.size;
        }
        else {
            this.y = -this.matrix.length * this.size;
        }
    }

    update() { this.y += this.speed; }

    // 1) Efface sous mon empreinte ce qui a été déjà dessiné (formes plus lointaines)
    eraseFootprint(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'destination-out';
        ctx.globalAlpha = 1; // efface complètement
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                if (!this.matrix[row][col]) continue;
                const px = this.x + col * this.size;
                const py = this.y + row * this.size;
                ctx.fillRect(px, py, this.size, this.size);
            }
        }
        ctx.restore();
    }

    // 2) Dessine ma forme avec MON opacité (sans cumuler avec derrière, car déjà effacé)
    drawTo(ctx) {
        ctx.save();
        ctx.globalCompositeOperation = 'source-over';
        ctx.globalAlpha = this.opacity;
        ctx.fillStyle = "#FFFFFF";
        for (let row = 0; row < this.matrix.length; row++) {
            for (let col = 0; col < this.matrix[row].length; col++) {
                if (!this.matrix[row][col]) continue;
                const px = this.x + col * this.size;
                const py = this.y + row * this.size;
                ctx.fillRect(px, py, this.size, this.size);
            }
        }
        ctx.restore();
    }

    isAlive() { return this.y < Shape.canvas.height; }
}
