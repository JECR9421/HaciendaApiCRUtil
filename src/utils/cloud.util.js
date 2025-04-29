const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const { S3_ACCESS_KEY, S3_SECRET_KEY, SPACES_DIGITAL_OCEAN, AWS_REGION, BUCKET } = process.env
AWS.config.update({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  correctClockSkew: true
})
const SPACES_ENDPOINT = new AWS.Endpoint(SPACES_DIGITAL_OCEAN)
const S3 = new AWS.S3({ endpoint: SPACES_ENDPOINT, region: AWS_REGION })

const convertFileSystemToCloud = (path) => {
  const decode = Buffer.from(path, 'base64').toString()
  return decode.replace('C:\\Facturacion', BUCKET).replaceAll('\\', '/').slice(0, -1)
}
// Cambiar por axios llamado a api cloud files
// donde bucket es path, bucket va ser quemado fedocumentsstorage y fileName = key, base64 = 'true'
const dowloadFile = (bucket, key) => S3.getObject({
  Bucket: bucket,
  Key: key
}).promise()

const downloadFileFromCloud = async (bucket, key, localPath) => {
  //Modificar aqui replace bucket quitar fedocumentsstorage
  const file = await dowloadFile(bucket, key)
  const dir = path.dirname(localPath)
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  fs.writeFileSync(localPath, file.Body) // modificar por un escritor de base64 a file
  //fs.writeFile(filePath, Buffer.from(file.result, 'base64')
  if (!fs.existsSync(localPath)) throw new Error(`Fail downloading file ${bucket}/${key}`)
}

module.exports = { downloadFileFromCloud, convertFileSystemToCloud }
