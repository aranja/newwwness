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
    console.log('stopped');
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
      data.results.forEach(this.loadPost.bind(this))
      return data
    }, this.errorHandler)
  }

  loadPost(post, i) {
    this.images.push(new Promise((resolve, reject) => {
      Articles.renderPost(post, this.hasBeenFilled ? Articles.get(i) : null)
      .then(img => {
        console.log('loaded');
        img.onload = () => {resolve()}
      }, this.errorHandler)
    }))

    return post
  }

  waitForImages() {
    return Promise.all(this.images).then(() => {
      Articles.isLoaded()
      this.stop()
      this.hasBeenFilled = true
    })
  }

  load(collection) {
    this.start()
    this.loadData(collection).then(() => this.waitForImages())
  }
}

export default Loader
