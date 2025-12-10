import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

import { BotonQuery } from "../../components/BotonQuery";
import { addDoc, collection, Timestamp } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ModalLoading } from "../../components/ModalLoading";
import { Alerta } from "../../components/Alerta";
import {
  fetchDocsByConditionGetDocs,
  fetchGetDocs,
} from "../../libs/useDocByCondition";
import { ES6AFormat } from "../../libs/FechaFormat";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import { InputSimpleEditable, TextArea } from "../../components/InputGeneral";
import { DestinatariosCorreo } from "../../components/DestinatariosCorreo";

import { proySchema } from "../schemas/proySchema";
import { TodosLosCorreosCielosDB } from "../../components/corporativo/TodosLosCorreosCielosDB";

export default function AddProy({ userMaster, modoDisabled }) {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  // *********************************USEEFFECT MASTER INICIAL**********************
  const [proyEditable, setProyEditable] = useState({});
  const [datosParseados, setDatosParseados] = useState(false);
  useEffect(() => {
    setProyEditable({ ...proySchema });
    setDatosParseados(true);
  }, [userMaster, proySchema]);

  // ******************************MANEJANDO LOS INPUTS********************************
  const handleInput = (e) => {
    const { name, value } = e.target;
    const index = e.target.dataset.index;
    const tipoDataset = e.target.dataset.tipo;

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
        [name]: name == "numeroDoc" ? value.toUpperCase() : value,
      }));
    }
  };

  const addElement = (e) => {
    if (modoDisabled) {
      return;
    }
    const { name, dataset } = e.target;
    const isAdding = dataset.action;
    if (isAdding == "remove" && proyEditable[name].length == 1) {
      return "";
    }
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
  const [hasDatosObligarorios, setHasDatosObligatorios] = useState(true);

  const enviarObjeto = async () => {
    // ******* VALIDACIONES  ******
    //

    // Validar Datos generales
    const camposPrincipales = ["numeroDoc", "socioNegocio", "detalles"];
    const camposVacios = camposPrincipales.some(
      (campo) => proyEditable[campo] === ""
    );

    if (camposVacios) {
      setMensajeAlerta("Campos obligatorios marcados en rojo.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setHasDatosObligatorios(false);
      return "";
    }
    const proyEditableParsed = {
      ...proyEditable,
      destinatariosNotificacion: destinatarios,
    };
    // Validar personas de contacto
    const contactosValidos = proyEditableParsed.personasContacto.some(
      (person) => person.nombre && person.telefono && person.rol
    );

    if (!contactosValidos) {
      setMensajeAlerta("Completar al menos una persona de contacto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setHasDatosObligatorios(false);
      return "";
    }
    //
    // Si el usuario coloca al menos una persona de contacto, pero coloca otra con campos incorrectos
    if (contactosValidos) {
      const soloConDatos = proyEditableParsed.personasContacto.filter(
        (person) => {
          if (
            person.nombre != "" ||
            person.telefono != "" ||
            person.rol != ""
          ) {
            return person;
          }
        }
      );
      const algunoVacio = soloConDatos.some(
        (vacio) => vacio.nombre == "" || vacio.telefono == "" || vacio.rol == ""
      );
      if (algunoVacio) {
        setMensajeAlerta("Completar correctamente persona de contacto.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    }

    //Si el numero de proyecto ya existe
    const arrayProy = await fetchDocsByConditionGetDocs("proyectos");
    const nameDuplicated = arrayProy.some(
      (proy) =>
        proy.numeroDoc.toLocaleLowerCase() ==
        proyEditableParsed.numeroDoc.toLocaleLowerCase()
    );
    if (nameDuplicated) {
      setMensajeAlerta("Este numero de proyectos ya existe.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    // Si coloco un correo incorrecto en destinatario
    function esCorreoValido(correo) {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(correo);
    }
    let isCorreo = true;
    proyEditableParsed.destinatariosNotificacion.forEach((persona) => {
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
    const contactosParsed = proyEditableParsed.personasContacto.filter(
      (person) => {
        if (person.nombre && person.rol && person.telefono) {
          return person;
        }
      }
    );
    try {
      console.log(userMaster);
      await addDoc(collection(db, "proyectos"), {
        ...proyEditableParsed,
        createdByd: userMaster.userName,
        personasContacto: contactosParsed,
        fechaCreacionCaeloss: ES6AFormat(new Date()),
        fechaCreacionCaelossStamp: Timestamp.fromDate(new Date()),
      });
      setMensajeAlerta("Proyecto creado con exito.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setProyEditable({ ...proySchema });
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
  };

  // ******************** DESTINATARIOS *******************
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
      {datosParseados && (
        <>
          <BotonQuery proyEditable={proyEditable} />
          <ContainerSuperior>
            <Container className={Theme.config.modoClear ? "clearModern" : ""}>
              <CajasInterna
                className={Theme.config.modoClear ? "clearModern" : ""}
              >
                <CajitaDetalle>
                  <TituloDetalle>N° proyecto:</TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto title={proyEditable.numeroDoc}>
                      {proyEditable.numeroDoc}
                    </DetalleTexto>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.numeroDoc}
                      name="numeroDoc"
                      autoComplete="off"
                      className={`
                        
                        ${hasDatosObligarorios == false ? "rojo" : ""}
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </CajitaDetalle>
                <CajitaDetalle>
                  <TituloDetalle>Socio de negocio:</TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto title={proyEditable.socioNegocio}>
                      {proyEditable.socioNegocio}
                    </DetalleTexto>
                  ) : (
                    <InputEditable
                      type="text"
                      value={proyEditable.socioNegocio}
                      name="socioNegocio"
                      autoComplete="off"
                      className={`
                        
                        ${hasDatosObligarorios == false ? "rojo" : ""}
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  )}
                </CajitaDetalle>
                <CajitaDetalle className="cajaDetalles">
                  <TituloDetalle className={modoDisabled ? "modoDisabled" : ""}>
                    Detalles / Direccion:
                  </TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto
                      title={proyEditable.detalles}
                      className="textArea"
                    >
                      {proyEditable.detalles}
                    </DetalleTexto>
                  ) : (
                    <CajaTextArea>
                      <TextArea2
                        type="text"
                        value={proyEditable.detalles}
                        name="detalles"
                        autoComplete="off"
                        className={`
                        
                          ${hasDatosObligarorios == false ? "rojo" : ""}
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    </CajaTextArea>
                  )}
                </CajitaDetalle>
                <CajitaDetalle className="cajaDetalles">
                  <TituloDetalle className={modoDisabled ? "modoDisabled" : ""}>
                    Location:
                  </TituloDetalle>
                  {modoDisabled ? (
                    <DetalleTexto
                      title={proyEditable.location}
                      className="textArea"
                    >
                      {proyEditable.location}
                    </DetalleTexto>
                  ) : (
                    <CajaTextArea>
                      <TextArea2
                        type="text"
                        value={proyEditable.location}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                        name="location"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    </CajaTextArea>
                  )}
                </CajitaDetalle>
                <CajaArray
                  className={`
                  ${modoDisabled ? " modoDisabled " : ""}
                  ${hasDatosObligarorios == false ? " rojo " : ""}
                `}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray ancho100">
                      Destinatarios de notificaciones:
                    </TituloDetalle>
                  </CajitaDetalle>
                  <CajitaDetalle className="item">
                    <DestinatariosCorreo
                      modoDisabled={false}
                      arrayDestinatarios={destinatarios}
                      addDestinatario={addDestinatario}
                      handleInputDestinatario={handleInputDestinatario}
                      funcionGuardarDesactivada={true}
                      // guardarDestinatario={guardarDestinatario}
                    />
                  </CajitaDetalle>

                  {/* {modoDisabled ? (
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
                  )} */}
                </CajaArray>
              </CajasInterna>

              <CajasInterna
                className={
                  Theme.config.modoClear
                    ? "clearModern borderLetf"
                    : "borderLetf"
                }
              >
                <CajaArray
                  className={`
                  ${modoDisabled ? " modoDisabled " : ""}
                  ${hasDatosObligarorios == false ? " rojo " : ""}
                `}
                >
                  <CajitaDetalle className="cajaTitulo">
                    <TituloDetalle className="tituloArray">
                      Personas de contacto:
                    </TituloDetalle>
                  </CajitaDetalle>
                  <CajitaDetalle className="item">
                    {proyEditable?.personasContacto?.map((person, index) => {
                      return (
                        <CajaElementArray key={index}>
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
                            {modoDisabled ? (
                              <DetalleTexto
                                title={person.nombre}
                                // className="textArea"
                                className="itemArray"
                              >
                                {person.nombre}
                              </DetalleTexto>
                            ) : (
                              <InputEditable
                                type="text"
                                data-tipo="personContact"
                                className={`
                        
                                  ${Theme.config.modoClear ? "clearModern" : ""}
                                  `}
                                value={person.nombre}
                                name="nombre"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            )}
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
                            {modoDisabled ? (
                              <DetalleTexto
                                title={person.rol}
                                // className="textArea"
                                className="itemArray"
                              >
                                {person.rol}
                              </DetalleTexto>
                            ) : (
                              <InputEditable
                                data-tipo="personContact"
                                className={`
                        
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                type="text"
                                value={person.rol}
                                name="rol"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            )}
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
                            {modoDisabled ? (
                              <DetalleTexto
                                title={person.telefono}
                                // className="textArea"
                                className="itemArray"
                              >
                                {person.telefono}
                              </DetalleTexto>
                            ) : (
                              <InputEditable
                                data-tipo="personContact"
                                className={`
                        
                                ${Theme.config.modoClear ? "clearModern" : ""}
                                `}
                                type="text"
                                value={person.telefono}
                                name="telefono"
                                autoComplete="off"
                                onChange={(e) => {
                                  handleInput(e);
                                }}
                                data-index={index}
                              />
                            )}
                          </CajitaHijaItem>
                        </CajaElementArray>
                      );
                    })}
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
            </Container>
            <BtnSimple onClick={() => enviarObjeto()}>Enviar</BtnSimple>
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
  border-radius: 10px;
  display: flex;
  justify-content: center;
  &.clearModern {
    border: 1px solid white;
    background-color: ${ClearTheme.secondary.azulFrosting};
    color: white;
    padding: 10px;
  }
`;

const CajasInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  /* border: 2px solid ${Tema.neutral.blancoHueso}; */
  background-color: ${Tema.secondary.azulProfundo};
  &.clearModern {
    border-radius: 0;
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    color: white;
    &.borderLetf {
      border-left: 1px solid white;
    }
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  justify-content: space-between;

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
    /* padding: 10px; */
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
  &.modoDisabled {
    border: none;
  }
  &.rojo {
    border: 1px solid red;
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
const BtnSimple = styled(BtnGeneralButton)``;

const InputCelda = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;
const InputEditable = styled(InputCelda)`
  height: 30px;
  width: 50%;
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
  &.rojo {
    border: 1px solid red;
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
  &.rojo {
    border: 1px solid red;
  }
`;
const CajaTextArea = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
`;
const CajaElementArray = styled.div`
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  margin-bottom: 3px;
`;
const CajaTop = styled.div``;
const CajaB = styled.div``;
