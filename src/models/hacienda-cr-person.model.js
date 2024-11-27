function Person (idData, receptionDocData = null) {
  if (idData) {
    const { Tipo: { _text: type }, Numero: { _text: number } } = idData
    this.tipoIdentificacion = type
    this.numeroIdentificacion = number
  } else if (receptionDocData) {
    this.tipoIdentificacion = receptionDocData?.type
    this.numeroIdentificacion = receptionDocData?.number
  }
}

module.exports = Person
