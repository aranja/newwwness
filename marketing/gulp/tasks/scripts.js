var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserify = require('browserify');
var transform = require('vinyl-transform');
var config = require('../config').scripts;
var browserSync = require('browser-sync');


// Lint JavaScript
gulp.task('scripts-jshint', function () {
  return gulp.src(config.src)
    .pipe(browserSync.reload({stream: true, once: true}))
    .pipe($.jshint(config.jshint))
    .pipe($.jshint.reporter(require('jshint-stylish')))
    .pipe($.if(!browserSync.active, $.jshint.reporter('fail')));
});

gulp.task('scripts-browserify', function () {
  var browserified = transform(function(filename) {
    var b = browserify(filename);
    return b.bundle();
  });
  
  return gulp.src([config.src])
    .pipe(browserified)
    .pipe($.uglify())
    .pipe(gulp.dest(config.dest));
});

gulp.task('scripts', ['scripts-jshint', 'scripts-browserify']);