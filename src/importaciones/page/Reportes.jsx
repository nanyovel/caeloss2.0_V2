import { useEffect, useState } from "react";
import { OpcionUnica } from "../../components/OpcionUnica";

import { TablaArticulosRep } from "../TablasReportes/TablaArticulosRep";
import TablaBLsRep from "../TablasReportes/TablaBLsRep";
import TablaFurgonesRep from "../TablasReportes/TablaFurgonesRep";

export default function Reportes({ dbOrdenes, setOpcionUnicaSelect }) {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [dbBillOfLading, setDBBillOfLading] = useState([]);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Articulos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Bill of Lading",
      opcion: 1,
      select: false,
    },
    {
      nombre: "Contenedores",
      opcion: 2,
      select: false,
    },
  ]);

  const [tablaActiva, setTablaActiva] = useState();
  useEffect(() => {
    const opcionSeleccionada = arrayOpciones.find((opcion) => opcion.select);
    if (opcionSeleccionada.nombre == "Articulos") {
      setTablaActiva(<TablaArticulosRep />);
    } else if (opcionSeleccionada.nombre == "Bill of Lading") {
      setTablaActiva(<TablaBLsRep />);
    } else if (opcionSeleccionada.nombre == "Contenedores") {
      setTablaActiva(<TablaFurgonesRep />);
    }
  }, [dbBillOfLading, dbOrdenes, arrayOpciones]);

  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  //
  //
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

  return <>{tablaActiva}</>;
}
