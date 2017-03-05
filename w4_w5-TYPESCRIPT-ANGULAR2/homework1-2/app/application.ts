class Point {
    x: number;
    y: number;
    constructor(x : number, y: number) {
        this.x = x;
        this.y = y;
    }

    add(point: Point) {
        this.x += point.x;
        this.y += point.y;
    }
}

class Vector extends Point {
    flipX() {
        this.x *= -1;
    }

    flipY() {
        this.y *= -1;
    }
}

class Rect {
    topLeft : Point;
    bottomRight : Point;

    constructor(left : number, top: number, right: number, bottom: number) {
        this.topLeft = new Point(left, top);
        this.bottomRight = new Point(right, bottom);
    }

    clone() : Rect {
        return new Rect(this.topLeft.x, this.topLeft.y, this.bottomRight.x, this.bottomRight.y);
    }

    add(point: Point) {
        this.topLeft.add(point);
        this.bottomRight.add(point);
    }

    moveTo(rect: Rect) {
        this.topLeft.x = rect.topLeft.x;
        this.topLeft.y = rect.topLeft.y;
        this.bottomRight.x = rect.bottomRight.x;
        this.bottomRight.y = rect.bottomRight.y;
    }

    moveCenterXTo(centerX : number) {
        var left = centerX - this.width() / 2;
        var right = left + this.width();
        this.topLeft.x = left;
        this.bottomRight.x = right;
    }

    moveBottomTo(bottom: number) {
        this.topLeft.y = bottom - this.height();
        this.bottomRight.y = bottom; 
    }

    width() {
        return this.bottomRight.x - this.topLeft.x;
    }

    height() {
        return this.bottomRight.y - this.topLeft.y;
    }

    centerX() {
        return (this.topLeft.x + this.bottomRight.x) / 2;
    }

    centerY() {
        return (this.topLeft.y + this.bottomRight.y) / 2;
    }

    moveLeft(step: number) {
        this.topLeft.x -= step;
        this.bottomRight.x -= step;
    }

    moveRight(step: number) {
        this.topLeft.x += step;
        this.bottomRight.x += step;
    }
}

enum Side {
    None,
    Left,
    Top,
    Right, 
    Bottom
}

class Obstacle extends Rect {
    checkCollision(anotherRect : Rect) : Side {
        var w = 0.5 * (this.width() + anotherRect.width());
        var h = 0.5 * (this.height() + anotherRect.height());
        var dx = this.centerX() - anotherRect.centerX();
        var dy = this.centerY() - anotherRect.centerY();

        if (Math.abs(dx) <= w && Math.abs(dy) <= h) {
            var wy = w * dy;
            var hx = h * dx;
            if (wy > hx) {
                return wy > -hx ? Side.Top : Side.Left;
            } else {
                return wy > -hx ? Side.Right : Side.Bottom;
            }
        } else {
            return Side.None;
        }
    }
}

class Sprite extends Obstacle {
    sprite: HTMLElement;
    isVisible: Boolean;

    constructor(sprite: HTMLElement, left? : number, top?: number, right?: number, bottom?: number) {
        bottom = bottom || sprite.offsetTop + sprite.offsetHeight;
        right = right || sprite.offsetLeft + sprite.offsetWidth;
        top = top || sprite.offsetTop;
        left = left || sprite.offsetLeft;

        super(left, top, right, bottom);
        this.sprite = sprite;
        this.isVisible = true;
    }

    moveTo(rect : Rect) {
        super.moveTo(rect);

        let {x: posX, y: posY} = this.topLeft;

	    this.sprite.style.left = posX + 'px';
        this.sprite.style.top = posY + 'px';         
    }

    hide() {
        this.sprite.style.display = 'none';
        this.isVisible = false;
    }    

    show() {
        this.sprite.style.display = 'block';
        this.isVisible = true;
    }    

    checkCollision(anotherRect : Rect) : Side {
        if (!this.isVisible) {
            return Side.None;
        }
        return super.checkCollision(anotherRect);
    }
    livesLeft: number;
}

class Ball extends Sprite {

    radius : number;
    dir  : Vector;
    velocity: number;

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;

    constructor(sprite: HTMLElement, dir : Vector) {
        var radius = parseInt(getComputedStyle(sprite)['border-top-left-radius']);
        super(sprite, sprite.offsetLeft, sprite.offsetTop, sprite.offsetLeft + 2 * radius, sprite.offsetTop + 2 * radius);
        this.sprite = sprite;
        this.radius = radius;
        this.velocity = 5;        
        this.dir = dir;        
    }

    calculateNewPosition() : Rect {
        var newPosition = this.clone();
        newPosition.add(this.dir);
        return newPosition;        
    }

    bounceHorizontal() {
        this.dir.flipY();
    }

    bounceVertical() {
        this.dir.flipX();
    } 

    bounceWithAngle(angle: number) {
        angle = angle * (Math.PI / 180);
        this.dir.x = Math.cos(angle) * this.velocity;
        this.dir.y = -Math.sin(angle) * this.velocity;
    }
}

class Paddle extends Sprite {
    constructor(sprite: HTMLElement, public maxRight : number) {
        super(sprite);
    }

    moveLeft(step?: number) {
        var newPosition = this.clone();
        newPosition.moveLeft(step);

        if (newPosition.topLeft.x >= 0) {
            this.moveTo(newPosition);
        }
    }

    moveRight(step? : number) {
        var newPosition = this.clone();
        newPosition.moveRight(step);

        if (newPosition.bottomRight.x <= this.maxRight) {
            this.moveTo(newPosition);
        }
    }

    calculateHitAngle(ballX : number, ballRadius : number) : number {
        var hitSpot = ballX - this.topLeft.x;
        var maxPaddle = this.width() + ballRadius;
        var minPaddle = -ballRadius;
        var paddleRange = maxPaddle - minPaddle;

        var minAngle = 160;
        var maxAngle = 20;
        var angleRange = maxAngle - minAngle;

        return ((hitSpot * angleRange) / paddleRange) + minAngle;
    }
}

class HardBrick extends Sprite {
    livesLeft: number = 2;
}

class Brick extends Sprite {
    livesLeft: number = 1;
}

class DeathlessBrick extends Sprite {
    livesLeft: number = 100;
}

enum GameState {
    Running,
    GameOver
}

enum KeyCodes {
    LEFT = 37,
    RIGHT = 39
}

class Game {
    loopInterval: number = 10;
    gameState: GameState;
    ball: Ball;
    paddle: Paddle;
    bricks: Array<Brick> = [];

    keyMap = {};

    wallLeft : Obstacle;
    wallTop: Obstacle;
    wallRight: Obstacle;
    wallBottom: Obstacle;    

    livesLeft : number;
    score: number;

    constructor(ballElement : HTMLElement, paddle: HTMLElement, bricks: HTMLCollection, boardElement : HTMLElement, public livesLabel : HTMLElement,
        public scoreLabel: HTMLElement, public newGameBtn: HTMLElement) {
        this.gameState = GameState.Running;
        this.paddle = new Paddle(paddle, boardElement.offsetWidth);

        this.ball = new Ball(
            ballElement,            
            new Vector(3, -3) 
        );

        for (let i = 0; i < bricks.length; i++) {
            if (bricks[i].classList.contains("hardbrick")==true) {
                this.bricks.push(new HardBrick(<HTMLElement>bricks[i]));
            } else
            if (bricks[i].classList.contains("deathlessbrick")==true) {
                this.bricks.push(new DeathlessBrick(<HTMLElement>bricks[i]));
            } else {
                this.bricks.push(new Brick(<HTMLElement>bricks[i]));
            }
        }

        this.createWalls(this.ball.radius, boardElement.offsetWidth, boardElement.offsetHeight);

        this.newGame();

        this.newGameBtn.addEventListener('click', () => this.newGame());
    }    

    createWalls(radius : number, maxX : number, maxY : number) {
        this.wallLeft = new Obstacle(-radius, -radius, 0, maxY + radius);
        this.wallTop = new Obstacle(-radius, -radius, maxX + radius, 0);
        this.wallRight = new Obstacle(maxX, -radius, maxX + radius, maxY + radius);
        this.wallBottom = new Obstacle(-radius, maxY, maxX + radius, maxY + radius);        
    }

    newGame() {
        this.newGameBtn.style.display = 'none';
        this.score = 0;
        this.livesLeft = 3;
        this.livesLabel.innerText = '' + this.livesLeft;
        this.score = 0;
        this.scoreLabel.innerText = '' + this.score;
        this.ball.show();
        this.ball.bounceWithAngle(60);
        var ballPosition = this.ball.clone();
        ballPosition.moveCenterXTo(this.paddle.centerX());
        ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
        this.ball.moveTo(ballPosition);
        this.gameState = GameState.Running;
    }

    lostLive() {
        if (--this.livesLeft) {
            this.ball.bounceWithAngle(60);
            var ballPosition = this.ball.clone();
            ballPosition.moveCenterXTo(this.paddle.centerX());
            ballPosition.moveBottomTo(this.paddle.topLeft.y - 4);
            this.ball.moveTo(ballPosition);
        } else {
            this.gameState = GameState.GameOver;
            this.ball.hide();          
            this.newGameBtn.style.display = 'block';  
        }
        this.livesLabel.innerText = '' + this.livesLeft;
    }

    run() {
        document.addEventListener('keyup', (e) => this.keyMap[e.keyCode] = false);
        document.addEventListener('keydown', (e) => this.keyMap[e.keyCode] = true);

       setInterval(() => {
            if (this.gameState !== GameState.Running) {
                return;
            }
            var newBallPosition = this.ball.calculateNewPosition();

            if (this.keyMap[KeyCodes.LEFT]) {
                this.paddle.moveLeft(5);
            } else if (this.keyMap[KeyCodes.RIGHT]) {
                this.paddle.moveRight(5);
            }

            if (this.wallBottom.checkCollision(newBallPosition)) {
                this.lostLive();
                return;
            }

            if (this.wallLeft.checkCollision(newBallPosition) || this.wallRight.checkCollision(newBallPosition)) {
                this.ball.bounceVertical();
            }
            if (this.wallTop.checkCollision(newBallPosition)) {
                this.ball.bounceHorizontal();
            }     

            for (let brick of this.bricks) {
                let wasHit = false;

                switch (brick.checkCollision(newBallPosition)) {
                    case (Side.Left):
                    case (Side.Right):
                        this.ball.bounceVertical();
                        wasHit = true;
                        break;

                    case (Side.Top):
                    case (Side.Bottom):                    
                        this.ball.bounceHorizontal();
                        wasHit = true;
                }

                if (wasHit) { 
                    if(brick.livesLeft != 100) {
                         --brick.livesLeft;
                    }
                    if(brick.livesLeft < 1) {
                        brick.hide();
                        this.score += 20;
                    } else {
                        this.score += 5;
                    }
                    this.scoreLabel.innerText = '' + this.score;
                    break;
                }
            }

            if (this.paddle.checkCollision(newBallPosition)) {
                this.ball.bounceWithAngle(this.paddle.calculateHitAngle(this.ball.centerX(), this.ball.radius));
            }

            this.ball.moveTo(this.ball.calculateNewPosition());
       }, this.loopInterval) 
    }
}

console.log('Hello from BrickBuster !!!');

var game = new Game(
    <HTMLElement>document.getElementsByClassName("ball")[0],
    <HTMLElement>document.getElementsByClassName("paddle")[0],
    <HTMLCollection>document.getElementsByClassName("brick"),
    <HTMLElement>document.getElementsByClassName("game-board")[0],
    <HTMLElement>document.getElementById('lives'),
    <HTMLElement>document.getElementById('score'),
    <HTMLElement>document.getElementById('newGame')    
);

game.run();