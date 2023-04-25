const decodeBase64 = (base64) => {
  return Buffer.from(base64, 'base64').toString()
}
const encondeBase64 = (str) => {
  return Buffer.from(str).toString('base64')
}

module.exports = {
  decodeBase64,
  encondeBase64
}
