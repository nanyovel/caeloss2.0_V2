export const generarArrayDestinos = (furgones) => {
  let destinos = new Set();
  const destinosTodos = [];

  if (furgones.length > 0) {
    furgones.forEach((furgon) => {
      const strMinus = furgon.destino.toLowerCase();
      const primeraMayus = strMinus.charAt(0).toUpperCase() + strMinus.slice(1);
      destinos.add(primeraMayus);
      destinosTodos.push(primeraMayus);
    });
  }

  let arrayDestinos = Array.from(destinos);

  const arrayParsed = arrayDestinos;

  let newListDestino = [];

  arrayParsed.forEach((dest) => {
    const qtyDestinos = destinosTodos.filter((lugar) => {
      if (lugar == dest) {
        return lugar;
      }
    });

    let stringDestino = `${qtyDestinos.length} - ${qtyDestinos[0]}`;
    newListDestino = [...newListDestino, stringDestino];
  });
  return newListDestino;
};
