import { traerGrupoPorIds } from "../../libs/useDocByCondition";
import { OrdenParsedConDespDB } from "./OrdenParsedConDespDB";

export const blEstadoParsed = (bl, furgones) => {
  // Retorna el estado de un BL a partir de sus contenedores
  let estadoDoc = null;

  //   Si al menos un furgon no esta en status SAP, entonces el bl sigue abierto
  if (furgones.some((furgon) => furgon.status < 5) == true) {
    estadoDoc = 0;
  } else if (
    // SI todos sus furgones estan en estado SAP, entonces BL esta cerrado
    furgones.every((furgon) => furgon.status == 5) == true
  ) {
    estadoDoc = 1;
  }

  return estadoDoc;
};

// esta funcion se le debe cambiar el nombre y colocar un nombre alusivo a que
// retorna si tiene o no materiales pendiente

// Esta funcion es luego del 12/9/25 que ahora las ordenes tiene 3 estados:
// Antes:
// 0-Abiertas
// 1-Cerradas
//
// Ahora
// 0-Abiertas
// 1-En proceso
// 2-Cerrada
//
export const ordenEstadoParsedNueva = async (orden, furgonesLocalUp) => {
  // El array de furgones local es para los furgones que hemos actualizado localmente, ejemplo en ciclo de dpto import, cuando los furgones pasan a listo en SAP, estos furgones son parte de la orden de compra y ya estan actualizado

  // En editar BL debe pasar algo similar, aun no lo trabajo al momento de escribir este comentario

  // dame un array de los ids de furgones de la orden
  // a ese array quitale los duplicados
  // llama estos furgones a la base de datos
  // a ese array quitale los furgones que esten repetidos con el array de furgones local
  // ahora une ambos array de furgones,
  // recuerda eliminar los furgones de la db que ya esten en local, es decir los locales deben persistir porque ya estan actualizados

  const ordenConDespDB = await OrdenParsedConDespDB(
    orden,
    undefined,
    undefined,
    true
  );
  console.log(ordenConDespDB);
  //🟢🟢🟢🟢  SABER EL ESTADO DE LA ORDEN SEGUN SUS MATERIALES 🟢🟢🟢🟢
  // Retorna:
  // 0-Abierta
  // 1-En proceso
  // 99-Verificar contenedores: podria ser: 1 o 2
  // -Si toda la cantidad esta pendiente de todos los items, entonces retorna 0
  // -Si quedan cantidades pendiente por enviar proveedor, entonces retorna 1
  // -Si el proveedor envio todo entonces retorna 99 y signfica que queda verificar el estado de sus furgones, pues si todos los furgones ya estan en SAP, entonces la orden esta cerrada
  const ordenEstadoParsedP = (ordenConDespDB) => {
    const materialesParsed = ordenConDespDB.materiales.map((item) => {
      // Estos seran tres status auxiliares para este mapeo:
      // 17-no se ha enviado nada del item
      // 18-se envio la cantidad todal del item
      // 19-se ha enviado una parte de la cantidad total del item
      let statusItem = null;
      const qtyTotal = item.qty;
      const qtyDespachoThisBL = item.valoresAux.cantidadTotalDespachosThisBL;
      const qtyDespachoDB = item.valoresAux.cantidadTotalDespachosDB;

      const qtyDisponible = qtyTotal - qtyDespachoThisBL - qtyDespachoDB;

      // 17-No se ha enviado nada del item
      if (qtyDisponible == qtyTotal) {
        statusItem = 17;
      }
      // 18-se envio el total de la cantidad del item
      else if (qtyDisponible == 0) {
        statusItem = 18;
      }
      // 19-se ha enviado una parte del item
      else if (qtyDisponible > 0 && qtyDisponible < qtyTotal) {
        statusItem = 19;
      }

      return {
        ...item,
        statusAux: statusItem,
      };
    });
    console.log(materialesParsed);

    // Esto es cuando el proveedor ya envió toda la cantidad de todos los items de la orden de compra
    const enviadoTodo = materialesParsed.every((item) => item.statusAux === 18);

    // Es cuando no se ha enviado nada de los productos
    const enviado0 = materialesParsed.every((item) => item.statusAux === 17);

    // existen articulos que se envio algo pero no completo
    const hasPendientes = materialesParsed.some(
      (item) => item.statusAux === 19
    );

    // Cuando se cumplen estos dos: 1-al menos un items no se envia nada y 2-al menos un item se envio el total, entonces esta en proceso
    // esta validacion es necesaria:
    // acaba de pasar un caso que no previ, la orden 20005386, tiene todos los items completos pero el codigo 09013 no se ha enviado nada y con las condiciones colocada no reconce este caso, pero con las dos condiciones a continuacion se soluciona
    //
    // 1-Al menos un item no se ha enviado nada
    const hasEnviado0 = materialesParsed.some((item) => item.statusAux === 17);
    // 2-Al menos un item se envio completo
    const hasEnviadoTodo = materialesParsed.some(
      (item) => item.statusAux === 18
    );

    // 0-Todos los items estan pendiente al 100%, es decir la orden no tiene ni el primer despacho
    // 1-La orden ya tiene despacho pero aun posee materiales pendiente
    // 2-Este no se mide en esta funcion, pues cerrada cuando todos los items estan en SAP al 100%
    // return sinDespac
    // ho;

    // Esto retorna 99 pues cuando de una orden el proveedor envió toda la cantidad, entonces se debe verificar el estado de todos sus furgones, en caso de que todos sus furgones esten concluidos en SAP, entonces la orden queda cerrada en caso contrario la orden sigue en proceso que es el 1
    console.log(enviadoTodo);
    console.log(enviado0);
    console.log(hasPendientes);
    if (enviadoTodo) {
      return 99;
    }
    if (enviado0) {
      return 0;
    }

    if (hasPendientes) {
      return 1;
    }

    // SI la orden se envio todo de 3 articulos pero el cuarto aun no se envia nada
    if (hasEnviado0 && hasEnviadoTodo) {
      return 1;
    }
    // if (cerrada) {
    //   return 1;
    // } else {
    //   return 0;
    // }
  };
  console.log(ordenConDespDB);
  const estadoPreliminar = ordenEstadoParsedP(ordenConDespDB);

  //🟢🟢🟢🟢 VERIFICAR ESTADO DE FURGONES 🟢🟢🟢🟢
  // Ahora que sabemos el estado de la orden segun sus materiales, ahora queda verificar el estado de los furgones si aplica:

  const idsFurgonesThisOrden = orden.idFurgonesUtilizados;

  const idsFurgonesSinDuplicados = [...new Set(idsFurgonesThisOrden)];
  const furgongesDB = await traerGrupoPorIds(
    "furgones",
    idsFurgonesSinDuplicados
  );

  const furgonesSinNumLocal = furgongesDB.filter((furgon) => {
    const existenLocal = furgonesLocalUp.some(
      (contenedor) => contenedor.id == furgon.id
    );

    if (!existenLocal) {
      return furgon;
    }
  });

  const furgonesConglo = [...furgonesSinNumLocal, ...furgonesLocalUp];
  const furgonesThisOrden = furgonesConglo.filter((furgon) =>
    orden.idFurgonesUtilizados.includes(furgon.id)
  );
  const allEnSap = furgonesThisOrden.every((furgon) => furgon.status === 5);
  console.log(estadoPreliminar);
  console.log(allEnSap);
  // Esto representa cuando el proveedor despacho toda la cantidad de todos los items, entonces falta verificar el estado de sus furgones, por esto el 99
  if (estadoPreliminar == 99) {
    // SI todos los furgones estan en SAP, la orden queda cerrada
    if (allEnSap) {
      return 2;
    } else {
      return 1;
    }
  }
  // Si el proveedor no ha enviado nada
  else if (estadoPreliminar == 0) {
    return 0;
  }
  // Si el proveedor ha enviado algo, pero aun hay cosas pendientes
  else if (estadoPreliminar == 1) {
    return 1;
  }
};
