import NewwwnessApi from './newwwness-api'
import formatArticles from './format-articles'

class Loader {
  constructor() {
    this.el = document.getElementById('loader')
    this.el.addEventListener('click', this.load.bind(this))
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    this.el.classList.remove('is-loading');
  }

  load() {
    this.el.classList.add('is-loading')

    NewwwnessApi.random()
      .then(formatArticles)
      .then(() => this.el.classList.remove('is-loading'))
      .catch(err => console.log(err))
  }
}

export default new Loader


