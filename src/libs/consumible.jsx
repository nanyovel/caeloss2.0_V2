export default function funcionConsumible(tipo) {
  let valor = "";
  let diasTranscurridos = "";
  let diferenciaTotalDias = "";
  if (tipo == "perdida") {
    // const fechaInicial = new Date(2024,2,20);

    const fechaInicial = new Date(2025, 0, 12);
    const fechaFinal = new Date(2025, 5, 12);
    const qtyMiliSegDifer = fechaFinal - fechaInicial;
    diferenciaTotalDias = Math.floor(qtyMiliSegDifer / (1000 * 60 * 60 * 24));

    // const diferencia=

    const fechaActual = new Date();
    const diferenciaEnMilisegundos = fechaActual - fechaInicial;

    // Calcula la diferencia en días redondeando hacia abajo
    diasTranscurridos = Math.floor(
      diferenciaEnMilisegundos / (1000 * 60 * 60 * 24)
    );

    valor = diasTranscurridos;
    // valor = 99;
    // valor = diasTranscurridos;
    // valor=();
  } else if (tipo == "mantenimiento") {
    valor = 100;
  }

  const retornar = diferenciaTotalDias - diasTranscurridos + "%";
  console.log(diferenciaTotalDias);
  console.log(diasTranscurridos);
  // console.log(retornar);
  return {
    valorPorcentaja: retornar,
    valorNumber: valor,
    qtyDias: diasTranscurridos,
  };
}
