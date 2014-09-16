

var canvas, content, input;
(function() {

	canvas = (function() {

		var c = {},

			frame = document.getElementsByTagName("canvas")[0],
			_fctx = frame.getContext("2d"),

			view = document.createElement("canvas"),
			ctx = view.getContext("2d"),

			_fw, _fh, _vw, _vh, _scale = 1;


		c.frame = frame;
		c.view = view;
		c.ctx = ctx;

		c.flip = function() {
			_fctx.clearRect(0, 0, _fw, _fh);
			_fctx.drawImage(this.view, 0, 0, _fw, _fh);

			this.ctx.clearRect(0, 0, _vw, _vh);
		}

		Object.defineProperty(c, "width", {
			set: function(w) {
				this.view.width = w;
				this.scale = _scale;
			},
			get: function() {
				return _vw;
			}
		});
		Object.defineProperty(c, "height", {
			set: function(h) {
				this.view.height = h;
				this.scale = _scale;
			},
			get: function() {
				return _vh;
			}
		});
		Object.defineProperty(c, "scale", {
			set: function(s) {
				_scale = s;
				_vw = this.view.width;
				_vh = this.view.height;
				_fw = this.frame.width = _vw * s;
				_fh = this.frame.height = _vh * s;

				_fctx["imageSmoothingEnabled"] = false;
				["o", "ms", "moz", "webkit"].forEach(function(v) {
					_fctx[v + "ImageSmoothingEnabled"] = false;
				});
			},
			get: function() {
				return _scale;
			}
		});

		c.scale = _scale;

		return c;
	})();



	content = (function() {


		var c = {},

			_files = {},
			_filecount = 0,
			_loadcount = 0;

		c.get = function(name) {
			return _files[name];
		}

		c.progress = function() {
			return _loadcount/_filecount;
		}

		c.load = function(name, src) {

			src = src || name;

			_filecount++;

			switch (src.split(".").pop()) {

				case "png":
				case "gif":
				case "jpg":
					var img = new Image();
					img.onload = function() {
						_loadcount++;
					}
					img.src = src;
					_files[name] = img;
					break;

				case "ogg":
				case "mp3":
				case "wav":
					break;

				case "json":
				case "tmx":
					break;
			}
		}


		return c;

	})();


	input = (function() {

		var i = {},

			_bindings = {},
			_pressed = {},
			_down = {},
			_released = [],

			mouse = { x: 0, y: 0 };

		i.mouse = mouse;

		var Buttons = {
			LEFT: -1,
			MIDDLE: -2,
			RIGHT: -3
		}

		var Keys = {
			SPACE: 32,
			LEFT_ARROW: 37,
			UP_ARROW: 38,
			RIGHT_ARROW: 39,
			DOWN_ARROW: 40
		}

		for (var ch = 65; ch <= 90; ch++) {
			Keys[String.fromCharCode(ch)] = ch;
		}

		i.Buttons = Buttons;
		i.Keys = Keys;

		i.bindKey = function(action, keys) {
			if (typeof keys === "number") {
				_bindings[keys] = action;
				return;
			}
			for (var i = 0; i < keys.length; i++) {
				_bindings[keys[i]] = action;
			}
		}

		function _getCode(e) {
			var t = e.type;
			if (t === "keydown" || t === "keyup") {
				return e.keyCode;
			} else if (t === "mousedown" || t === "mouseup") {
				switch (e.button) {
					case 0:
						return Buttons.LEFT;
					case 1:
						return Buttons.MIDDLE;
					case 2:
						return Buttons.RIGHT;
				}
			}
		}

		function ondown(e) {
			var action = _bindings[_getCode(e)];
			if (!action) return;
			_pressed[action] = !_down[action];
			_down[action] = true;
			e.preventDefault();
		}

		function onup(e) {
			var action = _bindings[_getCode(e)];
			if (!action) return;
			_released.push(action);
			e.preventDefault();
		}

		function oncontext(e) {
			if (_bindings[Buttons.RIGHT]) {
				e.preventDefault();
			}
		}

		function onmove(e) {
			var el = e.target,
				ox = 0,
				oy = 0;

			do {
				ox += el.offsetLeft;
				oy += el.offsetTop;
			} while (el = el.parentOffset);

			mouse.x = e.clientX - ox;
			mouse.y = e.clientY - oy;

			e.preventDefault();
		}

		i.clearPressed = function() {
			for (var i = 0; i < _released.length; i++) {
				_down[_released[i]] = false;
			}
			_pressed = {};
			_released = [];
		}

		i.pressed = function(action) {
			return _pressed[action];
		}

		i.down = function(action) {
			return _down[action];
		}

		i.released = function(action) {
			return _released.indexOf(action) >= 0;
		}


		canvas.frame.onmousedown = ondown;
		canvas.frame.onmouseup = onup;
		canvas.frame.onmousemove = onmove;
		canvas.frame.oncontextmenu = oncontext;

		document.onkeydown = ondown;
		document.onkeyup = onup;
		document.onmouseup = onup;


		return i;

	})();

})();