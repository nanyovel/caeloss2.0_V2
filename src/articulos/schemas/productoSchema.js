const dimensionesSchema = {
  // Metros, Pies, Centimetros, pulgadas, milimetros
  unidadMedida: "",
  ancho: 0,
  largo: 0,
  grosor: 0,
};

const complementosSchema = {
  codigo: "",
  descripcion: "",
  img: "",
  funcion: "",
  cuandoUtilizar: "",
  altenativas: [
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
export const productoSchema = {
  alternativas: [
    // alternativas schema
  ],

  camposPropios: [
    // esto es para campos propios que solo posee este productos, es decir que no obedece el esquema general
    // utilizar mismo schema de info adicional
  ],
  caracteristicas: [
    // strings para lista
  ],
  comentarios: [
    // comment schema
  ],
  complementos: [
    // complementos schema
  ],
  datosTecnicos: {
    datos: [
      // Datos de datos tecnicos schema
    ],
    dimensiones: [
      // dimensiones schema
    ],
  },
  galeria: {
    // imagenesVideosSchema
    imagenes: [],
    videos: [],
  },
  infoAdicional: [
    // info adicional schema
  ],
  textosDetalles: [
    // strings para parrafos
  ],
  usos: [
    // strings
  ],
  //
  head: {
    imagenDestacada: "",
    categoria: "",
    subCategoria: "",
    marca: "",
    //
    codigo: "",
    descripcion: "",
    documentos: [
      // schema
    ],
    enlaces: [],
    etiquetas: [],
    paisOrigen: [
      // paisOrigen schema
    ],
    proveedores: [],
    unidadMedida: "",
  },
};
