export const privilegios = [
  // ************************* ADMINISTRATIVO *************************
  {
    code: "editarUsuarios",
    descripcion: "Modificar datos de usuarios.",
    valor: false,
    modulo: "admin",
  },
  {
    code: "singleDashboard",
    descripcion: "Acceso al dashboard.",
    valor: false,
    modulo: "admin",
  },
  // ************************* FLETE *************************
  {
    code: "viewConfigFlete",
    descripcion:
      "Acceso a la ruta para visualizar la configuracion de formula y montos de fletes.",
    valor: false,
    modulo: "FLETE",
  },
  {
    code: "editConfigFlete",
    descripcion:
      "Capacidad para modificar montos de cada unidad vehicular de la calculadora de fletes.",
    valor: false,
    modulo: "FLETE",
  },
  // ************************* Perdidas de ventas  *************************
  {
    code: "accessCostoPerdidaVenta",
    descripcion: "Capacidad para visualizar costos.",
    valor: false,
    modulo: "perdidaVentas",
  },

  // ************************* IMS *************************

  {
    code: "createDocsIMS",
    descripcion: "Capacidad para crear Bill Of Lading y ordenes de compra",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "editBLIMS",
    descripcion: "Capacidad para editar datos de un Bill Of Lading.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "editOCIMS",
    descripcion: "Capacidad para editar datos de una orden de compra.",
    valor: false,
    modulo: "IMS",
  },
  // CICLO
  {
    code: "blIngresarPaisIMS",
    descripcion:
      "Capacidad para indicar que la embarcacion de un Bill Of Lading llego al pais.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "planificacionPuertoIMS",
    descripcion: "Capacidad crear la planificacion en puerto.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "llegadaAlmacenIMS",
    descripcion: "Capacidad para indicar que un contenedor llego almacen.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "docEnviadaCompraIMS",
    descripcion:
      "Capacidad para indicar que la documentacion generada en almacen fue enviada al departamento de compras.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "docEnSistemaIMS",
    descripcion: "Capacidad para indicar mercancia esta ingresada al sistema.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "generalReportsIMS",
    descripcion: "Capacidad para generar reportes.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "editETABL",
    descripcion:
      "Capacidad para cambiar la fecha estimada de llegada de un BL.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "nuevaPartidaOC",
    descripcion:
      "Capacidad para agregar o eliminar nueva partida de orden de compra.",
    valor: false,
    modulo: "IMS",
  },
  {
    code: "managerAttachIMS",
    descripcion:
      "Capacidad para agregar, eliminar y editar documentos adjuntos del IMS.",
    valor: false,
    modulo: "IMS",
  },

  // ************************* TMS *************************
  // *****Tablas Main****
  // Solicitudes
  {
    code: "viewAllRequestTMS",
    descripcion: "Capacidad para visualizar todas las solicitudes activas.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "viewMyWareHouseRequestTMS",
    descripcion: "Puede visualizar todas las solicitudes de su almacen.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "viewMyDptoRequestTMS",
    descripcion: "Puede visualizar todas las solicitudes de su departamento.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "accessReqDraft",
    descripcion: "Acceso a visualizar lista de solicitudes en modo draft.",
    valor: false,
    modulo: "TMS",
  },
  // Choferes
  {
    code: "sortDriver",
    descripcion:
      "Capacidad para organizar choferes; poder colocar quienes estan disponible y asignar orden de llegada",
    valor: false,
    modulo: "TMS",
  },
  // Reportes
  {
    code: "generalReportsTMS",
    descripcion: "Capacidad para generar reportes.",
    valor: false,
    modulo: "TMS",
  },
  // MAS
  {
    code: "accessConfigTMS",
    descripcion: "Acceso a la configuracion del TMS.",
    valor: false,
    modulo: "TMS",
  },

  // ADD
  // {
  //   code: "createRequestTMS",
  //   descripcion: "Capacidad para crear solicitudes de transporte.",
  //   valor: false,
  //   modulo: "TMS",
  // },
  {
    code: "createDriverTMS",
    descripcion: "Capacidad para crear nuevos choferes.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "createProyectTMS",
    descripcion: "Capacidad para crear nuevo proyecto.",
    valor: false,
    modulo: "TMS",
  },
  // Detalle Chofer
  {
    code: "editDriverTMS",
    descripcion: "Capacidad para editar datos a choferes.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "eliminarDriverTMS",
    descripcion: "Capacidad para eliminar choferes.",
    valor: false,
    modulo: "TMS",
  },
  // Detalle Proyectos

  {
    code: "editarProyectTMS",
    descripcion: "Capacidad para editar proyectos",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "closeProyectTMS",
    descripcion: "Capacidad para cerrar proyectos",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "openProyectTMS",
    descripcion: "Capacidad para abrir proyectos",
    valor: false,
    modulo: "TMS",
  },
  // APS
  {
    code: "accessAPSTMS",
    descripcion: "Acceso a la ruta /aps",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "approvedPagosLogisticaTMS",
    descripcion: "Capacidad para ejecutar la aprobacion de logistica a pagos.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "approvedPagosSolicitanteTMS",
    descripcion: "Capacidad para ejecutar la aprobacion de solicitante.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "approvedPagosFinanzasTMS",
    descripcion: "Capacidad para ejecutar aprobacion de finanzas.",
    valor: false,
    modulo: "TMS",
  },

  // Crear Pagos
  {
    code: "accessAddPagosTMS",
    descripcion: "Acceso a la pantalla crear pagos.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "createPayDriverTMS",
    descripcion: "Capacidad para crear nuevo pago en la base de datos.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "readPayDriverTMS",
    descripcion: "Capacidad para leer pagos de la base de datos.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "exportsFinzasRechzTMS",
    descripcion:
      "Capacidad para exportar documentos de las pestañas finanzas y rechazados en pagina de pagos del TMS.",
    valor: false,
    modulo: "TMS",
  },

  // Estados request
  {
    code: "planificatedRequestTMS",
    descripcion: "Capacidad para planificar solicitud de transporte.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "runRequestTMS",
    descripcion: "Capacidad para ejecutar solicitud de transporte.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "terminateRequestTMS",
    descripcion: "Capacidad para concluir solicitud de transporte.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "annularRequestTMS",
    descripcion: "Capacidad para anular solicitud de transporte.",
    valor: false,
    modulo: "TMS",
  },
  // Acciones req
  {
    code: "changeDriverTMS",
    descripcion:
      "Capacidad para cambiar vehiculo seleccionado de una solicitud de transporte.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "addMontoTMS",
    descripcion: "Capacidad para agregar nuevo monto a solicitud.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "modifiedRelationTMS",
    descripcion: "Capacidad para visualizar relacion de solicitud.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "addCommetsReqTMS",
    descripcion: "Capacidad para agregar y visualizar comentarios.",
    valor: false,
    modulo: "TMS",
  },

  // ALTO NIVEL
  {
    code: "defaultStateRequestTMS",
    descripcion:
      "Capacidad para regresar una solicitud a sus estado de fabrica que es | A LA ESPERA... |.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "defaultPagosTMS",
    descripcion:
      "Capacidad para regresar la propiedad pagos de una solicitud a su valor de fabrica",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "editRequestTMS",
    descripcion: "Capacidad para edicion de request.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "approvedPriceChangesAdd",
    descripcion:
      "Capacidad para aprobar cambios de precio luego de crear solicitud.",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "auditAyudanteEsquemas",
    descripcion: "Capacidad para editar y agregar ayudantes adicionales",
    valor: false,
    modulo: "TMS",
  },
  {
    code: "approvedAyudanteAdicionales",
    descripcion: "Capacidad para aprobar pago de ayudantes adicionales",
    valor: false,
    modulo: "TMS",
  },
  // ************************* Detalles items *************************
  {
    code: "generalReportsDPT",
    descripcion: "Capacidad para generar reportes detalles productos.",
    valor: false,
    modulo: "DPT",
  },
];

export const roles = [
  {
    codigo: "admin",
    nombre: "Admin",
    privilegios: ["editarUsuarios"],
  },
  {
    codigo: "encargadaImportaciones",
    nombre: "Encargado de importaciones",
    privilegios: [
      "createDocsIMS",
      "blIngresarPaisIMS",
      "planificacionPuertoIMS",
      "docEnSistemaIMS",
      "generalReportsIMS",
    ],
  },
  {
    codigo: "encargadoAlmacen",
    nombre: "Encargado de almacen",
    privilegios: [
      "createDocsIMS",
      "llegadaAlmacenIMS",
      "docEnviadaCompraIMS",
      "generalReportsIMS",
    ],
  },
  {
    codigo: "encargadoLogistica",
    nombre: "Encargado de logistica",
    privilegios: [
      "viewAllRequestTMS",
      "generalReportsTMS",
      "createRequestTMS",
      "createDriverTMS",
      "editDriverTMS",
      "eliminarDriverTMS",
      "accessPagosTMS",
      "approvedPagosLogisticaTMS",
      "avanzarEstadosRequestTMS",
    ],
  },
  {
    nombre: "Empleado comercial",
    codigo: "empleadoComercial",
    privilegios: ["createRequestTMS", "createProyectTMS", "editarProyectTMS"],
  },
];
