const { sendBillingToHacienda, getBillingStatus } = require('../services/hacienda-cr-api.service')

async function send (req, res, next) {
  try {
    const result = await sendBillingToHacienda(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json(err)
    next(err)
  }
}

async function get (req, res, next) {
  try {
    const result = await getBillingStatus(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json(err)
    next(err)
  }
}

module.exports = { send, get }
