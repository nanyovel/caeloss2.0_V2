import {
  datosEntregaReq,
  detallePagoPlantilla,
  detallesPagoVehiculo,
} from "./mixSchema";
import { vehiculosSchema } from "./vehiculosSchema";

export const datosEntregaSchemaVehAdd = {
  ...datosEntregaReq,
  status: 0,
  fecha: {
    fechaEjecucion: "",
    fechaConclucion: "",
    fechaEjecucionCorta: "",
  },
};

// Este es el vehiculo adicional completo, y dentro tiene un objeto llamado datos de entrega
// export const nuevoVehiculoSchema = {
export const vehiculoAdicionalSchema = {
  ...vehiculosSchema[0],
  datosEntrega: {
    ...datosEntregaSchemaVehAdd,
    status: 0,
  },
  detallesPago: {
    ...detallesPagoVehiculo,
  },
};
