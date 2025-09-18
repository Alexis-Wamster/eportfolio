import { Evenement } from './Evenement.js';
import { Dessin } from './Dessin.js';

export class Jeu {

    static VIDE = 0;
    static POMME = 1;
    static SNAKE = 2;

    constructor(canvas, caseSize) {
        this.canvas = canvas;
        this.CASE_SIZE = caseSize;
        this.dessin = new Dessin(this);
        this.listeCases = [];
        this.isFreeze = true;
        this.gameOver = true;
    }

    initialisation() {
        this.LONGUEUR = Math.floor(this.canvas.width / this.CASE_SIZE);
        this.HAUTEUR = Math.floor(this.canvas.height / this.CASE_SIZE);

        // Création tableau 2D rempli de VIDE
        this.listeCases = [];
        for (let i = 0; i < this.LONGUEUR; i++) {
            this.listeCases[i] = [];
            for (let j = 0; j < this.HAUTEUR; j++) {
                this.listeCases[i][j] = Jeu.VIDE;
            }
        }

        this.direction = [];
        this.derniereDirection = Evenement.RIGHT;

        this.serpent = [
            { emplacement:[-1,0], direction: Dessin.RIGHT },
            { emplacement:[0,0],  direction: Dessin.RIGHT }
        ];

        this.listeCases[0][0] = Jeu.SNAKE;
        this.newPomme(1,0);
        this.dessin.tout_effacer();
    }

    updateView(time){
        this.dessin.update(time);
    }


    newPomme(
        x = Math.floor(Math.random() * this.LONGUEUR),
        y = Math.floor(Math.random() * this.HAUTEUR)
    ) {
        if (this.listeCases.flat().filter(v => v === Jeu.VIDE).length <= 0){
            this.end_game();
            return;
        }

        while (this.listeCases[x][y] != Jeu.VIDE) {
            x = Math.floor(Math.random() * this.LONGUEUR);
            y = Math.floor(Math.random() * this.HAUTEUR);
        }
        
        this.listeCases[x][y] = Jeu.POMME;
        this.dessin.draw_apple([x,y], "white", this.CASE_SIZE*0.4);
    }

    end_game(){
        this.canvas.classList.add("invisible");
        this.isFreeze = true;
        this.gameOver = true;
    }
}