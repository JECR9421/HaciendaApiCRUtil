function TokenIdpRequest (type, username, password) {
  this.client_id = type === 'P' ? '' : 'api-stag'
  this.username = username
  this.password = password
  this.grant_type = 'password'
}

module.exports = TokenIdpRequest
