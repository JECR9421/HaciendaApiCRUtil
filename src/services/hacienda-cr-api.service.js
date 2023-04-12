const { downloadFileFromCloud } = require('../utils/cloud.util')
const getTokenIdp = require('../utils/get-token-idp')
const { BUCKET_BASE } = process.env
const TEMP_PATH = `${process.cwd()}/temp`
const getToken = async ({ usuariohacienda, passhacienda, Tipo }) => {
  const token = await getTokenIdp({ usuariohacienda, passhacienda, Tipo })
  console.log('token', JSON.stringify(token))
  return token
}

const xmlCloudFileHandler = async (path, clave) => {
  const bucket = path ?? BUCKET_BASE // TODO DIVISOFT FROK SI getDateFromClave
  // TODO PATH PARA DIVISOFT EN EL FROK CONVERTIR PATH FS A CLOUD
  const key = `${clave}_signed.xml`
  await downloadFileFromCloud(bucket, key, `${TEMP_PATH}/${key}`)
}

async function sendBillingToHacienda ({ clave, xmlSigned = null, usuariohacienda, passhacienda, Tipo, path = null }) {
  const token = await getToken({ usuariohacienda, passhacienda, Tipo })
  if (!xmlSigned) await xmlCloudFileHandler(path, clave)
  else {
    // TODO UTIL.BASE64TOFILE
  }
}

module.exports = { sendBillingToHacienda }
