// Status FURGONES
// 0-Proveedor
// 1-Transito maritimo
// 2-Puerto
// 3-Almacen
// 4-Departamento de importaciones

import { datosFecha } from "./mixSchema";

// 5-Concluido en SAP

// 5-Concluido
export const furgonSchema = {
  // Esto es importante para saber que el contenedor fue descargado o no,
  // Tambien permite saber si el BL aun esta pendiente en cierto modo, es decir si todos los furgones de un BL fueron descargado no tenemos que pagar
  numeroDoc: "",
  // ***Status FURGONES***
  // 0-Proveedor
  // 1-Transito maritimo
  // 2-Puerto
  // 3-Almacen
  // 4-Departamento de importaciones
  // 5-Concluido en SAP
  // Staus 1, dado que 0 es proveedor y entonces no existe el furgon
  status: 1,
  descargado: false,
  destino: "Pantoja",

  diasRestantes: "",
  fechaRecepProg: "",
  materiales: [
    // articulosSchemaFurgon
  ],
  // Esta propiedad se utiliza en puerto para saber si el contenedor cuando se le coloca una fecha de recepcion en almacen
  planificado: false,
  // *** standBy -  ***

  standBy: "",
  tamannio: "40'",
  createdBy: "",
  createdAt: "",
  datosBL: {
    idBL: "",
    numeroBL: "",
    naviera: "",
    proveedor: "",
    puerto: "",
    diasLibres: "",
  },
  fechas: {
    llegada02AlPais: datosFecha,
    llegada03Almacen: datosFecha,
    llegada04DptoImport: datosFecha,
    llegada05Concluido: datosFecha,
  },
  // Las propiedades auxiliares son propiedades que solo se utilizan en local, es decir no se guardan en la base de datos
  valoresAux: {
    llegadaAlmacenMostrar: "",
    // indica que un contenedor que esta en puerto, ya fue recibido para luego al presionar el boton guardar se haga el cambio
    isRecibido: false,
    // isEnviado indica que se enviaron los documentos al dpto de import
    isEnviado: false,
    // Esto de fijado lo utilizo para dpto import pasar de import a sanp
    fijado: false,
  },
};

export const propiedadAuxItemFurgonCopiar = {
  // esta propiedad representa la cantidad total de despachos que se han hecho de este articulo en la orden de compra, es decir los furgones cargado ya en la base de datos, esto para poder calcular disponible en el recuadro que unifica los materiales del furgon
  qtyTotalDespachosDBFromOrden: 0,
  // Esta propiedad reprensenta las cantidades ya agregadas a este BL, pero aun sin enviar a la base de datos, basicamente los despachos que vamos creando en el BL
  qtyTotalDespachosThisBL: 0,
  // Esta propiedad es para saber la cantidad total que tiene la orden de comprap
  cantidadTotalOrdenCompra: 0,
  qtySobrePasaAux: 0,
};
