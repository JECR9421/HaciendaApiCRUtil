const express = require('express')
require('dotenv').config()
const app = express()
const bodyParser = require('body-parser')
const haciendaRouter = require('./src/routes/hacienda-cr-api.route')

app.use(bodyParser.json())
app.get('/', (req, res) => {
  res.send('Hello, World!')
})

app.use('/hacienda-cr', haciendaRouter)

app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send({ error: 'Something went wrong!' })
})

app.listen(3000, () => {
  console.log('Microservice listening on port 3000')
})
