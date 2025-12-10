import FuncionUpWayDate from "../../importaciones/components/FuncionUpWayDate";

export const PlantillaFechaETA = ({
  anteriorETA,
  nuevoETA,
  billOfLading,
  furgonMaster,
}) => {
  let tipoBL = 0;
  console.log(billOfLading);
  if (billOfLading?.tipo) {
    tipoBL = billOfLading.tipo;
  }
  const fondoTitulo = "#a3a3a3da";
  const colorTitulo = "white";

  let fechasCiclo = {
    llegadaAlPais: "",
    llegadaAlmacen: "",
    llegadaDptoImport: "",
    llegadaSap: "",
  };

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

  const TextoInicial = [
    `El Bill of Lading N° ${billOfLading.numeroDoc} estaba programado para llegar al pais el ${anteriorETA.slice(0, 10)}, sin embargo ha habido un cambio y la nueva fecha estimada es ${nuevoETA.slice(0, 10)}.
    <br/>
    <br/>
   `,

    ` A continuacion listado de sus materiales.`,
  ];

  const matAux = furgonMaster.flatMap((furgon) => {
    return furgon.materiales.map((item) => {
      return {
        ...item,
        noFurgon: furgon.numeroDoc,
      };
    });
  });

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
          ${
            tipoBL === 1
              ? `<a href="https://caeloss.com/importaciones/maestros/billoflading/${billOfLading.numeroDoc}" target="_blank">`
              : '<a href="https://caeloss.com/importaciones/maestros/contenedores/${mat.noFurgon}" target="_blank">'
          }


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
           ${TextoInicial[0] + TextoInicial[1] || "Hola"}
          </p>
          <p style="color: white; padding: 8px; font-size: 18px">
          Haz clic en el siguiente boton para ver todos los detalles.
          </p>

        
<div style="width: 100%;text-align: center;">

       <a href="https://caeloss.com/importaciones/maestros/billoflading/${billOfLading.numeroDoc}" target="_blank" 
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
   Ver BL completo
  </a>
</div>
          <div style="width: 100%; padding: 0 10px;">
            <table style="width: 95%; border-collapse: collapse; font-family: Arial, sans-serif; margin-top: 10px;">
              <thead>
                <tr style="background-color: #00557f; color: white;">
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Código*</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Descripción</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Cantidad</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Contenedor*</th>
                  <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Orden de compra*</th>
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
