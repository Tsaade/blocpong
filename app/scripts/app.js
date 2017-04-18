// The Animate function:
var animate = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };

// Canvas setup and 2d context:
var canvas = document.getElementById('myCanvas');
var width = 800;
var height = 500;
canvas.width = width;
canvas.height = height;
var context = canvas.getContext('2d');

// Atach the canvas to the screen and call the step function using the animate method:
window.onload = function() {
	document.body.appendChild(canvas);
	animate(step);
};

// The step function:
var step = function() {
	update();
	render();
	animate(step);
};

// The update & render functions:
var update = function() {
	player.update();
};

var render = function() {
	context.fillStyle = "#000";
	context.fillRect(0, 0, width, height);

	//Draw table center dashed line
	context.beginPath();
	context.moveTo(400, 15);
	context.lineTo(400, 485);
	context.lineWidth = 6;
	context.setLineDash([5, 3]);
	context.strokeStyle = '#FFF'
	context.stroke();
	
	player.render();
	computer.render();
	ball.render();
};

// Adding paddles and the ball:
function Paddle(x, y, width, height) {
	this.x = x;
	this.y = y;
	this.width = width;
	this.height = height;
	this.x_speed = 0;
	this.y_speed = 0;
}

Paddle.prototype.render = function() {
	context.fillStyle = "#FFF";
	context.fillRect(this.x, this.y, this.width, this.height);
};

// Objects representing the player and computer paddles:
function Player() {
	this.paddle = new Paddle(770, 200, 15, 100);
}

function Computer() {
	this.paddle = new Paddle(15, 200, 15, 100);
}

// Render the player and computer paddles:
Player.prototype.render = function() {
	this.paddle.render();
};

Computer.prototype.render = function() {
	this.paddle.render();	
};

// Create and render the ball object:
function Ball(x, y) {
	this.x = x;
	this.y = y;
 	this.x_speed = 0;
	this.y_speed = 3;
	this.radius = 8;
}

Ball.prototype.render = function() {
	context.beginPath();
	context.arc(this.x, this.y, this.radius, 2 * Math.PI, false);
	context.fillStyle = "#FFF";
	context.fill();
};

var player = new Player();
var computer = new Computer();
var ball = new Ball(200, 300);

// The player paddle controls:
var keysDown = {};

window.addEventListener("keydown", function(event) {
	keysDown[event.keyCode] = true;
});

window.addEventListener("keyup", function(event) {
	delete keysDown[event.keyCode];
});

Player.prototype.update = function() {
	for(var key in keysDown) {
		var value = Number(key);
		if(value == 38) {
			this.paddle.move(0, -5);
		} else if (value == 40) {
			this.paddle.move(0, 5);
		} else {
			this.paddle.move(0, 0);
		}
	}
};

Paddle.prototype.move = function(x, y) {
	this.x += x;
	this.y += y;
	this.x_speed = x;
	this.y_speed = y;
	if(this.y < 15) {
		this.y = 15;
		this.y_speed = 0;
	} else if (this.y + this.height > 485) {
		this.y = 485 - this.height;
		this.y_speed = 0;
	}
};