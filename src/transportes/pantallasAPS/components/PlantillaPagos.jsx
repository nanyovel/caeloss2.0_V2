import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import {
  collection,
  doc,
  getDocs,
  query,
  where,
  writeBatch,
} from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import ControlesPagoTabla from "../../components/ControlesPagoTabla";
import { Departamentos } from "../../../components/Corporativo";
import { ModalLoading } from "../../../components/ModalLoading";
import { Alerta } from "../../../components/Alerta";
import { ES6AFormat } from "../../../libs/FechaFormat";
import ExportarExcel from "../../../libs/ExportExcel";
import { statusPagosReq } from "../../components/Model";
import { Tema, Theme } from "../../../config/theme";
import TextoEpty from "../../components/TextoEpty";

import { InputSimpleEditable } from "../../../components/InputGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import Advertencia2 from "../../../components/Advertencia2";

export default function Int0SinProcesar({
  userMaster,
  dbReq0SinProcesar,
  setDBReq0SinProcesar,
  setUpData,
  columnasExcel,
  datosMolde,
}) {
  // ********** RECURSOS GENERALES **********
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
        console.log("salir");
        setEjecutarFuncion(false);
        return;
      }

      if (funcionEjecutar == "btnGuardar") {
        guardarCambios();
      } else if (funcionEjecutar == "btnExportar") {
        const listReqParsedAux = listReqParsed.map((req, index) => {
          return {
            ...req,
            status: statusPagosReq[req.contabilidad.statusPagoChofer],
          };
        });
        ExportarExcel(listReqParsedAux, columnasExcel);
      }
    }
    setEjecutarFuncion(false);
  }, [ejecutarFuncion]);

  // ********* LLAMADA A LA BASE DE DATOS*******
  const [sinDatos, setSinDatos] = useState(false);
  const fetchGetDocs = async (collectionName, setState) => {
    const userAuth = useAuth().usuario;

    const [usuario, setUsuario] = useState(userAuth);

    useEffect(() => {
      if (usuario && dbReq0SinProcesar.length == 0) {
        const q = query(
          collection(db, collectionName),
          // que estan concluidas
          where("estadoDoc", "==", 3),
          // Que aun no se hallan pagado
          where(
            "contabilidad.statusPagoChofer",
            "==",
            datosMolde.statusContTraer
          ),
          // Concluidas por choferes internos
          where("datosEntrega.chofer.tipo", "==", datosMolde.tipoChofer)
        );

        console.log("DB 😐😐😐😐😐" + collectionName);

        (async () => {
          try {
            const consultaDB = await getDocs(q);

            const coleccion = consultaDB.docs.map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }));
            // console.log(coleccion);
            setState(coleccion);
            if (coleccion.length == 0) {
              setSinDatos(true);
            }
          } catch (error) {
            console.log(error);
          }
        })();
      }
    }, [collectionName, setState]);
  };
  fetchGetDocs("transferRequest", setDBReq0SinProcesar);

  // ********************** useEffect Initial **********************
  const [listReqParsed, setListReqParsed] = useState([]);
  const [initialListReqParsed, setInitialListReqParsed] = useState([]);
  const [dptoParsed, setDptoParsed] = useState([]);
  const [choferesLista, setChoferesLista] = useState([]);
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
        tipo: "btnGuardar",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
        funcion: handleBtnControl,
      },
      {
        texto: "Exportar",
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
      const reqParseadas = dbReq0SinProcesar
        .sort((a, b) => a.numeroDoc - b.numeroDoc)
        .map((req) => {
          return {
            ...req,
            statusAproved: "",
            // montoPlain: req.datosMontos.length == 1,
          };
        });

      setListReqParsed(reqParseadas);
      setInitialListReqParsed(reqParseadas);

      // ******* LISTA DE DEPARTAMENTOS ******
      const listaDptoReqRepetidos = [];
      dbReq0SinProcesar.forEach((req) => {
        listaDptoReqRepetidos.push(req.datosSolicitante.dpto);
      });
      const dptoSinRepetidos = [...new Set(listaDptoReqRepetidos)];

      const dptoParsedAux = Departamentos.map((dpto) => {
        return {
          ...dpto,
          descripcion: dpto.nombre,
        };
      }).filter((dpto) => dptoSinRepetidos.includes(dpto.descripcion));

      setDptoParsed(dptoParsedAux);

      // ******* LISTA DE CHOFERES ******
      const listaChoferesReqRepetidos = [];
      dbReq0SinProcesar.forEach((req) => {
        listaChoferesReqRepetidos.push(req.datosEntrega.chofer.nombre);
      });
      const choferSinRepetidos = [...new Set(listaChoferesReqRepetidos)];
      const choferesAux = choferSinRepetidos.map((chofer) => {
        return {
          descripcion: chofer,
        };
      });
      setChoferesLista(choferesAux);

      // ******* CONTROLES ******
      const controlesParsed = {
        ...initialControles,
        menuDesplegable: initialControles.menuDesplegable.map((menu, index) => {
          return {
            ...menu,
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
            if (hasAprobacion) {
              return menu;
            }
          } else {
            return menu;
          }
        }),
        btns: controlesParsed.btns.filter((boton) => {
          if (boton.tipo == "btnGuardar") {
            if (hasAprobacion) {
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
  }, [dbReq0SinProcesar, userMaster]);

  const [valueDpto, setValueDpto] = useState("");
  const [valueChofer, setValueChofer] = useState("");
  const handleFiltros = (e) => {
    const { value, name } = e.target;

    let arrayAux = initialListReqParsed;
    // 7878
    let entradaMaster = value.toLowerCase();
    if (name == "menuDpto") {
      setValueDpto(entradaMaster);
    } else if (name == "menuChofer") {
      setValueChofer(entradaMaster);
    }
    console.log(value);
    console.log(name);
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

    const reqFind = listReqParsed.find(
      (req, index) => req.numeroDoc == numeroReq
    );

    if (nameDataset == "aproved") {
      if (reqFind.datosMontos.length == 1) {
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
  // 787878
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
    console.log(ejecucion);
    const accion =
      ejecucion == "Aprobar"
        ? "aproved"
        : ejecucion == "Rechazar"
          ? "denied"
          : "";

    console.log(accion);
    if (accion == "aproved") {
      const tieneAlerta = listReqParsed.some(
        (req) => req.datosMontos.length != 1
      );
      if (tieneAlerta) {
        setAdvAplicarATodos(true);
        setHasAlert(true);
        setMensajeAdvert(
          "Existen pagos que requieren verificacion, marcados de color amarillo en la columna Alerta, estos se deben verificar y aprovar de manera individual."
        );
        return "";
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
      console.log(accion);
      setListReqParsed(nuevoArray);
    }
  };

  // ********************* GUARDAR CAMBIOS *********************

  const guardarCambios = async () => {
    const hasAprobacion = userMaster.permisos.includes(
      datosMolde.permisoAprobacion
    );
    if (!hasAprobacion) {
      console.log("salir");
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
      setUpData(true);
      const batch = writeBatch(db);
      // ************* ACTUALIZAR SOLICITUDES *************
      listReqParsed.forEach((req, index) => {
        // Solo actualiza las solicitudes que esten aprobadas o rechazadas
        if (req.statusAproved == "aproved" || req.statusAproved == "denied") {
          const docActualizar = doc(db, "transferRequest", req.id);
          const aprobada = req.statusAproved == "aproved" ? true : false;

          batch.update(docActualizar, {
            "contabilidad.statusPagoChofer": aprobada
              ? datosMolde.posteriorAproved
              : datosMolde.posteriorDenied,
            "contabilidad.log.logistica1.status": aprobada ? 1 : 2,
            "contabilidad.log.logistica1.usuario.userName": userMaster.userName,
            "contabilidad.log.logistica1.usuario.id": userMaster.id,
            "contabilidad.log.logistica1.fecha": ES6AFormat(new Date()),
          });
        }
      });

      // ******** COMMIT  ********
      await batch.commit();

      // ******** ACTUALIZAR SIN CONSULTAR DB ********
      const listAuxParsed = listReqParsed.map((req) => {
        if (req.statusAproved == "") {
          return req;
        } else if (req.statusAproved == "aproved") {
          return {
            ...req,
            contabilidad: {
              ...req.contabilidad,
              statusPagoChofer: datosMolde.posteriorAproved,
            },
          };
        } else if (req.statusAproved == "denied") {
          return {
            ...req,
            contabilidad: {
              ...req.contabilidad,
              statusPagoChofer: datosMolde.posteriorDenied,
            },
          };
        }
      });

      setTimeout(() => {
        setDBReq0SinProcesar(listAuxParsed);
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

  return (
    <Container>
      {datosParseados && (
        <ContainerControles>
          <ControlesPagoTabla
            titulo={"Pagos sin procesar"}
            controles={controles}
            handleFiltros={handleFiltros}
          />
        </ContainerControles>
      )}

      {dbReq0SinProcesar.length > 0 &&
      listReqParsed.length > 0 &&
      datosParseados &&
      Theme.config.modoClear == true ? (
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
                  <CeldaHead>Chofer</CeldaHead>
                  <CeldaHead className="Monto chofer">M. chofer</CeldaHead>
                  <CeldaHead>Ayudante</CeldaHead>
                  <CeldaHead className="Monto Ayudante">M. ayudante</CeldaHead>
                  <CeldaHead>Alerta</CeldaHead>
                  <CeldaHead>Accion</CeldaHead>
                </Filas>
              </thead>
              <tbody>
                {datosParseados &&
                  listReqParsed
                    .filter(
                      (req) =>
                        req.contabilidad.statusPagoChofer ==
                        datosMolde.statusContTraer
                    )
                    .map((req, index) => {
                      return (
                        <Filas
                          key={index}
                          className={`body
                        ${req.statusAproved} 
                        ${req.datosMontos.length == 1 ? "" : "warning"} 
                        ${index % 2 ? "impar" : "par"} 
                        
                      `}
                        >
                          <CeldasBody
                            className={`${index % 2 ? "impar" : "par"} `}
                          >
                            {index + 1}
                          </CeldasBody>

                          <CeldasBody
                            className={`${index % 2 ? "impar" : "par"} `}
                          >
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
                            className="ancho"
                            title={req.datosReq.socioNegocio}
                          >
                            {req.datosReq.socioNegocio}
                          </CeldasBody>
                          <CeldasBody
                            className={`${index % 2 ? "impar" : "par"} `}
                          >
                            {req.fechaReq.slice(0, 10)}
                          </CeldasBody>
                          <CeldasBody
                            title={req.datosSolicitante.dpto}
                            className="ancho"
                          >
                            {req.datosSolicitante.dpto}
                          </CeldasBody>
                          <CeldasBody
                            className="ancho"
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
                          <CeldasBody
                            className={`${index % 2 ? "impar" : "par"} `}
                          >
                            {req.contabilidad.montoPagarChofer}
                          </CeldasBody>
                          <CeldasBody
                            className="ancho"
                            title={
                              req.datosEntrega.ayudante.nombre +
                              " " +
                              req.datosEntrega.ayudante.apellido
                            }
                          >
                            {req.datosEntrega.ayudante.nombre +
                              " " +
                              req.datosEntrega.ayudante.apellido}
                          </CeldasBody>
                          <CeldasBody
                            className={`${index % 2 ? "impar" : "par"} `}
                          >
                            {req.contabilidad.montoPagarAyudante}
                          </CeldasBody>
                          <CeldasBody
                            className={`
                            ${index % 2 ? "impar" : "par"}
                        
                      `}
                          >
                            {req.datosMontos.length == 1 ? "" : "🟡"}
                          </CeldasBody>
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
      {sinDatos && <TextoEpty texto={"~ No existen pagos sin procesar. ~"} />}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
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
`;

const CeldaHead = styled(CeldaHeadGroup)`
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.ancho {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.flex {
    display: flex;
    border: 1px solid ${Tema.secondary.azulOpaco};
    justify-content: center;
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
