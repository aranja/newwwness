var dest = "../api/public";
var src = "./app";

module.exports = {
  dest: dest,
  browserSync: {
    server: {
      // Serve up our build folder
      baseDir: dest
    }
  },
  sass: {
    src: src + "/sass/*.{sass,scss}",
    dest: dest + "/css",
    settings: {
      imagePath: 'images' // Used by the image-url helper
    }
  },
  scripts: {
    src: src + "/js/*.js",
    dest: dest + "/js",
    jshint: {
      globals: {
        'WebFont': false,
        '$': false
      }
    }
  },
  images: {
    src: src + "/images/**",
    dest: dest + "/images"
  },
  videos: {
    src: src + "/video/**",
    dest: dest + "/video"
  },
  html: {
    src: src + "/*.html",
    dest: dest + "/"
  },
  watch: {
    sass: src + '/sass/**',
    scripts: src + '/js/**',
    html: src + "/*.html",
    images: src + "/images/**"
  },
  markup: {
    src: src + "/htdocs/**",
    dest: dest
  },
  browserify: {
    // A separate bundle will be generated for each
    // bundle config in the list below
    bundleConfigs: [{
      entries: src + '/javascript/global.coffee',
      dest: dest,
      outputName: 'global.js',
      // Additional file extentions to make optional
      extensions: ['.coffee', '.hbs'],
      // list of modules to make require-able externally
      require: ['jquery', 'backbone/node_modules/underscore']
      // See https://github.com/greypants/gulp-starter/issues/87 for note about
      // why this is 'backbone/node_modules/underscore' and not 'underscore'
    }, {
      entries: src + '/javascript/page.js',
      dest: dest,
      outputName: 'page.js',
      // list of externally available modules to exclude from the bundle
      external: ['jquery', 'underscore']
    }]
  },
  production: {
    cssSrc: dest + '/*.css',
    jsSrc: dest + '/*.js',
    dest: dest
  }
}
