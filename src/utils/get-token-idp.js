const fetch = require('node-fetch')
const TokenIdpRequest = require('../models/token-idp-request.model')

const getUrl = (mode) => mode === 'P' ? process.env.URL_GET_TOKEN_PROD : process.env.URL_GET_TOKEN_STAGE

const getTokenIdp = async ({ usuariohacienda: username, passhacienda, Tipo: type }) => {
  const url = getUrl(type)
  const request = new TokenIdpRequest(type, username, passhacienda)

  const params = new URLSearchParams()
  params.append('client_id', request.client_id)
  params.append('username', request.username)
  params.append('password', request.password)
  params.append('grant_type', request.grant_type)
  const response = await fetch(url, { method: 'POST', body: params })
  const data = await response.json()
  return data
}

module.exports = getTokenIdp
