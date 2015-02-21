import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.randomUrl = "/api/random"
    this.newUrl = "/api/new"
  }

  new() {
    return request.get(this.newUrl)
  }

  random() {
    return request.get(this.randomUrl)
  }
}

export default new NewwwnessApi
