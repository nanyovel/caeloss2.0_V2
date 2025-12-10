export function extraerPrimerNombreApellido(nombre, apellido) {
  // Dividir el nombre completo en partes
  const partesNombre = nombre.trim().split(" ");

  const partesApellido = apellido.trim().split(" ");

  // Retornar el primer nombre y el primer apellido
  return `${partesNombre[0]} ${partesApellido[0]}`;
}

export const soloNumeros = (valor) =>
  valor === "" || /^[0-9]+(\.[0-9]+)?$/.test(valor);

export const fechaHora = (fechaForma) => {
  if (typeof fechaForma == "string") {
    return fechaForma.slice(0, 16) + fechaForma.slice(-2).toLocaleLowerCase();
  }
};

// Si el valor termina en un punto entonces esta funciona ejecuta y devuelve un string,
// En caso contrario, esta funcion no actua
// Se debe tomar en cuenta que hacer si el usuario intenta hacer algo con el input con punto al final, ejemplo quitar el foco o enviar el documento, el punto deberia limpiarse
export const puntoFinal = (str) => {
  const ultimoCaracter = str.charAt(str.length - 1);
  const ultimosDos = str.slice(-2);
  const hasPunto = str.includes(".");
  if (
    (ultimoCaracter == "." && ultimosDos != ".." && !hasPunto) ||
    str == "0."
  ) {
    return str;
  } else {
    return Number(str);
  }
};

export const formatoDOP = (valor) => {
  const formateandoHaciaDOP = new Intl.NumberFormat("es-DO", {
    style: "currency",
    currency: "DOP",
    minimumFractionDigits: 2,
    maximumFractionDigits: 6,
  });
  if (isNaN(valor)) {
    return "";
  } else {
    return formateandoHaciaDOP.format(valor);
  }
};

export const nombreApellido = (nombre, apellido) => {
  if (nombre) {
    if (!apellido) {
      return nombre;
    } else if (apellido) {
      return nombre + " " + apellido;
    }
  } else {
    if (apellido) {
      return apellido;
    } else {
      return "";
    }
  }
};

// Esta funciona busca que se registre en la base de datos solo string que se puedan manejar en una URL, es decir que el navegador no de errores

// Solo letras, números, guion medio y guion bajo
export const isValidNumDoc = (valor) => {
  // Elimina espacios al inicio y fin
  const value = valor.trim();

  // No puede estar vacío
  if (!value) return false;

  // Solo letras, números, guion medio y guion bajo
  const regex = /^[a-zA-Z0-9-_]+$/;

  return regex.test(value);
};

// convertir string en un slug para uso de URL
// EJemplo:
// "Aires Acondicionados Premium" → "aires-acondicionados-premium"
export const toSlug = (text) => {
  return text
    .toLowerCase()
    .trim()
    .normalize("NFD") // elimina acentos
    .replace(/[\u0300-\u036f]/g, "") // elimina acentos (parte 2)
    .replace(/[^a-z0-9\s-]/g, "") // elimina caracteres raros
    .replace(/\s+/g, "-") // espacios → guiones
    .replace(/-+/g, "-"); // elimina guiones repetidos
};
