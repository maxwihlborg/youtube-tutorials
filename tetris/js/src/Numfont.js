

define(function() {

	var Numfont = Class.extend({

		init: function(img, y, h) {
			this.img = img;
			this.y = y;
			this.height = h;
			this.width = img.width / 10;
		},

		draw: function(ctx, num, x, y, padding) {

			num = ""+num;

			if (padding) {
				num = num.length >= padding ? num : new Array(padding - num.length + 1).join("0") + num;
			}

			var n;
			for (var i = 0, len = num.length; i < len; i++) {
				n = parseInt(num[i]);
				ctx.drawImage(this.img, this.width*n, this.y, this.width, this.height,
					x, y, this.width, this.height);
				x += this.width;
			}
		}
	});


	return Numfont;

});