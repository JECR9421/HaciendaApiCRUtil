const fs = require('fs')
const mcache = require('memory-cache')
const { downloadFileFromCloud } = require('../utils/cloud.util')
const getTokenIdp = require('../utils/get-token-idp')
const { loadDataFromXml } = require('../utils/xml.util')
const { sendToHacienda, getBillingStatusApi } = require('../utils/hacienda-cr.util')
const { BUCKET_BASE } = process.env
const TEMP_PATH = `${process.cwd()}/temp`
const getCacheKeyUser = (user) => Buffer.from(user).toString('base64')
const getToken = async ({ usuariohacienda, passhacienda, Tipo }) => {
  const cacheKey = getCacheKeyUser(usuariohacienda)
  const tokenCache = mcache.get(cacheKey)
  if (tokenCache) return tokenCache
  const token = await getTokenIdp({ usuariohacienda, passhacienda, Tipo })
  mcache.put(cacheKey, token?.access_token, 240000)
  return token?.access_token
}

const xmlCloudFileHandler = async (path, path2, clave) => {
  const key = `${clave}_signed.xml`
  try {
    await downloadFileFromCloud(path, key, `${TEMP_PATH}/${key}`)
  } catch (error) {
    await downloadFileFromCloud(path2, key, `${TEMP_PATH}/${key}`)
  }
}

async function sendBillingToHacienda ({
  clave,
  xmlSigned = null,
  usuariohacienda,
  passhacienda,
  Tipo,
  path = null,
  path2 = null,
  callback,
  isReception = false
}) {
  try {
    const token = await getToken({ usuariohacienda, passhacienda, Tipo })
    let xmlPath = null
    if (!xmlSigned) {
      await xmlCloudFileHandler(path, path2, clave)
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

async function getBillingStatus ({
  clave,
  usuariohacienda,
  passhacienda,
  Tipo
}) {
  try {
    const token = await getToken({ usuariohacienda, passhacienda, Tipo })
    const result = await getBillingStatusApi(token, clave, Tipo)
    return result
  } catch (error) {
    const errorMessage = `Unhandled exception at get status ${JSON.stringify(error)}`
    console.error('Unhandled exception at get status', JSON.stringify(error))
    throw errorMessage
  }
}

module.exports = { sendBillingToHacienda, getBillingStatus }
