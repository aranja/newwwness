import template from 'templates/article.jade!'
import Event from './event'

const classNames = {
  nextArticle: 'Article-new',
  currentArticle: 'Article-current',
  isEntering: 'Article--entrance',
  isSwapping: 'is-swapping',
  isDoneSwapping: 'is-doneSwapping',
  isLoaded: 'is-loaded'
}

class Articles {
  constructor(data) {
    this.articles = document.getElementById('articles')
    this.hasArticles = false
  }

  destroy() {
    this.articles.innerHTML = ''
  }

  isLoaded() {
    if (!this.hasArticles) {
      Event.animationEnd(this.get(this.articles.children.length - 1), () => {
        this.editPosts(post => post.classList.remove(classNames.isEntering))
      })
    } else {
      this.editPosts(this.transitionPost.bind(this))
    }

    this.articles.classList.add(classNames.isLoaded)
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
      this.swapContent(post)
      post.classList.add(classNames.isDoneSwapping)

      Event.transitionEnd(post, () => {
        post.classList.remove(classNames.isSwapping)
        post.classList.remove(classNames.isDoneSwapping)
      }, timeOut)
    }, timeOut)
  }

  isNotLoaded() {
    this.articles.classList.remove(classNames.isLoaded)
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
        domElement.classList.remove(classNames.isEntering)
        domElement.setAttribute('href', post.link.url)
        domElement.getElementsByClassName(classNames.nextArticle)[0].innerHTML = div.getElementsByClassName(classNames.currentArticle)[0].innerHTML
      } else {
        this.articles.innerHTML += div.innerHTML
      }

      resolve(post.image)
    })
  }
}

export default new Articles