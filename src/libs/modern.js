export const generaLinkWA = (destino, tipo, mensaje) => {
  if (tipo == "whatsapp") {
    const apiWhatsApp = `https://api.whatsapp.com/send?phone=+1${destino}&text=`;
    const mensajeDefault = mensaje
      ? mensaje
      : "Hola, quisiera que por favor me asistas.";
    return apiWhatsApp + encodeURIComponent(mensajeDefault);
  } else if (tipo == "llamada") {
    return "tel:+1" + destino;
  } else if (tipo == "correo") {
    return "mailto:" + destino;
  }
};
