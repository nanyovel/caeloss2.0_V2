export const datosBlAFurgon = (bl) => {
  return {
    idBL: bl.id,
    numeroBL: bl.numeroDoc,
    naviera: bl.naviera,
    proveedor: bl.proveedor,
    puerto: bl.puerto,
    diasLibres: bl.diasLibres,
    tipoBL: bl.tipo,
  };
};
