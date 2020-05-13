console.log('pong');

const canvas = document.querySelector('canvas');
const ctx = canvas.getContext('2d');
const canvasWidth = 700;
const canvasHeight = 500;


// rectangle
const renderBoard = () => {
    ctx.fillStyle = 'black'
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
}
//ctx.fillStyle = 'black';
//ctx.fillRect(0, 0, canvasWidth, canvasHeight);

//circle
const renderBall = (x, y) => {
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, 2 * Math.PI, false);
    ctx.fillStyle = '#fff';
    ctx.fill();
}

//paddle
const renderPaddle = (posX, posY) => {
    const width = 20;
    const height = 60;
    ctx.fillStyle = 'blue';
    ctx.fillRect(posX, posY, width, height);
}

let goRight = true;
let posX = 10;
let posY = 10;
let vx = +2;
let vy = +2;
let paddleX = 10;
let paddleY = 10;
document.addEventListener('keypress', (event) => {
    if ( event.key === 'w') {
        paddleY -= 5
    }
    if ( event.key === 's') {
        paddleY += 5
    }
})


setInterval(() => {
    renderBoard();
    renderBall(posX, posY);
    renderPaddle(paddleX, paddleY);
    
    posX += vx;
    posY += vy;

    if (posX >= canvasWidth) {
        vx = -vx;
    }

    if (posX <= 0) {
        vx = -vx;
    }

    if (posY >= canvasHeight || posY <= 0) {
        vy = -vy;
    }

}, 20)