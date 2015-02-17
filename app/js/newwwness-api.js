import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.url = "https://gist.githubusercontent.com/davidblurton/f0628b01afc806a1c166/raw/9783ce2a9f5374e73e7b75ea7f6151b705658c86/gistfile1.json"
  }
  load() {
    return request.get(this.url)
      .then(data => JSON.parse(data))
  }
}

export default new NewwwnessApi
