# simple-assets-manager

Simple assets manager middleware for [express](https://github.com/strongloop/express). Includes [gulp](https://github.com/gulpjs/gulp) integration for concatenation and minification task.

## Installation

```bash
$ npm install git@github.com:sreucherand/simple-assets-manager.git
```

## Features

- In development environment, each resources are loaded separately.
- In production environment, the concatenated version is loaded.

## Usage

**Definition**

*assets.json*

```json
{
  "css/main.min.css": {
    "srcPath": "app/",
    "files": ["scss/css/main.css"]
  },
  "js/scripts.min.js": {
    "srcPath": "app/",
    "files": [
      "js/main.js",
      "js/classes/image.js"
    ]
  }
}
```

**Express**

Use `express` method.

*@param assets - assets definition file content*

- *app.js*

```javascript
app.use(require('simple-assets-manager').express(require('./assets.json')));
```

- *index.view.html, with [swig](https://github.com/paularmstrong/swig)*

```html
<html>
	<head>
		{{ assets('css/main.min.css') }}
	</head>
	<body>
		{{ assets('js/scripts.min.js') }}
	</body>
</html>
```

It will render,

- for development :

```html
<html>
	<head>
		 <link rel="stylesheet" href="scss/css/main.css">
	</head>
	<body>
		<script src="js/main.js"></script>
		<script src="js/classes/image.js"></script>
	</body>
</html>
```

- for production :

```html
<html>
	<head>
		 <link rel="stylesheet" href="css/main.min.css">
	</head>
	<body>
		<script src="js/scripts.min.js"></script>
	</body>
</html>
```

**Gulp**

*gulpfile.js*

Use gulp method. You need to specify the destination directory as option `path`. The example uses [gulp-if](https://github.com/robrich/gulp-if), [gulp-uglify](https://github.com/terinjokes/gulp-uglify) and [gulp-minify-css](https://github.com/jonathanepollack/gulp-minify-css) for minification.

```javascript
var gulpif = require('gulp-if');
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var assets = require('simple-assets-manager');

gulp.task('compile', ['sass'], function () {
  gulp.src('./assets.json')
    .pipe(assets.gulp({
      path: './public'
    }))
    .pipe(gulpif('*.js', uglify()))
    .pipe(gulpif('*.css', minify()))
    .pipe(gulp.dest('./public'));
});
```

It will generate the following files :

.
├── css
│   └── main.min.css
└── js
    └── scripts.min.js
