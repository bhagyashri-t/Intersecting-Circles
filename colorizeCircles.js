
document.addEventListener('DOMContentLoaded', mainFunction(), false);

function mainFunction() {
	var canvas = document.getElementById('circlesCanvas');
	var circleArr = [];
	var point1, point2, isMouseUp = false;

	canvas.addEventListener('mousedown', mousedownEventHandler);

	var colorizeButton = document.getElementById('colorizeBtn');
	colorizeButton.addEventListener('click', function() {assignCircleColors(circleArr)});

	var clearButton = document.getElementById('clearBtn');
	clearButton.addEventListener('click', function() {
		clearCanvas();
		circleArr = [];
	});

	function mousemoveEventHandler (event) {

		var rect = canvas.getBoundingClientRect();
		point2 = {x: event.pageX - rect.left, y: event.pageY - rect.top};

		circleObj = new CreateCircle(point1.x, point1.y, 1);

		if(!isMouseUp) {
			//Calculating radius for circle to draw
			var xDiff = Math.pow((point2.x - point1.x), 2);
			var yDiff = Math.pow((point2.y - point1.y), 2);

			var radius = Math.sqrt( xDiff + yDiff);
			
			circleObj.radius = radius;
			clearCanvas();
			circleObj.drawCircle();

			for(var i = 0; i < circleArr.length; i++) {
				circleArr[i].drawCircle();
			}
		}	
	}

	function mouseupEventHandler (event) {

		isMouseUp = true;
		circleArr.push(circleObj);
	
		colorizeButton.disabled = false;
		canvas.removeEventListener('mousemove', mousemoveEventHandler);
	}

	function mousedownEventHandler (event) {

		var rect = canvas.getBoundingClientRect();
		isMouseUp = false;
			
		var x1 = event.pageX, y1 = event.pageY;
		point1 = {x: x1 - rect.left, y: y1 - rect.top};

		canvas.addEventListener('mousemove', mousemoveEventHandler);	
		canvas.addEventListener('mouseup', mouseupEventHandler);	
	}	
} //End MainFunction()

function CreateCircle(x,y,radius) {
	this.x = x || 100;
	this.y = y || 100;
	this.radius = radius || 50;

	var canvas = document.getElementById('circlesCanvas');
	var context = canvas.getContext('2d');

	this.drawCircle = function() {		
		context.beginPath();
		context.arc(this.x, this.y, this.radius, 0, 2 * Math.PI);
		context.stroke();	
	}

	this.setColor = function(color) {
		context.fillStyle = color;
		context.fill();
	}

	this.intersects = function(circle) {
		var distanceBtwnCircles;
		var radiusTotal = this.radius + circle.radius;
		var xDiff = Math.pow((circle.x - this.x), 2);
		var yDiff = Math.pow((circle.y - this.y), 2);

		distanceBtwnCircles = Math.sqrt( xDiff + yDiff);
		if(distanceBtwnCircles <= radiusTotal) {
			return true;
		} else {
			return false;
		}
	}
}

function assignCircleColors(circleArr) {
	var instercting_circles = [];

	for(var i = 0; i < circleArr.length; i++) {
		
		for(var j = i+1; j < circleArr.length; j++) {
			
			if(circleArr[i].intersects(circleArr[j])) {
				// If circles are intersecting, assign color 'red'
				circleArr[i].drawCircle();
				circleArr[i].setColor('red');
				circleArr[j].drawCircle();
				circleArr[j].setColor('red');
				instercting_circles.push(circleArr[i]);
				instercting_circles.push(circleArr[j]);
			}
		}
		
		var isRed = instercting_circles.indexOf(circleArr[i]);
		if(isRed == -1) {
			/* circleArr[i] doesn't intersects with any other circles, 
			so assign color 'blue' */
			circleArr[i].drawCircle();
			circleArr[i].setColor('blue');
		}
	}
}

function clearCanvas() {
	var canvas = document.getElementById('circlesCanvas');
	var context = canvas.getContext('2d');
	context.clearRect(0, 0, canvas.width, canvas.height);

	var colorizeButton = document.getElementById('colorizeBtn');
	colorizeButton.disabled = true;
}