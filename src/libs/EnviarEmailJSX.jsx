// Comentado el 4/8/25
// // ********* CODIGO 4 *********
// import React, { useState, useEffect } from "react";
// import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
// import { app } from "../firebase/firebaseConfig";
// import { BtnGeneralButton } from "../components/BtnGeneralButton";
// import styled from "styled-components";
// import { ClearTheme } from "../config/theme";

// import { generateSolicitudEmail } from "./PlantillaCorreo";

// const EnviarEmailJSX = () => {
//   const [contextInfo, setContextInfo] = useState(null);
//   const [user, setUser] = useState(null);
//   const auth = getAuth();
//   const [isJJose, setIsJose] = useState(false);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//     });

//     if (auth.currentUser?.email === "jperez@cielosacusticos.com") {
//       //Usa optional chaining
//       setIsJose(true);
//     } else {
//       setIsJose(false);
//     }
//     return () => unsubscribe();
//   }, [auth]);

//   const handleDebugContext = async () => {
//     if (user) {
//       try {
//         const token = await user.getIdToken(); // Obtener el token
//         const functionURL = `https://us-central1-${app.options.projectId}.cloudfunctions.net/debugContext`;
//         const response = await fetch(functionURL, {
//           method: "GET", // Usamos GET para debugContext
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Incluir el token
//           },
//         });

//         if (!response.ok) {
//           const errorText = await response.text(); // Obtener el texto del error
//           throw new Error(
//             `Failed to fetch debugContext: ${response.status} - ${errorText}`
//           );
//         }

//         const data = await response.json();
//         console.log("Context Auth Object:", data);
//         setContextInfo(JSON.stringify(data, null, 2));
//       } catch (error) {
//         console.error("Error al llamar a debugContext:", error);
//         setContextInfo(`Error: ${error.message}`);
//       }
//     } else {
//       console.log("Usuario no autenticado.");
//       setContextInfo("Usuario no autenticado.");
//     }
//   };
//   const handleEnviar1 = async () => {
//     if (user) {
//       try {
//         const token = await user.getIdToken();
//         const functionURL = `https://us-central1-${app.options.projectId}.cloudfunctions.net/sendEmailCaeloss`;
//         const response = await fetch(functionURL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Incluye el token en la solicitud
//           },
//           body: JSON.stringify({
//             // to: "jperezjimenez06@gmail.com",
//             to: "jperez@cielosacusticos.com",
//             subject: "Pruebayoyooyoyoyyoyoyo",
//             html: "<h1>Holaaaaaaa</h1>",
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error("Error al llamar a la función:", errorData);
//           throw new Error(
//             `Error al llamar a la función: ${response.status} - ${errorData.error || "Internal Server Error"}`
//           );
//         }

//         const data = await response.json();
//         console.log(data);
//         console.log(data.message);
//       } catch (error) {
//         console.error("Error al llamar a la función:", error);
//       }
//     } else {
//       console.log("Usuario no autenticado, no se puede enviar el correo.");
//     }
//   };

//   const handleEnviar2 = async () => {
//     const materiales = [
//       { codigo: "03119", descripcion: "Plancha de yeso light rey", qty: 180 },
//       { codigo: "04022", descripcion: "Masilla tapa negra", qty: 200 },
//       { codigo: "04028", descripcion: "Masilla tapa keraflor,", qty: 15 },
//     ];

//     const texoEnviar = generateSolicitudEmail({
//       numeroSolicitud: 10027,
//       materiales: materiales,
//       tipo: 1,
//     });
//     if (user) {
//       try {
//         const token = await user.getIdToken();
//         const functionURL = `https://us-central1-${app.options.projectId}.cloudfunctions.net/sendEmailTrue`;
//         const response = await fetch(functionURL, {
//           method: "POST",
//           headers: {
//             "Content-Type": "application/json",
//             Authorization: `Bearer ${token}`, // Incluye el token en la solicitud
//           },
//           body: JSON.stringify({
//             to: "jperezjimenez06@gmail.com",
//             // to: "jperez@cielosacusticos.com",
//             subject: "Pruebabana",
//             // html: "<h1>Santo Domingo es la capital de nuestro pais.</h1>",
//             html: texoEnviar,
//           }),
//         });

//         if (!response.ok) {
//           const errorData = await response.json();
//           console.error("Error al llamar a la función:", errorData);
//           throw new Error(
//             `Error al llamar a la función: ${response.status} - ${errorData.error || "Internal Server Error"}`
//           );
//         }

//         const data = await response.json();
//         console.log(data);
//         console.log(data.message);
//       } catch (error) {
//         console.error("Error al llamar a la función:", error);
//       }
//     } else {
//       console.log("Usuario no autenticado, no se puede enviar el correo.");
//     }
//   };

//   return (
//     isJJose && (
//       <CajaBtnEnviarCorreo>
//         <BtnGeneralButton onClick={handleDebugContext} disabled={!user}>
//           Uppercase
//         </BtnGeneralButton>
//         {contextInfo && (
//           <pre>
//             <code>{contextInfo}</code>
//           </pre>
//         )}
//         <BtnGeneralButton onClick={handleEnviar1} disabled={!user}>
//           Enviar 1
//         </BtnGeneralButton>
//         <BtnGeneralButton onClick={handleEnviar2} disabled={!user}>
//           Enviar 2
//         </BtnGeneralButton>
//       </CajaBtnEnviarCorreo>
//     )
//   );
// };

// export default EnviarEmailJSX;

// const CajaBtnEnviarCorreo = styled.div`
//   width: 100%;
//   height: 100px;
//   background-color: ${ClearTheme.secondary.azulSuave};
//   display: flex;
//   justify-content: center;
//   align-items: center;
// `;
