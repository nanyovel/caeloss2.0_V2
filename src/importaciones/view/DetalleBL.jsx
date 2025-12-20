import { useRef, useState } from "react";
import styled from "styled-components";
import { collection, doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { TablaMultiFurgon } from "../Tablas/TablaMultiFurgon";
import {
  faEdit,
  faLock,
  faLockOpen,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CSSLoader } from "../../components/CSSLoader";
import { ControlesTabla } from "../components/ControlesTabla";
import { Alerta } from "../../components/Alerta";
import { TablaAddBLOrden } from "../TablasAdd/TablaAddBLOrden";
import { ModalLoading } from "../../components/ModalLoading";
import { BotonQuery } from "../../components/BotonQuery";
import { useEffect } from "react";
import FuncionUpWayDate from "../components/FuncionUpWayDate";
import { CostosBL } from "../components/CostosBL.jsx";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";
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
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral.jsx";
import { blSchema, partidaFleteSueltoSchema } from "../schema/blSchema.js";
import {
  fetchDocsByArrayContains,
  fetchDocsByConditionGetDocs,
  fetchDocsByIn,
  useDocById,
} from "../../libs/useDocByCondition.js";
import {
  furgonSchema,
  propiedadAuxItemFurgonCopiar,
} from "../schema/furgonSchema.js";
import { colorDaysRemaining, fechaConfirmada } from "../components/libs.jsx";
import {
  blEstadoParsed,
  ordenEstadoParsedNueva,
} from "../libs/ParsedEstadoDoc.js";
import { datosBlAFurgon } from "../libs/DatosDocToDoc.js";
import { ES6AFormat, inputAFormat } from "../../libs/FechaFormat.jsx";
import { OrdenParsedConDespDB } from "../libs/OrdenParsedConDespDB.js";
import { OrdenParsedConDespLocal } from "../libs/OrdenParsedConDespLocal.js";
import { valoresAuxFurgons } from "../libs/ValoresItemFurgon.js";
import { crearNuevoFurgonBath } from "../libs/CrearNuevoFurgonBath.js";
import { propiedadAuxItemHalarOrden } from "../schema/ordenCompraSchema.js";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { BtnNormal } from "../../components/BtnNormal.jsx";
import { FuncionEnviarCorreo } from "../../libs/FuncionEnviarCorreo.js";
import { PlantillaFechaETA } from "../../libs/PlantillasCorreo/PlantillaFecha.js";
import { DocumentosAdjunto } from "../../components/DocumentosAdjunto.jsx";
import {
  deleteObject,
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
} from "firebase/storage";
import { fileStorageSchema } from "../../models/fileStorageSchema.js";
import { RecuadroUnificador } from "../TablasAdd/RecuadroUnificador.jsx";
import TablaContenedores from "../Tablas/TablaContenedores.jsx";
import { alfabetColumnsExcel } from "../../libs/alfabetColumnsExcel.js";
import { puntoFinal, soloNumeros } from "../../libs/StringParsed.jsx";

export const DetalleBL = ({
  blMaster,
  docEncontrado,
  furgonesMaster,
  userMaster,
}) => {
  // // *********************** RECURSOS GENERALES ************************** //
  const esquemasAxuliares = {
    propiedadAuxItemHalarOrden: propiedadAuxItemHalarOrden,
    propiedadAuxItemFurgonCopiar: propiedadAuxItemFurgonCopiar,
  };
  const [counterDoc, setCounterDoc] = useState([]);
  useDocById("counters", setCounterDoc, "counterDocSAP");
  const MODO = "detalleBL";
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  let location = useLocation();

  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // ******************** MANEJANDO INPUTS CABECERA ******************** //
  const [blEditable, setBLEditable] = useState(blSchema);
  const [llegadaAlPaisMostrar, setLlegadaAlPaisMostrar] = useState("");

  const [cambiosNumDoc, setCambiosNumDoc] = useState(false);

  const handleInputCabecera = (e) => {
    const { name, value } = e.target;

    if (name == "llegadaAlPais") {
      const annio = value.slice(0, 4);
      const mes = value.slice(5, 7) - 1;
      const dia = value.slice(8, 10);

      setBLEditable((prevState) => ({
        ...prevState,
        llegada02AlPais: {
          ...prevState.llegada02AlPais,
          fecha: ES6AFormat(new Date(annio, mes, dia)),
        },
      }));
      setLlegadaAlPaisMostrar(value);
      return;
    } else if (name == "numeroDoc") {
      setBLEditable((prevState) => ({
        ...prevState,
        numeroDoc: value.trim().toUpperCase(),
      }));
      //
      if (blMaster.numeroDoc !== value) {
        setCambiosNumDoc(true);
      } else {
        setCambiosNumDoc(false);
      }
    } else {
      setBLEditable((prevEstadoEditable) => ({
        ...prevEstadoEditable,
        [name]: value,
      }));
    }
  };

  // ******************** MANEJANDO INPUTS TABLA ******************** //

  const handleInputTabla = (e) => {
    const indexDataset = Number(e.target.dataset.index);
    const idDataset = e.target.dataset.id;
    console.log(idDataset);
    const name = e.target.name;
    const value = e.target.value;

    let tipoBL = "";

    if (blMaster?.tipo) {
      tipoBL = blMaster?.tipo;
    } else {
      tipoBL = 0;
    }

    console.log(tipoBL);

    let arrayFurgones = [];
    if (tipoBL === 0) {
      arrayFurgones = [...furgonesMasterEditable];
    } else if (tipoBL === 1) {
      arrayFurgones = blEditable.fleteSuelto.partidas;
    }

    // No deben existen contenedores con numeros repetidos, esto traeria un desaste para la app, dado que hay bloque de codigo que calculo !=furgon.numeroDoc etc
    // Saber si un numero de furgon ya existe
    const numerosDeFurgones = new Set();
    arrayFurgones.forEach((furgon) => {
      numerosDeFurgones.add(furgon.numeroDoc.toString());
    });

    let hayDuplicados = false;
    if (name == "numero") {
      if (numerosDeFurgones.has(value.toUpperCase())) {
        hayDuplicados = true;
        setMensajeAlerta("Este numero ya existe en este BL.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }

    // 787878

    // *****************************************************
    // *****************************************************
    // *****************************************************
    // *****************************************************
    // *****************************************************
    if (!hayDuplicados) {
      console.log(indexDataset);
      const furgonesUpParsed = arrayFurgones.map((furgon, index) => {
        //
        let tipoBL = blMaster?.tipo;
        if (blMaster?.tipo === 1) {
          tipoBL = 1;
        } else {
          tipoBL = 0;
        }

        //
        //
        let proceder = false;
        if (tipoBL === 0) {
          if (furgon.id === idDataset) {
            proceder = true;
          }
        } else if (tipoBL === 1) {
          if (index === indexDataset) {
            proceder = true;
          }
        }

        if (proceder) {
          console.log("procediendo");
          return {
            ...furgon,
            [name]:
              name === "status"
                ? Number(value)
                : name == "numeroDoc"
                  ? value.toUpperCase()
                  : value,
          };
        }
        return {
          ...furgon,
        };
      });

      if (tipoBL === 0) {
        setFurgonesMasterEditable([...furgonesUpParsed]);
      } else if (tipoBL === 1) {
        setBLEditable({
          ...blEditable,
          fleteSuelto: {
            ...blEditable.fleteSuelto,
            partidas: [...furgonesUpParsed],
          },
        });
      }
    }
  };

  // ************ ACTUALIZAR DESPACHOS DE LAS ORDENES ************** //
  // DB ordenes llamadas es el estado de todas las ordenes que se van llamando conforme se crea el BL, posee los despachos de estas ordenes que estan creados, es decir los BL ya existentes en la Base de datos, el estado que se debe utilizar para todo es dbOrdenesLlamadasDespThisBL pues es una concecuencia de dbOrdenesLlamadas
  const [
    dbOrdenesLlamadasNoUsarSinoUtilizarThisBL,
    setDBOrdenesLlamadasNoUsarSinoUtilizarThisBL,
  ] = useState([]);
  // DB ordenes llamadas DEsp This BL es el mismo estado de dbordenes llamadas pero, contiene los despachos de este BL que se esta creando, dbordenes
  // UTILIZAR ESTE PARA TODO dbOrdenesLlamadasDespThisBL
  const [dbOrdenesLlamadasDespThisBL, setDBOrdenesLlamadasDespThisBL] =
    useState([]);
  const [furgonesMasterEditable, setFurgonesMasterEditable] = useState([]);
  // Este useEffect es para asimilar el useEffect que tenemos en addBL que actualiza el estado de ordenes llamadas; le agrega las cantidades despachada en this BL, para entender tomar en cuenta:
  // Existe dos tipos de despachos:
  // ------1-Despachos de la DB, estos despachos se le agregan cuando se llama la orden con la fucnion en la carpeta lib
  // ------2-Despachos this BL, es decir los despachos del BL que estamos creando o editando
  //
  //
  // Aqui en editar BL, este useEffect debe ser diferente al useEffect de addBL, y se realizara de la siguiente manera:
  //
  //
  // **Este paso no se realizara en este useEffect❌**
  // 1-Cuando el usuario presiona editar, tenemos que traer todas las ordenes de todos los materiales de este BL, y colocarsela al estado de ordenes llamadas; esto para alimentar el estado de ordenes llamadas y asimilar la modalidad del componente Addbl
  //
  //
  // **Este paso no se realizara en este useEffect❌**
  // 2-Esas ordenes se deben parsear con la funcion de la carpeta libs; parsear y agregar todos los despachos que ya existen en la DB
  //
  //
  // **Este paso no se realizara en este useEffect❌**
  // 3-Se le deben quitar todos los despachos de la DB que correspondan a este BL y hacerlo segun su id
  //
  // **Este paso se realizara en este useEffect✅**
  // 4-Este useEffect actualiza el estado de ordenes llamadas, de la siguiente manera:
  // --------1-Las ordenes que se llaman cuando se le da click a editar, sencillamente se actualiza luego de que llegan los datos de la DB con este useEffect y listo
  // --------2-Las ordenes que se llaman por separado luego de que ya estamos editando, es decir las ordenes que se halan escribiendo el numero de orden en el input y click en halar, esto se hara de la siguiente manera:
  // El usuario presiona halar y el SGI hara lo siguiente:
  // -------------------I-Si la orden ya existe en el estado de ordenes llamadas; sencillamente toma esa orden y colocala en el estado de orden indicada
  // -------------------II-Si la orden no existe en el estado de ordenes llamadas, es decir es una orden nueva que no esta dentro del BL; esta orden se parseaa con la funcion de la carpeta libs y se le agregan todos los despachos de la DB luego se agrega al estado de ordenes llamadas
  //
  //
  // Cada vez que se guarden los cambios de los materiales del recuadro unificador de materiales se activa este estado el cual actualiza todas las ordenes llamadas
  //
  //
  useEffect(() => {
    if (dbOrdenesLlamadasNoUsarSinoUtilizarThisBL.length > 0) {
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
    }
  }, [furgonesMasterEditable, dbOrdenesLlamadasNoUsarSinoUtilizarThisBL]);

  // ******************* BOTON EDITAR ********************* //

  const [isEditando, setIsEditando] = useState(false);
  const [cambiosSinGuardar, setCambiosSinGuardar] = useState(false);

  const editar = async () => {
    // Este condicionar es para evitar errores
    if (
      isEditando == true ||
      docEncontrado == false ||
      blMaster.estadoDoc == 2
    ) {
      return "";
    } else if (isEditando == false) {
      setIsEditando(true);
      setBLEditable({ ...blMaster });

      // Si es un BL normal es decir con furgones
      const editarBLNormal = () => {
        setFurgonesMasterEditable([...furgonesMaster]);

        // Reiniciar cosas
        setFurgonSelect("");
        setFurgonIndicado({ ...furgonSchema });
        setIndexFurgonEnBL(null);
      };
      if (blMaster.tipo === 0) {
        editarBLNormal();
      }
      // Pero si es un BL de carga suelta
      else if (blMaster.tipo === 1) {
        setVentanaJuntaMateriales(2);
        setVentanaOrdenVisible(true);
        setMaterialesUnificados(blMaster.fleteSuelto.materiales);

        setTimeout(() => {
          tablaOrdenRef.current.scrollIntoView({ behavior: "smooth" });
        }, 100);
        // setFurgonesMasterEditable(blMaster.fleteSuelto);
      }
      // Esto por si es un BL creado antes que al schema se a agregara la propiedad tipo
      else {
        editarBLNormal();
      }

      // Aqui necesitamos saber si la fecha que se esta mostrando en Pantalla es la estimada o la confirmada

      const dia = blMaster.llegada02AlPais?.fecha?.slice(0, 2);
      const mes = blMaster.llegada02AlPais?.fecha?.slice(3, 5);
      const annio = blMaster.llegada02AlPais?.fecha?.slice(6, 10);

      setLlegadaAlPaisMostrar(`${annio}-${mes}-${dia}`);

      // Reiniciar cosas
      setNClases([]);

      // 1-Traeme todas las ordenes de compra utilizadas en este BL
      const ordenesLlamadasAux = await fetchDocsByArrayContains(
        "ordenesCompra2",
        undefined,
        "idsBLUtilizados",
        blMaster.id
      );
      // 2-Esas ordenes la vas a parsaer con la funcion OrdenParsedConDespDB de la carpeta libs, basicamente se le agregaran los despachos actualizados de la DB
      const ordenesFinales = await Promise.all(
        ordenesLlamadasAux.map((orden) =>
          OrdenParsedConDespDB(orden, MODO, blEditable)
        )
      );
      // 3-Ahora le quitamos todos los despachos que tengan esas ordenes que correspondan a este BL, esto para luego agregarselo de manera reactiva es decir segun el usuario edite el BL, entonces se va actualizando las ordenes con un useEffect y al final cuando se guardan los cambios se eliminan estos valores de la orden, es decir no se guarda eso en la orden, sino que cada material dentro del furgon indica de que orden proviene

      const ordenesSinDespachoThisBL = quitarDespachosThisBL(ordenesFinales);
      setDBOrdenesLlamadasNoUsarSinoUtilizarThisBL([
        ...ordenesSinDespachoThisBL,
      ]);
    }
  };
  const quitarDespachosThisBL = (ordenes) => {
    const ordenesSinDespachoThisBL = ordenes.map((orden) => {
      const materiales = orden.materiales.map((item) => {
        const despachosDB = item.valoresAux.despachosDB.filter(
          (desp) => desp.idBL != blMaster.id
        );

        return {
          ...item,
          valoresAux: {
            ...item.valoresAux,
            despachosDB: despachosDB,
          },
        };
      });

      return {
        ...orden,
        materiales: materiales,
      };
    });
    return ordenesSinDespachoThisBL;
  };
  // ********************* ELIMINAR FURGON ************************** //
  const [furgonesEliminados, setFurgonesEliminados] = useState([]);
  const eliminarFila = (e) => {
    let index = Number(e.target.dataset.index);

    const idDataset = e.target.dataset.id;
    let validacion = {
      sinCambios: true,
    };

    // Si se modifico algo en la tabla de materiales
    if (cambiosSinGuardar == true) {
      setMensajeAlerta("Guarde o cancele los cambios en materiales.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      validacion.sinCambios == false;
      return "";
    }
    if (validacion.sinCambios == true) {
      const furgonEliminado = furgonesMasterEditable.find(
        (furgon) => furgon.id == idDataset
      );
      setFurgonesEliminados([...furgonesEliminados, furgonEliminado]);
      setFurgonesMasterEditable(
        furgonesMasterEditable.filter((furgon) => {
          if (furgon.id !== idDataset) {
            return furgon;
          }
        })
      );

      setFurgonIndicado(furgonSchema);
      setCambiosSinGuardar(false);
      setVentanaJuntaMateriales(0);
      setVentanaOrdenVisible(false);
      setOrdenIndicada(null);
      setNClases([]);
    }
  };

  // ************************ CANCELAR CAMBIOS ************************** //
  const cancelar = () => {
    setIsEditando(false);
    setFurgonesMasterEditable([]);

    // Reiniciar cosas
    setNClases([]);

    setFurgonIndicado(furgonSchema);
    setVentanaOrdenVisible(false);
    setFurgonSelect("");
    setVentanaJuntaMateriales(0);

    setLlegadaAlPaisMostrar("");
    setOrdenIndicada(null);
    setIndexFurgonEnBL(null);
  };

  // ************************ COPIAR MATERIALES DE ORDEN ************************** //
  const tablaFurgonRef = useRef(null);

  const [furgonIndicado, setFurgonIndicado] = useState(furgonSchema);
  const [indexFurgonEnBL, setIndexFurgonEnBL] = useState(null);

  // Para saber cuando la ventana que unifica los materiales esta activa;
  // 0-Inactiva
  // 1-Activa modo agregar Color Azul
  // 2-Activa modo editar color Orange
  // 3-Modo carga suelta
  // En este componente es decir en detalle BL siempre se usara en modo editar dado que para editar debe existe ya un furgon, a diferencia de crear bl que puedes estar creando un furgon que aun no existe
  const [ventanaJuntaMateriales, setVentanaJuntaMateriales] = useState(0);

  const mostrarMaterialesParaEditar = async (e) => {
    let indexDataset = Number(e.target.dataset.index);
    const idDataset = e.target.dataset.id;

    setIndexFurgonEnBL(indexDataset);
    let validacion = {
      sinCambios: true,
    };

    // Si se modifico algo en la tabla de materiales
    if (cambiosSinGuardar == true) {
      setMensajeAlerta("Guarde o cancele los cambios en materiales.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      validacion.sinCambios == false;
      return "";
    }

    // Si todo esta correcto
    if (validacion.sinCambios == true) {
      // Colocar clase a la fila
      let newNClases = [];
      newNClases[indexDataset] = "filaSelected";
      setNClases(newNClases);

      setVentanaJuntaMateriales(2);
      setVentanaOrdenVisible(true);

      // ****** AQUI SE PARSEA EL FURGON SELECCIONADO *****
      const furgonFind = furgonesMasterEditable.find(
        (furgon) => furgon.id === idDataset
      );
      const matFurgonIndicado = furgonFind.materiales.map((articulo) => {
        let itemParsed = { ...articulo };

        dbOrdenesLlamadasDespThisBL.forEach((orden) => {
          orden.materiales.forEach((product) => {
            if (
              articulo.codigo == product.codigo &&
              articulo.ordenCompra == orden.numeroDoc
            ) {
              itemParsed = {
                ...articulo,
                valoresAux: {
                  ...valoresAuxFurgons(
                    product,
                    furgonesMasterEditable,
                    MODO,
                    articulo,
                    // Esta propiedad es necesaria cuando estamos editando un BL,
                    // Esta propiedad es diferente a la furgonesMasterEditable, pues una es editable significa que es lo que vamos editando local y la otra son los datos que estan guardados en la base de datos
                    furgonesMaster
                  ),
                },
              };
            }
          });
        });

        return {
          ...articulo,
          ...itemParsed,
        };
      });
      setFurgonIndicado({
        ...furgonesMasterEditable[indexDataset],
      });

      setMaterialesUnificados(matFurgonIndicado);

      setTimeout(() => {
        tablaOrdenRef.current.scrollIntoView({ behavior: "smooth" });
      }, 50);
    }
  };

  const cancelarAgregarMat = () => {
    setNClases([]);
    setVentanaJuntaMateriales(0);
    setFurgonIndicado({ ...furgonSchema });

    setCambiosSinGuardar(false);
    setVentanaOrdenVisible(false);
    setOrdenIndicada(null);
  };

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

  const mostrarOrden = async (e) => {
    e.preventDefault();
    if (valueInputOrdenCompra == "") {
      setMensajeAlerta("Por favor ingrese numero de orden de compra.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    setIsLoading(true);
    const ordenExtraida = await traerOrden(valueInputOrdenCompra);
    if (ordenExtraida.length > 0) {
      // Si encuentra la orden, parseala; agregale los despachos a sus materiales, para ello va a traer de la base de datos los BL que halla utilizado esta orden y sus furgones
      const ordenParsedDesp = await OrdenParsedConDespDB(
        ordenExtraida[0],
        MODO,
        blEditable
      );
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
      // Si la orden ya habi sido llamada, entonces dame la nueva y quita la vieja
      const dbOrdenesSinViejaRepeat = dbOrdenesLlamadasDespThisBL.filter(
        (orden, index) => {
          if (orden.numeroDoc !== ordenConcluida.numeroDoc) {
            return orden;
          }
        }
      );
      setDBOrdenesLlamadasNoUsarSinoUtilizarThisBL([
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
      undefined,
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

  const crearFurgon = () => {
    let sinEdicion = true;
    if (ventanaJuntaMateriales > 0) {
      setMensajeAlerta("Guarde o cancele los materiales en edicion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      sinEdicion = false;
      return "";
    }

    if (sinEdicion == true) {
      setFurgonesMasterEditable([
        ...furgonesMasterEditable,
        {
          ...furgonSchema,
          numeroDoc: furgonesMasterEditable.length + 1,
        },
      ]);
    }
  };
  // // **************************** GUARDAR CAMBIOS ******************************* //
  // 147
  const funcionBLLlegoAlPais = (billOfLading) => {
    // *************** VALIDACIONES DE FECHAS ***************
    //0- Si el BL aun no llega al pais, todos los furgones deben tener de status; Transito Maritimo

    //1- Si el BL llego al pais, ningun furgon puede tener de status; Transito Maritimo

    //2- Si el BL llega hoy al pais, se permite cualquier status a los furgones, de la siguiente manera;
    // Todos tienen Transito Maritimo
    // Ninguno tiene Transito Maritimo

    // Calcular si el BL llego al pais
    // 0-Aun no llega al pais ---- Fecha de llegada a un no se cumple
    // 1-Llego al pais ----------- Fecha de llegada ya se cumplio
    // 2-Llegando hoy al pais ---- Fecha de llegada igual a fecha actual, es decir es el mismo dia
    let blLlegoAlPais = "";

    // Obteniendo variables elementales
    const annio = Number(billOfLading.llegada02AlPais.fecha.slice(6, 10));
    const mes = Number(billOfLading.llegada02AlPais.fecha.slice(3, 5) - 1);
    const mesSinRebajar = Number(
      billOfLading.llegada02AlPais.fecha.slice(3, 5)
    );
    const dia = Number(billOfLading.llegada02AlPais.fecha.slice(0, 2));

    // Comparar fecha llegada al pais vs fechas de cada furgon
    let fechaActual = new Date();
    let llegadaAlPaisBLES6 = new Date(annio, mes, dia);
    // Calculando si el BL llego o no al pais

    // 1-Primero verifica que el dia indicando por el usuario no es el dia de hoy, obviando las horas y minutos super importante
    if (
      llegadaAlPaisBLES6.getFullYear() !== fechaActual.getFullYear() ||
      llegadaAlPaisBLES6.getMonth() !== fechaActual.getMonth() ||
      llegadaAlPaisBLES6.getDate() !== fechaActual.getDate()
    ) {
      // 2-Una vez que sabemos que no estamos trantando el mismo dia, verifica si llegada al pais es anterior o posterior al dia de hoy
      if (llegadaAlPaisBLES6 > fechaActual) {
        // ******EL BL AUN NO LLEGA AL PAIS*****
        blLlegoAlPais = 0;
      } else if (llegadaAlPaisBLES6 < fechaActual) {
        // ******EL BL YA LLEGO AL PAIS*****
        blLlegoAlPais = 1;
      }
    }
    // Si el dia indicado de llegada al pais es igual al dia de hoy obviando las horas y minutos muy importante
    else if (
      fechaActual.getFullYear() === llegadaAlPaisBLES6.getFullYear() &&
      fechaActual.getMonth() === llegadaAlPaisBLES6.getMonth() &&
      fechaActual.getDate() === llegadaAlPaisBLES6.getDate()
    ) {
      // ******EL BL LLEGA HOY AL PAIS*****
      blLlegoAlPais = 2;
    }

    return blLlegoAlPais;
  };
  const guardarCambios = async () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // // ************** Validaciones Cabecera ************** //
    // Si numero de BL esta vacio
    if (blEditable.numeroDoc == "") {
      setMensajeAlerta("Favor colocar numero de BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si el BL ingresado tiene espacios
    if (
      blEditable.numeroDoc.includes(" ") ||
      blEditable.numeroDoc.includes("\n")
    ) {
      setMensajeAlerta("En el campo numero de BL no se permiten espacios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si el proveedor esta vacio
    if (blEditable.proveedor == "") {
      setMensajeAlerta("Favor colocar nombre de Proveedor.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si el campo naviera esta vacio
    if (blEditable.naviera == "") {
      setMensajeAlerta("Favor colocar nombre de Naviera.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si el campo diasLibres esta vacio
    console.log(blMaster);
    if (blMaster.tipo === 0) {
      if (blEditable.diasLibres == "") {
        setMensajeAlerta("Favor colocar cantidad de dias libres.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }
    // Si el campo puerto esta vacio
    if (blEditable.puerto == "") {
      setMensajeAlerta("Favor indicar puerto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si el campo llegada al pais esta vacio
    if (blEditable.llegada02AlPais.fecha == "") {
      setMensajeAlerta("Se debe ingresar fecha de llegada al pais.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    // // ************** Validaciones Tabla ************** //
    // BL normal
    let procederArrayFurgon = true;
    if (blMaster.tipo === 0) {
      // Si algun numero de furgon se repite
      const numerosDeFurgones = new Set();
      let hayDuplicados = false;
      furgonesMasterEditable.forEach((furgon) => {
        if (numerosDeFurgones.has(furgon.numeroDoc)) {
          hayDuplicados = true;
        } else {
          numerosDeFurgones.add(furgon.numeroDoc);
        }
      });
      if (hayDuplicados) {
        setMensajeAlerta("Existen numeros de contenedores repetidos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si no se colocaron furgones
      if (furgonesMasterEditable.length == 0) {
        setMensajeAlerta("BL sin contenedores.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si hay un furgon en ejecucion, es decir si la ventana Recuadro unificador de copiarAfurgonMaster... esta activa
      if (ventanaJuntaMateriales > 0) {
        setMensajeAlerta(
          "Primero guarde o cancele el contenedor que esta modificando."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      // Si algun furgon:
      // No tiene numero
      // No tiene tamannio
      // No tiene destino
      // No tiene status
      // No tiene materiales

      // 123
      for (let i = 0; i < furgonesMasterEditable.length; i++) {
        // Si el BL ingresado tiene espacios
        if (
          furgonesMasterEditable[i].numeroDoc.includes(" ") ||
          furgonesMasterEditable[i].numeroDoc.includes("\n")
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
        if (furgonesMasterEditable[i].numeroDoc == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar numero al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        if (furgonesMasterEditable[i].tamannio == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar tamaño al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          break;
        }
        if (furgonesMasterEditable[i].destino == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(
            `Indicar destino al contenedor de la fila ${i + 1}.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        if (furgonesMasterEditable[i].status == "") {
          procederArrayFurgon = false;
          setMensajeAlerta(`Indicar status al contenedor de la fila ${i + 1}.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 4000);
          break;
        }
        if (furgonesMasterEditable[i].materiales.length == 0) {
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
    if (blMaster.tipo === 1) {
      // SI no se agrego materiales a la carga suelta
      if (materialesUnificados.length == 0) {
        setMensajeAlerta("Agregar materiales al recuadro unificador.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // Si el numero de BL ya existe en la base de datos
    const numExist = counterDoc.bls.includes(
      blEditable.numeroDoc.toLowerCase()
    );
    if (numExist) {
      if (blEditable.numeroDoc != blMaster.numeroDoc) {
        setMensajeAlerta("El numero de BL ya existe en la base de datos.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }

    const blLlegoAlPais = funcionBLLlegoAlPais(blEditable);
    // El proposito de este for es validar la coherencia entre los status de los furgones a nivel individual y la fecha global de llegada al pais colocada en la cabecera del BL
    let procederFurgones = true;
    for (let i = 0; i < furgonesMasterEditable.length; i++) {
      // Si el BL aun no llega al pais
      if (blLlegoAlPais == 0) {
        // Si el BL aun no llega al pais, todos sus furgones deben tener status transito maritimo
        if (furgonesMasterEditable[i].status !== 1) {
          procederFurgones = false;
          setMensajeAlerta(
            `La fecha de llegada al pais indica que los contenedores aun no llegan, favor colocar el status de todos los furgones en transito maritimo o cambie la fecha de llegada al pais.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 7000);
          break;
        }
      }
      // Si el BL llego al pais
      else if (blLlegoAlPais == 1) {
        // Si el BL llego al pais ningun furgon debe tener status En Proveedor o Status Transito Maritimo
        if (
          furgonesMasterEditable[i].status == 1 ||
          furgonesMasterEditable[i].status == 0
        ) {
          procederFurgones = false;
          setMensajeAlerta(
            `En la fecha de llegada al pais indicas que el BL ya llego, no debe haber contenedores en transito maritimo.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 8000);
          break;
        }
      } else if (blLlegoAlPais == 2) {
        // Aqui podemos colocar que se pueden aceptar cualquier status desde transito maritimo en adelante,
        // Aqui podemos colocar las siguientes conticiones:
        // Se aceptan que todos sean transito maritimo
        // Se aceptan que ninguno sean transito maritimo
        // No se aceptan ambos, es decir furgones que no sean transito maritimo junto con furgones en transito maritimo
        // No se acepta proveedor
        //
        // Dado a que en realidad estas condiciones deben ser general sin importar que el contenedor llega hoy, se colocara a nivel general
      }
    }
    if (procederFurgones == false) {
      return;
    }

    // Aqui se cumplen las siguientes condiciones:
    // Se aceptan que todos los furgones esten en transito maritimo
    // Se aceptan que ningun furgon este en transito maritimo
    // No se acepta que dentro de la lista halla transito maritimo y otros

    // Primero verifica si algun furgon tiene de Status Transito Maritimo
    let procederTransitoAll = true;
    const hasTransitoMaritimo = furgonesMasterEditable.some(
      (furgon) => furgon.status == 1
    );
    if (hasTransitoMaritimo) {
      const todosFurgonesTransitoMaritimo = furgonesMasterEditable.every(
        (furgon) => furgon.status == 1
      );
      if (todosFurgonesTransitoMaritimo == false) {
        procederTransitoAll = false;
        setMensajeAlerta(
          `Existen contenedores con status Transito Maritimo y otros no, por favor corregir incoherencia.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 6000);
        return;
      }
    }
    if (procederTransitoAll == false) {
      return;
    }
    // No se aceptan furgones en status proveedor
    // Esto no deberia ejecutarse nunca dado que la opcion proveedor esta en modo disabled, el usuario no podria selecionarla, colocaDo "por si acaso"
    if (furgonesMasterEditable.some((furgon) => furgon.status == 0)) {
      setMensajeAlerta(
        `Existen contenedores con status Proveedor, por favor corregir incoherencia.`
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 6000);
      return;
    }
    // Si todo esta correcto
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    // 🟢🟢🟢🟢🟢🟢🟢🟢🟢🟢
    setNClases([]);
    setIsLoading(true);
    try {
      // 456
      let tipoBL = blMaster?.tipo;

      if (!tipoBL) {
        tipoBL = 0;
      }
      console.log(tipoBL);
      const batch = writeBatch(db);
      // 🟢🟢🟢🟢🟢********* ACTUALIZAR CONTADOR *************🟢🟢🟢🟢🟢
      // Contador BL
      const contadorNumeroDocId = "counterDocSAP";
      const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
      const counterFiltrado = counterDoc.bls.filter(
        (numBl) => numBl.toLowerCase() != blMaster.numeroDoc.toLowerCase()
      );

      batch.update(contadorUpdate, {
        bls: [...counterFiltrado, blEditable.numeroDoc.toLowerCase()],
      });

      //
      // 🟢🟢🟢***** ACTUALIZAR BILL OF LADING *********🟢🟢🟢
      const blActualizar = doc(db, "billOfLading2", blEditable.id);
      let isTransitoAux = false;

      let furgones_Partidas = [];
      if (tipoBL === 1) {
        furgones_Partidas = blMaster.fleteSuelto.partidas;
      } else if (tipoBL === 0) {
        furgones_Partidas = furgonesMasterEditable;
      }

      if (furgones_Partidas.every((furgon) => furgon.status == 1)) {
        isTransitoAux = true;
      }
      console.log(blEditable);
      const estadoDoc =
        tipoBL === 0
          ? blEstadoParsed(blEditable, furgonesMasterEditable)
          : tipoBL === 1
            ? blEstadoParsed(blEditable, blEditable.fleteSuelto.partidas)
            : blMaster.estadoDoc;
      //
      batch.update(blActualizar, {
        ...blEditable,
        estadoDoc: estadoDoc,
        updateAt: ES6AFormat(new Date()),
        isTransito: isTransitoAux,

        logModificaciones: [
          ...blEditable.logModificaciones,
          {
            fecha: ES6AFormat(new Date()),
            userNameCreador: userMaster.userName,
            idCreador: userMaster.id,
            descripcionCambio: "update",
            documento: { ...blEditable, logModificaciones: null },
          },
        ],
      });

      // 🟢🟢🟢******** ACTUALIZAR FURGONES  // CARGA SUELTA************🟢🟢🟢
      const annio = llegadaAlPaisMostrar.slice(0, 4);
      const mes = llegadaAlPaisMostrar.slice(5, 7);
      const dia = llegadaAlPaisMostrar.slice(8, 10);

      const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
        FuncionUpWayDate(annio, mes, dia, 2);
      const newDatosBL = {
        ...datosBlAFurgon(blEditable),
        tipoBL: tipoBL,
      };
      const newFechas = {
        llegada02AlPais: {
          fecha: llegadaAlPais,
          confirmada: false,
        },
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
      };

      // 🟢******** 1-FURGONES ***********
      const idsNumsTodosFurgonesCreando = [];
      if (tipoBL === 0) {
        furgonesMasterEditable.forEach((furgon) => {
          // Este if es para los furgones que ya existian, tomando en cuenta que en editar BL, se pueden agregar furgones nuevos
          if (furgon.id) {
            const furgonActualizar = doc(db, "furgones", furgon.id);
            const furgonUp = {
              ...furgon,
              fechas: newFechas,
              datosBL: newDatosBL,
              arrayItems: furgon.materiales.map((item) => item.codigo),

              materiales: furgon.materiales.map((item) => {
                return {
                  ...item,
                  valoresAux: null,
                };
              }),
            };
            console.log(furgonUp);
            batch.update(furgonActualizar, furgonUp);
          }
          // Este if es para los furgones que se agregaron nuevos
          else {
            const collectionFurgonRef = collection(db, "furgones");

            const nuevoDocumentoRefFurgon = doc(collectionFurgonRef);

            idsNumsTodosFurgonesCreando.push({
              id: nuevoDocumentoRefFurgon.id,
              numeroFurgon: furgon.numeroDoc,
            });

            crearNuevoFurgonBath(
              batch,
              furgon,
              nuevoDocumentoRefFurgon,
              blEditable,
              llegadaAlPaisMostrar,
              userMaster
            );
          }
        });

        // Furgones eliminados
        furgonesEliminados.forEach((furgon) => {
          // verificar si el furgon ya esta cargado en la base de datos
          if (furgon.id) {
            const furgonActualizar = doc(db, "furgones", furgon.id);
            batch.delete(furgonActualizar);
          } else {
            // Si se creo en la edicion pero luego se elimino, ese furgon nunca llego a la base de datos, por tanto no se necesita eliminar nada
            return;
          }
        });
      }

      // 🟢******** 2- CARGA SUELTA ************
      let fleteSueltoPlantilla = {};
      if (tipoBL === 1) {
        fleteSueltoPlantilla = blMaster.fleteSuelto;
      } else if (tipoBL === 0) {
        fleteSueltoPlantilla = { ...blSchema.fleteSuelto };
      }

      const partidasFleteSuelto = fleteSueltoPlantilla.partidas.map(
        (part, index) => {
          return {
            ...part,
            fechas: newFechas,
            datosBL: newDatosBL,
            numeroDoc:
              blMaster.fleteSuelto.numeroDoc + alfabetColumnsExcel(index + 1),
            materiales: part.materiales.map((item) => {
              return {
                ...item,
                valoresAux: null,
              };
            }),
          };
        }
      );
      batch.update(blActualizar, {
        fleteSuelto:
          tipoBL === 1
            ? {
                ...blMaster.fleteSuelto,
                materiales: materialesUnificados,
                partidas: partidasFleteSuelto,
              }
            : fleteSueltoPlantilla,
      });
      // 🟢🟢🟢****** ACTUALIZAR ORDENES DE COMPRA UTILIZADAS*********🟢🟢🟢*
      // Primero tenemos que filtrar el estado, es decir quitar las ordenes que no se hallan utilizado, se me ocurren dos posibles casos que ocasiona que halla orden que no estemos utilizando:
      // Talvez hay mas casos, dos que se me ocurren:
      // 1-Cuando un usuario hala una orden se agrega al estado, aunque el usuario no tome materiales como quiera se queda la orden halada,
      // 2-EL usuario hala la orden y toma materiales, pero luego quita los materiales, la orden como quiera se queda

      //🟢 I-Aplana los materiales y dame un array solo de numero de ordenes
      let numsOrden = [];
      if (tipoBL === 0) {
        numsOrden = furgonesMasterEditable
          .flatMap((furgon) => furgon.materiales)
          .map((item) => item.ordenCompra);
      }
      // Si es carga suelta toma la info directamente desde el recuadro unificador
      else if (tipoBL === 1) {
        numsOrden = materialesUnificados.map((item) => item.ordenCompra);
      }

      const numsOrdenUnicos = [...new Set(numsOrden)];
      // 🟢 II-Ahora filtra las ordenes, quita las que no estes utilizando
      const ordenesFiltradas = dbOrdenesLlamadasDespThisBL.filter((orden) =>
        numsOrdenUnicos.includes(orden.numeroDoc)
      );
      // 🟢III-Llama todas las ordenes de compra que tengan el id de esta BL en su array de ids de bls utilizados
      const ordenesConEsteBL = await fetchDocsByArrayContains(
        "ordenesCompra2",
        undefined,
        "idsBLUtilizados",
        blMaster.id
      );
      // 🟢IV-Verifica cuales de esas ordenes no se encuentran en este BL actualmente
      const ordenesQuitarIdEsteBL = ordenesConEsteBL.filter(
        (orden) => !numsOrdenUnicos.includes(orden.numeroDoc)
      );

      // 🟢V- Recorre estas ordenes y:
      // Quitale el id de este BL
      // Quitale el los ids de los furgonesMaster
      ordenesQuitarIdEsteBL.forEach((orden) => {
        // QUEDE AQUI 29/9/25
        // ACABO DE HACER QUE AL EDITAR BL
        // LAS ORDENES QUE NO UTILIZO EN ESTE BL
        // SE LE QUITE EL ID DE ESTE BL
        // Y TAMBIEN EL ID DE LOS FURGONES
        // HICE UNA PRUEBA A CADA UNO Y FUNCIONO
        // FALTA HACER VARIAS PRUBEAS A PRODUNFIDAD
        // 29/9/25
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //🟡🟡🟡🟡🟡🟡🟡🟡
        //
        const idBLsParsed = orden.idsBLUtilizados.filter(
          (idBL) => idBL != blMaster.id
        );
        const idsFurgonesMaster = furgonesMaster.map((furgon) => furgon.id);
        const idFurgonesParsed = orden.idFurgonesUtilizados.filter(
          (idFurgones) => !idsFurgonesMaster.includes(idFurgones)
        );
        const ordenActualizar = doc(db, "ordenesCompra2", orden.id);

        batch.update(ordenActualizar, {
          idsBLUtilizados: [...idBLsParsed],
          idFurgonesUtilizados: [...idFurgonesParsed],
        });

        // 1-Recorre todas las ordenes de compra que ya no estamos utilizando en este BL
        // 2-A cada ornde quitale los furgones que correspondan a furgonesMaster
      });

      // 🟢VI - Verifica las ordenes de compra que tengan algun ids de algun furgon de los furgones del BL master y actualiza su array de ids de furgones, tomar en cuenta:
      // ------se debe verificar por separado del id de BL, JAMAS se debe verificar en el mismo array de arriba donde se eliminar el ids del array de ids de bl de la orden de compra
      // ------Un mismo BL que tiene varios furgones, podemos eliminar la ordne de un furgon especifico, esa orden estaria utilizando el id de este BL master pero aun asi se le debe quitar el id del furgon mensionado
      // ------El id de los furgones se debe tomar desde furgones master, el que no es editable, dado que es presisamente verificar como esta en base de datos para actualizarlo a lo que hemos editado
      //

      // 🟢 VII -Recorre cada orden utilizada y actualiza:
      // --------------Agregale numero de id de este BL
      // --------------Agregale los numneros de ids de furgones utilizados
      // --------------Actualiza sus estados
      for (const orden of ordenesFiltradas) {
        const ordenActualizar = doc(db, "ordenesCompra2", orden.id);
        // *****Actualiza el array de BLs utilizados*****
        // 1-Quita el numero de bl anterior que tenga la orden en su array
        const idsBLFilter = orden.idsBLUtilizados.filter(
          (id) => id != blMaster.id
        );
        // 2-Agregale el numero de BL de bl editable, halla tenido cambios o no
        batch.update(ordenActualizar, {
          idsBLUtilizados: [...idsBLFilter, blEditable.id],
        });

        if (tipoBL === 0) {
          // ****Actualiza el array de FURGONES utilizados*****
          // 1-Dame todos los ids de furgones utilizados en el furgonesMaster es decir los que no se han editado, estos furgones debemos quitarlos de la orden
          const idsTodosFurgonesMaster = furgonesMaster.map((furgon) => {
            return furgon.id;
          });
          // 2-Quita todos los ids de furgones anteriores, es decir limpia la orden
          let idFurgonesUsedOrden = orden.idFurgonesUtilizados.filter((id) => {
            const hasFurgon = idsTodosFurgonesMaster.includes(id);
            if (!hasFurgon) {
              return id;
            }
          });
          // **********************
          // Ahora sigue agregar los ids de furgones nuevos, estos podrian ser los mismo furgones la mayoria del tiempo, pero tambien es probable que el usuario cree nuevos furgones
          // **********************

          // 3-Dame todos los ids con su numero de furgon de los furgones pero los editables, que son los que vamos agregar
          const idsNumsTodosFurgonesEditable = furgonesMasterEditable.map(
            (furgon) => {
              return {
                id: furgon.id,
                numeroFurgon: furgon.numeroDoc,
              };
            }
          );
          // 4-A esos ids/nums de furgones unificalos con el array de furgones nuevos si tiene furgones
          const idsNumsCongloTodosFurgones = [
            // EL filter es super necesario, resulta que cuando creamos un furgon se grega a furgonesMasterEditable, pero sin id, pero luego lo estamos unificando por tanto los furgones creados existirian dos veces una con id y otra sin id
            ...idsNumsTodosFurgonesEditable.filter((num) => num.id),
            ...idsNumsTodosFurgonesCreando,
          ];

          // 6-Toma ese conglomerado de furgones (furfones editables mas los furgones que el usuario creo) y gregar todos esos ids al array de ids de furgones de la orden de compra
          idsNumsCongloTodosFurgones.forEach((id) => {
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
          estadoDoc: await ordenEstadoParsedNueva(
            orden,
            furgonesMasterEditable
          ),
        });
      }

      // 🟢🟢🟢🟢🟢********* CONFIRMACION *************🟢🟢🟢🟢🟢*
      await batch.commit();
      // return;
      setIsLoading(false);

      setMensajeAlerta("BL actualizado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setFurgonesEliminados([]);

      // Si el usuario modifico el numero de documento, el cual afecta la URL, entonces que valla a la raiz de detalle BL
      if (cambiosNumDoc == true) {
        setTimeout(() => {
          navigate(
            "/importaciones/maestros/billoflading/" + blEditable.numeroDoc
          );
        }, 500);
      }
    } catch (error) {
      console.error("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 7000);
    }

    // Reiniciando
    setBLEditable(blSchema);
    setFurgonesMasterEditable([]);
    setLlegadaAlPaisMostrar("");
    setCambiosNumDoc(false);
    setIsEditando(false);
    setFurgonIndicado(furgonSchema);
    setIsLoading(false);
    setCambiosSinGuardar(false);
    setVentanaJuntaMateriales(0);
    setVentanaOrdenVisible(false);
  };

  // // **************************** CODIGO ********************************* //
  // // ************************* VISUALIZACION ***************************** //
  const tablaItemRef = useRef(null);
  const [furgonSelect, setFurgonSelect] = useState("");

  const [nClases, setNClases] = useState([]);

  const mostrarItem = (e) => {
    let index = Number(e.target.dataset.index);
    let idDataset = e.target.dataset.id;
    let numeroDataset = e.target.dataset.numerodoc;

    let furgonFind = {};
    //
    if (blMaster.tipo === 0) {
      furgonFind = furgonesMaster.find((furgon) => furgon.id == idDataset);
    } else if (blMaster.tipo === 1) {
      furgonFind = blMaster.fleteSuelto.partidas.find(
        (furgon) => furgon.numeroDoc == numeroDataset
      );
    }
    // Este else es por si el BL es antiguo y no tiene la propiedad tipo
    else {
      furgonFind = furgonesMaster.find((furgon) => furgon.id == idDataset);
    }

    setFurgonSelect(furgonFind);

    let newNClases = [];
    newNClases[index] = "filaSelected";
    setNClases(newNClases);

    setTimeout(() => {
      tablaItemRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // ************************* COSTOS ***************************** //
  const [costoArray, setCostoArray] = useState({
    costos: [],
    blIndicado: "",
    idBL: "",
  });
  const [mostrarCostos, setMostrarCostos] = useState(false);
  const costearBL = () => {
    if (blEditable.costos) {
      setMostrarCostos(true);
      setCostoArray({
        ...costoArray,
        costos: blEditable.costos,
        blIndicado: blEditable.numeroDoc,
        idBL: blEditable.id,
      });
    }
  };

  // ************************* CAMBIO DE FECHA DE LLEGADA AL PAIS ***************************** //
  const [hasModal, setHasModal] = useState(false);
  const cambioFechaFunct = () => {
    setHasModal(true);
  };
  useEffect(() => {
    if (!hasModal) {
      setValueNewETA("");
    }
  }, [hasModal]);
  const [valueNewETA, setValueNewETA] = useState("");
  const handleNewEta = (e) => {
    const { value } = e.target;
    setValueNewETA(value);
  };
  const guardarNewETA = async () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si el input esta vacio
    if (valueNewETA == "") {
      setIsLoading(false);
      setMensajeAlerta("Colocar nueva fecha.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
    // Si el usuario no tiene el privilegio
    const hasPermiso = userMaster.permisos.includes("editETABL");
    if (!hasPermiso) {
      return;
    }

    try {
      const batch = writeBatch(db);
      setIsLoading(true);
      // 🟢🟢🟢***** ACTUALIZAR BILL OF LADING *********🟢🟢🟢
      const fechaForma = inputAFormat(valueNewETA);
      const anteriorETA = blMaster.llegada02AlPais.fecha;
      const blActualizar = doc(db, "billOfLading2", blMaster.id);
      batch.update(blActualizar, {
        "llegada02AlPais.fecha": inputAFormat(valueNewETA),
        "llegada02AlPais.confirmada": false,
      });

      // 🟢🟢🟢******** ACTUALIZAR FURGONES // CARGA SUELTA ************🟢🟢🟢
      const annio = valueNewETA.slice(0, 4);
      const mes = valueNewETA.slice(5, 7);
      const dia = valueNewETA.slice(8, 10);
      const { llegadaAlPais, llegadaAlmacen, llegadaDptoImport, llegadaSap } =
        FuncionUpWayDate(annio, mes, dia, 2);

      const newFechas = {
        llegada02AlPais: {
          fecha: llegadaAlPais,
          confirmada: false,
        },
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
      };

      // 🟢******** 1-FURGONES ***********
      furgonesMaster.forEach((furgon) => {
        const furgonActualizar = doc(db, "furgones", furgon.id);
        batch.update(furgonActualizar, {
          fechas: newFechas,
        });
      });

      // 🟢******** 2- CARGA SUELTA ************
      const fleteSueltoParsed = {
        ...blMaster.fleteSuelto,
        partidas: blMaster.fleteSuelto.partidas.map((part) => {
          return {
            ...part,
            fechas: newFechas,
          };
        }),
      };

      if (blMaster?.tipo === 1) {
        batch.update(blActualizar, {
          fleteSuelto: fleteSueltoParsed,
        });
      }

      // 🟢🟢🟢🟢🟢********* CONFIRMACION *************🟢🟢🟢🟢🟢*
      await batch.commit();

      // 🟢🟢🟢🟢🟢********* ENVIAR CORREOS *************🟢🟢🟢🟢🟢*
      // Notificaciones de ordenes
      let idsOrdenes = [];

      // Notificaciones de articulos

      let codigosItems = [];

      if (blMaster.tipo === 0) {
        furgonesMaster.forEach((furgon) => {
          furgon.materiales.forEach((item) => {
            idsOrdenes.push(item.idOrdenCompra);
          });
        });
        codigosItems = furgonesMaster
          .flatMap((furgon) => furgon.materiales)
          .map((item) => item.codigo);
      } else if (blMaster.tipo === 1) {
        codigosItems = blMaster.fleteSuelto.materiales.map(
          (item) => item.codigo
        );

        blMaster.fleteSuelto.materiales.forEach((item) => {
          idsOrdenes.push(item.idOrdenCompra);
        });
      }

      const notificacionesOrdenes = await fetchDocsByIn(
        "notificaciones",
        undefined,
        "idDoc",
        idsOrdenes
      );

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
          asunto: "🗓️ Cambio fecha ETA",
          mensaje: PlantillaFechaETA({
            anteriorETA: anteriorETA,
            nuevoETA: llegadaAlPais,
            billOfLading: blMaster,
            furgonMaster: furgonesMaster.length
              ? furgonesMaster
              : blMaster.fleteSuelto.partidas,
          }),
        });
      }

      setValueNewETA("");
      setHasModal(false);
      setIsLoading(false);
      setMensajeAlerta("Nuevo ETA establecido.");
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

  // ********************* Documentos adjuntos *********************
  const [modalDocAdj, setModalDocAdj] = useState(false);
  const [archivosAdjuntoDB, setArchivosAdjuntoDB] = useState([]);
  const [archivosAdjuntoLocal, setArchivosAdjuntoLocal] = useState([]);
  const mostrarAdjuntos = () => {
    setModalDocAdj(true);
    const archivosAdjuntoDBAux =
      blMaster?.filesAttach?.map((file) => {
        return {
          ...file,
          eliminado: false,
        };
      }) || [];

    setArchivosAdjuntoDB(archivosAdjuntoDBAux);
  };
  //
  //
  //
  const limpiarDatosAdjuntos = (filesAttach) => {
    const hasPermiso = userMaster.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    const fileOfBL = blMaster.filesAttach || [];
    const filesAttachUp = filesAttach ? filesAttach : fileOfBL;
    setArchivosAdjuntoDB(
      filesAttachUp.map((file) => {
        return {
          ...file,
          eliminado: false,
        };
      })
    );
    setArchivosAdjuntoLocal([]);
    setModalDocAdj(false);
  };
  //
  const guardarCambiosDocAdj = async () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    const hasPermiso = userMaster.permisos.includes("managerAttachIMS");
    if (!hasPermiso) {
      return;
    }
    // Verificar privilegios

    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      const blActualizar = doc(db, "billOfLading2", blMaster.id);
      let filesAttachUp = blMaster.filesAttach || [];
      const storage = getStorage();

      //🟢🟢🟢🟢 1 Elimina los marcados en eliminado true del storage 🟢🟢🟢🟢
      const promesasEliminar = archivosAdjuntoDB
        .filter((file) => file.eliminado)
        .map(async (file) => {
          const rutaAEliminar = file.rutaStorage;
          const desertRef = ref(storage, rutaAEliminar);

          // 1️⃣ eliminar archivo
          await deleteObject(desertRef);

          // 2️⃣ actualizar Firestore (quitando ese archivo de filesAttach)
          const fileOfBl = blMaster?.filesAttach || [];
          filesAttachUp = fileOfBl.filter(
            (archivo) => archivo.rutaStorage !== rutaAEliminar
          );
        });

      // Esperar a que todas las eliminaciones + updates terminen
      await Promise.all(promesasEliminar);

      //🟢🟢🟢🟢 2 Agrega los nuevos archivos adjuntos 🟢🟢🟢🟢
      const promesasNuevosArchivos = archivosAdjuntoLocal.map(async (file) => {
        const fechaActual = new Date();
        const annioActual = fechaActual.getFullYear();
        // referencia en Storage
        const storage = getStorage();
        const fechaString = ES6AFormat(new Date());
        const sinSlash = fechaString.replaceAll("/", "_");
        const nuevaRuta = `documentos/_${annioActual}/importaciones/${file.name}_${sinSlash}`;
        const storageRef = ref(storage, nuevaRuta);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);

        const nuevoMetaDatoFile = {
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
        };
        filesAttachUp = [...filesAttachUp, nuevoMetaDatoFile];
      });

      await Promise.all(promesasNuevosArchivos);

      //🟢🟢🟢🟢 3- Actualiza los metados del BL 🟢🟢🟢🟢
      batch.update(blActualizar, {
        filesAttach: filesAttachUp || [],
      });

      await batch.commit();

      limpiarDatosAdjuntos(filesAttachUp);
      setIsLoading(false);
      setMensajeAlerta("Cambios guardados.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    } catch (error) {
      console.error("Error con la base de datos:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // New
  const [materialesUnificados, setMaterialesUnificados] = useState([]);

  const handleTablaContenedores = (e) => {
    const destinoDataset = e.target.dataset.destino;

    switch (destinoDataset) {
      case "mostrarItem":
        mostrarItem(e);
        break;
      case "handleInputTabla":
        handleInputTabla(e);
        break;
      case "mostrarMaterialesParaEditar":
        mostrarMaterialesParaEditar(e);
        break;
      case "eliminarFila":
        eliminarPartida(e);
        break;

      default:
        break;
    }
  };

  const tablaPartidasRef = useRef(null);
  const [mostrarPartidas, setMostrarPartidas] = useState(false);
  const verPartidas = () => {
    setMostrarPartidas(true);
    setTimeout(() => {
      tablaPartidasRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  // Edicion carga suelta
  const [isEditandoCargaSuelta, setIsEditandoCargaSuelta] = useState(false);
  const editarCargaSuelta = () => {
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // const hasPermisos = userMaster.permisos.includes("editBLIMS");

    // if (!hasPermisos) {
    //   setMensajeAlerta("No posee permisos para editar BL.");
    //   setTipoAlerta("warning");
    //   setDispatchAlerta(true);
    //   setTimeout(() => setDispatchAlerta(false), 3000);
    //   return "";
    // }
    setBLEditable(blMaster);
    setIsEditandoCargaSuelta(true);
  };
  const cancelarEdicionCargaSuelta = () => {
    setFurgonSelect(null);
    setIsEditandoCargaSuelta(false);
    setMaterialesUnificados([]);
    setMostrarPartidas(false);
  };
  const addPartida = () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    const nuevaPartida = {
      ...partidaFleteSueltoSchema,
      numeroDoc:
        blEditable.fleteSuelto.numeroDoc +
        alfabetColumnsExcel(blEditable.fleteSuelto.partidas.length + 1),
      materiales: blMaster.fleteSuelto.materiales.map((item) => ({
        ...item,
        qty: 0,
      })),
    };

    const partidas = [...blEditable.fleteSuelto.partidas, nuevaPartida];

    const partidasParsed = partidas.map((partida, index) => {
      return {
        ...partida,
        numeroDoc: estadarizarNumerosPartidas(index),
      };
    });
    setBLEditable({
      ...blEditable,
      fleteSuelto: {
        ...blEditable.fleteSuelto,
        partidas: partidasParsed,
      },
    });
  };

  const eliminarPartida = (e) => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    const indexDataset = Number(e.target.dataset.index);
    const partidasFiltered = blEditable.fleteSuelto.partidas.filter(
      (partida, index) => index !== indexDataset
    );

    if (blEditable.fleteSuelto.partidas.length == 1) {
      setMensajeAlerta("Debe existir al menos una partida.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const partidasParsed = partidasFiltered.map((partida, index) => {
      return {
        ...partida,
        numeroDoc: estadarizarNumerosPartidas(index),
      };
    });
    setBLEditable({
      ...blEditable,
      fleteSuelto: {
        ...blEditable.fleteSuelto,
        partidas: partidasParsed,
      },
    });
  };
  const estadarizarNumerosPartidas = (index) => {
    return blEditable.fleteSuelto.numeroDoc + alfabetColumnsExcel(index + 1);
  };
  const [hasModalMatPlantilla, setHasModalMatPlantilla] = useState(false);
  const matPlantillaFleteSuelto = () => {
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // ❌❌❌❌❌❌
    // const hasPermisos = userMaster.permisos.includes("editBLIMS");

    // if (!hasPermisos) {
    //   setMensajeAlerta("No posee permisos para editar BL.");
    //   setTipoAlerta("warning");
    //   setDispatchAlerta(true);
    //   setTimeout(() => setDispatchAlerta(false), 3000);
    //   return "";
    // }
    setHasModalMatPlantilla(true);
  };

  const handleInputTablaMatCargaSuelta = (e) => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si la cantidad supera cantidad disponible

    const indexDataset = Number(e.target.dataset.index);
    const codigoDataset = e.target.dataset.codigo;

    const { name, value } = e.target;
    const partidasParsed = blEditable.fleteSuelto.partidas.map(
      (partida, index) => {
        if (index === indexDataset) {
          const materialesParsed = partida.materiales.map((item, index) => {
            if (item.codigo === codigoDataset) {
              if (soloNumeros(value) || value === "") {
                return {
                  ...item,
                  qty: Number(value),
                };
              } else if (puntoFinal(value)) {
                return {
                  ...item,
                  qty: value,
                };
              } else {
                return item;
              }
            } else {
              return item;
            }
          });

          return {
            ...partida,
            materiales: materialesParsed,
          };
        } else {
          return partida;
        }
      }
    );

    const blEditableAux = {
      ...blEditable,
      fleteSuelto: {
        ...blEditable.fleteSuelto,
        partidas: partidasParsed,
      },
    };
    setBLEditable(blEditableAux);
    console.log(blEditableAux);
  };
  // Actualizar materiales de las partidas de carga suelta
  const [matPendPartSuelta, setMatPendPartSuelta] = useState([]);
  useEffect(() => {
    let tipoBL = 0;
    if (blMaster?.tipo) {
      tipoBL = blMaster.tipo;
    }
    if (tipoBL == 1) {
      const matFleteParsed = blEditable.fleteSuelto.materiales.map(
        (item, index) => {
          const qtyTotalPartidas = blEditable.fleteSuelto.partidas.reduce(
            (acc, partida) => {
              const matFind = partida.materiales.find(
                (mat) => mat.codigo == item.codigo
              );
              if (matFind) {
                return acc + Number(matFind.qty);
              }
              return acc;
            },
            0
          );
          const qtyPend = Number(item.qty) - qtyTotalPartidas;
          if (qtyPend < 0) {
            setMensajeAlerta(`Total supera cantidad disponible.`);
            setTipoAlerta("warning");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
          }

          return {
            ...item,
            qtyPend: qtyPend,
            negativo: qtyPend < 0,
          };
        }
      );
      console.log(matFleteParsed);
      setMatPendPartSuelta(matFleteParsed);
    }
  }, [blEditable.fleteSuelto]);
  //
  const guardarMatPartidaCargaSuelta = () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Verificar que la cantidad no supere la cantidad disponible
    const hasNegativo = matPendPartSuelta.some((item) => item.negativo);
    if (hasNegativo) {
      setMensajeAlerta(`Hay materiales que superan la cantidad disponible.`);
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const hasDisponib = matPendPartSuelta.some((item) => item.qtyPend > 0);
    if (hasDisponib) {
      setMensajeAlerta(`Existen materiales con pendientes.`);
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setHasModalMatPlantilla(false);
  };

  const guardarEdicionCargaSuelta = async () => {
    const hasPermisos = userMaster.permisos.includes("editBLIMS");

    if (!hasPermisos) {
      setMensajeAlerta("No posee permisos para editar BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    // Si alguna partida no posee materiales
    // Si alguna partida no tiene destino
    let procederPartidas = true;
    if (blEditable.fleteSuelto.partidas.length > 0) {
      for (const partida of blEditable.fleteSuelto.partidas) {
        if (partida.materiales.length == 0) {
          procederPartidas = false;
          setMensajeAlerta(
            `La partida ${partida.numeroDoc} no posee materiales.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 5000);
        }
        if (partida.destino == "") {
          procederPartidas = false;
          setMensajeAlerta(`La partida ${partida.numeroDoc} no tiene destino.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 5000);
        }
        if (partida.status == "") {
          procederPartidas = false;
          setMensajeAlerta(`La partida ${partida.numeroDoc} no tiene status.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 5000);
        }
      }
    }

    if (blEditable.fleteSuelto.partidas.length == 0) {
      setMensajeAlerta("Carga suelta sin partidas de entrega.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    const blLlegoAlPais = funcionBLLlegoAlPais(blEditable);
    const statusPartidasCoherente = () => {
      // Es coherente lo siguiente:

      // Todas las partida en transito
      const allTransito = blEditable.fleteSuelto.partidas.every(
        (partida) => partida.status == 1
      );

      // Ninguna partida en transito
      const noneTransito = blEditable.fleteSuelto.partidas.every(
        (partida) => partida.status != 1
      );

      // Ninguna partida en proveedor
      const noneProveedor = blEditable.fleteSuelto.partidas.every(
        (partida) => partida.status != 0
      );
      return allTransito || noneTransito || noneProveedor;
    };
    //
    //  0-BL aun no ha llegado al pais
    // Todas las partidas deben estan en transito maritimo
    if (blLlegoAlPais == 0) {
      const hasTransito = blEditable.fleteSuelto.partidas.some(
        (partida) => partida.status != 1
      );
      console.log(blEditable);
      if (hasTransito) {
        setMensajeAlerta(
          `Segun la fecha el BL aun no llega, todas las partidas deben estar en transito maritimo.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        procederPartidas = false;
      }
    }
    // 1-BL llego al pais
    // Ningun furgon puede estan en transito maritimo
    else if (blLlegoAlPais == 1) {
      const hasTransito = blEditable.fleteSuelto.partidas.some(
        (partida) => partida.status == 1
      );

      if (hasTransito) {
        setMensajeAlerta(
          `Segun la fecha el BL llegó al país, ninguna partida debería estar en transito maritimo.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        procederPartidas = false;
      }
    }
    // 2-EL BL llega hoy al pais
    // Se permite cualquier status, de esta manera:
    // -----Todos en transito
    // -----Ninguno en transito
    else if (blLlegoAlPais == 2) {
      if (!statusPartidasCoherente()) {
        procederPartidas = false;
      }

      // Partidas en proveedor
      const hasProveedor = blEditable.fleteSuelto.partidas.every(
        (partida) => partida.status != 0
      );

      if (hasProveedor) {
        setMensajeAlerta(`No debe haber partidas en status proveedor.`);
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 7000);
        procederPartidas = false;
      }

      // todos en transito
      const hasTransito = blEditable.fleteSuelto.partidas.some(
        (partida) => partida.status == 1
      );
      // Alguno fuera de transito
      const hasPais = blEditable.fleteSuelto.partidas.some(
        (partida) => partida.status != 1
      );

      if (hasTransito && hasPais) {
        setMensajeAlerta(
          `O todas las partidas en transito o ninguna en transito.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 7000);
        procederPartidas = false;
      }
    }

    if (procederPartidas) {
      setIsLoading(true);

      try {
        // 789
        const batch = writeBatch(db);
        // 🟢🟢🟢***** ACTUALIZAR BILL OF LADING *********🟢🟢🟢

        const blActualizar = doc(db, "billOfLading2", blMaster.id);
        let isTransitoAux = false;
        blEditable.fleteSuelto.partidas.forEach((partida) => {
          if (partida.status == 1) {
            isTransitoAux = true;
          }
        });

        const estadoDoc = blEstadoParsed(
          blEditable,
          blEditable.fleteSuelto.partidas
        );

        batch.update(blActualizar, {
          ...blEditable,
          estadoDoc: estadoDoc,
          updateAt: ES6AFormat(new Date()),
          isTransito: isTransitoAux,
          "fleteSuelto.partidas": blEditable.fleteSuelto.partidas,

          logModificaciones: [
            ...blEditable.logModificaciones,
            {
              fecha: ES6AFormat(new Date()),
              userNameCreador: userMaster.userName,
              idCreador: userMaster.id,
              descripcionCambio: "update",
              documento: { ...blEditable, logModificaciones: null },
            },
          ],
        });

        //
        //
        //
        await batch.commit();

        setIsLoading(false);
        setMensajeAlerta(`Cambios guardados.`);
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        setFurgonSelect(null);
        setMaterialesUnificados([]);
        setIsEditandoCargaSuelta(false);
      } catch (error) {
        setIsLoading(false);
        console.error(error);

        setMensajeAlerta(`Error con la base de datos.`);
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
  };
  return (
    <>
      {mostrarCostos && (
        <ContainerCostoFija>
          <CostosBL
            setMostrarCostos={setMostrarCostos}
            mostrarCostos={mostrarCostos}
            costoArray={costoArray}
            setCostoArray={setCostoArray}
            blEditable={blEditable}
            setBLEditable={setBLEditable}
            modo={MODO}
          />
        </ContainerCostoFija>
      )}
      <BotonQuery
        blMaster={blMaster}
        blEditable={blEditable}
        furgonesMasterEditable={furgonesMasterEditable}
        dbOrdenesLlamadasDespThisBL={dbOrdenesLlamadasDespThisBL}
        ordenIndicada={ordenIndicada}
        furgonIndicado={furgonIndicado}
        cambiosNumDoc={cambiosNumDoc}
        furgonMaster={furgonesMaster}
        ventanaOrdenVisible={ventanaOrdenVisible}
        ventanaJuntaMateriales={ventanaJuntaMateriales}
      />
      <CajaEncabezado>
        <CajaDetalles>
          <Detalle1Wrap>
            <Detalle2Titulo>Bill of Lading (BL):</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut title={blMaster.numeroDoc}>
                {blMaster.numeroDoc}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="text"
                value={blEditable.numeroDoc}
                name="numeroDoc"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Proveedor:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut title={blMaster.proveedor}>
                {blMaster.proveedor}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="text"
                value={blEditable.proveedor}
                name="proveedor"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Naviera:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut title={blMaster.naviera}>
                {blMaster.naviera}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="text"
                value={blEditable.naviera}
                name="naviera"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>
          {blMaster.tipo != 1 && (
            <>
              <Detalle1Wrap>
                <Detalle2Titulo>Dias Libres:</Detalle2Titulo>
                {isEditando == false ? (
                  <Detalle3OutPut>{blMaster.diasLibres}</Detalle3OutPut>
                ) : (
                  <InputEdit
                    type="text"
                    value={blEditable.diasLibres}
                    name="diasLibres"
                    onChange={(e) => {
                      handleInputCabecera(e);
                    }}
                  />
                )}
              </Detalle1Wrap>

              <Detalle1Wrap>
                <Detalle2Titulo
                  className={`${blMaster.diasRestantes < 2 ? "negativo" : ""}
                      ${blMaster.estadoDoc == 1 ? "docCerrado" : ""}
                      `}
                >
                  Dias Restantes:
                </Detalle2Titulo>

                <Detalle3OutPut
                  className={`${blMaster.diasRestantes < 2 ? "negativo" : ""}
                    ${blMaster.estadoDoc == 1 ? "docCerrado" : ""}
                  `}
                >
                  {blMaster.estadoDoc == 1 ||
                  blMaster.estadoDoc == 2 ||
                  blMaster.diasRestantes == "N/A"
                    ? "-"
                    : blMaster.diasRestantes +
                      colorDaysRemaining(blMaster.diasRestantes)}
                </Detalle3OutPut>
              </Detalle1Wrap>
            </>
          )}
          <Detalle1Wrap>
            <Detalle2Titulo>Puerto:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut>{blMaster.puerto}</Detalle3OutPut>
            ) : (
              <MenuDesp
                value={blEditable.puerto}
                name="puerto"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
                className="cabecera"
              >
                <Opciones value="Haina">Haina</Opciones>
                <Opciones value="Caucedo">Caucedo</Opciones>
                <Opciones value="Otros">Otros</Opciones>
              </MenuDesp>
            )}
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Llegada al pais:</Detalle2Titulo>
            {isEditando == false ? (
              <Detalle3OutPut
                title={fechaConfirmada(
                  blMaster.llegada02AlPais?.confirmada,
                  true
                )}
              >
                {blMaster.llegada02AlPais.fecha.slice(0, 10)}
                {fechaConfirmada(blMaster.llegada02AlPais?.confirmada)}
              </Detalle3OutPut>
            ) : (
              <InputEdit
                type="date"
                value={llegadaAlPaisMostrar}
                name="llegadaAlPais"
                onChange={(e) => {
                  handleInputCabecera(e);
                }}
              />
            )}
          </Detalle1Wrap>

          <Detalle1Wrap>
            <Detalle2Titulo>Fecha de creacion:</Detalle2Titulo>
            {/* {blMaster.id} */}
            <Detalle3OutPut>
              {blMaster.logModificaciones &&
                blMaster?.logModificaciones[0]?.fecha.slice(0, 10)}
            </Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Costo total:</Detalle2Titulo>
            {/* {blMaster.id} */}
            <Detalle3OutPut>
              {blMaster.costos &&
                blMaster.costos.reduce(
                  (acc, costo) => acc + Number(costo.monto),
                  0
                )}
            </Detalle3OutPut>
          </Detalle1Wrap>
        </CajaDetalles>
        <CajaDetalles className="cajaStatus">
          <TextoStatus
            className={
              isEditando
                ? "block"
                : blMaster.estadoDoc == 0
                  ? "success"
                  : blMaster.estadoDoc == 1
                    ? "block"
                    : blMaster.estadoDoc == 2
                      ? "del"
                      : ""
            }
          >
            {isEditando == true ? (
              <>
                Editando BL... {` `}
                <Icono icon={faEdit} />
              </>
            ) : blMaster.estadoDoc == 0 ? (
              <>
                BL abierto {` `}
                <Icono icon={faLockOpen} />
              </>
            ) : blMaster.estadoDoc == 1 ? (
              <>
                BL Cerrado {` `}
                <Icono icon={faLock} />
              </>
            ) : blMaster.estadoDoc == 2 ? (
              <>
                BL Eliminado {` `}
                <Icono icon={faXmark} />
              </>
            ) : blMaster.estadoDoc == "epty" ? (
              <></>
            ) : (
              ""
            )}
          </TextoStatus>
        </CajaDetalles>
      </CajaEncabezado>

      {/* {userMaster.permisos.includes("editBLIMS") && ( */}
      {true && (
        <ControlesTabla
          isEditando={isEditando}
          docMaster={blMaster}
          crearFurgon={crearFurgon}
          modo={MODO}
          handleInput={handleInputCabecera}
          editar={editar}
          cancelar={cancelar}
          guardarCambios={guardarCambios}
          // Alertas
          setMensajeAlerta={setMensajeAlerta}
          setTipoAlerta={setTipoAlerta}
          setDispatchAlerta={setDispatchAlerta}
          //  Advertencias
          costearBL={costearBL}
          cambioFecha={
            blMaster.isTransito && userMaster.permisos.includes("editETABL")
          }
          cambioFechaFunct={cambioFechaFunct}
          adjuntos={true}
          mostrarAdjuntos={mostrarAdjuntos}
          setMostrarPartidas={setMostrarPartidas}
          verPartidas={verPartidas}
          //
        />
      )}
      <EncabezadoTabla>
        {blMaster.tipo !== 1 && (
          <TituloEncabezadoTabla>
            Contenedores de este BL:
          </TituloEncabezadoTabla>
        )}
        {blMaster.tipo == 1 && (
          <TituloEncabezadoTabla>
            Materiales Carga Suelta N°:
            {blMaster.fleteSuelto.numeroDoc}
          </TituloEncabezadoTabla>
        )}
      </EncabezadoTabla>
      {docEncontrado == 0 &&
      location.pathname != "/importaciones/maestros/billoflading/" &&
      location.pathname != "/importaciones/maestros/billoflading" ? (
        <>
          <CajaLoader>
            <CSSLoader />
          </CajaLoader>
        </>
      ) : blMaster.tipo !== 1 ? (
        <>
          <TablaContenedores
            handleTablaContenedores={handleTablaContenedores}
            arrayFurgones={furgonesMaster}
            arrayFurgonesEditable={furgonesMasterEditable}
            billOfLading={blMaster}
            isEditando={isEditando}
            nClases={nClases}
            setNClases={setNClases}
          />
        </>
      ) : blMaster.tipo == 1 ? (
        <>
          {!isEditando && (
            <>
              <CajaTablaGroup>
                <TablaGroup>
                  <thead>
                    <FilasGroup className="cabeza">
                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                      <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                      <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                      <CeldaHeadGroup>Qty</CeldaHeadGroup>
                      <CeldaHeadGroup>Comentarios</CeldaHeadGroup>
                      <CeldaHeadGroup>Orden compra*</CeldaHeadGroup>
                    </FilasGroup>
                  </thead>
                  <tbody>
                    {blMaster.fleteSuelto.materiales?.map((item, index) => {
                      return (
                        <FilasGroup key={index} className="body">
                          <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                          <CeldasBodyGroup>
                            <Enlaces
                              to={`/importaciones/maestros/articulos/${encodeURIComponent(
                                item.codigo
                              )}`}
                              target="_blank"
                            >
                              {item.codigo}
                            </Enlaces>
                          </CeldasBodyGroup>
                          <CeldasBodyGroup className="descripcion startText">
                            {item.descripcion}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                          <CeldasBodyGroup>{item.comentarios}</CeldasBodyGroup>
                          <CeldasBodyGroup>
                            <Enlaces
                              to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(
                                item.ordenCompra
                              )}`}
                              target="_blank"
                            >
                              {item.ordenCompra}
                            </Enlaces>
                          </CeldasBodyGroup>
                        </FilasGroup>
                      );
                    })}
                  </tbody>
                </TablaGroup>
              </CajaTablaGroup>
              {mostrarPartidas && (
                <>
                  <br />
                  <TituloPartidas>Partidas:</TituloPartidas>
                  <>
                    {userMaster.permisos.includes("editBLIMS") ? (
                      <>
                        {isEditandoCargaSuelta ? (
                          <>
                            <BtnNormal
                              onClick={() => {
                                cancelarEdicionCargaSuelta(false);
                              }}
                            >
                              Cancelar
                            </BtnNormal>
                            <BtnNormal
                              onClick={() => {
                                guardarEdicionCargaSuelta();
                              }}
                            >
                              Guardar
                            </BtnNormal>
                            <BtnNormal onClick={() => addPartida()}>
                              +
                            </BtnNormal>
                            <BtnNormal
                              onClick={() => matPlantillaFleteSuelto()}
                            >
                              M
                            </BtnNormal>
                          </>
                        ) : (
                          <BtnNormal onClick={() => editarCargaSuelta()}>
                            <Icono icon={faEdit} />
                            Modificar
                          </BtnNormal>
                        )}
                      </>
                    ) : (
                      ""
                    )}
                  </>

                  <BotonQuery blEditable={blEditable} />
                  <CajaParrafoCerrar>
                    <ParrafoX onClick={() => setMostrarPartidas(false)}>
                      X
                    </ParrafoX>
                  </CajaParrafoCerrar>
                  <TablaContenedores
                    handleTablaContenedores={handleTablaContenedores}
                    billOfLading={blMaster}
                    nClases={nClases}
                    setNClases={setNClases}
                    //
                    tablaPartidasRef={tablaPartidasRef}
                    arrayFurgones={blMaster.fleteSuelto.partidas}
                    arrayFurgonesEditable={blEditable.fleteSuelto.partidas}
                    isEditando={isEditandoCargaSuelta}
                    MODO={"fleteSuelto"}
                  />
                  {hasModalMatPlantilla &&
                    userMaster.permisos.includes("editBLIMS") && (
                      <ModalGeneral
                        titulo={"Materiales partidas de carga suelta"}
                        setHasModal={setHasModalMatPlantilla}
                        childrenFooter={
                          <>
                            <BtnNormal
                              onClick={() => guardarMatPartidaCargaSuelta()}
                            >
                              Guardar
                            </BtnNormal>
                          </>
                        }
                      >
                        <CajaTablaGroup>
                          <TablaGroup>
                            <thead>
                              <FilasGroup className="cabeza">
                                <CeldaHeadGroup>N°</CeldaHeadGroup>
                                <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                                <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                                <CeldaHeadGroup>Qty</CeldaHeadGroup>
                                <CeldaHeadGroup>Pend</CeldaHeadGroup>
                                {blEditable.fleteSuelto.partidas.map(
                                  (part, i) => (
                                    <CeldaHeadGroup key={i}>
                                      {part.numeroDoc}
                                    </CeldaHeadGroup>
                                  )
                                )}
                              </FilasGroup>
                            </thead>

                            <tbody>
                              {blMaster.fleteSuelto.materiales.length == 0 && (
                                <FilasGroup className="body ">
                                  <CeldasBodyGroup colSpan={7}>
                                    {" "}
                                    No hay materiales
                                  </CeldasBodyGroup>
                                </FilasGroup>
                              )}
                              {blMaster.fleteSuelto.materiales.map(
                                (item, indexMat) => {
                                  return (
                                    <FilasGroup
                                      className="body "
                                      key={indexMat}
                                    >
                                      <CeldasBodyGroup>
                                        {indexMat + 1}
                                      </CeldasBodyGroup>
                                      <CeldasBodyGroup>
                                        {item.codigo}
                                      </CeldasBodyGroup>
                                      <CeldasBodyGroup>
                                        {item.descripcion}
                                      </CeldasBodyGroup>
                                      <CeldasBodyGroup>
                                        {item.qty}
                                      </CeldasBodyGroup>
                                      <CeldaBody
                                        className={`celdaPendiente
                                      ${
                                        matPendPartSuelta[indexMat]?.qtyPend !=
                                        0
                                          ? "incorrecto"
                                          : ""
                                      }
                                      ${
                                        matPendPartSuelta[indexMat]?.qtyPend ==
                                        0
                                          ? "correcto"
                                          : ""
                                      }
                                      `}
                                      >
                                        {matPendPartSuelta[indexMat].qtyPend >
                                          0 && "+"}
                                        {matPendPartSuelta[indexMat].qtyPend}
                                      </CeldaBody>

                                      {blEditable.fleteSuelto.partidas.map(
                                        (part, indexPart) => {
                                          const itemFind = part.materiales.find(
                                            (item2) =>
                                              item2.codigo === item.codigo
                                          );

                                          return (
                                            <CeldaBody key={indexPart}>
                                              <InputSimple
                                                disabled={
                                                  userMaster.permisos.includes(
                                                    "editBLIMS"
                                                  )
                                                    ? false
                                                    : true
                                                }
                                                className="celda"
                                                data-codigo={item.codigo}
                                                data-index={indexPart}
                                                onChange={(e) =>
                                                  handleInputTablaMatCargaSuelta(
                                                    e
                                                  )
                                                }
                                                value={itemFind?.qty}
                                              />
                                            </CeldaBody>
                                          );
                                        }
                                      )}
                                    </FilasGroup>
                                  );
                                }
                              )}
                            </tbody>
                          </TablaGroup>
                        </CajaTablaGroup>
                      </ModalGeneral>
                    )}
                </>
              )}
            </>
          )}
        </>
      ) : (
        ""
      )}

      {ventanaJuntaMateriales > 0 ? (
        <>
          <CajaTabla>
            <RecuadroUnificador
              modo={MODO}
              tablaFurgonRef={tablaFurgonRef}
              ventanaJuntaMateriales={ventanaJuntaMateriales}
              setVentanaJuntaMateriales={setVentanaJuntaMateriales}
              indexFurgonEnBL={indexFurgonEnBL}
              setIndexFurgonEnBL={setIndexFurgonEnBL}
              ventanaOrdenVisible={ventanaOrdenVisible}
              setVentanaOrdenVisible={setVentanaOrdenVisible}
              setCambiosSinGuardar={setCambiosSinGuardar}
              // Alertas
              setMensajeAlerta={setMensajeAlerta}
              setTipoAlerta={setTipoAlerta}
              setDispatchAlerta={setDispatchAlerta}
              furgonIndicado={furgonIndicado}
              setFurgonIndicado={setFurgonIndicado}
              furgonesMasterEditable={furgonesMasterEditable}
              setFurgonesMasterEditable={setFurgonesMasterEditable}
              dbOrdenesLlamadas={dbOrdenesLlamadasNoUsarSinoUtilizarThisBL}
              ordenIndicada={ordenIndicada}
              setOrdenIndicada={setOrdenIndicada}
              cancelarAgregarMat={cancelarAgregarMat}
              setNClasesPadre={setNClases}
              //

              materialesUnificados={materialesUnificados}
              setMaterialesUnificados={setMaterialesUnificados}
              blMaster={blMaster}
            />
          </CajaTabla>
          {ventanaOrdenVisible && (
            <>
              <EncabezadoTabla>
                <TituloEncabezadoTabla>
                  Copiar materiales de orden de compra
                </TituloEncabezadoTabla>
              </EncabezadoTabla>

              <TablaAddBLOrden
                mostrarOrden={mostrarOrden}
                setTipoAlerta={setTipoAlerta}
                setMensajeAlerta={setMensajeAlerta}
                setDispatchAlerta={setDispatchAlerta}
                tablaOrdenRef={tablaOrdenRef}
                primerInputTablaOrdenRef={primerInputTablaOrdenRef}
                setVentanaOrdenVisible={setVentanaOrdenVisible}
                MODO="detalleBL"
                ventanaJuntaMateriales={ventanaJuntaMateriales}
                setCambiosSinGuardar={setCambiosSinGuardar}
                furgonIndicado={furgonIndicado}
                setFurgonIndicado={setFurgonIndicado}
                ordenIndicada={ordenIndicada}
                setOrdenIndicada={setOrdenIndicada}
                furgonesMasterEditable={furgonesMasterEditable}
                valueInputOrdenCompra={valueInputOrdenCompra}
                handleInputsOrdenCompra={handleInputsOrdenCompra}
                furgonesMaster={furgonesMaster}
                //
                materialesUnificados={materialesUnificados}
                setMaterialesUnificados={setMaterialesUnificados}
              />
            </>
          )}
        </>
      ) : (
        ""
      )}

      {furgonSelect ? (
        <TablaMultiFurgon
          furgonSelect={furgonSelect}
          tablaItemRef={tablaItemRef}
          setNClases={setNClases}
          setFurgonSelect={setFurgonSelect}
        />
      ) : (
        ""
      )}

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />

      {hasModal && userMaster.permisos.includes("editETABL") && (
        <ModalGeneral
          setHasModal={setHasModal}
          titulo={"Cambio de fecha de llegada"}
        >
          <CajaCalendar>
            <CajaInternaCalendar>
              <TituloCalendar>ETA anterior:</TituloCalendar>
              <TituloCalendar>
                {blMaster.llegada02AlPais.fecha.slice(0, 10)}
              </TituloCalendar>
            </CajaInternaCalendar>
            <CajaInternaCalendar>
              <TituloCalendar>Nueva fecha de llegada:</TituloCalendar>
              <CajaInput>
                <InputSimpleEditable
                  type="date"
                  value={valueNewETA}
                  onChange={(e) => handleNewEta(e)}
                />
              </CajaInput>
            </CajaInternaCalendar>
            <CajaBtn>
              <BtnNormal onClick={() => guardarNewETA()}>Guardar</BtnNormal>
            </CajaBtn>
          </CajaCalendar>
        </ModalGeneral>
      )}
      {isLoading ? <ModalLoading completa={true} /> : ""}
      {modalDocAdj && (
        <ModalGeneral
          titulo={"Archivos adjunto, en amarillos nuevos documentos"}
          setHasModal={setModalDocAdj}
        >
          <DocumentosAdjunto
            archivosAdjuntoLocal={archivosAdjuntoLocal}
            setArchivosAdjuntoLocal={setArchivosAdjuntoLocal}
            archivosAdjuntoDB={archivosAdjuntoDB}
            setArchivosAdjuntoDB={setArchivosAdjuntoDB}
            TIPO={"edicionBL"}
            guardarCambiosDocAdj={guardarCambiosDocAdj}
            limpiarDatosAdjuntos={limpiarDatosAdjuntos}
            userMaster={userMaster}
          />
        </ModalGeneral>
      )}
    </>
  );
};

const CajaEncabezado = styled.div`
  width: 100%;
  min-height: 40px;
  display: flex;
  justify-content: start;
  margin: 10px 0;
  color: ${Tema.secondary.azulOpaco};
  &.negativo {
    color: ${Tema.complementary.danger};
  }
  @media screen and (max-width: 650px) {
    flex-direction: column;
    align-items: center;
  }
`;
const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
  border: 1px solid white;
  &.cajaStatus {
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width: 650px) {
    width: 90%;
    margin-bottom: 5px;
  }
`;

const TextoStatus = styled.h3`
  font-size: 2rem;
  &.sinDocumento {
    color: red;
  }
  &.success {
    color: ${Tema.complementary.success};
  }
  &.block {
    color: #524a4a;
  }
  &.del {
    color: #8c3d3d;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const Icono = styled(FontAwesomeIcon)`
  &.accion {
    cursor: pointer;
  }
`;

const CajaLoader = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const MenuDesp = styled(MenuDesplegable)`
  border-radius: 0;
  width: 40%;
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
  text-decoration: underline;
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 20px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 3px;
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

const ContainerCostoFija = styled.div`
  position: absolute;
  z-index: 100;
  background-color: #000000bb;
  width: 100%;
  height: 120%;
  display: flex;
  justify-content: center;
  align-items: center;
  padding-top: 40px;
`;
const InputEdit = styled(InputSimpleEditable)`
  height: 25px;
  border-radius: 0;
  width: 40%;
`;
const CeldaBody = styled(CeldasBodyGroup)`
  width: 80px;
  padding: 0;
  &.celdaPendiente {
    &.incorrecto {
      color: red;
      background-color: #ffbcbc7a;
    }

    &.correcto {
      background-color: ${ClearTheme.complementary.success};
      color: white;
    }
  }
`;
const InputSimple = styled(InputSimpleEditable)`
  width: 100%;
  min-width: 60px;
  text-align: center;
  &.celda {
    border: 1px solid black;
  }
  &:focus {
    border: 2px solid red;
    background-color: #3282dd;
  }
`;
const CajaCalendar = styled.div`
  width: 100%;
`;
const CajaInternaCalendar = styled.div`
  width: 100%;
  padding-left: 25px;
  margin-top: 20px;
  border-bottom: 1px solid white;
`;

const TituloCalendar = styled.h3`
  display: inline;
  color: white;
  margin-top: 15px;
  margin-left: 15px;
  font-weight: 400;
`;
const CajaInput = styled(CajaInternaCalendar)`
  width: 50%;
`;
const CajaBtn = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const TituloPartidas = styled.h2`
  color: white;
  margin-left: 15px;
  font-weight: 400;
`;
const CajaParrafoCerrar = styled.div`
  border: 1px solid white;
  display: flex;
  justify-content: end;
  padding: 8px;
`;
const ParrafoX = styled.p`
  color: white;
  font-size: 1.2rem;
  font-weight: bold;
  padding: 8px;
  border-radius: 4px;
  border: 1px solid white;
  transition: all 0.3s ease;
  &:hover {
    border: 1px solid red;
    background-color: #b30000bb;
    cursor: pointer;
  }
`;
