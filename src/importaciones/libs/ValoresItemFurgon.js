import { articulosSchemaFurgon } from "../schema/articulosSchema";
import { propiedadAuxItemFurgonCopiar } from "../schema/furgonSchema";

// Donde se utiliza esta funcion?
// -tabladdblorden
export const valoresFurgonDeOrdens = (
  itemOrden,
  ordenIndicada,
  furgonesMasterEditable,
  MODO,
  furgonesMaster
) => {
  let valoresAux = {};
  if (MODO == "addBL") {
    valoresAux = {
      ...valoresAuxFurgons(itemOrden, furgonesMasterEditable, MODO),
    };
  }
  if (MODO == "detalleBL") {
    valoresAux = {
      ...valoresAuxFurgons(
        itemOrden,
        furgonesMasterEditable,
        MODO,
        undefined,
        furgonesMaster
      ),
    };
  }
  return {
    ...articulosSchemaFurgon,
    codigo: itemOrden.codigo,
    descripcion: itemOrden.descripcion,
    ordenCompra: ordenIndicada.numeroDoc,
    idOrdenCompra: ordenIndicada.id,
    qty: Number(itemOrden.valoresAux.qtyInputCopiarAFurgon),
    comentarioOrden: itemOrden.comentarioOrden,
    comentarios: itemOrden.comentarios,
    valoresAux: { ...valoresAux },
  };
};

// Donde se utiliza esto?
// -Detalle BL
// -Funcion arriba valoresFurgonDeOrden
export const valoresAuxFurgons = (
  itemOrden,
  furgonesMasterEditable,
  MODO,
  // itemFurgon es el item que vamos editando, basicamente es para restar su cantidad de los despachos de este BL
  itemFurgon,
  // Esta propiedad es necesaria cuando estamos editando un BL,
  // Esta propiedad es diferente a la furgonesMasterEditable, pues una es editable significa que es lo que vamos editando local y la otra son los datos que estan guardados en la base de datos
  furgonesMaster
) => {
  //  ******* IMPORTANTE******
  // Esta funcion tiene como proposito calcular los despachos de cada items; recibe un array de furgones, que es el array master de furgones, este array puede ser el guardado en base de datos o el que vamos editando, sucede lo siguiente:
  // los furgones ya guardados en base de datos lo tenemos en furgonesMaster
  // los furgones que vamos editanto lo tenemos en furgonesMasterEditable
  // en addbl, solo necesitamos utilizar el furgonesMasterEditable, dado que no existe ninguno en base de datos mientras lo vamos creando
  // en editar un bl tenemos los dos y a la hora de calcular los despachos de los items, se debe tomar en cuenta los dos por ejemplo:
  // necesitamos sumar todos lo despachos cargado en base dedatos, es decir todos los furgones
  // pero luego necesitamos restarle todos los furgones que correspondan a este bl
  // todo en de la base de datos,
  // por otro lado aparte tenemos que sumar los despachos que vamos agregando
  //  ******* IMPORTANTE******
  const generarDespachosThisBL = (arrayFurgones) => {
    // Aplanamos los materiales de TODOS los furgones utilizados

    // Aqui necesitamos extraer los materiales, sea de furgones o de carga suelta,
    // Vamos a extraer ambos casos, de manera que funcione para los dos sea uno o el otro
    // 1-Dame los materiales provenientes de furgones, es decir furgones que no son carga suelta
    // 2-Luego dame los materiales de carga suelta
    const materialesAplanados = arrayFurgones.flatMap((furgon) => {
      console.log(furgon);
      return furgon.materiales.map((material) => ({
        ...material,
        numeroFurgon: furgon.numeroDoc,
      }));
    });

    const despachosThisBLEsteItem = [];

    materialesAplanados.forEach((producto) => {
      if (producto.codigo === itemOrden.codigo) {
        // ELiminar propiedad valoresAux; para eliminar recursividad
        const { valoresAux, ...copiadSinValoresAux } = producto;
        despachosThisBLEsteItem.push(copiadSinValoresAux);
      }
    });

    const cantidadTotalDespachosThisBL = materialesAplanados.reduce(
      (total, producto) => {
        return (
          total +
          (producto.codigo === itemOrden.codigo &&
          producto.ordenCompra == itemOrden.numeroOrden
            ? producto.qty
            : 0)
        );
      },
      0
    );
    return {
      despachosThisBLEsteItem: despachosThisBLEsteItem,
      cantidadTotalDespachosThisBL: cantidadTotalDespachosThisBL,
    };
  };

  const retornoBase = {
    ...propiedadAuxItemFurgonCopiar,
    cantidadTotalOrdenCompra: itemOrden.qty,
    despachosThisBL: generarDespachosThisBL(furgonesMasterEditable)
      .despachosThisBLEsteItem,
  };

  if (MODO == "addBL") {
    return {
      ...retornoBase,
      qtyTotalDespachosDBFromOrden:
        itemOrden.valoresAux.cantidadTotalDespachosDB,
      qtyTotalDespachosThisBL: generarDespachosThisBL(furgonesMasterEditable)
        .cantidadTotalDespachosThisBL,
    };
  } else if (MODO == "detalleBL") {
    return {
      ...retornoBase,
      // Al valor que esta sumando de despachos de la base de datos, tenemos que restarle lo que corresponde a este BL, dado que este BL obviamente esta en la base de datos tambien

      // ⚠️⚠️⚠️⚠️⚠️ IMPORTANTE  ⚠️⚠️⚠️⚠️⚠️
      // Aqui tenemos que restar las cantidades que se han despachado de este BL, pero solo las cantidades ya guardadas en la base de datos
      // ⚠️⚠️⚠️⚠️⚠️ IMPORTANTE  ⚠️⚠️⚠️⚠️⚠️
      qtyTotalDespachosDBFromOrden:
        itemOrden.valoresAux.cantidadTotalDespachosDB -
        generarDespachosThisBL(furgonesMaster).cantidadTotalDespachosThisBL,
      // A la cantidad total despachada de este BL tenemos que restarle la cantidad que tiene el furgon en edicion,
      // si por ejemplo una orden de compra tiene 100unds de un producto y no hay disponible es decir todos sus despachos suman 100, bueno suponiendo que uno de esos despachos tiene 45, el usuario necesita poder editar y cuando valla a editar debe tener libertad a modificar hasta 45, es decir podra colocar una nueva cantidad entre 1 y 45

      // ⚠️⚠️⚠️⚠️⚠️ IMPORTANTE  ⚠️⚠️⚠️⚠️⚠️
      // Aqui tenemos que restar las cantidades que se han despachado de este BL, pero solo las cantidades que vamos a editando, es decir cantidades no guardadas en la base de datos
      // ⚠️⚠️⚠️⚠️⚠️ IMPORTANTE  ⚠️⚠️⚠️⚠️⚠️
      qtyTotalDespachosThisBL:
        generarDespachosThisBL(furgonesMasterEditable)
          .cantidadTotalDespachosThisBL - itemFurgon?.qty || 0,
    };
  }
};
