// ************************ PROYECTOS ************************
// estadoDoc
// 0-abierto

import { destinatariosNotificacion, personasContacto } from "./mixSchema";

// 1-cerrado
export const proySchema = {
  detalles: "",
  createdByd: "",
  createdAt: "",
  estadoDoc: 0,
  fechaCreacionCaeloss: "",
  fechaCreacionCaelossStamp: "",
  location: "",
  numeroDoc: "",
  personasContacto: [...personasContacto, personasContacto[0]],
  socioNegocio: "",
  destinatariosNotificacion: [...destinatariosNotificacion],
};
