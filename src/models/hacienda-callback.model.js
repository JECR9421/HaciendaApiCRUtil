const { MongoClient } = require('mongodb');
const { MONGO_URI, MONGO_DB, MONGO_COLLECTION_CR } = process.env;
// Connection URL
const URL =  MONGO_URI;
const DB = MONGO_DB;

const getDocument = async (clave) => {
    const client = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(MONGO_COLLECTION_CR);
        const query = { clave };
        return await collection.findOne(query);
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
};

const insertDocument = async (document) => {
    const client = new MongoClient(URL, { useUnifiedTopology: true });
    try {
        await client.connect();
        const database = client.db(DB);
        const collection = database.collection(MONGO_COLLECTION_CR);
        return await collection.insertOne({...document, createdAt: new Date()});
    } catch (error) {
        console.error(error);
    } finally {
        await client.close();
    }
}

module.exports = { getDocument, insertDocument };