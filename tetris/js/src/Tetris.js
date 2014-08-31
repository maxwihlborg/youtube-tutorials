

define(["src/Numfont"], function(Numfont) {

	var Tetris = Class.extend({

		init: function() {

			this.back = content.get("back");


			var num = content.get("numbers");
			this.font = {
				gray  : new Numfont(num,  0, 9),
				cyan  : new Numfont(num,  9, 9),
				red   : new Numfont(num, 18, 9),
				blue  : new Numfont(num, 27, 9),
				orange: new Numfont(num, 36, 9),
				green : new Numfont(num, 45, 9),
				yellow: new Numfont(num, 54, 9),
				purple: new Numfont(num, 63, 9)
			},

			this.data = {
				L: 2,
				I: 0,
				T: 0,
				S: 0,
				Z: 0,
				O: 0,
				J: 0,

				TOT: 12,
			}
		},

		handleInputs: function(inpt) {

		},

		update: function() {

		},

		draw: function(ctx) {

			ctx.drawImage(this.back, 0, 0);

			this.font.orange.draw(ctx, this.data.L, 432,  52, 5);
			this.font.cyan.draw(  ctx, this.data.I, 432,  76, 5);
			this.font.purple.draw(ctx, this.data.T, 432, 100, 5);
			this.font.green.draw( ctx, this.data.S, 432, 124, 5);
			this.font.red.draw(   ctx, this.data.Z, 432, 148, 5);
			this.font.yellow.draw(ctx, this.data.O, 432, 172, 5);
			this.font.blue.draw(  ctx, this.data.J, 432, 196, 5);

			this.font.gray.draw(  ctx, this.data.TOT, 425, 220, 6);
		}
	});


	return Tetris;

});