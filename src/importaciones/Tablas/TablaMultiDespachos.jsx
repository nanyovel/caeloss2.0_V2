import { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faXmark } from "@fortawesome/free-solid-svg-icons";
import { NavLink } from "react-router-dom";
import { ClearTheme, Tema } from "../../config/theme";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { BotonQuery } from "../../components/BotonQuery";

export const TablaMultiDespachos = ({
  tablaDespachos,
  setHasDespachos,
  setNClases,

  //
  despachosDB,
  indexDespSelect,
  materialesOrden,
}) => {
  const cancelar = () => {
    setNClases([]);
    setHasDespachos(false);
  };
  console.log(despachosDB);
  console.log(despachosDB[indexDespSelect]);
  console.log(indexDespSelect);
  return (
    <>
      <br />
      <br />
      <br />
      <BotonQuery despachosDB={despachosDB} />
      <EncabezadoTabla>
        <TituloEncabezadoTabla>
          <BtnNormal
            type="button"
            className={"borrada"}
            onClick={() => cancelar()}
          >
            <Icono icon={faXmark} />
            Cancelar
          </BtnNormal>

          {`Entregas del ítem ${materialesOrden[indexDespSelect].codigo} - ${materialesOrden[indexDespSelect].descripcion}`}
        </TituloEncabezadoTabla>
      </EncabezadoTabla>

      <CajaTablaGroup>
        <TablaGroup ref={tablaDespachos}>
          <thead>
            <FilasGroup className="cabeza">
              <CeldaHeadGroup>N°</CeldaHeadGroup>
              <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
              <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
              <CeldaHeadGroup>Qty</CeldaHeadGroup>
              <CeldaHeadGroup>Contenedor*</CeldaHeadGroup>
            </FilasGroup>
          </thead>
          <tbody>
            {despachosDB.map((desp, index) => {
              return (
                <FilasGroup
                  key={index}
                  className={`body
                  ${index % 2 ? "impar" : ""}
                  `}
                >
                  <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                  <CeldasBodyGroup>
                    <Enlaces
                      to={`/importaciones/maestros/articulos/${encodeURIComponent(desp.codigo)}`}
                      target="_blank"
                    >
                      {desp.codigo}
                    </Enlaces>
                  </CeldasBodyGroup>
                  <CeldasBodyGroup className="descripcion startText">
                    {desp.descripcion}
                  </CeldasBodyGroup>
                  <CeldasBodyGroup>{desp.qty}</CeldasBodyGroup>
                  <CeldasBodyGroup>
                    {desp.tipoBL === 0 ? (
                      <Enlaces
                        to={`/importaciones/maestros/contenedores/${encodeURIComponent(desp.numeroFurgon)}`}
                        target="_blank"
                      >
                        {desp.numeroFurgon}
                      </Enlaces>
                    ) : desp.tipoBL === 1 ? (
                      <Enlaces
                        to={`/importaciones/maestros/billoflading/${encodeURIComponent(desp.numeroBL)}`}
                        target="_blank"
                      >
                        {desp.numeroFurgon}
                      </Enlaces>
                    ) : (
                      "a"
                    )}
                  </CeldasBodyGroup>
                </FilasGroup>
              );
            })}
          </tbody>
        </TablaGroup>
      </CajaTablaGroup>
    </>
  );
};

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 10px;
  /* border: 1px solid red; */
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

  margin-bottom: 45px;
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  border-radius: 5px;
  width: 95%;
  margin: auto;
  margin-bottom: 30px;
  border: 1px solid #000;
`;

const CeldaHead = styled.th`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;

  &:nth-child(2) {
    width: 50px;
  }
  &:nth-child(3) {
    width: 250px;
  }
  &:nth-child(4) {
    width: 60px;
  }
`;
const Filas = styled.tr`
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
    background-color: ${Tema.secondary.azulSuave};
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
  color: ${Tema.secondary.azulOpaco};
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
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }
`;
const EncabezadoTabla = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(6px);
  color: white;

  display: flex;
  justify-content: start;
  align-items: center;
  justify-content: space-between;
  padding-left: 15px;
`;
const TituloEncabezadoTabla = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
`;

const BtnNormal = styled(BtnGeneralButton)`
  &.borrada {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
  }
  &.eliminadaRealizado {
    background-color: #eaa5a5;
    &:hover {
      cursor: default;
      color: white;
    }
  }
  &.editaEliminada {
    background-color: #407aadb5;
    cursor: default;
    color: white;
  }
  &.buscar {
    margin: 0;
    /* height: 30px; */
  }
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
