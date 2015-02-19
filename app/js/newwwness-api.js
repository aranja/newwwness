import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.url = "/api/new"
  }
  load() {
    return request.get(this.url)
  }
}

export default new NewwwnessApi
