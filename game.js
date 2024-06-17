const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')
canvas.width = 448
canvas.height = 400

let gameStart = false

//VARIABLES DEL CAMPO
const TOP_POSITION_X = 0
const TOP_POSITION_Y = 35
const TOP_WIDTH = canvas.width
const TOP_HEIGHT = 5

//VARIABLES DEL SCORE
const PADDING_SCORE_TOP = 25
const PADDING_SCORE_CENTER = 95
const POSITION_SCORE_LEFT = (canvas.width/2) - PADDING_SCORE_CENTER
const POSITION_SCORE_RIGHT = (canvas.width/2) + PADDING_SCORE_CENTER

let scorePlayerLeft = 0;
let scorePlayerRight = 0;

//VARIABLES DEL TIMER
const POSITION_TIME_WIDTH = canvas.width / 2

let time = Date.now();

//VARIABLES DE LA PELOTA
const ballRadius = 5;

let ballX = canvas.width / 2 + 2
let ballY = canvas.height / 2

let ballSpeedX = 1
let ballSpeedY = 1

//VARIABLE PALETA
const PADDLE_SENSITIVITY = 4
const PADDLE_WIDTH = 5;
const PADDLE_HEIGHT = 35;

let arrowUpPressed = false;
let arrowDownPressed = false;

let charUpPressed = false;
let charDownPressed = false;

let paddleLeftX = 0 + PADDLE_WIDTH;
let paddleLeftY = canvas.height / 2

let paddleRightX = canvas.width - PADDLE_WIDTH * 2;
let paddleRightY = canvas.height / 2

//BLINKING ANIMATION
const blinkInterval = 1000;
let lastTime = 0;
let showText = true;

function drawBall()
{
    ctx.beginPath()
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2)
    ctx.fillStyle = '#fff'
    ctx.fill()
    ctx.closePath()
}

function ballMovement()
{
    if (
        ballY + ballSpeedY < 0 - ballRadius + TOP_POSITION_Y + (TOP_HEIGHT * 3) ||
        ballY + ballSpeedY > canvas.height - ballRadius
    ) {
        ballSpeedY = -ballSpeedY
    }
    
    const isBallSameYAsPaddleRight =
        ballY > paddleRightY &&
        ballY < paddleRightY + PADDLE_HEIGHT

    const isBallTouchingPaddleRight =
        ballX + ballSpeedX == paddleRightX

    const isBallSameYAsPaddleLeft =
        ballY > paddleLeftY &&
        ballY < paddleLeftY + PADDLE_HEIGHT

    const isBallTouchingPaddleLeft =
        ballX + ballSpeedX == paddleLeftX + ballRadius

    if (isBallSameYAsPaddleRight && isBallTouchingPaddleRight || isBallSameYAsPaddleLeft && isBallTouchingPaddleLeft) {
        ballSpeedX = -ballSpeedX
    } else if (
        ballX + ballSpeedX > canvas.width + ballRadius || ballX + ballSpeedX < 0 - ballRadius
    ) {
        if (ballX < 0) {
            scorePlayerRight++;
        } else {
            scorePlayerLeft++;
        }
        resetGame()
    }

    ballX += ballSpeedX
    ballY += ballSpeedY
}

function drawPaddleLeft() {
    ctx.fillStyle = 'white'
    ctx.fillRect(
        paddleLeftX,
        paddleLeftY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
    )
}

function paddleMovementLeft() {
    if (charDownPressed && paddleLeftY < canvas.height - PADDLE_HEIGHT - TOP_HEIGHT) {
        paddleLeftY += PADDLE_SENSITIVITY
    } else if (charUpPressed && paddleLeftY > 0 + TOP_POSITION_Y + (TOP_HEIGHT * 3)) {
        paddleLeftY -= PADDLE_SENSITIVITY
    }
}

function drawPaddleRight() {
    ctx.fillStyle = 'white'
    ctx.fillRect(
        paddleRightX,
        paddleRightY,
        PADDLE_WIDTH,
        PADDLE_HEIGHT,
    )
}

function paddleMovementRight() {
    if (arrowDownPressed && paddleRightY < canvas.height - PADDLE_HEIGHT - TOP_HEIGHT) {
        paddleRightY += PADDLE_SENSITIVITY
    } else if (arrowUpPressed && paddleRightY > 0 + TOP_POSITION_Y + (TOP_HEIGHT * 3)) {
        paddleRightY -= PADDLE_SENSITIVITY
    }
}

function drawScore() {
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#fff'
    ctx.fillText(`${scorePlayerLeft}`, POSITION_SCORE_LEFT, PADDING_SCORE_TOP)
    ctx.fillText(`${scorePlayerRight}`, POSITION_SCORE_RIGHT, PADDING_SCORE_TOP)
}

function drawTime() {
    let seconds= Math.floor((Date.now() - time)/1000);
    let minutes= Math.floor(seconds/60);
    seconds%=60;
    ctx.font = 'bold 20px serif';
    ctx.fillStyle = '#fff'
    ctx.fillText(minutes.toString().padStart(2,"0")+":"+seconds.toString().padStart(2,"0"), POSITION_TIME_WIDTH - PADDING_SCORE_TOP, PADDING_SCORE_TOP)
}

function drawField() {
    ctx.fillStyle = '#fff'
    ctx.fillRect(
        TOP_POSITION_X,
        TOP_POSITION_Y,
        TOP_WIDTH,
        TOP_HEIGHT,
    )
    ctx.fillRect(
        canvas.width / 2,
        TOP_POSITION_Y,
        TOP_HEIGHT,
        canvas.height,
    )
}   

function initEvents() {
    const kbdRightUp = document.getElementById('right-up')
    const kbdRightDown = document.getElementById('right-down')
    const kbdLeftUp = document.getElementById('left-up')
    const kbdLeftDown = document.getElementById('left-down')

    document.addEventListener('keydown', keyDownHandler)
    document.addEventListener('keyup', keyUpHandler)

    function keyDownHandler(event) {
        const { key } = event
        if (key === 'Up' || key === 'ArrowUp') {
            arrowUpPressed = true
            kbdRightUp.classList.add('clicked');
        } else if (key === 'Down' || key === 'ArrowDown') {
            arrowDownPressed = true
            kbdRightDown.classList.add('clicked')
        }

        if (key.toLowerCase() === 'w') {
            charUpPressed = true
            kbdLeftUp.classList.add('clicked')
        } else if (key.toLowerCase() === 's') {
            charDownPressed = true
            kbdLeftDown.classList.add('clicked')
        }
    }

    function keyUpHandler(event) {
        const { key } = event
        if (key === 'Up' || key === 'ArrowUp') {
            arrowUpPressed = false
            kbdRightUp.classList.remove('clicked')
        } else if (key === 'Down' || key === 'ArrowDown') {
            arrowDownPressed = false
            kbdRightDown.classList.remove('clicked')
        }

        if (key.toLowerCase() === 'w') {
            charUpPressed = false
            kbdLeftUp.classList.remove('clicked')
        } else if (key.toLowerCase() === 's') {
            charDownPressed = false
            kbdLeftDown.classList.remove('clicked')
        }
    }
}

function cleanCanvas() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function resetGame() {
    ballX = canvas.width / 2
    ballY = canvas.width / 2
    gameStart = false
}

function checkGameStart() {
    if  (arrowUpPressed || arrowDownPressed || charUpPressed || charDownPressed) {
        gameStart = true
        time = Date.now()   
    }
}

function drawToStart() {
    ctx.font = 'bold 15px serif';
    ctx.fillStyle = 'white'
    ctx.fillText('MOVE TO START', canvas.width /2 - 57, 23)
}

function game(timestamp) {
    cleanCanvas()
    if (gameStart) {
        drawTime()
        ballMovement()
    } else {
        checkGameStart()
        if (timestamp - lastTime > blinkInterval) {
            showText = !showText;
            lastTime = timestamp;
        }
        if (showText) {
            drawToStart()
        }
    }
    drawBall()
    drawPaddleLeft()
    drawPaddleRight()
    drawScore()
    drawField()
    paddleMovementLeft()
    paddleMovementRight()
    window.requestAnimationFrame(game)
}

game()
initEvents()