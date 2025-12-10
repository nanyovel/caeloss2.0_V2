import { useEffect, useState } from "react";
import { OpcionUnica } from "../../components/OpcionUnica";
import ProductosMain from "../TablasMain/ProductosMain";
import CategoriasMain from "../TablasMain/CategoriasMain";
import ConjuntoMain from "../TablasMain/ConjuntoMain";

export default function Main({ opcionUnicaSelect, setOpcionUnicaSelect }) {
  // ****************** NAVEGACION CABECERA ******************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Productos",
      code: "productos",
      select: true,
    },
    {
      nombre: "Categorias",
      code: "categorias",
      select: false,
    },
    {
      nombre: "Conjuntos",
      code: "conjuntos",
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

    if (arrayOpcionSelect.code === "productos") {
      setTablaActiva(
        <ProductosMain setOpcionUnicaSelect={setOpcionUnicaSelect} />
      );
    } else if (arrayOpcionSelect.code === "categorias") {
      setTablaActiva(<CategoriasMain />);
    } else if (arrayOpcionSelect.code === "conjuntos") {
      setTablaActiva(<ConjuntoMain />);
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

  return tablaActiva;
}
