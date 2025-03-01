const express = require('express')
const haciendaController = require('../controllers/hacienda-cr-api.controller')
const router = express.Router()

/**
 * Send xml singned to hacienda CR api
 */
router.post('/send', haciendaController.send)

/**
 * Get current state of a billing
 */
router.post('/get-status', haciendaController.get)

/**
 * Default callback
 */
router.post('/callback', haciendaController.callbackDefault)

module.exports = router
