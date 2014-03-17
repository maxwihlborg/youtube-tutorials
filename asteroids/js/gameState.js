var Points = {
	ASTEROIDS: [
		[-4,-2,-2,-4,0,-2,2,-4,4,-2,3,0,4,2,1,4,-2,4,-4,2,-4,-2],
		[-3,0,-4,-2,-2,-4,0,-3,2,-4,4,-2,2,-1,4,1,2,4,-1,3,-2,4,-4,2,-3,0],
		[-2,0,-4,-1,-1,-4,2,-4,4,-1,4,1,2,4,0,4,0,1,-2,4,-4,1,-2,0],
		[-1,-2,-2,-4,1,-4,4,-2,4,-1,1,0,4,2,2,4,1,3,-2,4,-4,1,-4,-2,-1,-2],
		[-4,-2,-2,-4,2,-4,4,-2,4,2,2,4,-2,4,-4,2,-4,-2]
	],

	SHIP: [6,0,-3,-3,-2,0,-3,3,6,0],
	FLAMES: [-2,0,-3,-1,-5,0,-3,1,-2,0]
}
var AsteroidSize = 8;


var GameState = State.extend({

	init: function(game) {
		this._super(game);

		this.canvasWidth = game.canvas.ctx.width;
		this.canvasHeight = game.canvas.ctx.height;

		this.ship = new Ship(Points.SHIP, Points.FLAMES, 2, 0, 0);
		this.ship.maxX = this.canvasWidth;
		this.ship.maxY = this.canvasHeight;

		this.lvl = 0;

		this.generateLvl();
	},

	generateLvl: function() {
		var num = Math.round((this.lvl + 5)/10 + 2);

		this.ship.x = this.canvasWidth/2;
		this.ship.y = this.canvasHeight/2;

		this.bullets = [];
		this.asteroids = [];
		for (var i = 0; i < num; i++) {
			var n = Math.round(Math.random() * (Points.ASTEROIDS.length - 1));

			var x = 0, y = 0;
			if (Math.random() > 0.5) {
				x = Math.random() * this.canvasWidth;
			} else {
				y = Math.random() * this.canvasHeight;
			}

			var astr = new Asteroid(Points.ASTEROIDS[n], AsteroidSize, x, y);
			astr.maxX = this.canvasWidth;
			astr.maxY = this.canvasHeight;

			this.asteroids.push(astr);
		}
	},

	handleInputs: function(input) {
		if (input.isDown("right")) {
			this.ship.rotate(0.06);
		}
		if (input.isDown("left")) {
			this.ship.rotate(-0.06);
		}
		this.ship.drawFlames = false;
		if (input.isDown("up")) {
			this.ship.addVel();
		}

		if (input.isPressed("spacebar")) {
			this.bullets.push(this.ship.shoot());
		}
	},

	update: function() {
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			var a = this.asteroids[i];
			a.update();

			for (var j = 0, len2 = this.bullets.length; j < len2; j++) {
				var b = this.bullets[j];
				
				if (a.hasPoint(b.x, b.y)) {
					this.bullets.splice(j, 1);
					len2--;
					j--;

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
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			var b = this.bullets[i];
			b.update();

			if (b.shallRemove) {
				this.bullets.splice(i, 1);
				len--;
				i--;
			}
		}
		this.ship.update();

		if (this.asteroids.length === 0) {
			this.lvl++;
			this.generateLvl();
		}
	},

	render: function(ctx) {
		ctx.clearAll();
		for (var i = 0, len = this.asteroids.length; i < len; i++) {
			this.asteroids[i].draw(ctx);
		}
		for (var i = 0, len = this.bullets.length; i < len; i++) {
			this.bullets[i].draw(ctx);
		}
		this.ship.draw(ctx);
	}
});