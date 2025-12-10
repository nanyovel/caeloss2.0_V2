// 3/1/2025
// Mostrar perfiles de usuarios
// Este componente muestra el perfil del usuario tipo red social
import { useEffect, useState } from "react";
import { Header } from "../components/Header.jsx";
import avatarMale2 from "./../../public/img/avatares/maleAvatar.svg";
import avatarMale from "./../../public/img/avatares/avatarMale.png";
import avatarFemale from "./../../public/img/avatares/avatarFemale.png";
import styled from "styled-components";
import { ClearTheme, Tema } from "../config/theme.jsx";
import { getAuth } from "firebase/auth";
import { useNavigate, useParams } from "react-router-dom";
import {
  useDocByArrayCondition,
  useDocByCondition,
  useDocById,
} from "../libs/useDocByCondition.js";
import { AvatarPerfil } from "../components/JSXElements/ImgJSX.jsx";
import { BotonQuery } from "../components/BotonQuery.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartBold } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartLigero } from "@fortawesome/free-regular-svg-icons";

import { ES6AFormat } from "../libs/FechaFormat.jsx";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../firebase/firebaseConfig.js";
import { generaLinkWA } from "../libs/modern.js";
import { EnlaceRRSS } from "../components/JSXElements/Enlace.jsx";

import { Alerta } from "../components/Alerta.jsx";

import { likePerfilSchema } from "../models/likeSchema.js";
import { useAuth } from "../context/AuthContext.jsx";
import { generarUUID } from "../libs/generarUUID.js";
import { personSchema } from "../models/mixSchema.js";
import { notificacionesLocalSchema } from "../models/notificacionesLocalSchema.js";

export const DetalleUnPerfil = ({ userMaster }) => {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const parametro = useParams();
  const docUser = parametro.id;
  const [userDB, setUserDB] = useState({});
  const [userBuscado, setUserBuscado] = useState(null);

  useDocByCondition("usuarios", setUserDB, "userName", "==", docUser);
  useEffect(() => {
    setUserBuscado(userDB[0]);
  }, [userDB, docUser]);
  const navigate = useNavigate();

  const auth = getAuth();
  auth.languageCode = "es";
  const usuario = auth.currentUser;
  if (!usuario) {
    navigate("/acceder");
  }

  // ********************** CONTACTAR ********************** /

  // ********************** CONTACTAR ********************** /

  // ********* Like this perfil *********
  const [likeThisPerfil, setLikeThisPerfil] = useState(false);
  useEffect(() => {
    if (userBuscado) {
      const likeThis = userBuscado.likesPerfil?.find(
        (like) => like.correo == userMaster.correo
      );
      if (likeThis) {
        setLikeThisPerfil(true);
      } else {
        setLikeThisPerfil(false);
      }
    }
  }, [userMaster, userBuscado]);

  // ******************** TOOLTIP ********************
  // ************** USUARIOS DIERON LIKE ********************
  const [mostrar, setMostrar] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dataToolTip, setDataToolTip] = useState([]);

  const handleMouseEnter = (e, likes) => {
    setPos({ x: e.clientX - 10, y: e.clientY - 10 });
    setMostrar(true);
    console.log(likes);
    setDataToolTip(likes);
  };

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const handleMouseLeave = () => {
    setMostrar(false);
    setDataToolTip([]);
  };

  // ********** SABER SI YA SE LE DIO LIKE AL PERFIL **********

  const [likeToPerfilDBPADRE, setLikeToPerfilDBPADRE] = useState({});
  const [likeEstePerfil, setLikeEstePerfil] = useState([]);
  const [likeSelf, setLikeSelf] = useState(null);

  useDocById("miscelaneo", setLikeToPerfilDBPADRE, "profileParallel");

  useEffect(() => {
    console.log(likeToPerfilDBPADRE);
    if (userMaster?.id && likeToPerfilDBPADRE?.likeArray?.length > 0) {
      const likeFind = likeToPerfilDBPADRE.likeArray.filter(
        (like) => like?.usuarioDestino?.userName == docUser
      );
      console.log(likeFind);
      if (likeFind) {
        console.log("✅✅✅✅");
        setLikeEstePerfil(likeFind);
        const likeSelfAux = likeFind.find(
          (like) => like.usuarioCreador.id == userMaster.id
        );
        console.log(likeFind);
        console.log(likeSelfAux);
        console.log(userMaster.id);
        setLikeSelf(likeSelfAux);
      } else {
        console.log("🔴🔴🔴🔴");
        setLikeSelf(null);
        setLikeEstePerfil([]);
      }
    } else if (likeToPerfilDBPADRE?.likeArray?.length == 0) {
      setLikeEstePerfil([]);
      setLikeSelf(null);
    }
  }, [likeToPerfilDBPADRE, userMaster]);

  // ********************Funcion para dar like********************
  const likePerfil = async () => {
    const batch = writeBatch(db);
    try {
      // Si existe quitalo y si no entonces agregale
      if (likeSelf) {
        console.log("asdasds");
        const arrayLikesUp = likeToPerfilDBPADRE.likeArray.filter((like) => {
          if (like.usuarioCreador.id != userMaster.id) {
            return like;
          }
        });
        setLikeToPerfilDBPADRE({
          ...likeToPerfilDBPADRE,
          likeArray: arrayLikesUp,
        });
        const docActualizar = doc(db, "miscelaneo", "profileParallel");
        batch.update(docActualizar, {
          likeArray: arrayLikesUp,
        });
        await batch.commit();
      } else {
        // Nuevo like
        const nuevoLike = {
          ...likePerfilSchema,
          idRef: generarUUID(),
          createdAt: ES6AFormat(new Date()),
          createdBy: userMaster.userName,
          //likePerfil-Cuando el usuario recibe un like a su perfil
          tipoDoc: "likePerfil",
          usuarioCreador: {
            ...personSchema,
            id: userMaster.id,
            urlFotoPerfil: userMaster.urlFotoPerfil,
            userName: userMaster.userName,
            correo: userMaster.correo,
            nombre: userMaster.nombre,
            apellido: userMaster.apellido,
            posicion: userMaster.posicion,
            dpto: userMaster.dpto,
          },
          usuarioDestino: {
            id: userBuscado.id,
            urlFotoPerfil: userBuscado.urlFotoPerfil,
            userName: userBuscado.userName,
            correo: userBuscado.correo,
            nombre: userBuscado.nombre,
            apellido: userBuscado.apellido,
            dpto: userBuscado.dpto,
            posicion: userBuscado.posicion,
          },
        };

        const docActualizar = doc(db, "miscelaneo", "profileParallel");
        const arrayUP = [...likeToPerfilDBPADRE.likeArray, nuevoLike];
        batch.update(docActualizar, {
          likeArray: arrayUP,
        });

        // Nueva notificacion
        const nuevaNotificacionLocal = {
          ...notificacionesLocalSchema,
          createBy: userMaster.userName,
          createdAt: ES6AFormat(new Date()),
          // 0-Sin visualizar
          // 1-Visualizada
          estadoDoc: 0,
          //likePerfil01-Cuando el usuario recibe un like a su perfil
          //likeReview-Cuando el usuario recibe un like a una reseña
          tipoDoc: "likePerfil",
          enlace: "/perfil",
          textEnd: " ha recibido un me gusta.",
          usuarioCreador: {
            nombre: userMaster.nombre,
            apellido: userMaster.apellido,
            id: userMaster.id,
            userName: userMaster.userName,
            urlFotoPerfil: userMaster.urlFotoPerfil,
          },
          usuarioDestino: {
            id: userBuscado.id,
            urlFotoPerfil: userBuscado.urlFotoPerfil,
            userName: userBuscado.userName,
            correo: userBuscado.correo,
            nombre: userBuscado.nombre,
            apellido: userBuscado.apellido,
          },
        };
        const collectionNuevaNotificacion = collection(
          db,
          "notificacionesLocal"
        );
        const nuevaNotificaRef = doc(collectionNuevaNotificacion);

        batch.set(nuevaNotificaRef, nuevaNotificacionLocal);

        await batch.commit();
      }
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  return (
    <>
      <Header titulo={"Perfiles"} />
      <BotonQuery
        userParsed={userBuscado}
        likeToPerfilDBPADRE={likeToPerfilDBPADRE}
        likeEstePerfil={likeEstePerfil}
        likeSelf={likeSelf}
      />
      {userBuscado && (
        <>
          <CajaNumUser>
            <FechaRegistro>
              Registrado el
              {userBuscado?.fechaRegistro && (
                <>
                  {" " +
                    userBuscado?.fechaRegistro?.slice(0, 10) +
                    " a las " +
                    userBuscado?.fechaRegistro?.slice(11, 16) +
                    " " +
                    userBuscado?.fechaRegistro?.slice(-2)}
                </>
              )}
            </FechaRegistro>
          </CajaNumUser>

          <CajaPerfil>
            <CajaUsuario>
              <CajaImg>
                <AvatarPerfil
                  className={userBuscado?.genero + " perfilHover "}
                  src={
                    userBuscado?.urlFotoPerfil
                      ? userBuscado?.urlFotoPerfil
                      : userBuscado.genero == "femenino"
                        ? avatarFemale
                        : avatarMale
                  }
                />
              </CajaImg>
              <CajaLike>
                <Icono
                  onClick={() => likePerfil()}
                  icon={likeSelf ? faHeartBold : faHeartLigero}
                  className={likeSelf && "white"}
                />
                <QtyLike
                  onMouseEnter={(e) =>
                    handleMouseEnter(e, userBuscado.likesPerfil)
                  }
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className={userBuscado.likesPerfil?.length > 0 && "dinamic"}
                >
                  {likeEstePerfil.length}
                </QtyLike>
                {likeEstePerfil.length > 0 && (
                  <Tooltip x={pos.x} y={pos.y} visible={mostrar}>
                    {likeEstePerfil.length > 0 &&
                      likeEstePerfil.map((like, index) => {
                        return (
                          <TextToolTip key={index}>
                            {like.usuarioCreador.nombre +
                              " " +
                              like.usuarioCreador.apellido}
                          </TextToolTip>
                        );
                      })}
                  </Tooltip>
                )}
              </CajaLike>
              <CajaDatos>
                <div>
                  <CajitaDatos>
                    <Texto>Nombre:</Texto>
                    <Texto className="detalle">{userBuscado?.nombre}</Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Apellido:</Texto>
                    <Texto className="detalle">{userBuscado?.apellido}</Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Genero:</Texto>
                    <Texto className="detalle">
                      {userBuscado?.genero == "masculino"
                        ? "Masculino"
                        : userBuscado?.genero == "femenino"
                          ? "Femenino"
                          : userBuscado?.genero}
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Sucursal:</Texto>
                    <Texto className="detalle">
                      {userBuscado?.localidad.nombreSucursal}
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Departamento:</Texto>
                    <Texto className="detalle">{userBuscado?.dpto}</Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Posición:</Texto>
                    <Texto className="detalle">{userBuscado?.posicion}</Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Flota:</Texto>

                    {userBuscado?.flota && (
                      <ContainerFlota>
                        <WrapContactar>
                          <Enlace2
                            className="caja-whatsapp"
                            target="_blank"
                            to={generaLinkWA(
                              userBuscado.flota,
                              "whatsapp",
                              `Hola ${userBuscado.nombre}, necesito que por favor me asistas.`
                            )}
                          >
                            WhatsApp
                          </Enlace2>
                          <Enlace2
                            className="caja-llamar"
                            target="_blank"
                            to={generaLinkWA(userBuscado.flota, "llamada")}
                          >
                            Llamar
                          </Enlace2>
                        </WrapContactar>
                        <Texto className="detalle">{userBuscado?.flota}</Texto>
                      </ContainerFlota>
                    )}
                    {/* <Texto className="detalle">{userParsed?.flota}</Texto> */}
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Numero Extension:</Texto>
                    <Texto className="detalle">{userBuscado?.extension}</Texto>
                  </CajitaDatos>

                  <CajitaDatos>
                    <Texto>Username:</Texto>
                    <Texto className="detalle">
                      {userBuscado?.userName ? userBuscado.userName : ""}
                    </Texto>
                  </CajitaDatos>
                  <CajitaDatos>
                    <Texto>Correo:</Texto>

                    <ContainerFlota className="correo">
                      <WrapContactar>
                        <Enlace2
                          target="_blank"
                          to={generaLinkWA(userBuscado.correo, "correo")}
                          className="caja-email"
                        >
                          Email
                        </Enlace2>
                      </WrapContactar>
                      <Texto className="detalle"> {userBuscado?.correo}</Texto>
                    </ContainerFlota>
                  </CajitaDatos>
                </div>
              </CajaDatos>
            </CajaUsuario>
          </CajaPerfil>
        </>
      )}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};

const CajaPerfil = styled.div`
  padding: 15px;
`;

const CajaUsuario = styled.div`
  border: 1px solid ${Tema.complementary.warning};
  border-radius: 15px 0 15px 0;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
  color: white;
  padding: 10px;
  display: flex;
  flex-direction: column;

  width: 70%;
  margin: auto;
  @media screen and (max-width: 500px) {
    width: 100%;
  }
  margin-bottom: 70px;
`;
const CajaImg = styled.div`
  display: flex;
  justify-content: center;
`;

const CajaDatos = styled.div``;

const CajitaDatos = styled.div`
  display: flex;
  height: auto;
  /* border: 1px solid red; */
  justify-content: space-between;
  gap: 20px;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  margin-bottom: 10px;
`;

const Texto = styled.h2`
  font-size: 1rem;
  height: auto;
  width: auto;
  /* min-width: 20%; */
  font-weight: 400;
  &.detalle {
    /* border: 1px solid red; */
    text-align: end;
    font-weight: normal;
    @media screen and (max-width: 360px) {
      font-size: 14px;
    }
  }
  &.fotoPerfil {
  }
  &.file {
    height: auto;
  }
  @media screen and (max-width: 360px) {
    font-size: 14px;
  }
`;

const CajaNumUser = styled.div`
  /* border: 1px solid red; */
  width: 100%;
  height: 60px;
  padding: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const TextoNumUser = styled.h2`
  color: white;
  text-align: bottom;
  padding: 0.1px;
  /* font-size: 2rem; */
  height: 30px;
  display: block;
  /* border: 1px solid black; */
  border-bottom: 1px solid ${Tema.primary.azulBrillante};
  font-weight: 400;
`;

const FechaRegistro = styled.p`
  color: white;
`;

const ContainerFlota = styled.div`
  display: flex;
  justify-content: end;
  gap: 18px;
  width: calc(100% - 200px);
  &.correo {
    width: calc(100% - 100px);
  }
  @media screen and (max-width: 870px) {
    flex-direction: column;
    justify-content: end;
    align-items: end;
  }
`;
const WrapContactar = styled.div`
  height: 100%;
  /* width: 30%; */
  gap: 8px;
  display: flex;
  /* justify-content: center; */
  /* border: 1px solid red; */
  @media screen and (max-width: 870px) {
    flex-direction: column;
    width: auto;
    /* justify-content: start; */
    /* align-items: end; */
  }
`;
const Enlace2 = styled(EnlaceRRSS)``;

const CajaLike = styled.div`
  margin-top: 10px;
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-bottom: 4px;
  font-size: 1.4rem;
  color: black;
  transition: ease all 0.2s;
  justify-content: center;

  /* transition: ; */
  &:hover {
    color: white;
  }
  cursor: pointer;
  &.white {
    color: white;
  }
`;
const QtyLike = styled.p`
  font-size: 12px;
  &.dinamic {
    &:hover {
      text-decoration: underline;
      color: white;
      cursor: pointer;
    }
  }
`;
// ***************Nuevo comentario***************

const Tooltip = styled.div`
  position: fixed;
  /* top: ${(props) => props.y}px; */
  /* left: ${(props) => props.x}; */
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.2s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translate(-50px, 30px);
`;
const TextToolTip = styled.p`
  margin: 0;
  font-size: 14px;
`;
