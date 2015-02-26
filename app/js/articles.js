import template from 'templates/article.jade!'

class Articles {
  constructor(data) {
    this.el = document.getElementById('articles')
  }

  destroy() {
    this.el.innerHTML = ''
  }

  isLoaded() {
    this.el.classList.add('is-loaded')
  }

  get(index) {
    return this.el.children[index]
  }

  renderPost(post, domElement) {
    post.link = {
      url: post.link,
      text: post.link.split('//')[1].split('/')[0].replace('www.', '')
    }

    return new Promise((resolve, reject) => {
      let postEl = template({post})

      if (domElement) {
        domElement.querySelector('img').outerHTML = ''
        domElement.outerHTML = ''
        domElement.innerHTML = postEl
      } else {
        domElement = document.createElement('div')
        domElement.innerHTML = postEl
        this.el.innerHTML += domElement.innerHTML
      }

      resolve(domElement.querySelector('img'))
    })
  }
}

export default new Articles