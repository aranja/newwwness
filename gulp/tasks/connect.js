module.exports = function(gulp, gutil) {
  var exec = require('child_process').exec;

  gulp.task('connect', function(cb) {
    var child = exec('goapp serve ./api', cb);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });
};
