import React from "react";
import { ClearTheme, Theme } from "../../../config/theme";
import styled from "styled-components";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { NavLink } from "react-router-dom";
import FuncionStatus from "../../components/FuncionStatus";
import { colorDaysRemaining, fechaConfirmada } from "../../components/libs";

export default function ItemsEnviados({ materiales }) {
  return (
    <CajaTabla>
      <Tabla>
        <thead>
          <Filas className="cabeza">
            <CeldaHead>N°</CeldaHead>
            <CeldaHead>Codigo*</CeldaHead>
            <CeldaHead>Descripcion</CeldaHead>
            <CeldaHead>Qty</CeldaHead>
            <CeldaHead>Contenedor*</CeldaHead>
            <CeldaHead>Status</CeldaHead>
            <CeldaHead title="Fecha en que estara disponible en SAP">
              En SAP
            </CeldaHead>
            <CeldaHead className="proveedor">Proveedor</CeldaHead>
            <CeldaHead className="ordenCompra">O/C*</CeldaHead>
            <CeldaHead className="comentarios">Comentarios</CeldaHead>
            <CeldaHead className="comentarios">Comentarios Orden</CeldaHead>
          </Filas>
        </thead>
        <tbody>
          {materiales?.map((item, index) => {
            return (
              <Filas
                key={index}
                className={`body
                    ${index % 2 ? "impar" : "par"}
                      
                    `}
              >
                <CeldasBody className="index">{index + 1}</CeldasBody>
                <CeldasBody>
                  <Enlaces
                    to={`/importaciones/maestros/articulos/${encodeURIComponent(item.codigo)}`}
                    target="_blank"
                  >
                    {item.codigo}
                  </Enlaces>
                </CeldasBody>
                <CeldasBody title={item.descripcion} className="descripcion">
                  {item.descripcion}
                </CeldasBody>
                <CeldasBody>{item.qty}</CeldasBody>
                <CeldasBody>
                  {!item.isCargaSuelta ? (
                    <Enlaces
                      to={`/importaciones/maestros/contenedores/${encodeURIComponent(item.furgon)}`}
                      target="_blank"
                    >
                      {item.furgon}
                    </Enlaces>
                  ) : (
                    <Enlaces
                      to={`/importaciones/maestros/billoflading/${encodeURIComponent(item.datosBL.numeroBL)}`}
                      target="_blank"
                    >
                      {item.part}
                    </Enlaces>
                  )}
                </CeldasBody>
                <CeldasBody
                  className="status"
                  title={FuncionStatus(item.status)}
                >
                  {FuncionStatus(item.status)}
                </CeldasBody>
                <CeldasBody
                  title={
                    item?.llegadaSapDetalles?.fechaConfirmada
                      ? "Fecha confirmada"
                      : "Fecha estimada"
                  }
                >
                  {item.fechas.llegada05Concluido.fecha.slice(0, 10)}
                  {fechaConfirmada(item.fechas.llegada05Concluido.confirmada)}
                </CeldasBody>
                <CeldasBody title={item.proveedor} className="proveedor">
                  {item.proveedor}
                </CeldasBody>
                <CeldasBody className="ordenCompra">
                  <Enlaces
                    to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(item.ordenCompra)}`}
                    target="_blank"
                  >
                    {item.ordenCompra}
                  </Enlaces>
                </CeldasBody>
                <CeldasBody title={item.comentarios} className="comentarios">
                  {item.comentarios}
                </CeldasBody>
                <CeldasBody
                  title={item.comentarioOrden}
                  className="comentarios"
                >
                  {item.comentarioOrden}
                </CeldasBody>
              </Filas>
            );
          })}
        </tbody>
      </Tabla>
    </CajaTabla>
  );
}

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
`;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaTabla = styled(CajaTablaGroup)``;

const Tabla = styled(TablaGroup)`
  @media screen and (max-width: 650px) {
    margin-bottom: 200px;
  }
  @media screen and (max-width: 380px) {
    margin-bottom: 130px;
  }
`;

const Filas = styled(FilasGroup)``;

const CeldaHead = styled(CeldaHeadGroup)`
  &.qty {
    width: 300px;
  }
  &.comentarios {
    max-width: 200px;
  }
  &.proveedor {
  }
  &.ordenCompra {
  }

  @media screen and (max-width: 715px) {
    font-size: 14px;
  }
  @media screen and (max-width: 460px) {
    font-weight: normal;
  }
  &.qtyPendiente {
    font-size: 12px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
  &.index {
    /* max-width: 5px; */
  }

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.ordenCompra {
  }
  &.comentarios {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.status {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media screen and (max-width: 650px) {
      max-width: 60px;
      padding: 0;
    }
  }
  &.qtyPendiente {
    padding: 2px;
  }
  @media screen and (max-width: 715px) {
    font-size: 14px;
    padding-left: 2px;
    padding-right: 2px;
  }
  padding: 0 4px;
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EncabezadoTabla = styled.div`
  text-decoration: underline;
  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (max-width: 720px) {
    padding-left: 0;
  }
`;
const TituloEncabezadoTabla = styled.h2`
  color: black;
  font-size: 1.2rem;
  font-weight: normal;
  padding-left: 10px;
  &.subTitulo {
    color: ${ClearTheme.complementary.warning};
    font-size: 1rem;
    @media screen and (max-width: 460px) {
      font-size: 13px;
    }
  }
  @media screen and (max-width: 590px) {
    font-size: 16px;
  }
  @media screen and (max-width: 400px) {
    font-size: 14px;
  }
`;
