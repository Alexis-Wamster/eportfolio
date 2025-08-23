import { Background } from './background.js';

const canvas = document.getElementById('background');
const ctx = canvas.getContext('2d');

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// Utilisation :
const background = new Background(canvas, ctx);
animate();


function animate() {
    background.draw();
    requestAnimationFrame(animate);
}