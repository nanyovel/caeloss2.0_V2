const imgVideoSchema = {
  url: "",
  titulo: "",
  descripcion: "",
};

export const conjuntoSchema = {
  createdBy: "",
  createdAt: "",
  //
  titulo: "",
  subTitulo: "",
  descripcion: "",
  url: "",
  noProyecto: "",
  arrayCodigoItems: [],
  // Las categorias se colocaran todas dentro de un string, segun los items colocados, no se recomienda estar cambiando las categorias a los items para evitar problemas en las consultas
  categorias: [],
  observaciones: [
    // strings
  ],

  items: [],
  comentarios: [
    // schema de comentarioss
  ],
  imagenes: [
    // schema imgVideoSchema
  ],
  videos: [
    // schema imgVideoSchema
  ],
};
