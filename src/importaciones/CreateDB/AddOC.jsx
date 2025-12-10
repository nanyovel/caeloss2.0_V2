import { useRef, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEnvelope, faPaperPlane } from "@fortawesome/free-regular-svg-icons";
import parse from "paste-from-excel";
import { Alerta } from "../../components/Alerta";
import { addDoc, collection, doc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { ModalLoading } from "../../components/ModalLoading";
import initialValue, {
  generatePlantilla,
} from "./../../components/PlatillaTablaMat.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  InputSimpleEditable,
  TextArea,
} from "../../components/InputGeneral.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { ordenCompraSchema } from "../schema/ordenCompraSchema.js";
import { useDocById } from "../../libs/useDocByCondition.js";
import { isValidNumDoc, soloNumeros } from "../../libs/StringParsed.jsx";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { DestinatariosCorreo } from "../../components/DestinatariosCorreo.jsx";
import { ES6AFormat, inputAFormat } from "../../libs/FechaFormat.jsx";
import { FuncionEnviarCorreo } from "../../libs/FuncionEnviarCorreo.js";
import { PlantillaOrdenCompra } from "../../libs/PlantillasCorreo/PlantillaOrdenCompra.js";
import { notificacionesDBSchema } from "../../models/notificacionesDBSchema.js";
import { TodosLosCorreosCielosDB } from "../../components/corporativo/TodosLosCorreosCielosDB.js";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { articulosSchemaOrden } from "../schema/articulosSchema.js";

export const AddOC = ({ userMaster }) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [counterDoc, setCounterDoc] = useState([]);
  useDocById("counters", setCounterDoc, "counterDocSAP");
  // // ******************** CODIGO PARA EL HANDLE PASTE ******************** //
  // const [label, setlabel] = useState({ labels: ["N°","Codigo", "Descripcion", "Qty", "Comentarios"] });
  const label = {
    labels: ["n°", "codigo", "descripcion", "qty", "comentarios"],
  };
  // const [initialValue, setInitialValue] = useState({

  const [inputvalue, setinputvalue] = useState({ inputs: generatePlantilla() });

  // Codigo Original funciona
  // const handlePaste = (index, elm, e, i) => {
  //   return parse(e);
  // };
  const handlePaste = (index, elm, e) => {
    return parse(e);
  };

  // const handlePaste1 = (index, elm, e, i) => {
  const handlePaste1 = (index, elm, e) => {
    setinputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) => {
        function normalizarTexto(texto) {
          return texto
            .toLowerCase() // convierte a minúsculas
            .normalize("NFD") // descompone caracteres acentuados
            .replace(/[\u0300-\u036f]/g, ""); // elimina los signos diacríticos
        }
        let valueParse = e.target.value;
        let textosNopermitido = [];
        if (elm == "codigo") {
          textosNopermitido = ["numero", "codigo", "numero de articulo"];
        } else if (elm == "descripcion") {
          textosNopermitido = [
            "descripcion",
            "descripcion del articulo",
            "descripcion del producto",
          ];
        } else if (elm == "qty") {
          textosNopermitido = ["cantidad", "qty"];
        } else if (elm == "comentarios") {
          textosNopermitido = ["comentarios", "detalles de articulo"];
        }

        if (textosNopermitido.includes(normalizarTexto(e.target.value))) {
          valueParse = "";
        }
        console.log(valueParse);

        return index === i
          ? {
              ...item,
              [elm]:
                elm == "qty" && valueParse != ""
                  ? soloNumeros(valueParse)
                    ? Number(valueParse.replace(/,/g, ""))
                    : valueParse
                  : valueParse,
            }
          : item;
      }),
    }));
  };

  // // ******************** PARSEAR MATERIALES ******************** //
  const [materialesParsed, setMaterialesParsed] = useState([]);
  // ************** VALIDACIONES TABLA **************
  const parsearTablaItems = () => {
    // Mapeo a la tabla
    const itemsTabla = new Set();
    let proceder = true;
    inputvalue.inputs.map((item, index) => {
      if (
        item.codigo !== "" ||
        item.descripcion !== "" ||
        item.qty !== "" ||
        item.comentarios !== ""
      ) {
        // Si alguna fila tiene datos, pero esta incompleta
        if (item.codigo == "" || item.descripcion == "" || item.qty == "") {
          setMensajeAlerta(`Complete fila N° ${index + 1} o elimine sus datos`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          proceder = false;
          return "";
        }
        // Si algun item tiene letras en lugar de numero en la columna cantidad
        let expReg = /^[\d.]{0,1000}$/;
        if (expReg.test(item.qty) == false) {
          setMensajeAlerta(
            `Cantidad incorrecta para el item de la fila N° ${index + 1}.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          proceder = false;
          return "";
        }
        // Si algun item tiene espacios
        if (item.codigo.includes(" ") || item.codigo.includes("\n")) {
          setMensajeAlerta(
            `La celda codigo  de la fila N° ${index + 1} tiene espacios.`
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          proceder = false;
          return "";
        }

        // Saber si algun item esta duplicado
        if (itemsTabla.has(item.codigo)) {
          setMensajeAlerta(`El item de la fila ${index + 1} esta duplicado.`);
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
          proceder = false;
          return "";
        } else {
          itemsTabla.add(item.codigo);
        }
      }
    });

    // Extraer Materiales filtrados, solo las filas que tengan item
    const materialesParsed = inputvalue.inputs.filter((item) => {
      if (item.codigo !== "" && item.descripcion !== "" && item.qty !== "") {
        return item;
      }
    });
    // Si no existen filas completas
    if (materialesParsed.length == 0) {
      setMensajeAlerta("Por favor agregar articulos a la tabla.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      proceder = false;
      return;
    }

    return proceder == true ? materialesParsed : null;
  };
  // // ******************** CODIGO MASTER******************** //
  const [valueETAGeneral, setValueETAGeneral] = useState("");
  const handleInputs = (e) => {
    const { name, value } = e.target;
    if (name == "etaGeneral") {
      console.log(value);
      setValueETAGeneral(value);
    }
    setOCEditable((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const inputNumOrden = useRef(null);
  const [ocEditable, setOCEditable] = useState({ ...ordenCompraSchema });

  const [isLoading, setIsLoading] = useState(false);

  const enviarObjeto = async () => {
    // Si el usuario no esta logueado
    if (!userMaster.userName) {
      return;
    }
    if (!userMaster) {
      return;
    }
    // ************** VALIDACIONES CABECERA **************

    // Si el numero de orden ya existe
    const numExist = counterDoc.ordenesCompra.includes(ocEditable.numeroDoc);
    if (numExist) {
      setMensajeAlerta(
        "El numero de orden de compra ya existe en la base de datos."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    //
    if (
      ocEditable.numeroDoc.includes(" ") ||
      ocEditable.numeroDoc.includes("\n")
    ) {
      setMensajeAlerta(
        "El numero de orden de compra no puede contener espacios."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    // Si el numero de orden de compra no cumple con los requisitos para visualizarse en la URL
    if (!isValidNumDoc(ocEditable.numeroDoc)) {
      setMensajeAlerta(
        "Numero de orden de compra solo acepta: letras, números y guiones."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 7000);
      return "";
    }

    // Si no coloco numero de orden de compra
    if (ocEditable.numeroDoc == "") {
      setMensajeAlerta("Colocar numero de orden de compra.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    // Si no coloco proveedor
    if (ocEditable.proveedor == "") {
      setMensajeAlerta("Colocar nombre de proveedor.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }
    // ************** VALIDACIONES TABLA **************
    const materialesParsed = parsearTablaItems();
    if (!materialesParsed) {
      return;
    }
    // ***** Si todo esta correcto *****

    setIsLoading(true);
    // Cambiando nombre de propiedades
    const materialesNombresUp = materialesParsed.map((item) => {
      return {
        ...articulosSchemaOrden,
        codigo: item.codigo,
        descripcion: item.descripcion,
        qty: Number(item.qty),
        comentarios: item.comentarios,
        comentarioOrden: ocEditable.comentarios,
      };
    });

    // Agregando algunos datos
    // Fecha de creacion
    const newOCEditable = {
      ...ocEditable,
      createdAt: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
        locale: es,
      }),
      estadoDoc: 0,
      materiales: materialesNombresUp,
      createdBy: userMaster.userName,
      arrayItems: materialesNombresUp.map((item) => item.codigo),
    };

    try {
      const batch = writeBatch(db);
      // Agregar la operación de actualización del contador
      // 🟢🟢🟢🟢🟢********* CONTADOR  *************🟢🟢🟢🟢🟢*

      const contadorNumeroDocId = "counterDocSAP";
      const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
      batch.update(contadorUpdate, {
        ordenesCompra: [
          ...counterDoc.ordenesCompra,
          newOCEditable.numeroDoc.toLowerCase(),
        ],
      });

      // 🟢🟢🟢🟢🟢********* ORDEN COMPRA  *************🟢🟢🟢🟢🟢*

      // Agregar nuevo documento a transferRequest en el mismo lote
      const collectionTransferRequestsRef = collection(db, "ordenesCompra2");
      const nuevoDocumentoRef = doc(collectionTransferRequestsRef);
      batch.set(nuevoDocumentoRef, {
        ...ordenCompraSchema,
        ...newOCEditable,
      });

      // Crea la notificacion del destinatario
      const detinarioParsed = destinatarios.filter(
        (destinatario) => destinatario.correo !== ""
      );

      const docNotificacion = {
        ...notificacionesDBSchema,
        tipoDoc: "ordenCompraSGI",
        idDoc: nuevoDocumentoRef.id,
        createdAt: ES6AFormat(new Date()),
        createdBy: userMaster.userName,
        destinatarios: detinarioParsed,
        numOrigenDoc: newOCEditable.numeroDoc,
      };
      console.log(docNotificacion);
      // 🟢🟢🟢🟢🟢********* NOTIFICACIONES  *************🟢🟢🟢🟢🟢*
      // Enviar correo
      const destinos = detinarioParsed.map((destino) => {
        return destino.correo;
      });
      if (destinos.length > 0) {
        const collectNoti = collection(db, "notificaciones");
        const nuevoDocNoti = doc(collectNoti);
        batch.set(nuevoDocNoti, docNotificacion);
      }

      // 🟢🟢🟢🟢🟢********* CONFIRMACION  *************🟢🟢🟢🟢🟢*

      console.log("llegoooooooooooo");
      await batch.commit();
      console.log(destinos);
      setValueETAGeneral("");
      // 🟢🟢🟢🟢🟢********* ENVIAR CORREOS  *************🟢🟢🟢🟢🟢*

      if (destinos.length > 0) {
        FuncionEnviarCorreo({
          para: destinos,
          asunto: "Orden de compra creada",
          mensaje: PlantillaOrdenCompra({ ordenCompra: newOCEditable }),
        });
      }
      setMensajeAlerta("Orden de compra realizada con exito.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      inputNumOrden.current.focus();
      setIsLoading(false);
      setDestinatarios([initiaValueDest, initiaValueDest]);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
    }

    setOCEditable({ ...ordenCompraSchema });
    setinputvalue({ ...initialValue });

    // }
  };

  const [hasModal, setHasModal] = useState(false);
  const initiaValueDest = {
    nombre: "",
    correo: "",
  };
  const [destinatarios, setDestinatarios] = useState([
    initiaValueDest,
    initiaValueDest,
  ]);
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
              ? {
                  ...desti,
                  nombre: value,
                  correo: usuarioFind.correo,
                }
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
              ? {
                  ...desti,
                  nombre: usuarioFind.nombre,
                  correo: value,
                }
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
  const guardarDestinatario = () => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    let proceder = true;
    console.log(destinatarios);
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
        console.log(detino.correo);
        console.log(index);
        console.log(detino.nombre);
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
      setHasModal(false);
    }
  };

  return (
    <Container>
      <>
        <BotonQuery ocEditable={ocEditable} inputvalue={inputvalue} />
        <CajaEncabezado>
          <Titulo>Crear Ordenes de Compra</Titulo>
          <BtnHead onClick={() => enviarObjeto()}>
            <Icono icon={faPaperPlane} />
            Enviar
          </BtnHead>
        </CajaEncabezado>
        <CajaDatosCabecera>
          <CajitaDatosCabecera>
            <TextoLabel>Numero:</TextoLabel>
            <InputEditable
              type="text"
              name="numeroDoc"
              value={ocEditable.numeroDoc}
              ref={inputNumOrden}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </CajitaDatosCabecera>
          <CajitaDatosCabecera>
            <TextoLabel>Proveedor:</TextoLabel>
            <InputEditable
              type="text"
              name="proveedor"
              value={ocEditable.proveedor}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </CajitaDatosCabecera>

          <CajitaDatosCabecera>
            <TextoLabel>Comentarios:</TextoLabel>
            <TextArea2
              type="textarea"
              name="comentarios"
              value={ocEditable.comentarios}
              onChange={(e) => {
                handleInputs(e);
              }}
            />
          </CajitaDatosCabecera>
        </CajaDatosCabecera>
        <CajaMasBtn>
          <BtnHead className="correo" onClick={() => setHasModal(true)}>
            <Icono className="correo" icon={faEnvelope} />
            Email
          </BtnHead>
        </CajaMasBtn>
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldasHead2>N°</CeldasHead2>
                <CeldasHead2>Codigo</CeldasHead2>
                <CeldasHead2>Descripcion</CeldasHead2>
                <CeldasHead2>Qty</CeldasHead2>
                <CeldasHead2>Comentarios</CeldasHead2>
              </FilasGroup>
            </thead>
            <tbody>
              {inputvalue.inputs?.map((res, index) => {
                return (
                  <FilasGroup key={index} className="body">
                    {label.labels.map((elm, i) => {
                      return (
                        <CeldasBodyGroup key={i} className="conInput">
                          {elm == "n°" ? (
                            index + 1
                          ) : (
                            <InputCelda2
                              onInput={(e) => {
                                handlePaste1(index, elm, e, i);
                              }}
                              className={"celda " + elm}
                              onPaste={(e) => {
                                handlePaste(index, elm, e, i);
                              }}
                              type="textbox"
                              value={inputvalue.inputs[index][elm]}
                            />
                          )}
                        </CeldasBodyGroup>
                      );
                    })}
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
        </CajaTablaGroup>
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
      </>

      {isLoading ? <ModalLoading completa={true} /> : ""}

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
};

const ContenidoModal = styled.div`
  width: 60%;
  display: flex;
  justify-content: center;
  margin: auto;
`;
const Container = styled.div`
  width: 100%;
  min-height: 400px;
  margin: auto;
  margin-bottom: 25px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  position: relative;
`;
const CajaEncabezado = styled.div`
  padding: 5px;
  display: flex;
  justify-content: space-around;

  color: white;
  border-bottom: 1px solid white;
`;
const Titulo = styled.h2`
  width: 100%;
  text-align: center;
  text-decoration: underline;
`;
const CajaDatosCabecera = styled.div`
  display: flex;
  justify-content: center;
  gap: 5px;
  padding: 15px;
  flex-wrap: wrap;
  /* margin-bottom: 10px; */
`;

const CajitaDatosCabecera = styled.div`
  /* width: 25%; */
  display: flex;
  flex-direction: column;
`;

const TextoLabel = styled.span`
  margin-bottom: 2px;
`;
const InputEditable = styled(InputSimpleEditable)``;
const Input = styled.input`
  height: 35px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  padding: 5px;
  width: 95%;
  resize: both;
  resize: horizontal;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;
const TextArea2 = styled(TextArea)`
  height: 35px;
  min-height: 10px;
  outline: none;
  border-radius: 5px;
  padding: 4px;
  width: 95%;
  resize: vertical;
`;
const CeldasHead2 = styled(CeldaHeadGroup)`
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: white;
  &:first-child {
    width: 50px;
    background-color: ${Tema.secondary.azulGraciel};
  }
  &:nth-child(2) {
    width: 80px;
  }
  &:nth-child(3) {
    width: 300px;
  }
  &:nth-child(4) {
    width: 100px;
  }
  &:last-child {
    width: 300px;
  }
`;
const InputCelda2 = styled(InputSimpleEditable)`
  border: none;
  &.codigo {
    text-align: center;
  }
  &.qty {
    text-align: center;
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.correo {
    font-size: 1rem;
  }
`;
// 777
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
