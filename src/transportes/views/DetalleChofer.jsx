import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ControlesDoc from "../components/ControlesDoc";
import { BotonQuery } from "../../components/BotonQuery";
import { Link, useParams } from "react-router-dom";
import {
  faCloudArrowUp,
  faPenToSquare,
} from "@fortawesome/free-solid-svg-icons";

import db from "../../firebase/firebaseConfig";

import { useDocByCondition } from "../../libs/useDocByCondition";
import { localidadesAlmacen } from "../../components/corporativo/Corporativo";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import ImgStar from "./../../../public/img/estrella.png";
import { Alerta } from "../../components/Alerta";
import { ModalLoading } from "../../components/ModalLoading";
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
  writeBatch,
} from "firebase/firestore";
import { ClearTheme, Tema, Theme } from "../../config/theme.jsx";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import avatarMale from "./../../../public/img/avatares/maleAvatar.svg";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { EstadosChoferes } from "../libs/DiccionarioNumberString.js";
import { vehiculosSchema } from "../schemas/vehiculosSchema.js";

export const DetalleChofer = ({ userMaster }) => {
  // *************** CONFIG GENERAL *******************
  const location = useParams();
  const [docUser, setDocUser] = useState(location.id);
  const [choferMaster, setChoferMaster] = useState({});
  const [estadoAux, setEstadoAux] = useState("");
  const [initialChoferMaster, setInitialChoferMaster] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [choferDB, setChoferDB] = useState([]);

  const [datosParsed, setDatosParsed] = useState(false);
  useDocByCondition("choferes", setChoferDB, "numeroDoc", "==", docUser);
  useEffect(() => {
    if (docUser && choferDB.length > 0) {
      const choferAux = choferDB[0];
      setChoferMaster(choferAux);
      setEstadoAux(choferAux.estadoDoc);
      setInitialChoferMaster(choferAux);
      setDatosParsed(true);
    }
  }, [docUser, choferDB]);
  // *************** TRAER LOS AYUDANTES *******************
  const [dbAyudantes, setDBAyudantes] = useState([]);
  const fetchDocsByConditionGetDocs = async (
    collectionName,
    setState,
    exp1,
    condicion,
    exp2
  ) => {
    console.log("DB 😐😐😐😐😐" + collectionName);
    let q = {};

    if (exp1) {
      q = query(collection(db, collectionName), where(exp1, condicion, exp2));
    } else {
      q = query(collection(db, collectionName));
    }

    const consultaDB = await getDocs(q);
    const coleccion = consultaDB.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Si tiene useState de react, entonces guardar ahi
    // setState(coleccion);
    if (setState) {
      // setState(coleccion);
      console.log(coleccion);
      return coleccion;
    }
    // Si no tiene useState siginifica que es en una variable de js
    return coleccion;
  };

  //
  //
  // *************** EDICIONES *******************

  // **************MANEJANDO FOTO DE PERFIL**************
  const inputRef = useRef(null);
  const clickFromIcon = () => {
    inputRef.current.click();
  };
  const [fileFotoPerfil, setFileFotoPerfil] = useState(null);
  const [urlLocalFotoPerfil, setUrlLocalFotoPerfil] = useState(null);
  const [fotoPerfilInitial, setFotoPerfilInitial] = useState(null);
  useEffect(() => {
    if (userMaster) {
      const auxFotoPerfil = choferMaster?.urlFotoPerfil
        ? choferMaster?.urlFotoPerfil
        : avatarMale;
      setUrlLocalFotoPerfil(auxFotoPerfil);
      setFotoPerfilInitial(auxFotoPerfil);
    }
  }, [choferMaster]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUrlLocalFotoPerfil(imgUrl);
      setFileFotoPerfil(file);
    }
  };

  const [modoEdicion, setModoEdicion] = useState(false);

  const handleControles = async (e) => {
    let { name, value } = e.target;

    let nameDatet = e.target.dataset.name;
    if (nameDatet) {
      name = nameDatet;
    }
    if (name == "btnEditar") {
      const hasPermiso = userMaster.permisos.includes("editDriverTMS");
      if (!hasPermiso) {
        // console.log("salir");
        return;
      }
      setModoEdicion(true);
      const choferes = await fetchDocsByConditionGetDocs(
        "choferes",
        setDBAyudantes,
        "isAyudante",
        "==",
        true
      );
      setDBAyudantes(
        choferes.filter((chofer) => {
          if (chofer.estadoDoc < 3) {
            return chofer;
          }
        })
      );
      console.log(choferes);
    }
    if (name == "btnSalir") {
      setChoferMaster({ ...initialChoferMaster });
      setModoEdicion(false);
    }
    if (name == "menuEstado") {
      const hasPermiso = userMaster.permisos.includes("editDriverTMS");
      if (!hasPermiso) {
        // console.log("salir");
        return;
      }
      if (choferMaster.estadoDoc == 2) {
        return;
      }
      console.log(name);
      console.log(value);
      setControles({
        ...controles,
        menusDesplegables: controles.menusDesplegables.map((menu) => {
          if (menu.texto == "Estado") {
            return {
              ...menu,
              opciones: estadoInitial.map((menuEstado, index) => {
                if (menuEstado.nombre == value) {
                  setEstadoAux(index);
                  return {
                    ...menuEstado,

                    select: true,
                  };
                } else {
                  return {
                    ...menuEstado,
                    select: false,
                  };
                }
              }),
            };
          } else {
            return menu;
          }
        }),
      });

      return "";
    }

    if (name == "btnGuardar") {
      guardarCambios();
    }
  };

  const [estadoInitial, setEstadoInitial] = useState({});
  useEffect(() => {
    setEstadoInitial(
      EstadosChoferes.map((opcion, index) => {
        return {
          ...opcion,
          select: choferMaster.estadoDoc == index ? true : false,
          disabled:
            opcion.nombre == "Ejecucion" ||
            (opcion.nombre == "OFF" && choferMaster.isAyudante),
        };
      })
    );
  }, [choferMaster]);
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
        texto: "Eliminar",
        tipo: "btnEliminar",
        icono: true,
        visible: true,
        disabled: true,
        title: "Eliminar chofer de la base de datos",
      },
    ],
    menusDesplegables: [
      {
        texto: "Estado",
        tipo: "menuEstado",
        visible: true,
        disabled: true,
        opciones: [],
      },
    ],
  };
  const [controles, setControles] = useState(initialControles);

  // 1-DEFINIR CUALES OPCIONES TENDRA VISIBLE LA CAJA DE CONTROLES*****
  // **** BOTONES *****
  const btnGeneralVisible = {
    normal: ["btnEditar", , "btnEliminar"],
    edicion: ["btnSalir", "btnGuardar", "btnEliminar"],
  };

  const [btnDefaultVisible, setBtnDefaultVisible] = useState([]);

  const [btnDefaultActivo, setBtnDefaultActivo] = useState([]);

  const [menuDefaultVisible, setMenuDefaultVisible] = useState(["menuEstado"]);
  const [menuDefaultActivo, setMenuDefaultActivo] = useState([]);

  // ******* ACTUALIZAR ESTADOS DE CONTROLES ******
  useEffect(() => {
    if (!modoEdicion) {
      setBtnDefaultVisible([...btnGeneralVisible.normal]);

      // ****Activar o desactivar opciones mostrados****
      // 1-BTN
      let btnDefaultActivoAux = ["btnEditar"];

      if (
        choferMaster.estadoDoc == 0 ||
        choferMaster.estadoDoc == 1 ||
        choferMaster.estadoDoc == 3
      ) {
        btnDefaultActivoAux.push("btnEliminar");
      }
      setBtnDefaultActivo(btnDefaultActivoAux);
      setMenuDefaultActivo([""]);

      // 2-MENU DESPLEGABLE
    }
    if (modoEdicion) {
      setBtnDefaultVisible([...btnGeneralVisible.edicion]);

      // ****Activar o desactivar opciones mostrados****
      // 1-BTN
      let btnDefaultActivoAux = ["btnSalir", "btnGuardar"];

      if (
        choferMaster.estadoDoc == 0 ||
        choferMaster.estadoDoc == 1 ||
        choferMaster.estadoDoc == 3
      ) {
        btnDefaultActivoAux.push("btnEliminar");
      }

      setBtnDefaultActivo(btnDefaultActivoAux);

      // 2-Menu desplegable
      if (
        choferMaster.estadoDoc == 0 ||
        choferMaster.estadoDoc == 1 ||
        choferMaster.estadoDoc == 3
        //   &&
        // choferMaster.isAyudante == false
      ) {
        setMenuDefaultActivo(["menuEstado"]);
      }
      if (choferMaster.estadoDoc == 2) {
        setMenuDefaultActivo([""]);
      }
    }
  }, [choferMaster.estadoDoc, modoEdicion]);

  useEffect(() => {
    if (btnDefaultVisible.length > 0 && choferMaster.estadoDoc >= 0) {
      const controlesParsed = {
        ...initialControles,
        btns: initialControles.btns.map((btn) => {
          return {
            ...btn,
            disabled: !btnDefaultActivo.includes(btn.tipo),
            visible: btnDefaultVisible.includes(btn.tipo),
            title:
              btnDefaultActivo.includes(btn.tipo) == false
                ? `No puede ejecutar la funcion ${btn.texto} si el chofer se encuentra en estado ${choferMaster.estadoDoc == 2 ? "Ejecucion" : ""}`
                : btn.title,
          };
        }),
        menusDesplegables: initialControles.menusDesplegables.map(
          (menu, index) => {
            return {
              ...menu,
              disabled: !menuDefaultVisible.includes(menu.tipo),
              visible: menuDefaultActivo.includes(menu.tipo),
              opciones: estadoInitial,
            };
          }
        ),
      };
      // Controles luego de verificar privilegios
      const canEdit = userMaster.permisos.includes("editDriverTMS");
      const canDelete = userMaster.permisos.includes("eliminarDriverTMS");

      const controlesPriv = {
        ...controlesParsed,

        btns: controlesParsed.btns.filter((boton) => {
          if (boton.tipo == "btnEditar") {
            if (canEdit) {
              return boton;
            }
          } else if (boton.tipo == "btnEliminar") {
            if (canDelete) {
              return boton;
            }
          } else {
            return boton;
          }
        }),
      };
      setControles({ ...controlesPriv });
    }
  }, [
    btnDefaultVisible,
    btnDefaultActivo,
    menuDefaultVisible,
    menuDefaultActivo,
    choferMaster.estadoDoc,
  ]);

  // *************** INPUT *******************
  const handleInput = (e) => {
    let { name, value } = e.target;

    if (name == "tipo") {
      value = Number(value);
    }

    if (name == "renglonVehiculo") {
      console.log(value);
      const vehiculoFinded = vehiculosSchema.find((veh) => {
        if (value == veh.descripcion) {
          return veh;
        }
      });
      const auxChofer = {
        ...choferMaster,
        unidadVehicular: {
          ...choferMaster.unidadVehicular,
          code: vehiculoFinded.code,
          descripcion: vehiculoFinded.descripcion,
          urlFoto: vehiculoFinded.urlFoto,
        },
      };
      console.log(auxChofer);
      setChoferMaster(auxChofer);
    } else if (name == "placa") {
      setChoferMaster({
        ...choferMaster,
        unidadVehicular: {
          ...choferMaster.unidadVehicular,
          placa: value,
        },
      });
    } else if (name == "ayudante") {
      console.log(value);
      console.log(e.target.dataset);
      if (value == "ninguno") {
        setChoferMaster({
          ...choferMaster,
          ayudante: {
            ...choferMaster.ayudante,
            id: "",
            nombre: "",
            apellido: "",
            numeroDoc: "",
          },
        });
      } else {
        const ayudanteBuscado = dbAyudantes.find(
          (ayudante) => ayudante.nombre + " " + ayudante.apellido == value
        );

        setChoferMaster({
          ...choferMaster,
          ayudante: {
            ...choferMaster.ayudante,
            id: ayudanteBuscado.id,
            nombre: ayudanteBuscado.nombre,
            apellido: ayudanteBuscado.apellido,
            numeroDoc: ayudanteBuscado.numeroDoc,
          },
        });
      }
    } else {
      console.log("as");
      setChoferMaster({
        ...choferMaster,
        [name]: value,
      });
    }
  };
  // 787878
  const guardarCambios = async () => {
    const hasPermiso = userMaster.permisos.includes("editDriverTMS");
    if (!hasPermiso) {
      console.log("salir");
      return;
    }
    if (estadoAux == 2) {
      setMensajeAlerta("No puede hacer cambios a chofer en ejecucion");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    console.log(choferMaster);
    // return;
    setIsLoading(true);

    const batch = writeBatch(db);

    try {
      const docActualizar = doc(db, "choferes", choferMaster.id);
      // Actualiza chofer
      batch.update(docActualizar, {
        ...choferMaster,
        estadoDoc: estadoAux,
      });

      // Actualiza ayudante si existe
      if (choferMaster.ayudante.id) {
        const ayudanteActualizar = doc(
          db,
          "choferes",
          choferMaster.ayudante.id
        );
        batch.update(ayudanteActualizar, {
          "jefeChofer.id": choferMaster.id,
          "jefeChofer.numeroDoc": choferMaster.numeroDoc,
          "jefeChofer.nombre": choferMaster.nombre,
          "jefeChofer.apellido": choferMaster.apellido,
        });
      }
      // Si no tiene ayudante, verifica si anteriormente tenia, para que a ese ayudante le quites el chofer
      if (choferMaster.ayudante.id == "") {
        if (initialChoferMaster.ayudante.id) {
          // A ese ayudante quitale este chofer
          const ayudanteActualizar = doc(
            db,
            "choferes",
            initialChoferMaster.ayudante.id
          );
          batch.update(ayudanteActualizar, {
            "jefeChofer.id": "",
            "jefeChofer.numeroDoc": "",
            "jefeChofer.nombre": "",
            "jefeChofer.apellido": "",
          });
        }
      }
      // return;
      await batch.commit();

      // Foto perfil
      const storage = getStorage();
      const nombreFoto = "avatars/choferes" + choferMaster.id;
      const storageRefFoto = ref(storage, nombreFoto);
      if (fileFotoPerfil) {
        await uploadBytes(storageRefFoto, fileFotoPerfil).then(() => {});
        // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
        getDownloadURL(ref(storage, storageRefFoto)).then((url) =>
          updateDoc(docActualizar, {
            urlFotoPerfil: url,
          })
        );
        setIsLoading(false);
      }
      setMensajeAlerta("Cambios guardados correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
      setModoEdicion(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
    }
  };
  return (
    <>
      <BotonQuery
        choferMaster={choferMaster}
        choferDB={choferDB}
        controles={controles}
      />
      {datosParsed && (
        <>
          <Seccion className="horizontal">
            <CajaDetalles
              className={`
              cajaIzquierda
              ${Theme.config.modoClear ? "clearModern" : ""}
              `}
            >
              <Detalle1Wrap>
                <Detalle2Titulo>Codigo:</Detalle2Titulo>
                <Detalle3OutPut>{choferMaster?.numeroDoc}</Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Rol:</Detalle2Titulo>
                <Detalle3OutPut>
                  {choferMaster?.isAyudante ? "Ayudante" : "Chofer"}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Cedula:</Detalle2Titulo>

                <Detalle3OutPut>
                  {modoEdicion == false ? (
                    choferMaster?.cedula
                  ) : (
                    <InputSimple
                      className={`celda
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      value={choferMaster?.cedula}
                      name="cedula"
                      onChange={(e) => handleInput(e)}
                    />
                  )}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Celular:</Detalle2Titulo>

                <Detalle3OutPut>
                  {modoEdicion == false ? (
                    choferMaster?.celular
                  ) : (
                    <InputSimple
                      className={`celda
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      value={choferMaster?.celular}
                      name="celular"
                      onChange={(e) => handleInput(e)}
                    />
                  )}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Flota:</Detalle2Titulo>

                <Detalle3OutPut>
                  {modoEdicion == false ? (
                    choferMaster?.flota
                  ) : (
                    <InputSimple
                      className={`celda
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      value={choferMaster?.flota}
                      name="flota"
                      onChange={(e) => handleInput(e)}
                    />
                  )}
                </Detalle3OutPut>
              </Detalle1Wrap>

              <Detalle1Wrap>
                <Detalle2Titulo>Localidad:</Detalle2Titulo>
                {modoEdicion == false ? (
                  <Detalle3OutPut>{choferMaster?.localidad}</Detalle3OutPut>
                ) : (
                  <Detalle3OutPut>
                    <DesplegableSimple
                      value={choferMaster.localidad}
                      name="localidad"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                      className={`celda
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                    >
                      {localidadesAlmacen.map((loc, index) => {
                        return (
                          <Opciones
                            className={
                              Theme.config.modoClear ? "clearModern" : ""
                            }
                            key={index}
                            value={loc.descripcion}
                          >
                            {loc.descripcion}
                          </Opciones>
                        );
                      })}
                    </DesplegableSimple>
                  </Detalle3OutPut>
                )}
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo>Fecha creacion:</Detalle2Titulo>
                <Detalle3OutPut>
                  {choferMaster?.fechaCreacion?.slice(0, 16) + " "}
                  {choferMaster?.fechaCreacion?.slice(-2).toLowerCase()}
                </Detalle3OutPut>
              </Detalle1Wrap>

              {choferMaster?.isAyudante ? (
                <Detalle1Wrap>
                  <Detalle2Titulo>Chofer:</Detalle2Titulo>

                  <Detalle3OutPut>
                    {choferMaster?.jefeChofer?.nombre == "" ? (
                      "Sin especificar"
                    ) : (
                      <Enlaces
                        target="_blank"
                        to={`/transportes/maestros/choferes/${choferMaster?.jefeChofer?.numeroDoc}`}
                      >
                        {choferMaster?.jefeChofer?.nombre +
                          " " +
                          choferMaster?.jefeChofer?.apellido}
                      </Enlaces>
                    )}
                  </Detalle3OutPut>
                </Detalle1Wrap>
              ) : (
                <>
                  <Detalle1Wrap>
                    <Detalle2Titulo>Ayudante:</Detalle2Titulo>

                    {modoEdicion == false ? (
                      <Detalle3OutPut>
                        {choferMaster?.ayudante?.nombre == "" ? (
                          "Sin ayudante"
                        ) : (
                          <Enlaces
                            target="_blank"
                            to={`/transportes/maestros/choferes/${choferMaster?.ayudante?.numeroDoc}`}
                          >
                            {choferMaster?.ayudante?.nombre +
                              " " +
                              choferMaster?.ayudante?.apellido}
                          </Enlaces>
                        )}
                      </Detalle3OutPut>
                    ) : (
                      <Detalle3OutPut>
                        <DesplegableSimple
                          name="ayudante"
                          value={
                            choferMaster?.ayudante?.nombre +
                            " " +
                            choferMaster?.ayudante?.apellido
                          }
                          // value={choferMaster.ayudante.id}
                          onChange={(e) => {
                            handleInput(e);
                          }}
                          className={`celda
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                        >
                          <Opciones
                            className={
                              Theme.config.modoClear ? "clearModern" : ""
                            }
                            value={"ninguno"}
                          >
                            Ninguno
                          </Opciones>
                          {dbAyudantes.map((ayudante, index) => {
                            return (
                              <Opciones
                                key={index}
                                value={
                                  ayudante.nombre + " " + ayudante.apellido
                                }
                                className={
                                  Theme.config.modoClear ? "clearModern" : ""
                                }
                                // value={ayudante.id}
                                // selected={choferMaster.id == ayudante.id}
                              >
                                {ayudante.nombre + " " + ayudante.apellido}
                                {/* {ayudante.id} */}
                                {/* {ayudante.id} */}
                              </Opciones>
                            );
                          })}
                        </DesplegableSimple>
                      </Detalle3OutPut>
                    )}
                  </Detalle1Wrap>
                </>
              )}
              <Detalle1Wrap>
                <Detalle2Titulo>Solicitud current:</Detalle2Titulo>
                <Detalle3OutPut>
                  <Enlaces
                    target="_blank"
                    to={`/transportes/maestros/solicitudes/${choferMaster.current.solicitud?.numeroDoc}`}
                  >
                    {choferMaster.current.solicitud?.numeroDoc}
                  </Enlaces>
                </Detalle3OutPut>
              </Detalle1Wrap>
              {choferMaster.current?.solicitudesAdicionales?.length > 0 &&
                choferMaster.current.solicitudesAdicionales.map(
                  (req, index) => {
                    return (
                      <Detalle1Wrap key={index}>
                        <Detalle2Titulo>
                          Solicitud N° {index + 2}:
                        </Detalle2Titulo>
                        <Detalle3OutPut>
                          <Enlaces
                            target="_blank"
                            to={`/transportes/maestros/solicitudes/${req?.numeroDoc}`}
                          >
                            {req?.numeroDoc}
                          </Enlaces>
                        </Detalle3OutPut>
                      </Detalle1Wrap>
                    );
                  }
                )}
            </CajaDetalles>
            <CajaDetalles
              className={`cajaDerecha cajaStatus clearModern
              ${Theme.config.modoClear ? "clearModern" : ""}
              `}
            >
              <CajaEditando className={modoEdicion ? "editando" : ""}>
                {modoEdicion && (
                  <TituloEditando>
                    Editando... <Icono icon={faPenToSquare} />{" "}
                  </TituloEditando>
                )}
              </CajaEditando>
              <WrapPerfil>
                <CajaSuperirorIzq>
                  <CajaInternaChofer>
                    {!modoEdicion && (
                      <FotoMain
                        className={
                          choferMaster.estadoDoc == 3 ? "inactivo" : ""
                        }
                        src={choferMaster.urlFotoPerfil || avatarMale}
                      />
                    )}

                    {modoEdicion && (
                      <SeccionFotoPerfil>
                        <CajaFotoPerfil>
                          <FotoMain src={urlLocalFotoPerfil} />
                          {modoEdicion && (
                            <>
                              <CajaIcono>
                                <IconoFoto
                                  onClick={clickFromIcon}
                                  icon={faCloudArrowUp}
                                  title="Cargar foto de perfil"
                                />
                                {/* <Parrafo className="fotoPerfil">
                                  Foto de perfil
                                </Parrafo> */}
                              </CajaIcono>
                              <Input
                                type="file"
                                ref={inputRef}
                                accept="image/*"
                                onChange={handleFile}
                                className="none"
                              />
                            </>
                          )}
                        </CajaFotoPerfil>
                      </SeccionFotoPerfil>
                    )}
                    {modoEdicion ? (
                      <CajaInputEdicionNombre>
                        <InputSimple
                          name="nombre"
                          value={choferMaster.nombre}
                          onChange={(e) => handleInput(e)}
                          placeholder="Nombre"
                        />
                        <InputSimple
                          name="apellido"
                          value={choferMaster.apellido}
                          onChange={(e) => handleInput(e)}
                          placeholder="Apellido"
                        />
                      </CajaInputEdicionNombre>
                    ) : (
                      <NombreTexto className="nombreMain">
                        {choferMaster.nombre + " "}
                        {choferMaster.apellido}
                      </NombreTexto>
                    )}
                  </CajaInternaChofer>

                  <CajaInternaChofer className="derecha">
                    <TituloPuntuacion>Ult. 3 meses</TituloPuntuacion>
                    <Detalle1Wrap className="vertical">
                      <TituloDetalle className="vertical">
                        PP cliente:
                      </TituloDetalle>
                      <DetalleTexto className="vertical">
                        <ImgSimple
                          className={`star ${choferMaster.estadoDoc == 3 ? " inactivo " : ""} `}
                          src={ImgStar}
                        />
                      </DetalleTexto>
                    </Detalle1Wrap>
                    <Detalle1Wrap className="vertical">
                      <TituloDetalle className="vertical">
                        PP solicitante:
                      </TituloDetalle>
                      <DetalleTexto className="vertical">
                        <ImgSimple
                          className={`star ${choferMaster.estadoDoc == 3 ? " inactivo " : ""} `}
                          src={ImgStar}
                        />
                      </DetalleTexto>
                    </Detalle1Wrap>
                    <Detalle1Wrap className="vertical">
                      <TituloDetalle className="vertical">
                        Qty viajes promedio:
                      </TituloDetalle>
                      <DetalleTexto className="vertical">...</DetalleTexto>
                    </Detalle1Wrap>
                  </CajaInternaChofer>
                </CajaSuperirorIzq>
                <CajaInferiorIzq className="">
                  <CajitaTextoStatus
                    className={
                      choferMaster.estadoDoc == 0
                        ? "off"
                        : choferMaster.estadoDoc == 1
                          ? "disponible"
                          : choferMaster.estadoDoc == 2
                            ? "ejecucion"
                            : choferMaster.estadoDoc == 3
                              ? "inactivo"
                              : ""
                    }
                  >
                    <TextoStatus>
                      {choferMaster.estadoDoc == 0
                        ? "OFF"
                        : choferMaster.estadoDoc == 1
                          ? "Disponible"
                          : choferMaster.estadoDoc == 2
                            ? "Ejecucion"
                            : choferMaster.estadoDoc == 3
                              ? "Inactivo"
                              : ""}
                    </TextoStatus>
                  </CajitaTextoStatus>
                </CajaInferiorIzq>
              </WrapPerfil>
            </CajaDetalles>
          </Seccion>
          <ControlesDoc
            titulo={"Detalles chofer:"}
            controles={controles}
            tipo="chofer"
            handleControles={handleControles}
          />
          {choferMaster?.isAyudante ? (
            <TituloAyudante>Ayudante</TituloAyudante>
          ) : (
            <>
              <TituloModulo>Datos vehiculo:</TituloModulo>

              <Seccion className="horizontal">
                <CajaInternaFlete
                  className={`
                  izquierda
                  ${Theme.config.modoClear ? "clearModern" : ""}
                  `}
                >
                  <ImgSimple src={choferMaster.unidadVehicular.urlFoto} />
                  <TextoCamion>
                    {choferMaster.unidadVehicular.descripcion}
                  </TextoCamion>
                </CajaInternaFlete>
                <CajaInternaFlete
                  className={`
                      derecha
                      ${Theme.config.modoClear ? "clearModern" : ""}
                      `}
                >
                  <Detalle1Wrap>
                    <Detalle2Titulo>Tipo:</Detalle2Titulo>
                    {modoEdicion == false ? (
                      <Detalle3OutPut>
                        {choferMaster.tipo == 0
                          ? "Interno"
                          : choferMaster.tipo == 1
                            ? "Externo independiente"
                            : choferMaster.tipo == 2
                              ? "Externo Empresa"
                              : ""}
                      </Detalle3OutPut>
                    ) : (
                      <Detalle3OutPut>
                        <DesplegableSimple
                          value={choferMaster.tipo}
                          name="tipo"
                          onChange={(e) => {
                            handleInput(e);
                          }}
                          className={`celda
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                        >
                          <Opciones
                            className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                            value={0}
                          >
                            Interno
                          </Opciones>
                          <Opciones
                            className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                            value={1}
                          >
                            Externo Independiente
                          </Opciones>
                          <Opciones
                            className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                            value={2}
                          >
                            Externo Empresa
                          </Opciones>
                        </DesplegableSimple>
                      </Detalle3OutPut>
                    )}
                  </Detalle1Wrap>
                  <Detalle1Wrap>
                    <Detalle2Titulo>Renglon:</Detalle2Titulo>

                    {modoEdicion == false ? (
                      <Detalle3OutPut className="completo">
                        {choferMaster.unidadVehicular.descripcion}
                      </Detalle3OutPut>
                    ) : (
                      <Detalle3OutPut>
                        <DesplegableSimple
                          value={choferMaster.unidadVehicular.descripcion}
                          name="renglonVehiculo"
                          onChange={(e) => {
                            handleInput(e);
                          }}
                          className={`celda
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                        >
                          {vehiculosSchema.map((vehi, index) => {
                            return (
                              <Opciones
                                className={`
                              ${Theme.config.modoClear ? "clearModern" : ""}
                              `}
                                key={index}
                                value={vehi.descripcion}
                              >
                                {vehi.descripcion}
                              </Opciones>
                            );
                          })}
                        </DesplegableSimple>
                      </Detalle3OutPut>
                    )}
                  </Detalle1Wrap>

                  <Detalle1Wrap>
                    <Detalle2Titulo>Placa:</Detalle2Titulo>
                    <Detalle3OutPut>
                      {modoEdicion == false ? (
                        choferMaster.unidadVehicular.placa
                      ) : (
                        <InputSimple
                          className={`celda
                        ${Theme.config.modoClear ? " clearModern " : ""}
                        `}
                          value={choferMaster?.unidadVehicular.placa}
                          name="placa"
                          onChange={(e) => handleInput(e)}
                        />
                      )}
                    </Detalle3OutPut>
                  </Detalle1Wrap>
                </CajaInternaFlete>
              </Seccion>
            </>
          )}

          <Alerta
            estadoAlerta={dispatchAlerta}
            tipo={tipoAlerta}
            mensaje={mensajeAlerta}
          />
          {isLoading ? <ModalLoading completa={true} /> : ""}
        </>
      )}
    </>
  );
};

const Seccion = styled.div`
  width: 100%;
  min-height: 40px;

  margin: 10px 0;
  gap: 10px;
  padding: 0 15px;
  color: ${Tema.secondary.azulOpaco};
  margin-bottom: 25px;
  &.horizontal {
    display: flex;
    justify-content: start;
  }
`;

const CajaDetalles = styled.div`
  width: 46%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;

  &.cajaStatus {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 0;
  }
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
  border: 1px solid white;
`;
const TextoStatus = styled.h2`
  text-align: center;
  /* padding: 10px; */
`;

const CajaInternaChofer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 50%;
  &.derecha {
    justify-content: start;
  }
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

const NombreTexto = styled.h2`
  text-align: center;
  color: ${Tema.neutral.blancoHueso};
  color: white;
  font-weight: 400;
  &.status {
    color: inherit;
  }
  &.titulo {
    font-size: 1rem;
    margin-bottom: 5px;
    text-decoration: underline;
  }
  &.nombreMain {
    font-size: 1.1rem;
  }
`;

const TituloDetalle = styled.p`
  width: 49%;
  color: inherit;
  text-align: start;
  &.negativo {
    color: ${Tema.complementary.danger};
  }
  &.docCerrado {
    color: inherit;
  }
  &.vertical {
    width: 100%;
    text-align: start;
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
  &.vertical {
    width: 100%;
    text-align: start;
  }
  &.completo {
    white-space: normal;
    overflow: visible;
    text-overflow: initial;
    width: 100%;
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  justify-content: space-between;
  &.vertical {
    flex-direction: column;
    width: 100%;
  }
`;

const CajaInternaFlete = styled.div`
  width: 49%;
  overflow: hidden;
  text-align: center;

  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};

  &.izquierda {
    width: 40%;
  }
  &.derecha {
    width: 52%;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(4px);
    color: white;
    border: 1px solid white;
  }
`;

const ImgSimple = styled.img`
  width: 100%;
  &.star {
    width: auto;
    height: 20px;
    &.inactivo {
      filter: grayscale(1);
    }
  }
`;
const TextoCamion = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  color: white;
`;
const Titulo = styled.h2`
  font-size: 1%.4;
  text-decoration: underline;
  color: white;
`;
const TituloModulo = styled(Titulo)`
  margin-top: 15px;
  margin-left: 15px;
  color: ${Tema.primary.azulBrillante};
  color: white;
`;
const CajaSuperirorIzq = styled.div`
  display: flex;
  padding: 4px;
  width: 100%;
`;

const CajitaTextoStatus = styled.div`
  width: 100%;

  &.off {
    background-color: gray;
    color: ${Tema.neutral.neutral700};
  }
  &.disponible {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.ejecucion {
    background-color: ${Tema.complementary.azulStatic};
    color: white;
  }
  &.inactivo {
    background-color: ${Tema.neutral.neutral700};
    color: #000;
  }
`;

const CajaInferiorIzq = styled.div`
  /* height: 20%; */
  height: 30px;

  display: flex;
  /* position: absolute; */
  width: 100%;
`;
const InputSimple = styled(InputSimpleEditable)`
  /* height: 20px; */
  /* border: none; */
  border: 1px solid gray;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
const DesplegableSimple = styled(MenuDesplegable)`
  padding: 0;
  /* height: 35px; */
`;
const TituloPuntuacion = styled.h3`
  color: ${Tema.secondary.azulOpaco};
  color: white;
  text-decoration: underline;
  font-weight: lighter;
  font-size: 1rem;
`;
const WrapPerfil = styled.div`
  height: 90%;
  width: 100%;
`;
const CajaEditando = styled.div`
  width: 100%;
  height: 30px;
  /* height: 15%; */
  text-align: center;
  color: ${Tema.primary.azulBrillante};
  font-size: 0.8rem;
  &.editando {
    background-color: ${Tema.primary.grisNatural};
  }
`;
const TituloEditando = styled.h2``;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const TituloAyudante = styled.h2`
  text-align: center;
  align-content: center;
  color: ${Tema.secondary.azulOpaco};
  font-size: 2rem;
  height: 60px;
  text-decoration: underline;
`;
const CajaInputEdicionNombre = styled.div``;
const CajaIcono = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
`;

const IconoFoto = styled(FontAwesomeIcon)`
  font-size: 1rem;
  border: 1px solid ${Tema.primary.azulBrillante};
  padding: 4px;
  cursor: pointer;
  transition: ease all 0.2s;
  background-color: ${Tema.primary.grisNatural};
  &:hover {
    border-radius: 4px;
    color: ${Tema.primary.azulBrillante};
  }
`;
const Parrafo = styled.p`
  width: 100%;
  &.danger {
    color: red;
  }
  &.fotoPerfil {
    color: ${Tema.complementary.warning};
    background-color: ${Tema.primary.grisNatural};
    /* padding: 1px; */
    text-decoration: underline;
  }
`;
const Input = styled.input`
  height: 30px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid ${Tema.primary.azulBrillante};
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  padding: 10px;
  width: 100%;
  &.none {
    display: none;
  }

  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  @media screen and (max-width: 360px) {
    width: 90%;
  }
`;

const SeccionFotoPerfil = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin-bottom: 15px;
`;
const CajaFotoPerfil = styled.div`
  position: relative;
`;
const FotoPerfil = styled.img`
  border-radius: 50%;
  border: 4px solid ${Tema.primary.azulBrillante};
  height: 200px;
  width: 200px;
  object-fit: contain;
`;
