// The Animate function:
var animate = window.requestAnimationFrame ||
			window.webkitRequestAnimationFrame ||
			window.mozRequestAnimationFrame ||
			function(callback) { window.setTimeout(callback, 1000/60) };

var playerScore = 0;
var computerScore = 0;

// Sounds:
var bounceSound = new buzz.sound("sounds/bounce.mp3");
var paddleSound = new buzz.sound("sounds/paddle.mp3");
var cheeringSound = new buzz.sound("sounds/cheering.mp3");
var gruntSound = new buzz.sound("sounds/grunt.mp3");

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

function drawPlayerScore() {
	context.font = "bold 30px Verdana";
	context.fillStyle = "#FFF"
	context.fillText(playerScore + '   Player', 425, 40);
}

function drawComputerScore() {
	context.font = "bold 30px Verdana";
	context.fillStyle = "#FFF"
	context.fillText('Computer   ' + computerScore, 155, 40);
}

// The step function:
var step = function() {
	update();
	render();
	animate(step);
};

// The update & render functions:
var update = function() {
	player.update();
	computer.update(ball);
	ball.update(player.paddle, computer.paddle);
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
	drawPlayerScore();
	drawComputerScore();
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
 	this.x_speed = 3;
	this.y_speed = 0;
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
var ball = new Ball(400, 250);

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
		if(value == 37) {
			this.paddle.move(0, -8);
		} else if (value == 39) {
			this.paddle.move(0, 8);
		} else {
			this.paddle.move(0, 0);
		}
	}
};

// Animating the ball:
Ball.prototype.update = function(paddle1, paddle2) {
	this.x += this.x_speed;
	this.y += this.y_speed;
	var top_x = this.x - 5;
	var top_y = this.y - 5;
	var bottom_x = this.x + 5;
	var bottom_y = this.y + 5;

	if(this.y - 5 < 0) { // hitting the top wall
		this.y = 5;
		this.y_speed = -this.y_speed;
		bounceSound.play();
	} else if(this.y + 5 > 500) { // hitting the bottom wall
		this.y = 495;
		this.y_speed = -this.y_speed;
		bounceSound.play();
	}

	if(this.x < 0) { // a point was scored
		this.x_speed = 3;
		this.y_speed = 0;
		this.x = 400;
		this.y = 250;
		playerScore += 1;
		cheeringSound.play();
		if (playerScore === 11) {
			alert('YOU WIN, CONGRATULATIONS!')
			document.location.reload();
		}
	} else if (this.x > 800) {
		this.x_speed = 3;
		this.y_speed = 0;
		this.x = 400;
		this.y = 250;
		computerScore += 1;
		gruntSound.play();
		if (computerScore === 11) {
			alert('COMPUTER WINS, TRY AGAIN LATER!')
			document.location.reload();			
		}
	}

	if(top_x > 400) {
		if(top_x < (paddle1.x + paddle1.width) && bottom_x > paddle1.x && top_y < (paddle1.y + paddle1.height) && bottom_y > paddle1.y) {
			// hit the player's paddle
			this.x_speed = -3;
			this.y_speed += (paddle1.y_speed / 2);
			this.x += this.x_speed;
			paddleSound.play();
		}
	} else {

		if(top_x < (paddle2.x + paddle2.width) && bottom_x > paddle2.x && top_y < (paddle2.y + paddle2.height) && bottom_y > paddle2.y) {
			// hit the computer's paddle
			this.x_speed = 3;
			this.y_speed += (paddle2.y_speed / 2);
			this.x += this.x_speed;
			paddleSound.play();
    	}
  	}
};

// The computer AI:
Computer.prototype.update = function (ball) {
	var y_pos = ball.y;
	var diff = -((this.paddle.y + (this.paddle.height / 2)) - y_pos);
	
	if (diff < 0 && diff > -4) { // max speed left
		diff = -5;
	} else if (diff > 0 && diff < 4) { // max speed right
		diff = 5;
	}
	this.paddle.move (0, diff);
	if (this.paddle.y < 0) {
		this.paddle.y = 0;
	} else if (this.paddle.y + this.paddle.height > 400) {
		this.paddle.y = 400 - this.paddle.height;
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