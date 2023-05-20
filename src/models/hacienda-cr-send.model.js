function SendBillingRequest (clave, fecha, comprobanteXml, emisor, receptor = null, callbackUrl) {
  this.clave = clave
  this.fecha = fecha
  this.comprobanteXml = comprobanteXml
  this.emisor = emisor
  this.receptor = receptor
  this.callbackUrl = callbackUrl

  this.createPayLoad = () => {
    const payLoad = { ...this }
    if (!this.receptor?.tipoIdentificacion) delete payLoad.receptor
    if (!this.callbackUrl) delete payLoad.callbackUrl
    return payLoad
  }
}

module.exports = SendBillingRequest
