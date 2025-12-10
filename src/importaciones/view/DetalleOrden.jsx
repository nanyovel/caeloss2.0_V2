import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { NavLink, useNavigate, useParams } from "react-router-dom";
import {
  addDoc,
  collection,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "paste-from-excel";
import { faEdit, faLock, faUnlock } from "@fortawesome/free-solid-svg-icons";
import { TablaMultiDespachos } from "../Tablas/TablaMultiDespachos";
import db from "../../firebase/firebaseConfig";
import { Alerta } from "../../components/Alerta";
import { CSSLoader } from "../../components/CSSLoader";
import { ControlesTabla } from "../components/ControlesTabla";
import { ModalLoading } from "../../components/ModalLoading";
import { BotonQuery } from "../../components/BotonQuery";
import {
  fetchDocsByConditionGetDocs,
  useDocByCondition,
  useDocById,
} from "../../libs/useDocByCondition.js";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import {
  InputSimpleEditable,
  TextArea,
} from "../../components/InputGeneral.jsx";
import { DataTableOrden } from "../libs/DataTableOrden.js";
import { OrdenParsedConDespDB } from "../libs/OrdenParsedConDespDB.js";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { DestinatariosCorreo } from "../../components/DestinatariosCorreo.jsx";
import { Interruptor } from "../../components/Interruptor.jsx";
import { ES6AFormat, inputAES6 } from "../../libs/FechaFormat.jsx";

import { notificacionesDBSchema } from "../../models/notificacionesDBSchema.js";
import { TodosLosCorreosCielosDB } from "../../components/corporativo/TodosLosCorreosCielosDB.js";
import Xcerrar from "../../components/JSXElements/Xcerrar.jsx";
import { BtnGeneralButton } from "../../components/BtnGeneralButton.jsx";
import { puntoFinal, soloNumeros } from "../../libs/StringParsed.jsx";
import { qtyDisponiblePartida } from "../libs/qtyDisponiblePartidaOrden.js";

export const DetalleOrden = ({ userMaster }) => {
  const navigate = useNavigate();
  //********************* CARGAR EL ESTADO GLOBAL (BILL OF LADING ABIERTOS)************************** */
  const [counterDoc, setCounterDoc] = useState([]);
  useDocById("counters", setCounterDoc, "counterDocSAP");

  const parametro = useParams();
  const docUser = parametro.id;
  const [ordenesDB, setOrdenesDB] = useState([]);
  const listaDocs = useDocByCondition(
    "ordenesCompra2",
    setOrdenesDB,
    "numeroDoc",
    "==",
    docUser
  );

  // // ******************** SELECIONANDO DOCUMENTO DESEADO ******************** //
  const initialValueOCMaster = { none: true, materiales: [] };
  const [ocMaster, setOCMaster] = useState(initialValueOCMaster);
  const [ocEditable, setOCEditable] = useState({});
  const [docEncontrado, setDocEncontrado] = useState(false);
  useEffect(() => {
    if (ordenesDB.length > 0) {
      const ordenDB = ordenesDB[0];

      (async () => {
        // const ordenParsedAux = await OrdenParsedConDespDB(ordenDB);

        const ordenParsedAux = await OrdenParsedConDespDB(ordenDB);
        console.log(ordenParsedAux);
        setOCEditable(ordenParsedAux);
        setOCMaster(ordenParsedAux);
        setDocEncontrado(true);
      })();
    }
  }, [ordenesDB]);

  // // ******************** RECURSOS GENERALES ******************** //
  const [isLoading, setIsLoading] = useState(false);

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // // ******************** CODIGO PARA EL HANDLEPASTE ******************** //
  const [label, setlabel] = useState({
    labels: [
      "n",
      "codigo",
      "descripcion",
      "qty",
      "comentarios",
      "qtyDisponible",
      "qtyTotalDespachada",
      "despachos",
    ],
  });
  const [initialValue, setInitialValue] = useState({
    inputs: [...DataTableOrden],
  });

  const [inputvalue, setInputvalue] = useState({ ...initialValue });

  const handlePaste = (index, elm, e, i) => {
    return parse(e);
  };

  const handlePaste1 = (index, elm, e, i) => {
    setInputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) =>
        index === i
          ? {
              ...item,
              [elm]: e.target.value,
            }
          : item
      ),
    }));
  };
  // // ************************* VISUALIZACION ***************************** //
  const tablaDespachos = useRef(null);
  const [hasDespachos, setHasDespachos] = useState(false);
  const [nClases, setNClases] = useState([]);

  const [despachosDB, setDespachosDB] = useState([]);
  const [indexDespSelect, setIndexDespSelect] = useState(null);
  const mostrarDespacho = (e) => {
    let index = Number(e.target.dataset.id);
    const despachosDB = [...ocMaster.materiales[index].valoresAux.despachosDB];
    setIndexDespSelect(index);
    if (despachosDB.length > 0) {
      setDespachosDB(despachosDB);
      setHasDespachos(true);
      setTimeout(() => {
        tablaDespachos.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
      let newNClases = [];
      newNClases[index] = "filaSelected";
      setNClases(newNClases);
    } else {
      setNClases([]);
      setMensajeAlerta("Este item aun no posee entregas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
  };

  // // ******************  EDICION ORDEN DE COMPRA ************************** //
  const initialValueOCEditable = {
    numeroDoc: "",
    proveedor: "",
    comentarios: "",
    fechaCreacion: "",
    materiales: [],
  };

  const [cambiosNumDoc, setCambiosNumDoc] = useState(false);

  const handleInputCabecera = (e) => {
    const { name, value } = e.target;

    if (name == "numeroDoc") {
      setOCEditable((prevState) => ({
        ...prevState,
        numeroDoc: value.trim().toUpperCase(),
      }));
      //
      if (ocMaster.numeroDoc !== value) {
        setCambiosNumDoc(true);
      } else {
        setCambiosNumDoc(false);
      }
    } else {
      setOCEditable((prevEstado) => ({
        ...prevEstado,
        [name]: value,
      }));
    }
  };

  const [isEditando, setIsEditando] = useState(false);

  const editar = () => {
    if (
      isEditando == true ||
      docEncontrado == false ||
      ocMaster.estadoDoc == 2
    ) {
      return "";
    } else if (isEditando == false) {
      setInputvalue((prevEstado) => ({
        ...prevEstado,
        inputs: [
          ...ocMaster.materiales.map((item) => {
            return {
              ...item,
            };
          }),
          ...initialValue.inputs,
        ],
      }));

      setOCEditable({ ...ocMaster });

      setIsEditando(true);
      setHasDespachos(false);

      setNClases([]);
      setHasDespachos(false);
    }
  };

  // // *************************  GUARDAR CAMBIOS *************************** //

  const guardarCambios = async () => {
    let validacion = {
      // -----Cabecera-----
      noExiste: true,
      ordenSinEspacios: true,
      hasNumero: true,
      hasProveedor: true,

      // -----Tabla-----
      filasCompletas: true,
      codigoSinEspacios: true,
      soloNumeros: true,
      hasUnique: true,
      hasItems: true,
    };

    // ************** VALIDACIONES CABECERA **************

    // Si el numero de orden ya existe
    // Este bloque de codigo no se necesita, dado que en adelante el numero de orden de
    // compra no sera editable, de esta manera hay un gran ahorro de problemas
    // Este bloque de codigo nunca deberia ocurrir, dado que el input de numero de orden, no esta editable
    const numExist = counterDoc.ordenesCompra.includes(
      ocEditable.numeroDoc.toLowerCase()
    );
    if (numExist) {
      if (ocEditable.numeroDoc != ocMaster.numeroDoc) {
        setMensajeAlerta(
          "El numero de orden de compra ya existe en la base de datos."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // Si el numero de orden tiene espacios
    if (
      ocEditable.numeroDoc.includes(" ") ||
      ocEditable.numeroDoc.includes("\n")
    ) {
      validacion.ordenSinEspacios = false;
      setMensajeAlerta(
        "El numero de orden de compra no puede contener espacios."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si no coloco numero de orden de compra
    if (ocEditable.numeroDoc == "") {
      validacion.hasNumero = false;
      setMensajeAlerta("Colocar numero de orden de compra.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // Si no coloco proveedor
    if (ocEditable.proveedor == "") {
      validacion.hasProveedor = false;
      setMensajeAlerta("Colocar nombre de proveedor.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ************** VALIDACIONES TABLA **************

    // Mapeo a tabla
    const itemsTabla = new Set();
    inputvalue.inputs.forEach((item, index) => {
      if (
        item.codigo !== "" ||
        item.descripcion !== "" ||
        item.qty !== "" ||
        item.comentarios !== ""
      ) {
        // Si alguna fila tiene datos, pero esta incompleta
        if (item.codigo == "" || item.descripcion == "" || item.qty == "") {
          validacion.filasCompletas = false;
          setMensajeAlerta(`Complete fila N° ${index + 1} o elimine sus datos`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return "";
        }
        // Si algun item tiene letras en lugar de numero en la columna cantidad
        let expReg = /^[\d.]{0,1000}$/;
        if (expReg.test(item.qty) == false) {
          validacion.soloNumeros = false;
          setMensajeAlerta(
            `Cantidad incorrecta para el item de la fila N° ${index + 1}.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          return "";
        }
        //  Si algun codigo tiene espacios
        if (item.codigo.includes(" ") || item.codigo.includes("\n")) {
          validacion.codigoSinEspacios = false;
          setMensajeAlerta(
            `La celda código de la fila ${index + 1} contiene espacios.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }

        //  Si algun item esta mas de una vez
        if (itemsTabla.has(item.codigo)) {
          validacion.hasUnique = false;
          setMensajeAlerta(`El item de la fila ${index + 1} esta duplicado.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        } else {
          itemsTabla.add(item.codigo);
        }
      }
    });

    // Extraer Materiales filtrados, solo las filas que tengan item y a los articulos del inputs colocarle un array en su propiedad despacho VERY IMPORTANT!!!
    const materialesParsed = inputvalue.inputs.filter((item) => {
      if (item.codigo !== "" && item.descripcion !== "" && item.qty !== "") {
        return item;
      }
    });

    // Si no existen filas completas
    if (materialesParsed.length == 0) {
      validacion.hasItems = false;
      setMensajeAlerta("Por favor agregar item a la tabla.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }

    // ***** Si todo esta correcto *****
    if (
      // -----Cabecera------
      validacion.noExiste == true &&
      validacion.ordenSinEspacios == true &&
      validacion.hasNumero == true &&
      validacion.hasProveedor == true &&
      // -----Tabla------
      validacion.filasCompletas == true &&
      validacion.soloNumeros == true &&
      validacion.codigoSinEspacios == true &&
      validacion.hasUnique == true &&
      validacion.hasItems == true
    ) {
      // Si todo esta correcto
      // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
      setIsLoading(true);

      const newOCEditable = {
        ...ocEditable,
        arrayItems: materialesParsed.map((item) => item.codigo),
        materiales: materialesParsed.map((item) => {
          return {
            ...item,
            qty: Number(item.qty),
            comentarioOrden: ocEditable.comentarios,
          };
        }),
      };
      // Cargar DB
      try {
        const batch = writeBatch(db);
        // 🟢🟢🟢🟢🟢********* ACTUALIZAR CONTADOR *************🟢🟢🟢🟢🟢

        const contadorNumeroDocId = "counterDocSAP";
        const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
        const counterFiltrado = counterDoc.ordenesCompra.filter(
          (num) => num.toLowerCase() != ocMaster.numeroDoc.toLowerCase()
        );

        batch.update(contadorUpdate, {
          ordenesCompra: [
            ...counterFiltrado,
            newOCEditable.numeroDoc.toLowerCase(),
          ],
        });

        // 🟢🟢🟢🟢🟢********* ACTUALIZAR ORDEN DE COMPRA *************🟢🟢🟢🟢🟢
        const ordenActualizar = doc(db, "ordenesCompra2", newOCEditable.id);
        const ordenParsedAux = await OrdenParsedConDespDB(newOCEditable);
        batch.update(ordenActualizar, ordenParsedAux);

        // 🟢🟢🟢🟢🟢********* CONFIRMACION *************🟢🟢🟢🟢🟢*
        await batch.commit();

        setIsLoading(false);
        setMensajeAlerta("Orden actualizada correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);

        // Si el usuario modifico el numero de documento, el cual afecta la URL, entonces que valla a la raiz de detalle orden de compra
        if (cambiosNumDoc == true) {
          setTimeout(() => {
            navigate(
              "/importaciones/maestros/ordenescompra/" +
                ordenParsedAux.numeroDoc
            );
          }, 500);
        }
      } catch (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 7000);
        setIsLoading(false);
      }
      setOCEditable(initialValueOCEditable);
      setInputvalue(initialValue);
      setIsEditando(false);
      setHasDespachos(false);
      setNClases([]);
    }
  };

  // // *************************  CANCELAR EDICION *************************** //
  const cancelar = () => {
    setIsEditando(false);
  };

  // // ************************** LIMPIAR TABLA ************************** //
  const limpiarTabla = () => {
    setInputvalue({ ...initialValue });
  };

  // ************************** DESTINATARIOS DE NOTIFICACIONES ************************** //

  const initiaValueDest = {
    nombre: "",
    correo: "",
  };
  const [hasModal, setHasModal] = useState(false);

  const [notificacionThisOrden, setNotificacionThisOrden] = useState({
    ...notificacionesDBSchema,
  });

  const llamarThisNotifi = async (force) => {
    const notiThisOrden = await fetchDocsByConditionGetDocs(
      "notificaciones",
      undefined,
      "idDoc",
      "==",
      ocMaster.id
    );

    if (notiThisOrden.length > 0) {
      if (force || !notificacionThisOrden.id) {
        const item = notiThisOrden[0];
        setNotificacionThisOrden({ ...item });
        return item;
      } else {
        return notificacionThisOrden;
      }
    } else {
      return notificacionesDBSchema;
    }
  };
  useEffect(() => {
    if (userMaster?.correo && ocMaster?.numeroDoc) {
      (async () => {
        const thisNotificacion = await llamarThisNotifi();
        if (thisNotificacion) {
          const hasExiste = thisNotificacion?.destinatarios.find(
            (noti) => noti.correo == userMaster.correo
          );
          setIsFollowing(hasExiste);
        } else {
          setIsFollowing(false);
        }
      })();
    }
  }, [userMaster, ocMaster, notificacionThisOrden]);
  const mostrarModalNoti = async () => {
    const docBuscado = await llamarThisNotifi();

    setNotificacionThisOrden(docBuscado);

    setHasModal(true);
  };
  const addDestinatario = (e) => {
    const { name, value } = e.target;
    if (notificacionThisOrden) {
      if (name == "add") {
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: [
            ...notificacionThisOrden.destinatarios,
            initiaValueDest,
          ],
        });
      } else {
        if (notificacionThisOrden.destinatarios.length > 2) {
          setNotificacionThisOrden({
            ...notificacionThisOrden,
            destinatarios: notificacionThisOrden.destinatarios.slice(0, -1),
          });
        }
      }
    } else {
      if (name == "add") {
        setNotificacionThisOrden({ ...notificacionesDBSchema });
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
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: notificacionThisOrden.destinatarios.map(
            (desti, index) =>
              index === indexDataset
                ? { ...desti, nombre: value, correo: usuarioFind.correo }
                : desti
          ),
        });

        return;
      }
    } else if (name == "correo") {
      usuarioFind = listaUsuarios.find((user) => {
        if (user.correo == value) {
          return user;
        }
      });

      if (usuarioFind) {
        setNotificacionThisOrden({
          ...notificacionThisOrden,
          destinatarios: notificacionThisOrden.destinatarios.map(
            (desti, index) =>
              index === indexDataset
                ? { ...desti, nombre: usuarioFind.nombre, correo: value }
                : desti
          ),
        });

        return;
      }
    }
    setNotificacionThisOrden({
      ...notificacionThisOrden,
      destinatarios: notificacionThisOrden.destinatarios.map((desti, index) =>
        index === indexDataset ? { ...desti, [name]: value } : desti
      ),
    });
  };
  const crearNuevoDocNoti = async (interruptor) => {
    const thisDestinatario = {
      nombre: userMaster.nombre + " " + userMaster.apellido,
      correo: userMaster.correo,
    };
    try {
      await addDoc(collection(db, "notificaciones"), {
        ...notificacionThisOrden,
        tipoDoc: "ordenCompraSGI",
        idDoc: ocMaster.id,
        createdAd: ES6AFormat(new Date()),
        createdBy: userMaster.userName,
        destinatarios: interruptor
          ? [thisDestinatario]
          : notificacionThisOrden.destinatarios,
        numOrigenDoc: ocMaster.numeroDoc,
      });
      return true;
    } catch (error) {
      console.log(error);

      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return false;
    }
  };
  const guardarDestinatario = async () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let proceder = true;
    notificacionThisOrden.destinatarios.forEach((detino, index) => {
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
      try {
        setIsLoading(true);

        // Si la notificacion existe, entonces actualizala,

        if (notificacionThisOrden.id) {
          const notiActualizar = doc(
            db,
            "notificaciones",
            notificacionThisOrden.id
          );
          const destinatarioFilter = notificacionThisOrden.destinatarios.filter(
            (desti) => desti.correo != ""
          );
          await updateDoc(notiActualizar, {
            destinatarios: destinatarioFilter,
          });
          setNotificacionThisOrden({
            ...notificacionThisOrden,
            destinatarios: destinatarioFilter,
          });
          const hasUpdate = destinatarioFilter.find(
            (desti) => desti.correo == userMaster.correo
          );
          setIsFollowing(hasUpdate != undefined);
        }
        // Si no existe crea una nueva
        else {
          crearNuevoDocNoti();
        }
        setIsLoading(false);
        setHasModal(false);
        setMensajeAlerta("Cambios guardados correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setHasModal(false);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
  };
  // ************************** SEGUIMIENTO ************************** //
  const [isFollowing, setIsFollowing] = useState(false);

  const handleChangeInterruptor = async (e) => {
    const checK = e.target.checked;
    setIsFollowing(checK);

    try {
      setIsLoading(true);
      const seguiConluido = () => {
        setIsLoading(false);
        setHasModal(false);
        if (checK) {
          setMensajeAlerta("Seguimiento activado.");
        } else {
          setMensajeAlerta("Seguimiento desactivado.");
        }

        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        llamarThisNotifi(true);
      };
      // Si existe el documento de notificaciones actualizado
      const docBuscado = await llamarThisNotifi();
      if (docBuscado.id) {
        // Si no existe crea uno nuevo
        const notiActualizar = doc(db, "notificaciones", docBuscado.id);

        const hasNotifiThisUser = docBuscado.destinatarios.find(
          (destino) => destino.correo == userMaster.correo
        );

        // Si el usuario esta activnado y ademas no existe la notificacion
        // Agregala
        if (checK && !hasNotifiThisUser) {
          const destinatarioParsed = docBuscado.destinatarios.filter((dest) => {
            if (dest.nombre && dest.correo) {
              return { ...dest };
            }
          });
          const nuevaNoti = {
            nombre: userMaster.nombre + " " + userMaster.apellido,
            correo: userMaster.correo,
          };
          await updateDoc(notiActualizar, {
            destinatarios: [...destinatarioParsed, nuevaNoti],
          });
        }

        // Si el usuario esta desactivando y ademas si existe la notificacion
        // Eliminala
        else if (!checK && hasNotifiThisUser) {
          const destinatarioParsed = docBuscado.destinatarios.filter((dest) => {
            if (dest.correo != userMaster.correo) {
              return { ...dest };
            }
          });

          await updateDoc(notiActualizar, {
            destinatarios: [...destinatarioParsed],
          });
        }
        seguiConluido();
      } else {
        const docCreado = await crearNuevoDocNoti(true);
        if (docCreado) {
          seguiConluido();
        }
      }
    } catch (error) {
      setIsLoading(false);
      console.log(error);
      setHasModal(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ******************* Partidas de proyeccion *******************

  const proyeccionRef = useRef(null);
  const [mostrarPartidas, setMostrarPartidas] = useState(false);
  const [modalNuevaPartida, setModalNuevaPartida] = useState(false);
  const activarPartidas = () => {
    if (ocEditable?.partidas) {
      setOCEditable({ ...ocMaster });
    } else {
      setOCEditable({ ...ocMaster, partidas: [] });
    }
    setMostrarPartidas(true);
    setTimeout(() => {
      proyeccionRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const desactivarPartidas = () => {
    setMostrarPartidas(false);
  };

  const agregarPartida = () => {
    const hasPermiso = userMaster.permisos.includes("nuevaPartidaOC");
    if (!hasPermiso) {
      return;
    }
    setValueDatePartida("");
    setModalNuevaPartida(true);
    setValueMatNuevaP(
      ocEditable.materiales.map((item) => {
        return {
          ...item,
          input: "",
        };
      })
    );
  };
  const reducirPartida = async () => {
    const hasPermiso = userMaster.permisos.includes("nuevaPartidaOC");
    if (!hasPermiso) {
      return;
    }
    if (ocEditable.partidas.length > 0) {
      const partidasReducida = ocEditable.partidas.slice(0, -1);

      try {
        const ordenActualizar = doc(db, "ordenesCompra2", ocMaster.id);
        await updateDoc(ordenActualizar, {
          partidas: partidasReducida,
        });
        setOCEditable({
          ...ocEditable,
          partidas: partidasReducida,
        });
        setMensajeAlerta("Partida eliminada.");
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

  //
  // Manejando dentro del modal partida
  const [valueDatePartida, setValueDatePartida] = useState("");
  const [valueMateNuevaP, setValueMatNuevaP] = useState([]);

  const handleInputTablaPartida = (e, item) => {
    const hasPermiso = userMaster.permisos.includes("nuevaPartidaOC");
    if (!hasPermiso) {
      return;
    }
    const { name, value } = e.target;
    const itemFind = ocEditable.materiales.find(
      (producto) => item.codigo == producto.codigo
    );

    if (name == "cantidadItem") {
      if (soloNumeros(value) || puntoFinal(value)) {
        const nuevoMatPart = valueMateNuevaP.map((item) => {
          if (item.codigo == itemFind.codigo) {
            return {
              ...item,
              input: value,
            };
          } else {
            return {
              ...item,
            };
          }
        });

        setValueMatNuevaP(nuevoMatPart);
      }
    }
  };

  // Guardar nueva partida
  const partidaSchema = {
    fechaProyectada: "1",
    materiales: ocMaster.materiales,
  };
  const matPartidaSchema = {
    codigo: "",
    descripcion: "",
    qty: "",
  };
  const guardarNuevaPartida = async () => {
    // si no posee el permiso
    const hasPermiso = userMaster.permisos.includes("nuevaPartidaOC");
    if (!hasPermiso) {
      return;
    }
    // Si no coloco fecha
    if (valueDatePartida == "") {
      setMensajeAlerta("Colocar fecha proyectada.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // la fecha estimada no puede ser anterior a la fecha actual
    const fechaActual = new Date();
    const nuevaFechaES6 = new Date(inputAES6(valueDatePartida));
    if (nuevaFechaES6 < fechaActual) {
      setMensajeAlerta(
        "La fecha indicada debe ser posterior a la fecha actual."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    let sobreCantidad = false;
    const nuevaPartida = {
      ...partidaSchema,
      fechaProyectada: ES6AFormat(nuevaFechaES6),
      materiales: valueMateNuevaP.map((item) => {
        const qtyDisponible = qtyDisponiblePartida(item.codigo, ocEditable);
        // cantidad excede cantidad disponible en codigo tal
        if (qtyDisponible < Number(item.input)) {
          sobreCantidad = true;
          setMensajeAlerta(
            "Cantidad excendente en codigo " + item.codigo + "."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
        }
        return {
          ...matPartidaSchema,
          ...item,
          qty: Number(item.input),
        };
      }),
    };

    if (sobreCantidad) {
      return;
    }

    try {
      const partidasParsed = [...ocEditable.partidas, nuevaPartida];
      const ordenActualizar = doc(db, "ordenesCompra2", ocMaster.id);
      await updateDoc(ordenActualizar, {
        partidas: partidasParsed,
      });
      setMensajeAlerta("Nueva partida guardada.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setModalNuevaPartida(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  return (
    <>
      <CajaEncabezado>
        <CajaDetalles>
          {userMaster?.userName == "jperez" && (
            <Detalle1Wrap>
              <Detalle2Titulo className="corto40-60">Id:</Detalle2Titulo>
              <Detalle3OutPut className="sinAbreviar ancho60-40">
                {ocMaster.id}
              </Detalle3OutPut>
            </Detalle1Wrap>
          )}

          <Detalle1Wrap>
            <Detalle2Titulo>N° Orden Compra:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut title={ocMaster.numeroDoc}>
                {ocMaster.numeroDoc}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="text"
                defaultValue={ocEditable.numeroDoc}
                name="numeroDoc"
                data-guardar="si"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Proveedor:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut title={ocMaster.proveedor}>
                {ocMaster.proveedor}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="text"
                defaultValue={ocEditable.proveedor}
                name="proveedor"
                data-guardar="si"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto vertical">
            <Detalle2Titulo className="vertical">Comentarios:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut className="vertical" title={ocMaster.comentarios}>
                {ocMaster.comentarios}
              </Detalle3OutPut>
            ) : (
              <TextAreaEdit
                type="text"
                defaultValue={ocEditable.comentarios}
                name="comentarios"
                data-guardar="si"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Fecha de creacion:</Detalle2Titulo>
            <Detalle3OutPut>
              {ocMaster.createdAt ? ocMaster.createdAt.slice(0, 10) : ""}
            </Detalle3OutPut>
          </Detalle1Wrap>

          <Interruptor
            texto={"Seguimiento"}
            handleChange={(e) => handleChangeInterruptor(e)}
            isFollowing={isFollowing}
            tipo="ordenCompra"
            disabled={false}
            // disabled={accesoFullIMS ? false : true}
          />
        </CajaDetalles>
        <CajaDetalles
          className={`cajaStatus ${ocMaster.estado == 3 ? "eliminada" : ""}`}
        >
          <TextoStatus
            className={
              isEditando == true
                ? "block"
                : ocMaster.estadoDoc == 0
                  ? "success"
                  : ocMaster.estadoDoc == 1
                    ? "block"
                    : ocMaster.estadoDoc == 2
                      ? "block"
                      : ""
            }
          >
            {isEditando == true ? (
              <>
                Editando O/C... {` `}
                <Icono icon={faEdit} />
              </>
            ) : ocMaster.estadoDoc == 0 ? (
              <>
                O/C Abierta {` `}
                <Icono icon={faUnlock} />
              </>
            ) : ocMaster.estadoDoc == 1 ? (
              <>
                O/C en proceso {` `}
                {/* <Icono icon={faEdit} /> */}
              </>
            ) : ocMaster.estadoDoc == 2 ? (
              <>
                O/C cerrada {` `}
                <Icono icon={faLock} />
              </>
            ) : (
              ""
            )}
          </TextoStatus>
        </CajaDetalles>
      </CajaEncabezado>
      <BotonQuery ocMaster={ocMaster} />
      {userMaster?.permisos?.includes("createDocsIMS") && (
        <ControlesTabla
          isEditando={isEditando}
          docMaster={ocMaster}
          tipo={"ordenCompra"}
          handleInput={handleInputCabecera}
          editar={editar}
          guardarCambios={guardarCambios}
          cancelar={cancelar}
          limpiarTabla={limpiarTabla}
          // Alertas
          setMensajeAlerta={setMensajeAlerta}
          setTipoAlerta={setTipoAlerta}
          setDispatchAlerta={setDispatchAlerta}
          notificacion={true}
          partidas={true}
          mostrarModalNoti={mostrarModalNoti}
          activarPartidas={activarPartidas}
        />
      )}

      <>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Materiales de esta orden de compra
          </TituloEncabezadoTabla>
        </EncabezadoTabla>
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                <CeldaHeadGroup>Qty</CeldaHeadGroup>
                <CeldaHeadGroup className="comentarios">
                  Comentarios
                </CeldaHeadGroup>
                <CeldaHeadGroup>
                  {isEditando ? "Pendiente" : "Qty Pendiente"}
                </CeldaHeadGroup>
                <CeldaHeadGroup>Qty Enviada</CeldaHeadGroup>
                {!isEditando ? <CeldaHeadGroup>Ver Envios</CeldaHeadGroup> : ""}
              </FilasGroup>
            </thead>
            <tbody>
              {isEditando
                ? inputvalue.inputs?.map((item, index) => {
                    return (
                      <FilasGroup key={index} className={"body"}>
                        {label.labels.map((elm, i) => {
                          return (
                            elm != "despachos" && (
                              <CeldasBody
                                key={i}
                                className={
                                  elm == "qtyDisponible" ||
                                  elm == "qtyTotalDespachada"
                                    ? "sinInput"
                                    : ""
                                }
                              >
                                {elm == "codigo" ||
                                elm == "descripcion" ||
                                elm == "qty" ||
                                elm == "comentarios" ? (
                                  <InputCelda2
                                    onInput={(e) => {
                                      handlePaste1(index, elm, e, i);
                                    }}
                                    onPaste={(e) => {
                                      handlePaste(index, elm, e, i);
                                    }}
                                    type="textbox"
                                    className={`celda
                                ${
                                  elm == "n"
                                    ? "disabled"
                                    : elm == "qtyDisponible"
                                      ? "disabled"
                                      : elm == "qtyTotalDespachada"
                                        ? "disabled"
                                        : elm == "despachos"
                                          ? "disabled"
                                          : elm
                                }
                                      `}
                                    name={elm}
                                    data-guardar="si"
                                    articulo={elm}
                                    data-id={index}
                                    data-articulo={elm}
                                    disabled={
                                      elm == "n"
                                        ? true
                                        : elm == "qtyDisponible"
                                          ? true
                                          : elm == "qtyTotalDespachada"
                                            ? true
                                            : elm == "despachos"
                                              ? true
                                              : false
                                    }
                                    value={inputvalue.inputs[index][elm]}
                                  />
                                ) : elm == "n" ? (
                                  index + 1
                                ) : elm == "qtyDisponible" ? (
                                  item.qty > 0 ? (
                                    item.qty -
                                    (item?.valoresAux
                                      ?.cantidadTotalDespachosDB || "")
                                  ) : (
                                    ""
                                  )
                                ) : elm == "qtyTotalDespachada" ? (
                                  item.qty > 0 ? (
                                    item?.valoresAux
                                      ?.cantidadTotalDespachosDB || 0
                                  ) : (
                                    ""
                                  )
                                ) : (
                                  ""
                                )}
                              </CeldasBody>
                            )
                          );
                        })}
                      </FilasGroup>
                    );
                  })
                : docEncontrado &&
                  ocMaster.materiales.map((item, index) => {
                    return (
                      <FilaTable
                        key={index}
                        className={"body SinEditar " + nClases[index]}
                      >
                        {label.labels.map((elm, i) => {
                          return (
                            <CeldasBody
                              key={i}
                              className={elm}
                              title={
                                elm == "comentarios" &&
                                index < ocMaster.materiales.length
                                  ? ocMaster.materiales[index][elm]
                                  : ""
                              }
                            >
                              {index < ocMaster.materiales.length ? (
                                elm == "n" ? (
                                  index + 1
                                ) : elm == "descripcion" ||
                                  elm == "qty" ||
                                  elm == "comentarios" ? (
                                  ocMaster.materiales[index][elm]
                                ) : elm == "codigo" ? (
                                  <Enlaces
                                    to={`/importaciones/maestros/articulos/${encodeURIComponent(ocMaster.materiales[index][elm])}`}
                                    target="_blank"
                                  >
                                    {ocMaster.materiales[index][elm]}
                                  </Enlaces>
                                ) : elm == "qtyDisponible" ? (
                                  parseFloat(
                                    (
                                      item.qty -
                                      (item?.valoresAux
                                        ?.cantidadTotalDespachosDB || 0)
                                    ).toFixed(2)
                                  )
                                ) : elm == "qtyTotalDespachada" ? (
                                  item?.valoresAux?.cantidadTotalDespachosDB ||
                                  0
                                ) : elm == "despachos" ? (
                                  <ParrafoAction
                                    data-id={index}
                                    onClick={(e) => mostrarDespacho(e)}
                                  >
                                    👁️
                                  </ParrafoAction>
                                ) : (
                                  ""
                                )
                              ) : (
                                ""
                              )}
                            </CeldasBody>
                          );
                        })}
                      </FilaTable>
                    );
                  })}
            </tbody>
          </TablaGroup>
        </CajaTablaGroup>
        <br />
        <CajaProyecciones
          ref={proyeccionRef}
          className={mostrarPartidas ? "abierto" : ""}
        >
          {mostrarPartidas && !isEditando && (
            <>
              <EncabezadoTabla>
                <TituloEncabezadoTabla>
                  Proyecciones de llegada a puerto
                </TituloEncabezadoTabla>
                {ocMaster.partidas?.length == 0 ||
                  (!ocMaster.partidas && (
                    <TextoVacio>
                      ~ Esta orden no tiene proyecciones de llegada a puerto. ~
                    </TextoVacio>
                  ))}
                <Xcerrar ejecutarOnclick={desactivarPartidas} />
              </EncabezadoTabla>
              {userMaster.permisos.includes("nuevaPartidaOC") && (
                <CajaBtnsProyecciones>
                  <BtnsSimple onClick={() => agregarPartida()}>+</BtnsSimple>
                  <BtnsSimple onClick={() => reducirPartida()}>-</BtnsSimple>
                </CajaBtnsProyecciones>
              )}

              <CajaTablaGroup>
                <TablaGroup>
                  <thead>
                    <FilasGroup className="cabeza">
                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                      <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                      <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                      <CeldaHeadGroup>Qty</CeldaHeadGroup>
                      {ocEditable.partidas?.map((partidas, index) => {
                        return (
                          <CeldaHeadGroup key={index}>
                            {partidas.fechaProyectada.slice(0, 10)}
                          </CeldaHeadGroup>
                        );
                      })}
                      <CeldaHeadGroup>Restante</CeldaHeadGroup>
                    </FilasGroup>
                  </thead>
                  <tbody>
                    {docEncontrado &&
                      ocEditable.materiales.map((item, index) => {
                        return (
                          <FilaTable
                            key={index}
                            className={"body SinEditar " + nClases[index]}
                          >
                            <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                            <CeldasBodyGroup>
                              <Enlaces
                                to={`/importaciones/maestros/articulos/${encodeURIComponent(item.codigo)}`}
                                target="_blank"
                              >
                                {item.codigo}
                              </Enlaces>
                            </CeldasBodyGroup>
                            <CeldasBodyGroup className="startText">
                              {item.descripcion}
                            </CeldasBodyGroup>
                            <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>

                            {ocEditable?.partidas
                              ?.flatMap((partida, index) => {
                                return partida.materiales;
                              })
                              .filter((produc, index) => {
                                if (produc.codigo == item.codigo) {
                                  return item;
                                }
                              })
                              .map((item, index) => {
                                return (
                                  <CeldasBodyGroup key={index + "a"}>
                                    {item.qty}
                                  </CeldasBodyGroup>
                                );
                              })}
                            <CeldasBodyGroup>
                              {qtyDisponiblePartida(item.codigo, ocEditable)}
                            </CeldasBodyGroup>
                          </FilaTable>
                        );
                      })}
                  </tbody>
                </TablaGroup>
              </CajaTablaGroup>
            </>
          )}
        </CajaProyecciones>
      </>

      {hasDespachos ? (
        <TablaMultiDespachos
          tablaDespachos={tablaDespachos}
          setHasDespachos={setHasDespachos}
          setNClases={setNClases}
          despachosDB={despachosDB}
          indexDespSelect={indexDespSelect}
          materialesOrden={ocMaster.materiales}
        />
      ) : (
        ""
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {hasModal && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={"Destinatarios de notificaciones"}
        >
          <ContenidoModal>
            <DestinatariosCorreo
              modoDisabled={false}
              arrayDestinatarios={notificacionThisOrden?.destinatarios || []}
              addDestinatario={addDestinatario}
              handleInputDestinatario={handleInputDestinatario}
              guardarDestinatario={guardarDestinatario}
            />
          </ContenidoModal>
        </ModalGeneral>
      )}
      {modalNuevaPartida && (
        <ModalGeneral
          setHasModal={setModalNuevaPartida}
          titulo={"Nueva partida"}
          childrenFooter={
            <BtnsSimple onClick={() => guardarNuevaPartida()}>
              Guardar
            </BtnsSimple>
          }
        >
          <CajaNuevaPartida>
            <BotonQuery
              ocEditable={ocEditable}
              valueMateNuevaP={valueMateNuevaP}
            />
            <WrapInputPartida>
              <TituloInputPartida>Fecha estimada</TituloInputPartida>
              <InputPartida
                type="date"
                onChange={(e) => setValueDatePartida(e.target.value)}
                value={valueDatePartida}
              />
            </WrapInputPartida>
            <CajaTablaGroup>
              <TablaGroup>
                <thead>
                  <FilasGroup className="cabeza">
                    <CeldaHeadGroup>N°</CeldaHeadGroup>
                    <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                    <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                    <CeldaHeadGroup>Qty total</CeldaHeadGroup>
                    <CeldaHeadGroup title="Cantidad restante">
                      Qty rest.
                    </CeldaHeadGroup>
                    <CeldaHeadGroup>Qty nueva</CeldaHeadGroup>
                  </FilasGroup>
                </thead>
                <tbody>
                  {ocEditable.materiales.map((item, index) => {
                    return (
                      <FilasGroup key={index + "bh"} className="body">
                        <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                        <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                        <CeldasBodyGroup className="startText">
                          {item.descripcion}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {qtyDisponiblePartida(item.codigo, ocEditable)}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          <InputEdit2
                            name="cantidadItem"
                            data-codigo={item.codigo}
                            onChange={(e) => handleInputTablaPartida(e, item)}
                            value={
                              valueMateNuevaP.find((articulo) => {
                                if (articulo.codigo == item.codigo) {
                                  return articulo;
                                }
                              }).input
                            }
                          />
                        </CeldasBodyGroup>
                      </FilasGroup>
                    );
                  })}
                </tbody>
              </TablaGroup>
            </CajaTablaGroup>
          </CajaNuevaPartida>
        </ModalGeneral>
      )}

      {isLoading ? <ModalLoading completa={true} /> : ""}
    </>
  );
};

const FilaTable = styled(FilasGroup)`
  &.filaSelected {
    background-color: ${ClearTheme.complementary.warning};
    color: black;
  }
`;
const CeldasBody = styled.td`
  border: 1px solid black;
  font-size: 0.9rem;
  height: 25px;
  text-align: center;

  &.numero {
    width: 50px;
  }
  &.codigo {
    width: 50px;
    text-align: center;
  }
  &.descripcion {
    text-align: start;
    padding-left: 5px;
  }
  &.comentarios {
    text-align: start;
    padding-left: 5px;
    height: 8px;
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden; /* Oculta el contenido que sobrepasa el ancho */
    text-overflow: ellipsis;
  }
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
  &.sinInput {
    background-color: gray;
    color: white;
  }
`;
const CajaEncabezado = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: start;
  margin: 10px 0;
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 1px solid white;
  color: white;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  &.cajaStatus {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.eliminada {
    background-color: #a92828;
  }
  @media screen and (max-width: 650px) {
    width: 90%;
    margin-bottom: 5px;
  }
`;
const TextoStatus = styled.h3`
  color: white;
  font-size: 2rem;
  text-align: center;
  &.success {
    color: ${ClearTheme.complementary.success};
  }
  &.block {
    color: black;
  }
  &.del {
    color: ${ClearTheme.complementary.warning};
  }
`;

const InputCelda2 = styled(InputSimpleEditable)`
  &.disable {
    background-color: transparent;
    color: black;
  }

  &.n {
    width: 40px;
    padding: 0;
    text-align: center;
  }
  &.codigo {
    width: 100%;
    padding: 0;
    text-align: center;
  }

  &.descripcion {
    width: 300px;
    padding-left: 5px;
  }
  &.qty {
    width: 100%;
  }
  &.qtyDisponible {
    width: 100%;
  }
  background-color: grey;

  &.comentarios {
    width: 100%;
  }
`;
const InputEdit = styled(InputSimpleEditable)`
  height: 25px;
  width: 40%;
  border-radius: 0;
`;
const TextAreaEdit = styled(TextArea)`
  height: 45px;
  width: 100%;
  min-height: 10px;
  border-radius: 0;
  padding: 2px;
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EncabezadoTabla = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(6px);
  color: white;

  display: flex;
  justify-content: start;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;
const TituloEncabezadoTabla = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
`;
const ContenidoModal = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  margin: auto;
`;

const CajaProyecciones = styled.div`
  /* background-color: ${ClearTheme.complementary.warning}; */

  &.abierto {
    border: 2px solid ${ClearTheme.complementary.warning};
    box-shadow: ${ClearTheme.config.sombra};
    border-radius: 7px;
    max-height: 400px;
  }
`;
const CajaBtnsProyecciones = styled.div`
  width: 100%;
  min-height: 40px;
`;
const BtnsSimple = styled(BtnGeneralButton)``;
const CajaNuevaPartida = styled.div`
  width: 100%;
  min-height: 200px;
`;

const WrapInputPartida = styled.div`
  width: 50%;
  padding: 8px;
`;
const TituloInputPartida = styled.p`
  color: ${ClearTheme.neutral.neutral200};
`;
const InputPartida = styled(InputSimpleEditable)``;
const InputEdit2 = styled(InputEdit)`
  min-width: auto;
  width: 80px;
`;
const TextoVacio = styled.p`
  color: ${ClearTheme.complementary.warning};
  font-style: italic;
  margin-left: 15px;
  font-size: 0.9rem;
`;
