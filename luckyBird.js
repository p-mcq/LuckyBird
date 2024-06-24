// Remake of flappy bird game
//#region Variables Key To the Game 

// Constants for game Settings
const GAME_CANVAS_WIDTH = 288;
const GAME_CANVAS_HEIGHT = 512;
const SPACEBAR_KEY = " ";
const GRAVITY = 1;

// Game State Variables
let gameCanvas;
let ctx;
let gameStarted = false;
// Pause Game or Play Game
let pause = false;
// For Slow-mo mode
let isSlowMo = false;
// Tracking if the game is over 
let isGameOver = false;
// Score Variable
let score = 0;
// for the best score in the current session
let bestSessionScore = 0;


// Images
let birdImage = new Image();
birdImage.src = "imgs/BG.png";

// Gravity Variable
let gravity = 1;

// the cat/bird
let bird = {
    x: GAME_CANVAS_WIDTH / 8,
    y: GAME_CANVAS_HEIGHT / 2,
    width: 20,
    height: 20,
};

//#region Slow Down Timer
let slowDownTimer = {
    x: GAME_CANVAS_WIDTH - 20,
    y: GAME_CANVAS_HEIGHT - 40,
    radius: 15,
};

let slowDownTimerFillAmount = 1;
//#endregion

//#region Pipes
let pipes = [];

//#endregion

//#endregion
window.onload = function () {
    gameCanvas = document.getElementById("gameCanvas");
    ctx = gameCanvas.getContext("2d");
    DrawSplashScreen();

    gameCanvas.addEventListener('click', function () {
        if (!gameStarted) {
            gameStarted = true;
            // Call your game's start or main loop function here
            Initalise();
            requestAnimationFrame(Update);
        }
    });
};

//#region Input
// input to move the bird up and down
window.onkeydown = function (event) {
    if (event.key === " " || event.key === "ArrowUp" || event.key === "w") {
        if (pause) { return; }
        let difference = 50;
        if (bird.y - 50 < 0) {
            difference = bird.y - 20;
        }
        gsap.to(bird, { y: bird.y - difference, duration: 0.15, ease: "power4.in" });
    }

    // input to make the bird fall quicker when the s key is pressed and held
    if (event.key === "s") {
        if (pause) { return; }
        // Prevent escaping the bounds of the screen
        let difference = 50;
        if (bird.y + 50 > GAME_CANVAS_HEIGHT) {
            difference = (GAME_CANVAS_HEIGHT - 20) - bird.y;
        }
        gsap.to(bird, { y: bird.y + difference, duration: 0.15, ease: "power4.in" });
    }

    // Pause/Unpause the game
    if (event.key === "p") {
        pause = !pause;
    }

    // Slow down the game
    if (event.key === "Control") {
        if (pause) { return; }
        isSlowMo = true;
    }
}


window.onmousedown = function (event) {
    if (pause) {
        Initalise();
        requestAnimationFrame(Update);
    }
    else {
        let difference = 50;
        if (bird.y - 50 < 0) {
            difference = bird.y - 20;
        }
        gsap.to(bird, { y: bird.y - difference, duration: 0.15, ease: "power4.in" });
    }
}

window.onkeyup = function (event) {
    if (event.key === "Control") {
        isSlowMo = false;
    }
}
//#endregion


function HandleSlowMo(pipeToSlowDown) {

    if (isSlowMo && slowDownTimerFillAmount > 0) {
        gravity = 0.75;
        bird.y += gravity;
        if (pipeToSlowDown != null) {
            pipeToSlowDown.x -= 1;
        }
    }
    else {
        gravity = 1.25;
        bird.y += gravity;
        if (pipeToSlowDown != null) {
            pipeToSlowDown.x -= 2;
        }
    }

    if (bird.y + bird.height > GAME_CANVAS_HEIGHT) {
        bird.y = GAME_CANVAS_HEIGHT - bird.height - 20;
    }
}

// Initalise the game, or reset it on game over
function Initalise() {
    pause = false;
    isSlowMo = false;
    isGameOver = false;
    score = 0;
    pipes = [];
    bird.y = GAME_CANVAS_HEIGHT / 2;
    const pipe1 = GeneratePipes(GAME_CANVAS_WIDTH);
    const pipe2 = GeneratePipes(GAME_CANVAS_WIDTH * 1.5);
    pipes.push(pipe1, pipe2);
    slowDownTimerFillAmount = 1;

    // requestAnimationFrame(Update);
}


function GeneratePipes(x = GAME_CANVAS_WIDTH) {
    let topPipeHeight = Math.floor(Math.random() * 200) + 50;
    let bottomPipeHeight = GAME_CANVAS_HEIGHT - 20 - topPipeHeight - 85;
    let pipe = {
        x,
        topPipeHeight: topPipeHeight,
        bottomPipeHeight: bottomPipeHeight,
    };
    return pipe;
}
//#endregion

function DrawSplashScreen() {
    // Check and make sure the image is loaded before drawing it
    if (birdImage.complete && birdImage.naturalHeight !== 0) {
        ctx.drawImage(birdImage, 0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);
    }

    // draw the title of the game
    ctx.font = '40px Arial';
    ctx.fontWeight = 'bold';
    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.fillText('Lucky Bird', GAME_CANVAS_WIDTH / 2, 100);

    // draw the instructions
    ctx.font = '20px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Press Space to Jump', GAME_CANVAS_WIDTH / 2, GAME_CANVAS_HEIGHT - 190);
    ctx.fillText('Press Control to Slow Down', GAME_CANVAS_WIDTH / 2, GAME_CANVAS_HEIGHT - 140);
    ctx.fillText('Press S to Fall Faster', GAME_CANVAS_WIDTH / 2, GAME_CANVAS_HEIGHT - 90);

    // Draw Click to start
    ctx.font = '30px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'center';
    ctx.fillText('Click to Start', GAME_CANVAS_WIDTH / 2, GAME_CANVAS_HEIGHT - 40);
}

function DrawGameOverScreen() {
    // Draw a slightly transparent red rectangle over the whole canvas
    ctx.fillStyle = "rgba(255, 0, 0, 0.5)";
    ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);

    // Draw text in the middle of the canvas to say game over
    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText(
        "Game Over",
        GAME_CANVAS_WIDTH / 2,
        GAME_CANVAS_HEIGHT / 2
    );
    if (score > bestSessionScore) {
        bestSessionScore = score;
    }
    // Draw text below the game over text to say the score
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(
        "Highest Score: " + bestSessionScore,
        GAME_CANVAS_WIDTH / 2,
        GAME_CANVAS_HEIGHT / 2 + 25
    );

    // Draw text below the game over text to say press space to restart
    ctx.fillStyle = "black";
    ctx.font = "20px Arial";
    ctx.fillText(
        "Click to Restart",
        GAME_CANVAS_WIDTH / 2,
        GAME_CANVAS_HEIGHT / 2 + 50
    );
}

function Update() {

    if (!gameStarted) {
        DrawSplashScreen();
        return;
    }

    if (isGameOver) {
        DrawGameOverScreen();
        return;
    }

    requestAnimationFrame(Update);
    // Clear the canvas
    ctx.clearRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT);


    // draw the sky
    ctx.fillStyle = "LightBlue";
    ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, GAME_CANVAS_HEIGHT - 20);


    // draw a lucky bird
    ctx.fillStyle = "green";
    ctx.fillRect(bird.x, bird.y, bird.width, bird.height);
    // centre right aligned inside the bird, draw another rectangle
    ctx.fillStyle = "blue";
    ctx.fillRect(
        bird.x + bird.width / 2,
        bird.y + bird.height / 4,
        bird.width / 2,
        bird.height / 2
    );

    // gravity
    if (!pause) {
        HandleSlowMo();
    }

    // draw the pipes
    let shouldShift = false;
    let newPipe = null;

    pipes.forEach((pipe) => {
        ctx.fillStyle = "green";
        ctx.fillRect(pipe.x, 0, 20, pipe.topPipeHeight);
        ctx.fillRect(
            pipe.x,
            GAME_CANVAS_HEIGHT - pipe.bottomPipeHeight,
            20,
            pipe.bottomPipeHeight
        );

        // Is the game paused?
        if (!pause) {
            HandleSlowMo(pipe);
        }

        if (pipe.x < -20) {
            shouldShift = true;
        }
    });

    if (shouldShift) {
        pipes.shift();
        newPipe = GeneratePipes();
        pipes.push(newPipe); 0
        score++;
    }

    // draw the ground
    ctx.fillStyle = "Black";
    ctx.fillRect(0, GAME_CANVAS_HEIGHT - 20, GAME_CANVAS_WIDTH, 20);

    // draw a section of black at the top of the screen to to display the score
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, GAME_CANVAS_WIDTH, 20);
    // Draw the score text
    ctx.fillStyle = "white";
    ctx.font = "20px Arial";
    ctx.fillText(
        "Score: " + score, // Insert Score Variable here
        50,
        18
    );

    // prevent the bird from flying off the top of the screen
    if (bird.y < 0) {
        bird.y = 0;
    }

    if (isSlowMo) {
        slowDownTimerFillAmount -= 0.01;
        if (slowDownTimerFillAmount < 0) {
            slowDownTimerFillAmount = 0;
        }
    }
    else {
        slowDownTimerFillAmount += 0.005;
        if (slowDownTimerFillAmount > 1) {
            slowDownTimerFillAmount = 1;
        }
    }

    let slowDownTimerStartingAngle = -Math.PI / 2;
    let slowDownTimerEndingAngle = slowDownTimerFillAmount * Math.PI * 2 - Math.PI / 2;

    // Draw a circle in the bottom right corner to represent the slow down timer
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.moveTo(slowDownTimer.x, slowDownTimer.y); // Move to the center of the circle
    ctx.arc(
        slowDownTimer.x,
        slowDownTimer.y,
        slowDownTimer.radius,
        slowDownTimerStartingAngle,
        slowDownTimerEndingAngle
    );
    ctx.closePath(); // Close the path
    ctx.fill(); // Fill the "pie slice"


    // check for collision with pipes
    for (let i = 0; i < pipes.length; i++) {
        let pipe = pipes[i];
        if (bird.x + bird.width > pipe.x && bird.x < pipe.x + 20) {
            if (
                bird.y < pipe.topPipeHeight ||
                bird.y + bird.height > GAME_CANVAS_HEIGHT - pipe.bottomPipeHeight
            ) {
                isGameOver = true;
                pause = true;
            }
        }
    }
}