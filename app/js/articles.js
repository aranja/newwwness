import template from 'templates/article.jade!'
import Event from './event'

const classNames = {
  nextArticle: 'Article-next',
  currentArticle: 'Article-current',
  isEntering: 'is-entering',
  isLeaving: 'is-leaving',
  isSwapping: 'is-swapping',
  isDoneSwapping: 'is-doneSwapping',
  isLoaded: 'is-loaded',
  isImageLoaded: 'is-imageLoaded',
  isShuffling: 'is-shuffling'
}

class Articles {
  constructor(data) {
    document.body.classList.add(classNames.isLoaded)
    this.articles = document.getElementById('articles')
    this.loader = document.getElementById('loader')
    this.inExtension = document.body.getAttribute('data-extension') != null
    this.hasArticles = false
  }

  destroy() {
    this.articles.innerHTML = ''
  }

  isLoaded(params) {
    Event.animationEnd(this.get(this.articles.children.length - 1), (i) => {
      let nodeList = Array.prototype.slice.call(this.articles.children)
      let max = nodeList.indexOf(i)
      this.editPosts(post => post.classList.remove(classNames.isEntering), max)
      this.loader.classList.add(classNames.isShuffling)
    })

    if (params.type == 'shuffle' && this.hasArticles) {
      requestAnimationFrame(() => this.editPosts(this.transitionPost.bind(this), this.articles.children.length))
    }
    else if (params.type == 'clean' && this.hasArticles) {
      requestAnimationFrame(() => this.editPosts(this.transitionPost.bind(this), this.articles.children.length, 4))
    }

    this.hasArticles = true
  }

  swapContent(post) {
    let curr = post.getElementsByClassName(classNames.currentArticle)[0]
    let next = post.getElementsByClassName(classNames.nextArticle)[0]

    next.classList.remove(classNames.nextArticle)
    curr.classList.remove(classNames.currentArticle)
    next.classList.add(classNames.currentArticle)
    curr.classList.add(classNames.nextArticle)
    curr.innerHTML = ''
  }

  transitionPost(post, i) {
    let timeOut = 600 // Timeout if browser doesn't support transitionEnd
    post.classList.add(classNames.isSwapping)

    Event.transitionEnd(post, () => {
      if (i < 4) {
        this.swapContent(post)
        post.classList.add(classNames.isDoneSwapping)

        Event.transitionEnd(post, () => {
          post.classList.remove(classNames.isSwapping)
          post.classList.remove(classNames.isDoneSwapping)
        }, timeOut)
      }
      else {
        post.remove()
      }

      setTimeout(function() {
        document.body.classList.remove(classNames.isShuffling)
      }, 900);
    }, timeOut)
  }

  isNotLoaded() {
    //document.body.classList.remove(classNames.isLoaded)
  }

  get(index) {
    return this.articles.children[index]
  }

  imageLoaded(index) {
    this.articles.children[index].classList.add(classNames.isImageLoaded)
  }

  editPosts(cb, max, start = 0) {
    for (let i = start; i < max; i++) {
      cb(this.get(i), i)
    }
  }

  renderPost(post, domElement) {
    if (post.fields.link) {
      post.link = {
        url: post.fields.link,
        text: post.fields.link.split('//')[1].split('/')[0].replace('www.', '')
      }
    }

    let postEl = template({post,
      extension: this.inExtension,
      type: post.fields.type
    })

    let div = document.createElement('div')
    div.innerHTML = postEl
    let i = 0

    if (domElement) {
      domElement.classList.remove(classNames.isEntering)
      domElement.setAttribute('href', post.link.url)
      domElement.getElementsByClassName(classNames.nextArticle)[0].innerHTML = div.getElementsByClassName(classNames.currentArticle)[0].innerHTML
    } else {
      this.articles.appendChild(div.firstChild);
      i = this.articles.childNodes.length - 1
    }

    if (post.fields.image) {
      let image = new Image()
      image.addEventListener('load', () => this.imageLoaded(i))
      image.src = post.fields.image
    }
  }
}

export default new Articles
