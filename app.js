// =========================== Vector Class =======================================

class Vector {
    constructor(x = 0, y= 0) {
        this.x = x;
        this.y = y;
    }

    get len() {
        return Math.sqrt(this.x * this.x + this.y * this.y)
    }

    set len(value){
        const fact = value / this.len;
        this.x *= fact;
        this.y *= fact;
    }
}

// =========================== Rectangle Class =======================================

class Rectangle {
    constructor (w, h){
        this.pos = new Vector;
        this.size = new Vector (w, h);
    }
    
    // getters for the position of the item
    get left () {
        return this.pos.x - this.size.x / 2;
    }

    get right () {
        return this.pos.x + this.size.x / 2;
    }

    get top () {
        return this.pos.y - this.size.y / 2;
    }

    get bottom () {
        return this.pos.y + this.size.y / 2;
    }


}

// =========================== Ball Class =======================================

class Ball extends Rectangle{
    constructor (size) {
        super(15, 15);
        this.pos.width = size;
        this.pos.height = size;
        this.velocity = new Vector(+3, +3);       
    }
}

// =========================== Player Class =======================================

class Player extends Rectangle {
    constructor() {
        super(20, 100);
        this.score = 0;
    }

}

// =========================== Game Class =======================================

class Game {
    constructor(canvas) {
        this._canvas = canvas;
        this._context = canvas.getContext('2d');
        
        //create ball and two players
        this.ball = new Ball;    
        this.players = [new Player, new Player];
        
        this.players[0].pos.x = 40;
        this.players[1].pos.x = this._canvas.width -40;
        this.players.forEach(player => {
            player.pos.y = this._canvas.height / 2;
        })
        
        // pixel chars for displaying score
        this.CHAR_PIXEL = 10;
        this.CHARS = [
            '111101101101111',
            '010010010010010',
            '111001111100111',
            '111001111001111',
            '101101111001001',
            '111100111001111',
            '111100111101111',
            '111001001001001',
            '111101111101111',
            '111101111001111'
            ].map(str => {
                // rendering the score into canvas
                const canvas = document.createElement('canvas');
                canvas.height = this.CHAR_PIXEL * 5;
                canvas.width = this.CHAR_PIXEL * 3;
                const context = canvas.getContext('2d');
                context.fillStyle = '#fff';
                str.split('').forEach((fill, i) => {
                    if (fill === '1') {
                        context.fillRect(
                            (i % 3) * this.CHAR_PIXEL,
                            (i / 3 | 0) * this.CHAR_PIXEL,
                            this.CHAR_PIXEL,
                            this.CHAR_PIXEL);
                    }
                });
                return canvas;
            });
        
    }
    
    initializeGame() {
        window.addEventListener('keypress', this.startPlayBind);
        this.play();
    };

    
    // detecting collision of the paddle and causing the ball to bounce and increase its speed
    collision(player, ball) {
        if (player.left < ball.right && player.right > ball.left &&
            player.top < ball.bottom && player.bottom > ball.top) {
                const len = ball.velocity.len;
                ball.velocity.x = - ball.velocity.x;
                ball.velocity.y += 3 * (Math.random() - .5)
                // increase speed by 5% every time it hits the paddle
                ball.velocity.len = len * 1.05;
            }
        }
        
        // draw all the items and the board
        draw(){
        this._context.fillStyle = '#000';
        this._context.fillRect(0, 0, canvas.width, canvas.height);
        
        // draw ball and players
        this.drawRectangle(this.ball)  
        this.players.forEach(player => this.drawRectangle(player));

        //draw score
        this.drawScore();
    }
    
    //render the items on the board
    drawRectangle(rectangle) {
        this._context.fillStyle = '#fff';
        this._context.fillRect(rectangle.left, rectangle.top, 
            rectangle.size.x, rectangle.size.y);
        }

    //render the score
    drawScore () {
        const align = this._canvas.width / 2.3;
        const CHAR_WIDTH = this.CHAR_PIXEL * 4;
        this.players.forEach((player, index) => {
            const chars = player.score.toString().split('');
            const offset = align * 
                           (index + 1) - 
                           (CHAR_WIDTH * chars.length / 2) * 
                           this.CHAR_PIXEL / 2;
            chars.forEach((char, pos) => {
                this._context.drawImage(this.CHARS[char|0],
                                        offset + pos * CHAR_WIDTH, 20);
            });
        });
    }

    // if the ball leaves the board, reset, placing the ball in the middle
    reset() {
        this.ball.pos.x = this._canvas.width / 2;
        this.ball.pos.y = this._canvas.height / 2;
        this.ball.velocity.x = 0;
        this.ball.velocity.y = 0;
            }

    // method to continue the game
    start () {
        if (this.ball.velocity.x === 0 && this.ball.velocity.x === 0) {
            this.ball.velocity.x = 3 * (Math.random() > .5 ? 1 : -1);
            this.ball.velocity.y = 3 * (Math.random() * 2 - 1);
            this.ball.velocity.len = 3;
        }
    }
    
    // gets the game up an running
    play() {
        window.onload = function() {
            document.addEventListener('keypress', (event) => {
                if (event.key === 'w') {
                    this.players[0].pos.y -= 10;
                }
                if ( event.key === 's') {
                    this.players[0].pos.y += 10;
                }
                    
                if (event.key === 'o') {
                    this.players[1].pos.y -= 10;
                }

                if ( event.key === 'l') {
                        this.players[1].pos.y += 10;
                    }

                if ( event.keyCode === 32) {
                    this.start();
                }
                })
            }.bind(this) 
            
            setInterval( () => {
                
                this.ball.pos.x += this.ball.velocity.x;
                this.ball.pos.y += this.ball.velocity.y;
                
                if (this.ball.left < 0 || this.ball.right > canvas.width) {
                let playerId = this.ball.velocity.x < 0 | 0;
                this.players[playerId].score++;
                this.reset();
            }
            
            if (this.ball.top < 0 || this.ball.bottom > canvas.height) {
                this.ball.velocity.y = - this.ball.velocity.y;
            }
            
            this.players.forEach(player => this.collision(player, this.ball));
            // call draw to draw the items
            this.draw()            
        }, 17)
        
    }
}

const canvas = document.getElementById('pong');
const pong = new Game(canvas);
pong.play();
