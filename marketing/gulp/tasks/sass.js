var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var browserSync = require('browser-sync');
var handleErrors = require('../util/handleErrors');
var config = require('../config').sass;

gulp.task('sass', function() {
  return gulp.src(config.src)
    .pipe($.sourcemaps.init())
    .pipe($.sass(config.settings))
    .on('error', handleErrors)
    .pipe($.sourcemaps.write())
    .pipe($.autoprefixer({ browsers: ['last 2 versions'] }))
    .pipe(gulp.dest(config.dest))
    .pipe(browserSync.reload({stream: true}))
});
