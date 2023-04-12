function SendBillingRequest (clave, fecha, comprobanteXml, emisor, receptor = null, callbackUrl) {
  this.clave = clave
  this.fecha = fecha
  this.comprobanteXml = comprobanteXml
  this.emisor = emisor
  this.receptor = receptor
  this.callback = callbackUrl

  this.createPayLoad = () => {
    const payLoad = { ...this }
    if (!receptor) delete payLoad.receptor
    if (!callbackUrl) delete payLoad.callback
    return payLoad
  }
}

module.exports = SendBillingRequest
