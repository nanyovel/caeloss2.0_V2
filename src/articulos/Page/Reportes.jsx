import React, { useEffect, useState } from "react";
import ReportItems from "../pantallasReportes/ReportItems";
import ReportCat from "../pantallasReportes/ReportCat";
import { OpcionUnica } from "../../components/OpcionUnica";

export default function Reportes({ setOpcionUnicaSelect, userMaster }) {
  // ******************* Navegacion y seleccion de pantalla *******************
  useEffect(() => {
    setOpcionUnicaSelect(null);
  }, []);
  // ****************** NAVEGACION CABECERA ******************

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Productos",
      code: "articulos",
      select: true,
    },
    {
      nombre: "Categorias",
      code: "categorias",
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
    const arrayOpcionSelect = arrayOpciones.find((opcion) => opcion.select);

    if (arrayOpcionSelect.code === "articulos") {
      setTablaActiva(<ReportItems userMaster={userMaster} />);
    } else if (arrayOpcionSelect.code === "categorias") {
      setTablaActiva(<ReportCat userMaster={userMaster} />);
    }
  }, [arrayOpciones, userMaster]);
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
  return tablaActiva;
}
