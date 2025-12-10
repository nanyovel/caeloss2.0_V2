import { ImrRasonWareBase64 } from "../../components/LogoCielosBas64";
import { ClearTheme } from "../../config/theme";

export const PlantillaCorreoAbierta = () => {
  const estadoDoc = 0;
  const fondoTitulo = ClearTheme.complementary.success;
  const colorTitulo = "white";
  const colorTexto = "white";

  const ImgRasonWare = "";

  const cuerpoMensaje = [
    `
Realizamos actualizaciones a nuestro TMS que podrían ocasionar que por el momento en la lista de solicitudes activas no se visualicen todas.
 
Sin embargo, siempre podrán acceder a cualquier solicitud de varias maneras. La forma más fácil es conociendo algún dato de la misma, ya sea: su número, nombre del cliente, número de factura, etc., o incluso generando un reporte.
      `,
  ];

  const fontSize = "16px";
  return `
    <html  lang="es">

      <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
        <div style="max-width: 600px; margin: auto;  background-color: #2b66ae; padding: 15px;">
          <h1 style="text-align: center; font-weight: 400; color: ${colorTitulo}; background-color: ${fondoTitulo}; height: auto; ; margin: 0; text-decoration: underline;">
           Actualizacion TMS
          </h1>

       <p 
       style="color: ${colorTitulo}; font-size: ${fontSize}"
       >Estimados usuarios,</p>

       <p 
       style="color: ${colorTitulo}; font-size: ${fontSize}"
       >${cuerpoMensaje[0]}</p>

       <p>
       </p>
    
    <p>
    </p>
  
    <p style="color: ${colorTitulo}; font-size: ${fontSize}">
Gracias,
<br/>

    </p>


        </div>
      </body>
    </html>
    `;
};
const colorTitulo = "white";
const listaUL = `

       <p 
       style="color: ${colorTitulo}; font-size: 18px"
       >
       <b><u> Potenciales riesgo de la practica: </u> </b>
       </p>

          <p 
       style="color: ${colorTitulo}; font-size: 18px"
       
       <ul >
       <li style="color: ${colorTitulo}; font-size: 16px">Mayor efectividad de ataques de “credential stuffing”</li>
       <li style="color: ${colorTitulo}; font-size: 16px">Aumento del riesgo en caso de phishing</li>
       <li style="color: ${colorTitulo}; font-size: 16px">Dificultad para detectar el origen del acceso no autorizado</li>
       <li style="color: ${colorTitulo}; font-size: 16px">Riesgo legal y de cumplimiento con la politica de la empresa</li>
       <li style="color: ${colorTitulo}; font-size: 16px">Compromiso de la cuenta de correo y Caeloss</li>
       </ul></p>`;

const ImgRasonWareHTML = `
  <img style="width: 100%;" src="${ImrRasonWareBase64}" />
`;
