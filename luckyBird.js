// Remake of flappy bird game
let gameCanvas;
let gameCanvasWidth = 288;
let gameCanvasHeight = 512;
let ctx;

// the cat/bird
let bird =
{
    x: gameCanvasWidth / 8,
    y: gameCanvasHeight / 2,
    width: 20,
    height: 20
};

let pipes = [];

function GeneratePipes() {
    let topPipeHeight = Math.floor(Math.random() * 200) + 50;
    let bottomPipeHeight = gameCanvasHeight - 20 - topPipeHeight - 100;
    let pipe = {
        x: gameCanvasWidth,
        topPipeHeight: topPipeHeight,
        bottomPipeHeight: bottomPipeHeight
    };
    pipes.push(pipe);
}

window.onload = function () {
    gameCanvas = document.getElementById('gameCanvas');
    ctx = gameCanvas.getContext('2d');

    requestAnimationFrame(Update);
};

function Update() {
    requestAnimationFrame(Update);
    ctx.clearRect(0, 0, gameCanvasWidth, gameCanvasHeight);
    // draw the sky
    ctx.fillStyle = "LightBlue";
    ctx.fillRect(0, 0, gameCanvasWidth, gameCanvasHeight - 20);

    // draw a lucky bird
    ctx.fillStyle = "green";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);

    // draw the ground
    ctx.fillStyle = "Black";
    ctx.fillRect(0, gameCanvasHeight - 20, gameCanvasWidth, 20);

    // draw the pipes
    ctx.fillStyle = "green";

    ctx.fillRect(100, 0, 20, 200); // top pipe
    ctx.fillRect(100, 312, 20, gameCanvasHeight - 332); // bottom pipe

    // draw the pipes
    GeneratePipes();

}