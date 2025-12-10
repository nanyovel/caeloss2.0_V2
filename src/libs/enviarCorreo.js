// import { getFunctions, httpsCallable } from "firebase/functions";
// import { getAuth } from "firebase/auth";
// import { app } from "../firebase/firebaseConfig";

// const functions = getFunctions(app);
// const sendEmail = httpsCallable(functions, "sendEmail");
// const debugContext = httpsCallable(functions, "debugContext");

// export const enviarCorreo = async (recipientEmail, emailSubject, emailBody) => {
//   try {
//     const auth = getAuth();
//     const user = auth.currentUser;

//     if (user) {
//       console.log(user);
//       // const token = await getIdToken(user); // Obtener el token de ID
//       const result = await sendEmail({
//         to: recipientEmail,
//         subject: emailSubject,
//         html: emailBody,
//         // Puedes intentar enviar el token explícitamente (solo para diagnóstico)
//         // authToken: token,
//       });
//       console.log(result.data.message);
//     } else {
//       console.error("Usuario no autenticado. No se puede enviar el correo.");
//     }
//   } catch (error) {
//     console.error("Error al llamar a la función:", error);
//   }
// };

// const auth = getAuth();
// const user = auth.currentUser;
// export const handleDebugContext = async () => {
//   let retornable = null;
//   if (user) {
//     try {
//       const result = await debugContext();
//       console.log("Context Auth Object:", result.data.auth);
//       retornable = JSON.stringify(result.data.auth, null, 2); // Muestra el objeto en el componente
//     } catch (error) {
//       console.error("Error al llamar a debugContext:", error);
//       retornable = `Error: ${error.message}`;
//     }
//   } else {
//     console.log(auth);
//     console.log("Usuario no autenticado.");
//     retornable = "Usuario no autenticado.";
//   }
// };
