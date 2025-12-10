import { useEffect, useState } from "react";
import { Solicitudes } from "../pantallasMain/Solicitudes";
import { Proyectos } from "../pantallasMain/Proyectos";
import { Choferes } from "../pantallasMain/Choferes";
import { OpcionUnica } from "../../components/OpcionUnica";
import Pagos from "../pantallasMain/Pagos";

export default function Main({
  userMaster,
  dbTransferRequest,
  dbUsuarios,
  setOpcionUnicaSelect,
  setDBChoferes,
  dbChoferes,
  setDBTransferRequest,
  // Pagos
  congloPagosInternos,
  setCongloPagosInternos,
  congloPagosExtInd,
  setCongloPagosExtInd,
  congloPagosExtEmp,
  setCongloPagosExtEmp,
}) {
  const initialOpciones = [
    {
      nombre: "Solicitud",
      code: "pantallaReq",
      select: true,
    },
    {
      nombre: "Choferes",
      code: "pantallaChofer",
      select: false,
    },
    {
      nombre: "Proyectos",
      code: "pantallaProyecto",
      select: false,
    },
  ];

  const [arrayOpciones, setArrayOpciones] = useState([...initialOpciones]);

  useEffect(() => {
    if (userMaster) {
      const pantallas = [...initialOpciones];

      const pantallaPago = {
        nombre: "Pago",
        code: "pantallaPago",
        select: false,
      };

      if (userMaster.permisos.includes("readPayDriverTMS")) {
        pantallas.push(pantallaPago);
      }

      setArrayOpciones([...pantallas]);
    }
  }, [userMaster]);
  const [tablaActiva, setTablaActiva] = useState();
  useEffect(() => {
    const opcionSelect = arrayOpciones.find((opcion) => opcion.select);

    if (opcionSelect.code == "pantallaReq") {
      setTablaActiva(
        <Solicitudes
          userMaster={userMaster}
          dbTransferRequest={dbTransferRequest}
          dbUsuarios={dbUsuarios}
          setDBChoferes={setDBChoferes}
          dbChoferes={dbChoferes}
          setDBTransferRequest={setDBTransferRequest}
          // Pagos
          congloPagosInternos={congloPagosInternos}
          setCongloPagosInternos={setCongloPagosInternos}
          congloPagosExtInd={congloPagosExtInd}
          setCongloPagosExtInd={setCongloPagosExtInd}
          congloPagosExtEmp={congloPagosExtEmp}
          setCongloPagosExtEmp={setCongloPagosExtEmp}
        />
      );
    } else if (opcionSelect.code == "pantallaChofer") {
      setTablaActiva(
        <Choferes
          userMaster={userMaster}
          dbTransferRequest={dbTransferRequest}
          dbUsuarios={dbUsuarios}
          dbChoferes={dbChoferes}
          setDBChoferes={setDBChoferes}
        />
      );
    } else if (opcionSelect.code == "pantallaProyecto") {
      setTablaActiva(<Proyectos />);
    } else if (opcionSelect.code == "pantallaPago") {
      setTablaActiva(<Pagos userMaster={userMaster} />);
    } else {
      setTablaActiva();
    }
  }, [userMaster, dbTransferRequest, dbUsuarios, arrayOpciones]);

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
        name="pantallas"
        arrayOpciones={arrayOpciones}
        handleOpciones={handleOpciones}
      />
    );
  }, [arrayOpciones]);

  return <>{tablaActiva}</>;
}
