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
    this.el.addEventListener('click', this.refreshHandler.bind(this))
    window.addEventListener('scroll', this.scrollHandler.bind(this))
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    Articles.isLoaded()
    // this.hasBeenFilled = true

    Event.animationIteration(this.el, () => {
      this.el.classList.remove('is-loading')
    }, 1000)
  }

  refreshHandler() {
    this.load({exclude: this.ids})
  }

  scrollHandler() {
    let offset = (document.all ? iebody.scrollTop : pageYOffset)

    if (offset > 50 + (340 * (this.rows - 1))) {
      this.load({exclude: this.ids})
      this.rows++
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
        }

        this.loadPost(data.items[rand], i)
        data.items.splice(rand, 1)
      }

      return data
    }, this.errorHandler)
  }

  loadPost(post, i) {
    this.ids.push(post.sys.id)

    this.images.push(new Promise((resolve, reject) => {
      //Articles.renderPost(post, this.hasBeenFilled ? Articles.get(i) : null)
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
