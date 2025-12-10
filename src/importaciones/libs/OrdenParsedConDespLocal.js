export const OrdenParsedConDespLocal = (
  furgonesMasterEditable,
  dbOrdenesLlamadas
) => {
  // Primero, aplanamos todos los materiales de los furgones utilizados
  // Ademas parseamos con las propiedades requeridas
  const materialesAplanados = furgonesMasterEditable.flatMap((furgon) => {
    return furgon.materiales.map((material) => ({
      ...material,
      numeroFurgon: furgon.numeroDoc,
      // Esto se coloca null para evitar recursividad
      valoresAux: null,
    }));
  });
  const ordenesPased = dbOrdenesLlamadas.map((orden) => {
    // Dame solo los materiales de esta orden, es decir despachos que ha tenido esta orden
    const materialesFurgonThisOrden = materialesAplanados.filter(
      (material) => material.ordenCompra === orden.numeroDoc
    );
    // Dame todos los despachos this bl de esta orden
    const cantidadesDisponibles = orden.materiales.map((material) => {
      const despachosThisBLEsteItem = [];
      materialesFurgonThisOrden.forEach((item) => {
        if (item.codigo === material.codigo) {
          despachosThisBLEsteItem.push({
            ...item,
          });
        }
      });

      // Suma/cuenta la cantidad total de despacho
      const cantidadTotalDespachosThisBL = materialesFurgonThisOrden.reduce(
        (total, item) => {
          return total + (item.codigo === material.codigo ? item.qty : 0);
        },
        0
      );

      return {
        ...material,
        valoresAux: {
          ...material.valoresAux,
          despachosThisBL: despachosThisBLEsteItem,
          cantidadTotalDespachosThisBL: cantidadTotalDespachosThisBL,
        },
      };
    });

    return {
      ...orden,
      materiales: cantidadesDisponibles,
    };
  });

  return [...ordenesPased];
};
