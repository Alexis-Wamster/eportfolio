export class snake{

    // attributs
    direction = 'right'; // up, down, left, right
    body = []; // tableau de segments {x, y}
    speed = 1; // cases par frame

    constructor(){

    }

    reset(){
        this.direction = 'right';
    }
}