export class Star {
    static STAR_SPEED = 0.3;
    static STAR_DEPTH = 1000;
    static canvas = null;
    x;
    y;
    z;

    constructor() {
        this.reset();
    }
    reset() {
        this.x = (Math.random() - 0.5) * Star.canvas.width;
        this.y = (Math.random() - 0.5) * Star.canvas.height;
        this.z = Math.random() * Star.STAR_DEPTH;
    }
    update() {
        this.z -= Star.STAR_SPEED;
        if (this.z < 1) this.reset();
    }
    draw(ctx) {
        ctx.beginPath();
        ctx.arc(this.screenX(), this.screenY(), this.size(), 0, 2 * Math.PI);
        ctx.fill();
    }
    screenX() {
        return Star.canvas.width / 2 + this.x * (Star.STAR_DEPTH / this.z);
    }
    screenY() {
        return Star.canvas.height / 2 + this.y * (Star.STAR_DEPTH / this.z);
    }
    size() {
        return Math.max(0.5, 2 * (Star.STAR_DEPTH - this.z) / Star.STAR_DEPTH);
    }
}