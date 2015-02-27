let animationEndEvent = (() => {
  let el = document.createElement('div')
  let animations = {
    'animation': 'animationend',
    'WebkitAnimation': 'webkitAnimationEnd',
    'MozAnimation': 'animationend',
    'OAnimation': 'oAnimationEnd'
  }

  for (let event in animations) {
    if (el.style[event] !== undefined) {
      return animations[event]
    }
  }

  return undefined
})()

let transitionEndEvent = (() => {
  let el = document.createElement('div')
  let transitions = {
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'transition': 'transitionend'
  }

  for (let event in transitions) {
    if (el.style[event] !== undefined) {
      return transitions[event]
    }
  }

  return undefined
})()

class Event {
  constructor(timeOut = 2000) {
    this.TRANSITION_TIMEOUT = timeOut 
  }

  animationEnd(el, cb, timeout = this.TRANSITION_TIMEOUT) {
    if (animationEndEvent !== undefined) {
      el.addEventListener(animationEndEvent, function endHandler(event) {
        el.removeEventListener(animationEndEvent, endHandler)
        cb(el)
      })
    } else {
      setTimeout(() => cb(el), timeout)
    }  
  }

  transitionEnd(el, cb, timeout = this.TRANSITION_TIMEOUT, prop = 'opacity') {
    if (transitionEndEvent !== undefined) {
      el.addEventListener(transitionEndEvent, function endHandler(event) {
        if (event.propertyName === prop) {
          el.removeEventListener(transitionEndEvent, endHandler)
          cb(el)
        }
      })
    } else {
      setTimeout(() => cb(el), timeout)
    }
  }
}

export default new Event