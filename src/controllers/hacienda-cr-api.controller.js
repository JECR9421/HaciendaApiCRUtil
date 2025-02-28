const { sendBillingToHacienda, getBillingStatus } = require('../services/hacienda-cr-api.service')
const { saveHaciendaResponse } = require('../services/hacienda-cr.callback.service')
const logger = require('../utils/logger.util')

const formatResponse = (req, res) => `response ${req.method} ${req.url} ${req.hostname}:\n${JSON.stringify(res)}\n`

async function send (req, res, next) {
  try {
    const result = await sendBillingToHacienda(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json(err)
    logger(formatResponse(req, err), 'error')
    next(err)
  }
}

async function get (req, res, next) {
  try {
    const result = await getBillingStatus(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json(err)
    logger(formatResponse(req, err), 'error')
    next(err)
  }
}

async function callbackDefault (req, res, next) {
  try {
    const result = await saveHaciendaResponse(req.body)
    res.json(result)
  } catch (err) {
    res.status(500).json(err)
    logger(formatResponse(req, err), 'error')
    next(err)
  }
}

module.exports = { send, get, callbackDefault }
