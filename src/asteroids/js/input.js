var InputHandeler = Class.extend({

	init: function(keys) { // { left: 37, up = 38 }
		this.keys = {};
		this.down = {};
		this.pressed = {};

		for (key in keys) {
			var code = keys[key];

			this.keys[code] = key;
			this.down[key] = false;
			this.pressed[key] = false;
		}

		var self = this;
		document.addEventListener("keydown", function(evt) {
			if (self.keys[evt.keyCode]) {

				self.down[self.keys[evt.keyCode]] = true;
			}
		});
		document.addEventListener("keyup", function(evt) {
			if (self.keys[evt.keyCode]) {

				self.down[self.keys[evt.keyCode]] = false;
				self.pressed[self.keys[evt.keyCode]] = false;
			}
		});
	},

	isDown: function(key) {
		return this.down[key];
	},

	isPressed: function(key) {
		if (this.pressed[key]) {
			return false;
		} else if (this.down[key]) {
			return this.pressed[key] = true;
		}
		return false;
	}
});