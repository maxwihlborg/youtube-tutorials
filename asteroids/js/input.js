/**
 * InputHandeler class, listen for keypresses and keeps state of
 * monitored keys
 */
var InputHandeler = Class.extend({

	/**
	 * Constructor
	 * 
	 * @param  {object} keys keys to monitor
	 */
	init: function(keys) {
		// declare private fields
		this.keys = {};
		this.down = {};
		this.pressed = {};

		// initiate private fields
		for (key in keys) {
			var code = keys[key];

			this.keys[code] = key;
			this.down[key] = false;
			this.pressed[key] = false;
		}

		var self = this;

		// add eventlisteners to monitor presses
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

	/**
	 * Tells if a monitored key is hold down
	 * 
	 * @param  {string}  key name of monitored key
	 * @return {Boolean}     result from check
	 */
	isDown: function(key) {
		return this.down[key];
	},

	/**
	 * Tells if a monitored key is pressed, returns true first time
	 * the key is pressed
	 * 
	 * @param  {string}  key name of monitored key
	 * @return {Boolean}     result from check
	 */
	isPressed: function(key) {
		if (this.pressed[key]) {
			return false;
		} else if (this.down[key]) {
			return this.pressed[key] = true;
		}
		return false;
	}
});