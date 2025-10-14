import { Evenement } from './Evenement.js';
import { Dessin } from './Dessin.js';
import { Serpent } from './Serpent.js';

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
        this.serpents = [];
        this.lastFreeze = performance.now();
    }
    
    initialisation() {
        this.LONGUEUR = Math.floor(this.canvas.width / this.CASE_SIZE);
        this.HAUTEUR = Math.floor(this.canvas.height / this.CASE_SIZE);

        // Création tableau 2D rempli de VIDE
        this.listeCases = [];
        for (let i = 0; i < this.LONGUEUR; i++) {
            this.listeCases[i] = [];
            for (let j = 0; j < this.HAUTEUR; j++) {
                this.listeCases[i][j] = {"type": Jeu.VIDE};
            }
        }

        this.serpents.forEach(serpent => {
            serpent.initialisation();
        });
        
        //this.dessin.tout_effacer();
        this.newPomme(0,0);
        this.lastFreeze = performance.now();
    }

    toggleFreeze(){
        if (this.isFreeze){
            const time_freeze = performance.now() - this.lastFreeze;
            this.serpents.forEach(serpent => {
                serpent.initial_time += time_freeze;
            });
        }
        else{
            this.lastFreeze = performance.now();
        }
        this.isFreeze = !this.isFreeze;
    }
    
    // fait avancer le serpent de speed cases
    boucler() {
        if (!this.isFreeze){
            this.serpents.forEach(serpent => {
                serpent.update();
                this.dessin.updateSnake(serpent);
            }); 
        }
    }
    
    // Fait apparaitre une pomme sur le terrain aux coordonnées souhaité
    // Si les coordonnées ne sont pas saisie ou sont occupé, la pomme apparait sur une case aléatoire
    // Si il n'y a plus de place pour la pomme, on met fin à la partie
    // x : (entier) Coordonnée de la pomme en absisse
    // y : (entier) Coordonnée de la pomme en ordonnée
    newPomme(
        x = Math.floor(Math.random() * this.LONGUEUR),
        y = Math.floor(Math.random() * this.HAUTEUR)
    ) {
        if (this.listeCases.flat().filter(v => v.type === Jeu.VIDE).length <= 0){
            this.end_game();
            return;
        }

        while (this.listeCases[x][y].type != Jeu.VIDE) {
            x = Math.floor(Math.random() * this.LONGUEUR);
            y = Math.floor(Math.random() * this.HAUTEUR);
        }
        
        this.listeCases[x][y] = {
            "type":Jeu.POMME,
            "color1": "white",
            "color2": "black",
        };
        this.dessin.update_emplacement([x,y]);
    }
    
    // met fin à la partie
    // les éléments de jeu disparaisse et la boucle de jeu s'arrête
    end_game(){
        this.canvas.classList.add("invisible");
        this.isFreeze = true;
        this.gameOver = true;
    }

    removeSnake(serpent){
        // effacer le serpent
        serpent.serpent.forEach(corps => {
            try {this.listeCases[corps[0]][corps[1]] = {"type": Jeu.VIDE};} catch(e){}
        });
        this.dessin.removeSnake(serpent);
    }
}