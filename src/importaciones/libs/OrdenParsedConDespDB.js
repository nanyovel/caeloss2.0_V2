import { traerGrupoPorIds } from "../../libs/useDocByCondition";
import { propiedadAuxItemHalarOrden } from "../schema/ordenCompraSchema";

export const OrdenParsedConDespDB = async (
  orden,
  MODO,
  blEditable,
  conEstadoDoc
) => {
  const furgones = await traerGrupoPorIds(
    "furgones",
    orden.idFurgonesUtilizados
  );

  const blsUtilizados = await traerGrupoPorIds(
    "billOfLading2",
    orden.idsBLUtilizados
  );
  const blsFleteSuelto = blsUtilizados.filter((bl) => bl.tipo == 1);

  // Primero aplanemos todos los materiales de los furgones
  // Ademas lo parseamos con algunas propiedades necesarias
  const materialesAplanados = furgones.flatMap((furgon) => {
    return furgon.materiales.map((material) => ({
      ...material,
      numeroFurgon: furgon.numeroDoc,
      idFurgon: furgon.id,
      idBL: furgon.datosBL.idBL,
      fechaCreacionFurgon: furgon.createdAt,
      tipoBL: 0,
    }));
  });

  const matArraySuelto = [];
  blsFleteSuelto.forEach((bl) => {
    const materiales = bl.fleteSuelto?.materiales || [];
    materiales.forEach((material) => {
      matArraySuelto.push({
        ...material,
        numeroFurgon: bl.fleteSuelto.numeroDoc,
        idFurgon: bl.id,
        idBL: bl.id,
        numeroBL: bl.numeroDoc,
        fechaCreacionFurgon: "",
        tipoBL: 1,
      });
    });
  });
  const matFleteSuelto2 = matArraySuelto;

  let materialesFiltrados = materialesAplanados;
  let matFilterFleteSuelto = matFleteSuelto2;
  if (MODO == "detalleBL") {
    // Quita los despachos de la DB que sean de este BL, pues como lo estamos editando se convierte en despachos local que se maneja con otro componente y de manera reactiva, es decir cada cambio que va haciendo el usuario va acutalizando el array de despachos dentro de cada arituclo de cada orden
    materialesFiltrados = materialesAplanados.filter(
      (item) => blEditable.id != item.idBL
    );
    matFilterFleteSuelto = matFleteSuelto2.filter(
      (item) => blEditable.id != item.idBL
    );
  }

  // Dame solo los materiales de esta orden
  const matFurgonFilter = materialesFiltrados.filter(
    (item) => item.ordenCompra == orden.numeroDoc
  );
  const matSueltoFilter = matFilterFleteSuelto.filter(
    (item) => item.ordenCompra == orden.numeroDoc
  );
  const congloMat = [...matFurgonFilter, ...matSueltoFilter];
  const materialesOrdenParsed = orden.materiales.map((mate, index) => {
    const despachos = [];
    congloMat.forEach((producto) => {
      if (
        orden.numeroDoc == producto.ordenCompra &&
        mate.codigo == producto.codigo
      ) {
        despachos.push(producto);
      }
    });

    return {
      ...mate,
      valoresAux: {
        ...propiedadAuxItemHalarOrden,
        despachosDB: despachos,
        cantidadTotalDespachosDB: despachos.reduce((total, item) => {
          return total + item.qty;
        }, 0),
      },
    };
  });

  // Calcular si la orden esta abierta o cerrada
  const todosDespachados = materialesOrdenParsed.every(
    (item) =>
      item.valoresAux.cantidadTotalDespachosDB == item.qty ||
      item.valoresAux.cantidadTotalDespachosDB > item.qty
  );
  const algunoAbierto = materialesOrdenParsed.some(
    (item) => item.valoresAux.cantidadTotalDespachosDB < item.qty
  );

  // A la hora de consumir datos de una orden desde la base de datos, no se debe calcular el estadoDoc, sino que debe ser literal de la base de datos,
  // Pero si estamos subiendo datos a la base de datos entonces si debemos calcular el estado de la orden
  const resultadoSinEstadoDoc = {
    ...orden,
    materiales: materialesOrdenParsed,
  };
  if (conEstadoDoc) {
    return {
      ...resultadoSinEstadoDoc,
      // Si la orden estaba cerrada, pero el usuario aumento sus cantidades, entonces la orden debe cambiar a abierta
      estadoDoc:
        // Si algun item esta pendiente entonces queda abierta
        algunoAbierto
          ? 0
          : // Si ninguno esta pendiente, entonces pregunta:
            // ----Todos fueron despachos o alguno sobre pasa;
            // -------Entonces esta cerrada
            // En caso contrario coloca el estado anterior de la orden, es decir no le toques el estado
            todosDespachados
            ? 1
            : orden.estadoDoc,
    };
  } else {
    return {
      ...resultadoSinEstadoDoc,
    };
  }
};
