import { useEffect, useRef, useState } from "react";
import { Header } from "../components/Header.jsx";
import avatarMale from "./../../public/img/avatares/avatarMale.png";
import avatarFemale from "./../../public/img/avatares/avatarFemale.png";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../config/theme.jsx";
import { BtnGeneralButton } from "../components/BtnGeneralButton.jsx";
import { getAuth, sendEmailVerification, signOut } from "firebase/auth";
import db, { autenticar } from "../firebase/firebaseConfig.js";
import { useNavigate } from "react-router-dom";
import { Alerta } from "../components/Alerta.jsx";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import { ModalLoading } from "../components/ModalLoading.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import { faCloudArrowUp, faXmark } from "@fortawesome/free-solid-svg-icons";
import { faFloppyDisk } from "@fortawesome/free-regular-svg-icons";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { BotonQuery } from "../components/BotonQuery.jsx";
import { AvisoTop } from "../components/Avisos/AvisoTop.jsx";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../components/InputGeneral.jsx";
import {
  Departamentos,
  SucursalesOficial,
} from "../components/corporativo/Corporativo.js";
import { AvatarPerfil } from "../components/JSXElements/ImgJSX.jsx";
import { OpcionUnica } from "../components/OpcionUnica.jsx";
import { UserSchema } from "../models/AuthSchema.js";
import { soloNumeros } from "../libs/StringParsed.jsx";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../components/JSXElements/GrupoDetalle.jsx";
import MenuPestannias from "../components/MenuPestannias.jsx";
import { CajaTablaGroup } from "../components/JSXElements/GrupoTabla.jsx";
import {
  fetchDocsByConditionGetDocs,
  useDocById,
} from "../libs/useDocByCondition.js";
import {
  EnlaceRRSS,
  EnlacesPerfil,
} from "../components/JSXElements/Enlace.jsx";
import { generaLinkWA } from "../libs/modern.js";
import {
  BellLetter,
  ConfigLetter,
  LikeLetter,
} from "../components/JSXElements/OneLetter.jsx";
import { CajaSlider } from "../components/JSXElements/CajaSlider.jsx";
import { diccionarioTipo } from "../models/notificacionesLocalSchema.js";
import { hoyManniana } from "../libs/FechaFormat.jsx";
import TextoEptyG from "../components/TextoEptyG.jsx";
import ModalGeneral from "../components/ModalGeneral.jsx";

export const MiPerfil = ({ userMaster }) => {
  useEffect(() => {
    document.title = "Caeloss - Perfil";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  // // ******************** RECURSOS GENERALES ******************** //
  const navegacion = useNavigate();
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const storage = getStorage();

  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  auth.languageCode = "es";
  const usuario = auth.currentUser;
  // Si el usuario no esta logueado que valle a acceder, esto es necesario que se coloque en este componeente, para que funcione correctamente con la parte de confirmar correo

  // ******************** MANEHANDO LOS INPUTS ******************** //
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name == "sucursal") {
      const sucursalSeleccionada = SucursalesOficial.find(
        (suc) => suc.descripcion == value
      );

      setUserEditable({
        ...userEditable,
        localidad: {
          nombreSucursal: sucursalSeleccionada.descripcion,
          codigoInterno: sucursalSeleccionada.codigoInterno,
          masDatosSuc: sucursalSeleccionada,
        },
      });
      return;
    } else if (name == "flota") {
      const esNumero = soloNumeros(value);
      //
      if (esNumero) {
        setUserEditable((prevEstado) => ({
          ...prevEstado,
          flota: value,
        }));
      } else {
        setMensajeAlerta("Solo acepta numeros.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
      //
    } else {
      setUserEditable((prevEstado) => ({
        ...prevEstado,
        [name]: value,
      }));
    }
  };

  // // ******************** EDITAR ******************** //
  const [userEditable, setUserEditable] = useState();
  const [isEditando, setIsEditando] = useState(false);
  const editar = () => {
    setIsEditando(true);
    setUserEditable(
      userMaster
        ? {
            ...UserSchema,
            ...userMaster,
          }
        : {}
    );
  };

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
      const auxFotoPerfil = userMaster?.urlFotoPerfil
        ? userMaster?.urlFotoPerfil
        : userMaster.genero == "masculino"
          ? avatarMale
          : userMaster.genero == "femenino"
            ? avatarFemale
            : "";
      setUrlLocalFotoPerfil(auxFotoPerfil);
      setFotoPerfilInitial(auxFotoPerfil);
    }
  }, [userMaster]);

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUrlLocalFotoPerfil(imgUrl);
      setFileFotoPerfil(file);
    }
  };

  const camposLLenos = (usuario) => {
    if (
      usuario?.nombre == "" ||
      usuario?.apellido == "" ||
      usuario?.dpto == "" ||
      usuario?.posicion == "" ||
      usuario?.localidad.nombreSucursal == "" ||
      usuario?.flota == ""
    ) {
      console.log("as");
      return false;
    }
    return true;
  };
  // // ******************** GUARDAR CAMBIOS ******************** //
  const guardarCambios = async () => {
    if (!camposLLenos(userEditable)) {
      setMensajeAlerta("Completar todos los campos obligatorios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // Verifica los campos obligatorios

    // Cargar foto de perfil
    const nombreFoto = "avatars/fotoPerfil" + userMaster.userName;
    const storageRefFoto = ref(storage, nombreFoto);

    const genero = opcionGenero.find((opcion) => opcion.select);
    if (!genero) {
      setMensajeAlerta("Indicar genero.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const userEnviar = {
      ...userEditable,
      genero: genero.code,
    };
    // Esto es lo normal que el userMaster exista
    if (userMaster) {
      console.log(userMaster);
      const usuarioActualizar = doc(db, "usuarios", userMaster.id);
      setIsLoading(true);
      // return

      try {
        // Primero actualiza los valores mas importantes
        await updateDoc(usuarioActualizar, userEnviar);
        // Ahora sube la foto de perfil solamente si el usuario la cargo

        if (fileFotoPerfil) {
          await uploadBytes(storageRefFoto, fileFotoPerfil).then(() => {});
          // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
          getDownloadURL(ref(storage, storageRefFoto)).then((url) =>
            updateDoc(usuarioActualizar, {
              urlFotoPerfil: url,
            })
          );
          setIsLoading(false);
        }
        setMensajeAlerta("Usuario actualizado correctamente.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
        setIsLoading(false);
      } catch (error) {
        console.log(error);
        console.error("Error con la base de datos");
        setIsLoading(false);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
    }
    // Esto no deberia ejecutarse pero se debe colocar, dado que al momento de registrar el usuario Caeloss realiza dos peticiones a la base de datos:
    // 1-Crear usuario an Auth
    // 2-Crear el usuario en la base de datos
    //
    // Aunque lo veo dificil es posible que se cumpla la primera y la segunda no, para esos posibles casos tenemos este else if()
    else if (!userMaster) {
      setIsLoading(true);
      try {
        addDoc(collection(db, "usuarios"), userEnviar);
      } catch (error) {
        console.log(error);
        setIsLoading(false);
        setMensajeAlerta("Error con la base de datos");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
    }

    setIsEditando(false);
  };

  // // ******************** CONFIRMAR EMAIL ******************** //
  const confirmarEmail = () => {
    var actionCodeSettings = { url: "https://caeloss.com" };
    sendEmailVerification(usuario, actionCodeSettings)
      .then(function () {
        setMensajeAlerta("Email enviado.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      })
      .catch(function (error) {
        console.log(error);
        setMensajeAlerta("Error con la base de datos.");
        setTipoAlerta("error");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      });
  };
  const cerrarSesion = async () => {
    try {
      await signOut(autenticar);
      navegacion("/");
      window.location.href = window.location.href;
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error al cerrar sesion.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  // useEffect(() => {
  //   console.log(userEditable);
  // }, []);

  const [datosIncompletos, setDatosIncompletos] = useState(false);
  useEffect(() => {
    if (!camposLLenos(userMaster)) {
      setDatosIncompletos(true);
    } else {
      setDatosIncompletos(false);
    }
  }, [userMaster]);
  const [departamentoAux, setDepartamentoAux] = useState("");
  const handleInputDepartamento = (e) => {
    // setDepartamentoAux(e.target.value);
    setUserEditable({
      ...userEditable,
      dpto: e.target.value,
    });
  };
  const dptoParsed = Departamentos.map((dpto) => {
    return {
      ...dpto,
      descripcion: dpto.nombre,
    };
  });

  const cancelarEdicion = () => {
    setIsEditando(false);
    setUrlLocalFotoPerfil(fotoPerfilInitial);
    setFileFotoPerfil(null);
  };

  const [opcionGenero, setOpcionGenero] = useState([
    {
      nombre: "Masculino",
      select: false,
      code: "masculino",
    },
    {
      nombre: "Femenino",
      select: false,
      code: "femenino",
    },
  ]);
  useEffect(() => {
    console.log(userMaster);
    if (userMaster?.genero == "masculino") {
      setOpcionGenero(
        opcionGenero.map((opcion) => {
          return {
            ...opcion,
            select: opcion.code == userMaster.genero,
          };
        })
      );
    }
  }, [userMaster]);
  const handleGenero = (e) => {
    const indexDataset = e.target.dataset.id;
    setOpcionGenero(
      opcionGenero.map((opcion, index) => {
        return {
          ...opcion,
          select: index == indexDataset,
        };
      })
    );
  };

  // ***************** LISTA DE USUARIOS *****************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Mi dpto.",
      code: "dpto",
      select: true,
    },
    {
      nombre: "Mi sucursal",
      code: "sucursal",
      select: false,
    },
    {
      nombre: "General",
      code: "general",
      select: false,
    },
  ]);

  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  const [dbUsuarios, setDBUsuarios] = useState([]);
  const [dbUsuariosInitial, setDBUsuariosInitial] = useState([]);

  useEffect(() => {
    if (userMaster) {
      const selectPest = arrayOpciones.find((opcion) => opcion.select);

      if (selectPest.code == "dpto") {
        (async () => {
          console.log(userMaster);
          const userMiptoAux = await fetchDocsByConditionGetDocs(
            "usuarios",
            undefined,
            "dpto",
            "==",
            userMaster.dpto
          );
          const datosAux = userMiptoAux.filter(
            (user) =>
              user.localidad.codigoInterno == userMaster.localidad.codigoInterno
          );
          setDBUsuarios(datosAux);
          setDBUsuariosInitial(datosAux);
        })();
      } else if (selectPest.code == "sucursal") {
        console.log("✅✅✅✅✅✅");
        (async () => {
          const userMiptoAux = await fetchDocsByConditionGetDocs(
            "usuarios",
            undefined,
            "localidad.codigoInterno",
            "==",
            userMaster.localidad.codigoInterno
          );
          console.log(userMiptoAux);
          setDBUsuarios(userMiptoAux);
          setDBUsuariosInitial(userMiptoAux);
        })();
      } else if (selectPest.code == "general") {
        (async () => {
          const userMiptoAux = await fetchDocsByConditionGetDocs(
            "usuarios",
            undefined
          );
          console.log(userMiptoAux);
          setDBUsuarios(userMiptoAux);
          setDBUsuariosInitial(userMiptoAux);
        })();
      }
    }
  }, [userMaster, arrayOpciones]);

  const copiarPortaPapeles = (texto) => {
    navigator.clipboard.writeText(texto);
    setDispatchAlerta;

    setMensajeAlerta("Correo copiado.");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };

  const [valueSearch, setValueSearch] = useState("");
  const handleBuscar = (e) => {
    const value = e.target.value.toLowerCase();
    setValueSearch(e.target.value);

    const nuevoArray = dbUsuariosInitial.filter((user) => {
      let incluir = false;
      const nombreCompleto = user.nombre + " " + user.apellido;

      if (nombreCompleto.toLowerCase().includes(value)) {
        console.log(111);
        incluir = true;
      }
      if (user.correo.toLowerCase().includes(value)) {
        console.log(222);
        incluir = true;
      }
      if (user.extension?.toLowerCase().includes(value)) {
        console.log(333);
        incluir = true;
      }
      if (user.posicion?.toLowerCase().includes(value)) {
        console.log(333);
        incluir = true;
      }

      if (incluir) {
        return user;
      }
    });
    console.log(nuevoArray);
    setDBUsuarios(nuevoArray);
    //
    //
    //
    //
  };

  // *******************  NOTIFICACIONES ********************
  const [sliderReminder, setSliderReminder] = useState(false);
  const abrirReview = async (reminder) => {
    try {
      const docActualizar = doc(db, "notificacionesLocal", reminder.id);
      await updateDoc(docActualizar, {
        estadoDoc: 1,
      });
      window.open(reminder.enlace, "_blank");
    } catch (error) {
      console.error(error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // *******************  Like mi perfil ********************
  const [hasModalMiLike, setHasMoldalMiLike] = useState(false);
  const [likeToPerfilDBPADRE, setLikeToPerfilDBPADRE] = useState([]);
  useDocById("miscelaneo", setLikeToPerfilDBPADRE, "profileParallel");
  const [misLikes, setMisLikes] = useState([]);

  useEffect(() => {
    console.log(likeToPerfilDBPADRE);
    if (userMaster?.id && likeToPerfilDBPADRE?.likeArray?.length > 0) {
      const likeFind = likeToPerfilDBPADRE.likeArray.filter(
        (like) => like?.usuarioDestino?.id == userMaster.id
      );

      if (likeFind) {
        setMisLikes(likeFind);
      } else {
        setMisLikes([]);
      }
    }
  }, [likeToPerfilDBPADRE, userMaster]);
  const mostrarUserLike = () => {
    if (misLikes.length == 0) {
      setIsLoading(false);
      setMensajeAlerta("Tu perfil aun no posee me gusta.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setHasMoldalMiLike(true);
  };
  return (
    userMaster && (
      <>
        <Header titulo={"Mi Perfil"} />
        <BotonQuery userEditable={userEditable} userMaster={userMaster} />
        {datosIncompletos && usuario.emailVerified ? (
          <AvisoTop
            mensaje={"Los campos obligatorios están marcados en rojo."}
          />
        ) : null}

        {usuario?.emailVerified && (
          <CajaPerfil>
            <CajaEncabezado>
              <CajaDetalles className="izq">
                <div>
                  <Detalle1Wrap2
                    className={userMaster?.nombre == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Nombre:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>{userMaster?.nombre}</Detalle3OutPut>
                    ) : (
                      <InputEdit
                        type="text"
                        value={userEditable?.nombre}
                        name="nombre"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={userMaster?.apellido == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Apellido:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>{userMaster?.apellido}</Detalle3OutPut>
                    ) : (
                      <InputEdit
                        type="text"
                        value={userEditable?.apellido}
                        name="apellido"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={userMaster?.genero == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Genero:</Detalle2Titulo>
                    {isEditando == false ? (
                      <Detalle3OutPut>
                        {userMaster?.genero == "femenino"
                          ? "Femenino"
                          : "Masculino"}
                      </Detalle3OutPut>
                    ) : (
                      <OpcionUnica
                        arrayOpciones={opcionGenero}
                        handleOpciones={handleGenero}
                        name="genero"
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={
                      userMaster?.localidad.nombreSucursal == "" ? "danger" : ""
                    }
                  >
                    <Detalle2Titulo>Sucursal:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>
                        {userMaster?.localidad.nombreSucursal}
                      </Detalle3OutPut>
                    ) : (
                      <MenuDesp
                        onChange={(e) => handleInput(e)}
                        name="sucursal"
                        className="clearModern"
                        autoComplete="off"
                        value={userEditable.localidad?.nombreSucursal}
                      >
                        {SucursalesOficial.map((opc, index) => {
                          return (
                            <Opciones
                              key={index}
                              value={opc.descripcion}
                              disabled={opc.disabled}
                            >
                              {opc.descripcion}
                            </Opciones>
                          );
                        })}
                      </MenuDesp>
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={userMaster?.dpto == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Departamento:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>{userMaster?.dpto}</Detalle3OutPut>
                    ) : (
                      <MenuDesp
                        value={userEditable.dpto}
                        name="dpto"
                        className={`
                        ${userEditable.dpto == "" ? "obligatorio" : ""}
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                        autoComplete="off"
                        onChange={(e) => {
                          handleInputDepartamento(e);
                        }}
                        placeholder="Departamento"
                      >
                        <Opciones
                          className={`
                            ${Theme.config.modoClear ? "clearModern" : ""}
                            `}
                        >
                          Seleccione dpto.
                        </Opciones>
                        ;
                        {dptoParsed.map((dpto, index) => {
                          return (
                            <Opciones
                              className={`
                            ${Theme.config.modoClear ? "clearModern" : ""}
                            `}
                              key={index}
                              value={dpto.descripcion}
                            >
                              {dpto.descripcion}
                            </Opciones>
                          );
                        })}
                      </MenuDesp>
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={userMaster?.posicion == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Posicion:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut title={userMaster?.posicion}>
                        {userMaster?.posicion}
                      </Detalle3OutPut>
                    ) : (
                      <InputEdit
                        type="text"
                        value={userEditable?.posicion}
                        name="posicion"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2
                    className={userMaster?.flota == "" ? "danger" : ""}
                  >
                    <Detalle2Titulo>Flota:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>{userMaster?.flota}</Detalle3OutPut>
                    ) : (
                      <InputEdit
                        type="text"
                        value={userEditable?.flota}
                        name="flota"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2 className="altoAuto">
                    <Detalle2Titulo>Extension:</Detalle2Titulo>

                    {isEditando == false ? (
                      <Detalle3OutPut>{userMaster?.extension}</Detalle3OutPut>
                    ) : (
                      <InputEdit
                        type="text"
                        value={userEditable?.extension}
                        name="extension"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </Detalle1Wrap2>
                  <Detalle1Wrap2 className="altoAuto">
                    <Detalle2Titulo>Username:</Detalle2Titulo>
                    <Detalle3OutPut title={userMaster?.userName}>
                      {userMaster?.userName}
                    </Detalle3OutPut>
                  </Detalle1Wrap2>
                  <Detalle1Wrap2 className="altoAuto">
                    <Detalle2Titulo>Correo:</Detalle2Titulo>
                    <Detalle3OutPut
                      title={
                        auth.currentUser?.email ? auth.currentUser.email : ""
                      }
                    >
                      {auth.currentUser?.email ? auth.currentUser.email : ""}
                    </Detalle3OutPut>
                  </Detalle1Wrap2>
                </div>
              </CajaDetalles>
              <CajaDetalles className="der">
                <CajaTopPerfil>
                  <CajaItemsTopPerfil
                    title="Notificaciones"
                    onClick={() => setSliderReminder(true)}
                  >
                    <BellLetter
                      qty={
                        userMaster.notificaciones
                          ? userMaster.notificaciones?.length
                          : 0
                      }
                    />
                  </CajaItemsTopPerfil>
                  <CajaItemsTopPerfil title="Configuración">
                    <ConfigLetter
                      qty={
                        userMaster.notificaciones
                          ? userMaster.notificaciones?.length
                          : 0
                      }
                    >
                      {/* {userMaster.notificaciones?.length} */}
                    </ConfigLetter>
                  </CajaItemsTopPerfil>
                  <CajaItemsTopPerfil
                    onClick={() => mostrarUserLike()}
                    title="Reacciones de mi perfil."
                  >
                    <LikeLetter qty={misLikes ? misLikes?.length : 0} />
                  </CajaItemsTopPerfil>
                </CajaTopPerfil>
                <CajaFotoPerfil>
                  <AvatarPerfil
                    className={userMaster?.genero}
                    src={urlLocalFotoPerfil}
                  />
                  {isEditando ? (
                    <>
                      <CajaIcono>
                        <IconoFoto
                          onClick={clickFromIcon}
                          icon={faCloudArrowUp}
                          title="Cargar foto de perfil"
                        />
                        <Parrafo className="fotoPerfil">Foto de perfil</Parrafo>
                      </CajaIcono>
                      <Input
                        type="file"
                        ref={inputRef}
                        accept="image/*"
                        onChange={handleFile}
                        className="none"
                      />
                    </>
                  ) : (
                    ""
                  )}
                </CajaFotoPerfil>

                {isEditando ? (
                  <CajaBtn>
                    <BtnSimple onClick={() => guardarCambios()}>
                      <Icono icon={faFloppyDisk} />
                      Guardar
                    </BtnSimple>
                    <BtnSimple
                      className="cancelar"
                      onClick={() => cancelarEdicion()}
                    >
                      <Icono icon={faXmark} />
                      Cancelar
                    </BtnSimple>
                  </CajaBtn>
                ) : (
                  <CajaBtn>
                    <BtnSimple onClick={() => cerrarSesion()}>
                      {/* <Icono icon={faUserLock} /> */}
                      Cerrar sesion
                    </BtnSimple>
                    <BtnSimple onClick={() => navegacion("/recuperar")}>
                      Contraseña
                    </BtnSimple>

                    <BtnSimple onClick={() => editar()}>
                      {/* <Icono icon={faUserPen} /> */}
                      Editar
                    </BtnSimple>
                  </CajaBtn>
                )}
              </CajaDetalles>
            </CajaEncabezado>
          </CajaPerfil>
        )}
        <MenuPestannias
          handlePestannias={handlePestannias}
          arrayOpciones={arrayOpciones}
        />
        <br />
        <CajaTituloUser>
          <TituloUser>Red interna Cielos Acústicos</TituloUser>
        </CajaTituloUser>
        <ContainerControles>
          <InputBuscar
            onChange={(e) => handleBuscar(e)}
            placeholder="Buscar"
            title="Puedes buscar por Nombre, apellido, flota, extencion..."
            value={valueSearch}
            name={"buscar"}
            className={`
                  ${Theme.config.modoClear ? "clearModern" : ""}
                  `}
            autoComplete="off"
          />
        </ContainerControles>
        <ContainerUsers>
          <CajaTablaGroup2>
            {dbUsuarios.map((user, index) => {
              return (
                <CardPerfil key={index}>
                  <CajaInternaCard className="foto">
                    <EnlacesPerfil2
                      target="_blank"
                      to={`/perfiles/${user.userName}`}
                    >
                      <Avatar2
                        className="xxxSmall"
                        src={
                          user.urlFotoPerfil
                            ? user.urlFotoPerfil
                            : user.genero == "femenino"
                              ? avatarFemale
                              : avatarMale
                        }
                      />
                      <WrapItem>
                        <TituloNombre
                          title={user.nombre + " " + user.apellido}
                          className="center nombre"
                        >
                          {user.nombre + " " + user.apellido}
                        </TituloNombre>
                      </WrapItem>
                    </EnlacesPerfil2>
                  </CajaInternaCard>

                  <CajaInternaCard className="vertical">
                    <WrapItem className="vertical">
                      <TituloNombre className="titulo">Flota:</TituloNombre>
                      <TituloNombre>{user.flota}</TituloNombre>
                    </WrapItem>
                    <WrapItem>
                      <EnlaceRRSS
                        to={generaLinkWA(
                          user.flota,
                          "whatsapp",
                          `Hola ${user.nombre} quisiera que por favor me asistas.`
                        )}
                        className="caja-whatsapp"
                      >
                        WhatsApp
                      </EnlaceRRSS>
                      <EnlaceRRSS
                        to={generaLinkWA(user.flota, "llamada")}
                        className="caja-llamar"
                      >
                        Llamar
                      </EnlaceRRSS>
                    </WrapItem>
                  </CajaInternaCard>
                  <CajaInternaCard className="vertical">
                    <WrapItem className="vertical">
                      <TituloNombre className="titulo">Extension:</TituloNombre>
                      <TituloNombre>{user.extension}</TituloNombre>
                    </WrapItem>
                    <WrapItem className="vertical">
                      <TituloNombre title={user.posicion} className="titulo">
                        Posicion:
                      </TituloNombre>
                      <TituloNombre>{user.posicion}</TituloNombre>
                    </WrapItem>
                  </CajaInternaCard>
                  <CajaInternaCard className="vertical">
                    <WrapItem className="vertical">
                      <TituloNombre className="titulo">Correo:</TituloNombre>
                      <TituloNombre>{user.correo}</TituloNombre>
                    </WrapItem>

                    <WrapItem>
                      <EnlaceRRSS
                        to={generaLinkWA(user.correo, "correo")}
                        className="caja-email"
                      >
                        Correo
                      </EnlaceRRSS>
                      <BotonSencillo
                        onClick={() => copiarPortaPapeles(user.correo)}
                        className="caja-info"
                      >
                        Copiar
                      </BotonSencillo>
                    </WrapItem>
                  </CajaInternaCard>
                  <CajaInternaCard className="vertical">
                    <WrapItem className="vertical">
                      <TituloNombre className="titulo">
                        Departamento:
                      </TituloNombre>
                      <TituloNombre>Ventas</TituloNombre>
                      <TituloNombre className="titulo">Sucursal:</TituloNombre>
                      <TituloNombre>
                        {user.localidad.nombreSucursal}
                      </TituloNombre>
                    </WrapItem>
                  </CajaInternaCard>
                </CardPerfil>
              );
            })}
          </CajaTablaGroup2>
        </ContainerUsers>
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
        <br />
        <br />
        <br />
        {isLoading ? <ModalLoading completa={true} /> : ""}

        <CajaSlider
          onMouseEnter={() => setSliderReminder(true)}
          onMouseLeave={() => setSliderReminder(false)}
          className={sliderReminder ? "abierto" : ""}
        >
          <CajaTituloSlider>
            <TituloSlider>Notificaciones</TituloSlider>
            <Xcerrar onClick={() => setSliderReminder(false)}>❌</Xcerrar>
          </CajaTituloSlider>
          <CajaContenidoReminder>
            {userMaster.notificaciones?.map((reminder, index) => {
              return (
                <CardReminder key={index}>
                  <CajaInternaReminder className="perfil">
                    <EnlacesPerfil2
                      target="_blank"
                      to={`/perfiles/${reminder.usuarioCreador.userName}`}
                    >
                      <Avatar2
                        className="xxxSmall"
                        src={
                          reminder.usuarioCreador.urlFotoPerfil
                            ? reminder.usuarioCreador.urlFotoPerfil
                            : reminder.usuarioCreador.genero == "femenino"
                              ? avatarFemale
                              : avatarMale
                        }
                      />
                      <WrapItem>
                        <TituloNombre
                          title={
                            reminder.usuarioCreador.nombre +
                            " " +
                            reminder.usuarioCreador.apellido
                          }
                          className="center notificaciones"
                        >
                          {reminder.usuarioCreador.nombre +
                            " " +
                            reminder.usuarioCreador.apellido}
                        </TituloNombre>
                      </WrapItem>
                    </EnlacesPerfil2>
                  </CajaInternaReminder>
                  <EnlaceReview onClick={() => abrirReview(reminder)}>
                    <CajaTituloCard>
                      <TituloCard>
                        {" "}
                        {
                          diccionarioTipo.find((dic) => {
                            console.log(reminder);
                            if (dic.code == reminder.tipoDoc) {
                              return dic;
                            }
                          })?.texto
                        }
                      </TituloCard>
                      <FechaCardReminder>
                        {hoyManniana(reminder.createdAt, true)}
                      </FechaCardReminder>
                    </CajaTituloCard>
                    <SteakCard>
                      <TextoSteak>
                        {diccionarioTipo.find(
                          (dic) => dic.code == reminder.tipoDoc
                        )?.texto + reminder.textEnd}
                      </TextoSteak>{" "}
                    </SteakCard>
                  </EnlaceReview>
                </CardReminder>
              );
            })}

            {userMaster.notificaciones.length == 0 && (
              <TextoEptyG texto={" ~ No tienes notificaciones  ~"} />
            )}
          </CajaContenidoReminder>
        </CajaSlider>
        {hasModalMiLike && (
          <ModalGeneral
            setHasModal={setHasMoldalMiLike}
            titulo={"Tu perfil tiene " + misLikes.length + " me gusta"}
          >
            {misLikes.map((like, index) => {
              return (
                <CajaListaUsuariosMiLike key={index}>
                  <CardUserMiLike>
                    <CajaInternaMiLike className="avatar">
                      <EnlacesPerfil2
                        target="_blank"
                        to={`/perfiles/${like.usuarioCreador.userName}`}
                      >
                        <Avatar2
                          className="xSmall"
                          src={like.usuarioCreador.urlFotoPerfil}
                        />
                      </EnlacesPerfil2>
                    </CajaInternaMiLike>
                    <CajaInternaMiLike className="contenido">
                      <NombreMiLike>
                        {like.usuarioCreador.nombre +
                          " " +
                          like.usuarioCreador.apellido}
                      </NombreMiLike>
                      <NombreMiLike className="dpto">
                        {like.usuarioCreador.dpto}
                      </NombreMiLike>
                      <NombreMiLike className="posicion">
                        {like.usuarioCreador.posicion}
                      </NombreMiLike>
                    </CajaInternaMiLike>
                  </CardUserMiLike>
                </CajaListaUsuariosMiLike>
              );
            })}
          </ModalGeneral>
        )}
      </>
    )
  );
};

const CajaPerfil = styled.div`
  padding: 15px;
  /* border: 1px solid red; */
`;

const CajaBtn = styled.div`
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 4px;
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: auto;
  min-width: 4px;
  /* padding: 5px; */
  margin: 0;
  &.cancelar {
    background-color: ${Tema.complementary.danger};
    &:hover {
      color: ${Tema.complementary.danger};
      background-color: white;
    }
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 7px;
`;

const CajaFotoPerfil = styled.div`
  position: relative;
  /* border: 1px solid blue; */
  height: 160px;
`;
const CajaIcono = styled.div`
  position: absolute;
  bottom: 0;
  right: 0;
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
const IconoFoto = styled(FontAwesomeIcon)`
  font-size: 2rem;
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
const MenuDesp = styled(MenuDesplegable)`
  width: 50%;
  font-weight: 400;
`;
const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;
  /* margin-left: 12px; */
  margin-bottom: 5px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
  border: 1px solid white;
  overflow: hidden;
  &.izq {
    width: 60%;
    @media screen and (max-width: 780px) {
      width: 100%;
    }
  }
  &.der {
    padding: 0;
    width: 40%;
    display: flex;
    /* justify-content: center; */
    flex-direction: column;
    align-items: center;
    @media screen and (max-width: 780px) {
      width: 100%;
    }
  }
  @media screen and (max-width: 780px) {
    width: 100%;
  }
  @media screen and (max-width: 550px) {
    width: 90%;
  }

  &.cajaStatus {
    flex-direction: column;
    /* background-color: #000c1c; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width: 650px) {
    width: 90%;
    margin-bottom: 5px;
  }
`;
const CajaBtnEdit = styled.div`
  width: 100%;
  flex-wrap: nowrap;
`;
const CajaEncabezado = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  margin: 10px 0;
  color: ${Tema.secondary.azulOpaco};
  &.negativo {
    color: ${Tema.complementary.danger};
  }

  @media screen and (max-width: 780px) {
    flex-direction: column-reverse;
  }
`;
const InputEdit = styled(InputSimpleEditable)`
  height: 30px;
  border-radius: 0;
  width: 50%;
`;
// ***************** Lista de usuarios *****************
const ContainerUsers = styled.div``;
const CajaTablaGroup2 = styled(CajaTablaGroup)``;

const CajaTituloUser = styled.div`
  width: 100%;
  padding-left: 15px;
  color: white;
`;
const TituloUser = styled.h2`
  font-size: 2rem;
  font-weight: 400;
  text-decoration: underline;
  color: ${ClearTheme.complementary.warning};
  @media screen and (max-width: 550px) {
    font-size: 1.5rem;
  }
`;
const CardPerfil = styled.div`
  width: 100%;
  height: 90px;
  border: 1px solid white;
  display: flex;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 4px;
  @media screen and (max-width: 1100px) {
    display: flex;
    flex-wrap: wrap;
    height: auto;
  }
`;
const CajaInternaCard = styled.div`
  display: flex;
  justify-content: start;
  padding: 4px;
  gap: 4px;

  width: 100%;
  max-width: 180px;

  height: 100%;

  border: 1px solid ${ClearTheme.neutral.blancoAzul};
  align-items: center;
  &.foto {
    padding: 0;
    flex-direction: column;
    max-width: 140px;
    @media screen and (max-width: 1100px) {
      width: 100%;
      min-width: 100%;
      base: 100%;
    }
  }
  &.vertical {
    flex-direction: column;
    @media screen and (max-width: 1100px) {
      width: 50%;
      min-width: 50%;
      base: 50%;
    }
  }
`;
const WrapItem = styled.div`
  width: 100%;
  display: flex;
  /* gap: 3px; */
  justify-content: space-between;
  &.vertical {
    flex-direction: column;
  }
`;
const TituloNombre = styled.h2`
  font-size: 1rem;
  font-weight: 400;
  color: white;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  &.titulo {
    text-decoration: underline;
  }

  &.center {
    text-align: center;
    width: 100%;
  }
  &.nombre {
    padding-left: 4px;
  }
  &.notificaciones {
    font-size: 14px;
  }
`;
// const CajaInternaCard=styled.div``
const EnlacesPerfil2 = styled(EnlacesPerfil)`
  justify-content: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  border-radius: 0;

  &:hover {
    img {
      border: 2px solid ${ClearTheme.complementary.warning};
    }
  }
`;

const BotonSencillo = styled.button`
  width: 60px;
  padding: 0 40px;
  font-weight: 400;
  min-height: 30px;
  border: 1px solid white;
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: center;
  cursor: pointer;

  border-radius: 5px;
  background-color: #1c7174;
  &:hover {
    background-color: #29b0b4;
    color: black;
  }
  &:active {
    background-color: #168e92;
    color: black;
  }
`;
const Avatar2 = styled(AvatarPerfil)`
  border: 2px solid transparent;
`;
const Detalle1Wrap2 = styled(Detalle1Wrap)`
  &.obligatorio {
    border: 1px solid red;
  }
  @media screen and (max-width: 400px) {
    flex-direction: row;
    height: auto;
  }
`;
const ContainerControles = styled.div`
  padding: 4px 15px;
`;
const InputBuscar = styled(InputSimpleEditable)`
  height: 35px;
  width: 300px;
`;
const CajaTopPerfil = styled.div`
  /* position: absolute; */
  /* padding: 7px; */
  right: 0;
  border-bottom: 1px solid ${ClearTheme.neutral.neutral400};
  width: 100%;
  height: 50px;
  display: flex;
`;
const CajaItemsTopPerfil = styled.div`
  height: 100%;
  width: 60px;
  /* border: 1px solid red; */
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CajaTituloSlider = styled.div`
  width: 100%;
  position: relative;
  /* border: 1px solid red; */
`;
const TituloSlider = styled.h2`
  color: white;
  width: 100%;
  font-weight: 400;
  font-size: 20px;
  padding: 8px;
`;
const Xcerrar = styled.span`
  position: absolute;
  right: 0;
  /* border: 1px solid white; */
  top: 50%;
  transform: translate(0, -50%);
  width: 35px;
  text-align: center;
  align-content: center;
  height: 100%;
  transition: ease all 0.2s;
  &:hover {
    cursor: pointer;
    background-color: ${ClearTheme.primary.azulOsMi};
  }
`;

const CajaContenidoReminder = styled.div`
  width: 100%;
`;
const CardReminder = styled.div`
  width: 100%;
  height: 75px;
  border: 1px solid white;
  display: flex;
  border-radius: 5px;
  background-color: #0a2447;
`;
const CajaInternaReminder = styled.div`
  height: 100%;
  &.perfil {
    width: 100px;
  }
`;
const EnlaceReview = styled.div`
  height: 100%;
  width: calc(100% - 100px);
  transition: ease all 0.2s;
  &:hover {
    cursor: pointer;
    background-color: #0d3f6b;
  }
`;
const CajaTituloCard = styled.div`
  display: flex;
  justify-content: space-around;
`;
const TituloCard = styled.h3`
  color: ${ClearTheme.complementary.warning};
  text-decoration: underline;
  font-size: 13px;
  font-weight: 400;
  text-align: center;
`;
const FechaCardReminder = styled.span`
  color: white;
  color: ${ClearTheme.neutral.blancoGris};
  font-size: 12px;
`;
const SteakCard = styled.div``;
const TextoSteak = styled.p`
  color: white;
  padding: 0 4px;
  width: 100%;
  /* padding: 7px; */
  font-size: 14px;
  display: -webkit-box;
  -webkit-line-clamp: 2; /* máximo 2 líneas */
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const CajaListaUsuariosMiLike = styled.div`
  /* background-color: red; */
  border: 2px solid black;
  width: 100%;
  /* height: 300px; */
`;
const CardUserMiLike = styled.div`
  height: 100px;
  width: 100%;
  display: flex;
  /* margin-bottom: 6px; */
  //
  border: 1px solid white;
  overflow: hidden;
  border-radius: 6px;
`;
const CajaInternaMiLike = styled.div`
  height: 100%;
  &.avatar {
    width: 100px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;
  }
  &.contenido {
    width: calc(100% - 100px);
    padding: 8px;
  }
`;
const NombreMiLike = styled.p`
  font-size: 20px;
  color: white;
  text-decoration: underline;
  &.dpto {
    font-size: 18px;
    color: ${ClearTheme.neutral.neutral200};
    text-decoration: none;
  }
  &.posicion {
    font-size: 18px;
    color: ${ClearTheme.neutral.neutral200};
    text-decoration: none;
  }
`;
