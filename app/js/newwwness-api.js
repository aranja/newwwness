import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.urlBase = "https://cdn.contentful.com/spaces/k7botovq4doy/entries"
    this.urlToken = "?access_token=ba08e59831576af70fafe4c69955d06fbead0f0f47dd2849376d4b6933209039";
  }

  load(params) {
    this.additional = '&order=-fields.date&content_type=post'

    //this.additional += '&limit=20'

    if (params.skip) {
      this.additional += '&skip=' + params.skip
    }

    return request.get(this.urlBase + this.urlToken + this.additional,
      null,
      { cache: true }
    ).then(JSON.parse)
  }
}

export default new NewwwnessApi
