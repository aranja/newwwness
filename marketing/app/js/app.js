var ChromeDetect = require('./components/chromeDetect');

// Components
$(function() {
  WebFont.load({
    typekit: {
      id: 'rqg8woe'
    }
  });

  ChromeDetect.init();
});
