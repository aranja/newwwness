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
        this.populateImages(data)
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
    //return Promise.all(this.images).then(() => this.stop(params))
  }

  populateImages(data) {
    let length = data.items.length

    for (let i = 0; i < length; i++) {
      let imageId = data.items[i].fields.image.sys.id;

      for (let j = 0; j < data.includes.Asset.length; j++) {
        if (data.includes.Asset[j].sys.id == imageId) {
          data.items[i].fields.imageUrl = data.includes.Asset[j].fields.file.url
        }
      }
    }
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
}

export default Loader
