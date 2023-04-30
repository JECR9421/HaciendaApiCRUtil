const requestLoggerMiddleware = async(req, res, next) => {
  console.log('RECV <<<', req.method, req.url, req.hostname, JSON.stringify(req.body))
  next()
}

module.exports = requestLoggerMiddleware
