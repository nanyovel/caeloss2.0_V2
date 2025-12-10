import {
  datosEntregaReq,
  destinatariosNotificacion,
  detallesPagoVehiculo,
} from "./mixSchema";
import { montoSchemaNuevo } from "./montosSchema";

// ************************ SOLICITUD DE TRASLADO *************
// ********* estadoDoc: *********
// -1-Borrador - Precio     - Solicitud creada en modo preeliminar.
// 0-A la espera - Logistica aun no procesa.
// 1-Planificada - Procesado y planificacion por logistica
// 2-En ejecucion- Proceso iniciado.
// 3-Concluida   - Entrega realizada
// 4-Rechazada/Anulada   - Solicitud rechadaza o anulada por el solicitante

// ********** tipo: **********
// entrega: Son despachos a clientes, sea proyecto, ventas etc
// traslado: Traslado a sucursales
// retiroObra: Retirar mercancia de obra
// retiroProveedores: Compras a proveedores
export const reqSchema = {
  reseteos: {
    pagos: [],
    estados: [
      // {
      //   usuario: "",
      //   fecha: "",
      //   justifcacion: "",
      // },
    ],
  },
  estadoDoc: 0,
  numeroDoc: "",
  motivoCancelacion: "",
  fechaReq: "",
  fechaReqCorta: "",
  fechaEjecucion: "",
  fechaEjecucionCorta: "",

  fechaPlanificacion: "",
  fechaConclucion: "",
  fechaCancelacion: "",

  fechaStamp: "",
  tipo: "",
  contabilidad: {
    //
    //
    // ❌❌❌❌❌PROPIEDAD DEPRECADA❌❌❌❌❌
    // Esta propiedad es el resultado de los elementos que aprueban o rechazan, por tanto:
    // 1 se puede calcular localmente
    // 2 ni si quiera se necesita calcular hasta ahora no lo veo necesario
    // 0-Sin procesar
    // 1-Aprobado por logistica
    // 2-Aprobado por solicitante
    // 3-Aprobado por contabilidad
    // 4-Rechazado por logistica
    // 5-Rechazado por solicitante
    // 6-Rechazado por contabilidad

    // Esta variable es para identificar en que estatus del ciclo de pago esta la solicitud:
    // statusPagoChofer: 0,
    //
    // ❌❌❌❌❌ FIN DE PROPIEDAD DEPRECADA❌❌❌❌❌
    //

    // Esta propiedad es para saber si el pago ha sido generado
    // Esta propiedad ha sido deprecada
    // pagoGenerado: false,

    // Esta propiedad es para hacer la llamada a la base de datos, estara true cuando todos los pagos de la solicitud hallan sidos realizados
    // Todos los pagos realizados
    allPaymentsMade: false,

    // Esta propiedad es cuando algun elemento rechaza el pago
    rechazada: false,
    log: {
      // MODEL: {
      // status
      // 0-sin procesar
      // 1-aprobado
      // 2-rechazado

      // status: 0,
      // usuario: null,
      //  { userName:'',
      //   id:'',}
      // fecha: null,
      // },
      logistica1: {
        status: 0,
        usuario: {
          userName: "",
          id: "",
        },
        fecha: "",
      },
      solicitante2: {
        status: 0,
        usuario: {
          userName: "",
          id: "",
        },
        fecha: "",
      },
      finanzas3: {
        status: 0,
        usuario: {
          userName: "",
          id: "",
        },
        fecha: "",
      },
    },
  },
  datosEntrega: {
    ...datosEntregaReq,
  },

  datosFlete: {
    // trasladoSuc: null,
    distanciaManualInputs: "",
    unidadVehicular: [],
    modalidad: [
      {
        nombre: "Por destino",
        opcion: 0,
        select: true,
      },
      {
        nombre: "Por kilometros",
        opcion: 1,
        select: false,
      },
    ],
    puntoPartida: [],
    destinos: [],
    // sucOrigen: "",
    distancia: "",
    costo: "",
    precio: "",
    vehiculoSeleccionado: null,
    vehiculosAdicionales: [
      //esto viene  del archivo vehiculoAddSchema.js
      //  se utiliza vehiculoAdicionalSchema
    ],
    // Esto para poder hacer la llamada de pagos mixtos
    vehiculosAdicionalesTiene: false,
    ayudantesAdicionales: [
      // {
      //  esta en el archivo ayudanteAddSchema.js
      //   ...ayudanteAddInRequest
      // }
    ],
    puntoPartidaSeleccionado: null,
    provinciaSeleccionada: null,

    // Esta propiedad
    // idCamionComoElemento es utilizada para relacionar cada camion y ayudante adicional con el monto
    // Recordando que cada monto esta conformado por elementos que son:
    // "Camion Principal",
    // "Ayudante adicional camion principal",
    // "Camion adicional",
    // "Ayudante adicional camion adicional",
    // Entonces colocamos un id a cada uno y a la hora de crear el monto sabemos a que corresponde cada elementos a traves de este id
    idCamionComoElemento: "",
    detallesPago: {
      ...detallesPagoVehiculo,
    },
    // Esto aplica solo para el tipo de solicitud traslado
    sucDestino: null,
  },

  datosReq: {
    socioNegocio: "",
    detalles: "",
    documentos: [
      {
        tipoDoc: "",
        numeroDoc: "",
        bodega: "",
      },
      {
        tipoDoc: "",
        numeroDoc: "",
        bodega: "",
      },
    ],
    numeroProyecto: "",
    location: "",
    personasContacto: [
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
    ],
    materialesDev: [
      // {
      // codigo
      // descripcion
      // qty
      // }
    ],
    tipoTraslado: [],
    destinatariosNotificacion: destinatariosNotificacion,
  },
  datosMontos: [
    {
      ...montoSchemaNuevo,
    },
  ],

  datosSolicitante: {
    dpto: "",
    nombre: "",
    apellido: "",
    // Code; masculino // femenino
    genero: "",
    userName: "",
    idSolicitante: "",
    urlFotoPerfil: "",
  },
  calificaciones: {
    resenniaVentas: {
      puntuacion: 0,
      comentarios: "",
      fecha: "",
    },
    resenniaCliente: {},
    // Las reseñas de los clientes estan colocadas en una coleccion aparte en la base de datos, con el nombre de reviewClientes, esto por seguridad dado a que los usuarios sin loguearse pueden acceder a esa coleccion no seria inteligente colocar la coleccion de req abierta al publico
  },
  current: {
    fechaDespProg: "",
  },
  observaciones: [
    // Esto no debe estar activo pues cuando el usuario trate de ver las observaciones aunque no tenga ninguna, tendra una que es esta
    // {
    //   usuario: {
    //     nombre: "",
    //     apellido: "",
    //     idUsuario: "",
    //     urlFotoPerfil: "",
    //   },
    //   texto: "",
    //   fecha: "",
    // },
  ],
  palabrasClave: {
    general: [],
    especificas: {
      socioNegocio: [],
    },
  },
  familia: {
    // 0 - Padre
    // 1 - Hija
    parentesco: null,
    solicitudMadre: null,
    // {
    //   id: "",
    //   numero: "",
    //   cliente: "",
    //   fecha: "",
    //   solicitante: {
    //     //     id: "",
    //     //     nombre: "",
    //     //     userName: "",
    //   },
    // },
    solicitudesHijas: [
      // {
      //   id: "",
      //   numero: "",
      //   cliente: "",
      //   fecha: "",
      //   solicitante: {
      //     id: "",
      //     nombre: "",
      //     userName: "",
      //   },
      // },
    ],
  },
  log: [
    // {
    //   // cambioEstado
    //   tipo: "",
    //   //  ejecutar solicitud
    //   accion: "",
    //   userName: "",
    //   fecha: "",
    //   info: "",
    // },
  ],
  // quede aqui 21/8/25
  forQueryDB: {
    almacenes: [],
    departamentos: [],
    usuarios: [],
  },
};
