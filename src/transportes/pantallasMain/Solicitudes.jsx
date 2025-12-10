import { useState, useEffect } from "react";
import styled from "styled-components";
import { ControlesTablas } from "../components/ControlesTablas.jsx";
import { CardReq } from "../components/CardReq.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";

import {
  collection,
  query,
  where,
  onSnapshot,
  or,
  and,
} from "firebase/firestore";
import db from "../../firebase/firebaseConfig.js";
import { useAuth } from "../../context/AuthContext.jsx";
import { ES6AFormat } from "../../libs/FechaFormat.jsx";

import EjecutorJSXEstados from "../components/reqComponents/EjecutorJSXEstados.jsx";
import { ManejadorJSEstados } from "../components/reqComponents/ManejadorJSEstados.js";
import EncontrarReq from "../components/EncontrarReq/EncontrarReq.jsx";

import {
  StyleTextStateReq,
  StyleTextTypeReq,
} from "../libs/DiccionarioNumberString.js";
import {
  Departamentos,
  localidadesAlmacen,
} from "../../components/corporativo/Corporativo.js";

export const Solicitudes = ({
  userMaster,
  dbTransferRequest,
  setDBTransferRequest,
  dbUsuarios,
  setDBChoferes,
  dbChoferes,
  // Pagos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
}) => {
  // **************** ESTADOS DE LOS INPUTS DE CONTROLES ************
  // Colocados necesariamente al inicio
  const [valueSearch, setValueSearch] = useState("");
  const [valueStatus, setValueStatus] = useState("");
  const [valueTipo, setValueTipo] = useState("");
  const [valueAlmaceSalida, setValueAlmacenSalida] = useState("");

  const [reqActivasTodas, setReqActivasTodas] = useState(null);
  useEffect(() => {
    if (userMaster) {
      if (userMaster.permisos.includes("viewAllRequestTMS")) {
        setReqActivasTodas("todas");
      } else if (userMaster.permisos.includes("viewMyWareHouseRequestTMS")) {
        setReqActivasTodas("solicitudesMiAlmacen");
      } else if (userMaster.permisos.includes("viewMyDptoRequestTMS")) {
        setReqActivasTodas("solicitudesMiDpto");
      } else {
        setReqActivasTodas("misSolicitudes");
      }
    }
  }, [userMaster]);
  const useDocLamadaPrincipalDB = (exp1) => {
    const userAuth = useAuth().usuario;

    const [usuario, setUsuario] = useState(userAuth);

    //*********** 🟢🟢🟢 LLAMADAS SEGUN EL PRIVILEGIO DEL USUARIO 🟢🟢🟢***************
    //*********** 🟢🟢🟢 LLAMADAS SEGUN EL PRIVILEGIO DEL USUARIO 🟢🟢🟢***************
    useEffect(() => {
      if (usuario && userMaster) {
        const collectionName = "transferRequest";

        //********************* TODAS LAS SOLICITUDES *********************
        if (reqActivasTodas == "todas") {
          console.log("DB 😐😐😐😐😐" + "todas transferRequest");
          const fechaActualES6 = new Date();
          // const fechaAyerES6 = new Date(fechaActualES6);

          // const fechaHoyFinal = new Date();
          // fechaHoyFinal.setHours(23, 59, 59, 999);
          // const ayerInicial = new Date();
          const fechaActualString = ES6AFormat(fechaActualES6).slice(0, 10);
          // const fechaAyerString = ES6AFormat(fechaAyerES6).slice(0, 10);

          // const isMonday = fechaHoyFinal.getDay() === 1;
          // if (isMonday == false) {
          //   ayerInicial.setDate(fechaHoyFinal.getDate() - 1);
          // } else if (isMonday == true) {
          //   ayerInicial.setDate(fechaHoyFinal.getDate() - 2);
          // }

          // ayerInicial.setHours(0, 0, 0, 0); // Establece la hora a las 0:00
          let q;
          if (true) {
            q = query(
              collection(db, collectionName),
              or(
                where("estadoDoc", "<", 3),
                where("fechaReqCorta", "==", fechaActualString)
                // where("fechaReqCorta", "==", fechaAyerString)

                // where("fechaStamp", ">=", ayerInicial),
                // where("fechaStamp", "<=", fechaHoyFinal)
              )
            );
          }

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coleccion = [];
            querySnapshot.forEach((doc) => {
              coleccion.push({ ...doc.data(), id: doc.id });
            });
            setDBTransferRequest(coleccion);
          });

          // Limpieza de la escucha al desmontar
          return () => unsubscribe();
        }

        //********************* SOLICITUDES DE MI ALMACEN *********************
        else if (reqActivasTodas == "solicitudesMiAlmacen") {
          console.log("DB 😐😐😐😐😐" + collectionName);
          const codigoInternoLocUser = userMaster.localidad.codigoInterno;

          const fechaActualES6 = new Date();
          const fechaAyerES6 = new Date(fechaActualES6);

          const isMonday = fechaActualES6.getDay() === 1;
          if (isMonday == false) {
            fechaAyerES6.setDate(fechaActualES6.getDate() - 1);
          } else if (isMonday == true) {
            fechaAyerES6.setDate(fechaActualES6.getDate() - 2);
          }
          const fechaActualString = ES6AFormat(fechaActualES6).slice(0, 10);
          let q;
          //
          q = query(
            collection(db, collectionName),
            and(
              where(
                "forQueryDB.almacenes",
                "array-contains",
                codigoInternoLocUser
              ),
              or(
                where("fechaReqCorta", "==", fechaActualString),
                where("estadoDoc", "<", 3)
              )
            )
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coleccion = [];
            querySnapshot.forEach((doc) => {
              coleccion.push({ ...doc.data(), id: doc.id });
            });
            setDBTransferRequest(coleccion);
          });
          return () => unsubscribe();
        }
        //********************* SOLICITUDES DE MI DPTO *********************
        else if (reqActivasTodas == "solicitudesMiDpto") {
          const codigodptoUser = Departamentos.find(
            (dpto) => dpto.nombre == userMaster.dpto
          ).codigoInterno;
          const fechaActualES6 = new Date();
          const fechaActualString = ES6AFormat(fechaActualES6).slice(0, 10);
          let q;
          //
          q = query(
            collection(db, collectionName),
            and(
              where(
                "forQueryDB.departamentos",
                "array-contains",
                codigodptoUser
              ),
              or(
                where("fechaReqCorta", "==", fechaActualString),
                where("estadoDoc", "<", 3)
              )
            )
          );

          const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const coleccion = [];
            querySnapshot.forEach((doc) => {
              coleccion.push({ ...doc.data(), id: doc.id });
            });
            setDBTransferRequest(coleccion);
          });
          return () => unsubscribe();
        }
      }
    }, [
      usuario,
      //  valueMiSolicitud,
      userMaster,
      reqActivasTodas,
    ]);
  };
  useDocLamadaPrincipalDB();
  //
  // ******************🟢🟢🟢 LLAMADA COMPLEMENTARIA 🟢🟢🟢**********************
  // ****************** SOLICITUDES SEGUN EL USUARIO **********************
  const [listaComplementaria, setListaComplementaria] = useState([]);
  const useDocLlamadaComplementaria = () => {
    const userAuth = useAuth().usuario;

    const [usuario, setUsuario] = useState(userAuth);
    useEffect(() => {
      const collectionName = "transferRequest";
      // Este condicional es para que si el usuario ya descargo la base de datos pues que no vuelva a cargar, aunque el componente de desmonte y se vuelva a montar

      if (userMaster) {
        // return;
        // Esto traera todas las solicitudes que en usuarios tenga el userName del usuario
        // Basicamente traera dos cosas:
        // 1-Las solicitudes que cree this usuarios
        // 2-Las solicitudes que copien a el usuario en la caja de notificaciones
        // if (reqActivasTodas == "misSolicitudes") {
        console.log("DB 😐😐😐😐😐" + collectionName);
        const fechaActualES6 = new Date();
        const fechaAyerES6 = new Date(fechaActualES6);

        const isMonday = fechaActualES6.getDay() === 1;
        if (isMonday == false) {
          fechaAyerES6.setDate(fechaActualES6.getDate() - 1);
        } else if (isMonday == true) {
          fechaAyerES6.setDate(fechaActualES6.getDate() - 2);
        }
        const fechaActualString = ES6AFormat(fechaActualES6).slice(0, 10);
        // const fechaAyerString = ES6AFormat(fechaAyerES6).slice(0, 10);
        let q;

        if (true) {
          q = query(
            collection(db, collectionName),
            and(
              where("forQueryDB.usuarios", "array-contains", userMaster.correo),
              or(
                where("estadoDoc", "<", 3),
                where("fechaReqCorta", "==", fechaActualString)
              )
            )
          );
        }
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const coleccion = [];
          querySnapshot.forEach((doc) => {
            coleccion.push({ ...doc.data(), id: doc.id });
          });

          setListaComplementaria(coleccion);
        });

        // Limpieza de la escucha al desmontar
        return () => unsubscribe();
        // }
      }
    }, [dbTransferRequest, usuario, userMaster]);
  };

  useDocLlamadaComplementaria("transferRequest", setListaComplementaria, "");
  //
  // ******************🟢🟢🟢 LLAMADA SEGUN LA CONFIGURACION 🟢🟢🟢**********************
  // ****************** SOLICITUDES SEGUN LA CONFIGURACION ESTABLECIDA **********************
  // BASICAMENTE LAS LLAMADAS SON:
  // -Todas las creadas por el mismo usuario
  // -Todas las de su dpto
  // -Todas las de su sucursal
  // -TODAS A NIVEL GLOBAL
  //
  // Pero esto tiene un problema que pasa con Eduar que tiene incidencia en Pantoja, KM13, pues Eduar podria ver solo de su almacen que es principal, pero esto tambien aplica para:
  // -Vladimir
  // -Cristian
  // -Edgar
  // -Junior
  // -etc
  //
  // Para ello cree esta llamada que lo que hace es verificar que usuario tiene configurado poder ver las solicitudes otro almacen
  const [listaConfi, setListaConfig] = useState([]);
  const useDocLlamadaForConfig = () => {
    const userAuth = useAuth().usuario;

    const [usuario, setUsuario] = useState(userAuth);
    useEffect(() => {
      const collectionName = "transferRequest";
      // Este condicional es para que si el usuario ya descargo la base de datos pues que no vuelva a cargar, aunque el componente de desmonte y se vuelva a montar

      if (userMaster) {
        // return;
        console.log("DB 😐😐😐😐😐" + collectionName);
        const fechaActualES6 = new Date();
        const fechaAyerES6 = new Date(fechaActualES6);

        const isMonday = fechaActualES6.getDay() === 1;
        if (isMonday == false) {
          fechaAyerES6.setDate(fechaActualES6.getDate() - 1);
        } else if (isMonday == true) {
          fechaAyerES6.setDate(fechaActualES6.getDate() - 2);
        }
        const fechaActualString = ES6AFormat(fechaActualES6).slice(0, 10);
        // const fechaAyerString = ES6AFormat(fechaAyerES6).slice(0, 10);
        let q;

        if (true) {
          q = query(
            collection(db, collectionName),
            and(
              where(
                "forQueryDB.almacenes",
                "array-contains-any",
                userMaster?.config?.almacenesViewRequest.length > 0
                  ? userMaster?.config?.almacenesViewRequest
                  : // Este string es un string random y lo coloque porque cuando el array esta vacio ocurre algo no esperado:
                    // 1-En esta funcion Caeloss llama las solicitudes comparando dos array, el de la solicitudes que continiene los almacenes involucrados y el del usuario que contiene los almacens que el tiene privilegio de ver, por ejemplo eduar debe poder ver todo lo de : principal, pantoja y km13
                    // Por tanto es una comparacion de dos array
                    // 2-El array de la solicitud si por algun error tiene un elemento vacio asi "" entonces los usuarios que no tengan nada en su array podran ver esta solicitud, si en la llamada el array tambien es un array vacio aunque no tenga nada ni siquiera el "" como quiera lo llama, pero si coloco un codigo random entonces la comparacion da negativo
                    ["X_Plkokhj"]
              ),
              or(
                where("estadoDoc", "<", 3),
                where("fechaReqCorta", "==", fechaActualString)
              )
            )
          );
        }
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
          const coleccion = [];
          querySnapshot.forEach((doc) => {
            coleccion.push({ ...doc.data(), id: doc.id });
          });
          setListaConfig(coleccion);
        });

        // Limpieza de la escucha al desmontar
        return () => unsubscribe();
        // }
      }
    }, [usuario, userMaster]);
  };

  useDocLlamadaForConfig("transferRequest", setListaConfig, "");

  // ***************** UseEffect Inicial *****************
  const [listaSolicitudes, setListaSolicitudes] = useState([]);
  const [listaSolicitudesInitial, setListaSolicitudesInitial] = useState([]);

  useEffect(() => {
    const listaCompleta = [
      ...listaComplementaria,
      ...dbTransferRequest,
      ...listaConfi,
    ];

    const listaSort = listaCompleta.sort((a, b) => {
      return Number(a.numeroDoc) - Number(b.numeroDoc);
    });

    const sinRepetidos = listaSort.filter(
      (obj, index, self) => index === self.findIndex((o) => o.id === obj.id)
    );
    const listaParsed = sinRepetidos.filter((req) => {
      let proceder = true;
      if (req.datosSolicitante.userName == "jperez") {
        if (userMaster.userName != "jperez") {
          proceder = false;
        }
      }
      if (proceder) {
        return req;
      }
    });

    setListaSolicitudes([...listaParsed]);
    setListaSolicitudesInitial([...listaParsed]);

    // Este codigo es para que si el usuario coloco algun filtro, y otro usuario afecta la base de datos, pues en la cargada inicial estara de acuerdo a los filtros
    let eventoAux = {
      target: {
        name: "null",
        value: "null",
      },
    };

    handleFiltros(eventoAux, listaParsed);
  }, [dbTransferRequest, listaComplementaria, listaConfi]);

  //
  // ********* FUNCION MANEJADORA DE FILTROS *********
  const handleFiltros = (e, arrayReset) => {
    let name = "";
    let value = "";
    if (e) {
      name = e.target.name;
      value = e.target.value;
    }
    let arrayAux = arrayReset ? arrayReset : listaSolicitudesInitial;
    let entradaMaster = value.toLowerCase();

    if (name == "valueSearch") {
      setValueSearch(value);
    } else if (name == "valueStatus") {
      setValueStatus(entradaMaster);
    } else if (name == "valueTipo") {
      setValueTipo(entradaMaster);
    } else if (name == "valueAlmacen") {
      setValueAlmacenSalida(entradaMaster);
    }
    // else if (name == "valueMiSolicitud") {
    //   setMiSolicitud(
    //     valueMiSolicitud.map((opcion, index) => {
    //       return {
    //         ...opcion,
    //         select: index == entradaMaster,
    //       };
    //     })
    //   );
    // }

    const filtroSeach = () => {
      // datos filtrar solicitud
      // numero solicitud
      // nombre y apellido solicitante
      // departamenteo solicitante
      // socio negocio
      // personas de contacto
      // numero proyecto
      // numeros de documentos
      // detalles
      // municio destino
      // provincia destino
      // nombre y apellido chofer
      //
      //
      //
      let entradaUsar = entradaMaster;

      if (name == "valueSearch") {
        if (entradaUsar == "") {
          return "";
        }
      } else {
        entradaUsar = valueSearch;
      }
      const nuevoArray = arrayAux.filter((req) => {
        // *** Datos solicitud ***
        const nombreCompleto =
          req.datosSolicitante.nombre + " " + req.datosSolicitante.apellido;
        let incluir = false;

        // Documentos
        req.datosReq.documentos.forEach((doc) => {
          if (doc.numeroDoc.toLowerCase().includes(entradaUsar)) {
            incluir = true;
          }
        });
        // Persona de contacto
        req.datosReq.personasContacto.forEach((contact) => {
          if (
            contact.nombre.toLowerCase().includes(entradaUsar) ||
            contact.telefono.toLowerCase().includes(entradaUsar) ||
            contact.rol.toLowerCase().includes(entradaUsar)
          ) {
            incluir = true;
          }
        });

        if (
          req.numeroDoc.toString().includes(entradaUsar) ||
          req.datosReq.socioNegocio.toLowerCase().includes(entradaUsar) ||
          req.datosFlete?.provinciaSeleccionada?.municipioSeleccionado?.label
            .toLowerCase()
            .includes(entradaUsar) ||
          req.datosFlete?.provinciaSeleccionada?.label
            .toLowerCase()
            .includes(entradaUsar) ||
          req.datosReq.detalles.toLowerCase().includes(entradaUsar) ||
          nombreCompleto.toLowerCase().includes(entradaUsar) ||
          req.datosReq.numeroProyecto.toLowerCase().includes(entradaUsar) ||
          req.datosSolicitante.dpto.toLowerCase().includes(entradaUsar) ||
          incluir == true
        ) {
          return req;
        }

        // Datos chofer
        if (req?.datosEntrega?.chofer?.idChofer) {
          const nombreCompletoChofer =
            req?.datosEntrega?.chofer?.nombre +
            " " +
            req?.datosEntrega?.chofer?.apellido;

          if (nombreCompletoChofer.toLowerCase().includes(entradaUsar)) {
            return req;
          }
        }
      });
      arrayAux = nuevoArray;
    };

    const filtroStatus = () => {
      let entradaUsar = entradaMaster;
      if (name != "valueStatus") {
        entradaUsar = valueStatus;
      }

      let valorDefault = false;
      if (
        entradaUsar == "" ||
        entradaUsar == 0 ||
        entradaUsar == " " ||
        entradaUsar == "todos"
      ) {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }
      const arrayNuevo = arrayAux.filter((req) => {
        if (valorDefault) {
          return req;
        } else {
          const opcionSelect = StyleTextStateReq.find(
            (opcion) => opcion.numero == req.estadoDoc
          );
          if (opcionSelect) {
            const opcionMinus = opcionSelect.codigo.toLowerCase();
            if (opcionMinus == entradaUsar) {
              return req;
            }
          }
        }
      });
      arrayAux = arrayNuevo;
    };
    const filtroTipo = () => {
      let entradaUsar = entradaMaster;
      if (name != "valueTipo") {
        entradaUsar = valueTipo;
      }

      let valorDefault = false;
      if (entradaUsar == "todos" || entradaUsar == "") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }

      const arrayNuevo = arrayAux.filter((req) => {
        if (valorDefault) {
          return req;
        } else {
          const opcionSelect = StyleTextTypeReq.find(
            (opcion) => opcion.numero == req.tipo
          );
          if (opcionSelect) {
            const opcionMinus = opcionSelect.codigo.toLowerCase();
            if (opcionMinus == entradaUsar) {
              return req;
            }
          }

          if (req.tipo == entradaUsar) {
            return req;
          }
        }
      });
      arrayAux = arrayNuevo;
    };
    const filtroAlmacenSalida = () => {
      let entradaUsar = entradaMaster;
      if (name != "valueAlmacen") {
        entradaUsar = valueAlmaceSalida;
      }

      let valorDefault = false;
      if (entradaUsar == "todos" || entradaUsar == "") {
        valorDefault = true;
      }

      if (valorDefault) {
        return;
      }

      const arrayNuevo = arrayAux.filter((req) => {
        if (valorDefault) {
          return req;
        } else {
          // Una solicitud puede tener varios almacenes de salida, por lo que se debe filtrar por el tipo de almacen
          const codeAlmacenesThisReq = req.datosReq.documentos.map((doc) =>
            doc.bodega.toLowerCase()
          );

          const hasThisAlmace = codeAlmacenesThisReq.includes(
            entradaUsar.toLowerCase()
          );
          if (hasThisAlmace) {
            return req;
          }
        }
      });
      arrayAux = arrayNuevo;
    };

    filtroSeach();
    filtroStatus();
    filtroTipo();
    filtroAlmacenSalida();
    setListaSolicitudes([...arrayAux]);
  };

  const [hasEncontrar, setHasEncontrar] = useState(false);
  const mostrarVentanaEncontrar = (e) => {
    setHasEncontrar(true);
  };
  // ***************** CONTROLES / FILTROS ********************

  const [controles, setControles] = useState({
    search: {
      nombre: "Buscar",
      name: "valueSearch",
      active: true,
    },
    menuDesplegable: [
      {
        nombre: "Status",
        name: "valueStatus",

        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: true,
          },
          ...StyleTextStateReq.map((option, index) => ({
            ...option,
            opcion: option.codigo,
            descripcion: option.texto,
            select: false,
          })),
        ],
      },
      {
        nombre: "Tipo",
        active: true,
        disabled: false,

        name: "valueTipo",

        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: false,
          },
          ...StyleTextTypeReq.map((option, index) => ({
            ...option,
            opcion: option.codigo,
            descripcion: option.texto,
            select: false,
          })),
        ],
      },
      {
        nombre: "Almacen Salida",
        active: true,
        disabled: false,

        name: "valueAlmacen",

        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: false,
          },
          ...localidadesAlmacen.map((option, index) => ({
            ...option,
            opcion: option.codigoInterno,
            descripcion: option.nombreSucursalOrigen,
            select: false,
          })),
        ],
      },
    ],

    btns: [
      {
        texto: "Encontrar",
        // funcion: handleFiltros,
        tipo: "btnEncontrar",
        icono: true,
        visible: true,
        disabled: false,
        title: "",
      },
    ],
  });
  //
  //
  //
  // ***************** ACCIONADOR ********************
  const [hasAccion, setHasAccion] = useState(false);
  const initialPropsConfigEstado = {
    tipo: "",
    semana: false,
    chofer: false,
    fecha: false,
    justificacion: false,
  };
  const [propsConfigEstado, setPropsConfigEstado] = useState({
    ...initialPropsConfigEstado,
  });
  const btnCongloGen = {
    texto: "Estados",
    tipo: "btnEstados",
    icono: true,
    visible: true,
    disabled: false,
    title: "",
  };

  const handleEstados = (e) => {
    const { name } = e.target;

    const nameDataset = e.target.dataset.name;
    if (nameDataset == "cerrar") {
      setHasAccion(false);
      setPropsConfigEstado(initialPropsConfigEstado);
    } else {
      setHasAccion(true);
    }

    const idDoc = e.target.dataset.id;
    const solicitudAfectar = listaSolicitudes.find(
      (solicitud) => solicitud.id == idDoc
    );

    ManejadorJSEstados(
      name,
      initialPropsConfigEstado,
      setPropsConfigEstado,
      solicitudAfectar,
      userMaster
    );
  };

  return (
    <ContainerMaster>
      <BotonQuery
        // controles={controles}
        userMaster={userMaster}
        dbTransferRequest={dbTransferRequest}
        listaSolicitudes={listaSolicitudes}
        listaSolicitudesInitial={listaSolicitudesInitial}
      />
      <ContainerControles>
        <ControlesTablas
          titulo={
            reqActivasTodas == "misSolicitudes"
              ? "Mis solicitudes activas"
              : reqActivasTodas == "todas"
                ? "Solicitudes activas"
                : ""
          }
          controles={controles}
          tipo={"reqTransport"}
          // FILTROS
          handleFiltros={handleFiltros}
          handleControles={mostrarVentanaEncontrar}
          setValueSearch={setValueSearch}
          setValueStatus={setValueStatus}
          setValueTipo={setValueTipo}
          valueSearch={valueSearch}
          valueStatus={valueStatus}
          valueTipo={valueTipo}
          // valueMiSolicitud={valueMiSolicitud}
        />
      </ContainerControles>
      {hasAccion && (
        <EjecutorJSXEstados
          tipo={"enCard"}
          setHasAccion={setHasAccion}
          propsConfigEstado={propsConfigEstado}
          setPropsConfigEstado={setPropsConfigEstado}
          handleEstados={handleEstados}
          setDBChoferes={setDBChoferes}
          dbChoferes={dbChoferes}
          // Pagos
          congloPagosInternos={congloPagosInternos}
          setCongloPagosInternos={setCongloPagosInternos}
          congloPagosExtInd={congloPagosExtInd}
          setCongloPagosExtInd={setCongloPagosExtInd}
          congloPagosExtEmp={congloPagosExtEmp}
          setCongloPagosExtEmp={setCongloPagosExtEmp}
          userMaster={userMaster}
        />
      )}
      <ContainerCard>
        {listaSolicitudes
          .sort((a, b) => a.estadoDoc - b.estadoDoc)
          .map((request, index) => {
            return (
              <CardReq
                key={index}
                userMaster={userMaster}
                numero={index}
                dbUsuarios={dbUsuarios}
                request={request}
                handleEstados={handleEstados}
              />
            );
          })}
      </ContainerCard>
      {hasEncontrar && (
        <EncontrarReq
          hasEncontrar={hasEncontrar}
          setHasEncontrar={setHasEncontrar}
          userMaster={userMaster}
        />
      )}
    </ContainerMaster>
  );
};
const ContainerMaster = styled.div`
  position: relative;
`;
const ContainerControles = styled.div`
  margin-bottom: 5px;
`;
const ContainerCard = styled.div`
  padding: 0 10px;
`;
