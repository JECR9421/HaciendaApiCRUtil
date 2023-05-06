const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const haciendaRouter = require('./src/routes/hacienda-cr-api.route')
const requestLoggerMiddleware = require('./src/middlewares/http-request-logger.middleware')
const logger = require('./src/utils/logger.util')

app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.use(requestLoggerMiddleware)
app.use('/hacienda-cr', haciendaRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  logger(`Unhandle error:\n${JSON.stringify(req)}\n${JSON.stringify(err)}`, 'error')
  res.status(500).send({ error: 'Something went wrong!' })
})

app.listen(3000, () => {
  console.log('Microservice listening on port 3000')
})
