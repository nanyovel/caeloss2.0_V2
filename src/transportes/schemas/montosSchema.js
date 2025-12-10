// Los tipos de elementos en total son 6, pero pagos solo utiliza 4, pues no utiliza ayudantes de camion principal ni ayudantes camion adicional
// El diccionario de elementos origen lo encontramos en la carpeta libs dentro el archivo generalElemento.js
// Los elementos montos solo toma los elementos origen que se pueden utilizar externamente, en otras palabras los elementos que tienen la propiedad isOnlyInterno en true, no son utilizados en elementos montos
export const elementoMontoSchema = {
  // Este es el codigo que corresponde al diccionario de elemento origen y en el caso de montos pueden ser:
  // -ElOG1 - Camion principal
  // -ElOG3 - Ayudante adicional camion principal
  // -ElOG4 - Camion adicional
  // -ElOG6 - Ayudante adicional camion adicional
  // Tomar en cuenta que para monto son 4 elementos pero para elementos origen, en realidad son 6 elementos y es que para montos no existe un pago por separado para ayudantes, sino un costo de un camion por mover mercancia de A - B, pero para otros fines si debemos tomar todos los elementos que en total hasta ahora son 6
  codigoElementoOrigen: "",
  costo: "",
  precio: "",
  descripcion: "",
  id: "",

  //
  // Este id es el id del elemento origen dentro de la solicitud que es diferente a los elementos del array dicionarioElementosOrigenReq
  idElementoOrigen: "",
  obs: "",
  //*****Los proximos son nuevos valores colocados a partir del 11/7/25

  //
  //
  //
  // viajesInterno: {
  //   montoChofer: "",
  //   montoAyudante: "",
  // },

  // // Cuando se asigna chofer/ayudante
  // beneficiario: {
  //   id: "",
  //   tipo: "", // 0-interno, 1-extern ind, 2- ext emp
  //   nombre: "",
  //   apellido: "",
  //   numeroDoc: "",
  // },
  //   Cuando se crea el pago
  // pagoEjecutado: {
  //   idPagoHijo: "",
  //   idPagoPadre: "",
  //   fecha: "",
  // },
};
export const traduccionOrigen = [
  // 0-Se genera al momento de crear la solicitud y desde la formula
  "Formula Initial",
  // 1-Se genera al crear la solicitud pero se coloca precio manual
  "Precio manual initial",
  // 2-Cuando cambiamos un vehiculo y el monto proviene desde la formula
  "Cambio de vehiculo luego de creado",
  // 3-Se agregan un costo y precio manualmente
  "Costo y Precio Manual luego de que esta creada la solicitud",
  // 4-Se agregan ayudantes adicionales
  "Ayudantes adicionales",
];

export const montoSchemaNuevo = {
  origen: "",
  costoManual: "",
  precioManual: "",
  createdAt: "",
  createdBy: "",
  nuevoFormato: true,
  aprobaciones: {
    // Aprobado
    // 0-Sin aprobar solicitante----Esto cuando el usuario solicita y cambia el precio de manera manual
    // 1-Default-aprobado-----------Este es el monto que genera por default en TMS
    // 2-Aprobado-------------------Esto es cuando requeria aprobacion pero ya fue aprobado, por un usuario con privilegio
    // 3-Rechadazado----------------
    aprobado: 0,
    aprobadoPor: "",
    fechaAprobacion: "",
  },
  //
  justificacion: "",
  elementos: [{ ...elementoMontoSchema }],
};
export const montoSchemaViejo = {
  // TIPO
  // 0-Formula---------------------------->se produce al calcular desde los vehiculos y la distancia
  // 1-Manual creacion Ventas durante creacion----->solo sera uno y en la segunda fila
  // 2-Manual edicion luego de que esta creado
  tipo: "",
  fecha: "",
  usuario: "",
  codeVehiculo: "",
  justificacion: "",
  costo: "",
  precio: "",
  aprobadoPor: "",
  vehiculosAdd: [],
};
