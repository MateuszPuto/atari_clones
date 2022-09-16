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

let screenTicks = 50;
let tick = 0;
let rightDir = true;

const sprites = [];
for(let i=0; i<imagePaths.length; i++) {
	sprites.push([]);
	for(let j=0; j<12; j++) {
		createImage(sprites[i], "myCanvas");
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
			loadImage(sprites[i][j], x + 30 * j, y, alienSize, alienSize)();
		}
	y -= 30;
	}

}

function draw() {
	clearScreen();
	drawShip(10, 200);
	drawAliens(alienX, alienY);
	
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

	console.log(alienX, tick, rightDir);
}

function main() {
	setInterval(draw, 10);
}
main();
