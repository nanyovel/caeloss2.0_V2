// archivo de configuracion
// Este archivo lo unico que hace es retornar una configuracion de cuales elementos apareceran en pantalla
// dependiendo el tipo de estado.
// ademas contiene algunas validaciones con alertas para los casos que no aplique y demas
// este archivo es util, dado a que las solicitudes se les puede cambiar el estado en la lista de la vista principal y tambien
// dentro de una solicitud como tal

export function ManejadorJSEstados(
  name,
  initialPropsAccion,
  setPropsAccion,
  solicitudAfectar,
  userMaster
) {
  if (solicitudAfectar) {
    // Si la solicitud esta anulada, entonces no se puede cambiar el estado
    // Esto probablemente nunca se ejecute
    if (solicitudAfectar.estadoDoc == 4) {
      return {
        alerta: true,
        mensaje: "No puede cambiar el estado a una solicitud anulada.",
        duracion: 3000,
        tipo: "warning",
      };
    }

    // Si la solicitud es una solicitud hija, no puede cambiar el estado
    if (solicitudAfectar.familia.parentesco == 1) {
      return {
        alerta: true,
        mensaje: "No puede cambiar el estado a una solicitud hija.",
        duracion: 3000,
        tipo: "warning",
      };
    }
    // Si la solicitud esta en modo borrador, esto talvez nunca ocurra, por la logica del proyecto
    if (solicitudAfectar.estadoDoc == 5) {
      return {
        alerta: true,
        mensaje: "Esta solicitud esta en modo borrador.",
        duracion: 3000,
        tipo: "warning",
      };
    }

    // PRIVILEGIO PARA CAMBIO DE ESTADO
    const hasPlanificar = userMaster.permisos.includes(
      "planificatedRequestTMS"
    );
    const hasEjecutar = userMaster.permisos.includes("runRequestTMS");
    const hasConcluir = userMaster.permisos.includes("terminateRequestTMS");
    const hasAnular = userMaster.permisos.includes("annularRequestTMS");

    if (name == "planificar") {
      if (!hasPlanificar) {
        return;
      }
      setPropsAccion({
        ...initialPropsAccion,
        solicitud: solicitudAfectar,
        semana: true,
        tipo: name,
      });
    } else if (name == "ejecutar") {
      if (!hasEjecutar) {
        return;
      }
      setPropsAccion({
        ...initialPropsAccion,
        solicitud: solicitudAfectar,
        chofer: true,
        ayudante: true,
        tipo: name,
      });
    } else if (name == "concluir") {
      if (!hasConcluir) {
        return;
      }
      setPropsAccion({
        ...initialPropsAccion,
        solicitud: solicitudAfectar,
        chofer: true,
        ayudante: true,
        fecha: true,
        tipo: name,
      });
    } else if (name == "cancelar") {
      console.log(0);
      if (!hasAnular) {
        return;
      }
      setPropsAccion({
        ...initialPropsAccion,
        solicitud: solicitudAfectar,
        justificacion: true,
        tipo: name,
      });
    }
  }
}
