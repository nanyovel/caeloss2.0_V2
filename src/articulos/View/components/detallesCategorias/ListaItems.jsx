import React, { useEffect, useState } from "react";

import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";
import styled from "styled-components";
import { CATEGORIASDB } from "../../../libs/CATEGORIASDB";
import { SubCategorias } from "../../../libs/SubCategoriasDB";

export default function ListaItems({ itemsLista }) {
  const [listaItems, setListaItems] = useState([]);
  useEffect(() => {
    const listaParsed = itemsLista.map((item) => {
      const subCat = SubCategorias.find(
        (subCate) => subCate.code == item.subCategoria
      );

      return {
        ...item,
        head: {
          nombreSucbCategoria: subCat?.nombre || "",
        },
      };
    });
    setListaItems(listaParsed);
  }, [itemsLista]);
  return (
    <Container>
      <CajaTablaGroup>
        <TablaGroup>
          <thead>
            <FilasGroup className="cabeza">
              <CeldaHeadGroup>N°</CeldaHeadGroup>
              <CeldaHeadGroup>Codigo</CeldaHeadGroup>
              <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
              <CeldaHeadGroup>Categoria</CeldaHeadGroup>
              <CeldaHeadGroup>Marca</CeldaHeadGroup>
            </FilasGroup>
          </thead>
          <tbody>
            {listaItems.map((item, index) => {
              return (
                <FilasGroup
                  className={`body ${index % 2 ? "impar" : "par"}`}
                  key={index}
                >
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
                  <CeldasBodyGroup className="startText">
                    {item.nombreSucbCategoria}
                  </CeldasBodyGroup>
                  <CeldasBodyGroup className="startText">
                    {item.marca}
                  </CeldasBodyGroup>
                </FilasGroup>
              );
            })}
          </tbody>
        </TablaGroup>
      </CajaTablaGroup>
    </Container>
  );
}
const Container = styled.div``;
