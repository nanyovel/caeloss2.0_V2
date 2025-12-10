import React from "react";
import styled from "styled-components";

import { Tema } from "../../config/theme";
import { vehiculosSchema } from "../schemas/vehiculosSchema.js";

export default function TablaProporcionCarga() {
  return (
    <CajaTabla>
      {vehiculosSchema.map((vehi, index) => {
        return (
          <CajaHijaVeh key={index}>
            <CajaImg>
              <Img src={vehi.urlFoto} />
            </CajaImg>
            <CajaDescripcion>
              <CajitaDetalle>
                <TituloDetalle>Descripcion</TituloDetalle>
                <DetalleTexto className="sinWrap">
                  {vehi.descripcion}
                </DetalleTexto>
              </CajitaDetalle>
              <CajitaDetalle>
                <TituloDetalle>Fraccion de carga</TituloDetalle>
                <DetalleTexto className="sinWrap">
                  {vehi.fraccionesCarga}
                </DetalleTexto>
              </CajitaDetalle>
            </CajaDescripcion>
          </CajaHijaVeh>
        );
      })}
    </CajaTabla>
  );
}
const CajaTabla = styled.div`
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 5px;
  padding: 10px;
  width: 70%;
  margin: auto;
  /* height: 500px; */
  /* display: flex; */
  /* justify-content: center; */
`;
const CajaHijaVeh = styled.div`
  width: 100%;
  /* min-height: 100px; */
  border: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  &:hover {
    background-color: ${Tema.primary.azulOscuro};
  }
  padding: 10px;
`;
const CajaImg = styled.div`
  width: 25%;
`;
const Img = styled.img`
  width: 100%;
`;
const CajaDescripcion = styled.div`
  width: 75%;
  /* border: 1px solid blue; */
`;

const TituloDetalle = styled.p`
  width: 49%;
  color: inherit;
  text-align: start;
`;

const DetalleTexto = styled.p`
  text-align: end;
  /* height: 20px; */
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  &.sinWrap {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  /* color: ${Tema.neutral.blancoHueso}; */
`;
