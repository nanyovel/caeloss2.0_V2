export const imagenesVideosSchema = {
  titulo: "",
  url: "",
  textoDescriptivo: "",
  destacado: false,
};

export const tiposDocumentos = [
  "Ficha tecnica",
  "Catalogo",
  "Brochure",
  "Instructivo de instalacion",
  "Otros",
];

export const enlacesSchema = {
  url: "",
  titulo: "",
};
export const datosDeDatosTecnicosSchema = {
  // Tipo***
  // 0-Fila: Es el mas comun y consta de dos partes flex-direction row
  // 1-Parrafo: Es un titulo con un parrafo debajo,  flex-direction column
  tipo: 0,
  titulo: "",
  descripcion: "",
};

export const infoAdicionaSchema = {
  titulo: "",
  descripcion: "",
};
