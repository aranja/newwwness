module.exports = function(gulp) {
  var watch = require('gulp-watch');

  gulp.task('watch', ['build'], function() {
    watch(gulp.config.source + '/styles/**/*.less', function() {
      gulp.start('less');
    });

    watch([
      gulp.config.source + '/*.html',
      gulp.config.source + '/img/**/*.{png,gif,jpg,jpeg,svg}',
      gulp.config.source + '/fonts/**/*',
      gulp.config.source + '/videos/**/*',
      gulp.config.source + '/js/**/*',
      gulp.config.source + '/jspm_packages/**/*',
      gulp.config.source + '/templates/**/*'
    ], function() {
      gulp.start('copy');
    });

    watch(gulp.config.source + '/views/**/*.jade', function() {
      gulp.start('jade');
    });

    watch(gulp.config.source + '/img/**/*.{png,gif,jpg,jpeg,svg}', function() {
      gulp.start('images');
    });
  });
};
