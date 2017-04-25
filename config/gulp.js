'use strict';

module.exports = {
  css: {
    app: {
      main: './public/src/scss/app.scss',
      dest: './public/css',
      watch: ['public/src/scss/app.scss']
    },
    vendor: {
      main: './public/src/scss/vendor.scss',
      dest: './public/css',
      watch: ['public/src/scss/vendor.scss']
    }
  },
  js: {
    app: {
      main: './public/src/js/app.js',
      src: 'app.min.js',
      dest: './public/js',
      watch: ['public/src/js/app.js']
    },
    vendor: {
      main: './public/src/js/vendor.js',
      src: 'vendor.min.js',
      dest: './public/js',
      watch: ['public/src/js/vendor.js']
    }
  },
  watch: [
    'views/**/*',
    'public/css/**/*',
    'public/js/**/*',
  ],
  nodemon: {
    script: 'bin/www',
    ignore: ['gulpfile.js'],
    watch: ['./routes/', './bin/', 'app.js']
  }
};
