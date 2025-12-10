import { useState, useEffect } from "react";
import { Header } from "../components/Header";

import { Route, Routes, useLocation } from "react-router-dom";
import { RutaProtegida } from "../context/RutaProtegida";
import Add from "./page/Add.jsx";
import styled from "styled-components";
import Main from "./page/Main.jsx";
import { Maestros } from "./page/Maestros.jsx";
import Footer from "../components/Footer.jsx";
import Reportes from "./page/Reportes.jsx";
import { RutaPrivilegiada } from "../context/RutaPrivilegiada.jsx";
import Plantilla from "./Plantilla.jsx";
import APS from "./page/APS.jsx";
import Mas from "./page/Mas.jsx";
import CajaNavegacion from "../components/CajaNavegacion.jsx";
import { parsearPath } from "../libs/navegacionLib.js";

export const Transportes = ({
  userMaster,
  usuario,
  setDBTransferRequest,
  dbUsuarios,
  dbVehiculos,
  dbTransferRequest,
  setDBChoferes,
  dbChoferes,
  // Pagos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
}) => {
  useEffect(() => {
    document.title = "Caeloss - Transporte";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  useEffect(() => {
    document.title = "Caeloss - Transporte";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  // ****************** NAVEGACION ******************
  const location = useLocation();
  const [pageSelect, setPageSelect] = useState({});

  const pathModulo = "/transportes";
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
      nombre: "Maestros",
      pathModulo: pathModulo,
      path: "/maestros",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Reportes",
      pathModulo: pathModulo,
      path: "/reportes",
      select: false,
      privilegiado: true,
      privilegio: "generalReportsTMS",
    },
    {
      nombre: "APS",
      pathModulo: pathModulo,
      path: "/aps",
      select: false,
      privilegiado: true,
      privilegio: "accessAPSTMS",
    },
    {
      nombre: "Mas",
      pathModulo: pathModulo,
      path: "/mas",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Add",
      pathModulo: pathModulo,
      path: "/add",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
  ];

  useEffect(() => {
    parsearPath(location, rutas, setPageSelect);
  }, [location]);

  const [opcionUnicaSelect, setOpcionUnicaSelect] = useState();
  return (
    <Container>
      <ContainerMaster>
        <ContainerSecciones>
          <Header titulo={"Sistema de gestion de transporte (TMS)"} />
          <ContainerNav>
            <CajaNavegacion
              userMaster={userMaster}
              pageSelected={pageSelect}
              rutas={rutas}
            />
            {opcionUnicaSelect}
          </ContainerNav>
        </ContainerSecciones>

        <>
          <ContainerSecciones className="contenido">
            <Routes>
              <Route
                path="/"
                element={
                  <RutaProtegida>
                    <Main
                      userMaster={userMaster}
                      dbTransferRequest={dbTransferRequest}
                      dbUsuarios={dbUsuarios}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                      dbVehiculos={dbVehiculos}
                      setDBChoferes={setDBChoferes}
                      dbChoferes={dbChoferes}
                      setDBTransferRequest={setDBTransferRequest}
                      // Pagos
                      congloPagosInternos={congloPagosInternos}
                      setCongloPagosInternos={setCongloPagosInternos}
                      congloPagosExtInd={congloPagosExtInd}
                      setCongloPagosExtInd={setCongloPagosExtInd}
                      congloPagosExtEmp={congloPagosExtEmp}
                      setCongloPagosExtEmp={setCongloPagosExtEmp}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="maestros/*"
                element={
                  <RutaProtegida>
                    <Maestros
                      userMaster={userMaster}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                      dbTransferRequest={dbTransferRequest}
                      dbUsuarios={dbUsuarios}
                      setDBChoferes={setDBChoferes}
                      dbChoferes={dbChoferes}
                      usuario={usuario}
                      // Pagos
                      congloPagosInternos={congloPagosInternos}
                      setCongloPagosInternos={setCongloPagosInternos}
                      congloPagosExtInd={congloPagosExtInd}
                      setCongloPagosExtInd={setCongloPagosExtInd}
                      congloPagosExtEmp={congloPagosExtEmp}
                      setCongloPagosExtEmp={setCongloPagosExtEmp}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="reportes/*"
                element={
                  <RutaProtegida>
                    <RutaPrivilegiada
                      userMaster={userMaster}
                      privilegioReq="generalReportsTMS"
                    >
                      <Reportes
                        setOpcionUnicaSelect={setOpcionUnicaSelect}
                        userMaster={userMaster}
                      />
                    </RutaPrivilegiada>
                  </RutaProtegida>
                }
              />

              <Route
                path="mas"
                element={
                  <Mas
                    setOpcionUnicaSelect={setOpcionUnicaSelect}
                    userMaster={userMaster}
                    setDBChoferes={setDBChoferes}
                    dbChoferes={dbChoferes}
                  />
                }
              />

              <Route
                path="add"
                element={
                  <RutaProtegida>
                    <Add
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                      userMaster={userMaster}
                      setDBChoferes={setDBChoferes}
                      dbChoferes={dbChoferes}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="aps"
                element={
                  <RutaProtegida>
                    <RutaPrivilegiada
                      userMaster={userMaster}
                      privilegioReq={"accessAPSTMS"}
                    >
                      <APS
                        setOpcionUnicaSelect={setOpcionUnicaSelect}
                        userMaster={userMaster}
                        // CHoferes interno
                        congloPagosInternos={congloPagosInternos}
                        setCongloPagosInternos={setCongloPagosInternos}
                        // CHoferes ext independiente
                        congloPagosExtInd={congloPagosExtInd}
                        setCongloPagosExtInd={setCongloPagosExtInd}
                        // CHoferes ext empresa
                        congloPagosExtEmp={congloPagosExtEmp}
                        setCongloPagosExtEmp={setCongloPagosExtEmp}
                      />
                    </RutaPrivilegiada>
                  </RutaProtegida>
                }
              />
            </Routes>
          </ContainerSecciones>

          <ContainerSecciones className="footer">
            <Footer />
          </ContainerSecciones>
        </>
      </ContainerMaster>
    </Container>
  );
};
const Container = styled.div`
  width: 100%;
`;
const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  /* margin: auto; */
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

const ContainerMaster = styled.div`
  position: relative;
  min-height: 100dvh;
  /* display: grid;
  grid-template-rows: auto 1fr auto; */

  display: flex;
  flex-direction: column;
`;
const ContainerSecciones = styled.div`
  &.contenido {
    width: 100%;
    margin-bottom: 100px;
    display: flex;
    /* justify-content: center; */
    /* align-items: center; */
    flex-direction: column;

    /* position: absolute;
    top: 0;
    border: 2px solid red; */
  }
  &.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
  }
`;
