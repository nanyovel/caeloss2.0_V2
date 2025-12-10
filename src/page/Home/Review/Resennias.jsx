import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

import { NavLink } from "react-router-dom";
// import imgJeni from '../../public/img/avatares/jenifer1.png';

import { format } from "date-fns";
import { es } from "date-fns/locale";
import avatarMale from "./../../../../public/img/avatares/maleAvatar.svg";
import { addDoc, collection, doc, updateDoc } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig.js";

import { ClearTheme, Tema, Theme } from "../../../config/theme.jsx";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton.jsx";
import { Alerta } from "../../../components/Alerta.jsx";
import { BtnNormal } from "../../../components/BtnNormal.jsx";
import { Advertencia } from "../../../components/Advertencia.jsx";
import { fetchDocsByConditionGetDocs } from "../../../libs/useDocByCondition.js";
import { useAuth } from "../../../context/AuthContext.jsx";

export const Resennias = ({
  dbUsuario,
  inicio,
  userMaster,
  dbResennias,
  setDBResennias,
  setDBUsuario,
}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // Advertencias
  const [tipoAdvertencia, setTipoAdvertencia] = useState("");
  const [mensajeAdvertencia, setMensajeAdvertencia] = useState("");
  const [dispatchAdvertencia, setDispatchAdvertencia] = useState(false);
  const [eventFunction, setEventFunction] = useState("");
  const [functAEjecutar, setFunctAEjecutar] = useState("");

  // // *************** FUNCION INTERMEDIARIA ADVERTENCIA ****************** //
  const funcionAdvert = (e) => {
    setTipoAdvertencia("warning");
    setMensajeAdvertencia("¿Seguro que desea eliminar esta reseña?");
    setDispatchAdvertencia(true);
    setEventFunction(e);
    setFunctAEjecutar("eliminarDoc");
  };

  const botonAgrearRef = useRef(null);
  const cajaResenniaRef = useRef(null);

  const [editableResennias, setEditableResenias] = useState([]);
  const [masterResennia, setMasterResennia] = useState([]);

  useEffect(() => {
    // Ordenar el array de reseñas por fecha
    function compararFechas(a, b) {
      return a.fecha - b.fecha;
    }
    if (dbResennias && dbUsuario) {
      const dbResenniaES6 = dbResennias.map((rese) => {
        const annio = rese.fecha.slice(6, 10);
        const mes = rese.fecha.slice(3, 5);
        const dia = rese.fecha.slice(0, 2);
        let hora = rese.fecha.slice(11, 13);
        let minutos = rese.fecha.slice(14, 16);
        let segundos = rese.fecha.slice(17, 19);
        const tipo = rese.fecha.slice(24, 27);

        if (hora != 12) {
          if (tipo == "pm" || tipo == "PM") {
            hora = Number(hora) + 12;
          }
        }
        if (hora == 12) {
          if (tipo == "am" || tipo == "AM") {
            hora = 0;
          }
        }

        const fechaES6 = new Date(annio, mes - 1, dia, hora, minutos, segundos);

        return {
          ...rese,
          fecha: fechaES6,
        };
      });
      // Ordenala de fecha mas antigua a mas reciente
      const resenniasOrdenada = dbResenniaES6.sort(compararFechas);

      // Convierte todas las fechas en string entendible
      const resenniasParsed = resenniasOrdenada.map((resen) => {
        return {
          ...resen,
          fecha: format(resen.fecha, `dd/MM/yyyy hh:mm:ss:SSS aa`, {
            locale: es,
          }),
        };
      });

      // Actualizar el estado y colocale Hoy o Ayer segun corresponda

      const reseFinal = resenniasParsed.map((resen) => {
        // let fecha ="01/05/2024 12:00:00:000 AM";

        // Saber si corresponde hoy o ayer o fecha literar

        // --------FECHA RESEÑAS--------
        let fechaResenniaString = resen.fecha;

        // Dividir la cadena en partes utilizando "/" y " " como delimitadores
        let partesResennia = fechaResenniaString.split(/[/\s:]+/);

        // Obtener los elementos correspondientes del array resultante
        let diaResen = partesResennia[0];
        let mesResen = partesResennia[1];
        let annioResen = partesResennia[2];

        let fechaResenniaES6 = new Date(
          Number(annioResen),
          Number(mesResen) - 1,
          Number(diaResen)
        );

        // --------FECHA ACTUAL--------
        let fechaActualString = format(
          new Date(),
          `dd/MM/yyyy hh:mm:ss:SSS aa`,
          { locale: es }
        );
        let partesString = fechaActualString.split(/[/\s:]+/);

        let diaActual = partesString[0];
        let mesActual = partesString[1];
        let annioActual = partesString[2];

        let fechaActualES6 = new Date(
          Number(annioActual),
          Number(mesActual) - 1,
          Number(diaActual)
        );

        let stringMostrar = resen.fecha.slice(0, 10);

        // Si la fecha es hoy
        if (fechaActualES6.getTime() == fechaResenniaES6.getTime()) {
          stringMostrar =
            "Hoy" +
            " " +
            resen.fecha.slice(11, 16) +
            " " +
            resen.fecha.slice(-2).toLowerCase();
        }

        // Si la fecha fue ayer
        let fechaResenniasMas1Dia = new Date(
          fechaResenniaES6.getFullYear(),
          fechaResenniaES6.getMonth(),
          fechaResenniaES6.getDate() + 1
        );
        if (fechaActualES6.getTime() == fechaResenniasMas1Dia.getTime()) {
          stringMostrar =
            "Ayer" +
            " " +
            resen.fecha.slice(11, 16) +
            " " +
            resen.fecha.slice(-2).toLowerCase();
        }

        return {
          ...resen,
          fechaMostrar: stringMostrar,
        };
      });

      const listaResenniaAux = reseFinal.map((rese) => {
        const userRe = dbUsuario.find((user) => {
          if (user.userName == rese.user) {
            return user;
          }
        });

        if (userRe) {
          return {
            ...rese,
            nombreUsuario: userRe.nombre,
            apellidoUsuario: userRe.apellido,
            avatar: userRe.urlFotoPerfil,
            editando: false,
          };
        } else {
          return {
            ...rese,
            editando: false,
          };
        }
      });

      setMasterResennia(listaResenniaAux);
      setEditableResenias(listaResenniaAux);
    }
  }, [dbResennias, dbUsuario]);

  const [valorComentario, setValorComentario] = useState("");

  const handleInput = (e) => {
    const id = e.target.dataset.id;
    const { value, name } = e.target;

    // Nuevo comentario
    if (name == "valorComentario") {
      setValorComentario(e.target.value);
    }

    // Editando comentario ya existente
    if (name == "editando") {
      setMasterResennia((prevState) =>
        prevState.map((resennia) =>
          resennia.id === id
            ? {
                ...resennia,
                texto: value,
              }
            : resennia
        )
      );
    }
  };

  const cargarResennia = async () => {
    if (userMaster) {
      if (valorComentario == "") {
        setMensajeAlerta("Aun no escribe la reseña.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      }
      if (valorComentario) {
        const objetoEnviar = {
          fecha: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
            locale: es,
          }),
          texto: valorComentario,
          user: userMaster.userName,
          nombreUsuario: userMaster.nombre,
          apellidoUsuario: userMaster.apellido,
          avatar: userMaster.urlFotoPerfil,
          editando: false,
          estadoDoc: 0,
        };

        const valorText = valorComentario;
        try {
          setValorComentario("");
          const idDoc = await addDoc(collection(db, "resennias"), objetoEnviar);

          setMasterResennia([
            ...masterResennia,
            { ...objetoEnviar, id: idDoc.id },
          ]);

          const container = cajaResenniaRef.current;
          if (container) {
            container.scrollTo({
              top: container.scrollHeight,
              behavior: "smooth",
            });
          }
        } catch (error) {
          setValorComentario(valorText);
          console.log(error);
          setMensajeAlerta("Error con la base de datos");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => {
            setDispatchAlerta(false);
          }, 3000);
        }
      }
    }
  };

  const eliminarResennia = async (e) => {
    const id = e.target.dataset.id;
    const index = e.target.dataset.index;

    const resenniaUpdate = doc(db, "resennias", id);

    setMasterResennia(
      masterResennia.map((rese, i) => {
        if (i == index) {
          console.log("paso");
          return {
            ...rese,
            estadoDoc: 2,
          };
        } else {
          return rese;
        }
      })
    );

    try {
      await updateDoc(resenniaUpdate, {
        estadoDoc: 2,
      });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  const editarResennia = (e) => {
    const id = e.target.dataset.id;

    setMasterResennia((prevState) =>
      prevState.map((resennia) =>
        resennia.id === id
          ? {
              ...resennia,
              editando: true,
            }
          : resennia
      )
    );
  };

  const cancelarEdicion = (e) => {
    const id = e.target.dataset.id;
    setMasterResennia(editableResennias);
  };

  const guardarEdicion = async (e) => {
    const id = e.target.dataset.id;
    const resenniaUpdate = doc(db, "resennias", id);

    const resenEditable = masterResennia.find((resen) => {
      if (resen.id == id) {
        return resen;
      }
    });
    setMasterResennia(
      masterResennia.map((preview) => {
        if (preview.id == id) {
          console.log(id);
          return { ...preview, editando: false };
        } else {
          return preview;
        }
      })
    );

    // console.log(id);

    // return;
    try {
      await updateDoc(resenniaUpdate, {
        texto: resenEditable.texto,
      });
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };
  const [ocultarPreview, setOcultarPreview] = useState(true);
  const userAuth = useAuth().usuario;

  const [usuario, setUsuario] = useState(userAuth);
  const mostrarTodas = async () => {
    if (usuario) {
      try {
        await fetchDocsByConditionGetDocs(
          "resennias",
          setDBResennias,
          "estadoDoc",
          "==",
          0
        );
        await fetchDocsByConditionGetDocs("usuarios", setDBUsuario);

        setOcultarPreview(false);
      } catch (error) {
        console.error("Error al obtener los documentos:", error);
      }
    }
  };

  return (
    <Container>
      {ocultarPreview && (
        <CajaModal className={Theme.config.modoClear ? "clearModern" : ""}>
          <BtnSimple onClick={() => mostrarTodas()}>Mostrar todas</BtnSimple>
        </CajaModal>
      )}
      <TarjetaDoc
        className={`
      ${inicio ? "home" : ""} 
      ${Theme.config.modoClear ? "clearModern" : ""} 
      `}
        ref={cajaResenniaRef}
      >
        <Titulos
          className={`
      
      ${Theme.config.modoClear ? "clearModern" : ""} 
      `}
        >
          Tu opinion ayudará a que Caeloss sea mejor.
        </Titulos>
        <CajaResenas>
          {masterResennia
            .filter((review) => review.estadoDoc == 0)
            .map((reseb, index) => {
              return (
                <CajaResena key={index}>
                  <CajaAvatar>
                    <Enlaces to={"/perfiles/" + reseb.user}>
                      <Avatar
                        className={reseb.avatar ? "" : "sinFoto"}
                        src={reseb.avatar ? reseb.avatar : avatarMale}
                      />
                    </Enlaces>
                  </CajaAvatar>
                  <CajaTextoResena>
                    <Enlaces to={"/perfiles/" + reseb.user}>
                      <NombreResena
                        className={`
                        
                        ${Theme.config.modoClear ? "clearModern" : ""} 
                        `}
                      >
                        {reseb.nombreUsuario
                          ? reseb.nombreUsuario + " " + reseb.apellidoUsuario
                          : reseb.user}
                      </NombreResena>
                    </Enlaces>

                    {reseb.editando ? (
                      // 7474
                      <InputSencillo
                        data-id={reseb.id}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          editando
                          
                          `}
                        name="editando"
                        value={masterResennia[index].texto}
                        onChange={(e) => handleInput(e)}
                      />
                    ) : (
                      <TextoResena
                        className={`
                        
                        ${Theme.config.modoClear ? "clearModern" : ""} 
                        `}
                      >
                        {reseb.texto}
                      </TextoResena>
                    )}
                    <FechaResennias
                      className={`
                        
                        ${Theme.config.modoClear ? "clearModern" : ""} 
                        `}
                    >
                      {reseb.fechaMostrar}
                    </FechaResennias>
                  </CajaTextoResena>
                  {dbResennias.length > 0 && (
                    <>
                      {reseb.user == userMaster.userName && (
                        <CajaBtn>
                          {reseb.editando == false ? (
                            <>
                              <BtnNormal
                                data-id={reseb.id}
                                data-index={index}
                                onClick={(e) => funcionAdvert(e)}
                                className="danger"
                              >
                                Eliminar
                              </BtnNormal>
                              <BtnNormal
                                data-id={reseb.id}
                                onClick={(e) => editarResennia(e)}
                              >
                                Editar
                              </BtnNormal>
                            </>
                          ) : (
                            <>
                              <BtnNormal
                                data-id={reseb.id}
                                onClick={(e) => cancelarEdicion(e)}
                                className="danger"
                              >
                                Cancelar
                              </BtnNormal>
                              <BtnNormal
                                data-id={reseb.id}
                                data-index={reseb.index}
                                onClick={(e) => guardarEdicion(e)}
                              >
                                Guardar
                              </BtnNormal>
                            </>
                          )}
                        </CajaBtn>
                      )}
                    </>
                  )}
                </CajaResena>
              );
            })}
        </CajaResenas>
        {userMaster ? (
          <>
            {userMaster.nombre ? (
              <>
                <CajaInputComentario>
                  <CajaInternaComentario>
                    {/* 787878 */}
                    <InputSencillo
                      type="text"
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      name="valorComentario"
                      placeholder="Indique su honesta opinión sobre el proyecto Caeloss."
                      value={valorComentario}
                      onChange={(e) => handleInput(e)}
                    />
                  </CajaInternaComentario>
                </CajaInputComentario>
                <CajaAddFrase>
                  <MasFraseBtn
                    onClick={(e) => cargarResennia(e)}
                    ref={botonAgrearRef}
                  >
                    Agregar reseña
                  </MasFraseBtn>
                </CajaAddFrase>
              </>
            ) : (
              <Contenedor>
                <Texto>
                  Para agregar una reseña necesitas al menos indicar tu nombre,
                  para completar tu perfil dirígete al menú lateral y en la
                  parte superior haz click en perfil, luego presiona el botón
                  editar.
                </Texto>
              </Contenedor>
            )}
          </>
        ) : (
          ""
        )}
      </TarjetaDoc>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />

      <Advertencia
        tipo={tipoAdvertencia}
        mensaje={mensajeAdvertencia}
        dispatchAdvertencia={dispatchAdvertencia}
        setDispatchAdvertencia={setDispatchAdvertencia}
        notificacionFinal={true}
        // Setting Function
        functAEjecutar={functAEjecutar}
        eventFunction={eventFunction}
        function2={eliminarResennia}
      />
    </Container>
  );
};

const Container = styled.div`
  position: relative;
`;
const CajaModal = styled.div`
  position: absolute;
  top: 0;
  z-index: 10;
  width: 100%;
  height: 100%;
  background-color: #000000ab;
  display: flex;
  justify-content: center;

  align-items: center;
  &.clearModern {
    background-color: #0000005e;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: auto;
  padding: 15px;
`;
const CajaResenas = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 20px;
`;

const CajaResena = styled.div`
  padding: 10px;
  display: flex;
  border-radius: 10px 0 10px 0;
  border: 1px solid transparent;
  transition: all ease 0.2s;
  &:hover {
    border: 1px solid ${Theme.primary.azulBrillante};
  }

  @media screen and (max-width: 780px) {
    flex-direction: column;
    align-items: center;
    border: 1px solid ${Tema.secondary.azulOpaco};
  }
`;
const Avatar = styled.img`
  width: 70px;
  height: 70px;
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  object-fit: contain;
  &.sinFoto {
    filter: grayscale(100%);
  }
  &:hover {
    cursor: pointer;
  }
`;
const CajaTextoResena = styled.div`
  display: flex;
  width: 100%;
  padding-left: 10px;
  flex-direction: column;
  justify-content: center;
  @media screen and (max-width: 780px) {
    padding-left: 0;
  }
`;

const NombreResena = styled.h2`
  color: #fff;
  color: ${Tema.primary.azulBrillante};
  font-size: 1rem;
  margin-bottom: 5px;
  &:hover {
    text-decoration: underline;
    cursor: pointer;
  }
  @media screen and (max-width: 780px) {
    text-align: center;
  }
  &.clearModern {
    color: ${Tema.primary.azulBrillante};
    color: white;
  }
`;
const TextoResena = styled.p`
  color: #fff;
  color: ${Tema.secondary.azulOpaco};
  margin-bottom: 8px;
  padding-left: 5px;
  &.clearModern {
    color: ${ClearTheme.secondary.azulOscuro};
    color: #282828;
  }
`;
const FechaResennias = styled.p`
  color: ${Tema.primary.grisNatural};
  font-size: 13px;
  padding-left: 5px;
  margin-bottom: 10px;
  &.clearModern {
    color: ${ClearTheme.secondary.azulOscuro};
    color: #3e3e3e;
  }
`;

const TarjetaDoc = styled.div`
  border: 1px solid black;
  width: 85%;
  margin: auto;
  border-radius: 10px;
  margin-bottom: 35px;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 20px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    /* height: 8px; */
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
    /* border: 1px solid black; */
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
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
  }
`;

const Titulos = styled.h3`
  font-size: 1.4rem;
  color: ${Tema.secondary.azulOpaco};

  border-bottom: 1px solid;
  margin-bottom: 10px;
  &.sugerencia {
    font-size: 1rem;
  }
  &.clearModern {
    color: #ffffff;
  }
`;

const MasFraseBtn = styled(BtnGeneralButton)`
  font-size: 1rem;
  width: auto;
  height: 35px;
  text-align: center;
`;

const CajaAddFrase = styled.div`
  width: 97%;
  display: flex;
  justify-content: center;
  margin: auto;
  margin-top: 20px;
  border-radius: 5px;
`;

const CajaInputComentario = styled.div`
  width: 100%;
  background-color: ${Tema.primary.grisNatural};
  border-radius: 5px;
  /* min-height: 55px; */
`;

const InputSencillo = styled.textarea`
  background-color: transparent;
  color: white;
  padding: 5px;
  resize: none;

  width: 100%;
  height: 90px;
  font-size: 1rem;

  text-align: start;
  align-items: center;
  outline: none;
  border: none;
  &.editando {
    border: 1px solid ${Tema.secondary.azulOpaco};
    background-color: ${Tema.secondary.azulGraciel};
    border-radius: 5px;
    color: ${Tema.primary.azulBrillante};
    &:focus {
      border: 1px solid ${Tema.primary.azulBrillante};
    }
  }
  &.clearModern {
    background-color: #b1c1ce;
    color: #2c2929;
    /* color: white; */
    font-family: inherit;
    padding: 4px;
  }
`;
const CajaInternaComentario = styled.div`
  position: relative;
  width: 100%;
`;
const Contenedor = styled.div`
  border: 1px solid ${Tema.complementary.warning};
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  padding: 20px;
  background-color: ${Tema.secondary.azulOlivo};
`;
const Texto = styled.h3`
  color: ${Tema.complementary.warning};
  font-weight: lighter;
`;
const CajaBtn = styled.div`
  display: flex;
  flex-direction: column;

  @media screen and (max-width: 780px) {
    flex-direction: row;
  }
  @media screen and (max-width: 350px) {
    flex-direction: column;
  }
`;

const CajaAvatar = styled.div`
  height: 80px;
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
