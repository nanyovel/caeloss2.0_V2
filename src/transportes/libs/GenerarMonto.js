import { ES6AFormat } from "../../libs/FechaFormat";
import { elementoMontoSchema, montoSchemaNuevo } from "../schemas/montosSchema";
import { generarElementoMonto } from "./generarElementoReq";

// export const GenerarElementosMontos = (datosFlete) => {
//   let elementoBase = {
//     ...elementoMontoSchema,
//   };
//   const elementos = [];
//   //
//   //
//   console.log(datosFlete);
//   // 🟢🟢0-Camion master
//   // Siempre tendra camion master
//   const camionMaster = {
//     ...elementoBase,
//     costo: datosFlete.costo,
//     precio: datosFlete.precio,
//     descripcion: datosFlete.vehiculoSeleccionado.descripcion,
//     id: generarUUID(),
//     viajesInterno: { ...datosFlete.vehiculoSeleccionado.viajesInterno },
//     //
//     idElementoOrigen: datosFlete.idCamionComoElemento,
//   };
//   elementos.push(camionMaster);
//   //
//   //
//   //
//   // 🟢🟢1-Ayudante adicional camion master
//   if (datosFlete.ayudantesAdicionales.length > 0) {
//     datosFlete.ayudantesAdicionales.forEach((ayudAdd) => {
//       const ayudanteAdicionalCamionMaster = {
//         ...elementoBase,
//         ...ayudanteAdd,
//         costo: ayudAdd.costo,
//         descripcion: ayudAdd.nombre,
//         id: generarUUID(),
//         obs: ayudAdd.obs,
//         idElementoOrigen: ayudAdd.idAyudanteComoElemento,
//       };
//       elementos.push(ayudanteAdicionalCamionMaster);
//     });
//   }
//   //
//   // 🟢🟢2-Camion adicional
//   if (datosFlete.vehiculosAdicionales.length > 0) {
//     datosFlete.vehiculosAdicionales.forEach((camionAdd) => {
//       const camionAdicional = {
//         ...elementoBase,
//         costo: camionAdd.resultado.costo,
//         precio: camionAdd.resultado.precio,
//         descripcion: camionAdd.descripcion,
//         id: generarUUID(),
//         viajesInterno: { ...camionAdd.viajesInterno },
//         idElementoOrigen: camionAdd.idCamionComoElemento,
//       };
//       elementos.push(camionAdicional);

//       // 🟢🟢3-Ayudante adicional camion adicional
//       // Si el camion adicional tiene ayudante adicional agrega cada uno
//       if (camionAdd?.ayudantesAdicionales?.length > 0) {
//         camionAdd?.ayudantesAdicionales.forEach((ayudAdd) => {
//           const ayudanteAdicionalCamionAdicional = {
//             ...elementoBase,
//             ...ayudanteAdd,
//             costo: ayudAdd.costo,
//             descripcion: ayudAdd.nombre,
//             id: generarUUID(),
//             obs: ayudAdd.obs,
//             idElementoOrigen: ayudAdd.idAyudanteComoElemento,
//           };
//           elementos.push(ayudanteAdicionalCamionAdicional);
//         });
//       }
//     });
//   }

//   return elementos;
// };

export const GenerarMonto = ({
  datosFlete,
  origen,
  justificacion,
  userMaster,
  //
  costoManual,
  precioManual,
}) => {
  const datosMontosInitial = {
    ...montoSchemaNuevo,
    origen: origen,
    createdAt: ES6AFormat(new Date()),
    createdBy: userMaster?.userName,

    elementos: generarElementoMonto(datosFlete),
  };
  let datosMontosAux = {
    ...datosMontosInitial,
  };
  // Si es de origen initial formula
  if (origen == 0) {
    datosMontosAux = {
      ...datosMontosAux,

      justificacion: "initialFormula",
      aprobaciones: {
        ...montoSchemaNuevo.aprobaciones,
        aprobado: 1,
      },
    };
  }
  // Si es un monto de origen 2 es decir precio manual initial
  else if (origen == 1) {
    datosMontosAux = {
      ...datosMontosAux,
      precioManual: precioManual,
      justificacion: justificacion,
      aprobaciones: {
        ...montoSchemaNuevo.aprobaciones,
        aprobado: 0,
      },
    };
  }
  // Si es un monto de origen 2 es decir cambio de vehiculo luego de creado
  else if (origen == 2) {
    datosMontosAux = {
      ...datosMontosAux,
      justificacion: justificacion,
      aprobaciones: {
        ...montoSchemaNuevo.aprobaciones,
        aprobado: 2,
        aprobadoPor: userMaster.userName,
        fechaAprobacion: ES6AFormat(new Date()),
      },
    };
  }
  // Si es un monto de origen 3 es decir costo y precio manual
  else if (origen == 3) {
    datosMontosAux = {
      ...datosMontosAux,
      costoManual: costoManual,
      precioManual: precioManual,
      justificacion: justificacion,
      aprobaciones: {
        ...montoSchemaNuevo.aprobaciones,
        aprobado: 2,
        aprobadoPor: userMaster.userName,
        fechaAprobacion: ES6AFormat(new Date()),
      },
    };
  }
  // Si el monto se produjo a raiz de cambios en ayudantes adicionales (creacion, eliminacion o edicion de algun ayudante adicional de vehiculo principal o vehiculo adicional)
  else if (origen == 4) {
    datosMontosAux = {
      ...datosMontosAux,

      justificacion: "",
      aprobaciones: {
        ...montoSchemaNuevo.aprobaciones,
        aprobado: 2,
        aprobadoPor: userMaster.userName,
        fechaAprobacion: ES6AFormat(new Date()),
      },
    };
  }
  console.log(datosMontosAux);
  return { ...datosMontosAux };
};
