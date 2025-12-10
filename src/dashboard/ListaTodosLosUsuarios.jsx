import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../config/theme";
import { NavLink, useParams } from "react-router-dom";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { FuncionEnviarCorreo } from "../libs/FuncionEnviarCorreo";
import { PlantillaCorreoAbierta } from "../libs/PlantillasCorreo/PlantillaCorreoAbierta";
import ActualizarDoc from "./ActualizarDoc";
import EnviarCorreo from "./EnviarCorreo";
import { useDocByCondition } from "../libs/useDocByCondition";

export default function ListaTodosLosUsuarios({}) {
  // Extrar un grupo de documentos por una condicion
  const [dbUsuario, setDBUsuario] = useState();
  const parametro = useParams();
  const docUser = parametro.id;
  const [userList, setUserList] = useState([]);

  useDocByCondition("usuarios", setDBUsuario, "userName", "!=", "null");
  console.log(parametro);
  useEffect(() => {
    dbUsuario?.forEach((user) => {});
    // Función de comparación para ordenar por fecha de registro
    function compararFechas(a, b) {
      return a.fechaRegistro - b.fechaRegistro;
    }
    if (dbUsuario) {
      const dbUserES6 = dbUsuario.map((user) => {
        const annio = user.fechaRegistro.slice(6, 10);
        const mes = user.fechaRegistro.slice(3, 5);
        const dia = user.fechaRegistro.slice(0, 2);
        let hora = user.fechaRegistro.slice(11, 13);
        let minutos = user.fechaRegistro.slice(14, 16);
        let segundos = user.fechaRegistro.slice(17, 19);
        const tipo = user.fechaRegistro.slice(24, 27);

        if (hora != 12) {
          if (tipo == "PM") {
            hora = Number(hora) + 12;
          }
        }
        if (hora == 12) {
          if (tipo == "AM") {
            hora = 0;
          }
        }

        const fechaES6 = new Date(annio, mes - 1, dia, hora, minutos, segundos);

        return {
          ...user,
          fechaRegistro: fechaES6,
        };
      });

      // Ordenar el array de usuarios por fecha de registro

      setUserList(dbUserES6.sort(compararFechas));
    }
  }, [dbUsuario]);

  useEffect(() => {
    if (dbUsuario?.length > 0) {
      dbUsuario.forEach((user) => {
        if (user.permisos.includes("viewAllRequestTMS")) {
          console.log(user.userName);
        }
      });
    }
  }, [dbUsuario]);

  return (
    <Container>
      <ActualizarDoc />
      {/* <EnviarCorreo dbUsuario={dbUsuario} /> */}
      <>
        <CajaEncabezado>
          <TituloEncabezado>Lista de todos los usuarios</TituloEncabezado>
        </CajaEncabezado>

        <CajaTabla>
          <Tabla>
            <thead>
              <Filas className="cabeza">
                <CeldaHead>N°</CeldaHead>
                <CeldaHead>Username*</CeldaHead>
                <CeldaHead>Nombre</CeldaHead>
                <CeldaHead>Apellido</CeldaHead>
                <CeldaHead>Dpto</CeldaHead>
                <CeldaHead>Sucursal</CeldaHead>
                <CeldaHead>Registro</CeldaHead>
              </Filas>
            </thead>
            <tbody>
              {userList.length > 0 &&
                userList.map((user, index) => {
                  return (
                    <Filas key={index} className="body">
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody>
                        <Enlaces
                          to={`/dashboard/usuarios/${user.userName}`}
                          target="_blank"
                        >
                          {user.userName}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody>{user.nombre}</CeldasBody>
                      <CeldasBody>{user.apellido}</CeldasBody>
                      <CeldasBody>{user.dpto}</CeldasBody>
                      <CeldasBody>{user.localidad.nombreSucursal}</CeldasBody>
                      <CeldasBody className="registro">
                        {format(
                          user.fechaRegistro,
                          `dd/MM/yyyy hh:mm:ss:SSS aa`,
                          { locale: es }
                        )}
                      </CeldasBody>
                    </Filas>
                  );
                })}
            </tbody>
          </Tabla>
        </CajaTabla>
      </>
    </Container>
  );
}

const Container = styled.div``;
const CajaEncabezado = styled.div`
  padding: 15px;
`;
const TituloEncabezado = styled.h2`
  color: ${Tema.primary.azulBrillante};
  border-bottom: 2px solid ${Tema.primary.azulBrillante};
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  padding: 0 10px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(5px);
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  margin-left: 5px;
`;

const Filas = styled.tr`
  color: white;
  &.body {
    font-weight: lighter;
    border-bottom: 1px solid #49444457;
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &:hover {
    background-color: #4b4bc5;
  }
`;

const CeldaHead = styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled.td`
  border: 1px solid black;
  font-size: 0.9rem;
  height: 25px;

  text-align: center;
  &.romo {
    cursor: pointer;
    &:hover {
    }
  }
  &.descripcion {
    text-align: start;
    padding-left: 5px;
  }
  &.registro {
    white-space: nowrap;
    text-align: start;
    padding: 0 5px;
  }
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const BtnSimple = styled(BtnGeneralButton)``;
