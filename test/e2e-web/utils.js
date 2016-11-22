module.exports = {
  el: el,
}

function el (base, innerSelector) {
  let selector = `[data-test="${base}"]`
  if (innerSelector) {
    selector += ` ${innerSelector}`
  }
  return selector
}
