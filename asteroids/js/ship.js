/**
 * Ship class, extends Polygon see polygon.js
 */
var Ship = Polygon.extend({

	/**
	 * Bounds for the ship
	 */
	maxX: null,
	maxY: null,

	/**
	 * Constructor
	 * 
	 * @param  {Array<number>} p  list of ship verticies
	 * @param  {Array<number>} pf list of flames verticies
	 * @param  {number}        s  scalefactor, size of ship
	 * @param  {number}        x  start x coordinate
	 * @param  {number}        y  start y coordinate
	 */
	init: function(p, pf, s, x, y) {
		this._super(p); // call super constructor

		// create, init and scale flame polygon
		this.flames = new Polygon(pf);
		this.flames.scale(s);

		// visual flags
		this.drawFlames = false;
		this.visible = true;

		// position vars
		this.x = x;
		this.y = y;

		// scale the ship to the specified size
		this.scale(s);

		// facing direction
		this.angle = 0;

		// velocity
		this.vel = {
			x: 0,
			y: 0
		}
	},

	/**
	 * Returns whether ship is colling with asteroid
	 * 
	 * @param  {Asteroid} astr asteroid to test
	 * @return {Boolean}       result from test
	 */
	collide: function(astr) {
		// don't test if not visible
		if (!this.visible) {
			return false;
		}
		for (var i = 0, len = this.points.length - 2; i < len; i += 2) {
			var x = this.points[i] + this.x;
			var y = this.points[i+1] + this.y;

			if (astr.hasPoint(x, y)) {
				return true;
			}
		}
		return false;
	},

	/**
	 * Create and return bullet with arguments from current
	 * direction and position
	 * 
	 * @return {Bullet} the initated bullet
	 */
	shoot: function() {
		var b = new Bullet(this.points[0] + this.x, this.points[1] + this.y, this.angle);
		b.maxX = this.maxX;
		b.maxY = this.maxY;
		return b;
	},

	/**
	 * Update the velocity of the bullet depending on facing
	 * direction
	 */
	addVel: function() {
		// length of veloctity vector estimated with pythagoras
		// theorem, i.e.
		// 		a*a + b*b = c*c
		if (this.vel.x*this.vel.x + this.vel.y*this.vel.y < 20*20) {
			this.vel.x += 0.05*Math.cos(this.angle);
			this.vel.y += 0.05*Math.sin(this.angle);
		}
		this.drawFlames = true;
	},

	/**
	 * Rotate the ship and flame polygon clockwise
	 * 
	 * @param  {number} theta angle to rotate with
	 *
	 * @override Polygon.rotate
	 */
	rotate: function(theta) {
		this._super(theta);
		this.flames.rotate(theta);
		this.angle += theta;
	},

	/**
	 * Decrease velocity and update ship position
	 */
	update: function() {
		// update position
		this.x += this.vel.x;
		this.y += this.vel.y;

		this.vel.x *= 0.99;
		this.vel.y *= 0.99;

		// keep within bounds
		if (this.x > this.maxX) {
			this.x = 0;
		} else if (this.x < 0) {
			this.x = this.maxX;
		}
		if (this.y > this.maxY) {
			this.y = 0;
		}else if (this.y < 0) {
			this.y = this.maxY;
		}
	},

	/**
	 * Draw the ship with an augmented drawing context
	 * 
	 * @param  {context2d} ctx augmented drawing context
	 */
	draw: function(ctx) {
		if (!this.visible) {
			return;
		}
		ctx.drawPolygon(this, this.x, this.y);
		if (this.drawFlames) {
			ctx.drawPolygon(this.flames, this.x, this.y);
			this.drawFlames = false;
		}
	}
});