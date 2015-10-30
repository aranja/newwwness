var gulp = require('gulp');
var rimraf = require('rimraf');
var browserSync = require('browser-sync').create();
var config = require('../config');

gulp.task('clean', function() {
  rimraf(config.dest, function() {
  });
});
