import NewwwnessApi from './newwwness-api'
import formatArticles from './format-articles'
import Loader from './loader'

Loader.start()

NewwwnessApi.load()
  .then(formatArticles)
  .then(Loader.stop())
  .catch(err => console.log(err))

export default {}
