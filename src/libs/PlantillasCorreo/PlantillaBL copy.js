// 14/10/25
// import FuncionUpWayDate from "../../importaciones/components/FuncionUpWayDate";
// import { hoyManniana } from "../FechaFormat";

// export const PlantillaBL = ({
//   billOfLading,
//   furgones,
//   estadoDoc,
//   furgonMaster,
// }) => {
//   const numeroDoc =
//     estadoDoc <= 2 ? billOfLading?.numeroDoc : furgonMaster.numeroDoc;
//   const fondoTitulo = "#a3a3a3da";
//   const colorTitulo = "white";

//   let fechasCiclo = {
//     llegadaAlPais: "",
//     llegadaAlmacen: "",
//     llegadaDptoImport: "",
//     llegadaSap: "",
//   };

//   // Si se trata de creacion de BL o que el BL llego al pais
//   if (estadoDoc <= 2) {
//     const fechaLlegada = billOfLading?.llegada02AlPais.fecha.slice(0, 10);

//     const annio = fechaLlegada?.slice(6, 10);
//     const mes = fechaLlegada?.slice(3, 5);
//     const dia = fechaLlegada?.slice(0, 2);
//     const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
//       FuncionUpWayDate(annio, mes, dia, 2);
//     fechasCiclo.llegadaAlPais = llegadaAlPais;
//     fechasCiclo.llegadaAlmacen = llegadaAlmacen;
//     fechasCiclo.llegadaDptoImport = llegadaDptoImport;
//     fechasCiclo.llegadaSap = llegadaSap;
//   }
//   // Si se trata de que el furgon llego a nuestros almacenes
//   else if (estadoDoc == 3) {
//     const annio = furgonMaster.fechas.llegada03Almacen?.fecha.slice(6, 10);
//     const mes = furgonMaster.fechas.llegada03Almacen?.fecha.slice(3, 5);
//     const dia = furgonMaster.fechas.llegada03Almacen?.fecha.slice(0, 2);
//     const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
//       FuncionUpWayDate(annio, mes, dia, 3);
//     fechasCiclo.llegadaAlPais = llegadaAlPais;
//     fechasCiclo.llegadaAlmacen = llegadaAlmacen;
//     fechasCiclo.llegadaDptoImport = llegadaDptoImport;
//     fechasCiclo.llegadaSap = llegadaSap;

//     //
//   }

//   const TextoInicial = [
//     // 0-Este estado nunca sera
//     "mercancia en proveedor",
//     // 1-Transito maritimo -- BL
//     `
//         Se notifica que los contenedores del Bill of Lading N° <strong>${numeroDoc}</strong>, han sido embarcados y enviados hacia Rep. Dom. Llegan al pais el ${fechasCiclo.llegadaAlPais.slice(0, 10)} aprox. por tanto sus materiales estarían disponible para la venta en SAP el ${fechasCiclo.llegadaSap.slice(0, 10)}.
//     <br/>
//     <br/>
//     A continuacion lista de contenedores, desglosados por sus materiales y ordenes de compra.
//     `,
//     // 2-En puerto - BL
//     `Los contenedores del Bill of Lading N° <strong>${numeroDoc}</strong>,
//     ${
//       hoyManniana(fechasCiclo.llegadaAlPais) == "Ayer"
//         ? "llegaron al pais ayer"
//         : hoyManniana(fechasCiclo.llegadaAlPais) == "Hoy"
//           ? "llegaron al pais hoy"
//           : "llegaron al pais el " + hoyManniana(fechasCiclo.llegadaAlPais)
//     }, a continuacion listado con sus materiales y ordenes de compras. Estos productos estaran disponible para la venta en nuestros almacenes de 1 a 4 dias aprox. luego de la fecha de llegada.
//     `,
//     // 3-En almacen -- FURGON
//     `El contendor N° <strong>${furgonMaster?.numeroDoc}</strong>, ha llegado a nuestro almacen en ${furgonMaster?.destino}, y se tiene previsto que contiene los siguientes materiales:
//     `,
//     // 4-La documentacion fue enviada
//     `La descarga del contenedor N° <strong>${furgonMaster?.numeroDoc}</strong> ha sido concluida, al igual que el proceso de conteo y documentacion, la informacion ya fue enviada al despartamento de compras e importaciones para su registro en nuestro sistema SAP.
//     `,
//     // 5-Concluido en SAP
//     `
//     Los materiales del contenedor N°<strong>${furgonMaster?.numeroDoc}</strong> ya estan disponible para la venta en SAP.
//     `,
//   ];

//   let matAux = [];
//   let tipoBL = 0;
//   if (billOfLading?.tipo == 1) {
//     tipoBL = 1;
//   }

//   if (tipoBL === 0) {
//     matAux = billOfLading.fleteSuelto.materiales;
//   } else if (tipoBL === 1) {
//     matAux =
//       estadoDoc <= 2
//         ? furgones.flatMap((furgon) => {
//             return furgon.materiales.map((item) => {
//               return {
//                 ...item,
//                 noFurgon: furgon.numeroDoc,
//               };
//             });
//           })
//         : furgonMaster.materiales.map((item) => {
//             return {
//               ...item,
//               noFurgon: furgonMaster.numeroDoc,
//             };
//           });
//   }
//   const filas = matAux
//     .map(
//       (mat, index) => `
//         <tr style="background-color: ${index % 2 === 0 ? "#e1eef4" : "#ffffff"}; font-weight: ${index % 2 === 0 ? "bold" : "normal"}; color: #00496b;">
//           <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
//           <a href="https://caeloss.com/importaciones/maestros/articulos/${mat.codigo}" target="_blank">
//           ${mat.codigo}</a></td>
//           <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.descripcion}</td>
//           <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">${mat.qty}</td>
//           <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
//            <a href="https://caeloss.com/importaciones/maestros/contenedores/${mat.noFurgon}" target="_blank">
//           ${mat.noFurgon}
//           </a>
//           </td>
//           <td style="font-size: 15px; font-weight: 400; height: 25px; text-align: center; border: 1px solid #ccc;">
//      <a href="https://caeloss.com/importaciones/maestros/ordenescompra/${mat.ordenCompra}" target="_blank">     ${mat.ordenCompra}</a>
//           </td>
//         </tr>
//       `
//     )
//     .join("");
//   return `
//     <html  lang="es">
//       <body style="margin: 0; padding: 0; background-color: #f9f9f9; font-family: Arial, sans-serif;">
//         <div style="max-width: 600px; margin: auto;  background-color: #2b66ae; padding: 15px;">
//           <h1 style="text-align: center; color: ${colorTitulo}; background-color: ${fondoTitulo}; height: auto; ; margin: 0; text-decoration: underline;">
//             Notificaciones Caeloss
//           </h1>
//           <p style="color: white; padding: 8px; font-size: 18px">
//            ${TextoInicial[estadoDoc] || "Hola"}
//           </p>
//           <p style="color: white; padding: 8px; font-size: 18px">
//           Haz clic en el siguiente boton para ver todos los detalles.
//           </p>

// <div style="width: 100%;text-align: center;">

//        <a href="https://caeloss.com/importaciones/maestros/${estadoDoc <= 2 ? "billoflading" : "contenedores"}/${numeroDoc}" target="_blank"
//        style="
//     display: inline-block;
//     padding: 12px 20px;
//     font-size: 16px;
//     color: white;
//     background-color: #19b4ef;
//     text-decoration: none;
//     border-radius: 5px;
//     font-family: Arial, sans-serif;
//     text-align: center;
//     margin: auto
//   ">
//   ${estadoDoc <= 2 ? "Ver BL completo" : "Ver contenedor "}
//   </a>
// </div>
//           <div style="width: 100%; padding: 0 10px;">
//             <table style="width: 95%; border-collapse: collapse; font-family: Arial, sans-serif; margin-top: 10px;">
//               <thead>
//                 <tr style="background-color: #00557f; color: white;">
//                   <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Código</th>
//                   <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Descripción</th>
//                   <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Cantidad</th>
//                   <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Contenedor</th>
//                   <th style="text-align: center; padding: 4px; font-weight: bold; font-size: 14px; background: linear-gradient(to bottom, #006699 5%, #00557f 100%); border: 1px solid #0070a8;">Orden de compra</th>
//                 </tr>
//               </thead>
//               <tbody>
//                 ${filas}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       </body>
//     </html>
//     `;
// };
