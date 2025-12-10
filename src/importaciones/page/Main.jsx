import { useState } from "react";

import { TablaListaTodosLosItems } from "../TablasMain/TablaListaTodosLosItems";
import { TablaListaTodosLosFurgones } from "../TablasMain/TablaListaTodosLosFurgones";
import { TablaListaTodasLasOC } from "../TablasMain/TablaListaTodasLasOC";
import { TablaListaTodosLosBLs } from "../TablasMain/TablaListaTodosLosBLs";
// import { BotonQuery } from '../../components/BotonQuery';
import styled from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica";
import { useEffect } from "react";

export const Main = ({
  setOpcionUnicaSelect,
  setDBGlobalFurgones,
  dbGlobalFurgones,
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
  dbGlobalBL,
  setDBGlobalBL,
}) => {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Articulos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Contenedores",
      opcion: 1,
      select: false,
    },
    {
      nombre: "O/C",
      opcion: 2,
      select: false,
    },
    {
      nombre: "BLs",
      opcion: 3,
      select: false,
    },
  ]);

  const [tablaActiva, setTablaActiva] = useState();

  useEffect(() => {
    if (arrayOpciones[0].select == true) {
      setTablaActiva(
        <TablaListaTodosLosItems
          setDBGlobalFurgones={setDBGlobalFurgones}
          dbGlobalFurgones={dbGlobalFurgones}
          setDBGlobalOrdenes={setDBGlobalOrdenes}
          dbGlobalOrdenes={dbGlobalOrdenes}
        />
      );
    } else if (arrayOpciones[1].select == true) {
      setTablaActiva(
        <TablaListaTodosLosFurgones dbGlobalFurgones={dbGlobalFurgones} />
      );
    } else if (arrayOpciones[2].select == true) {
      setTablaActiva(
        <TablaListaTodasLasOC
          //
          setDBGlobalOrdenes={setDBGlobalOrdenes}
          dbGlobalOrdenes={dbGlobalOrdenes}
        />
      );
    } else if (arrayOpciones[3].select == true) {
      setTablaActiva(
        <TablaListaTodosLosBLs
          dbGlobalBL={dbGlobalBL}
          setDBGlobalBL={setDBGlobalBL}
        />
      );
    }
  }, [dbGlobalFurgones, dbGlobalOrdenes, dbGlobalBL, arrayOpciones]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  // QUE EN LA SECCION DE NAVEGACION APAREZCA LAS OPCIONES DE SELECION UNICA ESPECIFICAS
  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Pantallas"
        name="grupoA"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );
  }, [OpcionUnica, arrayOpciones]);

  return <Container>{tablaActiva}</Container>;
};
const Container = styled.div`
  margin-bottom: 100px;
`;
