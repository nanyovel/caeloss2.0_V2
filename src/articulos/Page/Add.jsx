import { useEffect, useState } from "react";
import styled from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica";
import ProductosAdd from "../TablasAdd/ProductosAdd";
import AssetsAdd from "../TablasAdd/AssetsAdd";
import ConjuntoAdd from "../TablasAdd/ConjuntoAdd";

export default function Add({
  setPageSelect,
  userMaster,
  opcionUnicaSelect,
  setOpcionUnicaSelect,
}) {
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Productos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Assets",
      opcion: 1,
      select: false,
    },
    {
      nombre: "Conjunto",
      opcion: 2,
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
      setTablaActiva(<ProductosAdd userMaster={userMaster} />);
    } else if (arrayOpciones[1].select == true) {
      setTablaActiva(<AssetsAdd userMaster={userMaster} />);
    } else if (arrayOpciones[2].select == true) {
      setTablaActiva(<ConjuntoAdd userMaster={userMaster} />);
    }
  }, [arrayOpciones]);
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
  return <ContainerMaster>{tablaActiva}</ContainerMaster>;
}
const ContainerMaster = styled.div`
  position: relative;
`;
