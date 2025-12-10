import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import styled from "styled-components";
import { Theme } from "../config/theme";
import { Building } from "../components/Building";
import imgBuild from "./../../public/img/build web.webp";
import Footer from "../components/Footer.jsx";
import { Route, Routes } from "react-router-dom";

import Add from "./page/Add.jsx";
import Main from "./page/Main.jsx";

export const Mantenimiento = ({ userMaster, equiposDB, setEquiposDB }) => {
  const rutaPrincipal = "/mantenimiento";
  const paginas = [
    {
      nombre: "main",
      tag: "Main",
      ruta: "",
    },
    {
      nombre: "maestros",
      tag: "Maestros",
      ruta: "/maestros",
    },
    {
      nombre: "timeLine",
      tag: "Prog/gastos",
      ruta: "/timeLine",
    },

    {
      nombre: "tickets",
      tag: "Tickets",
      ruta: "/tickets",
    },
    {
      nombre: "add",
      tag: "Add",
      ruta: "/add",
      agregar: true,
    },
  ];
  useEffect(() => {
    document.title = "Caeloss - Mantenimiento";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [isBuilding, setIsBuilding] = useState(
    Theme.config.modoDev ? false : true
  );
  const fechaInicial = new Date(2025, 2, 12);
  const fechaFinal = new Date(2025, 4, 14);
  const funcionesFuturas = [
    "Consultar el status de todos los equipo de la empresa",
    "Ver reporte de gastos de mantenimiento preventivos y correctivos",
    "Ver detalles de los equipos de la empresa; camiones, plantas electricas, montacargas etc",
    "Consultar programa de mantenimiento",
    "Consultar historico de combustibles; gas,gasoil",
    "Programar requerimiento de mantenimiento",
    "Y muchas cosas mas...",
  ];
  const [opcionUnicaSelect, setOpcionUnicaSelect] = useState([]);
  return (
    <Container>
      <ContainerMaster>
        <ContainerSecciones>
          <Header titulo={"Sistema de gestion de Mantenimiento"} />

          <Building
            isBuilding={isBuilding}
            setIsBuilding={setIsBuilding}
            fechaInicial={fechaInicial}
            fechaFinal={fechaFinal}
            fechaEstimada="14/mayo/2025"
            imgBuild={imgBuild}
            titulo="En el SGM podras:"
            funcionesFuturas={funcionesFuturas}
          />
        </ContainerSecciones>
        {isBuilding == false && (
          <>
            <ContainerSecciones className="contenido">
              <Routes>
                <Route
                  path="/"
                  element={
                    <Main
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                      equiposDB={equiposDB}
                      setEquiposDB={setEquiposDB}
                    />
                  }
                />
                <Route path="/programa" element={<Princ>Programa</Princ>} />

                <Route path="/maestros/*" element={<Princ>Maestros</Princ>} />
                <Route path="/timeLine" element={<Princ>Prog/Gastos</Princ>} />
                <Route path="/add" element={<Add userMaster={userMaster} />} />
                <Route
                  path="/combustible"
                  element={<Princ>Combustible</Princ>}
                />
                <Route path="/tickets" element={<Princ>tickets</Princ>} />
              </Routes>
            </ContainerSecciones>
          </>
        )}
        <ContainerSecciones>
          <Footer />
        </ContainerSecciones>
      </ContainerMaster>
    </Container>
  );
};
const Princ = styled.h1`
  color: ${Theme.primary.azulBrillante};
`;
const Container = styled.div`
  width: 100%;
`;
const ContainerMaster = styled.div`
  position: relative;
  min-height: 100dvh;

  display: flex;
  flex-direction: column;
`;

const ContainerSecciones = styled.div`
  &.contenido {
    width: 100%;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
  }
  &.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
  }
`;

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  padding: 0 15px;
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
