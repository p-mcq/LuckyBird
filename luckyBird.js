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
//#region Pipes
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
//#endregion

//#region Input
// input to move the bird up and down
window.onkeydown = function (event) {
    if (event.key === " ") {
        bird.y -= 50;
    }
}
//#endregion 

// function to rotate the bird as it's falling and reset the position on click



window.onload = function () {
    gameCanvas = document.getElementById('gameCanvas');
    ctx = gameCanvas.getContext('2d');

    requestAnimationFrame(Update);
    setInterval(GeneratePipes, 1500);
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
    // Right aligned inside the bird, draw another rectangle
    ctx.fillStyle = "blue";
    ctx.fillRect(bird.x + bird.width / 2, bird.y + bird.height / 2, bird.width / 2, bird.height / 2);
    bird.y += 1.5;

    // draw the pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, 20, pipe.topPipeHeight);
        ctx.fillRect(pipe.x, gameCanvasHeight - pipe.bottomPipeHeight, 20, pipe.bottomPipeHeight);
        pipe.x -= 2;
        if (pipe.x < -20) {
            pipes.splice(i, 1);
        }
    }

    // draw the ground
    ctx.fillStyle = "Black";
    ctx.fillRect(0, gameCanvasHeight - 20, gameCanvasWidth, 20);

    // check for collision
    if (bird.y + bird.height > gameCanvasHeight - 20) {
        bird.y = gameCanvasHeight - 20 - bird.height;
    }
    // prevent the bird from flying off the top of the screen
    if (bird.y < 0) {
        bird.y = 0;
    }

    // check for collision with pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + 20) {
            if (bird.y < pipe.topPipeHeight || bird.y + bird.height > gameCanvasHeight - pipe.bottomPipeHeight) {
                // Pause the game and show a message
                ctx.fillStyle = "red";
                ctx.font = "30px Arial";
                ctx.fillText("Game Over", gameCanvasWidth / 2 - 100, gameCanvasHeight / 2);
                // stop the game
                pipes = [];
                bird.y = gameCanvasHeight / 2;
            }
        }
    }

}