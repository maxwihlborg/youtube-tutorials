var Asteroid = Polygon.extend({

	maxX: null,
	maxY: null,

	init: function(p, s, x, y) {
		this._super(p);

		this.size = s;

		this.x = x;
		this.y = y;

		this.scale(s);

		this.rotAngle = 0.02*(Math.random()*2 - 1);

		var r = 2*Math.PI*Math.random();
		var v = Math.random() + 1;
		this.vel = {
			x: v*Math.cos(r),
			y: v*Math.sin(r)
		}
	},

	hasPoint: function(x, y) {
		return this._super(this.x, this.y, x, y);
	},

	update: function() {
		this.x += this.vel.x;
		this.y += this.vel.y;

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
		this.rotate(this.rotAngle);
	},

	draw: function(ctx) {
		ctx.drawPolygon(this, this.x, this.y);
	}
});