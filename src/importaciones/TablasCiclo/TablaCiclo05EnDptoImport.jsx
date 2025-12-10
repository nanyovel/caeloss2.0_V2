import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CSSLoader } from "../../components/CSSLoader";
import { Alerta } from "../../components/Alerta";
import { doc, Timestamp, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import FuncionUpWayDate from "../components/FuncionUpWayDate";
import { CostosBL } from "../components/CostosBL.jsx";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import ImgInfo from "../../../public/img/informacion.png";
import {
  fetchDocsByConditionGetDocs,
  fetchDocsByIn,
  traerGrupoPorIds,
  useDocByArrayCondition,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { DestinatariosCorreo } from "../../components/DestinatariosCorreo.jsx";
import { TodosLosCorreosCielosDB } from "../../components/corporativo/TodosLosCorreosCielosDB.js";
import { ordenEstadoParsedNueva } from "../libs/ParsedEstadoDoc.js";
import MenuPestannias from "../../components/MenuPestannias.jsx";
import { calcDiasRestante } from "../components/libs.jsx";
import { furgonSchema } from "../schema/furgonSchema.js";
import { sendEmailFromFurgon } from "../libs/sendEmailFromFurgon.js";
import { ModalLoading } from "../../components/ModalLoading.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import TextoEptyG from "../../components/TextoEptyG.jsx";

export const TablaCiclo05EnDptoImport = ({ dbBillOfLading, userMaster }) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // // ************************** CODIGO LOADING ************************** //
  const [dbFurgonesEnImport, setDBFurgonesEnImport] = useState([]);
  // BLs carga suelta abiertos
  const [dbPartidasImport, setDBPartidasImport] = useState([]);
  const [dbBLsFleteSuelto, setDBBLsFleteSuelto] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (dbFurgonesEnImport.length > 0) {
      setIsLoading(false);
    }
    if (dbFurgonesEnImport.length == 0) {
      setIsLoading(true);
    }
  }, [dbFurgonesEnImport]);

  //****************** CARGAR EL ESTADO GLOBAL (FURGONES y CARGA SUELTA)*************** */
  useDocByCondition("furgones", setDBFurgonesEnImport, "status", "==", 4);
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
  useEffect(() => {
    console.log(dbBLsFleteSuelto);
    if (dbBLsFleteSuelto.length > 0) {
      const partidasCargaSuelta = dbBLsFleteSuelto.flatMap((bl) => {
        return bl.fleteSuelto.partidas;
      });
      const partidasPuertoAux = partidasCargaSuelta.filter(
        (part) => part.status == 4
      );

      setDBPartidasImport(partidasPuertoAux);
    } else if (dbBLsFleteSuelto.length == 0) {
      setDBPartidasImport([]);
    }
  }, [dbBLsFleteSuelto]);
  // // ******************** CONSOLIDACION ******************** //

  // Furgones en status en dptoImport (EDITABLE)
  const [furgonesEditables, setFurgonesEditables] = useState([]);
  // const [initialValueEditable, setInitialValueEditable]=useState([]);

  // Furgones en status dptoImport (CONSUMIBLE)
  const [listaFurgonesMaster, setListaFurgonesMaster] = useState([]);

  useEffect(() => {
    // **************** EN PUERTO FURGONES/CARGA SUELTA***************
    console.log(dbPartidasImport);
    const cargaSueltaPuertoParsed =
      dbPartidasImport?.map((part) => {
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

    const sortCargaSueltaImport = cargaSueltaPuertoParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    const furgonPuertoParsed =
      dbFurgonesEnImport?.map((part) => {
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
    const sortFurgonesImport = furgonPuertoParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });
    const congloEnPuerto = [
      ...sortFurgonesImport,
      ...sortCargaSueltaImport,
    ].map((furgon) => {
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
    setListaFurgonesMaster(congloEnPuerto);
    setFurgonesEditables(congloEnPuerto);

    let furgones = dbFurgonesEnImport;
    for (const bill of dbBillOfLading) {
      if (bill.estadoDoc != 2) {
        for (const furgon of bill.furgones) {
          furgones = [
            ...furgones,
            {
              ...furgon,
              proveedor: bill.proveedor,
              bl: bill.numeroDoc,
              puerto: bill.puerto,
              naviera: bill.naviera,
            },
          ];
        }
      }
    }
  }, [dbFurgonesEnImport, dbPartidasImport, dbBLsFleteSuelto]);

  //  ******************** MANEJANDO Pestañas ******************** //
  const [arrayPestannias, setArrayPestannias] = useState([
    {
      nombre: "Contenedores",
      select: true,
      code: "contenedores",
    },
    {
      nombre: "Avanzar",
      select: false,
      code: "avanzar",
    },
  ]);

  const handlePestannias = (e) => {
    const codeDataset = e.target.dataset.code;

    const arrayPestaniaAux = arrayPestannias.map((opcion) => {
      return {
        ...opcion,
        select: codeDataset === opcion.code,
      };
    });
    setArrayPestannias(arrayPestaniaAux);
  };

  // ************************** CODIGO AVANZAR ********************************* //

  const fijarBL = (e) => {
    const indexDataset = Number(e.target.dataset.index);
    const { name } = e.target;

    setFurgonesEditables(
      furgonesEditables.map((furgon, index) => {
        if (index == indexDataset) {
          return {
            ...furgon,
            valoresAux: {
              ...furgon.valoresAux,
              fijado: name == "btnListoSap",
            },
          };
        } else {
          return { ...furgon };
        }
      })
    );
  };

  const [costoArray, setCostoArray] = useState({
    costos: [],
    blIndicado: "",
    idBL: "",
  });
  const [mostrarCostos, setMostrarCostos] = useState(false);

  const guardarCambios = async () => {
    const hasPermiso = userMaster.permisos.includes("docEnSistemaIMS");
    if (!hasPermiso) {
      return;
    }

    // Si el usuario no ha fijado ninguna fecha
    const hasFijado = furgonesEditables.some(
      (furgon) => furgon.valoresAux.fijado == true
    );
    if (!hasFijado) {
      setMensajeAlerta(
        "Aun no marcar ningun contenedor como documentacion enviada."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
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
        5
      );
      const envioDeCorreo = {
        ordenesUtilizar: [],
        itemsUtilizar: [],
      };
      const arrayFurgonesEnviarCorreo = [];
      // furgonesEditables.forEach((furgon) => {
      //
      // 1-🟢🟢🟢🟢🟢 ******** Actualiza furgones normales ********* 🟢🟢🟢🟢🟢
      const furgonesNormal = furgonesEditables.filter(
        (furgon) => !furgon.isCargaSuelta
      );
      for (const furgon of furgonesNormal) {
        if (furgon.valoresAux.fijado) {
          arrayFurgonesEnviarCorreo.push(furgon);
          envioDeCorreo.ordenesUtilizar.push(
            ...furgon.materiales.map((item) => item.ordenCompra)
          );
          envioDeCorreo.itemsUtilizar.push(
            ...furgon.materiales.map((item) => item.codigo)
          );

          const furgonActualizar = doc(db, "furgones", furgon.id);
          batch.update(furgonActualizar, {
            status: 5,
            fechaConclucionStamp: Timestamp.fromDate(new Date()),
            fechas: {
              ...furgon.fechas,
              llegada05Concluido: {
                confirmada: true,
                fecha: llegadaSap,
              },
            },
          });

          // ********* Actualizar ordenes de compra
          // Antes las ordenes de compra tenian 2 estados:
          // 0-Abiertas
          // 1-Cerradas
          // Pero luego del 12/9/25 ahora las ordenes tienen 3 estados:
          // 0-Abiertas
          // 1-En proceso
          // 2-Cerradas
          // Por lo cual cuando se crea el BL, las ordenes pasan a estado 1 pero esto significa en proceso,
          // En concecuencia las ordenes se cierran aquí
          //
          // ****** Paso a paso: ******
          //  1- crea un array de todos los numeros de ordenes de compra de los materiales de todos los furgones fijados
          // de manera que si hay varios furgones que llaman la misma orden, esta orden se llame una sola vez a la base de datos
          //  2- elimina los duplicados de ese array, y llama todas esas ordenes de compra a la base de datos
          //  3- ahora crea un array de todos los ids de furgones de todas las orcenes
          //  4- elimina los duplicados de esos ids de furgones y ahora llama a la base de datos todos estos furgones
          //  5- reemplaza los furgones que se estan actualizando aquí y coloca los furgones que estan aqui actualizado localmente
          //  6- ahora que tenemos solo un array de furgones actualizado recorre el array de las ordenes de compra y si todos sus furgones estan listo en SAP entonces ponemos estadoDoc: 2 que es cerrado

          // Dame un array de todos los furgones listo en SAP
          const furgonesNormal = furgonesEditables.filter(
            (furgon) => !furgon.isCargaSuelta
          );
          const furgonesEnSap = furgonesNormal
            .filter((furgon) => furgon.valoresAux.fijado)
            .map((furgon) => {
              return {
                ...furgon,
                status: 5,
              };
            });

          // Dame un array de todos los materiales de estos furgones
          const materialesEnSap = furgonesEnSap.flatMap(
            (furgon) => furgon.materiales
          );
          // Dame un array de numeros de ordenes de compra
          const idsOrdenes = materialesEnSap.map((mat) => mat.idOrdenCompra);
          // Quita los string duplicados
          const idsOrdenesSinduplicados = [...new Set(idsOrdenes)];
          // Llama esas ordenes a la base de datos
          const ordenesDB = await traerGrupoPorIds(
            "ordenesCompra2",
            idsOrdenesSinduplicados
          );

          // Nueva forma con una funcion importada
          for (const orden of ordenesDB) {
            const nuevoEstado = await ordenEstadoParsedNueva(
              orden,
              furgonesEnSap
            );
            if (nuevoEstado != orden.estadoDoc) {
              const ordenActualizar = doc(db, "ordenesCompra2", orden.id);
              batch.update(ordenActualizar, {
                estadoDoc: nuevoEstado,
              });
            }
          }
        }
      }
      // 2-🟢🟢🟢🟢🟢 ******** Actualiza carga suelta ********* 🟢🟢🟢🟢🟢
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
        const partidasParsed = bl.fleteSuelto.partidas.map((partida) => {
          const partidaFind = partidasCargaSuelta.find(
            (part) => part.numeroDoc == partida.numeroDoc
          );
          if (partidaFind?.valoresAux?.fijado) {
            envioDeCorreo.ordenesUtilizar.push(
              ...partida.materiales.map((item) => item)
            );
            envioDeCorreo.itemsUtilizar.push(
              ...partida.materiales.map((item) => item.codigo)
            );

            console.log(partidaFind);
            if (partidaFind) {
              // ****Enviar correo****
              arrayFurgonesEnviarCorreo.push(partidaFind);
              return {
                ...partidaFind,
                // Esto es importante colocarlo, porque estamos retornando, la partida completa y estos valores se deben reinicar para no guardar en base de datos
                // De no reiniciarse al editar un bl y cambiar el estatus de una partida, esta aparecera una partida que esta en puerto, aparecera que fue recibida esto para que el usuario al presionar guardar se pase a estatus almacen, pero esto no es lo que queremos sino que el usuario explicitamente presione recibido en almacne cuando realmente ocurra

                valoresAux: {
                  ...furgonSchema.valoresAux,
                },
                status: 5,
                fechaConclucionStamp: Timestamp.fromDate(new Date()),
                fechas: {
                  ...partidaFind.fechas,

                  llegada05Concluido: {
                    fecha: llegadaSap,
                    confirmada: true,
                  },
                },
              };
            } else {
              return { ...partida };
            }
          }

          return { ...partida };
        });

        const blActualizar = doc(db, "billOfLading2", bl.id);
        batch.update(blActualizar, {
          "fleteSuelto.partidas": partidasParsed,
        });
      });

      // 3-🟢🟢🟢🟢🟢********* ACTUALIZAR estado de los BL *************🟢🟢🟢🟢🟢*
      // Dame un array de todos lo BL
      // recorre cada bl y llama a la base de datos todos sus furgones
      // luego this bl junta los furgones de la base de datos con los furgones locales editable reemplazando los que esten repetidos, dejando los locales en tal caso
      // ahora tenemos un array de todos sus furgones con el estado real,
      // ahora pregunta si todos los furgones estan en estado en SAP
      // en caso de que esten en estado SAP, coloca el estado del BL cerrado

      const idBLs = furgonesEditables.flatMap((furgon) => furgon.datosBL.idBL);
      const blsUtilizados = await traerGrupoPorIds("billOfLading2", idBLs);
      for (const bl of blsUtilizados) {
        let allConcluido = false;
        let tipoBL = 0;
        if (bl?.tipo) {
          tipoBL = bl.tipo;
        }
        // Si el BL es de furgones normal
        if (tipoBL === 0) {
          const furgonesThisBL_Local = furgonesEditables
            .filter((furgon) => furgon.datosBL.idBL === bl.id)
            .map((furgon) => {
              return {
                ...furgon,
                status: furgon.valoresAux.fijado ? 5 : furgon.status,
              };
            });
          // Verifica si algun furgon esta fijado, esto para no tener que llamar a la base de datos si no es necesario
          const hasFijado = furgonesThisBL_Local.some(
            (furgon) => furgon.valoresAux.fijado
          );
          if (!hasFijado) {
            continue;
          }

          const furgonesThisBL_DB = await fetchDocsByConditionGetDocs(
            "furgones",
            undefined,
            "datosBL.idBL",
            "==",
            bl.id
          );

          const furgonesUP = furgonesThisBL_DB.map((furgonDB) => {
            const furgonLocal = furgonesThisBL_Local.find(
              (furgon) => furgon.id == furgonDB.id
            );

            return furgonLocal ? furgonLocal : furgonDB;
          });

          allConcluido = furgonesUP.every((hijo) => hijo.status == 5);
        }

        // 2-Si el BL es de carga suelta
        else if (tipoBL === 1) {
          // Dame las partidas de la DB
          // Ahora dame las partidas locales
          // Junta ambas partidas
          // Haz un tercer array y donde halla colision elige las locales que estan en status 5 si estan fijada
          const partidasDB = bl.fleteSuelto.partidas;
          const partidasLocal = furgonesEditables
            .filter((furgon) => furgon.datosBL.idBL === bl.id)
            .map((furgon) => {
              return {
                ...furgon,
                status: furgon.valoresAux.fijado ? 5 : furgon.status,
              };
            });

          const partidasUP = partidasDB.map((partidasDB) => {
            const partLocal = partidasLocal.find(
              (part) => part.numeroDoc == partidasDB.numeroDoc
            );

            return partLocal ? partLocal : partidasDB;
          });
          allConcluido = partidasUP.every((part) => part.status == 5);
        }

        // Actualizacion
        if (allConcluido) {
          const blActualizar = doc(db, "billOfLading2", bl.id);

          batch.update(blActualizar, {
            estadoDoc: 1,
          });
        }
      }

      await batch.commit();
      for (const furgon of arrayFurgonesEnviarCorreo) {
        // Estado del ciclo es 3, que es almacen
        sendEmailFromFurgon(furgon, 5, "✅ Mercancia disponible en SAP.");
      }
      setIsLoading(false);
      setMensajeAlerta("Guardado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.log("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }
  };

  const [hasAviso, setHasAviso] = useState(false);

  // **************************GENERAR LISTADO DE DESTINATARIOS**************************

  const generatedReceiver = async (furgon) => {
    // Notificaciones de ordenes
    const ordenesUtilizadas = furgon.materiales.map((item) => {
      return item.ordenCompra;
    });
    const notificacionesOrdenes = await fetchDocsByIn(
      "notificaciones",
      undefined,
      "numOrigenDoc",
      ordenesUtilizadas
    );
    // Notificaciones de articulos
    const codigosItems = furgon.materiales.map((item) => item.codigo);
    const notificacionesArticulos = await fetchDocsByIn(
      "notificaciones",
      undefined,
      "numOrigenDoc",
      codigosItems
    );
    // Conglo
    const notificaciones = [
      ...notificacionesOrdenes,
      ...notificacionesArticulos,
    ];

    const correosDestinos = notificaciones.flatMap((not) => not.destinatarios);
    const correosUnicos = generatedUnicDestino(correosDestinos);
    return correosUnicos;
  };

  const generatedUnicDestino = (destinos) => {
    const correosUnicos = [
      ...new Map(destinos.map((item) => [item.correo, item])).values(),
    ];
    return correosUnicos;
  };
  // **************************CODIGO ENVIO DE CORREO**************************
  const [hasModal, setHasModal] = useState(false);
  const initiaValueDest = {
    nombre: "",
    correo: "",
  };
  const [destinatarios, setDestinatarios] = useState([
    initiaValueDest,
    initiaValueDest,
  ]);
  const [furgonTarget, setFurgonTarget] = useState({});
  const mostrarModal = async (e) => {
    const indexDataset = e.target.dataset.index;
    const furgonTarget = furgonesEditables[indexDataset];
    setFurgonTarget(furgonTarget);
    const destinos = await generatedReceiver(furgonTarget);
    let destinosAdd = [];

    if (furgonTarget?.valoresAux?.destinatariosAdd?.length > 0) {
      destinosAdd = [...furgonTarget?.valoresAux?.destinatariosAdd];
    }

    const congloDEstino = [...destinos, ...destinosAdd];
    const correosUnicos = generatedUnicDestino(congloDEstino);
    setDestinatarios([...correosUnicos]);
    setHasModal(true);
  };
  const addDestinatario = (e) => {
    const { name, value } = e.target;
    if (name == "add") {
      setDestinatarios([...destinatarios, initiaValueDest]);
    } else {
      if (destinatarios.length > 2) {
        setDestinatarios(destinatarios.slice(0, -1));
      }
    }
  };
  const listaUsuarios = TodosLosCorreosCielosDB;
  const handleInputDestinatario = (e) => {
    const { name, value } = e.target;
    const indexDataset = Number(e.target.dataset.index);

    let usuarioFind = null;
    if (name == "nombre") {
      usuarioFind = listaUsuarios.find((user) => {
        if (user.nombre == value) {
          return user;
        }
      });

      if (usuarioFind) {
        setDestinatarios((prev) =>
          prev.map((desti, index) =>
            index === indexDataset
              ? { ...desti, nombre: value, correo: usuarioFind.correo }
              : desti
          )
        );
        return;
      }
    } else if (name == "correo") {
      usuarioFind = listaUsuarios.find((user) => {
        if (user.correo == value) {
          return user;
        }
      });

      if (usuarioFind) {
        setDestinatarios((prev) =>
          prev.map((desti, index) =>
            index === indexDataset
              ? { ...desti, nombre: usuarioFind.nombre, correo: value }
              : desti
          )
        );
        return;
      }
    }
    setDestinatarios((prev) =>
      prev.map((desti, index) =>
        index === indexDataset ? { ...desti, [name]: value } : desti
      )
    );
  };
  // };
  // const handleInputDestinatario = (e) => {
  //   const { name, value } = e.target;
  //   const indexDataset = Number(e.target.dataset.index);

  //   setDestinatarios((prev) =>
  //     prev.map((desti, index) =>
  //       index === indexDataset ? { ...desti, [name]: value } : desti
  //     )
  //   );
  // };
  const guardarDestinatario = () => {
    const hasPermiso = userMaster.permisos.includes("docEnSistemaIMS");
    if (!hasPermiso) {
      return;
    }
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let proceder = true;
    destinatarios.forEach((detino, index) => {
      if (detino.correo !== "") {
        if (regex.test(detino.correo) == false) {
          setMensajeAlerta(`Correo N° ${index + 1} formato incorrecto.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
      if (detino.correo !== "" || detino.nombre !== "") {
        if (detino.correo == "" || detino.nombre == "") {
          setMensajeAlerta(
            `Destinatario N° ${index + 1} llenar correctamente.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
    });

    if (proceder) {
      const destinat = destinatarios;
      const furgonesEditableUp = furgonesEditables.map((furgon) => {
        if (furgon.id == furgonTarget.id) {
          return {
            ...furgon,
            valoresAux: {
              ...furgon.valoresAux,
              destinatariosAdd: destinat,
            },
          };
        } else {
          return { ...furgon };
        }
      });
      setFurgonesEditables([...furgonesEditableUp]);
      setDestinatarios(initiaValueDest, initiaValueDest);

      setHasModal(false);
    }
  };
  return (
    <>
      <ElementoPrivilegiado
        userMaster={userMaster}
        privilegioReq={"docEnSistemaIMS"}
      >
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />
      </ElementoPrivilegiado>
      {mostrarCostos && (
        <ContainerCostoFija>
          <CostosBL
            setMostrarCostos={setMostrarCostos}
            mostrarCostos={mostrarCostos}
            costoArray={costoArray}
            setCostoArray={setCostoArray}
            blEditables={blEditables}
            setBLEditables={setBLEditables}
          />
        </ContainerCostoFija>
      )}

      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de contenedores en proceso de registro.
          </TituloEncabezadoTabla>
          <CajaImgInfo onClick={() => setHasAviso(true)}>
            <ImgIconInfo src={ImgInfo} />
          </CajaImgInfo>
          {hasAviso ? (
            <ModalInfo
              setHasAviso={setHasAviso}
              titulo={"En Dpto. Import."}
              texto={
                "Es la quinta fase del ciclo y empieza cuando almacén envía importaciones y finaliza cuando la mercancía es registrada en el ERP dela empresa (SAP)."
              }
            ></ModalInfo>
          ) : null}
        </EncabezadoTabla>

        <CajaControles>
          {arrayPestannias.find((opcion) => opcion.select).code ==
            "avanzar" && (
            <ElementoPrivilegiado
              userMaster={userMaster}
              privilegioReq="docEnSistemaIMS"
            >
              <CajaBtnAvanzar>
                <CajaBtnAvanzar2>
                  <BtnSimple onClick={() => guardarCambios()}>
                    <Icono icon={faFloppyDisk} />
                    Guardar
                  </BtnSimple>
                </CajaBtnAvanzar2>
              </CajaBtnAvanzar>
            </ElementoPrivilegiado>
          )}

          <ControlesTablasMain tipo={"import"} />
        </CajaControles>
      </CabeceraListaAll>
      {arrayPestannias.find((opcion) => opcion.select).code ==
        "contenedores" && (
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Numero222*</CeldaHeadGroup>
                <CeldaHeadGroup>T</CeldaHeadGroup>
                <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                <CeldaHeadGroup>BL*</CeldaHeadGroup>
                <CeldaHeadGroup>Naviera</CeldaHeadGroup>
                <CeldaHeadGroup>Puerto</CeldaHeadGroup>
                <CeldaHeadGroup>Destino</CeldaHeadGroup>
              </FilasGroup>
            </thead>
            <tbody>
              {listaFurgonesMaster.map((furgon, index) => {
                return (
                  <FilasGroup
                    key={index}
                    className={`body
                      ${index % 2 ? "impar" : "par"}
                      `}
                  >
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>
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

                    <CeldasBodyGroup>
                      <Enlaces
                        to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                        target="_blank"
                      >
                        {furgon.datosBL.numeroBL}
                      </Enlaces>
                    </CeldasBodyGroup>
                    <CeldasBodyGroup
                      className="naviera"
                      title={furgon.datosBL.naviera}
                    >
                      {furgon.datosBL.naviera}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup
                      className="puerto"
                      title={furgon.datosBL.puerto}
                    >
                      {furgon.datosBL.puerto}
                    </CeldasBodyGroup>

                    <CeldasBodyGroup>{furgon.destino}</CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
          {listaFurgonesMaster.length == 0 && (
            <TextoEptyG
              texto={"~ Sin contenedores en dpto. importaciones. ~"}
            />
          )}
        </CajaTablaGroup>
      )}
      <BotonQuery furgonesEditables={furgonesEditables} />
      {arrayPestannias.find((opcion) => opcion.select).code == "avanzar" && (
        <ElementoPrivilegiado
          userMaster={userMaster}
          privilegioReq={"docEnSistemaIMS"}
        >
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Numero333*</CeldaHeadGroup>
                  <CeldaHeadGroup>T</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>BL*</CeldaHeadGroup>
                  <CeldaHeadGroup>Naviera</CeldaHeadGroup>
                  <CeldaHeadGroup>Puerto</CeldaHeadGroup>
                  {/* <CeldaHeadGroup>Costo</CeldaHeadGroup> */}
                  <CeldaHeadGroup>Acciones</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {furgonesEditables.map((furgon, index) => {
                  return (
                    <FilasGroup
                      key={index}
                      className={`
                          body  .
                          ${furgon.valoresAux.fijado ? "fijado" : ""}
                          ${index % 2 ? "impar" : ""}
                          `}
                    >
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>

                      <CeldasBodyGroup>
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
                        title={furgon.datosBL.numeroBL}
                        className="proveedor"
                      >
                        <Enlaces
                          to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                          target="_blank"
                        >
                          {furgon.datosBL.numeroBL}
                        </Enlaces>
                      </CeldasBodyGroup>

                      <CeldasBodyGroup
                        className="naviera"
                        title={furgon.datosBL.naviera}
                      >
                        {furgon.datosBL.naviera}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup
                        className="puerto"
                        title={furgon.datosBL.puerto}
                      >
                        {furgon.datosBL.puerto}
                      </CeldasBodyGroup>
                      {/* <CeldasBodyGroup>
                          {furgon?.costos?.length > 0
                            ? furgon?.costos?.reduce(
                                (acc, costo) => acc + Number(costo.monto),
                                0
                              ) || 0
                            : ""}
                        </CeldasBodyGroup> */}
                      <CeldasBodyGroup className="celdaBtn">
                        <BtnSimple
                          data-index={index}
                          onClick={(e) => mostrarModal(e)}
                          className="docEnviado"
                        >
                          Email
                        </BtnSimple>
                        {furgon.valoresAux.fijado ? (
                          <BtnSimple
                            name="btnQuitarFijado"
                            data-index={index}
                            //
                            data-numero_doc={furgon.numeroDoc}
                            data-id={index}
                            onClick={(e) => fijarBL(e)}
                            className="docEnviado"
                          >
                            Quitar
                          </BtnSimple>
                        ) : (
                          <>
                            {/* <BtnSimple
                                data-numero_doc={furgon.numeroDoc}
                                data-id={index}
                                onClick={(e) => costearBL(e)}
                                name="btnCostear"
                                className="docEnviado costear"
                              >
                                Costear
                              </BtnSimple> */}
                            <BtnSimple
                              data-index={index}
                              name="btnListoSap"
                              //
                              data-numero_doc={furgon.numeroDoc}
                              data-id={index}
                              onClick={(e) => fijarBL(e)}
                              className="docEnviado"
                            >
                              Fijar
                            </BtnSimple>
                          </>
                        )}
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </ElementoPrivilegiado>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
      {isLoading ? <ModalLoading /> : ""}
      {hasModal && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={"Destinatarios de notificaciones"}
        >
          <ContenidoModal>
            <DestinatariosCorreo
              modoDisabled={false}
              arrayDestinatarios={destinatarios}
              addDestinatario={addDestinatario}
              handleInputDestinatario={handleInputDestinatario}
              guardarDestinatario={guardarDestinatario}
            />
          </ContenidoModal>
        </ModalGeneral>
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
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

const CajaTabla = styled.div`
  overflow-x: scroll;
  padding: 0 10px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  @media screen and (max-width: 620px) {
    margin-bottom: 100px;
  }
`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  /* Este azul opaco era el color anterior de los texto */
  /* Se ve bien pero donde hay luz se ve menos */
  color: ${Tema.secondary.azulOpaco};
  color: ${Tema.neutral.blancoHueso};
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: ${Tema.secondary.azulOlivo};
    &.negativo {
      color: #441818;
    }
  }
`;

const CeldaHead = styled.th`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty {
    width: 300px;
  }
  &.comentarios {
    max-width: 200px;
  }
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
  &.celdaBtn {
    gap: 8px;
    display: flex;
    justify-content: center;
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
const Resaltar = styled.span`
  text-decoration: underline;
  font-weight: bold;
`;

const CajaControles = styled.div`
  display: flex;
  align-items: center;
  padding-left: 25px;
  /* justify-content: center; */
  @media screen and (max-width: 850px) {
    flex-direction: column;
    justify-content: start;
  }
`;
const CajaBtnAvanzar = styled.div`
  min-width: 220px;
  @media screen and (max-width: 850px) {
    width: 100%;
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
    height: 25px;
    margin-right: 3px;
  }
  &.costear {
    height: 25px;
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion {
    cursor: pointer;
  }
`;

const ContainerCostoFija = styled.div`
  position: absolute;
  z-index: 100;
  background-color: #000000bb;
  width: 100%;
  height: 120%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* padding-bottom: 100px; */
  padding-top: 40px;
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
const CajaBtnAvanzar2 = styled.div`
  display: flex;
  gap: 8px;
`;
const BtnHead = styled(BtnGeneralButton)`
  width: auto;
  padding: 10px;
  white-space: nowrap;
  margin: 0;

  &.suma {
    border: 1px solid ${Tema.complementary.success};
    &:hover {
      border: none;
      color: ${Tema.complementary.success};
    }
  }
  &.resta {
    border: 1px solid ${Tema.complementary.danger};
    &:hover {
      border: none;
      color: red;
    }
  }
  &.correo {
    margin: 7px;
  }
`;
const ContenidoModal = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  margin: auto;
`;
