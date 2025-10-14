import { Jeu } from './Jeu.js';
import { Dessin } from './Dessin.js';
import { Evenement } from './Evenement.js';

export class Boucle {
    constructor(jeu) {
        this.jeu = jeu;
        this.time = 0;
        this.speed = 0.2;
    }

    boucler() {
        if (this.jeu.isFreeze == false){
            this.time += this.speed;
            if (this.time > 1) {
                this.time --;
                this.nextStep();
            }
            this.jeu.updateView(this.time);
        }        
    }

    nextStep() {
        let direction = this.jeu.derniereDirection;
        let newDirection;
        let directionHead;

        if (this.jeu.direction.length > 0) {
            newDirection = this.jeu.direction.shift();
        } else {
            newDirection = direction;
        }
        directionHead = this.getNouvelDirection(direction, newDirection);
        this.jeu.derniereDirection = newDirection;
        
        let emplacementHead = [
                this.jeu.serpent[this.jeu.serpent.length-1]["emplacement"][0] + direction[0],
                this.jeu.serpent[this.jeu.serpent.length-1]["emplacement"][1] + direction[1]
            ];
        
        if (emplacementHead[0] < 0 ||
            emplacementHead[0] >= this.jeu.LONGUEUR ||
            emplacementHead[1] < 0 ||
            emplacementHead[1] >= this.jeu.HAUTEUR ||
            this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]] == Jeu.SNAKE
        ){
            this.jeu.end_game();
            return;
        }
        this.jeu.serpent.push({"emplacement": emplacementHead, "direction": directionHead});


        if (this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]] == Jeu.POMME){
            this.jeu.newPomme();
        }
        else {
            let tail = this.jeu.serpent.shift();
            try{
                this.jeu.listeCases[tail["emplacement"][0]][tail["emplacement"][1]] = Jeu.VIDE;
            } catch (e) {}
            
        }
        
        this.jeu.listeCases[emplacementHead[0]][emplacementHead[1]] = Jeu.SNAKE;
    }

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