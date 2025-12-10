import FuncionUpWayDate from "../../importaciones/components/FuncionUpWayDate";

export const PlantillaBL = ({
  billOfLading,
  furgones,
  estadoDoc,
  furgonMaster,
}) => {
  let numeroDoc = "";
  let proveedor = "";
  if (estadoDoc <= 2) {
    numeroDoc = billOfLading.numeroDoc;
    proveedor = billOfLading.proveedor;
  } else if (estadoDoc > 2) {
    numeroDoc = furgonMaster.numeroDoc;
    proveedor = furgonMaster.datosBL.proveedor;
  }

  const fondoTitulo = "#a3a3a3da";
  const colorTitulo = "white";

  let fechasCiclo = {
    llegadaAlPais: "",
    llegadaAlmacen: "",
    llegadaDptoImport: "",
    llegadaSap: "",
  };

  // Si se trata de creacion de BL o que el BL llego al pais
  if (estadoDoc <= 2) {
    const fechaLlegada = billOfLading?.llegada02AlPais.fecha.slice(0, 10);

    const annio = fechaLlegada?.slice(6, 10);
    const mes = fechaLlegada?.slice(3, 5);
    const dia = fechaLlegada?.slice(0, 2);
    const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
      FuncionUpWayDate(annio, mes, dia, 2);
    fechasCiclo.llegadaAlPais = llegadaAlPais;
    fechasCiclo.llegadaAlmacen = llegadaAlmacen;
    fechasCiclo.llegadaDptoImport = llegadaDptoImport;
    fechasCiclo.llegadaSap = llegadaSap;
  }
  // Si se trata de que el furgon llego a nuestros almacenes
  else if (estadoDoc >= 3) {
    const annio = furgonMaster.fechas.llegada03Almacen?.fecha.slice(6, 10);
    const mes = furgonMaster.fechas.llegada03Almacen?.fecha.slice(3, 5);
    const dia = furgonMaster.fechas.llegada03Almacen?.fecha.slice(0, 2);
    const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
      FuncionUpWayDate(annio, mes, dia, 3);
    fechasCiclo.llegadaAlPais = llegadaAlPais;
    fechasCiclo.llegadaAlmacen = llegadaAlmacen;
    fechasCiclo.llegadaDptoImport = llegadaDptoImport;
    fechasCiclo.llegadaSap = llegadaSap;

    //
  }

  const TextoInicial2 = [
    // 0-Este estado nunca sera
    "mercancia en proveedor",
    // 1-Transito maritimo -- BL
    "Mercancía enviada hacia la República Dominicana",
    // 2-En puerto -- BL
    "Tus productos han llegado al país.",
    // 3-En almacen -- Furgon
    "Tu mercancía está en almacén para descarga del contenedor.",
    // 4-En dpto import -- BL
    "Almacén ya descargó tu mercancía y envió la documentación al departamento de importaciones.",
    // 5-En SAP
    "Tu mercancia ya esta lista en SAP.",
  ];

  let matAux = [];
  let tipoBL = 0;
  if (billOfLading?.tipo == 1) {
    tipoBL = 1;
  }

  if (tipoBL === 1) {
    matAux = billOfLading.fleteSuelto.materiales;
  } else if (tipoBL === 0) {
    matAux =
      estadoDoc <= 2
        ? furgones.flatMap((furgon) => {
            return furgon.materiales.map((item) => {
              return {
                ...item,
                noFurgon: furgon.numeroDoc,
              };
            });
          })
        : furgonMaster.materiales.map((item) => {
            return {
              ...item,
              noFurgon: furgonMaster.numeroDoc,
            };
          });
  }
  const filas = matAux
    .map(
      (mat, index) => `
        <tr style="background-color: ${index % 2 === 0 ? "#e1eef4" : "#ffffff"}; font-weight: ${index % 2 === 0 ? "bold" : "normal"}; color: #00496b;">
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
          <a href="https://caeloss.com/importaciones/maestros/articulos/${mat.codigo}" target="_blank">
          ${mat.codigo}</a></td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.descripcion}</td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.qty}</td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
           <a href="https://caeloss.com/importaciones/maestros/contenedores/${mat.noFurgon}" target="_blank">
          ${mat.noFurgon}
          </a>
          </td>
          <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
     <a href="https://caeloss.com/importaciones/maestros/ordenescompra/${mat.ordenCompra}" target="_blank">     ${mat.ordenCompra}</a>
          </td>
        </tr>
      `
    )
    .join("");
  return `
    <html  lang="es">
      <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto;  background-color: #2b66ae; padding: 15px;">
          <h1 style="text-align: center; color: ${colorTitulo}; background-color: ${fondoTitulo}; height: auto; ; margin: 0; text-decoration: underline;">
            Notificaciones Caeloss
          </h1>
          <p style="color: white; padding: 8px; font-size: 18px">
           ${TextoInicial2[estadoDoc] || "Hola"}
           <br/>
           <span style="font-weight: bold;">Proveedor:
           </span>
           ${proveedor}
           <br/>
      
     
          ${estadoDoc != 5 ? "Estarán disponibles en SAP el " : ""}
          ${estadoDoc != 5 ? fechasCiclo.llegadaSap.slice(0, 10) : ""}
          </p>

          <p style="color: white; padding: 8px; font-size: 18px">
           A continuacion lista de materiales.
          </p>


        
<div style="width: 100%;text-align: center;">

       <a href="https://caeloss.com/importaciones/maestros/${estadoDoc <= 2 ? "billoflading" : "contenedores"}/${numeroDoc}" target="_blank" 
       style="
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
  ${estadoDoc <= 2 ? "Ver BL completo" : "Ver contenedor "}
  </a>
</div>
          <div style="width: 100%; padding: 0 10px;">
            <table style="width: 95%; border-collapse: collapse; font-family: Arial, sans-serif; margin-top: 10px;">
              <thead>
                <tr style="background-color: #00557f; color: white;">
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Código</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Descripción</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Cantidad</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Contenedor</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Orden de compra</th>
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
