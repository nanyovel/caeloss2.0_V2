import { hoyManniana } from "../../libs/FechaFormat";
import { StyleTextStateReq } from "./DiccionarioNumberString";

export const PlantillaCorreoReqState = (request, choferActual) => {
  console.log(request);

  const materiales = request.datosReq?.materialesDev || [];
  const estadoDoc = request.estadoDoc;
  const numeroDoc = request.numeroDoc;
  const cliente = request.datosReq.socioNegocio;

  const numeroChofer =
    choferActual?.tipo == 0 ? choferActual?.flota : choferActual?.celular;
  // const telefonoLimpio2 = numeroChofer?.replace(/[\s\-_()]/g, "");
  const telefonoLimpio = numeroChofer?.replace(/[\s_\-+()]/g, "");

  const colorFontoTituloDefault = "#19b4ef";
  const colorLetrasTituloDefault = "#white";
  const estadoDfault = "";

  let fondoTitulo = colorFontoTituloDefault;
  let colorTitulo = colorLetrasTituloDefault;
  let textoStatus = estadoDfault;
  fondoTitulo = StyleTextStateReq.find(
    (state) => state.numero == estadoDoc
  ).coloFondo;
  colorTitulo = StyleTextStateReq.find(
    (state) => state.numero == estadoDoc
  ).colorTitulo;
  textoStatus = StyleTextStateReq.find(
    (state) => state.numero == estadoDoc
  ).texto;

  const TextoInicial = [
    `Se ha creado la solicitud N° ${numeroDoc}, a nombre de: <strong>${cliente}</strong>. Esta se encuentra en estado a la espera, y contiene los siguientes materiales:`,

    `La solicitud N° ${numeroDoc}, a nombre de: <strong>${cliente}</strong> ha sido planificada para entregarse ${hoyManniana(request.current.fechaDespProg.slice(0, 10))}, y con los siguientes materiales:`,

    `La solicitud N° ${numeroDoc}, del ${request.tipo == 3 ? "proveedor" : "cliente"} <strong>${cliente}</strong> empezo a ejecutarse, con el chofer 
    ${choferActual?.nombre + " " + choferActual?.apellido} (Cel:${numeroChofer})



    y llevará los siguientes materiales:
<p style="margin-top: 20px; font-weight: bold; color: white;">
  A continuación contacto de chofer:
</p>
<div style="display: flex; gap: 20px; margin-bottom: 20px;">
  <a href="https://wa.me/1${telefonoLimpio}" target="_blank" style="text-decoration: none;">
    <h2 style="margin: 0; color: white; background-color: #25D366; padding: 10px 15px; border-radius: 5px;">
      WhatsApp
    </h2>
  </a>
  <a href="tel:${telefonoLimpio}" style="text-decoration: none;">
    <h2 style="margin: 0; color: white; background-color: #007BFF; padding: 10px 15px; border-radius: 5px;">
      Llamar
    </h2>
  </a>
</div>

    `,

    `La solicitud N° ${numeroDoc}, a nombre de: <strong>${cliente}</strong> ha sido concluida, por el chofer     ${choferActual?.nombre + " " + choferActual?.apellido} (Cel:${numeroChofer}), con los siguientes materiales:`,
    `La solicitud N° ${numeroDoc}, a nombre de: <strong>${cliente}</strong> ha sido cancelada, esta llevaría los siguientes materiales:`,
  ];

  const filas = materiales
    .map(
      (mat, index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#e1eef4" : "#ffffff"}; font-weight: ${index % 2 === 0 ? "bold" : "normal"}; color: #00496b;">
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.codigo}</td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.descripcion}</td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.qty}</td>
        </tr>
      `
    )
    .join("");

  return `
    <html  lang="es">
      <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto;  background-color: #193d69ff; padding: 15px;">
          <h1 style="text-align: center; color: ${colorTitulo}; background-color: ${fondoTitulo}; height: auto; ; margin: 0; text-decoration: underline;">
            Notificaciones Caeloss
          </h1>
          <p style="color: white; padding: 8px; font-size: 18px">
           ${TextoInicial[estadoDoc] || "Hola"}
          </p>
          <p style="color: white; padding: 8px; font-size: 18px">
          Haz clic en el siguiente boton para verla completa.
          </p>

              <a target="_blank">
          
          </a>
<div style="width: 100%;text-align: center;">

       <a href="https://caeloss.com/transportes/maestros/solicitudes/${numeroDoc}" target="_blank" style="
    display: inline-block;
    padding: 12px 20px;
    font-size: 16px;
    color: white;
    background-color: #19b4ef;
    text-decoration: none;
    border-radius: 5px;
    font-family: Arial, sans-serif;
    text-align: center;
    margin: auto
  ">
    Ver solicitud
  </a>
</div>
          <div style="width: 100%; padding: 0 10px;">
            <table style="width: 95%; border-collapse: collapse; font-family: Arial, sans-serif; margin-top: 10px;">
              <thead>
                <tr style="background-color: #00557f; color: white;">
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Código</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Descripción</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Cantidad</th>
                </tr>
              </thead>
              <tbody>
                ${filas}
              </tbody>
            </table>
          </div>
        </div>
      </body>
    </html>
    `;
};
