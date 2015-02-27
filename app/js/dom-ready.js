// Source: http://youmightnotneedjquery.com/#ready
export default (cb) => {
  if (document.readyState != 'loading') {
    cb()
  } else {
    document.addEventListener('DOMContentLoaded', cb)
  }
}