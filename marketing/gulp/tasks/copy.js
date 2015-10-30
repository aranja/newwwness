var gulp = require('gulp');
var config = require('../config');

gulp.task('copy', function () {
  gulp.src(config.html.src)
    .pipe(gulp.dest(config.html.dest))
  gulp.src(config.images.src)
    .pipe(gulp.dest(config.images.dest))
  gulp.src(config.videos.src)
    .pipe(gulp.dest(config.videos.dest))
});