import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { fetchGetDocs } from "../../../libs/useDocByCondition";
import { ControlesTablas } from "../../components/ControlesTabla";

export default function Equipos({ equiposDB, setEquiposDB }) {
  // ***************** LLAMADA A LA BASE DE DATOS ********************
  (async () => {
    const pruebaData = await fetchGetDocs("equipos", setEquiposDB);

    console.log(pruebaData);
  })();
  const [valoresParsed, setValoresParsed] = useState(false);

  useEffect(() => {
    console.log(equiposDB);
    const dataAux = equiposDB;
    console.log(dataAux);
    setValoresParsed(true);
  }, [equiposDB]);
  //
  // ***************** CONTROLES / FILTROS ********************
  const [controles, setControles] = useState({
    search: {
      nombre: "Buscar",
      name: "valueSearch",
      active: true,
    },
    menuDesplegable: [
      {
        nombre: "Status",
        name: "valueStatus",
        active: true,

        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: true,
          },
          {
            opcion: "off",
            descripcion: "OFF",
            select: false,
          },
          {
            opcion: "operativo",
            descripcion: "Operativo",
            select: false,
          },
        ],
      },
      {
        nombre: "Sucursal",
        active: true,
        disabled: false,
        name: "valueSucursal",
        opciones: [
          {
            opcion: "todos",
            descripcion: "Todos",
            select: false,
          },
          {
            opcion: "principal",
            descripcion: "Principal",
            select: true,
          },
          {
            opcion: "pantoja",
            descripcion: "Pantoja",
            select: false,
          },
          {
            opcion: "santiago",
            descripcion: "Santiago",
            select: false,
          },
        ],
      },
    ],
  });
  return (
    valoresParsed && (
      <Container>
        <ContainerControles>
          <ControlesTablas titulo={"Lista de equipos:"} controles={controles} />
          <CajaTabla>
            <Tabla>
              <thead>
                <Filas className={"cabeza"}>
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>ID*</CeldaHead>
                  <CeldaHead>Descripcion</CeldaHead>
                  <CeldaHead>Localidad</CeldaHead>
                  <CeldaHead>Status</CeldaHead>
                  <CeldaHead>Ultimo MP</CeldaHead>
                  <CeldaHead>Proximo MP</CeldaHead>
                  <CeldaHead>Gastado 12 meses</CeldaHead>
                </Filas>
              </thead>
              <tbody>
                {equiposDB.map((equi, index) => {
                  return (
                    <Filas
                      className={`body
                    ${index % 2 ? "impar" : ""}
                    `}
                      key={index}
                    >
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody>
                        <Enlaces
                          to={
                            "/mantenimiento/maestros/equipos/" + equi.numeroDoc
                          }
                        >
                          {equi.numeroDoc}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody>{equi.descripcion}</CeldasBody>
                      <CeldasBody>{equi.localidad}</CeldasBody>
                      <CeldasBody>
                        {equi.estadoDoc == 0
                          ? "Operativo ✅"
                          : equi.estadoDoc == 1
                            ? "OFF ❌"
                            : ""}
                      </CeldasBody>
                      <CeldasBody>{equi.ultMantPrevent}</CeldasBody>
                      <CeldasBody>{equi.ultMantCorrect}</CeldasBody>
                      <CeldasBody>{equi.tagGastado}</CeldasBody>
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTabla>
        </ContainerControles>
      </Container>
    )
  );
}
const Container = styled.div``;
const ContainerControles = styled.div`
  margin-bottom: 5px;
`;

const CajaTabla = styled(CajaTablaGroup)``;

const Tabla = styled(TablaGroup)``;

const Filas = styled(FilasGroup)``;

const CeldaHead = styled(CeldaHeadGroup)``;
const CeldasBody = styled(CeldasBodyGroup)``;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
