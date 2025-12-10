// La funcion de este compontene es confirmar que todos los pagos de una solicitud han sido ejecutados
// Retorna true o false

// Que pasa si la solicitud no tiene ayudante de camion principal
// Que pasa si la solicitud no tiene ayudante de camion adicional
//
//
export const isAllPayExecuted = (req) => {
  const elementos = {
    camionPrincipal: false,
    ayudanteCamionPrincipal: false,
    ayudantesAddCamionPrincipal: [],
    camionAdd: [],
  };

  const schemaCamionAdd = {
    chofer: false,
    ayudante: false,
    ayudantesAdicionales: [],
  };

  //Chofer principal - ElOG1
  if (
    req.datosFlete.detallesPago.camionExterno.pagoGenerado ||
    req.datosFlete.detallesPago.choferInterno.pagoGenerado
  ) {
    elementos.camionPrincipal = true;
  }

  // Ayudante chofer principal - ElOG2
  if (req.datosFlete.detallesPago.ayudanteInterno.pagoGenerado) {
    elementos.ayudanteCamionPrincipal = true;
  }
  //
  // Ayudante adicional camion principal - ElOG3
  req.datosFlete.ayudantesAdicionales.forEach((ayudAdd) => {
    elementos.ayudantesAddCamionPrincipal.push(
      ayudAdd.detallesPago.pagoGenerado
    );
  });

  req.datosFlete.vehiculosAdicionales.forEach((vehAdd) => {
    const ayudAddAuxArray = [];
    vehAdd.ayudantesAdicionales.forEach((ayudAdd) => {
      ayudAddAuxArray.push(ayudAdd.detallesPago.pagoGenerado);
    });
    const pagado =
      vehAdd.detallesPago.camionExterno.pagoGenerado ||
      vehAdd.detallesPago.choferInterno.pagoGenerado;
    elementos.camionAdd.push({
      ...schemaCamionAdd,
      // Camion adicional - ElOG4
      chofer: pagado,
      // Ayudante camion adicional - ElOG5
      ayudante: vehAdd.detallesPago.ayudanteInterno.pagoGenerado,
      // Ayudante adicional camion adicional - ElOG6
      ayudantesAdicionales: ayudAddAuxArray,
    });
  });

  // 🟢******** MI VERSION *******
  // let retornar = false;
  // // Camion principal
  // if (elementos.camionPrincipal) {
  //   // Ayudante camion principal
  //   if (elementos.ayudanteCamionPrincipal) {
  //     // Ayudantes adicionales camion principal
  //     if (elementos.ayudantesAddCamionPrincipal.every((ayu) => ayu == true)) {
  //       // Camiones adicionales
  //       if (elementos.camionAdd.every((vehAdd) => vehAdd.chofer)) {
  //         // Ayudante adicional cada camion
  //         if (elementos.camionAdd.every((vehAdd) => vehAdd.ayudante)) {
  //           // Ayudantes adicionales de camiones adiconales
  //           const todosEjecutados = elementos.camionAdd.flatMap(
  //             (camion) => camion.ayudantesAdicionales
  //           );

  //           if (todosEjecutados.every((ayuAddCamAdd) => ayuAddCamAdd == true)) {
  //             retornar = true;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // 🟢******** OPTIMIZADO POR CHATGPT *******
  console.log(elementos);
  return (
    elementos.camionPrincipal &&
    elementos.ayudanteCamionPrincipal &&
    elementos.ayudantesAddCamionPrincipal.every((ayu) => ayu === true) &&
    elementos.camionAdd.every((vehAdd) => vehAdd.chofer && vehAdd.ayudante) &&
    elementos.camionAdd
      .flatMap((camion) => camion.ayudantesAdicionales)
      .every((ayuAddCamAdd) => ayuAddCamAdd === true)
  );
};
