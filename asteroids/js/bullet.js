/**
 * Bullet class, nothing fancy ^_^
 */
var Bullet = Class.extend({

	/**
	 * Bounds for the bullet
	 */
	maxX: null,
	maxY: null,

	/**
	 * Constructor
	 * 
	 * @param  {number} x     start x coordinate
	 * @param  {number} y     start y coordinate
	 * @param  {number} angle direction in which to fire
	 */
	init: function(x, y, angle) {
		this.x = x;
		this.y = y;

		this.shallRemove = false;

		// set velocity according to angle param
		this.vel = {
			x: 5*Math.cos(angle),
			y: 5*Math.sin(angle)
		}
	},

	/**
	 * Update position of bullet
	 */
	update: function() {
		// saves previous position, used when rendering
		this.prevx = this.x;
		this.prevy = this.y;

		// inside bounds check
		if (0 > this.x || this.x > this.maxX ||
			0 > this.y || this.y > this.maxY
		) {
			this.shallRemove = true;
		}

		// translate position
		this.x += this.vel.x;
		this.y += this.vel.y;
	},

	/**
	 * Draw the bullet to an augmented drawing context
	 * 
	 * @param  {context2d} ctx agumented drawing context
	 */
	draw: function(ctx) {
		ctx.beginPath();
		ctx.moveTo(this.prevx, this.prevy);
		ctx.lineTo(this.x, this.y);
		ctx.stroke();
	}
});