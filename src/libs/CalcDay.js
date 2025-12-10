export const CalcDay = (fechaInicial, fechaFinal) => {
  const fechaActual = new Date();

  const qtyMiliSegDifer = fechaFinal - fechaInicial;
  const milSegTranscurrds = fechaActual - fechaInicial;

  const totalDias = Math.floor(qtyMiliSegDifer / (1000 * 60 * 60 * 24));
  const diasTranscurridos = Math.floor(
    milSegTranscurrds / (1000 * 60 * 60 * 24)
  );
  const qtyPorcentaje = Math.round((diasTranscurridos / totalDias) * 100);
  if (qtyPorcentaje > 99) {
    return 99;
  }
  return qtyPorcentaje;
};
