module.exports = function(gulp, gutil) {
  gulp.task('modernizr', function() {
    var modernizr = require('gulp-modernizr');
    var uglify = require('gulp-uglify');
    var prod = gutil.env.prod;

    return gulp.srcWithErrorHandling([
      gulp.config.source + '/styles/*.less',
      gulp.config.source + '/js/**.js'
    ])
      .pipe(modernizr({options: ['setClasses']}))
      .pipe(!prod ? gutil.noop() : uglify())
      .pipe(gulp.dest(gulp.config.target + '/js'));
  });
};
