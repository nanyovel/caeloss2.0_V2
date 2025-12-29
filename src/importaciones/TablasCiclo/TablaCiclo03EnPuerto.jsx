import { useEffect, useState } from "react";
import styled from "styled-components";
import { Alerta } from "../../components/Alerta";
import { doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ModalLoading } from "../../components/ModalLoading";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { faRotate } from "@fortawesome/free-solid-svg-icons";
import { calcDiasRestante } from "../components/libs.jsx";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";

import ImgInfo from "../../../public/img/informacion.png";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import {
  useDocByArrayCondition,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";
import TablaDefaultPuerto from "./PartsEnPuerto/TablaDefaultPuerto.jsx";
import { weekSelectFunction } from "./PartsEnPuerto/semana.js";
import TwoWeekBar from "./PartsEnPuerto/TwoWeekBar.jsx";
import MenuPestannias from "../../components/MenuPestannias.jsx";
import FuncionUpWayDate from "../components/FuncionUpWayDate.jsx";
import { generarArrayDestinos } from "./PartsEnPuerto/generarArrayDestinos.js";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado.jsx";

export const TablaCiclo03EnPuerto = ({ userMaster }) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [habilitar, setHabilitar] = useState({
    search: true,
    opcionesUnicas: false,
    destino: true,
  });
  // // ************************** CODIGO LOADING ************************** //
  const [isLoading, setIsLoading] = useState(false);
  const [dbFurgonesPuerto, setDBFurgonesPuerto] = useState(null);
  const [dbBLsFleteSuelto, setDBBLsFleteSuelto] = useState([]);
  const [dbPartidasPuerto, setDBPartidasPuerto] = useState([]);

  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (dbFurgonesPuerto == null) {
      setIsLoading(true);
    } else {
      setIsLoading(false);
    }
  }, [dbFurgonesPuerto]);
  useEffect(() => {
    if (dbBLsFleteSuelto.length > 0) {
      const partidasPuertoAux = dbBLsFleteSuelto.flatMap((bl) => {
        return bl.fleteSuelto.partidas;
      });
      const partidasPuerto = partidasPuertoAux.filter(
        (part) => part.status == 2
      );
      setDBPartidasPuerto(partidasPuerto);
    }
  }, [dbBLsFleteSuelto]);

  //****************** LLAMADAS A LA BASE DE DATOS ***************

  useDocByCondition("furgones", setDBFurgonesPuerto, "status", "==", 2);
  //
  const condiciones = [
    {
      campo: "estadoDoc",
      condicion: "==",
      valor: 0,
    },
    {
      campo: "fleteSuelto.numeroDoc",
      condicion: "!=",
      valor: "",
    },
  ];
  //
  useDocByArrayCondition("billOfLading2", setDBBLsFleteSuelto, condiciones);

  // // ******************** ESTADOS PRINCIPALES ******************** //
  // La utilizo para reiniciar las demas lista, esto por ejemplo luego de filtrar
  const [initialValueFurgones, setInitialValueFurgones] = useState([]);

  // Lista de furgones que se imprimen en Pantalla como todos los furgones en estado En Puerto
  const [listaFurgonesMaster, setListaFurgonesMaster] = useState([]);

  // Lista de contenedores en programacion:
  // Basicamente es la misma lista de furgones en puerto, pero filtrado para que solo quede los que en standBy==0 o ahora planificado en true
  // Esto son furgones con valores fijos que no recibiran modificaciones
  const [initialValueProgramacion, setInitialValueProgramacion] = useState([]);
  const [listaProgramacion, setListaProgramacion] = useState([]);

  // Estos son todos los contenedores que tenemos en programacion pero editable, es decir se les cambia la propiedad planificado, destino y fechaRecepProg
  const [listaFurgonesEditable, setListaFurgonesEditable] = useState([]);
  const [initialValueEditable, setInitialValueEditable] = useState([]);

  const [weekSelected, setWeekSelected] = useState({});

  const [listDestinos, setListDestinos] = useState([]);
  // ********************** CONSOLIDACION // Parsear *********************

  useEffect(() => {
    //********** FURGONES **********
    const furgonesParsed =
      dbFurgonesPuerto?.map((furgon) => {
        const diasRestantes = calcDiasRestante(
          furgon.fechas.llegada02AlPais.fecha,
          furgon.datosBL.diasLibres
        );
        return {
          ...furgon,
          diasRestantes: diasRestantes,
        };
      }) || [];
    const sortFurgones = furgonesParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    //********** CARGA SUELTA **********
    const cargaSueltaParsed =
      dbPartidasPuerto?.map((part) => {
        const diasRestantes = calcDiasRestante(
          part.fechas.llegada02AlPais.fecha,
          part.datosBL.diasLibres
        );
        return {
          ...part,
          diasRestantes: diasRestantes,
          isCargaSuelta: true,
          part: part.numeroDoc,
        };
      }) || [];

    const sortCargaSuelta = cargaSueltaParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });

    const conglo = [...sortFurgones, ...sortCargaSuelta];
    setInitialValueFurgones(conglo);
    setListaFurgonesMaster(conglo);

    setInitialValueEditable(conglo);
    setListaFurgonesEditable(conglo);

    // ******PROGRAMACION CONSUMIBLE******
    const programacion = conglo.filter((furgon) => {
      // if (furgon.standBy == 2) {
      if (furgon.planificado) {
        return furgon;
      }
    });

    setListaProgramacion(programacion);
    setInitialValueProgramacion(programacion);
    setWeekSelected(weekSelectFunction(programacion));

    setListDestinos(generarArrayDestinos(programacion));
    setHabilitar({
      ...habilitar,
      search: false,
      destino: true,
    });
  }, [dbFurgonesPuerto, dbPartidasPuerto]);
  //

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entradaMaster = e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);

    const pestanniaSelect = arrayPestannias.find((op) => op.select);
    if ((pestanniaSelect.code == "contenedores") == true) {
      if (e.target.name == "inputBuscar") {
        setListaFurgonesMaster(
          initialValueFurgones.filter((furgon) => {
            if (
              furgon.numeroDoc.toLowerCase().includes(entradaMaster) ||
              furgon.datosBL.proveedor.toLowerCase().includes(entradaMaster) ||
              furgon.datosBL.numeroBL.toLowerCase().includes(entradaMaster) ||
              furgon.datosBL.naviera.toLowerCase().includes(entradaMaster) ||
              furgon.datosBL.puerto.toLowerCase().includes(entradaMaster)
            ) {
              return furgon;
            }
          })
        );
      }
    }
    if (e.target.value == "" && buscarDocInput == "") {
      setListaFurgonesMaster(initialValueFurgones);
      setListaFurgonesEditable(initialValueEditable);
    }
  };

  // // ******************** MANEJANDO Pestañas ******************** //
  const initialPestannia = [
    {
      nombre: "Programacion",
      select: true,
      code: "programacion",
    },
    {
      nombre: "Contenedores",
      select: false,
      code: "contenedores",
    },
  ];
  const [arrayPestannias, setArrayPestannias] = useState([]);
  useEffect(() => {
    if (userMaster) {
      const hasPermiso = userMaster.permisos.includes("planificacionPuertoIMS");
      const arrayPestaAux = [...initialPestannia];

      if (hasPermiso) {
        const avanzar = {
          nombre: "Avanzar",
          select: false,
          code: "avanzar",
        };
        arrayPestaAux.push(avanzar);
      }
      setArrayPestannias(arrayPestaAux);
    }
  }, [userMaster]);
  const handlePestannias = (e) => {
    const codeDataset = e.target.dataset.code;

    const arrayPestaniaAux = arrayPestannias.map((opcion) => {
      return {
        ...opcion,
        select: codeDataset === opcion.code,
      };
    });
    setArrayPestannias(arrayPestaniaAux);
    const opcionSelect = arrayPestaniaAux.find((opcion) => opcion.select);
    setDestinoDocInput("");
    if (opcionSelect.code == "programacion") {
      setListDestinos(generarArrayDestinos(initialValueProgramacion));
      setHabilitar({
        ...habilitar,
        search: false,
        destino: true,
      });
    } else if (opcionSelect.code == "contenedores") {
      setListDestinos(generarArrayDestinos(listaFurgonesMaster));

      setHabilitar({
        ...habilitar,
        search: true,
        destino: true,
      });
    } else if (opcionSelect.code == "avanzar") {
      avanzar();
    }

    if (opcionSelect.code !== "avanzar") {
      setListaProgramacion(initialValueFurgones);
      setListaFurgonesMaster(initialValueFurgones);
      setModoAvanzar(false);
      setListaFurgonesEditable(initialValueEditable);
      setBuscarDocInput("");

      setWeekSelected({
        ...weekSelected,
        week1: [
          ...weekSelected.week1.map((day) => {
            return {
              ...day,
              selected: false,
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
    }
    //
  };

  // ************************** HANDLE Tabla default ********************************* //
  const handleTablaDefault = (e) => {
    const { value, name } = e.target;

    const objetivoDataset = e.target.dataset.objetivo;

    switch (objetivoDataset) {
      case "handleinput":
        handleInputsTabla(e);
        break;
      case "deseleccionarFurgon":
        descelecionarFurgon(e);
        break;
      case "seleccionarFurgon":
        seleccionarFurgon(e);
        break;

      default:
        break;
    }
  };

  // ************************** CODIGO AVANZAR ********************************* //
  const [modoAvanzar, setModoAvanzar] = useState(false);

  const avanzar = () => {
    setModoAvanzar(true);
    setHabilitar({
      ...habilitar,
      search: false,
      destino: false,
    });
    setListDestinos([]);
  };

  const selecionarDia = (e) => {
    let validacionDiaActivo = true;
    let index = Number(e.target.dataset.id);
    const nombre = e.target.dataset.nombre;

    // Si el dia selecionado esta inactivo
    if (nombre == "semana1") {
      if (weekSelected.week1[index].disabled == true) {
        validacionDiaActivo = false;
        setMensajeAlerta("Este dia es anterior a la fecha actual.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    }
    validacionDiaActivo = true;
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

  const seleccionarFurgon = (e) => {
    let fechaElegida = false;

    let noFurgon = e.target.dataset.furgon;
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
    const annio = fechaTomar.slice(6, 10);
    const mes = fechaTomar.slice(3, 5);
    const dia = fechaTomar.slice(0, 2);
    const { llegadaAlmacen, llegadaDptoImport, llegadaSap } = FuncionUpWayDate(
      annio,
      mes,
      dia,
      3
    );

    if (fechaElegida == false) {
      setMensajeAlerta("Indique dia a programar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    const upFurgones = (setState, state) => {
      setState(
        state.map((furgon) => {
          if (furgon.numeroDoc == noFurgon) {
            return {
              ...furgon,
              fechaRecepProg: llegadaAlmacen,
              // standBy: 2,
              planificado: true,
              fechas: {
                ...furgon.fechas,
                llegada03Almacen: {
                  fecha: llegadaAlmacen,
                  confirmada: false,
                },
                llegada04DptoImport: {
                  fecha: llegadaDptoImport,
                  confirmada: false,
                },
                llegada05Concluido: {
                  fecha: llegadaSap,
                  confirmada: false,
                },
              },
            };
          } else {
            return furgon;
          }
        })
      );
    };

    upFurgones(setListaFurgonesEditable, listaFurgonesEditable);
    upFurgones(setInitialValueEditable, initialValueEditable);
  };

  const descelecionarFurgon = (e) => {
    let noFurgon = e.target.dataset.furgon;
    if (modoAvanzar) {
      const upFurgonDesSelecionar = (setState, state) => {
        const valorRetornar = state.map((furgon) => {
          if (furgon.numeroDoc == noFurgon) {
            return {
              ...furgon,
              // standBy: "",
              planificado: false,
              fechaRecepProg: "",
            };
          } else {
            return furgon;
          }
        });

        setState(valorRetornar);
      };
      upFurgonDesSelecionar(setListaFurgonesEditable, listaFurgonesEditable);
      upFurgonDesSelecionar(setInitialValueEditable, initialValueEditable);
    }
  };

  function primeraMayuscula(palabra) {
    // return palabra.charAt(0).toUpperCase() + palabra.slice(1).toLowerCase();
    return palabra.charAt(0).toUpperCase() + palabra.slice(1);
  }

  const handleInputsTabla = (e) => {
    const noFurgon = e.target.dataset.furgon;
    const { name, value } = e.target;

    setListaFurgonesEditable((prevState) =>
      prevState.map((furgon) => ({
        ...furgon,
        destino:
          noFurgon == furgon.numeroDoc && name == "destino"
            ? primeraMayuscula(value)
            : furgon.destino,
      }))
    );
  };

  // *********************** RESET PROGRAMACION ************************
  const resetProgramacion = () => {
    let newEditable = [];
    newEditable = listaFurgonesEditable.map((furgon) => {
      return {
        ...furgon,
        // standBy: "",
        planificado: false,
        fechaRecepProg: "",
      };
    });
    setListaFurgonesEditable(newEditable);
    setInitialValueEditable(newEditable);
  };

  // *******************GUARDAR EN BASE DE DATOS***************
  const guardarCambios = async () => {
    console.log("entro");
    const hasPermiso = userMaster.permisos.includes("planificacionPuertoIMS");
    if (!hasPermiso) {
      return;
    }
    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      // ******* FURGONES ********
      const furgonesPlanificados = listaFurgonesEditable.filter((furgon) => {
        if (furgon.planificado) {
          return furgon;
        }
      });
      console.log(furgonesPlanificados);
      if (furgonesPlanificados.length === 0) {
        const furgonesNormal = listaFurgonesEditable.filter(
          (furgon) => !furgon.isCargaSuelta
        );
        for (const furgon of furgonesNormal) {
          const furgonActualizar = doc(db, "furgones", furgon.id);
          batch.update(furgonActualizar, {
            planificado: false,
            fechaRecepProg: "",
          });
        }
      } else {
        const furgonesNormal = furgonesPlanificados.filter(
          (furgon) => !furgon.isCargaSuelta
        );

        for (const furgon of furgonesNormal) {
          const furgonActualizar = doc(db, "furgones", furgon.id);
          batch.update(furgonActualizar, {
            fechas: furgon.fechas,
            destino: furgon.destino,
            fechaRecepProg: furgon.fechaRecepProg,
            // standBy: furgon.standBy,
            planificado: furgon.planificado,
            status: 2,
          });
        }
      }
      // ************ CARGA SUELTA ************
      const partidasCargaSuelta = furgonesPlanificados.filter(
        (furgon) => furgon.isCargaSuelta
      );
      const idsBlsCargaSueltaUp = partidasCargaSuelta.map(
        (furgon) => furgon.datosBL.idBL
      );
      const blsUpCargaSuelta = dbBLsFleteSuelto.filter((bl) => {
        if (idsBlsCargaSueltaUp.includes(bl.id)) {
          return bl;
        }
      });

      blsUpCargaSuelta.forEach((bl) => {
        const blActualizar = doc(db, "billOfLading2", bl.id);
        const partidasParsed = bl.fleteSuelto.partidas.map((partida) => {
          const partidaFind = partidasCargaSuelta.find(
            (part) => part.numeroDoc == partida.numeroDoc
          );
          if (partidaFind) {
            return { ...partidaFind };
          } else {
            return { ...partida };
          }
        });
        batch.update(blActualizar, {
          "fleteSuelto.partidas": partidasParsed,
        });
      });

      await batch.commit();
      setIsLoading(false);
      setMensajeAlerta("Programacion guardada correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);

      // Redirecionar
      setBuscarDocInput("");
      setModoAvanzar(false);

      setHabilitar({
        ...habilitar,
        search: false,
        destino: true,
      });
    } catch (error) {
      console.error("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }
  };

  const [destinoDocInput, setDestinoDocInput] = useState("");
  const handleDestino = (e) => {
    const hasPermiso = userMaster.permisos.includes("planificacionPuertoIMS");
    if (!hasPermiso) {
      return;
    }
    const { value } = e.target;
    setDestinoDocInput(value);
    let entrada = value.toLowerCase();
    const posicionCaracter = entrada.indexOf("-");

    let entradaMaster = entrada.slice(posicionCaracter + 2);

    if (entradaMaster != "") {
      const opcionSelect = arrayPestannias.find((opcion) => opcion.select);
      if (opcionSelect.code == "programacion") {
        setListaProgramacion(
          initialValueProgramacion.filter((furgon) => {
            if (furgon.destino.toLowerCase() == entradaMaster) {
              return furgon;
            }
          })
        );
      } else if (opcionSelect.code == "contenedores") {
        setListaFurgonesMaster(
          initialValueFurgones.filter((furgon) => {
            if (furgon.destino.toLowerCase() == entradaMaster) {
              return furgon;
            }
          })
        );
      }
    } else if (entradaMaster == "") {
      setListaProgramacion(initialValueFurgones);
      setListaFurgonesMaster(initialValueFurgones);
    }
  };
  //
  //
  const [hasAviso, setHasAviso] = useState(false);
  return (
    userMaster && (
      <>
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />
        <CabeceraListaAll>
          <EncabezadoTabla>
            <TituloEncabezadoTabla>
              Lista de contenedores en puerto.
            </TituloEncabezadoTabla>
            <CajaImgInfo onClick={() => setHasAviso(true)}>
              <ImgIconInfo src={ImgInfo} />
            </CajaImgInfo>
            {hasAviso ? (
              <ModalInfo
                setHasAviso={setHasAviso}
                titulo={"En puerto"}
                texto={
                  "Es la tercera fase y establece la programación que define el destino de cada contenedor, inicia cuando el BL llega al país (al puerto) y finaliza cuando todos los contenedores de ese BL llegaron a su destino (generalmente un almacen de la empresa)."
                }
              ></ModalInfo>
            ) : null}
          </EncabezadoTabla>

          <CajaControles>
            {arrayPestannias?.find((opcion) => opcion.select)?.code ===
              "avanzar" && (
              <ElementoPrivilegiado
                userMaster={userMaster}
                privilegioReq="planificacionPuertoIMS"
              >
                <CajaBtnAvanzar>
                  <BtnSimple onClick={() => guardarCambios()}>
                    <Icono icon={faFloppyDisk} />
                    Guardar
                  </BtnSimple>
                  <BtnSimple
                    onClick={() => resetProgramacion()}
                    className="resetPrograma"
                    title="Borrar programacion"
                  >
                    <Icono icon={faRotate} />
                    Reset
                  </BtnSimple>
                </CajaBtnAvanzar>
              </ElementoPrivilegiado>
            )}
            <ControlesTablasMain
              habilitar={habilitar}
              handleSearch={handleSearch}
              buscarDocInput={buscarDocInput}
              listDestinos={listDestinos}
              handleDestino={handleDestino}
              destinoDocInput={destinoDocInput}
              tipo={modoAvanzar ? "enPuertoAvanzar enPuerto" : "enPuerto"}
            />
          </CajaControles>
        </CabeceraListaAll>
        <>
          {/* 🟢🟢🟢🟢🟢🟢-----PROGRAMACION-----🟢🟢🟢🟢🟢🟢 */}
          {arrayPestannias.find((opcion) => opcion.select)?.code ===
            "programacion" && (
            <>
              <CajaDescrip>
                <TextoDescriptivo>
                  La pestaña programacion muestra solo los furgones que estan
                  programados y ubicados en el recuadro del dia correspondiente.
                </TextoDescriptivo>
              </CajaDescrip>
              <ContenedorStandBy>
                <TituloDayStandBy className="tituloEditable">
                  Programa semana actual:
                </TituloDayStandBy>
                {weekSelected.week1?.map((day, index) => {
                  return (
                    <CajaDayStandBy key={index}>
                      <CajaTextoMasNum>
                        <TituloDayStandBy
                          className={day.disabled ? "pasado" : ""}
                        >
                          {day.nombre + " - "}
                          {day.fecha ? day.fecha.slice(0, 10) : "~"}
                          {day.disabled && day.qtyFurgones > 0 ? (
                            <TextroAtrasadoSpan>
                              - Planificacion atrasada
                            </TextroAtrasadoSpan>
                          ) : (
                            ""
                          )}
                        </TituloDayStandBy>
                        <TextoNumFurgon>
                          {day.qtyFurgones > 0 ? day.qtyFurgones : "-"}
                        </TextoNumFurgon>
                      </CajaTextoMasNum>

                      {day.disabled == false ? (
                        <TablaDefaultPuerto
                          userMaster={userMaster}
                          contenedores={listaProgramacion}
                          identificador={2}
                          MODO={"semana"}
                          day={day}
                          modoAvanzar={modoAvanzar}
                          handleTablaDefault={handleTablaDefault}
                        />
                      ) : (
                        // Semana Actual
                        // Planificacion atrasada *TablaEditable*
                        day.qtyFurgones > 0 && (
                          <>
                            <div key={index}>
                              {/* <TextoDiasAtrasados>
                            Existe planificacion atrasada
                          </TextoDiasAtrasados> */}
                              <TablaDefaultPuerto
                                userMaster={userMaster}
                                contenedores={listaProgramacion}
                                identificador={3}
                                day={day}
                                MODO={"semana"}
                                modoAvanzar={modoAvanzar}
                                handleTablaDefault={handleTablaDefault}
                              />
                            </div>
                          </>
                        )
                      )}
                    </CajaDayStandBy>
                  );
                })}
                <HR />
                <TituloDayStandBy className="tituloEditable">
                  -Programa semana próxima:
                </TituloDayStandBy>
                {weekSelected.week2?.map((day, index) => {
                  return (
                    <CajaDayStandBy key={index}>
                      <CajaTextoMasNum>
                        <TituloDayStandBy
                          className={day.disabled ? "pasado" : ""}
                        >
                          {day.nombre + " - "}
                          {day.fecha ? day.fecha.slice(0, 10) : "~"}
                        </TituloDayStandBy>
                        <TextoNumFurgon>
                          {day.qtyFurgones > 0 ? day.qtyFurgones : "-"}
                        </TextoNumFurgon>
                      </CajaTextoMasNum>
                      {day.disabled == false && (
                        <TablaDefaultPuerto
                          userMaster={userMaster}
                          contenedores={listaProgramacion}
                          identificador={4}
                          day={day}
                          MODO={"semana"}
                          modoAvanzar={modoAvanzar}
                          handleTablaDefault={handleTablaDefault}
                        />
                      )}
                    </CajaDayStandBy>
                  );
                })}
              </ContenedorStandBy>
            </>
          )}
          {/* 🟢🟢🟢🟢🟢🟢-----Contenedores-----🟢🟢🟢🟢🟢🟢 */}
          {arrayPestannias.find((opcion) => opcion.select)?.code ===
            "contenedores" && (
            <>
              <CajaDescrip>
                <TextoDescriptivo>
                  La pestaña contenedores muestra todos los contenedores que
                  tenemos en puerto sin importar que ya este planificado o no.
                </TextoDescriptivo>
              </CajaDescrip>
              <TablaDefaultPuerto
                userMaster={userMaster}
                contenedores={listaFurgonesMaster}
                identificador={1}
                modoAvanzar={modoAvanzar}
                handleTablaDefault={handleTablaDefault}
              />{" "}
            </>
          )}
          {/* 🟢🟢🟢🟢🟢🟢---------------Avanzar----------🟢🟢🟢🟢🟢🟢 */}
          {arrayPestannias.find((opcion) => opcion.select)?.code ===
            "avanzar" &&
            userMaster.permisos.includes("planificacionPuertoIMS") == true && (
              <>
                <TwoWeekBar
                  weekSelected={weekSelected}
                  selecionarDia={selecionarDia}
                />
                <TablaDefaultPuerto
                  userMaster={userMaster}
                  contenedores={listaFurgonesEditable}
                  identificador={85}
                  MODO={"planificar"}
                  modoAvanzar={true}
                  handleTablaDefault={handleTablaDefault}
                />
                <br />
                <br />
                {/* 123 */}
                <ContenedorStandBy className="editable">
                  <TituloDayStandBy className="tituloEditable">
                    -Programa semana actual:
                  </TituloDayStandBy>
                  {weekSelected.week1?.map((day, index) => {
                    return (
                      <CajaDayStandBy key={index}>
                        <TituloDayStandBy
                          className={day.disabled ? "pasado" : ""}
                        >
                          {day.nombre + " - "}
                          {day.fecha ? day.fecha.slice(0, 10) : "~"}
                          {day.disabled && day.qtyFurgones > 0 ? (
                            <TextroAtrasadoSpan>
                              - Planificacion atrasada
                            </TextroAtrasadoSpan>
                          ) : (
                            ""
                          )}
                        </TituloDayStandBy>
                        {day.disabled == false ? (
                          <TablaDefaultPuerto
                            userMaster={userMaster}
                            contenedores={listaFurgonesEditable}
                            identificador={5}
                            MODO={"semana"}
                            day={day}
                            modoAvanzar={true}
                            handleTablaDefault={handleTablaDefault}
                          />
                        ) : (
                          day.qtyFurgones > 0 && (
                            <>
                              <div key={index}>
                                <TablaDefaultPuerto
                                  userMaster={userMaster}
                                  contenedores={listaFurgonesEditable}
                                  identificador={6}
                                  day={day}
                                  MODO={"semana"}
                                  modoAvanzar={true}
                                  handleTablaDefault={handleTablaDefault}
                                />
                              </div>
                            </>
                          )
                        )}
                      </CajaDayStandBy>
                    );
                  })}
                  <HR />
                  <TituloDayStandBy className="tituloEditable">
                    -Programa semana próxima:
                  </TituloDayStandBy>
                  {weekSelected.week2?.map((day, index) => {
                    return (
                      <CajaDayStandBy key={index}>
                        <TituloDayStandBy
                          className={day.disabled ? "pasado" : ""}
                        >
                          {day.nombre + " - "}
                          {day.fecha ? day.fecha.slice(0, 10) : "~"}
                        </TituloDayStandBy>
                        {day.disabled == false && (
                          <TablaDefaultPuerto
                            userMaster={userMaster}
                            contenedores={listaProgramacion}
                            identificador={7}
                            day={day}
                            MODO={"semana"}
                            modoAvanzar={true}
                            handleTablaDefault={handleTablaDefault}
                          />
                        )}
                      </CajaDayStandBy>
                    );
                  })}
                </ContenedorStandBy>
              </>
            )}

          <br />
          <br />
          <br />
          <br />
          <br />
          <br />
        </>
        {isLoading && <ModalLoading completa={true} />}
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </>
    )
  );
};

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
  margin-top: 10px;
`;

const EncabezadoTabla = styled.div`
  text-decoration: underline;
  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (max-width: 720px) {
    padding-left: 0;
  }
`;
const TituloEncabezadoTabla = styled.h2`
  color: black;
  font-size: 1.2rem;
  font-weight: normal;
  padding: 0 10px;
  @media screen and (max-width: 500px) {
    font-size: 16px;
  }
  @media screen and (max-width: 420px) {
    font-size: 14px;
  }

  &.descripcionEtapa {
    font-size: 0.9rem;
    margin: 0;
    padding: 0 15px;
    @media screen and (max-width: 480px) {
      font-size: 12px;
      /* border: 1px solid red; */
    }
  }
`;

const CajaControles = styled.div`
  display: flex;
  align-items: end;
  /* padding: 0 15px; */
  @media screen and (max-width: 1000px) {
    flex-direction: column;
  }
`;
const CajaBtnAvanzar = styled.div`
  display: flex;
  justify-content: start;
  align-items: end;
  height: 100%;
  padding: 5px;
  gap: 5px;
`;

const BtnSimple = styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;

  min-width: 120px;
  &.avanzar {
    background-color: ${Tema.complementary.warning};
    color: black;

    &.modoAvanzar {
      background-color: #a79d9d;
      color: #383e44;
    }
    &:focus {
      color: #383e44;
    }
    &:hover {
      background-color: white;
    }
    &:active {
      background-color: #0074d9;
      color: white;
    }
  }
  &.resetPrograma {
    width: auto;
    padding: 0 15px;
  }
`;

const ContenedorStandBy = styled.div`
  /* background-color: ${Theme.secondary.azulExtraProfundo}; */
  background-color: ${ClearTheme.secondary.azulFrosting};
  border: 1px solid white;
  backdrop-filter: blur(5px);
  color: white;
  &.editable {
  }
`;

const CajaDayStandBy = styled.div``;
const HR = styled.hr``;

const TituloDayStandBy = styled.h2`
  margin-left: 40px;
  &.pasado {
    font-size: 0.9rem;
    color: ${Tema.secondary.azulOpaco};
    color: #cccccc;
    border-bottom: 1px solid black;
    font-weight: 400;
  }
  &.tituloCabeza {
    display: inline-block;
    margin-left: 20px;
    color: ${Tema.secondary.azulOpaco};
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.tituloEditable {
    display: inline-block;
    text-decoration: underline;
    margin-left: 20px;
    color: ${Tema.secondary.azulOpaco};
    color: white;
    color: ${ClearTheme.complementary.warning};
  }

  color: white;
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion {
    cursor: pointer;
  }
`;

const TextroAtrasadoSpan = styled.span`
  font-size: 1.2rem;
  color: ${Tema.complementary.warning};
  text-align: center;
`;

const CajaTextoMasNum = styled.div`
  display: flex;
  justify-content: space-between;
  /* padding: 0 5px; */
  padding-right: 35px;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
`;
const TextoNumFurgon = styled.h2`
  color: aliceblue;
  color: ${Tema.primary.azulBrillante};
  color: white;
`;
const CajaImgInfo = styled.div`
  position: absolute;
  right: 0;
  /* top: -10px; */
  width: 35px;
  height: 35px;
  margin-left: 25px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ease all 0.2s;
  background-color: #818181;
  border-radius: 4px;
  &:hover {
    transform: scale(1.1);
    right: 5px;
    background-color: ${ClearTheme.complementary.warning};
    cursor: pointer;
  }
`;
const ImgIconInfo = styled.img`
  width: 25px;
`;
const CajaDescrip = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 8px;
  color: ${ClearTheme.complementary.warning};
`;
const TextoDescriptivo = styled.p``;
