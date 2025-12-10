import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import { personSchema } from "../../../models/mixSchema";
import { AvatarPerfil } from "../../../components/JSXElements/ImgJSX";
import { ClearTheme } from "../../../config/theme";
import { EnlacesPerfil } from "../../../components/JSXElements/Enlace";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHeart as faHeartBold } from "@fortawesome/free-solid-svg-icons";
import { faHeart as faHeartLigero } from "@fortawesome/free-regular-svg-icons";
import { useLocation } from "react-router-dom";
import { Header } from "../../../components/Header";

import { ES6AFormat, hoyManniana } from "../../../libs/FechaFormat";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { useDocById } from "../../../libs/useDocByCondition";
import avatarMale from "./../../../../public/img/avatares/avatarMale.png";
import avatarFemale from "./../../../../public/img/avatares/avatarFemale.png";

import { Alerta } from "../../../components/Alerta";
import { likeSchema } from "../../../models/likeSchema";
import { BotonQuery } from "../../../components/BotonQuery";
import { notificacionesLocalSchema } from "../../../models/notificacionesLocalSchema";
import { TextArea } from "../../../components/InputGeneral";
import ImgHappy from "./../../../../public/img/icon/feliz.png";
import ImgTecladoPNG from "./../../../../public/img/icon/teclado2.png";
import { generarUUID } from "../../../libs/generarUUID";
import { commentSchema } from "../../../models/commentSchema";
// import avatarFemale from './../../../../'
export default function DatosCuriosos({ userMaster }) {
  // ******************** RECURSOS GENERALES ********************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const location = useLocation().pathname;
  const [pathCurioso, setPathCurioso] = useState(false);

  useEffect(() => {
    setPathCurioso(location == "/curioso");
  }, [location]);

  // *************** LLAMADA A LA BASE DE DATOS ***************

  const [objetoDatos, setObjetoDatos] = useState({ array: [] });
  const [datoSelect, setDatosSelect] = useState(null);
  useDocById("miscelaneo", setObjetoDatos, "datosCuriosos");
  const SEMANAS = [
    {
      nombre: "semana1",
      num: 1,
      fechaInicial: new Date("2025-09-02T00:00:00"),
      fechaFinal: new Date("2025-09-08T23:59:59"),
    },
    {
      nombre: "semana2",
      num: 2,
      fechaInicial: new Date("2025-09-09T00:00:00"),
      fechaFinal: new Date("2025-09-15T23:59:59"),
    },
    {
      nombre: "semana3",
      num: 3,
      fechaInicial: new Date("2025-09-16T00:00:00"),
      fechaFinal: new Date("2025-09-22T23:59:59"),
    },
    {
      nombre: "semana4",
      num: 4,
      fechaInicial: new Date("2025-09-23T00:00:00"),
      fechaFinal: new Date("2025-09-29T23:59:59"),
    },
    {
      nombre: "semana6",
      num: 6,
      fechaInicial: new Date("2025-09-30T00:00:00"),
      fechaFinal: new Date("2025-10-06T23:59:59"),
    },
    {
      nombre: "semana7",
      num: 7,
      fechaInicial: new Date("2025-10-07T00:00:00"),
      fechaFinal: new Date("2025-10-13T23:59:59"),
    },
  ];

  const [likeToMe, setLikeToMe] = useState(false);
  useEffect(() => {
    if (objetoDatos.array.length > 0 && userMaster?.id) {
      const fechaActual = new Date();
      const semanaSelect = SEMANAS.find((semana) => {
        if (
          semana.fechaInicial < fechaActual &&
          semana.fechaFinal > fechaActual
        ) {
          return semana;
        }
      });
      console.log(objetoDatos);
      const datoSelectAux = objetoDatos.array.find(
        (dato) => dato.num == semanaSelect.num
      );
      setDatosSelect({
        ...datoSelectAux,
        comentarios: datoSelectAux.comentarios.filter(
          (comment) => comment.estadoDoc == 0
        ),
      });
      console.log(datoSelectAux);
      const likeToMeAux = datoSelectAux.likes.find(
        (like) => like.usuarioCreador.id == userMaster.id
      );
      setLikeToMe(likeToMeAux);
    }
  }, [objetoDatos, userMaster]);

  // configuracion semanas

  console.log(SEMANAS);
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

  const likeToRun = (curiosidad) => {
    try {
      //  Saber si ya este usuario le habia dado like
      const likesUp = curiosidad.likes;
      const docActualizar = doc(db, "miscelaneo", "datosCuriosos");

      const likeThisUser = likesUp.find(
        (like) => like.usuarioCreador.userName == userMaster.userName
      );
      if (likeThisUser) {
        console.log("existia");
        const likesSinThisUser = likesUp.filter(
          (like) => like.usuarioCreador.userName != userMaster.userName
        );
        console.log(objetoDatos);
        const arryUpDatoCurioso = objetoDatos.array.map((dato) => {
          console.log(dato.num);
          console.log(curiosidad.num);
          if (dato.num == curiosidad.num) {
            return {
              ...dato,
              likes: likesSinThisUser,
            };
          } else {
            return { ...dato };
          }
        });

        updateDoc(docActualizar, {
          array: arryUpDatoCurioso,
        });
      } else {
        console.log("no existia");
        const batch = writeBatch(db);

        const nuevoLike = {
          ...likeSchema,
          createdAt: ES6AFormat(new Date()),
          createdBy: userMaster.userName,
          //likeCurious-Like a dato curioso
          tipoDoc: "likeCurious",
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
            genero: userMaster.genero,
          },
        };
        likesUp.push(nuevoLike);

        const arryUpDatoCurioso = objetoDatos.array.map((dato) => {
          if (dato.num == curiosidad.num) {
            return {
              ...dato,
              likes: likesUp,
            };
          } else {
            return { ...dato };
          }
        });
        //
        //
        batch.update(docActualizar, {
          array: arryUpDatoCurioso,
        });
        // ******* Crea la notificacion *******
        const nuevaNotificacion = {
          ...notificacionesLocalSchema,
          estadoDoc: 0,
          createdAt: ES6AFormat(new Date()),
          createBy: userMaster.userName,
          tipoDoc: "likeCurious",
          enlace: "/curioso",
          texto: "pro",
          textEnd: " ha recibido un me gusta.",
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
            nombre: datoSelect.usuario.nombre,
            apellido: datoSelect.usuario.apellido,
            id: datoSelect.usuario.id,
            genero: datoSelect.usuario.genero,
            userName: datoSelect.usuario.userName,
            urlFotoPerfil: datoSelect.usuario.urlFotoPerfil,
            dpto: datoSelect?.usuario?.dpto || "",
          },
        };
        console.log(datoSelect);
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

  // *************** COMENTANDO *******
  const [mostrarSpeech, setMostrarSpeech] = useState(false);
  const [tutorial, setTutorial] = useState(false);
  const textAreaRef = useRef(null);
  const [reviewText, setReviewText] = useState("");
  const enviarComment = async () => {
    if (!userMaster) {
      return;
    }
    try {
      const batch = writeBatch(db);
      const docActualizar = doc(db, "miscelaneo", "datosCuriosos");
      const newCommet = {
        ...commentSchema,
        id: generarUUID(),
        createdAt: ES6AFormat(new Date()),
        createdBy: userMaster.userName,
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
      const commentsThisDato = datoSelect.comentarios || [];

      commentsThisDato.push(newCommet);
      const arrayDatosUp = objetoDatos.array.map((dato) => {
        console.log(dato);
        console.log(datoSelect);
        if (dato.num == datoSelect.num) {
          return {
            ...dato,
            comentarios: commentsThisDato,
          };
        } else {
          return {
            ...dato,
          };
        }
      });
      batch.update(docActualizar, {
        array: arrayDatosUp,
      });
      setReviewText("");
      // ******* Crea la notificacion *******
      const nuevaNotificacion = {
        ...notificacionesLocalSchema,
        estadoDoc: 0,
        createdAt: ES6AFormat(new Date()),
        createBy: userMaster.userName,
        tipoDoc: "commentCurious",
        enlace: "/curioso",
        texto: "pro",
        textEnd: " ha recibido un comentario.",
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
          nombre: datoSelect.usuario.nombre,
          apellido: datoSelect.usuario.apellido,
          id: datoSelect.usuario.id,
          genero: datoSelect.usuario.genero,
          userName: datoSelect.usuario.userName,
          urlFotoPerfil: datoSelect.usuario.urlFotoPerfil,
          dpto: datoSelect?.usuario?.dpto || "",
        },
      };
      console.log(datoSelect);
      const collecionNotifiLocal = collection(db, "notificacionesLocal");
      const notificacionRef = doc(collecionNotifiLocal);
      batch.set(notificacionRef, nuevaNotificacion);

      await batch.commit();
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };

  // Comentarios
  const editComment = async (comment) => {
    const comentariosParsed = datoSelect.comentarios.map((comentario) => {
      return {
        ...comentario,
        editable: comentario.id == comment.id,
        valueEditable: comentario.texto,
      };
    });

    setDatosSelect({
      ...datoSelect,
      comentarios: comentariosParsed,
    });
  };
  const cancelarEdicion = async (comment) => {
    const comentariosParsed = datoSelect.comentarios.map((comentario) => {
      return {
        ...comentario,
        editable: false,
        valueEditable: "",
      };
    });

    setDatosSelect({
      ...datoSelect,
      comentarios: comentariosParsed,
    });
  };
  const handleEditReview = (e, opinion) => {
    const { value } = e.target;
    const comentariosParsed = datoSelect.comentarios.map((comentario) => {
      return {
        ...comentario,
        valueEditable: value,
      };
    });

    setDatosSelect({
      ...datoSelect,
      comentarios: comentariosParsed,
    });
  };
  const guardarEdicion = async (comment) => {
    if (!userMaster) {
      return;
    }
    try {
      const batch = writeBatch(db);
      const docActualizar = doc(db, "miscelaneo", "datosCuriosos");

      const commentsThisDato = datoSelect.comentarios.map((comentario) => {
        if (comentario.id == comment.id) {
          return {
            ...comentario,
            editable: false,
            texto: comentario.valueEditable,
            valueEditable: "",
          };
        } else {
          return { ...comentario };
        }
      });
      const arrayDatosUp = objetoDatos.array.map((dato) => {
        console.log(dato.num);
        console.log(datoSelect.num);
        if (dato.num == datoSelect.num) {
          console.log(3333);
          return {
            ...dato,
            comentarios: commentsThisDato,
          };
        } else {
          return {
            ...dato,
          };
        }
      });
      batch.update(docActualizar, {
        array: arrayDatosUp,
      });
      await batch.commit();
      setReviewText("");
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  const eliminarComment = async (comment) => {
    try {
      const batch = writeBatch(db);
      const docActualizar = doc(db, "miscelaneo", "datosCuriosos");
      const commentsThisDato = datoSelect.comentarios.map((comentario) => {
        if (comentario.id == comment.id) {
          return {
            ...comentario,
            estadoDoc: 1,
          };
        } else {
          return { ...comentario };
        }
      });
      const arrayDatosUp = objetoDatos.array.map((dato) => {
        console.log(dato.num);
        console.log(datoSelect.num);
        if (dato.num == datoSelect.num) {
          console.log(3333);
          return {
            ...dato,
            comentarios: commentsThisDato,
          };
        } else {
          return {
            ...dato,
          };
        }
      });
      batch.update(docActualizar, {
        array: arrayDatosUp,
      });
      await batch.commit();
    } catch (error) {
      console.error(error);
      setMensajeAlerta("Error en la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
    }
  };
  return (
    datoSelect && (
      <>
        {pathCurioso && <Header titulo="Datos curiosos" />}
        {/* <BtnGeneralButton onClick={() => cargarDataCuriosa()}>
          Enviar
        </BtnGeneralButton> */}
        <TarjetaDoc>
          <TituloMain>
            Nuestro TMS ha cumplido 5 meses. Hemos analizado sus primeras 1,500
            solicitudes y queremos compartir contigo algunos datos curiosos.
          </TituloMain>
          <Card>
            <CajaInterna className="avatar">
              <EnlaceP
                target="_blank"
                to={"/perfiles/" + datoSelect.usuario.userName}
              >
                <Avatar
                  className="xxSmall"
                  src={
                    datoSelect.usuario.urlFotoPerfil
                      ? datoSelect.usuario.urlFotoPerfil
                      : datoSelect.usuario.genero == "femenino"
                        ? avatarFemale
                        : avatarMale
                  }
                />
                <Nombre>
                  {datoSelect.usuario.nombre +
                    " " +
                    datoSelect.usuario.apellido}
                </Nombre>
              </EnlaceP>
            </CajaInterna>
            <CajaInterna className="contenido">
              <Titulo>{datoSelect.titulo}</Titulo>
              <Texto>{datoSelect.texto}</Texto>
              <CajaResponder>
                <ParrafoTexto
                  onClick={() => setMostrarSpeech(true)}
                  className="funcion"
                >
                  Comentar
                </ParrafoTexto>
              </CajaResponder>
            </CajaInterna>
            <CajaInterna className="like">
              <CajaLike>
                <Icono
                  onClick={() => likeToRun(datoSelect)}
                  icon={likeToMe ? faHeartBold : faHeartLigero}
                  className={likeToMe && "white"}
                />
                <QtyLike
                  onMouseEnter={(e) => handleMouseEnter(e, datoSelect)}
                  onMouseMove={handleMouseMove}
                  onMouseLeave={handleMouseLeave}
                  className={datoSelect.likes.length > 0 && "dinamic"}
                >
                  {datoSelect.likes.length}
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
            </CajaInterna>
          </Card>
          {datoSelect.comentarios.length > 0 && (
            <CajaComentarios>
              {datoSelect.comentarios.map((coment, index) => {
                return (
                  <CardComment key={index}>
                    <InternaComment className="avatar">
                      <EnlacesPerfil2
                        target="_blank"
                        to={"/perfiles/" + coment.usuario.userName}
                      >
                        <AvatarPerfil2
                          src={
                            coment.usuario.urlFotoPerfil
                              ? coment.usuario.urlFotoPerfil
                              : coment.usuario.genero == "femenino"
                                ? avatarFemale
                                : avatarMale
                          }
                          className="xxxSmall"
                        />
                        <NombreComment>
                          {coment.usuario.nombre +
                            " " +
                            coment.usuario.apellido}
                        </NombreComment>
                      </EnlacesPerfil2>
                    </InternaComment>
                    <InternaComment className="contenido">
                      <CajaTexto>
                        {coment.editable ? (
                          <TextArea2
                            className="comment"
                            value={coment.valueEditable}
                            onChange={(e) => handleEditReview(e, coment)}
                          />
                        ) : (
                          <TextoTalking>{coment.texto}</TextoTalking>
                        )}
                      </CajaTexto>
                      <CajaResponder className="comment">
                        <ParrafoTexto>
                          {hoyManniana(coment.createdAt, true)}
                        </ParrafoTexto>
                        {userMaster.userName === coment.createdBy && (
                          <>
                            {coment.editable ? (
                              <>
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => {
                                    guardarEdicion(coment);
                                  }}
                                >
                                  Guardar
                                </ParrafoTexto>
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => {
                                    cancelarEdicion(coment);
                                  }}
                                >
                                  Cancelar
                                </ParrafoTexto>
                              </>
                            ) : (
                              <>
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => {
                                    editComment(coment);
                                  }}
                                >
                                  Editar
                                </ParrafoTexto>
                                <ParrafoTexto
                                  className="funcion"
                                  onClick={() => eliminarComment(coment)}
                                >
                                  Eliminar
                                </ParrafoTexto>
                              </>
                            )}
                          </>
                        )}

                        {/* <ParrafoTexto>Responder</ParrafoTexto>
                                              <ParrafoTexto>Ver 35 respuestas</ParrafoTexto> */}
                      </CajaResponder>
                    </InternaComment>
                  </CardComment>
                );
              })}
            </CajaComentarios>
          )}
          <br />

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

          {mostrarSpeech && (
            <CajaSpeech>
              <WrapAvatar>
                <AvatarPerfil2
                  src={userMaster?.urlFotoPerfil}
                  className="xxxSmall"
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
              <BtnSimple onClick={() => enviarComment()}>Enviar</BtnSimple>
            </CajaSpeech>
          )}
        </TarjetaDoc>
        <BotonQuery datoSelect={datoSelect} />
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
const TarjetaDoc = styled.div`
  border: 1px solid white;
  width: 85%;
  margin: auto;
  border-radius: 10px;
  margin-bottom: 35px;
  padding: 20px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
  h4 {
    color: white;
    text-align: end;
    font-weight: lighter;
    font-size: 1.2rem;
  }
  &.home {
    height: 500px;
    overflow-x: hidden;
    overflow-y: scroll;
  }

  @media screen and (max-width: 620px) {
    width: 100%;
  }
`;
const Card = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  border: 1px solid white;
  border-radius: 8px;
  overflow: hidden;
  box-shadow: ${ClearTheme.config.sombra};
`;
const CajaInterna = styled.div`
  height: 100%;
  &.avatar {
    width: 150px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &.like {
    width: 50px;
    /* border: 1px solid red; */
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }
  &.contenido {
    width: calc(100% - 200px);
    height: 100%;
  }
`;
const Avatar = styled(AvatarPerfil)``;
const Nombre = styled.h2`
  color: white;
  font-size: 16px;
  font-weight: 400;
`;
const EnlaceP = styled(EnlacesPerfil)`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  border: 1px solid ${ClearTheme.primary.azulBrillante};
  border-radius: 0;
  img {
    border: 2px solid transparent;
  }
`;
const Titulo = styled.h2`
  color: white;
  width: 100%;
  font-weight: 400;
  height: 25px;
  /* border: 1px solid red; */
  text-decoration: underline;
  text-align: center;
  padding: 2px 4px;
  font-size: 18px;
  color: ${ClearTheme.complementary.warning};
`;
const Texto = styled.p`
  color: white;
  width: 100%;
  padding: 0 15px;
  height: calc(100% - 25px - 30px);
  overflow-y: auto;
  font-size: 14px;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-bottom: 4px;
  font-size: 1.2rem;
  &:hover {
    color: white;
  }
  cursor: pointer;
  &.white {
    color: white;
  }
`;

const CajaLike = styled.div`
  width: 35px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: ease all 0.2s;
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

const CajaResponder = styled.div`
  width: 100%;
  min-height: 25px;
  display: flex;

  /* justify-content: center; */
  &.comment {
    min-height: auto;
    height: 20px;
  }
`;

const ParrafoTexto = styled.p`
  margin-right: 8px;
  font-size: 13px;
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
const TituloMain = styled.h2`
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
  margin-bottom: 4px;
  font-size: 18px;
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
  font-size: 14px;
`;

const WrapText = styled.div`
  width: 80%;
  position: relative;
`;
const TextArea2 = styled(TextArea)`
  /* width: 80%; */
  min-height: 20px;
  height: 100%;
  &.comment {
    border-radius: 0;
    height: 100%;
    max-height: 1000px;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: 80px;
  min-width: 40px;
`;
const EnlacesPerfil2 = styled(EnlacesPerfil)`
  display: flex;
  justify-content: center;
  flex-direction: column;
  border-radius: 0;
  align-items: center;
  &:hover {
    text-decoration: none;
    img {
      border: none;
    }
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

const CajaComentarios = styled.div`
  width: 80%;
  margin: auto;
  min-height: 100px;
  border-left: 1px solid white;
  border-right: 1px solid white;
  border-bottom: 1px solid white;
  border-radius: 0 0 6px 6px;
  padding: 8px;
`;
const CardComment = styled.div`
  height: 90px;
  border: 1px solid black;
  border-radius: 6px;
  display: flex;
  overflow: hidden;
`;
const InternaComment = styled.div`
  height: 100%;
  &.avatar {
    width: 100px;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
  }
  &.contenido {
    width: calc(100% - 100px);
    border-left: 1px solid black;
    /* padding: 4px; */
  }
`;
const NombreComment = styled.p`
  color: white;
  font-size: 12px;
`;

const CajaTexto = styled.div`
  width: 100%;
  height: calc(100% - 20px);
`;

const TextoTalking = styled.p`
  width: 100%;
  padding: 2px;
  color: white;
`;
