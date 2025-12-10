import styled from "styled-components";
import { useEffect, useState } from "react";
import ImgEstrellaAmarilla from "../../../public/img/estrella.png";
import ImgEstrellaVacia from "../../../public/img/estrellaEnNegro.png";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { useNavigate, useParams } from "react-router-dom";

import db from "../../firebase/firebaseConfig";
import { doc, updateDoc } from "firebase/firestore";
import { Alerta } from "../../components/Alerta";
import { ES6AFormat } from "../../libs/FechaFormat";
import { CSSLoader } from "../../components/CSSLoader";
import { useAuth } from "../../context/AuthContext";
import { useDocByIdDangerous } from "../../libs/useDocByCondition";
import { Header } from "../../components/Header";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import { InputSimpleEditable, TextArea } from "../../components/InputGeneral";

export default function PageCalificar() {
  // *************** RECURSOS GENERALES  *****************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(true);

  // Si un usuario con sesion logeada trata de ingresar
  const { usuario } = useAuth();
  const navigate = useNavigate();
  const location = useParams();

  const [docUser, setDocUser] = useState(location.id);
  const [hasReview, setHasReview] = useState(false);
  const [qtyEstrella, setQtyEstrella] = useState(0);
  const [hasCalificacion, setHasCalificacion] = useState(true);
  const [datosParsed, setDatosParsed] = useState(false);

  const [reviewClienteDB, setReviewClienteDB] = useState(null);

  useEffect(() => {
    console.log(usuario);
    if (reviewClienteDB) {
      if (usuario) {
        navigate("/");
      }
    }
  }, [reviewClienteDB, usuario]);
  useDocByIdDangerous("reviewClientes", setReviewClienteDB, docUser);

  // /****** useEffect de reseñas de cliente */
  useEffect(() => {
    if (reviewClienteDB) {
      console.log(reviewClienteDB);
      if (reviewClienteDB.puntuacion > 0) {
        setHasReview(true);
      }
      setDatosParsed(true);
    }
  }, [reviewClienteDB]);

  const [inputValues, setInputValues] = useState({
    nombre: "",
    telefono: "",
    comentarios: "",
  });
  const handleInput = (e) => {
    const { name, value } = e.target;
    setInputValues({
      ...inputValues,
      [name]: value,
    });
  };
  const calificar = (e) => {
    const index = e.currentTarget.getAttribute("data-index");
    const indexParsed = Number(index);
    setQtyEstrella(indexParsed);
    setHasCalificacion(true);
  };
  const enviarResennia = async () => {
    if (qtyEstrella == 0) {
      setMensajeAlerta("Favor indicar calificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setHasCalificacion(false);
      return "";
    }
    if (inputValues.nombre == "") {
      setMensajeAlerta("Favor colocar su nombre.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    if (inputValues.telefono == "") {
      setMensajeAlerta("Debe colocar su numero de telefono.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    try {
      const docActualizar = doc(db, "reviewClientes", docUser);

      await updateDoc(docActualizar, {
        comentarios: inputValues.comentarios,
        nombre: inputValues.nombre,
        numero: inputValues.telefono,
        puntuacion: qtyEstrella,
        updatedAtCliente: ES6AFormat(new Date()),
      });
      setHasReview(true);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
  };
  return (
    <>
      <Header titulo="Sistema de gestion de transporte" />
      <CajaTitulo>
        <TextoTitulo>Sus comentarios nos ayudan a ser mejor.</TextoTitulo>
      </CajaTitulo>
      {hasReview == false && datosParsed ? (
        <Container>
          <CajaCliente>
            <CajitaDetalle className="cliente">
              <TituloDetalle className="cliente">Cliente:</TituloDetalle>
              <DetalleTexto className="cliente">
                {reviewClienteDB.cliente}
              </DetalleTexto>
            </CajitaDetalle>
            <CajitaDetalle className="cliente">
              <TituloDetalle className="cliente">Solicitud:</TituloDetalle>
              <DetalleTexto className="cliente">
                {reviewClienteDB.numeroSolicitud}
              </DetalleTexto>
            </CajitaDetalle>
          </CajaCliente>
          {/* <BotonQuery inputValues={inputValues} qtyEstrella={qtyEstrella} /> */}
          <CajaInterna
            className={`izquierda
                ${Theme.config.modoClear ? "clearModern" : ""}
                
                `}
          >
            <CajitaDetalle className="input">
              <TituloDetalle>Nombre:</TituloDetalle>
              <InputEditable
                className="clearModern input"
                type="text"
                value={inputValues.nombre}
                name="nombre"
                autoComplete="off"
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </CajitaDetalle>
            <CajitaDetalle className="input">
              <TituloDetalle>Telefono:</TituloDetalle>
              <InputEditable
                className="clearModern input"
                type="text"
                value={inputValues.telefono}
                name="telefono"
                autoComplete="off"
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </CajitaDetalle>
          </CajaInterna>
          <CajaInterna
            className={`derecha
            ${Theme.config.modoClear ? "clearModern" : ""}
            
            `}
          >
            <CajaDerechaInterna>
              <TituloH2>Calificacion:</TituloH2>

              {hasCalificacion == false && (
                <ParrafoMensaje>
                  Por favor seleccione una estrella, segun califique.
                </ParrafoMensaje>
              )}
              <WrapEstrellas>
                <CajitasEstrella
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onClick={(e) => calificar(e)}
                  data-index={1}
                >
                  <ImgSimple src={ImgEstrellaVacia} />
                  {qtyEstrella > 0 && (
                    <ImgSimple className="amarilla" src={ImgEstrellaAmarilla} />
                  )}
                  <TextoEstrella>Muy Malo 😡</TextoEstrella>
                </CajitasEstrella>
                <CajitasEstrella
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onClick={(e) => calificar(e)}
                  data-index={2}
                >
                  <ImgSimple src={ImgEstrellaVacia} />
                  {qtyEstrella > 1 && (
                    <ImgSimple className="amarilla" src={ImgEstrellaAmarilla} />
                  )}
                  <TextoEstrella>Malo 😠</TextoEstrella>
                </CajitasEstrella>
                <CajitasEstrella
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onClick={(e) => calificar(e)}
                  data-index={3}
                >
                  <ImgSimple src={ImgEstrellaVacia} />
                  {qtyEstrella > 2 && (
                    <ImgSimple className="amarilla" src={ImgEstrellaAmarilla} />
                  )}
                  <TextoEstrella>Regular 😐</TextoEstrella>
                </CajitasEstrella>
                <CajitasEstrella
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onClick={(e) => calificar(e)}
                  data-index={4}
                >
                  <ImgSimple src={ImgEstrellaVacia} />
                  {qtyEstrella > 3 && (
                    <ImgSimple className="amarilla" src={ImgEstrellaAmarilla} />
                  )}
                  <TextoEstrella>Bueno 🙂</TextoEstrella>
                </CajitasEstrella>
                <CajitasEstrella
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  onClick={(e) => calificar(e)}
                  data-index={5}
                >
                  <ImgSimple src={ImgEstrellaVacia} />
                  {qtyEstrella > 4 && (
                    <ImgSimple className="amarilla" src={ImgEstrellaAmarilla} />
                  )}
                  <TextoEstrella>Muy Bueno 😃</TextoEstrella>
                </CajitasEstrella>
              </WrapEstrellas>
            </CajaDerechaInterna>
            <CajaDerechaInterna>
              <TituloH2>Comentarios:</TituloH2>

              <TextArea2
                className={Theme.config.modoClear ? "clearModern" : ""}
                value={inputValues.comentarios}
                name="comentarios"
                placeholder="Opcional"
                onChange={(e) => {
                  handleInput(e);
                }}
              />
            </CajaDerechaInterna>
            <CajaBtn>
              <BtnSimple onClick={() => enviarResennia()}>Enviar</BtnSimple>
            </CajaBtn>
          </CajaInterna>
          <Alerta
            estadoAlerta={dispatchAlerta}
            tipo={tipoAlerta}
            mensaje={mensajeAlerta}
          />
        </Container>
      ) : hasReview == true && datosParsed ? (
        <ReviewLista>
          <TextoListo>Gracias por enviarnos sus observaciones.</TextoListo>
        </ReviewLista>
      ) : (
        <Container>
          <CajaResLista>
            <TextoCargando>Cargando...</TextoCargando>
            {isLoading ? (
              <CajaLoader>
                <CSSLoader />
              </CajaLoader>
            ) : (
              ""
            )}
          </CajaResLista>
        </Container>
      )}
    </>
  );
}

const Container = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  color: white;
  @media screen and (max-width: 620px) {
    margin-bottom: 150px;
  }
`;
const CajaInterna = styled.div`
  border: 1px solid ${Tema.neutral.blancoHueso};
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 10px;
  width: 60%;
  margin: auto;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(8px);
    border: 1px solid white;
  }
  &.izquierda {
    display: flex;
    justify-content: center;
  }
  &.derecha {
  }
  @media screen and (max-width: 640px) {
    width: 70%;
  }
  @media screen and (max-width: 570px) {
    width: 80%;
  }
  @media screen and (max-width: 500px) {
    width: 90%;
  }
`;

const InputCelda = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;
const InputEditable = styled(InputCelda)`
  height: 30px;
  width: 90%;

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
  &.input {
    min-width: 100%;
  }

  @media screen and (max-width: 420px) {
    width: 97%;
  }
`;
const TextArea2 = styled(TextArea)`
  outline: none;

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
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;
  margin: 0;
`;

const CajitaDetalle = styled.div`
  display: flex;
  justify-content: space-between;
  flex-direction: column;
  &.cliente {
    width: 300px;
    flex-direction: row;
    border-bottom: 1px solid ${Tema.primary.grisNatural};
  }
  &.input {
    width: 50%;
  }
`;

const TituloDetalle = styled.p`
  width: 50%;
  padding-left: 5px;
  text-align: start;
  &.cliente {
    width: auto;
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
  &.cliente {
    white-space: normal;
    height: 100%;
    text-overflow: clip;
    color: inherit;
    text-align: start;
  }
`;

const CajaDerechaInterna = styled.div``;
const TituloH2 = styled.h2`
  margin-bottom: 15px;
  text-decoration: underline;
`;
const WrapEstrellas = styled.div`
  display: flex;
  margin-bottom: 25px;
`;
const CajitasEstrella = styled.div`
  display: flex;
  /* justify-content: center; */
  align-items: center;
  flex-direction: column;
  border: 1px solid white;
  background-color: ${Tema.primary.azulOscuro};
  padding: 5px;
  /* margin-right: 5px; */
  position: relative;
  &:hover {
    cursor: pointer;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
  }
`;
const ImgSimple = styled.img`
  width: 40px;
  &.amarilla {
    position: absolute;
  }
`;

const TextoEstrella = styled.p`
  color: ${Tema.neutral.blancoHueso};
  color: white;
  font-size: 1rem;
  @media screen and (max-width: 1050px) {
    /* fon */
    font-size: 14px;
  }
  @media screen and (max-width: 700px) {
    /* fon */
    font-size: 12px;
  }
`;
const BtnSimple = styled(BtnGeneralButton)``;

const CajaTitulo = styled.div`
  padding: 10px;
  margin-bottom: 20px;
  color: white;
`;
const TextoTitulo = styled.h2`
  text-decoration: underline;
  color: inherit;
`;

const CajaBtn = styled.div`
  display: flex;
  justify-content: center;
`;
const ParrafoMensaje = styled.p`
  color: ${Tema.complementary.warning};
`;
const Span = styled.span`
  font-size: 1rem;
`;

const CajaResLista = styled.div`
  /* background-color: red; */
  border: 1px solid ${Tema.primary.azulBrillante};
  width: 100%;
  min-height: 60vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const TextoCargando = styled.h2`
  transform: translate(-10px);
  color: ${Tema.primary.azulBrillante};
`;

const ReviewLista = styled.div`
  width: 100%;
  min-height: 300px;
  /* background-color: red; */
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid ${Tema.primary.azulBrillante};
`;

const TextoListo = styled.h2`
  color: ${Tema.complementary.success};
  color: white;
  /* border: 1px solid blue; */
  text-align: center;
`;

const CajaCliente = styled.div`
  padding: 10px;
  display: flex;
  display: flex;
  flex-direction: column;
  width: auto;
  justify-content: center;
  align-items: center;
  background-color: ${ClearTheme.secondary.azulFrosting};
`;
