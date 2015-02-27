let animationEnd = (() => {
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

let transitionEnd = (() => {
  let el = document.createElement('div')
  let transitions = {
    'transition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MozTransition': 'transitionend',
    'OTransition': 'otransitionend'
  }

  for (let event in transitions) {
    if (el.style[event] !== undefined) {
      return transitions[event]
    }
  }

  return undefined
})()

export default {
  animationEnd: animationEnd,
  transitionEnd: transitionEnd
}