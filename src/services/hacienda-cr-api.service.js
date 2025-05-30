const fs = require('fs')
const mcache = require('memory-cache')
const { downloadFileFromCloud, convertFileSystemToCloud } = require('../utils/cloud.util')
const getTokenIdp = require('../utils/get-token-idp')
const { loadDataFromXml } = require('../utils/xml.util')
const { sendToHacienda, getBillingStatusApi } = require('../utils/hacienda-cr.util')
const { getDocument } = require('../models/hacienda-callback.model')
const { BUCKET_BASE, BUCKET_BASE2 } = process.env
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

const getTempPathFromClave = (clave) => {
  const day = clave.substring(3, 5)
  const month = clave.substring(5, 7)
  const year = `20${clave.substring(7, 9)}`
  const folder = `${day}-${month}-${year}`
  return folder
}

const getBucketBase = (clave) => ({
  path: `${BUCKET_BASE}/${getTempPathFromClave(clave)}`,
  path2: `${BUCKET_BASE2}/${getTempPathFromClave(clave)}`
})

const xmlCloudFileHandler = async (path, clave) => {
  const bucket = path ?? getBucketBase(clave) // TODO DIVISOFT FROK SI getDateFromClave
  // TODO PATH PARA DIVISOFT EN EL FROK CONVERTIR PATH FS A CLOUD
  const key = `${clave}_signed.xml`
  try {
    const path1 = typeof bucket === 'object' ? bucket.path : bucket
    await downloadFileFromCloud(path1, key, `${TEMP_PATH}/${key}`)
  } catch (error) {
    await downloadFileFromCloud(bucket.path2, key, `${TEMP_PATH}/${key}`)
  }
}

async function sendBillingToHacienda ({
  clave,
  xmlSigned = null,
  usuariohacienda,
  passhacienda,
  Tipo,
  path = null,
  callback,
  isExternal = null,
  recepcionSenderIdType = null,
  recepcionRecipentIdType = null
}) {
  try {
    const token = await getToken({ usuariohacienda, passhacienda, Tipo })
    let xmlPath = null
    if (!xmlSigned) {
      const pathCloud = (isExternal && isExternal === 'S')
        ? convertFileSystemToCloud(path)
        : (path !== '')
            ? path
            : null
      await xmlCloudFileHandler(pathCloud, clave)
      xmlPath = `${TEMP_PATH}/${clave}_signed.xml`
    }
    const payLoad = loadDataFromXml({
      path: xmlPath,
      xmlSigned,
      clave,
      callbackUrl: callback,
      recepcionSenderIdType,
      recepcionRecipentIdType
    }).createPayLoad()
    const result = await sendToHacienda(token, payLoad, Tipo)
    if (!xmlSigned) fs.unlinkSync(xmlPath)
    return result
  } catch (error) {
    console.error(error)
    const errorMessage = `Unhandled exception at send ${error}`
    console.error('Unhandled exception at send', errorMessage)
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
     try {
      const document = await getDocument(clave)
      if (document) return document
     } catch (error) {
      console.error('Unhandled exception at get status mongo', JSON.stringify(error))
     }
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
