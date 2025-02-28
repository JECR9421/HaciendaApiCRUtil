const { insertDocument } = require('../models/hacienda-callback.model')
async function saveHaciendaResponse(document) {
    return await insertDocument(document)
}

module.exports = { saveHaciendaResponse }