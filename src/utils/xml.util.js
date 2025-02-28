const fs = require('fs')
const convert = require('xml-js')
const SendBillingRequest = require('../models/hacienda-cr-send.model')
const Person = require('../models/hacienda-cr-person.model')

const loadFromFile = (path) => {
  return fs.readFileSync(path, 'utf8')
}

const typeDoc = (billing) => {
  if (billing.FacturaElectronica) return 'FacturaElectronica'
  if (billing.TiqueteElectronico) return 'TiqueteElectronico'
  if (billing.NotaCreditoElectronica) return 'NotaCreditoElectronica'
  if (billing.NotaDebitoElectronica) return 'NotaDebitoElectronica'
  if (billing.FacturaElectronicaCompra) return 'FacturaElectronicaCompra'
  if (billing.MensajeReceptor) return 'MensajeReceptor'
  if (billing.FacturaElectronicaExportacion) return 'FacturaElectronicaExportacion'
}

const loadDataFromXml = ({
  path,
  xmlSigned,
  clave,
  callbackUrl,
  recepcionSenderIdType = null,
  recepcionRecipentIdType = null
}) => {
  let xml = null
  let base64 = null
  if (path) {
    xml = loadFromFile(path)
    base64 = Buffer.from(xml).toString('base64')
  } else {
    xml = Buffer.from(xmlSigned, 'base64').toString()
    base64 = xmlSigned
  }
  const billingPure = JSON.parse(convert.xml2json(xml, { compact: true, spaces: 4 }))
  const type = typeDoc(billingPure)
  const isReception = type === 'MensajeReceptor'
  let sender = null
  let recipient = null
  if (!isReception) {
    sender = billingPure[type]?.Emisor
    recipient = billingPure[type]?.Receptor
  } else {
    sender = { type: recepcionSenderIdType, number: billingPure[type]?.NumeroCedulaEmisor?._text }
    recipient = { type: recepcionRecipentIdType, number: billingPure[type]?.NumeroCedulaReceptor?._text }
  }
  const date = billingPure[type]?.FechaEmision?._text ?? billingPure[type]?.FechaEmisionDoc?._text
  if (!isReception) {
    const { Identificacion: senderId } = sender
    return new SendBillingRequest(clave, date, base64, new Person(senderId), null, callbackUrl)
  } else {
    return new SendBillingRequest(clave, date, base64, new Person(null, sender), new Person(null, recipient), callbackUrl)
  }
}

module.exports = { loadDataFromXml }
