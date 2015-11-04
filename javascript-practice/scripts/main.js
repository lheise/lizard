//At the top we are declaring our variables


//creates tool so we can paint on the canvas
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//holds the value of the radius of the ball
var ballRadius = 30;

//defines x and y, the coord. system starts from the top left
var x = canvas.width/2;
var y = canvas.height-30;

//adding a small value to x and y after every frame has been drawn
//to make it appear the ball is moving
var dx = 2;
var dy = -2;

//setting up the size of the paddle and its initial location on the canvas (centered at the bottom)
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width-paddleWidth)/2;

//these variables store the boolean values of the pressed buttons
var rightPressed = false;
var leftPressed = false;

//here we are setting up the brick variables. size, location, number
var brickRowCount = 3;
var brickColumnCount = 5;
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//setting the number of lives 
var lives = 3;

//setting up the initial score value
var score = 0;

//here we are holding our bricks in a 2 dimensional array
//c = number of columns, r = number of rows
var bricks = [];
for(c=0; c<brickColumnCount; c++) {
    bricks[c] = [];
    for(r=0; r<brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//these are the event listeners. they store boolean values at the end 
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);


//these three functions are related to the event listeners
function keyDownHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = true;
    }
    else if(e.keyCode == 37) {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if(e.keyCode == 39) {
        rightPressed = false;
    }
    else if(e.keyCode == 37) {
        leftPressed = false;
    }
}

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 && relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth/2;
    }
}

//this function determines if the ball is hitting the wall or not and telling
//it what it should do if that happens
//it loops through all the bricks and compares the position of the ball to the paddle
//CHANGING DIRECTION action starts only IF...
//For the center of the ball to be inside the brick, all four of the following statements need to be true:
//The x position of the ball is greater than the x position of the brick.
//The x position of the ball is less than the x position of the brick plus its width.
//The y position of the ball is greater than the y position of the brick.
//The y position of the ball is less than the y position of the brick plus its height.
function collisionDetection() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            //b stores the brick object in every loop of the collision detection
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x > b.x && x < b.x+brickWidth && y > b.y && y < b.y+brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    if(score == brickRowCount*brickColumnCount) {
                        alert("YOU WIN, CONGRATS!");
                        document.location.reload();
                    }
                }
            }
        }
    }
}


//this is my random hex color generator, trying to get the color to change everytimg the ball hits the wall
function randomHexColor(){
    var hexColor=[]; //new Array()
    hexColor[0] = "#"; //first value of array needs to be hash tag for hex color val, could also prepend this later

    for (i = 1; i < 7; i++)
    {
        var x = Math.floor((Math.random()*16)); //Tricky: Hex has 16 numbers, but 0 is one of them

        if (x >=10 && x <= 15) //hex:0123456789ABCDEF, this takes care of last 6 
        {
            switch(x)
            {
                case 10: x="a" 
                break;
                case 11: x="b" 
                break;
                case 12: x="c" 
                break;
                case 13: x="d" 
                break;
                case 14: x="e" 
                break;
                case 15: x="f" 
                break;  
            }
        }
        hexColor[i] = x;
    }
    var cString = hexColor.join(""); //this argument for join method ensures there will be no separation with a comma
    return cString;
}

//this is a function that loops through all the bricks in the array and draws them
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            bricks[c][r].x = 0;
            bricks[c][r].y = 0;

            //method that creates a new path on the canvas
            ctx.beginPath();
            ctx.rect(0, 0, brickWidth, brickHeight);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            //closes the path
            ctx.closePath();
        }
    }
}

//this function simply draws our ball on the canvas
function drawBall() {
    ctx.beginPath();
    
    //void ctx.arc(x, y, radius, startAngle, endAngle, anticlockwise);
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = randomHexColor();
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height-paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//draws the bricks on the canvas
function drawBricks() {
    for(c=0; c<brickColumnCount; c++) {
        for(r=0; r<brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c*(brickWidth+brickPadding))+brickOffsetLeft;
                var brickY = (r*(brickHeight+brickPadding))+brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: "+score, 8, 20);
}

function drawLives() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: "+lives, canvas.width-65, 20);
}


//this function controls the movement of the ball on the canvas
function draw() {
    //clearRect is a method that clears the canvas content. The four params.
    //are x and y coord. of the top left corner of the rectangle and the 
    //x and y coord. of the bottom right corner of a rectangle. The whole area
    //covered by this rectangle will be cleared of any content previously painted there
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    

    //this part of code reverses the direction when the ball hits the edge of the canvas
    if(x + dx > canvas.width-ballRadius || x + dx < ballRadius) {
        dx = -dx;
    }
    //if ball position is touching the top edge what should it do
    if(y + dy < ballRadius) {
        dy = -dy;    
    } 
    else if(y + dy > canvas.height-ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload();
            }
            else {
                x = canvas.width/2;
                y = canvas.height-30;
                dx = 3;
                dy = -3;
                paddleX = (canvas.width-paddleWidth)/2;
            }
        }
    }
    
    //paddle moves 7 pixels to the right or left depending on the movement of the mouse or keystroke
    if(rightPressed && paddleX < canvas.width-paddleWidth) {
        paddleX += 7;
    }
    else if(leftPressed && paddleX > 0) {
        paddleX -= 7;
    }
    
    //since x and y define the location of the ball on the screen, then
    //using the values for the variables dx an dy will increment the location
    //on the screen
    x += dx;
    y += dy;

    //this replaced the setInterval(draw, 10); because it is more efficient?
    requestAnimationFrame(draw);
}

draw();