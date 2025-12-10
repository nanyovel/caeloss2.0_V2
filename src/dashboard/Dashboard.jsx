import { useEffect, useState } from "react";
import { Header } from "../components/Header";
import styled from "styled-components";
import { NavLink, Route, Routes, useParams } from "react-router-dom";

import ListaTodosLosUsuarios from "./ListaTodosLosUsuarios.jsx";
import { DetalleUsuarios } from "./DetalleUsuarios.jsx";
import { ListaUsuarios } from "./ListaUsuarios.jsx";

export const Dashboard = ({ userMaster }) => {
  useEffect(() => {
    document.title = "Caeloss - Dashboard";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  // Extrar un grupo de documentos por una condicion
  const [dbUsuario, setDBUsuario] = useState();
  const parametro = useParams();
  const docUser = parametro.id;

  return (
    <Contenedor>
      <Header titulo={"Dashboard"} />

      <Routes>
        {/* Vista de tabla de todos los usuarios */}
        <Route
          path="/"
          element={<ListaTodosLosUsuarios dbUsuario={dbUsuario} />}
        />
        {/* Padre de usuarios, dentro esta el componente molde/Plantilla */}
        <Route
          path="usuarios"
          element={<ListaUsuarios userMaster={userMaster} />}
        />
        <Route
          path="usuarios/:id"
          element={<ListaUsuarios userMaster={userMaster} />}
        />
      </Routes>
    </Contenedor>
  );
};

const Contenedor = styled.div`
  width: 95%;
  overflow: auto;
  margin: auto;
  margin-bottom: 85px;
`;
