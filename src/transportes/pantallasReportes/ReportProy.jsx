import React from "react";
import styled from "styled-components";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { Tema } from "../../config/theme";
import TextoEptyG from "../../components/TextoEptyG";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { InputSimpleEditable } from "../../components/InputGeneral";

export default function ReportProy({ datos }) {
  return (
    <>
      <CajaTabla>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Solicitud*</CeldaHead>
              <CeldaHead>Proyecto*</CeldaHead>
              <CeldaHead>Usuario*</CeldaHead>
              <CeldaHead>Cliente</CeldaHead>
              <CeldaHead>Fecha</CeldaHead>
              <CeldaHead>Costo</CeldaHead>
              <CeldaHead>Precio</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {datos.map((req, index) => {
              return (
                <Filas
                  className={`body
                    ${index % 2 == 0 ? "par" : "impar"}
                `}
                  key={index + req.numeroDoc}
                >
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody>
                    <Enlace
                      to={"/transportes/maestros/solicitudes/" + req.numeroDoc}
                      target="_blank"
                    >
                      {req.numeroDoc}
                    </Enlace>
                  </CeldasBody>
                  <CeldasBody>
                    <Enlace
                      to={"/transportes/maestros/proyectos/" + req.numeroDoc}
                      target="_blank"
                    >
                      {req.datosReq.numeroProyecto}
                    </Enlace>
                  </CeldasBody>
                  <CeldasBody>
                    <Enlace
                      to={"/perfiles/" + req.datosSolicitante.userName}
                      target="_blank"
                    >
                      {req.datosSolicitante.userName}
                    </Enlace>
                  </CeldasBody>
                  <CeldasBody>{req.datosReq.socioNegocio}</CeldasBody>
                  <CeldasBody>{req.fechaReq.slice(0, 10)}</CeldasBody>
                  <CeldasBody>{req.datosFlete.costo}</CeldasBody>
                  <CeldasBody>{req.datosFlete.precio}</CeldasBody>
                </Filas>
              );
            })}
          </tbody>
        </Tabla>

        {datos.length == 0 && <TextoEptyG texto={"~ Sin datos ~"} />}
      </CajaTabla>
    </>
  );
}

const CajaTabla = styled(CajaTablaGroup)``;

const Tabla = styled(TablaGroup)``;
const Filas = styled(FilasGroup)`
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
    border: 1px solid red;
  }

  &.aproved {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.denied {
    background-color: #813636;
    color: white;
  }
`;

const CeldaHead = styled(CeldaHeadGroup)`
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.ancho {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.flex {
    display: flex;
    justify-content: center;
  }
`;

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
