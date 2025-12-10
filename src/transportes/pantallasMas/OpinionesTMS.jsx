import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import ImgTalk from "./../../../public/img/variedad/talkUser.png";
import { ClearTheme, Tema } from "../../config/theme";
import { AvatarPerfil } from "../../components/JSXElements/ImgJSX";
import { TextArea } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";

import {
  ES6AFormat,
  fortmatAES6Nuevo,
  hoyManniana,
} from "../../libs/FechaFormat";
import { Alerta } from "../../components/Alerta";
import {
  obtenerDocPorId2,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import { BotonQuery } from "../../components/BotonQuery";
import { EnlacesPerfil } from "../../components/JSXElements/Enlace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartBold } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartLigero } from "@fortawesome/free-regular-svg-icons";
import ImgHappy from "./../../../public/img/icon/feliz.png";
import ImgTecladoPNG from "./../../../public/img/icon/teclado2.png";
import AvatarMale from "./../../../public/img/avatares/avatarMale.png";
import AvatarFemale from "./../../../public/img/avatares/avatarFemale.png";
import { reviewSchema } from "../../models/reviewSchema";
import { likeSchema } from "../../models/likeSchema";

import { personSchema } from "../../models/mixSchema";
import { notificacionesLocalSchema } from "../../models/notificacionesLocalSchema";

export default function OpinionesTMS({ userMaster }) {
  // ******************** RECURSOS GENERALES ********************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [tutorial, setTutorial] = useState(false);

  // ******************** Traer reseñas de la DB ********************
  const [dbReview, setDBReview] = useState([]);
  const [dbReviewParsed, setDBReviewParsed] = useState([]);
  useDocByCondition("resennias", setDBReview, "tipoDoc", "==", "opinionTMS");
  useEffect(() => {
    if (userMaster) {
      if (dbReview.length > dbReviewParsed.length) {
        setupDateScroll(!upDateScroll);
      }
      const reviewDBAux = dbReview.map((opino) => {
        return {
          ...opino,
          propiedadAux: {
            fechaES6: fortmatAES6Nuevo(opino.createdAt),
          },
        };
      });
      const reviewSort = reviewDBAux.sort(
        (a, b) => a.propiedadAux.fechaES6 - b.propiedadAux.fechaES6
      );
      console.log(reviewSort);

      const reviewConLike = reviewSort.map((rev) => {
        const likeEsteUser = rev.likes.find(
          (like) => like.usuarioCreador.userName == userMaster.userName
        );
        return {
          ...rev,
          propiedadAux: {
            ...rev.propiedadAux,
            myLike: likeEsteUser ? true : false,
          },
        };
      });
      console.log(reviewConLike);

      const reviewConProps = reviewConLike.map((review) => {
        return {
          ...review,
          editable: false,
          valueEditable: "",
        };
      });
      const reviewSinEliminado = reviewConProps.filter(
        (review) => review.estadoDoc != 1
      );

      setDBReviewParsed(reviewSinEliminado);
    }
  }, [dbReview, userMaster]);

  // ******************** Scroll caja comentarios realizados********************
  const reviewScrollRef = useRef(null);
  const textAreaRef = useRef(null);
  const [upDateScroll, setupDateScroll] = useState(false);

  useEffect(() => {
    if (reviewScrollRef.current) {
      reviewScrollRef.current.scrollTo({
        top: reviewScrollRef.current.scrollHeight,
        behavior: "smooth", // 👈 hace el scroll suave
      });
    }
  }, [upDateScroll]);

  // ********************Funcion para dar like********************
  const likeToReview = async (review) => {
    try {
      //  Saber si ya se le dio like
      const likesUp = review.likes;

      const likeThisUser = likesUp.find(
        (like) => like.usuarioCreador.userName == userMaster.userName
      );
      if (likeThisUser) {
        const likesSinThisUser = likesUp.filter(
          (like) => like.usuarioCreador.userName != userMaster.userName
        );

        const docActualizar = doc(db, "resennias", review.id);

        updateDoc(docActualizar, {
          likes: likesSinThisUser,
        });
      } else {
        const batch = writeBatch(db);
        // ******* Agrega el like *******
        const nuevoLike = {
          ...likeSchema,
          createdAt: ES6AFormat(new Date()),
          createdBy: userMaster.userName,
          tipoDoc: "likeReview",

          usuarioCreador: {
            ...personSchema,
            id: userMaster.id,
            urlFotoPerfil: userMaster.urlFotoPerfil,
            userName: userMaster.userName,
            correo: userMaster.correo,
            nombre: userMaster.nombre,
            apellido: userMaster.apellido,
            dpto: userMaster.dpto,
            posicion: userMaster.posicion,
          },
        };
        likesUp.push(nuevoLike);
        const docActualizar = doc(db, "resennias", review.id);
        batch.update(docActualizar, {
          likes: likesUp,
        });

        // ******* Crea la notificacion *******
        const nuevaNotificacion = {
          ...notificacionesLocalSchema,
          estadoDoc: 0,
          createdAt: ES6AFormat(new Date()),
          createBy: userMaster.userName,
          tipoDoc: "likeReview",
          enlace: "/transportes/mas",
          texto: review.texto,
          textEnd: "ha recibido un me gusta.",
          usuarioCreador: {
            ...personSchema,
            nombre: userMaster.nombre,
            apellido: userMaster.apellido,
            id: userMaster.id,
            userName: userMaster.userName,
            urlFotoPerfil: userMaster.urlFotoPerfil,
            dpto: userMaster.dpto,
            genero: userMaster.genero,
          },
          usuarioDestino: {
            ...personSchema,
            nombre: review.usuario.nombre,
            apellido: review.usuario.apellido,
            id: review.usuario.id,
            userName: review.usuario.userName,
            urlFotoPerfil: review.usuario.urlFotoPerfil,
            genero: review.usuario.genero,
            // dpto: review?.usuario?.dpto || "",
          },
        };
        console.log(review);
        const collecionNotifiLocal = collection(db, "notificacionesLocal");
        const notificacionRef = doc(collecionNotifiLocal);
        batch.set(notificacionRef, nuevaNotificacion);

        batch.commit();
      }
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // ******************** TOOLTIP ********************
  // ************** USUARIOS DIERON LIKE ********************
  const [mostrar, setMostrar] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [dataToolTip, setDataToolTip] = useState([]);

  const handleMouseEnter = (e, opinion) => {
    setPos({ x: e.clientX - 10, y: e.clientY - 10 });
    setMostrar(true);
    setDataToolTip(opinion.likes);
  };

  const handleMouseMove = (e) => {
    setPos({ x: e.clientX + 10, y: e.clientY + 10 });
  };

  const handleMouseLeave = () => {
    setMostrar(false);
    setDataToolTip([]);
  };
  // ******************** Enviar nueva reseña ********************
  const [reviewText, setReviewText] = useState("");
  const enviarReview = async () => {
    if (!userMaster) {
      return;
    }
    try {
      const batch = writeBatch(db);
      const collectionReviewRef = collection(db, "resennias");
      const nuevoDocumentoRef = doc(collectionReviewRef);
      const nuevoIdReview = nuevoDocumentoRef.id;

      // Al usuario Indica que ya comento

      const reviewEnviar = {
        ...reviewSchema,
        createdAt: ES6AFormat(new Date()),
        createBy: userMaster.userName,
        texto: reviewText,
        usuario: {
          nombre: userMaster.nombre,
          apellido: userMaster.apellido,
          id: userMaster.id,
          urlFotoPerfil: userMaster.urlFotoPerfil,
          genero: userMaster.genero,
          userName: userMaster.userName,
        },
      };
      console.log(nuevoIdReview);
      batch.set(nuevoDocumentoRef, reviewEnviar);
      setReviewText("");
      await batch.commit();
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  const editarReview = async (opinion) => {
    const dbReviewAux = dbReviewParsed.map((review) => {
      return {
        ...review,
        editable: review.id === opinion.id,
        valueEditable: review.texto,
      };
    });

    setDBReviewParsed(dbReviewAux);
  };
  const handleEditReview = (e, opinion) => {
    const { value } = e.target;
    const dbReviewAux = dbReviewParsed.map((review) => {
      if (review.id === opinion.id) {
        console.log(review.id);
        console.log(opinion.id);
        return {
          ...opinion,
          valueEditable: value,
        };
      }
      return { ...review };
    });

    setDBReviewParsed(dbReviewAux);
  };
  const guardarEdicion = async (opinion) => {
    try {
      const docActualizar = doc(db, "resennias", opinion.id);
      updateDoc(docActualizar, {
        texto: opinion.valueEditable,
      });
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }

    const dbReviewAux = dbReviewParsed.map((review) => {
      return {
        ...opinion,
        editable: false,
      };
    });

    setDBReviewParsed(dbReviewAux);
  };
  const eliminarReview = async (opinion) => {
    try {
      const docActualizar = doc(db, "resennias", opinion.id);
      updateDoc(docActualizar, {
        estadoDoc: 1,
      });
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }

    const dbReviewAux = dbReviewParsed.map((review) => {
      return {
        ...opinion,
        editable: false,
      };
    });

    setDBReviewParsed(dbReviewAux);
  };

  return (
    userMaster && (
      <>
        <Container>
          <BotonQuery reviewText={reviewText} dbReview={dbReview} />
          <TituloBig>¿Que dicen los usuarios del TMS?</TituloBig>
          <ContenedorPrincipal>
            <CajaInterna className="img">
              <Img src={ImgTalk} />
            </CajaInterna>
            <CajaInterna className="talks" ref={reviewScrollRef}>
              <TituloTalks>Cuentanos tu opinion.</TituloTalks>
              <WrapReviewScroll>
                {dbReviewParsed.map((opinion, index) => {
                  return (
                    <WrapReview key={index}>
                      <CajaAvatar>
                        <EnlacesPerfil2
                          target="_blank"
                          to={`/perfiles/${opinion.createBy}`}
                        >
                          <CajaAvatar>
                            <AvatarPerfil2
                              src={
                                opinion.usuario.urlFotoPerfil
                                  ? opinion.usuario.urlFotoPerfil
                                  : opinion?.usuario?.genero == "femenino"
                                    ? AvatarFemale
                                    : AvatarMale
                              }
                              className="xxxSmall"
                            />
                            <NombreUserHecha className="reviewHecha">
                              {opinion.usuario?.nombre +
                                " " +
                                opinion.usuario?.apellido}{" "}
                            </NombreUserHecha>
                          </CajaAvatar>
                        </EnlacesPerfil2>
                      </CajaAvatar>
                      <WrapTexto>
                        <CajaTexto>
                          {opinion.editable ? (
                            <TextArea2
                              value={opinion.valueEditable}
                              onChange={(e) => handleEditReview(e, opinion)}
                            />
                          ) : (
                            <TextoTalking>{opinion.texto}</TextoTalking>
                          )}
                        </CajaTexto>
                        <CajaResponder>
                          <ParrafoTexto>
                            {hoyManniana(opinion.createdAt, true)}
                          </ParrafoTexto>
                          {userMaster.userName === opinion.createBy && (
                            <>
                              {opinion.editable ? (
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => {
                                    guardarEdicion(opinion);
                                  }}
                                >
                                  Guardar
                                </ParrafoTexto>
                              ) : (
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => {
                                    editarReview(opinion);
                                  }}
                                >
                                  Editar
                                </ParrafoTexto>
                              )}
                              <ParrafoTexto
                                className="funcion"
                                onClick={() => eliminarReview(opinion)}
                              >
                                Eliminar
                              </ParrafoTexto>
                            </>
                          )}

                          {/* <ParrafoTexto>Responder</ParrafoTexto>
                          <ParrafoTexto>Ver 35 respuestas</ParrafoTexto> */}
                        </CajaResponder>
                      </WrapTexto>
                      <CajaLike>
                        <Icono
                          onClick={() => likeToReview(opinion)}
                          icon={
                            opinion.propiedadAux.myLike
                              ? faHeartBold
                              : faHeartLigero
                          }
                          className={opinion.propiedadAux.myLike && "white"}
                        />
                        <QtyLike
                          onMouseEnter={(e) => handleMouseEnter(e, opinion)}
                          onMouseMove={handleMouseMove}
                          onMouseLeave={handleMouseLeave}
                          className={opinion.likes.length > 0 && "dinamic"}
                        >
                          {opinion.likes.length}
                        </QtyLike>
                        {dataToolTip.length > 0 && (
                          <Tooltip x={pos.x} y={pos.y} visible={mostrar}>
                            {dataToolTip.length > 0 &&
                              dataToolTip.map((like, index) => {
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
                    </WrapReview>
                  );
                })}
              </WrapReviewScroll>
            </CajaInterna>
          </ContenedorPrincipal>
          {tutorial && (
            <CajaTutorial>
              <Xcerrar onClick={() => setTutorial(false)}>❌</Xcerrar>
              <TextoTutorial>Para abrir el emoji picker: </TextoTutorial>
              <ListaDesordenada>
                <Elemento>
                  Haz click en el área donde deseas colocar emojis.
                </Elemento>
                <Elemento>
                  Presiona el botón de inicio y mantenlo presionado, luego
                  presiona el botón de punto (.) como se muestra en la siguiente
                  imagen.
                </Elemento>
                <br />
              </ListaDesordenada>
              <br />
              <ImgTeclado src={ImgTecladoPNG} />
            </CajaTutorial>
          )}
          <CajaSpeech>
            <WrapAvatar>
              <AvatarPerfil2
                src={userMaster?.urlFotoPerfil}
                className="xxSmall"
              />
              <NombreUser>
                {userMaster?.nombre + " " + userMaster?.apellido}{" "}
              </NombreUser>
            </WrapAvatar>

            <WrapText>
              <TextArea2
                name="reviewText"
                ref={textAreaRef}
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
              />
              <CajaEmoji>
                <EmojiImg
                  onClick={() => {
                    textAreaRef.current.focus();
                    setTutorial(true);
                  }}
                  src={ImgHappy}
                />
              </CajaEmoji>
            </WrapText>
            <BtnSimple onClick={() => enviarReview()}>Enviar</BtnSimple>
          </CajaSpeech>
        </Container>
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </>
    )
  );
}
const Container = styled.div`
  width: 100%;
`;
const TituloBig = styled.h2`
  width: 100%;
  text-align: center;
  font-size: 3rem;
  color: white;
  font-weight: lighter;
`;
const ContenedorPrincipal = styled.div`
  display: flex;
  gap: 15px;
  justify-content: center;
  padding: 0 15px;
  margin-bottom: 15px;
  @media screen and (max-width: 700px) {
    flex-direction: column;
  }
`;
const CajaInterna = styled.div`
  width: 90%;
  @media screen and (max-width: 700px) {
    width: 100%;
  }
  height: 300px;

  &.img {
    width: 70%;
    text-align: center;
  }
  &.talks {
    box-shadow: ${ClearTheme.config.sombra};
    border: 2px solid white;
    border-radius: 12px;
    background-color: ${ClearTheme.complementary.info};

    overflow-y: scroll;
    *,
    *:before,
    *:after {
      box-sizing: border-box;
    }
    &::-webkit-scrollbar {
      width: 6px;
    }
    &::-webkit-scrollbar-thumb {
      background-color: #19b4ef;
      border-radius: 7px;
    }
  }
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 12px;
  box-shadow: ${ClearTheme.config.sombra};
  @media screen and (max-width: 640px) {
    width: 95%;
  }
`;
// ***************Comentarios hechos***************
const WrapReviewScroll = styled.div``;
const WrapReview = styled.div`
  width: 100%;
  min-height: 70px;
  /* border: 1px solid ${ClearTheme.complementary.warning}; */
  border-bottom: 1px solid ${ClearTheme.neutral.neutral400};
  margin-bottom: 8px;
  display: flex;
`;
const CajaAvatar = styled.div`
  width: 90px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const WrapTexto = styled.div`
  min-height: 70px;
  /* border: 1px solid white; */
  width: calc(100% - 70px - 35px);
`;
const CajaTexto = styled.div`
  width: 100%;
  min-height: 50px;
`;
const CajaResponder = styled.div`
  width: 100%;
  min-height: 20px;
  display: flex;
`;

const ParrafoTexto = styled.p`
  margin-right: 8px;
  font-size: 12px;
  text-align: start;
  /* width: 100%; */
  padding-left: 6px;
  color: #c0c0c0;
  &.funcion {
    &:hover {
      text-decoration: underline;
      cursor: pointer;
    }
  }
`;
const TextoTalking = styled.p`
  width: 100%;
  padding: 2px;
  color: white;
`;
const CajaLike = styled.div`
  width: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: ease all 0.2s;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-bottom: 4px;
  font-size: 1.2rem;
  &:hover {
    /* background-color: ${ClearTheme.secondary.AzulOscSemiTransp}; */
    /* border: 1px solid ${Tema.primary.azulBrillante}; */
    /* border: 1px solid; */
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
const TituloTalks = styled.h3`
  width: 100%;
  text-align: center;
  padding-top: 8px;
  color: white;
  font-weight: 400;
  text-decoration: underline;
  color: ${ClearTheme.complementary.warning};
`;
const CajaSpeech = styled.div`
  padding: 8px 12px;
  /* border: 1px solid white; */
  display: flex;
`;
const WrapAvatar = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 80px;
  margin-right: 4px;
`;
const AvatarPerfil2 = styled(AvatarPerfil)``;
const NombreUser = styled.h2`
  color: white;
  font-weight: 400;
  font-size: 16px;
`;
const NombreUserHecha = styled.p`
  font-size: 12px;
  color: white;
  font-weight: 400;
  text-align: center;
`;
const WrapText = styled.div`
  width: 80%;
  position: relative;
`;
const TextArea2 = styled(TextArea)`
  /* width: 80%; */
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: 80px;
  min-width: 40px;
`;
const EnlacesPerfil2 = styled(EnlacesPerfil)`
  &:hover {
    text-decoration: none;
    img {
      border: none;
    }
  }
`;

const Tooltip = styled.div`
  position: fixed;
  top: ${(props) => props.y}px;
  left: ${(props) => props.x}px;
  background-color: black;
  color: white;
  padding: 5px 10px;
  border-radius: 5px;
  pointer-events: none;
  white-space: nowrap;
  z-index: 1000;
  transition: opacity 0.2s;
  opacity: ${(props) => (props.visible ? 1 : 0)};
  transform: translate(-100%, 10px);
`;
const TextToolTip = styled.p`
  margin: 0;
  font-size: 14px;
`;
const CajaEmoji = styled.div`
  width: 30px;
  position: absolute;
  right: 2px;
  top: 50%;
  transform: translate(0, -50%);
`;
const EmojiImg = styled.img`
  width: 100%;
  cursor: pointer;
  border: 1px solid transparent;
  /* padding: 4px; */
  &:hover {
    border: 1px solid white;
  }
`;
const CajaTutorial = styled.div`
  padding: 6px;
  background-color: black;
  color: white;
  position: relative;
`;
const TextoTutorial = styled.p`
  color: white;
`;
const ListaDesordenada = styled.ol`
  padding-left: 25px;
`;
const Elemento = styled.li``;
const ImgTeclado = styled.img`
  width: 100%;
`;
const Xcerrar = styled.p`
  position: absolute;
  right: 4px;
  top: 4px;
  font-size: 1.4rem;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid white;
    cursor: pointer;
  }
`;
