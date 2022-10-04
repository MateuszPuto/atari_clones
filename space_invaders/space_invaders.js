var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const imagePaths = [
	"./assets/alien-1.png",
	"./assets/alien-1-pose-2.png",
	"./assets/alien-2.png",
	"./assets/alien-2-pose-2.png",
	"./assets/alien-3.png",
	"./assets/alien-3-pose-2.png"
];

const imagePaths2 = [
	"./assets/alien-1-pose-2.png",
	"./assets/alien-1.png",
	"./assets/alien-2-pose-2.png",
	"./assets/alien-2.png",
	"./assets/alien-3-pose-2.png",
	"./assets/alien-3.png"
];

let score = 0;
let highScore = 0;
let lives = 3;

const alienSize = 40;
let alienX = 10;
let alienY = 200;

let shipX = 10;
let shipY = 280;
let shipDx = 0;

let screenTicks = 50;
let tick = 0;
let rightDir = true;

let bullets = [];

let animation = true;
let drawable = [];
const sprites = [];
for(let i=0; i<imagePaths.length; i++) {
	sprites.push([]);
	drawable.push([]);
	for(let j=0; j<12; j++) {
		createImage(sprites[i], "myCanvas");
		drawable[i].push(true);
	}
}

for(let i=0; i<sprites.length; i++) {
	for(let j=0; j<12; j++) {
		sprites[i][j].src = imagePaths[i];
	}
}

let x = 10;
let y = 150;
for(let i=0; i<sprites.length; i++) {
	for(let j=0; j<12; j++) {
		sprites[i][j].onload = loadImage(sprites[i][j], x + 30 * j, y, alienSize, alienSize);
	}
	y -= 30;
}


function keyDownHandler(e) {
	switch(e.key) {
		case "ArrowLeft":
			shipDx = -1;
			break;
		case "ArrowRight":
			shipDx = 1;
			break;
	}
}

function keyUpHandler(e) {
	shipDx = 0;
}

function moveShip() {
	shipX += 5 * shipDx;
}

function shipShoot() {
	shoot(shipX, shipY, 1);
}

function shoot(posX, posY, speed) {
	bullets.push({
		"posX": posX,
		"posY": posY,
		"speed": speed,
	});
}

function createImage(sprites, canvas) {
	image = new Image();
	document.getElementById(canvas).appendChild(image);
	sprites.push(image);
}

function loadImage(image, posX, posY, sizeX, sizeY) {
	return () => {ctx.drawImage(image, posX, posY, sizeX, sizeY)}
}

function clearScreen() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function collisionDetection(x, y) {
	let collision = false;
	for(let i=0; i<bullets.length; i++) {
		bullet = bullets[i];
		if(x >= bullet.posX - alienSize && x <= bullet.posX) {
			if(y >= bullet.posY - alienSize/2 && y <= bullet.posY + alienSize/2) {
				collision = true;
				bullets.splice(i, 1);
			}
		}
	}

	return collision;
}

function drawShip(posX, posY) {
	ctx.beginPath();
	ctx.moveTo(posX, posY);
	ctx.lineTo(posX, posY + 10);
	ctx.lineTo(posX + 25, posY + 10);
	ctx.lineTo(posX + 25, posY);
	ctx.lineTo(posX + 10, posY);
	ctx.lineTo(posX + 10, posY - 5);
	ctx.lineTo(posX + 15, posY - 5);
	ctx.lineTo(posX + 15, posY);
	ctx.lineTo(posX, posY);
	ctx.fill();
}

function alienAnimation() {
	for(let i=0; i< sprites.length; i++) {
		for(let j=0; j<12; j++) {
			if(drawable[i][j] && animation) {
				sprites[i][j].src = imagePaths2[i];
			} else if(drawable[i][j]) {
				sprites[i][j].src = imagePaths[i];
			}
		}
	}

	animation = !animation;
}

function drawAliens(x, y) {
	for(let i=0; i<sprites.length; i++) {
		for(let j=0; j<12; j++) {
			if(drawable[i][j] && collisionDetection(x + 30*j, y)) {
				drawable[i][j] = false;
				score += (1 + Math.floor(i/2)) * 10;
			}

			if(drawable[i][j]) {
				loadImage(sprites[i][j], x + 30 * j, y, alienSize, alienSize)();
			}
		}
	y -= 30;
	}

}

function drawBullets() {
	let newBullets = [];

	for(let i=0; i<bullets.length; i++) {
		let bullet = bullets[i];

		bullet["posY"] -= bullet["speed"];
		ctx.strokeRect(bullet["posX"], bullet["posY"], 2, 5);
	
		if(bullet["posY"] < canvas.width && bullet["posY"] > 0) {
			newBullets.push(bullet);
		}
	}

	return newBullets;
}

function drawScore() {
	ctx.strokeText("SCORE<1> HI-SCORE SCORE<2>", 50, 20);
	ctx.strokeText(score + "               " + highScore, 50, 40);
}

function drawLives() {
	ctx.strokeText(lives, 50, 305);
	for(let i=0; i<(lives-1); i++) {
		drawShip(70 + 30 * i, 300);
	}
}

function draw() {
	clearScreen();
	moveShip();
	drawShip(shipX, shipY);
	drawAliens(alienX, alienY);
	drawScore();
	drawLives();
	bullets = drawBullets();

	if(rightDir) {
		if(tick < screenTicks) {
			alienX += 1;
			tick += 1;
		} else {
			tick = 0;
			rightDir = false;
		}
	} else {
		if(tick < screenTicks) {
			alienX -= 1;
			tick += 1;
		} else {
			tick = 0;
			rightDir = true;
		}
	}

	setTimeout(window.requestAnimationFrame(draw), 10);
}


function main() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keydown", (e) => {
		if(e.code === "Space") {
			console.log("space pushed");
			shipShoot();
		}
	});
	document.addEventListener("keyup", keyUpHandler, false);

	setInterval(alienAnimation, 500);
	window.requestAnimationFrame(draw);
}
main();
