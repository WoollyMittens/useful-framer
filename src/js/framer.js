/*
	Source:
	van Creij, Maurice (2019). "framer.js: A picture framer for touch controls", http://www.woollymittens.nl/.

	License:
	This work is licensed under a Creative Commons Attribution 3.0 Unported License.
*/

// establish the class
var Framer = function (cfg) {

	// PROPERTY

	this.cfg = cfg;
	this.cfg.frame = cfg.element.querySelector('figcaption');
	this.cfg.picture = cfg.element.querySelector('img');
	this.touches = null;

	// METHODS

	this.init = function() {
		// only proceed if the image has loaded
		if (!cfg.picture.offsetHeight) return false;
		// implement the aspect ratio
		if (cfg.aspect) this.setAspect(cfg.aspect);
		// implemment the coordinates
		this.setCoordinates(cfg.left, cfg.top, cfg.size);
	};

	this.setAspect = function(aspect) {
		// apply the aspect ratio to the framing indicator
		var width = Math.min(0.9, cfg.aspect * 0.9);
		var height = Math.min(0.9, 1 / cfg.aspect * 0.9);
		cfg.frame.style.top = ((1 - height) * 50) + '%';
		cfg.frame.style.right = ((1 - width) * 50) + '%';
		cfg.frame.style.bottom = cfg.frame.style.top;
		cfg.frame.style.left = cfg.frame.style.right;
	};

	this.limitCoordinates = function(left, top, size) {
		// calculate the size different between the source image and the target frame
		var aspect = cfg.picture.offsetWidth / cfg.picture.offsetHeight;
		var overflow = cfg.aspect / aspect;
		console.log('aspect', aspect, 'overflow', overflow);
		// limit the size
		var minSize = 0.25;
		var maxSize = Math.min(overflow, 1);
		size = Math.min(Math.max(size, minSize), maxSize);
		// limit the horizontal
		var minLeft = 0;
		var maxLeft = Math.max(1 - overflow, 0);
		left = Math.min(Math.max(left, minLeft), maxLeft);
		// limit the vertical
		var minTop = 0;
		var maxTop = Math.max(1 - 1 / overflow, 0);
		top = Math.min(Math.max(top, minTop), maxTop);
		// store the corrected values
		console.log('left', left, 'top', top, 'size', size);
		cfg.left = left;
		cfg.top = top;
		cfg.size = size;
	};

	this.setCoordinates = function(left, top, size) {
		// apply the limits
		this.limitCoordinates(left, top, size);
		// calculate transformation
		var z = cfg.frame.offsetWidth / cfg.picture.offsetWidth / cfg.size;
		var x = cfg.frame.offsetLeft - (cfg.left * cfg.picture.offsetWidth * z);
		var y = cfg.frame.offsetTop - (cfg.top * cfg.picture.offsetHeight * z);
		// apply the css transformation
		cfg.picture.style.transform = 'translate3d(' + x + 'px, ' + y + 'px, 0) scale3d(' + z + ', ' + z + ', 1)';
		// report the result
		this.cfg.output(cfg);
	};

	this.onTouched = function(evt) {
		// store the interactions
		this.touches = evt.touches || [evt];
	};

	this.onDragged = function(evt) {
		if (this.touches) {
			evt.preventDefault();
			var horizontal, vertical, dX, dY;
			var touches = evt.touches || [evt];
			switch(touches.length) {
				case 2:
					// update the scaling
					horizontal = Math.abs(touches[0].clientX - touches[1].clientX) - Math.abs(this.touches[0].clientX - this.touches[1].clientX);
					vertical = Math.abs(touches[0].clientY - touches[1].clientY) - Math.abs(this.touches[0].clientY - this.touches[1].clientY);
					dX = horizontal / cfg.element.offsetWidth;
					dY = vertical / cfg.element.offsetHeight;
					dZ = cfg.size;
					this.setCoordinates(
						cfg.left + dX / 4 * dZ,
						cfg.top + dY / 4 * dZ,
						cfg.size - dX - dY
					);
					break;
				default:
					// update the position
					horizontal = touches[0].clientX - this.touches[0].clientX;
					vertical = touches[0].clientY - this.touches[0].clientY;
					dX = horizontal / cfg.element.offsetWidth;
					dY = vertical / cfg.element.offsetHeight;
					dZ = cfg.size;
					this.setCoordinates(
						cfg.left - dX * dZ,
						cfg.top - dY * dZ,
						cfg.size
					);
			}
			this.touches = touches;
		}
	};

	this.onReleased = function(evt) {
		// clear the interactions
		this.touches = null;
	};

	this.onWheeled = function(evt) {
		// update the scaling
		var dX = evt.deltaY / cfg.element.offsetWidth;
		var dY = evt.deltaY / cfg.element.offsetHeight;
		var dZ = cfg.size;
		this.setCoordinates(
			cfg.left + dX / 4 * dZ,
			cfg.top + dY / 4 * dZ,
			cfg.size - dY
		);

	};

	// EVENTS

	cfg.element.addEventListener('touchstart', this.onTouched.bind(this));
	cfg.element.addEventListener('touchmove', this.onDragged.bind(this));
	cfg.element.addEventListener('touchend', this.onReleased.bind(this));
	cfg.element.addEventListener('touchcancel', this.onReleased.bind(this));
	cfg.element.addEventListener('mousedown', this.onTouched.bind(this));
	cfg.element.addEventListener('mousemove', this.onDragged.bind(this));
	cfg.element.addEventListener('mouseup', this.onReleased.bind(this));
	cfg.element.addEventListener('mouseout', this.onReleased.bind(this));
	cfg.element.addEventListener('wheel', this.onWheeled.bind(this));

	cfg.picture.addEventListener('load', this.init.bind(this));
	this.init();

};

// return as a require.js module
if (typeof define != 'undefined') define([], function () { return Framer });
if (typeof module != 'undefined') module.exports = Framer;
