module.exports = function(gulp, gutil) {
  var exec = require('child_process').exec;
  var fs = require('fs');
  var runSequence = require('run-sequence');
  var version = gutil.env.version;

  gulp.task('deploy-appengine', function(cb) {
    var cmd = 'appcfg.py update --oauth2 api';
    if (version) {
      cmd += ' --version ' + version;
    }

    var child = exec(cmd, cb);
    child.stdout.pipe(process.stdout);
    child.stderr.pipe(process.stderr);
  });

  gulp.task('deploy-log', function(cb) {
    var appName = getAppName();
    if (version) {
      appUrl = 'https://' + version + '-dot-' + appName + '.appspot.com/';
    } else {
      appUrl = 'http://newwwness.co/';
    }
    console.log('Deployed to', appUrl);
  });

  gulp.task('deploy', ['build'], function(cb) {
    runSequence('deploy-appengine', 'deploy-log', cb);
  });

  function getAppName() {
    var appYaml = fs.readFileSync('api/app.yaml', {encoding: 'utf8'});
    var appMatch = appYaml.match(/^application:\s*(.+)$/im);
    if (!appMatch || !appMatch[1]) {
      throw new Error('Could not find application name in app.yaml');
    }
    return appMatch[1];
  }
};
