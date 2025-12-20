//  ****** CODIGO 7 **********
// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");
const { defineInt, defineString } = require("firebase-functions/params");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

// const transporter = nodemailer.createTransport({
//   service: "Gmail",
//   auth: {
//     user: "caelossplatform@gmail.com", // Lee la configuración de Firebase
//     pass: "zhimwenxrrrpcesx", // Lee la configuración de Firebase
//   },
// });
// const cors = require("cors")({ origin: true });
// Configura CORS permitiendo todos los orígenes temporalmente para depuración
// exports.sendEmail = onRequest(async (req, res) => {
//   cors(req, res, async () => {
//     try {
//       // Verifica el método de la solicitud
//       if (req.method !== "POST") {
//         return res.status(405).send("Method Not Allowed"); // Responde a métodos no permitidos
//       }

//       const { to, subject, html } = req.body;
//       if (!to || !subject || !html) {
//         return res.status(400).json({
//           error: "Debes proporcionar destinatario, asunto y cuerpo del correo.",
//         });
//       }

//       const mailOptions = {
//         from: `Caeloss <caelossplatform@gmail.com>`,
//         to: to,
//         subject: subject,
//         html: html,
//       };

//       transporter.sendMail(mailOptions, (error, info) => {
//         if (error) {
//           console.log("Error al enviar el correo:", error);
//         } else {
//           console.log("Correo enviado:", info);
//         }
//       });
//     } catch (error) {
//       console.error("Error al enviar correo:", error);
//       return res
//         .status(500)
//         .json({ error: "Error interno del servidor: " + error.message }); // Incluye el mensaje de error
//     }
//   });
// });
// Configura CORS permitiendo todos los orígenes temporalmente para depuración

const cuentaCorreo = process.env.CORREOEMISOR;
const claveCorreo = process.env.CLAVECORREO;
const host = process.env.HOSTOFICIAL;
const transporter2 = nodemailer.createTransport({
  host: host,
  port: 465,
  secure: true,
  auth: {
    user: cuentaCorreo,
    pass: claveCorreo,
  },
});
exports.sendEmailCaeloss = onRequest({ cors: "caeloss.com" }, (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({
        error: "Debes proporcionar destinatario, asunto y cuerpo del correo.",
      });
    }

    const mailOptions = {
      from: `Caeloss <admin@caeloss.com>`,
      to: to,
      subject: subject,
      html: html,
    };

    transporter2.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
      } else {
        console.log("Correo enviado:", info);
      }
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
});

exports.sendEmailTrue = onRequest({ cors: true }, (req, res) => {
  try {
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed");
    }

    const { to, subject, html } = req.body;
    if (!to || !subject || !html) {
      return res.status(400).json({
        error: "Debes proporcionar destinatario, asunto y cuerpo del correo.",
      });
    }

    const mailOptions = {
      from: `Caeloss <admin@caeloss.com>`,
      to: to,
      subject: subject,
      html: html,
    };

    transporter2.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error al enviar el correo:", error);
      } else {
        console.log("Correo enviado:", info);
      }
    });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message });
  }
});
