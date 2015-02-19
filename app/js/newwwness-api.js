import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.url = "http://newwwness-api.appspot.com/"
  }
  load() {
    return request.get(this.url)
      .then(data => JSON.parse(data))
  }
}

export default new NewwwnessApi
