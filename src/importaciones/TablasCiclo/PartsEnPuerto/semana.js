import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ES6AFormat } from "../../../libs/FechaFormat";

// // ******************** ALIMENTANDO FECHAS ******************** //

// const [hasFurgonSet,setHasFurgonSet]=useState(new Set())
const semana = [
  {
    nombre: "Lunes",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Martes",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Miercoles",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Jueves",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Viernes",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Sabado",
    selected: false,
    fecha: "",
    disabled: false,
  },
  {
    nombre: "Domingo",
    selected: false,
    fecha: "",
    disabled: false,
  },
];
export const weekSelectFunction = (listaProgramacion) => {
  const dosSemanas = {
    week1: semana,
    week2: semana,
  };

  // Dame la fecha de hoy
  const fechaActual = new Date();
  // Dame el numero de dia de hoy de la semana no del mes
  const numCurrentDay = Number(fechaActual.getDay());
  // Esto hace que la semana empiece en Lunes y no en domingo
  const numCurrentDayParsed = numCurrentDay > 0 ? numCurrentDay - 1 : 6;

  return {
    ...dosSemanas,
    week1: dosSemanas.week1.map((day, index) => {
      let fecha = "";

      if (index === numCurrentDayParsed) {
        fecha = fechaActual;
      } else {
        fecha = new Date();
        let dif = index - numCurrentDayParsed;
        fecha.setDate(fechaActual.getDate() + dif);
      }
      //  Contar cantidad de furgones por dia
      let arrayFecha = listaProgramacion.filter((furgon) => {
        if (
          furgon.fechaRecepProg?.slice(0, 10) == ES6AFormat(fecha).slice(0, 10)
        ) {
          return furgon;
        }
      });
      return {
        ...day,
        disabled: numCurrentDayParsed > index ? true : false,
        fecha: ES6AFormat(fecha).slice(0, 10),
        qtyFurgones: arrayFecha.length,
      };
    }),
    week2: dosSemanas.week2.map((day, index) => {
      // 1-Primero dime cual es la diferencia de dias de hoy hasta el lunes de la semana proxima
      // 2-Si el dia es domingo entonces sera igual a 6, ese decir el septimo dia, hago esto dado que para js el domingo es primer dia pero es mas sencillo para el usuario si el lunes es el primer dia
      let dif = 7 - numCurrentDayParsed;
      // dias a sumar sera igual a la diferencia de hoy hasta el lunes mas i que es que se ira sumando lunes, martes miercoles...
      let diasASumar = dif + index;
      let fechaFinal = new Date();
      fechaFinal.setDate(fechaActual.getDate() + diasASumar);
      //  Contar cantidad de furgones por dia
      let arrayFecha = listaProgramacion.filter((furgon) => {
        if (
          furgon.fechaRecepProg?.slice(0, 10) ==
          ES6AFormat(fechaFinal).slice(0, 10)
        ) {
          return furgon;
        }
      });
      //
      //
      //
      //
      //

      return {
        ...day,
        fecha: ES6AFormat(fechaFinal).slice(0, 10),
        qtyFurgones: arrayFecha.length,
      };
    }),
  };
};
// export const weekSelectFunction = (listaProgramacion) => {
//   const weekSelectedInitial = {
//     week1: semana,
//     week2: semana,
//   };

//   //
//   let fechaActual = new Date();
//   const numeroDiaES6 = fechaActual.getDay();
//   const numeroDiaParsed = numeroDiaES6 > 0 ? numeroDiaES6 - 1 : 6;

//   const weekParsed = {
//     ...weekSelectedInitial,
//     week1: [
//       ...weekSelectedInitial.week1.map((day, i) => {
//         {
//           let fecha = "";
//           if (i == numeroDiaParsed) {
//             fecha = fechaActual;
//           } else if (i > numeroDiaParsed) {
//             fecha = new Date();
//             let dif = i - numeroDiaParsed;
//             fecha.setDate(fechaActual.getDate() + dif);
//           } else if (i < numeroDiaParsed) {
//             fecha = new Date();
//             let dif = i - numeroDiaParsed;
//             fecha.setDate(fechaActual.getDate() + dif);
//           }

//           //  Contar cantidad de furgones por dia
//           let arrayFecha = listaProgramacion.filter((furgon) => {
//             if (
//               furgon.fechaRecepProg?.slice(0, 10) ==
//               ES6AFormat(fecha).slice(0, 10)
//             ) {
//               return furgon;
//             }
//           });

//           return {
//             ...day,
//             disabled: numeroDiaParsed > i ? true : false,
//             fecha: ES6AFormat(fecha).slice(0, 10),
//             qtyFurgones: arrayFecha.length,
//           };
//         }
//       }),
//     ],
//     week2: [
//       ...weekSelectedInitial.week2.map((day, i) => {
//         // 1-Primero dime cual es la diferencia de dias de hoy hasta el lunes de la semana proxima
//         // 2-Si el dia es domingo entonces sera igual a 6, ese decir el septimo dia, hago esto dado que para js el domingo es primer dia pero es mas sencillo para el usuario si el lunes es el primer dia

//         let dif = 7 - numeroDiaParsed;
//         // dias a sumar sera igual a la diferencia de hoy hasta el lunes mas i que es que se ira sumando lunes, martes miercoles...
//         let diasASumar = dif + i;
//         let fechaFinal = new Date();
//         fechaFinal.setDate(fechaActual.getDate() + diasASumar);

//         //  Contar cantidad de furgones por dia
//         let arrayFecha = listaProgramacion.filter((furgon) => {
//           if (
//             furgon.fechaRecepProg?.slice(0, 10) ==
//             ES6AFormat(fechaFinal).slice(0, 10)
//           ) {
//             return furgon;
//           }
//         });

//         return {
//           ...day,
//           fecha: ES6AFormat(fechaFinal).slice(0, 10),
//           qtyFurgones: arrayFecha.length,
//         };
//       }),
//     ],
//   };

//   return weekParsed;
// };
