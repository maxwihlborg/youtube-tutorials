/**
 * Polygon class, simple polygon class with method as rotation and
 * scaling
 */
var Polygon = Class.extend({

	/**
	 * Constructor
	 * 
	 * @param  {Array<number>} p list of verticies
	 */
	init: function(p) {
		// copy verticies from param array
		this.points = p.slice(0);
	},

	/**
	 * Rotate the polygon clockwise
	 * 
	 * @param  {number} theta angle to ratate with
	 */
	rotate: function(theta) {
		// simplifying computition of 2x2 matrix
		// for more information see slides in part 1
		var c = Math.cos(theta);
		var s = Math.sin(theta);

		// iterate thru each vertex and change position
		for (var i = 0, len = this.points.length; i < len; i += 2) {
			var x = this.points[i];
			var y = this.points[i+1];

			this.points[i] = c*x - s*y;
			this.points[i+1] = s*x + c*y;
		}
	},

	/**
	 * Scale the polygon with the scalefactor
	 * 
	 * @param  {number} c scalefactor
	 */
	scale: function(c) {
		// ordinary vector multiplication
		for (var i = 0, len = this.points.length; i < len; i++) {
			this.points[i] *= c;
		}
	},

	/**
	 * Useful point in polygon check, taken from:
	 * http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
	 *
	 * @param  {number} ox offset x coordinate
	 * @param  {number} oy offset y coordinate
	 * @param  {number}  x test x coordinate
	 * @param  {number}  y test y coordinate
	 * @return {Boolean}   result from check
	 */
	hasPoint: function(ox, oy, x, y) {
		var c = false;
		var p = this.points;
		var len = p.length;

		// doing magic!
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