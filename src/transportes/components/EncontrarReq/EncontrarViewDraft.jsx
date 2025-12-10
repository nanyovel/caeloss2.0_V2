import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme } from "../../../config/theme";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { collection, getDocs, query, where } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";

export default function EncontrarViewDraft() {
  const [dbDraftReq, setDBDraftReq] = useState([]);
  useEffect(() => {
    let q = query(
      collection(db, "transferRequest"),
      where("estadoDoc", "==", -1)
    );
    (async () => {
      try {
        const consultaDB = await getDocs(q);

        const coleccion = consultaDB.docs.map((doc) => ({
          ...doc.data(),
          id: doc.id,
        }));
        setDBDraftReq(coleccion);
      } catch (error) {
        console.log(error);
      }
    })();
  }, []);
  return (
    <Container>
      <Titulo>Lista de solicitudes en borrador</Titulo>
      <CajaTabla>
        <Tabla>
          <thead>
            <Fila className="caebza">
              <CeldaCabeza>N°</CeldaCabeza>
              <CeldaCabeza>Numero</CeldaCabeza>
              <CeldaCabeza className="cliente">Cliente</CeldaCabeza>
              <CeldaCabeza>Destino</CeldaCabeza>
              <CeldaCabeza>Fecha</CeldaCabeza>
              <CeldaCabeza>Solicitante</CeldaCabeza>
            </Fila>
          </thead>
          <tbody>
            {dbDraftReq.map((req, index) => {
              return (
                <Fila
                  key={index}
                  className={`body
                ${index % 2 ? "impar" : "par"}
                `}
                >
                  <CeldaCuerpo>{index + 1}</CeldaCuerpo>
                  <CeldaCuerpo>
                    <Enlace
                      to={"/transportes/maestros/solicitudes/" + req.numeroDoc}
                      target="_blank"
                    >
                      {req.numeroDoc}
                    </Enlace>
                  </CeldaCuerpo>
                  <CeldaCuerpo
                    title={req.datosReq.socioNegocio}
                    className="cliente"
                  >
                    {req.datosReq.socioNegocio}
                  </CeldaCuerpo>
                  <CeldaCuerpo
                    className="destino"
                    title={
                      req.datosFlete.modalidad[0].select
                        ? req.datosFlete.provinciaSeleccionada?.label +
                          " - " +
                          req.datosFlete.provinciaSeleccionada
                            ?.municipioSeleccionado.label
                        : req.datosFlete.distancia
                    }
                  >
                    {req.datosFlete.modalidad[0].select
                      ? req.datosFlete.provinciaSeleccionada?.label +
                        " - " +
                        req.datosFlete.provinciaSeleccionada
                          ?.municipioSeleccionado.label
                      : req.datosFlete.distancia}
                  </CeldaCuerpo>
                  <CeldaCuerpo className="noWrap">
                    {req.fechaReq.slice(0, 10)}
                  </CeldaCuerpo>
                  <CeldaCuerpo className="noWrap">
                    <Enlace
                      target="_blank"
                      to={"/perfiles/" + req.datosSolicitante.userName}
                    >
                      {req.datosSolicitante.userName}
                    </Enlace>
                  </CeldaCuerpo>
                </Fila>
              );
            })}
          </tbody>
        </Tabla>
      </CajaTabla>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px 4px;
`;
const Titulo = styled.h2`
  color: white;
  text-decoration: underline;
  font-size: 1.2rem;
  font-weight: 400;
`;
const CajaTabla = styled(CajaTablaGroup)``;
const Tabla = styled(TablaGroup)``;
const Fila = styled(FilasGroup)``;
const CeldaCabeza = styled(CeldaHeadGroup)`
  &.cliente {
    min-width: 150px;
    background-color: red;
  }
`;
const CeldaCuerpo = styled(CeldasBodyGroup)`
  text-overflow: ellipsis;
  white-space: nowrap; /* Evita que el texto haga salto de línea */
  &.cliente {
    max-width: 100px; /* Ajusta el ancho según necesites */
    overflow: hidden; /* Oculta el texto que se desborda */
    text-overflow: ellipsis; /* Agrega los puntos suspensivos (...) */
  }
  &.destino {
    max-width: 150px; /* Ajusta el ancho según necesites */
    overflow: hidden; /* Oculta el texto que se desborda */
    text-overflow: ellipsis; /* Agrega los puntos suspensivos (...) */
  }
  &.noWrap {
    min-width: 120px;
    white-space: nowrap;
  }
`;
