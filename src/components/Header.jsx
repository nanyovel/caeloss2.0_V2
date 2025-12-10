import styled from "styled-components";
import { Link } from "react-router-dom";
import logoCielos from "./../../public/img/cielos.png";
import logoCaeloss from "./../../public/img/logoOficial2.png";
import { Tema, Theme } from "../config/theme";
import logoCielos2 from "./../../public/img/logo Cielos.png";

export const Header = (props) => {
  return (
    <Cabecera className={Theme.config.modoClear ? "clearModern" : ""}>
      <ContenedorOne>
        <CajaLogoC
          to="/"
          className={Theme.config.modoClear ? "clearModern" : ""}
        >
          <LogoC src={logoCaeloss} alt="Logo Caeloss" />
        </CajaLogoC>
        <TituloMain>
          <CajaTexto>
            <Titulo>{props.titulo}</Titulo>
          </CajaTexto>
        </TituloMain>
        <SubTitulo>{props.subTitulo}</SubTitulo>
      </ContenedorOne>
      <CajaCielos>
        <LogoCielos src={logoCielos2} />
      </CajaCielos>
    </Cabecera>
  );
};

const Cabecera = styled.header`
  width: 100%;
  background-color: ${Tema.secondary.azulProfundo};
  border-bottom: 1px solid ${Tema.primary.azulBrillante};
  display: flex;
  min-height: 55px;
  padding: 5px 0;
  justify-content: space-between;

  @media screen and (max-width: 290px) {
    flex-direction: column;
  }
  &.clearModern {
    background-color: #3e3e3e;
    backdrop-filter: blur(4px);
  }
`;

const ContenedorOne = styled.div`
  display: flex;
  gap: 15px;
  padding-left: 10px;
`;

const TituloMain = styled.div`
  margin-left: 10px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const SubTitulo = styled.h2`
  font-size: 1rem;
  height: 50px;
  display: flex;
  align-items: end;
  color: ${Tema.primary.grisNatural};
  @media screen and (max-width: 350px) {
    font-size: 0.7rem;
  }
`;

const CajaLogoC = styled(Link)`
  display: flex;
  height: 50px;

  box-shadow: 3px 3px 3px 3px rgba(0, 0, 0, 0.43);
  border-radius: 10px 0 10px 0;

  background-color: ${Tema.primary.azulOscuro};
  @media screen and (max-width: 600px) {
    align-items: end;
  }
  @media screen and (max-width: 400px) {
    display: none;
  }
  &.clearModern {
    background-color: transparent;
    /* backdrop-filter: blur(4px); */
  }
`;
const LogoC = styled.img`
  height: 45px;
  margin: 4px;
  &:hover {
    cursor: pointer;
  }
  @media screen and (max-width: 880px) {
    height: 75%;
  }

  @media screen and (max-width: 580px) {
    height: 60%;
  }
  @media screen and (max-width: 290px) {
    height: 40px;
  }
`;

const CajaTexto = styled.div`
  display: flex;
  justify-content: end;
  align-items: end;
  padding: 0;
`;
const Titulo = styled.h2`
  font-size: 2rem;
  font-weight: 200;
  width: 100%;
  color: white;
  height: auto;
  /* font-weight: 400; */
  @media screen and (max-width: 880px) {
    font-size: 1.8rem;
  }
  @media screen and (max-width: 720px) {
    font-size: 1.1rem;
  }
  @media screen and (max-width: 350px) {
    font-size: 0.9rem;
  }
`;
const CajaCielos = styled.div`
  display: flex;
  align-items: end;
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
  @media screen and (max-width: 290px) {
    flex-direction: column;
    width: 20px;
  }
`;
const LogoCielos = styled.img`
  height: 55px;
  margin-right: 15px;
  @media screen and (max-width: 880px) {
    height: 30px;
  }
`;
