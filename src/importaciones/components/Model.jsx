import { format } from "date-fns";
import { es } from "date-fns/locale";

export const funcionDatosEdicion = (userMaster) => {
  return {
    fechaEdicion: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
      locale: es,
    }),
    id: userMaster.id,
    userName: userMaster.userName,
  };
};
