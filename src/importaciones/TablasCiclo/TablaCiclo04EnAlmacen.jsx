import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Alerta } from "../../components/Alerta";
import { doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import FuncionUpWayDate from "../components/FuncionUpWayDate";
import { Interruptor } from "../../components/Interruptor";
import { calcDiasRestante, colorDaysRemaining } from "../components/libs.jsx";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import ImgInfo from "../../../public/img/informacion.png";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { InputSimpleEditable } from "../../components/InputGeneral.jsx";
import {
  useDocByArrayCondition,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";

import MenuPestannias from "../../components/MenuPestannias.jsx";
import { generarArrayDestinos } from "./PartsEnPuerto/generarArrayDestinos.js";
import { furgonSchema } from "../schema/furgonSchema.js";
import { ModalLoading } from "../../components/ModalLoading.jsx";
import { sendEmailFromFurgon } from "../libs/sendEmailFromFurgon.js";

export const TablaCiclo04EnAlmacen = ({ userMaster }) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [hasAviso, setHasAviso] = useState(false);

  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [habilitar, setHabilitar] = useState({
    destino: true,
    opcionesUnicas: true,
  });

  // ************************** CODIGO LOADING ************************** //

  // BLs carga suelta abiertos
  const [dbBLsFleteSuelto, setDBBLsFleteSuelto] = useState([]);

  // En puerto
  const [dbPartidasPuerto, setDBPartidasPuerto] = useState([]);
  const [dbFurgonesEnPuerto, setDBFurgonesEnPuerto] = useState([]);

  // En Almacen
  const [dbPartidasAlm, setDBPartidasAlmacen] = useState([]);
  const [dbFurgonesEnAlmacen, setDBFurgonesEnAlmacen] = useState([]);
  //
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  //
  useEffect(() => {
    if (dbFurgonesEnAlmacen.length > 0) {
      setIsLoading(false);
    }
    if (dbFurgonesEnAlmacen.length == 0) {
      setIsLoading(true);
    }
  }, [dbFurgonesEnAlmacen]);

  //****************** CARGAR EL ESTADO GLOBAL (FURGONES y CARGA SUELTA)*************** */
  // LLamadas en Puerto
  useDocByCondition("furgones", setDBFurgonesEnPuerto, "status", "==", 2);
  const condicionesPuerto = [
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
  useDocByArrayCondition(
    "billOfLading2",
    setDBBLsFleteSuelto,
    condicionesPuerto
  );

  // LLamadas En Almacen
  useDocByCondition("furgones", setDBFurgonesEnAlmacen, "status", "==", 3);

  //

  useEffect(() => {
    if (dbBLsFleteSuelto.length > 0) {
      const partidasPuertoAux = dbBLsFleteSuelto.flatMap((bl) => {
        return bl.fleteSuelto.partidas;
      });
      const partidasPuerto = partidasPuertoAux.filter(
        (part) => part.status == 2
      );
      const partidasAlmacen = partidasPuertoAux.filter(
        (part) => part.status == 3
      );
      console.log(partidasPuerto);
      setDBPartidasPuerto(partidasPuerto);
      setDBPartidasAlmacen(partidasAlmacen);
    }
  }, [dbBLsFleteSuelto]);
  //
  // ******************** ESTADOS PRINCIPALES ******************** //
  // Furgones en programacion es decir en status en puerto
  const [furgonesProgEnPuerto, setFurgonesProgEnPuerto] = useState([]);
  const [initialProgPuerto, setInitialProgPuerto] = useState([]);

  // Furgones en status en almacen
  const [furgonesEditables, setFurgonesEditables] = useState([]);
  const [initialValueEditable, setInitialValueEditable] = useState([]);

  const [listDestinos, setListDestinos] = useState([]);

  // ********************** CONSOLIDACION // Parsear *********************
  useEffect(() => {
    // **************** EN PUERTO FURGONES/CARGA SUELTA***************
    const cargaSueltaPuertoParsed =
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

    const sortCargaSueltaPuerto = cargaSueltaPuertoParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    const furgonPuertoParsed =
      dbFurgonesEnPuerto?.map((part) => {
        const diasRestantes = calcDiasRestante(
          part.fechas.llegada02AlPais.fecha,
          part.datosBL.diasLibres
        );
        return {
          ...part,
          diasRestantes: diasRestantes,
          isCargaSuelta: false,
          part: part.numeroDoc,
        };
      }) || [];
    const sortFurgonesEnPuerto = furgonPuertoParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    const congloEnPuerto = [...sortFurgonesEnPuerto, ...sortCargaSueltaPuerto]
      .filter((furgon) => {
        // if (furgon.status == 2 && furgon.standBy == 2) {
        if (furgon.status == 2 && furgon.planificado) {
          return {
            ...furgon,
          };
        }
      })
      .map((furgon) => {
        const diasRestantes = calcDiasRestante(
          furgon.fechas.llegada02AlPais.fecha,
          furgon.datosBL.diasLibres
        );
        return {
          ...furgon,
          diasRestantes: diasRestantes,
          valoresAux: {
            ...furgonSchema.valoresAux,
          },
        };
      });
    setInitialProgPuerto(congloEnPuerto);
    setFurgonesProgEnPuerto(congloEnPuerto);
    setListDestinos(generarArrayDestinos(congloEnPuerto));

    // **************** EN ALMACEN FURGONES/CARGA SUELTA***************
    const furgonesParsed = dbFurgonesEnAlmacen.map((furgon) => {
      const diasRestantes = calcDiasRestante(
        furgon.fechas.llegada02AlPais.fecha,
        furgon.datosBL.diasLibres
      );
      return {
        ...furgon,
        diasRestantes: diasRestantes,
      };
    });
    const sortFurgones = furgonesParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });

    const cargaSueltaAlmParsed =
      dbPartidasAlm?.map((part) => {
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

    const sortCargaSueltaAlm = cargaSueltaAlmParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    const congloAlm = [...sortCargaSueltaAlm, ...sortFurgones];
    const congloParsed = congloAlm.map((furgon) => {
      return {
        ...furgon,
        valoresAux: {
          ...furgonSchema.valoresAux,
        },
      };
    });
    setInitialValueEditable(congloParsed);
    setFurgonesEditables(congloParsed);
    //
  }, [dbFurgonesEnAlmacen, dbFurgonesEnPuerto, dbPartidasPuerto]);
  //
  //  ******************** MANEJANDO Pestañas ******************** //
  const enAlmacen = {
    nombre: "En almacen",
    select: true,
    code: "enAlmacen",
  };

  const [arrayPestannias, setArrayPestannias] = useState([]);

  useEffect(() => {
    if (userMaster) {
      let arrayPestAux = [enAlmacen];
      const enPuerto = {
        nombre: "En puerto",
        select: false,
        code: "enPuerto",
      };
      const hasPermiso = userMaster.permisos.includes("llegadaAlmacenIMS");
      if (hasPermiso) {
        arrayPestAux = [enPuerto, enAlmacen];
      }
      setArrayPestannias(arrayPestAux);
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
    setFurgonesProgEnPuerto(initialProgPuerto);
    setFurgonesEditables(initialValueEditable);

    if (opcionSelect.code == "enPuerto") {
      setListDestinos(generarArrayDestinos(initialProgPuerto));
      setHabilitar({
        ...habilitar,
        search: false,
        destino: true,
      });
    } else if (opcionSelect.code == "enAlmacen") {
      setListDestinos(generarArrayDestinos(initialValueEditable));
      setHabilitar({
        ...habilitar,
        destino: true,
      });
    }
  };

  // ******************** MANEJANDO EL INPUT search / Destino ******************** //
  const [destinoDocInput, setDestinoDocInput] = useState("");
  const handleDestino = (e) => {
    setDestinoDocInput(e.target.value.toLowerCase());
    let entrada = e.target.value.toLowerCase();
    const posicionCaracter = entrada.indexOf("-");

    let entradaMaster = entrada.slice(posicionCaracter + 2);

    if (entradaMaster != "") {
      setFurgonesProgEnPuerto(
        initialProgPuerto.filter((furgon) => {
          if (furgon.destino.toLowerCase() == entradaMaster) {
            return furgon;
          }
        })
      );
      setFurgonesEditables(
        initialValueEditable.filter((furgon) => {
          if (furgon.destino.toLowerCase() == entradaMaster) {
            return furgon;
          }
        })
      );
    } else if (entradaMaster == "") {
      setFurgonesProgEnPuerto(initialProgPuerto);
      setFurgonesEditables(initialValueEditable);
    }
  };
  //
  // ******************** inputs tabla ******************** //
  const handleInputsTabla = (e) => {
    const indexDataset = e.target.dataset.index;
    const { value, name } = e.target;
    console.log(value);
    let proceder = true;
    let isRecibido = e.target.checked;
    if (name == "fechaLlegadaAlmacen") {
      const annio = value.slice(0, 4);
      const mes = value.slice(5, 7);
      const dia = value.slice(8, 10);
      const fechaActual = new Date();
      const llegadaAlmacenES6 = new Date(annio, mes - 1, dia);
      // Primero confirmar que no es el mismo dia

      if (
        llegadaAlmacenES6.getFullYear() !== fechaActual.getFullYear() ||
        llegadaAlmacenES6.getMonth() !== fechaActual.getMonth() ||
        llegadaAlmacenES6.getDate() !== fechaActual.getDate()
      ) {
        if (llegadaAlmacenES6 > fechaActual) {
          setMensajeAlerta(
            "La fecha indicada no puede ser posterior a la fecha actual."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
    } else if (name == "checkboxRecibido") {
      console.log(e);
      furgonesProgEnPuerto.forEach((furgon, index) => {
        if (indexDataset == index) {
          if (furgon.valoresAux.llegadaAlmacenMostrar == "") {
            setMensajeAlerta("Favor indicar fecha.");
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            proceder = false;
          }
        }
      });
    }
    if (!proceder) {
      return;
    }
    const furgonesAux = furgonesProgEnPuerto.map((furgon, index) => {
      if (index == indexDataset) {
        return {
          ...furgon,
          valoresAux: {
            ...furgon.valoresAux,
            llegadaAlmacenMostrar:
              name == "fechaLlegadaAlmacen"
                ? value
                : furgon.valoresAux.llegadaAlmacenMostrar,
            isRecibido:
              name == "checkboxRecibido"
                ? isRecibido
                : furgon.valoresAux.isRecibido,
          },
        };
      } else {
        return furgon;
      }
    });

    console.log(furgonesAux);
    setFurgonesProgEnPuerto(furgonesAux);
  };

  // ******************** Guardar llegada ******************** //
  const guardarLlegada = async () => {
    const hasPermiso = userMaster.permisos.includes("llegadaAlmacenIMS");
    if (!hasPermiso) {
      return;
    }
    // Si no hay furgones marcados como recibidos
    const sinRecibido = furgonesProgEnPuerto.every(
      (furgon) => furgon.valoresAux.isRecibido == false
    );
    if (sinRecibido) {
      setMensajeAlerta("Marque al menos un contenedor.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      const envioDeCorreo = {
        ordenesUtilizar: [],
        itemsUtilizar: [],
      };
      const arrayFurgonesEnviarCorreo = [];

      // 1-****Actualiza furgones normales ******
      const furgonesNormal = furgonesProgEnPuerto.filter(
        (furgon) => !furgon.isCargaSuelta
      );
      // furgonesNormal.forEach((furgon) => {
      for (const furgon of furgonesNormal) {
        if (furgon.valoresAux.isRecibido) {
          envioDeCorreo.ordenesUtilizar.push(
            ...furgon.materiales.map((item) => item.ordenCompra)
          );
          envioDeCorreo.itemsUtilizar.push(
            ...furgon.materiales.map((item) => item.codigo)
          );

          const furgonActualizar = doc(db, "furgones", furgon.id);
          const valueLLegada = furgon.valoresAux.llegadaAlmacenMostrar;
          const annio = valueLLegada.slice(0, 4);
          const mes = valueLLegada.slice(5, 7);
          const dia = valueLLegada.slice(8, 10);
          const { llegadaAlmacen, llegadaDptoImport, llegadaSap } =
            FuncionUpWayDate(annio, mes, dia, 3);
          batch.update(furgonActualizar, {
            status: 3,
            descargado: false,
            planificado: false,
            // Esto es importante reiniciarlo, en ese caso realmente no es necesario, pero en el caso de la carga suelta
            // si que lo es, entonces para tener coherencia lo colocamos en ambos
            valoresAux: {
              ...furgonSchema.valoresAux,
            },
            fechas: {
              ...furgon.fechas,
              llegada03Almacen: {
                fecha: llegadaAlmacen,
                confirmada: true,
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
          });

          // ****Enviar correo****
          arrayFurgonesEnviarCorreo.push(furgon);
        }
      }
      //
      // 2-****Actualiza partidas de Cargas sueltas ******
      const partidasCargaSuelta = furgonesProgEnPuerto.filter(
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
      console.log(furgonesProgEnPuerto);
      console.log(furgonesProgEnPuerto);
      blsUpCargaSuelta.forEach((bl) => {
        const partidasParsed = bl.fleteSuelto.partidas.map((partida) => {
          const partidaFind = partidasCargaSuelta.find(
            (part) => part.numeroDoc == partida.numeroDoc
          );

          if (partidaFind?.planificado) {
            if (partidaFind?.valoresAux?.isRecibido) {
              envioDeCorreo.ordenesUtilizar.push(
                ...partida.materiales.map((item) => item)
              );
              envioDeCorreo.itemsUtilizar.push(
                ...partida.materiales.map((item) => item.codigo)
              );
              //

              const valueLLegada = partidaFind.valoresAux.llegadaAlmacenMostrar;
              const annio = valueLLegada.slice(0, 4);
              const mes = valueLLegada.slice(5, 7);
              const dia = valueLLegada.slice(8, 10);
              const { llegadaAlmacen, llegadaDptoImport, llegadaSap } =
                FuncionUpWayDate(annio, mes, dia, 3);
              console.log(partidaFind);
              if (partidaFind) {
                // ****Enviar correo****
                arrayFurgonesEnviarCorreo.push(partida);
                return {
                  ...partidaFind,
                  // Esto es importante colocarlo, porque estamos retornando, la partida completa y estos valores se deben reinicar para no guardar en base de datos
                  // De no reiniciarse al editar un bl y cambiar el estatus de una partida, esta aparecera una partida que esta en puerto, aparecera que fue recibida esto para que el usuario al presionar guardar se pase a estatus almacen, pero esto no es lo que queremos sino que el usuario explicitamente presione recibido en almacne cuando realmente ocurra

                  valoresAux: {
                    ...furgonSchema.valoresAux,
                  },
                  status: 3,
                  descargado: false,
                  planificado: false,
                  fechas: {
                    ...partidaFind.fechas,
                    llegada03Almacen: {
                      fecha: llegadaAlmacen,
                      confirmada: true,
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
                return { ...partida };
              }
            }
          }
          return { ...partida };
        });

        console.log(partidasParsed);
        const blActualizar = doc(db, "billOfLading2", bl.id);
        batch.update(blActualizar, {
          "fleteSuelto.partidas": partidasParsed,
        });
      });
      //

      await batch.commit();
      console.log(arrayFurgonesEnviarCorreo);
      for (const furgon of arrayFurgonesEnviarCorreo) {
        // Estado del ciclo es 3, que es almacen
        sendEmailFromFurgon(furgon, 3, "📦 Mercancia en almacen.");
      }
      setIsLoading(false);
      setMensajeAlerta("Actualizacion realizada.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // async function enviarCorreoLib(furgon, estadoCiclo, asunto) {
  //   const ordenesUtilizadas = furgon.materiales.map((item) => {
  //     return item.ordenCompra;
  //   });
  //   const notificacionesOrdenes = await fetchDocsByIn(
  //     "notificaciones",
  //     undefined,
  //     "numOrigenDoc",
  //     ordenesUtilizadas
  //   );
  //   const codigosItems = furgon.materiales.map((item) => item.codigo);
  //   const notificacionesArticulos = await fetchDocsByIn(
  //     "notificaciones",
  //     undefined,
  //     "numOrigenDoc",
  //     codigosItems
  //   );
  //   // Conglo
  //   const notificaciones = [
  //     ...notificacionesOrdenes,
  //     ...notificacionesArticulos,
  //   ];
  //   const correoDestinos = notificaciones
  //     .flatMap((not) => not.destinatarios)
  //     .map((dest) => dest.correo);
  //   const destinos = [...new Set(correoDestinos)];

  //   if (destinos.length > 0) {
  //     FuncionEnviarCorreo({
  //       para: destinos,
  //       asunto: asunto,
  //       mensaje: PlantillaBL({
  //         furgonMaster: furgon,
  //         // Mercancia en almacen es estado
  //         estadoDoc: estadoCiclo,
  //       }),
  //     });
  //   }
  // }

  // ********************** DESCARGAR CONTENEDOR ***************
  const descargarFurgon = async (e) => {
    const hasPermiso = userMaster.permisos.includes("llegadaAlmacenIMS");
    if (!hasPermiso) {
      return;
    }
    const indexDataset = Number(e.target.dataset.index);
    const checK = e.target.checked;
    const furgonFind = furgonesEditables.find((furgon, index) => {
      if (index == indexDataset) {
        return furgon;
      }
    });

    try {
      // 1-Furgon normal
      if (!furgonFind.isCargaSuelta) {
        const furgonActualizar = doc(db, "furgones", furgonFind.id);
        await updateDoc(furgonActualizar, {
          descargado: checK,
        });
      }
      // 2-Carga suelta
      else if (furgonFind.isCargaSuelta) {
        const blFind = dbBLsFleteSuelto.find(
          (bl) => bl.id === furgonFind.datosBL.idBL
        );

        const partidasUp = blFind.fleteSuelto.partidas.map((part) => {
          if (part.numeroDoc === furgonFind.numeroDoc) {
            console.log(part);
            return {
              ...part,
              valoresAux: {
                ...furgonSchema.valoresAux,
              },
              descargado: checK,
            };
          } else {
            return { ...part };
          }
        });
        const blActualizar = doc(db, "billOfLading2", blFind.id);
        await updateDoc(blActualizar, {
          "fleteSuelto.partidas": partidasUp,
        });
      }
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ********************** MARCAR COMO DOCUMENTO ENVIADO ***************
  const docEnviados = (e) => {
    const indexDataset = Number(e.target.dataset.index);
    const checK = e.target.checked;

    // Si no esta descargado

    setFurgonesEditables(
      furgonesEditables.map((furgon, index) => {
        if (index == indexDataset) {
          console.log(furgon);
          if (!furgon.descargado) {
            setMensajeAlerta("Primero descargue el contenedor.");
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return furgon;
          }
          return {
            ...furgon,
            valoresAux: {
              ...furgon.valoresAux,
              isEnviado: checK,
            },
          };
        } else {
          return furgon;
        }
      })
    );
  };

  const guardarDocEnviados = async () => {
    const hasPermiso = userMaster.permisos.includes("docEnviadaCompraIMS");
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si no hay furgones marcados como recibidos
    const sinEnviados = furgonesEditables.every(
      (furgon) => furgon.valoresAux.isEnviado == false
    );
    if (sinEnviados) {
      setMensajeAlerta("Marque al menos un contenedor enviado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      const fechaActual = new Date();
      const annio = fechaActual.getFullYear();
      const mes = fechaActual.getMonth();
      const dia = fechaActual.getDate();
      const { llegadaDptoImport, llegadaSap } = FuncionUpWayDate(
        annio,
        mes + 1,
        dia,
        4
      );

      const envioDeCorreo = {
        ordenesUtilizar: [],
        itemsUtilizar: [],
      };
      const arrayFurgonesEnviarCorreo = [];
      // 1-🟢🟢🟢🟢****Actualiza furgones normales ******
      const furgonesNormal = furgonesEditables.filter(
        (furgon) => !furgon.isCargaSuelta
      );
      for (const furgon of furgonesNormal) {
        if (furgon.valoresAux.isEnviado) {
          envioDeCorreo.ordenesUtilizar.push(
            ...furgon.materiales.map((item) => item.ordenCompra)
          );
          envioDeCorreo.itemsUtilizar.push(
            ...furgon.materiales.map((item) => item.codigo)
          );
          const furgonActualizar = doc(db, "furgones", furgon.id);
          batch.update(furgonActualizar, {
            status: 4,
            descargado: true,
            planificado: false,
            valoresAux: {
              ...furgonSchema.valoresAux,
            },
            fechas: {
              ...furgon.fechas,
              llegada04DptoImport: {
                fecha: llegadaDptoImport,
                confirmada: true,
              },
              llegada05Concluido: {
                confirmada: false,
                fecha: llegadaSap,
              },
            },
          });

          // ****Enviar correo****
          arrayFurgonesEnviarCorreo.push(furgon);
        }
      }
      // 2-🟢🟢🟢🟢****Actualiza partidas de Cargas sueltas ******
      const partidasCargaSuelta = furgonesEditables.filter(
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
          if (partida?.descargado) {
            envioDeCorreo.ordenesUtilizar.push(
              ...partida.materiales.map((item) => item)
            );
            envioDeCorreo.itemsUtilizar.push(
              ...partida.materiales.map((item) => item.codigo)
            );
            //
            const partidaFind = partidasCargaSuelta.find(
              (part) => part.numeroDoc == partida.numeroDoc
            );

            if (partidaFind) {
              // ****Enviar correo****
              arrayFurgonesEnviarCorreo.push(partida);
              return {
                ...partidaFind,
                status: 4,
                descargado: true,
                planificado: false,
                // Esto es importante colocarlo, porque estamos retornando, la partida completa y estos valores se deben reinicar para no guardar en base de datos
                valoresAux: {
                  ...furgonSchema.valoresAux,
                },

                fechas: {
                  ...partidaFind.fechas,
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
              return { ...partida };
            }
          } else {
            return { ...partida };
          }
        });
        console.log(partidasParsed);
        batch.update(blActualizar, {
          "fleteSuelto.partidas": partidasParsed,
        });
      });

      // Confirmar
      await batch.commit();
      for (const furgon of arrayFurgonesEnviarCorreo) {
        // Estado del ciclo es 4, que es departamento de importaciones
        sendEmailFromFurgon(
          furgon,
          4,
          "🗂️ Documentacion de importacion concluida."
        );
      }

      setIsLoading(false);
      setMensajeAlerta("Guardado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      console.log("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  // 🟢🟢🟢🟢🟢********* ENVIAR CORREOS *************🟢🟢🟢🟢🟢*
  // // Notificaciones de ordenes
  // const ordenesUtilizadas = furgon.materiales.map((item) => {
  //   return item.ordenCompra;
  // });
  // const notificacionesOrdenes = await fetchDocsByIn(
  //   "notificaciones",
  //   undefined,
  //   "numOrigenDoc",
  //   ordenesUtilizadas
  // );

  // // Notificaciones de articulos
  // const codigosItems = furgon.materiales.map((item) => item.codigo);
  // const notificacionesArticulos = await fetchDocsByIn(
  //   "notificaciones",
  //   undefined,
  //   "numOrigenDoc",
  //   codigosItems
  // );

  // // Conglo
  // const notificaciones = [
  //   ...notificacionesOrdenes,
  //   ...notificacionesArticulos,
  // ];

  // const correoDestinos = notificaciones
  //   .flatMap((not) => not.destinatarios)
  //   .map((dest) => dest.correo);
  // const destinos = [...new Set(correoDestinos)];
  // if (destinos.length > 0) {
  //   FuncionEnviarCorreo({
  //     para: destinos,
  //     asunto: '',
  //     mensaje: PlantillaBL({
  //       furgonMaster: furgon,
  //       // Mercancia en importacion es estado
  //       estadoDoc: 4,
  //     }),
  //   });
  // }
  return (
    <>
      <ElementoPrivilegiado
        userMaster={userMaster}
        privilegioReq={"llegadaAlmacenIMS"}
      >
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />
      </ElementoPrivilegiado>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de contenedores en proceso de recepcion.
          </TituloEncabezadoTabla>
          <CajaImgInfo onClick={() => setHasAviso(true)}>
            <ImgIconInfo src={ImgInfo} />
          </CajaImgInfo>
          {hasAviso ? (
            <ModalInfo
              setHasAviso={setHasAviso}
              titulo={"Recepcion almacén"}
              texto={
                "Es la cuarta etapa del ciclo y comienza cuando el contenedor llega a su destino (usualmente un almacén de la empresa), y finaliza cuando quien recibe notifica al departamento de importaciones que la mercancía llegó correctamente."
              }
            ></ModalInfo>
          ) : null}
        </EncabezadoTabla>

        <CajaControles>
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq="llegadaAlmacenIMS"
          >
            {arrayPestannias.find((opcion) => opcion.select)?.code ==
              "enPuerto" && (
              <CajaBtn>
                <BtnSimple onClick={() => guardarLlegada()}>
                  <Icono icon={faFloppyDisk} />
                  Guardar
                </BtnSimple>
              </CajaBtn>
            )}
          </ElementoPrivilegiado>
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq="docEnviadaCompraIMS"
          >
            {arrayPestannias.find((opcion) => opcion.select)?.code ==
              "enAlmacen" && (
              <CajaBtn>
                <BtnSimple onClick={() => guardarDocEnviados()}>
                  Guardar
                </BtnSimple>
              </CajaBtn>
            )}
          </ElementoPrivilegiado>
          <ControlesTablasMain
            habilitar={habilitar}
            listDestinos={listDestinos}
            handleDestino={handleDestino}
            tipo={"almacen"}
            destinoDocInput={destinoDocInput}
          />
        </CajaControles>
      </CabeceraListaAll>

      {arrayPestannias.find((opcion) => opcion.select)?.code == "enPuerto" && (
        <ElementoPrivilegiado
          userMaster={userMaster}
          privilegioReq={"llegadaAlmacenIMS"}
        >
          <CajaDescrip>
            <TextoDescriptivo>
              La pestaña En puerto es una lista de todos los contenedores en
              puerto y que ademas han sido programados para recibir en la
              semana.
            </TextoDescriptivo>
          </CajaDescrip>

          <TituloDayStandBy>
            Contenedores en puerto programados
          </TituloDayStandBy>
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Numero33*</CeldaHeadGroup>
                  <CeldaHeadGroup>T</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>Puerto</CeldaHeadGroup>
                  <CeldaHeadGroup title="Dias Libres">DL</CeldaHeadGroup>
                  <CeldaHeadGroup title="Dias Restantes">DR</CeldaHeadGroup>
                  <CeldaHeadGroup title="Dias Restantes">
                    Destino
                  </CeldaHeadGroup>
                  <CeldaHeadGroup title="Fecha en que el contenedor llego almacen">
                    Llegó almacen
                  </CeldaHeadGroup>
                  <CeldaHeadGroup title="Confirmar llegada de furgon a almacen">
                    En almacen
                  </CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {furgonesProgEnPuerto.map((furgon, index) => {
                  return (
                    <FilasGroup key={index} className={`body `}>
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        {furgon.isCargaSuelta ? (
                          <Enlaces
                            to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                            target="_blank"
                          >
                            {furgon.numeroDoc}
                          </Enlaces>
                        ) : (
                          <Enlaces
                            to={`/importaciones/maestros/contenedores/${encodeURIComponent(furgon.numeroDoc)}`}
                            target="_blank"
                          >
                            {furgon.numeroDoc}
                          </Enlaces>
                        )}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{furgon.tamannio}</CeldasBodyGroup>

                      <CeldasBodyGroup
                        title={furgon.datosBL.proveedor}
                        className="proveedor"
                      >
                        {furgon.datosBL.proveedor}
                      </CeldasBodyGroup>

                      <CeldasBodyGroup
                        className="puerto"
                        title={furgon.datosBL.puerto}
                      >
                        {furgon.datosBL.puerto}
                      </CeldasBodyGroup>

                      <CeldasBodyGroup>
                        {furgon.datosBL.diasLibres}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        {!furgon.isCargaSuelta && (
                          <>
                            {furgon.diasRestantes}
                            {colorDaysRemaining(furgon.diasRestantes)}
                          </>
                        )}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{furgon.destino}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <InputEditable
                          type="date"
                          className="celda"
                          data-index={index}
                          value={
                            furgonesProgEnPuerto[index].valoresAux
                              .llegadaAlmacenMostrar
                          }
                          name="fechaLlegadaAlmacen"
                          onChange={(e) => {
                            handleInputsTabla(e);
                          }}
                        />
                      </CeldasBodyGroup>
                      <CeldasBodyGroup className="celdaBtn">
                        <CheckboxContainer>
                          <HiddenCheckbox
                            className="checkbox"
                            name="checkboxRecibido"
                            type="checkbox"
                            data-index={index}
                            onChange={(e) => handleInputsTabla(e)}
                            checked={
                              furgonesProgEnPuerto[index].valoresAux.isRecibido
                            }
                          />
                          <Checkmark> </Checkmark>
                        </CheckboxContainer>
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </ElementoPrivilegiado>
      )}
      {arrayPestannias.find((opcion) => opcion.select)?.code == "enAlmacen" && (
        <>
          <TituloDayStandBy>Contenedores en almacen</TituloDayStandBy>
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Numero11*</CeldaHeadGroup>
                  <CeldaHeadGroup>T</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>Puerto</CeldaHeadGroup>
                  <CeldaHeadGroup>Destino</CeldaHeadGroup>
                  <CeldaHeadGroup title="Dias Libres">DL</CeldaHeadGroup>
                  <CeldaHeadGroup title="Dias Restantes">DR</CeldaHeadGroup>
                  <ElementoPrivilegiado
                    userMaster={userMaster}
                    privilegioReq="llegadaAlmacenIMS"
                  >
                    <CeldaHeadGroup title="Dias Restantes">
                      Descargado
                    </CeldaHeadGroup>
                  </ElementoPrivilegiado>
                  <ElementoPrivilegiado
                    userMaster={userMaster}
                    privilegioReq="docEnviadaCompraIMS"
                  >
                    <CeldaHeadGroup>Enviado</CeldaHeadGroup>
                  </ElementoPrivilegiado>
                </FilasGroup>
              </thead>
              <tbody>
                {furgonesEditables.map((furgon, index) => {
                  return (
                    <FilasGroup
                      key={index}
                      className={`body ${furgon.descargado ? "descargado" : ""}`}
                    >
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody>
                        {furgon.isCargaSuelta ? (
                          <Enlaces
                            to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                            target="_blank"
                          >
                            {furgon.numeroDoc}
                          </Enlaces>
                        ) : (
                          <Enlaces
                            to={`/importaciones/maestros/contenedores/${encodeURIComponent(furgon.numeroDoc)}`}
                            target="_blank"
                          >
                            {furgon.numeroDoc}
                          </Enlaces>
                        )}
                      </CeldasBody>
                      <CeldasBody>{furgon.tamannio}</CeldasBody>

                      <CeldasBody
                        title={furgon.datosBL.proveedor}
                        className="proveedor"
                      >
                        {furgon.datosBL.proveedor}
                      </CeldasBody>

                      <CeldasBody
                        className="puerto"
                        title={furgon.datosBL.puerto}
                      >
                        {furgon.datosBL.puerto}
                      </CeldasBody>
                      <CeldasBody className="destino" title={furgon.destino}>
                        {furgon.destino}
                      </CeldasBody>

                      <CeldasBody>{furgon.datosBL.diasLibres}</CeldasBody>
                      <CeldasBody>
                        {!furgon.isCargaSuelta && (
                          <>
                            {furgon.diasRestantes}
                            {colorDaysRemaining(furgon.diasRestantes)}
                          </>
                        )}
                      </CeldasBody>

                      <ElementoPrivilegiado
                        userMaster={userMaster}
                        privilegioReq="llegadaAlmacenIMS"
                      >
                        <CeldasBody>
                          <Interruptor
                            index={index}
                            data-index={index}
                            valor={furgon.descargado}
                            noFurgon={furgon.numeroDoc}
                            handleChange={(e) => descargarFurgon(e)}
                            // disabled={accesoFullIMS ? false : true}
                          />
                        </CeldasBody>
                      </ElementoPrivilegiado>
                      <ElementoPrivilegiado
                        userMaster={userMaster}
                        privilegioReq={"docEnviadaCompraIMS"}
                      >
                        <CeldasBody>
                          <CheckboxContainer>
                            <HiddenCheckbox
                              className="checkbox"
                              name="checkboxRecibido"
                              type="checkbox"
                              data-index={index}
                              onChange={(e) => docEnviados(e)}
                              checked={furgon.valoresAux?.isEnviado}
                            />
                            <Checkmark> </Checkmark>{" "}
                          </CheckboxContainer>
                        </CeldasBody>
                      </ElementoPrivilegiado>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </>
      )}

      {isLoading ? <ModalLoading /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      <br />
      <br />
      <br />
      <br />
      <br />
      <br />
    </>
  );
};

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
  margin-top: 10px;
`;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CeldasBody = styled.td`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
  &.index {
    /* max-width: 5px; */
    /* background-color: red; */
  }

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  &.comentarios {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.status {
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
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
  align-items: start;
  padding-left: 25px;
  /* flex-direction: column; */
  /* justify-content: start; */
  @media screen and (max-width: 1000px) {
    align-items: start;
    flex-direction: column;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;
  &.confirmar {
    margin-right: 4px;
    width: auto;
  }
  &.avanzar {
    background-color: ${Tema.complementary.warning};
    color: black;

    &.modoAvanzar {
      background-color: #a79d9d;
      color: #383e44;
    }
    &:focus {
      /* background-color:  #a79d9d; */
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
  &.docEnviado {
    font-size: 0.8rem;
  }
  &.send {
    width: auto;
  }
`;
const TituloDayStandBy = styled.h2`
  border-bottom: 1px solid ${Tema.primary.azulBrillante};

  margin-left: 40px;
  &.pasado {
    font-size: 0.9rem;
    color: ${Tema.secondary.azulOpaco};
    border-bottom: 1px solid black;
  }
  &.tituloCabeza {
    display: inline-block;
    margin-left: 20px;
    color: ${Tema.secondary.azulOpaco};
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.tituloEditable {
    display: inline-block;
    margin-left: 20px;
    color: ${Tema.secondary.azulOpaco};
  }
  color: white;
`;

const InputEditable = styled(InputSimpleEditable)`
  height: 100%;
  /* width: 100%; */
  margin: 0;
  font-size: 0.8rem;
  &.celda {
    border: 2px solid black;
    &:focus {
      border: 2px solid black;
    }
  }
`;

// checkbox
const CheckboxContainer = styled.label`
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  color: #333;
  width: 100%;
  display: flex;
  height: 30px;

  justify-content: center;
  align-items: center;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Checkmark = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  /* transform: translateY(-50%); */
  transform: translate(-50%, -50%);
  height: 25px;
  width: 100%;
  background-color: #eee;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid #ccc;

  /* ✅ Hover del contenedor afecta al checkmark */
  ${CheckboxContainer}:hover ${HiddenCheckbox} ~ & {
    /* background-color: #cacaca; */
    border: 1px solid #18571a;
  }

  /* ✅ Cuando está marcado */
  ${HiddenCheckbox}:checked ~ & {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  /* Check interno (✔) */
  &::after {
    content: "";
    position: absolute;
    display: none;
  }

  ${HiddenCheckbox}:checked ~ &::after {
    display: block;
    left: 50%;
    top: 20%;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    /* transform: translate(-50%, -50%); */
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion {
    cursor: pointer;
  }
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
const CajaBtn = styled.div`
  padding: 6px;
`;
const CajaDescrip = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 8px;
  color: ${ClearTheme.complementary.warning};
`;
const TextoDescriptivo = styled.p``;
