import { Background } from './background.js';
import { Evenement } from './Evenement.js';
import { Serpent } from './Serpent.js';
import { Jeu } from './Jeu.js';

//########################## CONSTANTE ##########################\\

const canvas_bg = document.getElementById('background');
const canvas_fg = document.getElementById('foreground');
const caseSize = 50;
const background = new Background(canvas_bg, caseSize);

//########################## MAIN CODE ##########################\\

window.addEventListener('resize', resizeCanvas);
resizeCanvas();

let jeu = new Jeu(canvas_fg, caseSize);

let evenement = new Evenement(jeu);
evenement.addJoueur(["ArrowLeft", "ArrowUp", "ArrowRight", "ArrowDown"]);


background_animate();

//########################## MAIN FUNCTION ##########################\\

function resizeCanvas() {
    canvas_bg.width = window.innerWidth;
    canvas_bg.height = window.innerHeight;
    canvas_fg.width = window.innerWidth;
    canvas_fg.height = window.innerHeight;
    background.resize();
}

function background_animate() { 
    background.draw();
    jeu.boucler();
    
    requestAnimationFrame(background_animate);
    //setTimeout(background_animate, 350);
}