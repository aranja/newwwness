var gulp = require('gulp');
var watch = require('gulp-watch');
var config = require('../config');
var runSequence = require('run-sequence');

gulp.task('watch', function() {
  watch(config.watch.sass, function() {
    runSequence('sass');
  });

  watch(config.watch.scripts, function() {
    runSequence('scripts');
  });

  watch(config.watch.html, function() {
    runSequence('copy');
  });

  watch(config.watch.images, function() {
    runSequence('copy');
  });
});
