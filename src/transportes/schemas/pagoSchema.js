export const elementoPagoSchema = {
  id: "",
  idElementoOrigen: "",
  codigoElementoOrigen: "",
  descripcion: "",
  descripcionViajesExternos: "",
  descripcionViajesInternos: "",
  tipoChofer: "",
  datosSolicitud: {
    cliente: "",
    fechaSolicitud: "",
    idReq: "",
    numeroReq: "",
    idSolicitante: "",
    nombreSolicitante: "",
    dptoSolicitante: "",
    // adiciona
    puntoPartida: "",
    destino: "",
  },
  beneficiario: {
    nombre: "",
    apellido: "",
    id: "",
  },
  idPagoPadre: "",
  monto: "",
  costoInterno: "",
  obs: "",
};

export const pagoPadreSchema = {
  // 0-Pendiente
  // 1-Concluido
  estadoDoc: "",
  elementos: [],

  createdAd: "",
  createdAdStamp: "",
  createdBy: "",
  beneficiario: {
    nombre: "",
    apellido: "",
    id: "",
    // adicional
    numeroDoc: "",
    urlFotoPerfil: "",
  },
  idsReqsUtilizadas: [],
  numeroDoc: "",
  comentarios: "",
  numPagoPadre: "",
};
