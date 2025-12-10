export const qtyDisponiblePartida = (codigo, orden) => {
  const item = orden.materiales.find((item) => item.codigo == codigo);

  const partidas = orden?.partidas || [];
  console.log(orden);
  console.log(item);
  return (
    item.qty -
    partidas
      ?.flatMap((partida) => {
        return partida.materiales;
      })
      .filter((produc) => {
        if (produc.codigo == item.codigo) {
          return item;
        }
      })
      .reduce((acc, el) => {
        return acc + el.qty;
      }, 0)
  );
};
