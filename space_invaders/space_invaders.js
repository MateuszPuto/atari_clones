var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

const img = new Image();
img.onload = () => {
	ctx.drawImage(img, canvas.width/2, canvas.height/2, 40, 40);
}
	img.src = "alien-1.png";
