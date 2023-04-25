const express = require('express')
const haciendaController = require('../controllers/hacienda-cr-api.controller')
const validatePathMD = require('../middlewares/hacienda-cr-files.middleware')
const router = express.Router()

/**
 * Send xml singned to hacienda CR api
 */
router.post('/send', validatePathMD, haciendaController.send)

/**
 * Get current state of a billing
 */
router.post('/get-status', haciendaController.get)

module.exports = router
