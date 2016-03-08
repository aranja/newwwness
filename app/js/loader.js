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
    window.addEventListener('scroll', this.scrollHandler.bind(this))
    window.addEventListener('mousewheel', this.wheelHandler.bind(this))
  }

  start() {
  }

  stop() {
    Articles.isLoaded()
  }

  refreshHandler() {
    this.load({exclude: this.ids})
  }

  scrollHandler() {
    let offset = (document.all ? iebody.scrollTop : pageYOffset)

    if (offset > -190 + (370 * (this.rows - 1))) {
      this.load({exclude: this.ids, skip: this.rows * 4})
      this.rows++
    }
  }

  wheelHandler(event) {
    if (event.wheelDelta > 40) {
      // this.load('new');
      // this.rows = 1;
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
        let rand = 0;

        if (params == 'new') {
          rand = Math.floor(Math.random() * data.items.length)
          this.ids.push(data.items[rand].sys.id)
        }

        this.loadPost(data.items[rand], i)
        data.items.splice(rand, 1)
      }

      return data
    }, this.errorHandler)
  }

  loadPost(post, i) {
    this.images.push(new Promise((resolve, reject) => {
      Articles.renderPost(post, null)
        .then(src => {
          let image = new Image()
          image.addEventListener('load', () => resolve())
          image.src = src
        }, this.errorHandler)
    }))

    return post
  }

  waitForImages() {
    return Promise.all(this.images).then(() => this.stop())
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
    this.loadData(collection).then(() => this.waitForImages())
  }
}

export default Loader
