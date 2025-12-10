import React, { useState } from "react";
import styled from "styled-components";
import { ClearTheme } from "../../config/theme";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { BotonQuery } from "../../components/BotonQuery";

export const TablaArticulosRep = () => {
  const [materialesOrden, setMaterialesOrden] = useState([]);
  const [materialesFurgon, setMaterialesFurgon] = useState([]);
  const traerDatos = async () => {
    const ordenesCompraOpen = await fetchDocsByConditionGetDocs(
      "ordenesCompra2",
      undefined,
      "estadoDoc",
      "==",
      0
    );

    const furgonesOpen = await fetchDocsByConditionGetDocs(
      "furgones",
      undefined,
      "status",
      "<",
      5
    );
    console.log(ordenesCompraOpen);
    console.log(furgonesOpen);
    const materialesOrdenAux = ordenesCompraOpen.flatMap((orden) => {
      return orden.materiales.map((material) => ({
        ...material,
        ordenCompraId: orden.id,
        numeroOrden: orden.numeroDoc,
      }));
    });
    const materialesFurgonAux = furgonesOpen.flatMap((furgon) => {
      return furgon.materiales.map((material) => ({
        ...material,
        furgonId: furgon.id,
        numeroFurgon: furgon.numeroDoc,
      }));
    });
    setMaterialesOrden(materialesOrdenAux);
    setMaterialesFurgon(materialesFurgonAux);
  };
  return (
    <Contenedor>
      <BotonQuery
        materialesOrden={materialesOrden}
        materialesFurgon={materialesFurgon}
        df
      />
      {/* <BtnSimple onClick={() => traerDatos()}>Down Data</BtnSimple> */}
      <CajaDatos>
        <Parrafo>{JSON.stringify(materialesOrden[0], null, 2)}</Parrafo>
      </CajaDatos>
      <br />
      <CajaDatos>
        <Parrafo>{JSON.stringify(materialesFurgon[0], null, 2)}</Parrafo>
      </CajaDatos>
    </Contenedor>
  );
};
const Contenedor = styled.div`
  width: 100%;
  min-height: 300px;
  margin-bottom: 100px;
`;
const BtnSimple = styled(BtnGeneralButton)``;
const CajaDatos = styled.div`
  overflow-y: scroll;
`;
const Parrafo = styled.pre`
  background: #ffffff;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
  white-space: pre-wrap;
`;
