import { Jeu } from './Jeu.js';
import { Boucle } from './Boucle.js';

export class Evenement {
    static UP = [0, -1];
    static DOWN = [0, 1];
    static LEFT = [-1, 0];
    static RIGHT = [1, 0];

    constructor(jeu, boucle) {
        // clavier
        document.addEventListener('keydown', this.input.bind(this));
        document.addEventListener('keyup', this.output.bind(this));
        this.pressLeft = false;
        this.pressRight = false
        this.pressUp = false;
        this.pressDown = false;

        // mobile
        document.addEventListener('click', this.event_click.bind(this));
        document.addEventListener('touchstart', this.event_touchstart.bind(this));
        document.addEventListener('touchmove', this.event_touchmove.bind(this));
        this.threshold = 100;
        this.start = [];
        this.doubleClickDelay = 300; // ms
        this.lastClickTime = 0;
        

        this.jeu = jeu;
        this.boucle = boucle;
    }


    // ============================= Action ============================== \\


    quitter(){
        this.jeu.end_game();
    }

    pause(){
        this.jeu.isFreeze = !this.jeu.isFreeze;
        this.jeu.canvas.classList.remove("invisible");
        if (this.jeu.gameOver) {
            this.jeu.initialisation();
            this.jeu.gameOver = false;
        }
        this.boucle.boucler();
    }

    left(){
        let derniereDirection = this.get_lastDirection();
        if (derniereDirection != Evenement.RIGHT && this.pressLeft == false) {
            this.jeu.direction.push(Evenement.LEFT);
            this.pressLeft = true;
        }
    }

    right(){
        let derniereDirection = this.get_lastDirection();
        if (derniereDirection != Evenement.LEFT && this.pressRight == false) {
            this.jeu.direction.push(Evenement.RIGHT);
            this.pressRight = true;
        }
    }

    up(){
        let derniereDirection = this.get_lastDirection();
        if (derniereDirection != Evenement.DOWN && this.pressUp == false) {
            this.jeu.direction.push(Evenement.UP);
            this.pressUp = true;
        }
    }

    down(){
        let derniereDirection = this.get_lastDirection();
        if (derniereDirection != Evenement.UP && this.pressDown == false) {
            this.jeu.direction.push(Evenement.DOWN);
            this.pressDown = true;
        }
    }

    get_lastDirection(){
        if (this.jeu.direction.length > 0){
            return this.jeu.direction[this.jeu.direction.length - 1];
        }
        return this.jeu.derniereDirection;
    }

    // ============================= Clavier ============================== \\

    input(e) {
        if (e.key === " ") {
            this.pause();
            return;
        }
        if (e.key === "Escape") {
            this.quitter();
            return;
        }
        if (!this.jeu.isFreeze){
            let derniereDirection = (this.jeu.direction.length > 0) ? this.jeu.direction[this.jeu.direction.length - 1] : this.jeu.derniereDirection;
            switch (e.key) {
                case "ArrowLeft":
                    this.left();
                    break;
                case "ArrowUp":
                    this.up();
                    break;
                case "ArrowRight":
                    this.right();
                    break;
                case "ArrowDown":
                    this.down();
                    break;  
                default:
                    break;
            }
        }
    }

    output(e) {
        switch (e.key) {
            case "ArrowLeft":
                this.pressLeft = false;
                break; 
            case "ArrowUp":
                this.pressUp = false;
                break;
            case "ArrowRight":
                this.pressRight = false;
                break;
            case "ArrowDown":
                this.pressDown = false;
                break;
            default:
                break;
        }
    }


    // ============================= MOBILE ============================== \\
    
    event_click(){
        const now = Date.now();
        if (now - this.lastClickTime < this.doubleClickDelay){
            this.pause();
        }
        this.lastClickTime = now;
    }
    
    event_touchstart(event){
        this.start = [
            event.changedTouches[0].pageX,
            event.changedTouches[0].pageY,
        ];
    };

    event_touchmove(event){
        if (!this.jeu.isFreeze){
            event.preventDefault();
            const touch = [
                event.changedTouches[0].pageX,
                event.changedTouches[0].pageY,
            ];
            const dist = [
                touch[0] - this.start[0],
                touch[1] - this.start[1]
            ];
            if (dist[0] > this.threshold){
                this.right();
                this.start = touch;
            }
            if (-dist[0] > this.threshold){
                this.left();
                this.start = touch;
            }
            if (dist[1] > this.threshold){
                this.down();
                this.start = touch;
            }
            if (-dist[1] > this.threshold){
                this.up();
                this.start = touch;
            }
        }
    }
}
