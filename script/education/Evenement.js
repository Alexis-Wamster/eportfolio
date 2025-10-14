import { Jeu } from './Jeu.js';
import { Serpent } from './Serpent.js';
import { Dessin } from './Dessin.js';

async function demarrerJeu() {
    const canvas_fg = document.getElementById('foreground');
    const canvas_bg = document.getElementById('background');
    canvas_fg.classList.add("invisible");
    canvas_bg.classList.add("invisible");

    try {
        // Capture tout la partie visible du body
        const bodyNode = document.getElementById("body");
        const rendered = await html2canvas(bodyNode, {
            useCORS: true,
            logging: false,
            backgroundColor: null, // très important => transparent
            x: window.scrollX,
            y: window.scrollY,
            width: window.innerWidth,
            height: window.innerHeight
        });
        
        const ctx = canvas_fg.getContext('2d');
        ctx.clearRect(0, 0, canvas_fg.width, canvas_fg.height);
        ctx.drawImage(rendered, 0, 0, canvas_fg.width, canvas_fg.height);

        Array.from(bodyNode.children).forEach(element => {
            if (element.id === "foreground" || element.id === "background") {
                element.classList.remove("invisible");
            }
            else{
                element.classList.add("invisible");
            }
        });
        return rendered;
    } catch (err) {
        console.error("Erreur lors de la capture :", err);
    }
    canvas_fg.classList.remove("invisible");
    return false;
}

function terminerJeu(){
    const bodyNode = document.getElementById("body");
    Array.from(bodyNode.children).forEach(element => {
        if (element.id === "foreground") {
            element.classList.add("invisible");
        }
        else{
            element.classList.remove("invisible");
        }
    });
}


export class Evenement {
    
    static LEFT = [-1, 0];
    static UP = [0, -1];
    static RIGHT = [1, 0];
    static DOWN = [0, 1];

    static NUM_LEFT = 0;
    static NUM_UP = 1;
    static NUM_RIGHT = 2;
    static NUM_DOWN = 3;

    static DIRECTION = [Evenement.LEFT, Evenement.UP, Evenement.RIGHT, Evenement.DOWN];

    constructor(jeu) {
        // clavier
        document.addEventListener('keydown', this.input.bind(this));
        document.addEventListener('keyup', this.output.bind(this));

        this.touche = [];
        this.input = [];
        
        this.isAddPlayer = false;
        this.newPlayerInput = [];

        // mobile
        document.addEventListener('click', this.event_click.bind(this));
        document.addEventListener('touchstart', this.event_touchstart.bind(this));
        document.addEventListener('touchmove', this.event_touchmove.bind(this), { passive: false });
        this.threshold = 100;
        this.start = [];
        this.doubleClickDelay = 300; // ms
        this.lastClickTime = 0;
        

        this.jeu = jeu;
    }

    // ============================= Action ============================== \\

    addJoueur(inputListe){
        const serpent = new Serpent(this.jeu, Dessin.getRandomColor());
        this.jeu.serpents.push(serpent)
        this.input.push([inputListe[0], inputListe[1], inputListe[2], inputListe[3]]);
        this.touche.push([false, false, false, false]);
        serpent.initialisation();
    }

    removePlayer(){
        if (this.jeu.serpents.length > 1){
            this.jeu.removeSnake(this.jeu.serpents[this.jeu.serpents.length -1]);
            this.jeu.serpents.length --;
            this.input.length --;
            this.touche.length --;
        }
        else{
            this.quitter();
        }
        
    }


    quitter(){
        this.jeu.end_game();
        terminerJeu();
    }

    pause(){
        if (this.jeu.gameOver) {
            demarrerJeu().then(promesse => {
                this.jeu.initialisation();
                this.jeu.gameOver = false;
                this.jeu.toggleFreeze();
            });
        }
        else{
            this.jeu.toggleFreeze();
        }
    }

    pushDirection(direction, joueur){
        let derniereDirection = this.get_lastDirection(this.jeu.serpents[joueur]);
        direction = Number(direction);
        if (derniereDirection != Evenement.DIRECTION[(direction+2)%4] && this.touche[joueur][direction] == false) {
            this.jeu.serpents[joueur].direction.push(Evenement.DIRECTION[direction]);
            this.touche[joueur][direction] = true;
        }
    }

    get_lastDirection(serpent){
        if (serpent.direction.length > 0){
            return serpent.direction[serpent.direction.length - 1];
        }
        return serpent.derniereDirection;
    }

    // ============================= Clavier ============================== \\

    input(e) {
        switch (e.key) {
            case " ":
                this.pause();
                break;
            
            case "Escape":
                this.quitter();
                break;
            
            case "+":
                this.isAddPlayer = true;
                this.newPlayerInput.length = 0;
                break;
            
            case "-":
                this.removePlayer();
                break;
        
            default:
                
                let inputAlreadyExist = false;
                if (!this.jeu.isFreeze){
                    for (let joueur in this.input) {
                        for (let direction in this.input[joueur]) {
                            if (this.input[joueur][direction] == e.key){
                                this.pushDirection(direction, joueur);
                                inputAlreadyExist = true;
                            }
                        }
                    }
                }

                if (this.isAddPlayer && !inputAlreadyExist){
                    if (this.newPlayerInput.length < 4){
                        this.newPlayerInput.push(e.key);
                    }
                    if (this.newPlayerInput.length >= 4){
                        this.addJoueur(this.newPlayerInput);
                        this.newPlayerInput.length = 0;
                        this.isAddPlayer = false;
                    }
                }
                break;
        }
    }

    output(e) {
        for (let joueur in this.input) {
            for (let direction in this.input[joueur]) {
                if (this.input[joueur][direction] == e.key){
                    this.pushDirection(direction, joueur);
                    this.touche[joueur][direction] = false;
                }
            }
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
                this.touche[0][Evenement.NUM_RIGHT] = false;
                this.pushDirection(Evenement.NUM_RIGHT, 0);
                this.start = touch;
            }
            if (-dist[0] > this.threshold){
                this.touche[0][Evenement.NUM_LEFT] = false;
                this.pushDirection(Evenement.NUM_LEFT, 0);
                this.start = touch;
            }
            if (dist[1] > this.threshold){
                this.touche[0][Evenement.NUM_DOWN] = false;
                this.pushDirection(Evenement.NUM_DOWN, 0);
                this.start = touch;
            }
            if (-dist[1] > this.threshold){
                this.touche[0][Evenement.NUM_UP] = false;
                this.pushDirection(Evenement.NUM_UP, 0);
                this.start = touch;
            }
        }
    }
}