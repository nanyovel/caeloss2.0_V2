const dimensionesSchema = {
  // Metros, Pies, Centimetros, pulgadas, milimetros
  unidadMedida: "",
  ancho: 0,
  largo: 0,
  grosor: 0,
};

export const complementosSchema = {
  codigo: "",
  funcion: "",
  cuandoUtilizar: "",
  alternativas: [
    // codigo
    // descripcion
  ],
  observaciones: [
    // strings
  ],
};

const alternativasSchema = {
  codigo: "",
  descripcion: "",
  img: "",
  observaciones: "",
};
const paisOrigenSchema = {
  siglas: "",
  label: "",
};
const documentosSchema = {
  label: "",
  url: "",
};
export const datoTecnicoSchema = {
  nombre: "",
  label: "",
  detalles: "",
  // ***** TIPO *****
  // row
  // vertical
  // table
  tipo: "",
};
export const datoTecnicoSchemaTipoDimensiones = {
  ...datoTecnicoSchema,
  tipo: "dimensiones",
  // ****** TIPO DIMENSIONES *****
  // Solo para tipo dimensiones
  // El tipo dimensiones es un tercer tipo es de la siguiente manera:
  // -todos los productos lo poseen por default
  // -tiene dos propiedades adicionales headTable y bodyTable
  // -es algo fijo
  headTable: ["U/M", "Ancho", "Largo", "Grosor"],
  // Este es un array de array
  // bodyTable: ["", "", "", ""],
  bodyTable: [{ um: "", ancho: "", largo: "", grosor: "" }],
};
export const infoAdicionSchema = {
  titulo: "",
  parrafos: [""],
};
export const productoSchema = {
  head: {
    //
    codigo: "",
    descripcion: "",
    unidadMedida: "",
    proveedores: [],
    imagenDestacada: "",
    paisOrigen: [
      // paisOrigen schema
    ],
    documentos: [
      // schema
    ],
    enlaces: [],
    //
    //
    //
    //

    categoria: "",
    subCategoria: "",
    marca: "",
  },
  textosDetalles: [
    // strings para parrafos
  ],
  caracteristicas: [
    // strings para lista
  ],
  usos: [
    // strings
  ],
  datosTecnicos: [{ ...datoTecnicoSchemaTipoDimensiones }],
  infoAdicional: [
    // info adicional schema
  ],
  galeria: {
    // imagenesVideosSchema
    imagenes: [],
    videos: [],
  },
  comentarios: [
    // comment schema
  ],
  complementos: [
    // complementos schema
  ],
  alternativas: [
    // alternativas schema
  ],
  //
  //
  //
  //

  //
};
