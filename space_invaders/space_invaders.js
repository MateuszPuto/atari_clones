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

const sprites = [];
for(let i=0; i<imagePaths.length; i++) {
	sprites.push([]);
	for(let j=0; j<12; j++) {
		createImage(sprites[i], "myCanvas");
	}
}

let x = 10;
let y = 150;
for(let i=0; i<sprites.length; i++) {
	for(let j=0; j<12; j++) {
		sprites[i][j].onload = loadImage(sprites[i][j], x + 30 * j, y, 40, 40);
	}
	y -= 30;
}

for(let i=0; i<sprites.length; i++) {
	for(let j=0; j<12; j++) {
		sprites[i][j].src = imagePaths[i];
	}
}

drawShip(10, 200);

function createImage(sprites, canvas) {
	image = new Image();
	document.getElementById(canvas).appendChild(image);
	sprites.push(image);
}

function loadImage(image, posX, posY, sizeX, sizeY) {
	return () => {ctx.drawImage(image, posX, posY, sizeX, sizeY);}
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
