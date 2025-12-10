import React from "react";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";

export default function TablaItems({ items }) {
  return (
    <CajaTablaGroup>
      <TablaGroup>
        <thead>
          <FilasGroup className="cabeza">
            <CeldaHeadGroup>N°</CeldaHeadGroup>
            <CeldaHeadGroup>Codigo</CeldaHeadGroup>
            <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
          </FilasGroup>
        </thead>
        <tbody>
          {items.map((item, index) => {
            return (
              <FilasGroup className="body" key={index}>
                <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                <CeldasBodyGroup>
                  <Enlace
                    target="_blank"
                    to={"/articulos/maestros/productos/" + item.codigo}
                  >
                    {item.codigo}
                  </Enlace>
                </CeldasBodyGroup>
                <CeldasBodyGroup className="startText">
                  {item.descripcion}
                </CeldasBodyGroup>
              </FilasGroup>
            );
          })}
        </tbody>
      </TablaGroup>
    </CajaTablaGroup>
  );
}
