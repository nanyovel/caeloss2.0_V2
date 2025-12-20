import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Cabecera from "./components/detallesCategorias/Cabecera";
import { useParams } from "react-router-dom";
import { CATEGORIASDB } from "../libs/CATEGORIASDB";
import MenuPestannias from "../../components/MenuPestannias";
// import articulosDB2 from "../Database/itemsSubir2";

import ListaItems from "./components/detallesCategorias/ListaItems";
import ListaConjuntos from "./components/detallesCategorias/ListaConjuntos";
import ListaDocumentos from "./components/detallesCategorias/ListaDocumentos";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";

export default function DetalleCategorias() {
  const location = useParams();
  const docUser = location.id;

  const [categoriaMaster, setCategoriaMaster] = useState(null);

  useEffect(() => {
    const itemFind = CATEGORIASDB.find((item) => item.code == docUser);
    setCategoriaMaster(itemFind);
  }, []);

  //
  const [arrayPestannias, setArrayPestannias] = useState([
    { nombre: "Articulos", code: "articulos", select: true },
    { nombre: "Conjuntos", code: "conjuntos", select: false },
    { nombre: "Documentos", code: "documentos", select: false },
    { nombre: "Imagenes", code: "imagenes", select: false },
  ]);
  const handlePestannias = (e) => {
    const dataCode = e.target.dataset.code;
    const arrayAux = arrayPestannias.map((opcion) => {
      return {
        ...opcion,
        select: dataCode == opcion.code,
      };
    });
    setArrayPestannias(arrayAux);
  };

  // articulos de esta categoria
  const [itemsLista, setItemsLista] = useState([]);

  useEffect(() => {
    if (categoriaMaster) {
      const itemsThisCategory = PRODUCT_FULL2.filter(
        (item) => item.categoria == categoriaMaster.code
      );
      setItemsLista(itemsThisCategory);
    }
  }, [PRODUCT_FULL2, categoriaMaster]);
  return (
    categoriaMaster && (
      <Container>
        <Cabecera categoriaMaster={categoriaMaster} />
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />
        {arrayPestannias.find((opcion) => opcion.code == "articulos")
          .select && <ListaItems itemsLista={itemsLista} />}
        {arrayPestannias.find((opcion) => opcion.code == "conjuntos")
          .select && <ListaConjuntos docUser={docUser} />}
        {arrayPestannias.find((opcion) => opcion.code == "documentos")
          .select && <ListaDocumentos itemsLista={itemsLista} />}
      </Container>
    )
  );
}
const Container = styled.div``;
