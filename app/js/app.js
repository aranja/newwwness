import Loader from './loader'
import DomReady from './dom-ready'

try{Typekit.load();}catch(e){}

DomReady(() => {
  let loader = new Loader()
})
