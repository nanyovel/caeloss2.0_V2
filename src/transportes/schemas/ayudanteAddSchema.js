import { choferSchema } from "./choferSchema";
import { detallePagoPlantilla } from "./mixSchema";

// Este es el Schema de ayudante adicional pero para utilizar en la base de datos de choferes
export const ayudanteAddSchema = {
  ...choferSchema,
  ayudante: null,
  isAyudante: true,
  isGenerico: false,
  nombre: "",
};
export const diccionarioStatusAyudanteInRequest = [
  "A la espera",
  "Aprobado ✅",
  "Rechazado ❌",
];
export const ayudanteAddInRequest = {
  datosAyudante: {
    ...ayudanteAddSchema,
    valueInput: "",
  },
  detallesPago: {
    ...detallePagoPlantilla,
  },
  // *****STATUS*****
  // 0-a la espera...
  // 1-aprovado
  // 2-Rechazado
  status: 0,
  createdAt: "",
  createdBy: "",
  approvedBy: "",
  costo: "",
  obs: "",
  idAyudanteAddComoElemento: "",
};
