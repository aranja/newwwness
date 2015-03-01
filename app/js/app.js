import Loader from './loader'
import DomReady from './dom-ready'

try {
  Typekit.load()
} catch () {}

DomReady(() => {
  let loader = new Loader()
})
