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
  // TODO LAS DE RECEPCION
}

const loadDataFromXml = ({
  path,
  xmlSigned,
  clave,
  isReception = false,
  callbackUrl
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
  const { FechaEmision: { _text: date }, Emisor: sender, Receptor: recipient } = billingPure[type]
  const { Identificacion: senderId } = sender
  let recipientId = null
  if (isReception) ({ Identifacion: recipientId } = recipient)
  return new SendBillingRequest(clave, date, base64, new Person(senderId), new Person(recipientId), callbackUrl)
}

module.exports = { loadDataFromXml }
