function Person (idData) {
  if (idData) {
    const { Tipo: { _text: type }, Numero: { _text: number } } = idData
    this.tipoIdentificacion = type
    this.numeroIdentificacion = number
  }
}

module.exports = Person
