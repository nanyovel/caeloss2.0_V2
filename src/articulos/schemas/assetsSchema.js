// // Este schema existe de esta manera porque un asset no necesariamente corresponde a un codigo especifico ejemplo: un brochure se realiza para una lista de productos de diferentes tamaños, colores, modelos etc, por tanto el usuario no debera subir el mismo asset 15 veces, sino subirlo una sola vez y especificar esta info y Caeloss deberá saber como tratarlo y a cuales productos y categorias corresponde

// export const elementosAssetsProductsSchema = {
//   // ***Tipo***
//   // 0-Imagen
//   // 1-Documento
//   // 2-Video
//   // 3-Otros
//   tipo: "",
//   // ***Sub tipo***
//   // 0-Imagen
//   // 1.1-Ficha tecnica
//   // 1.2-Catalogo
//   // 1.3-Brochure
//   // 1.4-Instructivo de instalacion
//   // 1.5-Otros
//   // 2-Video
//   subtipo: "",
//   // Esto es un string colocado por el usuario cuando elige "Otros" en tipo documento
//   tipoOtros: "",
//   url: "",
//   codigoProducto: "",
//   titulo: "",
//   descripcion: "",
//   // Esta propiedad es para destacar algun elemento en particular, esto sera util para la imagen principal del producto
//   destacada: false,
//   comentarios: "",

//   codigoProducto: "",
//   itemsIncluidos: [],
//   // esta propiedad debe llenarse automaticamente segun el codigo del producto y no por el usuario
//   codigoCategoria: "",
//   // este array se llena automaticamente segun los items que coloque el usuario en items incluidos
//   categoriasIncluidas: [],
// };

// // export const assetsProductsSchema = {
// //   createdAt: "",
// //   createdBy: "",
// //   codigoProducto: "",
// //   descripcionProducto: "",
// //   elementos: [
// //     // elementos asociados al asset
// //   ],
// // };

// // 🟢🟢🟢NUEVO MODELO 30 OCTUBRE 2025🟢🟢🟢
// export const assetProductSchema2 = {
//   // ***Tipo***
//   // 0-Imagen
//   // 1-Documento
//   // 2-Video
//   // 3-Otros
//   tipo: "",
//   // ***Sub tipo***
//   // 0-Imagen
//   // 1.0-Ficha tecnica
//   // 1.1-Catalogo
//   // 1.2-Brochure
//   // 1.3-Instructivo de instalacion
//   // 1.4-Otros
//   // 2-Video
//   subtipo: "",
//   // Esto es un string colocado por el usuario cuando elige "Otros" en tipo documento
//   tipoOtros: "",
//   url: "",

//   // Aqui se coloca la marca del producto que podria ser diferente al nombre del fabricante
//   marca: "",
//   // proveedor no necesariamente es igual a la marca
//   proveedor: "",

//   // en este array se colocan todos los codigos de productos a los que aplica este asset

//   // etiquetas
//   etiquetas: [],

//   // Aqui se coloca quien generó el asset, por ejemplo un catalogo que creo Cielos, entonces aqui se coloca Cielos Acusticos
//   generadoPor: "",

//   titulo: "",
//   nombreArchivo: "",
//   descripcion: "",
//   // Esta propiedad es para destacar algun elemento en particular, esto sera util para la imagen principal del producto
//   destacada: false,
//   comentarios: "",

//   codigoProducto: "",
//   categoriaProducto: "",
//   // Aqui se colocara todos los codigos de los elementos
//   congloItemsIncluidos: [],
//   // Aqui se colocara todas las categorias que se encuentren en los elementos
//   congloCodigosCategorias: [],
// };
