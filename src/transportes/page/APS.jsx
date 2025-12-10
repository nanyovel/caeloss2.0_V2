import { useEffect, useState } from "react";
import { OpcionUnica } from "../../components/OpcionUnica";

import TablaCicloPadre from "../pantallasAPS/TablaCicloPadre";
import ColumnasReqExcel from "../libs/ColumnasReqExcel";

export default function APS({ setOpcionUnicaSelect, userMaster }) {
  const columnasExcel = [
    { header: "Numero", key: "numeroDoc", width: 10, ruta: "numeroDoc" },
    {
      header: "Cliente",
      key: "cliente",
      width: 20,
      ruta: "datosReq.socioNegocio",
    },
    { header: "Fecha", key: "fechaReq", width: 20, ruta: "fechaReq" },
    {
      header: "Dpto.",
      key: "dpto",
      width: 20,
      ruta: "datosSolicitante.dpto",
    },
    {
      header: "Chofer",
      key: "chofer",
      width: 15,
      ruta: "datosEntrega.chofer.nombre",
    },
    {
      header: "Monto chofer",
      key: "montoChofer",
      width: 10,
      ruta: "contabilidad.montoPagarChofer",
    },
    {
      header: "Ayudante",
      key: "ayudante",
      width: 10,
      ruta: "datosEntrega.ayudante.nombre",
    },
    {
      header: "Monto ayudante",
      key: "montoAyudante",
      width: 10,
      ruta: "contabilidad.montoPagarAyudante",
    },
    {
      header: "Status",
      key: "status",
      width: 10,
      ruta: "status",
    },
  ];
  // ************** MENU PANTALLAS de tablas**************
  const [arrayPantallas, setArrayPantallas] = useState([
    {
      nombre: "Internos",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Externo ind.",
      opcion: 1,
      select: false,
    },
    {
      nombre: "Externo Emp.",
      opcion: 2,
      select: false,
    },
    {
      nombre: "Mixtos",
      opcion: 3,
      select: false,
    },
  ]);
  const handleOpciones = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === 0,
      }))
    );
    setArrayPantallas((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  // ************** MENU PESTAÑAS de tablas**************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Sin procesar",
      code: "sinProcesar",
      select: true,
    },
    {
      nombre: "✅Logistica",
      select: false,
      code: "aprobadoPorLogistica",
    },
    {
      nombre: "✅Solicitante",
      select: false,
      code: "aprovadoPorSolicitante",
    },

    {
      nombre: "✅ Finanzas",
      select: false,
      code: "aprovadorPorFinanzas",
    },
    {
      nombre: "❌ Rechazados",
      select: false,
      code: "rechazado",
    },
  ]);
  const handlePestannias = (e) => {
    let index = Number(e.target.dataset.id);
    console.log(index);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  // Las alerta de cada tabla de pagos aparece por una de las siguientes razones:
  // - La solicitud tiene mas de un monto, es decir tiene montos ademas del default que general la calculadora de flete
  // - La solicitud tiene vehiculos adicionales
  // - La solicitud tiene ayudantes adicionales
  // -

  // Existen 3 tipos de pagos:
  // - Pagos internos:automaticamente al finalizar una solicitud
  // - Pagos externos individuales
  // - Pagos externos empresa
  //

  const quitarPagosVehAddSinConcluir = (coleccion) => {
    return coleccion.filter((req) => {
      const vehiculosAdd = req.datosFlete?.vehiculosAdicionales || [];
      const allApproved = vehiculosAdd.every(
        (vehAdd) => vehAdd.datosEntrega.status == 3
      );

      if (allApproved) {
        return req;
      }
    });
  };

  const moldeLLamada = [
    { isLLamada: false, paso: "db0SinProcesar" },
    { isLLamada: false, paso: "db1SiLogistica" },
    { isLLamada: false, paso: "db2SiSolicitante" },
    { isLLamada: false, paso: "db3SiFinanzas" },
    { isLLamada: false, paso: "db4Rechazado" },
  ];
  const initialMoldeLLamada = [
    [...moldeLLamada],
    [...moldeLLamada],
    [...moldeLLamada],
    [...moldeLLamada],
  ];
  const [dbLlamadas, setDBLLamadas] = useState([...initialMoldeLLamada]);
  //

  //
  //
  const valoresMoldePadreDefault = {
    tipoChoferes: "choferes Interno",
    tipoChofer: 0, // 0-interno , 1-ext ind, 2-ext emp
    mixta: false,
  };
  const [valoresMoldePadre, setValoresMoldePadre] = useState(null);
  useEffect(() => {
    let valoresMoldePadreAux = {
      ...valoresMoldePadreDefault,
    };
    //
    if (arrayPantallas[0].select == true) {
      valoresMoldePadreAux = { ...valoresMoldePadreDefault };
    } else if (arrayPantallas[1].select == true) {
      valoresMoldePadreAux = {
        ...valoresMoldePadreAux,
        tipoChoferes: "choferes externos independientes.",
        tipoChofer: 1, // 0-interno , 1-ext ind, 2-ext emp,
        mixta: false,
      };
    } else if (arrayPantallas[2].select == true) {
      valoresMoldePadreAux = {
        ...valoresMoldePadreAux,
        tipoChoferes: "choferes externos empresa.",
        tipoChofer: 2, // 0-interno , 1-ext ind, 2-ext emp
        mixta: false,
      };
    } else if (arrayPantallas[3].select == true) {
      valoresMoldePadreAux = {
        ...valoresMoldePadreAux,
        tipoChoferes: "choferes mixtos.",
        tipoChofer: 3, // 3 no existe, en este caso representa mixto
        mixta: true,
      };
    }
    setValoresMoldePadre({ ...valoresMoldePadreAux });
  }, [arrayPantallas, arrayOpciones]);

  // QUE EN LA SECCION DE NAVEGACION APAREZCA LAS OPCIONES DE SELECION UNICA ESPECIFICAS
  useEffect(() => {
    setOpcionUnicaSelect(
      <OpcionUnica
        titulo="Pantallas"
        name="pantallas"
        arrayOpciones={arrayPantallas}
        handleOpciones={handleOpciones}
      />
    );
  }, [arrayPantallas]);
  return (
    <>
      {valoresMoldePadre && (
        <TablaCicloPadre
          userMaster={userMaster}
          arrayOpciones={arrayOpciones}
          handlePestannias={handlePestannias}
          quitarPagosVehAddSinConcluir={quitarPagosVehAddSinConcluir}
          columnasExcel={ColumnasReqExcel}
          valoresMoldePadre={valoresMoldePadre}
          dbLlamadas={dbLlamadas}
          setDBLLamadas={setDBLLamadas}
        />
      )}
    </>
  );
}
