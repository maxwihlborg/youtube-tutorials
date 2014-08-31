

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

})();