import template from 'templates/article.jade!'
import events from './transition-end'

class Articles {
  constructor(data) {
    this.articles = document.getElementById('articles')
    this.TRANSITION_TIMEOUT = 2000
    this.hasArticles = false
  }

  destroy() {
    this.articles.innerHTML = ''
  }

  isLoaded() {
    if (!this.hasArticles) {
      this.onAnimationEnd(this.articles, () => {
        this.editPosts(post => post.classList.remove('Article--entrance'))
      })
    }

    this.articles.classList.add('is-loaded')

    if (this.hasArticles) {
      this.editPosts((post, idx) => {
        let transOut = 400 + 100 * (idx + 1)
        let transIn = 400 + 100 * (idx)
        post.classList.remove('is-doneSwapping')

        setTimeout(() => {
          this.swapContent(post.querySelector('.Article-current'),
              post.querySelector('.Article-new'))

          setTimeout(() => {
            post.classList.add('is-doneSwapping')

            setTimeout(() => {
              post.classList.remove('is-swapping')
              post.classList.remove('is-doneSwapping')
            }, transIn)
          }, 10)
        }, transOut)

      })
    }

    this.hasArticles = true
  }

  swapContent(curr, next) {
    next.classList.remove('Article-new')
    curr.classList.remove('Article-current')
    next.classList.add('Article-current')
    curr.classList.add('Article-new')
    curr.innerHTML = ''
  }

  onAnimationEnd(el, cb, timeout = this.TRANSITION_TIMEOUT) {
    if (events.animationEnd !== undefined) {
      el.addEventListener(events.animationEnd, function endHandler() {
        el.removeEventListener(events.animationEnd, endHandler)
        cb.call(this, el)
      })
    } else {
      setTimeout(() => cb.call(this, el), timeout)
    }  
  }

  onTransitionEnd(el, cb, timeout = this.TRANSITION_TIMEOUT) {
    el.addEventListener(events.transitionEnd, event => {
      event.stopPropagation()
      cb.call(this, el)
    }, false)
  }

  isNotLoaded() {
    this.articles.classList.remove('is-loaded')
  }

  get(index) {
    return this.articles.children[index]
  }

  editPosts(cb) {
    for (let i = 0; i < this.articles.children.length; i++) {
      cb(this.get(i), i)
    }
  }

  renderPost(post, domElement) {
    post.link = {
      url: post.link,
      text: post.link.split('//')[1].split('/')[0].replace('www.', '')
    }

    return new Promise((resolve, reject) => {
      let postEl = template({post})
      let div = document.createElement('div')
      div.innerHTML = postEl

      if (domElement) {
        domElement.classList.add('is-swapping')
        setTimeout(() => {
          domElement.classList.remove('Article--entrance')
          domElement.setAttribute('href', post.link.url)
          domElement.querySelector('.Article-new').innerHTML = div.querySelector('.Article-current').innerHTML
        }, 2)
      } else {
        this.articles.innerHTML += div.innerHTML
      }

      resolve(post.image)
    })
  }
}

export default new Articles