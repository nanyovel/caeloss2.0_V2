import { useRef, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { Alerta } from "../components/Alerta";
import db, { autenticar, storage } from "../firebase/firebaseConfig";
import { createUserWithEmailAndPassword, getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { ModalLoading } from "../components/ModalLoading";
import { doc, setDoc, updateDoc } from "firebase/firestore";
import { Header } from "../components/Header";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { UserSchema } from "../models/AuthSchema.js";
import { ClearTheme, Tema } from "../config/theme.jsx";

import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../components/InputGeneral.jsx";
import {
  Departamentos,
  SucursalesOficial,
} from "../components/corporativo/Corporativo.js";
import { faCloudArrowUp } from "@fortawesome/free-solid-svg-icons";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { ES6AFormat } from "../libs/FechaFormat.jsx";
import { BotonQuery } from "../components/BotonQuery.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { OpcionUnica } from "../components/OpcionUnica.jsx";
import { soloNumeros } from "../libs/StringParsed.jsx";

export const Register = ({ home }) => {
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // ******************** ENVIANDO A LA BASE DE DATOS******************** //
  const [isLoading, setIsLoading] = useState(false);
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);

  const navitage = useNavigate();
  if (usuario) {
    navitage("/");
  }

  const auth = getAuth();
  auth.languageCode = "es";
  const navigate = useNavigate();
  const [datosInput, setDatosInput] = useState({
    correo: "",
    password: "",
    repetirPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showPassword2, setShowPassword2] = useState(false);

  // ******************** NEW CODE ************
  // ************** MANEJANDO CORTE DE IMAGENES FOTO DE PERFIL **************
  // ************** datos del Paquete react easy crop **************
  const inputRef = useRef(null);
  const clickFromIcon = () => {
    inputRef.current.click();
  };
  const [fileFotoPerfil, setFileFotoPerfil] = useState(null);
  const [urlLocalFotoPerfil, setUrlLocalFotoPerfil] = useState("");

  const handleFile = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imgUrl = URL.createObjectURL(file);
      setUrlLocalFotoPerfil(imgUrl);
      setFileFotoPerfil(file);
    }
  };

  const [datosUser, setDatosUser] = useState({
    ...UserSchema,
    password: "",
    repetirPassword: "",
  });
  const handleInput = (e) => {
    const { name, value } = e.target;
    if (name == "sucursal") {
      const sucursalSeleccionada = SucursalesOficial.find(
        (suc) => suc.descripcion == value
      );
      setDatosUser({
        ...datosUser,
        localidad: {
          nombreSucursal: sucursalSeleccionada.descripcion,
          codigoInterno: sucursalSeleccionada.codigoInterno,
          masDatosSuc: sucursalSeleccionada,
        },
      });
    } else if (name == "flota") {
      if (soloNumeros(value)) {
        setDatosUser({
          ...datosUser,
          [name]: value,
        });
      }
    } else {
      setDatosUser({
        ...datosUser,
        [name]: value,
      });
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    let validaciones = {
      passwordsIguales: true,
      passwordSegura: true,
      formatoCorreo: true,
      correoGrupoEmpresarial: true,
      todosCamposLlenos: true,
    };
    const camposObligatorios = [
      "nombre",
      "apellido",
      "dpto",
      "posicion",
      "flota",
      "correo",
      "password",
      "repetirPassword",
    ];
    // Si existen campos vacios
    let fallo = false;
    camposObligatorios.forEach((campo, index) => {
      if (datosUser[campo] == "") {
        fallo = true;
      }
    });

    if (datosUser.localidad.nombreSucursal == "") {
      fallo = true;
    }
    if (fallo) {
      setMensajeAlerta("Existen campos vacios.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      validaciones = {
        ...validaciones,
        todosCamposLlenos: false,
      };
      return;
    }
    if (datosUser.password != datosUser.repetirPassword) {
      validaciones = {
        ...validaciones,
        passwordsIguales: false,
      };
      setMensajeAlerta("Contraseñas distintas.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return "";
    }
    // Validacion de complejidad de contraseña:
    //  1- Al menos 8 caracteres.
    //  2- Contiene al menos una letra mayúscula.
    //  3- Contiene al menos una letra minúscula.
    const regex = /^(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    if (regex.test(datosUser.password) == false) {
      validaciones = {
        ...validaciones,
        passwordSegura: false,
      };
      setMensajeAlerta(
        "La contraseña debe contener al menos 8 caracteres, una letra mayuscula y una letra minuscula."
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return "";
    }
    // si el correo no tiene formato de correo o de Cielos o de P y L
    const expRegCorreo = {
      correo: /[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+/,
      correoCielos: /^[\w-]+(?:\.[\w-]+)*@(?:cielosacusticos\.com)$/,
      correoPyL: /^[\w-]+(?:\.[\w-]+)*@(?:pyldecoraciones\.com)$/,
    };
    // si el correo no tiene formato de correo
    if (expRegCorreo.correo.test(datosUser.correo) == false) {
      setMensajeAlerta("Correo incorrecto.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);

      validaciones = {
        ...validaciones,
        formatoCorreo: false,
      };
      return;
    }
    // Si el correo no tiene un dominio del grupo
    console.log("rpoabn");
    if (
      expRegCorreo.correoCielos.test(datosUser.correo) == false &&
      expRegCorreo.correoPyL.test(datosUser.correo) == false
    ) {
      setMensajeAlerta("Correo con dominio no autorizado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      validaciones = {
        ...validaciones,
        correoGrupoEmpresarial: false,
      };
      return;
    }

    // Si no selecciono genero
    const genero = opcionGenero.find((opcion) => opcion.select);
    if (!genero) {
      setMensajeAlerta("indicar genero.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    // Si todo esta correcto
    if (
      validaciones.passwordsIguales == true &&
      validaciones.passwordSegura == true &&
      validaciones.formatoCorreo == true &&
      validaciones.correoGrupoEmpresarial == true &&
      validaciones.todosCamposLlenos == true
    ) {
      try {
        setIsLoading(true);
        await createUserWithEmailAndPassword(
          autenticar,
          datosUser.correo,
          datosUser.password
        );
        const { password, repetirPassword, ...datosSinPassword } = datosUser;
        const usuar = auth.currentUser;
        const newUserEnviar = {
          ...UserSchema,
          ...datosSinPassword,
          genero: genero.code,
          fechaRegistro: ES6AFormat(new Date()),
          correo: usuar.email,
          userName: usuar.email.split("@")[0],
        };
        await setDoc(doc(db, "usuarios", usuar.uid), newUserEnviar);
        try {
          const nombreFoto = "avatars/fotoPerfil" + newUserEnviar.userName;

          const storageRefFoto = ref(storage, nombreFoto);
          const usuarioActualizar = doc(db, "usuarios", usuar.uid);
          if (fileFotoPerfil) {
            await uploadBytes(storageRefFoto, fileFotoPerfil).then(() => {}); // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
            getDownloadURL(ref(storage, storageRefFoto)).then((url) =>
              updateDoc(usuarioActualizar, {
                urlFotoPerfil: url,
              })
            );
          }
          navigate("/");
          setIsLoading(false);
        } catch (error) {
          console.log("error al cargar foto de perfil");
          console.log(error);
          setMensajeAlerta("Error al cargar foto de perfil.");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
        }
        setIsLoading(false);
      } catch (error) {
        console.log(error);

        switch (error.code) {
          case "auth/email-already-in-use":
            setMensajeAlerta("Ya existe una cuenta con este email.");
            setTipoAlerta("error");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            break;
          case "auth/weak-password":
            setMensajeAlerta("La contraseña debe tener mas de 6 caracteres.");
            setTipoAlerta("error");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            break;
          case "auth/invalid-email":
            setMensajeAlerta("Correo no valido");
            setTipoAlerta("error");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            break;
          default:
            setMensajeAlerta("Error con la base de datos");
            setTipoAlerta("error");
            setDispatchAlerta(true);
            setTimeout(() => setDispatchAlerta(false), 3000);
            break;
        }
        setIsLoading(false);
      }
    }
  };
  const sucParsed = SucursalesOficial.map((suc) => {
    return {
      ...suc,
      // descripcion: suc.nombre,
    };
  });

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
  return (
    <>
      {!home ? <Header titulo={"Registrarse"} /> : null}
      <Contenedor>
        <CajaTitulo>
          <TituloMain>Registrarse</TituloMain>
          <BotonQuery datosUser={datosUser} />
        </CajaTitulo>
        <WrapItem>
          <SeccionFotoPerfil>
            <CajaFotoPerfil>
              <FotoPerfil src={urlLocalFotoPerfil} />
              <CajaIcono>
                <Icono
                  onClick={clickFromIcon}
                  icon={faCloudArrowUp}
                  title="Cargar foto de perfil"
                />
                <Parrafo className="fotoPerfil">Foto de perfil</Parrafo>
              </CajaIcono>
              <Input
                type="file"
                ref={inputRef}
                autoComplete="off"
                accept="image/*"
                onChange={handleFile}
                className="none"
              />
            </CajaFotoPerfil>
          </SeccionFotoPerfil>
          <Formulario onSubmit={() => handleInput()}>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="text"
                  name="nombre"
                  value={datosUser.nombre}
                  onChange={(e) => handleInput(e)}
                  placeholder="Nombre"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="text"
                  name="apellido"
                  value={datosUser.apellido}
                  onChange={(e) => handleInput(e)}
                  placeholder="Apellido"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <TituloItem>Genero</TituloItem>
              <CajaInternaInput>
                <OpcionUnica
                  arrayOpciones={opcionGenero}
                  handleOpciones={handleGenero}
                  name="genero"
                />
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <MenuDesp
                  onChange={(e) => handleInput(e)}
                  name="sucursal"
                  autoComplete="off"
                  className="clearModern"
                  value={datosUser.localidad.nombreSucursal}
                >
                  <Opciones value={""} disabled>
                    Seleccione sucursal
                  </Opciones>
                  {sucParsed.map((opc, index) => {
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
                {/* <Input
                type="text"
                name="sucursal"
                value={datosUser.sucursal}
                onChange={(e) => handleInput(e)}
                placeholder="Sucursal"
                autoComplete="off"
              /> */}
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <MenuDesp
                  name="dpto"
                  value={datosUser.dpto}
                  onChange={(e) => handleInput(e)}
                  placeholder="Departamento"
                  autoComplete="off"
                  className="clearModern"
                >
                  <Opciones className="clearModern">
                    Seleccione departamento
                  </Opciones>
                  {Departamentos.map((dpto, index) => {
                    return (
                      <Opciones className="clearModern" key={index}>
                        {dpto.nombre}
                      </Opciones>
                    );
                  })}
                </MenuDesp>
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="text"
                  name="posicion"
                  value={datosUser.posicion}
                  onChange={(e) => handleInput(e)}
                  placeholder="Posicion"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="text"
                  name="flota"
                  value={datosUser.flota}
                  onChange={(e) => handleInput(e)}
                  placeholder="Flota"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="text"
                  name="extension"
                  value={datosUser.extension}
                  onChange={(e) => handleInput(e)}
                  placeholder="Extension"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>

            <CajaInput>
              <CajaInternaInput>
                <Input
                  type="email"
                  name="correo"
                  value={datosUser.correo}
                  onChange={(e) => handleInput(e)}
                  placeholder="Correo"
                  autoComplete="off"
                />
              </CajaInternaInput>
            </CajaInput>

            <CajaInput>
              <CajaInternaInput>
                <Input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={datosUser.password}
                  onChange={(e) => handleInput(e)}
                  placeholder="Contraseña"
                  autoComplete="off"
                />
                <CajaEye>
                  <IconoN
                    icon={showPassword ? faEyeSlash : faEye}
                    onClick={() => setShowPassword(!showPassword)}
                  />
                </CajaEye>
              </CajaInternaInput>
            </CajaInput>
            <CajaInput>
              <CajaInternaInput>
                <Input
                  name="repetirPassword"
                  type={showPassword2 ? "text" : "password"}
                  value={datosUser.repetirPassword}
                  onChange={(e) => handleInput(e)}
                  placeholder="Repetir contraseña"
                  autoComplete="off"
                />
                <CajaEye>
                  <IconoN
                    icon={showPassword2 ? faEyeSlash : faEye}
                    onClick={() => setShowPassword2(!showPassword2)}
                  />
                </CajaEye>
              </CajaInternaInput>
            </CajaInput>

            <CajaTitulo className="cajaBoton">
              <BtnGeneralButton onClick={(e) => handleSubmit(e)} tipe="submit">
                Aceptar
              </BtnGeneralButton>
            </CajaTitulo>
          </Formulario>
        </WrapItem>
      </Contenedor>
      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const CajaTitulo = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid white;
  margin-bottom: 45px;
  &.cajaBoton {
    margin-top: 60px;
  }
`;

const TituloMain = styled.h2`
  color: white;
  margin: auto;
`;

const Contenedor = styled.div`
  min-height: 500px;
  color: white;
  margin: auto;

  padding: 25px;
  width: 90%;
  border: 1px solid black;
  border-radius: 10px;
  /* margin-top: 30px; */
  background-color: ${Tema.secondary.azulProfundo};
  padding-top: 60px;
  border: 1px solid ${Tema.primary.azulBrillante};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(15px);
`;
const WrapItem = styled.div`
  /* border: 1px solid red; */
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;
const Formulario = styled.form`
  /* border: 1px solid red; */
  width: 350px;
`;
const CajaInput = styled.div`
  width: 100%;
  /* margin: auto; */

  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;
const CajaInternaInput = styled.div`
  width: 100%;
  display: flex;
  position: relative;
  @media screen and (max-width: 500px) {
    width: 90%;
  }
`;
const Input = styled(InputSimpleEditable)`
  height: 30px;
  outline: none;
  background-color: transparent;
  border: none;
  border-bottom: 2px solid white;
  color: white;
  padding: 10px;
  width: 100%;
  border-radius: 0;
  &.none {
    display: none;
  }

  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &:focus {
    border: none;
    border-bottom: 2px solid white;
  }
  &::placeholder {
    color: #b4b3b3;
  }

  @media screen and (max-width: 360px) {
    width: 90%;
  }
`;

const CajaEye = styled.div`
  width: 10%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: absolute;
  right: 0;
`;
const Icono = styled(FontAwesomeIcon)`
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
const IconoN = styled(FontAwesomeIcon)`
  cursor: pointer;
`;

const MenuDesp = styled(MenuDesplegable)`
  width: 100%;
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
  height: 150px;
  width: 150px;
  object-fit: contain;
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
const TituloItem = styled.p`
  width: 100%;
  text-align: start;
`;
