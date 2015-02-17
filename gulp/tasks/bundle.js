module.exports = function(gulp, gutil) {
  var jspm = require('jspm');

  gulp.task('bundle', function(cb) {
    jspm.bundleSFX('js/app', gulp.config.target + '/js/bundle.js', {
      minify: true
    }).then(cb);
  });
};
