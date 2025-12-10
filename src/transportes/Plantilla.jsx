import React from "react";
import { ClearTheme } from "../config/theme";
import styled from "styled-components";

export default function Plantilla() {
  return (
    <Contenedor>
      <TituloPrincipal>Notificaciones Caeloss</TituloPrincipal>
      <Parrafo>
        Se ha creado la solicitud N° 0000, la cual contiene los siguientes
        materiales:
      </Parrafo>
      <CajaTabla>
        <TablaGroup>
          <thead>
            <FilasGroup className="cabeza">
              <CeldaHeadGroup>Codigo</CeldaHeadGroup>
              <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
              <CeldaHeadGroup>Qty</CeldaHeadGroup>
            </FilasGroup>
          </thead>
          <tbody>
            <FilasGroup className="body impar">
              <CeldasBodyGroup>03119</CeldasBodyGroup>
              <CeldasBodyGroup>Plancha de yeso light rey</CeldasBodyGroup>
              <CeldasBodyGroup>180</CeldasBodyGroup>
            </FilasGroup>
            <FilasGroup className="body ">
              <CeldasBodyGroup>04022</CeldasBodyGroup>
              <CeldasBodyGroup>Masilla tapa negra</CeldasBodyGroup>
              <CeldasBodyGroup>200</CeldasBodyGroup>
            </FilasGroup>
            <FilasGroup className="body impar">
              <CeldasBodyGroup>04028</CeldasBodyGroup>
              <CeldasBodyGroup>Masilla tapa keraflor</CeldasBodyGroup>
              <CeldasBodyGroup>15</CeldasBodyGroup>
            </FilasGroup>
            <FilasGroup className="body">
              <CeldasBodyGroup>04028</CeldasBodyGroup>
              <CeldasBodyGroup>Masilla tapa keraflor</CeldasBodyGroup>
              <CeldasBodyGroup>15</CeldasBodyGroup>
            </FilasGroup>
          </tbody>
        </TablaGroup>
      </CajaTabla>
    </Contenedor>
  );
}
const Contenedor = styled.div`
  width: 100%;
  margin-top: auto;
  max-width: 600px;
  background-color: #2b66ae;
  min-height: 250px;
`;
const TituloPrincipal = styled.h1`
  width: 100%;
  height: 70px;
  text-align: center;
  /* color: #413c16; */
  color: white;
  align-content: center;
  background-color: #19b4ef;
  text-decoration: underline;
`;
const Parrafo = styled.p`
  color: white;
  width: 100%;
  padding: 8px;
`;
const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  border: 1px solid white;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 7px;
    width: 7px;
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
const TablaGroup = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 90%;
  margin: auto;
`;

const FilasGroup = styled.tr`
  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  &.body {
    font-weight: normal;
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }

  &.impar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
  }
`;

const CeldaHeadGroup = styled.th`
  text-align: center;
  padding: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  font-weight: 400;
  border-left: 1px solid #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
const CeldasBodyGroup = styled.td`
  font-size: 15px;
  font-weight: 400;
  height: 25px;
  text-align: center;
  &.par {
    border-left: 1px solid #e1eef4;
  }
`;
