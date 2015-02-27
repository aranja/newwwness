import NewwwnessApi from './newwwness-api'
import Articles from './articles'

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
    this.el.classList.remove('is-loading')
  }

  refreshHandler() {
    this.load('random')
  }

  errorHandler(error) {
    console.log(error)
  }

  loadData(data) {
    return NewwwnessApi.load(data).then(data => {
      data.articles.forEach(this.loadPost.bind(this))
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

  load(collection) {
    Articles.isNotLoaded()
    this.start()
    this.loadData(collection).then(() => this.waitForImages())
  }
}

export default Loader
