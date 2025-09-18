import { Jeu } from './Jeu.js';

export class Dessin {

    static LEFT = 0
    static RIGHT = 1
    static TOP = 2
    static BOTTOM = 3

    static TOP_LEFT = 10;
    static TOP_RIGHT = 8;
    static BOTTOM_RIGHT = 6;
    static BOTTOM_LEFT = 4;

    static LEFT_TOP = 7;
    static RIGHT_TOP = 5;
    static RIGHT_BOTTOM = 11;
    static LEFT_BOTTOM = 9;

    constructor(jeu){
        this.epaisseur = jeu.CASE_SIZE * 0.6
        this.jeu = jeu;
        this.canvas = this.jeu.canvas;
        this.ctx = this.canvas.getContext("2d")
    }

    update(time, pomme) {

        // corps
        let emplacement = this.jeu.serpent[this.jeu.serpent.length - 2]["emplacement"]
        let direction = this.jeu.serpent[this.jeu.serpent.length - 2]["direction"]
        this.effacer_emplacement(emplacement)
        this.draw_snake(emplacement, direction, 0, 0, "white", this.epaisseur);

        // queue
        emplacement = this.jeu.serpent[0]["emplacement"]
        direction = this.jeu.serpent[0]["direction"]
        this.effacer_emplacement(emplacement)
        this.effacer_emplacement(Dessin.previous_emplacement(emplacement, direction))
        this.draw_snake(emplacement, direction, 0, time, "white", this.epaisseur);      

        // tete
        emplacement = this.jeu.serpent[this.jeu.serpent.length - 1]["emplacement"]
        direction = this.jeu.serpent[this.jeu.serpent.length - 1]["direction"]
        this.draw_snake(emplacement, direction, 1, time, "white", this.epaisseur);
        
        //this.draw_apple(pomme, "white", this.jeu.CASE_SIZE*0.4);
    }

    static previous_emplacement(emplacement, direction){
        if ((direction === Dessin.LEFT) || (direction === Dessin.LEFT_TOP) || (direction === Dessin.LEFT_BOTTOM)){
            return [emplacement[0]+1, emplacement[1]];
        }
        if ((direction === Dessin.RIGHT) || (direction === Dessin.RIGHT_TOP) || (direction === Dessin.RIGHT_BOTTOM)){
            return [emplacement[0]-1, emplacement[1]];
        }
        if ((direction === Dessin.TOP) || (direction === Dessin.TOP_LEFT) || (direction === Dessin.TOP_RIGHT)){
            return [emplacement[0], emplacement[1]+1];
        }
        if ((direction === Dessin.BOTTOM) || (direction === Dessin.BOTTOM_LEFT) || (direction === Dessin.BOTTOM_RIGHT)){
            return [emplacement[0], emplacement[1]-1];
        }
        return emplacement;
    }

    effacer_emplacement(emplacement){
        this.ctx.clearRect(
            emplacement[0]* this.jeu.CASE_SIZE,
            emplacement[1]* this.jeu.CASE_SIZE,
            this.jeu.CASE_SIZE,
            this.jeu.CASE_SIZE
        );
    }

    tout_effacer(){
        this.ctx.clearRect(0,0,this.jeu.canvas.width, this.jeu.canvas.height);
    }

    draw_apple(emplacement, color, epaisseur) {
        const circle = [
            (emplacement[0] + 0.5) * this.jeu.CASE_SIZE,
            (emplacement[1] + 0.5) * this.jeu.CASE_SIZE
        ];
        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(circle[0], circle[1], epaisseur / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    draw_snake(emplacement, direction, sens, progress, color, epaisseur) {

        const DIRECTIONS = [
            [1,0.5], [0,0.5], [0.5,1], [0.5,0],  // straight: left, right, up, down
            [0,0], [0,0], // turn: bottom_left, right_up
            [1,0], [1,0], // turn: bottom_right, left_up
            [1,1], [1,1], // turn: top_right, left_down
            [0,1], [0,1], // turn: top_left, right_down
        ]
        if (direction < 4) {
            this.draw_straight(emplacement, DIRECTIONS[direction], sens, progress, color, epaisseur);
        }
        else {
            this.draw_turn(emplacement, DIRECTIONS[direction], direction%2, sens, progress, color, epaisseur);
        }
    }

    // dessine la partie droite du serpent sur une case
    // emplacement : (tableau de 2) numéro de la case
    // direction : (tableau de 2 entiers compris entre 0 et 1) co1onée du coté de la case d'ou part le serpent
    // sens : (0 ou 1) sens du serpent (0=queue, 1=tete)
    // progress : (nombre entre 0 et 1) niveau de progression du serpent sur la case
    // color : couleur du serpent
    // epaisseur : épaisseur du serpent
    draw_straight(emplacement, direction, sens, progress, color, epaisseur) {
        const edge1 = [
            (emplacement[0]+direction[0]) * this.jeu.CASE_SIZE,
            (emplacement[1]+direction[1]) * this.jeu.CASE_SIZE
        ];

        const edge2 = [
            (emplacement[0] + 1-direction[0]) * this.jeu.CASE_SIZE,
            (emplacement[1] + 1-direction[1]) * this.jeu.CASE_SIZE
        ];
        const circle = [
            edge1[0] + (edge2[0] - edge1[0]) * progress,
            edge1[1] + (edge2[1] - edge1[1]) * progress
        ];

        const start = (sens === 0 ? edge2 : edge1);

        this.ctx.fillStyle = color;
        
        // Dessiner le segment
        this.ctx.save();
        this.ctx.fillRect(
            start[0]-(direction[0] === 0.5 ? 0.5 : 0)*epaisseur,
            start[1]-(direction[1] === 0.5 ? 0.5 : 0)*epaisseur,
            circle[0]-start[0]+(direction[0] === 0.5 ? 0.5 : 0)*epaisseur*2,
            circle[1]-start[1]+(direction[1] === 0.5 ? 0.5 : 0)*epaisseur*2
        );
        this.ctx.restore();

        // Dessiner le cercle
        this.ctx.beginPath();
        this.ctx.arc(circle[0], circle[1], epaisseur / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }


    // dessine la partie arrondie du serpent sur une case
    // emplacement : (tableau de 2) numéro de la case
    // direction : (tableau de 2 entiers compris entre 0 et 1) coin de la case où se trouve le virage
    // axe_first_side : (0 ou 1) axe du premier côté du virage (0=horizontal, 1=vertical)
    // sens : (0 ou 1) sens du serpent (0=queue, 1=tete)
    // progress : (nombre entre 0 et 1) niveau de progression du serpent sur la case
    // color : couleur du serpent
    // epaisseur : épaisseur du serpent
    draw_turn(emplacement, direction, axe_first_side, sens, progress, color, epaisseur) {    
        // Calculer le coin de la case
        const corner = [
            (emplacement[0]+direction[0]) * this.jeu.CASE_SIZE,
            (emplacement[1]+direction[1]) * this.jeu.CASE_SIZE
        ];
        // Calculer le milieu du premier côté à partir du coin, et de l'axe de ce côté'
        let axe_bonus = axe_first_side
        let edge1 = [corner[0], corner[1]];
        edge1[axe_bonus] += (this.jeu.CASE_SIZE / 2) * (direction[axe_bonus] === 0 ? 1 : -1);
        const angle1 = Math.atan2(edge1[1] - corner[1], edge1[0] - corner[0]);

        // Calculer le milieu du deuxième côté à partir du coin, et de l'axe de ce côté'
        axe_bonus = (axe_first_side+1)%2
        let edge2 = [corner[0], corner[1]];
        edge2[axe_bonus] += (this.jeu.CASE_SIZE / 2) * (direction[axe_bonus] === 0 ? 1 : -1);
        const angle2 = Math.atan2(edge2[1] - corner[1], edge2[0] - corner[0]);

        // Interpoler l'angle selon progress
        let delta = angle2 - angle1;
        delta = Dessin.normalizeAngle(delta);  // force la différence dans [-π, π]
        const interpAngle = angle1 + delta * progress;


        // Position du cercle sur l'arc
        const radius = this.jeu.CASE_SIZE / 2;
        const circle = [
            corner[0] + radius * Math.cos(interpAngle),
            corner[1] + radius * Math.sin(interpAngle)
        ];

        // Position de l'arc et son sens
        const angle3 = Math.atan2(circle[1] - corner[1], circle[0] - corner[0]);
        let start = (sens === 0 ? angle2 : angle1);

        // Sens de parcours en fonction du signe de diff
        let anticlockwise = Dessin.shortestIsTrigo(angle3, start)

        this.ctx.fillStyle = color;
        // Dessiner l'arc
        this.ctx.save();
        this.ctx.beginPath();
        this.ctx.strokeStyle = color;
        this.ctx.lineWidth = epaisseur;
        this.ctx.arc(corner[0], corner[1], radius, start, angle3, anticlockwise);
        this.ctx.stroke();
        this.ctx.restore();

        // Dessiner le cercle
        this.ctx.beginPath();
        this.ctx.arc(circle[0], circle[1], epaisseur / 2, 0, 2 * Math.PI);
        this.ctx.fill();
    }

    static normalizeAngle(angle) {
        return Math.atan2(Math.sin(angle), Math.cos(angle));
    }

    // renvoie l'angle dans le sens trigonométrique de a vers b
    static angleTrigo(a, b) {
        a = Dessin.normalizeAngle(a);
        b = Dessin.normalizeAngle(b);

        let diff = b - a;
        // remet diff dans [0, 2π)
        if (diff < 0) diff += 2 * Math.PI;

        // cas particulier : si a et b représentent le même point (π et -π)
        if (Math.abs(diff - 2 * Math.PI) < 1e-12) return 0;

        return diff;
    }

    // renvoie true si le plus court chemin est dans le sens trigonométrique
    static shortestIsTrigo(a, b) {
        return Dessin.angleTrigo(a, b) <= Math.PI; // égalité = les 2 chemins sont équivalents
    }
}