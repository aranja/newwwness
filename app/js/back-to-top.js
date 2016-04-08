
class BackToTop {
  constructor() {
    this.backToTop = document.getElementById('backToTop')
    this.backToTop.addEventListener('click', this.topHandler.bind(this))
  }

  topHandler() {
    this.scrollToTop(500)
  }

  scrollToTop(scrollDuration) {
    const   scrollHeight = window.scrollY,
            scrollStep = Math.PI / ( scrollDuration / 15 ),
            cosParameter = scrollHeight / 2;
    var     scrollCount = 0,
            scrollMargin;
    requestAnimationFrame(step);
    function step () {
      setTimeout(function() {
        if ( window.scrollY > 10 ) {
          requestAnimationFrame(step);
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
          window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
        }
        else {
          window.scrollTo( 0, 0 );
        }
      }, 15 );
    }
  }
}

export default BackToTop
