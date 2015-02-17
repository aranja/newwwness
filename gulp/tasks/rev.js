module.exports = function(gulp, gutil) {
  var revall = require('gulp-rev-all');
  var rimraf = require('rimraf');
  var prod = gutil.env.prod;
  var temp = 'temp'; // write the files to a temp folder, then swap this with gulp.config.target

  gulp.task('rev', function(cb) {
    gulp.src(gulp.config.target + '/**', { base: gulp.config.target })
      .pipe(revall({
        base: gulp.config.target,
        ignore: [
          'index.html',
          'favicon.png',
          'CNAME'
        ],
        quiet: true
      }))
      .pipe(gulp.dest(temp))
      .on('end', function() {
        rimraf(gulp.config.target, function() {
          gulp.src(temp + '/**')
            .pipe(gulp.dest(gulp.config.target))
            .on('end', function() {
              rimraf(temp, cb)
            })
        })
      })
  });
};
