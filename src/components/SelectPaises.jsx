import { useEffect, useState } from "react";
import Select from "react-select";
import { generatorIconFlagURL, ListaPaises } from "./ListaPaises";

// Lista de países con sus banderas
const opcionesPaises = ListaPaises.map((pais) => {
  return {
    ...pais,
    value: pais.siglas.toLowerCase(),
    label: pais.nombre,
  };
});
const opcionesPaises2 = [
  {
    value: "do",
    label: "República Dominicana",
    flag: "https://flagcdn.com/w20/do.png",
  },
  {
    value: "us",
    label: "Estados Unidos",
    flag: "https://flagcdn.com/w20/us.png",
  },
  {
    value: "mx",
    label: "México",
    flag: "https://flagcdn.com/w20/mx.png",
  },
  {
    value: "es",
    label: "España",
    flag: "https://flagcdn.com/w20/es.png",
  },
  {
    value: "co",
    label: "Colombia",
    flag: "https://flagcdn.com/w20/co.png",
  },
];

// Cómo se ve cada opción (bandera + texto)
const formatOptionLabel = (option) => (
  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
    <img
      src={generatorIconFlagURL(option.siglas)}
      alt={option.label}
      width="20"
      height="15"
    />
    <span>{option.label}</span>
  </div>
);

// Estilos básicos para que se vea bonito
const customStyles = {
  control: (provided) => ({
    ...provided,
    borderRadius: 8,
    padding: "2px",
    minHeight: "42px",
  }),
  multiValue: (provided) => ({
    ...provided,
    borderRadius: 999,
  }),
};

export default function SelectPaises({ seleccionDefault }) {
  const [paisesSeleccionados, setPaisesSeleccionados] = useState([]);
  useEffect(() => {
    const seleccionDefaultAux = ListaPaises.filter((pais) => {
      const paisFind = seleccionDefault.find(
        (country) => pais.siglas == country.siglas
      );
      if (paisFind) {
        return { ...pais };
      }
    });
    const seleccionParsed = seleccionDefaultAux.map((pais) => {
      return {
        ...pais,
        label: pais.nombre,
        value: pais.siglas.toLowerCase(),
      };
    });
    setPaisesSeleccionados(seleccionParsed || []);
  }, [seleccionDefault]);

  const handleChange = (values) => {
    console.log(values);
    setPaisesSeleccionados(values || []);
    // Aquí puedes hacer lo que quieras con los países seleccionados
    // Por ejemplo, mandarlos a Firebase o a un formulario
    console.log("Seleccionaste:", values);
  };

  return (
    <div style={{ maxWidth: 400 }}>
      <Select
        options={opcionesPaises}
        isMulti // 👉 selección múltiple
        styles={customStyles} // 👉 estilos personalizados
        formatOptionLabel={formatOptionLabel} // 👉 banderas + texto
        placeholder="Escribe un país..."
        onChange={handleChange}
        value={paisesSeleccionados}
      />
    </div>
  );
}
