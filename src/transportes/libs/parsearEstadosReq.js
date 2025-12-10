// Este estado lo utilizo para saber si la solicitud tiene al menos un vehiculo adicional en estado concluido
export const parsearEstadosReq = (request) => {
  let estado = null;
  if (request.datosFlete?.vehiculosAdicionales?.length > 0) {
    const estados = [
      ...request.datosFlete.vehiculosAdicionales.map(
        (vehAdd) => vehAdd.datosEntrega.status
      ),
      request.estadoDoc,
    ];
    console.log(request);
    console.log(estados);
    const hasEjecutando = estados.some((estado) => estado == 2);
    const allConcluidos = estados.every((estado) => estado == 3);
    const hasConcluidos = estados.some((estado) => estado == 3);
    // ****** CASO 1*********
    // Si algun vehiculo esta en ejecucion, entonces la solicitud esta en ejecucion

    if (hasEjecutando) {
      estado = 2;
    }

    // ****** CASO 2*********
    // Si todos lo vehiculos estan concluidos incluido el vehiculo por default, entonces la solicitud esta concluida
    else if (allConcluidos) {
      estado = 3;
    }

    // ****** CASO 3*********
    // Si hay vehiculos concluidos pero otros no, entonces esta en ejecucion, esto pasa dado  a que un vehiculo puede estar concluido y los otros no (y no estar en ejecucion sino a la espera, por lo tanto el caso 1 no lo cubre)
    else if (hasConcluidos && !allConcluidos) {
      estado = 2;
    } else {
      estado = request.estadoDoc;
    }
  } else {
    estado = request.estadoDoc;
  }

  return estado;
};
