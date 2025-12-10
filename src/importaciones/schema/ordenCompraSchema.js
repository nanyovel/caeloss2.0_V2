export const ordenCompraSchema = {
  // Estados
  // 0-Abierta
  // 1-En proceso
  // 2-Cerrada
  numeroDoc: "",
  proveedor: "",
  comentarios: "",
  createdBy: "",
  createdAt: "",
  estadoDoc: 0,
  materiales: [
    // Utilizar schema de articulosSchema
  ],
  partidas: [
    //  Utilizar schema de partidaOrdenSchema
  ],
  arrayItems: [],
  idsBLUtilizados: [],
  idFurgonesUtilizados: [],
  empresa: "",
};

export const propiedadAuxItemHalarOrden = {
  // Este es un array de todos los despachos de este articulo de la DB, es decir todos los furgones ya creados en la DB
  despachosDB: [],
  // Propiedades que debe tener cada despacho DB
  // const despachos={
  //   codigo:'',
  //   descripcion:'',
  //   qty:'',
  //   comentarioOrden:'',
  //   comentarios:'',
  //   fechaCreacionFurgon:'',
  //   idBL:'',
  //   numeroFurgon:'',
  //   idFurgon:'',
  //   ordenCompra:'',
  //   valoresAux:'',
  // }

  // Esto es la sumatoria de todos despachos ya registrados en la Base de Datos
  cantidadTotalDespachosDB: 0,

  // Esto es para saber que cantidad de este producto se ha colocado en este BL
  // Realmente no es la BL, sino al estado furgonesMasterEditable, que es un array de todos los furgones que se han agregado al BL
  cantidadTotalDespachosThisBL: 0,

  // Esto es un array de todos los despachos de este articulos pero de manera local, es decir los de este BL
  despachosThisBL: [],
  // Propiedades que debe tener cada despacho local
  // const despachos={
  //   codigo:'',
  //   descripcion:'',
  //   qty:'',
  //   comentarioOrden:'',
  //   comentarios:'',
  //   ordenCompra:'',
  //   valoresAux:'',
  //   numeroFurgon:'',
  // Las siguientes dos propiedades no son necesarias para los despachos locales
  //   idBL:'',
  //   fechaCreacionFurgon:'',
  // }

  // Esto es para saber si el item ya fue agregado al furgon y no permitir que se vuelva a agregar
  itemAgregado: false,

  //Esto representa la cantidad que se va a copiar al furgon, es decir lo que el usuario va escribiendo en el input, que es diferente a la cantidad total que se tiene en la orden de compra
  qtyInputCopiarAFurgon: 0,

  // Esto es para saber si un articulo sobre pasa la cantidad disponible en la orden de compra
  qtySobrePasaAux: false,
};

export const partidaOrdenSchema = {
  fechaProyectada: "",
  materiales: [],
};
