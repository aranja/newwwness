module.exports = function(gulp, gutil) {
  gulp.task('archive', ['build'], function() {
    var zip = require('gulp-zip');

    return gulp.srcWithErrorHandling([
        gulp.config.target + '/**',
        '!' + gulp.config.target + '/archive.zip'
      ])
      .pipe(zip('archive.zip'))
      .pipe(gulp.dest(gulp.config.target));
  });
};
