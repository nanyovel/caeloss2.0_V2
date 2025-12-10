import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import ControlesPagoTabla from "../components/ControlesPagoTabla";
import { Departamentos } from "../../components/corporativo/Corporativo";
import { ModalLoading } from "../../components/ModalLoading";
import { Alerta } from "../../components/Alerta";
import ExportarExcel from "../../libs/ExportExcel";
import { Tema } from "../../config/theme";
import TextoEptyG from "../../components/TextoEptyG";
import { InputSimpleEditable } from "../../components/InputGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import Advertencia2 from "../../components/Advertencia2";
import ModalGeneral from "../../components/ModalGeneral";
import {
  agregarBatchContabilidad,
  compararListaAPS,
  hasAlertaFunct,
  mostrarTablaCosto,
} from "./LibsAPS";
import MontosReqNuevo from "../components/reqComponents/MontosReqNuevo";
import MontosReqViejo from "../components/reqComponents/MontosReqViejo";
import { BotonQuery } from "../../components/BotonQuery";
import { extraerCostosAPS } from "../libs/generarElementoReq";
import { vehiculosSchema } from "../schemas/vehiculosSchema";
import { formatoDOP } from "../../libs/StringParsed";

export default function TablaCicloHijo({
  userMaster,
  datosMolde,
  sinDatos,
  masterDB,
  setMasterDB,
  arrayOpciones,
  columnasExcel,
  setSinDatos = { setSinDatos },
}) {
  // ******************** RECURSOS GENERALES ********************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // ********* MANEJANDO LAS FUNCIONES DE LOS BOTONES DE CONTROLES*** *******
  // ********* FUNCION NECESARIAMENTE COLOCADA AL INICIO *******
  const [funcionEjecutar, setFuncionEjecutar] = useState(null);
  const [ejecutarFuncion, setEjecutarFuncion] = useState(false);

  const handleBtnControl = (tipo) => {
    setEjecutarFuncion(true);
    setFuncionEjecutar(tipo);
  };

  useEffect(() => {
    if (ejecutarFuncion && datosParseados) {
      const hasAprobacion = userMaster.permisos.includes(
        datosMolde.permisoAprobacion
      );
      if (!hasAprobacion) {
        setEjecutarFuncion(false);
        return;
      }

      if (funcionEjecutar == "btnGuardar") {
        guardarCambios();
      } else if (funcionEjecutar == "btnExportar") {
        const listReqParsedAux = listReqParsed.map((req, index) => {
          return {
            ...req,
          };
        });
        ExportarExcel(listReqParsedAux, columnasExcel);
      }
    }
    setEjecutarFuncion(false);
  }, [ejecutarFuncion]);

  // ********************** useEffect Initial **********************
  const [listReqParsed, setListReqParsed] = useState([]);
  const [initialListReqParsed, setInitialListReqParsed] = useState([]);
  const [datosParseados, setDatosParseados] = useState(false);

  const initialControles = {
    menuDesplegable: [
      {
        nombre: "Departamento:",
        name: "menuDpto",
        active: true,
        opcionTodos: true,
        opciones: [],
      },
      {
        nombre: "Chofer:",
        name: "menuChofer",
        active: true,
        opcionTodos: true,
        opciones: [],
      },
      {
        nombre: "Aplicar a todos:",
        name: "menuAplicarAtodos",
        active: true,
        opciones: [
          {
            descripcion: "Sin efecto",
          },
          {
            descripcion: "Aprobar",
          },
          {
            descripcion: "Rechazar",
          },
        ],
      },
    ],
    btns: [
      {
        texto: "Guardar",
        active: true,
        tipo: "btnGuardar",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
        funcion: handleBtnControl,
      },
      {
        texto: "Exportar",
        active: true,
        tipo: "btnExportar",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
        funcion: handleBtnControl,
      },
    ],
  };

  const [controles, setControles] = useState({});
  useEffect(() => {
    if (userMaster) {
      // *******LISTA DE SOLICITUDES ******
      const reqParseadas = masterDB
        .sort((a, b) => a.numeroDoc - b.numeroDoc)
        .map((req) => {
          return {
            ...req,
            statusAproved: "",
            // montoPlain: req.datosMontos.length == 1,
          };
        });

      let reqsThisPantalla = [];
      // FILTRAR POR SOLIICTUDES SEGUN LA PANTALLA SELECIONADA
      //🟢 1-Si estamos en una pantalla normal es decir una homogenea
      const homogeneas = [0, 1, 2];
      console.log(datosMolde.tipoChofer);
      if (homogeneas.includes(datosMolde.tipoChofer)) {
        console.log("🔴🔴🔴🔴🔴🔴");
        const reqAux = reqParseadas.filter(
          (req) => req.datosEntrega.chofer.tipo == datosMolde.tipoChofer
        );

        // Ahora quita las solicitudes que tengan choferes mixtos, es decir que tengan algun chofer adicional diferente a su chofer master
        const reqsHomogeneas = reqAux.filter((req) => {
          //  Filtra solo las solicitudes que no tengan vehiculos adicionales o si tienen vehiculos adicionales son igual al master, en otras palabras si alguna solicitud tiene algun vehiculo diferente al master quitala
          // Las solicitudes que no tiene vehiculos adicionales de por si son homogeneas por tanto damelas sin calcular nada
          if (req.datosFlete.vehiculosAdicionales.length > 0) {
            const vehiculosAdicionales = req.datosFlete.vehiculosAdicionales;
            const tipoChoferes = vehiculosAdicionales.map((vehiculo) => {
              return vehiculo.datosEntrega.chofer.tipo;
            });

            const allIguales = tipoChoferes.every(
              (tipo) => tipo == datosMolde.tipoChofer
            );
            if (allIguales) {
              return req;
            }
          } else {
            return req;
          }
        });

        reqsThisPantalla = reqsHomogeneas;
      }
      //🟢 2-Si estamos en la pantalla mixta
      // Ojo: ⚠️Le coloque 3 para seguir la secuencia pero en realidad mixta es que tenga diferentes tipo de choferes
      if (datosMolde.tipoChofer == 3) {
        const reqsMixtas = reqParseadas.filter((req) => {
          // Dame solo las solicitudes que tengan vehiculos adicionales, dado que para ser mixta obligatoriamente deberia tener vehiculos adicionales
          // Si no tiene vehiculos adicionales entonces no la quiero
          if (req.datosFlete.vehiculosAdicionales.length > 0) {
            const vehiculosAdicionales = req.datosFlete.vehiculosAdicionales;
            const tipoChoferes = vehiculosAdicionales.map((vehiculo) => {
              return vehiculo.datosEntrega.chofer.tipo;
            });
            const conDiferente = tipoChoferes.every(
              (tipo) => tipo !== req.datosEntrega.chofer.tipo
            );
            if (conDiferente) {
              return req;
            }
          }
        });
        reqsThisPantalla = reqsMixtas;
      }

      // Del array MASTERDB, filtra 2 veces:
      // 1-Primero filtra y dame los datos de la pantalla que estamos

      // 1.5-Aqui tenemos que filtrar por pantalla pero solo las mixtas, de la siguiente manera:
      // A-Si estamos en una pantalla mixta permite todas las solicitudes con la propiedad vehiculosAdicionalesTiene en true
      // B-De otro modo quita las mixta dame solo las que tengan esa propiedad en false
      // const reqsMixtas = reqsThisPantalla.filter(
      //   (req) =>
      //     req.datosFlete.vehiculosAdicionalesTiene == datosMolde.tipoChofer
      // );
      const reqsMixtas = reqsThisPantalla;
      console.log(reqsMixtas);
      // 2-Ahora dame los datos de la pestaña que estamos dentro del ciclo
      const reqsThisPestannia = reqsMixtas.filter((req) => {
        const estadoCicloOrden = compararListaAPS({
          statusLogistica: req.contabilidad.log.logistica1.status,
          statusSolicitante: req.contabilidad.log.solicitante2.status,
          statusContabilidad: req.contabilidad.log.finanzas3.status,
        }).numLlamarAxu;
        const estadoCicloPestannia = compararListaAPS({
          statusLogistica: datosMolde.combinacionStatusTraer.statusLogistica,
          statusSolicitante:
            datosMolde.combinacionStatusTraer.statusSolicitante,
          statusContabilidad:
            datosMolde.combinacionStatusTraer.statusContabilidad,
        }).numLlamarAxu;

        if (estadoCicloOrden == estadoCicloPestannia) {
          return {
            ...req,
          };
        }
      });

      const resFinal = reqsThisPestannia;
      if (resFinal.length == 0) {
        setSinDatos(true);
      }
      console.log(resFinal);
      const resMontosSumados = resFinal.map((req) => {
        let montoTotal = 0;

        // 🟢 Camion principal
        if (req.datosEntrega.chofer.tipo == 0) {
          montoTotal +=
            req.datosFlete.vehiculoSeleccionado.viajesInterno.montoChofer;

          // Incentivo ayudante interno principal
          montoTotal += req.datosEntrega.ayudante.id
            ? req.datosFlete.vehiculoSeleccionado.viajesInterno.montoAyudante
            : 0;
        } else {
          montoTotal += req.datosFlete.costo;
        }

        // 🟢 Ayudantes adicionales camion principal
        req.datosFlete?.ayudantesAdicionales.forEach((ayuAdd) => {
          montoTotal += ayuAdd.costo;
        });

        // 🟢Camiones adicionales
        req.datosFlete?.vehiculosAdicionales.forEach((vehAdd) => {
          // Si este chofer es interno
          if (vehAdd.datosEntrega.chofer.tipo == 0) {
            montoTotal += vehAdd.viajesInterno.montoChofer;

            // Incentivo ayudante interno principal
            if (vehAdd.datosEntrega.ayudante.id) {
              montoTotal += vehAdd.viajesInterno.montoAyudante;
            }
          } else {
            // Si no es interno
            montoTotal += vehAdd.resultado.costo;
          }

          // 🟢 Ayudantes adicionales de camiones adicionales
          vehAdd.ayudantesAdicionales.forEach((ayuAdd) => {
            montoTotal += ayuAdd.costo;
          });
        });
        //
        //
        //

        return {
          ...req,
          montoTotal: montoTotal,
        };
      });
      setListReqParsed(resMontosSumados);
      setInitialListReqParsed(resMontosSumados);

      // ******* LISTA DE DEPARTAMENTOS ******
      const listaDptoReqRepetidos = [];

      resFinal.forEach((req) => {
        listaDptoReqRepetidos.push(req.datosSolicitante.dpto);
      });
      const dptoSinRepetidos = [...new Set(listaDptoReqRepetidos)];

      const dptoParsedAux = Departamentos.map((dpto) => {
        return {
          ...dpto,
          descripcion: dpto.nombre,
        };
      }).filter((dpto) => dptoSinRepetidos.includes(dpto.descripcion));

      // ******* LISTA DE CHOFERES ******
      const listaChoferesReqRepetidos = [];
      resFinal.forEach((req) => {
        listaChoferesReqRepetidos.push(req.datosEntrega.chofer.nombre);
      });
      const choferSinRepetidos = [...new Set(listaChoferesReqRepetidos)];
      const choferesAux = choferSinRepetidos.map((chofer) => {
        return {
          descripcion: chofer,
        };
      });

      // ******* CONTROLES ******
      const controlesParsed = {
        ...initialControles,
        menuDesplegable: initialControles.menuDesplegable.map((menu, index) => {
          return {
            ...menu,
            // active:
            //   menu.name == "menuAplicarAtodos"
            //     ? datosMolde.numLlamada < 3
            //     : true,

            opciones:
              menu.name == "menuDpto"
                ? dptoParsedAux
                : menu.name == "menuChofer"
                  ? choferesAux
                  : menu.opciones,
          };
        }),
      };

      // Controles luego de verificar privilegios
      const hasAprobacion = userMaster.permisos.includes(
        datosMolde.permisoAprobacion
      );

      const controlesPriv = {
        ...controlesParsed,
        menuDesplegable: controlesParsed.menuDesplegable.filter((menu) => {
          if (menu.name == "menuAplicarAtodos") {
            if (hasAprobacion && datosMolde.numLlamada < 3) {
              return menu;
            }
          } else {
            return menu;
          }
        }),
        btns: controlesParsed.btns.filter((boton) => {
          if (boton.tipo == "btnGuardar") {
            if (hasAprobacion && datosMolde.numLlamada < 3) {
              return boton;
            }
          } else if (boton.tipo == "btnExportar") {
            if (hasAprobacion) {
              return boton;
            }
          } else {
            return boton;
          }
        }),
      };
      setControles({ ...controlesPriv });
      setDatosParseados(true);
    }
  }, [masterDB, userMaster, arrayOpciones, datosMolde]);

  // ********************** Handle Filtros **********************
  const [valueDpto, setValueDpto] = useState("");
  const [valueChofer, setValueChofer] = useState("");
  const handleFiltros = (e) => {
    const { value, name } = e.target;
    let arrayAux = initialListReqParsed;

    let entradaMaster = value.toLowerCase();
    if (name == "menuDpto") {
      setValueDpto(entradaMaster);
    } else if (name == "menuChofer") {
      setValueChofer(entradaMaster);
    }
    let aplicarATodosAux = "";
    if (name == "menuAplicarAtodos") {
      aplicarATodosAux = value;
      aplicarATodos(value);
      return;
    }

    const filtroDpto = () => {
      let entradaUsar = entradaMaster;
      if (name != "menuDpto") {
        entradaUsar = valueDpto;
      }

      let valorDefault = false;
      if (entradaUsar == "" || entradaUsar == 0 || entradaUsar == " ") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }
      const arrayNuevo = arrayAux.filter((req) => {
        if (valorDefault) {
          return req;
        } else {
          if (req.datosSolicitante.dpto.toLowerCase() == entradaUsar) {
            return req;
          }
        }
      });
      arrayAux = arrayNuevo;
    };
    const filtroChofer = () => {
      let entradaUsar = entradaMaster;
      if (name != "menuChofer") {
        entradaUsar = valueChofer;
      }

      let valorDefault = false;
      if (entradaUsar == "" || entradaUsar == 0 || entradaUsar == " ") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }
      const arrayNuevo = arrayAux.filter((req) => {
        if (valorDefault) {
          return req;
        } else {
          if (req.datosEntrega.chofer.nombre.toLowerCase() == entradaUsar) {
            return req;
          }
        }
      });
      arrayAux = arrayNuevo;
    };

    filtroDpto();
    filtroChofer();
    arrayAux = aplicarATodos(aplicarATodosAux, arrayAux);
    setListReqParsed([...arrayAux]);
  };

  // ****************** MANEJANDO LAS ACCIONES BTN *****************
  const [hasAlert, setHasAlert] = useState(false);
  const [mensajeAdvert, setMensajeAdvert] = useState("");
  const [numReqAlertada, setNumReqAlertada] = useState("");
  const [advAplicarATodos, setAdvAplicarATodos] = useState(false);

  const ejecutarReqTable = (numeroReq, nameDataset) => {
    setListReqParsed(
      listReqParsed.map((req, i) => {
        if (req.numeroDoc == numeroReq) {
          return {
            ...req,
            statusAproved: nameDataset,
          };
        } else {
          return req;
        }
      })
    );
  };
  const handleTable = (e) => {
    const numeroReq = e.target.dataset.numero;
    const nameDataset = e.target.dataset.name;

    const reqFind = listReqParsed.find((req) => req.numeroDoc == numeroReq);

    if (nameDataset == "aproved") {
      if (hasAlertaFunct(reqFind).causas.length == 0) {
        ejecutarReqTable(numeroReq, nameDataset);
      } else {
        setAdvAplicarATodos(false);
        setNumReqAlertada(numeroReq);
        const nombreCliente = reqFind.datosReq.socioNegocio;
        setMensajeAdvert(`
            El pago de la solicitud N° ${numeroReq} a nombre de ${nombreCliente}, requiere verificacion, ¿Confirmas que lo has verificado?
            `);
        setHasAlert(true);
      }
    } else if (nameDataset == "denied" || nameDataset == "sinEfecto") {
      ejecutarReqTable(numeroReq, nameDataset);
    }
  };

  const aprobarLuegoDeAdvertencia = () => {
    if (advAplicarATodos == false) {
      ejecutarReqTable(numReqAlertada, "aproved");
    }
    reserAlert();
  };
  const reserAlert = () => {
    setHasAlert(false);
    setMensajeAdvert("");
    setNumReqAlertada("");
  };
  const aplicarATodos = (ejecucion, arrayAux) => {
    const accion =
      ejecucion == "Aprobar"
        ? "aproved"
        : ejecucion == "Rechazar"
          ? "denied"
          : "";

    if (accion == "aproved") {
      //
      let proceder = true;
      for (let i = 0; i < listReqParsed.length; i++) {
        const req = listReqParsed[i];
        const { causas } = hasAlertaFunct(req);

        if (causas.length > 0) {
          proceder = false;
          break;
        }
      }

      if (proceder == false) {
        setAdvAplicarATodos(true);
        setHasAlert(true);
        setMensajeAdvert(
          "Existen pagos que requieren verificacion, marcados de color amarillo en la columna Alerta, estos se deben verificar y aprovar de manera individual."
        );
        return;
      }
    }

    let nuevoArray = [];
    if (arrayAux) {
      nuevoArray = arrayAux.map((req, index) => {
        return {
          ...req,
          statusAproved: accion,
        };
      });
      return nuevoArray;
    } else {
      nuevoArray = listReqParsed.map((req, index) => {
        return {
          ...req,
          statusAproved: accion,
        };
      });
      setListReqParsed(nuevoArray);
    }
  };

  // ********************* GUARDAR CAMBIOS *********************
  const guardarCambios = async () => {
    const hasAprobacion = userMaster.permisos.includes(
      datosMolde.permisoAprobacion
    );
    if (!hasAprobacion) {
      return;
    }
    // Si todos estan sin efecto
    if (listReqParsed.every((req) => req.statusAproved == "")) {
      setTipoAlerta("warning");
      setMensajeAlerta("Seleccione los pagos a aprobar/rechazar.");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setIsLoading(true);
    try {
      const batch = writeBatch(db);
      // ************* ACTUALIZAR SOLICITUDES *************
      // 🟢 EN LA DB Y TAMBIEN EN LOCAL
      const listReqFinalAux = listReqParsed.map((req, index) => {
        // 1-Solo afectaremos las solicitudes aprobadas o rechazadas
        if (req.statusAproved == "aproved" || req.statusAproved == "denied") {
          const docActualizar = doc(db, "transferRequest", req.id);

          const valoresUpThisReq = agregarBatchContabilidad({
            batch: batch,
            docActualizar: docActualizar,
            userMaster: userMaster,
            nombreCampo: datosMolde.campoLogUpdate,
            aprobada: req.statusAproved == "aproved",
          });
          return {
            ...req,
            contabilidad: {
              ...req.contabilidad,
              log: {
                ...req.contabilidad.log,
                [datosMolde.campoLogUpdate]: {
                  ...req.contabilidad.log[datosMolde.campoLogUpdate],
                  status: valoresUpThisReq.status,
                  usuario: {
                    ...req.contabilidad.log[datosMolde.campoLogUpdate].usuario,
                    userName: valoresUpThisReq.usuario,
                    id: valoresUpThisReq.idUsuario,
                  },
                  fecha: valoresUpThisReq.fecha,
                },
              },
              rechazada: valoresUpThisReq.rechazada,
            },
          };
        }

        // 2-Si la solicitud esta normal retornala en local normalmente
        if (req.statusAproved == "") {
          return req;
        }
      });

      // ******** COMMIT  ********
      await batch.commit();

      setTimeout(() => {
        setMasterDB(
          masterDB.map((req, index) => {
            console.log(listReqFinalAux);
            console.log(req);
            const reqUp = listReqFinalAux.find(
              (reqFind) => reqFind.id == req.id
            );

            if (reqUp) {
              return { ...reqUp };
            } else {
              return { ...req };
            }
          })
        );
        setIsLoading(false);
      }, 500);

      setMensajeAlerta("Procesado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
    }
  };
  //
  //
  //
  //
  // ********************* DESGLOSE DE COSTOS *********************
  const [datosCostosTabla, setDatosCostosTabla] = useState([]);
  const [hasModalCostos, setHasModalCostos] = useState(false);

  const preMostrarCostos = (request) => {
    setHasModalCostos(true);
    const datosCostosAPS = extraerCostosAPS(request);

    console.log(datosCostosAPS);

    const datosParsed = datosCostosAPS.map((data) => {
      return {
        ...data,
      };
    });
    //
    datosCostosAPS.forEach((costo) => {
      // if(costo)
    });
    //
    setDatosCostosTabla(datosCostosAPS);
  };
  useEffect(() => {
    if (hasModalCostos == false) {
      setDatosCostosTabla([]);
    }
  }, [hasModalCostos]);

  // ********************* DETALLE MONTOS *********************
  const [hasModalMontos, setHasModalMontos] = useState(false);
  const [reqBuscada, setReqBuscada] = useState(null);
  const [datosTablaMontos, setDatosTablaMontos] = useState(null);
  const mostrarTablaMontos = (e) => {
    setHasModalMontos(true);
    const idDataset = e.target.dataset.id;

    const reqFinded = listReqParsed.find((req) => req.id == idDataset);
    setReqBuscada(reqFinded);
    setDatosTablaMontos(reqFinded.datosMontos);
  };
  // ********************* DETALLE ALERTAS *********************

  const [datosCausaAlerta, setDatosCausaAlerta] = useState([]);
  const [hasModalCausas, setHasModalCausas] = useState(false);
  const mostrarCausaAlerta = (e) => {
    const idDataset = e.target.dataset.id;

    const reqFinded = listReqParsed.find((req) => req.id == idDataset);
    setDatosCausaAlerta(hasAlertaFunct(reqFinded).causas);
    setHasModalCausas(true);
  };

  // ********** Columna Accion ************
  const [isAccion, setIsAccion] = useState(false);
  useEffect(() => {
    // Logistica
    if (
      datosMolde.numLlamada == 0 &&
      userMaster.permisos.includes(datosMolde.permisoAprobacion)
    ) {
      setIsAccion(true);
    }
    // Solicitante
    // Finanzas
  }, [datosMolde, userMaster]);

  return (
    <Container>
      <BotonQuery listReqParsed={listReqParsed} datosMolde={datosMolde} />
      {datosParseados && (
        <ContainerControles>
          <ControlesPagoTabla
            datosMolde={datosMolde}
            controles={controles}
            handleFiltros={handleFiltros}
          />
        </ContainerControles>
      )}

      {listReqParsed && listReqParsed.length > 0 && datosParseados ? (
        <>
          <CajaTabla>
            <Tabla>
              <thead>
                <Filas className="cabeza">
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Solicitud*</CeldaHead>
                  <CeldaHead>Cliente</CeldaHead>
                  <CeldaHead>Fecha</CeldaHead>
                  <CeldaHead>Dpto.</CeldaHead>
                  <CeldaHead>Proy</CeldaHead>
                  <CeldaHead>Chofer</CeldaHead>
                  <CeldaHead className="Monto chofer">Costo</CeldaHead>
                  <CeldaHead className="Monto chofer">Precio</CeldaHead>
                  <CeldaHead className="Monto chofer">Montos</CeldaHead>
                  <CeldaHead>Alerta</CeldaHead>
                  {userMaster.permisos.includes(datosMolde.permisoAprobacion) &&
                    datosMolde.numLlamada < 3 && <CeldaHead>Accion</CeldaHead>}
                </Filas>
              </thead>
              <tbody>
                {datosParseados &&
                  listReqParsed.map((req, index) => {
                    return (
                      <Filas
                        key={index}
                        className={`body
                        ${req.statusAproved} 
                        ${index % 2 ? "impar" : "par"} 
                        
                      `}
                      >
                        <CeldasBody className={`ancho `}>
                          {index + 1}
                        </CeldasBody>

                        <CeldasBody className={`ancho   `}>
                          <Enlaces
                            to={`/transportes/maestros/solicitudes/${encodeURIComponent(
                              req.numeroDoc
                            )}`}
                            target="_blank"
                          >
                            {req.numeroDoc}
                          </Enlaces>
                        </CeldasBody>
                        <CeldasBody
                          className={`ancho  estandar start`}
                          title={req.datosReq.socioNegocio}
                        >
                          {req.datosReq.socioNegocio}
                        </CeldasBody>
                        <CeldasBody className={`ancho  `}>
                          {req.fechaReq.slice(0, 10)}
                        </CeldasBody>
                        <CeldasBody
                          title={req.datosSolicitante.dpto}
                          className="ancho estandar"
                        >
                          {req.datosSolicitante.dpto ==
                          "Operaciones & Logistica"
                            ? "O&L"
                            : req.datosSolicitante.dpto ==
                                "Digitalizacion de procesos"
                              ? "DP"
                              : req.datosSolicitante.dpto}
                        </CeldasBody>
                        <CeldasBody>{req.datosReq.numeroProyecto}</CeldasBody>
                        <CeldasBody
                          className="ancho estandar"
                          title={
                            req.datosEntrega.chofer.nombre +
                            " " +
                            req.datosEntrega.chofer.apellido
                          }
                        >
                          {req.datosEntrega.chofer.nombre +
                            " " +
                            req.datosEntrega.chofer.apellido}
                        </CeldasBody>
                        <CeldasBody className={`ancho  `}>
                          {formatoDOP(req.montoTotal)}
                          <IconoCelda onClick={() => preMostrarCostos(req)}>
                            👁️
                          </IconoCelda>
                        </CeldasBody>

                        <CeldasBody>
                          {formatoDOP(
                            req.datosMontos[
                              req.datosMontos.length - 1
                            ].elementos.reduce((acc, el) => {
                              return acc + el.precio;
                            }, 0)
                          )}
                        </CeldasBody>

                        <CeldasBody>
                          <IconoCelda
                            data-id={req.id}
                            onClick={(e) => mostrarTablaMontos(e)}
                          >
                            👁️
                          </IconoCelda>
                        </CeldasBody>

                        <CeldasBody>
                          {hasAlertaFunct(req).icono ? (
                            <IconoCelda
                              data-id={req.id}
                              onClick={(e) => mostrarCausaAlerta(e)}
                            >
                              {hasAlertaFunct(req).icono}
                            </IconoCelda>
                          ) : (
                            ""
                          )}
                        </CeldasBody>
                        {userMaster.permisos.includes(
                          datosMolde.permisoAprobacion
                        ) &&
                          datosMolde.numLlamada < 3 && (
                            <CeldasBody className="flex">
                              <ParrafoAction
                                data-numero={req.numeroDoc}
                                data-name={"aproved"}
                                onClick={(e) => handleTable(e)}
                              >
                                ✅
                              </ParrafoAction>
                              <ParrafoAction
                                data-numero={req.numeroDoc}
                                data-name={"denied"}
                                onClick={(e) => handleTable(e)}
                              >
                                ❌
                              </ParrafoAction>
                              <ParrafoAction
                                data-numero={req.numeroDoc}
                                data-name={"sinEfecto"}
                                onClick={(e) => handleTable(e)}
                              >
                                ⌛
                              </ParrafoAction>
                            </CeldasBody>
                          )}
                      </Filas>
                    );
                  })}
              </tbody>
            </Tabla>
            {hasAlert && (
              <Advertencia2
                tipo={"warning"}
                mensaje={mensajeAdvert}
                setDispatchAdvertencia={reserAlert}
                accionAceptar={aprobarLuegoDeAdvertencia}
                ocultarBtnCancelar={advAplicarATodos}
              />
            )}
          </CajaTabla>
        </>
      ) : (
        ""
      )}

      {/* NO TAOCA - FUNCIONA BIEN */}
      {/* Esta combinancion de propiedades es ideal para que el texto sin datos aparezca correcatemente */}
      {/* Cuando accedemos a una pestaña y aun no cargan los datos no sale el texto */}
      {/* Hacer que funcione correctamente me costo trabajo */}
      {sinDatos && listReqParsed.length == 0 && datosParseados && (
        <TextoEptyG texto={datosMolde.textoSinDatos} />
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
      {/* DATOS DESGLOSE COSTOS */}
      {hasModalCostos && (
        <ModalGeneral
          setHasModal={setHasModalCostos}
          titulo={"Tabla de costos "}
        >
          {
            <CajaTablaCostos>
              <CajaTabla>
                <Tabla>
                  <thead>
                    <Filas className="cabeza">
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead>Vehiculo</CeldaHead>
                      <CeldaHead>Rol</CeldaHead>
                      <CeldaHead>Nombre</CeldaHead>
                      <CeldaHead>Monto</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {datosCostosTabla.map((costo, index) => {
                      return (
                        <Filas
                          key={index}
                          className={`body ${costo.rolVeh} 
                        ${costo.ordenCSS % 2 ? "camion1" : "camion2"}`}
                        >
                          <CeldasBody>{index + 1}</CeldasBody>
                          <CeldasBody
                            className="start"
                            title={
                              vehiculosSchema.find(
                                (vehicu) => vehicu.code == costo.codeVehiculo
                              ).descripcion
                            }
                          >
                            {
                              vehiculosSchema.find(
                                (vehicu) => vehicu.code == costo.codeVehiculo
                              ).descripcion
                            }
                          </CeldasBody>
                          <CeldasBody className="start" title={costo.rol}>
                            {costo.descripcionResumidaInterno}
                          </CeldasBody>
                          <CeldasBody className="start">
                            {costo.nombreCompleto}
                          </CeldasBody>
                          <CeldasBody>
                            {costo.tipoChofer === 0
                              ? formatoDOP(costo.costoInterno)
                              : formatoDOP(costo.costo)}
                          </CeldasBody>
                        </Filas>
                      );
                    })}
                  </tbody>
                </Tabla>
              </CajaTabla>
            </CajaTablaCostos>
          }
        </ModalGeneral>
      )}

      {/* DATOS DESGLOSE PRECIOS */}
      {hasModalMontos && reqBuscada && (
        <ModalGeneral
          setHasModal={setHasModalMontos}
          titulo={"Tabla de desglose de precios"}
        >
          {reqBuscada.datosMontos[0]?.nuevoFormato ? (
            <MontosReqNuevo datosMontos={datosTablaMontos} />
          ) : (
            <MontosReqViejo datosMontos={datosTablaMontos} />
          )}
        </ModalGeneral>
      )}

      {/* DATOS CAUSAS DE ALERTA */}
      {hasModalCausas && (
        <ModalGeneral
          setHasModal={setHasModalCausas}
          titulo={"Tabla de causas de alerta"}
        >
          <CajaTablaCostos>
            <CajaTabla>
              <Tabla>
                <thead>
                  <Filas className="cabeza">
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Descripcion</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {datosCausaAlerta.map((causa, index) => {
                    return (
                      <Filas
                        key={index}
                        className={`body ${index % 2 ? "impar" : "par"}`}
                      >
                        <CeldasBody>{index + 1}</CeldasBody>
                        <CeldasBody className="start">{causa}</CeldasBody>
                      </Filas>
                    );
                  })}
                </tbody>
              </Tabla>
            </CajaTabla>
          </CajaTablaCostos>
        </ModalGeneral>
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  position: relative;
`;
InputSimpleEditable;
const CajaTabla = styled(CajaTablaGroup)`
  overflow-x: scroll;
  /* border: none; */
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
`;

const Tabla = styled(TablaGroup)``;

const Filas = styled(FilasGroup)`
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }

  &.aproved {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.denied {
    background-color: #813636;
    color: white;
  }
  &.warningw {
    color: ${Tema.complementary.warning};
    color: #816815;
  }
  &.camion1 {
    background-color: #ecc3c3;
  }
  &.camion2 {
    background-color: #8eeb8e;
  }
`;

const CeldaHead = styled(CeldaHeadGroup)`
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.start {
    text-align: start;
  }
  &.ancho2 {
    min-width: 200px;
  }
  &.ancho {
    max-width: 100px;
  }
`;
const ParrafoAction = styled.p`
  cursor: pointer;
  margin-right: 4px;
  border: 1px solid ${Tema.secondary.azulOpaco};

  transition: ease 0.2s;
  &:hover {
    border-radius: 4px;
  }
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ContainerControles = styled.div`
  margin-bottom: 5px;
`;
const IconoCelda = styled.p`
  display: inline;
  border: 1px solid #b6b6b644;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 2px;
  &:hover {
    border: 1px solid #ff0000;
    background-color: #ffffffaf;
  }
`;

const CajaTablaCostos = styled.div`
  /* color: white; */
`;
