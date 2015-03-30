import domReady from './dom-ready'

domReady(() => {
  if (!window.chrome || !window.chrome.webstore) return

  let els = document.querySelectorAll('[data-check-webstore]');
  for (let i = 0, el; el = els[i]; ++i) {
    el.classList.remove('u-hide')
  }
})
