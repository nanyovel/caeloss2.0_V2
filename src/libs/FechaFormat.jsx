import { format } from "date-fns";
import { es } from "date-fns/locale";

const formato = "dd/MM/yyyy hh:mm:ss:SSS aa";
const localidad = es;

export const ES6AFormat = (fechaES6) => {
  return format(fechaES6, formato, {
    locale: localidad,
  });
};

// Recibe este formato 20/11/2024
export const formatAES6 = (fechaFormat) => {
  const annio = fechaFormat.slice(6, 10);
  const mes = fechaFormat.slice(3, 5) - 1;
  const dia = fechaFormat.slice(0, 2);

  return new Date(annio, mes, dia);
};
// Recibe este formato 2025/11/04
export const inputAFormat = (fechaInput) => {
  const annio = fechaInput.slice(0, 4);
  const mes = fechaInput.slice(5, 7);
  const dia = fechaInput.slice(8, 10);
  //

  return ES6AFormat(new Date(annio, mes - 1, dia));
};
// Recibe este formato 2025/11/04
export const inputAES6 = (fechaInput) => {
  const annio = fechaInput.slice(0, 4);
  const mes = fechaInput.slice(5, 7);
  const dia = fechaInput.slice(8, 10);

  return new Date(annio, mes - 1, dia);
};

// Recibe fecha en formato ES6 y tambien en este formato 20/11/2024
export const hoyManniana = (fechaUser, hasHora) => {
  let diaHoyManniana = null;
  let isFechaES6 = true;
  let fechaParsed = fechaUser;
  const hora = fechaUser.slice(11, 16) + " " + fechaUser.slice(-2);
  if (fechaParsed instanceof Date == false) {
    isFechaES6 = false;
    fechaParsed = formatAES6(fechaParsed);
  }
  const hoy = new Date();
  const manniana = new Date(hoy); // Copia de la fecha actual
  manniana.setDate(hoy.getDate() + 1); // Agrega 1 día
  const ayer = new Date(hoy);
  ayer.setDate(hoy.getDate() - 1); // Agrega 1 día

  if (
    fechaParsed.getFullYear() === hoy.getFullYear() &&
    fechaParsed.getMonth() === hoy.getMonth() &&
    fechaParsed.getDate() === hoy.getDate()
  ) {
    diaHoyManniana = "Hoy";
  } else if (
    fechaParsed.getFullYear() === manniana.getFullYear() &&
    fechaParsed.getMonth() === manniana.getMonth() &&
    fechaParsed.getDate() === manniana.getDate()
  ) {
    diaHoyManniana = "Mañana";
  } else if (
    fechaParsed.getFullYear() === ayer.getFullYear() &&
    fechaParsed.getMonth() === ayer.getMonth() &&
    fechaParsed.getDate() === ayer.getDate()
  ) {
    diaHoyManniana = "Ayer";
  } else {
    if (isFechaES6 == false) {
      diaHoyManniana = fechaUser.slice(0, 10);
    } else {
      diaHoyManniana = ES6AFormat(fechaParsed).slice(0, 10);
    }
  }
  if (hasHora) {
    return diaHoyManniana + " a las " + hora;
  } else {
    return diaHoyManniana;
  }
};

export const fortmatAES6Nuevo = (str) => {
  // Ej: "23/08/2025 11:06:14:243 AM"
  const [fecha, hora, ampm] = str.split(" ");
  const [dia, mes, anio] = fecha.split("/").map(Number);
  const [h, m, s, ms] = hora.split(":").map(Number);

  // convertir a 24h
  let horas = h;
  if (ampm === "PM" && horas < 12) horas += 12;
  if (ampm === "AM" && horas === 12) horas = 0;

  return new Date(anio, mes - 1, dia, horas, m, s, ms);
};
