import NewwwnessApi from './newwwness-api'
import Articles from './articles'
import Event from './event'
import template from 'templates/end.jade!'

const classNames = {
  isShuffling: 'is-shuffling'
}

class Loader {
  constructor() {
    Articles.destroy()
    this.el = document.getElementById('loader')
    this.articles = document.getElementById('articles')
    this.limit = 100
    this.images = []
    this.ids = []
    this.data = []
    this.dataAvailable = []
    this.hasBeenFilled = false
    this.rows = 1
    this.reloading = false
    this.dateParts = []
    this.rowSize = 4;
    this.load({type: 'shuffle', shuffleWithin: 20})

    this.setSize()

    window.scrollTo(0, 0)
    window.addEventListener('scroll', this.scrollHandler.bind(this))
    window.addEventListener('mousewheel', this.wheelHandler.bind(this))
    window.addEventListener('resize', this.setSize.bind(this));
  }

  start() {
  }

  stop(params) {
    Articles.isLoaded(params)
  }

  end() {
    console.log('here');
    if (!this.hasBeenFilled) {
      this.hasBeenFilled = true;

      let postEl = template()
      let div = document.createElement('div')
      div.innerHTML = postEl

      this.articles.appendChild(div.firstChild);
    }
  }

  clean() {
    this.rows = 1
    this.hasBeenFilled = false
    this.stop({type: 'clean'})

    Array.from(document.getElementsByClassName('Article-end')).forEach((element) => {
      element.remove()
    })

    this.dataAvailable = this.data.slice(0)
    for (let i = 0; i < this.dataAvailable.length; i++) {
      if (this.ids.indexOf(this.dataAvailable[i].sys.id) > -1) {
        this.dataAvailable.splice(i, 1)
      }
    }
  }

  scrollHandler() {

    if (pageYOffset < 500) {
      document.getElementById('header').style.opacity = 1 - pageYOffset / (window.innerHeight / 4 - 100)
      document.getElementById('backToTop').style.opacity = pageYOffset / (window.innerHeight / 4 - 100)

      if (pageYOffset <= 0 && this.rows > 1) {
        this.clean()
      }
    }

    if (pageYOffset > 5 + (370 * (this.rows - 1))) {
      this.load({
        type: 'normal',
        skip: this.data.length
      })
      this.rows++
    }

  }

  wheelHandler(event) {

    if (pageYOffset > 0) {
      this.reloadingTime(1000)
    }
    else if (pageYOffset == 0 && !this.reloading && event.wheelDelta > 40) {
      document.body.classList.add(classNames.isShuffling)

      this.rows = 1
      this.load({
        type: 'shuffle'
      })

      this.reloadingTime(2000)
    }

  }

  reloadingTime(length) {
    this.reloading = true

    clearTimeout(this.timeout)
    this.timeout = setTimeout(function() {
      this.reloading = false
    }.bind(this), length)
  }

  load(params) {
    this.loadData(
      () => this.addRow(params.type == 'shuffle', params.shuffleWithin),
      params
    ).then(
      () => this.stop(params)
    )
  }

  loadData(cb, params) {
    let ret = null

    if (params.type == 'shuffle' && this.data.length > 3) {
      this.dataAvailable = this.data.slice(0);
    }

    if (this.dataAvailable.length > 3) {
      requestAnimationFrame(() => {
        cb()
      })
    }
    else {

      if (!window.localStorage.newwwnessData ||
          !window.localStorage.newwwnessExpires ||
          new Date().getTime() > window.localStorage.newwwnessExpires ||
          (this.data.length > 0 && this.data.length != window.localStorage.newwwnessTotal)) {

        ret = NewwwnessApi.load(params).then(data => {
          this.data = this.data.concat(data.items)
          this.dataAvailable = this.dataAvailable.concat(data.items)

          window.localStorage.setItem('newwwnessData',
            JSON.stringify(this.data))
          window.localStorage.setItem('newwwnessTotal',
            (this.limit ? this.limit : data.total))
          window.localStorage.setItem('newwwnessExpires',
            new Date(+new Date() + 86400000).getTime())

          cb()
        }.bind(this), this.errorHandler)

      }
      else {

        if (this.data.length == 0) {
          this.data = JSON.parse(window.localStorage.newwwnessData)
          this.dataAvailable = JSON.parse(window.localStorage.newwwnessData)
        }

        cb()

      }
    }

    return ret || new Promise(function(resolve, reject) {
      resolve(1);
    })
  }

  addRow(shuffle, shuffleWithin) {
    for (let i = 0; i < (shuffle ? 4 : this.rowSize) && this.dataAvailable.length > 0; i++) {
      let rand = 0,
          replace = false

      if (shuffle) {
        let max = shuffleWithin === undefined ||
              shuffleWithin > this.dataAvailable.length ?
                this.dataAvailable.length : shuffleWithin
        rand = Math.floor(Math.random() * max)

        let randId = this.dataAvailable[rand].sys.id
        if (this.ids.indexOf(randId) > -1) {
          this.dataAvailable.splice(rand, 1)
          i--
          continue
        }

        this.ids.push(randId)
        replace = true
      }
      else if (this.dataAvailable.length > 1) {

        let dateParts = this.dataAvailable[rand].fields.date.split('-')
        if (dateParts[0] < this.dateParts[0] || dateParts[1] < this.dateParts[1]) {
          let dateCard = {
            fields: {
              type: 'Date',
              month: this.lookupMonth(parseInt(dateParts[1])),
              year: dateParts[0]
            }
          }
          this.loadPost(dateCard, -1, false)

          if (this.limit) {
            // Remove cards so we have even row at bottom
            this.dataAvailable.pop()
          }

          this.dateParts = dateParts
          continue
        }

        this.dateParts = dateParts
      }

      this.loadPost(this.dataAvailable[rand], i, replace)
      this.dataAvailable.splice(rand, 1)
    }

    if (this.ids.length > 4) {
      this.ids.splice(0, this.ids.length - 4)
    }

    if (this.dataAvailable.length == 0) {
      this.end();
    }
  }

  loadPost(post, i, replace) {
    Articles.renderPost(post, replace ? Articles.get(i) : null)

    return post
  }

  setSize() {
    var oldRowSize = this.rowSize;

    if (this.articles.offsetWidth >= 1200) {
      this.rowSize = 4;
    }
    else if (this.articles.offsetWidth >= 908) {
      this.rowSize = 3;
    }
    else if (this.articles.offsetWidth >= 616) {
      this.rowSize = 2;
    }
    else {
      this.rowSize = 1;
    }
    this.articles.dataset.rowsize = this.rowSize;

    if (this.rowSize != oldRowSize) {
      if (this.articles.children.length > 4) {
        this.articles.innerHTML = '';

        document.body.scrollTop = document.documentElement.scrollTop = 0;

        setTimeout(function() {
          this.rows = 1
          this.load({
            type: 'shuffle'
          })
        }.bind(this), 50);
      }
      else {
        for (var i = 0; i < this.articles.children.length; i++) {
          this.articles.children[i].className =
            this.articles.children[i].className.replace(/\bis-swapping\b/,'');
        }
      }
    }
  }

  lookupMonth(index) {
    let months = [
      'January',
      'February',
      'March',
      'April',
      'May',
      'June',
      'July',
      'August',
      'September',
      'October',
      'November',
      'December'
    ]

    return months[index - 1]
  }

  errorHandler(error) {
    console.log(error)
  }
}

export default Loader
