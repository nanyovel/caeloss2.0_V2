// Nada es imposible para Dios.
import { useState } from "react";
import { styled } from "styled-components";
import { useLocation, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faHelmetSafety,
  faTruckFast,
  faHouse,
  faChartSimple,
  faRoute,
  faFileLines,
  faDownLong,
  faSackDollar,
  faEarthAmerica,
} from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { useAuth } from "../context/AuthContext";
import { ElementoPrivilegiado } from "../context/ElementoPrivilegiado.jsx";
import { ClearTheme, Tema, Theme } from "../config/theme.jsx";
import PageFrase from "../frases/PageFrase.jsx";
import { LetterNotificacion } from "./JSXElements/OneLetter.jsx";
import Apariencia2 from "../config/Apariencia2.jsx";

export const MenuLateral = ({ userMaster }) => {
  const [menuAbierto, cambiarMenuAbierto] = useState(false);

  let location = useLocation();
  let lugar = location.pathname;

  const { usuario } = useAuth();
  const [avanzarFrase, setAvanzarFrase] = useState(0);

  return (
    <Body>
      <MenuSide
        className={`
            ${menuAbierto ? " arrru" : ""}
            ${Theme.config.modoClear ? " clearModern" : ""}
            `}
        onMouseEnter={() => cambiarMenuAbierto(true)}
        onMouseLeave={() => cambiarMenuAbierto(false)}
      >
        <CajaPerfil>
          {usuario && userMaster ? (
            <Enlaces to={"/perfil"} className={"perfil"}>
              <Option className="fotoPerfil">
                {userMaster?.urlFotoPerfil ? (
                  <CajaFotoPerfil>
                    <Img src={userMaster.urlFotoPerfil} />
                    {userMaster.notificaciones?.length > 0 && (
                      <LetterNotificacion
                        className={
                          userMaster.notificaciones?.length > 9
                            ? "dosDigitos"
                            : ""
                        }
                      >
                        {userMaster.notificaciones?.length}
                      </LetterNotificacion>
                    )}
                  </CajaFotoPerfil>
                ) : (
                  <CajaFotoPerfil>
                    <Icono
                      icon={faUser}
                      className={`iconoUser ${lugar === "/perfil" ? "iconoSelect" : ""}`}
                    />
                    {userMaster.notificaciones?.length > 0 && (
                      <LetterNotificacion
                        className={
                          userMaster.notificaciones?.length > 9
                            ? "dosDigitos"
                            : ""
                        }
                      >
                        {userMaster.notificaciones?.length}
                      </LetterNotificacion>
                    )}
                  </CajaFotoPerfil>
                )}

                <TituloMenu
                  className={menuAbierto ? "menuAbierto nombre" : "nombre"}
                >
                  {usuario
                    ? userMaster?.nombre
                      ? userMaster.nombre.trim().split(" ")[0]
                      : "Perfil"
                    : //     userDB?.userName?
                      //     userDB.userName
                      // :
                      // 'User perfil'
                      "Perfil"}
                </TituloMenu>
              </Option>
            </Enlaces>
          ) : (
            <Enlaces to={"/acceder"} className={"fotoPerfil"}>
              <Option>
                <Icono
                  icon={faUser}
                  className={`${lugar === "/acceder" ? "iconoSelect" : ""}`}
                />
                <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                  Acceder
                </TituloMenu>
              </Option>
            </Enlaces>
          )}
        </CajaPerfil>
        <NamePage>
          <BoxBarsMenu onClick={() => cambiarMenuAbierto(!menuAbierto)}>
            <Linea1 className={`${menuAbierto ? " activeline1" : ""}`}></Linea1>
            <Linea2 className={`${menuAbierto ? " activeline2" : ""}`}></Linea2>
            <Linea3 className={`${menuAbierto ? " activeline3" : ""}`}></Linea3>
          </BoxBarsMenu>
          <CajaApariencia className={menuAbierto ? "menuAbierto" : ""}>
            <Apariencia2 />
          </CajaApariencia>
        </NamePage>
        <CajaOptionMenu>
          <Enlaces to={"/"}>
            <Option>
              <Icono
                icon={faHouse}
                className={`${lugar === "/" ? "iconoSelect" : ""}`}
              />
              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Inicio
              </TituloMenu>
            </Option>
          </Enlaces>

          <Enlaces
            to={"/calculadora"}
            className={({ isActive, isPending }) =>
              isPending ? "pending" : isActive ? "active" : ""
            }
          >
            <Option>
              <Icono
                icon={faHelmetSafety}
                className={`${lugar === "/calculadora" ? "iconoSelect" : ""}`}
              />
              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Materiales
              </TituloMenu>
            </Option>
          </Enlaces>
          {usuario?.emailVerified && (
            <Enlaces to={"/fletes"}>
              <Option>
                <Icono
                  icon={faTruckFast}
                  className={`${lugar === "/fletes" ? "iconoSelect" : ""}`}
                />
                <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                  Fletes
                </TituloMenu>
              </Option>
            </Enlaces>
          )}
          <Enlaces to={"/importaciones"}>
            <Option>
              <Icono
                icon={faEarthAmerica}
                // bounce={true}
              />

              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Importaciones
              </TituloMenu>
            </Option>
          </Enlaces>
          <Enlaces to={"/transportes"}>
            <Option>
              <Icono
                icon={faRoute}
                // bounce={true}
                className={`icono  `}
              />
              {/* <Icono
                icon={faFileLines}
                // fade
                className={`icono encima `}
              /> */}
              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Transportes
              </TituloMenu>
            </Option>
          </Enlaces>

          <Enlaces to={"/perdida"}>
            <Option>
              <Icono
                icon={faDownLong}
                // bounce={true}
                className={`icono  `}
              />
              {/* <Icono
                icon={faSackDollar}
                // fade
                className={`icono encima `}
              /> */}

              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Perdidas
              </TituloMenu>
            </Option>
          </Enlaces>
          {/* <Enlaces to={"/mantenimiento"}>
            <Option>
              <Icono
                icon={faWrench}
                // bounce={true}
              />
              <Icono
                icon={faScrewdriver}
                // fade
                className={`icono  `}
              />

              <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                Mantenimiento
              </TituloMenu>
            </Option>
          </Enlaces> */}

          {usuario?.emailVerified && (
            <ElementoPrivilegiado
              privilegioReq="singleDashboard"
              userMaster={userMaster}
            >
              <Enlaces
                to={"/dashboard"}
                className={({ isActive, isPending }) =>
                  isPending ? "pending" : isActive ? "active" : ""
                }
              >
                <Option>
                  <Icono
                    icon={faChartSimple}
                    className={`${lugar === "/dashboard" ? "iconoSelect" : ""}`}
                  />
                  <TituloMenu className={menuAbierto ? "menuAbierto" : ""}>
                    Dashboard
                  </TituloMenu>
                </Option>
              </Enlaces>
            </ElementoPrivilegiado>
          )}
          <br />
          <br />
        </CajaOptionMenu>
        <CajaFrase className={menuAbierto ? "centro" : ""}>
          <PageFrase centro={menuAbierto} avanzarFrase={avanzarFrase} />
        </CajaFrase>
      </MenuSide>
    </Body>
  );
};

const Body = styled.div`
  margin-left: 80px;
  margin-top: 80px;
  /* transition: margin-left 0.1s cubic-bezier(0.785, 0.135, 0.15, 0.86); */
  position: absolute;
  height: 100vh;
`;
const MenuSide = styled.div`
  width: 60px;
  height: 100%;
  background-color: ${Tema.secondary.azulExtraProfundo};

  position: fixed;
  top: 0;
  left: 0;
  color: white;
  font-size: 18px;
  z-index: 300;
  overflow: hidden;
  border-right: 1px solid ${Tema.primary.azulBrillante};
  transition: all 0.3s cubic-bezier(0.785, 0.135, 0.15, 0.86);
  /* &.clearModern {
    background-image: repeating-linear-gradient(
      -135deg,
      #0e488f,
      #609ce6 350px
    );
  } */
  background-color: #5c97e1;
  background-color: #dfdfdf;
  background-color: #cccccc;
  background-color: #215ea8;
  /* background: linear-gradient(to right, #114b93, #4fa3f7); */
  &.arrru {
    width: 300px;
    @media screen and (max-width: 620px) {
      left: 0;
    }
  }
  @media screen and (max-width: 620px) {
    left: -60px;
  }
`;

const NamePage = styled.div`
  /* padding: 0 30px 0 30px; */
  height: 18px;
  height: 50px;
  display: flex;
  justify-content: start;
  justify-content: space-between;
  padding-left: 10px;
  text-align: center;
  width: 100%;
  border-bottom: 3px solid ${Tema.primary.azulBrillante};
  h2 {
    margin-bottom: 7px;
    font-weight: 200;
  }
  @media screen and (max-width: 620px) {
    background-color: transparent;
  }
`;

const BoxBarsMenu = styled.div`
  width: 30px;
  height: 50px;
  /* position: absolute; */
  /* 
  margin-top: 10px; */
  left: 18px;
  margin-right: 10px;
  z-index: 1;

  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 620px) {
    border: 1px solid ${Tema.primary.azulBrillante};
    background-color: ${Tema.secondary.azulGraciel};
    border-radius: 5px 0 5px 0;
    padding: 4px;
    width: 40px;
    height: 50px;
    left: auto;
    right: 10px;
    bottom: 20px;
    position: fixed;
  }
`;

const Linea = styled.span`
  display: block;
  width: 100%;
  height: 4px;
  background: #ffffff;
  margin-top: 7px;
  transform-origin: 0px 100%;
  transition: all 300ms;
  &.activeline1 {
    transform: rotate(45deg) translate(0px, 2px);
    margin-left: 5px;
  }

  &.activeline2 {
    opacity: 0;
    margin-left: -30px;
  }

  &.activeline3 {
    margin-left: 5px;
    transform: rotate(-45deg) translate(0px, 2px);
  }
`;
const Linea1 = styled(Linea)``;
const Linea2 = styled(Linea)``;
const Linea3 = styled(Linea)``;
const CajaApariencia = styled.div`
  width: 50px;
  height: 100%;
  display: none;
  justify-content: center;
  align-items: center;
  &.menuAbierto {
    display: flex;
  }
`;
const CajaOptionMenu = styled.div`
  /* padding: 20px 0; */
  /* position: absolute; */
  /* top: 90px; */
  /* padding-top: 35px; */
  height: calc((100vh - 120px) * 0.65);
  overflow-y: auto;
  border-bottom: 1px solid white;
  width: 100%;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const Enlaces = styled(NavLink)`
  color: #ffffff;
  display: block;
  position: relative;
  transition: color 25ms;
  border-bottom: 3px solid transparent;
  padding: 0 25px;
  width: 200px;
  &:hover {
    color: white;
    border-bottom: 3px solid ${Tema.primary.azulBrillante};
  }

  h4 {
    position: absolute;
    left: 40px;
    font-weight: 400;
  }
  &:hover {
    cursor: pointer;
  }
  &.nuevo {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  h2 {
    font-size: 1rem;
    text-decoration: none;
    font-weight: 200;
    z-index: 5;
    padding: 5px;
    background-color: ${Tema.primary.azulBrillante};
  }
  text-decoration: none;
  &.active {
    color: ${ClearTheme.complementary.warningClear};
    /* color: #14192b; */
  }
  &.perfil {
    padding: 0;
    display: inline-block;
    height: 100%;
    width: 100%;
    &:hover {
      border-bottom: 3px solid transparent;
      background-color: #0074d933;
    }
    &.active {
      color: white;
      background-color: #0074d933;
    }
  }
`;

const Icono = styled(FontAwesomeIcon)`
  &.iconoUser {
    font-size: 1.5rem;
    transform: translate(-10px);
    text-align: center;
    align-self: center;
  }
  &.debajo {
    position: absolute;
    left: -2px;
    /* bottom: 4px; */
  }
  &.encima {
    opacity: 0.6;
    position: absolute;
    bottom: 1px;
    left: 6px;
  }
`;

const Option = styled.div`
  padding: 16px 0px;
  display: flex;
  align-items: center;
  position: relative;
  /* display: none; */
  /* border: 1px solid blue; */
  &.fotoPerfil {
    padding: 0px;
    display: flex;
    justify-content: space-around;
    /* align-items: center; */

    width: 100%;
    height: 100%;
    border: 1px solid black;
  }
`;
const CajaFotoPerfil = styled.div`
  position: absolute;
  right: 5px;
  &.iconos {
    border: 1px solid red;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const TituloMenu = styled.h4`
  display: none;
  &.menuAbierto {
    display: block;
  }

  &.conImagen {
    display: inline-block;
    /* border: 1px solid green; */
  }
  &.nombre {
    /* border: 1px solid white; */
  }
`;

const Img = styled.img`
  width: 40px;
  height: 40px;
  object-fit: contain;
  border-radius: 50%;
`;

const CajaFrase = styled.div`
  width: 100%;
  /* min-height: 220px; */
  bottom: 0;
  /* position: absolute; */
  /* border: 1px solid black; */
  transition: ease 0.8s all;
  /* overflow: hidden; */
  height: calc((100vh - 120px) * 0.35);
  padding-bottom: 70px;
  /* background-color: blue; */
  &.centro {
    overflow-y: auto;
    /* border: none; */
  }
  /* background-color: #3fb11f8a; */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
    height: 1px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaPerfil = styled.div`
  height: 70px;
  /* border: 2px solid white; */
`;
