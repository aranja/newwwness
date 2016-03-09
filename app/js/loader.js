import NewwwnessApi from './newwwness-api'
import Articles from './articles'
import Event from './event'

class Loader {
  constructor() {
    Articles.destroy()
    this.el = document.getElementById('loader')
    this.images = []
    this.ids = []
    this.hasBeenFilled = false
    this.load('new')
    this.rows = 1
    this.reloading = false
    window.addEventListener('scroll', this.scrollHandler.bind(this))
    window.addEventListener('mousewheel', this.wheelHandler.bind(this))
  }

  start() {
  }

  stop(collection) {
    //if (collection == 'new') {
      Articles.isLoaded(collection)
    //}
  }

  refreshHandler() {
    this.load({exclude: this.ids})
  }

  scrollHandler() {
    let offset = (document.all ? iebody.scrollTop : pageYOffset)

    if (offset > -190 + (370 * (this.rows - 1))) {
      this.load({exclude: this.ids, limit: 4, skip: (this.rows - 1) * 4})
      this.rows++
    }
  }

  wheelHandler(event) {
    if (pageYOffset == 0 && !this.reloading && event.wheelDelta > 40) {
      this.reloading = true
      this.ids = []
      this.rows = 1
      this.load('new')

      clearTimeout(this.timeout)
      this.timeout = setTimeout(function() {
        this.reloading = false
      }.bind(this), 1000)
    }
  }

  errorHandler(error) {
    console.log(error)
  }

  loadData(params) {
    return NewwwnessApi.load(params).then(data => {
      this.populateImages(data)

      let length = data.items.length

      for (let i = 0; i < 4 && i < length; i++) {
        let rand = 0,
            replace = false

        if (params == 'new') {
          rand = Math.floor(Math.random() * data.items.length)
          this.ids.push(data.items[rand].sys.id)
          replace = true
        }

        this.loadPost(data.items[rand], i, replace)
        data.items.splice(rand, 1)
      }

      return data
    }, this.errorHandler)
  }

  loadPost(post, i, replace) {
    this.images.push(new Promise((resolve, reject) => {
      Articles.renderPost(post, replace ? Articles.get(i) : null)
        .then(src => {
          let image = new Image()
          image.addEventListener('load', () => resolve())
          image.src = src
        }, this.errorHandler)
    }))

    return post
  }

  waitForImages(collection) {
    return Promise.all(this.images).then(() => this.stop(collection))
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

  load(collection) {
    Articles.isNotLoaded()
    this.start()
    this.loadData(collection).then(() => this.waitForImages(collection))
  }
}

export default Loader
