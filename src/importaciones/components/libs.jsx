// DEPRECATED 28/5/25
export const funcionDiasRestantes = (bl) => {
  // DEPRECATED 28/5/25
  const fecha = bl.llegadaAlPaisDetalles?.fecha;
  const diasLibres = bl?.diasLibres;
  const furgones = bl.furgones;
  let annio = "";
  let mes = "";
  let dia = "";

  if (fecha) {
    annio = fecha.slice(6, 10);
    mes = fecha.slice(3, 5);
    dia = fecha.slice(0, 2);
    let fechaActual = new Date();
    let llegadaAlPaisPlana = new Date(
      Number(annio),
      Number(mes - 1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
      Number(dia)
    );
    let diasLibresEnMiliSegundos = diasLibres * 24 * 60 * 60 * 1000;
    let diferenciaMilisegundos =
      llegadaAlPaisPlana - fechaActual + diasLibresEnMiliSegundos;
    let diasRestantes = "";
    diasRestantes = Math.ceil(diferenciaMilisegundos / (1000 * 60 * 60 * 24));
    return diasRestantes;
  } else {
    return "-";
  }
};

export const colorDaysRemaining = (diasRemaining) => {
  return diasRemaining > 3
    ? "🟢"
    : diasRemaining <= 3 && diasRemaining >= 1
      ? "🟡"
      : diasRemaining <= 1
        ? "🔴"
        : "";
};
export const calcDiasRestante = (fechaLlegada, qtyDiasLibre) => {
  const fecha = fechaLlegada;
  const diasLibres = qtyDiasLibre;

  const annio = fecha.slice(6, 10);
  const mes = fecha.slice(3, 5);
  const dia = fecha.slice(0, 2);
  const fechaActual = new Date();
  const llegadaAlPaisPlana = new Date(
    Number(annio),
    Number(mes - 1), //aqui se debe rebajar uno dado que en java script los meses empiezan en 0
    Number(dia)
  );

  // Dias libres en milisegundos
  const diasLibMSeg = diasLibres * 24 * 60 * 60 * 1000;
  // Diferencia de dias en mili segundos
  const diferenciaMSeg = llegadaAlPaisPlana - fechaActual + diasLibMSeg;
  return Math.ceil(diferenciaMSeg / (1000 * 60 * 60 * 24));
};

export const fechaConfirmada = (confirmacion, soloTexto) => {
  let texto = "";
  let emoji = "";

  if (confirmacion) {
    texto = "Fecha confirmada";
    emoji = "✅";
  } else {
    texto = "Fecha estimada";
    emoji = "⚠️";
  }

  if (soloTexto) {
    return texto;
  } else {
    return <span title={texto}>{emoji}</span>;
  }
};
