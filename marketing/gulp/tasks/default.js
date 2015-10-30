var gulp = require('gulp');
var runSequence = require('run-sequence');

gulp.task('default', function(cb) {
  runSequence(['sass', 'scripts'], 'copy', 'browser-sync', 'watch', cb);
});