# framer.js: A picture framer for touch controls

A visual touch interface for generating framing coordinates.

*Incomplete: Work in progress.*

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
	'size': 1
});
```

**element : {DOM Object}** - Lorem ipsum dolor sit amet.

## How to control the script

### Update

```javascript
cropper.update({left:0.1, top:0.2, right:0.7, bottom:0.6});
```

Preset a crop setting.

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
