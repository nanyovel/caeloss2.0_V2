// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics, logEvent } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getFunctions } from "firebase/functions";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_APIKEY,
  authDomain: import.meta.env.VITE_AUTHDOMAIN,
  projectId: import.meta.env.VITE_PROJECTID,
  storageBucket: import.meta.env.VITE_STORAGEBUCKET,
  messagingSenderId: import.meta.env.VITE_MESSAGINGSENDERID,
  appId: import.meta.env.VITE_APPID,
  measurementId: import.meta.env.VITE_MEASUREMENTID,
};

export const app = initializeApp(firebaseConfig);
export const autenticar = getAuth(app);
const analytics = getAnalytics(app);
logEvent(analytics, "notification_received");
const db = getFirestore(app);
export const storage = getStorage(app);
export default db;
export const functions = getFunctions(app);

// // codigo 1
// const functions = require("firebase-functions");
// const cors = require("cors");
// const nodemailer = require("nodemailer");

// const corsHandler = cors({ origin: true });
// // 🔐 Cargar claves SMTP desde entorno seguro
// const correo = functions.config().correo;

// // ✉️ Configurar transporte SMTP
// const transporter = nodemailer.createTransport({
//   host: "mail.caeloss.com", // Cambia esto según tu proveedor (ej: mail.banahosting.com)
//   port: 465,
//   secure: true, // true para puerto 465, false para 587
//   auth: {
//     user: correo.smtp_user,
//     pass: correo.smtp_pass,
//   },
// });

// // 🚀 Función para enviar correo
// exports.enviarCorreoSMTP = functions.https.onCall(async (data, context) => {
//   const { para, asunto, mensaje } = data;

//   const mailOptions = {
//     from: `"Notificaciones Caeloss" <${correo.smtp_user}>`,
//     to: para,
//     subject: asunto,
//     html: `<div style="font-family:sans-serif">
//              <h2>${asunto}</h2>
//              <p>${mensaje}</p>
//            </div>`,
//   };

//   try {
//     await transporter.sendMail(mailOptions);
//     return { success: true, message: "Correo enviado con éxito" };
//   } catch (error) {
//     console.error("Error al enviar correo:", error);
//     return { success: false, message: error.message };
//   }
// });

// // codigo 2
// const functions = require("firebase-functions");
// const cors = require("cors");
// const nodemailer = require("nodemailer");

// // const corsHandler = cors({ origin: true });

// exports.enviarCorreoSMTP = functions.https.onRequest((req, res) => {
//   corsHandler(req, res, async () => {
//     const { para, asunto, mensaje } = req.body;

//     const transporter = nodemailer.createTransport({
//       service: "gmail", // o tu servicio de correo
//       auth: {
//         user: correo.smtp_user,
//         pass: correo.smtp_pass,
//       },
//     });

//     // const mailOptions = {
//     //   from: "TUCORREO@gmail.com",
//     //   to: para,
//     //   subject: asunto,
//     //   text: mensaje,
//     // };

//     const mailOptions = {
//         from: `"Notificaciones Caeloss" <${correo.smtp_user}>`,
//         to: para,
//         subject: asunto,
//         html: `<div style="font-family:sans-serif">
//                  <h2>${asunto}</h2>
//                  <p>${mensaje}</p>
//                </div>`,
//       };

//     try {
//       const info = await transporter.sendMail(mailOptions);
//       res.status(200).send({ message: "Correo enviado", info });
//     } catch (error) {
//       console.error("Error al enviar correo:", error);
//       res.status(500).send({ error: "Error al enviar el correo" });
//     }
//   });
// });

// // codigo 3

// const functions = require("firebase-functions");
// const nodemailer = require("nodemailer");
// const admin = require("firebase-admin");
// const cors = require("cors")({ origin: true }); // 👈 Manejo CORS

// admin.initializeApp();

// const obtenerCredencialesCorreo = async () => {
//   const doc = await admin.firestore().collection("config").doc("correo").get();
//   return doc.data();
// };

// exports.enviarCorreoSMTP = functions.https.onRequest((req, res) => {
//   cors(req, res, async () => {
//     if (req.method !== "POST") {
//       return res.status(405).send("Método no permitido");
//     }

//     const { para, asunto, mensaje } = req.body;

//     if (!para || !asunto || !mensaje) {
//       return res.status(400).send("Faltan datos obligatorios");
//     }

//     try {
//       const correo = await obtenerCredencialesCorreo();

//       const transporter = nodemailer.createTransport({
//         host: "mail.caeloss.com", // SMTP de BanaHosting
//         port: 465,
//         secure: true,
//         auth: {
//           user: correo.smtp_user,
//           pass: correo.smtp_pass,
//         },
//       });

//       const mailOptions = {
//         from: `"Notificaciones Caeloss" <${correo.smtp_user}>`,
//         to: para,
//         subject: asunto,
//         html: `
//           <div style="font-family:sans-serif; padding:20px;">
//             <h2 style="color:#2c3e50;">${asunto}</h2>
//             <p>${mensaje}</p>
//           </div>
//         `,
//       };

//       await transporter.sendMail(mailOptions);
//       return res.status(200).send("Correo enviado exitosamente");

//     } catch (error) {
//       console.error("Error al enviar el correo:", error);
//       return res.status(500).send("Error interno al enviar el correo");
//     }
//   });
// });
