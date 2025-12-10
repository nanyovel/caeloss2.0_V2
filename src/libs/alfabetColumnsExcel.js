export function alfabetColumnsExcel(numero) {
  const letras = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let resultado = "";
  let n = numero - 1; // Excel empieza en 1

  while (n >= 0) {
    resultado = letras[n % 26] + resultado;
    n = Math.floor(n / 26) - 1;
  }

  return resultado;
}
