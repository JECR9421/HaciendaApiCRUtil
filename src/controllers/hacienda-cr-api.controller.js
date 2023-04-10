const { sendBillingToHacienda } = require('../services/hacienda-cr-api.service')

async function send (req, res, next) {
  try {
    console.log('req', req)
    console.log('env', process.env.URL_GET_TOKEN_STAGE)
    // const encoded = req.headers.authorization.split(' ')[1]
    // decode it using base64
    // const decoded = Buffer.from(encoded, 'base64').toString()
    // const name = decoded.split(':')[0]
    // const password = decoded.split(':')[1]
    // console.log('auth', name, password)
    await sendBillingToHacienda(req.body)
    res.json({ test: 'a' })
  } catch (err) {
    console.error('Error while creating programming language', err.message)
    next(err)
  }
}

module.exports = { send }
