import { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";

import { Route, Routes, useLocation } from "react-router-dom";
import { RutaProtegida } from "../context/RutaProtegida";
import Footer from "../components/Footer";
import Maestros from "./Page/Maestros";

import Add from "./Page/Add";
import DetalleArticulo from "./View/DetalleArticulo";
import Main from "./Page/Main";

import CajaNavegacion from "../components/CajaNavegacion";
import { parsearPath } from "../libs/navegacionLib";
import Reportes from "./Page/Reportes";
import DetalleCategorias from "./View/DetalleCategorias";
import DetalleConjunto from "./View/DetalleConjunto";

export default function Articulos({ userMaster }) {
  // ******************RECURSOS GENERALES******************
  useEffect(() => {
    document.title = "Caeloss - Articulos";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  // ****************** NAVEGACION ******************
  const location = useLocation();
  const [pageSelect, setPageSelect] = useState({});
  const pathModulo = "/articulos";
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
    <Container>
      <ContainerMaster>
        <ContainerSecciones>
          <Header titulo={"Detalle de articulos"} />
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
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros"
                element={
                  <RutaProtegida>
                    <Maestros
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/productos/"
                element={
                  <RutaProtegida>
                    <DetalleArticulo
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/productos/:id"
                element={
                  <RutaProtegida>
                    <DetalleArticulo
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/categorias/"
                element={
                  <RutaProtegida>
                    <DetalleCategorias
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/categorias/:id"
                element={
                  <RutaProtegida>
                    <DetalleCategorias
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/conjuntos/"
                element={
                  <RutaProtegida>
                    <DetalleConjunto
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/maestros/conjuntos/:id"
                element={
                  <RutaProtegida>
                    <DetalleConjunto
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
                  </RutaProtegida>
                }
              />
              <Route
                path="/reportes"
                element={
                  <Reportes
                    userMaster={userMaster}
                    opcionUnicaSelect={opcionUnicaSelect}
                    setOpcionUnicaSelect={setOpcionUnicaSelect}
                  />
                }
              />
              <Route
                path="/add"
                element={
                  <RutaProtegida>
                    <Add
                      userMaster={userMaster}
                      opcionUnicaSelect={opcionUnicaSelect}
                      setOpcionUnicaSelect={setOpcionUnicaSelect}
                    />
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
}

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
