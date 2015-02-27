import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.urlBase = "http://newwwness.co/api/"
  }

  load(collection) {
    return request.get(this.urlBase + collection)
  }
}

export default new NewwwnessApi
