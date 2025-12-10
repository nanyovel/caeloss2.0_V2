// DOCUMENTACION
// -Distancia siempre sera de tipo number
// -Si el usuario selecciona por kilometros y coloca un numero menor a 30, es justamente lo mismo que hacer click en algun radio
// -Si el usuario selecciono un radio; distancia sera igual al punto mas alto dentro de ese rango ejemplo para Radio de 4 a 6 KM, distancia sera igual 5.99
// -Si el usuario coloca distancia manualmente y escribe un numero mayor a 30, entonces distancia sera igual a lo colocado en el input manualmente
import { provinciasSinMunRepetidos } from "../DBFletex";
export const FormulaOficialFlete = (
  datosFlete,
  tipoSolicitud,
  vehiculoExplicito
) => {
  if (!datosFlete) {
    return;
  }
  // Existen dos formas de utilizar la variables dentro de la funcion:
  // Forma 1
  // Es la forma original que es hacer un find desde cada array de seleccion
  //
  // Forma 2
  // Es para cuando ya la solicitud esta creada y esta todo en la base de datos, pues no hay que hacer un find, porque de hecho en la base de datos no guardamos array de seleccion, sino el objeto previamente seleccionado
  //
  // La funcion elige la forma correspondiente con el operador || que coloque al final de cada array de seleccion
  const modalidadSeleccionada = datosFlete.modalidad;
  const puntoPartidaSeleccionado =
    datosFlete?.puntoPartida?.find((puntPartida) => {
      if (puntPartida.select == true) {
        return puntPartida;
      }
    }) || datosFlete.puntoPartidaSeleccionado;

  const provinciaSeleccionada =
    datosFlete?.destinos?.find((provincia) => {
      if (provincia.select == true) {
        return provincia;
      }
    }) || datosFlete.provinciaSeleccionada;

  let municipioSeleccionado =
    provinciaSeleccionada?.municipios?.find((municipio) => {
      if (municipio.select == true) {
        return municipio;
      }
    }) ||
    datosFlete.provinciaSeleccionada?.municipioSeleccionado ||
    "";

  const camionSeleccionado =
    datosFlete?.unidadVehicular?.find((vehiculo) => {
      if (vehiculo.select == true) {
        return vehiculo;
      }
    }) || datosFlete.vehiculoSeleccionado;

  //SI LA PROVINCIA DESTINO ES IGUAL A PROVINCIA ORIGEN
  if (
    puntoPartidaSeleccionado.nombrePronvicaOrigen ==
      municipioSeleccionado.provincia &&
    modalidadSeleccionada[0].select &&
    tipoSolicitud != 1
  ) {
    return {
      alerta: true,
      mensaje:
        "Provincia origen igual a provincia destino, utilizar radios alrededor de sucursal o modalidad por kilometros.",
      tipo: "warning",
      duracion: 5000,
    };
  }
  if (tipoSolicitud == 1) {
    if (
      puntoPartidaSeleccionado.nombreSucursalOrigen ==
      municipioSeleccionado.nombreSucursal
    ) {
      return {
        alerta: true,
        mensaje: "Sucursal origen igual a sucursal destino.",
        tipo: "warning",
        duracion: 5000,
      };
    }
  }
  // *******Calcular*******
  let costo = 0;
  let distancia = 0;
  const datosFijos = {
    kmTotalAnillos: 30,
    kmHolgura: 25,
  };
  const camionCalcular = vehiculoExplicito
    ? vehiculoExplicito
    : camionSeleccionado;

  if (puntoPartidaSeleccionado)
    if (modalidadSeleccionada[0].select == true) {
      // Modalidad por destino
      // Si el usuario eligio un municipio normal que no es un radio
      if (municipioSeleccionado.provincia != "Radio") {
        distancia =
          municipioSeleccionado[puntoPartidaSeleccionado.nombreDistancia];
      }
      // Si el usuario seleciona un radio/anillo,
      // ~ condicion abajo ~
    } else if (modalidadSeleccionada[1].select == true) {
      distancia = datosFlete.distancia;
    }
  // Si la distancia es mayor o igual a 30 kilometro
  if (distancia >= 30) {
    costo = distancia - datosFijos.kmTotalAnillos;
    costo = costo + datosFijos.kmHolgura;
    console.log(costo);

    costo = Math.round(costo / 10);
    console.log(costo);
    costo = costo * camionCalcular.cuota;
    console.log(costo);
    costo = costo + camionCalcular.radio7_20a30;
    console.log(costo);
  }
  // Si la distancia es menor o igual a 30 kilometro
  else if (distancia < 30) {
    const muniicipiosRadio = provinciasSinMunRepetidos[1];
    if (distancia > 0 && distancia < 2) {
      costo = camionCalcular.radio1_0a2;
      municipioSeleccionado = muniicipiosRadio.municipios[0];
    } else if (distancia >= 2 && distancia < 4) {
      costo = camionCalcular.radio2_2a4;
      municipioSeleccionado = muniicipiosRadio.municipios[1];
    } else if (distancia >= 4 && distancia < 6) {
      costo = camionCalcular.radio3_4a6;
      municipioSeleccionado = muniicipiosRadio.municipios[2];
    } else if (distancia >= 6 && distancia < 9) {
      costo = camionCalcular.radio4_6a9;
      municipioSeleccionado = muniicipiosRadio.municipios[3];
    } else if (distancia >= 9 && distancia < 15) {
      costo = camionCalcular.radio5_9a15;
      municipioSeleccionado = muniicipiosRadio.municipios[4];
    } else if (distancia >= 15 && distancia < 20) {
      costo = camionCalcular.radio6_15a20;
      municipioSeleccionado = muniicipiosRadio.municipios[5];
    } else if (distancia >= 20 && distancia < 30) {
      costo = camionCalcular.radio7_20a30;
      municipioSeleccionado = muniicipiosRadio.municipios[6];
    }
  }
  // Si el usuario selecciona uno de los radios
  if (municipioSeleccionado?.provincia == "Radio") {
    // El costo seria un monto fijo segun el camion seleccionado
    // La tistancia tambien seria un string que indica un radio por ejemplo: Radio de 0 a 2km
    costo = camionCalcular[municipioSeleccionado.codeLabel] || "";
    distancia = municipioSeleccionado.kmMax;
  }

  const precio = Math.round(costo / 0.75);
  const resultado = {
    precio: precio,
    costo: costo,
    distancia: distancia,
  };

  return resultado;
};
export const RangoRadio = (distancia) => {
  let strReturn = "";
  if (distancia > 0 && distancia < 2) {
    strReturn = "Radio de 0 a 1.99km";
  } else if (distancia >= 2 && distancia < 4) {
    strReturn = "Radio de 2 a 3.99km";
  } else if (distancia >= 4 && distancia < 6) {
    strReturn = "Radio de 4 a 5.99km";
  } else if (distancia >= 6 && distancia < 9) {
    strReturn = "Radio de 6 a 8.99km";
  } else if (distancia >= 9 && distancia < 15) {
    strReturn = "Radio de 9 a 14.99km";
  } else if (distancia >= 15 && distancia < 20) {
    strReturn = "Radio de 15 a 19.99km";
  } else if (distancia >= 20 && distancia < 30) {
    strReturn = "Radio de 20 a 29.99km";
  }
  return strReturn;
};
