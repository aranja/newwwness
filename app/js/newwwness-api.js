import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.urlBase = "https://cdn.contentful.com/spaces/eu328n1qhop3/entries"
    this.urlToken = "?access_token=44ca874b32ca61cdebbb180fd76a3a9e4a74348b5b47fa916ad7887c0786d0bf";
  }

  load(collection) {
    return request.get(this.urlBase + this.urlToken, null, {
      cache: true
    })
      .then(JSON.parse)
  }
}

export default new NewwwnessApi
