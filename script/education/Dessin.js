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

    updateSnake(serpent) {
        const time = Math.min(1,(performance.now()-serpent.initial_time)/serpent.speed);
        const taille = serpent.serpent.length

        this.effacer_ancienne_position(serpent);

        if (taille === 1){
            // TODO
        }
        else {
            const tete = serpent.serpent[taille - 1];
            const bout = serpent.serpent[0];
            const infoTete = this.getInfoCase(tete);
            const infoBout = this.getInfoCase(bout);

            // contours
            this.effacer_emplacement(bout);
            this.draw_snake(bout, infoBout, 0, time, 2, this.epaisseur+5);
            this.draw_snake(tete, infoTete, 1, time, 2, this.epaisseur+5);

            if (taille >= 3){
                const cou = serpent.serpent[taille - 2];
                const infoCou = this.getInfoCase(cou);
                this.effacer_emplacement(cou);
                this.draw_snake(cou, infoCou, 1, 1, 2, this.epaisseur+5);

                if (taille > 3){
                    // en cas de lag, dessiner tout ce qui à évolué (pas juste le cou du serpent)
                    const minIndex = Math.max(1, serpent.serpent.length - serpent.teteChange.length - 1);
                    const maxIndex = serpent.serpent.length-2;
                    let i;
                    for (i=minIndex;i<maxIndex;i++){
                        const body = serpent.serpent[i];
                        const infoBody = this.getInfoCase(body);
                        this.draw_snake(body, infoBody, 1, 1, 2, this.epaisseur+5);
                    }
                    // interieur
                    for (i=minIndex;i<maxIndex;i++){
                        const body = serpent.serpent[i];
                        const infoBody = this.getInfoCase(body);
                        this.draw_snake(body, infoBody, 1, 1, 1, this.epaisseur);
                    }

                    // redessiner par dessus le contours (en bas du corps et sur la queue)
                    i = minIndex - 1;
                    if (i > 0){
                        if (i > 1){
                            const body = serpent.serpent[i];
                            const infoBody = this.getInfoCase(body);
                            this.draw_snake(body, infoBody, 1, 1, 1, this.epaisseur);
                        }
                        const queue = serpent.serpent[1];
                        const infoQueue = this.getInfoCase(queue);
                        this.draw_snake(queue, infoQueue, 1, 1, 1, this.epaisseur);
                 
                    }
                    
                }
                this.draw_snake(cou, infoCou, 1, 1, 1, this.epaisseur);
            }

            this.draw_snake(bout, infoBout, 0, time, 1, this.epaisseur);
            this.draw_snake(tete, infoTete, 1, time, 1, this.epaisseur);
            
        }
        serpent.teteChange.length = 0;     
    }

    getInfoCase(emplacement){
        try{
            return this.jeu.listeCases[emplacement[0]][emplacement[1]];
        }catch(e){
            return undefined;
        }
    }

    removeSnake(serpent){
        this.effacer_ancienne_position(serpent);

        // effacer le serpent
        serpent.serpent.forEach(corps => {
            this.jeu.dessin.effacer_emplacement(corps);
        });
        const tete = serpent.serpent[serpent.serpent.length-1];
        const direction = this.getInfoCase(tete);
        this.update_emplacement(Dessin.nextEmplacement(tete, direction));
    }

    colorCase(emplacement, color){
        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            emplacement[0]* this.jeu.CASE_SIZE,
            emplacement[1]* this.jeu.CASE_SIZE,
            this.jeu.CASE_SIZE,
            this.jeu.CASE_SIZE
        );
    }

    static getRandomColor() {
        var letters = '0123456789ABCDEF';
        var color = '#';
        for (var i = 0; i < 6; i++) {
            color += letters[Math.floor(Math.random() * 16)];
        }
        return color;
    }



    // effacer les ancienne position du serpent
    effacer_ancienne_position(serpent){
        const body = (serpent.queueChange.length <= 0) ? serpent.serpent[0] : serpent.queueChange[0];
        try{
            const bodyInfo = this.getInfoCase(body);
            const emplacement_ancienne_queue = Dessin.previousEmplacement(body, bodyInfo.direction);
            this.update_emplacement(emplacement_ancienne_queue);
        }
        catch(e){}
        
        let i;
        for (i in serpent.queueChange){
            const body = serpent.queueChange[i];
            this.update_emplacement(body);
        }
        serpent.queueChange.length = 0;
    }

    static nextEmplacement(emplacement, direction){
        if ((direction === Dessin.LEFT) || (direction === Dessin.BOTTOM_LEFT) || (direction === Dessin.TOP_LEFT)){
            return [emplacement[0]-1, emplacement[1]];
        }
        if ((direction === Dessin.RIGHT) || (direction === Dessin.TOP_RIGHT) || (direction === Dessin.BOTTOM_RIGHT)){
            return [emplacement[0]+1, emplacement[1]];
        }
        if ((direction === Dessin.TOP) || (direction === Dessin.LEFT_TOP) || (direction === Dessin.RIGHT_TOP)){
            return [emplacement[0], emplacement[1]-1];
        }
        if ((direction === Dessin.BOTTOM) || (direction === Dessin.LEFT_BOTTOM) || (direction === Dessin.RIGHT_BOTTOM)){
            return [emplacement[0], emplacement[1]+1];
        }
        return emplacement;
    }

    static previousEmplacement(emplacement, direction){
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

    update_emplacement(emplacement, progress=0, effacer=true, color2=true, color1=true){
        try{
            const info = this.getInfoCase(emplacement);
            if (effacer || info.type === Jeu.VIDE){this.effacer_emplacement(emplacement);}
            switch (info.type) {
                case Jeu.POMME:
                    if(color2){this.draw_apple(emplacement, info.color2, this.jeu.CASE_SIZE*0.4+5)};
                    if(color1){this.draw_apple(emplacement, info.color1, this.jeu.CASE_SIZE*0.4)};
                    break;
                case Jeu.SNAKE:
                    const dernier = true;
                    const premier = true;
                    try{
                        const precedant = previousEmplacement(emplacement, info.direction);
                        const info2 = this.getInfoCase(precedant);
                        dernier = !(info2.type == Jeu.SNAKE && info2.id == info.id);
                    }catch(e){}
                    try{
                        const suivant = nextEmplacement(emplacement, info.direction);
                        const info2 = this.getInfoCase(suivant);
                        premier = !(info2.type == Jeu.SNAKE && info2.id == info.id);
                    }catch(e){}
                    const time = (dernier || premier) ? progress : 1;
                    const sens =  (dernier) ? 1 : 0;
                    this.draw_snake(emplacement, info, sens, time, this.epaisseur+5);
                    this.draw_snake(emplacement, info, sens, time, this.epaisseur);
            
                default:
                    break;
            }
        }
        catch(e){}
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

    draw_snake(emplacement, infoCase, sens, progress, numColor, epaisseur) {
        if (infoCase){
            const DIRECTIONS = [
                [1,0.5], [0,0.5], [0.5,1], [0.5,0],  // straight: left, right, up, down
                [0,0], [0,0], // turn: bottom_left, right_up
                [1,0], [1,0], // turn: bottom_right, left_up
                [1,1], [1,1], // turn: top_right, left_down
                [0,1], [0,1], // turn: top_left, right_down
            ]
            if (infoCase.direction < 4) {
                this.draw_straight(
                    emplacement,
                    DIRECTIONS[infoCase.direction],
                    sens,
                    progress,
                    infoCase["color"+numColor],
                    epaisseur
                );
            }
            else {
                this.draw_turn(
                    emplacement,
                    DIRECTIONS[infoCase.direction],
                    infoCase.direction%2,
                    sens,
                    progress,
                    infoCase["color"+numColor],
                    epaisseur
                );
            }
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
        //arrondir pour éviter les problème
        progress = Math.round(progress * 1e6) / 1e6;
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
        let anticlockwise = Dessin.shortestIsTrigo(angle3, start);

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
        if (Math.abs(diff - 2 * Math.PI) < 0) return 0;

        return diff;
    }

    // renvoie true si le plus court chemin est dans le sens trigonométrique
    static shortestIsTrigo(a, b) {
        return Dessin.angleTrigo(a, b) <= Math.PI; // égalité = les 2 chemins sont équivalents
    }

    static arcDegrees(start, end, anticlockwise) {
        // Normalise dans [0, 2π)
        const norm = angle => (angle % (2*Math.PI) + 2*Math.PI) % (2*Math.PI);
        start = norm(start);
        end   = norm(end);

        let angle;
        if (anticlockwise) {
            angle = (end - start + 2*Math.PI) % (2*Math.PI);
        } else {
            angle = (start - end + 2*Math.PI) % (2*Math.PI);
        }

        return angle * 180 / Math.PI; // conversion radians → degrés
    }



}