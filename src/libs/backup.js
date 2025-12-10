//  ****** CODIGO 7 **********
// BACKEND
// BACKEND
// BACKEND
// BACKEND
// BACKEND
// BACKEND
// BACKEDM// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const { logger } = require("firebase-functions");
const { onRequest } = require("firebase-functions/v2/https");
const { onDocumentCreated } = require("firebase-functions/v2/firestore");

// The Firebase Admin SDK to access Firestore.
const { initializeApp } = require("firebase-admin/app");
const { getFirestore } = require("firebase-admin/firestore");

initializeApp();

const nodemailer = require("nodemailer");
const admin = require("firebase-admin");

// const transporter = nodemailer.createTransport({
//   host: "mail.caeloss.com",
//   port: 465,
//   secure: true,
//   auth: {
//     user: "admin@caeloss.com",
//     pass: "cielosAdmin2025@",
//   },
// });
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "caelossplatform@gmail.com", // Lee la configuración de Firebase
    pass: "zhimwenxrrrpcesx", // Lee la configuración de Firebase
  },
});
// ✅✅✅✅
// ✅✅✅✅
// Esta funcion funciona correctamente con correo gmail
// ✅✅✅✅
// ✅✅✅✅
// Configura CORS permitiendo todos los orígenes temporalmente para depuración
exports.sendEmail = onRequest({ cors: true }, async (req, res) => {
  try {
    // Verifica el método de la solicitud
    if (req.method !== "POST") {
      return res.status(405).send("Method Not Allowed"); // Responde a métodos no permitidos
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

    // Envía el correo y espera la respuesta
    await transporter.sendMail(mailOptions);
    console.log("Correo enviado con éxito a:", to);
    return res.status(200).json({ message: "Correo enviado con éxito" });
  } catch (error) {
    console.error("Error al enviar correo:", error);
    return res
      .status(500)
      .json({ error: "Error interno del servidor: " + error.message }); // Incluye el mensaje de error
  }
});
exports.contactForm = onRequest((req, res) => {
  if (req.body.secret !== "firebaseIsCool") return res.send("Missing secret");
  sendContactForm(req.body);
  res.send("Sending email...");
});

// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
  // Grab the text parameter.
  const original = req.query.text;
  // Push the new message into Firestore using the Firebase Admin SDK.
  const writeResult = await getFirestore()
    .collection("messages")
    .add({ original: original });
  // Send back a message that we've successfully written the message
  res.json({ result: `Message with ID: ${writeResult.id} added.` });
});

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase

// ✅✅✅✅✅✅
// ✅✅✅✅✅✅
// ********** ESTA ES LA FUNCION FUNCIONA CORRECTAMENTE **********
// ********** ESTA ES LA FUNCION FUNCIONA CORRECTAMENTE **********
// ********** ESTA ES LA FUNCION FUNCIONA CORRECTAMENTE **********
// ********** ESTA ES LA FUNCION FUNCIONA CORRECTAMENTE **********
// ✅✅✅✅✅✅
// ✅✅✅✅✅✅
exports.makeuppercase = onDocumentCreated(
  "/messages/{documentId}",
  async (event) => {
    // Grab the current value of what was written to Firestore.
    const original = event.data.data().original;

    // Access the parameter `{documentId}` with `event.params`
    logger.log("Uppercasing", event.params.documentId, original);

    const uppercase = original.toUpperCase();

    const mailOptions = {
      from: `Tu Aplicación Firebase <caelossplatform@gmail.com>`,
      to: "jperezjimenez06@gmail.com",
      subject: "queso blanco",
      text: "holaaaaaaaaaaaa por fin funciona",
    };
    try {
      await transporter.sendMail(mailOptions);
      console.log("Correo electrónico enviado correctamente a:", "romo");
    } catch (error) {
      console.error("Error al enviar el correo electrónico:", error);
    }
    // You must return a Promise when performing
    // asynchronous tasks inside a function
    // such as writing to Firestore.
    // Setting an 'uppercase' field in Firestore document returns a Promise.
    return event.data.ref.set({ uppercase }, { merge: true });
  }
);

// FRONTEDN
// FRONTEDN
// FRONTEDN
// FRONTEDN
// FRONTEDN

// ********* CODIGO 4 *********
import React, { useState, useEffect } from "react";
import { getAuth, onAuthStateChanged, getIdToken } from "firebase/auth";
import db, { app } from "../firebase/firebaseConfig";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import styled from "styled-components";
import { ClearTheme } from "../config/theme";

import { collection, addDoc, onSnapshot } from "firebase/firestore";

const EnviarEmailJSX = () => {
  const [contextInfo, setContextInfo] = useState(null);
  const [user, setUser] = useState(null);
  const auth = getAuth();
  const [isJJose, setIsJose] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    if (auth.currentUser?.email === "jperez@cielosacusticos.com") {
      //Usa optional chaining
      setIsJose(true);
    } else {
      setIsJose(false);
    }
    return () => unsubscribe();
  }, [auth]);

  const handleDebugContext = async () => {
    if (user) {
      try {
        const token = await user.getIdToken(); // Obtener el token
        const functionURL = `https://us-central1-${app.options.projectId}.cloudfunctions.net/debugContext`;
        const response = await fetch(functionURL, {
          method: "GET", // Usamos GET para debugContext
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Incluir el token
          },
        });

        if (!response.ok) {
          const errorText = await response.text(); // Obtener el texto del error
          throw new Error(
            `Failed to fetch debugContext: ${response.status} - ${errorText}`
          );
        }

        const data = await response.json();
        console.log("Context Auth Object:", data);
        setContextInfo(JSON.stringify(data, null, 2));
      } catch (error) {
        console.error("Error al llamar a debugContext:", error);
        setContextInfo(`Error: ${error.message}`);
      }
    } else {
      console.log("Usuario no autenticado.");
      setContextInfo("Usuario no autenticado.");
    }
  };
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("holassswwwwwa");
  const [loading, setLoading] = useState(true);
  const messagesCollectionRef = collection(db, "messages");
  const handleSendMessage = async () => {
    console.log(111);
    console.log(newMessage.trim());
    if (newMessage.trim()) {
      // 1. Add a new document to the "messages" collection.
      try {
        await addDoc(messagesCollectionRef, { original: newMessage });
        setNewMessage(""); // Clear the input after sending
        // No necesitas hacer nada con la respuesta de la función aquí.
        // La función `makeUppercase` se dispara automáticamente cuando se crea este documento.
        // El listener onSnapshot actualiza los mensajes.
      } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send message. Check console for errors."); // Basic error handling
      }
    }
  };
  return (
    isJJose && (
      <CajaBtnEnviarCorreo>
        <BtnGeneralButton onClick={handleSendMessage} disabled={!user}>
          Uppercase
        </BtnGeneralButton>
        {contextInfo && (
          <pre>
            <code>{contextInfo}</code>
          </pre>
        )}
        {/* <BtnGeneralButton onClick={handleEnviarCorreo} disabled={!user}>
          Enviar Correo
        </BtnGeneralButton>
        <BtnGeneralButton onClick={funcionPrueba} disabled={!user}>
          Prueba
        </BtnGeneralButton> */}
      </CajaBtnEnviarCorreo>
    )
  );
};

export default EnviarEmailJSX;

const CajaBtnEnviarCorreo = styled.div`
  width: 100%;
  height: 100px;
  background-color: ${ClearTheme.secondary.azulSuave};
  display: flex;
  justify-content: center;
  align-items: center;
`;


// FIREBASE .JSON
// FIREBASE .JSON
// FIREBASE .JSON
// FIREBASE .JSON
// FIREBASE .JSON
{
  "hosting": {
    "public": "dist",
    "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
    "rewrites": [
      { "source": "**", "destination": "/index.html" },
      { "source": "/version1/**", "destination": "/version1/" },
      { "source": "/version1/", "destination": "/version1/" },
      {
        "source": "/sendEmail",
        "function": "sendEmail"
      },
      {
        "source": "/debugContext",
        "function": "debugContext"
      },
      {
        "source": "/contact_form",
        "function": "contactForm"
      },
      {
        "source": "**",
        "destination": "/index.html"
      }
    ],
    "headers": [
      {
        "source": "**",
        "headers": [
          {
            "key": "Access-Control-Allow-Origin",
            "value": "https://caeloss.com"
          },
          {
            "key": "Access-Control-Allow-Methods",
            "value": "POST, GET, OPTIONS"
          },
          {
            "key": "Access-Control-Allow-Headers",
            "value": "Content-Type, Authorization"
          }
        ]
      }
    ]
  },
  "functions": [
    {
      "source": "functions",
      "codebase": "default",
      "ignore": [
        "node_modules",
        ".git",
        "firebase-debug.log",
        "firebase-debug.*.log",
        "*.local"
      ],
      "predeploy": []
    }
  ]
}
