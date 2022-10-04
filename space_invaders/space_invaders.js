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

const alienSize = 40;
let alienX = 10;
let alienY = 150;

let shipX = 10;
let shipY = 200;
let shipDx = 0;

let screenTicks = 50;
let tick = 0;
let rightDir = true;

let bullets = [];

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
	shoot(shipX, shipY, 0.1);
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
	return () => {ctx.drawImage(image, posX, posY, sizeX, sizeY);}
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

function drawAliens(x, y) {
	for(let i=0; i<sprites.length; i++) {
		for(let j=0; j<12; j++) {
			if(drawable[i][j] && collisionDetection(x + 30*j, y)) {
				drawable[i][j] = false;
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

function draw() {
	clearScreen();
	moveShip();
	drawShip(shipX, shipY);
	drawAliens(alienX, alienY);
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
	
	setInterval(draw, 10);
}
main();
