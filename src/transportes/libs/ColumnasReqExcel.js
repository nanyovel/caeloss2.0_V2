const ColumnasReqExcel = [
  { header: "Numero", key: "numeroDoc", width: 10, ruta: "numeroDoc" },
  { header: "Id", key: "id", width: 10, ruta: "id" },
  {
    header: "Usuario",
    key: "userName",
    width: 10,
    ruta: "datosSolicitante.userName",
  },
  { header: "Estado", key: "estadoDoc", width: 10, ruta: "estadoDoc" },
  {
    header: "Cliente",
    key: "cliente",
    width: 20,
    ruta: "datosReq.socioNegocio",
  },
  { header: "Fecha", key: "fechaReq", width: 20, ruta: "fechaReq" },
  {
    header: "Dpto.",
    key: "dpto",
    width: 20,
    ruta: "datosSolicitante.dpto",
  },
  {
    header: "Costo",
    key: "costo",
    width: 20,
    ruta: "datosFlete.costo",
  },
  {
    header: "Precio",
    key: "precio",
    width: 20,
    ruta: "datosFlete.precio",
  },
  // Nombre chofer
  {
    header: "Chofer",
    key: "chofer",
    width: 20,
    ruta: "datosEntrega.chofer.nombreCompleto",
  },
  // Vehiculo utilizado
  {
    header: "Unidad Vehicular",
    key: "unidadVehicular",
    width: 20,
    ruta: "datosFlete.vehiculoSeleccionado.descripcion",
  },
  {
    header: "Tiene choferes adicionales",
    key: "tieneChoferesAdicionales",
    width: 20,
    ruta: "datosFlete.vehiculosAdicionalesTiene",
  },

  {
    header: "Nombre provincia destino",
    key: "nombreProvinciaDestino",
    width: 20,
    ruta: "datosFlete.provinciaSeleccionada.municipioSeleccionado.label",
  },
  {
    header: "Distancia",
    key: "distancia",
    width: 20,
    ruta: "datosFlete.distancia",
  },
  {
    header: "Punto de partida",
    key: "puntoPartida",
    width: 20,
    ruta: "datosFlete.puntoPartidaSeleccionado.nombreMunicipioOrigen",
  },
  {
    header: "Distancia manual",
    key: "distanciaManual",
    width: 20,
    ruta: "datosFlete.distanciaManualInputs",
  },
  //datos req

  {
    header: "Proyecto",
    key: "numeroProyecto",
    width: 20,
    ruta: "datosReq.numeroProyecto",
  },

  //calificaciones
  {
    header: "Calificacion solicitante",
    key: "calificacionSolicitante",
    width: 20,
    ruta: "calificaciones.resenniaVentas.puntuacion",
  },
  {
    header: "Reseña solicitante",
    key: "resenniaSolicitante",
    width: 20,
    ruta: "calificaciones.resenniaVentas.comentarios",
  },
  {
    header: "Calificacion Cliente",
    key: "calificacionCliente",
    width: 20,
    ruta: "calificaciones.resenniaCliente.puntuacion",
  },
  {
    header: "Reseña cliente",
    key: "resenniaSolicitante",
    width: 20,
    ruta: "calificaciones.resenniaCliente.comentarios",
  },
  {
    header: "Nombre cliente calificador",
    key: "nombreClienteCalificador",
    width: 20,
    ruta: "calificaciones.resenniaCliente.nombre",
  },
  {
    header: "Tel cliente calificador",
    key: "telClienteCalificado",
    width: 20,
    ruta: "calificaciones.resenniaCliente.numero",
  },
  // contabilidad
  {
    header: "Pago aprobado por logistica",
    key: "pagoAprobadologistica",
    width: 20,
    ruta: "contabilidad.log.logistica1.usuario.userName",
  },
  {
    header: "Pago aprobado por solicitante",
    key: "pagoAprobadoContabilidad",
    width: 20,
    ruta: "contabilidad.log.solicitante2.usuario.userName",
  },
  {
    header: "Pago aprobado por contabilidad",
    key: "pagoAprobadoContabilidad",
    width: 20,
    ruta: "contabilidad.log.finanzas3.usuario.userName",
  },
  {
    header: "Monto Pago chofer",
    key: "montoPagoChofer",
    width: 20,
    ruta: "contabilidad.montoPagarChofer",
  },
  {
    header: "Monto Pago ayudante",
    key: "montoPagoAyudante",
    width: 20,
    ruta: "contabilidad.montoPagarAyudante",
  },
  {
    header: "Status pago",
    key: "statusPago",
    width: 20,
    ruta: "contabilidad.statusPagoChofer",
  },
];

export default ColumnasReqExcel;
