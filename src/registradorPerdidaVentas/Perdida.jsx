import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Header } from "../components/Header";

import { OpcionUnica } from "../components/OpcionUnica";
import { ModalLoading } from "../components/ModalLoading";
import { Alerta } from "../components/Alerta";
import { formatoDOP } from "../libs/StringParsed";
import {
  addDoc,
  collection,
  doc,
  Timestamp,
  writeBatch,
} from "firebase/firestore";
import db from "../firebase/firebaseConfig";
import { ES6AFormat } from "../libs/FechaFormat";

import { fetchGetDocs, useDocById } from "../libs/useDocByCondition";
import Footer from "../components/Footer";
import { ArticulosDB } from "./components/ArticulosDB";
import Reportes from "./Views/Reportes";
import ListaExcel from "./Views/ListaExcel";
import UnItem from "./Views/UnItem";

export default function Perdida({ userMaster }) {
  // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const ListaArticulos = ArticulosDB.map((item) => {
    return { ...item };
  });
  console.log(ArticulosDB);
  const MotivoPerdida = [
    "Producto no de inventario",
    "Sin stock",
    "Por precios",
    "Otros",
  ];

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Articulo",
      code: "articulo",
      select: true,
    },
    {
      nombre: "Lista",
      code: "lista",
      select: false,
    },
    {
      nombre: "Reportes",
      code: "reportes",
      select: false,
    },
  ]);
  const handleOpciones = (e) => {
    setVentaPerdida({ ...initialVentaPerdida });
    const code = e.target.dataset.code;
    setArrayOpciones(
      arrayOpciones.map((opcion) => {
        return {
          ...opcion,
          select: opcion.code == code,
        };
      })
    );
  };

  const initialVentaPerdida = {
    codigo: "",
    descripcion: "",
    cantidad: "",
    cliente: "",
    motivo: "",
    observaciones: "",
    modalidad: "",
    costo: "",
    precio: "",
  };
  const [ventaPerdida, setVentaPerdida] = useState({ ...initialVentaPerdida });
  const [valueTabla, setValueTabla] = useState([]);

  const [isLoading, setIsLoading] = useState(false);
  const [contadorNumeroDoc, setContadorNumeroDoc] = useState({});
  useDocById("counters", setContadorNumeroDoc, "numberVentasPerdidas");
  const enviarObjeto = async (e) => {
    const name = e.target.name;
    if (name == "unItem") {
      if (ventaPerdida.motivo !== "Producto no de inventario") {
        if (
          ventaPerdida.codigo == "" ||
          ventaPerdida.cantidad == "" ||
          ventaPerdida.motivo == ""
        ) {
          setMensajeAlerta(
            "Los99 campos obligatorios estan marcados con un asterisco."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        }
        const itemFind = ListaArticulos.find((item, index) => {
          if (item.codigo == ventaPerdida.codigo) {
            return item;
          }
        });

        // me quede aqui
        // me quede aqui
        // me quede aqui
        // me quede aqui
        if (!itemFind) {
          setMensajeAlerta("El codigo de producto no existe.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        }

        if (ventaPerdida.precio == 0) {
          setMensajeAlerta("El campo precio no debe ser 0.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        }
      } else if (ventaPerdida.motivo == "Producto no de inventario") {
        if (
          ventaPerdida.descripcion == "" ||
          ventaPerdida.cantidad == "" ||
          ventaPerdida.motivo == ""
        ) {
          setMensajeAlerta(
            "Los campos obligatorios están marcados con un asterisco."
          );
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        }
      }
    }
    let tablaParsed = [];
    if (name == "listaArticulos") {
      tablaParsed = valueTabla.filter((item) => {
        if (item.codigo || item.descripcion) {
          return {
            codigo: item.codigo,
            descripcion: item.descripcion,
            costo:
              ventaPerdida.motivo == "Producto no de inventario"
                ? 0
                : item.costo,
            precio: Number(item.precio),
            cantidad: Number(item.cantidad),
          };
        }
      });
      console.log(tablaParsed);
      console.log(valueTabla);
      if (tablaParsed.length == 0) {
        setMensajeAlerta("Coloque los materiales a registrar.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    }

    if (ventaPerdida.motivo == "Otros" && ventaPerdida.observaciones == "") {
      setMensajeAlerta(
        `Si el motivo es "Otros", entonces debe detallar en la caja de observaciones.`
      );
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 5000);
      return;
    }
    console.log(ventaPerdida);
    // return;
    try {
      setIsLoading(true);
      // Agregar la operación de actualización del contador
      const contadorNumeroDocId = "numberVentasPerdidas";
      const contadorUpdate = doc(db, "counters", contadorNumeroDocId);
      const nuevoNumero = contadorNumeroDoc.lastNumberReq + 1;

      const batch = writeBatch(db);
      batch.update(contadorUpdate, {
        lastNumberReq: nuevoNumero,
      });
      // Agregar nuevo documento a transferRequest en el mismo lote
      const collectionVentasPerdidas = collection(db, "ventasPerdidas");
      const nuevoDocumentoRef = doc(collectionVentasPerdidas);
      const docEnviar = {
        ...ventaPerdida,
        numeroDoc: nuevoNumero,
        fecha: ES6AFormat(new Date()),
        idUsuario: userMaster.id,
        userName: userMaster.userName,
        dpto: userMaster.dpto,
        modalidad: name,
        listaMateriales: name == "listaArticulos" ? tablaParsed : [],
        fechaStamp: Timestamp.fromDate(new Date()),
        sucursal: userMaster.localidad.nombreSucursal,
        precio: Number(ventaPerdida.precio),
      };
      console.log(docEnviar);
      batch.set(nuevoDocumentoRef, docEnviar);

      if (nuevoNumero > 100000) {
        // await batch.commit();

        setVentaPerdida(initialVentaPerdida);
        setValueTabla([]);
        setMensajeAlerta("Registrado con exito.");
        setTipoAlerta("success");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
      }
      setIsLoading(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      setIsLoading(false);
      return;
    }
  };
  const [listadoDBFull, setListadoDBFull] = useState([]);
  fetchGetDocs("ventasPerdidas", setListadoDBFull);

  return (
    <>
      <Header titulo="Ventas perdidas" />
      <Container>
        <ContainerMaster>
          <ContainerSecciones className="contenido">
            <CajaBtnHead>
              <OpcionUnica
                titulo={"Modalidad"}
                name={"modalidad"}
                arrayOpciones={arrayOpciones}
                handleOpciones={handleOpciones}
              />
            </CajaBtnHead>

            {arrayOpciones.find((opcion) => opcion.select).code ==
              "articulo" && (
              <UnItem
                ventaPerdida={ventaPerdida}
                MotivoPerdida={MotivoPerdida}
                ListaArticulos={ListaArticulos}
                setVentaPerdida={setVentaPerdida}
                initialVentaPerdida={initialVentaPerdida}
                enviarObjeto={enviarObjeto}
                formatoDOP={formatoDOP}
              />
            )}
            {arrayOpciones.find((opcion) => opcion.select).code == "lista" && (
              <ListaExcel
                ventaPerdida={ventaPerdida}
                initialVentaPerdida={initialVentaPerdida}
                setVentaPerdida={setVentaPerdida}
                MotivoPerdida={MotivoPerdida}
                formatoDOP={formatoDOP}
                ListaArticulos={ListaArticulos}
                enviarObjeto={enviarObjeto}
                setValueTabla={setValueTabla}
              />
            )}
            {arrayOpciones.find((opcion) => opcion.select).code ==
              "reportes" && <Reportes userMaster={userMaster} />}
            {isLoading ? <ModalLoading completa={true} /> : ""}
          </ContainerSecciones>

          <ContainerSecciones className="footer">
            <Footer />
          </ContainerSecciones>
        </ContainerMaster>
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </Container>
    </>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;
const CajaBtnHead = styled.div`
  width: 100%;
  margin-bottom: 15px;
  padding-left: 30px;
  padding-top: 15px;
`;
const ContainerMaster = styled.div`
  position: relative;
  min-height: 100dvh;
  display: flex;
  flex-direction: column;
`;

const ContainerSecciones = styled.div`
  &.contenido {
    width: 100%;
    margin-bottom: 100px;
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  &.footer {
    position: absolute;
    bottom: 0;
    width: 100%;
    height: 40px;
  }
`;
