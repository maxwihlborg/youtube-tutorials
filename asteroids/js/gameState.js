/**
 * AsteroidSize constant, probably a bad place to declare it
 */
var AsteroidSize = 8;

/**
 * GameState class, celled when game start, handle game updating and
 * rendering
 */
var GameState = State.extend({

	/**
	 * Constructor
	 * 
	 * @param  {Game} game manager for the state
	 */
	init: function(game) {
		this._super(game);

		// store canvas dimensions for later use
		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		// create ship object
		this.ship = new Ship(Points.SHIP, Points.FLAMES, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		// score and lives variables
		this.lives = 3;
		
		this.gameOver = false;

		this.score = 0;
		this.lvl = 0;

		// create lifepolygon and rotate 45° counter clockwise
		this.lifepolygon = new Polygon(Points.SHIP);
		this.lifepolygon.scale(1.5);
		this.lifepolygon.rotate(-Math.PI/2);

		// generate asteroids and set ship position
		this.generateLvl();
	},

	/**
	 * Create and initiate asteroids and bullets
	 */
	generateLvl: function() {
		// calculate the number of asteroid to create
		var num = Math.round(10*Math.atan(this.lvl/25)) + 3;

		// set ship position
		this.ship.x = this.canvasWidth/2;
		this.ship.y = this.canvasHeight/2;

		// init bullet array
		this.bullets = [];

		// dynamically create asteroids and push to array
		this.asteroids = [];
		for (var i = 0; i < num; i++) {
			// choose asteroid polygon randomly
			var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

			// set position close to edges of canvas
			var x = 0, y = 0;
			if (Math.random() > 0.5) {
				x = Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}
			// actual creating of asteroid
			var astr = new Asteroid(Points.ASTEROIDS[n], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;
			// push to array
			this.asteroids.push(astr);
		}
	},

	/**
	 * @override State.handleInputs
	 * 
	 * @param  {InputHandeler} input keeps track of all pressed keys
	 */
	handleInputs: function(input) {
		// only update ship orientation and velocity if it's visible
		if (!this.ship.visible) {
			if (input.isPressed("spacebar")) {
				// change state if game over
				if (this.gameOver) {
					this.game.nextState = States.END;
					this.game.stateVars.score = this.score;
					return;
				}
				this.ship.visible = true;
			}
			return;
		}

		if (input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if (input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		if (input.isDown("up")) {
			this.ship.addVel();
		}

		if (input.isPressed("spacebar")) {
			this.bullets.push(this.ship.shoot());
		}
	},

	/**
	 * @override State.update
	 */
	update: function() {
		// iterate thru and update all asteroids
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];
			a.update();

			// if ship collids reset position and decrement lives
			if (this.ship.collide(a)) {
				this.ship.x = this.canvasWidth/2;
				this.ship.y = this.canvasHeight/2;
				this.ship.vel = {
					x: 0,
					y: 0
				}
				this.lives--;
				if (this.lives <= 0) {
					this.gameOver = true;
				}
				this.ship.visible = false;
			}

			// check if bullets hits the current asteroid
			for (var j = 0, len2 = this.bullets.length; j < len2; j++) {
				var b = this.bullets[j];
				
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

					// update score depending on asteroid size
					switch (a.size) {
						case AsteroidSize:
							this.score += 20;
							break;
						case AsteroidSize/2:
							this.score += 50;
							break;
						case AsteroidSize/4:
							this.score += 100;
							break;
					}

					// if asteroid splitted twice, then remove
					// else split in half
					if (a.size > AsteroidSize/4) {
						for (var k = 0; k < 2; k++) {
							var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

							var astr = new Asteroid(Points.ASTEROIDS[n], a.size/2, a.x, a.y);
							astr.maxX = this.canvasWidth;
							astr.maxY = this.canvasHeight;

							this.asteroids.push(astr);
							len++;
						}
					}
					this.asteroids.splice(i, 1);
					len--;
					i--;
				}
			}
		}

		// iterate thru and update all bullets
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			var b = this.bullets[i];
			b.update();

			// remove bullet if removeflag is setted
			if (b.shallRemove) {
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}
		// update ship
		this.ship.update();

		// check if lvl completed
		if (this.asteroids.length === 0) {
			this.lvl++;
			this.generateLvl();
		}
	},

	/**
	 * @override State.render
	 * 
	 * @param  {context2d} ctx augmented drawing context
	 */
	render: function(ctx) {
		ctx.clearAll();
		// draw score and extra lives
		ctx.vectorText(this.score, 3, 35, 15);
		for (var i = 0; i < this.lives; i++) {
			ctx.drawPolygon(this.lifepolygon, 40+15*i, 50);
		}
		// draw all asteroids and bullets
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].draw(ctx);
		}
		// draw game over messege
		if (this.gameOver) {
			ctx.vectorText("Game Over", 4, null, null);
		}
		// draw ship
		this.ship.draw(ctx);
	}
});