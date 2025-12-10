// La funcion de este componente es que el usuario no tiene su sesion iniciada sea dirigido a la pagina acceder

import styled from "styled-components";
import { Alerta } from "../components/Alerta";
import { AvisoCaja } from "../components/Avisos/AvisoCaja";
import { useAuth } from "./AuthContext";
import { Navigate, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { sendEmailVerification, signOut } from "firebase/auth";
import { autenticar } from "../firebase/firebaseConfig";

export const RutaProtegida = ({ children }) => {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const location = useLocation();
  const { usuario } = useAuth();
  const ruta = location.pathname;
  const navegacion = useNavigate();

  // Si el usuario existe
  // if (usuario || ruta == "/perfil") {

  if (usuario) {
    if (usuario.emailVerified) {
      // if (usuario) {
      return children;
    } else {
      const confirmarEmail = () => {
        console.log(usuario);
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
      return (
        <>
          <CajaAviso>
            <AvisoCaja
              titulo={"Confirmar correo"}
              texto={`Caeloss necesita confirmar que eres el propietario del email ${usuario.email}, para ello haz click en enviar enlace, y Caeloss te enviará un enlace a tu email, luego haz click en ese enlace para concluir el proceso.`}
              textoCTA={"Enviar enlace"}
              funcionCTA={confirmarEmail}
              textoCTA2={"Cerrar sesion"}
              funcionCTA2={cerrarSesion}
            />
          </CajaAviso>
          <Alerta
            estadoAlerta={dispatchAlerta}
            tipo={tipoAlerta}
            mensaje={mensajeAlerta}
          />
        </>
      );
    }
  } else {
    return <Navigate replace to="/acceder" />;
  }
};
const CajaAviso = styled.div`
  padding: 15px;
`;
