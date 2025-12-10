import React, { useEffect, useState } from "react";
import styled from "styled-components";
import logoCaeloss from "./../../public/img/logoOficial2.svg";
import { NavLink } from "react-router-dom";
import logoCielos2 from "./../../public/img/logo Cielos.png";
import { CardHome } from "./../components/CardHome";

import ImagenCardImportacion from "./../../public/img/cardHomeComp/import33.png";
import ImagenCardCalc from "./../../public/img/cardHome/calculadora.png";
import ImagenCardPatana from "./../../public/img/cardHome/patana.png";
import ImagenTMS from "./../../public/img/cardHomeComp/entregado.png";
import ImgPerdidaVentas from "./../../public/img/cardHomeComp/perdidaCash.png";
import { ElementoProtegido } from "./../context/ElementoProtegido";

import { Register } from "../auth/Register.jsx";
import { Login } from "../auth/Login.jsx";
import { AvisoTop } from "./../components/Avisos/AvisoTop.jsx";
import { sendEmailVerification } from "firebase/auth";
import { Alerta } from "../components/Alerta.jsx";
import Footer from "../components/Footer.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import { ClearTheme, Tema, Theme } from "../config/theme.jsx";
import { TutorialesParcial } from "./Home/tutoriales/TutorialesParcial.jsx";
import { Resennias } from "./Home/Review/Resennias.jsx";
import { DocumentacionParcial } from "./Home/documentacion/DocumentacionParcial.jsx";
import DatosCuriosos from "./Home/DatoCurioso/DatosCuriosos.jsx";
import ImgEase from "./../../public/img/easyFinish.png";

export const Home = ({
  usuario,
  dbUsuario,
  setDBTutoriales,
  dbTutoriales,
  userMaster,
  dbResennias,
  setDBResennias,
  setDBUsuario,
}) => {
  const userAuth = useAuth().usuario;
  useEffect(() => {
    document.title = "Caeloss - Home";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

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

  return (
    // // ******************** CONFIRMAR EMAIL ******************** //
    <>
      <CabezaHome className={Theme.config.modoClear ? "clearModern" : ""}>
        <CajaLogoCaeloss>
          <LogoC src={logoCaeloss} alt="" />
          <TituloMain>aeloss</TituloMain>
        </CajaLogoCaeloss>
        {usuario ? <LogoCielos src={logoCielos2} /> : null}
      </CabezaHome>

      <SeccionHome className="card">
        <div>
          <TituloModulo>Sistemas y apps:</TituloModulo>
        </div>
        <PadreTarjetas>
          <CardHome
            ImagenCard={ImagenCardCalc}
            titulo="Calculadora"
            title="Potente calculadora de materiales de construccion"
            ruta="/calculadora"
            bloqueado={!usuario?.emailVerified ? true : false}
          />
          <CardHome
            ImagenCard={ImagenCardPatana}
            titulo="Fletes"
            title="Calculadora avanzada de fletes"
            ruta="/fletes"
            bloqueado={!usuario?.emailVerified ? true : false}
          />
          {/* {userMaster?.userName == "jperez" && ( */}
          <CardHome
            ImagenCard={ImagenCardImportacion}
            titulo="Importaciones"
            title="Sistema moderno de gestion de importaciones"
            ruta="importaciones"
            bloqueado={!usuario?.emailVerified ? true : false}
          />
          {/* )} */}
          <CardHome
            ImagenCard={ImagenTMS}
            titulo="TMS"
            title="Sistema de gestion de transporte (Transport Management System  TMS)"
            ruta="transportes"
            incompleto={false}
            fijo={false}
            bloqueado={!usuario?.emailVerified ? true : false}
          />
          <CardHome
            ImagenCard={ImgPerdidaVentas}
            titulo="Perdida"
            title="Registrador de perdida de ventas"
            ruta="perdida"
            incompleto={false}
            bloqueado={!usuario?.emailVerified ? true : false}
            fechaInicial={new Date(2025, 0, 13)}
            fechaFinal={new Date(2025, 0, 20)}
          />
          {/* <CardHome
            ImagenCard={ImgSGM}
            titulo="SGM -"
            title="Sistema de gestion de Mantenimiento"
            ruta="mantenimiento"
            incompleto={true}
            bloqueado={!usuario?.emailVerified ? true : false}
            fechaInicial={new Date(2025, 2, 12)}
            fechaFinal={new Date(2025, 4, 14)}
          /> */}

          {Theme.config.modoDev && (
            <CardHome
              ImagenCard={ImgEase}
              titulo="Articulos"
              title="Registrador de perdida de ventas"
              ruta="articulos"
              incompleto={true}
              bloqueado={!usuario?.emailVerified ? true : false}
              fechaInicial={new Date(2025, 1, 4)}
              fechaFinal={new Date(2025, 3, 30)}
            />
          )}
        </PadreTarjetas>
      </SeccionHome>
      {!usuario ? (
        <>
          <SeccionHome>
            <TituloModulo
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              Registrarse:
            </TituloModulo>
            <Register home={true} />
          </SeccionHome>

          <SeccionHome>
            <TituloModulo
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              Acceder:
            </TituloModulo>
            <Login home={true} />
          </SeccionHome>
        </>
      ) : null}

      {/* <ElementoProtegido>
        <SeccionHome className={Theme.config.modoClear ? "clearModern" : ""}>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            <Enlaces to={"/curioso"}> Datos curiosos:</Enlaces>
          </TituloModulo>
          <DatosCuriosos
            setDBTutoriales={setDBTutoriales}
            dbTutoriales={dbTutoriales}
            userMaster={userMaster}
          />
        </SeccionHome>
      </ElementoProtegido> */}
      {/*  */}
      <ElementoProtegido>
        <SeccionHome className={Theme.config.modoClear ? "clearModern" : ""}>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            <Enlaces to={"/tutoriales"}> Tutoriales:</Enlaces>
          </TituloModulo>
          <TutorialesParcial
            setDBTutoriales={setDBTutoriales}
            dbTutoriales={dbTutoriales}
            userMaster={userMaster}
          />
        </SeccionHome>
      </ElementoProtegido>

      <ElementoProtegido>
        <SeccionHome className={Theme.config.modoClear ? "clearModern" : ""}>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            Reseñas:
          </TituloModulo>
          <Resennias
            dbUsuario={dbUsuario}
            setDBUsuario={setDBUsuario}
            userMaster={userMaster}
            dbResennias={dbResennias}
            inicio={true}
            setDBResennias={setDBResennias}
          />
        </SeccionHome>
      </ElementoProtegido>

      <ElementoProtegido>
        <SeccionHome className={Theme.config.modoClear ? "clearModern" : ""}>
          <TituloModulo className={Theme.config.modoClear ? "clearModern" : ""}>
            <Enlaces to={"/documentacion"}> Acerca de:</Enlaces>
          </TituloModulo>
          <DocumentacionParcial />
        </SeccionHome>
      </ElementoProtegido>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      <Footer tipo={"home"} />
    </>
  );
};

const CabezaHome = styled.div`
  width: 100%;
  background-color: ${Tema.secondary.azulProfundo};
  border-bottom: 1px solid;
  display: flex;
  height: 60px;
  justify-content: space-between;
  background-color: ${ClearTheme.primary.grisCielos};
  padding: 4px;
`;

const CajaLogoCaeloss = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
`;

const TituloMain = styled.h1`
  font-family: "Lato", sans-serif;
  font-size: 3rem;
  letter-spacing: -6px;
  font-weight: 200;
  color: rgb(255, 255, 255);
  display: inline-block;

  &:hover {
    cursor: pointer;
  }

  @media screen and (max-width: 750px) {
    font-size: 2rem;
    letter-spacing: -2px;
  }
`;

const LogoC = styled.img`
  height: 40px;
  height: 100%;

  @media screen and (max-width: 750px) {
    font-size: 3rem;
    height: 40px;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LogoCielos = styled.img`
  height: 40px;
  border-radius: 5px;

  @media screen and (max-width: 750px) {
    height: 30px;
  }
`;

const SeccionHome = styled.div`
  /* padding: 10px; */
  display: flex;
  justify-content: space-evenly;
  flex-direction: column;
  margin-bottom: 50px;
  &.card {
    margin-bottom: 15px;
  }
  /* margin-left: 10px; */
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    /* background-color: #c0bcb4; */
    /* background-color: #fff; */
  }
`;

const TituloModulo = styled.h2`
  text-decoration: underline;
  padding: 10px 15px;
  font-weight: 400;
  font-size: 1.5rem;
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }

  color: #ffffff;
`;

const PadreTarjetas = styled.div`
  display: flex;
  justify-content: center;
  @media screen and (max-width: 750px) {
    flex-direction: column;
  }
`;
