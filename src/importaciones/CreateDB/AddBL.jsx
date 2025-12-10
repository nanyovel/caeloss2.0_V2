import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import { TablaAddBLOrden } from "../TablasAdd/TablaAddBLOrden";
import { Alerta } from "../../components/Alerta";

import { TablaAddBLListaFurgones } from "../TablasAdd/TablaAddBLListaFurgones";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { collection, doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ModalLoading } from "../../components/ModalLoading";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral.jsx";
import {
  fetchDocsByConditionGetDocs,
  fetchDocsByIn,
  useDocById,
} from "../../libs/useDocByCondition.js";
import { blSchema, partidaFleteSueltoSchema } from "../schema/blSchema.js";
import { ES6AFormat } from "../../libs/FechaFormat.jsx";
import {
  furgonSchema,
  propiedadAuxItemFurgonCopiar,
} from "../schema/furgonSchema.js";
import { OrdenParsedConDespDB } from "../libs/OrdenParsedConDespDB.js";
import { propiedadAuxItemHalarOrden } from "../schema/ordenCompraSchema.js";
import { OrdenParsedConDespLocal } from "../libs/OrdenParsedConDespLocal.js";
import { crearNuevoFurgonBath } from "../libs/CrearNuevoFurgonBath.js";
import { PlantillaBL } from "../../libs/PlantillasCorreo/PlantillaBL.js";
import { FuncionEnviarCorreo } from "../../libs/FuncionEnviarCorreo.js";
// import { funcionDBOrden } from "../DB/dbCargarLote.js";
// import { cargarDatos } from "../../libs/FirebaseLibs.jsx";
import { faPaperclip } from "@fortawesome/free-solid-svg-icons";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { DocumentosAdjunto } from "../../components/DocumentosAdjunto.jsx";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { fileStorageSchema } from "../../models/fileStorageSchema.js";
import { isValidNumDoc } from "../../libs/StringParsed.jsx";
import { OpcionUnica } from "../../components/OpcionUnica.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { Enlace } from "../../components/JSXElements/GrupoTabla.jsx";
import { RecuadroUnificador } from "../TablasAdd/RecuadroUnificador.jsx";
import { alfabetColumnsExcel } from "../../libs/alfabetColumnsExcel.js";
import { datosBlAFurgon } from "../libs/DatosDocToDoc.js";

export const AddBL = ({ userMaster }) => {
  // ******************** RECURSOS GENERALES ******************** //
  const esquemasAxuliares = {
    propiedadAuxItemHalarOrden: propiedadAuxItemHalarOrden,
    propiedadAuxItemFurgonCopiar: propiedadAuxItemFurgonCopiar,
  };
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [counterDoc, setCounterDoc] = useState([]);
  useDocById("counters", setCounterDoc, "counterDocSAP");

  const reiniciarCosas = (tipo) => {
    if (tipo == "default") {
      setVentanaOrdenVisible(false);
      setVentanaJuntaMateriales(0);
      setFurgonIndicado({ ...furgonSchema });
      setOrdenIndicada(null);
      setFurgonFijado(false);
    } else if (tipo == "fijarBL") {
      setBlFijado(true);
    } else if (tipo === "editarBl") {
      setBlFijado(false);
    } else if (tipo === "fijarFurgon") {
      setFurgonFijado(true);
      setFurgonIndicado((prevEstado) => ({
        ...prevEstado,
        materiales: [],
      }));
      setVentanaJuntaMateriales(1);
    } else if (tipo === "seleccionarFleteSuelto") {
      setVentanaJuntaMateriales(3);
      setFurgonIndicado({ ...furgonSchema });
      setFurgonesMasterEditable([]);

      setBLEditable((prevState) => ({
        ...prevState,
        diasLibres: "",
      }));
    } else if (tipo == "editarFurgon") {
      setFurgonFijado(false);
      setFurgonIndicado((prevEstado) => ({
        ...prevEstado,
        materiales: [],
      }));
      setVentanaJuntaMateriales(0);
    } else if (tipo == "cambiarOrden") {
      setVentanaOrdenVisible(false);
      setOrdenIndicada(null);
    } else if (tipo === "enviarBL") {
      setFurgonesMasterEditable([]);
      setBlFijado(false);
      setBLEditable(blSchema);
      setLlegadaAlPaisMostrar("");

      // Reiniciando datos furgon
      // Reiniciando datos o/c
      setVentanaOrdenVisible(false);
      setOrdenIndicada(null);
      setFurgonIndicado({ ...furgonSchema });
    }
  };

  // ******************** BILL OF LADING ******************** //
  const [llegadaAlPaisMostrar, setLlegadaAlPaisMostrar] = useState("");
  const handleInputsBL = (event) => {
    const { name, value } = event.target;

    if (name == "llegadaAlPais") {
      setLlegadaAlPaisMostrar(value);
    } else {
      const transformedValue =
        name === "numeroDoc"
          ? value.toUpperCase().trim()
          : name == "diasLibres"
            ? Number(value)
            : value;

      setBLEditable((prevEstadosBL) => ({
        ...prevEstadosBL,
        [name]: transformedValue,
      }));
    }
  };

  const [blEditable, setBLEditable] = useState({ ...blSchema });
  const [blFijado, setBlFijado] = useState(false);
  const fijarBL = (e) => {
    e.preventDefault();

    if (blEditable.numeroDoc == "") {
      setMensajeAlerta("Colocar numero de BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (blEditable.proveedor == "") {
      setMensajeAlerta("Colocar proveedor.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (blEditable.naviera == "") {
      setMensajeAlerta("Colocar naviera.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const opcionFind =
      opcionTipoBL.find((opcion) => opcion.select).code == "normal";

    if (blEditable.diasLibres == "" && opcionFind) {
      setMensajeAlerta("Colocar dias libres.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (blEditable.puerto == "") {
      setMensajeAlerta("Colocar puerto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (llegadaAlPaisMostrar !== "") {
      const annio = llegadaAlPaisMostrar.slice(0, 4);
      const mes = llegadaAlPaisMostrar.slice(5, 7);
      const dia = llegadaAlPaisMostrar.slice(8, 10);

      const llegadaAlPaisFormat = format(
        new Date(Number(annio), Number(mes) - 1, Number(dia)),
        `dd/MM/yyyy hh:mm:ss:SSS aa`,
        {
          locale: es,
        }
      );
      setBLEditable({
        ...blEditable,
        llegada02AlPais: {
          ...blEditable.llegada02AlPais,
          fecha: llegadaAlPaisFormat,
          confirmada: false,
        },
      });
    }

    // Si el numero de BL ya existe
    const numExist = counterDoc.bls.includes(
      blEditable.numeroDoc.toLowerCase()
    );
    if (numExist) {
      setMensajeAlerta("El numero de BL ya existe en la base de datos.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    // Si numero de bl tiene espacios
    if (
      blEditable.numeroDoc.includes(" ") ||
      blEditable.numeroDoc.includes("\n")
    ) {
      setMensajeAlerta("El numero de BL no puede contener espacios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si el numero de BL no cumple con los requisitos para visualizarse en la URL
    if (!isValidNumDoc(blEditable.numeroDoc)) {
      setMensajeAlerta("Numero de BL solo acepta: letras, números y guiones.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 7000);
      return "";
    }

    // 🟢🟢🟢 ***** Si todo esta correcto *****🟢🟢🟢
    reiniciarCosas("fijarBL");
    setMensajeAlerta("BL fijado correctamente.");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };

  const editarBl = () => {
    reiniciarCosas("editarBl");
  };

  // ******************** CONTAINER ******************** //
  const [furgonesMasterEditable, setFurgonesMasterEditable] = useState([]);

  // Para saber cuando la ventana que unifica los materiales esta activa;
  // 0-Inactiva
  // 1-Activa modo agregar Color Azul
  // 2-Activa modo editar color Orange
  const [ventanaJuntaMateriales, setVentanaJuntaMateriales] = useState(0);

  const handleInputsFurgon = (event) => {
    const { name, value } = event.target;
    const transformedValue =
      name === "numeroDoc" ? value.toUpperCase().trim() : value;

    setFurgonIndicado((prevState) => ({
      ...prevState,
      [name]: transformedValue,
    }));
  };

  // Este estado de furgonIndicado es el furgon que se fija
  // Anteriormente contenia; numero, tamaño y materiales y el resto del schema, pero ahora materiales lo colocamos mejor en el estado materialesUnificados
  const [furgonIndicado, setFurgonIndicado] = useState({ ...furgonSchema });
  const [furgonFijado, setFurgonFijado] = useState(false);
  const fijarFurgon = (e) => {
    e.preventDefault();
    let validacion = {
      blFijado: true,
      numeroDoc: true,
      numeroSinEspacios: true,
      tamannio: true,
      furgonesNoRepetidos: true,
    };
    // Si aun no se fija bl
    if (blFijado == false) {
      validacion.blFijado = false;
      setMensajeAlerta("Primero se debe fijar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    // Si el numero de furgon aun no se especifica
    if (furgonIndicado.numeroDoc == "") {
      validacion.numeroDoc = false;
      setMensajeAlerta("Numero de contenedor sin especificar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si el numero de furgon contiene espacios
    if (furgonIndicado.numeroDoc.includes(" ")) {
      validacion.numeroSinEspacios = false;
      setMensajeAlerta("Numero de contenedor contiene espacios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si el tamaño esta vacio,
    // Se supone que esto nunca ocurrira, dado que el tamaño se selecciona de un menu desplegable
    if (furgonIndicado.tamannio == "") {
      validacion.tamannio = false;
      setMensajeAlerta("Tamaños de contenedor sin especificar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si el numero de furgon ya ha sido agregado al BL
    let furgonExiste = false;

    furgonesMasterEditable.forEach((furgon) => {
      if (furgon.numeroDoc == furgonIndicado.numeroDoc) {
        furgonExiste = true;
        return "";
      }
    });
    if (furgonExiste == true) {
      validacion.furgonesNoRepetidos = false;
      setMensajeAlerta("Este contenedor ya ha sido agregado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si todo esta correcto
    if (
      validacion.blFijado == true &&
      validacion.numeroDoc == true &&
      validacion.tamannio == true &&
      validacion.furgonesNoRepetidos == true
    ) {
      reiniciarCosas("fijarFurgon");
      setTimeout(() => {
        tablaFurgonRef.current.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  const editarFurgon = () => {
    reiniciarCosas("editarFurgon");
  };

  // ******************** ACTUALIZAR DESPACHOS DE LAS ORDENES ******************** //
  // DB ordenes llamadas es el estado de todas las ordenes que se van llamando conforme se crea el BL, posee los despachos de estas ordenes que estan creados, es decir los BL ya existentes en la Base de datos, el estado que se debe utilizar para todo es dbOrdenesLlamadasDespThisBL pues es una concecuencia de dbOrdenesLlamadas
  const [
    dbOrdenesLlamadasNoUsarSinoUtilizarThisBL,
    setDBOrdenesLamadasNoUsarSinoUtilizarThisBL,
  ] = useState([]);
  // DB ordenes llamadas DEsp This BL es el mismo estado de dbordenes llamadas pero, contiene los despachos de este BL que se esta creando, dbordenes
  // UTILIZAR ESTE PARA TODO dbOrdenesLlamadasDespThisBL
  const [dbOrdenesLlamadasDespThisBL, setDBOrdenesLlamadasDespThisBL] =
    useState();
  //
  // 1-Este useEffect tiene como proposito; actualizar los despachos que tiene el estado de ordenes llamadas, los despachos de este BL, no los despachos que estan en la DB ya creados
  // 2-Los despachos vienen de cada furgon
  // 3-Hay dos tipo de despachos:
  // ----------I-Despachos de la DB; que son los despachos que ya estan creados en la DB
  // ----------II-Despachos de este BL; es decir los furgones que se van agregando
  //
  // 4-En este useEffect actualizamos el estado ordenes llamadas pero solo los despachos locales es decir de este BL
  // 5-Los despachos que ya estan creados en la DB se le aplican a las ordenes llamadas al momento de llamarla con la funcion que provienen de la carpeta libs

  useEffect(() => {
    const ordenesParsed = OrdenParsedConDespLocal(
      furgonesMasterEditable,
      dbOrdenesLlamadasNoUsarSinoUtilizarThisBL
    );

    setDBOrdenesLlamadasDespThisBL(ordenesParsed);

    // Esto es para actualizar la orden indicada, es decir aqui se agregan los despachos del BL en curso de esta manera siempre se mantendra actualizada la orden indicada
    const ordenIndicadaFind = ordenesParsed.find(
      (orden) => orden.numeroDoc === ordenIndicada?.numeroDoc
    );
    setOrdenIndicada(ordenIndicadaFind || null);
    //
    //
    //
  }, [furgonesMasterEditable, dbOrdenesLlamadasNoUsarSinoUtilizarThisBL]);

  // Este useEffect es para que cada vez que cambie el furgon indicado automaticamente cambie el array de furgones master, es decir se actualice
  // useEffect(() => {
  //   const furgonesMasterEditableUp = furgonesMasterEditable.map((furgon) => {
  //     if (furgon.id == furgonIndicado.id) {
  //       return { ...furgon, materiales: furgonIndicado.materiales };
  //     } else {
  //       return furgon;
  //     }
  //   });

  //   setFurgonesMasterEditable(furgonesMasterEditableUp);
  // }, [furgonIndicado.materiales]);

  //
  //
  // ************************ ORDENES DE COMPRA ************************* //
  const tablaOrdenRef = useRef(null);
  const primerInputTablaOrdenRef = useRef(null);
  const [ventanaOrdenVisible, setVentanaOrdenVisible] = useState(false);
  const [ordenIndicada, setOrdenIndicada] = useState(null);
  const [valueInputOrdenCompra, setValueInputOrdenCompra] = useState("");

  const handleInputsOrdenCompra = (e) => {
    const valor = e.target.value;
    let valorSinEspacios = valor.replace(/\s+/g, "");

    setValueInputOrdenCompra(valorSinEspacios);
  };
  const [arrayAuxOrden, setArrayAuxOrden] = useState([]);
  const mostrarOrden = async (e) => {
    e.preventDefault();

    if (valueInputOrdenCompra == "") {
      setMensajeAlerta("Por favor ingrese numero de orden de compra.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    // Esta validacion es necesaria por lo siguiente:
    // Cuando halamos una orden, el codigo parsea esa orden y le agrega los despachos que tenga en la base de datos, mas los despachos de este BL que estamos creando, esos despachos de este bl los toma del estado de furgones que es furgonesmastereditable
    // La ventana junta de materiales, muestra los materiales de un furgon especificado, es decir usa el estado furgon indicado
    // Supongamos que estamos creando un bl que tiene 2 furgones kosu1 y kosu2, estos ya estan en el estado furgones master editable,
    // el usuario presiona el boton de Ⓜ️ del furgon kosu1 para mostrar sus materiales
    // el codigo lo que hara internamente es tomar la info que tiene kosu1 del array furgonmaster editable y la colocara en el estado furgon indicado
    // si el usuario modifica las cantidades en la tabla unificadora (estaria de color orange), entonces cuando el usuario llame la orden de compra, esta orden de compra no tomara en cuenta las cantidades actuales que tendria esa ventana, sino el estado de furgones master editable, por tanto tendriamos valores incorrectos
    //

    //
    //
    // ******************************************
    // Este texto que esta entre las dos lineas de asterisco fue colocado el 17 junio 2025
    // El comentario de arriba no lo comprendo, pero esta validacion no debe ser, dado que no me permite modificar las cantidades de un furgon ya agregado, nas adelante veremos profundamente que es el problema y cual es la forma correcta de corregirlo.
    //
    //
    // Este texto que esta entre las dos lineas de asterisco fue colocado el 17 junio 2025
    // ******************************************
    // if (ventanaJuntaMateriales == 2) {
    //   setMensajeAlerta("Por favor cancele o guarde los cambios.");
    //   setTipoAlerta("warning");
    //   setDispatchAlerta(true);
    //   setTimeout(() => setDispatchAlerta(false), 3000);
    //   return "";
    // }

    setIsLoading(true);
    const ordenExtraida = await traerOrden(valueInputOrdenCompra);
    if (ordenExtraida.length > 0) {
      // Si encuentra la orden, parseala; agregale los despachos a sus materiales, para ello va a traer de la base de datos los BL que halla utilizado esta orden y sus furgones
      const ordenParsedDesp = await OrdenParsedConDespDB(ordenExtraida[0]);
      setVentanaOrdenVisible(true);

      const ordenConcluida = {
        ...ordenParsedDesp,
        materiales: ordenParsedDesp.materiales?.map((item) => {
          return {
            ...item,
            valoresAux: {
              ...esquemasAxuliares.propiedadAuxItemHalarOrden,
              ...item.valoresAux,
              qtyInputCopiarAFurgon: "",
            },
          };
        }),
      };

      setOrdenIndicada({ ...ordenConcluida });
      // Si la orden ya habia llamada, entonces dame la nueva y quita la vieja
      const dbOrdenesSinViejaRepeat = dbOrdenesLlamadasDespThisBL.filter(
        (orden, index) => {
          if (orden.numeroDoc !== ordenConcluida.numeroDoc) {
            return orden;
          }
        }
      );
      setDBOrdenesLamadasNoUsarSinoUtilizarThisBL([
        ...dbOrdenesSinViejaRepeat,
        ordenConcluida,
      ]);
      setIsLoading(false);
      setTimeout(() => {
        tablaOrdenRef.current.scrollIntoView({ behavior: "smooth" });
        setTimeout(() => {
          primerInputTablaOrdenRef.current.focus();
        }, 250);
      }, 100);
    } else {
      setMensajeAlerta("El numero de O/C no existe en la base de datos.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
      return "";
    }
  };
  const traerOrden = async (numero) => {
    const ordenBuscado = await fetchDocsByConditionGetDocs(
      "ordenesCompra2",
      setArrayAuxOrden,
      "numeroDoc",
      "==",
      numero
    );
    if (ordenBuscado.length > 0) {
      return ordenBuscado;
    } else {
      return [];
    }
  };

  const cambiarOrden = () => {
    reiniciarCosas("cambiarOrden");
  };

  // ******************** COPIA DE ORDEN A FURGONES ******************** //
  const tablaFurgonRef = useRef(null);

  // ****************** LISTA (COMPILACION) DE FURGONES***************** //
  const [indexFurgonEnBL, setIndexFurgonEnBL] = useState(null);
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);

  // ******************** ENVIANDO A LA BASE DE DATOS******************** //
  const [isLoading, setIsLoading] = useState(false);

  const enviarObjeto = async (e) => {
    e.preventDefault();

    // Si numero de BL esta vacio, esto podria ejecutarse si es modo carga suelta, dado que te permite llamar orden aunque no hallas fijado BL

    if (blEditable.numeroDoc == "") {
      setMensajeAlerta("Favor colocar numero de BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si numero de bl tiene espacios
    if (
      blEditable.numeroDoc.includes(" ") ||
      blEditable.numeroDoc.includes("\n")
    ) {
      setMensajeAlerta("El numero de BL no puede contener espacios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }

    // Si esta en modo normal
    const opcionFind = opcionTipoBL.find((opcion) => opcion.select);

    //Validaciones recorriendo el array de contenedores
    let procederArrayFurgon = true;

    if (opcionFind.code == "normal") {
      // Si algun numero de furgon se repite
      const numerosDeFurgones = new Set();
      let hayDuplicados = false;

      furgonesMasterEditable.forEach((furgon) => {
        const numeroDoc = furgon.numeroDoc;
        if (numerosDeFurgones.has(numeroDoc)) {
          hayDuplicados = true;
        } else {
          numerosDeFurgones.add(numeroDoc);
        }
      });
      if (hayDuplicados) {
        setMensajeAlerta("Existen numeros de contenedores repetidos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si no se agrego contenedores
      if (furgonesMasterEditable.length == 0) {
        setMensajeAlerta("BL sin contenedores.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        return "";
      }
      // Si hay un furgon en ejecucion, es decir si la ventana TablaAddBLFurgon de copiarAfurgonMaster... esta activa
      if (ventanaJuntaMateriales > 0) {
        setMensajeAlerta(
          "Primero guarde o cancele el contenedor que esta agregando."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }

      //Validaciones recorriendo el array de contenedores

      for (let i = 0; i < furgonesMasterEditable.length; i++) {
        const thisFurgon = furgonesMasterEditable[i];
        // Si this furgon tiene numero de furgon no aceptado como URL
        // Si el numero de BL no cumple con los requisitos para visualizarse en la URL
        if (!isValidNumDoc(thisFurgon.numeroDoc)) {
          procederArrayFurgon = false;
          setMensajeAlerta(
            "Numero de contenedor solo acepta: letras, números y guiones."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 7000);
          break;
        }
        // Si algun furgon contiene espacios
        if (
          thisFurgon.numeroDoc.includes(" ") ||
          thisFurgon.numeroDoc.includes("\n")
        ) {
          procederArrayFurgon = false;
          setMensajeAlerta(
            `El numero de contenedor de la fila ${i + 1} contiene espacios.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        // Si el numero de algun furgon esta vacio
        if (thisFurgon.numeroDoc == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar numero al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        // Si algun furgon no tiene numero colocado, esto no deberia pasar
        if (thisFurgon.tamannio == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar tamaño al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          break;
        }
        if (thisFurgon.destino == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(
            `Indicar destino al contenedor de la fila ${i + 1}.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        if (thisFurgon.status == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar status al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        if (thisFurgon.materiales.length == 0) {
          procederArrayFurgon = false;
          setMensajeAlerta(
            `Contenedor de la fila ${i + 1} carece de materiales.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
      }
    }

    if (procederArrayFurgon == false) {
      return;
    }

    // Si esta en modo carga suelta
    if (opcionFind.code == "fleteSuelto") {
      // SI no se agrego materiales a la carga suelta
      if (materialesUnificados.length == 0) {
        setMensajeAlerta("Agregar materiales al recuadro unificador.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // SI el bl ingresado ya existe en la base de datos
    // Esto no deberia ejecutarse, pues si aun no se fija bl debe dar error
    // Ademas esta valicacion se hace en el momento de fijar el bl
    // Es util colocarlo "por si acaso"
    const numExist = counterDoc.bls.includes(
      blEditable.numeroDoc.toLowerCase()
    );
    if (numExist) {
      setMensajeAlerta("El numero de BL ya existe en la base de datos.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    // Si es editando bl
    if (blFijado == false) {
      setMensajeAlerta("Se debe fijar Bill Of Lading.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si todo esta correcto
    // SI todo esta correcto
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    setIsLoading(true);
    try {
      const batch = writeBatch(db);

      // 🟢🟢🟢****** ACTUALIZAR CONTADORES ********🟢🟢🟢
      // Contador BL
      const contadorUpdateSAP = doc(db, "counters", "counterDocSAP");
      batch.update(contadorUpdateSAP, {
        bls: [...counterDoc.bls, blEditable.numeroDoc.toLowerCase()],
      });

      // Contador carga suelta
      const contadorFleteSuelto = doc(db, "counters", "fleteSuelto");
      const nuevoNumFleteSuelto = lastNumberFleteSuelto.lastNumber + 1;
      batch.update(contadorFleteSuelto, {
        lastNumber: nuevoNumFleteSuelto,
      });

      // 🟢🟢🟢****** CARGA LOS ARCHIVOS ADJUNTO ********🟢🟢🟢
      let errorEnAdjunto = false;
      let blConArchivos = {
        ...blEditable,
      };
      if (archivosAdjuntoLocal.length > 0) {
        try {
          for (const file of archivosAdjuntoLocal) {
            const fechaActual = new Date();
            const annioActual = fechaActual.getFullYear();

            // referencia en Storage
            const storage = getStorage();
            const fechaString = ES6AFormat(new Date());
            const sinSlash = fechaString.replaceAll("/", "_");

            const nuevaRuta = `documentos/_${annioActual}/importaciones/${file.name}_${sinSlash}`;
            const storageRef = ref(storage, nuevaRuta);

            // subir archivo
            await uploadBytes(storageRef, file);

            // obtener URL de descarga
            const url = await getDownloadURL(storageRef);

            blConArchivos = {
              ...blConArchivos,
              filesAttach: [
                ...blConArchivos.filesAttach,
                {
                  ...fileStorageSchema,
                  url: url,
                  nombre: file.name,
                  rutaStorage: nuevaRuta,
                  extension: file.name.split(".").pop().toLowerCase(),
                  tipoMime: file.type || "",
                  size: file.size,
                  createdAt: ES6AFormat(new Date()),
                  createdBy: userMaster.userName,
                  idUsuario: userMaster.id,
                },
              ],
            };
          }
        } catch (error) {
          console.error("Error al subir archivos:", error);
          setIsLoading(false);
          setMensajeAlerta("Error con la base de datos.");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 7000);
        }
      }

      // 🟢🟢🟢******** CREAR BILL OF LADING *********🟢🟢🟢*

      const collectionBLRef = collection(db, "billOfLading2");
      const nuevoDocumentoRef = doc(collectionBLRef);

      const relacionFleteSuelto = crearNuevoFurgonBath(
        undefined,
        {
          ...furgonSchema,
          materiales: materialesUnificados,
        },
        undefined,
        {
          ...blEditable,
          id: nuevoDocumentoRef.id,
        },
        llegadaAlPaisMostrar,
        userMaster
      );

      const { createdAt, createdBy, tamannio, ...nuevoRelacion } =
        relacionFleteSuelto;

      const nuevoRelacionParsed = {
        ...nuevoRelacion,
        datosBL: {
          ...datosBlAFurgon({
            ...blEditable,
            id: nuevoDocumentoRef.id,
          }),
        },
      };
      const blAux = {
        ...blConArchivos,
        estadoDoc: 0,
        tipo: opcionFind.num,
        createdBy: userMaster.userName,
        createdAt: ES6AFormat(new Date()),
        fleteSuelto:
          opcionFind.code == "fleteSuelto"
            ? {
                ...blSchema.fleteSuelto,
                numeroDoc: nuevoNumFleteSuelto,
                materiales: materialesUnificados,
                partidas: [
                  {
                    ...partidaFleteSueltoSchema,
                    ...nuevoRelacionParsed,
                    numeroDoc: nuevoNumFleteSuelto + alfabetColumnsExcel(1),
                  },
                ],
              }
            : blSchema.fleteSuelto,
        logModificaciones: [
          {
            fecha: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
              locale: es,
            }),
            userNameCreador: userMaster.userName,
            idCreador: userMaster.id,
            descripcionCambio: "initial",
            documento: { ...blConArchivos, logModificaciones: null },
          },
        ],
      };

      batch.set(nuevoDocumentoRef, blAux);
      //
      //
      //
      // 🟢🟢🟢🟢🟢********* CREAR FURGONES *************🟢🟢🟢🟢🟢*
      // Crear furgones si aplica
      const idsNumsTodosFurgonesCreando = [];
      if (opcionFind.code == "normal") {
        furgonesMasterEditable.forEach((furgon) => {
          const collectionFurgonRef = collection(db, "furgones");
          const nuevoDocumentoRefFurgon = doc(collectionFurgonRef);
          idsNumsTodosFurgonesCreando.push({
            id: nuevoDocumentoRefFurgon.id,
            numeroFurgon: furgon.numeroDoc,
          });

          const blConNuevoID = {
            ...blConArchivos,
            id: nuevoDocumentoRef.id,
          };
          crearNuevoFurgonBath(
            batch,
            furgon,
            nuevoDocumentoRefFurgon,
            blConNuevoID,
            llegadaAlPaisMostrar,
            userMaster
          );
        });
      }
      //
      //
      //
      //
      //
      // 🟢🟢🟢🟢🟢********* ACTUALIZAR ORDENES DE COMPRA UTILIZADAS**********🟢🟢🟢🟢🟢*
      // Primero tenemos que filtrar el estado, es decir quitar las ordenes que no se hallan utilizado, se me ocurren dos posibles casos que ocasiona que halla orden que no estemos utilizando:
      // Talvez hay mas casos, dos que se me ocurren:
      // 1-Cuando un usuario hala una orden se agrega al estado, aunque el usuario no tome materiales como quiera se queda la orden halada,
      // 2-EL usuario hala la orden y toma materiales, pero luego quita los materiales, la orden como quiera se queda

      // I-Aplana los materiales y dame un array solo de numero de ordenes
      let numsOrden = [];
      // Si es carga normal toma los numeros de orden desde los furgones
      if (opcionFind.code == "normal") {
        numsOrden = furgonesMasterEditable
          .flatMap((furgon) => furgon.materiales)
          .map((item) => item.ordenCompra);
      }
      // Si es carga suelta toma la info directamente desde el recuadro unificador
      else if (opcionFind.code == "fleteSuelto") {
        numsOrden = materialesUnificados.map((item) => item.ordenCompra);
      }

      const numsOrdenUnicos = [...new Set(numsOrden)];

      // II-Ahora filtra las ordenes, quita las que no estes utilizando
      const ordenesFiltradas = dbOrdenesLlamadasDespThisBL.filter((orden) =>
        numsOrdenUnicos.includes(orden.numeroDoc)
      );

      // ordenesFiltradas.forEach((orden) => {
      for (const orden of ordenesFiltradas) {
        const ordenActualizar = doc(db, "ordenesCompra2", orden.id);

        // *****Actualiza el array de BLs utilizados*****
        batch.update(ordenActualizar, {
          idsBLUtilizados: [...orden.idsBLUtilizados, nuevoDocumentoRef.id],
        });

        // ****Actualiza el array de FURGONES utilizados*****
        // 1-Al array de la orden de furgones utilizados, agregales los ids de los furgones que tengan materiales de dicha orden, esto solo si es en modo normal
        if (opcionFind.code == "normal") {
          let idFurgonesUsedOrden = [...orden.idFurgonesUtilizados];
          idsNumsTodosFurgonesCreando.forEach((id) => {
            let isUsed = false;
            orden.materiales.forEach((item) => {
              item.valoresAux.despachosThisBL.forEach((desp) => {
                if (desp.numeroFurgon == id.numeroFurgon) {
                  isUsed = true;
                }
              });
            });
            if (isUsed) {
              idFurgonesUsedOrden = [...idFurgonesUsedOrden, id.id];
            }
          });

          batch.update(ordenActualizar, {
            idFurgonesUtilizados: idFurgonesUsedOrden,
          });
        }
        // Actualiza el estado
        batch.update(ordenActualizar, {
          // Anteriormente el estado de la orden debia ser calculado, porque teniamos 2 posibles estados:
          // 0-Abiertas
          // 1-Cerradas
          // Pero luego del 12/9/25 ahora tenemos 3 estados:
          // 0-Abiertas
          // 1-En proceso
          // 2-Cerradas
          // En concecuencia cuando se crea un BL, el unico efecto sobre las ordenes es que la pone en proceso, dado que las ordenes se cerraria cuando todos sus materiales pase a listo en SAP
          // Por esta razon ya no se debe calcular el estado, sino que al crear un BL por naturaleza sus ordenes de compra quedan en estado 1-En proceso
          estadoDoc: 1,
        });
      }
      // return;
      // 🟢🟢🟢🟢🟢********* CONFIRMACION *************🟢🟢🟢🟢🟢*
      if (!errorEnAdjunto) {
        await batch.commit();

        setArchivosAdjuntoLocal([]);
      } else {
        setIsLoading(false);
        setMensajeAlerta("Error al cargar archivos adjunto.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
      // Cargar archivos adjuntos
      // Cargar foto de perfil

      // 🟢🟢🟢🟢🟢********* ENVIAR CORREOS *************🟢🟢🟢🟢🟢*

      // Notificaciones de ordenes
      const idsOrdenes = ordenesFiltradas.map((orden) => orden.id);
      const notificacionesOrdenes = await fetchDocsByIn(
        "notificaciones",
        undefined,
        "idDoc",
        idsOrdenes
      );

      // Notificaciones de articulos
      let codigosItems = [];
      if (opcionFind.code == "normal") {
        codigosItems = furgonesMasterEditable
          .flatMap((furgon) => furgon.materiales)
          .map((item) => item.codigo);
      } else if (opcionFind.code == "fleteSuelto") {
        codigosItems = materialesUnificados.map((item) => item.codigo);
      }

      const notificacionesArticulos = await fetchDocsByIn(
        "notificaciones",
        undefined,
        "idDoc",
        codigosItems
      );

      // Conglo
      const notificaciones = [
        ...notificacionesOrdenes,
        ...notificacionesArticulos,
      ];
      const correoDestinos = notificaciones
        .flatMap((not) => not.destinatarios)
        .map((dest) => dest.correo);

      const destinos = [...new Set(correoDestinos)];

      if (destinos.length > 0) {
        FuncionEnviarCorreo({
          para: destinos,
          asunto: "🚢 Materiales enviados hacia Rep. Dom.",
          mensaje: PlantillaBL({
            billOfLading: blConArchivos,
            furgones: furgonesMasterEditable,
            // Mercancia en transito, es estado 1, 0 seria proveedor que nunca sera
            estadoDoc: 1,
          }),
        });
      }

      setIsLoading(false);
      setMaterialesUnificados([]);
      reiniciarCosas("enviarBL");
      setMensajeAlerta("BL cargado correctamente a la Base de Datos.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
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

  // ********************* Documentos adjuntos *********************
  const [modalDocAdj, setModalDocAdj] = useState(false);
  const [archivosAdjuntoLocal, setArchivosAdjuntoLocal] = useState([]);

  // ********************* TIPO BL *********************
  const [opcionTipoBL, setOpcionTipoBL] = useState([
    {
      nombre: "Normal",
      code: "normal",
      select: true,
      num: 0,
    },
    {
      nombre: "Carga suelta",
      code: "fleteSuelto",
      select: false,
      num: 1,
    },
  ]);

  const handleTipoBLOp = (e) => {
    const index = Number(e.target.dataset.id);

    setOpcionTipoBL((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i == index,
      }))
    );
    if (index == 0) {
      reiniciarCosas("default");
    } else if (index == 1) {
      reiniciarCosas("seleccionarFleteSuelto");
    }
  };

  //********************* Carga suelta *********************
  // trae el ultimo numero de carga suelta
  const [lastNumberFleteSuelto, setNumberFleteSuelto] = useState({});
  useDocById("counters", setNumberFleteSuelto, "fleteSuelto");

  const [materialesUnificados, setMaterialesUnificados] = useState([]);

  return (
    <Container>
      <form action="" onSubmit={(e) => enviarObjeto(e)}>
        <CajaEncabezado>
          <Titulo>Crear Bill of Lading</Titulo>
          <BtnHead type="submit" onClick={(e) => enviarObjeto(e)}>
            <Icono icon={faPaperPlane} />
            Enviar
          </BtnHead>
        </CajaEncabezado>
      </form>
      <BotonQuery
        blEditable={blEditable}
        ventanaJuntaMateriales={ventanaJuntaMateriales}
      />
      <CajaMasBtn>
        <BtnHead className="correo" onClick={() => setModalDocAdj(true)}>
          <Icono className="correo" icon={faPaperclip} />
          Adjunto
        </BtnHead>
        <WrapOpcionTipo>
          <OpcionUnica
            arrayOpciones={opcionTipoBL}
            handleOpciones={handleTipoBLOp}
          />
        </WrapOpcionTipo>
      </CajaMasBtn>
      <ContainerSecond>
        <Formulario action="" onSubmit={(e) => fijarBL(e)}>
          <CajaAdd>
            <CajitaAdd>
              <TextoLabel>Numero BL:</TextoLabel>
              <Input
                type="text"
                name="numeroDoc"
                value={blEditable.numeroDoc}
                onChange={(e) => {
                  handleInputsBL(e);
                }}
                className={blFijado ? "fijado" : ""}
                disabled={blFijado}
                autoComplete="off"
              />
            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Proveedor:</TextoLabel>
              <Input
                type="text"
                name="proveedor"
                value={blEditable.proveedor}
                onChange={(e) => {
                  handleInputsBL(e);
                }}
                className={blFijado ? "fijado" : ""}
                disabled={blFijado}
                autoComplete="off"
              />
            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Naviera:</TextoLabel>
              <Input
                type="text"
                name="naviera"
                value={blEditable.naviera}
                onChange={(e) => {
                  handleInputsBL(e);
                }}
                className={blFijado ? "fijado" : ""}
                disabled={blFijado}
                autoComplete="off"
              />
            </CajitaAdd>

            <CajitaAdd>
              <TextoLabel>Puerto:</TextoLabel>
              <MenuDesplegable2
                name="puerto"
                value={blEditable.puerto}
                onChange={(e) => {
                  handleInputsBL(e);
                }}
                className={blFijado ? "fijado" : ""}
                disabled={blFijado}
              >
                <option value="Haina">Haina</option>
                <option value="Caucedo">Caucedo</option>
                <option value="Otros">Otros</option>
              </MenuDesplegable2>
            </CajitaAdd>

            {opcionTipoBL.find((opcion) => opcion.select).code == "normal" && (
              <CajitaAdd>
                <TextoLabel>Dias libres:</TextoLabel>
                <Input
                  type="text"
                  name="diasLibres"
                  value={blEditable.diasLibres}
                  onChange={(e) => {
                    handleInputsBL(e);
                  }}
                  className={blFijado ? "fijado" : ""}
                  disabled={blFijado}
                  autoComplete="off"
                />
              </CajitaAdd>
            )}
            <CajitaAdd>
              <TextoLabel>Llegada al pais:</TextoLabel>
              <Input
                type="date"
                name="llegadaAlPais"
                value={llegadaAlPaisMostrar}
                onChange={(e) => {
                  handleInputsBL(e);
                }}
                className={blFijado ? "fijado" : ""}
                disabled={blFijado}
                autoComplete="off"
              />
            </CajitaAdd>
            <CajaBotonesForm>
              <BtnEstacebler type="submit">Fijar</BtnEstacebler>
              <BtnEstacebler
                type="button"
                onClick={() => {
                  editarBl();
                }}
              >
                Editar
              </BtnEstacebler>
            </CajaBotonesForm>
          </CajaAdd>
        </Formulario>

        <CajaFurgonAdded>
          {opcionTipoBL.find((opcion) => opcion.select).code == "normal" ? (
            <>
              <TituloFurgon>Lista de contenedores:</TituloFurgon>
              <CajitaFurgonAdded>
                <TablaAddBLListaFurgones
                  tablaFurgonRef={tablaFurgonRef}
                  ventanaJuntaMateriales={ventanaJuntaMateriales}
                  setVentanaJuntaMateriales={setVentanaJuntaMateriales}
                  setIndexFurgonEnBL={setIndexFurgonEnBL}
                  setVentanaOrdenVisible={setVentanaOrdenVisible}
                  cambiosSinGuardar={cambiosSinGuardar}
                  setFurgonIndicado={setFurgonIndicado}
                  setOrdenIndicada={setOrdenIndicada}
                  furgonesMasterEditable={furgonesMasterEditable}
                  setFurgonesMasterEditable={setFurgonesMasterEditable}
                  setFurgonFijado={setFurgonFijado}
                  setMensajeAlerta={setMensajeAlerta}
                  setTipoAlerta={setTipoAlerta}
                  setDispatchAlerta={setDispatchAlerta}
                  //
                  materialesUnificados={materialesUnificados}
                  setMaterialesUnificados={setMaterialesUnificados}
                />
              </CajitaFurgonAdded>
            </>
          ) : (
            <CajaDisabledFurgon>
              <TituloDisabledFurgon>No aplica. </TituloDisabledFurgon>
            </CajaDisabledFurgon>
          )}
        </CajaFurgonAdded>

        <CajaFurgon>
          {/* {true && ( */}
          {opcionTipoBL.find((opcion) => opcion.select).code == "normal" && (
            <FormularioFurgon action="" onSubmit={(e) => fijarFurgon(e)}>
              <CajitaAddFurgon>
                <TextoLabel>N° contenedor:</TextoLabel>
                <Input
                  type="text"
                  name="numeroDoc"
                  value={furgonIndicado.numeroDoc}
                  onChange={(e) => {
                    handleInputsFurgon(e);
                  }}
                  // className={ventanaJuntaMateriales > 0 ? "fijado" : ""}
                  disabled={furgonFijado}
                  className={furgonFijado ? "fijado" : ""}
                  autoComplete="off"
                />
              </CajitaAddFurgon>
              <CajitaAddFurgon>
                <TextoLabel>Tamaño (pies):</TextoLabel>
                <MenuDesplegable2
                  disabled={furgonFijado}
                  name="tamannio"
                  // value={valoresInputsFurgon.tamannio}
                  value={furgonIndicado.tamannio}
                  onChange={(e) => {
                    handleInputsFurgon(e);
                  }}
                  className={furgonFijado ? "fijado" : ""}
                >
                  <Opciones value="20'">20&apos;</Opciones>
                  <Opciones value="40'">40&apos;</Opciones>
                  <Opciones value="45'" defaultValue>
                    45&apos;
                  </Opciones>
                  <Opciones value="Otros">Otros</Opciones>
                </MenuDesplegable2>
              </CajitaAddFurgon>
              <CajaBotonesForm2>
                <BtnAdd2 type="submit">Fijar</BtnAdd2>
                <BtnAdd2
                  type="button"
                  onClick={() => {
                    editarFurgon();
                  }}
                >
                  Editar
                </BtnAdd2>
              </CajaBotonesForm2>
            </FormularioFurgon>
          )}
          <form action="" onSubmit={(e) => mostrarOrden(e)}>
            <CajitaAddFurgon>
              <TextoLabel>Orden de compra:</TextoLabel>
              <Input
                type="text"
                name="ordenCompra"
                value={valueInputOrdenCompra}
                onChange={(e) => {
                  handleInputsOrdenCompra(e);
                }}
                disabled={ordenIndicada}
                className={ventanaOrdenVisible ? "fijado" : ""}
                autoComplete="off"
              />
            </CajitaAddFurgon>
            <CajaBotonesForm2>
              <BtnAddFurgon type="submit">Halar</BtnAddFurgon>
              <BtnAddFurgon
                onClick={() => {
                  cambiarOrden();
                }}
                type="button"
              >
                Cambiar
              </BtnAddFurgon>
            </CajaBotonesForm2>
          </form>
        </CajaFurgon>
      </ContainerSecond>
      {ventanaJuntaMateriales > 0 ? (
        <WrapCajitaFUrgonADd>
          <CajitaEncabezadoTablita>
            <TextoCajitaHead>
              {"Recuadro unificador, materiales de "}
              {opcionTipoBL.find((opcion) => opcion.select).code == "normal" &&
                `contenedor N° 
                ${furgonIndicado.numeroDoc}`}
              {opcionTipoBL.find((opcion) => opcion.select).code ==
                "fleteSuelto" &&
                `Carga Suelta N°
                ${lastNumberFleteSuelto.lastNumber + 1}`}
            </TextoCajitaHead>
          </CajitaEncabezadoTablita>
          <RecuadroUnificador
            modo={"addBL"}
            tablaFurgonRef={tablaFurgonRef}
            ventanaJuntaMateriales={ventanaJuntaMateriales}
            setVentanaJuntaMateriales={setVentanaJuntaMateriales}
            indexFurgonEnBL={indexFurgonEnBL}
            setIndexFurgonEnBL={setIndexFurgonEnBL}
            ventanaOrdenVisible={ventanaOrdenVisible}
            setVentanaOrdenVisible={setVentanaOrdenVisible}
            setCambiosSinGuardar={setCambiosSinGuardar}
            // AlertasordenIndicada
            setTipoAlerta={setTipoAlerta}
            setMensajeAlerta={setMensajeAlerta}
            setDispatchAlerta={setDispatchAlerta}
            furgonIndicado={furgonIndicado}
            setFurgonIndicado={setFurgonIndicado}
            furgonesMasterEditable={furgonesMasterEditable}
            setFurgonesMasterEditable={setFurgonesMasterEditable}
            setFurgonFijado={setFurgonFijado}
            setOrdenIndicada={setOrdenIndicada}
            opcionTipoBL={opcionTipoBL}
            materialesUnificados={materialesUnificados}
            setMaterialesUnificados={setMaterialesUnificados}
          />
        </WrapCajitaFUrgonADd>
      ) : (
        ""
      )}

      {ventanaOrdenVisible == true && ordenIndicada ? (
        <WrapCajitaFUrgonADd>
          <br />
          <br />
          <CajitaEncabezadoTablita>
            <TextoCajitaHead>
              O/C:
              <Enlace
                target="_blank"
                to={
                  "/importaciones/maestros/ordenescompra/" +
                  ordenIndicada.numeroDoc
                }
              >
                {" " + ordenIndicada.numeroDoc}
              </Enlace>
              {" - " + ordenIndicada.proveedor}
            </TextoCajitaHead>
          </CajitaEncabezadoTablita>
          <TablaAddBLOrden
            setTipoAlerta={setTipoAlerta}
            setMensajeAlerta={setMensajeAlerta}
            setDispatchAlerta={setDispatchAlerta}
            tablaOrdenRef={tablaOrdenRef}
            primerInputTablaOrdenRef={primerInputTablaOrdenRef}
            setVentanaOrdenVisible={setVentanaOrdenVisible}
            MODO={"addBL"}
            ventanaJuntaMateriales={ventanaJuntaMateriales}
            setCambiosSinGuardar={setCambiosSinGuardar}
            furgonIndicado={furgonIndicado}
            setFurgonIndicado={setFurgonIndicado}
            ordenIndicada={ordenIndicada}
            setOrdenIndicada={setOrdenIndicada}
            furgonesMasterEditable={furgonesMasterEditable}
            opcionTipoBL={opcionTipoBL}
            materialesUnificados={materialesUnificados}
            setMaterialesUnificados={setMaterialesUnificados}
          />
        </WrapCajitaFUrgonADd>
      ) : (
        ""
      )}
      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {modalDocAdj && (
        <ModalGeneral
          setHasModal={setModalDocAdj}
          titulo={"Adjuntar documentos"}
        >
          <DocumentosAdjunto
            archivosAdjuntoLocal={archivosAdjuntoLocal}
            setArchivosAdjuntoLocal={setArchivosAdjuntoLocal}
            userMaster={userMaster}
          />
        </ModalGeneral>
      )}
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  min-height: 400px;
  margin: auto;
`;

const Titulo = styled.h2`
  color: white;
  width: 100%;
  text-align: center;
  text-decoration: underline;
`;

const ContainerSecond = styled.div`
  display: flex;
  gap: 10px;
  padding-top: 20px;
  padding: 20px;
  @media screen and (max-width: 980px) {
    display: flex;
    flex-wrap: wrap;
    /* flex-direction: column; */
  }
  @media screen and (max-width: 550px) {
    display: flex;
    flex-wrap: wrap;
    flex-direction: column;
    align-items: center;
  }
`;

const Formulario = styled.form`
  justify-content: center;
  width: 24%;
  @media screen and (max-width: 980px) {
    min-width: 40%;
  }
  @media screen and (max-width: 550px) {
    min-width: 90%;
  }
`;

const CajaAdd = styled.div`
  min-height: 100px;
  height: 400px;

  border-radius: 20px 0 20px 0;
  padding: 10px;
  border: 1px solid white;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
  color: white;
`;

const CajitaAdd = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 0 10px;
`;

const TextoLabel = styled.span`
  margin-bottom: 4px;
`;
const Input = styled(InputSimpleEditable)`
  width: 100%;
  min-width: 10px;
`;

const MenuDesplegable2 = styled(MenuDesplegable)``;

const CajaFurgon = styled(CajaAdd)`
  padding-top: 10px;
  overflow: hidden;
  width: 24%;
  @media screen and (max-width: 980px) {
    min-width: 40%;
  }
  @media screen and (max-width: 550px) {
    min-width: 90%;
  }
`;

const TituloFurgon = styled.h2`
  color: ${Tema.secondary.azulOpaco};
  font-size: 1.2rem;
  text-decoration: underline;
  width: 100%;
  height: 45px;
  padding: 10px;
  background-color: ${Tema.secondary.azulGraciel};
  background-color: ${ClearTheme.primary.grisCielos};
  color: ${ClearTheme.complementary.warning};
`;
const CajitaAddFurgon = styled(CajitaAdd)`
  width: 85%;
  margin: auto;
`;
const CajaFurgonAdded = styled(CajaAdd)`
  width: 50%;
  padding: 0;
  /* padding-top: 20px; */
  overflow: hidden;
  @media screen and (max-width: 550px) {
    min-width: 90%;
  }
`;

const BtnAddFurgon = styled(BtnGeneralButton)`
  width: auto;
  padding: 10px 4px;
  margin: 8px;
  min-width: 30%;
  margin-top: 20px;
  border: 1px solid transparent;
  &:focus {
    border: 1px solid white;
  }
`;

const BtnAdd2 = styled(BtnAddFurgon)`
  width: 40px;
`;

const CajitaFurgonAdded = styled.div`
  overflow: auto;
  &::-webkit-scrollbar {
    width: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;

const CajaEncabezado = styled.div`
  color: white;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(6px);
  padding: 5px;
  display: flex;
  justify-content: space-around;
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const BtnEstacebler = styled(BtnGeneralButton)`
  min-width: 40px;
  width: auto;
  margin: 0;
  padding: 10px;
  border: 1px solid transparent;
  &:focus {
    border: 1px solid white;
  }
`;

const CajaBotonesForm = styled.div`
  display: flex;
  width: 100%;
  margin-top: 10px;
  gap: 5px;
  justify-content: center;
`;
const CajaBotonesForm2 = styled(CajaBotonesForm)`
  padding: auto;
`;

const CajitaEncabezadoTablita = styled.div`
  border-bottom: 1px solid black;
`;
const WrapCajitaFUrgonADd = styled.div`
  background-color: ${ClearTheme.secondary.azulFrosting};

  backdrop-filter: blur(5px);
  border: 1px solid ${ClearTheme.complementary.warning};
`;
const TextoCajitaHead = styled.h2`
  color: ${ClearTheme.complementary.warning};
  text-align: center;
  font-size: 1.1rem;
  font-weight: 400;
`;

const FormularioFurgon = styled.form``;
// 1415 es la ultima linea
const CajaMasBtn = styled.div`
  border: 1px solid white;
  margin-bottom: 8px;
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
const WrapOpcionTipo = styled.div`
  display: inline-block;
`;

const InputCelda = styled.input`
  &::-webkit-outer-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  &::-webkit-inner-spin-button {
    -webkit-appearance: none;
    margin: 0;
  }
  width: 60px;
  text-align: center;
  margin: 0;
  height: 25px;
  outline: none;
  border: none;
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};

  background-color: ${ClearTheme.secondary.azulVerde};
  color: white;
  padding: 4px;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.sobrePasa {
    border: 1px solid red;
  }
`;
const CajaDisabledFurgon = styled.div`
  width: 100%;
  height: 100%;
  background-color: #4d4b4b;
  text-align: center;
  align-content: center;
`;
const TituloDisabledFurgon = styled.h2`
  font-size: 2rem;
  font-weight: 400;
`;
