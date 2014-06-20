function MenuState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var btns = [], angle = 0, frames = 0;

	var _yPos = 100;
	btns.push(new MenuButton("One Player Game", 20, _yPos, function() {
		state.get("game").init(ONE_PLAYER);
		state.change("game");
	}));
	btns.push(new MenuButton("Two Player Game", 20, _yPos+70, function() {
		state.get("game").init(TWO_PLAYER);
		state.change("game");
	}));
	btns.push(new MenuButton("About", 20, _yPos+140, function() {
		state.change("about", true);
	}));
	btns.push(new MenuButton("More Games", 20, _yPos+210, function() {
		window.open("https://github.com/maxwihlborg/youtube-tutorials");
	}));

	this.update = function() {
		frames++;
		angle = 0.2*Math.cos(frames*0.02);
	}

	this.render = function(_ctx) {
		ctx.clearRect(0, 0, canvas.width, canvas.height);

		ctx.save();
		ctx.translate(190, 40);
		ctx.rotate(angle);
		ctx.font = "40px Helvetica";
		ctx.fillStyle = "skyblue";
		var txt = "Tic Tac Toe";
		ctx.fillText(txt, -ctx.measureText(txt).width/2, 18);
		ctx.restore();

		for (var i = btns.length;i--;) {
			btns[i].draw(ctx);
		}

		if (_ctx) { 
			scene.draw(_ctx);
		} else {
			return scene.getCanvas();
		}
	}
}

var ONE_PLAYER = 1,
	TWO_PLAYER = 2;

function GameState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var data, player, ai, isPlayer, aiMoved, mode, winner, winnerMsg, hastick;

	canvas.addEventListener("mousedown", function(evt) {
		if (winnerMsg && state.active_name === "game") {
			state.change("menu", true);
			return;
		}
		if (!isPlayer || winner || state.active_name !== "game" || !hastick) return;

		var px = mouse.x;
		var py = mouse.y;

		if (px % 120 >= 20 && py % 120 >= 20) {
			var idx = Math.floor(px/120);
			idx += Math.floor(py/120)*3;

			if (data[idx].hasData()) {
				return;
			}
			data[idx].flip(player);
			if (mode & ONE_PLAYER) {
				isPlayer = false;
			} else {
				player = player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT;
			}
		}
	}, false);

	this.init = function(_mode, tile) {

		mode = _mode || ONE_PLAYER;
		data = [];

		for (var i = 0; i < 9; i++) {
			var x = (i % 3)*120 + 20;
			var y = Math.floor(i/3)*120 + 20;
			data.push(new Tile(x, y));
		}

		player = tile || Tile.NOUGHT;

		isPlayer = player === Tile.NOUGHT;
		aiMoved = false;
		winner = false;
		winnerMsg = false;
		hastick = false;

		ai = new AIPlayer(data);
		ai.setSeed(player === Tile.NOUGHT ? Tile.CROSS : Tile.NOUGHT);

		if (mode & TWO_PLAYER) {
			player = Tile.NOUGHT;
			isPlayer = true;
		}
	}

	this.update = function() {
		if (winnerMsg) return;
		var activeAnim = false;
		for (var i = data.length; i--;) {
			data[i].update();
			activeAnim = activeAnim || data[i].active();
		}
		if (!activeAnim) {
			if (!aiMoved && !isPlayer) {
				var m = ai.move();
				if (m === -1) {
					winner = true;
				} else {
					data[m].flip(ai.getSeed());
				}
				isPlayer = true;
			}

			if (winner && !aiMoved) {
				if (winner === true) {
					winnerMsg = "The game was a draw!";
				} else if (winner === Tile.NOUGHT) {
					winnerMsg = "The Nought player won!";
				} else {
					winnerMsg = "The Cross player won!";
				}
			}

			aiMoved = true;
		} else {
			if (aiMoved) {
				winner = ai.hasWinner();
			}
			aiMoved = false;
		}
		hastick = true;
	}

	this.render = function(_ctx) {

		ctx.clearRect(0, 0, canvas.width, canvas.height);

		for (var i = data.length; i--;) {
			data[i].draw(ctx);
		}
		if (winnerMsg) {
			var s = 10, lw = 2, w = 300, h = 80;

			w -= lw;
			h -= lw;

			ctx.save();
			ctx.translate((canvas.width - w + lw)/2, (canvas.height - h + lw)/2);
			ctx.fillStyle = "white";
			ctx.strokeStyle = "skyblue";
			ctx.lineWidth = lw;
			ctx.font = "20px Helvetica";

			ctx.beginPath();
			ctx.arc(s, s, s, Math.PI, 1.5*Math.PI);
			ctx.arc(w-s, s, s, 1.5*Math.PI, 0);
			ctx.arc(w-s, h-s, s, 0, 0.5*Math.PI);
			ctx.arc(s, h-s, s, 0.5*Math.PI, Math.PI);
			ctx.closePath();

			ctx.fill();
			ctx.stroke();

			ctx.fillStyle = "skyblue";
			var txt = winnerMsg;
			ctx.fillText(txt, w/2 -ctx.measureText(txt).width/2, 45);

			ctx.restore();
		}

		if (_ctx) { 
			scene.draw(_ctx);
		} else {
			return scene.getCanvas();
		}
	}
}

function AboutState(name) {

	this.name = name;
	var scene = new Scene(canvas.width, canvas.height),
		ctx = scene.getContext();

	var text = "Tic-tac-toe (or Noughts and crosses, Xs and Os) is a game for two players, X and O, who take turns marking the spaces in a 3×3 grid. The player who succeeds in placing three respective marks in a horizontal, vertical, or diagonal row wins the game.";
	var hastick = false;

	canvas.addEventListener("mousedown", function(evt) {
		if (hastick && state.active_name === "about") {
			state.change("menu");
		}
		hastick = false;
	}, false);
	
	(function() {

		ctx.font = "20px Helvetica";
		ctx.fillStyle = "skyblue";

		ctx.translate(20, 20);

		var s = 10,
			w = 340,
			h = 340,
			pi = Math.PI;

		ctx.beginPath();
		ctx.arc(s, s, s, pi, 1.5*pi);
		ctx.arc(w-s, s, s, 1.5*pi, 0);
		ctx.arc(w-s, h-s, s, 0, 0.5*pi);
		ctx.arc(s, h-s, s, 0.5*pi, pi);
		ctx.fill();

		ctx.fillStyle = "white";

		var words = text.split(' '),
			line = '',
			x = 20,
			y = 75,
			maxWidth = 300,
			lineHeight = 25;

		for(var n = 0; n < words.length; n++) {
			var testLine = line + words[n] + ' ';
			var metrics = ctx.measureText(testLine);
			var testWidth = metrics.width;
			if (testWidth > maxWidth && n > 0) {
				ctx.fillText(line, x, y);
				line = words[n] + ' ';
				y += lineHeight;
			}
			else {
				line = testLine;
			}
		}
		ctx.fillText(line, x, y);
	})();	


	this.update = function() {
		hastick = true;
	}

	this.render = function(_ctx) {

		if (_ctx) { 
			scene.draw(_ctx);
		} else {
			return scene.getCanvas();
		}
	}
}