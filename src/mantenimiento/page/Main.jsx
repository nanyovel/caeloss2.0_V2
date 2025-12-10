import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { fetchGetDocs } from "../../libs/useDocByCondition";
import { OpcionUnica } from "../../components/OpcionUnica";
import Equipos from "./TablasMain/Equipos";

export default function Main({
  setOpcionUnicaSelect,
  userMaster,
  equiposDB,
  setEquiposDB,
}) {
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Equipos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Combustible",
      opcion: 1,
      select: false,
    },
  ]);
  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  const [tablaActiva, setTablaActiva] = useState();
  useEffect(() => {
    if (arrayOpciones[0].select == true) {
      setTablaActiva(
        <Equipos equiposDB={equiposDB} setEquiposDB={setEquiposDB} />
      );
    } else if (arrayOpciones[1].select == true) {
      setTablaActiva(<h1>Combus</h1>);
    }
  }, [userMaster, arrayOpciones]);

  // ***************** CONTROLES / FILTROS ********************
  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Pantallas"
        name="pantallas"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );
  }, [arrayOpciones]);
  return <>{tablaActiva}</>;
}
