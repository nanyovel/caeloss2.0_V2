// Este mix es para exportar cosas, nada de importar

export const destinatariosNotificacion = [
  {
    nombre: "",
    correo: "",
  },
  {
    nombre: "",
    correo: "",
  },
];

export const personasContacto = [
  {
    nombre: "",
    telefono: "",
    rol: "",
  },
  {
    nombre: "",
    telefono: "",
    rol: "",
  },
];

export const statusPagosReq = [
  "Sin procesar",
  "Aprobado por logistica",
  "Aprobado por solicitante",
  "Aprobado por finanzas",
  "Rechazado por logistica",
  "Rechazado por solicitante",
  "Rechazado por finanzas",
];

// Movido a schemas/ayudanteAddSchema.js
// export const ayudanteAdd = {
//   nombre: "",
//   costo: "",
//   obs: "",
//   // 0-a la espera...
//   // 1-aprovado
//   // 2-Rechazado
//   status: 0,
//   approvedBy: "",
//   idAyudanteComoElemento: "",
// };

export const parsedStatusAyudAdd = (status) => {
  const statusAux = ["A la espera...", "Aprovado", "Rechazado"];
  return statusAux[status] || "Desconocido";
};

export const datosEntregaReq = {
  chofer: {
    apellido: "",
    // 0-interno
    // 1-externo independiente
    // 2-externo empresa
    tipo: "",
    id: "",
    nombre: "",
    numeroDoc: "",
    urlFotoPerfil: "",
  },
  ayudante: {
    tipo: "",
    id: "",
    numeroDoc: "",
    nombre: "",
    apellido: "",
  },
  unidadVehicular: {
    descripcion: "",
    placa: "",
    code: "",
    urlFoto: "",
  },
};

export const detallePagoPlantilla = {
  pagoGenerado: false,
  idElementoPago: "",
  idPagoPadre: "",
  idElementoOrigen: "",
  // Esta variable proviene del dicionario generar elemento origen
  codigoElementoPagado: "",
  monto: "",
  createdAd: "",
  createdBy: "",
  numPagoPadre: "",
};
export const detallesPagoVehiculo = {
  camionExterno: {
    ...detallePagoPlantilla,
  },
  choferInterno: {
    ...detallePagoPlantilla,
  },
  ayudanteInterno: {
    ...detallePagoPlantilla,
  },
};
