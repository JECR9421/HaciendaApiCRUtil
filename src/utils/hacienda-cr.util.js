const axios = require('axios')
const getSendUrl = (mode) => mode === 'P' ? process.env.URL_SEND_PROD : process.env.URL_SEND_STAGE
const ERROR_CODE = 400
const sendToHacienda = async (token, payLoad, mode) => {
  try {
    const url = getSendUrl(mode)
    const res = await axios.post(url, payLoad, {
      headers: {
        Authorization: `bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    const { statusText, headers: { location } } = res
    return { ENVIO: statusText, URLSTATUS: location }
  } catch (error) {
    if (error?.response?.status === ERROR_CODE && error?.response?.headers['x-error-cause']) {
      return { ENVIO: 'fail', MSGENVIO: error.response.headers['x-error-cause'] }
    }
    throw error
  }
}

module.exports = { sendToHacienda }
