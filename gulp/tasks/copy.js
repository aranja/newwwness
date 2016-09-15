module.exports = function(gulp, gutil) {
  gulp.task('copy', function(cb) {
    var connect = require('gulp-connect');
    var prod = gutil.env.prod;
    var source = gulp.config.source;
    var target = gulp.config.target;
    var merge = require('merge-stream');

    var copyHtml = gulp.src(source + '/*.html')
      .pipe(gulp.dest(target + '/'))
      .pipe(prod ? gutil.noop() : connect.reload());
    var copyImages = gulp.src(source + '/img/**/*.ico')
      .pipe(gulp.dest(target + '/img/'))
      .pipe(prod ? gutil.noop() : connect.reload());
    var copyVendor = gulp.src(source + '/js/vendor/*.js')
      .pipe(gulp.dest(target + '/js/vendor/'))
      .pipe(prod ? gutil.noop() : connect.reload());
    var copyFonts = gulp.src(source + '/fonts/**')
      .pipe(gulp.dest(target + '/fonts/'))
      .pipe(prod ? gutil.noop() : connect.reload());
    var copyVideos = gulp.src(source + '/videos/**')
      .pipe(gulp.dest(target + '/videos/'))
      .pipe(prod ? gutil.noop() : connect.reload());

    if (gutil.env.extension) {
      var copyGuts = gulp.src(source + '/extension/**')
        .pipe(gulp.dest(target))
        .pipe(prod ? gutil.noop() : connect.reload());
    } else {
      var copyGuts = gulp.src(source + '/website/**')
        .pipe(gulp.dest(target))
        .pipe(prod ? gutil.noop() : connect.reload());
    }

    if (!prod) {
      gulp.src(source + '/js/*.js')
        .pipe(gulp.dest(target + '/js'))
        .pipe(prod ? gutil.noop() : connect.reload());
      gulp.src('jspm_packages/**')
        .pipe(gulp.dest(target + '/jspm_packages'));
      gulp.src(source + '/templates/**')
        .pipe(gulp.dest(target + '/templates/'))
        .pipe(prod ? gutil.noop() : connect.reload());
    }

    return merge(copyHtml, copyImages, copyVendor, copyFonts, copyVideos, copyGuts);

  });
};
