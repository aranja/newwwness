function ChromeDetect() {
}

ChromeDetect.prototype.init = function () {
  this.isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor); 
  if (this.isChrome) {
    $('html').addClass('is-chrome');
  }
};

module.exports = new ChromeDetect;
