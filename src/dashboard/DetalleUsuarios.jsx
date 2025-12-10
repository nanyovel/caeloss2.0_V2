import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import avatarMaleViejo from "./../../public/img/avatares/maleAvatar.svg";
import avatarMale from "./../../public/img/avatares/avatarMale.png";
import avatarFemale from "./../../public/img/avatares/avatarFemale.png";
import { ControlesUsuarios } from "./ControlesUsuarios";
import { doc, updateDoc } from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import { Navigate, useNavigate, useParams } from "react-router-dom";
import { getAuth } from "firebase/auth";
import { Alerta } from "../components/Alerta";
import { ModalLoading } from "../components/ModalLoading";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { useDocByCondition } from "../libs/useDocByCondition.js";
import { BotonQuery } from "../components/BotonQuery.jsx";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../components/InputGeneral.jsx";
import {
  Departamentos,
  localidadesAlmacen,
  SucursalesOficial,
} from "../components/corporativo/Corporativo.js";
import { privilegios, roles } from "../context/Permisos.js";
import { BtnGeneralButton } from "../components/BtnGeneralButton.jsx";
import MostrarJSON from "../libs/MostrarJSON.jsx";
import { ClearTheme, Tema } from "../config/theme.jsx";
import { OpcionUnica } from "../components/OpcionUnica.jsx";
import { AvatarPerfil } from "../components/JSXElements/ImgJSX.jsx";
import { UserSchema } from "../models/AuthSchema.js";

export const DetalleUsuarios = ({ userMaster }) => {
  // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // Variables varias necesarias
  const parametro = useParams();
  const docUser = parametro.id;
  const [userDB, setUserDB] = useState({});
  const [userParsed, setUserParsed] = useState(null);

  useDocByCondition("usuarios", setUserDB, "userName", "==", docUser);
  useEffect(() => {
    setUserParsed(userDB[0]);
  }, [userDB, docUser]);

  const [isLoading, setIsLoading] = useState(false);

  const auth = getAuth();
  auth.languageCode = "es";

  // // ******************** ALIMENTAR USERBUSCADO ******************** //

  // ******************** MANEHANDO LOS INPUTS CABECERA ******************** //
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
    } else {
      setUserEditable((prevEstado) => ({
        ...prevEstado,
        [name]: value,
      }));
    }
  };
  const [fotoPerfil, setFotoPerfil] = useState(null);
  const handleFile = (e) => {
    setFotoPerfil(e.target.files[0]);
  };

  // ******************** EDITAR *************************
  const [modoEditar, setModoEditar] = useState(false);
  const [userEditable, setUserEditable] = useState("");

  const editar = (e) => {
    const { name } = e.target;
    if (name == "editar") {
      setModoEditar(true);
      setUserEditable({ ...UserSchema, ...userParsed });
    } else if (name == "cancelar") {
      setUserEditable({});
      setModoEditar(false);
      setPermisosThisUser(initialThisUser);
      //
      // ME QUEDE AQUI, SEGUIR EDITANDO TABLA DE PRIVILEGIOS DE CADA USUARIO
      //
      //
      //
      //
    }
  };
  // ******************** GUARDAR CAMBIOS *************************
  const guardarCambios = async () => {
    const hasPermiso = userMaster.permisos.includes("editarUsuarios");
    if (!hasPermiso) {
      navegacion("/", { replace: true });
      return false;
    }

    const genero = opcionGenero.find((opcion) => opcion.select);
    if (!genero) {
      setMensajeAlerta("indicar genero.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setIsLoading(true);
    // const permisosUp=
    const userEditableAux = {
      ...userEditable,
      genero: genero.code,
    };
    const storage = getStorage();
    const nombreFoto = "avatars/fotoPerfil" + userEditableAux.userName;
    const storageRefFoto = ref(storage, nombreFoto);

    const usuarioActualizar = doc(db, "usuarios", userEditableAux.id);

    try {
      // Primero actualiza los valores mas importantes
      await updateDoc(usuarioActualizar, userEditableAux);
      //Ahora sube la foto de perfil solamente si el usuario la cargo
      if (fotoPerfil) {
        await uploadBytes(storageRefFoto, fotoPerfil).then(() => {});
        // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
        getDownloadURL(ref(storage, storageRefFoto)).then((url) =>
          updateDoc(usuarioActualizar, {
            urlFotoPerfil: url,
          })
        );
        setIsLoading(false);
      }
      setIsLoading(false);
      setMensajeAlerta("Usuario actualizado.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
    setModoEditar(false);
  };

  const dptoParsed = Departamentos.map((dpto) => {
    return {
      ...dpto,
      descripcion: dpto.nombre,
    };
  });

  // const privilegiosGlobal = [...privilegios];
  const rolesGlobal = [...roles];
  const [permisoThisUser, setPermisosThisUser] = useState([]);
  const [initialThisUser, setInitialThisUser] = useState([]);

  useEffect(() => {
    if (userParsed) {
      const auxThisUserPriv = privilegios.map((permiso) => {
        if (userParsed.permisos.includes(permiso.code)) {
          return {
            ...permiso,
            valor: true,
          };
        } else {
          return {
            ...permiso,
            valor: false,
          };
        }
      });
      setInitialThisUser(auxThisUserPriv);
      setPermisosThisUser(auxThisUserPriv);
    } else {
      setPermisosThisUser([...privilegios]);
    }
  }, [userParsed]);

  const handleInputControles = (e) => {
    const { name, value } = e.target;
  };
  const navegacion = useNavigate();
  const handleInputTabla = (e) => {
    const hasPermiso = userMaster.permisos.includes("editarUsuarios");
    if (!hasPermiso) {
      navegacion("/", { replace: true });
      return false;
    }

    const { checked } = e.target;
    const indexDataset = e.target.dataset.index;
    setPermisosThisUser(
      permisoThisUser.map((per, i) => {
        if (i == indexDataset) {
          let newPermiso = [];
          if (checked) {
            newPermiso = [...userEditable.permisos, per.code];
          } else {
            newPermiso = userEditable.permisos.filter((permiso) => {
              if (per.code != permiso) {
                return permiso;
              }
            });
          }
          setUserEditable({
            ...userEditable,
            permisos: newPermiso,
          });

          return {
            ...per,
            valor: checked,
          };
        } else {
          return {
            ...per,
          };
        }
      })
    );
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
  useEffect(() => {
    if (userParsed) {
      setOpcionGenero(
        opcionGenero.map((opcion) => {
          return {
            ...opcion,
            select: opcion.code == userParsed.genero,
          };
        })
      );
    }
  }, [userParsed]);

  return (
    <Contenedor>
      <BotonQuery
        userParsed={userParsed}
        userEditable={userEditable}
        permisoThisUser={permisoThisUser}
      />

      <SeccionEncabezado>
        <CajaDetalles>
          <CajaImg>
            {/* <Img src={avatarMale} /> */}
            <AvatarPerfil
              className={userParsed?.genero}
              src={
                userParsed?.urlFotoPerfil
                  ? userParsed?.urlFotoPerfil
                  : userParsed?.genero == "masculino"
                    ? avatarMale
                    : userParsed?.genero == "femenino"
                      ? avatarFemale
                      : ""
              }
            />

            {modoEditar ? (
              <InputEditable
                type="file"
                className="file"
                onChange={(e) => handleFile(e)}
              />
            ) : null}
          </CajaImg>
          <CajaNombreCompleto>
            <TituloNombre>{userParsed ? userParsed.nombre : "-"}</TituloNombre>
          </CajaNombreCompleto>
        </CajaDetalles>
        <CajaDetalles>
          <CajitaDetalle>
            <TituloDetalle>Username</TituloDetalle>
            <DetalleTexto>{userParsed ? userParsed.userName : ""}</DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Correo</TituloDetalle>
            <DetalleTexto>{userParsed ? userParsed.correo : ""}</DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Nombre</TituloDetalle>
            <DetalleTexto>
              {modoEditar ? (
                <InputEditable
                  value={userEditable?.nombre}
                  name="nombre"
                  onChange={(e) => handleInput(e)}
                />
              ) : userParsed ? (
                userParsed.nombre
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Apellido</TituloDetalle>
            <DetalleTexto>
              {modoEditar ? (
                <InputEditable
                  value={userEditable?.apellido}
                  name="apellido"
                  onChange={(e) => handleInput(e)}
                />
              ) : userParsed ? (
                userParsed.apellido
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Flota</TituloDetalle>
            <DetalleTexto>
              {modoEditar ? (
                <InputEditable
                  value={userEditable?.flota}
                  name="flota"
                  onChange={(e) => handleInput(e)}
                />
              ) : userParsed ? (
                userParsed.flota
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Ext</TituloDetalle>
            <DetalleTexto>
              {modoEditar ? (
                <InputEditable
                  value={userEditable?.extension}
                  name="extension"
                  onChange={(e) => handleInput(e)}
                />
              ) : userParsed ? (
                userParsed.extension
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Genero</TituloDetalle>
            {modoEditar ? (
              <OpcionUnica
                arrayOpciones={opcionGenero}
                handleOpciones={handleGenero}
                name="genero"
              />
            ) : (
              <DetalleTexto>
                {userParsed?.genero == "masculino"
                  ? "Masculino"
                  : userParsed?.genero == "femenino"
                    ? "Femenino"
                    : userParsed?.genero}
              </DetalleTexto>
            )}
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Posicion</TituloDetalle>
            <DetalleTexto title={userParsed?.posicion}>
              {modoEditar ? (
                <InputEditable
                  value={userEditable?.posicion}
                  name="posicion"
                  onChange={(e) => handleInput(e)}
                />
              ) : userParsed ? (
                userParsed.posicion
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Departamento</TituloDetalle>
            <DetalleTexto className="alto">
              {modoEditar ? (
                <MenuDesp
                  onChange={(e) => handleInput(e)}
                  name="dpto"
                  autoComplete="off"
                  value={userEditable.dpto}
                >
                  {dptoParsed.map((opc, index) => {
                    return (
                      <Opciones
                        key={index}
                        value={opc.descripcion}
                        // selected={opc.select}
                        disabled={opc.disabled}
                      >
                        {opc.descripcion}
                      </Opciones>
                    );
                  })}
                </MenuDesp>
              ) : userParsed ? (
                userParsed.dpto
              ) : (
                ""
              )}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Fecha registro</TituloDetalle>
            <DetalleTexto>
              {userParsed?.fechaRegistro
                ? userParsed?.fechaRegistro.slice(0, 16) +
                  userParsed?.fechaRegistro.slice(-2)
                : null}
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle>
            <TituloDetalle>Sucursal</TituloDetalle>
            {modoEditar ? (
              <MenuDesp
                onChange={(e) => handleInput(e)}
                name="sucursal"
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
            ) : userParsed ? (
              userParsed.localidad?.nombreSucursal
            ) : (
              ""
            )}
          </CajitaDetalle>
        </CajaDetalles>
      </SeccionEncabezado>
      <ControlesUsuarios
        modoEditar={modoEditar}
        editar={editar}
        guardarCambios={guardarCambios}
        handleInputControles={handleInputControles}
        rolesGlobal={rolesGlobal}
      />

      <Tabla>
        <thead>
          <Filas className="cabeza">
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Codigo</CeldaHead>
            <CeldaHead>Valor</CeldaHead>
            <CeldaHead>Descripcion</CeldaHead>
            <CeldaHead>Modulo</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {permisoThisUser?.map((privilegio, index) => {
            return (
              <Filas key={index}>
                <CeldasBody>{index + 1}</CeldasBody>
                <CeldasBody>{privilegio.code}</CeldasBody>
                <CeldasBody className="checkBox">
                  {modoEditar ? (
                    <InputEditable
                      className="checkBox"
                      type="checkbox"
                      checked={privilegio.valor}
                      onChange={(e) => handleInputTabla(e)}
                      data-index={index}
                    />
                  ) : privilegio.valor ? (
                    "Aprobado ✅"
                  ) : (
                    "Denegado ❌"
                  )}
                </CeldasBody>
                <CeldasBody>{privilegio.descripcion}</CeldasBody>
                <CeldasBody>{privilegio.modulo}</CeldasBody>
              </Filas>
            );
          })}
        </tbody>
      </Tabla>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Contenedor>
  );
};

const Contenedor = styled.div`
  margin-bottom: 85px;
`;
const SeccionEncabezado = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: 10px 0;
  color: white;
  &.negativo {
    color: ${Tema.complementary.danger};
  }
`;
const CajaDetalles = styled.div`
  min-width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  border: 1px solid ${Tema.complementary.warning};
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
`;
const TituloDetalle = styled.p`
  /* border: 1px solid red; */
  width: 30%;

  &.negativo {
    color: ${Tema.complementary.danger};
  }
  &.docCerrado {
    color: inherit;
  }
`;
const DetalleTexto = styled.p`
  text-align: end;
  min-width: 49%;
  width: auto;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  /* width: 100; */
  /* border: 1px solid red; */
  height: 20px;
  &.negativo {
  }
  &.docCerrado {
  }
  &.alto {
    height: 35px;
  }
  color: white;
`;
const CajaImg = styled.div`
  display: flex;
  justify-content: center;
`;
const Img = styled.img`
  width: 150px;
  height: 150px;
  object-fit: contain;
  border: 3px solid white;

  border-radius: 50%;
`;

const CajaNombreCompleto = styled.div``;
const TituloNombre = styled.h2`
  text-align: center;
  color: white;
`;
const InputEditable = styled(InputSimpleEditable)`
  margin: 0;
  height: 20px;
  outline: none;
  border: none;
  background-color: transparent;
  color: white;
  padding: 4px;
  font-size: 1rem;
  padding: 4px;
  border-radius: 0;
  font-weight: normal;
  width: 200px;
  border-left: 1px solid ${Tema.secondary.azulOpaco};
  &.file {
    /* border: 1px solid red; */
    height: auto;
  }
  &.checkBox {
    width: 30px;
    cursor: pointer;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 90%;
  margin: auto;
  margin-left: 15px;
  margin-bottom: 25px;
  backdrop-filter: blur(15px);
`;

const Filas = styled.tr`
  &.body {
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
    background-color: ${Tema.secondary.azulSuave};
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  color: white;
  background-color: ${ClearTheme.secondary.azulFrosting};
`;

const CeldaHead = styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty {
    width: 300px;
  }
`;

const CeldasBody = styled.td`
  border: 1px solid black;
  font-size: 0.9rem;
  height: 25px;

  text-align: center;
  &.checkBox {
    min-width: 100px;
  }
`;
const MenuDesp = styled(MenuDesplegable)`
  height: auto;
  min-height: 35px;
`;
