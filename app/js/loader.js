import NewwwnessApi from './newwwness-api'
import Articles from './articles'
import Event from './event'

class Loader {
  constructor() {
    Articles.destroy()
    this.el = document.getElementById('loader')
    this.images = []
    this.hasBeenFilled = false
    this.load('new')
    this.el.addEventListener('click', this.refreshHandler.bind(this))
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    Articles.isLoaded()
    this.hasBeenFilled = true

    Event.animationIteration(this.el, () => {
      this.el.classList.remove('is-loading')
    }, 1000)
  }

  refreshHandler() {
    this.load('random')
  }

  errorHandler(error) {
    console.log(error)
  }

  loadData(data) {
    return NewwwnessApi.load(data).then(data => {
      this.populateImages(data)

      let length = data.items.length

      for (let i = 0; i < 4 && i < length; i++) {
        let rand = Math.floor(Math.random() * data.items.length)
        this.loadPost(data.items[rand], i)
        data.items.splice(rand, 1)
      }

      return data
    }, this.errorHandler)
  }

  loadPost(post, i) {
    this.images.push(new Promise((resolve, reject) => {
      Articles.renderPost(post, this.hasBeenFilled ? Articles.get(i) : null)
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
