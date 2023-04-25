const isBase64 = require('is-base64')
const { decodeBase64 } = require('../utils/general.util')
const { BUCKET_BASE, BUCKET_BASE2, FS_BASE, CLOUD_BASE } = process.env

const getTempPathFromClave = (clave) => {
  const day = clave.substring(3, 5)
  const month = clave.substring(5, 7)
  const year = `20${clave.substring(7, 9)}`
  const folder = `${day}-${month}-${year}`
  return folder
}

const createPathsToSearch = (clave) => ({
  path: `${BUCKET_BASE}/${getTempPathFromClave(clave)}`,
  path2: `${BUCKET_BASE2}/${getTempPathFromClave(clave)}`
})

const formatPath = (path) => {
  let cloudPath = isBase64(path) ? decodeBase64(path) : path
  if (cloudPath.includes(FS_BASE)) {
    cloudPath = cloudPath.replace(FS_BASE, CLOUD_BASE)
    cloudPath = cloudPath.replaceAll('\\', '/')
  }
  return cloudPath
}

const validatePathMD = (req, res, next) => {
  const { body: { clave, path, xmlSigned } } = req
  if (!path && !xmlSigned) {
    // No path, no xml, should search at Temp
    const { path: cloudPath, path2 } = createPathsToSearch(clave)
    req.body.path = cloudPath
    req.body.path2 = path2
  } else if (path && !xmlSigned) {
    const pathFormatted = formatPath(path)
    req.body.path = pathFormatted
  }

  next()
}

module.exports = validatePathMD
