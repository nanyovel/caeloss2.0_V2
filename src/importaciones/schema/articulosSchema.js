export const despachoSchema = {
  codigo: "",
  descripcion: "",
  qty: "",
  comentarioOrden: "",
  comentarios: "",
  furgon: "",
  numeroBL: "",
  ordenCompra: "",
};

export const articulosSchemaOrden = {
  codigo: "",
  descripcion: "",
  qty: "",

  comentarioOrden: "",
  comentarios: "",
  valoresAux: null,
};

// Este schema utilizar para items furgones y items carga suelta
export const articulosSchemaFurgon = {
  codigo: "",
  descripcion: "",
  qty: "",
  comentarioOrden: "",
  comentarios: "",
  ordenCompra: "",
  idOrdenCompra: "",
  valoresAux: null,
};
