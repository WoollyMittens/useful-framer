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
		// set the active flag
		if (!/-active/.test(cfg.element.className)) cfg.element.className += ' framer-active';
		// implement the aspect ratio
		this.setAspect(cfg.aspect || 1);
	};

	this.setAspect = function(aspect) {
		// apply the aspect ratio to the framing indicator
		var width = Math.min(0.9, aspect * 0.9);
		var height = Math.min(0.9, 1 / aspect * 0.9);
		cfg.aspect = aspect;
		cfg.frame.style.top = ((1 - height) * 50) + '%';
		cfg.frame.style.right = ((1 - width) * 50) + '%';
		cfg.frame.style.bottom = cfg.frame.style.top;
		cfg.frame.style.left = cfg.frame.style.right;
		// centre the image inside the framing indicator
		this.centerCoordinates(cfg.left, cfg.top, cfg.size);
	};

	this.centerCoordinates = function(left, top, size) {
		// calculate the size different between the source image and the target frame
		var aspect = cfg.picture.offsetWidth / cfg.picture.offsetHeight;
		var overflow = cfg.aspect / aspect;
		// center the values
		this.setCoordinates(
			(left === undefined) ? Math.max(1 - overflow, 0) / 2 : left,
			(top === undefined) ? Math.max(1 - 1 / overflow, 0) / 2 : top,
			(size === undefined) ? 1 : size
		);
	};

	this.limitCoordinates = function(left, top, size) {
		// calculate the size different between the source image and the target frame
		var aspect = cfg.picture.offsetWidth / cfg.picture.offsetHeight;
		var overflow = cfg.aspect / aspect;
		// limit the size
		var minSize = 0.25;
		var maxSize = Math.min(overflow, 1);
		size = Math.min(Math.max(size, minSize), maxSize);
		// limit the horizontal
		var minLeft = 0;
		var maxLeft = Math.max(1 - size, 0);
		left = Math.min(Math.max(left, minLeft), maxLeft);
		// limit the vertical
		var minTop = 0;
		var maxTop = Math.max(1 - size / overflow, 0);
		top = Math.min(Math.max(top, minTop), maxTop);
		// store the corrected values
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
		this.reportValues();
	};

	this.moveLeft = function(amount) {
		amount = amount || 0.1;
		this.setCoordinates(
			cfg.left - amount,
			cfg.top,
			cfg.size
		);
	};

	this.moveRight = function(amount) {
		amount = amount || 0.1;
		this.setCoordinates(
			cfg.left + amount,
			cfg.top,
			cfg.size
		);
	};

	this.moveUp = function(amount) {
		amount = amount || 0.1;
		this.setCoordinates(
			cfg.left,
			cfg.top - amount,
			cfg.size
		);
	};

	this.moveDown = function(amount) {
		amount = amount || 0.1;
		this.setCoordinates(
			cfg.left,
			cfg.top + amount,
			cfg.size
		);
	};

	this.zoomIn = function(amount) {
		amount = amount || 1.1;
		var offset =  (1 - amount) / 2;
		this.setCoordinates(
			cfg.left - offset,
			cfg.top - offset,
			cfg.size / amount
		);
	};

	this.zoomOut = function(amount) {
		amount = amount || 0.9;
		var offset =  (1 - amount) / 2;
		this.setCoordinates(
			cfg.left - offset,
			cfg.top - offset,
			cfg.size / amount
		);
	};

	this.resetAll = function() {
		// recentre
		this.centerCoordinates();
	};

	this.reportValues = function() {
		// TODO: add dpi, pixel values, etc.
		if (this.cfg.output) this.cfg.output(cfg);
	};

	this.loadImage = function(url) {
		// disable the component
		cfg.element.className = cfg.element.className.replace(/framer-active/g, '');
		// update the image url
		cfg.picture.src = url;
	};

	this.updateAspect = function(aspect) {
		// update the image url
		delete(cfg.left);
		delete(cfg.top);
		delete(cfg.size);
		this.setAspect(aspect);
	};

	this.cropImage = function(type, quality) {
		var aspect = cfg.picture.offsetWidth / cfg.picture.offsetHeight;
		var width = cfg.picture.naturalWidth;
		var height = cfg.picture.naturalHeight;
		// create the canvas
		var canvas = document.createElement('canvas');
		canvas.className = 'framer-canvas';
		canvas.width = width * cfg.size;
		canvas.height = width * cfg.size / cfg.aspect;
		document.body.appendChild(canvas);
		// fill the canvas
		var context = canvas.getContext('2d');
		context.drawImage(
			cfg.picture,
			// source
			width * cfg.left,
			height * cfg.top,
			width * cfg.size,
			width * cfg.size / cfg.aspect,
			// target
			0, 0, canvas.width, canvas.height
		);
		// export the canvas
		return canvas.toDataURL(
			// image/png || image/jpeg || image/webp
			type || 'image/png',
			quality || 0.92
		);
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
						cfg.left + dX / 2 * dZ,
						cfg.top + dY / 2 * dZ,
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
			cfg.left + dX / 2 * dZ,
			cfg.top + dY / 2 * dZ,
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
