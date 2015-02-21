import NewwwnessApi from './newwwness-api'
import formatArticles from './format-articles'

class Loader {
  constructor() {
    this.el = document.getElementById('loader')
    this.el.addEventListener('click', () => this.load.call(this, "random"))
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    this.el.classList.remove('is-loading');
  }

  load(collection) {
    this.start()

    NewwwnessApi.load(collection)
      .then(formatArticles)
      .then(() => this.stop())
      .catch(err => console.log(err))
  }
}

export default new Loader


