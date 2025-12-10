// ************************* Detectar alertas *************************

import { ES6AFormat } from "../../libs/FechaFormat";

export const hasAlertaFunct = (request) => {
  const causas = [];
  // Si tiene mas de un pago
  if (request.datosMontos.length > 1) {
    causas.push("Alteracion de tabla de montos.");
  }
  // Si el camion master tiene ayudantes adicionales
  if (request.datosFlete?.ayudantesAdicionales?.length > 0) {
    causas.push("El camion master posee ayudantes adicionales.");
  }
  // Si tiene vehiculos adicionales
  if (request.datosFlete?.vehiculosAdicionales?.length > 0) {
    causas.push("Esta solicitud posee vehiculos adicionales.");
  }
  // Si algun vehiculo adicional tiene ayudante adicional
  let hasAyudante = false;
  request.datosFlete?.vehiculosAdicionales?.forEach((vehi) => {
    if (vehi?.ayudantesAdicionales?.length > 0) {
      hasAyudante = true;
    }
  });
  if (hasAyudante) {
    causas.push("Existen camiones adicionales con ayudantes adicionales.");
  }

  if (causas.length > 0) {
    return {
      icono: "🟡",
      causas: causas,
    };
  } else {
    return {
      icono: "",
      causas: [],
    };
  }
};
class CostoMonto {
  constructor(rolVeh, rol, ordenCSS, nombreCompleto, monto, vehiculo, tipo) {
    this.rolVeh = rolVeh;
    this.rol = rol;
    this.ordenCSS = ordenCSS;
    this.nombreCompleto = nombreCompleto;
    this.monto = monto;
    this.vehiculo = vehiculo;

    this.tipo = tipo;
  }
}
// class CostoMonto {
//   constructor(rolVeh, rol, ordenCSS, nombreCompleto, monto, vehiculo, tipo) {
//     this.vehiculo = vehiculo;
//     this.monto = monto;
//     this.nombreCompleto = nombreCompleto;

//     this.rolVeh = rolVeh;
//     this.rol = rol;
//     this.ordenCSS = ordenCSS;
//     this.tipo = tipo;
//   }
// }

export const mostrarTablaCosto = (request, interno) => {
  const reqFinded = request;
  const costosTablaAxVehMaster = [];
  const costosTablaAxuVehAdd = [];
  //
  //
  //🟢****** 1-Monto chofer camion master ******
  const costoChoferMasterInterno = new CostoMonto(
    "Vehiculo Master",
    "Chofer",
    0,
    reqFinded.datosEntrega.chofer.nombre +
      " " +
      reqFinded.datosEntrega.chofer.apellido +
      " ",
    reqFinded.datosFlete.vehiculoSeleccionado.viajesInterno.montoChofer,
    reqFinded.datosFlete.vehiculoSeleccionado.descripcion,
    "Chofer Vehiculo principal"
  );
  const costoChoferMasterExterno = new CostoMonto(
    "Vehiculo Master",
    "Chofer",
    0,
    reqFinded.datosEntrega.chofer.nombre +
      " " +
      reqFinded.datosEntrega.chofer.apellido +
      " ",
    reqFinded.datosFlete.costo,
    reqFinded.datosFlete.vehiculoSeleccionado.descripcion,
    "Chofer Vehiculo principal"
  );
  if (interno) {
    costosTablaAxVehMaster.push(costoChoferMasterInterno);
  } else {
    costosTablaAxVehMaster.push(costoChoferMasterExterno);
  }

  // 🟢****** 2-Monto ayundate camion master ******
  let costoAyudanteMaster = new CostoMonto(
    "Vehiculo Master",
    "Ayudante",
    0,
    reqFinded.datosEntrega.ayudante.nombre +
      " " +
      reqFinded.datosEntrega.ayudante.apellido +
      " ",
    reqFinded.datosFlete.vehiculoSeleccionado.viajesInterno.montoAyudante,
    reqFinded.datosFlete.vehiculoSeleccionado.descripcion,
    "Ayudante Vehiculo principal"
  );
  // Es interno y tiene ayudante
  if (reqFinded.datosEntrega.ayudante.id && interno) {
    costosTablaAxVehMaster.push(costoAyudanteMaster);
  }
  //
  //
  //
  // 🟢****** 3-Ayundates adicionales camion master ******
  const ayudantesAddVehMaster = [];
  reqFinded.datosFlete?.ayudantesAdicionales?.forEach((ayudAdd) => {
    const costoAyudanteAdicional = new CostoMonto(
      "Vehiculo Master",
      "Ayudante adicional",
      0,
      ayudAdd.nombre,
      ayudAdd.monto,
      reqFinded.datosFlete.vehiculoSeleccionado.descripcion,
      "Ayudante Adicional Vehiculo principal"
    );

    ayudantesAddVehMaster.push(costoAyudanteAdicional);
  });
  // Si tiene ayudantes adicionales agregalos
  if (reqFinded.datosFlete?.ayudantesAdicionales?.length > 0) {
    costosTablaAxVehMaster.push(...ayudantesAddVehMaster);
  }
  //
  //
  //
  // 🟢****** 4-Incentivos/Pagos de todos los choferes de camiones adicional******
  const choferesVehiculosAdicionales = [];
  reqFinded.datosFlete?.vehiculosAdicionales?.forEach((vehiAdd, index) => {
    const costoVehiculoAdicionalInterno = new CostoMonto(
      `Vehiculo adicional N° ${index + 1}`,
      "Chofer",
      index + 1,
      vehiAdd.datosEntrega.chofer.nombre + vehiAdd.datosEntrega.chofer.apellido,
      vehiAdd.viajesInterno.montoChofer,
      vehiAdd.descripcion,
      `Chofer de vehiculo adicional N°${index + 1}`
    );
    const costoVehiculoAdicionalExterno = new CostoMonto(
      `Vehiculo adicional N° ${index + 1}`,
      "Chofer",
      index + 1,
      reqFinded.datosFlete.costo,
      vehiAdd.viajesInterno.montoChofer,
      vehiAdd.descripcion,
      `Chofer de vehiculo adicional N°${index + 1}`
    );

    if (interno) {
      choferesVehiculosAdicionales.push(costoVehiculoAdicionalInterno);
    } else {
      choferesVehiculosAdicionales.push(costoVehiculoAdicionalExterno);
    }
  });
  // Si tiene vehiculos adicionales agregale sus choferes
  if (reqFinded.datosFlete?.vehiculosAdicionales?.length > 0) {
    costosTablaAxuVehAdd.push(...choferesVehiculosAdicionales);
  }
  //
  //
  //
  //

  //
  //
  //
  //
  //🟢****** 5-Incentivo ayudante de camion adicional ******
  // Este debe ser de tipo interno
  reqFinded.datosFlete?.vehiculosAdicionales?.forEach((vehiAdd, indexVeh) => {
    const ayudantesMasterCamionAdicional = [];
    // si tiene ayudantes es decir es un chofer interno y ademas tiene ayudante
    if (vehiAdd.datosEntrega.ayudante.id && interno) {
      let costoAyudanteMaster = new CostoMonto(
        `Vehiculo adicional N° ${indexVeh + 1}`,
        "Ayudante",
        indexVeh + 1,
        vehiAdd.datosEntrega.ayudante.nombre +
          " " +
          vehiAdd.datosEntrega.ayudante.apellido +
          " ",

        vehiAdd.viajesInterno.montoAyudante,
        vehiAdd.descripcion,
        `Ayundate  master de vehiculo adicional N°${indexVeh + 1}`
      );
      ayudantesMasterCamionAdicional.push(costoAyudanteMaster);
    }
  });

  //
  //
  //
  //🟢****** 6-Pago ayundates adicionales de cada vehiculos adicionales ******
  reqFinded.datosFlete?.vehiculosAdicionales?.forEach((vehiAdd, indexVeh) => {
    const ayundatesAdicionalesVehiculosAdicionales = [];
    vehiAdd.ayudantesAdicionales?.forEach((ayuAddVehAdd, index) => {
      const costoAyuAdicional = new CostoMonto(
        `Vehiculo adicional N° ${indexVeh + 1}`,
        "Ayudante adicional",
        indexVeh + 1,
        ayuAddVehAdd.nombre,
        ayuAddVehAdd.monto,
        vehiAdd.descripcion,
        `Ayundate N°${index + 1} adicional de vehiculo adicional N°${indexVeh + 1}`
      );

      ayundatesAdicionalesVehiculosAdicionales.push(costoAyuAdicional);
    });

    // Si algun vehiculo adicional tiene ayundate adicional agregalos
    if (vehiAdd?.ayudantesAdicionales?.length > 0) {
      costosTablaAxuVehAdd.push(...ayundatesAdicionalesVehiculosAdicionales);
    }
  });

  //
  //
  const costosTablaAxuVehAddSort = costosTablaAxuVehAdd.sort(
    (a, b) => a.ordenCSS - b.ordenCSS
  );
  // const ordenado = data.sort((a, b) => a.ordenCSS - b.ordenCSS);
  return [...costosTablaAxVehMaster, ...costosTablaAxuVehAddSort];
};

export const agregarBatchContabilidad = ({
  batch,
  docActualizar,
  userMaster,
  nombreCampo,
  aprobada,
}) => {
  const valoresReturn = {
    status: aprobada ? 1 : 2,
    rechazada: !aprobada,
    usuario: userMaster.userName,
    idUsuario: userMaster.id,
    fecha: ES6AFormat(new Date()),
  };
  const statusPath = `contabilidad.log.${nombreCampo}.status`;
  const userNamePath = `contabilidad.log.${nombreCampo}.usuario.userName`;
  const userIdPath = `contabilidad.log.${nombreCampo}.usuario.id`;
  const fechaPath = `contabilidad.log.${nombreCampo}.fecha`;
  const rechazadaPath = `contabilidad.rechazada`;

  batch.update(docActualizar, {
    [statusPath]: valoresReturn.status,
    [userNamePath]: valoresReturn.usuario,
    [userIdPath]: valoresReturn.idUsuario,
    [fechaPath]: valoresReturn.fecha,
    [rechazadaPath]: valoresReturn.rechazada,
  });
  return { ...valoresReturn };
};

// Esta funcion lo que hace es decirte a que paso del ciclo pertenece una solicitud o los datos molde del paso en si del ciclo, es decir los datos molde que declaramos en el componente padre de manera literal
// 0-Sin aprobar
// 1-Aprobado por logistica
// 2-Aprobado por solicitante
// 3-Aprobado por Finanazas
// Rechazado <----- este caso funciona un poco diferente
export const compararListaAPS = ({
  statusLogistica,
  statusSolicitante,
  statusContabilidad,
}) => {
  const rechazado = [
    statusLogistica,
    statusSolicitante,
    statusContabilidad,
  ].includes(2);

  let numLlamarAxu;
  if (rechazado) {
    numLlamarAxu = undefined;
  } else {
    const aprobados = [
      statusLogistica,
      statusSolicitante,
      statusContabilidad,
    ].filter((v) => v === 1).length;
    numLlamarAxu = aprobados; // 0, 1, 2 o 3 según cuántos tengan valor 1
  }

  // Elegi el numero 4 pero no corresponde a los valores del schema de solicitudes, sino como una solicion para seguir el mismo enfoque
  if (rechazado) {
    numLlamarAxu = 4;
  }
  return { numLlamarAxu };
};
