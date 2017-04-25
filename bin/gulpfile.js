'use strict';

// gulp file paths from config obj
const config = require('./../config/gulp');

// gulp dependencies
const browserify = require('browserify');
const bs = require('browser-sync').create();
const buffer = require('vinyl-buffer');
const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const rename = require('gulp-rename');
const sass = require('gulp-sass');
const source = require('vinyl-source-stream');

// utilities

// TODO pass bool to toggle maps/minifyGlobalJs
// adds source map data url to file: default = false
const maps = (() => {
	let flag = false;
	return (bool) => {
		if (bool) flag = true;
		return flag;
	};
})();

const minifyGlobalJs = (() => {
	let flag = {
		global: true
	};
	return (bool) => {
		if (bool === false) flag = {
			global: false
		};
		return flag;
	};
})();

function compileCss(options) {
	return gulp.src(options.main)
		.pipe(sass({
			sourceMapEmbed: maps(),
			outputStyle: 'compressed'
		}).on('error', sass.logError))
		.pipe(rename({
			suffix: '.min'
		}))
		.pipe(gulp.dest(options.dest));
}

function compileJs(options) {
	return browserify(options.main, {
			debug: maps()
		})
		.transform('babelify', {
			presets: ['es2015']
		})
		.transform('uglifyify', minifyGlobalJs())
		.bundle()
		.pipe(source(options.src))
		.pipe(buffer())
		.pipe(gulp.dest(options.dest));
}

// tasks
gulp.task('css-app', () => {
	return compileCss({
		main: config.css.app.main,
		dest: config.css.app.dest
	});
});

gulp.task('css-vendor', () => {
	return compileCss({
		main: config.css.vendor.main,
		dest: config.css.vendor.dest
	});
});

gulp.task('js-app', () => {
	return compileJs({
		main: config.js.app.main,
		src: config.js.app.src,
		dest: config.js.app.dest
	});
});

gulp.task('js-vendor', () => {
	return compileJs({
		main: config.js.vendor.main,
		src: config.js.vendor.src,
		dest: config.js.vendor.dest
	});
});

gulp.task('nodemon', (done) => {
	let started = false;
	nodemon(config.nodemon)
		.on('start', () => {
			if (!started) {
				started = true;
				done();
			} else {
				setTimeout(() => bs.reload(), 500);
			}
		});
});

gulp.task('reload', (done) => {
	bs.reload();
	done();
});

gulp.task('production', ['css', 'js']);

gulp.task('development', ['nodemon'], () => {
	maps(true);
	minifyGlobalJs(true);
	bs.init({
		port: 3002,
		ui: false,
		open: false,
		notify: false,
		ghostMode: false,
		proxy: 'http://localhost:3001',
	});
	gulp.watch(config.css.app.watch, ['css-app']);
	gulp.watch(config.css.vendor.watch, ['css-vendor']);
	gulp.watch(config.js.app.watch, ['js-app']);
	gulp.watch(config.js.vendor.watch, ['js-vendor']);
	gulp.watch(config.watch, ['reload']);
});
