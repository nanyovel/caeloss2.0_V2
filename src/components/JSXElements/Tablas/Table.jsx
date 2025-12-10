import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../../config/theme";
import { InputSimpleEditable } from "../../InputGeneral";
import TextoEptyG from "../../TextoEptyG";
import { BotonQuery } from "../../BotonQuery";

export default function Table({ columnas, datos }) {
  // *******  TODOS LOS OBJETOS TIENEN MISMA ESTRUCTURA *******
  function tienenMismaEstructura(array) {
    if (array.length === 0) return true; // Si está vacío, se considera válido

    const keysReferencia = Object.keys(array[0]); // Tomamos las claves del primer objeto

    return array.every((obj) => {
      const keysActual = Object.keys(obj);
      return (
        keysReferencia.length === keysActual.length &&
        keysReferencia.every((key) => keysActual.includes(key))
      );
    });
  }
  const hasMismaEstructura = tienenMismaEstructura(datos);

  //
  // *******  Parsear las Columnas *******

  //   const columnas = ["N°", "Enero", "Febrero", "Marzo", "Abril", "Mayo"];
  const ColumnasParsed = [{ label: "N°", key: "no" }, ...columnas];
  console.log(datos);

  // Datos Recibe un array

  return hasMismaEstructura ? (
    <CajaTabla>
      {/* <BotonQuery datos={datos} /> */}
      <Tabla>
        <thead>
          <Filas className="cabeza">
            {ColumnasParsed.map((celda, index) => {
              return <CeldaHead key={index}>{celda.label}</CeldaHead>;
            })}
          </Filas>
        </thead>
        {datos.length > 0 && (
          <tbody>
            {datos.map((dato, i) => {
              return (
                <Filas
                  key={i}
                  className={`
                  body
                  ${i % 2 ? "inpar" : "par"}
                  `}
                >
                  {ColumnasParsed.map((col, index) => {
                    return index == 0 ? (
                      <CeldasBody
                        className={i % 2 ? "inpar" : "par"}
                        key={index}
                      >
                        {i + 1}
                      </CeldasBody>
                    ) : (
                      <CeldasBody
                        className={i % 2 ? "inpar" : "par"}
                        key={index}
                      >
                        {dato.find((data) => data.key == col.key)?.value || ""}
                      </CeldasBody>
                    );
                  })}
                </Filas>
              );
            })}
          </tbody>
        )}
      </Tabla>
      {datos.length == 0 && <TextoEptyG texto={" ~ Tabla sin datos ~"} />}
    </CajaTabla>
  ) : (
    <TextoEptyG texto={" ~ Estructura de datos inconsistente ~"} />
  );
}

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  padding: 5px 20px;
  border: 1px solid ${ClearTheme.neutral.neutral200};
  /* border: 1px solid red; */
  max-height: 200px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 7px;
    width: 7px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;

    border-radius: 7px;
  }
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    /* border-bottom: 1px solid #49444457; */
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }

  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    /* color: white; */
  }
  &.inpar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
    /* background-color: #183f6e; */
    /* background-color: ${ClearTheme.secondary.azulSuave2}; */
  }
`;

const CeldaHead = styled.th`
  text-align: center;
  /* font-weight: bold; */
  font-weight: 400;
  font-size: 0.9rem;
  border-left: #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
const CeldasBody = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* border: 1px solid black; */
  height: 25px;
  text-align: center;
  &.par {
    border-left: 1px solid #e1eef4;
  }
`;

const InputCelda = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  width: 100%;
`;
