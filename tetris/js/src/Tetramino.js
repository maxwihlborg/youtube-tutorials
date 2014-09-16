

define(function() {

	var ShapeDef = {
		L: "001"+
		   "111"+
		   "000",

		I: "0000 1111 0000 0000",
		T: "010 111 000",
		S: "011 110 000",
		Z: "110 011 000",
		O: "011 011 000",
		J: "100 111 000"
	};

	var IDs = [];
	for (var sd in ShapeDef) {
		ShapeDef[sd] = ShapeDef[sd].replace(/\s+/g, "");
		IDs.push(sd);
	}

	var Tetramino = Class.extend({

		init: function(id, x, y) {
			this._shapes = [];
			this.rotation = 0;
			this.ID = id.toUpperCase();

			this.x = x || 0;
			this.y = y || 0;

			var shape = ShapeDef[this.ID];

			var s = [],
				n = Math.sqrt(shape.length);

			for (var i = 0; i < n; i++) {
				s[i] = [];
				for (var j = 0; j < n; j++) {
					s[i][j] = parseInt(shape[j + i*n]);
				}
			}
			this._shapes.push(s);

			var r = 3, t;
			while (this.ID !== "O" && r-- !== 0) {
				t = [];
				for (var i = 0; i < n; i++) {
					t[i] = [];
					for (var j = 0; j < n; j++) {
						t[i][j] = s[n - j - 1][i];
					}
				}
				s = t.slice(0);
				this._shapes.push(s);
			}
		},

		setTo: function(control, id) {
			id = id != null ? id : this.ID;
			var shape = this._shapes[this.rotation];

			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < shape.length; j++) {
					if (shape[j][i]) {
						control[this.x+i][this.y+j].setType(id);
					}
				}
			}
		},

		check: function(control, dx, dy, dr) {
			dx = dx || 0;
			dy = dy || 0;
			dr = dr ? this.getRotation(dr) : this.rotation;

			var x = this.x + dx,
				y = this.y + dy,
				w = control.length,
				h = control[0].length,
				shape = this._shapes[dr];

			for (var i = 0; i < shape.length; i++) {
				for (var j = 0; j < shape.length; j++) {
					if (shape[j][i]) {

						if (!(0 <= x+i && x+i < w && 0 <= y+j && y+j < h) ||
							control[x+i][y+j].solid
						) {
							return false;
						}
					}
				}
			}

			return true;
		},

		getRotation: function(dr) {
			var r = this.rotation,
				l = this._shapes.length;
			if (dr > 0) {
				return (r + 1) % l;
			} else {
				return r - 1 >= 0 ? r - 1 : l - 1;
			}
		},

		toString: function() {
			var str = "";

			for (var i = 0; i < this._shapes.length; i++) {
				str += "\n";
				var s = this._shapes[i];
				for (var j = 0; j < s.length; j++) {
					for (var k = 0; k < s[j].length; k++) {
						str += s[j][k] ? "#" : ".";
					}
					str += "\n"
				}
			}

			return str;
		}
	});

	for (var i = 0; i < IDs.length; i++) {
		Tetramino[IDs[i]] = IDs[i];
	}


	return Tetramino;
});