export const PlantillaOrdenCompra = ({ ordenCompra }) => {
  const materiales = ordenCompra.materiales || [];

  const estadoDoc = 0;
  const numeroDoc = ordenCompra.numeroDoc;
  const cliente = ordenCompra.proveedor;
  const fondoTitulo = "#a3a3a3da";
  const colorTitulo = "white";

  const TextoInicial = [
    `Se ha cargado la orden de compra N° ${numeroDoc}, a nombre de: <strong>${cliente}</strong>, y contiene los siguientes materiales:`,
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
        <div style="max-width: 600px; margin: auto;  background-color: #2b66ae; padding: 15px;">
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

       <a href="https://caeloss.com/importaciones/maestros/ordenescompra/${numeroDoc}" target="_blank" style="
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
    Ver orden de compra
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
