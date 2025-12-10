import { useEffect, useState } from "react";
import styled from "styled-components";
import { OpcionUnica } from "../../components/OpcionUnica";
import AddReq from "../pantallasAdd/AddReq";
import AddProy from "../pantallasAdd/AddProy";
import AddChofer from "../pantallasAdd/AddChofer";
import { useAuth } from "../../context/AuthContext";
import AddPago from "../pantallasAdd/AddPago";

export default function Add({
  setOpcionUnicaSelect,
  userMaster,
  setDBChoferes,
  dbChoferes,
}) {
  // ************************ RECURSOS GENERALES ************************
  const { usuario } = useAuth();
  const initialOpciones = [
    {
      nombre: "Solicitud",
      code: "opcionReq",
      select: true,
    },
  ];
  const [arrayOpciones, setArrayOpciones] = useState([...initialOpciones]);
  useEffect(() => {
    if (userMaster) {
      const pantallas = [...initialOpciones];
      console.log(pantallas);
      const pantallasChoferes = {
        nombre: "Choferes",
        code: "opcionChofer",
        select: false,
      };
      const pantallaProyectos = {
        nombre: "Proyecto",
        code: "opcionProyecto",
        select: false,
      };
      const pantallaPago = {
        nombre: "Pago",
        code: "pago",
        select: false,
      };

      if (userMaster.permisos.includes("createDriverTMS")) {
        pantallas.push(pantallasChoferes);
      }
      if (userMaster.permisos.includes("createProyectTMS")) {
        pantallas.push(pantallaProyectos);
      }
      if (userMaster.permisos.includes("accessAddPagosTMS")) {
        pantallas.push(pantallaPago);
      }

      console.log(pantallas);
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
    if (codeScreenSelect == "opcionReq") {
      setTablaActiva(<AddReq userMaster={userMaster} />);
    } else if (codeScreenSelect == "opcionChofer") {
      setTablaActiva(
        <AddChofer
          userMaster={userMaster}
          setDBChoferes={setDBChoferes}
          dbChoferes={dbChoferes}
        />
      );
    } else if (codeScreenSelect == "opcionProyecto") {
      setTablaActiva(<AddProy userMaster={userMaster} />);
    } else if (codeScreenSelect == "pago") {
      setTablaActiva(<AddPago userMaster={userMaster} />);
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
  /* padding: 0 15px; */
  width: 100%;
  /* border: 1px solid red; */
`;
