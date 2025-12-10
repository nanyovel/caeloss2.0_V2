import { useState } from "react";
import styled from "styled-components";

import { collection, query, where, getDocs } from "firebase/firestore";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import ExportarExcel from "../../libs/ExportExcel";
import db from "../../firebase/firebaseConfig";
import { useAuth } from "../../context/AuthContext";
import { Tema, Theme } from "../../config/theme";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { Alerta } from "../../components/Alerta";

export default function ReportReq({ userMaster, columnas, fetchGetDocs }) {
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);

  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // ****************** DOCUMENTOS SIN ESCUCHADOR **********************
  const [valueInput, setValueInput] = useState("");

  const [fechaDesdeInput, setFechaDesdeInput] = useState("");
  const [fechaHastaInput, setFechaHastaInput] = useState("");

  const [fechaInicialES6, setFechaInicialES6] = useState("");
  const [fechaFinalES6, setFechaFinalES6] = useState("");

  const handleFechas = (e) => {
    const { name, value } = e.target;
    const annio = value.slice(0, 4);
    const mes = value.slice(5, 7);
    const dia = value.slice(8, 10);

    if (name == "desde") {
      const fechaParsedES6 = new Date(
        Number(annio),
        Number(mes) - 1,
        Number(dia)
      );
      setFechaDesdeInput(value);
      setFechaInicialES6(fechaParsedES6);
    } else if (name == "hasta") {
      const fechaParsedES6 = new Date(
        Number(annio),
        Number(mes) - 1,
        Number(dia),
        23,
        59,
        59,
        999
      );

      setFechaHastaInput(value);
      setFechaFinalES6(fechaParsedES6);
    }
  };

  const [listaExportar, setListaExportar] = useState([]);
  // const fetchGetDocs = async (collectionName) => {
  //   if (!usuario) return [];

  //   try {
  //     let q;
  //     if (query) {
  //       if (!valueInput) {
  //         q = query(
  //           collection(db, collectionName),
  //           where("fechaStamp", ">=", fechaInicialES6),
  //           where("fechaStamp", "<=", fechaFinalES6)
  //         );
  //       } else {
  //         console.log(valueInput);
  //         q = query(
  //           collection(db, collectionName),
  //           where("datosReq.numeroProyecto", "==", valueInput),
  //           where("fechaStamp", ">=", fechaInicialES6),
  //           where("fechaStamp", "<=", fechaFinalES6)
  //         );
  //       }
  //     }

  //     const consultaDB = await getDocs(q);

  //     const coleccion = consultaDB.docs.map((doc) => ({
  //       ...doc.data(),
  //       id: doc.id,
  //     }));
  //     console.log(coleccion);
  //     return coleccion;
  //   } catch (error) {
  //     console.error("Error con la base de datos:", error);
  //     setMensajeAlerta("Error con la base de datos");
  //     setTipoAlerta("error");
  //     setDispatchAlerta(true);
  //     setTimeout(() => setDispatchAlerta(false), 3000);
  //     return [];
  //   }
  // };

  const generalReporte = async () => {
    const hasPermiso = userMaster.permisos.includes("generalReportsTMS");
    if (!hasPermiso) {
      console.log("salir");
      return;
    }
    if (fechaInicialES6 == "" || fechaFinalES6 == "") {
      setMensajeAlerta("Colocar el rango de fecha correctamente.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    fetchGetDocs("transferRequest", true, fechaInicialES6, fechaFinalES6);
    // try {
    //   const listaBuscada = await fetchGetDocs(
    //     "transferRequest",
    //     setListaExportar
    //   );
    //   console.log(listaBuscada);

    //   ExportarExcel(listaBuscada, columnas);
    // } catch (error) {
    //   console.log(error);
    // }
  };

  return (
    <>
      <ContainerMain>
        {/* <ContenedorMasParametros>
          <CajaParametros>
            <TextoInput>N° de proyecto</TextoInput>
            <InputSencillo
              placeholder="N° de proyecto"
              autoComplete="off"
              value={valueInput}
              onChange={(e) => setValueInput(e.target.value.toUpperCase())}
            />
          </CajaParametros>
        </ContenedorMasParametros> */}
        <TextoH3>Coloque rango de fecha</TextoH3>
        <CajaDatePicker>
          <CajitaDate>
            <DatePicker
              type="date"
              name="desde"
              value={fechaDesdeInput}
              onChange={(e) => handleFechas(e)}
              className={Theme.config.modoClear ? "clearModern" : ""}
            />
            <Guion>Desde</Guion>
          </CajitaDate>
          <Guion>-</Guion>
          <CajitaDate>
            <DatePicker
              type="date"
              name="hasta"
              value={fechaHastaInput}
              onChange={(e) => handleFechas(e)}
              className={Theme.config.modoClear ? "clearModern" : ""}
            />
            <Guion>Hasta</Guion>
          </CajitaDate>
        </CajaDatePicker>
        <BtnSimple onClick={() => generalReporte()}>Exportar</BtnSimple>
      </ContainerMain>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const BtnSimple = styled(BtnGeneralButton)``;
const ContainerMain = styled.div`
  width: 100%;
  /* border: 1px solid red */
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const TextoH3 = styled.h3`
  color: ${Tema.primary.azulBrillante};
  text-decoration: underline;
  font-weight: lighter;
  margin-bottom: 15px;
  color: white;
`;
const CajaDatePicker = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Guion = styled.h3`
  color: ${Tema.primary.azulBrillante};
  font-weight: 1rem;
  font-weight: lighter;
  color: white;
`;

const CajitaDate = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;
const DatePicker = styled(InputSimpleEditable)`
  margin: 0 15px;
  font-size: 1rem;
  height: 30px;
  outline: none;
  padding: 10px;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &:hover {
    cursor: pointer;
  }
`;
