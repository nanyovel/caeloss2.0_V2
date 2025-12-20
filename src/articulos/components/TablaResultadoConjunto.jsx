import React from "react";

import styled from "styled-components";
import {
  CajaTablaGroup,
  TablaGroup,
  FilasGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  ImgCelda,
} from "../../components/JSXElements/GrupoTabla";

export default function TablaResultadoConjunto({ datos }) {
  return (
    <CajaTablaGroup>
      <TablaGroup>
        <thead>
          <FilasGroup className="cabeza">
            <CeldaHeadGroup>N°</CeldaHeadGroup>
            <CeldaHeadGroup>Imagen</CeldaHeadGroup>
            <CeldaHeadGroup>Titulo</CeldaHeadGroup>
            <CeldaHeadGroup>Subtitulo</CeldaHeadGroup>
            <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
          </FilasGroup>
        </thead>
        <tbody>
          {datos.map((conjunto, index) => {
            return (
              <FilasGroup className="body" key={index}>
                <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                <CeldasBodyGroup>
                  <ImgCelda src={conjunto.imagenes[0].url} />
                </CeldasBodyGroup>
                <CeldasBodyGroup>
                  <Enlace
                    target="_blank"
                    to={"/articulos/maestros/conjuntos/" + conjunto.url}
                  >
                    {conjunto.titulo}
                  </Enlace>
                </CeldasBodyGroup>
                <CeldasBodyGroup>{conjunto.subTitulo}</CeldasBodyGroup>
                <CeldasBodyGroup>{conjunto.descripcion}</CeldasBodyGroup>
              </FilasGroup>
            );
          })}
        </tbody>
      </TablaGroup>
    </CajaTablaGroup>
  );
}
