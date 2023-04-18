const fs = require('fs')
const { downloadFileFromCloud } = require('../utils/cloud.util')
const getTokenIdp = require('../utils/get-token-idp')
const { loadDataFromXml } = require('../utils/xml.util')
const { sendToHacienda } = require('../utils/hacienda-cr.util')
const { BUCKET_BASE } = process.env
const TEMP_PATH = `${process.cwd()}/temp`
const getToken = async ({ usuariohacienda, passhacienda, Tipo }) => {
  const token = await getTokenIdp({ usuariohacienda, passhacienda, Tipo })
  console.log('token', JSON.stringify(token))
  return token?.access_token
}

const xmlCloudFileHandler = async (path, clave) => {
  const bucket = path ?? BUCKET_BASE // TODO DIVISOFT FROK SI getDateFromClave
  // TODO PATH PARA DIVISOFT EN EL FROK CONVERTIR PATH FS A CLOUD
  const key = `${clave}_signed.xml`
  await downloadFileFromCloud(bucket, key, `${TEMP_PATH}/${key}`)
}

async function sendBillingToHacienda ({
  clave,
  xmlSigned = null,
  usuariohacienda,
  passhacienda,
  Tipo,
  path = null,
  callback,
  isReception = false
}) {
  try {
    const token = await getToken({ usuariohacienda, passhacienda, Tipo })
    let xmlPath = null
    if (!xmlSigned) {
      await xmlCloudFileHandler(path, clave)
      xmlPath = `${TEMP_PATH}/${clave}_signed.xml`
    }
    const payLoad = loadDataFromXml({
      path: xmlPath,
      xmlSigned,
      clave,
      isReception,
      callbackUrl: callback
    }).createPayLoad()
    const result = await sendToHacienda(token, payLoad, Tipo)
    if (!xmlSigned) fs.unlinkSync(xmlPath)
    return result
  } catch (error) {
    const errorMessage = `Unhandled exception at send ${JSON.stringify(error)}`
    console.error('Unhandled exception at send', JSON.stringify(error))
    throw errorMessage
  }
}

module.exports = { sendBillingToHacienda }
