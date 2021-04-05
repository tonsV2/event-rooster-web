module.exports = (backgroundImage) => {
  document.body.style.backgroundRepeat = 'no-repeat'
  document.body.style.backgroundPosition = 'left right'
  document.body.style.backgroundImage = `url(${backgroundImage})`
  document.body.style.backgroundSize = 'cover'
}
