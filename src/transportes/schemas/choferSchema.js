// ***** Comportamiento de estados vehiculos add ******
// 1-Si una solicititud tiene al menos un vehiculo adicional en estado "En ejecucion" la solicitud esta en ejecucion y aplica para todas las funciones
// 2-Para solicitud pasar a concluida debera tener todos los vehiculos adicionales en estado "Concluido"

// ************************ CHOFERES ************************

// Estado doc
// 0 - OFF
// 1 - Disponible
// 2 - Ejecucion
// 3 - Inactivo

// LOGICA
// Para enumerar primero debe primero selecionar una localidad
// Solo puede enumerar los vehiculos en modo disponible
// 0 - OFF
//    En las mañanas el encargado de transporte debera presionar un boton de reset para que todos los choferes en modo disponible, pasen a modo OFF
// 1 - Disponible
// Luego del Reset se debe elegir una localidad y presionar el boton Ordenar y se le coloca el orden deseado, se presiona en guardar cambios y todos los enumerados pasan a estado disponible
// 2 - Ejecucion
// 3 - Inactivo
//
export const choferSchema = {
  numeroDoc: "",
  estadoDoc: 0,
  nombre: "",
  apellido: "",
  cedula: "",
  flota: "",
  celular: "",
  localidad: "",
  urlFotoPerfil: "",
  fechaCreacion: "",
  empresa: "",
  // Tipo interno o externo:
  // 0-IN - Interno
  // 1-EI - Externo Independiente
  // 2-EE - Externo Empresa
  // 3-AG - Esto es especial y es ayudante externo generico
  tipo: "",
  isAyudante: false,
  ayudante: {
    id: "",
    numeroDoc: "",
    nombre: "",
    apellido: "",
  },
  jefeChofer: {
    id: "",
    numeroDoc: "",
    nombre: "",
    apellido: "",
  },

  unidadVehicular: {
    code: "",
    placa: "",
    descripcion: "",
  },
  current: {
    solicitud: {},
    numeroCarga: "",
    solicitudesAdicionales: [],
  },
  // Principal proposito: Calificacion // Puntuacion
  historico: [
    // {
    //   id: "",
    //   numero: "",
    //   cliente: "",
    //   fecha: "",
    //   solicitante: {
    //     obs: "",
    //     calificacion: "",
    //   },
    //   cliente: {
    //     obs: "",
    //     calificacion: "",
    //   },
    // },
  ],
};
