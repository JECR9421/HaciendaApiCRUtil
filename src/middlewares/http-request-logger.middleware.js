const logger = require('../utils/logger.util')

const requestLoggerMiddleware = async (req, res, next) => {
  console.log('RECV <<<', req.method, req.url, req.hostname, JSON.stringify(req.body))
  try {
    const msg = `request ${req.method} ${req.url} ${req.hostname}:\n${JSON.stringify(req.body)}\n`
    logger(msg)
  } catch (error) {
    console.error('Error at middleware', error)
  }

  next()
}

module.exports = requestLoggerMiddleware
