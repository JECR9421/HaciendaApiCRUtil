const fs = require('fs')
const path = require('path')
const AWS = require('aws-sdk')
const { S3_ACCESS_KEY, S3_SECRET_KEY, SPACES_DIGITAL_OCEAN, AWS_REGION } = process.env
AWS.config.update({
  accessKeyId: S3_ACCESS_KEY,
  secretAccessKey: S3_SECRET_KEY,
  correctClockSkew: true
})
const SPACES_ENDPOINT = new AWS.Endpoint(SPACES_DIGITAL_OCEAN)
const S3 = new AWS.S3({ endpoint: SPACES_ENDPOINT, region: AWS_REGION })

const dowloadFile = (bucket, key) => S3.getObject({
  Bucket: bucket,
  Key: key
}).promise()

const downloadFileFromCloud = async (bucket, key, localPath) => {
  const file = await dowloadFile(bucket, key)
  const dir = path.dirname(localPath)
  if (!fs.existsSync(dir)) { fs.mkdirSync(dir) }
  fs.writeFileSync(localPath, file.Body)
  if (!fs.existsSync(localPath)) throw new Error(`Fail downloading file ${bucket}/${key}`)
}

module.exports = { downloadFileFromCloud }
