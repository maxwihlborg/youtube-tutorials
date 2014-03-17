var Polygon = Class.extend({

	init: function(p) {
		this.points = p.slice(0);
	},

	rotate: function(theta) {
		var c = Math.cos(theta);
		var s = Math.sin(theta);

		for (var i = 0, len = this.points.length; i < len; i += 2) {
			var x = this.points[i];
			var y = this.points[i+1];

			this.points[i] = c*x - s*y;
			this.points[i+1] = s*x + c*y;
		}
	},

	scale: function(c) {
		for (var i = 0, len = this.points.length; i < len; i++) {
			this.points[i] *= c;
		}
	},

	hasPoint: function(ox, oy, x, y) {
		var c = false;
		var p = this.points;
		var len = p.length;

		for (var i = 0, j = len-2; i < len; i += 2) {
			var px1 = p[i] + ox;
			var px2 = p[j] + ox;

			var py1 = p[i+1] + oy;
			var py2 = p[j+1] + oy;

			if (( py1 > y != py2 > y ) &&
			    ( x < (px2-px1) * (y-py1) / (py2-py1) + px1 )
			) {
				c = !c;
			}
			j = i;
		}
		return c;
	}
});