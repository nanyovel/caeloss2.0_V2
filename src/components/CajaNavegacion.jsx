import { useState } from "react";
import styled from "styled-components";
import { Link, useLocation, useNavigate } from "react-router-dom";

import { Alerta } from "./Alerta.jsx";
import { ElementoPrivilegiado } from "../context/ElementoPrivilegiado.jsx";
import { Tema } from "../config/theme.jsx";

const CajaNavegacion = ({ pageSelected, userMaster, rutas }) => {
  let location = useLocation();
  const [nombrePage, setNombrePage] = useState("");
  const [alertaMismaPage, setAlertaMismaPage] = useState(false);
  const navigate = useNavigate();

  const probarURL = (e) => {
    e.preventDefault();
    let mismaPagina = false;
    setNombrePage(e.target.name);
    const pageSelectedThis = rutas.find((ruta) => ruta.nombre == e.target.name);
    if (
      location.pathname ==
      pageSelectedThis.pathModulo + pageSelectedThis.path
    ) {
      mismaPagina = true;
    } else {
      navigate(pageSelectedThis.pathModulo + pageSelectedThis.path);
    }

    if (mismaPagina) {
      setAlertaMismaPage(true);
      setTimeout(() => {
        setAlertaMismaPage(false);
      }, 3000);
    }
  };

  return (
    rutas.length > 0 &&
    pageSelected && (
      <>
        <ContenedorSeguirItem>
          <TituloSeguimiento>Paginas:</TituloSeguimiento>
          <CajaBotones>
            {rutas.map((ruta, index) => {
              const enlaceDefault = (
                <EnlacePrincipal
                  key={index}
                  className={`
                    ${pageSelected.path === ruta.path ? "selected" : ""}
                     ${ruta.path == "/add" || ruta.path == "/setup" ? "warning" : ""}
                    `}
                  name={ruta.nombre}
                  // to={ruta.path}
                  onClick={(e) => probarURL(e)}
                >
                  {ruta.nombre}
                </EnlacePrincipal>
              );
              if (ruta.privilegiado) {
                return (
                  <ElementoPrivilegiado
                    userMaster={userMaster}
                    privilegioReq={ruta.privilegio}
                    key={index}
                  >
                    {enlaceDefault}
                  </ElementoPrivilegiado>
                );
              } else {
                return enlaceDefault;
              }
            })}
          </CajaBotones>
        </ContenedorSeguirItem>

        <Alerta
          estadoAlerta={alertaMismaPage}
          tipo={"warning"}
          mensaje={`Ya se encuentra en la pagina ${nombrePage}.`}
        />
      </>
    )
  );
};

export default CajaNavegacion;

const ContenedorSeguirItem = styled.div`
  /* width: 45%; */
  /* background-color: ${Tema.complementary.azulTransparente2}; */
  background-color: #163f5073;
  border-radius: 4px;
  /* margin-left: 15px; */
  padding: 10px;
  @media screen and (max-width: 410px) {
    padding: 10px 2px;
  }
`;

const TituloSeguimiento = styled.p`
  color: white;
  border-bottom: 1px solid white;
  display: inline-block;
  margin-bottom: 5px;
`;

const CajaBotones = styled.div`
  /* border: 1px solid red; */
  display: flex;
  gap: 2px;
  /* border: 1px solid red; */
  flex-wrap: wrap;
`;

const EnlacePrincipal = styled(Link)`
  /* margin: 8px; */
  /* margin-left: 15px; */
  padding: 7px;
  width: auto;
  cursor: pointer;
  border-radius: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${Tema.complementary.azulStatic};
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  display: inline-block;
  /* text-decoration: none; */

  &:focus {
    background-color: ${Tema.complementary.azulStatic};
    color: #fff;
  }

  &:hover {
    background-color: #fff;
    color: #0074d9;
  }
  &:active {
    background-color: #135c9d;
    color: #fff;
  }

  &.resaltado {
    border: 1px solid white;
  }
  &.warning {
    background-color: ${Tema.complementary.warning};
    color: black;
  }

  &.selected {
    background-color: #fff;
    color: #0074d9;
  }
  /* border: 1px solid red; */
  @media screen and (max-width: 410px) {
    font-size: 16x;
  }
  @media screen and (max-width: 380px) {
    font-size: 14px;
  }
  @media screen and (max-width: 340px) {
    font-size: 12px;
  }
`;
