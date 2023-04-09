const express = require('express')
const haciendaController = require('../controllers/hacienda-cr-api.controller')
const router = express.Router()

/**
 * Send xml singned to hacienda CR api
 */
router.post('/send', haciendaController.send)

module.exports = router
