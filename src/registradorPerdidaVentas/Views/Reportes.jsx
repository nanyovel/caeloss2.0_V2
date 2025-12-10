import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { useAuth } from "../../context/AuthContext";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
  getDoc,
  doc,
} from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import ExportarExcel from "../../libs/ExportExcel";
import { OpcionUnica } from "../../components/OpcionUnica";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { BotonQuery } from "../../components/BotonQuery";
import { Alerta } from "../../components/Alerta";
import { Tema } from "../../config/theme";
import { InputSimpleEditable } from "../../components/InputGeneral";

export default function Reportes({ userMaster }) {
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  // ****************** DOCUMENTOS SIN ESCUCHADOR **********************

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
  const fetchGetDocs = async (collectionName) => {
    if (!usuario) {
      console.log(usuario);
      return [];
    }

    try {
      let q;
      if (query) {
        q = query(
          collection(db, collectionName),
          where("fechaStamp", ">=", fechaInicialES6),
          where("fechaStamp", "<=", fechaFinalES6)
        );
      }

      const consultaDB = await getDocs(q);

      const coleccion = consultaDB.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      console.log(coleccion);
      return coleccion;
    } catch (error) {
      console.error("Error con la base de datos:", error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return [];
    }
  };

  const generalReporte = async () => {
    if (fechaInicialES6 == "" || fechaFinalES6 == "") {
      setMensajeAlerta("Indicar rango de fecha");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    try {
      const listaBuscada = await fetchGetDocs(
        "ventasPerdidas",
        setListaExportar
      );
      const columnas = [
        {
          header: "N° registro",
          key: "numeroDoc",
          width: 10,
          ruta: "numeroDoc",
        },
        { header: "Codigo", key: "codigo", width: 10, ruta: "codigo" },
        {
          header: "Descripcion",
          key: "descripcion",
          width: 30,
          ruta: "descripcion",
        },
        { header: "Cantidad", key: "cantidad", width: 10, ruta: "cantidad" },
        { header: "Dpto", key: "dpto", width: 10, ruta: "dpto" },
        { header: "Fecha", key: "fecha", width: 20, ruta: "fecha" },
        { header: "Usuario", key: "userName", width: 10, ruta: "userName" },
        { header: "Modalidad", key: "modalidad", width: 10, ruta: "modalidad" },
        { header: "Cliente", key: "cliente", width: 10, ruta: "cliente" },
        // {
        //   header: "Monto",
        //   key: "montoPerdido",
        //   width: 10,
        //   ruta: "montoPerdido",
        // },

        { header: "Sucursal", key: "sucursal", width: 10, ruta: "sucursal" },
        { header: "Motivo", key: "motivo", width: 10, ruta: "motivo" },
        // {
        //   header: "OtroMOvito",
        //   key: "otroMotivo",
        //   width: 10,
        //   ruta: "otroMotivo",
        // },
        {
          header: "Obs",
          key: "observaciones",
          width: 20,
          ruta: "observaciones",
        },

        // {
        //   header: "Id",
        //   key: "id",
        //   width: 10,
        //   ruta: "id",
        // },
      ];

      const columnaPriv = [
        ...columnas,
        {
          header: "Costo",
          key: "costo",
          width: 10,
          ruta: "costo",
        },
        {
          header: "Precio",
          key: "precio",
          width: 10,
          ruta: "precio",
        },
      ];
      console.log(columnaPriv);

      const listaParsed = listaBuscada.map((item) => {
        return {
          ...item,
          fecha: item.fecha.slice(0, 16) + item.fecha.slice(-2),
        };
      });

      const listaAplanada = [];
      listaParsed.forEach((item) => {
        if (
          item.listaMateriales.length > 0 &&
          Array.isArray(item.listaMateriales)
        ) {
          const itemsParsed = item.listaMateriales.map((articulo) => {
            return {
              ...item,
              ...articulo,
            };
          });
          listaAplanada.push(...itemsParsed);
        } else {
          listaAplanada.push(item);
        }
      });

      const hasPermiso = userMaster.permisos.includes(
        "accessCostoPerdidaVenta"
      );
      if (!hasPermiso) {
        ExportarExcel(listaAplanada, columnas, "Ventas Perdidas");
      } else {
        ExportarExcel(listaAplanada, columnaPriv, "Ventas Perdidas");
      }
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <>
      <BotonQuery
        fechaFinalES6={fechaFinalES6}
        fechaInicialES6={fechaInicialES6}
        listaExportar={listaExportar}
      />
      <ContainerMain>
        <CajaTipo>
          <Titulo>Reporte de ventas perdidas</Titulo>
        </CajaTipo>
        <ContainerMain>
          <TextoH3>Indique el rango de fecha</TextoH3>
          <CajaDatePicker>
            <CajitaDate>
              <DatePicker
                type="date"
                className="clearModern"
                name="desde"
                value={fechaDesdeInput}
                onChange={(e) => handleFechas(e)}
              />
              <Guion>Desde</Guion>
            </CajitaDate>
            <Guion>-</Guion>
            <CajitaDate>
              <DatePicker
                type="date"
                className="clearModern"
                name="hasta"
                value={fechaHastaInput}
                onChange={(e) => handleFechas(e)}
              />
              <Guion>Hasta</Guion>
            </CajitaDate>
          </CajaDatePicker>
          <BtnSimple onClick={() => generalReporte()}>Generar</BtnSimple>
        </ContainerMain>
      </ContainerMain>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const ContainerMain = styled.div`
  width: 100%;
  /* border: 1px solid red */
  border-bottom: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: white;
`;
const CajaTipo = styled.div`
  width: 100%;
`;
const Titulo = styled.h2`
  text-decoration: underline;
  margin-left: 20px;
`;

const BtnSimple = styled(BtnGeneralButton)``;

const TextoH3 = styled.h3`
  text-decoration: underline;
  font-weight: lighter;
  margin-bottom: 15px;
`;
const CajaDatePicker = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Guion = styled.h3`
  font-weight: 1rem;
  font-weight: lighter;
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
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
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
