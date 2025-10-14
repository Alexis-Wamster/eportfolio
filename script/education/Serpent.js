import { Jeu } from './Jeu.js';
import { Evenement } from './Evenement.js';
import { Dessin } from './Dessin.js';

export class Serpent {

    static MAX_ID = 0;

    constructor(jeu, color1="white") {
        this.direction = []; // les prochaines directions saisie par l'utilisateur
        this.derniereDirection = []; // la direction du serpent
        this.color1 = color1; // interieur du serpent
        this.color2 = "black"; // contour du serpent
        this.jeu = jeu;
        this.serpent = []; // les cases serpents
        this.queueChange = []; // les cases serpents qui n'en sont plus depuis le dernier affichage
        this.teteChange = []; // les nouvelles cases serpents depuis le dernier affichage
        this.initial_time = 0; // l'heure de la dernière update visuel
        this.speed = 100; // vitesse du serpent (nombre de milliseconde par case)
        this.identifiant = Serpent.MAX_ID;
        Serpent.MAX_ID ++;

    }

    initialisation() {
        this.direction = [];
            this.derniereDirection = Evenement.RIGHT;
            this.serpent = [
                [-2,0],
                [-1,0]
            ];
            //try {this.jeu.listeCases[0][0] = Jeu.SNAKE;}catch(e){}
        
        this.queueChange = [];
        this.teteChange = [];
        this.initial_time = performance.now();
    }

    end_game(){
        this.jeu.removeSnake(this);
        this.initialisation();
    }


    update() {
        const actual_time = performance.now();
        while (actual_time >= this.initial_time + this.speed){
            this.initial_time += this.speed;

            let direction = this.derniereDirection;
            let newDirection;
            let directionHead;

            if (this.direction.length > 0) {
                newDirection = this.direction.shift();
            } else {
                newDirection = direction;
            }
            directionHead = this.getNouvelDirection(direction, newDirection);
            this.derniereDirection = newDirection;
            
            let emplacementHead = [
                this.serpent[this.serpent.length-1][0] + direction[0],
                this.serpent[this.serpent.length-1][1] + direction[1]
            ];
            if (
                emplacementHead[0] < 0 ||
                emplacementHead[0] >= this.jeu.LONGUEUR ||
                emplacementHead[1] < 0 ||
                emplacementHead[1] >= this.jeu.HAUTEUR ||
                this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]]["type"] == Jeu.SNAKE
            ){
                this.end_game();
                return;
            }
            this.serpent.push(emplacementHead);
            this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]] =
                {
                    "type": Jeu.SNAKE,
                    "direction": directionHead,
                    "color1": this.color1,
                    "color2": this.color2,
                    "id": this.identifiant,
                }
            this.teteChange.push(emplacementHead);

            if (this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]].type === Jeu.POMME){
                this.jeu.newPomme();
            }
            else {
                let tail = this.serpent.shift();
                this.queueChange.push(tail);
                try{
                    this.jeu.listeCases[tail[0]][tail[1]] = {"type": Jeu.VIDE};
                } catch (e) {}
                
            }
        }
    }


    // Fonction usuel qui renvoie la direction de Dessin à partir de:
    // oldDirection : (consante de Evenement) la direction actuel du serpent
    // newDirection : (consante de Evenement) la prochaine direction du serpent
    // => retour : (consante de Dessin) la direction du cou du serpent
    getNouvelDirection(oldDirection, newDirection) {
        switch (oldDirection) {
            case Evenement.LEFT:
                if (newDirection == Evenement.LEFT) return Dessin.LEFT;
                if (newDirection == Evenement.RIGHT) return Dessin.LEFT;
                if (newDirection == Evenement.UP) return Dessin.LEFT_TOP;
                if (newDirection == Evenement.DOWN) return Dessin.LEFT_BOTTOM;
                break;
            case Evenement.RIGHT:
                if (newDirection == Evenement.LEFT) return Dessin.RIGHT;
                if (newDirection == Evenement.RIGHT) return Dessin.RIGHT;
                if (newDirection == Evenement.UP) return Dessin.RIGHT_TOP;
                if (newDirection == Evenement.DOWN) return Dessin.RIGHT_BOTTOM;
                break;
            case Evenement.UP:
                if (newDirection == Evenement.LEFT) return Dessin.TOP_LEFT;
                if (newDirection == Evenement.RIGHT) return Dessin.TOP_RIGHT;
                if (newDirection == Evenement.UP) return Dessin.TOP;
                if (newDirection == Evenement.DOWN) return Dessin.TOP;
                break;
            case Evenement.DOWN:
                if (newDirection == Evenement.LEFT) return Dessin.BOTTOM_LEFT;
                if (newDirection == Evenement.RIGHT) return Dessin.BOTTOM_RIGHT;
                if (newDirection == Evenement.UP) return Dessin.BOTTOM;
                if (newDirection == Evenement.DOWN) return Dessin.BOTTOM;
                break;
            default:
                return Dessin.RIGHT;
        }
    }
}