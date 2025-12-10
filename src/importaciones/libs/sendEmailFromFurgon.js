import { FuncionEnviarCorreo } from "../../libs/FuncionEnviarCorreo";
import { PlantillaBL } from "../../libs/PlantillasCorreo/PlantillaBL";
import { fetchDocsByIn } from "../../libs/useDocByCondition";

export async function sendEmailFromFurgon(furgon, estadoCiclo, asunto) {
  const ordenesUtilizadas = furgon.materiales.map((item) => {
    return item.ordenCompra;
  });
  const notificacionesOrdenes = await fetchDocsByIn(
    "notificaciones",
    undefined,
    "numOrigenDoc",
    ordenesUtilizadas
  );
  const codigosItems = furgon.materiales.map((item) => item.codigo);
  const notificacionesArticulos = await fetchDocsByIn(
    "notificaciones",
    undefined,
    "numOrigenDoc",
    codigosItems
  );
  // Conglo
  const notificaciones = [...notificacionesOrdenes, ...notificacionesArticulos];
  const correoDestinos = notificaciones
    .flatMap((not) => not.destinatarios)
    .map((dest) => dest.correo);

  let destinosAdd = [];
  if (furgon?.valoresAux?.destinatariosAdd?.length > 0) {
    destinosAdd = [...furgon?.valoresAux?.destinatariosAdd];
  }
  console.log(destinosAdd);

  const stringDestinoAdd = destinosAdd.map((dest) => dest.correo);
  const conglo = [...stringDestinoAdd, ...correoDestinos];
  const destinos = [...new Set(conglo)];
  console.log(destinos);
  if (destinos.length > 0) {
    FuncionEnviarCorreo({
      para: destinos,
      asunto: asunto,
      mensaje: PlantillaBL({
        furgonMaster: furgon,
        // Mercancia en almacen es estado
        estadoDoc: estadoCiclo,
      }),
    });
  }
}
