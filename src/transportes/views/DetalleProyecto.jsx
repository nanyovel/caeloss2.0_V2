import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

import { BotonQuery } from "../../components/BotonQuery";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ModalLoading } from "../../components/ModalLoading";
import { Alerta } from "../../components/Alerta";
import { NavLink, useParams } from "react-router-dom";
import ControlesDoc from "../components/ControlesDoc";
import { useDocByCondition } from "../../libs/useDocByCondition";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema } from "../../config/theme";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import { InputSimpleEditable } from "../../components/InputGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { proySchema } from "../schemas/proySchema";

export default function DetalleProyecto({ userMaster }) {
  // ****General***
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // *************** CONFIG GENERAL *******************
  const location = useParams();
  const [docUser, setDocUser] = useState(location.id);
  const [proyMaster, setProymaster] = useState(null);
  const [proyDB, setProyDB] = useState([]);
  const [datosParseados, setDatosParseados] = useState(false);

  const [dbProyectos, setDBProyectos] = useState([]);

  useDocByCondition("proyectos", setProyDB, "numeroDoc", "==", docUser);
  useDocByCondition("proyectos", setDBProyectos);
  useEffect(() => {
    if (proyDB.length > 0) {
      const pryAux = proyDB[0];
      let destinatariosNotificacion = proySchema.destinatariosNotificacion;
      if (pryAux?.destinatariosNotificacion?.length > 0) {
        destinatariosNotificacion = pryAux.destinatariosNotificacion;
      }
      setProyEditable({
        ...pryAux,
        destinatariosNotificacion: destinatariosNotificacion,
      });
      setProymaster(pryAux);
    }
  }, [userMaster, proySchema, proyMaster, proyDB]);

  // *************** EDITANDO Y CREANDO *******************
  const [proyEditable, setProyEditable] = useState({});

  const handleInput = (e) => {
    const tipoDataset = e.target.dataset.tipo;
    const hasPermiso = userMaster.permisos.includes("editarProyectTMS");
    if (!hasPermiso) {
      return;
    }
    const { name, value } = e.target;
    const index = e.target.dataset.index;
    console.log(tipoDataset);
    if (tipoDataset == "personContact") {
      const personArray = proyEditable.personasContacto.map((person, i) => {
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

      setProyEditable({
        ...proyEditable,
        personasContacto: personArray,
      });
    } else if (tipoDataset == "destinatarios") {
      console.log(index);
      const destinoArray = proyEditable.destinatariosNotificacion.map(
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

      setProyEditable({
        ...proyEditable,
        destinatariosNotificacion: destinoArray,
      });
    } else {
      setProyEditable((preventState) => ({
        ...preventState,
        [name]: value,
      }));
    }
  };

  const addElement = (e) => {
    if (modoEdicion == false) {
      return;
    }
    const { name, dataset } = e.target;
    const isAdding = dataset.action;

    const updateData = (key) => {
      setProyEditable((preState) => ({
        ...preState,
        [key]:
          isAdding == "add"
            ? [...preState[key], proySchema[key][0]]
            : preState[key].slice(0, -1),
      }));
    };
    updateData(name);
  };

  // *************** EDICIONES *******************
  const [modoEdicion, setModoEdicion] = useState(false);
  const handleControles = (e) => {
    const { name } = e.target;
    if (name == "btnEditar") {
      const hasPermiso = userMaster.permisos.includes("editarProyectTMS");
      if (!hasPermiso) {
        return;
      }
      if (proyMaster.estadoDoc == 1) {
        return;
      }
      setModoEdicion(true);
      setControles({
        ...initialControles,
        btns: controles.btns.map((btn) => {
          return {
            ...btn,
            activated: btn.tipo == "btnEditar" ? false : true,
          };
        }),
      });
    }
    if (name == "btnSalir") {
      setModoEdicion(false);
      // setControles(initialControles);
    }
    if (name == "btnGuardar") {
      guardarCambios();
    }
    if (name == "btnConcluir") {
      concluirProyecto();
    }
    if (name == "btnAbrir") {
      abrirProyecto();
    }
  };
  const initialControles = {
    btns: [
      {
        texto: "Editar",
        tipo: "btnEditar",
        icono: true,
        visible: true,
        disabled: true,
        title: "",
      },
      {
        texto: "Salir",
        tipo: "btnSalir",
        icono: true,
        visible: true,
        disabled: true,
        title: "Dejar el modo edicion.",
      },
      {
        texto: "Guardar",
        tipo: "btnGuardar",
        icono: true,
        visible: true,
        disabled: true,
        title: "Guardar cambios",
      },

      {
        texto: "Concluir",
        tipo: "btnConcluir",
        icono: true,
        visible: true,
        disabled: true,
        title: "Cerrar proyecto.",
      },
      {
        texto: "Abrir",
        tipo: "btnAbrir",
        icono: true,
        visible: true,
        disabled: true,
        title: "Abrir proyecto.",
      },
    ],
  };
  const [controles, setControles] = useState(null);

  // ******* ACTUALIZAR ESTADOS DE CONTROLES ******
  useEffect(() => {
    if (proyMaster) {
      let auxDefaultVisible = [];
      let auxDefaultActivo = [];
      if (!modoEdicion) {
        auxDefaultVisible = [
          "btnEditar",
          proyMaster.estadoDoc == 0
            ? "btnConcluir"
            : proyMaster.estadoDoc == 1
              ? "btnAbrir"
              : "",
        ];
        auxDefaultActivo = [
          "btnEditar",
          proyMaster.estadoDoc == 0
            ? "btnConcluir"
            : proyMaster.estadoDoc == 1
              ? "btnAbrir"
              : "",
        ];
      }
      if (modoEdicion) {
        auxDefaultVisible = ["btnSalir", "btnGuardar"];
        auxDefaultActivo = ["btnSalir", "btnGuardar"];
      }

      // Definir botones por privilegios
      const hasEditar = userMaster.permisos.includes("editarProyectTMS");
      const hasClose = userMaster.permisos.includes("closeProyectTMS");
      const hasOpen = userMaster.permisos.includes("openProyectTMS");

      const defaultVisiblePriv = auxDefaultVisible.filter((btn) => {
        if (btn == "btnEditar") {
          if (hasEditar) {
            return btn;
          }
        } else if (btn == "btnConcluir") {
          if (hasClose) {
            return btn;
          }
        } else if (btn == "btnAbrir") {
          if (hasOpen) {
            return btn;
          }
        } else {
          return btn;
        }
      });
      const defaultActivoPriv = auxDefaultActivo.filter((btn) => {
        if (btn == "btnEditar") {
          if (hasEditar) {
            if (proyMaster.estadoDoc == 0) {
              return btn;
            }
          }
        } else if (btn == "btnConcluir") {
          if (hasClose) {
            return btn;
          }
        } else if (btn == "btnAbrir") {
          if (hasOpen) {
            return btn;
          }
        } else {
          console.log(btn);
          return btn;
        }
      });

      console.log(defaultActivoPriv);
      console.log(defaultVisiblePriv);
      const controls = {
        ...initialControles,
        btns: initialControles.btns.map((btn) => {
          return {
            ...btn,
            disabled: !defaultActivoPriv.includes(btn.tipo),
            visible: defaultVisiblePriv.includes(btn.tipo),
          };
        }),
      };
      console.log(controls);
      setControles(controls);
      setDatosParseados(true);
    }
  }, [proyMaster, modoEdicion]);

  const guardarCambios = async () => {
    const hasPermiso = userMaster.permisos.includes("editarProyectTMS");
    if (!hasPermiso) {
      return;
    }
    if (proyMaster.estadoDoc == 1) {
      return;
    }
    if (modoEdicion == false) {
      return;
    }
    if (proyEditable.numeroDoc == "") {
      setMensajeAlerta("Inidicar numero de proyecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
    if (proyEditable.socioNegocio == "") {
      setMensajeAlerta("Colocar nombre de cliente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
    if (proyEditable.detalles == "") {
      setMensajeAlerta("Llenar campo de detalles de localidad de proyecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }

    // Validacion Documentos
    const algunDato = proyEditable.personasContacto.filter(
      (persona) =>
        persona.nombre != "" || persona.telefono != "" || persona.rol != ""
    );
    if (algunDato.length > 0) {
      const incompleto = algunDato.some(
        (persona) =>
          persona.nombre == "" || persona.telefono == "" || persona.rol == ""
      );
      // Si algun numero de documento no esta lleno completamente
      if (incompleto) {
        setMensajeAlerta(
          "Colocar correctamente al menos una persona de contacto."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // Si no coloco numero de documento
    else {
      setMensajeAlerta("Ingresar al menos una persona de contacto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si el numero de proyecto ya se esta utilizando
    if (proyMaster.numeroDoc != proyEditable.numeroDoc) {
      const proyectoFind = dbProyectos.find(
        (proyecto) =>
          String(proyecto.numeroDoc).toLowerCase() ==
          String(proyEditable.numeroDoc).toLowerCase()
      );
      if (proyectoFind) {
        setMensajeAlerta("El numero de proyecto colocado ya existe.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }
    // Si coloco un correo incorrecto en destinatario
    function esCorreoValido(correo) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(correo);
    }
    let isCorreo = true;
    proyEditable.destinatariosNotificacion.forEach((persona) => {
      console.log(persona.correo);

      if (!esCorreoValido(persona.correo) && persona.correo != "") {
        isCorreo = false;
      }
    });

    if (!isCorreo) {
      setMensajeAlerta("Correo de destinatario invalido.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "proyectos", proyEditable.id);

      await updateDoc(docRef, { ...proyEditable });
      setMensajeAlerta("Proyecto modificado.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
      setModoEdicion(false);
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
  };
  const concluirProyecto = async () => {
    const hasPermiso = userMaster.permisos.includes("closeProyectTMS");
    if (!hasPermiso) {
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "proyectos", proyMaster.id);
      await updateDoc(docRef, { estadoDoc: 1 });
      setMensajeAlerta("Proyecto Cerrado.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
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
  };
  const abrirProyecto = async () => {
    const hasPermiso = userMaster.permisos.includes("openProyectTMS");
    if (!hasPermiso) {
      return;
    }
    setIsLoading(true);
    try {
      const docRef = doc(db, "proyectos", proyMaster.id);
      await updateDoc(docRef, { estadoDoc: 0 });
      setMensajeAlerta("Proyecto abierto correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
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
  };
  return (
    <>
      <BotonQuery
        proyEditable={proyEditable}
        proyMaster={proyMaster}
        dbProyectos={dbProyectos}
      />
      {datosParseados && (
        <>
          <ContainerSuperior>
            <CajaTopStatus
              className={
                proyMaster.estadoDoc == 0
                  ? "abierto"
                  : proyMaster.estadoDoc == 1
                    ? "cerrado"
                    : ""
              }
            >
              <TextoStatus>
                {proyMaster.estadoDoc == 0 ? (
                  <>
                    <Icono icon={faLock} />
                    Abierto
                  </>
                ) : proyMaster.estadoDoc == 1 ? (
                  <>
                    <Icono icon={faLock} />
                    Cerrado
                  </>
                ) : (
                  ""
                )}
              </TextoStatus>
            </CajaTopStatus>
            <ControlesDoc
              titulo={"Detalles de proyecto:"}
              controles={controles}
              tipo="proyecto"
              handleControles={handleControles}
            />
            <Container>
              <CajasInterna>
                <Detalle1Wrap>
                  <Detalle2Titulo>N° proyecto:</Detalle2Titulo>
                  {modoEdicion == false ? (
                    <Detalle3OutPut title={proyEditable.numeroDoc}>
                      {proyEditable.numeroDoc}
                    </Detalle3OutPut>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.numeroDoc}
                      name="numeroDoc"
                      autoComplete="off"
                      className="celda clearModern"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Cliente:</Detalle2Titulo>
                  {modoEdicion == false ? (
                    <Detalle3OutPut title={proyEditable.socioNegocio}>
                      {proyEditable.socioNegocio}
                    </Detalle3OutPut>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.socioNegocio}
                      name="socioNegocio"
                      autoComplete="off"
                      className="celda clearModern"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </Detalle1Wrap>
                <Detalle1Wrap>
                  <Detalle2Titulo>Creado por:</Detalle2Titulo>

                  <Detalle3OutPut title={proyEditable.createdByd}>
                    {proyEditable.createdByd}
                  </Detalle3OutPut>
                </Detalle1Wrap>
                <Detalle1Wrap className="vertical">
                  <Detalle2Titulo className="vertical">
                    Detalles / Direccion:
                  </Detalle2Titulo>
                  {modoEdicion == false ? (
                    <Detalle3OutPut
                      className="vertical"
                      title={proyEditable.detalles}
                    >
                      {proyEditable.detalles}
                    </Detalle3OutPut>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.detalles}
                      name="detalles"
                      autoComplete="off"
                      className="celda clearModern"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </Detalle1Wrap>
                <Detalle1Wrap className="vertical">
                  <Detalle2Titulo className="vertical">
                    Location:
                  </Detalle2Titulo>
                  {modoEdicion == false ? (
                    <Detalle3OutPut
                      className="vertical"
                      title={proyEditable.location}
                    >
                      <Enlaces target="_blank" to={proyEditable.location}>
                        {proyEditable.location}
                      </Enlaces>
                    </Detalle3OutPut>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.location}
                      name="location"
                      autoComplete="off"
                      className="celda clearModern"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </Detalle1Wrap>
                <CajitaDetalle className="cajaTitulo">
                  <TituloDetalle className="tituloArray ancho100">
                    Destinatarios de notificaciones:
                  </TituloDetalle>
                </CajitaDetalle>
                {modoEdicion && (
                  <CajitaDetalle className="item">
                    {proyEditable?.destinatariosNotificacion?.map(
                      (person, index) => {
                        return (
                          <CajaElementArray key={index} className="items">
                            <CajitaHijaItem className="enArray">
                              <TituloDetalle className="itemArray">
                                Nombre:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="destinatarios"
                                value={person.nombre}
                                name="nombre"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>

                            <CajitaHijaItem className="enArray">
                              <TituloDetalle className="itemArray">
                                Correo:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="destinatarios"
                                value={person.correo}
                                name="correo"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                          </CajaElementArray>
                        );
                      }
                    )}
                  </CajitaDetalle>
                )}
                {modoEdicion == false ? (
                  ""
                ) : (
                  <CajitaDetalle className="cajaBtn">
                    <BtnSimple
                      name="destinatariosNotificacion"
                      onClick={(e) => addElement(e)}
                      data-action="add"
                    >
                      +
                    </BtnSimple>
                    <BtnSimple
                      name="destinatariosNotificacion"
                      onClick={(e) => addElement(e)}
                      data-action="remove"
                    >
                      -
                    </BtnSimple>
                  </CajitaDetalle>
                )}
                {modoEdicion == false && (
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
                        {proyEditable?.destinatariosNotificacion?.map(
                          (person, index) => {
                            return (
                              <FilasGroup
                                key={index}
                                className={`body ${index % 2 ? "impar" : "par"}`}
                              >
                                <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
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
              </CajasInterna>

              <CajasInterna>
                <CajaArray
                  className={modoEdicion == false ? "modoEdicion" : ""}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray">
                      Personas de contacto:
                    </TituloDetalle>
                  </CajitaDetalle>
                  {modoEdicion && (
                    <CajitaDetalle className="item">
                      {proyEditable?.personasContacto?.map((person, index) => {
                        return (
                          <CajaElementArray key={index} className="items">
                            <CajitaHijaItem className="enArray">
                              <TituloDetalle className="itemArray">
                                Nombre:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                value={person.nombre}
                                name="nombre"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                            <CajitaHijaItem className="enArray">
                              <TituloDetalle className="itemArray">
                                Rol:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                value={person.rol}
                                name="rol"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                            <CajitaHijaItem className="enArray">
                              <TituloDetalle className="itemArray">
                                Telefono:
                              </TituloDetalle>

                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                value={person.telefono}
                                name="telefono"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            </CajitaHijaItem>
                          </CajaElementArray>
                        );
                      })}
                    </CajitaDetalle>
                  )}
                  {modoEdicion == false && (
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
                          {proyEditable?.personasContacto?.map(
                            (person, index) => {
                              return (
                                <FilasGroup
                                  key={index}
                                  className={`body ${index % 2 ? "impar" : "par"}`}
                                >
                                  <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
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

                  {modoEdicion == false ? (
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
            </Container>
          </ContainerSuperior>
        </>
      )}
      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const ContainerSuperior = styled.div`
  text-align: center;
`;

const Container = styled.div`
  border: 2px solid ${Tema.neutral.blancoHueso};
  border: 1px solid white;
  border-radius: 10px;
  display: flex;
  justify-content: center;
`;

const CajasInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  color: white;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.neutral.blancoHueso};
  &.item {
    width: 100%;
    flex-direction: column;
    padding: 10px;
  }
  &.cajaBtn {
    background-color: transparent;
    justify-content: center;
  }
  &.cajaTitulo {
    border: none;
  }
  &.cajaDetalles {
    flex-direction: column;
  }
  border: 1px solid ${Tema.secondary.azulOpaco};
`;

const TituloDetalle = styled.p`
  width: 50%;
  padding-left: 5px;
  color: inherit;
  text-align: start;
  &.tituloArray {
    text-decoration: underline;
    color: white;
  }
  &.itemArray {
    /* background-color: ${Tema.secondary.azulOscuro3}; */
    color: white;
  }
  &.modoEdicion {
    text-decoration: underline;
  }
  &.ancho100 {
    width: 100%;
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
  }
`;
const CajaArray = styled.div`
  display: flex;
  flex-direction: column;
  &.modoEdicion {
    border: none;
  }
`;

const CajitaHijaItem = styled.div`
  /* background-color: ${Tema.secondary.azulOscuro2}; */
  padding: 5px;
  border-radius: 5px;
  display: flex;
  width: 100%;
  margin-bottom: 1px;
  &.enArray {
    padding: 0;
    border-bottom: 1px solid #acacac;
    border-radius: 0;
    color: white;
    margin-bottom: 5px;
  }
  /* border: 1px solid ${Tema.secondary.azulOpaco}; */
`;
const BtnSimple = styled(BtnGeneralButton)``;

const InputEditable = styled(InputSimpleEditable)`
  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
`;

const CajaElementArray = styled.div`
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  &.items {
    background-color: ${ClearTheme.secondary.azulGris};
    margin-bottom: 4px;
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

const CajaTopStatus = styled.div`
  border-bottom: 1px solid ${Tema.neutral.blancoHueso};
  min-height: 40px;
  align-content: center;
  width: 100%;

  &.abierto {
    background-color: ${Tema.neutral.neutral700};
    background-color: ${Tema.complementary.success};
    color: ${Tema.neutral.neutral700};
    color: white;
  }

  &.cerrado {
    background-color: ${Tema.secondary.azulOpaco};
    color: ${Tema.neutral.blancoHueso};
  }
`;
const TextoStatus = styled.h2`
  text-align: center;
  font-size: 1.3rem;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
  pointer-events: none;
`;
const CajaTablaGroup2 = styled(CajaTablaGroup)`
  border: none;
`;
