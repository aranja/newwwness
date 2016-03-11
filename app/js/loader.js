import NewwwnessApi from './newwwness-api'
import Articles from './articles'
import Event from './event'

class Loader {
  constructor() {
    Articles.destroy()
    this.el = document.getElementById('loader')
    this.backToTop = document.getElementById('backToTop')
    this.images = []
    this.ids = []
    this.data = []
    this.dataAvailable = []
    this.hasBeenFilled = false
    this.load({type: 'shuffle', shuffleWithin: 20})
    this.rows = 1
    this.reloading = false
    this.dateParts = []

    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.scrollHandler.bind(this))
    window.addEventListener('mousewheel', this.wheelHandler.bind(this))

    this.backToTop.addEventListener('click', this.topHandler.bind(this))
  }

  start() {
  }

  stop(collection) {
    Articles.isLoaded(collection)
  }

  scrollHandler() {
    let offset = (document.all ? iebody.scrollTop : pageYOffset)
    document.getElementById('header').style.opacity = 1 - offset / (window.innerHeight / 4 - 100)
    document.getElementById('backToTop').style.opacity = offset / (window.innerHeight / 4 - 100)

    if (offset > 5 + (370 * (this.rows - 1))) {
      this.load({
        type: 'normal',
        skip: this.data.length
      })
      this.rows++
    }
  }

  wheelHandler(event) {
    if (pageYOffset == 0 && !this.reloading && event.wheelDelta > 40) {
      this.rows = 1
      this.load({
        type: 'shuffle'
      })

      this.reloadingTime()
    }

    if (pageYOffset > 0) {
      this.reloadingTime()
    }
  }

  reloadingTime() {
    this.reloading = true

    clearTimeout(this.timeout)
      this.timeout = setTimeout(function() {
        this.reloading = false
      }.bind(this), 1000)
  }

  errorHandler(error) {
    console.log(error)
  }

  load(params) {
    this.loadData(params).then(() => this.waitForImages(params))
  }

  loadData(params) {
    let ret = null

    if (params.type == 'shuffle' && this.data.length > 3) {
      this.dataAvailable = this.data.slice(0);
    }

    if (this.dataAvailable.length > 3) {
      this.addRow(params.type == 'shuffle', params.shuffleWithin)
      ret = new Promise(function(resolve, reject) {
        resolve(1);
      })
    }
    else {
      ret = NewwwnessApi.load(params).then(data => {
        this.data = this.data.concat(data.items)
        this.dataAvailable = this.dataAvailable.concat(data.items)

        this.addRow(params.type == 'shuffle', params.shuffleWithin)

        return data
      }, this.errorHandler)
    }

    return ret
  }

  addRow(shuffle, shuffleWithin) {
    for (let i = 0; i < 4 && this.dataAvailable.length > 0; i++) {
      let rand = 0,
          randId = 0,
          max = 20,
          replace = false

      if (shuffle) {
        max = shuffleWithin === undefined ||
              shuffleWithin > this.dataAvailable.length ?
                this.dataAvailable.length : shuffleWithin
        rand = Math.floor(Math.random() * max)

        randId = this.dataAvailable[rand].sys.id
        if (this.ids.indexOf(randId) > -1) {
          this.dataAvailable.splice(rand, 1)
          i--
          continue
        }

        this.ids.push(randId)
        replace = true
      }
      else {
        let dateParts = this.dataAvailable[rand].fields.date.split('-')
        if (dateParts[0] < this.dateParts[0] || dateParts[1] < this.dateParts[1]) {
          let dateCard = {
            fields: {
              type: 'Date',
              month: this.lookupMonth(parseInt(dateParts[1])),
              year: dateParts[0]
            }
          }
          this.loadPost(dateCard, -1, false)

          this.dateParts = dateParts
          continue
        }

        this.dateParts = dateParts
      }

      this.loadPost(this.dataAvailable[rand], i, replace)
      this.dataAvailable.splice(rand, 1)
    }

    if (this.ids.length > 4) {
      this.ids.splice(0, this.ids.length - 4)
    }
  }

  loadPost(post, i, replace) {
    requestAnimationFrame(() => {
      Articles.renderPost(post, replace ? Articles.get(i) : null)
    })

    return post
  }

  waitForImages(params) {
    this.stop(params)
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
        if ( window.scrollY != 0 ) {
          requestAnimationFrame(step);
          scrollCount = scrollCount + 1;
          scrollMargin = cosParameter - cosParameter * Math.cos( scrollCount * scrollStep );
          window.scrollTo( 0, ( scrollHeight - scrollMargin ) );
        }
      }, 15 );
    }
  }

  lookupMonth(index) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    return months[index - 1]
  }
}

export default Loader
