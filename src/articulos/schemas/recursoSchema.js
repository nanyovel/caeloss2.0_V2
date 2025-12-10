const agrupacionesSchema = [
  {
    code: "imagenProducto",
    nombre: "Imagen del producto",
  },
  {
    code: "fichaTecnica",
    nombre: "Ficha tecnica del producto",
  },
  {
    code: "catalogo",
    nombre: "Catalogo del producto",
  },
  {
    code: "brochure",
    nombre: "Brochure del producto",
  },
  {
    code: "instructivo",
    nombre: "Instructivo de instalacion",
  },

  {
    code: "otros",
    nombre: "Otros",
  },
];
export const recursoSchema = {
  // ***Tipo***
  // 0-Imagen
  // 1-Documento
  // 2-Video
  // 3-Otros
  tipo: "",
  agrupacion: "",
  url: "",
  itemsCodigos: [],
  categoriasCode: [],
  subCategoriasCode: [],
  comentarios: "",
  titulo: "",
  descripcion: "",
  createdBy: "",
  createdAt: "",
  fileName: "",
  sizeBytes: 0,
  mimeType: 0,
  extension: "",
};
