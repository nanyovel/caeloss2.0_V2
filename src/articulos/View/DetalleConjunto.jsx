import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import styled from "styled-components";
import {
  fetchDocsByArrayContains,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import Cabecera from "./components/detallesConjunto.jsx/Cabecera";
import MenuPestannias from "../../components/MenuPestannias";
import GaleriaMulti from "../../components/GaleriaMulti";
import TablaItems from "./components/detallesConjunto.jsx/TablaItems";

export default function DetalleConjunto() {
  const location = useParams();
  const docUser = location.id;
  const [conjuntoDB, setConjuntoDB] = useState(null);
  useDocByCondition("conjuntos", setConjuntoDB, "url", "==", docUser);
  const [conjuntoMaster, setConjuntoMaster] = useState(null);
  useEffect(() => {
    if (conjuntoDB?.length > 0) {
      console.log(conjuntoDB);
      setConjuntoMaster(conjuntoDB[0]);
    }
  }, [conjuntoDB]);
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Galeria",
      code: "galeria",
      select: true,
    },
    {
      nombre: "Items",
      code: "items",
      select: false,
    },
  ]);
  const handlePestannias = (e) => {
    const codeDataset = e.target.dataset.code;

    setArrayOpciones(
      arrayOpciones.map((opcion) => {
        return {
          ...opcion,
          select: codeDataset === opcion.code,
        };
      })
    );
  };
  return (
    conjuntoMaster && (
      <Container>
        <Cabecera conjuntoMaster={conjuntoMaster} />
        <MenuPestannias
          arrayOpciones={arrayOpciones}
          handlePestannias={handlePestannias}
        />
        {arrayOpciones.find((opcion) => opcion.select).code == "galeria" && (
          <ContenedorGaleria>
            <GaleriaMulti
              arrayImg={conjuntoMaster.imagenes}
              arrayVideos={conjuntoMaster.videos}
            />
          </ContenedorGaleria>
        )}
        {arrayOpciones.find((opcion) => opcion.select).code == "items" && (
          <ContenedorGaleria>
            <TablaItems items={conjuntoMaster.items} />
          </ContenedorGaleria>
        )}
      </Container>
    )
  );
}
const Container = styled.div``;
const ContenedorGaleria = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  margin: auto;
`;
