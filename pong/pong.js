var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var middleWidth = canvas.width/2;
var middleHeight = canvas.height/2;

var paddleSize = 50;
var paddleWidth = 15;
var paddleDy = 10;

var paddleOneY = middleHeight - 0.5 * paddleSize;
var paddleTwoY = middleHeight - 0.5 * paddleSize;
var paddleOneDir = 0;
var paddleTwoDir = 0;

var ballX = middleWidth;
var ballY = middleHeight;
var ballRadius = 10;
var ballDx = 1;
var ballDy = 1;
var ballSpeed = 1;

var playerOneScore = 0;
var playerTwoScore = 0;

function drawDashedLine() {
	ctx.beginPath();
	ctx.setLineDash([5, 15]);
	ctx.moveTo(middleWidth, 0);
	ctx.lineTo(middleWidth, canvas.height);
	ctx.stroke();
}

function drawPaddle(x, y) {
	ctx.beginPath();
	ctx.rect(x, y, paddleWidth, paddleSize);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawBall(x, y, radius) {
	ctx.beginPath();
	ctx.arc(x, y, radius, 0, Math.PI*2);
	ctx.fillStyle = "#0095DD";
	ctx.fill();
	ctx.closePath();
}

function drawScore() {
	ctx.font = "48px sans-serif";
	ctx.fillText(playerOneScore.toString(), middleWidth - 40, 40);
	ctx.fillText(playerTwoScore.toString(), middleWidth + 10, 40);
}

function clearScrean() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	clearScrean();

	moveBall();
	console.log(ballX, ballY, ballSpeed, ballDx, ballDy);

	drawDashedLine();
	drawPaddle(0, paddleOneY);
	drawPaddle(canvas.width-15, paddleTwoY);
	drawBall(ballX, ballY, ballRadius);
	drawScore();
}

function moveBall() {
	ballX += ballDx;
	ballY += ballDy;
	
	collisionDetection();
}

function collisionDetection() {
	if(ballY < ballRadius || ballY > canvas.height - ballRadius) {
		ballDy *= -1;
	}
	else if(ballX < ballRadius && ballOnPaddle()) {
		ballDy = -1 * (ballDy + paddleOneDir);
		ballDx = -1 * Math.sign(ballDx) * Math.sqrt(Math.abs(ballDy)**2 + ballSpeed**2);
		vec = Math.sqrt(Math.abs(ballDx)**2 + Math.abs(ballDy)**2);
		
		ballDx = ballDx * (ballSpeed / vec);
		ballDy = ballDy * (ballSpeed / vec);
		
		ballSpeed *= 1.05;
	}
	else if(ballX > canvas.width - ballRadius && ballOnPaddle()) {
		ballDy = -1 * (ballDy + paddleTwoDir);
		ballDx = -1 * Math.sign(ballDx) * Math.sqrt(Math.abs(ballDy)**2 + ballSpeed**2);
		vec = Math.sqrt(Math.abs(ballDx)**2 + Math.abs(ballDy)**2);
		
		ballDx = ballDx * (ballSpeed / vec);
		ballDy = ballDy * (ballSpeed / vec);
	
		ballSpeed *= 1.05;
	}
	else if(ballX < ballRadius) {
		playerTwoScore += 1;
	
		if(playerTwoScore >= 9) {
			alert("Right side player wins, congratulations!");
			document.location.reload();
		}

		ballSpeed = 1;
		ballX = middleWidth;
		ballY = middleHeight;

		ballDx *= -1;
		ballDy *= -1;
	}
	else if(ballX > canvas.width - ballRadius) {
		playerOneScore += 1;

		if(playerOneScore >= 9) {
			alert("Left side player wins, congratulations!");
			document.location.reload();
		}

		ballSpeed = 1;
		ballX = middleWidth;
		ballY = middleHeight;

		ballDx *= -1;
		ballDy *= -1;
	}
}

function ballOnPaddle() {
	let hit = false;

	if(ballY - 2 > paddleOneY && ballY + 2 < paddleOneY + paddleSize) {
		hit = true;
	}
	else if(ballY - 2 > paddleTwoY && ballY + 2 < paddleTwoY + paddleSize) {
		hit = true;
	}

	return hit;
}

function keyDownHandler(e) {
	switch (e.key) {
		case "ArrowDown":
			if(paddleTwoY + paddleSize < canvas.height) {
				paddleTwoY += paddleDy;
			}
			paddleTwoDir = 1;
			break;
		case "ArrowUp":
			if(paddleTwoY > 0) {
				paddleTwoY -= paddleDy;
			}
			paddleTwoDir = -1;
			break;
		case "s":
			if(paddleOneY + paddleSize < canvas.height) {
				paddleOneY += paddleDy;
			}
			paddleOneDir = 1;
			break;
		case "w":
			if(paddleOneY > 0) {
				paddleOneY -= paddleDy;
			}
			paddleOneDir = -1;
			break;
		default:
			paddleOneDir = 0;
			paddleTwoDir = 0;
	}
}

function keyUpHandler(e) {
	paddleOneDir = 0;
	paddleTwoDir = 0;
}

function main() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);
		
	setInterval(draw, 10);
}

main();
