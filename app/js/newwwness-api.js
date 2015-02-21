import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.urlBase = "/api/"
  }

  load(collection) {
    return request.get(this.urlBase + collection)
  }
}

export default new NewwwnessApi
