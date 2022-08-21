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
	createImage(sprites, "myCanvas");
}


let x = 10;
let y = 100;
for (let i=0; i<sprites.length; i++) {
	sprites[i].onload = loadImage(sprites[i], x, y, 40, 40);
	x += 50;
}

for (let i=0; i<sprites.length; i++) {
	sprites[i].src = imagePaths[i];
}

function createImage(sprites, canvas) {
	image = new Image();
	document.getElementById(canvas).appendChild(image);
	sprites.push(image);
}

function loadImage(image, posX, posY, sizeX, sizeY) {
	return () => {ctx.drawImage(image, posX, posY, sizeX, sizeY);}
}

