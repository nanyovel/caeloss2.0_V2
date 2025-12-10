import { ES6AFormat } from "../../libs/FechaFormat";
import FuncionUpWayDate from "../components/FuncionUpWayDate";
import { blSchema } from "../schema/blSchema";
import { furgonSchema } from "../schema/furgonSchema";
import { datosBlAFurgon } from "./DatosDocToDoc";

export const crearNuevoFurgonBath = (
  batch,
  furgon,
  nuevoDocumentoRefFurgon,
  blEditable,
  llegadaAlPaisMostrar,
  userMaster
) => {
  console.log(llegadaAlPaisMostrar);
  const annio = llegadaAlPaisMostrar.slice(0, 4);
  const mes = llegadaAlPaisMostrar.slice(5, 7);
  const dia = llegadaAlPaisMostrar.slice(8, 10);

  const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
    FuncionUpWayDate(annio, mes, dia, 2);

  const datosBL = {
    ...datosBlAFurgon(blEditable),
  };
  const retornar = {
    ...furgonSchema,
    ...furgon,
    createdBy: userMaster.userName,
    createdAt: ES6AFormat(new Date()),
    destino: "Pantoja",
    status: 1,
    arrayItems: furgon.materiales.map((item) => item.codigo),

    materiales: furgon.materiales.map((item) => {
      return {
        ...item,
        valoresAux: null,
      };
    }),
    datosBL: {
      ...furgon.datosBL,
      ...datosBL,
    },

    fechas: {
      llegada02AlPais: {
        fecha: llegadaAlPais,
        confirmada: false,
      },
      llegada03Almacen: {
        fecha: llegadaAlmacen,
        confirmada: false,
      },
      llegada04DptoImport: {
        fecha: llegadaDptoImport,
        confirmada: false,
      },
      llegada05Concluido: {
        fecha: llegadaSap,
        confirmada: false,
      },
    },
  };
  if (batch) {
    batch.set(nuevoDocumentoRefFurgon, retornar);
  }
  return retornar;
};

// export const datosBagajeSuelto222 = (
//   billOflading,
//   materialesUnificados,
//   llegadaAlPaisMostrar
// ) => {
//   const annio = llegadaAlPaisMostrar.slice(0, 4);
//   const mes = llegadaAlPaisMostrar.slice(5, 7);
//   const dia = llegadaAlPaisMostrar.slice(8, 10);

//   const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
//     FuncionUpWayDate(annio, mes, dia, 2);
//   const datosBL = {
//     ...datosBlAFurgon({
//       ...billOflading,
//     }),
//   };
//   const retornar = {
//     ...blSchema.cargaSuelta,

//     arrayItems: materialesUnificados.map((item) => item.codigo),
//     materiales: materialesUnificados.map((item) => {
//       return {
//         ...item,
//         valoresAux: null,
//       };
//     }),
//     datosBL: {
//       ...billOflading.cargaSuelta.datosBL,
//       ...datosBL,
//     },

//     fechas: {
//       llegada02AlPais: {
//         fecha: llegadaAlPais,
//         confirmada: false,
//       },
//       llegada03Almacen: {
//         fecha: llegadaAlmacen,
//         confirmada: false,
//       },
//       llegada04DptoImport: {
//         fecha: llegadaDptoImport,
//         confirmada: false,
//       },
//       llegada05Concluido: {
//         fecha: llegadaSap,
//         confirmada: false,
//       },
//     },
//   };

//   return retornar;
// };
