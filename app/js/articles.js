import template from 'templates/article.jade!'
import Event from './event'

const classNames = {
  nextArticle: 'Article-next',
  currentArticle: 'Article-current',
  isEntering: 'is-entering',
  isLeaving: 'is-leaving',
  isSwapping: 'is-swapping',
  isDoneSwapping: 'is-doneSwapping',
  isLoaded: 'is-loaded'
}

class Articles {
  constructor(data) {
    document.body.classList.add(classNames.isLoaded)
    this.articles = document.getElementById('articles')
    this.inExtension = document.body.getAttribute('data-extension') != null
    this.hasArticles = false
  }

  destroy() {
    this.articles.innerHTML = ''
  }

  isLoaded(collection) {
    Event.animationEnd(this.get(this.articles.children.length - 1), () => {
      this.editPosts(post => post.classList.remove(classNames.isEntering))
    })

    if (collection == 'new' && this.hasArticles) {
      this.editPosts(this.transitionPost.bind(this))
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
    }, timeOut)
  }

  isNotLoaded() {
    //document.body.classList.remove(classNames.isLoaded)
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
      url: post.fields.link,
      text: post.fields.link.split('//')[1].split('/')[0].replace('www.', '')
    }

    return new Promise((resolve, reject) => {
      let postEl = template({post, extension: this.inExtension})
      let div = document.createElement('div')
      div.innerHTML = postEl

      if (domElement) {
        domElement.classList.remove(classNames.isEntering)
        domElement.setAttribute('href', post.link.url)
        domElement.getElementsByClassName(classNames.nextArticle)[0].innerHTML = div.getElementsByClassName(classNames.currentArticle)[0].innerHTML
      } else {
        this.articles.appendChild(div.firstChild);
      }

      resolve(post.fields.imageUrl)
    })
  }
}

export default new Articles
