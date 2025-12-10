import { useEffect, useState } from "react";
import styled from "styled-components";
import imgProveedor from "./../../importaciones/img/01-factory.png";
import imgTransito from "./../../importaciones/img/02-ship.png";
import imtPuerto from "./../../importaciones/img/03-PuertoEste.png";
import imgAlmacen from "./../../importaciones/img/warehouse.png";
import imgDptoImport from "./../../importaciones/img/05-import-department.png";
import imgSap from "./../../importaciones/img/check.png";
import { OpcionUnica } from "../../components/OpcionUnica";
// import { BotonQuery } from '../../components/BotonQuery';
import { TablaCiclo01Proveedor } from "../TablasCiclo/TablaCiclo01Proveedor";
import { TablaCiclo02TransitoMaritimo } from "../TablasCiclo/TablaCiclo02TransitoMaritimo";
import { TablaCiclo03EnPuerto } from "../TablasCiclo/TablaCiclo03EnPuerto";
import { TablaCiclo04EnAlmacen } from "../TablasCiclo/TablaCiclo04EnAlmacen";
import { TablaCiclo05EnDptoImport } from "../TablasCiclo/TablaCiclo05EnDptoImport";
import { TablaCiclo06ListoSAP } from "../TablasCiclo/TablaCiclo06ListoSAP";

export const Ciclo = ({
  dbOrdenes,
  dbBillOfLading,
  setDBOrdenes,
  setDBBillOfLading,
  userMaster,
  setOpcionUnicaSelect,
  //
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
  dbGlobalBL,
  setDBGlobalBL,
}) => {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [pantallaMostrar, setPantallaMostrar] = useState(2);

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      img: imgProveedor,
      title: "Mercancia en proveedor.",
      select: false,
      nombre: "Proveedor",
    },
    {
      img: imgTransito,
      title: "Mercancia en transito maritimo.",
      select: false,
      nombre: "Transito Maritimo",
    },
    {
      img: imtPuerto,
      title: "La mercancia se encuentra en puerto.",
      select: true,
      nombre: "Puerto",
    },
    {
      img: imgAlmacen,
      title: "Mercancia en proceso de recepcion de almacen.",
      select: false,
      nombre: "Almacen",
    },
    {
      img: imgDptoImport,
      title:
        "En departamento de compras e importaciones esta realizando los procesos necesarios para el ingreso a SAP.",
      select: false,
      nombre: "Dpto. Import.",
    },
    {
      img: imgSap,
      title: "La mercancia se encuentra disponible en SAP.",
      select: false,
      nombre: "SAP",
    },
  ]);

  const selectScreen = (event) => {
    let index = Number(event.target.dataset.id);
    // Obtener el elemento en el que se hizo clic
    const clickedElement = event.target;
    // Obtener el contenedor (div)
    const containerElement = event.currentTarget;
    // Verificar si el clic provino directamente de la imagen o de un elemento secundario
    if (containerElement.contains(clickedElement)) {
      setArrayOpciones((prevOpciones) =>
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }
    setPantallaMostrar(index);
  };

  useEffect(() => {
    if (arrayOpciones.length > 0) {
      setOpcionUnicaSelect(
        <OpcionUnica
          tipo="ciclo"
          titulo="Ciclo de vida"
          arrayOpciones={arrayOpciones}
          selectScreen={selectScreen}
        />
      );
    }
  }, [arrayOpciones]);

  return (
    <>
      {pantallaMostrar == 0 ? (
        <TablaCiclo01Proveedor
          dbOrdenes={dbOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBOrdenes={setDBOrdenes}
          //
          setDBGlobalOrdenes={setDBGlobalOrdenes}
          dbGlobalOrdenes={dbGlobalOrdenes}
        />
      ) : pantallaMostrar == 1 ? (
        <TablaCiclo02TransitoMaritimo
          dbOrdenes={dbOrdenes}
          setDBOrdenes={setDBOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBBillOfLading={setDBBillOfLading}
          userMaster={userMaster}
          //
          dbGlobalBL={dbGlobalBL}
          setDBGlobalBL={setDBGlobalBL}
        />
      ) : pantallaMostrar == 2 ? (
        <TablaCiclo03EnPuerto
          dbOrdenes={dbOrdenes}
          setDBOrdenes={setDBOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBBillOfLading={setDBBillOfLading}
          userMaster={userMaster}
        />
      ) : pantallaMostrar == 3 ? (
        <TablaCiclo04EnAlmacen
          dbOrdenes={dbOrdenes}
          setDBOrdenes={setDBOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBBillOfLading={setDBBillOfLading}
          userMaster={userMaster}
        />
      ) : pantallaMostrar == 4 ? (
        <TablaCiclo05EnDptoImport
          dbOrdenes={dbOrdenes}
          setDBOrdenes={setDBOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBBillOfLading={setDBBillOfLading}
          userMaster={userMaster}
        />
      ) : pantallaMostrar == 5 ? (
        <TablaCiclo06ListoSAP
          dbOrdenes={dbOrdenes}
          setDBOrdenes={setDBOrdenes}
          dbBillOfLading={dbBillOfLading}
          setDBBillOfLading={setDBBillOfLading}
          userMaster={userMaster}
        />
      ) : (
        ""
      )}
    </>
  );
};

const ContainerNav = styled.div`
  width: 95%;
  display: flex;
  margin: auto;
  margin-bottom: 30px;
  margin-top: 10px;
  gap: 15px;
  justify-content: start;
  @media screen and (max-width: 1000px) {
    padding: 5px;
    display: flex;
    flex-direction: column;
  }
  @media screen and (max-width: 410px) {
    width: 99%;
  }
`;
