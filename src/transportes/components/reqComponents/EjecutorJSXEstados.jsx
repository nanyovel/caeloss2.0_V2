// SI una solicitud tiene vehiculos adicionales en estado concluido, entonces la solicitud esta en ejecucion pero no permitira cambiar a planiifcacdo o anualado

// SI una solicitud tiene vehiculos adicionales en estado ejecucion, la solicitud podra ser planificada nuevamente o anulada

import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Alerta } from "../../../components/Alerta";
import {
  fetchDocsByConditionGetDocs,
  obtenerDocPorId2,
  useDocByCondition,
} from "../../../libs/useDocByCondition";
import { doc, writeBatch } from "firebase/firestore";
import { TwoWeek } from "./../../../components/TwoWeek";
import db from "../../../firebase/firebaseConfig";
import { ES6AFormat } from "../../../libs/FechaFormat";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { ClearTheme, Tema, Theme } from "../../../config/theme";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../components/InputGeneral";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { BotonQuery } from "../../../components/BotonQuery";

import { FuncionEnviarCorreo } from "../../../libs/FuncionEnviarCorreo";
import { PlantillaCorreoReqState } from "../../libs/PlantillaCorreoReqState";
import { OpcionUnica } from "../../../components/OpcionUnica";

import {
  StyleTextStateReq,
  CajaStatusComponent,
  AsuntosSegunEstadoReq,
} from "../../libs/DiccionarioNumberString";
import { parsearEstadosReq } from "../../libs/parsearEstadosReq";

import { unificarVehiculos } from "../../libs/unificarVehiculos";
import {
  datosEntregaSchemaVehAdd,
  vehiculoAdicionalSchema,
} from "../../schemas/vehiculoAddSchema";
import { nombreApellido } from "../../../libs/StringParsed";

export default function EjecutorJSXEstados({
  setHasAccion,
  propsConfigEstado,
  handleEstados,
  setDBChoferes,
  dbChoferes,
  tipo,
  botonSeleccionado,
  resetDatosChange,
  // Pagos

  userMaster,
  estadoOficial,
}) {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [datosParseados, setDatosParseados] = useState(false);

  // Listas Choferes
  const [dbChoferesAux, setDBChoferesAux] = useState([]);
  const [listaChoferesDisponibles, setListaChoferesDisponibles] = useState([]);
  const [listaChoferesEjecucion, setListaChoferesEjecucion] = useState([]);
  const [listaChoferesCasiCompleta, setListaChoferesCasiCompleta] = useState(
    []
  );

  const privilegioEstados = [
    "planificatedRequestTMS",
    "runRequestTMS",
    "terminateRequestTMS",
    "annularRequestTMS",
  ];

  // Lista de ayudantes
  const [ayudantesDisponibles, setAyudantesDisponible] = useState([]);
  const [ayudantesCasiCompleta, setAyudantesCasiCompleta] = useState([]);

  const [weekSelected, setWeekSelected] = useState({ ...TwoWeek });

  useEffect(() => {
    // Parsear Choferes
    setDBChoferes(dbChoferesAux);
    setListaChoferesDisponibles(
      dbChoferesAux.filter(
        (chofer) => chofer.estadoDoc == 1 && chofer.isAyudante == false
      )
    );

    setListaChoferesEjecucion(
      dbChoferesAux.filter(
        (chofer) => chofer.estadoDoc == 2 && chofer.isAyudante == false
      )
    );
    const listaCasiCompletaAux = dbChoferesAux.filter(
      (chofer) => chofer.estadoDoc < 3 && chofer.isAyudante == false
    );
    setListaChoferesCasiCompleta(listaCasiCompletaAux);

    // Seleccionar Chofer
    const { tipo, solicitud } = propsConfigEstado;
    const nombreChofer = solicitud.datosEntrega.chofer.nombre;
    const apellidoChofer = solicitud.datosEntrega.chofer.apellido;
    const idChofer = solicitud.datosEntrega.chofer.id;

    const choferEjecucion = nombreApellido(nombreChofer, apellidoChofer);

    if (tipo == "concluir" || tipo == "ejecutar") {
      if (choferEjecucion) {
        setDisabledChofer(true);
        setHasBtnEditarChofer(true);
      }
      setChoferInput(choferEjecucion);
    }

    listaCasiCompletaAux.forEach((chofer) => {
      if (chofer.id == idChofer) {
        setChoferSelecionado(chofer);
      }
    });

    // Parsear ayudante
    const ayudantesAux = dbChoferesAux.filter((ayudante) => {
      if (ayudante.isAyudante) {
        return ayudante;
      }
    });
    const ayudanteDisponibleAux = ayudantesAux.filter(
      (ayudante) => ayudante.estadoDoc < 2
    );
    const ayudanteCasiCompletAux = ayudantesAux.filter(
      (ayudante) => ayudante.estadoDoc < 3
    );

    setAyudantesDisponible(ayudanteDisponibleAux);
    setAyudantesCasiCompleta(ayudanteCasiCompletAux);

    // Seleccionar ayudante
    const nombreAyudante = solicitud.datosEntrega.ayudante.nombre;
    const apellidoAyudante = solicitud.datosEntrega.ayudante.apellido;
    const idAyudante = solicitud.datosEntrega.ayudante.id;
    const ayudanteEjecucion = nombreApellido(nombreAyudante, apellidoAyudante);

    if (tipo == "concluir" || tipo == "ejecutar") {
      setAyudanteInput(ayudanteEjecucion);
    }
    ayudanteCasiCompletAux.forEach((ayudante) => {
      if (ayudante.id == idAyudante) {
        setAyudanteSeleccionado(ayudante);
      }
    });

    const annio = solicitud.fechaConclucion.slice(6, 10);
    const mes = solicitud.fechaConclucion.slice(3, 5);
    const dia = solicitud.fechaConclucion.slice(0, 2);
    const fechaValue = annio + "-" + mes + "-" + dia;
    setFechaConcluidaMostrar(fechaValue);
    // WEEK Parsear
    const fechaActual = new Date();
    const numeroDiaES6 = fechaActual.getDay();
    const numeroDiaParsed = numeroDiaES6 > 0 ? numeroDiaES6 - 1 : 6;
    // Identificar dias inactivos de la semana
    setWeekSelected({
      ...weekSelected,
      week1: [
        ...weekSelected.week1.map((day, i) => {
          let fecha = "";
          if (i == numeroDiaParsed) {
            fecha = fechaActual;
          } else if (i > numeroDiaParsed) {
            fecha = new Date();
            let dif = i - numeroDiaParsed;
            fecha.setDate(fechaActual.getDate() + dif);
          } else if (i < numeroDiaParsed) {
            fecha = new Date();
            let dif = i - numeroDiaParsed;
            fecha.setDate(fechaActual.getDate() + dif);
          }
          let fechaFormato = format(fecha, `dd/MM/yyyy hh:mm:ss:SSS aa`, {
            locale: es,
          });

          return {
            ...day,
            disabled: numeroDiaParsed > i ? true : false,
            fecha: fechaFormato,
          };
        }),
      ],

      week2: [
        ...weekSelected.week2.map((day, i) => {
          // Primero dime cual es la diferencia de dias de hoy hasta el lunes de la semana proxima
          let fechaActual = new Date();
          const numeroDiaES6 = fechaActual.getDay();
          // Si el dia es domingo entonces sera igual a 6, ese decir el septimo dia, hago esto dado que para js el domingo es primer dia pero es mas sencillo para el usuario si el lunes es el primer dia
          const numeroDiaParsed = numeroDiaES6 > 0 ? numeroDiaES6 - 1 : 6;
          let dif = 7 - numeroDiaParsed;
          // dias a sumar sera igual a la diferencia de hoy hasta el lunes mas i que es que ira sumando lunes, martes miercoles...
          let diasASumar = dif + i;
          let fechaFinal = new Date();
          fechaFinal.setDate(fechaActual.getDate() + diasASumar);
          let fechaFormato = format(fechaFinal, `dd/MM/yyyy hh:mm:ss:SSS aa`, {
            locale: es,
          });

          return {
            ...day,
            fecha: fechaFormato,
          };
        }),
      ],
    });

    setDatosParseados(true);
  }, [dbChoferesAux, dbChoferes, propsConfigEstado]);

  // useEffect choferes adicionales
  const [vehiculosAdicionales, setVehiculosAdicionales] = useState([]);
  useEffect(() => {
    if (propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales) {
      setVehiculosAdicionales(
        propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales?.map(
          (vehi, index) => {
            let datosEntrega = {};

            let fecha = {};
            if (vehi?.datosEntrega?.fecha) {
              fecha = vehi.datosEntrega?.fecha;
            } else {
              fecha = {
                ...datosEntregaSchemaVehAdd.fecha,
              };
            }
            const chofer = vehi.datosEntrega?.chofer;
            const ayudante = vehi.datosEntrega?.ayudante;
            const hasAyudante = vehi.datosEntrega?.ayudante.id ? true : false;
            const annio = vehi.datosEntrega.fecha.fechaConclucion.slice(6, 10);
            const mes = vehi.datosEntrega.fecha.fechaConclucion.slice(3, 5);
            const dia = vehi.datosEntrega.fecha.fechaConclucion.slice(0, 2);
            const fechaValue = annio + "-" + mes + "-" + dia;
            if (chofer.id) {
              datosEntrega = {
                ...vehi.datosEntrega,
                disabled: true,
                chofer: {
                  ...chofer,
                  // Esta propiedad la utilizo para cuando guarde los cambios pueda editar el chofer en el input y cuando lo vuelva seleccionar el mismo chofer no de error y se guarden los cambios correctamente
                  choferSeleccionado: nombreApellido(
                    chofer.nombre,
                    chofer.apellido
                  ),
                  valueInput: nombreApellido(chofer.nombre, chofer.apellido),
                },
                ayudante: {
                  ...vehi.datosEntrega.ayudante,
                  ayudanteSeleccionado: ayudante,
                  valueInput: hasAyudante
                    ? nombreApellido(ayudante.nombre, ayudante.apellido)
                    : "",
                },
                fecha: {
                  ...vehi.datosEntrega.fecha,
                  fachaConclucionValue:
                    vehi.datosEntrega.status == 3 ? fechaValue : "",
                },
              };
            } else {
              datosEntrega = {
                ...datosEntregaSchemaVehAdd,
                status: 0,
                disabled: false,
                chofer: {
                  ...datosEntregaSchemaVehAdd.chofer,
                  valueInput: "",
                },
                ayudante: {
                  ...datosEntregaSchemaVehAdd.ayudante,
                  valueInput: "",
                },
                fecha: {
                  ...fecha,
                  fachaConclucionValue: "",
                },
              };
            }
            return {
              ...vehi,
              datosEntrega: datosEntrega,
            };
          }
        )
      );
    } else {
      setVehiculosAdicionales([]);
    }
  }, [propsConfigEstado.solicitud]);

  useEffect(() => {
    console.log(vehiculosAdicionales);
  }, [vehiculosAdicionales]);
  useDocByCondition("choferes", setDBChoferesAux);

  const handleChoferesAdd = (e) => {
    const { value, name } = e.target;
    const indexDataset = e.target.dataset.index;
    const campoDataset = e.target.dataset.campo;
    const tipoFecha = e.target.dataset.tipofecha;

    const fechaActual = new Date();
    const annio = Number(value.slice(0, 4));
    const mes = Number(value.slice(5, 7)) - 1;
    const dia = Number(value.slice(8, 10));

    const fechaColocadaES6 = new Date(annio, mes, dia);
    if (fechaActual < fechaColocadaES6) {
      setMensajeAlerta("Fecha indicada posterior a fecha actual.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    setVehiculosAdicionales(
      vehiculosAdicionales.map((chofer, index) => {
        if (index == indexDataset) {
          if (campoDataset == "fecha") {
            const annio = Number(value.slice(0, 4));
            const mes = Number(value.slice(5, 7)) - 1;
            const dia = Number(value.slice(8, 10));

            const fechaColocadaES6 = new Date(annio, mes, dia);

            return {
              ...chofer,
              datosEntrega: {
                ...chofer.datosEntrega,
                fecha: {
                  ...chofer.datosEntrega[campoDataset],
                  [tipoFecha]: ES6AFormat(new Date(annio, mes, dia)),
                  fachaConclucionValue: value,
                },
              },
            };
          } else if (campoDataset == "chofer") {
            let nombreAyudante = "";
            listaChoferesCasiCompleta.forEach((chofer) => {
              if (nombreApellido(chofer.nombre, chofer.apellido) == value) {
                nombreAyudante = nombreApellido(
                  chofer.ayudante.nombre,
                  chofer.ayudante.apellido
                );
              }
            });
            return {
              ...chofer,
              datosEntrega: {
                ...chofer.datosEntrega,
                chofer: {
                  ...chofer.datosEntrega.chofer,
                  // -❌❌❌❌
                  // Esta propiedad se debe eliminar al enviar a la base de datos
                  //  Junto con unidad vehicular
                  valueInput: value,
                  // -❌❌❌❌
                },
                ayudante: {
                  ...chofer.datosEntrega.ayudante,
                  valueInput: nombreAyudante,
                },
              },
            };
          } else if (campoDataset == "ayudante") {
            return {
              ...chofer,
              datosEntrega: {
                ...chofer.datosEntrega,
                ayudante: {
                  ...chofer.datosEntrega.ayudante,
                  // -❌❌❌❌
                  // Esta propiedad se debe eliminar al enviar a la base de datos
                  //  Junto con unidad vehicular
                  valueInput: value,
                  disabled: false,
                  // -❌❌❌❌
                },
              },
            };
          }
        } else {
          return chofer;
        }
      })
    );
  };

  const selecionarDia = (e) => {
    let validacionDiaActivo = true;
    let index = Number(e.target.dataset.id);
    const nombre = e.target.dataset.nombre;

    // Si la solicitud esta concluida
    // Se supone que esta validacion nunca se va ejecutar
    if (propsConfigEstado.solicitud.estadoDoc == 3) {
      setMensajeAlerta("Esta solicitud esta concluida.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Si la solicitud tiene al menos un vehiculo en estado concludio
    // Se supone que esta validacion nunca se va ejecutar
    const vehiculosUnificados = unificarVehiculos(
      propsConfigEstado.solicitud
    ).some((vehAdd) => vehAdd.datosEntrega.status == 3);
    if (vehiculosUnificados) {
      setMensajeAlerta(
        "Esta solicitud tiene vehiculos adicionales en estado concluida."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si el dia selecionado esta inactivo
    if (nombre == "semana1") {
      if (weekSelected.week1[index].disabled == true) {
        validacionDiaActivo = false;
        setMensajeAlerta("Este dia es anterior a la fecha actual.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }

    if (validacionDiaActivo == true) {
      if (nombre == "semana1") {
        setWeekSelected({
          week1: [
            ...weekSelected.week1.map((day, i) => {
              return {
                ...day,
                selected: i === index && day.selected == false ? true : false,
              };
            }),
          ],

          week2: [
            ...weekSelected.week2.map((day) => {
              return {
                ...day,
                selected: false,
              };
            }),
          ],
        });
      } else if (nombre == "semana2") {
        setWeekSelected({
          week1: [
            ...weekSelected.week1.map((day) => {
              return {
                ...day,
                selected: false,
              };
            }),
          ],
          week2: [
            ...weekSelected.week2.map((day, i) => {
              return {
                ...day,
                selected: i === index && day.selected == false ? true : false,
              };
            }),
          ],
        });
      }
    }
  };

  const [choferInput, setChoferInput] = useState("");
  const [choferSelecionado, setChoferSelecionado] = useState({});
  const [ayudanteInput, setAyudanteInput] = useState("");
  const [ayudanteSeleccionado, setAyudanteSeleccionado] = useState(null);

  const [fechaConcluidaMostrar, setFechaConcluidaMostrar] = useState("");
  const [fechaConcluidaInput, setFechaConcluidaInput] = useState("");

  const [justificacionInput, setJustificacion] = useState("");

  // Funcion auxiliar como solucion

  const handleInput = (e) => {
    let { value, name } = e.target;

    if (name == "chofer") {
      setChoferInput(value);
      let choferEspeficiado = null;
      listaChoferesCasiCompleta.forEach((chofer) => {
        if (nombreApellido(chofer.nombre, chofer.apellido) == value) {
          setChoferSelecionado(chofer);
          choferEspeficiado = chofer;
        }
      });

      // SI el chofer tiene ayudante especificado, entonces tomalo y ponselo a la solicitud
      if (choferEspeficiado) {
        if (choferEspeficiado.ayudante != null) {
          if (choferEspeficiado?.ayudante?.id != "") {
            setAyudanteInput(
              choferEspeficiado.ayudante.nombre +
                " " +
                choferEspeficiado.ayudante.apellido
            );

            ayudantesCasiCompleta.forEach((ayudante) => {
              if (ayudante.id == choferEspeficiado.ayudante.id) {
                setAyudanteSeleccionado(ayudante);
              }
            });
          }

          // si el chofer no tiene ayudante, quita cualquier selecion
          if (choferEspeficiado.ayudante.id == "") {
            setAyudanteInput("");
            setAyudanteSeleccionado(null);
          }
        }
      }
    } else if (name == "ayudante") {
      setAyudanteInput(value);
      // Si hay un ayudante colocado
      if (value != "") {
        ayudantesCasiCompleta.forEach((ayudante) => {
          if (nombreApellido(ayudante.nombre, ayudante.apellido) == value) {
            setAyudanteSeleccionado(ayudante);
          }
        });
      } else if (value == "") {
        setAyudanteSeleccionado(null);
      }
    } else if (name == "fechaConcluida") {
      setFechaConcluidaMostrar(value);
      const annio = value.slice(0, 4);
      const mes = value.slice(5, 7);
      const dia = value.slice(8, 10);
      if (annio && mes && dia) {
        const fechaES6 = new Date(annio, mes - 1, dia);
        const fechaFormateada = ES6AFormat(fechaES6);
        setFechaConcluidaInput(fechaFormateada);
      } else {
        setFechaConcluidaInput("");
      }
    } else if (name == "justificacionInput") {
      setJustificacion(value);
    }
  };

  // Si es en modo concluir, deben aparecer algunos datos ya llenos
  const [disabledChofer, setDisabledChofer] = useState(false);
  const [hasBtnEditarChofer, setHasBtnEditarChofer] = useState(false);
  const [modificatedChofer, setModificatedChofer] = useState(false);

  const editableChofer = () => {
    setDisabledChofer(false);
    setHasBtnEditarChofer(false);
    setModificatedChofer(true);
  };

  // Si la solicitud esta en borrador desactiva todo
  const [enableXDraft, setEnableXDraft] = useState(false);
  useEffect(() => {
    if (propsConfigEstado.solicitud.estadoDoc !== -1) {
      setEnableXDraft(true);
    }
  }, [propsConfigEstado.solicitud.estadoDoc]);

  const guardarAccion = async () => {
    const newLog = propsConfigEstado.solicitud.log
      ? propsConfigEstado.solicitud.log
      : [];
    const tipoLog = "cambioEstado";
    // Si la solicitud esta concluida o cancelada no debe permitir hacer nada
    if (propsConfigEstado.solicitud.estadoDoc >= 3) {
      return "";
    }

    if (propsConfigEstado.solicitud.estadoDoc == -1) {
      // Esta validacion se supone que nunca sera ejecutada, dado a que visualmente las opciones para cambiar estados no deben estar activas
      setMensajeAlerta("No puede cambiar estado a borradores.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const { tipo } = propsConfigEstado;
    const batch = writeBatch(db);

    // Esta variable la utilizo para saber si la solicitud tenia al menos un vehiculo adicional o default en estado ejecucio
    const hasPrevEjecucion = unificarVehiculos(
      propsConfigEstado.solicitud
    ).some((vehiculo) => vehiculo.datosEntrega.status == 2);

    const estadoPrevEjecucion =
      propsConfigEstado.solicitud.estadoDoc == 2 ? true : false;
    // *********** CHOFER/AYUDANTE ACTUAL ***************
    const choferesDispoMasActual = [
      ...listaChoferesDisponibles,
      choferSelecionado,
    ];

    const choferActual = choferesDispoMasActual.find(
      (chofer) => chofer.id == choferSelecionado.id
    );
    let ayudanteActual = null;
    if (ayudanteSeleccionado) {
      ayudanteActual = ayudantesCasiCompleta.find(
        (ayudante) => ayudante.id == ayudanteSeleccionado.id
      );
    }

    // *********** CHOFER/AYUDANTE ANTERIOR ***************
    const choferAnterior = listaChoferesEjecucion.find(
      (chofer) =>
        chofer.id == propsConfigEstado.solicitud.datosEntrega.chofer.id
    );
    const ayudanteAnterior = ayudantesCasiCompleta.find(
      (ayudante) =>
        ayudante.id == propsConfigEstado.solicitud.datosEntrega.ayudante.id
    );
    const limpiarChoferAnterior = () => {
      if (choferAnterior) {
        const choferActualizar = doc(db, "choferes", choferAnterior.id);
        // Primero saber si la solicitud dentro del chofer es la solicitud master
        const reqIsMaster =
          propsConfigEstado.solicitud.numeroDoc ==
          choferAnterior.current.solicitud.numeroDoc;

        // Despues saber si el array de las solicitudes adicionales tiene solicitudes
        const reqAddFilter =
          choferAnterior.current?.solicitudesAdicionales?.filter(
            (req, index) => {
              if (req.numeroDoc != propsConfigEstado.solicitud.numeroDoc) {
                return {
                  ...req,
                };
              }
            }
          ) || [];

        let estadoChofer = choferAnterior.estadoDoc;
        //
        // Si el chofer ya no tiene mas solicitudes entonces ponlo disponible:
        // 1-Esta solicitud es la maestra
        if (reqIsMaster) {
          // Verifica si le quedan solicitudes adicionales
          if (reqAddFilter.length > 0) {
            estadoChofer = 2;
          } else {
            estadoChofer = 1;
          }
        }
        // 2-Esta es una solicitud adicional
        else {
          // Verifica dos cosas:
          //     -1 si aun tiene solicitud maestra
          //     -2 si le quedan solicitudes adicionales
          if (
            choferAnterior.current.solicitud.numeroDoc ||
            reqAddFilter.length > 0
          ) {
            estadoChofer = 2;
          } else {
            estadoChofer = 1;
          }
        }

        if (reqIsMaster) {
          batch.update(choferActualizar, {
            estadoDoc: estadoChofer,
            "current.solicitud": {},
          });
        }
        //
        else {
          batch.update(choferActualizar, {
            estadoDoc: estadoChofer,
            "current.solicitudesAdicionales": reqAddFilter,
          });
        }
      }
      if (ayudanteAnterior) {
        const ayudanteActualizar = doc(db, "choferes", ayudanteAnterior.id);
        // Primero saber si la solicitud dentro del ayundante es la solicitud master
        const reqIsMaster =
          propsConfigEstado.solicitud.numeroDoc ==
          ayudanteAnterior.current.solicitud.numeroDoc;

        // Despues saber si el array de las solicitudes adicionales tiene solicitudes
        const reqAddFilter =
          ayudanteAnterior.current?.solicitudesAdicionales?.filter(
            (req, index) => {
              if (req.numeroDoc != propsConfigEstado.solicitud.numeroDoc) {
                return {
                  ...req,
                };
              }
            }
          ) || [];
        let estadoAyudante = ayudanteAnterior.estadoDoc;

        // Si el ayudante ya no tiene mas solicitudes entonces ponlo disponible:
        // 1-Esta solicitud es la maestra
        if (reqIsMaster) {
          // Verifica si le quedan solicitudes adicionales
          if (reqAddFilter.length > 0) {
            estadoAyudante = 2;
          } else {
            estadoAyudante = 1;
          }
        }
        // 2-Esta es una solicitud adicional
        else {
          // Verifica dos cosas:
          //     -1 si aun tiene solicitud maestra
          //     -2 si le quedan solicitudes adicionales
          if (
            ayudanteAnterior.current.solicitud.numeroDoc ||
            reqAddFilter.length > 0
          ) {
            estadoAyudante = 2;
          } else {
            estadoAyudante = 1;
          }
        }

        if (reqIsMaster) {
          batch.update(ayudanteActualizar, {
            estadoDoc: estadoAyudante,
            "current.solicitud": {},
          });
        } else {
          batch.update(ayudanteActualizar, {
            estadoDoc: estadoAyudante,
            "current.solicitudesAdicionales": reqAddFilter,
          });
        }
      } else {
        console.log("sin ayudante");
      }
      // 4125
      // *********** Limpiar choferes adicionales si posee solamente pero: ***********
      // Esto debe pasar solamente si es planificar o cancelar
      // Tomar en cuenta que el chofer se le debe quitar esta solicitud, no todo pues ahora el chofer puede tener varias solicitudes
      if (tipo == "planificar" || tipo == "cancelar") {
        if (
          propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales.length > 0
        ) {
          propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales.forEach(
            (vehiculo) => {
              if (vehiculo.datosEntrega.chofer.id) {
                console.log(vehiculo);
                const choferActualizar = doc(
                  db,
                  "choferes",
                  vehiculo.datosEntrega.chofer.id
                );

                const choferThis = listaChoferesCasiCompleta.find(
                  (chofer, index) => {
                    if (vehiculo.datosEntrega.chofer.id == chofer.id) {
                      return chofer;
                    }
                  }
                );
                // Primero saber si la solicitud dentro del chofer es la solicitud master
                const reqIsMaster =
                  propsConfigEstado.solicitud.numeroDoc ==
                  choferThis.current.solicitud.numeroDoc;

                // Despues saber si el array de las solicitudes adicionales tiene solicitudes
                const reqAddFilter =
                  choferThis.current?.solicitudesAdicionales?.filter(
                    (req, index) => {
                      if (
                        req.numeroDoc != propsConfigEstado.solicitud.numeroDoc
                      ) {
                        return {
                          ...req,
                        };
                      }
                    }
                  ) || [];

                let estadoChofer = choferThis.estadoDoc;
                //
                // Si el chofer ya no tiene mas solicitudes entonces ponlo disponible:
                // 1-Esta solicitud es la maestra
                if (reqIsMaster) {
                  // Verifica si le quedan solicitudes adicionales
                  if (reqAddFilter.length > 0) {
                    estadoChofer = 2;
                  } else {
                    estadoChofer = 1;
                  }
                }
                // 2-Esta es una solicitud adicional
                else {
                  // Verifica dos cosas:
                  //     -1 si aun tiene solicitud maestra
                  //     -2 si le quedan solicitudes adicionales
                  if (
                    choferThis.current.solicitud.numeroDoc ||
                    reqAddFilter.length > 0
                  ) {
                    estadoChofer = 2;
                  } else {
                    estadoChofer = 1;
                  }
                }

                if (reqIsMaster) {
                  batch.update(choferActualizar, {
                    estadoDoc: estadoChofer,
                    "current.solicitud": {},
                  });
                } else {
                  batch.update(choferActualizar, {
                    estadoDoc: estadoChofer,
                    "current.solicitudesAdicionales": reqAddFilter,
                  });
                }
              }
              if (vehiculo.datosEntrega.ayudante.id) {
                const ayudanteActualizar = doc(
                  db,
                  "choferes",
                  vehiculo.datosEntrega.ayudante.id
                );
                const ayudanteThis = ayudantesCasiCompleta.find(
                  (ayudante, index) => {
                    if (vehiculo.datosEntrega.ayudante.id == ayudante.id) {
                      return ayudante;
                    }
                  }
                );

                // Primero saber si la solicitud dentro del ayundante es la solicitud master
                const reqIsMaster =
                  propsConfigEstado.solicitud.numeroDoc ==
                  ayudanteThis.current.solicitud.numeroDoc;
                // Despues saber si el array de las solicitudes adicionales tiene solicitudes
                const reqAddFilter =
                  ayudanteThis.current?.solicitudesAdicionales?.filter(
                    (req, index) => {
                      if (
                        req.numeroDoc != propsConfigEstado.solicitud.numeroDoc
                      ) {
                        return {
                          ...req,
                        };
                      }
                    }
                  ) || [];

                let estadoAyudante = ayudanteThis.estadoDoc;

                // Si el ayudante ya no tiene mas solicitudes entonces ponlo disponible:
                // 1-Esta solicitud es la maestra
                if (reqIsMaster) {
                  // Verifica si le quedan solicitudes adicionales
                  if (reqAddFilter.length > 0) {
                    estadoAyudante = 2;
                  } else {
                    estadoAyudante = 1;
                  }
                }
                // 2-Esta es una solicitud adicional
                else {
                  // Verifica dos cosas:
                  //     -1 si aun tiene solicitud maestra
                  //     -2 si le quedan solicitudes adicionales
                  if (
                    ayudanteThis.current.solicitud.numeroDoc ||
                    reqAddFilter.length > 0
                  ) {
                    estadoAyudante = 2;
                  } else {
                    estadoAyudante = 1;
                  }
                }

                if (reqIsMaster) {
                  batch.update(ayudanteActualizar, {
                    estadoDoc: estadoAyudante,
                    "current.solicitud": {},
                  });
                } else {
                  batch.update(ayudanteActualizar, {
                    estadoDoc: estadoAyudante,
                    "current.solicitudesAdicionales": reqAddFilter,
                  });
                }
              }
            }
          );
        }
      }
    };

    if (tipo == "planificar") {
      const hasPlanificar = userMaster.permisos.includes(
        "planificatedRequestTMS"
      );
      if (!hasPlanificar) {
        return;
      }

      let fechaElegida = false;

      let fechaTomar = "";
      weekSelected.week1.forEach((day) => {
        if (day.selected == true) {
          fechaElegida = true;
          fechaTomar = day.fecha;
        }
      });
      weekSelected.week2.forEach((day) => {
        if (day.selected == true) {
          fechaElegida = true;
          fechaTomar = day.fecha;
        }
      });
      // Si la solicitud esta concluida o tiene vehiculos adicionales en modo concluido
      const hasEntregasRealizadas = unificarVehiculos(
        propsConfigEstado.solicitud
      )?.some((vehi) => {
        return vehi.datosEntrega.status == 3;
      });
      if (hasEntregasRealizadas) {
        setTipoAlerta("warning");
        setMensajeAlerta("Esta solicitud posee entregas ya realizadas.");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }

      // Si no coloco fecha
      if (fechaElegida == false) {
        setTipoAlerta("warning");
        setMensajeAlerta("Favor seleccionar fecha.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return;
      }

      setHasAccion(false);
      if (botonSeleccionado?.tipo) {
        resetDatosChange();
      }
      try {
        const estadoUp = 1;
        const solicitudActualizar = doc(
          db,
          "transferRequest",
          propsConfigEstado.solicitud.id
        );
        // 01-Batch - ACTUALIZAR SOLICITUD
        batch.update(solicitudActualizar, {
          // General
          estadoDoc: estadoUp,
          fechaPlanificacion: ES6AFormat(new Date()),
          fechaEjecucion: "",
          fechaEjecucionCorta: "",
          fechaConclucion: "",
          fechaCancelacion: "",
          "current.fechaDespProg": fechaTomar,
          // Chofer
          "datosEntrega.chofer.id": "",
          "datosEntrega.chofer.tipo": "",
          "datosEntrega.chofer.numeroDoc": "",
          "datosEntrega.chofer.nombre": "",
          "datosEntrega.chofer.apellido": "",
          "datosEntrega.chofer.urlFotoPerfil": "",
          // Ayudante
          "datosEntrega.ayudante.id": "",
          "datosEntrega.ayudante.numeroDoc": "",
          "datosEntrega.ayudante.nombre": "",
          "datosEntrega.ayudante.apellido": "",
          "datosEntrega.ayudante.tipo": "",

          // Vehiculo
          "datosEntrega.unidadVehicular.descripcion": "",
          "datosEntrega.unidadVehicular.placa": "",
          "datosEntrega.unidadVehicular.code": "",

          // Resetear vehiculos adicionales
          "datosFlete.vehiculosAdicionales":
            propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales.map(
              (vehiculo) => {
                return {
                  ...vehiculo,

                  datosEntrega: { ...datosEntregaSchemaVehAdd, status: 1 },
                };
              }
            ),
          // fffffff
          // Registro en log
          log: [
            ...newLog,
            {
              tipo: tipoLog,
              accion: "esperaStateReq",
              userName: userMaster.userName,
              fecha: ES6AFormat(new Date()),
              info: "",
            },
          ],
        });

        // Solamente si algun vehiculo anterior estaba en ejecucion
        // 02-Batch - Limpieza chofer
        if (hasPrevEjecucion) {
          limpiarChoferAnterior();
        }

        // 03-Batch - Actualizar hijas si posee
        if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
          propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
            (hija, index) => {
              const solicitudActualizar = doc(db, "transferRequest", hija.id);
              batch.update(solicitudActualizar, {
                estadoDoc: estadoUp,
                fechaEjecucion: "",
                fechaEjecucionCorta: "",
                "current.fechaDespProg": fechaTomar,
              });
            }
          );
        }

        await batch.commit();
        // Enviar correo de notificacion
        const solicitudEnv = {
          ...propsConfigEstado.solicitud,
          estadoDoc: estadoUp,
          current: {
            fechaDespProg: fechaTomar,
          },
          materiales: propsConfigEstado.solicitud.datosReq?.materialesDev || [],
        };
        let destinos = [];
        if (solicitudEnv.datosReq?.destinatariosNotificacion) {
          destinos = [
            ...solicitudEnv.datosReq.destinatariosNotificacion
              .map((d) => d.correo)
              .filter((correo) => correo),
          ];
        }

        destinos = [
          ...destinos,
          // solicitudEnv.datosSolicitante.userName + "@cielosacusticos.com",
        ];
        destinos = [...new Set(destinos)];
        console.log(destinos);
        if (destinos.length > 0) {
          FuncionEnviarCorreo({
            para: destinos,
            asunto: AsuntosSegunEstadoReq[solicitudEnv.estadoDoc],
            mensaje: PlantillaCorreoReqState(solicitudEnv),
          });
        }
      } catch (error) {
        console.log(error);
        setTipoAlerta("error");
        setMensajeAlerta("Error con la base de datos.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    } else if (tipo == "ejecutar") {
      const hasEjecutar = userMaster.permisos.includes("runRequestTMS");
      if (!hasEjecutar) {
        setTipoAlerta("warning");
        setMensajeAlerta("No posee los permisos necesarios.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return;
      }
      // Si no ha escrito chofer o el chofer escrito no es seleccionado de la lista desplegable
      if (!choferActual) {
        setTipoAlerta("warning");
        setMensajeAlerta("Seleccione un chofer de la lista desplegable.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }

      if (choferActual) {
        setHasAccion(false);
        if (botonSeleccionado?.tipo) {
          resetDatosChange();
        }
        try {
          const estadoUp = 2;
          const solicitudActualizar = doc(
            db,
            "transferRequest",
            propsConfigEstado.solicitud.id
          );

          const fechaActual = format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
            locale: es,
          });
          // 01-Batch - ACTUALIZAR SOLICITUD
          batch.update(solicitudActualizar, {
            // General
            estadoDoc: estadoUp,
            fechaEjecucion: fechaActual,
            fechaEjecucionCorta: fechaActual.slice(0, 10),
            "current.fechaDespProg": "",
            // Chofer
            "datosEntrega.chofer.id": choferActual.id,
            "datosEntrega.chofer.tipo": choferActual.tipo,
            "datosEntrega.chofer.numeroDoc": choferActual.numeroDoc,
            "datosEntrega.chofer.nombre": choferActual.nombre,
            "datosEntrega.chofer.apellido": choferActual.apellido,
            "datosEntrega.chofer.urlFotoPerfil": choferActual.urlFotoPerfil,
            // Ayudante
            "datosEntrega.ayudante.id": ayudanteSeleccionado
              ? ayudanteSeleccionado.id
              : "",
            "datosEntrega.ayudante.tipo": ayudanteSeleccionado
              ? ayudanteSeleccionado.tipo
              : "",
            "datosEntrega.ayudante.numeroDoc": ayudanteSeleccionado
              ? ayudanteSeleccionado.numeroDoc
              : "",
            "datosEntrega.ayudante.nombre": ayudanteSeleccionado
              ? ayudanteSeleccionado.nombre
              : "",
            "datosEntrega.ayudante.apellido": ayudanteSeleccionado
              ? ayudanteSeleccionado.apellido
              : "",

            // Vehiculo
            "datosEntrega.unidadVehicular.descripcion":
              choferActual.unidadVehicular.descripcion,
            "datosEntrega.unidadVehicular.placa":
              choferActual.unidadVehicular.placa,
            "datosEntrega.unidadVehicular.code":
              choferActual.unidadVehicular.code,
            "datosEntrega.unidadVehicular.urlFoto":
              choferActual.unidadVehicular.urlFoto,

            // Registro en log
            log: [
              ...newLog,
              {
                tipo: tipoLog,
                accion: "ejecucionStateReq",
                userName: userMaster.userName,
                fecha: ES6AFormat(new Date()),
                info: "",
              },
            ],
          });

          // LLenar chofer y ayudante
          const llenarChoferActual = () => {
            const choferActualizar = doc(db, "choferes", choferActual.id);
            // Si el chofer esta en ejcucion, es decir si ya tiene una solicitud le agregaras otra a una de las adicionales
            if (choferActual.estadoDoc == 2) {
              // solicitudesAdicionales
              const arrayAddChofer = [
                ...(choferActual.current.solicitudesAdicionales || []),
                propsConfigEstado.solicitud,
              ];
              batch.update(choferActualizar, {
                // General
                estadoDoc: 2,
                // Solicitud
                "current.solicitudesAdicionales": arrayAddChofer,
              });
              if (ayudanteActual) {
                const ayudanteActualizar = doc(
                  db,
                  "choferes",
                  ayudanteActual.id
                );

                const arrayAddAyudante = [
                  ...(ayudanteActual.current.solicitudesAdicionales || []),
                  propsConfigEstado.solicitud,
                ];

                batch.update(ayudanteActualizar, {
                  // General
                  estadoDoc: 2,
                  // Solicitud
                  "current.solicitudesAdicionales": arrayAddAyudante,
                });
              } else {
                console.log("no se coloco ayudante");
              }
            }
            // 44525
            // Si el chofer no esta en ejecucion, llenalo normal
            else {
              batch.update(choferActualizar, {
                // General
                estadoDoc: 2,
                // Solicitud
                "current.solicitud": propsConfigEstado.solicitud,
                // "current.solicitud": requestparsed,
              });
              if (ayudanteActual) {
                const ayudanteActualizar = doc(
                  db,
                  "choferes",
                  ayudanteActual.id
                );
                batch.update(ayudanteActualizar, {
                  // General
                  estadoDoc: 2,
                  // Solicitud
                  "current.solicitud": propsConfigEstado.solicitud,
                  // "current.solicitud": requestparsed,
                });
              } else {
                console.log("no se coloco ayudante");
              }
            }
          };

          // Si el estado anterior era ejecucion tambien, entonces:
          // Verificar si el chofer fue cambiado en el input:
          // SI el chofer fue cambiado:
          // -----limpiar chofer anterior
          // -----Colocar info al chofer nuevo
          // SI el chofer no ha sido cambiado:
          // -----No tocar chofer anterior

          // Si el estado previo era ejecucion
          // 7475
          if (estadoPrevEjecucion) {
            if (modificatedChofer) {
              limpiarChoferAnterior();
              llenarChoferActual();
            }
          } else {
            llenarChoferActual();
          }

          // 03-Batch - Actualizar hijas si posee
          if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
            propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
              (hija, index) => {
                const solicitudActualizar = doc(db, "transferRequest", hija.id);
                batch.update(solicitudActualizar, {
                  estadoDoc: estadoUp,
                  fechaEjecucion: fechaActual,
                  fechaEjecucionCorta: fechaActual.slice(0, 10),
                  "current.fechaDespProg": "",
                });
              }
            );
          }
          await batch.commit();
          // Enviar correo de notificacion
          const solicitudEnv = {
            ...propsConfigEstado.solicitud,
            estadoDoc: estadoUp,

            materiales:
              propsConfigEstado.solicitud.datosReq?.materialesDev || [],
          };

          let destinos = [];
          if (solicitudEnv.datosReq?.destinatariosNotificacion) {
            destinos = [
              ...solicitudEnv.datosReq.destinatariosNotificacion
                .map((d) => d.correo)
                .filter((correo) => correo),
            ];
          }

          destinos = [
            ...destinos,
            // solicitudEnv.datosSolicitante.userName + "@cielosacusticos.com",
          ];
          destinos = [...new Set(destinos)];
          console.log(destinos);
          FuncionEnviarCorreo({
            para: destinos,
            asunto: AsuntosSegunEstadoReq[solicitudEnv.estadoDoc],
            mensaje: PlantillaCorreoReqState(solicitudEnv, choferActual),
          });
        } catch (error) {
          console.log(error);
          setTipoAlerta("error");
          setMensajeAlerta("Error con la base de datos.");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return "";
        }
      }
    } else if (tipo == "concluir") {
      const ayudantesAddCurrent =
        propsConfigEstado.solicitud.datosFlete.ayudantesAdicionales;
      const allAprobado = ayudantesAddCurrent.some(
        (ayuAdd) => ayuAdd.status == 0
      );
      if (allAprobado) {
        setMensajeAlerta(
          "Este camion tiene ayudantes adicionales sin aprobar por el solicitante."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      const hasConcluir = userMaster.permisos.includes("terminateRequestTMS");
      if (!hasConcluir) {
        return;
      }
      let hasChofer = true;
      let hasFecha = true;
      const choferConcluyo = listaChoferesCasiCompleta.find(
        (chofer) => chofer.id == choferSelecionado.id
      );
      // Si no ha escrito chofer o el chofer escrito no es seleccionado de la lista desplegable
      if (!choferConcluyo) {
        setTipoAlerta("warning");
        setMensajeAlerta("Selecciona un chofer de la lista desplegable.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        hasChofer = false;
        return "";
      }

      // Si la fecha de concluion/ejecucion es posterior a la fecha actual
      const fechaActual = new Date();
      fechaActual.setHours(0, 0, 0, 0);

      const annio = fechaConcluidaInput.slice(6, 10);
      const mes = fechaConcluidaInput.slice(3, 5);
      const dia = fechaConcluidaInput.slice(0, 2);
      const fechaColocadaES6 = new Date(annio, mes - 1, dia);

      if (fechaActual < fechaColocadaES6) {
        setMensajeAlerta("Fecha indicada posterior a fecha actual.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return;
      }
      // Si no coloco fecha de conclucion
      console.log(fechaConcluidaInput);
      if (fechaConcluidaMostrar == "") {
        setMensajeAlerta("Seleccione fecha.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        hasFecha = false;
      }

      // Si todo esta correcto
      if (hasChofer && hasFecha) {
        setHasAccion(false);
        if (botonSeleccionado?.tipo) {
          resetDatosChange();
        }

        try {
          // const estadoUp = 3;
          const estadoUp = parsearEstadosReq({
            ...propsConfigEstado.solicitud,
            estadoDoc: 3,
          });

          // let pagoChofer = 0;
          // let pagoAyudante = 0;

          // // Si es un chofer interno, colocar incentivo fijo por viaje, traer monto del camion desde la base de datos
          // if (choferConcluyo.tipo == 0) {
          //   const camionesDB = await fetchDocsByConditionGetDocs(
          //     "miscelaneo",
          //     setDBCamiones
          //   );

          //   const camionBuscado = camionesDB.array.find(
          //     (camion) => camion.code == choferConcluyo.unidadVehicular.code
          //   );
          //   // pagoChofer = camionBuscado.viajesInterno.montoChofer;
          //   // Si ese chofer tiene ayudante, entonces colocale el monto
          //   if (ayudanteSeleccionado) {
          //     pagoAyudante = camionBuscado.viajesInterno.montoAyudante;
          //   }
          // }

          // // Si es un chofer externo colocar costo de viaje generado por la calculadora de Fletes
          // if (choferConcluyo.tipo == 1 || choferConcluyo.tipo == 2) {
          //   pagoChofer = propsConfigEstado.solicitud.datosFlete.costo;
          //   pagoAyudante = 0;
          // }

          const solicitudActualizar = doc(
            db,
            "transferRequest",
            propsConfigEstado.solicitud.id
          );
          // 7878
          console.log(ayudanteSeleccionado);
          // 01-Batch - ACTUALIZAR SOLICITUD
          batch.update(solicitudActualizar, {
            // General
            estadoDoc: estadoUp,
            "current.fechaDespProg": "",
            fechaConclucion: ES6AFormat(new Date()),
            // chofer
            "datosEntrega.chofer.id": choferConcluyo.id,
            "datosEntrega.chofer.tipo": choferConcluyo.tipo,
            "datosEntrega.chofer.numeroDoc": choferConcluyo.numeroDoc,
            "datosEntrega.chofer.nombre": choferConcluyo.nombre,
            "datosEntrega.chofer.apellido": choferConcluyo.apellido,
            "datosEntrega.chofer.urlFotoPerfil": choferConcluyo.urlFotoPerfil,
            // Ayudante
            "datosEntrega.ayudante.id": ayudanteSeleccionado
              ? ayudanteSeleccionado.id
              : "",
            "datosEntrega.ayudante.tipo": ayudanteSeleccionado
              ? ayudanteSeleccionado.tipo
              : "",
            "datosEntrega.ayudante.numeroDoc": ayudanteSeleccionado
              ? ayudanteSeleccionado.numeroDoc
              : "",
            "datosEntrega.ayudante.nombre": ayudanteSeleccionado
              ? ayudanteSeleccionado.nombre
              : "",
            "datosEntrega.ayudante.apellido": ayudanteSeleccionado
              ? ayudanteSeleccionado.apellido
              : "",
            // // Contabilidad
            // "contabilidad.montoPagarChofer": pagoChofer,
            // "contabilidad.montoPagarAyudante": pagoAyudante,
            // Vehiculo
            "datosEntrega.unidadVehicular.descripcion":
              choferConcluyo.unidadVehicular.descripcion,
            "datosEntrega.unidadVehicular.placa":
              choferConcluyo.unidadVehicular.placa,
            "datosEntrega.unidadVehicular.code":
              choferConcluyo.unidadVehicular.code,
            // Registro en log
            log: [
              ...newLog,
              {
                tipo: tipoLog,
                accion: "realizadaStateReq",
                userName: userMaster.userName,
                fecha: ES6AFormat(new Date()),
                info: "",
              },
            ],
          });

          // Si el estado anterior era ejecucion tambien, entonces:
          // Verificar si el chofer fue cambiado en el input:
          // SI el chofer fue cambiado:
          // -----limpiar chofer anterior
          // -----Colocar info al chofer nuevo
          // SI el chofer no ha sido cambiado:
          // -----No tocar chofer
          //
          // Si el estado previo era ejecucion
          if (estadoPrevEjecucion) {
            // 01-Si el chofer fue cambiado
            // if (modificatedChofer) {
            // Al chofer anterior limpiar current
            limpiarChoferAnterior();
            // Al chofer nuevo no tiene que hacerle nada, pues no hay chofer nuevo dado a que solicitud ahora esta en modo conluida
            // }
          }

          // 03-Batch - Actualizar hijas si posee
          if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
            propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
              (hija, index) => {
                const solicitudActualizar = doc(db, "transferRequest", hija.id);
                batch.update(solicitudActualizar, {
                  estadoDoc: estadoUp,
                  "current.fechaDespProg": "",
                  fechaEjecucion: fechaConcluidaInput,
                  fechaEjecucionCorta: fechaConcluidaInput.slice(0, 10),
                });
              }
            );
          }

          await batch.commit();
          // Enviar correo de notificacion
          const solicitudEnv = {
            ...propsConfigEstado.solicitud,
            estadoDoc: estadoUp,

            materiales:
              propsConfigEstado.solicitud.datosReq?.materialesDev || [],
          };

          let destinos = [];
          if (solicitudEnv.datosReq?.destinatariosNotificacion) {
            destinos = [
              ...solicitudEnv.datosReq.destinatariosNotificacion
                .map((d) => d.correo)
                .filter((correo) => correo),
            ];
          }

          destinos = [
            ...destinos,
            // solicitudEnv.datosSolicitante.userName + "@cielosacusticos.com",
          ];
          destinos = [...new Set(destinos)];
          FuncionEnviarCorreo({
            para: destinos,
            asunto: AsuntosSegunEstadoReq[solicitudEnv.estadoDoc],
            mensaje: PlantillaCorreoReqState(solicitudEnv, choferConcluyo),
          });
          // ********************************************************
          // Luego de hacer el commit agregar el pago al listado,
          // esto para que el usuario no tenga que recargar la pagina
          // *********************************************************

          // // Si la solicitud se realizo con chofer interno
          // if (propsConfigEstado.solicitud.datosEntrega.chofer.tipo == 0) {
          //   setCongloPagosInternos([
          //     ...congloPagosInternos,
          //     { ...propsConfigEstado.solicitud },
          //   ]);
          // }

          // // Si la solicitud se realizo con chofer externo independiente
          // if (propsConfigEstado.solicitud.datosEntrega.chofer.tipo == 1) {
          //   setCongloPagosExtInd([
          //     ...congloPagosExtInd,
          //     { ...propsConfigEstado.solicitud },
          //   ]);
          // }
          // // Si la solicitud se realizo con chofer externo empresa
          // if (propsConfigEstado.solicitud.datosEntrega.chofer.tipo == 2) {
          //   setCongloPagosExtEmp([
          //     ...congloPagosExtEmp,
          //     { ...propsConfigEstado.solicitud },
          //   ]);
          // }
        } catch (error) {
          console.log(error);
          setTipoAlerta("error");
          setMensajeAlerta("Error con la base de datos.");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
      }
    } else if (tipo == "cancelar") {
      const hasAnular = userMaster.permisos.includes("annularRequestTMS");
      if (!hasAnular) {
        return;
      }

      // Si la solicitud esta concluida o tiene vehiculos adicionales en modo concluido
      if (estadoOficial == 3) {
        setTipoAlerta("warning");
        setMensajeAlerta("Esta solicitud posee entregas ya realizadas.");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      // Si no coloco justificacion
      if (justificacionInput == "") {
        setTipoAlerta("warning");
        setMensajeAlerta("Por favor indicar justificacion.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }

      try {
        const estadoUp = 4;
        setHasAccion(false);
        if (botonSeleccionado?.tipo) {
          resetDatosChange();
        }
        const solicitudActualizar = doc(
          db,
          "transferRequest",
          propsConfigEstado.solicitud.id
        );
        batch.update(solicitudActualizar, {
          // General
          estadoDoc: estadoUp,
          fechaCancelacion: ES6AFormat(new Date()),
          motivoCancelacion: justificacionInput,
          "current.fechaDespProg": "",
          // Chofer
          "datosEntrega.chofer.id": "",
          "datosEntrega.chofer.tipo": "",
          "datosEntrega.chofer.numeroDoc": "",
          "datosEntrega.chofer.nombre": "",
          "datosEntrega.chofer.apellido": "",
          // Ayudante
          "datosEntrega.ayudante.id": "",
          "datosEntrega.ayudante.numeroDoc": "",
          "datosEntrega.ayudante.nombre": "",
          "datosEntrega.ayudante.apellido": "",
          "datosEntrega.ayudante.tipo": "",

          // Vehiculo
          "datosEntrega.unidadVehicular.descripcion": "",
          "datosEntrega.unidadVehicular.placa": "",
          "datosEntrega.unidadVehicular.code": "",
          // Obs
          "observaciones.unidadVehicular.code": "",
          // Resetear vehiculos adicionales
          "datosFlete.vehiculosAdicionales":
            propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales.map(
              (vehiculo) => {
                return {
                  ...vehiculo,
                  datosEntrega: { ...datosEntregaSchemaVehAdd, status: 4 },
                };
              }
            ),
          //
          log: [
            ...newLog,
            {
              tipo: tipoLog,
              accion: "canceladaStateReq",
              userName: userMaster.userName,
              fecha: ES6AFormat(new Date()),
              info: justificacionInput,
            },
          ],
        });
        if (hasPrevEjecucion) {
          limpiarChoferAnterior();
        }

        // 03-Batch - Actualizar hijas si posee
        if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
          propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
            (hija, index) => {
              const solicitudActualizar = doc(db, "transferRequest", hija.id);
              batch.update(solicitudActualizar, {
                estadoDoc: estadoUp,
                "current.fechaDespProg": "",
              });
            }
          );
        }

        await batch.commit();
        // Enviar correo de notificacion
        const solicitudEnv = {
          ...propsConfigEstado.solicitud,
          estadoDoc: estadoUp,

          materiales: propsConfigEstado.solicitud.datosReq?.materialesDev || [],
          chofer: choferActual,
        };

        let destinos = [];
        if (solicitudEnv.datosReq?.destinatariosNotificacion) {
          destinos = [
            ...solicitudEnv.datosReq.destinatariosNotificacion
              .map((d) => d.correo)
              .filter((correo) => correo),
          ];
        }

        destinos = [
          ...destinos,
          // solicitudEnv.datosSolicitante.userName + "@cielosacusticos.com",
        ];
        destinos = [...new Set(destinos)];
        FuncionEnviarCorreo({
          para: destinos,
          asunto: AsuntosSegunEstadoReq[solicitudEnv.estadoDoc],
          mensaje: PlantillaCorreoReqState(solicitudEnv),
        });
      } catch (error) {
        console.log(error);
        setTipoAlerta("error");
        setMensajeAlerta("Error con la base de datos.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    }
  };

  const guardarChoferesAdicionales = async (e) => {
    const { name, value } = e.target;
    const indexDataset = e.target.dataset.index;
    const { tipo } = propsConfigEstado;
    const vehiculoCurrent =
      propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales[indexDataset];

    // Si la solicitud esta cancelada no debe permitir hacer nada
    if (propsConfigEstado.solicitud.estadoDoc == 4) {
      return "";
    }
    // Si la solicitud esta concluida no puede editar choferes
    if (vehiculoCurrent.datosEntrega.status == 3) {
      setTipoAlerta("warning");
      setMensajeAlerta("No puede editar luego de concluida.");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    if (propsConfigEstado.solicitud.estadoDoc == -1) {
      // Esta validacion se supone que nunca sera ejecutada, dado a que visualmente las opciones para cambiar estados no deben estar activas
      setMensajeAlerta("No puede cambiar estado a borradores.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // *********** CHOFER/AYUDANTE ANTERIOR ***************
    const choferAnterior = listaChoferesEjecucion.find(
      (chofer) => chofer.id == vehiculoCurrent.datosEntrega.chofer.id
    );

    const ayudanteAnterior = ayudantesCasiCompleta.find(
      (ayudante) => ayudante.id == vehiculoCurrent.datosEntrega.ayudante.id
    );

    // *********** CHOFER/AYUDANTE ACTUAL ***************
    const choferesDispoMasActual = [
      ...listaChoferesDisponibles,
      choferAnterior || { ...vehiculoAdicionalSchema.datosEntrega.chofer },
    ];

    const choferFind = listaChoferesCasiCompleta.find((chofer, index) => {
      if (
        nombreApellido(chofer.nombre, chofer.apellido) ==
          vehiculosAdicionales[indexDataset].datosEntrega.chofer.valueInput &&
        chofer.id
      ) {
        return chofer;
      }
    });

    const ayudabteDispoMasActual = [
      ...ayudantesDisponibles,
      ayudanteAnterior || { ...vehiculoAdicionalSchema.datosEntrega.chofer },
    ];

    const ayudanteFind = ayudantesCasiCompleta.find((chofer, index) => {
      if (
        nombreApellido(chofer.nombre, chofer.apellido) ==
          vehiculosAdicionales[indexDataset].datosEntrega.ayudante.valueInput &&
        chofer.id
      ) {
        return chofer;
      }
    });
    // guardar en la base de datos
    const newLog = propsConfigEstado.solicitud.log
      ? propsConfigEstado.solicitud.log
      : [];
    const tipoLog = "guardarVehiculoAdicional";
    const batch = writeBatch(db);

    // batch.update(choferActualizar, {
    //   estadoDoc: 1,
    //   "current.solicitud": {},
    // });
    const limpiarChoferAnterior = () => {
      if (choferAnterior) {
        const choferActualizar = doc(db, "choferes", choferAnterior.id);
        // Primero saber si la solicitud dentro del chofer es la solicitud master
        const reqIsMaster =
          propsConfigEstado.solicitud.numeroDoc ==
          choferAnterior.current.solicitud.numeroDoc;

        // Despues saber si el array de las solicitudes adicionales tiene solicitudes

        const reqAddFilter =
          choferAnterior.current?.solicitudesAdicionales?.filter(
            (req, index) => {
              if (req.numeroDoc != propsConfigEstado.solicitud.numeroDoc) {
                return {
                  ...req,
                };
              }
            }
          ) || [];

        let estadoChofer = choferAnterior.estadoDoc;
        // Si el chofer ya no tiene mas solicitudes entonces ponlo disponible:
        if (reqIsMaster) {
          // Verifica si le quedan solicitudes adicionales
          if (reqAddFilter.length > 0) {
            estadoChofer = 2;
          } else {
            estadoChofer = 1;
          }
        }
        // 2-Esta es una solicitud adicional
        else {
          // Verifica dos cosas:
          //     -1 si aun tiene solicitud maestra
          //     -2 si le quedan solicitudes adicionales
          if (
            choferAnterior.current.solicitud.numeroDoc ||
            reqAddFilter.length > 0
          ) {
            estadoChofer = 2;
          } else {
            estadoChofer = 1;
          }
        }

        if (reqIsMaster) {
          batch.update(choferActualizar, {
            estadoDoc: estadoChofer,
            "current.solicitud": {},
          });
        } else {
          batch.update(choferActualizar, {
            estadoDoc: estadoChofer,
            "current.solicitudesAdicionales": reqAddFilter,
          });
        }
      }
      // 7532
      if (ayudanteAnterior) {
        const ayudanteActualizar = doc(db, "choferes", ayudanteAnterior.id);

        // Primero saber si la solicitud dentro del ayundante es la solicitud master
        const reqIsMaster =
          propsConfigEstado.solicitud.numeroDoc ==
          ayudanteAnterior.current.solicitud.numeroDoc;
        // Despues saber si el array de las solicitudes adicionales tiene solicitudes
        const reqAddFilter =
          ayudanteAnterior.current?.solicitudesAdicionales?.filter(
            (req, index) => {
              if (req.numeroDoc != propsConfigEstado.solicitud.numeroDoc) {
                return {
                  ...req,
                };
              }
            }
          ) || [];
        let estadoAyudante = ayudanteAnterior.estadoDoc;
        // 25639
        // Si el ayudante ya no tiene mas solicitudes entonces ponlo disponible:
        // 1-Esta solicitud es la maestra
        if (reqIsMaster) {
          // Verifica si le quedan solicitudes adicionales
          if (reqAddFilter.length > 0) {
            estadoAyudante = 2;
          } else {
            estadoAyudante = 1;
          }
        }
        // 2-Esta es una solicitud adicional
        else {
          // Verifica dos cosas:
          //     -1 si aun tiene solicitud maestra
          //     -2 si le quedan solicitudes adicionales
          if (
            ayudanteAnterior.current.solicitud.numeroDoc ||
            reqAddFilter.length > 0
          ) {
            estadoAyudante = 2;
          } else {
            estadoAyudante = 1;
          }
        }

        if (reqIsMaster) {
          batch.update(ayudanteActualizar, {
            estadoDoc: estadoAyudante,
            "current.solicitud": {},
          });
        } else {
          batch.update(ayudanteActualizar, {
            estadoDoc: estadoAyudante,
            "current.solicitudesAdicionales": reqAddFilter,
          });
        }
      } else {
        console.log("sin ayudante");
      }
    };

    // const estadoPrevEjecucion =
    //   propsConfigEstado.solicitud.estadoDoc == 2 ? true : false;
    const estadoPrevEjecucion =
      propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales[indexDataset]
        .datosEntrega.status == 2
        ? true
        : false;
    if (tipo == "ejecutar") {
      // Si no coloco chofer
      if (!choferFind) {
        setTipoAlerta("warning");
        setMensajeAlerta("Indicar chofer.");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si no posee los permisos
      const hasEjecutar = userMaster.permisos.includes("runRequestTMS");
      if (!hasEjecutar) {
        setTipoAlerta("warning");
        setMensajeAlerta("No posee los permisos necesarios.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return;
      }

      // Si no ha escrito chofer o el chofer escrito no es seleccionado de la lista desplegable
      if (!choferFind) {
        setTipoAlerta("warning");
        setMensajeAlerta("Seleccione un chofer de la lista desplegable.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }
      if (choferFind) {
        setHasAccion(false);
        if (botonSeleccionado?.tipo) {
          resetDatosChange();
        }

        const fechaActual = format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
          locale: es,
        });
        try {
          const estadoUp = 2;
          const solicitudActualizar = doc(
            db,
            "transferRequest",
            propsConfigEstado.solicitud.id
          );
          // 01-Batch - ACTUALIZAR SOLICITUD
          console.log(vehiculosAdicionales);
          batch.update(solicitudActualizar, {
            // General
            estadoDoc: estadoUp,
            "datosFlete.vehiculosAdicionales": vehiculosAdicionales.map(
              (vehiculo, index) => {
                if (indexDataset == index) {
                  return {
                    ...vehiculo,
                    datosEntrega: {
                      ...vehiculo.datosEntrega,
                      status: 2,
                      fecha: {
                        ...vehiculo.datosEntrega.fecha,
                        fechaEjecucion: ES6AFormat(new Date()),
                        fechaEjecucionCorta: ES6AFormat(new Date()).slice(
                          0,
                          10
                        ),
                      },
                      chofer: {
                        ...vehiculo.datosEntrega.chofer,
                        id: choferFind.id,
                        tipo: choferFind.tipo,
                        numeroDoc: choferFind.numeroDoc,
                        nombre: choferFind.nombre,
                        apellido: choferFind.apellido,
                        urlFotoPerfil: choferFind.urlFotoPerfil,
                      },
                      ayudante: ayudanteFind
                        ? {
                            ...vehiculo.datosEntrega.ayudante,
                            id: ayudanteFind.id,
                            numeroDoc: ayudanteFind.numeroDoc,
                            nombre: ayudanteFind.nombre,
                            apellido: ayudanteFind.apellido,
                            tipo: ayudanteFind.tipo,
                          }
                        : { ...vehiculoAdicionalSchema.datosEntrega.ayudante },
                      unidadVehicular: {
                        ...vehiculo.datosEntrega.unidadVehicular,
                        descripcion: choferFind.unidadVehicular.descripcion,
                        placa: choferFind.unidadVehicular.placa,
                        code: choferFind.unidadVehicular.code,
                        urlFoto: choferFind.unidadVehicular.urlFoto,
                      },
                    },
                  };
                } else {
                  return {
                    ...vehiculo,
                  };
                }
              }
            ),
            // Registro en log
            log: [
              ...newLog,
              {
                tipo: tipoLog,
                accion: "ejecucionStateReqVehiculoAdicional",
                userName: userMaster.userName,
                fecha: ES6AFormat(new Date()),
                info: `
                  se puso en ejecucion y el camion del codigo 
                  ${vehiculosAdicionales[indexDataset].code}, 
                  con el chofer ${choferFind.nombre + " " + choferFind.apellido} del id ${choferFind.id} con el ayudante 
                  ${ayudanteFind ? ayudanteFind.nombre + " " + ayudanteFind.apllido + " del id: " + ayudanteFind.id : "Sin especificar."}
                  
                  `,
              },
            ],
          });

          const llenarChoferActual = () => {
            const choferActualizar = doc(db, "choferes", choferFind.id);
            // Si este chofer ya esta en ejecucion, entonces agregale una req nueva dentro del array de solicitudesAdicionales
            if (choferFind.estadoDoc == 2) {
              let arrayAddChofer = [];
              const arraySolicitudes =
                choferFind.current.solicitudesAdicionales || [];
              console.log(arraySolicitudes);
              const mismaSolicitud = arraySolicitudes.find(
                (req) => req.numeroDoc == propsConfigEstado.solicitud.numeroDoc
              );
              // Si esta solicitud es otra solicitud, entonces agregarla al array de solicitudesAdicionales
              if (!mismaSolicitud) {
                arrayAddChofer = [
                  ...(choferFind.current.solicitudesAdicionales || []),
                  propsConfigEstado.solicitud,
                ];
              } else {
                arrayAddChofer = [
                  ...(choferFind.current.solicitudesAdicionales || []),
                ];
              }
              // Si es la misma solicitud es decir el usuario esta presionando en guardar pero ya esta en ejecucion en esa solicitud, entonces no agregarla al array

              batch.update(choferActualizar, {
                // General
                estadoDoc: 2,
                // Solicitud
                "current.solicitudesAdicionales": arrayAddChofer,
              });
              if (ayudanteFind) {
                const ayudanteActualizar = doc(db, "choferes", ayudanteFind.id);

                const arrayAddAyudante = [
                  ...(ayudanteFind.current.solicitudesAdicionales || []),
                  propsConfigEstado.solicitud,
                ];

                console.log(arrayAddAyudante);
                batch.update(ayudanteActualizar, {
                  // General
                  estadoDoc: 2,
                  // Solicitud
                  "current.solicitudesAdicionales": arrayAddAyudante,
                });
              } else {
                console.log("no se coloco ayudante");
              }
            } else {
              // 787966
              batch.update(choferActualizar, {
                // General
                estadoDoc: 2,
                // Solicitud
                "current.solicitud": propsConfigEstado.solicitud,
              });
              if (ayudanteFind) {
                const ayudanteActualizar = doc(db, "choferes", ayudanteFind.id);
                batch.update(ayudanteActualizar, {
                  // General
                  estadoDoc: 2,
                  // Solicitud
                  "current.solicitud": propsConfigEstado.solicitud,
                });
              } else {
                console.log("no se coloco ayudante");
              }
            }
          };

          // Si el estado anterior era ejecucion tambien, entonces:
          // Verificar si el chofer fue cambiado en el input:
          // SI el chofer fue cambiado:
          // -----limpiar chofer anterior
          // -----Colocar info al chofer nuevo
          // SI el chofer no ha sido cambiado:
          // -----No tocar chofer anterior

          // Si el estado previo era ejecucion
          if (estadoPrevEjecucion) {
            // Esto en la funcion de chofer master es si el chofer fue modificado, aqui lo coloque por default y no deberia dar problemas
            // 14/4/25 - 2:38PM
            // A evaluar
            if (true) {
              limpiarChoferAnterior();
              llenarChoferActual();
            }
            // Si no
          } else {
            llenarChoferActual();
          }
          console.log("llego");

          // 03-Batch - Actualizar hijas si posee
          if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
            propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
              (hija, index) => {
                const solicitudActualizar = doc(db, "transferRequest", hija.id);
                batch.update(solicitudActualizar, {
                  estadoDoc: estadoUp,
                  fechaEjecucion: fechaActual,
                  fechaEjecucionCorta: fechaActual.slice(0, 10),
                  "current.fechaDespProg": "",
                });
              }
            );
          }
          await batch.commit();
        } catch (error) {
          console.log(error);
          setTipoAlerta("error");
          setMensajeAlerta("Error con la base de datos.");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return "";
        }
      }
    } else if (tipo == "concluir") {
      const ayudantesAddCurrent = vehiculoCurrent.ayudantesAdicionales;
      const allAprobado = ayudantesAddCurrent?.some(
        (ayuAdd) => ayuAdd.status == 0
      );
      console.log(ayudantesAddCurrent);
      console.log(allAprobado);
      if (allAprobado) {
        setMensajeAlerta(
          "Este camion tiene ayudantes adicionales sin aprobar por el solicitante."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      try {
        // 75693
        const estadoUp = parsearEstadosReq({
          ...propsConfigEstado.solicitud,
          datosFlete: {
            ...propsConfigEstado.solicitud.datosFlete,
            vehiculosAdicionales: vehiculosAdicionales.map((vehAdd, index) => {
              if (index == indexDataset) {
                return {
                  ...vehAdd,
                  datosEntrega: {
                    ...vehAdd.datosEntrega,
                    status: 3,
                  },
                };
              } else {
                return { ...vehAdd };
              }
            }),
          },
        });
        console.log(estadoUp);
        const hasConcluir = userMaster.permisos.includes("terminateRequestTMS");
        if (!hasConcluir) {
          return;
        }
        let hasChofer = true;
        let hasFecha = true;

        // const choferConcluyo = listaChoferesCasiCompleta.find(
        //   (chofer) => chofer.id == choferFind.id
        // );
        const choferConcluyo = listaChoferesCasiCompleta.find(
          (chofer, index) =>
            nombreApellido(chofer.nombre, chofer.apellido) ==
            vehiculosAdicionales[indexDataset].datosEntrega.chofer.valueInput
        );
        // Si no ha escrito chofer o el chofer escrito no es seleccionado de la lista desplegable
        if (!choferConcluyo) {
          setTipoAlerta("warning");
          setMensajeAlerta("Selecciona un chofer de la lista desplegable.");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          hasChofer = false;
          return "";
        }
        // Si la fecha de concluion/ejecucion es posterior a la fecha actual

        const fechaActual = new Date();
        fechaActual.setHours(0, 0, 0, 0);
        const fechaRealizadaIndex =
          propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales[
            indexDataset
          ].datosEntrega.fecha.fechaConclucion;

        const annio = fechaRealizadaIndex.slice(6, 10);
        const mes = fechaRealizadaIndex.slice(3, 5);
        const dia = fechaRealizadaIndex.slice(0, 2);
        const fechaColocadaES6 = new Date(annio, mes - 1, dia);
        if (fechaActual < fechaColocadaES6) {
          setMensajeAlerta("Fecha indicada posterior a fecha actual.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return;
        }

        // Si no coloco fecha de conclucion
        if (
          vehiculosAdicionales[indexDataset].datosEntrega.fecha
            .fachaConclucionValue == ""
        ) {
          setMensajeAlerta("Seleccione fecha.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return;
        }

        if (hasChofer && hasFecha) {
          setHasAccion(false);
        }
        if (botonSeleccionado?.tipo) {
          resetDatosChange();
        }

        let pagoChofer = 0;
        let pagoAyudante = 0;
        // Si es un chofer interno, colocar incentivo fijo por viaje, traer monto del camion desde la base de datos
        if (choferConcluyo.tipo == 0) {
          // const camionesDB2 = await fetchDocsByConditionGetDocs(
          //   "miscelaneo",
          //   setDBCamiones
          // );
          const camionesDB = await obtenerDocPorId2(
            "miscelaneo",
            "detallesCamiones"
          );

          const camionBuscado = camionesDB.array.find(
            (camion) => camion.code == choferConcluyo.unidadVehicular.code
          );
          console.log(camionesDB);
          console.log(choferConcluyo.unidadVehicular.code);
          console.log(camionBuscado);
          pagoChofer = camionBuscado.viajesInterno.montoChofer;
          // Si ese chofer tiene ayudante, entonces colocale el monto
          if (ayudanteSeleccionado) {
            pagoAyudante = camionBuscado.viajesInterno.montoAyudante;
          }
        }
        // Si es un chofer externo colocar costo de viaje generado por la calculadora de Fletes
        if (choferConcluyo.tipo == 1 || choferConcluyo.tipo == 2) {
          pagoChofer = propsConfigEstado.solicitud.datosFlete.costo;
          pagoAyudante = 0;
        }

        const solicitudActualizar = doc(
          db,
          "transferRequest",
          propsConfigEstado.solicitud.id
        );

        // 01-Batch - ACTUALIZAR SOLICITUD
        batch.update(solicitudActualizar, {
          // General

          estadoDoc: estadoUp,
          "datosFlete.vehiculosAdicionales": vehiculosAdicionales.map(
            (vehiculo, index) => {
              if (indexDataset == index) {
                const { disabled, ...datosEntregaAux } = vehiculo.datosEntrega;
                const { choferSeleccionado, valueInput, ...choferParsed } =
                  vehiculo.datosEntrega.chofer;
                let ayudanteParsed = {};
                if (ayudanteFind) {
                  const {
                    ayudanteSeleccionado,
                    valueInput,
                    ...ayudanteParsedAux
                  } = vehiculo.datosEntrega.ayudante;
                  ayudanteParsed = ayudanteParsedAux;
                } else {
                  ayudanteParsed = { ...datosEntregaSchemaVehAdd.ayudante };
                }
                const { fachaConclucionValue, ...fechaParsed } =
                  vehiculo.datosEntrega.fecha;
                const datosEntregaParsed = {
                  ...datosEntregaAux,
                  chofer: choferParsed,
                  ayudante: ayudanteParsed,
                  fecha: fechaParsed,
                };
                return {
                  ...vehiculo,
                  datosEntrega: {
                    ...datosEntregaParsed,
                    status: 3,
                    fecha: {
                      ...datosEntregaParsed.fecha,
                      fechaConclucion: ES6AFormat(new Date()),
                    },
                    chofer: {
                      ...datosEntregaParsed.chofer,
                      id: choferConcluyo.id,
                      tipo: choferConcluyo.tipo,
                      numeroDoc: choferConcluyo.numeroDoc,
                      nombre: choferConcluyo.nombre,
                      apellido: choferConcluyo.apellido,
                      urlFotoPerfil: choferConcluyo.urlFotoPerfil,
                      montoPagarChofer: pagoChofer,
                    },
                    ayudante: ayudanteFind
                      ? {
                          ...datosEntregaParsed.ayudante,
                          id: ayudanteFind.id,
                          numeroDoc: ayudanteFind.numeroDoc,
                          nombre: ayudanteFind.nombre,
                          apellido: ayudanteFind.apellido,
                          montoPagarAyudante: pagoAyudante,
                          tipo: ayudanteFind.tipo,
                        }
                      : { ...datosEntregaParsed.ayudante },
                    unidadVehicular: {
                      ...datosEntregaParsed.unidadVehicular,
                      descripcion: choferConcluyo.unidadVehicular.descripcion,
                      placa: choferConcluyo.unidadVehicular.placa,
                      code: choferConcluyo.unidadVehicular.code,
                      urlFoto: choferConcluyo.unidadVehicular.urlFoto,
                    },
                  },
                };
              } else {
                return {
                  ...vehiculo,
                };
              }
            }
          ),

          // Registro en log
          log: [
            ...newLog,
            {
              tipo: tipoLog,
              accion: "realizadaStateReqVehiculoAdicional",
              userName: userMaster.userName,
              fecha: ES6AFormat(new Date()),
              info: `
                              se concluyó con el camion del codigo 
                              ${vehiculosAdicionales[indexDataset].code}, 
                              con el chofer ${choferConcluyo.nombre + " " + choferConcluyo.apellido} del id ${choferConcluyo.id} con el ayudante 
                              ${ayudanteFind ? ayudanteFind.nombre + " " + ayudanteFind.apllido + " del id: " + ayudanteFind.id : "Sin especificar."}
                              
                              `,
            },
          ],
        });
        if (estadoPrevEjecucion) {
          console.log("el estado anterior era ejecucion");
          // 01-Si el chofer fue cambiado
          // if (modificatedChofer) {
          // Al chofer anterior limpiar current
          limpiarChoferAnterior();
          // Al chofer nuevo no tiene que hacerle nada, pues no hay chofer nuevo dado a que solicitud ahora esta en modo conluida
          // }
        }

        // 03-Batch - Actualizar hijas si posee
        if (propsConfigEstado.solicitud.familia.solicitudesHijas.length > 0) {
          propsConfigEstado.solicitud.familia.solicitudesHijas.forEach(
            (hija, index) => {
              const solicitudActualizar = doc(db, "transferRequest", hija.id);
              batch.update(solicitudActualizar, {
                estadoDoc: estadoUp,
                "current.fechaDespProg": "",
                fechaEjecucion: fechaConcluidaInput,
                fechaEjecucionCorta: fechaConcluidaInput.slice(0, 10),
              });
            }
          );
        }
        // return;
        await batch.commit();
        // 01-Batch - ACTUALIZAR SOLICITUD
      } catch (error) {
        console.log(error);
        setTipoAlerta("error");
        setMensajeAlerta("Error con la base de datos.");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }
    }
  };
  const editarChoferAdd = (e) => {
    const { name } = e.target;
    const indexDataset = e.target.dataset.index;
    const { tipo } = propsConfigEstado;
    // Si la solicitud esta concluida no puede editar choferes
    if (
      propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales[indexDataset]
        .datosEntrega.status == 3
    ) {
      setTipoAlerta("warning");
      setMensajeAlerta("No puede editar luego de concluida.");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    const nuevoVe = vehiculosAdicionales.map((vehiculo, index) => {
      if (indexDataset == index) {
        return {
          ...vehiculo,
          datosEntrega: {
            ...vehiculo.datosEntrega,
            disabled: false,
          },
        };
      } else {
        return vehiculo;
      }
    });
    setVehiculosAdicionales(nuevoVe);
  };
  const noSolicitud = useRef(null);
  useEffect(() => {
    console.log(propsConfigEstado.tipo);
    if (noSolicitud.current) {
      noSolicitud.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [propsConfigEstado.tipo]);

  // ********************** CHOFERES EJECUTAR **********************
  const [arrayChoferesEjecutar, setArrayChoferEjecutar] = useState([
    {
      nombre: "Disponibles",
      select: true,
    },
    {
      nombre: "Todos",
      select: false,
    },
  ]);

  const handleArrayChoEjecutar = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayChoferEjecutar(
      arrayChoferesEjecutar.map((arr, i) => {
        return {
          ...arr,
          select: index == i,
        };
      })
    );
  };
  return (
    enableXDraft && (
      <ContainerModalFuntion className={tipo}>
        <CajarModalFunction className={`${tipo}`}>
          <CajaTitulo className={tipo}>
            <Titulo>
              {propsConfigEstado.tipo.charAt(0).toUpperCase() +
                propsConfigEstado.tipo.slice(1)}
            </Titulo>
            <XCerrar data-name="cerrar" onClick={(e) => handleEstados(e)}>
              ❌
            </XCerrar>
          </CajaTitulo>
          <CajaSubWrapInternal>
            <CajaContenido
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              <TextoSolicitud ref={noSolicitud}>
                Solicitud N°
                {propsConfigEstado.solicitud.numeroDoc}
              </TextoSolicitud>

              {propsConfigEstado.tipo == "planificar" ? (
                <>
                  {propsConfigEstado.solicitud.estadoDoc > 0 && (
                    <CajaHasPlanificado>
                      <TextoHasPlanificado>
                        {propsConfigEstado.solicitud.estadoDoc == 1
                          ? "Esta solicitud ya esta planificada para el:" +
                            propsConfigEstado.solicitud.current.fechaDespProg.slice(
                              0,
                              10
                            )
                          : propsConfigEstado.solicitud.estadoDoc == 2
                            ? "Esta solicitud esta en ejecucion, ¿Seguro que desea planificarla?"
                            : propsConfigEstado.solicitud.estadoDoc == 3
                              ? "No puede planificar una solicitud concluida o con entregas realizadas."
                              : propsConfigEstado.solicitud.estadoDoc == 4
                                ? "Esta solicitud esta cancelada, ¿Desea volver a planificar?"
                                : ""}
                      </TextoHasPlanificado>
                    </CajaHasPlanificado>
                  )}
                  {unificarVehiculos(propsConfigEstado.solicitud).some(
                    (vehAdd) => vehAdd.datosEntrega.status == 3
                  ) ? (
                    <TextoHasPlanificado>
                      Esta solicitud posee entregas realizadas.
                    </TextoHasPlanificado>
                  ) : (
                    ""
                  )}
                </>
              ) : propsConfigEstado.tipo == "ejecutar" ? (
                <>
                  {propsConfigEstado.solicitud.estadoDoc > 1 && (
                    <CajaHasPlanificado>
                      <TextoHasPlanificado>
                        {propsConfigEstado.solicitud.estadoDoc == 2
                          ? "Esta solicitud ya se esta ejecutando:"
                          : propsConfigEstado.solicitud.estadoDoc == 3
                            ? "No puede ejecutar una solicitud concluida."
                            : propsConfigEstado.solicitud.estadoDoc == 4
                              ? "Esta solicitud esta cancelada, ¿Desea volver a ejecutar?"
                              : ""}
                      </TextoHasPlanificado>
                    </CajaHasPlanificado>
                  )}
                </>
              ) : propsConfigEstado.tipo == "concluir" ? (
                <>
                  {propsConfigEstado.solicitud.estadoDoc > 2 && (
                    <CajaHasPlanificado>
                      <TextoHasPlanificado>
                        {propsConfigEstado.solicitud.estadoDoc == 3
                          ? "Esta solicitud ya esta concluida"
                          : propsConfigEstado.solicitud.estadoDoc == 4
                            ? "Esta solicitud esta cancelada, ¿Desea colocar en modo concluir?"
                            : ""}
                      </TextoHasPlanificado>
                    </CajaHasPlanificado>
                  )}
                </>
              ) : propsConfigEstado.tipo == "cancelar" ? (
                <>
                  <CajaHasPlanificado>
                    <TextoHasPlanificado>
                      {propsConfigEstado.solicitud.estadoDoc == 3
                        ? "No puede cancelar una solicitud concluida con entregas realizadas."
                        : "La cancelacion es irreversible."}
                    </TextoHasPlanificado>
                  </CajaHasPlanificado>
                  {propsConfigEstado.solicitud.estadoDoc == 4 ? (
                    <TextoHasPlanificado>
                      Esta solicitud ya esta cancelada.
                    </TextoHasPlanificado>
                  ) : (
                    ""
                  )}
                  {unificarVehiculos(propsConfigEstado.solicitud).some(
                    (vehAdd) => vehAdd.datosEntrega.status == 3
                  ) ? (
                    <TextoHasPlanificado>
                      Esta solicitud posee entregas realizadas.
                    </TextoHasPlanificado>
                  ) : (
                    ""
                  )}
                </>
              ) : (
                ""
              )}
              {propsConfigEstado.semana &&
                propsConfigEstado.solicitud.datosFlete.vehiculosAdicionales.every(
                  (vehAdd) => vehAdd.datosEntrega.status != 3
                ) &&
                propsConfigEstado.solicitud.estadoDoc != 3 && (
                  <SeccionFecha>
                    {datosParseados && (
                      <ContainerWrap>
                        <WrapSemana>
                          <TextoWeek>Actual: </TextoWeek>
                          <CajaWeek>
                            {weekSelected.week1?.map((dia, index) => {
                              return (
                                <CajaDay
                                  title={dia.fecha.slice(0, 10)}
                                  key={index}
                                  className={`
                        ${dia.selected ? "selected " : ""}
                        ${dia.disabled ? "disabled " : ""}
                              ${
                                propsConfigEstado.solicitud.current.fechaDespProg.slice(
                                  0,
                                  10
                                ) == dia.fecha.slice(0, 10)
                                  ? " hasProgramada "
                                  : ""
                              }

                      `}
                                  onClick={(e) => {
                                    selecionarDia(e);
                                  }}
                                  data-id={index}
                                  data-nombre="semana1"
                                >
                                  <TextoDay
                                    onClick={(e) => selecionarDia(e)}
                                    data-id={index}
                                    data-nombre="semana1"
                                  >
                                    {dia.nombre == "Miercoles"
                                      ? "MI"
                                      : dia.nombre[0]}
                                  </TextoDay>
                                </CajaDay>
                              );
                            })}
                          </CajaWeek>
                        </WrapSemana>
                        <WrapSemana>
                          <TextoWeek>Próxima: </TextoWeek>
                          <CajaWeek>
                            {weekSelected.week2?.map((dia, index) => {
                              return (
                                <CajaDay
                                  title={dia.fecha.slice(0, 10)}
                                  key={index}
                                  className={`
                            ${dia.selected ? "selected " : ""}
                            ${dia.disabled ? "disabled " : ""}
                                  ${
                                    propsConfigEstado.solicitud.current.fechaDespProg.slice(
                                      0,
                                      10
                                    ) == dia.fecha.slice(0, 10)
                                      ? " hasProgramada "
                                      : ""
                                  }`}
                                  data-id={index}
                                  onClick={(e) => {
                                    selecionarDia(e);
                                  }}
                                  data-nombre="semana2"
                                >
                                  <TextoDay
                                    data-nombre="semana2"
                                    className={
                                      propsConfigEstado.solicitud.current.fechaDespProg.slice(
                                        0,
                                        10
                                      ) == dia.fecha.slice(0, 10)
                                        ? " hasProgramada "
                                        : ""
                                    }
                                    data-id={index}
                                    onClick={(e) => {
                                      selecionarDia(e);
                                    }}
                                  >
                                    {dia.nombre == "Miercoles"
                                      ? "MI"
                                      : dia.nombre[0]}
                                  </TextoDay>
                                </CajaDay>
                              );
                            })}
                          </CajaWeek>
                        </WrapSemana>
                      </ContainerWrap>
                    )}
                  </SeccionFecha>
                )}
              {propsConfigEstado.tipo == "ejecutar" && (
                <OpcionUnica
                  titulo={""}
                  arrayOpciones={arrayChoferesEjecutar}
                  handleOpciones={handleArrayChoEjecutar}
                />
              )}
              {/* CHOFER DEFAULT */}
              {propsConfigEstado.chofer && (
                <CajaInputChofer>
                  <CajaStatusVAdd>
                    <CajaTopStatus
                      className={
                        StyleTextStateReq.find(
                          (state) =>
                            state.numero ==
                            propsConfigEstado.solicitud.estadoDoc
                        )?.codigo || "default"
                      }
                    >
                      <TextoStatus>
                        {StyleTextStateReq.find(
                          (state) =>
                            state.numero ==
                            propsConfigEstado.solicitud.estadoDoc
                        )?.texto || "default"}
                      </TextoStatus>
                    </CajaTopStatus>
                  </CajaStatusVAdd>
                  <DescripcionCamion>
                    {
                      propsConfigEstado.solicitud.datosFlete
                        .vehiculoSeleccionado.descripcion
                    }
                  </DescripcionCamion>

                  <CajaEntrada
                    className={propsConfigEstado.tipo ? "concluir" : ""}
                  >
                    <TituloSimple>Chofer:</TituloSimple>
                    <InputDesplegable
                      placeholder="Chofer"
                      name="chofer"
                      disabled={disabledChofer}
                      className={`
                     ${Theme.config.modoClear ? "clearModern" : ""}
                    ${disabledChofer ? "disabledChofer" : ""}
                    
                    `}
                      value={choferInput}
                      list="choferesDefault"
                      autoComplete="off"
                      onChange={(e) => handleInput(e)}
                    />
                    {hasBtnEditarChofer &&
                      propsConfigEstado.solicitud.estadoDoc < 3 && (
                        <ParrafoIcon
                          title="Modificar"
                          className="chofer"
                          name="poppp"
                          // icon={faPenToSquare}
                          onClick={(e) => {
                            editableChofer(e);
                          }}
                        >
                          🖋️
                        </ParrafoIcon>
                      )}
                    {/* <BotonQuery arrayChoferesEjecutar={arrayChoferesEjecutar} /> */}
                    {propsConfigEstado.tipo == "ejecutar" ? (
                      arrayChoferesEjecutar[0].select ? (
                        <DataList id="choferesDefault">
                          {listaChoferesDisponibles.map((chofer, index) => {
                            return (
                              <Opcion
                                key={index}
                                value={nombreApellido(
                                  chofer.nombre,
                                  chofer.apellido
                                )}
                              >
                                {chofer.tipo == 0
                                  ? "Interno"
                                  : chofer.tipo == 1
                                    ? "Externo Independiente"
                                    : chofer.tipo == 2
                                      ? "Externo Empresa"
                                      : ""}
                              </Opcion>
                            );
                          })}
                        </DataList>
                      ) : (
                        <DataList id="choferesDefault">
                          {listaChoferesCasiCompleta.map((chofer, index) => {
                            return (
                              <Opcion
                                key={index}
                                value={nombreApellido(
                                  chofer.nombre,
                                  chofer.apellido
                                )}
                              >
                                {chofer.tipo == 0
                                  ? "Interno"
                                  : chofer.tipo == 1
                                    ? "Externo Independiente"
                                    : chofer.tipo == 2
                                      ? "Externo Empresa"
                                      : ""}
                              </Opcion>
                            );
                          })}
                        </DataList>
                      )
                    ) : propsConfigEstado.tipo == "concluir" ? (
                      <DataList id="choferesDefault">
                        {listaChoferesCasiCompleta.map((chofer, index) => {
                          return (
                            <Opcion
                              key={index}
                              value={nombreApellido(
                                chofer.nombre,
                                chofer.apellido
                              )}
                            >
                              {chofer.tipo == 0
                                ? "Interno"
                                : chofer.tipo == 1
                                  ? "Externo Independiente"
                                  : chofer.tipo == 2
                                    ? "Externo Empresa"
                                    : ""}
                            </Opcion>
                          );
                        })}
                      </DataList>
                    ) : (
                      ""
                    )}
                  </CajaEntrada>
                </CajaInputChofer>
              )}
              {/* AYUDANTE DEFAULT */}
              {propsConfigEstado.ayudante && (
                <CajaInputChofer>
                  <CajaEntrada
                    className={propsConfigEstado.tipo ? "concluir" : ""}
                  >
                    <TituloSimple>Ayudante:</TituloSimple>
                    <InputDesplegable
                      placeholder="Ayudante"
                      name="ayudante"
                      disabled={disabledChofer}
                      className={`
                    ${Theme.config.modoClear ? "clearModern" : ""}
                    ${disabledChofer ? "disabledChofer" : ""}
                    `}
                      value={ayudanteInput}
                      list="ayudantesDefault"
                      autoComplete="off"
                      onChange={(e) => handleInput(e)}
                    />
                    {hasBtnEditarChofer &&
                      propsConfigEstado.solicitud.estadoDoc < 3 && (
                        <ParrafoIcon
                          title="Modificar"
                          className="chofer"
                          name="poppp"
                          // icon={faPenToSquare}
                          onClick={(e) => {
                            editableChofer(e);
                          }}
                        >
                          🖋️
                        </ParrafoIcon>
                        // <Icono
                        //   title="Modificar"
                        //   className="chofer"
                        //   icon={faPenToSquare}
                        //   onClick={() => {
                        //     editableChofer();
                        //   }}
                        // />
                      )}

                    {propsConfigEstado.tipo == "ejecutar" ? (
                      <DataList id="ayudantesDefault">
                        {ayudantesDisponibles.map((ayudante, index) => {
                          return (
                            <Opcion
                              key={index}
                              value={nombreApellido(
                                ayudante.nombre,
                                ayudante.apellido
                              )}
                            ></Opcion>
                          );
                        })}
                      </DataList>
                    ) : propsConfigEstado.tipo == "concluir" ? (
                      <DataList id="ayudantes">
                        {ayudantesCasiCompleta.map((ayudante, index) => {
                          return (
                            <Opcion
                              key={index}
                              value={nombreApellido(
                                ayudante.nombre,
                                ayudante.apellido
                              )}
                            ></Opcion>
                          );
                        })}
                      </DataList>
                    ) : (
                      ""
                    )}
                  </CajaEntrada>
                </CajaInputChofer>
              )}

              {/* FECHA DEFAULT */}
              {propsConfigEstado.fecha && (
                <CajaInputChofer>
                  <CajaEntrada>
                    <TituloSimple>Indique fecha:</TituloSimple>
                    <InputDesplegable
                      disabled={propsConfigEstado.solicitud.estadoDoc > 2}
                      type="date"
                      placeholder="Fecha de realizacion"
                      name="fechaConcluida"
                      className={`
                     ${Theme.config.modoClear ? "clearModern" : ""}
                     ${propsConfigEstado.solicitud.estadoDoc > 2 ? "disabledChofer" : ""}
                    `}
                      value={fechaConcluidaMostrar}
                      list="municipios"
                      onChange={(e) => handleInput(e)}
                    />
                  </CajaEntrada>
                </CajaInputChofer>
              )}

              {/* BOTON DEFAULT */}

              {propsConfigEstado.chofer &&
                (propsConfigEstado.tipo == "ejecutar" ||
                  propsConfigEstado.tipo == "concluir") &&
                propsConfigEstado.solicitud.estadoDoc < 3 && (
                  <BtnSimple
                    name={propsConfigEstado.tipo}
                    onClick={(e) => guardarAccion(e)}
                  >
                    Guardar1
                  </BtnSimple>
                )}

              {/* CHOFER ADICIONAL */}
              {vehiculosAdicionales?.length > 0 &&
              (propsConfigEstado.tipo == "ejecutar" ||
                propsConfigEstado.tipo == "concluir") ? (
                <ContenedorCA>
                  <TituloCA>Choferes adicionales:</TituloCA>
                  {vehiculosAdicionales?.map((vehiAdd, index) => {
                    return (
                      <CajaChoferAdd
                        key={index}
                        className={
                          StyleTextStateReq.find(
                            (state) =>
                              state.numero == vehiAdd.datosEntrega.status
                          )?.codigo || "default"
                        }
                        // className={
                        //   vehiAdd.datosEntrega.status==2?''
                        // }
                      >
                        <CajaStatusVAdd>
                          {/* <TextoStatus className="status">
                          {vehiAdd.datosEntrega.status==2?
                          'Ejecucion':vehiAdd.datosEntrega.status==3?
                          'Conluida':''
                          }
                        </TextoStatus> */}
                          {/* 787878 */}
                          <CajaTopStatus
                            className={
                              StyleTextStateReq.find(
                                (state) =>
                                  state.numero == vehiAdd.datosEntrega.status
                              )?.codigo || "default"
                            }
                          >
                            <TextoStatus>
                              {StyleTextStateReq.find(
                                (state) =>
                                  state.numero == vehiAdd.datosEntrega.status
                              )?.texto || "default"}
                            </TextoStatus>
                          </CajaTopStatus>
                        </CajaStatusVAdd>
                        <DescripcionCamion>
                          {vehiAdd.descripcion}
                        </DescripcionCamion>
                        <CajaInputChofer>
                          <CajaEntrada
                            className={
                              propsConfigEstado.tipo
                                ? "concluir adicional"
                                : "adicional"
                            }
                          >
                            <WICA>
                              <TituloSimple className="adicionalChofer">
                                Chofer:
                              </TituloSimple>
                              <InputDesplegable
                                placeholder="Chofer"
                                name="chofer"
                                disabled={vehiAdd.datosEntrega.disabled}
                                data-index={index}
                                data-campo={"chofer"}
                                className={`adicionalChofer
                                    ${Theme.config.modoClear ? "clearModern" : ""}
                                    ${vehiAdd.datosEntrega.disabled ? "disabledChofer" : ""}`}
                                value={vehiAdd.datosEntrega.chofer.valueInput}
                                list="choferesAdd"
                                autoComplete="off"
                                onChange={(e) => handleChoferesAdd(e)}
                              />
                              {vehiAdd.datosEntrega.disabled &&
                                vehiAdd.datosEntrega.status < 3 && (
                                  <ParrafoIcon
                                    title="Modificar"
                                    className="chofer"
                                    data-index={index}
                                    name="poppp"
                                    // icon={faPenToSquare}
                                    onClick={(e) => {
                                      editarChoferAdd(e);
                                    }}
                                  >
                                    🖋️
                                  </ParrafoIcon>
                                )}

                              {propsConfigEstado.tipo == "ejecutar" ? (
                                arrayChoferesEjecutar[0].select ? (
                                  <DataList id="choferesAdd">
                                    {listaChoferesDisponibles.map(
                                      (chofer, index) => {
                                        return (
                                          <Opcion
                                            key={index}
                                            value={nombreApellido(
                                              chofer.nombre,
                                              chofer.apellido
                                            )}
                                          >
                                            {chofer.tipo == 0
                                              ? "Interno"
                                              : chofer.tipo == 1
                                                ? "Externo Independiente"
                                                : chofer.tipo == 2
                                                  ? "Externo Empresa"
                                                  : ""}
                                          </Opcion>
                                        );
                                      }
                                    )}
                                  </DataList>
                                ) : (
                                  <DataList id="choferesAdd">
                                    {listaChoferesCasiCompleta.map(
                                      (chofer, index) => {
                                        return (
                                          <Opcion
                                            key={index}
                                            value={nombreApellido(
                                              chofer.nombre,
                                              chofer.apellido
                                            )}
                                          >
                                            {chofer.tipo == 0
                                              ? "Interno"
                                              : chofer.tipo == 1
                                                ? "Externo Independiente"
                                                : chofer.tipo == 2
                                                  ? "Externo Empresa"
                                                  : ""}
                                          </Opcion>
                                        );
                                      }
                                    )}
                                  </DataList>
                                )
                              ) : propsConfigEstado.tipo == "concluir" ? (
                                <DataList id="choferesAdd">
                                  {listaChoferesCasiCompleta.map(
                                    (chofer, index) => {
                                      return (
                                        <Opcion
                                          key={index}
                                          value={nombreApellido(
                                            chofer.nombre,
                                            chofer.apellido
                                          )}
                                        >
                                          {chofer.tipo == 0
                                            ? "Interno"
                                            : chofer.tipo == 1
                                              ? "Externo Independiente"
                                              : chofer.tipo == 2
                                                ? "Externo Empresa"
                                                : ""}
                                        </Opcion>
                                      );
                                    }
                                  )}
                                </DataList>
                              ) : (
                                ""
                              )}
                            </WICA>
                          </CajaEntrada>
                        </CajaInputChofer>
                        {/* AYUDANTE ADICIONAL */}
                        <CajaInputChofer>
                          <CajaEntrada
                            className={propsConfigEstado.tipo ? "concluir" : ""}
                          >
                            <TituloSimple className="adicionalChofer">
                              Ayudante:
                            </TituloSimple>
                            <InputDesplegable
                              placeholder="Ayudante"
                              name="ayudante"
                              disabled={vehiAdd.datosEntrega.disabled}
                              data-index={index}
                              data-campo={"ayudante"}
                              className={`adicionalChofer
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  ${vehiAdd.datosEntrega.disabled ? "disabledChofer" : ""}
                                  `}
                              value={vehiAdd.datosEntrega.ayudante.valueInput}
                              list="ayudanteAdd"
                              autoComplete="off"
                              onChange={(e) => handleChoferesAdd(e)}
                            />
                            {vehiAdd.datosEntrega.disabled &&
                              vehiAdd.datosEntrega.status < 3 && (
                                <ParrafoIcon
                                  title="Modificar"
                                  className="chofer"
                                  data-index={index}
                                  name="poppp"
                                  // icon={faPenToSquare}
                                  onClick={(e) => {
                                    editarChoferAdd(e);
                                  }}
                                >
                                  🖋️
                                </ParrafoIcon>
                                // <Icono
                                //   title="Modificar"
                                //   className="chofer"
                                //   data-index={index}
                                //   name="poppp"
                                //   icon={faPenToSquare}
                                //   onClick={(e) => {
                                //     editarChoferAdd(e);
                                //   }}
                                // />
                              )}

                            {propsConfigEstado.tipo == "ejecutar" ? (
                              <DataList id="ayudanteAdd">
                                {ayudantesDisponibles.map((ayudante, index) => {
                                  return (
                                    <Opcion
                                      key={index}
                                      value={nombreApellido(
                                        ayudante.nombre,
                                        ayudante.apellido
                                      )}
                                    ></Opcion>
                                  );
                                })}
                              </DataList>
                            ) : propsConfigEstado.tipo == "concluir" ? (
                              <DataList id="ayudanteAdd">
                                {ayudantesCasiCompleta.map(
                                  (ayudante, index) => {
                                    return (
                                      <Opcion
                                        key={index}
                                        value={nombreApellido(
                                          ayudante.nombre,
                                          ayudante.apellido
                                        )}
                                      ></Opcion>
                                    );
                                  }
                                )}
                              </DataList>
                            ) : (
                              ""
                            )}
                          </CajaEntrada>
                        </CajaInputChofer>
                        {/* FECHA DEFAULT */}
                        <CajaInputChofer>
                          {propsConfigEstado.fecha && (
                            <CajaEntrada>
                              <TituloSimple className="adicionalChofer">
                                Indique fecha:
                              </TituloSimple>
                              <InputDesplegable
                                disabled={
                                  vehiAdd.datosEntrega.disabled &&
                                  vehiAdd.datosEntrega.status == 3
                                }
                                data-index={index}
                                data-campo={"fecha"}
                                data-tipofecha={"fechaConclucion"}
                                type="date"
                                placeholder="Fecha de realizacion"
                                name="fechaConcluida"
                                className={`adicionalChofer
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                   ${vehiAdd.datosEntrega.disabled && vehiAdd.datosEntrega.status == 3 ? "disabledChofer" : ""}
                                `}
                                value={
                                  vehiAdd.datosEntrega.fecha
                                    .fachaConclucionValue
                                }
                                list="municipios"
                                onChange={(e) => handleChoferesAdd(e)}
                              />
                            </CajaEntrada>
                          )}
                        </CajaInputChofer>
                        {/* BOTON ADICIONAL */}
                        {(propsConfigEstado.tipo == "ejecutar" ||
                          propsConfigEstado.tipo == "concluir") &&
                          vehiAdd.datosEntrega.status < 3 && (
                            <BtnSimple
                              name={propsConfigEstado.tipo}
                              data-index={index}
                              onClick={(e) => guardarChoferesAdicionales(e)}
                            >
                              Guardar2
                            </BtnSimple>
                          )}
                        <CajaLinea>
                          <Linea />
                        </CajaLinea>
                      </CajaChoferAdd>
                    );
                  })}
                </ContenedorCA>
              ) : (
                ""
              )}

              {propsConfigEstado.justificacion &&
                !unificarVehiculos(propsConfigEstado.solicitud).some(
                  (vehAdd) => vehAdd.datosEntrega.status == 3
                ) && (
                  <CajitaDetalle className="cajaDetalles anular">
                    <TituloDetalle>Justificacion:</TituloDetalle>

                    <CajaTextArea>
                      <TextArea2
                        type="text"
                        className={`clearModern
                    `}
                        value={justificacionInput}
                        name="justificacionInput"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    </CajaTextArea>
                  </CajitaDetalle>
                )}
            </CajaContenido>
          </CajaSubWrapInternal>
          {propsConfigEstado.tipo != "ejecutar" &&
            propsConfigEstado.tipo != "concluir" &&
            !unificarVehiculos(propsConfigEstado.solicitud).some(
              (vehAdd) => vehAdd.datosEntrega.status == 3
            ) && (
              <CajaBtn className={tipo}>
                <BtnSimple
                  name={propsConfigEstado.tipo}
                  onClick={(e) => guardarAccion(e)}
                >
                  Guardar
                </BtnSimple>
              </CajaBtn>
            )}
        </CajarModalFunction>
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </ContainerModalFuntion>
    )
  );
}
const ContainerModalFuntion = styled.div`
  width: 100%;
  height: 100%;
  background-color: #000000ca;
  position: absolute;
  top: 0;
  overflow: hidden;
  z-index: 2;
  &.detalleReq {
    height: auto;
    position: static;
    background-color: transparent;
    padding: 10px 0;
  }
`;
const CajarModalFunction = styled.div`
  width: 600px;
  height: 50dvh;
  border: 1px solid ${Tema.primary.azulBrillante};
  position: fixed;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
  border-radius: 14px 0 14px 0;
  overflow: hidden;
  z-index: 5;
  &.enCard {
    background-color: ${ClearTheme.secondary.azulFrosting};
    background-color: #0f0e3bcc;
  }
  &.detalleReq {
    border: none;
    border-radius: 0;
    position: static;
    transform: none;
    width: 100%;
    height: auto;
    display: flex;
    justify-content: space-between;
    flex-direction: column;
  }

  @media screen and (max-width: 600px) {
    width: 100%;
  }
`;
const CajaTitulo = styled.div`
  height: 30px;
  border: 1px solid ${Tema.primary.grisNatural};
  background-color: ${Tema.primary.grisNatural};
  background-color: ${ClearTheme.secondary.azulVerdeOsc};
  color: white;
  overflow: hidden;
  display: flex;
  height: 10%;
  position: relative;
  &.detalleReq {
    display: none;
  }
`;
const Titulo = styled.h2`
  width: 100%;
  text-align: center;
  vertical-align: 1.4rem;
  font-size: 1.4rem;

  align-content: center;
`;
const XCerrar = styled.p`
  width: 10%;
  height: 100%;
  align-content: center;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid black;
  &:hover {
    border: 1px solid white;
  }
  cursor: pointer;
  position: absolute;
  right: 0;
`;
const TextoSolicitud = styled.p`
  width: 100%;
  text-align: center;
  text-decoration: underline 2px solid ${ClearTheme.primary.azulBrillante};
  margin-bottom: 15px;
  color: white;
`;

const CajaContenido = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  &.clearModern {
    background-color: transparent;
  }
  width: 100%;
  display: flex;
  align-items: center;
  flex-direction: column;
`;
const SeccionFecha = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const ContainerWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: end;
  align-items: end;
  margin-bottom: 20px;
`;
const WrapSemana = styled.div`
  display: flex;
  align-items: center;
`;
const TextoWeek = styled.h2`
  color: ${Tema.primary.azulBrillante};
  @media screen and (max-width: 400px) {
    font-size: 20px;
  }
`;
const CajaWeek = styled.div`
  display: flex;
  justify-content: space-between;
  border: 1px solid ${Tema.secondary.azulOpaco};
  padding: 4px;
`;
const CajaDay = styled.div`
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 5px;
  color: ${Tema.primary.azulBrillante};
  cursor: pointer;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.selected {
    background-color: white;
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: white;
    cursor: auto;
    border: none;
    &:hover {
      border: none;
    }
  }
  &.hasProgramada {
    border: 1px solid ${Tema.complementary.warning};
  }
`;
const TextoDay = styled.h2`
  margin: 10px;
  color: inherit;

  @media screen and (max-width: 400px) {
    font-size: 20px;
    margin: 6px;
  }
  &.hasProgramada {
    color: ${Tema.complementary.warning};
  }
`;
const CajaInputChofer = styled.div`
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: end;
`;

const CajaBtn = styled.div`
  justify-content: center;
  text-align: center;
  height: 15%;
  background-color: transparent;
  &.detalleReq {
    background-color: transparent;
    border: none;
    bottom: 0;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 10px;
  margin-bottom: 10px;
`;

const CajaEntrada = styled.div`
  display: flex;

  align-items: end;

  justify-content: end;
  &.concluir {
    position: relative;
  }
  &.adicional {
    flex-direction: column;
  }
`;
const TituloSimple = styled.h2`
  font-size: 16px;
  font-weight: 400;
  display: inline-block;
  color: #fff;
  margin-bottom: 8px;
  margin-left: 20px;
  border-bottom: 1px solid #fff;
  margin-right: 15px;
  &.adicionalChofer {
    color: ${ClearTheme.complementary.warning};
    border-bottom: 1px solid;
  }
  white-space: nowrap;
`;
const InputDesplegable = styled(InputSimpleEditable)`
  width: 300px;
  height: 35px;
  padding: 5px;
  border: none;
  border: 1px solid black;
  border-radius: 5px;

  outline: none;
  color: ${Tema.primary.azulBrillante};
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  &.disabledChofer {
    color: ${Tema.primary.grisNatural};
    color: black;
  }
  &.adicionalChofer {
    color: ${ClearTheme.complementary.warning};

    &.disabledChofer {
      color: ${Tema.primary.grisNatural};
      color: black;
    }
  }
`;
const DataList = styled.datalist`
  background-color: red;
  width: 150%;
`;

const Opcion = styled.option`
  background-color: red;
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.secondary.azulOpaco};

  &.item {
    width: 100%;
    flex-direction: column;
    padding: 10px;
  }
  &.cajaBtn {
    background-color: transparent;
    justify-content: center;
  }
  &.cajaTitulo {
    border: none;
    padding: 10px;
  }
  &.cajaDetalles {
    flex-direction: column;
  }
  &.anular {
    width: 100%;
  }
`;

const TituloDetalle = styled.p`
  width: 50%;
  padding-left: 5px;
  color: white;
  text-align: start;
  text-decoration: underline;
  &.tituloArray {
    text-decoration: underline;
  }
  &.modoDisabled {
    text-decoration: underline;
  }
`;

const CajaTextArea = styled.div`
  display: flex;
  justify-content: start;
  margin-top: 5px;
  padding-left: 15px;
  width: 100%;
`;

const TextArea2 = styled(TextArea)`
  outline: none;

  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  height: 100px;
  width: 90%;
  min-width: 90%;
  max-width: 100%;
  min-height: 100px;
  resize: vertical;
  border: 1px solid ${Tema.secondary.azulProfundo};
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;
`;

const CajaHasPlanificado = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const TextoHasPlanificado = styled.div`
  color: ${Tema.complementary.warning};
  border-bottom: 1px solid ${Tema.complementary.warning};
`;

const Icono = styled(FontAwesomeIcon)`
  &.chofer {
    position: absolute;
    color: ${Tema.primary.azulBrillante};
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    cursor: pointer;
    border: 1px solid ${Tema.primary.grisNatural};
    padding: 5px;
    border-radius: 4px;
  }
`;
// Choferes adicionales
const ContenedorCA = styled.div`
  margin-top: 40px;
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const TituloCA = styled.h3`
  width: 100%;
  text-align: center;
  font-weight: 400;
  text-decoration: underline;
  font-size: 1.2rem;
  color: ${ClearTheme.complementary.warning};
  color: white;
`;
const CajaSubWrapInternal = styled.div`
  width: 100%;
  padding: 5px;
  display: flex;
  justify-content: center;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  border: none;
  min-height: 200px;
  height: 250px;
  overflow-y: scroll;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
    background-color: transparent;
    color: white;
  }
`;
const CajaChoferAdd = styled.div`
  margin-bottom: 18px;
  width: 60%;
  display: flex;
  flex-direction: column;
  align-items: end;
`;
const CajaLinea = styled.div`
  width: 100%;
  display: flex;
  justify-content: end;
`;
const Linea = styled.div`
  width: 100%;
  height: 1px;
  background-color: ${ClearTheme.complementary.warning};
`;
// WrapInternoChoferAdicionalconst
const WICA = styled.div`
  display: flex;
  align-items: end;

  justify-content: end;
  &.concluir {
    position: relative;
  }
`;

const DescripcionCamion = styled.h2`
  font-weight: 400;
  width: 100%;
  text-align: center;
  font-size: 1rem;
  color: ${ClearTheme.complementary.warning};
`;
const CajaStatusVAdd = styled.div`
  width: 100%;
  text-align: center;
`;
const TextoStatus2 = styled.h3`
  color: white;
`;
const CajaTopStatus = styled(CajaStatusComponent)`
  border-bottom: 1px solid ${Tema.neutral.blancoHueso};
  width: 100%;
`;
const TextoStatus = styled.h2`
  text-align: center;
  font-size: 1.3rem;
  color: white;
`;
const ParrafoIcon = styled.p`
  position: absolute;
  top: 50%;
  right: 10px;
  transform: translate(0, -50%);
  border: 1px solid ${Tema.primary.grisNatural};
  padding: 4px;
  border-radius: 4px;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
    cursor: pointer;
  }
`;
