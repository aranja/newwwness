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

    for (let i = 0; i < this.el.children.length; i++) {
      let el = this.el.children[i]
      let newEl = el.querySelector('.Article-new')

      if (newEl.innerHTML !== '') {
        el.classList.remove('is-visible')
        el.classList.add('is-hidden')

        setTimeout(() => {
          let currentEl = el.querySelector('.Article-current')
          currentEl.innerHTML = newEl.innerHTML
          newEl.innerHTML = ''
          el.classList.remove('is-hidden')
          el.classList.add('is-visible')
        }, 300)
      }
    }
  }

  isNotLoaded() {
    this.el.classList.remove('is-loaded')
  }

  get(index) {
    return this.el.children[index]
  }

  renderPost(post, domElement) {
    post.link = {
      url: post.link,
      text: post.link.split('//')[1].split('/')[0].replace('www.', '')
    }

    // if (domElement && Math.random() > 0.5) 
    //   post.image = 'http://storage.googleapis.com/newwwness-images/yesyall.png'

    return new Promise((resolve, reject) => {
      let postEl = template({post})
      let div = document.createElement('div')
      div.innerHTML = postEl

      if (domElement) {
        domElement.classList.add('Article--swap')
        domElement.classList.remove('Article--entrance')
        domElement.setAttribute('href', post.link.url)
        domElement.querySelector('.Article-new').innerHTML = div.querySelector('.Article-current').innerHTML
      } else {
        this.el.innerHTML += div.innerHTML
      }

      resolve(div.querySelector('img'))
    })
  }
}

export default new Articles