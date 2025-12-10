import styled from "styled-components";
import { Link } from "react-router-dom";
import { ClearTheme, Tema, Theme } from "../../config/theme";

export const Navegacion = ({ home, setOpenMenuMobil, openMenuMobil }) => {
  const toggleMobil = () => {
    setOpenMenuMobil(!openMenuMobil);
  };
  return (
    <Container
      className={`
      
      ${openMenuMobil || home ? "abierto" : ""}
      ${Theme.config.modoClear ? "clearModern" : ""}
      
      `}
    >
      <ListaMenu>
        <ItemsDeMenu className={home ? "home" : ""}>
          <EnlaceMenu to="/calculadora">Home</EnlaceMenu>
          <Submenu className={home ? "home" : ""}></Submenu>
        </ItemsDeMenu>
        <ItemsDeMenu className={home ? "home" : ""}>
          <EnlaceMenu>Plafones y techos</EnlaceMenu>
          <Submenu className={`salirSubMenu ${home ? "home" : ""}`}>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/plafoncomercial"
              >
                Plafon Comercial
              </EnlaceSubmenu>
            </li>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/plafonmachihembrado"
              >
                Machihembrado
              </EnlaceSubmenu>
            </li>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/techolisosheetrock/"
              >
                Techo liso Sheetrock
              </EnlaceSubmenu>
            </li>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/techolisodensglass/"
              >
                Techo liso Densglass
              </EnlaceSubmenu>
            </li>
          </Submenu>
        </ItemsDeMenu>
        <ItemsDeMenu className={home ? "home" : ""}>
          <EnlaceMenu>Divisiones y muros</EnlaceMenu>
          <Submenu className={`salirSubMenu ${home ? "home" : ""}`}>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/divisionyeso/"
              >
                Divisiones Yeso
              </EnlaceSubmenu>
            </li>
            <li>
              <EnlaceSubmenu
                onClick={() => toggleMobil()}
                to="/calculadora/divisiondensglass/"
              >
                Division Fibrocemento
              </EnlaceSubmenu>
            </li>
          </Submenu>
        </ItemsDeMenu>
      </ListaMenu>
    </Container>
  );
};

const ContainerMayor = styled.div`
  width: 100%;
  position: relative;
  height: 35px;
  background-color: blue;
`;
const Container = styled.nav`
  width: 100%;
  margin: 1px;
  height: 35px;

  background-color: ${Tema.secondary.azulProfundo};
  border-bottom: 1px solid ${Tema.primary.azulBrillante};
  margin: 0;
  padding: 0;
  z-index: 200;
  box-sizing: border-box;
  -moz-box-sizing: border-box;
  -webkit-box-sizing: border-box;
  transition: all ease 0.2s;
  position: relative;
  top: 0;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
    border-bottom: 1px solid black;

    background-color: #0e488f67;
    /* background-color: #14192bd5; */

    backdrop-filter: blur(3px);
  }
  @media screen and (max-width: 620px) {
    position: absolute;
    height: 100%;
    background-color: #0d161c;
    z-index: 100;
    position: fixed;
    left: -100%;
    border: none;
    &.abierto {
      left: 0;
    }
  }
`;

const CajaMenuHamburg = styled.div`
  /* background-color: white; */
  display: none;
  display: block;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 70px;
  bottom: 20px;
  justify-content: center;
  align-items: center;

  @media screen and (max-width: 620px) {
    display: flex;
  }
`;
const Img = styled.img`
  height: 30px;
  &.rayas {
    height: 45px;
  }
`;
const ListaMenu = styled.ul`
  list-style-type: none !important;
  list-style: none !important;
  @media screen and (max-width: 400px) {
    font-size: 1.1rem;
  }
`;

const ItemsDeMenu = styled.li`
  position: relative;
  display: inline-block;
  list-style-type: none;
  &:hover .salirSubMenu {
    visibility: visible;
    opacity: 1;
  }
  &.home {
    visibility: visible;
    opacity: 1;
  }
  @media screen and (max-width: 620px) {
    visibility: visible;
    opacity: 1;
    display: flex;
    flex-direction: column;
  }
`;

const EnlaceMenu = styled(Link)`
  display: block;
  padding: 5px 20px;
  color: #ffffff;
  text-decoration: none;
  cursor: pointer;
  &:hover {
    color: ${Tema.primary.azulBrillante};
    transition: all 0.3s;
  }
  @media screen and (max-width: 620px) {
    width: 100%;
    height: 35px;
    border-bottom: 1px solid black;
    border-top: 1px solid black;
  }
`;

const Submenu = styled.ul`
  list-style: none;
  border-radius: 10px;
  position: absolute;
  width: 120%;
  visibility: hidden;
  opacity: 0;
  transition: opacity 0.5s;
  z-index: 5;
  font-weight: 200;
  &.home {
    visibility: visible;
    opacity: 1;
  }
  @media screen and (max-width: 620px) {
    visibility: visible;
    opacity: 1;
    position: relative;
    width: 100%;
    left: 15px;
  }
  @media screen and (max-width: 220px) {
    visibility: visible;
    opacity: 1;
    position: relative;
    width: 95%;
    left: 10px;
    font-size: 0.9rem;
  }
`;
const EnlaceSubmenu = styled(Link)`
  display: block;
  padding: 8px;
  border-radius: 5px;
  color: #fff;
  text-decoration: none;
  background-color: ${Tema.primary.grisNatural};
  border: 0.5px solid #2c2929;
  max-width: 95%;

  &:hover {
    background-color: #2c2929;
    color: #fff;
  }
  &:active {
    background-color: #312929;
  }
  @media screen and (max-width: 550px) {
    height: 45px;
  }
  @media screen and (max-width: 220px) {
    max-width: 95%;
  }
`;
