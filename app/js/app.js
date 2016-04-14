import './check-webstore'
import domReady from './dom-ready'
import Loader from './loader'
import BackToTop from './back-to-top'

domReady(() => {
  new Loader()
  new BackToTop()
})
