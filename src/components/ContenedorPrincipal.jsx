import { styled } from "styled-components";
import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Tema, Theme } from "../config/theme";
import { useAuth } from "../context/AuthContext";

export const ContenedorPrincipal = ({ children }) => {
  const location = useLocation();
  const { pathname } = location;

  const { config, setConfig } = useAuth();

  const contenedorPrincipalRef = useRef(null);

  useEffect(() => {
    if (contenedorPrincipalRef.current) {
      contenedorPrincipalRef.current.scrollTo(0, 0);
    }
  }, [pathname]);

  return (
    <ContenedorPrincipalCaja
      ref={contenedorPrincipalRef}
      className={config.fullWidth ? "anchoFull" : ""}
    >
      {children}
    </ContenedorPrincipalCaja>
  );
};

const ContenedorPrincipalCaja = styled.div`
  /* display: block; */
  position: relative;
  /* width: 900px; */
  transition: width ease 0.2s;
  width: 900px;
  &.anchoFull {
    width: 1150px;
  }
  height: 100dvh;
  margin: auto;
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 10px;
  overflow-x: hidden;
  /* background-color: ${Tema.secondary.azulFondo}; */
  /* background-color: red; */
  /* background-image: linear-gradient(20deg, #525256dc 0%, #626569eb 100%); */
  background-color: ${Tema.secondary.azulOscuro3};
  background-position: top;
  background-attachment: fixed;
  background-size: cover;
  background-repeat: no-repeat;
  align-items: center;

  background-color: #011f34;
  /* background-color: ${Theme.neutral.neutral400};
  background-color: #ff9d13;
  background-color: #e5e5e5; */
  background-color: #cccccc;
  background-color: #114b93;
  background: linear-gradient(to right, #114b93, #4fa3f7);
  /* background: linear-gradient(to right, #114b93, #6ec1e4); */
  background: linear-gradient(to right, #114b93, #5291ad);
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

  @media screen and (max-width: 1070px) {
    width: calc(95% - 100px);
  }
  @media screen and (max-width: 620px) {
    width: 100%;
  }
`;
export default ContenedorPrincipal;
