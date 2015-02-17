import NewwwnessApi from './newwwness-api'
import formatArticles from './format-articles'

NewwwnessApi.load()
  .then(formatArticles)
  .catch(err => console.log(err))

export default {}
