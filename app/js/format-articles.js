import template from 'templates/article.jade!'

export default data => {
  var element = document.getElementById('articles')
  element.innerHTML = template(data)
}
