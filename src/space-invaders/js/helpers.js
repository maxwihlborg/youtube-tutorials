/**	
 * Check if to axis aligned bounding boxes intersects
 *
 * @return {bool}  the check result
 */
function AABBIntersect(ax, ay, aw, ah, bx, by, bw, bh) {
	return ax < bx+bw && bx < ax+aw && ay < by+bh && by < ay+ah;
};


/**
 * Bullet class 
 * 
 * @param {number} x     start x position
 * @param {number} y     start y position
 * @param {number} vely  velocity in y direction
 * @param {number} w     width of the bullet in pixels
 * @param {number} h     height of the bullet in pixels
 * @param {string} color hex-color of bullet
 */
function Bullet(x, y, vely, w, h, color) {
	this.x = x;
	this.y = y;
	this.vely = vely;
	this.width = w;
	this.height = h;
	this.color = color;
};

/**
 * Update bullet position
 */
Bullet.prototype.update = function() {
	this.y += this.vely;
};


/**
 * Abstracted canvas class usefull in games
 * 
 * @param {number} width  width of canvas in pixels
 * @param {number} height height of canvas in pixels
 */
function Screen(width, height) {
	// create canvas and grab 2d context
	this.canvas = document.createElement("canvas");
	this.canvas.width = this.width = width;
	this.canvas.height = this.height = height;
	this.ctx = this.canvas.getContext("2d");
	// append canvas to body of document
	document.body.appendChild(this.canvas);
};

/**
 * Clear the complete canvas
 */
Screen.prototype.clear = function() {
	this.ctx.clearRect(0, 0, this.width, this.height);
};

/**
 * Draw a sprite instance to the canvas
 * 
 * @param  {Sprite} sp the sprite to draw
 * @param  {number} x  x-coordinate to draw sprite
 * @param  {number} y  y-coordinate to draw sprite
 */
Screen.prototype.drawSprite = function(sp, x, y) {
	// draw part of spritesheet to canvas
	this.ctx.drawImage(sp.img, sp.x, sp.y, sp.w, sp.h, x, y, sp.w, sp.h);
};

/**
 * Draw a bullet instance to the canvas
 * @param  {Bullet} bullet the bullet to draw
 */
Screen.prototype.drawBullet = function(bullet) {
	// set the current fillstyle and draw bullet
	this.ctx.fillStyle = bullet.color;
	this.ctx.fillRect(bullet.x, bullet.y, bullet.width, bullet.height);
};


/**
 * Sprite object, uses sheet image for compressed space
 * 
 * @param {Image}  img sheet image
 * @param {number} x   start x on image
 * @param {number} y   start y on image
 * @param {number} w   width of asset
 * @param {number} h   height of asset
 */
function Sprite(img, x, y, w, h) {
	this.img = img;
	this.x = x;
	this.y = y;
	this.w = w;
	this.h = h;
};


/**
 * InputHandeler class, handle and log pressed keys
 */
function InputHandeler() {
	this.down = {};
	this.pressed = {};
	// capture key presses
	var _this = this;
	document.addEventListener("keydown", function(evt) {
		_this.down[evt.keyCode] = true;
	});
	document.addEventListener("keyup", function(evt) {
		delete _this.down[evt.keyCode];
		delete _this.pressed[evt.keyCode];
	});
};

/**
 * Returns whether a key is pressod down
 * @param  {number}  code the keycode to check
 * @return {bool}         the result from check
 */
InputHandeler.prototype.isDown = function(code) {
	return this.down[code];
};

/**
 * Return wheter a key has been pressed
 * @param  {number}  code the keycode to check
 * @return {bool}         the result from check
 */
InputHandeler.prototype.isPressed = function(code) {
	// if key is registred as pressed return false else if
	// key down for first time return true else return false
	if (this.pressed[code]) {
		return false;
	} else if (this.down[code]) {
		return this.pressed[code] = true;
	}
	return false;
};
