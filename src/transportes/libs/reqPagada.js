// La funcion de este componente es hacer dos cosas:
// 1- parsear las solicitudes utilizadas al momento de presionar el boton crea pago, colocandole la informacion necesaria del pago en cuestion
// 2- Antes de colocar esta informacion verificar si el pago ya existe en tal caso rebota un error
import { ES6AFormat } from "../../libs/FechaFormat";
import { dicionarioElementosOrigenReq } from "./generarElementoReq";

// Que cada pago a actualizar solicitud sea independiente al otro, es decir modular
// Si se intenta colocar un segundo pago ya establecido que se caiga el batch y rebote una alerta

export const reqPagada = ({ listaPagos, userMaster, numPagoPadre }) => {
  // Esta constante es para resolver el siguiente problema:
  // Cada chofer tiene una lista de pago hijos que se ejecutan cuando se presiona el boton crear pago
  // Este boton crea un pago padre con todos sus hijos
  // Cada hijo proviene de una solicitud de transporte obviamente
  // Una misma solicitud puede tener varios pues cada elemento puede ser un pago:
  // ------Pago chofer principal
  // ------Pago ayudante chofer principal
  // ------Pago ayudante adicional
  // ------Pago chofer adicional
  // ------Ayudante chofer adicional
  // ------Ayudante adicional de chofer adicional
  //
  // Cuando el usuario presiona crear pago, Caeloss toma todos los pagos pendientes de ese chofer y lo coloca como elementos del pago padre
  // Como sabemos cada pago proviene de una solicitud, pero varios pagos podrian venir de la misma solicitud
  // Esto pasará cuando un chofer ejecuta mas de una operacion a una misma solicitud
  // Un caso que va ocurrir con cierta frecuencia es que un mismo chofer de varios viajes
  // Por ejemplo:
  // ------Tenemos una solicitud que va para Feria agropecuaria pero debe ser en camion de 16'
  // ------El cliente pide que le entreguen 200 planchas cada 2 dias por un tema de espacio
  // ------La factura es de 800 planchas por tanto el camion de 16' dará 4 viajes
  // ------El encargado de logistica designa un chofer especifico (Jose Miguel) que entregue todas las planchas
  //
  // Con el ejemplo propuesto cuando contabilidad presione crear pago, ocurrirá un problema:
  // ------Este componente esta destinado agregar los batch necesarios para actualizar las solicitudes
  // ------No veo problemas para actualizar Chofer principal ni Ayudante principal
  // ------Esto porque puedo acceder a ellos a traves de propiedades anidadas ejemplo:
  // ------------ "datosFlete.detallesPago"
  // ------Pero tengo problemas con ayudantes adicionales y vehiculos adicionales con todo lo que conlleva dentro ejemplo:
  // --------------Ayudante de vehiculos adicional
  // --------------Ayudante adicional de vehiculos adicional
  //
  // El problema que presento es el siguiente:
  // ------Siguiendo el ejemplo anterior el chofer Jose Miguel dará 4 viajes
  // ------Por tanto en la lista de pagos de ese periodo tendrá 4 elementos que provienen de la misma solicitud
  // ------Estos elementos serían:
  // ---------Chofer principal
  // ---------Chofer adicional 0
  // ---------Chofer adicional 1
  // ---------Chofer adicional 2
  //
  // Cada uno de estos elementos es un objeto dentro del array de lista de pagos
  // Significa que cada uno hará su iteracion
  // La idea inicial es que en cada iteracion se agregue al batch la informacion a actualizar en la solicitud correspondiente
  // Pero en este ejemplo tendriamos un problema y es que por la naturaleza de firebase el batch tendría que ser de la siguiente manera:
  //   batch.update(solicitudUp, {
  //   "datosFlete.vehiculosAdicionales": camionesAddParsed,
  // });
  //
  // Supongamos que cuando contabilidad presiona crear pago, solamente hay estos 4 pagos del ejemplo
  // Es decir Jose Miguel solo hizo estos 4 viajes en toda la quincena porque entro hace unos dias de vacaciones
  // Por tanto el array de pagos tendra solo esos 4 pagos
  // 🟢1--En la primera iteracion se agrega al batch la informacion para actualizar el chofer principal, que seria algo asi:
  // ---------------------------------------------------------------------------------
  // const loteCargar = {
  //   // Alimenta chofer interno
  //   "detallesPago.choferInterno.pagoGenerado": upDetallePago.pagoGenerado,
  //   "detallesPago.choferInterno.idElementoPago": upDetallePago.idElementoPago,
  //   "detallesPago.choferInterno.idPagoPadre": upDetallePago.idPagoPadre,
  //   "detallesPago.choferInterno.codigoElementoPagado":
  //     upDetallePago.codigoElementoPagado,
  //   "detallesPago.choferInterno.monto": pago.costoInterno,

  //   // Coloca null en demas
  //   "detallesPago.ayudanteInterno": null,
  //   "detallesPago.camionExterno": null,
  // };
  // batch.update(solicitudUp, loteCargar);
  // ---------------------------------------------------------------------------------
  // Esto se agregará al batch correctamente y nunca podría tener colision
  //
  //🟢2--En la segunda iteracion agregara al batch informacion para actualizar el primer chofer adicional:
  // Por la naturaleza de firebase la forma de actualizar un array es cambiando uno por otro, algo asi:
  // ---------------------------------------------------------------------------------
  // const camionesAddParsed =
  // solicitudThisPago.datosFlete.vehiculosAdicionales.map(
  //   (vehAdd, index) => {
  //     const loteCargar = {
  //       pagoGenerado: true,
  //       idElementoPago: pago.id,
  //       idPagoPadre: pago.idPagoPadre,
  //       codigoElementoPagado: codigoOrigen,
  //       monto: pago.costoInterno,
  //     };
  //     return {
  //       ...vehAdd,
  //       detallesPago:
  //         vehAdd.idCamionComoElemento == pago.idElementoOrigen
  //           ? loteCargar
  //           : vehAdd.detallesPago,
  //       vehiculosAdicionales: vehAdd.vehiculosAdicionales.map(
  //         (ayudAdd) => {
  //           return {
  //             ...ayudAdd,
  //             detallesPago:
  //               ayudAdd.codigoElementoPagado == pago.idElementoOrigen
  //                 ? loteCargar
  //                 : ayudAdd.detallesPago,
  //           };
  //         }
  //       ),
  //     };
  //   }
  // );
  // batch.update(solicitudUp, {
  //   "datosFlete.vehiculosAdicionales": camionesAddParsed,
  // });
  // ---------------------------------------------------------------------------------
  // Notar que camionesAddParsed tiene las condiciones necesarias para actualizar segun la iteracion del momento
  // El problema es que al batch se cargaría ese camionesAddParsed tal cual, pero en la proxima iteracion sobreescribía la anterior en el batch pues por la naturaleza del firebase le estoy diciendo lo siguiente:
  // En la propiedad anidada "datosFlete.vehiculosAdicionales" coloca X cosa
  // Y en la proxima iteracion le estamos diciendo en la propiedad anidada "datosFlete.vehiculosAdicionales" coloca Y cosa
  // Al final el batch actualizara solamente el ultimo elemento origen de la solicitud
  // Esto es aun peor pues cada chofer adicional podria tener ayudante o ayudantes adicionales
  // Esto aplica tambien para ayundates adicionales del camion principal
  //

  const listReqGlobal = listaPagos.map((pago) => pago.solicitudAux);
  let reqSinDuplicadas = Array.from(
    new Map(listReqGlobal.map((req) => [req.id, req])).values()
  );

  let warning = false;

  // Para la actualizar cada solicitud, necesito ir al elemento especifico de esta solicitud
  // Para ello tenemos esta funcion que registra cuales fueron los elementos afectados
  // De manera que mas adelante pueda ir a estos elementos de manera especifica con facilidad
  const idsElementosActualizados = [];
  const reqsWarning = [];
  const upIdElsUp = (pago) => {
    const idReq = pago.solicitudAux.id;
    const { idElementoOrigen, codigoElementoOrigen } = pago;
    const id = pago.id;

    const datosElUp = {
      idReq: idReq,
      id: id,
      idElementoOrigen: idElementoOrigen,
      codigoElementoOrigen: codigoElementoOrigen,
    };
    idsElementosActualizados.push(datosElUp);
  };
  const listaPagosParsed = listaPagos.map((pago) => {
    let solicitudThisPago = pago.solicitudAux;
    console.log(solicitudThisPago);
    // console.log(pago);
    // **************** SABER A QUE CORRESPONDE THIS PAGO ****************
    const codigoOrigen = dicionarioElementosOrigenReq.find(
      (el) => el.codigoElementoOrigen == pago.codigoElementoOrigen
    ).codigoElementoOrigen;
    console.log(codigoOrigen);
    const infoThisPago = {
      pagoGenerado: true,
      idElementoPago: pago.id,
      idPagoPadre: pago.idPagoPadre,
      codigoElementoPagado: codigoOrigen,
      idElementoOrigen: pago.idElementoOrigen,
      createdAd: ES6AFormat(new Date()),
      createdBy: userMaster.userName,
      numPagoPadre: numPagoPadre,
    };
    // 1-Camion principal
    // console.log(codigoOrigen);
    if (codigoOrigen == "ElOG1") {
      // ****ID DEL BENEFICIARIO
      // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en chofer

      if (pago.beneficiario.id === solicitudThisPago.datosEntrega.chofer.id) {
        // ID ELEMENTO ORIGEN
        // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
        if (
          pago.idElementoOrigen ==
          solicitudThisPago.datosFlete.idCamionComoElemento
        ) {
          // Si es chofer interno
          if (solicitudThisPago.datosEntrega.chofer.tipo === 0) {
            reqSinDuplicadas = reqSinDuplicadas.map((req) => {
              if (req.id === solicitudThisPago.id) {
                const detallePagoUp = {
                  ...req.datosFlete.detallesPago,
                  choferInterno: {
                    ...req.datosFlete.detallesPago.choferInterno,
                    ...infoThisPago,
                    monto: pago.costoInterno,
                  },
                };

                // Si this pago ya existe, se cae el proceso
                if (req.datosFlete.detallesPago.choferInterno.pagoGenerado) {
                  warning = true;
                  reqsWarning.push(solicitudThisPago.numeroDoc);
                  console.log(1);
                  return {
                    ...req,
                  };
                }
                upIdElsUp(pago);

                return {
                  ...req,
                  datosFlete: {
                    ...req.datosFlete,
                    detallesPago: detallePagoUp,
                  },
                };
              } else {
                return {
                  ...req,
                };
              }
            });
          }
          // Si es chofer externo
          else if (
            solicitudThisPago.datosEntrega.chofer.tipo === 1 ||
            solicitudThisPago.datosEntrega.chofer.tipo === 2
          ) {
            reqSinDuplicadas = reqSinDuplicadas.map((req) => {
              if (req.id === solicitudThisPago.id) {
                const detallePagoUp = {
                  ...req.datosFlete.detallesPago,
                  camionExterno: {
                    ...req.datosFlete.detallesPago.camionExterno,
                    ...infoThisPago,
                    monto: pago.monto,
                  },
                };

                // Si this pago ya existe, se cae el proceso
                if (req.datosFlete.detallesPago.camionExterno.pagoGenerado) {
                  warning = true;
                  reqsWarning.push(solicitudThisPago.numeroDoc);
                  console.log(2);
                  return {
                    ...req,
                  };
                }
                upIdElsUp(pago);
                return {
                  ...req,
                  datosFlete: {
                    ...req.datosFlete,
                    detallesPago: detallePagoUp,
                  },
                };
              } else {
                return { ...req };
              }
            });
          }
        }
      }
    }
    // 2-Ayudante camion principal
    else if (codigoOrigen == "ElOG2") {
      // ****ID DEL BENEFICIARIO
      // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en ayudante
      if (pago.beneficiario.id === solicitudThisPago.datosEntrega.ayudante.id) {
        // ID ELEMENTO ORIGEN
        // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
        if (
          pago.idElementoOrigen ===
          solicitudThisPago.datosFlete.idCamionComoElemento
        ) {
          if (solicitudThisPago.datosEntrega.ayudante.id) {
            reqSinDuplicadas = reqSinDuplicadas.map((req) => {
              //
              if (req.id === solicitudThisPago.id) {
                const detallePagoUp = {
                  ...req.datosFlete.detallesPago,
                  ayudanteInterno: {
                    ...req.datosFlete.detallesPago.ayudanteInterno,
                    ...infoThisPago,
                    monto: pago.costoInterno,
                  },
                };

                // Si this pago ya existe, se cae el proceso
                if (req.datosFlete.detallesPago.ayudanteInterno.pagoGenerado) {
                  warning = true;
                  reqsWarning.push(solicitudThisPago.numeroDoc);
                  console.log(3);
                  return {
                    ...req,
                  };
                }
                upIdElsUp(pago);
                return {
                  ...req,
                  datosFlete: {
                    ...req.datosFlete,
                    detallesPago: detallePagoUp,
                  },
                };
              } else {
                return { ...req };
              }
            });
          }
        }
      }
    }

    // 3-Ayudante adicional camion principal
    else if (codigoOrigen == "ElOG3") {
      reqSinDuplicadas = reqSinDuplicadas.map((req) => {
        if (req.id === solicitudThisPago.id) {
          const ayudantesAddParsed = req.datosFlete.ayudantesAdicionales.map(
            (ayudAdd) => {
              const detallePagoUp = {
                ...infoThisPago,
                monto: pago.monto,
              };

              // ****ID DEL BENEFICIARIO
              // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en este ayudante adicional
              if (pago.beneficiario.id == ayudAdd.datosAyudante.id) {
                // ID ELEMENTO ORIGEN
                // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
                if (
                  pago.idElementoOrigen === ayudAdd.idAyudanteAddComoElemento
                ) {
                  // Si this pago ya existe, se cae el proceso
                  if (ayudAdd.detallesPago.pagoGenerado) {
                    warning = true;
                    reqsWarning.push(solicitudThisPago.numeroDoc);
                    console.log(4);
                    return {
                      ...ayudAdd,
                    };
                  }
                  upIdElsUp(pago);
                  return {
                    ...ayudAdd,
                    detallesPago: detallePagoUp,
                  };
                }
              }

              return {
                ...ayudAdd,
              };
            }
          );

          return {
            ...req,
            datosFlete: {
              ...req.datosFlete,
              ayudantesAdicionales: ayudantesAddParsed,
            },
          };
        } else {
          return { ...req };
        }
      });
    } else if (
      // Si es camion adicional
      codigoOrigen == "ElOG4" ||
      // Si es ayudante de camion adicional
      codigoOrigen == "ElOG5" ||
      // Si es ayudante adicional de camion adicional
      codigoOrigen == "ElOG6"
    ) {
      // 4-Si es camion adicional
      if (codigoOrigen == "ElOG4") {
        reqSinDuplicadas = reqSinDuplicadas.map((req) => {
          if (req.id === solicitudThisPago.id) {
            const camionesAddParsed = req.datosFlete.vehiculosAdicionales.map(
              (vehAdd) => {
                // ****ID DEL BENEFICIARIO
                // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en este chofer adicional
                if (pago.beneficiario.id == vehAdd.datosEntrega.chofer.id) {
                  // ID ELEMENTO ORIGEN
                  // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
                  if (pago.idElementoOrigen === vehAdd.idCamionComoElemento) {
                    // Si es chofer interno
                    if (vehAdd.datosEntrega.chofer.tipo === 0) {
                      console.log(vehAdd);
                      const detallePagoUp = {
                        ...vehAdd.detallesPago,
                        choferInterno: {
                          ...vehAdd.detallesPago.choferInterno,
                          ...infoThisPago,
                          monto: pago.costoInterno,
                        },
                      };
                      // Si this pago ya existe, se cae el proceso
                      if (vehAdd.detallesPago.choferInterno.pagoGenerado) {
                        warning = true;
                        reqsWarning.push(solicitudThisPago.numeroDoc);
                        console.log(5);
                        return {
                          ...vehAdd,
                        };
                      }

                      upIdElsUp(pago);
                      return {
                        ...vehAdd,
                        detallesPago: detallePagoUp,
                      };
                    }
                    // Si es chofer externo
                    else if (
                      vehAdd.datosEntrega.chofer.tipo === 1 ||
                      vehAdd.datosEntrega.chofer.tipo === 2
                    ) {
                      const detallePagoUp = {
                        ...vehAdd.detallesPago,
                        camionExterno: {
                          ...vehAdd.detallesPago.camionExterno,
                          ...infoThisPago,
                          monto: pago.monto,
                        },
                      };
                      // Si this pago ya existe, se cae el proceso
                      if (vehAdd.detallesPago.camionExterno.pagoGenerado) {
                        warning = true;
                        reqsWarning.push(solicitudThisPago.numeroDoc);
                        console.log(6);
                        return {
                          ...vehAdd,
                        };
                      }
                      upIdElsUp(pago);
                      return {
                        ...vehAdd,
                        detallesPago: detallePagoUp,
                      };
                    }
                  }
                }

                return {
                  ...vehAdd,
                };
              }
            );
            return {
              ...req,
              datosFlete: {
                ...req.datosFlete,
                vehiculosAdicionales: camionesAddParsed,
              },
            };
          } else {
            return { ...req };
          }
        });
      }

      // 5-Ayudante camion adicional
      else if (codigoOrigen == "ElOG5") {
        reqSinDuplicadas = reqSinDuplicadas.map((req) => {
          if (req.id === solicitudThisPago.id) {
            const camionesAddParsed = req.datosFlete.vehiculosAdicionales.map(
              (vehAdd) => {
                // ****ID DEL BENEFICIARIO
                // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en el ayudante de este chofer adicional
                if (pago.beneficiario.id == vehAdd.datosEntrega.ayudante.id) {
                  // ID ELEMENTO ORIGEN
                  // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
                  if (pago.idElementoOrigen === vehAdd.idCamionComoElemento) {
                    const detallePagoUp = {
                      ...vehAdd.detallesPago,
                      ayudanteInterno: {
                        ...vehAdd.detallesPago.ayudanteInterno,
                        ...infoThisPago,
                        monto: pago.costoInterno,
                      },
                    };

                    // Si this pago ya existe, se cae el proceso
                    if (vehAdd.detallesPago.ayudanteInterno.pagoGenerado) {
                      console.log(vehAdd);
                      warning = true;
                      reqsWarning.push(solicitudThisPago.numeroDoc);
                      console.log(7);
                      return {
                        ...vehAdd,
                      };
                    }
                    upIdElsUp(pago);
                    return {
                      ...vehAdd,
                      detallesPago: detallePagoUp,
                    };
                  }
                }

                return {
                  ...vehAdd,
                };
              }
            );

            return {
              ...req,
              datosFlete: {
                ...req.datosFlete,
                vehiculosAdicionales: camionesAddParsed,
              },
            };
          } else {
            return { ...req };
          }
        });
      }

      // 6-Ayudante adicional camion adicional
      else if (codigoOrigen == "ElOG6") {
        reqSinDuplicadas = reqSinDuplicadas.map((req) => {
          if (req.id === solicitudThisPago.id) {
            const camionesAddParsed = req.datosFlete.vehiculosAdicionales.map(
              (vehAdd) => {
                const ayudantesAddParsed = vehAdd.ayudantesAdicionales.map(
                  (ayudAdd) => {
                    // ****ID DEL BENEFICIARIO
                    // Confirmar que el id del beneficiario en el pago, es el mismo id que tiene la solicitud en el ayudante de este ayudante adicional de este chofer adicional
                    if (pago.beneficiario.id == ayudAdd.datosAyudante.id) {
                      // ID ELEMENTO ORIGEN
                      // Confirmar que el id del elemento como origen que tiene el pago es el mismo al elemento dentro de la solicitud
                      if (
                        pago.idElementoOrigen ===
                        ayudAdd.idAyudanteAddComoElemento
                      ) {
                        const detallePagoUp = {
                          ...ayudAdd.detallesPago,
                          ...infoThisPago,
                          monto: pago.monto,
                        };
                        // Si this pago ya existe, se cae el proceso
                        if (ayudAdd.detallesPago.pagoGenerado) {
                          console.log(8);
                          reqsWarning.push(solicitudThisPago.numeroDoc);
                          warning = true;
                          return {
                            ...ayudAdd,
                          };
                        }
                        upIdElsUp(pago);
                        return {
                          ...ayudAdd,
                          detallesPago: detallePagoUp,
                        };
                      }
                    }

                    return {
                      ...ayudAdd,
                    };
                  }
                );

                return {
                  ...vehAdd,
                  ayudantesAdicionales: ayudantesAddParsed,
                };
              }
            );

            return {
              ...req,
              datosFlete: {
                ...req.datosFlete,
                vehiculosAdicionales: camionesAddParsed,
              },
            };
          } else {
            return { ...req };
          }
        });
      }
    }
    const reqThisPagoParseada = reqSinDuplicadas.find(
      (req) => req.id === solicitudThisPago.id
    );
    return {
      ...pago,
      solicitudAux: reqThisPagoParseada,
    };
  });

  // Si hay algun warning, entonces el pago no debe ejecutarse

  if (reqsWarning.length > 0) {
    console.warn(
      "Hay solicitudes con pagos ya ejecutados, a continuacion numeros:"
    );
    reqsWarning.forEach((req) => {
      console.warn(req);
    });
  }
  return {
    listaPagosParsed: warning ? [] : listaPagosParsed,
    warning: warning,
    idsElementosActualizados: idsElementosActualizados,
  };
};
