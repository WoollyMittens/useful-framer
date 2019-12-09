# framer.js: A picture framer for touch controls

A visual touch interface for generating framing coordinates.

Try the <a href="http://www.woollymittens.nl/default.php?url=useful-framer">demo</a>.

## How to include the script

The stylesheet is best included in the header of the document.

```html
<link rel="stylesheet" href="css/framer.css"/>
```

This include can be added to the header or placed inline before the script is invoked.

```html
<script src="js/framer.js"></script>
```

Or use [Require.js](https://requirejs.org/).

```js
requirejs([
	'js/framer.js'
], function(Gestures, urls, Cropper) {
	...
});
```

Or import into an MVC framework.

```js
var Cropper = require('js/framer.js');
``

## How to start the script

```javascript
var framer = new Framer({
	'element': document.querySelector('.framer'),
	'aspect': 4/3,
	'left': 0,
	'top': 0,
	'size': 1,
	'output': function(result) {}
});
```

**element : {DOM Object}** - The container of the image to be affected.

**aspect : {Fraction}** - The desired aspect ratio of the framed image.

**left : {Float}** - Starting position between the left (0) or right (1).

**top : {Float}** - Starting position between the top (0) or bottom (1).

**size : {Float}** - Starting visible fraction of the image. (e.g. 0.5 would start the image twice as large as the frame).

**output : {Function}** - Function that receives the framing coordinates.

## How to control the script

### setCoordinates

Preset a crop setting.

```javascript
framer.setCoordinates(left, top, size);
```
**left : {Float}** - Starting position between the left (0) or right (1).

**top : {Float}** - Starting position between the top (0) or bottom (1).

**size : {Float}** - Starting visible fraction of the image. (e.g. 0.5 would start the image twice as large as the frame).

### moveLeft

Move the framed area to the left.

```javascript
framer.moveLeft(amount);
```
**amount : {Float}** - Optionally a fraction of the image width to move.

### moveRight

Move the framed area to the right.

```javascript
framer.moveRight(amount);
```
**amount : {Float}** - Optionally a fraction of the image width to move.

### moveUp

Move the framed area up.

```javascript
framer.moveUp(amount);
```
**amount : {Float}** - Optionally a fraction of the image height to move.

### moveDown

Move the framed area down.

```javascript
framer.moveDown(amount);
```
**amount : {Float}** - Optionally a fraction of the image height to move.

### zoomIn

Zoom the frame in.

```javascript
framer.zoomIn(factor);
```
**factor : {Float}** - Optionally a factor to zoom in.

### zoomOut

Zoom the frame out.

```javascript
framer.zoomOut(factor);
```
**factor : {Float}** - Optionally a factor to zoom out.

### resetAll

Reset the frame to the centre.

```javascript
framer.resetAll();
```

### reportValues

Reports the framed coordinated back in an object.

```javascript
values = framer.reportValues();
```

**values : {Object}** - An object containing the frame settings.

- **left : {Float}** - Horizontal position between the left (0) or right (1).

- **top : {Float}** - Vertical position between the top (0) or bottom (1).

- **size : {Float}** - Framed fraction of the image. (e.g. 0.5 means half the image).

### cropImage

TODO: Returns the cropped image as a JPEG or a PNG.

```javascript
image = framer.cropImage(type);
```

**type : {String}** - JPEG or PNG.

**image : {String}** - A base 64 Encoded JPEG or PNG.

### cropImage

TODO: Loads a new image into the editor.

```javascript
framer.cropImage(url);
```

**url : {String}** - The path of an image to load into the editor.

## How to build the script

This project uses node.js from http://nodejs.org/

This project uses gulp.js from http://gulpjs.com/

The following commands are available for development:
+ `npm install` - Installs the prerequisites.
+ `gulp import` - Re-imports libraries from supporting projects to `./src/libs/` if available under the same folder tree.
+ `gulp dev` - Builds the project for development purposes.
+ `gulp dist` - Builds the project for deployment purposes.
+ `gulp watch` - Continuously recompiles updated files during development sessions.
+ `gulp serve` - Serves the project on a temporary web server at http://localhost:8500/.
+ `gulp php` - Serves the project on a temporary php server at http://localhost:8500/.

## License

This work is licensed under a [MIT License](https://opensource.org/licenses/MIT). The latest version of this and other scripts by the same author can be found on [Github](https://github.com/WoollyMittens) and at [WoollyMittens.nl](https://www.woollymittens.nl/).
