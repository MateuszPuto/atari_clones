var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

var middleWidth = canvas.width/2;
var middleHeight = canvas.height/2;

var paddleSize = 50;
var paddleWidth = 15;
var paddleDy = 10;

var paddleOneY = middleHeight - 0.5 * paddleSize;
var paddleTwoY = middleHeight - 0.5 * paddleSize;

var ballX = middleWidth;
var ballY = middleHeight;
var ballRadius = 10;
var ballDx = 0.5;
var ballDy = 0.5;

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
	ctx.font = "48px serif";
	ctx.fillText(playerOneScore.toString(), middleWidth - 40, 40);
	ctx.fillText(playerTwoScore.toString(), middleWidth + 10, 40);
}

function clearScrean() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function draw() {
	clearScrean();

	moveBall();
	console.log(ballX, ballY);

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
		ballDx *= -1;
		ballDy = -1 * ballDy;
	}
	else if(ballX > canvas.width - ballRadius && ballOnPaddle()) {
		ballDx *= -1;
		ballDy = -1 * ballDy;
	}
	else if(ballX < ballRadius) {
		playerTwoScore += 1;
		ballX = middleWidth;
		ballY = middleHeight;
	}
	else if(ballX > canvas.width - ballRadius) {
		playerOneScore += 1;
		ballX = middleWidth;
		ballY = middleHeight;
	}
}

function ballOnPaddle() {
	let hit = false;

	if(ballY > paddleOneY && ballY < paddleOneY + paddleSize) {
		hit = true;
	}
	else if(ballY > paddleTwoY && ballY < paddleTwoY + paddleSize) {
		hit = true;
	}

	return hit;
}

function keyDownHandler(e) {
	switch (e.key) {
		case "ArrowDown":
			paddleTwoY += paddleDy;
			break;
		case "ArrowUp":
			paddleTwoY -= paddleDy;
			break;
		case "s":
			paddleOneY += paddleDy;
			break;
		case "w":
			paddleOneY -= paddleDy;
			break;
	
	}
}

function main() {
	document.addEventListener("keydown", keyDownHandler, false);

	setInterval(draw, 10);
}

main();
