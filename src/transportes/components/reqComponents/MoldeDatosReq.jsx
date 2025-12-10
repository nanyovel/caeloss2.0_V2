import { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";

import { BotonQuery } from "../../../components/BotonQuery";
import PlantillaTablaMat from "../../../components/PlatillaTablaMat";
import parse from "paste-from-excel";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsUpDown,
  faBroom,
  faCodePullRequest,
  faDownLeftAndUpRightToCenter,
  faFloppyDisk,
} from "@fortawesome/free-solid-svg-icons";
import { fetchDocsByConditionGetDocs } from "../../../libs/useDocByCondition";
import { faPenToSquare } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { ClearTheme, Tema, Theme } from "../../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
  TextArea,
} from "../../../components/InputGeneral";
import Table from "../../../components/JSXElements/Tablas/Table";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { Alerta } from "../../../components/Alerta";
import { reqSchema } from "../../schemas/reqSchema";
import { OpcionUnica } from "../../../components/OpcionUnica";
import { localidadesAlmacen } from "../../../components/corporativo/Corporativo";
import { DestinatariosCorreo } from "../../../components/DestinatariosCorreo";
import { TodosLosCorreosCielosDB } from "../../../components/corporativo/TodosLosCorreosCielosDB";

export default function MoldeDatosReq({
  datosReq,
  setDatosReq,
  userMaster,
  modoDisabled,
  tipo,
  faltanObligatorios,
  tipoTraslado,
  plantilla,
  datosFlete,
  opcionAlmacen,
  setOpcionAlmacen,
  destinatarios,
  setDestinatarios,
}) {
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // *********************  ALIMENTANDO DESDE PLANTILLA *******************
  useEffect(() => {
    if (plantilla) {
      console.log(plantilla);
      setDatosReq({
        ...datosReq,
        socioNegocio: plantilla.datosReq.socioNegocio,
        detalles: plantilla.datosReq.detalles,
        location: plantilla.datosReq.location,
        numeroProyecto: plantilla.datosReq.numeroProyecto,
        personasContacto: plantilla.datosReq.personasContacto,
        destinatariosNotificacion: plantilla.datosReq.destinatariosNotificacion,
      });
    }
  }, [plantilla]);

  useEffect(() => {
    if (setDestinatarios) {
      setDestinatarios(datosReq.destinatariosNotificacion);
    }
  }, [datosReq]);

  // ******************************MANEJANDO LOS INPUTS********************************
  const handleInput = (e) => {
    const { name, value } = e.target;
    const index = e.target.dataset.index;
    const tipoDataset = e.target.dataset.tipo;
    if (tipoDataset == "documentos") {
      const documentosArray = datosReq.documentos.map((doc, i) => {
        if (i == index) {
          return {
            ...doc,
            tipoDoc: name == "tipoDoc" ? value : doc.tipoDoc,
            numeroDoc: name == "numeroDoc" ? value : doc.numeroDoc,
          };
        } else {
          return doc;
        }
      });
      setDatosReq({
        ...datosReq,
        documentos: documentosArray,
      });
    } else if (tipoDataset == "personContact") {
      const personArray = datosReq.personasContacto.map((person, i) => {
        if (i == index) {
          return {
            ...person,
            nombre: name == "nombre" ? value : person.nombre,
            telefono: name == "telefono" ? value : person.telefono,
            rol: name == "rol" ? value : person.rol,
          };
        } else {
          return person;
        }
      });

      setDatosReq({
        ...datosReq,
        personasContacto: personArray,
      });
    } else if (tipoDataset == "destinatarios") {
      const personArray = datosReq.destinatariosNotificacion.map(
        (person, i) => {
          if (i == index) {
            return {
              ...person,
              nombre: name == "nombre" ? value : person.nombre,
              correo: name == "correo" ? value : person.correo,
            };
          } else {
            return person;
          }
        }
      );

      setDatosReq({
        ...datosReq,
        destinatariosNotificacion: personArray,
      });
    } else {
      setDatosReq((preventState) => ({
        ...preventState,
        [name]: name == "numeroProyecto" ? value.toUpperCase() : value,
      }));
    }
  };

  const addElement = (e) => {
    if (modoDisabled) {
      return;
    }
    const { name, dataset } = e.target;
    const isAdding = dataset.action;

    const updateData = (key) => {
      setDatosReq((prevDatosReq) => ({
        ...prevDatosReq,
        [key]:
          isAdding == "add"
            ? [...prevDatosReq[key], reqSchema.datosReq[key][0]]
            : prevDatosReq[key].slice(0, -1),
      }));
    };
    console.log(opcionAlmacen);
    if (name === "documentos") {
      if (isAdding == "add") {
        setOpcionAlmacen([...opcionAlmacen, opcionesAlmInitial]);
        updateData("documentos");
      }
      if (isAdding == "remove" && datosReq.documentos.length > 1) {
        // setOpcionAlmacen((prevState) => prevState.slice(0, -1));
        updateData("documentos");
        const arrayMenos1 = opcionAlmacen.filter((opcion, index) => {
          if (index !== opcionAlmacen.length - 1) {
            return [...opcion];
          }
        });

        setOpcionAlmacen(arrayMenos1);
      }
    } else if (name === "personasContacto") {
      if (datosReq.personasContacto.length > 1 || isAdding == "add") {
        updateData("personasContacto");
      }
    } else if (name === "destinatariosNotificacion") {
      if (datosReq.destinatariosNotificacion.length > 1 || isAdding == "add") {
        updateData("destinatariosNotificacion");
      }
    }
  };

  // ****** MATERIALES EN DEVOLUCION *****
  const [isModalMatDev, setIsModalMatDev] = useState(false);
  const label = {
    labels: ["n°", "codigo", "descripcion", "qty"],
  };
  const [inputvalue, setinputvalue] = useState({ ...PlantillaTablaMat });
  const handlePaste = (index, elm, e) => {
    return parse(e);
  };

  // const handlePaste1 = (index, elm, e, i) => {
  const handlePaste1 = (index, elm, e) => {
    setinputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) => {
        let valueParse = e.target.value;

        return index === i
          ? {
              ...item,
              [elm]: elm == "Qty" ? valueParse.replace(/,/g, "") : valueParse,
            }
          : item;
      }),
    }));
  };

  const manejarModalMat = (e) => {
    const { name } = e.target.dataset;
    if (name == "cerrar") {
      const inputAux = { ...PlantillaTablaMat };
      setinputvalue(inputAux);

      setIsModalMatDev(false);
    }

    if (name == "guardar") {
      const newInputs = inputvalue.inputs
        .filter((item) => {
          if (item.codigo != "" || item.descripcion != "" || item.qty != "") {
            return item;
          }
        })
        .map((input) => {
          const { n, ...restoItem } = input;
          return restoItem;
        });

      setDatosReq({
        ...datosReq,
        materialesDev: newInputs,
      });
      setIsModalMatDev(false);
      const inputAux = { ...PlantillaTablaMat };
      setinputvalue(inputAux);
    } else if (name == "editar") {
      setIsModalMatDev(true);
      // inputValue tome lo que tenga datosMat
      datosReq.materialesDev.forEach((itemReq, index) => {
        setinputvalue((inputvalue) => ({
          ...inputvalue,
          inputs: inputvalue.inputs.map((itemInput, i) => {
            if (i == index) {
              return {
                ...itemInput,
                ...itemReq,
              };
            } else {
              return itemInput;
            }
          }),
        }));
      });
    } else if (name == "limpiar") {
      setinputvalue({ ...PlantillaTablaMat });
    }
  };

  const [proyTraido, setProyTraido] = useState(false);
  const traerProyecto = async (e) => {
    const icono = e.target.closest("svg"); // Asegúrate de que el clic es dentro del svg
    const nombreIcono = icono ? icono.dataset.nombre : null;

    if (nombreIcono == "pullProy") {
      if (datosReq.numeroProyecto == "") {
        setMensajeAlerta("Ingresar numero de proyecto.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      const arrayProy = await fetchDocsByConditionGetDocs(
        "proyectos",
        undefined,
        "numeroDoc",
        "==",
        datosReq.numeroProyecto
      );
      const proyFinded = arrayProy[0];
      // const proyFinded = arrayProy.find(
      //   (proy) =>
      //     proy.numeroDoc.toUpperCase() == datosReq.numeroProyecto.toUpperCase()
      // );
      if (proyFinded) {
        setProyTraido(true);

        setDatosReq({
          ...datosReq,
          socioNegocio: proyFinded.socioNegocio,
          detalles: proyFinded.detalles,
          numeroProyecto: proyFinded.numeroDoc,
          location: proyFinded.location,
          personasContacto: proyFinded.personasContacto,
          destinatariosNotificacion: proyFinded.destinatariosNotificacion || [],
        });
        setActivedExt(true);
      } else {
        setMensajeAlerta("Proyecto colocado no existe.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    } else if (nombreIcono == "modificar") {
      setProyTraido(false);
    }
  };
  const copiarLocation = () => {
    if (datosReq.location == "") {
      setMensajeAlerta("Sin enlace a copiar.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    const link = datosReq.location;
    navigator.clipboard.writeText(link);
    setMensajeAlerta("Enlace copiado.");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };

  const [columnasTable, setColumnasTable] = useState([]);
  const [datosTablaState, setDatosTablaState] = useState([]);
  useEffect(() => {
    const columnasTablas = [
      {
        label: "Codigo",
        key: "codigo",
      },
      {
        label: "Descripcion",
        key: "descripcion",
      },
      {
        label: "Qty",
        key: "qty",
      },
    ];
    setColumnasTable(columnasTablas);
    const datosTablas = datosReq.materialesDev.map((item, index) => {
      return {
        ...item,
      };
    });
    const datosParsedTabla = datosTablas.map((obj) =>
      Object.entries(obj).map(([key, value]) => ({
        value,
        key,
      }))
    );
    setDatosTablaState(datosParsedTabla);
  }, [datosReq.materialesDev]);

  // Datos adicionales de solicitud
  const [activedExt, setActivedExt] = useState(false);

  // ************************** ALMACENES *************************
  // Aqui vamos a manejar los almacenes
  // 1-Si esta seleccionado santo domingo y en entrega, entonces el usuario elige entre Principal, Pantoja y KM 13
  // 2-Cada almacen tiene un code que proviene del archivo corporativo.js
  // 3-Si no es santo domingo, entonces el almacen es el que viene por defecto; que es tomar el valor de la propiedad code y asignarselo a la propiedad bodega de cada documento
  const opcionesAlmInitial = [
    {
      nombre: "Principal",
      select: false,
      codigoInterno: "principal01",
    },
    {
      nombre: "Pantoja",
      select: false,
      codigoInterno: "pantoja02",
    },
    {
      nombre: "KM 13",
      select: false,
      codigoInterno: "km1307",
    },
  ];
  useEffect(() => {
    if (setOpcionAlmacen) {
      setOpcionAlmacen([opcionesAlmInitial, opcionesAlmInitial]);
    }
  }, []);

  const handleOpcionAlmacen = (e) => {
    const grupoDataset = Number(e.target.dataset.grupo);
    const index = Number(e.target.dataset.id);

    const nuevoGrupo = opcionAlmacen.map((grupo, indexGrupo) => {
      if (grupoDataset == indexGrupo) {
        return grupo.map((opcion, indexOpcion) => {
          return {
            ...opcion,
            select: indexOpcion == index,
          };
        });
      } else {
        return [...grupo];
      }
    });
    setOpcionAlmacen(nuevoGrupo);

    // const documentosAux = datosReq.documentos.map((doc, index) => {
    //   const bodegaSelect = nuevoGrupo[index].find((opcion) => opcion.select);

    //   console.log(nuevoGrupo[index]);
    //   console.log(bodegaSelect);
    //   console.log(index);

    //   return {
    //     ...doc,
    //     bodega: bodegaSelect ? bodegaSelect.codigoInterno : doc.bodega,
    //   };
    // });

    // setDatosReq((prevsState) => ({
    //   ...prevsState,
    //   documentos: documentosAux,
    // }));
  };
  // ******************** DESTINATARIOS *******************
  const initiaValueDest = {
    nombre: "",
    correo: "",
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

  return (
    <>
      <BotonQuery datosReq={datosReq} destinatarios={destinatarios} />
      {faltanObligatorios && (
        <CajaIncompleto>
          <ParrafoIncompleto>
            Los campos con asterisco son obligatorios.
          </ParrafoIncompleto>
        </CajaIncompleto>
      )}
      {true && (
        <ContainerMaster>
          <Container
            className={` ${faltanObligatorios ? "faltanObligatorios" : ""}`}
          >
            <CajasInterna className="caja1">
              {(tipo != 1 || tipoTraslado[1].select == true) && (
                <CajitaDetalle>
                  <TituloDetalle>
                    {tipo == 3 ? "Proveedor*:" : "Cliente*:"}
                  </TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto title={datosReq.socioNegocio}>
                      {datosReq.socioNegocio}
                    </DetalleTexto>
                  ) : (
                    <InputEditable
                      type="text"
                      value={datosReq.socioNegocio}
                      name="socioNegocio"
                      autoComplete="off"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </CajitaDetalle>
              )}

              {tipo == 1 && tipoTraslado[1].select == true ? (
                <>
                  <CajitaDetalle className="noProyecto">
                    <TituloDetalle>N° proyecto:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={datosReq.numeroProyecto}>
                        {datosReq.numeroProyecto}
                      </DetalleTexto>
                    ) : (
                      <>
                        <InputEditable
                          type="text"
                          value={datosReq.numeroProyecto}
                          name="numeroProyecto"
                          autoComplete="off"
                          disabled={proyTraido}
                          className={`
                          ${Theme.config.modoClear ? " clearModern " : ""}
                          ${proyTraido ? " disabled " : ""}
                          `}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                        />
                        {proyTraido == false ? (
                          <Icono
                            title="Modificar"
                            className={`pullProy
                          ${Theme.config.modoClear ? " clearModern " : ""}
                          `}
                            name="pullProy"
                            data-nombre="pullProy"
                            icon={faCodePullRequest}
                            onClick={(e) => {
                              traerProyecto(e);
                            }}
                          />
                        ) : (
                          <Icono
                            title="Modificar"
                            className={`pullProy
                          ${Theme.config.modoClear ? " clearModern " : ""}
                          `}
                            name="modificar"
                            data-nombre="modificar"
                            icon={faPenToSquare}
                            onClick={(e) => {
                              traerProyecto(e);
                            }}
                          />
                        )}
                      </>
                    )}
                  </CajitaDetalle>
                </>
              ) : (
                ""
              )}

              <CajitaDetalle className="cajaDetalles">
                <TituloDetalle className={modoDisabled ? "modoDisabled" : ""}>
                  Detalles*:
                </TituloDetalle>
                {modoDisabled ? (
                  <DetalleTexto title={datosReq.detalles} className="textArea">
                    {datosReq.detalles}
                  </DetalleTexto>
                ) : (
                  <CajaTextArea>
                    <TextArea2
                      type="text"
                      value={datosReq.detalles}
                      name="detalles"
                      autoComplete="off"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  </CajaTextArea>
                )}
              </CajitaDetalle>

              {tipo != 2 && (
                <CajaArray
                  className={`
                ${modoDisabled ? "modoDisabled" : ""}
                ${Theme.config.modoClear ? "clearModern" : ""}
                `}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray">
                      Documentos*:
                    </TituloDetalle>
                  </CajitaDetalle>
                  <>
                    <CajitaDetalle className="item">
                      {!modoDisabled && (
                        <>
                          {datosReq?.documentos?.map((doc, index) => {
                            return (
                              <CajaElementArray key={index}>
                                <CajitaHijaItem
                                  className={`enArray
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                >
                                  <TituloDetalle
                                    className={`${Theme.config.modoClear ? "clearModern" : ""}`}
                                  >
                                    Tipo de documento:
                                  </TituloDetalle>

                                  <MenuDesplegable2
                                    value={doc.tipoDoc}
                                    data-tipo="documentos"
                                    name="tipoDoc"
                                    className={
                                      Theme.config.modoClear
                                        ? "clearModern"
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleInput(e);
                                    }}
                                    data-index={index}
                                  >
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value=""
                                      disabled
                                    >
                                      Seleccione tipo
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Factura"
                                    >
                                      Factura
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Orden de ventas"
                                    >
                                      Orden de ventas
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Conduce"
                                    >
                                      Conduce
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Orden de compras"
                                    >
                                      Orden de compras
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Orden de ventas manual"
                                    >
                                      Orden de ventas manual
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Conduce Manual"
                                    >
                                      Conduce Manual
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Solicitud de traslado"
                                    >
                                      Solicitud de traslado
                                    </Opciones2>
                                    <Opciones2
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      value="Otros"
                                    >
                                      Otros
                                    </Opciones2>
                                  </MenuDesplegable2>
                                </CajitaHijaItem>
                                <CajitaHijaItem
                                  className={`enArray
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                >
                                  <TituloDetalle
                                    className={`enArray
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                  >
                                    Nº documento:
                                  </TituloDetalle>

                                  <InputEditable
                                    type="text"
                                    data-tipo="documentos"
                                    value={doc.numeroDoc}
                                    name="numeroDoc"
                                    autoComplete="off"
                                    data-index={index}
                                    className={
                                      Theme.config.modoClear
                                        ? "clearModern"
                                        : ""
                                    }
                                    onChange={(e) => {
                                      handleInput(e);
                                    }}
                                  />
                                </CajitaHijaItem>
                                {datosFlete.puntoPartida?.find(
                                  (punto) => punto.select == true
                                )?.codigoInterno == "principal01" &&
                                  (tipo === 0 || tipo === 3) && (
                                    <CajitaHijaItem
                                      className={`enArray
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                    >
                                      <TituloDetalle
                                        className={`enArray
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                      >
                                        Almacen:
                                      </TituloDetalle>
                                      <OpcionUnica
                                        name={"almacen" + index}
                                        arrayOpciones={opcionAlmacen[index]}
                                        handleOpciones={handleOpcionAlmacen}
                                        dataGrupo={index}
                                        unPixerMargin={true}
                                        bottomOf={true}
                                      />
                                    </CajitaHijaItem>
                                  )}
                              </CajaElementArray>
                            );
                          })}
                          <CajitaDetalle className="cajaBtn">
                            <BtnSimple
                              name="documentos"
                              onClick={(e) => addElement(e)}
                              data-action="add"
                            >
                              +
                            </BtnSimple>
                            <BtnSimple
                              name="documentos"
                              onClick={(e) => addElement(e)}
                              data-action="remove"
                            >
                              -
                            </BtnSimple>
                          </CajitaDetalle>
                        </>
                      )}
                      {modoDisabled && (
                        <CajaTablaGroup2>
                          <TablaGroup>
                            <thead>
                              <FilasGroup>
                                <CeldaHeadGroup>N°</CeldaHeadGroup>
                                <CeldaHeadGroup>Tipo</CeldaHeadGroup>
                                <CeldaHeadGroup>Numero</CeldaHeadGroup>
                                {datosReq?.documentos[0].bodega && (
                                  <CeldaHeadGroup>Almacen</CeldaHeadGroup>
                                )}
                              </FilasGroup>
                            </thead>
                            <tbody>
                              {datosReq?.documentos?.map((doc, index) => {
                                return (
                                  <FilasGroup
                                    key={index}
                                    className={`body ${index % 2 ? "impar" : "par"}`}
                                  >
                                    <CeldasBodyGroup>
                                      {index + 1}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {doc.tipoDoc}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {doc.numeroDoc}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {doc.bodega &&
                                        localidadesAlmacen.find(
                                          (loca) =>
                                            loca.codigoInterno == doc.bodega
                                        ).nombreResumido}
                                    </CeldasBodyGroup>
                                  </FilasGroup>
                                );
                              })}
                            </tbody>
                          </TablaGroup>
                          <BotonQuery />
                        </CajaTablaGroup2>
                      )}
                    </CajitaDetalle>
                  </>
                </CajaArray>
              )}

              {tipo == 2 && (
                <CajaArray
                  className={`
                retiroObra
                ${Theme.config.modoClear ? "clearModern" : ""}
                `}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray">
                      Materiales a retirar*:
                    </TituloDetalle>
                  </CajitaDetalle>
                  <CajitaDetalle>
                    <Table columnas={columnasTable} datos={datosTablaState} />
                    {Theme.config.modoClear == false && (
                      <CajaTabla className="retiroObra">
                        <Tabla>
                          <thead>
                            <Filas className="cabeza">
                              <CeldaHead className="codigo">Codigo</CeldaHead>
                              <CeldaHead className="descripcion">
                                Descripcion
                              </CeldaHead>
                              <CeldaHead className="qty">Qty</CeldaHead>
                              <CeldaHead>Obs</CeldaHead>
                            </Filas>
                          </thead>
                          <tbody>
                            {datosReq.materialesDev.map((mat, index) => {
                              return (
                                <Filas className="body" key={index}>
                                  <CeldasBody>{mat.codigo}</CeldasBody>
                                  <CeldasBody title={mat.descripcion}>
                                    {mat.descripcion}
                                  </CeldasBody>
                                  <CeldasBody>{mat.qty}</CeldasBody>
                                  <CeldasBody title={mat.comentarios}>
                                    {mat.comentarios}
                                  </CeldasBody>
                                </Filas>
                              );
                            })}
                          </tbody>
                        </Tabla>
                      </CajaTabla>
                    )}
                  </CajitaDetalle>
                  <CajitaDetalle className="cajaBtn">
                    {datosReq.materialesDev.length == 0 ? (
                      <BtnSimple onClick={() => setIsModalMatDev(true)}>
                        Agregar
                      </BtnSimple>
                    ) : (
                      <BtnSimple
                        data-name="editar"
                        onClick={(e) => manejarModalMat(e)}
                      >
                        Editar
                      </BtnSimple>
                    )}
                  </CajitaDetalle>
                </CajaArray>
              )}
            </CajasInterna>
            {tipo != 1 && (
              <CajasInterna>
                <CajitaDetalle className="noProyecto">
                  <TituloDetalle>N° proyecto:</TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto title={datosReq.numeroProyecto}>
                      {datosReq.numeroProyecto}
                    </DetalleTexto>
                  ) : (
                    <>
                      <InputEditable
                        type="text"
                        value={datosReq.numeroProyecto}
                        name="numeroProyecto"
                        autoComplete="off"
                        disabled={proyTraido}
                        className={`
                        ${Theme.config.modoClear ? " clearModern " : ""}
                        ${proyTraido ? " disabled " : ""}
                        `}
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                      {proyTraido == false ? (
                        <Icono
                          title="Halar datos proyecto."
                          name="pullProy"
                          className={`pullProy
                          ${Theme.config.modoClear ? " clearModern " : ""}
                         
                          `}
                          data-nombre="pullProy"
                          icon={faCodePullRequest}
                          onClick={(e) => {
                            traerProyecto(e);
                          }}
                        />
                      ) : (
                        <Icono
                          title="Modificar"
                          className={`pullProy
                          ${Theme.config.modoClear ? " clearModern " : ""}
                          `}
                          name="modificar"
                          data-nombre="modificar"
                          icon={faPenToSquare}
                          onClick={(e) => {
                            traerProyecto(e);
                          }}
                        />
                      )}
                    </>
                  )}
                </CajitaDetalle>
                <CajitaDetalle className="cajaDetalles">
                  <TituloDetalle
                    className={
                      modoDisabled ? "modoDisabled location" : "location"
                    }
                  >
                    {tipo == 3
                      ? "Ubicacion del proveedor :"
                      : "Ubicacion de Google Maps:"}
                    {modoDisabled && (
                      <ParrafoCopiar
                        title="Copiar link"
                        onClick={() => copiarLocation()}
                      >
                        Copiar
                      </ParrafoCopiar>
                    )}
                  </TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto className="textArea">
                      <Enlaces to={datosReq.location} target="_blank">
                        {datosReq.location}
                      </Enlaces>
                    </DetalleTexto>
                  ) : (
                    <CajaTextArea>
                      <TextArea2
                        type="text"
                        value={datosReq.location}
                        name="location"
                        autoComplete="off"
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    </CajaTextArea>
                  )}
                </CajitaDetalle>
                <CajaArray
                  className={`
                          ${modoDisabled ? "modoDisabled" : ""}
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray">
                      Personas de contacto*:
                    </TituloDetalle>
                  </CajitaDetalle>
                  <CajitaDetalle className="item">
                    {!modoDisabled &&
                      datosReq?.personasContacto?.map((person, index) => {
                        return (
                          <CajaElementArray
                            key={index}
                            className="maryorMargin"
                          >
                            <CajitaHijaItem
                              className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                            >
                              <TituloDetalle
                                className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                              >
                                Nombre:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                value={person.nombre}
                                name="nombre"
                                autoComplete="off"
                                className={
                                  Theme.config.modoClear ? "clearModern" : ""
                                }
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                            <CajitaHijaItem
                              className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                            >
                              <TituloDetalle
                                className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                              >
                                Rol:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                value={person.rol}
                                name="rol"
                                autoComplete="off"
                                className={
                                  Theme.config.modoClear ? "clearModern" : ""
                                }
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                            <CajitaHijaItem
                              className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                            >
                              <TituloDetalle
                                className={`enArray
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                              >
                                Telefono:
                              </TituloDetalle>

                              <InputEditable
                                data-tipo="personContact"
                                type="text"
                                value={person.telefono}
                                name="telefono"
                                autoComplete="off"
                                className={
                                  Theme.config.modoClear ? "clearModern" : ""
                                }
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                          </CajaElementArray>
                        );
                      })}
                    {modoDisabled && (
                      <CajaTablaGroup2>
                        <TablaGroup>
                          <thead>
                            <FilasGroup>
                              <CeldaHeadGroup>N°</CeldaHeadGroup>
                              <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                              <CeldaHeadGroup>Rol</CeldaHeadGroup>
                              <CeldaHeadGroup>Telefono</CeldaHeadGroup>
                            </FilasGroup>
                          </thead>
                          <tbody>
                            {datosReq?.personasContacto?.map(
                              (person, index) => {
                                return (
                                  <FilasGroup
                                    key={index}
                                    className={`body ${index % 2 ? "impar" : "par"}`}
                                  >
                                    <CeldasBodyGroup>
                                      {index + 1}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {person.nombre}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {person.rol}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {person.telefono}
                                    </CeldasBodyGroup>
                                  </FilasGroup>
                                );
                              }
                            )}
                          </tbody>
                        </TablaGroup>
                      </CajaTablaGroup2>
                    )}
                  </CajitaDetalle>

                  {modoDisabled ? (
                    ""
                  ) : (
                    <CajitaDetalle className="cajaBtn">
                      <BtnSimple
                        name="personasContacto"
                        onClick={(e) => addElement(e)}
                        data-action="add"
                      >
                        +
                      </BtnSimple>
                      <BtnSimple
                        name="personasContacto"
                        onClick={(e) => addElement(e)}
                        data-action="remove"
                      >
                        -
                      </BtnSimple>
                    </CajitaDetalle>
                  )}
                </CajaArray>
              </CajasInterna>
            )}
          </Container>
          <CajaExtension>
            <TituloExtension>Mas datos de solicitud:</TituloExtension>
            {activedExt ? (
              <>
                <WrapCajasInternaExt>
                  <CajasInterna>
                    <CajaArray
                      className={`extension
                          ${modoDisabled ? "modoDisabled" : ""}
                          `}
                    >
                      <CajitaDetalle className="cajaTitulo">
                        <TituloDetalle className="tituloArray ancho100">
                          Destinatarios de notificaciones:
                        </TituloDetalle>
                      </CajitaDetalle>
                      <CajitaDetalle className="item">
                        {
                          !modoDisabled && (
                            <DestinatariosCorreo
                              modoDisabled={modoDisabled}
                              arrayDestinatarios={destinatarios}
                              addDestinatario={addDestinatario}
                              handleInputDestinatario={handleInputDestinatario}
                              funcionGuardarDesactivada={true}
                              // guardarDestinatario={guardarDestinatario}
                            />
                          )
                          // datosReq?.destinatariosNotificacion?.map(
                          //   (person, index) => {
                          //     return (
                          //       <CajaElementArray
                          //         key={index}
                          //         className="maryorMargin"
                          //       >
                          //         <CajitaHijaItem
                          //           className={`enArray
                          //         ${Theme.config.modoClear ? "clearModern" : ""}
                          //         `}
                          //         >
                          //           <TituloDetalle
                          //             className={`enArray
                          //         ${Theme.config.modoClear ? "clearModern" : ""}
                          //         `}
                          //           >
                          //             Nombre:
                          //           </TituloDetalle>

                          //           <InputEditable
                          //             type="text"
                          //             data-tipo="destinatarios"
                          //             value={person.nombre}
                          //             name="nombre"
                          //             autoComplete="off"
                          //             className={
                          //               Theme.config.modoClear
                          //                 ? "clearModern"
                          //                 : ""
                          //             }
                          //             onChange={(e) => {
                          //               handleInput(e);
                          //             }}
                          //             data-index={index}
                          //           />
                          //         </CajitaHijaItem>

                          //         <CajitaHijaItem
                          //           className={`enArray
                          //         ${Theme.config.modoClear ? "clearModern" : ""}
                          //         `}
                          //         >
                          //           <TituloDetalle
                          //             className={`enArray
                          //         ${Theme.config.modoClear ? "clearModern" : ""}
                          //         `}
                          //           >
                          //             Correo:
                          //           </TituloDetalle>

                          //           <InputEditable
                          //             type="text"
                          //             data-tipo="destinatarios"
                          //             value={person.correo}
                          //             name="correo"
                          //             autoComplete="off"
                          //             className={
                          //               Theme.config.modoClear
                          //                 ? "clearModern"
                          //                 : ""
                          //             }
                          //             onChange={(e) => {
                          //               handleInput(e);
                          //             }}
                          //             data-index={index}
                          //           />
                          //         </CajitaHijaItem>
                          //       </CajaElementArray>
                          //     );
                          //   }
                          // )
                        }
                        {modoDisabled && (
                          <CajaTablaGroup2>
                            <TablaGroup>
                              <thead>
                                <FilasGroup>
                                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                                  <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                                  <CeldaHeadGroup>Correo</CeldaHeadGroup>
                                </FilasGroup>
                              </thead>
                              <tbody>
                                {datosReq?.destinatariosNotificacion?.map(
                                  (person, index) => {
                                    return (
                                      <FilasGroup
                                        key={index}
                                        className={`body ${index % 2 ? "impar" : "par"}`}
                                      >
                                        <CeldasBodyGroup>
                                          {index + 1}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup>
                                          {person.nombre}
                                        </CeldasBodyGroup>
                                        <CeldasBodyGroup>
                                          {person.correo}
                                        </CeldasBodyGroup>
                                      </FilasGroup>
                                    );
                                  }
                                )}
                              </tbody>
                            </TablaGroup>
                          </CajaTablaGroup2>
                        )}
                      </CajitaDetalle>
                    </CajaArray>
                  </CajasInterna>
                  <CajasInterna>
                    {tipo !== 2 && (
                      <CajaArray
                        className={`extension
                
                `}
                      >
                        <CajitaDetalle className="cajaTitulo">
                          <TituloDetalle className="tituloArray ancho100 extension">
                            Tabla de materiales:
                          </TituloDetalle>
                        </CajitaDetalle>
                        <CajitaDetalle>
                          <Table
                            columnas={columnasTable}
                            datos={datosTablaState}
                          />
                        </CajitaDetalle>
                        {!modoDisabled && (
                          <CajitaDetalle className="cajaBtn">
                            {datosReq.materialesDev.length == 0 ? (
                              <BtnSimple onClick={() => setIsModalMatDev(true)}>
                                Agregar
                              </BtnSimple>
                            ) : (
                              <BtnSimple
                                data-name="editar"
                                onClick={(e) => manejarModalMat(e)}
                              >
                                Editar
                              </BtnSimple>
                            )}
                          </CajitaDetalle>
                        )}
                      </CajaArray>
                    )}
                  </CajasInterna>
                </WrapCajasInternaExt>
                <CajaBtnExpCompress>
                  <BtnSimple onClick={() => setActivedExt(false)}>
                    <Icono icon={faDownLeftAndUpRightToCenter} />
                    Contraer
                  </BtnSimple>
                </CajaBtnExpCompress>
              </>
            ) : (
              <CajaBtnExpCompress>
                <BtnSimple onClick={() => setActivedExt(true)}>
                  <Icono icon={faArrowsUpDown} />
                  Expandir
                </BtnSimple>
              </CajaBtnExpCompress>
            )}
          </CajaExtension>
        </ContainerMaster>
      )}
      {isModalMatDev && (
        <CajaModa>
          <ModalMatAdd className={Theme.config.modoClear ? "clearModern" : ""}>
            <CajaTituloCerrar>
              <TituloModal>Tabla de materiales</TituloModal>
              <XCerrar data-name="cerrar" onClick={(e) => manejarModalMat(e)}>
                ❌
              </XCerrar>
            </CajaTituloCerrar>
            <CajaInternaScroll>
              <CajaTabla>
                <Tabla>
                  <thead>
                    <Filas className="cabeza">
                      <CeldaHead>N°</CeldaHead>
                      <CeldaHead className="codigo">Codigo</CeldaHead>
                      <CeldaHead>Descripcion</CeldaHead>
                      <CeldaHead className="qty">Qty</CeldaHead>
                    </Filas>
                  </thead>
                  <tbody>
                    {inputvalue.inputs?.map((res, index) => {
                      return (
                        <Filas
                          key={index}
                          className={`
                            body
                            ${index % 2 ? "" : "par"}
                            `}
                        >
                          {label.labels.map((elm, i) => {
                            return (
                              <CeldasBody key={i} className={elm}>
                                {elm == "n°" ? (
                                  index + 1
                                ) : (
                                  // 4141
                                  <InputCelda
                                    onInput={(e) => {
                                      handlePaste1(index, elm, e, i);
                                    }}
                                    className={elm}
                                    onPaste={(e) => {
                                      handlePaste(index, elm, e, i);
                                    }}
                                    type="textbox"
                                    value={inputvalue.inputs[index][elm]}
                                  />
                                )}
                              </CeldasBody>
                            );
                          })}
                        </Filas>
                      );
                    })}
                  </tbody>
                </Tabla>
              </CajaTabla>
            </CajaInternaScroll>
            <CajaBtnModal>
              <BtnSimple
                data-name="limpiar"
                onClick={(e) => manejarModalMat(e)}
              >
                <Icono icon={faBroom} />
                Limpiar
              </BtnSimple>
              <BtnSimple
                data-name="guardar"
                onClick={(e) => manejarModalMat(e)}
              >
                <Icono icon={faFloppyDisk} />
                Guardar
              </BtnSimple>
            </CajaBtnModal>
          </ModalMatAdd>
        </CajaModa>
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const CajaModa = styled.div`
  background-color: #00000097;
  width: 100%;
  height: 100%;
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ModalMatAdd = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 10px;
  width: 50vw;
  height: 60vh;
  overflow: hidden;
  position: relative;
  background-color: ${ClearTheme.secondary.azulVerdeOsc};
`;

const CajaInternaScroll = styled.div`
  position: absolute;
  width: 100%;
  &.retiroObra {
    height: 200px;
  }

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
  height: 80%;
  overflow-y: scroll;
  overflow: scroll;
  margin-bottom: 100px;
`;
const CajaTituloCerrar = styled.div`
  display: flex;
  border: 1px solid black;
`;
const TituloModal = styled.h2`
  color: white;
  width: 100%;
  background-color: ${Tema.primary.grisNatural};
  padding: 5px;
  width: 90%;
  border: 1px solid black;
`;
const XCerrar = styled.p`
  width: 10%;
  text-align: center;
  align-content: center;
  cursor: pointer;
  &:hover {
    border: 1px solid white;
  }
`;
const CajaTabla = styled.div`
  min-height: 200px;
  width: 100%;
  overflow: auto;
  padding: 10px;
  border: 1px solid white;
`;
const CajaBtnModal = styled.div`
  position: absolute;
  bottom: 0;
  width: 100%;
  display: flex;
  justify-content: center;
`;
const ContainerMaster = styled.div`
  color: ${Tema.neutral.blancoHueso};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  border: 1px solid white;
  border-radius: 10px;
`;
const Container = styled.div`
  /* position: relative; */
  display: flex;
  justify-content: center;

  color: white;
  &.faltanObligatorios {
    border: 2px solid red;
  }
  @media screen and (max-width: 780px) {
    flex-direction: column;
  }
`;

const CajasInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  /* border: 2px solid ${Tema.neutral.blancoHueso}; */
  @media screen and (max-width: 780px) {
    width: 100%;
  }
  &.caja1 {
    /* background-color: red; */
  }
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;

  &.item {
    /* background-color: ${Tema.neutral.blancoHueso}; */
    /* border: 2px solid blue; */
    width: 100%;
    flex-direction: column;
    /* padding: 10px; */
  }
  &.cajaBtn {
    background-color: transparent;
    justify-content: center;
  }
  &.cajaTitulo {
    border: none;
    padding: 10px;
  }
  &.cajaDetalles {
    flex-direction: column;
  }
  &.noProyecto {
    position: relative;
  }
`;

const TituloDetalle = styled.p`
  width: 50%;
  padding-left: 5px;

  color: inherit;
  text-align: start;

  &.tituloArray {
    text-decoration: underline;
  }
  &.modoDisabled {
    text-decoration: underline;
  }
  &.location {
    width: 100%;
  }
  &.clearModern {
    color: ${ClearTheme.neutral.neutral600};
  }
  &.ancho100 {
    width: 100%;
  }
  &.extension {
    color: ${ClearTheme.complementary.warning};
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
  &.textArea {
    width: 100%;
    white-space: initial;
    text-overflow: initial;
    height: auto;
    padding: 5px;
    text-align: start;
    padding-left: 15px;
    min-height: 90px;
  }
  &.itemArray {
    padding: 5px;
    width: 50%;
    height: 31px;
    /* border: 1px solid red; */
  }
`;
const CajaArray = styled.div`
  display: flex;
  flex-direction: column;
  margin-top: 20px;

  &.modoDisabled {
    border: none;
  }
  background-color: ${Tema.secondary.azulOscuro2};
  &.retiroObra {
    height: 300px;
  }
  background-color: ${ClearTheme.secondary.azulVerdeOsc};
  border: 1px solid ${ClearTheme.neutral.neutral650};
  min-height: 220px;
  &.extension {
    background-color: #3e3e3e;
    color: ${ClearTheme.complementary.warning};
  }
`;

const CajitaHijaItem = styled.div`
  background-color: ${Tema.secondary.azulOscuro3};
  padding: 5px;
  border-radius: 5px;
  display: flex;
  /* border: 2px solid yellow; */
  width: 100%;
  margin-bottom: 1px;
  border: 1px solid transparent;

  &.enArray {
    padding: 0;
  }
  /* background-color: red; */
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeClaro};
    /* border: 1px solid black; */
  }
`;

const BtnSimple = styled(BtnGeneralButton)`
  min-width: 100px;
  &.pullProy {
    width: 120px;
    position: absolute;
    /* right:; */
    color: ${Tema.primary.azulBrillante};
    /* top: 50%; */
    right: 100%;
    transform: translate(0, -50%);
    cursor: pointer;
    border: 1px solid ${Tema.primary.grisNatural};
    padding: 5px;
    border-radius: 4px;
  }
`;

const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  background-color: ${Tema.secondary.azulGraciel};
  height: 30px;
  width: 50%;
  border-radius: 4px;
  &.cabecera {
    /* height: 20px; */
    border: 1px solid ${Tema.secondary.azulOscuro2};
    /* width: 150px; */
  }
  color: ${Tema.primary.azulBrillante};

  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const Opciones2 = styled(Opciones)`
  border: none;
  background-color: ${Tema.secondary.azulProfundo};
`;
const InputCelda = styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: inherit;
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  color: inherit;
  width: 100%;
  display: flex;
  &:focus {
    /* border: 1px solid ${Tema.primary.azulBrillante}; */
    /* border: 1px solid red; */
  }
`;
const InputEditable = styled(InputSimpleEditable)`
  height: 30px;
  width: 50%;
  /* border: 1px solid ${Tema.secondary.azulOscuro2}; */
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  /* border-radius: 0; */
  border-radius: 4px;

  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: #000;
  }
`;
//
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
const CajaTextArea = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
`;
const CajaElementArray = styled.div`
  /* border-bottom: 1px solid ${Tema.secondary.azulOpaco}; */
  margin-bottom: 3px;
  &.maryorMargin {
    margin-bottom: 4px;
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
  &.body {
    font-weight: normal;
    /* border-bottom: 1px solid #49444457; */
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: black;
    background-color: white;
  }

  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }

  &.inpar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
    /* background-color: #183f6e; */
    /* background-color: ${ClearTheme.secondary.azulSuave2}; */
  }
`;
const CeldaHead = styled.th`
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border-left: #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
  &.codigo {
    max-width: 90px;
    background-color: red;
    width: 80px;
  }
  &.qty {
    max-width: 90px;
    background-color: red;
    width: 80px;
  }
`;
const CeldasBody = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* border: 1px solid black; */
  height: 25px;
  text-align: center;
  border: 1px solid ${Theme.primary.azulBrillante};
  &.par {
    border-left: 1px solid #e1eef4;
  }
  &.Codigo {
    /* max-width: 40px; */
    background-color: red;
    /* width: 40px; */
  }
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
  &.pullProy {
    position: absolute;
    /* right:; */
    color: ${Tema.primary.azulBrillante};
    top: 50%;
    right: 10px;
    transform: translate(0, -50%);
    cursor: pointer;
    border: 1px solid ${Tema.primary.grisNatural};
    padding: 5px;
    border-radius: 4px;
    &.clearModern {
      color: white;
    }
  }
  &.location {
    margin: 5px 0 0 8px;
    font-size: 0.8rem;
    cursor: pointer;
    border: 1px solid ${Tema.secondary.azulOpaco};
    transition: all ease 0.3s;
    /* padding: 2px; */
    &:hover {
      border-radius: 4px;
      border: 1px solid ${Tema.complementary.azulStatic};
    }
  }
`;
const ParrafoCopiar = styled.span`
  display: inline;
  text-decoration: underline;
  margin-left: 8px;
  cursor: pointer;
  &:hover {
    color: ${Tema.secondary.azulProfundo};
  }
`;
const CajaIncompleto = styled.div`
  width: 100%;
  border: 1px solid ${Tema.complementary.warning};
  text-align: start;
  padding: 5px;
  background-color: ${Tema.complementary.warning};
`;
const ParrafoIncompleto = styled.p`
  color: #550e0e;
  font-size: 1rem;
`;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const CajaTablaGroup2 = styled(CajaTablaGroup)`
  border: none;
`;
const CajaExtension = styled.div`
  margin-top: 15px;
  /* border: 2px solid red; */
  width: 100%;
  color: white;
`;
const TituloExtension = styled.h3`
  font-weight: 400;
  width: 100%;
  text-align: center;
  text-decoration: underline;
  color: ${ClearTheme.complementary.warning};
`;
const WrapCajasInternaExt = styled.div`
  display: flex;
  @media screen and (max-width: 780px) {
    flex-direction: column;
  }
`;
const CajaBtnExpCompress = styled.div`
  width: 100%;
  text-align: center;
`;
