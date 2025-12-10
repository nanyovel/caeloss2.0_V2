import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "paste-from-excel";
import { BotonQuery } from "./BotonQuery";
import { ClearTheme, Tema } from "../config/theme";
import { CajaTablaGroup, CeldaHeadGroup } from "./JSXElements/GrupoTabla";

import { soloNumeros } from "../libs/StringParsed";
import { InputSimpleEditable } from "./InputGeneral";
import { ArticulosDB } from "../registradorPerdidaVentas/ArticulosDB";

export default function TablaExcel({
  setValueTabla,
  inputsArray,
  label,
  resetTabla,
  formatoDOP,
  ventaPerdida,
  setMensajeAlerta,
  setTipoAlerta,
  setDispatchAlerta,
}) {
  const ListaArticulos = ArticulosDB.map((item) => {
    return { ...item, costo: 0 };
  });
  const initialValue = {
    inputs: inputsArray,
  };
  const [inputvalue, setinputvalue] = useState({ ...initialValue });
  const [upColumnas, setUpColumnas] = useState(false);
  const handlePaste = (index, elm, e) => {
    setUpColumnas(!upColumnas);
    return parse(e);
  };

  const handlePaste1 = (index, elm, e) => {
    if (
      elm == "descripcion" &&
      ventaPerdida.motivo != "Producto no de inventario"
    ) {
      return "";
    }
    setinputvalue((inputvalue) => ({
      ...inputvalue,
      inputs: inputvalue.inputs.map((item, i) => {
        let valueParse = e.target.value;
        if (index === i) {
          if (elm == "codigo" || elm == "cantidad") {
            if (elm == "codigo") {
              const itemFind = ListaArticulos.find(
                (articulo) => articulo.codigo == valueParse
              );
              if (
                itemFind &&
                ventaPerdida.motivo == "Producto no de inventario"
              ) {
                setMensajeAlerta("Este producto si existe en inventario.");
                setTipoAlerta("warning");
                setDispatchAlerta(true);
                setTimeout(() => setDispatchAlerta(false), 3000);
              }
              setUpColumnas(!upColumnas);
              return {
                ...item,
                codigo: valueParse,
              };
            } else if (elm == "cantidad") {
              const cantidad = soloNumeros(valueParse)
                ? Number(valueParse)
                : item.cantidad;
              setUpColumnas(!upColumnas);
              return {
                ...item,
                cantidad: cantidad,
              };
            }
          } else {
            setUpColumnas(!upColumnas);
            return {
              ...item,
              [elm]: valueParse,
            };
          }
        } else {
          setUpColumnas(!upColumnas);
          return item;
        }
      }),
    }));
  };

  useEffect(() => {
    setValueTabla([...inputvalue.inputs]);
  }, [inputvalue]);

  const [motivoAnterior, setMotivoAnterior] = useState();
  useEffect(() => {
    if (motivoAnterior == "Producto no de inventario") {
      if (motivoAnterior != ventaPerdida.motivo) {
        setinputvalue({ ...initialValue });
      }
    } else {
      if (ventaPerdida.motivo == "Producto no de inventario") {
        setinputvalue({ ...initialValue });
      }
    }

    setMotivoAnterior(ventaPerdida.motivo);
  }, [ventaPerdida.motivo]);

  useEffect(() => {
    setinputvalue({ ...initialValue });
  }, [resetTabla]);

  const [sumatoriaPerdida, setSumatoriaPerdida] = useState("");

  useEffect(() => {
    const inputsActualizados = inputvalue.inputs.map((item, index) => {
      const itemFind = ListaArticulos.find(
        (articulo) => articulo.codigo == item.codigo
      );

      if (itemFind) {
        return {
          ...item,
          monto: item.cantidad * itemFind.costo,
          descripcion: itemFind.descripcion,
        };
      } else {
        return item;
      }
    });

    setinputvalue({ ...inputvalue, inputs: inputsActualizados });

    let montoTotal = 0;
    inputvalue.inputs.forEach((item, index) => {
      montoTotal += item.monto;
    });
    setSumatoriaPerdida(formatoDOP.format(montoTotal));
  }, [upColumnas]);

  useEffect(() => {
    let montoTotal = 0;
    inputvalue.inputs.forEach((item, index) => {
      montoTotal += item.monto;
    });
    setSumatoriaPerdida(formatoDOP.format(montoTotal));
  }, [inputvalue.inputs]);
  return (
    <Container>
      <BotonQuery inputvalue={inputvalue} />
      <CajaTabla>
        <Tabla>
          <EncabezadoTabla>
            <Filas className="text-center">
              <CeldasHead className="textEnd" colSpan="3">
                Perdida total:
              </CeldasHead>
              <CeldasHead colSpan="2">{sumatoriaPerdida}</CeldasHead>
            </Filas>
            <Filas className="text-center">
              <CeldasHead>N°</CeldasHead>
              <CeldasHead>Codigo</CeldasHead>
              <CeldasHead>Descripcion</CeldasHead>
              <CeldasHead>Qty</CeldasHead>
              <CeldasHead>Monto</CeldasHead>
            </Filas>
          </EncabezadoTabla>
          <Cuerpo>
            {inputvalue.inputs?.map((res, index) => {
              return (
                <Filas key={index}>
                  {label.labels.map((elm, i) => {
                    return (
                      <CeldasBody key={i}>
                        {elm == "n°" ? (
                          index + 1
                        ) : (
                          <InputCelda
                            onInput={(e) => {
                              handlePaste1(index, elm, e, i);
                            }}
                            className={
                              (elm == "descripcion" || elm == "monto") &&
                              ventaPerdida.motivo != "Producto no de inventario"
                                ? "disabled"
                                : ""
                            }
                            disabled={
                              (elm == "descripcion" || elm == "monto") &&
                              ventaPerdida.motivo != "Producto no de inventario"
                                ? true
                                : ""
                            }
                            onPaste={(e) => {
                              handlePaste(index, elm, e, i);
                            }}
                            type="textbox"
                            value={
                              elm == "monto"
                                ? inputvalue.inputs[index][elm] != ""
                                  ? ventaPerdida.motivo !=
                                    "Producto no de inventario"
                                    ? formatoDOP.format(
                                        inputvalue.inputs[index][elm]
                                      )
                                    : inputvalue.inputs[index][elm]
                                  : ""
                                : inputvalue.inputs[index][elm]
                            }
                            title={inputvalue.inputs[index][elm]}
                          />
                        )}
                      </CeldasBody>
                    );
                  })}
                </Filas>
              );
            })}
          </Cuerpo>
        </Tabla>
      </CajaTabla>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  /* background-color: red; */
  min-height: 100px;
`;
const CajaTabla = styled(CajaTablaGroup)`
  border: none;
  padding: 0;
`;
const Tabla = styled.table`
  border-radius: 5px;
  color: white;
  margin: auto;
  border-collapse: collapse;
`;
const EncabezadoTabla = styled.thead`
  border: 1px solid white;
  /* background-color: ${Tema.secondary.azulGraciel}; */
`;
const Filas = styled.tr``;
const CeldasHead = styled(CeldaHeadGroup)`
  border: 1px solid black;
  &:first-child {
    width: 50px;
    background-color: ${Tema.secondary.azulGraciel};
  }
  &:nth-child(2) {
    width: 80px;
  }
  &:nth-child(3) {
    min-width: 300px;
  }
  &:nth-child(4) {
    width: 100px;
  }
  &:nth-child(5) {
    width: 200px;
  }
  &.textEnd {
    text-align: end;
  }
`;
const Cuerpo = styled.tbody``;
const CeldasBody = styled.td`
  border: 1px solid black;
  font-size: 0.9rem;
  height: 25px;
  text-align: center;

  width: 10px;
  &:first-child {
    width: 40px;
  }
`;

const Input = styled(InputSimpleEditable)`
  height: 35px;
  outline: none;
  border-radius: 5px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  padding: 5px;
  width: 95%;
  resize: both;
  resize: horizontal;
  min-width: auto;
  &:focus {
    border: white;
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;
const InputCelda = styled(Input)`
  width: 100%;
  height: 25px;
  outline: none;
  border: none;
  border-radius: 0;
  padding: 3px;
  &.codigo {
    text-align: center;
  }
  &.qty {
    text-align: center;
  }
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;
// 777
