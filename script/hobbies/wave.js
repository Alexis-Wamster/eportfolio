export class Wave {
    static canvas = null;

    constructor(x, y, color = "white") {
        this.x = x;
        this.y = y;
        this.radius = 0;
        this.opacity = 0.5;
        this.growth = 0.5; // pixels per frame
        this.fade = 0.001; // opacity lost per frame
        this.color = color;
    }

    update() {
        this.radius += this.growth;
        this.opacity -= this.fade;
        if (this.opacity < 0) this.opacity = 0;
    }

    draw(ctx) {
        ctx.globalAlpha = this.opacity;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
        ctx.strokeStyle = this.color;
        ctx.lineWidth = 3;
        ctx.stroke();
    }

    isAlive() {
        return this.opacity > 0;
    }
}