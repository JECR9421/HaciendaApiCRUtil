const getTokenIdp = require('../utils/get-token-idp')

const getToken = async ({ usuariohacienda, passhacienda, Tipo }) => {
  const token = await getTokenIdp({ usuariohacienda, passhacienda, Tipo })
  console.log('token', JSON.stringify(token))
  return token
}

async function sendBillingToHacienda ({ clave, xmlSigned = null, usuariohacienda, passhacienda, Tipo }) {
  const token = await getToken({ usuariohacienda, passhacienda, Tipo })
}

module.exports = { sendBillingToHacienda }
