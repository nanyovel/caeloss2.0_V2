import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import styled from "styled-components";
import { Route, Routes, useLocation } from "react-router-dom";
import { Main } from "./page/Main";
import { Ciclo } from "./page/Ciclo";
import { RutaProtegida } from "../context/RutaProtegida";
import { Add } from "./page/Add";
import Reportes from "./page/Reportes";
import { ListaFurgon } from "./Template/ListaFurgon";
import { ListaArticulo } from "./template/ListaArticulo";
import { ListaBillOfLading } from "./Template/ListaBillOfLading";
import { RutaPrivilegiada } from "../context/RutaPrivilegiada";
import { Maestros } from "./page/Maestros";
import Footer from "../components/Footer";
import { ListaOrdenCompra } from "./Template/ListaOrdenCompra";
import CajaNavegacion from "../components/CajaNavegacion";
import { parsearPath } from "../libs/navegacionLib";

export default function ImportacionesApp({
  dbOrdenes,
  dbBillOfLading,
  dbUsuario,
  userMaster,
  setDBBillOfLading,
  setDBOrdenes,

  setDBGlobalFurgones,
  dbGlobalFurgones,
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
  dbGlobalBL,
  setDBGlobalBL,
}) {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  // ****************** NAVEGACION ******************
  const location = useLocation();
  const [pageSelect, setPageSelect] = useState({});
  const pathModulo = "/importaciones";
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
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Ciclo",
      pathModulo: pathModulo,
      path: "/ciclo",
      select: false,
      privilegiado: false,
      privilegio: "",
    },
    {
      nombre: "Add",
      pathModulo: pathModulo,
      path: "/add",
      select: false,
      privilegiado: true,
      privilegio: "createDocsIMS",
    },
  ];

  useEffect(() => {
    parsearPath(location, rutas, setPageSelect);
  }, [location]);

  const [opcionUnicaSelect, setOpcionUnicaSelect] = useState();
  return (
    <ContainerMaster>
      <ContainerSecciones>
        <Header
          titulo="Sistema gestion de importaciones"
          subTitulo={pageSelect.nombre}
        />
        <ContainerNav>
          <CajaNavegacion
            userMaster={userMaster}
            pageSelected={pageSelect}
            rutas={rutas}
          />
          {opcionUnicaSelect}
        </ContainerNav>
      </ContainerSecciones>
      <ContainerSecciones className="contenido">
        <Routes>
          <Route
            path="/"
            element={
              <RutaProtegida>
                <Main
                  setOpcionUnicaSelect={setOpcionUnicaSelect}
                  setDBGlobalFurgones={setDBGlobalFurgones}
                  dbGlobalFurgones={dbGlobalFurgones}
                  setDBGlobalOrdenes={setDBGlobalOrdenes}
                  dbGlobalOrdenes={dbGlobalOrdenes}
                  dbGlobalBL={dbGlobalBL}
                  setDBGlobalBL={setDBGlobalBL}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="maestros"
            element={
              <RutaProtegida>
                <Maestros
                  userMaster={userMaster}
                  setOpcionUnicaSelect={setOpcionUnicaSelect}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="reportes"
            element={
              <RutaProtegida>
                <RutaPrivilegiada
                  userMaster={userMaster}
                  privilegioReq="generalReportsIMS"
                >
                  <Reportes
                    dbUsuario={dbUsuario}
                    userMaster={userMaster}
                    setOpcionUnicaSelect={setOpcionUnicaSelect}
                    dbOrdenes={dbOrdenes}
                    dbBillOfLading={dbBillOfLading}
                  />
                </RutaPrivilegiada>
              </RutaProtegida>
            }
          />
          <Route
            path="ciclo"
            element={
              <RutaProtegida>
                <Ciclo
                  dbOrdenes={dbOrdenes}
                  dbBillOfLading={dbBillOfLading}
                  setDBBillOfLading={setDBBillOfLading}
                  setDBOrdenes={setDBOrdenes}
                  dbUsuario={dbUsuario}
                  userMaster={userMaster}
                  setOpcionUnicaSelect={setOpcionUnicaSelect}
                  //
                  setDBGlobalOrdenes={setDBGlobalOrdenes}
                  dbGlobalOrdenes={dbGlobalOrdenes}
                  dbGlobalBL={dbGlobalBL}
                  setDBGlobalBL={setDBGlobalBL}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="add"
            element={
              <RutaProtegida>
                <RutaPrivilegiada
                  privilegioReq="createDocsIMS"
                  userMaster={userMaster}
                >
                  <Add
                    userMaster={userMaster}
                    setOpcionUnicaSelect={setOpcionUnicaSelect}
                  />
                </RutaPrivilegiada>
              </RutaProtegida>
            }
          />
          <Route
            path="maestros/articulos"
            element={
              <RutaProtegida>
                <ListaArticulo
                  dbOrdenes={dbOrdenes}
                  dbBillOfLading={dbBillOfLading}
                  setDBBillOfLading={setDBBillOfLading}
                  setDBOrdenes={setDBOrdenes}
                  userMaster={userMaster}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="maestros/articulos/:id"
            element={
              <RutaProtegida>
                <ListaArticulo
                  dbOrdenes={dbOrdenes}
                  dbBillOfLading={dbBillOfLading}
                  setDBBillOfLading={setDBBillOfLading}
                  setDBOrdenes={setDBOrdenes}
                  dbUsuario={dbUsuario}
                  userMaster={userMaster}
                />
              </RutaProtegida>
            }
          />
          <Route
            path="maestros/contenedores"
            element={
              <RutaProtegida>
                <ListaFurgon />
              </RutaProtegida>
            }
          />
          <Route
            path="maestros/contenedores/:id"
            element={
              <RutaProtegida>
                <ListaFurgon />
              </RutaProtegida>
            }
          />
          <Route
            path="/maestros/ordenescompra"
            element={
              <RutaProtegida>
                <ListaOrdenCompra userMaster={userMaster} />
              </RutaProtegida>
            }
          />
          <Route
            path="/maestros/ordenescompra/:id"
            element={
              <RutaProtegida>
                <ListaOrdenCompra userMaster={userMaster} />
              </RutaProtegida>
            }
          />
          <Route
            path="maestros/billoflading"
            element={
              <RutaProtegida>
                <ListaBillOfLading
                  dbOrdenes={dbOrdenes}
                  setDBOrdenes={setDBOrdenes}
                  userMaster={userMaster}
                />
              </RutaProtegida>
            }
          />

          <Route
            path="maestros/billoflading/:id"
            element={
              <RutaProtegida>
                <ListaBillOfLading
                  dbOrdenes={dbOrdenes}
                  setDBOrdenes={setDBOrdenes}
                  userMaster={userMaster}
                />
              </RutaProtegida>
            }
          />
        </Routes>
      </ContainerSecciones>
      <ContainerSecciones className="footer">
        <Footer tipo={"home"} />
      </ContainerSecciones>
    </ContainerMaster>
  );
}

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
  min-height: 100dvh;

  /* display: grid; */
  /* grid-template-rows: auto 1fr auto; */
`;
const ContainerSecciones = styled.div`
  &.contenido {
    /* margin-bottom: 100px; */
    /* display: flex; */
    /* justify-content: center; */
    align-items: center;
    flex-direction: column;

    border: 1px solid transparent;
    /* margin-bottom: 100px; */
  }
  &.footer {
    width: 100%;
    height: auto;
    position: absolute;
    bottom: 0;
  }
`;
