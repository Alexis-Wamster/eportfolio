export class Line {
    // attributs
    static canvas = null;
    x1; y1;
    x2; y2;
    opacity = 0;
    static LINE_WIDTH = 2;
    
    // animation parameters
    static MIN_ANIMATION_TIME = -10;
    static MAX_OPACITY = 0.2;
    static SPEED_ANIMATION = 0.1;
    static EASE_ANIMATION_FACTOR = 0.5; // Negatif pour concave, positif pour convexe
    animation_playing = false;
    animation_time = Line.MIN_ANIMATION_TIME;
    animation_phase = 1; // 1 pour apparition, -1 pour disparition

    // methodes
    constructor(x1, y1, x2, y2) {
        this.x1 = x1;
        this.x2 = x2;
        this.y1 = y1;
        this.y2 = y2;
    }

    update() {
        
        if (this.animation_playing) {
            this.animation_time += Line.SPEED_ANIMATION * this.animation_phase;
            // formule (param: animation_time)
            // opacity = MAX_OPACITY * (1 - (animation_time / MIN_ANIMATION_TIME)) ^ e ^ EASE_ANIMATION_FACTOR
            this.opacity = Line.MAX_OPACITY * Math.pow(1 - this.animation_time / Line.MIN_ANIMATION_TIME, Math.exp(Line.EASE_ANIMATION_FACTOR));
            
            
            if (this.animation_time >= 0) { // opacité max atteinte
                this.animation_phase = -1;
            }
            else if (this.animation_time <= Line.MIN_ANIMATION_TIME) { // fin de l'animation
                this.animation_phase = 1;
                this.animation_playing = false;
                this.animation_time = Line.MIN_ANIMATION_TIME;
            }
        }
    }

    draw(ctx) {
        if (!Line.canvas) {
            console.error("Canvas not set for Line class.");
            return;
        }
        ctx.save();
        ctx.lineWidth = Line.LINE_WIDTH;

        ctx.globalAlpha = this.opacity;
        ctx.strokeStyle = "#fff";
        ctx.beginPath();
        ctx.moveTo(this.x1, this.y1);
        ctx.lineTo(this.x2, this.y2);
        ctx.stroke();
        ctx.globalAlpha = 1.0;
    }
    
}