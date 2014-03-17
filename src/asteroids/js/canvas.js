var Canvas = Class.extend({

	init: function(width, height) {
		this.canvas = document.createElement("canvas");
		this.canvas.width = width;
		this.canvas.height = height;

		this.ctx = (function(ctx) {

			ctx.width = ctx.canvas.width;
			ctx.height = ctx.canvas.height;

			ctx.drawPolygon = function(p, x, y) {
				p = p.points;

				this.beginPath();
				this.moveTo(p[0] + x, p[1] + y);
				for (var i = 2, len = p.length; i < len; i += 2) {
					this.lineTo(p[i] + x, p[i + 1] + y);
				}
				this.stroke();
			};

			ctx.clearAll = function() {
				this.clearRect(0, 0, this.width, this.height);
			}

			return ctx;
		})(this.canvas.getContext("2d"));

		document.body.appendChild(this.canvas);
	},

	animate: function(loop) {
		var rf = (function() {
			return window.requestAnimationFrame    ||
				window.webkitRequestAnimationFrame ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function(cb, el) {
					window.setTimeout(cb, 1000/60);
				}
		})();

		var self = this;
		var l = function() {
			loop();
			rf(l, self.canvas);
		}
		rf(l, this.canvas);
	}
});