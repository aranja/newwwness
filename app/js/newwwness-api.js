import request from 'qwest'

class NewwwnessApi {
  constructor() {
    this.url = "https://gist.githubusercontent.com/davidblurton/f0628b01afc806a1c166/raw/0f4943718bfb62d17fe63de717a0dc9a7cfe1135/gistfile1.json"
  }
  load() {
    return request.get(this.url)
      .then(data => JSON.parse(data))
  }
}

export default new NewwwnessApi
