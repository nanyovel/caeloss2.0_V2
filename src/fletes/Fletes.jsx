import { styled } from "styled-components";
import { Header } from "../components/Header";
import { ElementoPrivilegiado } from "../context/ElementoPrivilegiado.jsx";
import { MainFlete } from "./page/MainFlete.jsx";
import Footer from "../components/Footer.jsx";
import { useEffect, useState } from "react";
import CajaNavegacion from "../components/CajaNavegacion.jsx";
import { parsearPath } from "../libs/navegacionLib.js";
import { useLocation } from "react-router-dom";

export const Fletes = ({ dbUsuario, userMaster }) => {
  useEffect(() => {
    document.title = "Caeloss - Fletes";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  const location = useLocation();
  const [datosFlete, setDatosFlete] = useState({});

  const [pageSelect, setPageSelect] = useState({});
  const pathModulo = "/fletes";
  const rutas = [
    {
      nombre: "Main",
      pathModulo: pathModulo,
      path: "",
      select: true,
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Setup",
      pathModulo: pathModulo,
      path: "/setup",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
  ];

  useEffect(() => {
    parsearPath(location, rutas, setPageSelect);
  }, [location]);
  return (
    <ContainerMaster>
      <ContainerSecciones>
        <Header titulo={"Calculadora Fletes"} />
        <ElementoPrivilegiado
          userMaster={userMaster}
          privilegioReq={"viewConfigFlete"}
        >
          <ContainerNav>
            <CajaNavegacion
              userMaster={userMaster}
              pageSelected={pageSelect}
              rutas={rutas}
            />
          </ContainerNav>
        </ElementoPrivilegiado>
      </ContainerSecciones>

      <ContainerSecciones className="contenido">
        <MainFlete
          datosFlete={datosFlete}
          setDatosFlete={setDatosFlete}
          tipoSolicitud={"fletes"}
          userMaster={userMaster}
        />
      </ContainerSecciones>
      <ContainerSecciones className="footer">
        <Footer />
      </ContainerSecciones>
    </ContainerMaster>
  );
};

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 10px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width: 1000px) {
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 410px) {
    width: 99%;
  }
`;

const ContainerMaster = styled.div`
  position: relative;
  display: grid;
  min-height: 100%;
  grid-template-rows: auto 1fr auto;
`;
const ContainerSecciones = styled.div`
  &.contenido {
    margin-bottom: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  &.footer {
    width: 100%;
    height: 40px;
  }
`;
