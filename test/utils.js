module.exports = {
  el: el,
  BASE_URL: 'http://localhost:4000',
}

function el (base, innerSelector) {
  let selector = `[data-test="${base}"]`
  if (innerSelector) {
    selector += ` ${innerSelector}`
  }
  return selector
}
