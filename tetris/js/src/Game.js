

define(function() {

	var _vendors = ["o", "ms", "moz", "webkit"];
	for (var i = _vendors.length; i-- && !window.requestAnimationFrame;) {
		var v = _vendors[i];

		window.requestAnimationFrame = window[v + "RequestAnimationFrame"];
		window.cancelAnimationFrame = window[v + "CancelAnimationFrame"] ||
									  window[v + "CancelRequestAnimationFrame"];
	}

	var Game = Class.extend({

		tick: function() {
			console.warn("should overrided by childclass!");
		},

		stop: function() {
			if (this._reqframe) {
				window.cancelAnimationFrame(this._reqframe);
			}
			this._reqframe = null;
			this._running = false;
		},

		run: function() {
			if (this._running) return;
			this._running = true;

			var self = this;
			function loop() {
				self._reqframe = window.requestAnimationFrame(loop);

				self.tick();

				input.clearPressed();
				canvas.flip();
			}
			this._reqframe = window.requestAnimationFrame(loop);
		}
	});


	return Game;
});