import { useEffect, useState } from "react";
import styled from "styled-components";
import ControlesDoc from "../components/ControlesDoc";
import { BotonQuery } from "../../components/BotonQuery";
import { Link, NavLink, useParams } from "react-router-dom";
import Calificar from "../../libs/Calificar";
import {
  fetchDocsByConditionGetDocs,
  obtenerDocPorId2,
  useDocByCondition,
  useDocByIdDangerous2,
} from "../../libs/useDocByCondition";
import { ES6AFormat, hoyManniana } from "../../libs/FechaFormat";
import {
  extraerPrimerNombreApellido,
  formatoDOP,
  soloNumeros,
} from "../../libs/StringParsed";

import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FormulaOficialFlete } from "../../fletes/components/FormulaOficialFlete";

import {
  addDoc,
  collection,
  doc,
  setDoc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { Alerta } from "../../components/Alerta";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy } from "@fortawesome/free-regular-svg-icons";

import ModalAccionesReq from "../components/reqComponents/ModalAccionesReq";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado";
import { ClearTheme, Tema, Theme } from "../../config/theme";

import { TextArea } from "../../components/InputGeneral";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import DetallePagos from "../components/DetallePagos";
import AvatarMale from "./../../../public/img/avatares/avatarMale.png";
import AvatarFemale from "./../../../public/img/avatares/avatarFemale.png";
import MoldeDatosReq from "../components/reqComponents/MoldeDatosReq";
import EjecutorJSXEstados from "../components/reqComponents/EjecutorJSXEstados";
import { ManejadorJSEstados } from "../components/reqComponents/ManejadorJSEstados";
import { ModalLoading } from "../../components/ModalLoading";
import { reviewClientesSchema } from "../schemas/reviewClientesSchema";

import { parsedStatusAyudAdd } from "../schemas/mixSchema";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import {
  StyleTextStateReq,
  CajaStatusComponent,
} from "../libs/DiccionarioNumberString";
import MontosReqViejo from "../components/reqComponents/MontosReqViejo";
import MontosReqNuevo from "../components/reqComponents/MontosReqNuevo";
import { GenerarMonto } from "../libs/GenerarMonto";
import { generarUUID } from "../../libs/generarUUID";
import { unificarVehiculos } from "../libs/unificarVehiculos";
import {
  ayudanteAddInRequest,
  ayudanteAddSchema,
} from "../schemas/ayudanteAddSchema";
import { AvatarPerfil } from "../../components/JSXElements/ImgJSX";
import { vehiculosSchema } from "../schemas/vehiculosSchema.js";
import {
  datosEntregaSchemaVehAdd,
  vehiculoAdicionalSchema,
} from "../schemas/vehiculoAddSchema.js";
export const DetalleReq = ({
  userMaster,
  setDBChoferes,
  dbChoferes,
  usuario,
  // choferes internos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
}) => {
  // *************** CONFIG GENERAL *******************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const location = useParams();
  const [docUser, setDocUser] = useState(location.id);
  const [requestMaster, setRequestMaster] = useState(null);
  const [reqDB, setReqDB] = useState(null);
  const [datosParsed, setDatosParsed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [reviewClienteMaster, setReviewClienteMaster] = useState(null);

  // Arrays de privilegios
  const privilegioEstados = [
    "planificatedRequestTMS",
    "runRequestTMS",
    "terminateRequestTMS",
    "annularRequestTMS",
  ];
  const privilegioAcciones = [
    "changeDriverTMS",
    "addMontoTMS",
    "modifiedRelationTMS",
    "addCommetsReqTMS",
    "approvedPriceChangesAdd",
  ];
  // const privilegioMasInfo = ["accessPagosTMS"];

  useDocByCondition(
    "transferRequest",
    setReqDB,
    "numeroDoc",
    "==",
    Number(docUser)
  );

  // Poner algunos datos por default
  const resetDatosChange = (tipo) => {
    setBotonSeleccionado({});
    setVerEstados(false);
    setPropsConfigEstado(initialPropsConfigEstado);

    setCongloAcciones({ ...initialCongloAcciones });
    setInputObs("");
  };

  // Alimentar el estado principal y parsear los datos
  const [reqNoExiste, setReqNoExiste] = useState("");
  const [hasData, setHasData] = useState(0);
  useEffect(() => {
    if (reqDB) {
      if (docUser && reqDB.length > 0) {
        const requestObtenida = reqDB[0];
        if (requestObtenida) {
          setHasData(1);
          setRequestMaster(requestObtenida);
        }
        setDatosMontos([...requestObtenida.datosMontos]);
      }

      if (reqDB.length == 0) {
        setReqNoExiste(
          "El numero de solicitud colocado no se encuentra en la base de datos."
        );
        setHasData(2);
      }
    }
  }, [docUser, reqDB]);

  const [hasMapa, setHasMapa] = useState(false);

  // ***************************** CONTROLES *****************************
  const [botonSeleccionado, setBotonSeleccionado] = useState({});
  const handleControles = async (e) => {
    const { name } = e.target;
    if (name == "btnCopiar") {
      copiarPlantilla();
      return;
    }
    const botonFind = controles.btns.find((control) => control.tipo == name);
    if (botonFind) {
      setBotonSeleccionado(botonFind);
    } else {
      setBotonSeleccionado({});
    }

    // Cuando no ejecutarse
    if (
      name != "btnComentar" &&
      name != "btnAcciones" &&
      name != "btnMasInfo"
    ) {
      console.log(requestMaster.estadoDoc);
      if (requestMaster.estadoDoc >= 3) {
        return;
      }
    }

    console.log("paso");
    // Click en estados
    if (name == "btnEstados") {
      const acceso = privilegioEstados.some((pri) =>
        userMaster.permisos.includes(pri)
      );
      if (!acceso) {
        return;
      }
    }
    // Click en acciones
    if (name == "btnAcciones") {
      const acceso = privilegioAcciones.some((pri) =>
        userMaster.permisos.includes(pri)
      );
      if (!acceso) {
        return;
      }
    }
    // Click mas info
    // if (name == "btnMasInfo") {
    //   const acceso = privilegioMasInfo.some((pri) =>
    //     userMaster.permisos.includes(pri)
    //   );
    //   if (!acceso) {
    //     return;
    //   }
    // }
    setRequestEditable({ ...requestMaster });
  };

  const initialControles = {
    btns: [
      {
        texto: "Estados",
        tipo: "btnEstados",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
      },
      {
        texto: "Acciones",
        tipo: "btnAcciones",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
      },
      {
        texto: "Obs.",
        tipo: "btnComentar",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
      },
      {
        texto: "Copiar",
        tipo: "btnCopiar",
        icono: true,
        visible: true,
        disabled: false,
        title: "Copiar Plantilla",
      },
      {
        texto: "Mas info",
        tipo: "btnMasInfo",
        icono: true,
        visible: true,
        disabled: false,
        title: "Mas informacion",
      },
    ],
  };
  const [controles, setControles] = useState({ ...initialControles });

  // ************************* USEFFECT INICIAL *****************************
  const [isConcluida, setIsConcluida] = useState(false);
  useEffect(() => {
    if (requestMaster) {
      // if (requestMaster.estadoDoc == 4 || requestMaster.estadoDoc == 3) {
      let botonDisabled = {
        btnEstados: false,
        btnAcciones: false,
        btnComentar: false,
        btnCopiar: false,
      };
      let botonTitle = {
        btnEstados: "",
        btnAcciones: "",
        btnComentar: "",
      };

      const estadoNew = StyleTextStateReq.find(
        (state) => state.numero == requestMaster?.estadoDoc
      )?.texto;
      // Si la solicitud es hija de otra solicitud no permite cambiar estados
      if (requestMaster.familia.parentesco == 1) {
        botonDisabled.btnEstados = true;
        botonTitle.btnEstados =
          "No puede cambiar el estado a una solicitud hija.";
        botonDisabled.btnAcciones = false;
        botonDisabled.btnComentar = false;
      }
      // Si la solicitud esta concluida , anulada o en borrador solo permite comentar
      let isConcluidaAux = false;
      if (requestMaster.datosFlete?.vehiculosAdicionales?.length > 0) {
        const hasVehiculoAddicional =
          requestMaster.datosFlete?.vehiculosAdicionales.every((vehi) => {
            return vehi.datosEntrega.status == 3;
          });
        if (hasVehiculoAddicional && requestMaster.estadoDoc == 3) {
          isConcluidaAux = true;
        }
      } else {
        isConcluidaAux = requestMaster.estadoDoc == 3;
      }
      setIsConcluida(isConcluidaAux);
      if (requestMaster.estadoDoc == 4 || isConcluidaAux) {
        botonDisabled.btnEstados = true;
        botonTitle.btnEstados = `No puede cambiar el estado a una solicitud ${estadoNew}.`;
        botonDisabled.btnAcciones = false;
        // botonTitle.btnAcciones = `No puede acceder a acciones de una solicitud solicitud ${estado}.`;
        botonDisabled.btnComentar = false;
      }
      if (requestMaster.tipo > 0) {
        botonDisabled.btnCopiar = true;
      }

      const controlesParsed = {
        ...initialControles,
        btns: initialControles.btns.map((btn) => {
          return {
            ...btn,
            disabled: botonDisabled[btn.tipo],
            title: botonTitle[btn.tipo],
          };
        }),
      };

      // Definir botones a mostrar en barra de controles

      // SABER SI TIENE ACCESO AL BOTON ESTADOS
      let canEditState = false;
      privilegioEstados.forEach((permiso) => {
        if (userMaster.permisos.includes(permiso)) {
          canEditState = true;
        }
      });

      // SABER SI TIENE ACCESO AL BOTON ACCIONES
      let accessAcciones = false;
      privilegioAcciones.forEach((permiso) => {
        if (userMaster.permisos.includes(permiso)) {
          accessAcciones = true;
        }
      });
      // SABER SI TIENE ACCESO AL BOTON MAS INFO
      // let hasViewPagos = false;
      // privilegioMasInfo.forEach((permiso) => {
      //   if (userMaster.permisos.includes(permiso)) {
      //     hasViewPagos = true;
      //   }
      // });

      // COMPILARRRRR
      const controlesParsedPrivilegios = {
        ...controlesParsed,
        btns: controlesParsed.btns.filter((boton) => {
          if (boton.tipo == "btnEstados") {
            if (canEditState) {
              return boton;
            }
          } else if (boton.tipo == "btnAcciones") {
            if (accessAcciones) {
              return boton;
            }
          } else if (boton.tipo == "btnMasInfo") {
            return boton;
            // if (hasViewPagos) {
            // }
          } else {
            return boton;
          }
        }),
      };

      setControles({ ...controlesParsedPrivilegios });
      // }}

      setDatosParsed(true);
    }
  }, [requestMaster]);

  // ************************ MANEJANDO ESTADOS DE LA SOLICITUD ************************
  const initialPropsConfigEstado = {
    tipo: "",
    semana: false,
    chofer: false,
    fecha: false,
    justificacion: false,
    solicitud: {},
  };
  const [propsConfigEstado, setPropsConfigEstado] = useState({
    ...initialPropsConfigEstado,
  });
  const [verEstados, setVerEstados] = useState(false);
  const handleEstados = (e) => {
    const nameDataset = e.target.dataset.name;
    const { name } = e.target;
    if (nameDataset == "cerrar") {
      resetDatosChange();
      return;
    }

    if (name == propsConfigEstado.tipo) {
      setMensajeAlerta("Opcion ya seleccionada.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const res = ManejadorJSEstados(
      name,
      initialPropsConfigEstado,
      setPropsConfigEstado,
      requestMaster,
      userMaster
    );
    if (res?.alerta == true) {
      setMensajeAlerta(res.mensaje);
      setTipoAlerta(res.tipo);
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), res.duracion);
      return;
    } else {
      setVerEstados(true);
    }
  };

  //** MANEJANDO ACCIONES *********************************
  // ********************************* MANEJANDO ACCIONES *********************************
  // ********************************* MANEJANDO ACCIONES *********************************
  const initialCongloAcciones = {
    vehiculo: { justificacion: "" },
    montos: { costoManual: "", precioManual: "", justificacion: "" },
    relacion: {
      listaDBHijas: [],
      valueDesplegable: "",
      valueInputReqObt: "",
    },
    reset: {
      opcionesReset: [
        {
          nombre: "Estados",
          opcion: 0,
          select: true,
          tipo: "reset",
        },
        {
          nombre: "Pagos",
          opcion: 1,
          select: false,
          tipo: "reset",
        },
      ],
      estados: {
        justificacion: "",
      },
      pagos: {},
    },
    esquemas: {
      editable: false,
      enRevision: false,
      editableVehiAdd: [],
      revisionVehAdd: [],
    },
  };
  const [congloAcciones, setCongloAcciones] = useState({
    ...initialCongloAcciones,
  });
  const handleAcciones = (e) => {
    const { name } = e.target;
    const tipoDataset = e.target.dataset.tipo;
    const nameDataset = e.target.dataset.name;
    const nivelDataset = e.target.dataset.nivel;

    if (tipoDataset == "vehiculo") {
      if (name == "guardar") {
        guardarCambiosVehiculo();
      } else if (name == "addVehiculo" || name == "minusVehiculo") {
        agregarGroupVeh(e);
      } else {
        handleVehiculo(e);
      }
    } else if (tipoDataset == "montos") {
      if (name == "guardar") {
        agregarNuevoMonto();
      } else {
        handleInputMonto(e);
      }
    } else if (tipoDataset == "relacion") {
      if (name == "cambiar" || name == "cancelar" || name == "guardar") {
        establecerParentesco(e);
      } else if (name == "traerSolicitudHija") {
        traerSolicitudEspecificada();
      } else if (nameDataset == "quitarHija") {
        quitarHija(e);
      } else {
        handleDespParentesco(e);
      }
    } else if (tipoDataset == "reset") {
      if (name == "estadoPagos") {
        handleOpcionesReset(e);
      } else if (name == "justificacion") {
        handleReset(e);
      } else if (name == "resetearEstados") {
        resetEstadoReq();
      } else if (name == "resetearPagos") {
        resetPagoReq();
      }
    } else if (tipoDataset == "aprobaciones") {
      if (name == "aprobar") {
        aprobarBorrador();
      }
      if (name == "rechazar") {
        rechazarBorrador();
      }

      if (nameDataset == "aprobarAyudAdd") {
        aprobarAyudanteAdd(e);
      } else if (nameDataset == "denegarAyudAdd") {
        aprobarAyudanteAdd(e);
      }
    } else if (tipoDataset == "esquemas") {
      if (name == "add" || name == "minus") {
        if (nivelDataset == "vehiAdd") {
          addAyudanteVehiAdd(e);
        } else {
          addAyudante(e);
        }
      } else if (name == "guardar") {
        guardarEsquemas(e);
      } else if (name == "guardarVehAdd") {
        guardarEsquemasVehAdd(e);
      } else {
        if (nivelDataset == "vehiAdd") {
          handleInputEsquemaVehicuAdd(e);
        } else {
          handleInputEsquema(e);
        }
      }
    }
  };

  // ********************************* MODIFICAR VEHICULO *************************************
  const [requestEditable, setRequestEditable] = useState({});
  const [datosMontos, setDatosMontos] = useState([]);
  const [opcionesVehiculos, setOpcionesVehiculo] = useState([]);

  useEffect(() => {
    if (requestEditable?.datosFlete?.unidadVehicular) {
      setOpcionesVehiculo(requestEditable.datosFlete.unidadVehicular);
    }
  }, [requestEditable]);

  const handleVehiculo = (e) => {
    const { name, value } = e.target;
    const dataNivelVehiculo = e.target.dataset.nivelvehiculo;
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    if (name == "vehiculo") {
      const hasPermiso = userMaster.permisos.includes("changeDriverTMS");
      if (!hasPermiso) {
        return;
      }
      console.log(value);
      if (dataNivelVehiculo == "default") {
        const vehiculoSeleccionado = vehiculosSchema.find((uv, index) => {
          if (uv.descripcion == value) {
            return uv;
          }
        });

        // const nuevoResultado = FormulaOficialFlete({
        //   ...requestEditable.datosFlete,
        //   vehiculoSeleccionado: vehiculoSeleccionado,
        // });
        const nuevoResultado = FormulaOficialFlete(
          requestEditable.datosFlete,
          1,
          vehiculoSeleccionado
        );
        console.log(nuevoResultado);
        setRequestEditable({
          ...requestEditable,
          datosFlete: {
            ...requestEditable.datosFlete,
            costo: nuevoResultado.costo,
            precio: nuevoResultado.precio,
            vehiculoSeleccionado: vehiculoSeleccionado,
            idCamionComoElemento: generarUUID(),
          },
        });
      }

      if (dataNivelVehiculo == "adcional") {
        const indexDataset = e.target.dataset.index;
        const vehiculoSeleccionado = vehiculosSchema.find((uv, indexDos) => {
          if (uv.descripcion == value) {
            return uv;
          }
        });

        // const nuevoResultado = FormulaOficialFlete({
        //   ...requestEditable.datosFlete,
        //   vehiculoSeleccionado: vehiculoSeleccionado,
        // });

        const nuevoResultado = FormulaOficialFlete(
          requestEditable.datosFlete,
          1,
          vehiculoSeleccionado
        );

        console.log(nuevoResultado);
        setRequestEditable({
          ...requestEditable,
          datosFlete: {
            ...requestEditable.datosFlete,
            vehiculosAdicionales:
              requestEditable.datosFlete?.vehiculosAdicionales?.map(
                (vehi, index) => {
                  if (indexDataset == index) {
                    return {
                      ...vehiculoSeleccionado,
                      datosEntrega: {
                        ...vehiculoAdicionalSchema.datosEntrega,
                        status: requestMaster.estadoDoc,
                      },
                      resultado: {
                        distancia: requestEditable.datosFlete.distancia,
                        costo: nuevoResultado.costo,
                        precio: nuevoResultado.precio,
                      },
                    };
                  } else {
                    return vehi;
                  }
                }
              ),
          },
        });
      }
    } else if (name == "justificacion") {
      const hasPermiso = userMaster.permisos.includes("changeDriverTMS");
      if (!hasPermiso) {
        return;
      }
      setCongloAcciones((prevState) => ({
        ...prevState,
        vehiculo: {
          ...prevState.vehiculo,
          justificacion: value,
        },
      }));
    }
  };
  // Agregar
  // Quitar vehiculos adicionales
  const agregarGroupVeh = (e) => {
    const name = e.target.name;
    // Si la solicitud esta en modo borrador
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    if (requestMaster.estadoDoc == 3) {
      setMensajeAlerta("Esta solicitud posee entregas realizadas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    if (name == "addVehiculo") {
      if (requestEditable.datosFlete?.vehiculosAdicionales?.length > 4) {
        setMensajeAlerta("Solo puede adicional 5 vehiculos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 5000);
        return;
      }
      const nuevovehiculo = {
        ...vehiculosSchema[0],
      };

      const nuevoResultado = FormulaOficialFlete({
        ...requestEditable.datosFlete,
        vehiculoSeleccionado: nuevovehiculo,
      });

      setRequestEditable({
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,

          vehiculosAdicionales: [
            ...requestEditable.datosFlete.vehiculosAdicionales,
            {
              ...vehiculoAdicionalSchema,
              idCamionComoElemento: generarUUID(),
              datosEntrega: {
                ...vehiculoAdicionalSchema.datosEntrega,
                status: requestMaster.estadoDoc,
              },
              resultado: nuevoResultado,
            },
          ],
        },
      });
    } else if (name == "minusVehiculo") {
      if (requestEditable.datosFlete?.vehiculosAdicionales?.length == 0) {
        setMensajeAlerta("Sin vehiculos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 5000);
        return;
      }
      setRequestEditable({
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,
          vehiculosAdicionales:
            requestEditable.datosFlete.vehiculosAdicionales.slice(0, -1),
        },
      });
      // setArrayVehiculosAdd((prev) => prev.slice(0, -1));
    }
  };
  const guardarCambiosVehiculo = async () => {
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const hasEntregasRealizadas = unificarVehiculos(requestMaster)?.some(
      (vehi) => {
        return vehi.datosEntrega.status == 3;
      }
    );
    if (hasEntregasRealizadas == true) {
      setMensajeAlerta("Esta solicitud posee entregas realizadas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const hasPermiso = userMaster.permisos.includes("changeDriverTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc >= 2) {
      setMensajeAlerta(
        "Solo puedes cambiar vehiculo a solicitud en estado a la espera o planificada."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }

    if (congloAcciones.vehiculo.justificacion == "") {
      setMensajeAlerta("Debe colocar una justificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // VERIFICA SI ALGUN ELEMENTO NO TIENE ID, ESTO ESTA PASANDO PUES LAS COMPUTADORAS DE LOS USUARIOS SIGUEN CREANDO SOLICITUDES SIN LA PROPIEDAD
    // idCamionComoElemento, lo cual esta trayendo problemas

    let datosFleteParsed = requestEditable.datosFlete;
    console.log("Ⓜ️Ⓜ️Ⓜ️Ⓜ️Ⓜ️");
    // 1-Saber si el camion principal tiene la propiedad idCamionComoElemento
    if (!("idCamionComoElemento" in requestEditable.datosFlete)) {
      console.log("🟢🟢🟢🟢🟢");
      datosFleteParsed = {
        ...datosFleteParsed,
        idCamionComoElemento: generarUUID(),
      };
    }
    // 747
    // 2-Saber si algun camion adicional no tiene la propiedad idCamionComoElemento
    datosFleteParsed = {
      ...datosFleteParsed,
      vehiculosAdicionales: datosFleteParsed.vehiculosAdicionales.map(
        (vehAdd) => {
          if (!("idCamionComoElemento" in vehAdd)) {
            return {
              ...vehAdd,
              idCamionComoElemento: generarUUID(),
            };
          } else {
            return { ...vehAdd };
          }
        }
      ),
    };

    const requestParsed = {
      ...requestEditable,
      datosFlete: datosFleteParsed,
    };
    const nuevoMontoAux = GenerarMonto({
      datosFlete: requestParsed.datosFlete,
      origen: 2,
      justificacion: congloAcciones.vehiculo.justificacion,
      userMaster: userMaster,
    });
    const nuevoMonto = nuevoMontoAux;

    resetDatosChange();
    const reqActualizar = doc(db, "transferRequest", requestMaster.id);
    try {
      await updateDoc(reqActualizar, {
        datosFlete: {
          ...requestParsed.datosFlete,
          vehiculoSeleccionado: requestParsed.datosFlete.vehiculoSeleccionado,
          costo: requestParsed.datosFlete.costo,
          precio: requestParsed.datosFlete.precio,
          vehiculosAdicionales: requestParsed.datosFlete.vehiculosAdicionales,
          vehiculosAdicionalesTiene:
            requestParsed.datosFlete.vehiculosAdicionales.length > 0,
        },
        datosMontos: [...requestMaster.datosMontos, { ...nuevoMonto }],
      });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ********************************* MONTOS *************************************
  const handleInputMonto = (e) => {
    const hasPermiso = userMaster.permisos.includes("addMontoTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const { name, value } = e.target;
    console.log(name);

    let isNumber = true;
    if (name != "justificacion") {
      isNumber = soloNumeros(value);
    }

    if (isNumber) {
      setCongloAcciones((prevState) => ({
        ...prevState,
        montos: {
          ...prevState.montos,
          [name]: value,
        },
      }));
    }
  };
  const agregarNuevoMonto = async () => {
    const hasPermiso = userMaster.permisos.includes("addMontoTMS");
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    if (requestMaster.familia.parentesco == 1) {
      return;
    }
    const montoAux = congloAcciones.montos;
    if (
      montoAux.costoManual == "" ||
      montoAux.precioManual == "" ||
      montoAux.justificacion == ""
    ) {
      setMensajeAlerta("Colocar costo, precio y justificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    console.log(montoAux);
    const costoIsNumber = soloNumeros(montoAux.costoManual);
    const precioIsNumber = soloNumeros(montoAux.precioManual);

    console.log(costoIsNumber);
    console.log(precioIsNumber);

    if (costoIsNumber == false || precioIsNumber == false) {
      setMensajeAlerta("Colocar precio y costo correctamente");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc >= 2) {
      setMensajeAlerta(
        "Solo puedes agregar montos si la solicitud esta a la espera o en planificacion."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const nuevoMonto = GenerarMonto({
      datosFlete: requestEditable.datosFlete,
      origen: 3,
      justificacion: congloAcciones.montos.justificacion,
      userMaster: userMaster,
      costoManual: Number(montoAux.costoManual),
      precioManual: Number(montoAux.precioManual),
    });

    const montoAgregar = nuevoMonto;

    resetDatosChange();
    try {
      const docAtualizar = doc(db, "transferRequest", requestMaster.id);
      await updateDoc(docAtualizar, {
        // Cada vez que se agrega un monto, el ultimo monto (precio y costo) deben colocarse como oficial
        // "datosFlete.precio": Number(montoAgregar.precio),
        // "datosFlete.costo": Number(montoAgregar.costo),

        datosMontos: [...requestMaster.datosMontos, montoAgregar],
      });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ************************************* RELACION *************************************
  const handleDespParentesco = (e) => {
    const hasPermiso = userMaster.permisos.includes("modifiedRelationTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const { value, name } = e.target;
    // if (name == "valueDesplegable") {
    setCongloAcciones((prevState) => ({
      ...prevState,
      relacion: {
        ...prevState.relacion,
        [name]: name == "valueDesplegable" ? Number(value) : value,
      },
    }));
    // }
  };
  const [hasDesplegableParentesco, setHasDesplegableParentesco] =
    useState(false);

  const establecerParentesco = async (e) => {
    const hasPermiso = userMaster.permisos.includes("modifiedRelationTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    // Si es una solicitud hija
    if (requestMaster.familia.parentesco == 1) {
      // SI ya tiene madre
      if (requestMaster.familia.solicitudMadre != null) {
        setMensajeAlerta("Primero debe quitar solicitud madre.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 4000);
        return "";
      }
    }
    // SI es una solicitud madre
    if (requestMaster.familia.parentesco == 0) {
      // SI ya tiene hijas
      if (requestMaster.familia.solicitudesHijas.length > 0) {
        setMensajeAlerta("Primero debe quitar todas las hijas.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 4000);
        return "";
      }
    }
    // Si no esta ni a la espera ni en planificacion
    if (requestMaster.estadoDoc > 1) {
      setMensajeAlerta(
        "La solicitud debe estar a la espera o en planificacion."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const { name, value } = e.target;
    const nameButton = e.currentTarget.name;
    if (name == "cambiar") {
      setHasDesplegableParentesco(true);
    } else if (name == "cancelar") {
      setHasDesplegableParentesco(false);
    } else if (name == "guardar" || nameButton == "guardar") {
      try {
        setHasDesplegableParentesco(false);
        const docRef = doc(db, "transferRequest", requestMaster.id);
        await updateDoc(docRef, {
          "familia.parentesco": congloAcciones.relacion.valueDesplegable,
        });
        setMensajeAlerta("Cambio de parentesco realizado.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
  };

  // Para saber si la cantidad de las fracciones de las hijas es menor
  const [hasIncoherencia, setHasIncoherencia] = useState(false);
  const [sumatoriaFracc, setSumatoriaFracc] = useState(0);
  useEffect(() => {
    if (requestMaster) {
      let sumatoria = 0;
      const listaDBHijas = congloAcciones.relacion.listaDBHijas;
      listaDBHijas.forEach((req) => {
        sumatoria =
          sumatoria + req.datosFlete.vehiculoSeleccionado.fraccionesCarga;
      });

      if (
        sumatoria >=
        requestMaster.datosFlete.vehiculoSeleccionado.fraccionesCarga
      ) {
        setHasIncoherencia(true);
      } else {
        setHasIncoherencia(false);
      }
      setSumatoriaFracc(sumatoria);
    }
  }, [congloAcciones.relacion.listaDBHijas, requestMaster]);

  // Traer solicitud
  const [dbTransferRequest, setDBTransferRequest] = useState([]);
  const [reqEspecificada, setReqEspeficada] = useState({});
  const traerSolicitudEspecificada = async () => {
    const hasPermiso = userMaster.permisos.includes("modifiedRelationTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    if (hasIncoherencia) {
      setMensajeAlerta("Para agregar mas hijas debe corregir incongruencias.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    if (usuario) {
      const valueInputReqObt = congloAcciones.relacion.valueInputReqObt;
      // Si no se coloco nada
      if (valueInputReqObt == "") {
        setMensajeAlerta("Colocar numero de solicitud.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si se coloco un string, tomando en cuenta que el numero de solicitud es un number
      if (soloNumeros(valueInputReqObt) == false) {
        setMensajeAlerta("Colocar un numero valido.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }

      if (soloNumeros(valueInputReqObt)) {
        try {
          const reqAux = await fetchDocsByConditionGetDocs(
            "transferRequest",
            setDBTransferRequest,
            "numeroDoc",
            "==",
            Number(valueInputReqObt)
          );

          // Si la solicitud no existe
          if (reqAux.length == 0) {
            setMensajeAlerta("Solicitud no encontrada.");
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }
          // Si se coloca la misma solicitud
          if (reqAux[0].id == requestMaster.id) {
            setMensajeAlerta(
              "No puede definir como hija la misma solicitud madre."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }
          // Si la solicitud no esta configurada como hija
          else if (reqAux[0].familia.parentesco != 1) {
            setMensajeAlerta(
              "La solicitud buscada no esta configurada como hija."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }
          // Si la solicitud ya es hija de otra solicitud
          else if (reqAux[0].familia.solicitudMadre != null) {
            setMensajeAlerta(
              "La solicitud buscada ya es hija de otra solicitud."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }

          // Si la solicitud es de tipo madre
          else if (reqAux[0].familia.parentesco == 0) {
            setMensajeAlerta(
              "La solicitud buscada esta configurada como madre."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }
          // Si la solicitud no es de tipo traslado
          else if (reqAux[0].tipo != 1) {
            setMensajeAlerta("La solicitud buscada no es de tipo traslado.");
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            return;
          }
          // Si la solicitud no esta en los estado; a la espera... o en planificacion
          else if (reqAux[0].estadoDoc > 1) {
            const estado =
              reqAux[0].estadoDoc == 2
                ? "en Ejecucion"
                : reqAux[0].estadoDoc == 3
                  ? "Concluida"
                  : reqAux[0].estadoDoc == 4
                    ? "Cancelada"
                    : "";
            setMensajeAlerta(`La solicitud buscada esta ${estado}.`);
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 4000);
            return;
          }
          // Si la solicitud tiene un destino diferente a la solicitud madre
          else if (
            reqAux[0].datosFlete.provinciaSeleccionada.municipioSeleccionado
              .codeSucursal !=
            requestMaster.datosFlete.provinciaSeleccionada.municipioSeleccionado
              .codeSucursal
          ) {
            setMensajeAlerta(
              "La solicitud buscada tiene una sucursal destino diferente a la solicitud madre."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 4000);
            return;
          }
          // Esto no deberia ocurrir nunca, dado a que la opcion de la pestaña no le permite
          // pero condicion colocada si acaso
          // Si la solicitud master no es de tipo traslado
          else if (requestMaster.tipo != 1) {
            setMensajeAlerta("La solicitud madre no es de tipo traslado.");
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 4000);
            return;
          }
          // Si la solicitud hija tiene mayor cantidad de fraccion de carga que la madre
          else if (
            reqAux[0].datosFlete.vehiculoSeleccionado.fraccionesCarga >=
            requestMaster.datosFlete.vehiculoSeleccionado.fraccionesCarga
          ) {
            setMensajeAlerta(
              "El flete de la solicitud hija es para un vehiculo mayor o igual que el de la solicitud madre."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 5000);
            return;
          }
          // Si al agregar la hija sobrepasa la cantidad de cuota de la madre
          else if (
            sumatoriaFracc +
              reqAux[0].datosFlete.vehiculoSeleccionado.fraccionesCarga >=
            requestMaster.datosFlete.vehiculoSeleccionado.fraccionesCarga
          ) {
            setMensajeAlerta(
              "La sumatoria de todas las fracciones de carga debe ser menor al total de fracciones de la solicitud madre."
            );
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 4000);
            return;
          }
          // Si no se encuentran fallo, traela
          else {
            setReqEspeficada(reqAux[0]);
            const batch = writeBatch(db);

            // 01-PRIMERO ACTUALIZA LA SOLICITUD MADRE
            const docRefMadre = doc(db, "transferRequest", requestMaster.id);
            const arrayHijas = [
              ...requestMaster.familia.solicitudesHijas,
              {
                id: reqAux[0].id,
                numero: reqAux[0].numeroDoc,
                cliente: reqAux[0].datosReq.socioNegocio,
                fecha: reqAux[0].fechaReq,
                solicitante: {
                  id: reqAux[0].datosSolicitante.idSolicitante,
                  nombre: reqAux[0].datosSolicitante.nombre,
                  userName: reqAux[0].datosSolicitante.userName,
                },
              },
            ];
            batch.update(docRefMadre, {
              "familia.solicitudesHijas": arrayHijas,
            });

            // 02-AHORA ACTUALIZA LA SOLICITUD HIJA
            const docRefHija = doc(db, "transferRequest", reqAux[0].id);
            batch.update(docRefHija, {
              estadoDoc: requestMaster.estadoDoc,
              fechaEjecucion: requestMaster.fechaEjecucion,
              "current.fechaDespProg": requestMaster.current.fechaDespProg,
              "familia.solicitudMadre": {
                id: requestMaster.id,
                numero: requestMaster.numeroDoc,
                cliente: requestMaster.datosReq.socioNegocio,
                fecha: requestMaster.fechaReq,
                solicitante: {
                  id: requestMaster.datosSolicitante.idSolicitante,
                  nombre: requestMaster.datosSolicitante.nombre,
                  userName: requestMaster.datosSolicitante.userName,
                },
              },
            });

            await batch.commit();

            // setIsLoading(false);
            setMensajeAlerta("Solicitud hija agregada correctamente.");
            setTipoAlerta("success");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
          }
        } catch (error) {
          console.log(error);
          setMensajeAlerta("Error 1 con la base de datos.");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
        }
      }
    }
  };

  // Quitar hijas
  const quitarHija = async (e) => {
    const listaDBHijas = congloAcciones.relacion.listaDBHijas;
    const hasPermiso = userMaster.permisos.includes("modifiedRelationTMS");
    if (!hasPermiso) {
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const id = e.target.dataset.id;

    // Quitar hija de solicitud madre
    const arrayHijasActualizado = requestMaster.familia.solicitudesHijas.filter(
      (hija, i) => {
        if (id != hija.id) {
          return hija;
        }
      }
    );

    // Quitar madre de solicitud hija
    const solicitudHijaActulizar = listaDBHijas.find((hija) => {
      if (hija.id == id) {
        return hija;
      }
    });

    const batch = writeBatch(db);

    const docRefMadre = doc(db, "transferRequest", requestMaster.id);
    batch.update(docRefMadre, {
      "familia.solicitudesHijas": arrayHijasActualizado,
    });

    const docRefHija = doc(db, "transferRequest", solicitudHijaActulizar.id);
    batch.update(docRefHija, {
      estadoDoc: 0,
      fechaEjecucion: "",
      fechaEjecucionCorta: "",
      "current.fechaDespProg": "",
      "familia.solicitudMadre": null,
    });

    await batch.commit();
  };

  // ************************************* RESET *************************************
  const handleOpcionesReset = (e) => {
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    let index = Number(e.target.dataset.id);
    setCongloAcciones((prevState) => ({
      ...prevState,
      reset: {
        ...prevState.reset,
        opcionesReset: prevState.reset.opcionesReset.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        })),
      },
    }));
  };
  const handleReset = (e) => {
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const { value, name } = e.target;
    setCongloAcciones((prevState) => ({
      ...prevState,
      reset: {
        ...prevState.reset,
        estados: {
          ...prevState.reset.estados,
          [name]: value,
        },
      },
    }));
  };
  const resetEstadoReq = async () => {
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const hasPermiso = userMaster.permisos.includes("defaultStateRequestTMS");
    //
    const justificacion = congloAcciones.reset.estados.justificacion;
    if (justificacion == "") {
      setMensajeAlerta("Favor colocar justificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    if (requestMaster.estadoDoc == 0) {
      setMensajeAlerta("Esta solicitud ya se encuentra en estado a la espera.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == 4) {
      setMensajeAlerta("No puede reiniciar estados de solicitudes anuladas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No puede reiniciar solicitudes en estado borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == 3) {
      setMensajeAlerta("No puede reiniciar solicitudes en estado concluidas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const datoResetEstado = {
      usuario: userMaster.userName,
      fecha: ES6AFormat(new Date()),
      justificacion: justificacion,
    };
    let arrayUp = [];
    if (requestMaster?.reseteos) {
      arrayUp = requestMaster?.reseteos.estados;
      arrayUp.push(datoResetEstado);
    } else {
      arrayUp.push(datoResetEstado);
    }
    resetDatosChange();
    try {
      const batch = writeBatch(db);
      const docActualizar = doc(db, "transferRequest", requestMaster.id);
      batch.update(docActualizar, {
        reseteos: {
          ...requestMaster.reseteos,
          estados: arrayUp,
        },
        // General
        estadoDoc: 0,
        fechaEjecucion: "",
        fechaEjecucionCorta: "",
        "current.fechaDespProg": "",
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

        // Vehiculo
        "datosEntrega.unidadVehicular.descripcion": "",
        "datosEntrega.unidadVehicular.placa": "",
        "datosEntrega.unidadVehicular.code": "",
        // Resetear vehiculos adicionales
        "datosFlete.vehiculosAdicionales":
          requestMaster.datosFlete.vehiculosAdicionales.map((vehiculo) => {
            return {
              ...vehiculo,

              datosEntrega: { ...datosEntregaSchemaVehAdd, status: 0 },
            };
          }),
      });
      // Unifica en un array todos los vehiculos (adicionales y default)
      const vehiculosStatus = [
        ...requestMaster.datosFlete.vehiculosAdicionales,
        {
          datosEntrega: {
            status: requestMaster.estadoDoc,
          },
        },
      ];
      // Verifica si uno de esos vehiculos estaba en ejecucion
      // Esto para saber si se debe actualizar el chofer o no
      // Si uno de esos vehiculos tiene status 2, significa que estaba en ejecucion
      // Por tanto a ese chofer se le debe liberar
      const hasPrevEjecucion = vehiculosStatus.some(
        (vehiculo) => vehiculo.datosEntrega.status == 2
      );
      if (hasPrevEjecucion) {
        const idChoferEjecucion = requestMaster.datosEntrega.chofer.id;
        const idAyudanteEjecucion = requestMaster.datosEntrega.ayudante.id;
        // Primero corrige chofer y ayudante por default si existen
        if (idChoferEjecucion) {
          const choferActualizar = doc(db, "choferes", idChoferEjecucion);
          batch.update(choferActualizar, {
            estadoDoc: 1,
            "current.solicitud": {},
          });
        }
        if (idAyudanteEjecucion) {
          const ayudanteActualizar = doc(db, "choferes", idAyudanteEjecucion);
          batch.update(ayudanteActualizar, {
            estadoDoc: 1,
            "current.solicitud": {},
          });
        } else {
          console.log("sin ayudante");
        }

        // Ahora libera los choferes adicionales
        const arrayVehiculosAdd = requestMaster.datosFlete.vehiculosAdicionales;
        arrayVehiculosAdd.forEach((vehiculo) => {
          if (vehiculo.datosEntrega.chofer.id) {
            const choferActualizar = doc(
              db,
              "choferes",
              vehiculo.datosEntrega.chofer.id
            );
            batch.update(choferActualizar, {
              estadoDoc: 1,
              "current.solicitud": {},
            });
          }
          if (vehiculo.datosEntrega.ayudante.id) {
            const ayudanteActualizar = doc(
              db,
              "choferes",
              vehiculo.datosEntrega.ayudante.id
            );
            batch.update(ayudanteActualizar, {
              estadoDoc: 1,
              "current.solicitud": {},
            });
          }
        });
      }

      await batch.commit();
      setMensajeAlerta("Estado reiniciado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  const resetPagoReq = async () => {
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No es posible para solicitudes en estado de borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    const hasPermiso = userMaster.permisos.includes("defaultPagosTMS");
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    if (requestMaster.estadoDoc != 3) {
      setMensajeAlerta("La solicitud debe estar concluida.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.contabilidad.statusPagoChofer == 3) {
      setMensajeAlerta(
        "No puede reiniciar pagos ya aprobados por contabilidad."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.contabilidad.statusPagoChofer == 6) {
      setMensajeAlerta("No puede reiniciar pagos rechazados por contabilidad.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == 4) {
      setMensajeAlerta("No puede reiniciar pagos de solicitudes anuladas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc == -1) {
      setMensajeAlerta("No puede reiniciar solicitudes en borrador.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    try {
      const docActualizar = doc(db, "transferRequest", requestMaster.id);
      await updateDoc(docActualizar, {
        "contabilidad.statusPagoChofer": 0,
      });
      setMensajeAlerta("Pago reiniciado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ********************************** APROBACIONES *********************************
  // 🟢 Montos adicionales
  const aprobarBorrador = async () => {
    const hasPermiso = userMaster.permisos.includes("approvedPriceChangesAdd");
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc != -1) {
      setMensajeAlerta(
        "Esta funcion es solo para solicitudes en estado de borrador."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    } else {
      const datosMontoUpdate = requestEditable.datosMontos.map(
        (monto, index) => {
          if (monto.origen == 1) {
            return {
              ...monto,
              aprobaciones: {
                ...monto.aprobaciones,
                aprobado: 4,
                aprobadoPor: userMaster.userName,
                fechaAprobacion: ES6AFormat(new Date()),
              },
            };
          }
        }
      );
      try {
        setIsLoading(true);
        const docActualizar = doc(db, "transferRequest", requestMaster.id);
        await updateDoc(docActualizar, {
          estadoDoc: 0,

          datosMontos: requestMaster.datosMontos.map((monto, index) => {
            if (monto.origen == 1) {
              return {
                ...monto,
                aprobaciones: {
                  aprobado: 2,
                  aprobadoPor: userMaster.userName,
                  fechaAprobacion: ES6AFormat(new Date()),
                },
              };
            } else {
              return {
                ...monto,
              };
            }
          }),
        });
        setMensajeAlerta("Montos aprobados correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);

        setIsLoading(false);
      }
    }
  };
  // Aprobar montos agregados
  const rechazarBorrador = async () => {
    const hasPermiso = userMaster.permisos.includes("approvedPriceChangesAdd");
    if (!hasPermiso) {
      setMensajeAlerta("No posee los permisos necesarios.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc != -1) {
      setMensajeAlerta(
        "Esta funcion es solo para solicitudes en estado de borrador."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    } else {
      try {
        setIsLoading(true);
        const docActualizar = doc(db, "transferRequest", requestMaster.id);
        await updateDoc(docActualizar, {
          estadoDoc: 4,
          motivoCancelacion: "Precio rechazado",
        });
        setMensajeAlerta("Montos aprobados correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);

        setIsLoading(false);
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);

        setIsLoading(false);
      }
    }
  };

  // 🟢 Esquemas

  const aprobarAyudanteAdd = async (e) => {
    // Esta funcion sera modificada y cambiada de lugar
    const hasPermiso = userMaster.permisos.includes(
      "approvedAyudanteAdicionales"
    );
    if (!hasPermiso) {
      return;
    }
    // Si la solicitud esta concluida no de permitir
    if (requestMaster.estadoDoc == 3 || requestMaster.estadoDoc == 4) {
      return;
    }

    const nombreDataset = Number(e.target.dataset.nombre);
    const indexAyudante = e.target.dataset.indexayudante;
    const idCamionAdd = e.target.dataset.idcamionadd;
    const nivelDataset = e.target.dataset.nivel;

    // Si es ayudante adicional de vehiculo principal
    if (nivelDataset === "ayudaAddVehPrincipal") {
      let detenerEjecucion = false;
      const ayudantesAddParsed =
        requestEditable.datosFlete.ayudantesAdicionales.map((ayud, index) => {
          // Si el ayudante esta aprobado/rechazado no debe permitir
          if (indexAyudante == index) {
            if (ayud.status === 1 || ayud.status === 2) {
              detenerEjecucion = true;
              return {
                ...ayud,
              };
            }
          }

          return {
            ...ayud,
            status: indexAyudante == index ? nombreDataset : ayud.status,
          };
        });

      if (detenerEjecucion) {
        return;
      }
      const requestEditableUP = {
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,
          ayudantesAdicionales: ayudantesAddParsed,
        },
      };
      setRequestEditable({ ...requestEditableUP });
      try {
        // Si es rechazar, entonces se debe crear un nuevo monto pero sin ese ayudante adicional como elemento
        let nuevoMonto = undefined;
        if (nombreDataset == 2) {
          nuevoMonto = GenerarMonto({
            datosFlete: requestEditableUP.datosFlete,
            origen: 4,
            userMaster: userMaster,
          });
        }

        const montosUp = [...requestMaster.datosMontos, nuevoMonto];
        const batch = writeBatch(db);
        const docActualizar = doc(db, "transferRequest", requestMaster.id);
        //
        batch.update(docActualizar, {
          "datosFlete.ayudantesAdicionales": ayudantesAddParsed,
          datosMontos: nuevoMonto ? montosUp : requestMaster.datosMontos,
        });

        await batch.commit();
        setMensajeAlerta("Cambios guardados.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    } else if (nivelDataset === "ayudaAddVehAdd") {
      let detenerEjecucion = false;
      const vehiculoAdicionalParsed =
        requestEditable.datosFlete.vehiculosAdicionales.map(
          (vehiAdd, index) => {
            if (vehiAdd.idCamionComoElemento == idCamionAdd) {
              const ayudantesAddParsed = vehiAdd.ayudantesAdicionales.map(
                (ayuAdd, i) => {
                  // Si el ayudante esta aprobado/rechazado no debe permitir
                  if (indexAyudante == i) {
                    if (ayuAdd.status === 1 || ayuAdd.status === 2) {
                      detenerEjecucion = true;
                      return {
                        ...ayuAdd,
                      };
                    }
                  }

                  console.log(vehiAdd.ayudantesAdicionales);
                  console.log(indexAyudante);
                  console.log(i);
                  return {
                    ...ayuAdd,
                    status:
                      indexAyudante == i
                        ? Number(nombreDataset)
                        : ayuAdd.status,
                  };
                }
              );

              return {
                ...vehiAdd,
                ayudantesAdicionales: ayudantesAddParsed,
              };
            } else {
              return { ...vehiAdd };
            }
          }
        );

      if (detenerEjecucion) {
        return;
      }
      const requestEditableUP = {
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,
          vehiculosAdicionales: vehiculoAdicionalParsed,
        },
      };
      setRequestEditable({ ...requestEditableUP });
      try {
        // Si es rechazar, entonces se debe crear un nuevo monto pero sin ese ayudante adicional como elemento
        let nuevoMonto = undefined;
        if (nombreDataset == 2) {
          nuevoMonto = GenerarMonto({
            datosFlete: requestEditableUP.datosFlete,
            origen: 4,
            userMaster: userMaster,
          });
        }

        const montosUp = [...requestMaster.datosMontos, nuevoMonto];

        const batch = writeBatch(db);
        const docActualizar = doc(db, "transferRequest", requestMaster.id);
        batch.update(docActualizar, {
          "datosFlete.vehiculosAdicionales": vehiculoAdicionalParsed,
          datosMontos: nuevoMonto ? montosUp : requestMaster.datosMontos,
        });
        await batch.commit();
        setMensajeAlerta("Cambios guardados.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
  };

  // ********************************* ESQUEMAS *********************************
  const [listaAyudantesAdicionales, setListaAyudantesAdicionales] = useState(
    []
  );

  const addAyudante = (e) => {
    // Si la solicitud esta concluida no de permitir
    if (requestMaster.estadoDoc == 3) {
      return;
    }
    const { name } = e.target;

    const ayudantesAddAux =
      requestEditable.datosFlete.ayudantesAdicionales || [];

    const ayudanteConInput = {
      ...ayudanteAddInRequest,
      datosAyudante: {
        ...ayudanteAddInRequest.datosAyudante,
        valueInput: "",
      },
    };
    const ayudanteComoElementoID = {
      ...ayudanteConInput,
      idAyudanteAddComoElemento: generarUUID(),
    };
    if (name == "add") {
      setRequestEditable((req) => ({
        ...req,
        datosFlete: {
          ...req.datosFlete,
          ayudantesAdicionales: [...ayudantesAddAux, ayudanteComoElementoID],
        },
      }));
    } else if (name == "minus") {
      setRequestEditable((req) => ({
        ...req,
        datosFlete: {
          ...req.datosFlete,
          ayudantesAdicionales: ayudantesAddAux.slice(0, -1),
        },
      }));
    }
  };

  const addAyudanteVehiAdd = (e) => {
    // Si la solicitud esta concluida no de permitir
    if (requestMaster.estadoDoc == 3) {
      return;
    }
    const { name } = e.target;
    const indexDataset = e.target.dataset.index;

    const ayudantesAddAux =
      requestEditable.datosFlete.vehiculosAdicionales[indexDataset]
        .ayudantesAdicionales || [];
    //
    const ayudanteConInput = {
      ...ayudanteAddInRequest,
      datosAyudante: {
        ...ayudanteAddInRequest.datosAyudante,
        valueInput: "",
      },
    };
    const ayudanteComoElementoID = {
      ...ayudanteConInput,
      idAyudanteAddComoElemento: generarUUID(),
    };
    if (name == "add") {
      const newAux = {
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,
          vehiculosAdicionales:
            requestEditable.datosFlete.vehiculosAdicionales.map(
              (vehiculo, index) => {
                if (indexDataset == index) {
                  return {
                    ...vehiculo,
                    ayudantesAdicionales: [
                      ...ayudantesAddAux,
                      ayudanteComoElementoID,
                    ],
                  };
                } else {
                  return { ...vehiculo };
                }
              }
            ),
        },
      };
      setRequestEditable({ ...newAux });
    } else if (name == "minus") {
      const newAux = {
        ...requestEditable,
        datosFlete: {
          ...requestEditable.datosFlete,
          vehiculosAdicionales:
            requestEditable.datosFlete.vehiculosAdicionales.map(
              (vehiculo, index) => {
                if (indexDataset == index) {
                  return {
                    ...vehiculo,
                    ayudantesAdicionales: ayudantesAddAux.slice(0, -1),
                  };
                } else {
                  return { ...vehiculo };
                }
              }
            ),
        },
      };
      setRequestEditable({ ...newAux });
    }
  };
  const handleInputEsquema = (e) => {
    const { name, value } = e.target;
    const indexDataset = e.target.dataset.index;

    // Si la solicitud esta concluida no de permitir
    if (requestMaster.estadoDoc == 3) {
      return;
    }
    // Encontramos el ayudante tecleado si existe
    const ayudanteFind = listaAyudantesAdicionales.find((ayuAdd) => {
      const nombreParsed = ayuAdd.nombre + " " + ayuAdd.apellido;
      if (nombreParsed == value) {
        return ayuAdd;
      }
    });

    setRequestEditable((prevState) => ({
      ...prevState,
      datosFlete: {
        ...prevState.datosFlete,
        ayudantesAdicionales:
          requestEditable.datosFlete.ayudantesAdicionales.map(
            (ayudante, index) => {
              if (index == indexDataset) {
                if (name == "datosAyudante") {
                  let costoParsed = ayudante.costo;

                  // 75 ayudante
                  if (ayudanteFind) {
                    // Si el ayudante es interno, el costo sera igual al incentivo que se le paga a los ayudantes segun el camion
                    if (ayudanteFind.tipo == 0) {
                      costoParsed =
                        requestEditable.datosFlete.vehiculoSeleccionado
                          .viajesInterno.montoAyudante;
                    }
                  }
                  return {
                    ...ayudante,
                    costo: costoParsed,
                    datosAyudante: {
                      ...ayudante.datosAyudante,
                      valueInput: value,
                      tipo: ayudanteFind
                        ? ayudanteFind.tipo
                        : ayudante.datosAyudante.tipo,
                    },
                  };
                } else {
                  return {
                    ...ayudante,
                    [name]:
                      name == "costo"
                        ? soloNumeros(value)
                          ? Number(value)
                          : ayudante.costo
                        : value,
                  };
                }
              } else {
                return { ...ayudante };
              }
            }
          ),
      },
    }));
  };
  const handleInputEsquemaVehicuAdd = (e) => {
    const { name, value } = e.target;
    const indexVehiculo = e.target.dataset.indexvehiculo;
    const indexAyudante = e.target.dataset.indexayudante;
    // Si la solicitud esta concluida no de permitir
    if (requestMaster.estadoDoc == 3) {
      return;
    }
    // Encontramos el ayudante tecleado si existe
    const ayudanteFind = listaAyudantesAdicionales.find((ayuAdd) => {
      const nombreParsed = ayuAdd.nombre + " " + ayuAdd.apellido;
      if (nombreParsed == value) {
        return ayuAdd;
      }
    });

    setRequestEditable((prevState) => ({
      ...prevState,
      datosFlete: {
        ...prevState.datosFlete,
        vehiculosAdicionales: prevState.datosFlete.vehiculosAdicionales.map(
          (vehiculo, index) => {
            if (index == indexVehiculo) {
              return {
                ...vehiculo,
                ayudantesAdicionales: vehiculo.ayudantesAdicionales.map(
                  (ayudante, index) => {
                    if (index == indexAyudante) {
                      if (name == "datosAyudante") {
                        let costoParsed = ayudante.costo;

                        if (ayudanteFind) {
                          // 76 ayudante
                          // Si el ayudante es interno, el costo sera igual al incentivo que se le paga a los ayudantes segun el camion

                          if (ayudanteFind.tipo == 0) {
                            costoParsed = vehiculo.viajesInterno.montoAyudante;
                          }
                        }
                        return {
                          ...ayudante,
                          costo: costoParsed,
                          datosAyudante: {
                            ...ayudante.datosAyudante,
                            valueInput: value,
                            tipo: ayudanteFind
                              ? ayudanteFind.tipo
                              : ayudante.datosAyudante.tipo,
                          },
                        };
                      } else {
                        return {
                          ...ayudante,
                          [name]:
                            name == "costo"
                              ? soloNumeros(value)
                                ? Number(value)
                                : ayudante.costo
                              : value,
                        };
                      }
                    } else {
                      return { ...ayudante };
                    }
                  }
                ),
              };
            } else {
              return { ...vehiculo };
            }
          }
        ),
      },
    }));
  };

  const guardarEsquemas = async (e) => {
    // Permisos
    const hasPermisoAudit = userMaster.permisos.includes(
      "auditAyudanteEsquemas"
    );

    if (!hasPermisoAudit) {
      return;
    }
    // Solo permitir si la solicitud esta a la espera o planificada
    if (requestMaster.estadoDoc != 0 && requestMaster.estadoDoc != 1) {
      setMensajeAlerta(
        "Solo se permite agregar ayudantes adicionales a solicitudes en estado a la espera o en planificacion."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si alguna fila no esta completa del vehiculos master
    let detenerEjecucion0 = false;
    let ayudanteEncontrado = true;

    const ayudAddParsed = requestEditable.datosFlete.ayudantesAdicionales?.map(
      (ayudante) => {
        if (
          ayudante.nombre == "" ||
          ayudante.costo == "" ||
          ayudante.obs == ""
        ) {
          detenerEjecucion0 = true;
        }
        // console.log(listaAyudantesAdicionales);
        const ayudanteFind = listaAyudantesAdicionales.find((ayudaAdd) => {
          let nombreParsed = ayudaAdd.nombre;
          if (ayudaAdd.apellido) {
            nombreParsed = nombreParsed + " " + ayudaAdd.apellido;
          }

          if (nombreParsed == ayudante.datosAyudante.valueInput) {
            return ayudaAdd;
          }
        });

        if (!ayudanteFind) {
          ayudanteEncontrado = false;
        }

        return {
          ...ayudante,
          datosAyudante: ayudanteFind ? ayudanteFind : ayudante.datosAyudante,
        };
      }
    );
    // HUbo campos vacios
    if (detenerEjecucion0) {
      setMensajeAlerta("Completar todos los campos correctamente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Se escribio un ayudante manualmente
    if (!ayudanteEncontrado) {
      setMensajeAlerta("Seleccionar ayudante de la lista disponible.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Si coloco el mismo ayudante mas de una vez
    let ayudanteRepedito = false;
    const ayudanteSet = new Set();

    ayudAddParsed.forEach((ayu) => {
      // Si el ayudante esta rechazado entonces no importa agregar otro
      //  Si el ayudante es generico tampoco importa agregar varios
      if (ayu.status != 2 && !ayu.datosAyudante.isGenerico) {
        const nombreCompleto =
          ayu.datosAyudante.nombre + " " + ayu.datosAyudante.apellido;
        if (ayudanteSet.has(nombreCompleto)) {
          ayudanteRepedito = true;
        }
        ayudanteSet.add(nombreCompleto);
      }
    });
    if (ayudanteRepedito) {
      setMensajeAlerta("Ayudante repetido.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const docActualizar = doc(db, "transferRequest", requestMaster.id);
    const ayudanAddUp = ayudAddParsed?.map((ayudante) => {
      if (!ayudante.createdAt) {
        return {
          ...ayudante,
          createdAt: ES6AFormat(new Date()),
          createdBy: userMaster.userName,
        };
      } else {
        return {
          ...ayudante,
        };
      }
    });

    const datosFleteUp = {
      ...requestMaster.datosFlete,
      ayudantesAdicionales: ayudanAddUp,
    };
    const nuevoMonto = GenerarMonto({
      datosFlete: datosFleteUp,
      origen: 4,
      userMaster: userMaster,
    });
    const datosUp = {
      ...requestMaster,
      datosFlete: datosFleteUp,
      datosMontos: [...requestEditable.datosMontos, nuevoMonto],
    };

    setRequestEditable({ ...datosUp });
    try {
      await updateDoc(docActualizar, {
        "datosFlete.ayudantesAdicionales":
          datosUp.datosFlete.ayudantesAdicionales,
        datosMontos: datosUp.datosMontos,
      });

      setCongloAcciones({ ...initialCongloAcciones });
      setMensajeAlerta("Cambios guardados.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
  };
  const guardarEsquemasVehAdd = async (e) => {
    // Permisos
    const indexVehiculo = Number(e.target.dataset.indexvehiculo);
    const hasPermisoAudit = userMaster.permisos.includes(
      "auditAyudanteEsquemas"
    );

    if (!hasPermisoAudit) {
      return;
    }
    // Solo permitir si la solicitud esta a la espera o planificada
    if (requestMaster.estadoDoc != 0 && requestMaster.estadoDoc != 1) {
      setMensajeAlerta(
        "Solo se permite agregar ayudantes adicionales a solicitudes en estado a la espera o en planificacion."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    let detenerEjecucion0 = false;
    let ayudanteEncontrado = true;
    let ayudanteRepedito = false;
    const vehiculoAddParsed =
      requestEditable.datosFlete.vehiculosAdicionales.map((vehi, index) => {
        if (index == indexVehiculo) {
          const ayudAddParsed = vehi.ayudantesAdicionales.map((ayudante) => {
            if (
              ayudante.nombre == "" ||
              ayudante.costo == "" ||
              ayudante.obs == ""
            ) {
              detenerEjecucion0 = true;
            }

            const ayudanteFind = listaAyudantesAdicionales.find((ayudaAdd) => {
              let nombreParsed = ayudaAdd.nombre;
              if (ayudaAdd.apellido) {
                nombreParsed = nombreParsed + " " + ayudaAdd.apellido;
              }

              if (nombreParsed == ayudante.datosAyudante.valueInput) {
                return ayudaAdd;
              }
            });

            if (!ayudanteFind) {
              ayudanteEncontrado = false;
            }

            return {
              ...ayudante,
              datosAyudante: ayudanteFind
                ? ayudanteFind
                : ayudante.datosAyudante,
            };
          });
          const ayudanteSet = new Set();

          ayudAddParsed.forEach((ayu) => {
            // Si el ayudante esta rechazado entonces no importa agregar otro
            //  Si el ayudante es generico tampoco importa agregar varios
            if (ayu.status != 2 && !ayu.datosAyudante.isGenerico) {
              const nombreCompleto =
                ayu.datosAyudante.nombre + " " + ayu.datosAyudante.apellido;
              if (ayudanteSet.has(nombreCompleto)) {
                ayudanteRepedito = true;
                console.log(nombreCompleto);
              }
              ayudanteSet.add(nombreCompleto);
            }
          });
          console.log(ayudAddParsed);

          return {
            ...vehi,
            ayudantesAdicionales: ayudAddParsed,
          };
        } else {
          return { ...vehi };
        }
      });

    // Si dejo algun campo vacio
    if (detenerEjecucion0) {
      setMensajeAlerta("Completar todos los campos correctamente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Si escribio nombre de ayudante manualmente
    if (!ayudanteEncontrado) {
      setMensajeAlerta("Seleccionar ayudante de la lista disponible.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Si coloco el mismo ayudante mas de una vez
    if (ayudanteRepedito) {
      setMensajeAlerta("Ayudante repetido.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const docActualizar = doc(db, "transferRequest", requestMaster.id);
    const vehiAddup = vehiculoAddParsed?.map((vehiAdd) => {
      return {
        ...vehiAdd,
        ayudantesAdicionales: vehiAdd.ayudantesAdicionales.map((ayudante) => {
          if (!ayudante.createdAt) {
            return {
              ...ayudante,
              createdAt: ES6AFormat(new Date()),
              createdBy: userMaster.userName,
            };
          } else {
            return {
              ...ayudante,
            };
          }
        }),
      };
    });

    const datosFleteUp = {
      ...requestMaster.datosFlete,
      vehiculosAdicionales: vehiAddup,
    };

    const nuevoMonto = GenerarMonto({
      datosFlete: datosFleteUp,
      origen: 4,
      userMaster: userMaster,
    });

    const datosUp = {
      ...requestMaster,
      datosFlete: datosFleteUp,
      datosMontos: [...requestEditable.datosMontos, nuevoMonto],
    };
    setRequestEditable({ ...datosUp });

    console.log(datosUp.datosMontos);
    try {
      await updateDoc(docActualizar, {
        "datosFlete.vehiculosAdicionales":
          datosUp.datosFlete.vehiculosAdicionales,
        datosMontos: datosUp.datosMontos,
      });

      setCongloAcciones({ ...initialCongloAcciones });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
  };
  //
  // ********************************* OBSERVACIONES *********************************
  const [inputObs, setInputObs] = useState("");
  const handleInputObs = (e) => {
    const { value, name } = e.target;
    if (name == "observaciones") {
      setInputObs(value);
    }
  };
  const agregarObs = async () => {
    if (inputObs == "") {
      setMensajeAlerta("Por favor indique sus observaciones.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const nuevaObser = {
      usuario: {
        nombre: userMaster.nombre,
        apellido: userMaster.apellido,
        idUsuario: userMaster.id,
        urlFotoPerfil: userMaster.urlFotoPerfil,
        userName: userMaster.userName,
      },
      texto: inputObs,
      fecha: ES6AFormat(new Date()),
    };
    resetDatosChange("obs");
    try {
      const docActualizar = doc(db, "transferRequest", requestMaster.id);
      await updateDoc(docActualizar, {
        observaciones: [...requestMaster.observaciones, nuevaObser],
      });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // **************************** COPIAR PLANTILLA *******************************
  const copiarPlantilla = async () => {
    if (usuario) {
      try {
        const usuarioAfectar = doc(db, "usuarios", userMaster.id);
        let plantillas = userMaster.plantillas
          ? userMaster.plantillas
          : {
              solicitudTransporte: [],
            };
        const hasThisReq = plantillas.solicitudTransporte.some(
          (req) => req.numero === requestMaster.numeroDoc
        );

        if (hasThisReq) {
          setMensajeAlerta("Ya has copiado esta plantilla.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return "";
        }
        if (requestMaster.tipo > 0) {
          setMensajeAlerta(
            "Solo se permite copiar solicitudes de tipo Entrega."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return "";
        }

        await updateDoc(usuarioAfectar, {
          plantillas: {
            ...plantillas,
            solicitudTransporte: [
              ...plantillas.solicitudTransporte,
              {
                id: requestMaster.id,
                tipo: requestMaster.tipo,
                numero: requestMaster.numeroDoc,
                cliente: requestMaster.datosReq.socioNegocio,
                fechaAdd: ES6AFormat(new Date()),
              },
            ],
          },
        });
        setMensajeAlerta("Plantilla copiada.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
  };
  // ******************************* MAS INFO *******************************
  // No es necesario crear codigo para esto,
  // dado que mas info solo muestra informacion, es decir no se afecta base de datos ni nada,
  // solo se muestran los datos
  //
  // ********************************* RESEÑAS *********************************
  useEffect(() => {
    if (requestMaster?.id) {
      useDocByIdDangerous2(
        "reviewClientes",
        setReviewClienteMaster,
        requestMaster?.id
      );
    }
  }, [requestMaster?.id]);
  //
  useEffect(() => {
    if (reviewClienteMaster) {
      setTextoReviewVentas(
        requestMaster.calificaciones.resenniaVentas.comentarios
      );
      if (requestMaster.calificaciones.resenniaVentas.comentarios == "") {
        setAddResenniaVentas(true);
      }
    }
  }, [reviewClienteMaster]);

  const [textoReviewVentas, setTextoReviewVentas] = useState("");
  const [addResenniaVentas, setAddResenniaVentas] = useState(false);

  const handleResennia = (e) => {
    const { value, name } = e.target;
    if (name == "textoVentas") {
      setTextoReviewVentas(value);
    }
  };
  const guardarResennia = async (e) => {
    if (requestMaster.calificaciones.resenniaVentas.puntuacion == 0) {
      setMensajeAlerta("Primero seleccione una de las estrellas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (requestMaster.estadoDoc != 3) {
      setMensajeAlerta(
        "Solo puedes guardar reseñas de solicitudes completadas."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const { value, name } = e.target;

    if (name == "btnVentas") {
      if (textoReviewVentas == "") {
        setMensajeAlerta("Favor indicar reseña.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      setAddResenniaVentas(false);
      try {
        const docActualizar = doc(db, "transferRequest", requestMaster.id);
        updateDoc(docActualizar, {
          "calificaciones.resenniaVentas": {
            ...requestMaster.calificaciones.resenniaVentas,
            comentarios: textoReviewVentas,
            fechaComentarios: ES6AFormat(new Date()),
          },
        });
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    } else if (name == "btnCliente") {
    }
  };
  const editarResennia = (e) => {
    const { value, name } = e.target;
    if (name == "btnVentas") {
      setAddResenniaVentas(true);
    }
  };
  const cancelarResenia = (e) => {
    setAddResenniaVentas(false);
    setTextoReviewVentas(
      requestMaster.calificaciones.resenniaVentas.comentarios
    );
  };
  const copiarLink = async () => {
    if (requestMaster.datosSolicitante.idSolicitante != userMaster.id) {
      return;
    }

    // Primero validar si la reseña existe y si no existe crearla
    // Despues copiar el link
    // Anteriormente se creaba la solicitud automatico cuando se enviada la solicitud
    // Esto es ineficiente, pues la mayoria de de reseñas el cliente no va calificar
    const reviewBuscar = await obtenerDocPorId2(
      "reviewClientes",
      requestMaster.id
    );
    if (!reviewBuscar) {
      const docRefCrear = doc(
        collection(db, "reviewClientes"),
        requestMaster.id
      );

      const docSubir = {
        ...reviewClientesSchema,
        createdAt: ES6AFormat(new Date()),
        createdBy: userMaster.userName,
        puntuacion: 0,
        numeroSolicitud: requestMaster.numeroDoc,
        cliente: requestMaster.datosReq.socioNegocio,
      };
      await setDoc(docRefCrear, docSubir);
    }

    const link = `www.caeloss.com/transportes/resennias/${requestMaster.id}`;
    navigator.clipboard.writeText(link);
    setMensajeAlerta("Enlace copiado.");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };

  return (
    <Container>
      <BotonQuery
        requestMaster={requestMaster}
        requestEditable={requestEditable}
        userMaster={userMaster}
        congloAcciones={congloAcciones}
      />

      {datosParsed && hasData == 1 && (
        <>
          {/* 787878 */}
          <Seccion className="horizontal ">
            <CajaDetalles className="cajaIzquierda">
              <Detalle1Wrap>
                <Detalle2Titulo>Numero:</Detalle2Titulo>
                <Detalle3OutPut> {requestMaster?.numeroDoc}</Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap className="mobil400Vertical">
                <Detalle2Titulo className="mobil400Vertical">
                  Socio de negocio:
                </Detalle2Titulo>
                <Detalle3OutPut
                  className="mobil400Vertical"
                  title={
                    requestMaster.tipo == 1
                      ? requestMaster?.datosReq?.tipoTraslado[0]?.select == true
                        ? "Suc. " +
                            requestMaster.datosFlete.provinciaSeleccionada
                              .municipioSeleccionado.nombreSucursal || ""
                        : requestMaster.datosReq.socioNegocio
                      : requestMaster.datosReq.socioNegocio
                  }
                >
                  {requestMaster.tipo == 1
                    ? requestMaster?.datosReq?.tipoTraslado[0]?.select == true
                      ? "Suc. " +
                          requestMaster.datosFlete.provinciaSeleccionada
                            .municipioSeleccionado.nombreSucursal || ""
                      : requestMaster.datosReq.socioNegocio
                    : requestMaster.datosReq.socioNegocio}
                </Detalle3OutPut>
              </Detalle1Wrap>

              <Detalle1Wrap>
                <Detalle2Titulo>Tipo:</Detalle2Titulo>
                <Detalle3OutPut>
                  {" "}
                  {requestMaster?.tipo == 0
                    ? "Entrega"
                    : requestMaster?.tipo == 1
                      ? `Traslado ${requestMaster.familia.parentesco == 0 ? " - Madre" : requestMaster.familia.parentesco == 1 ? " - Hija" : ""}`
                      : requestMaster?.tipo == 2
                        ? "Retiro en obra"
                        : requestMaster?.tipo == 3
                          ? "Retiro a proveedor"
                          : requestMaster?.tipo}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Dpto:</Detalle2Titulo>
                <Detalle3OutPut title={requestMaster?.datosSolicitante?.dpto}>
                  {requestMaster?.datosSolicitante?.dpto}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>N° proyecto:</Detalle2Titulo>
                <Detalle3OutPut>
                  {requestMaster?.datosReq?.numeroProyecto}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap className="mobil400Vertical">
                <Detalle2Titulo className="mobil400Vertical">
                  Fecha solicitud:
                </Detalle2Titulo>
                <Detalle3OutPut className="mobil400Vertical">
                  {requestMaster?.fechaReq.slice(0, 16) +
                    " " +
                    requestMaster?.fechaReq.slice(-2)}
                </Detalle3OutPut>
              </Detalle1Wrap>

              <Detalle1Wrap className="mobil400Vertical">
                <Detalle2Titulo className="mobil400Vertical">
                  Fecha ejecucion:
                </Detalle2Titulo>
                <Detalle3OutPut className="mobil400Vertical">
                  {requestMaster?.fechaEjecucion.slice(0, 16) +
                    " " +
                    requestMaster?.fechaEjecucion.slice(-2)}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap className="mobil400Vertical">
                <Detalle2Titulo className="mobil400Vertical">
                  Fecha Conclusión:
                </Detalle2Titulo>
                <Detalle3OutPut className="mobil400Vertical">
                  {requestMaster?.fechaConclucion.slice(0, 16) +
                    " " +
                    requestMaster?.fechaConclucion.slice(-2)}
                </Detalle3OutPut>
              </Detalle1Wrap>
            </CajaDetalles>

            <CajaDetalles
              className={`
                    cajaDerecha cajaStatus
                    ${Theme.config.modoClear ? "clearModern" : ""}
                    `}
            >
              <CajaTopStatus
                className={
                  StyleTextStateReq.find(
                    (state, index) => state.numero == requestMaster.estadoDoc
                  )?.codigo || "default"
                }
              >
                <TextoStatus>
                  {StyleTextStateReq.find(
                    (state, index) => state.numero == requestMaster.estadoDoc
                  )?.texto || "default"}

                  {requestMaster.estadoDoc == 1
                    ? " - " +
                      hoyManniana(
                        requestMaster.current.fechaDespProg.slice(0, 10)
                      )
                    : ""}
                </TextoStatus>
              </CajaTopStatus>
              <CajaPerfiles>
                <CajaInterna>
                  <EnlacesPerfil
                    target="_blank"
                    to={`/perfiles/${requestMaster.datosSolicitante.userName}`}
                  >
                    <NombreTexto className="titulo">Solicitante:</NombreTexto>
                    <CajaFotoMain>
                      <AvatarPerfil
                        className={`
                      ${requestMaster?.datosSolicitante?.genero}
                      ${requestMaster.estadoDoc == 4 ? " inactivo " : ""}
                      small
                      `}
                        src={
                          requestMaster.datosSolicitante?.urlFotoPerfil
                            ? requestMaster.datosSolicitante?.urlFotoPerfil
                            : requestMaster.datosSolicitante.genero ==
                                "femenino"
                              ? AvatarFemale
                              : AvatarMale
                        }
                      />
                    </CajaFotoMain>
                    <CajaNombre>
                      <NombreTexto className="nombreMain">
                        {extraerPrimerNombreApellido(
                          requestMaster.datosSolicitante?.nombre,
                          requestMaster.datosSolicitante?.apellido
                        )}
                      </NombreTexto>
                    </CajaNombre>
                  </EnlacesPerfil>
                </CajaInterna>
                <CajaInterna>
                  <EnlacesPerfil
                    target={
                      requestMaster?.datosEntrega?.chofer.numeroDoc && "_blank"
                    }
                    to={
                      requestMaster?.datosEntrega?.chofer.numeroDoc
                        ? `/transportes/maestros/choferes/${requestMaster?.datosEntrega?.chofer.numeroDoc}
                      `
                        : "#"
                    }
                    className={
                      !requestMaster?.datosEntrega?.chofer.numeroDoc && "static"
                    }
                  >
                    {requestMaster.familia.parentesco != 1 ? (
                      <>
                        <NombreTexto className="titulo">Chofer:</NombreTexto>
                        <CajaFotoMain>
                          <AvatarPerfil
                            className={`
                          ${requestMaster.estadoDoc == 4 ? "inactivo " : ""}
                          small
                          masculino
                          `}
                            src={
                              requestMaster?.datosEntrega?.chofer
                                ?.urlFotoPerfil || AvatarMale
                            }
                          />
                        </CajaFotoMain>
                        <CajaNombre>
                          <NombreTexto className="nombreMain">
                            {extraerPrimerNombreApellido(
                              requestMaster?.datosEntrega?.chofer.nombre,
                              requestMaster?.datosEntrega?.chofer.apellido
                            )}
                          </NombreTexto>
                        </CajaNombre>
                      </>
                    ) : requestMaster.familia.parentesco == 1 ? (
                      <TituloHija className="titulo">
                        Solicitud hija.
                      </TituloHija>
                    ) : (
                      ""
                    )}
                  </EnlacesPerfil>
                </CajaInterna>
              </CajaPerfiles>
            </CajaDetalles>
          </Seccion>
          <ControlesDoc
            titulo={"Detalles solicitud de transporte:"}
            controles={controles}
            tipo="solicitud"
            handleControles={handleControles}
            requestMaster={requestMaster}
          />
          <TituloModulo>Datos Flete:</TituloModulo>

          <Seccion className="horizontal vehiculo">
            <CajaVehiculoDefault>
              <CajaInternaFlete className="izquierda">
                <ImgSimple
                  src={requestMaster.datosFlete?.vehiculoSeleccionado.urlFoto}
                />
                <TextoCamion>
                  {requestMaster.datosFlete?.vehiculoSeleccionado.descripcion}
                </TextoCamion>
              </CajaInternaFlete>
              <CajaInternaFlete className="derecha">
                <Detalle1Wrap>
                  <Detalle2Titulo>Punto de partida:</Detalle2Titulo>
                  <Detalle3OutPut>
                    {requestMaster.datosFlete?.puntoPartidaSeleccionado?.nombre}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Destino:</Detalle2Titulo>
                  <Detalle3OutPut
                    title={
                      requestMaster.datosFlete?.provinciaSeleccionada
                        ?.municipioSeleccionado.label +
                      " - " +
                      requestMaster.datosFlete?.provinciaSeleccionada?.label
                    }
                  >
                    {requestMaster.datosFlete?.provinciaSeleccionada
                      ?.municipioSeleccionado.label + " - "}
                    {requestMaster.datosFlete?.provinciaSeleccionada?.label}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Distancia:</Detalle2Titulo>
                  <Detalle3OutPut>
                    {requestMaster.datosFlete.distancia}

                    {" KM"}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Vista mapa*:</Detalle2Titulo>
                  <Detalle3OutPut>
                    <ButtonEmoji onClick={() => setHasMapa(true)}>
                      Ver mapa 👁️
                    </ButtonEmoji>
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Costo:</Detalle2Titulo>
                  <Detalle3OutPut>
                    {formatoDOP(requestMaster.datosFlete?.costo)}
                    {/* {requestMaster.datosFlete?.vehiculosAdicionales &&
                    requestMaster.datosFlete?.vehiculosAdicionales?.length > 0
                      ? formatoDOP(
                          requestMaster.datosFlete?.costo +
                            requestMaster.datosFlete?.vehiculosAdicionales?.reduce(
                              (acumulador, valorActual) => {
                                return acumulador + valorActual.resultado.costo;
                              },
                              0
                            )
                        )
                      : formatoDOP(requestMaster.datosFlete?.costo)} */}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Precio:</Detalle2Titulo>
                  <Detalle3OutPut>
                    {formatoDOP(requestMaster.datosFlete?.precio)}
                    {/* {requestMaster.datosFlete?.vehiculosAdicionales &&
                    requestMaster.datosFlete?.vehiculosAdicionales?.length > 0
                      ? formatoDOP(
                          requestMaster.datosFlete?.precio +
                            requestMaster.datosFlete?.vehiculosAdicionales?.reduce(
                              (acumulador, valorActual) => {
                                return (
                                  acumulador + valorActual.resultado.precio
                                );
                              },
                              0
                            )
                        )
                      : formatoDOP(requestMaster.datosFlete?.precio)} */}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap className="mobil400Vertical">
                  <Detalle2Titulo className="mobil400Vertical">
                    Ayudante:
                  </Detalle2Titulo>
                  <Detalle3OutPut className="mobil400Vertical">
                    <Enlaces
                      target="_blank"
                      to={`/transportes/maestros/choferes/${requestMaster.datosEntrega.ayudante.numeroDoc}`}
                    >
                      {requestMaster.datosEntrega.ayudante.nombre +
                        " " +
                        requestMaster.datosEntrega.ayudante.apellido}
                    </Enlaces>
                  </Detalle3OutPut>
                </Detalle1Wrap>
                {requestMaster.datosFlete?.ayudantesAdicionales &&
                  requestMaster.datosFlete?.ayudantesAdicionales?.length >
                    0 && (
                    <Detalle1Wrap className="vertical">
                      <Detalle2Titulo className="vertical">
                        Ayudantes adicionales:
                      </Detalle2Titulo>

                      <CajaTablaGroup2>
                        <TablaGroup>
                          <thead>
                            <FilasGroup>
                              <CeldaHeadGroup>N°</CeldaHeadGroup>
                              <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                              <CeldaHeadGroup>Monto</CeldaHeadGroup>
                              <CeldaHeadGroup>Obs</CeldaHeadGroup>
                              <CeldaHeadGroup>Status</CeldaHeadGroup>
                            </FilasGroup>
                          </thead>
                          <tbody>
                            {requestMaster.datosFlete?.ayudantesAdicionales &&
                            requestMaster.datosFlete?.ayudantesAdicionales
                              ?.length > 0
                              ? requestMaster.datosFlete?.ayudantesAdicionales.map(
                                  (ayudante, index) => {
                                    return (
                                      <FilasGroup
                                        key={index}
                                        className={`body ${index % 2 ? "impar" : "par"}`}
                                      >
                                        <CeldasBodyGroup>
                                          {index + 1}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup className="startText">
                                          {ayudante.datosAyudante.nombre +
                                            " " +
                                            ayudante.datosAyudante.apellido}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup>
                                          {ayudante.costo}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup>
                                          {ayudante.obs}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup>
                                          {parsedStatusAyudAdd(ayudante.status)}
                                        </CeldasBodyGroup>
                                      </FilasGroup>
                                    );
                                  }
                                )
                              : ""}
                          </tbody>
                        </TablaGroup>
                      </CajaTablaGroup2>
                    </Detalle1Wrap>
                  )}
              </CajaInternaFlete>
            </CajaVehiculoDefault>
            {requestMaster.datosFlete?.vehiculosAdicionales?.length > 0 && (
              <ContenedorVA>
                <TituloVA>Vehiculos adicionales</TituloVA>
                <CajaInternalVAdd>
                  {requestMaster.datosFlete.vehiculosAdicionales.map(
                    (vehi, index) => {
                      return (
                        <WrapAddVA key={index}>
                          <CajaTopStatus
                            className={
                              StyleTextStateReq.find(
                                (state, index) =>
                                  state.numero == vehi.datosEntrega.status
                              )?.codigo || "default"
                            }
                          >
                            <TextoStatus>
                              {StyleTextStateReq.find(
                                (state, index) =>
                                  state.numero == vehi.datosEntrega.status
                              )?.texto || "default"}

                              {requestMaster.estadoDoc == 1
                                ? " - " +
                                  hoyManniana(
                                    requestMaster.current.fechaDespProg.slice(
                                      0,
                                      10
                                    )
                                  )
                                : ""}
                            </TextoStatus>
                          </CajaTopStatus>
                          <CajaTopVA>
                            <CajaIzqDerVA>
                              <ImgVA src={vehi.urlFoto} />
                              <TituloTexVA>{vehi.descripcion}</TituloTexVA>
                            </CajaIzqDerVA>

                            <CajaIzqDerVA>
                              <ImgVA
                                className="chofer"
                                src={
                                  vehi.datosEntrega?.chofer?.urlFotoPerfil ||
                                  AvatarMale
                                }
                              />
                              {vehi.datosEntrega?.chofer?.nombre && (
                                <TituloTexVA>
                                  <Enlaces
                                    target="_blank"
                                    to={`/transportes/maestros/choferes/${vehi.datosEntrega?.chofer.numeroDoc}`}
                                  >
                                    {vehi.datosEntrega?.chofer?.nombre +
                                      " " +
                                      vehi.datosEntrega?.chofer?.apellido}
                                  </Enlaces>
                                </TituloTexVA>
                              )}
                            </CajaIzqDerVA>
                          </CajaTopVA>
                          <CajaBottomVA>
                            <CajaPrecioCostVehAdd>
                              <CajitaTextoPrecioCost>
                                <TextoPrecioCost>Costo: </TextoPrecioCost>
                                <TextoPrecioCost>
                                  {formatoDOP(vehi.resultado.costo)}
                                </TextoPrecioCost>
                              </CajitaTextoPrecioCost>
                              <CajitaTextoPrecioCost>
                                <TextoPrecioCost>Precio:</TextoPrecioCost>
                                <TextoPrecioCost>
                                  {formatoDOP(vehi.resultado.precio)}
                                </TextoPrecioCost>
                              </CajitaTextoPrecioCost>
                            </CajaPrecioCostVehAdd>
                            <Detalle1Wrap className="mobil400Vertical">
                              <Detalle2Titulo className="mobil400Vertical">
                                Ayudante:
                              </Detalle2Titulo>
                              <Detalle3OutPut className="mobil400Vertical">
                                <Enlaces
                                  target="_blank"
                                  to={`/transportes/maestros/choferes/${vehi.datosEntrega.ayudante.numeroDoc}`}
                                >
                                  {vehi.datosEntrega.ayudante.nombre +
                                    " " +
                                    vehi.datosEntrega.ayudante.apellido}
                                </Enlaces>
                              </Detalle3OutPut>
                            </Detalle1Wrap>
                            {vehi?.ayudantesAdicionales && (
                              <CajaTablaGroup2>
                                <Detalle2Titulo className="vertical">
                                  Ayudantes Adicionales:
                                </Detalle2Titulo>
                                <TablaGroup>
                                  <thead>
                                    <FilasGroup>
                                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                                      <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                                      <CeldaHeadGroup>Monto</CeldaHeadGroup>
                                      <CeldaHeadGroup>Obs</CeldaHeadGroup>
                                      <CeldaHeadGroup>Status</CeldaHeadGroup>
                                    </FilasGroup>
                                  </thead>
                                  <tbody>
                                    {vehi?.ayudantesAdicionales?.length > 0 &&
                                      vehi?.ayudantesAdicionales.map(
                                        (ayudante, index) => {
                                          return (
                                            <FilasGroup
                                              key={index}
                                              className={`body ${index % 2 ? "impar" : "par"}`}
                                            >
                                              <CeldasBodyGroup>
                                                {index + 1}
                                              </CeldasBodyGroup>
                                              <CeldasBodyGroup className="startText">
                                                {ayudante.datosAyudante.nombre +
                                                  " " +
                                                  ayudante.datosAyudante
                                                    .apellido}
                                              </CeldasBodyGroup>
                                              <CeldasBodyGroup>
                                                {ayudante.costo}
                                              </CeldasBodyGroup>
                                              <CeldasBodyGroup>
                                                {ayudante.obs}
                                              </CeldasBodyGroup>
                                              <CeldasBodyGroup>
                                                {parsedStatusAyudAdd(
                                                  ayudante.status
                                                )}
                                              </CeldasBodyGroup>
                                            </FilasGroup>
                                          );
                                        }
                                      )}
                                  </tbody>
                                </TablaGroup>
                              </CajaTablaGroup2>
                            )}
                          </CajaBottomVA>
                        </WrapAddVA>
                      );
                    }
                  )}
                </CajaInternalVAdd>
              </ContenedorVA>
            )}
          </Seccion>
          <TituloModulo>Datos Solicitud:</TituloModulo>
          <Seccion>
            <MoldeDatosReq
              tipo="detalleReq"
              datosReq={requestMaster.datosReq}
              modoDisabled={true}
            />
          </Seccion>

          <Seccion>
            <TituloModulo>Montos:</TituloModulo>
            {requestMaster.datosMontos[0]?.nuevoFormato ? (
              <MontosReqNuevo
                datosMontos={datosMontos}
                datosFlete={requestMaster.datosFlete}
                setDatosMontos={setDatosMontos}
                opcionesVehiculos={opcionesVehiculos}
                userMaster={userMaster}
                modo={"edicion"}
              />
            ) : (
              <MontosReqViejo
                datosMontos={datosMontos}
                datosFlete={requestMaster.datosFlete}
                setDatosMontos={setDatosMontos}
                opcionesVehiculos={opcionesVehiculos}
                userMaster={userMaster}
                modo={"edicion"}
              />
            )}
          </Seccion>
          <SliderStatus className={Theme.config.modoClear ? "clearModern" : ""}>
            <TituloModulo>Valoraciones:</TituloModulo>
            <>
              <CajaInternaCalififacion>
                <CajitasCalificacion className="fotoPerfil">
                  <NombreTexto className="titulo">Solicitante:</NombreTexto>
                  <CajaFotoMain>
                    <AvatarPerfil
                      className={`
                      ${requestMaster?.datosSolicitante?.genero}
                      ${requestMaster.estadoDoc == 4 ? " inactivo " : ""}
                      small
                      `}
                      src={
                        requestMaster.datosSolicitante?.urlFotoPerfil
                          ? requestMaster.datosSolicitante?.urlFotoPerfil
                          : requestMaster.datosSolicitante.genero == "femenino"
                            ? AvatarFemale
                            : AvatarMale
                      }
                    />
                  </CajaFotoMain>
                  <CajaNombre>
                    <NombreTexto>
                      {requestMaster.datosSolicitante?.nombre}
                    </NombreTexto>
                  </CajaNombre>
                </CajitasCalificacion>
                <CajitasCalificacion className="calificacion">
                  <WrapCalificaion
                    className={`estrellas ${requestMaster.estadoDoc == 4 ? "inactivo" : ""}`}
                  >
                    {
                      <Calificar
                        editable={
                          requestMaster.estadoDoc == 3 &&
                          userMaster.id ==
                            requestMaster.datosSolicitante.idSolicitante
                        }
                        qtyEstrella={
                          requestMaster.calificaciones.resenniaVentas.puntuacion
                        }
                        tipo="slider"
                        documento={requestMaster}
                        propiedadAfectar={"resenniaVentas"}
                      />
                    }
                  </WrapCalificaion>
                  <WrapCalificaion>
                    {addResenniaVentas &&
                    requestMaster.estadoDoc == 3 &&
                    userMaster.id ==
                      requestMaster.datosSolicitante.idSolicitante ? (
                      <TextArea2
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        value={textoReviewVentas}
                        name="textoVentas"
                        onChange={(e) => {
                          handleResennia(e);
                        }}
                      />
                    ) : (
                      <CajitaDetalle className="resenniaText">
                        <DetalleTexto className="resenniaText">
                          {textoReviewVentas}
                        </DetalleTexto>
                      </CajitaDetalle>
                    )}

                    {requestMaster.estadoDoc == 3 &&
                    userMaster.id ==
                      requestMaster.datosSolicitante.idSolicitante ? (
                      <CajaBotonGuardar>
                        {addResenniaVentas == false ? (
                          <BtnSimple
                            name="btnVentas"
                            onClick={(e) => editarResennia(e)}
                          >
                            Editar
                          </BtnSimple>
                        ) : (
                          <CajaBtnResennia>
                            <BtnSimple
                              className="pequennio"
                              name="btnVentas"
                              onClick={(e) => guardarResennia(e)}
                            >
                              Guardar
                            </BtnSimple>
                            <BtnSimple
                              className="pequennio danger"
                              name="btnVentas"
                              onClick={(e) => cancelarResenia(false)}
                            >
                              Cancelar
                            </BtnSimple>
                          </CajaBtnResennia>
                        )}
                      </CajaBotonGuardar>
                    ) : (
                      ""
                    )}
                  </WrapCalificaion>
                </CajitasCalificacion>
              </CajaInternaCalififacion>

              {requestMaster.tipo != 1 && (
                <CajaInternaCalififacion>
                  <CajitasCalificacion className="fotoPerfil cliente">
                    <CajaNombre className="nombreCLiente">
                      <NombreTexto className="tituloCliente">
                        Cliente:
                      </NombreTexto>
                      <NombreTexto className="nombre">
                        {reviewClienteMaster?.nombre}
                      </NombreTexto>
                    </CajaNombre>
                    <br />
                    <CajaNombre className="nombreCLiente">
                      <NombreTexto className="tituloCliente">
                        Telefono:
                      </NombreTexto>
                      <NombreTexto className="nombre">
                        {reviewClienteMaster?.numero}
                      </NombreTexto>
                    </CajaNombre>
                  </CajitasCalificacion>
                  <CajitasCalificacion className="calificacion">
                    <WrapCalificaion className="estrellas">
                      <Calificar
                        qtyEstrella={reviewClienteMaster?.puntuacion}
                        tipo="slider"
                        editable={false}
                        documento={requestMaster}
                        propiedadAfectar={"resenniaClientes"}
                      />
                    </WrapCalificaion>
                    <WrapCalificaion>
                      {reviewClienteMaster?.puntuacion > 0 ? (
                        <CajitaDetalle className="resenniaText">
                          <DetalleTexto className="resenniaText">
                            {reviewClienteMaster.comentarios}
                          </DetalleTexto>
                        </CajitaDetalle>
                      ) : (
                        <CajitaDetalle className="linkCliente">
                          {requestMaster.datosSolicitante.idSolicitante ==
                            userMaster.id && requestMaster.estadoDoc == 3 ? (
                            <BtnSimple onClick={() => copiarLink()}>
                              <Icono icon={faCopy} />
                              Copiar Link
                            </BtnSimple>
                          ) : null}
                        </CajitaDetalle>
                      )}
                    </WrapCalificaion>
                  </CajitasCalificacion>
                </CajaInternaCalififacion>
              )}
            </>
          </SliderStatus>
          {hasMapa && (
            <ContenedorMapa>
              <CajaMapa>
                <CajaTitulo>
                  <TituloMapa>Mapa</TituloMapa>
                  <XCerrar onClick={() => setHasMapa(false)}>❌</XCerrar>
                </CajaTitulo>
                <MapaGoogle
                  src={
                    requestMaster.datosFlete.provinciaSeleccionada
                      .municipioSeleccionado[
                      requestMaster.datosFlete.puntoPartidaSeleccionado
                        .nombreLink
                    ]
                  }
                />
              </CajaMapa>
            </ContenedorMapa>
          )}
          <ElementoPrivilegiado
            userMaster={userMaster}
            listaPrivilegio={([...privilegioEstados], [...privilegioAcciones])}
          >
            {botonSeleccionado.tipo && (
              <ContenedorChangeState>
                <CajaChange
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  <BarraTituloCerrar>
                    <TituloChange>{botonSeleccionado.texto}</TituloChange>
                    <XCerrarChange
                      data-name="cerrar"
                      onClick={(e) => handleEstados(e)}
                    >
                      ❌
                    </XCerrarChange>
                  </BarraTituloCerrar>
                  <CajaContenido>
                    {botonSeleccionado.tipo == "btnEstados" ? (
                      // Si la solicitud esta en borrador, que no muestre los botones para cambiar estados
                      requestMaster.estadoDoc != -1 ? (
                        <>
                          <WrapInternalContenido>
                            <ElementoPrivilegiado
                              userMaster={userMaster}
                              privilegioReq={"planificatedRequestTMS"}
                            >
                              <BtnSimple
                                name="planificar"
                                data-id={requestMaster.id}
                                className={`
                                ${propsConfigEstado.tipo == "planificar" ? "seleccionado" : ""}
                                `}
                                onClick={(e) => {
                                  handleEstados(e);
                                }}
                              >
                                Planificar
                              </BtnSimple>
                            </ElementoPrivilegiado>

                            <ElementoPrivilegiado
                              userMaster={userMaster}
                              privilegioReq={"runRequestTMS"}
                            >
                              <BtnSimple
                                name="ejecutar"
                                data-id={requestMaster.id}
                                className={`
                                ${propsConfigEstado.tipo == "ejecutar" ? "seleccionado" : ""}
                                `}
                                onClick={(e) => {
                                  handleEstados(e);
                                }}
                              >
                                Ejecutar
                              </BtnSimple>
                            </ElementoPrivilegiado>

                            <ElementoPrivilegiado
                              userMaster={userMaster}
                              privilegioReq={"terminateRequestTMS"}
                            >
                              <BtnSimple
                                name="concluir"
                                data-id={requestMaster.id}
                                className={`
                                ${propsConfigEstado.tipo == "concluir" ? "seleccionado" : ""}
                                `}
                                onClick={(e) => {
                                  handleEstados(e);
                                }}
                              >
                                Concluir
                              </BtnSimple>
                            </ElementoPrivilegiado>

                            <ElementoPrivilegiado
                              userMaster={userMaster}
                              privilegioReq={"annularRequestTMS"}
                            >
                              <BtnSimple
                                name="cancelar"
                                data-id={requestMaster.id}
                                className={`danger
                                ${propsConfigEstado.tipo == "cancelar" ? "seleccionado" : ""}
                                `}
                                onClick={(e) => {
                                  handleEstados(e);
                                }}
                              >
                                Anular
                              </BtnSimple>
                            </ElementoPrivilegiado>
                          </WrapInternalContenido>

                          <ElementoPrivilegiado
                            userMaster={userMaster}
                            listaPrivilegio={privilegioEstados}
                          >
                            {verEstados && (
                              <WrapInternalContenido>
                                <EjecutorJSXEstados
                                  estadoOficial={requestMaster.estadoDoc}
                                  userMaster={userMaster}
                                  setHasAccion={setVerEstados}
                                  propsConfigEstado={propsConfigEstado}
                                  handleEstado={handleEstados}
                                  setDBChoferes={setDBChoferes}
                                  dbChoferes={dbChoferes}
                                  tipo="detalleReq"
                                  botonSeleccionado={botonSeleccionado}
                                  resetDatosChange={resetDatosChange}
                                  // Pagos
                                  congloPagosInternos={congloPagosInternos}
                                  setCongloPagosInternos={
                                    setCongloPagosInternos
                                  }
                                  congloPagosExtInd={congloPagosExtInd}
                                  setCongloPagosExtInd={setCongloPagosExtInd}
                                  congloPagosExtEmp={congloPagosExtEmp}
                                  setCongloPagosExtEmp={setCongloPagosExtEmp}
                                />
                              </WrapInternalContenido>
                            )}
                          </ElementoPrivilegiado>
                        </>
                      ) : (
                        <TextoNo>No puede cambiar estado a borradores.</TextoNo>
                      )
                    ) : botonSeleccionado.tipo == "btnAcciones" ? (
                      <ModalAccionesReq
                        requestMaster={requestMaster}
                        requestEditable={requestEditable}
                        userMaster={userMaster}
                        handleAcciones={handleAcciones}
                        congloAcciones={congloAcciones}
                        setCongloAcciones={setCongloAcciones}
                        hasDesplegableParentesco={hasDesplegableParentesco}
                        hasIncoherencia={hasIncoherencia}
                        setRequestEditable={setRequestEditable}
                        listaAyudantesAdicionales={listaAyudantesAdicionales}
                        setListaAyudantesAdicionales={
                          setListaAyudantesAdicionales
                        }
                        //
                      />
                    ) : botonSeleccionado.tipo == "btnComentar" ? (
                      <ContainerObs>
                        <ContenedorComentarios>
                          {requestMaster.observaciones.length > 0 && (
                            <CajaResenas>
                              {requestMaster?.observaciones?.map(
                                (obs, index) => {
                                  return (
                                    <CajaResena key={index}>
                                      <CajaAvatar>
                                        <Enlaces
                                          target="_blank"
                                          to={`/dashboard/usuarios/${obs.usuario.userName}`}
                                        >
                                          <Avatar
                                            src={obs.usuario.urlFotoPerfil}
                                          />
                                        </Enlaces>
                                      </CajaAvatar>
                                      <CajaTextoResena>
                                        <Enlaces
                                          target="_blank"
                                          to={`/dashboard/usuarios/${obs.usuario.userName}`}
                                        >
                                          <NombreResena>
                                            {extraerPrimerNombreApellido(
                                              obs.usuario.nombre,
                                              obs.usuario.apellido
                                            )}
                                          </NombreResena>
                                        </Enlaces>
                                        <TextoResena>{obs.texto}</TextoResena>
                                        <FechaResennias>
                                          {hoyManniana(obs.fecha, true)}
                                        </FechaResennias>
                                      </CajaTextoResena>
                                    </CajaResena>
                                  );
                                }
                              )}
                            </CajaResenas>
                          )}
                          <CajaInputComentario>
                            <CajaInternaComentario></CajaInternaComentario>
                            <InputArea
                              value={inputObs}
                              name="observaciones"
                              onChange={(e) => handleInputObs(e)}
                              placeholder="Indique las observaciones a añadir"
                            />
                          </CajaInputComentario>
                          <CajaAddFrase>
                            <MasFraseBtn onClick={() => agregarObs()}>
                              Agregar
                            </MasFraseBtn>
                          </CajaAddFrase>
                        </ContenedorComentarios>
                      </ContainerObs>
                    ) : botonSeleccionado.tipo == "btnMasInfo" ? (
                      <ContenedorMasInfo>
                        <DetallePagos requestMaster={requestMaster} />
                        {requestMaster.estadoDoc == 4 && (
                          <MotivoCancelarInfo>
                            <TituloSen>Motivo de cancelacion</TituloSen>
                            <ParrafoMotivCance>
                              {requestMaster.motivoCancelacion}
                            </ParrafoMotivCance>
                          </MotivoCancelarInfo>
                        )}
                      </ContenedorMasInfo>
                    ) : (
                      ""
                    )}
                  </CajaContenido>
                </CajaChange>
              </ContenedorChangeState>
            )}
          </ElementoPrivilegiado>
          <Alerta
            estadoAlerta={dispatchAlerta}
            tipo={tipoAlerta}
            mensaje={mensajeAlerta}
          />
          {isLoading ? <ModalLoading completa={true} /> : ""}
        </>
      )}
      {hasData == 2 && (
        <CajaReqNoExiste>
          <h1>{reqNoExiste}</h1>
        </CajaReqNoExiste>
      )}

      {hasData == 0 && <ModalLoading completa={true} />}
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
  position: relative;
`;
const Seccion = styled.div`
  width: 100%;
  min-height: 40px;
  /* 787878 */
  margin: 10px 0;
  gap: 10px;
  padding: 0 15px;
  color: ${Tema.secondary.azulOpaco};
  margin-bottom: 25px;
  &.horizontal {
    display: flex;
    /* height: 350px; */
    justify-content: start;
  }
  position: relative;
  &.vehiculo {
    display: flex;
    flex-direction: column;
    /* height: 350px; */
  }
  @media screen and (max-width: 780px) {
    flex-direction: column;
  }
`;

const CajaDetalles = styled.div`
  width: 46%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);

  border: 1px solid white;

  color: white;
  @media screen and (max-width: 780px) {
    width: 94%;
  }
`;
const CajaTopStatus = styled(CajaStatusComponent)`
  border-bottom: 1px solid ${Tema.neutral.blancoHueso};
  width: 100%;

  height: 15%;
`;
const TextoStatus = styled.h2`
  text-align: center;
  font-size: 1.3rem;
  font-weight: 400;
`;
const CajaPerfiles = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  height: 90%;
`;
const CajaInterna = styled.div`
  width: 50%;
  border: 2px solid ${Tema.neutral.blancoHueso};
  border: none;
  border-radius: 10px;
  padding: 5px;
  overflow: hidden;
  /* border: 1px solid black; */
`;

const CajaFotoMain = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const FotoMain = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  &.inactivo {
    filter: grayscale(100%);
  }
`;

const CajaNombre = styled.div`
  width: 100%;
  height: 20%;
  /* margin-bottom: 20px; */
  &.nombreCLiente {
    height: auto;
  }
`;
const NombreTexto = styled.h2`
  text-align: center;
  color: inherit;
  font-weight: 400;
  &.status {
    color: inherit;
  }
  &.titulo {
    font-size: 1rem;
    margin-bottom: 5px;
    text-decoration: underline;
  }
  &.tituloCliente {
    font-size: 0.8rem;
    /* margin-bottom: 5px; */
    text-decoration: underline;
  }
  &.nombre {
    font-size: 0.8rem;
    /* margin-bottom: 5px; */
    text-decoration: none;
  }
  &.nombreMain {
    font-size: 1.1rem;
  }
`;

const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  &.negativo {
    color: ${Tema.complementary.danger};
  }
  &.docCerrado {
    color: inherit;
  }
  &.enlaceMostrar {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  &.detalles {
    width: 100%;
    padding: 6px;
    height: auto;
    white-space: normal;
    text-align: start;
  }
  &.sinNoWrap {
    white-space: nowrap;
    text-overflow: clip;
    overflow: visible;
  }
  &.resenniaText {
    width: 100%;
    height: 100%;
    text-align: start;
    padding: 3px;

    white-space: normal;
    overflow: auto;
    text-overflow: ellipsis;
    color: white;
  }
  &.linkCliente {
    border: 1px solid ${Tema.primary.azulBrillante};
    padding: 2px 2px;
    height: auto;
  }
  &.ancho {
    width: auto;
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.neutral.blancoHueso};

  &.detalles {
    flex-direction: column;
    gap: 5px;
  }
  &.linkCliente {
    flex-direction: column;
  }
`;

const CajaInternaFlete = styled.div`
  width: 49%;
  height: 100%;
  overflow: hidden;
  text-align: center;

  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  color: white;
  border: 1px solid white;
  &.izquierda {
    width: 40%;
    @media screen and (max-width: 780px) {
      width: 96%;
      height: 200px;
    }
  }
  &.derecha {
    /* height: 150px; */
    width: 52%;
    overflow-y: auto;
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

    &::-webkit-scrollbar-thumb {
      background-color: #19b4ef;
      border-radius: 7px;
    }
    @media screen and (max-width: 780px) {
      width: 96%;
      height: auto;
    }
  }

  /* min-height: 250px; */
`;

const ImgSimple = styled.img`
  width: 200px;
`;
const TextoCamion = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  color: white;
  font-size: 1rem;
  font-weight: 400;
  padding: 4px;
`;
const Titulo = styled.h2`
  font-size: 1.4rem;
  text-decoration: underline;
  color: white;
`;
const TituloModulo = styled(Titulo)`
  margin-bottom: 15px;
  margin-left: 15px;
  color: ${Tema.primary.azulBrillante};
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
`;

const SliderStatus = styled.div`
  position: absolute;
  z-index: 2;
  top: 110px;
  right: 5px;
  transform: translate(88%, 0);
  width: 400px;
  border: 1px solid ${Tema.secondary.azulProfundo};
  border-radius: 5px;
  padding: 4px;
  background-color: ${Tema.secondary.azulProfundo};
  transition: transform ease 0.4s;
  &.clearModern {
    background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
    /* backdrop-filter: blur(10px); */
    color: white;
  }
  /* transform: translate(0, 0); */
  &:hover {
    right: 0;
    transform: translate(0, 0);
  }

  @media screen and (max-width: 550px) {
    width: 98%;
    right: 15px;
    transform: translate(100%, 0);
    &.abierto {
      right: 0;
      transform: translate(0, 0);
    }
  }

  border: 2px solid ${Tema.primary.azulBrillante};
  min-height: 500px;
`;

const CajaInternaCalififacion = styled.div`
  display: flex;
  border: 1px solid ${Tema.neutral.blancoHueso};
`;
const CajitasCalificacion = styled.div`
  padding: 5px;
  width: 50%;

  &.fotoPerfil {
    display: flex;
    flex-direction: column;
    width: 40%;
    &.cliente {
    }
  }
  &.calificacion {
    width: 60%;
    display: flex;
    flex-direction: column;
  }
`;

const WrapCalificaion = styled.div`
  margin-bottom: 15px;
  width: 100%;

  &.estrellas {
    display: flex;
  }
  &.inactivo {
    filter: grayscale(100%);
  }
`;

const TextArea2 = styled(TextArea)`
  outline: none;
  background-color: ${Tema.secondary.azulGraciel};

  color: ${Tema.primary.azulBrillante};
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  height: 100px;
  width: 100%;
  min-width: 100%;
  max-width: 100%;
  min-height: 100px;
  resize: vertical;
  border: 1px solid ${Tema.secondary.azulOscuro2};
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;
`;

const ContenedorMapa = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  top: 0;
  background-color: #00000077;
`;
const CajaMapa = styled.div`
  background-color: ${Tema.secondary.azulOpaco};
  position: fixed;
  top: 50%;

  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 700px;
  height: 400px;
  border-radius: 5px;
  -webkit-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  -moz-box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  box-shadow: 10px 10px 5px 0px rgba(0, 0, 0, 0.75);
  z-index: 3;
  @media screen and (max-width: 780px) {
    width: 80%;
    top: 35%;
  }
`;

const CajaTitulo = styled.div`
  height: 40px;
  background-color: ${Tema.secondary.azulProfundo};
  display: flex;
`;
const TituloMapa = styled.h2`
  color: ${Tema.primary.azulBrillante};
  width: 90%;
  text-align: center;
  vertical-align: 1.4rem;
  font-size: 1.4rem;

  align-content: center;
`;
const XCerrar = styled.p`
  width: 10%;
  align-content: center;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid red;
  cursor: pointer;
`;

const MapaGoogle = styled.iframe`
  width: 100%;
  display: block;
  margin: auto;
  height: 500px;
  border-radius: 5px;
  border: none;
  box-shadow: 5px 5px 5px -1px rgba(0, 0, 0, 0.43);
`;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const ContenedorChangeState = styled.div`
  background-color: red;
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: absolute;
  background-color: #000000c7;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaChange = styled.div`
  width: 800px;
  border-radius: 10px;

  min-height: 300px;
  position: fixed;
  top: 150px;
  overflow: hidden;
  border: 1px solid white;
  background-color: #0f0e3bcc;
  background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
  @media screen and (max-width: 1000px) {
    left: 70px;
    width: 85%;
  }
  @media screen and (max-width: 620px) {
    left: 10px;
    width: 95%;
    margin: auto;
  }
`;
const BarraTituloCerrar = styled.div`
  height: 30px;
  border: 1px solid ${Tema.primary.grisNatural};
  background-color: ${Tema.neutral.neutral600};
  overflow: hidden;
  display: flex;
  height: 10%;
  position: relative;
`;
const TituloChange = styled.h2`
  width: 100%;
  text-align: center;
  vertical-align: 1.4rem;
  font-size: 1.4rem;

  align-content: center;
  color: white;
  background-color: ${ClearTheme.secondary.azulVerdeOsc};
`;
const XCerrarChange = styled.p`
  width: 10%;
  height: 100%;
  align-content: center;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid black;
  position: absolute;
  right: 0;
  &:hover {
    cursor: pointer;
    border-radius: 5px;
    transition: ease 0.1s;
    border: 1px solid white;
  }
`;
const CajaContenido = styled.div`
  width: 100%;
  min-height: 300px;
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

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const WrapInternalContenido = styled.div`
  display: flex;
  width: 100%;
  min-height: 50px;
  justify-content: center;
  /* border: 2px solid red; */
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin-bottom: 4px;
  &.cancelada {
    background-color: ${Tema.primary.grisNatural};
    cursor: auto;
    &:hover {
      color: white;
      background-color: ${Tema.primary.grisNatural};
    }
  }
  &.pequennio {
    font-size: 0.8rem;
    min-width: 60px;
  }
  &.seleccionado {
    background-color: #fff;
    color: #0074d9;
    &:hover {
      cursor: auto;
    }
  }
`;
const CajaBotonGuardar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

//
const ContainerObs = styled.div`
  height: auto;
  width: 100%;
`;
const ContenedorComentarios = styled.div`
  border: 1px solid black;
  width: 100%;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 5px;

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

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
  h4 {
    color: white;
    text-align: end;
    font-weight: lighter;
    font-size: 1.2rem;
  }
  &.home {
    height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
  }
  background-color: ${Tema.secondary.azulProfundo};
  border: none;
  min-height: 300px;
  overflow: scroll;
  height: 400px;
`;
const CajaResenas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const CajaResena = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 10px 0 10px 0;
  border: 1px solid ${Tema.primary.azulBrillante};

  @media screen and (max-width: 780px) {
    flex-direction: column;
    align-items: center;
    border: 1px solid ${Tema.secondary.azulOpaco};
  }
`;

const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  object-fit: contain;
  &.sinFoto {
    filter: grayscale(100%);
  }
  &:hover {
    cursor: pointer;
  }
`;
const CajaTextoResena = styled.div`
  display: flex;
  width: 100%;
  padding-left: 10px;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 780px) {
    padding-left: 0;
  }
`;

const NombreResena = styled.h2`
  color: #fff;
  color: ${Tema.primary.azulBrillante};
  font-size: 1rem;
  margin-bottom: 5px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  @media screen and (max-width: 780px) {
    text-align: center;
  }
`;
const TextoResena = styled.p`
  color: #fff;
  color: ${Tema.secondary.azulOpaco};
  margin-bottom: 8px;
  padding-left: 5px;
`;
const FechaResennias = styled.p`
  color: ${Tema.primary.grisNatural};
  font-size: 13px;
  padding-left: 5px;
  margin-bottom: 10px;
`;

const MasFraseBtn = styled(BtnGeneralButton)`
  font-size: 1rem;
  width: auto;
  height: 35px;
  text-align: center;
`;

const CajaAddFrase = styled.div`
  width: 97%;
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 20px;
  border-radius: 5px;
`;

const CajaInputComentario = styled.div`
  width: 100%;
  background-color: ${Tema.primary.grisNatural};
  border-radius: 5px;
`;

const InputArea = styled.textarea`
  background-color: transparent;
  color: white;
  padding: 5px;
  resize: none;

  width: 100%;
  height: 90px;
  font-size: 0.9rem;

  text-align: start;
  align-items: center;
  outline: none;
  border: none;
  &.editando {
    border: 1px solid ${Tema.secondary.azulOpaco};
    background-color: ${Tema.secondary.azulGraciel};
    border-radius: 5px;
    color: ${Tema.primary.azulBrillante};
    &:focus {
      border: 1px solid ${Tema.primary.azulBrillante};
    }
  }
`;
const CajaInternaComentario = styled.div`
  position: relative;
  width: 100%;
`;

const CajaAvatar = styled.div`
  height: 80px;
`;

const CajaBtnResennia = styled.div`
  width: 100%;
  display: flex;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;
const TituloHija = styled.h2`
  font-size: 1.2rem;
  height: 100%;
  text-align: center;
  align-content: center;
`;

const ButtonEmoji = styled.span`
  cursor: pointer;
  &:hover {
    text-decoration: underline;
  }
`;
const ContenedorMasInfo = styled.div`
  height: 400px;
  overflow-y: scroll;
`;
const MotivoCancelarInfo = styled.div`
  width: 100%;
  min-height: 100px;
  padding: 8px;
`;
const TituloSen = styled.h2`
  color: white;
  text-decoration: underline;
  width: 100%;
  text-align: center;
`;
const ParrafoMotivCance = styled.p`
  color: white;
  width: 100%;
  min-height: 100px;
  padding: 8px;
  border: 1px solid ${ClearTheme.primary.azulBrillante};
`;
const TextoNo = styled.h2`
  width: 100%;
  text-align: center;
  color: white;
  font-weight: 400;
`;
const CajaVehiculoDefault = styled.div`
  display: flex;
  width: 100%;
  height: 220px;

  @media screen and (max-width: 780px) {
    flex-direction: column;
    height: auto;
  }
`;
const TituloVA = styled.h2`
  color: white;
  font-size: 1.2rem;
  border-bottom: 1px solid white;
  font-weight: 400;
  margin-bottom: 4px;
  height: 30px;
`;
// Vehiculos adicionales
const ContenedorVA = styled.div`
  width: 100%;
  border: 1px solid white;
  border-radius: 4px;
  min-height: 100px;
  padding: 10px;
  background-color: ${Tema.secondary.azulProfundo};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  display: flex;
  flex-direction: column;
  height: 350px;
  overflow-x: auto;
  overflow-y: hidden;
`;
const CajaInternalVAdd = styled.div`
  width: 100%;
  display: flex;
  gap: 10px;
  height: calc(100% - 30px);
  overflow-y: scroll;
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

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;

const WrapAddVA = styled.div`
  border: 1px solid black;
  width: 45%;
  display: flex;
  align-items: center;
  flex-direction: column;
  padding: 4px;
  box-shadow: ${ClearTheme.config.sombra};
  border-radius: 6px;

  flex: 0 0 40%; /* No crecer, no encoger, ocupar el 40% */
  /* flex-direction: column; */
  /* padding: 1rem; */

  min-width: 200px; /* Opcional: asegura que no sea muy pequeña en pantallas pequeñas */
  height: 100%;
  height: 350px;
  height: auto;
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

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaTopVA = styled.div`
  width: 100%;
  display: flex;
  height: 160px;
`;
const CajaBottomVA = styled.div`
  width: 100%;

  height: calc(100% - 160px);
  border: 1px solid #dddddd61;
`;
const CajaIzqDerVA = styled.div`
  width: 50%;
  height: 100%;
  align-content: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  border: 1px solid black;
  padding: 4px;
`;
const ImgVA = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
  /* object-fit: cover; */
  &.chofer {
    width: 100px;
    height: 100px;
    /* height: 80%; */
    border-radius: 50%;
    border: 2px solid ${ClearTheme.secondary.AzulOscSemiTransp};
  }
`;
const TituloTexVA = styled.h2`
  color: white;
  font-size: 1rem;
  font-weight: 400;
  width: 100%;
  text-align: center;
`;

const CajaReqNoExiste = styled.div`
  transition: ease all 1s;
  padding: 15px;
`;
const CajaPrecioCostVehAdd = styled.div`
  width: 100%;

  /* border: 1px solid ${Tema.primary.azulBrillante}; */
  height: 25px;
  display: flex;
  justify-content: space-around;
  padding: 4px;
`;
const CajitaTextoPrecioCost = styled.div`
  display: flex;
  color: white;
`;
const TextoPrecioCost = styled.p`
  font-size: 0.9rem;
  font-weight: 400;
  margin-bottom: 5px;
`;
const CajaTablaGroup2 = styled(CajaTablaGroup)`
  border: none;
  color: white;
  height: auto;
`;
const EnlacesPerfil = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: block;
  /* width: 70%; */
  /* border: 1px solid red; */
  transition: all ease 0.2s;
  border-radius: 10px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
    background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
    img {
      border: 3px solid ${ClearTheme.complementary.warning};
    }
    color: ${ClearTheme.complementary.warning};
    text-decoration: underline;
    h2 {
    }
  }

  &.static {
    &:hover {
      cursor: auto;
      border: 1px solid transparent;
      background-color: transparent;
      img {
        border: 3px solid black;
      }
      color: white;
      text-decoration: underline;
      h2 {
      }
    }
  }
`;
