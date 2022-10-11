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
let shipY = 400;
let shipDx = 0;

let screenTicks = 100;
let tick = 0;
let rightDir = true;

let bullets = [];
let projectiles = [];

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
	shoot(shipX+12.5, shipY, 1);
}

function shoot(posX, posY, speed) {
	bullets.push({
		"posX": posX,
		"posY": posY,
		"speed": speed,
	});
}

function alienShoot(posX, posY, speed) {
	projectiles.push({
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
		let bullet = bullets[i];
		if(x >= bullet.posX - alienSize && x <= bullet.posX) {
			if(y >= bullet.posY - alienSize/2 && y <= bullet.posY + alienSize/2) {
				collision = true;
				bullets.splice(i, 1);
			}
		}
	}

	return collision;
}

function shipCollision() {
	for(let i=0; i<projectiles.length; i++) {
		let projectile = projectiles[i];

		if(projectile.posX > shipX && projectile.posX < shipX + 25) {
			if(projectile.posY > shipY && projectile.posY < shipY + 10){
				lives -= 1;
				projectiles.splice(i, 1);
			}
		}
	}
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

function aliensAttack(posX, posY) {
	let shootingChance = Math.random();

	if(posX > shipX - 10 && posX < shipX + 10 && shootingChance < 0.002) {
		alienShoot(posX, posY, 1);
	}
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
		
				aliensAttack(x + 30 * j, y);
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
		ctx.fillRect(bullet["posX"], bullet["posY"], 3, 6);
	
		if(bullet["posY"] < canvas.width && bullet["posY"] > 0) {
			newBullets.push(bullet);
		}
	}

	return newBullets;
}

function drawProjectiles() {
	let newProjectiles = [];

	for(let i=0; i<projectiles.length; i++) {
		let projectile = projectiles[i];

		projectile["posY"] += projectile["speed"];
		ctx.strokeRect(projectile["posX"], projectile["posY"], 4, 5);

		if(projectile["posY"] < canvas.width && projectile["posY"] > 0) {
			newProjectiles.push(projectile);
		}
	}

	return newProjectiles;
}

function drawScore() {
	ctx.strokeText("SCORE<1> HI-SCORE SCORE<2>", 50, 20);
	ctx.strokeText(score + "               " + highScore, 50, 40);
}

function drawLives() {
	ctx.strokeText(lives, 50, 445);
	for(let i=0; i<(lives-1); i++) {
		drawShip(70 + 30 * i, 440);
	}
}

function checkGameEnd() {
	let won = true;
	for(let i=0; i<drawable.length; i++) {
		for(let j=0; j<drawable[i].length; j++) {
			if(drawable[i][j] == true) {
				won = false;
				break;
			}
		}
	}

	if(won) {
		alert("You have won the game!");
		document.location.reload();
	} else if(lives == 0 || alienY > canvas.height) {
		alert("You have lost to aliens!");
		document.location.reload();
	}
}

function draw() {
	checkGameEnd();

	clearScreen();
	moveShip();
	drawShip(shipX, shipY);
	shipCollision();
	drawAliens(alienX, alienY);
	drawScore();
	drawLives();
	bullets = drawBullets();
	projectiles = drawProjectiles();

	if(rightDir) {
		if(tick < screenTicks) {
			alienX += 1;
			tick += 1;
		} else {
			tick = 0;
			alienY += 5;
			rightDir = false;
		}
	} else {
		if(tick < screenTicks) {
			alienX -= 1;
			tick += 1;
		} else {
			tick = 0;
			alienY += 5;
			rightDir = true;
		}
	}

	setTimeout(window.requestAnimationFrame(draw), 20);
}


function main() {
	document.addEventListener("keydown", keyDownHandler, false);
	document.addEventListener("keyup", keyUpHandler, false);

	const spacebarHandler = (e) => {
		if(e.code === "Space") {
			console.log("space pushed");
			shipShoot();
			document.removeEventListener("keydown", spacebarHandler);
		}
	}

	const addShooting = () => {
		document.addEventListener("keydown", spacebarHandler);
	}

	setInterval(addShooting, 500);
	setInterval(alienAnimation, 500);
	window.requestAnimationFrame(draw);
}
main();
