// Draw table background:
var canvas = document.getElementById("myCanvas");
var context = canvas.getContext("2d");
context.fillRect(0, 0, 800, 500);

//Draw table border lines
context.beginPath();
context.moveTo(15, 15);
context.lineTo(15, 485);
context.lineTo(785, 485);
context.lineTo(785, 15);
context.lineTo(15, 15);
context.lineWidth = 6;
context.strokeStyle = '#FFF'
context.stroke();

//Draw table center dashed line
context.beginPath();
context.moveTo(400, 15);
context.lineTo(400, 485);
context.lineWidth = 6;
context.setLineDash([5, 3]);
context.strokeStyle = '#FFF'
context.stroke();


// Create the paddle object
function paddle(x, y){
 	this.x = x;
 	this.y = y;
 	this.color = '#FFF';
 	this.width = 15;
	this.height = 100;
	this.render = function () {
		context.beginPath();
		context.fillStyle = this.color;
		context.fillRect(this.x, this.y, this.width, this.height);		
	};
}

// Create Ball Object Constructor
function Ball(){
 	this.x = 200;
 	this.y = 150;
 	this.color = '#FFF';
 	this.radius = 8;
	this.render = function () {
		context.fillStyle = this.color;
    	context.beginPath();
    	context.arc(this.x, this.y, this.radius, 0, 2*Math.PI, false);
    	context.fill();
	};
}

// Declare new paddles (player & computer) and new Ball
var playerPaddle = new paddle(760, 200);
var computerPaddle = new paddle(25, 200);
var ball = new Ball();

// Create render function
function render () {
	playerPaddle.render();
	computerPaddle.render();
	ball.render();
}

window.onload = function () {
	render();
};