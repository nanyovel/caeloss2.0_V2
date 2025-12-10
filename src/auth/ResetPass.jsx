import { useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../config/theme.jsx";
import { BtnGeneralButton } from "../components/BtnGeneralButton";

import { Alerta } from "../components/Alerta";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { Header } from "../components/Header";
import { InputSimpleEditable } from "../components/InputGeneral.jsx";

export const ResetPass = () => {
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // ******************** ENVIANDO A LA BASE DE DATOS******************** //
  const auth = getAuth();
  auth.languageCode = "es";
  const usuario = auth.currentUser;

  const [correo, setCorreo] = useState("");

  // Reiniciar cuando el usuario tiene sesion iniciada
  const reiniciarPass = async () => {
    try {
      await sendPasswordResetEmail(auth, usuario.email);
      setMensajeAlerta("Enlace enviado.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  // Reiniciar cuando el usuario no tiene sesion iniciada
  const enviarLink = async (e) => {
    e.preventDefault();
    try {
      await sendPasswordResetEmail(auth, correo);
      setMensajeAlerta("Enlace enviado.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    }
  };

  return (
    <>
      <Header titulo="Reset password" />
      <Contenedor>
        <CajaTitulo>
          <TituloMain>Reiniciar contraseña</TituloMain>
        </CajaTitulo>
        {usuario ? (
          <UserIniciado>
            <CajaTexto>
              <CajaInterna>
                <TextoMensaje>
                  Si deseas reiniciar tu contraseña, haz click en el siguiente
                  botón y se te enviará un enlace a tu correo para restablecer.
                </TextoMensaje>
              </CajaInterna>
            </CajaTexto>
            <BtnSimple onClick={() => reiniciarPass()}>Enviar enlace</BtnSimple>
          </UserIniciado>
        ) : (
          <UserNoIniciado>
            <CajaInterna>
              <TextoMensaje>
                Para reestablecer contraseña, coloca tu correo y haz click en
                enviar, se te enviará un enlace de restablecimiento de
                contraseña.
              </TextoMensaje>
            </CajaInterna>
            <form onSubmit={(e) => enviarLink(e)}>
              <CajaInput>
                <Input
                  type="text"
                  name="correo"
                  value={correo}
                  onChange={(e) => setCorreo(e.target.value)}
                  placeholder="Correo"
                  autoComplete="off"
                />
              </CajaInput>

              <CajaTitulo className="cajaBoton">
                <BtnGeneralButton
                  // onClick={(e)=>handleSubmit(e)}
                  tipe="submit"
                >
                  Enviar
                </BtnGeneralButton>
              </CajaTitulo>
            </form>
          </UserNoIniciado>
        )}

        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </Contenedor>
    </>
  );
};
const UserNoIniciado = styled.div``;

const CajaInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 20px;
`;
const Input = styled(InputSimpleEditable)`
  height: 30px;
  outline: none;
  background-color: transparent;
  border: none;
  color: white;
  width: 60%;
  border-bottom: 2px solid white;
  border-radius: 0;
  padding: 10px;
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

const UserIniciado = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const CajaTitulo = styled.div`
  display: flex;
  justify-content: center;
  border-bottom: 2px solid ${Tema.primary.azulBrillante};
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
  height: 500px;
  margin: auto;
  padding: 25px;
  width: 90%;
  border: 1px solid black;
  border-radius: 10px;
  margin-top: 30px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(15px);
  border: 1px solid ${Tema.primary.azulBrillante};
  padding-top: 60px;
`;

const CajaTexto = styled.div`
  width: 90%;
  background-color: ${Tema.secondary.azulProfundo};
  margin: auto;
  padding: 20px;
  /* border: 1px solid ${Tema.primary.azulBrillante}; */
  border-radius: 10px 0 10px 0;
`;
const TextoMensaje = styled.h3`
  color: ${Tema.complementary.warning};
  font-weight: 400;
  font-size: 1rem;
`;
const CajaInterna = styled.div`
  border: 1px solid ${Tema.complementary.warning};
  padding: 10px;
  box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75);
  -webkit-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75);
  -moz-box-shadow: 1px 1px 2px 0px rgba(255, 184, 5, 0.75);
  margin-bottom: 25px;
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: auto;
  margin: auto;
`;
