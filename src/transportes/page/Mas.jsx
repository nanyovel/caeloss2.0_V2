import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica";
import OpinionesTMS from "../pantallasMas/OpinionesTMS";
import DocTMS from "../pantallasMas/DocTMS";
import ConfigTMS from "../pantallasMas/ConfigTMS";

export default function Mas({ setOpcionUnicaSelect, userMaster }) {
  const initialOpciones = [
    {
      nombre: "Opiniones",
      code: "opiniones",
      select: true,
    },
    {
      nombre: "Documentacion",
      code: "documentacion",
      select: false,
    },
  ];
  const [arrayOpciones, setArrayOpciones] = useState([...initialOpciones]);
  useEffect(() => {
    if (userMaster) {
      const pantallas = [...initialOpciones];
      const pantallaConfig = {
        nombre: "Config",
        code: "config",
        select: false,
      };
      //   if (userMaster.permisos.includes("accessConfigTMS")) {
      if (true) {
        pantallas.push(pantallaConfig);
      }

      setArrayOpciones([...pantallas]);
    }
  }, [userMaster]);
  const handleOpciones = (e) => {
    // let index = Number(e.target.dataset.id);
    const code = e.target.dataset.code;

    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: opcion.code === code,
      }))
    );
  };
  const [codeScreenSelect, setCodeScreenSelect] = useState("");
  useEffect(() => {
    const opcionSeleccionada = arrayOpciones.find((opcion) => opcion.select);
    setCodeScreenSelect(opcionSeleccionada.code);
  }, [arrayOpciones]);

  const [tablaActiva, setTablaActiva] = useState();
  useEffect(() => {
    if (codeScreenSelect == "opiniones") {
      setTablaActiva(<OpinionesTMS userMaster={userMaster} />);
    } else if (codeScreenSelect == "documentacion") {
      setTablaActiva(<DocTMS userMaster={userMaster} />);
    } else if (codeScreenSelect == "opcionProyecto") {
      setTablaActiva(<AddProy userMaster={userMaster} />);
    } else if (codeScreenSelect == "config") {
      setTablaActiva(<ConfigTMS userMaster={userMaster} />);
    } else {
      setTablaActiva();
    }
  }, [codeScreenSelect, userMaster]);

  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Pantallas:"
        name="grupoA"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );
  }, [OpcionUnica, arrayOpciones]);
  return <Container>{tablaActiva}</Container>;
}
const Container = styled.div`
  width: 100%;
`;
