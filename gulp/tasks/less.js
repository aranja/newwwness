module.exports = function(gulp, gutil) {
  gulp.task('less', function() {
    var livereload = require('gulp-livereload');
    var less = require('gulp-less');
    var autoprefixer = require('gulp-autoprefixer');
    var csso = require('gulp-csso');
    var prod = gutil.env.prod;

    return gulp.srcWithErrorHandling(gulp.config.source + '/styles/main.less')
      .pipe(less({
        paths: [
          gulp.config.source + '/styles'
        ],
        rootpath: '../',
        relativeUrls: true,
        strictMath: true
      }))
      .pipe(!prod ? gutil.noop() : csso())
      .pipe(autoprefixer({
        browsers: ['> 1%', 'last 2 versions', 'Firefox ESR', 'Opera 12.1']
      }))
      .pipe(gulp.dest(gulp.config.target + '/css'))
      .pipe(prod ? gutil.noop() : livereload());
  });
};
