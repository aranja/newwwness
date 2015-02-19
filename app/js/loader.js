class Loader {
  constructor() {
    this.el = document.getElementById('loader')
  }

  start() {
    this.el.classList.add('is-loading')
  }

  stop() {
    this.el.classList.remove('is-loading');
  }
}

export default new Loader
