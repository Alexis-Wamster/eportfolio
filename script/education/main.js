import { Background } from './background.js';

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');
const background = new Background(canvas, ctx, 50);

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    background.resize();
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Utilisation :

animate();


function animate() {
    background.draw();
    requestAnimationFrame(animate);
}