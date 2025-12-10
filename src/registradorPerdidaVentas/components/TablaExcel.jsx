import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import parse from "paste-from-excel";
import { ClearTheme, Tema } from "../../config/theme";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
} from "../../components/JSXElements/GrupoTabla";
import { formatoDOP, puntoFinal, soloNumeros } from "../../libs/StringParsed";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BotonQuery } from "../../components/BotonQuery";

export default function TablaExcel({
  ventaPerdida,
  ListaArticulos,
  columnasActivas,
  inputsArray,
  setValueTabla,
}) {
  const labels = ["n°", "codigo", "descripcion", "cantidad", "precio", "total"];

  const [inputvalue, setinputvalue] = useState([...inputsArray]);

  useEffect(() => {
    setinputvalue([...inputsArray]);
  }, [ventaPerdida.motivo]);

  const retenerPegadoInputDisabled = (elm) => {
    // Esta funcion lño que hace es evitar el pegado en las celdas que queramos
    // Que al hacer el pegado sobre un input que no queremos pues que no se ejecute el pegado, tomar en cuenta que aunque el input este en modo disabled, permite pegado, con esta funcion lo corregimos

    // Si deseamos tambien la podemos colocar en la funcion hadlePaste y funciona pero a media, es decir solo evita las celdas donde sobre se hace el pegado, no todas las otras abarcadas por el recuadro de la tabla copiada
    if (ventaPerdida.motivo == "Producto no de inventario") {
      if (elm == "codigo" || elm == "total") {
        return true;
      }
    }
    if (ventaPerdida.motivo != "Producto no de inventario") {
      if (elm == "descripcion" || elm == "total") {
        console.log("sopa");
        return true;
      }
    }
  };

  const valoresCabecera = {
    codigo: ["Codigo", "codigo"],
    descripcion: [
      "Descripción de artículo",
      "descripcion",
      "descripción",
      "Descripcion",
      "Descripción",
    ],
    cantidad: ["Cantidad", "cantidad"],
  };

  const handlePaste = (index, elm, e) => {
    return parse(e);
  };

  const handlePaste1 = (index, elm, e) => {
    let valueParsed = e.target.value;
    const evento = e.type;
    // Evitar pegado en celdas especificas
    if (retenerPegadoInputDisabled(elm)) {
      return;
    }

    // Evitar el ingreso de cabecera;Codigo, Descripcion etc
    if (valoresCabecera[elm]?.includes(valueParsed)) {
      return;
    }

    // Aqui colocamos los inputs con las mismas configuraciones compartidas
    if (elm == "cantidad" || elm == "precio") {
      setinputvalue((prevState) =>
        prevState.map((item, i) => {
          if (index === i) {
            if (elm == "cantidad") {
              if (evento == "blur") {
                const ultCaracter = e.target.value.charAt(
                  e.target.value.length - 1
                );
                if (ultCaracter == ".") {
                  valueParsed = Number(valueParsed);
                }
              }
              if (soloNumeros(valueParsed)) {
                return {
                  ...item,
                  cantidad: Number(valueParsed),
                };
              } else if (puntoFinal(valueParsed)) {
                return {
                  ...item,
                  cantidad: valueParsed,
                };
              } else {
                return {
                  ...item,
                };
              }
            }
            if (elm == "precio") {
              if (evento == "focus") {
                return {
                  ...item,
                  focusOnPrecio: true,
                };
              } else if (evento == "blur") {
                const ultCaracter = e.target.value.charAt(
                  e.target.value.length - 1
                );
                if (ultCaracter == ".") {
                  valueParsed = Number(valueParsed);
                }
                return {
                  ...item,
                  focusOnPrecio: false,
                  precio: Number(valueParsed),
                };
              }

              if (soloNumeros(valueParsed)) {
                return {
                  ...item,
                  precio: Number(valueParsed),
                };
              } else if (puntoFinal(valueParsed)) {
                return {
                  ...item,
                  precio: valueParsed,
                };
              } else {
                return {
                  ...item,
                };
              }
            }
          } else {
            return {
              ...item,
            };
          }
        })
      );
    } else {
      setinputvalue((prevState) =>
        prevState.map((item, i) => {
          if (index === i) {
            if (elm == "codigo") {
              const itemFind = ListaArticulos.find(
                (articulo) => articulo.codigo == valueParsed
              );
              return {
                ...item,
                codigo: valueParsed,
                descripcion: itemFind ? itemFind.descripcion : "",
                costo: itemFind ? itemFind.costo : "",
                precio: itemFind ? itemFind.precio : "",
              };
            } else {
              return {
                ...item,
                [elm]: valueParsed,
              };
            }
          } else {
            return { ...item };
          }
        })
      );
    }
  };

  const [sumatoriaPerdida, setSumatoriaPerdida] = useState("");
  useEffect(() => {
    let montoTotal = 0;
    inputvalue.forEach((item, index) => {
      montoTotal += item.precio * item.cantidad;
    });
    setSumatoriaPerdida(formatoDOP(montoTotal));
    setValueTabla([...inputvalue]);
  }, [inputvalue]);
  return (
    <Container>
      <BotonQuery inputvalue={inputvalue} ventaPerdida={ventaPerdida} />
      <CajaTabla>
        <Tabla>
          <EncabezadoTabla>
            <Filas className="text-center">
              <CeldasHead className="textEnd" colSpan="3">
                Perdida total:
              </CeldasHead>
              <CeldasHead colSpan="3">{sumatoriaPerdida}</CeldasHead>
            </Filas>
            <Filas className="text-center">
              <CeldasHead>N°</CeldasHead>
              <CeldasHead>Codigo</CeldasHead>
              <CeldasHead>Descripcion</CeldasHead>
              <CeldasHead>Qty</CeldasHead>
              <CeldasHead>Precio</CeldasHead>
              <CeldasHead>Total</CeldasHead>
            </Filas>
          </EncabezadoTabla>
          <Cuerpo>
            {ventaPerdida.motivo != "" &&
              inputvalue?.map((res, index) => {
                return (
                  <Filas key={index}>
                    {labels.map((elm, i) => {
                      return (
                        <CeldasBody key={i}>
                          {elm == "n°" ? (
                            index + 1
                          ) : (
                            <InputCelda
                              onInput={(e) => {
                                handlePaste1(index, elm, e, i);
                              }}
                              onFocus={(e) => handlePaste1(index, elm, e, i)}
                              onBlur={(e) => handlePaste1(index, elm, e, i)}
                              className={columnasActivas[elm] ? "" : "disabled"}
                              disabled={!columnasActivas[elm]}
                              onPaste={(e) => {
                                handlePaste(index, elm, e, i);
                              }}
                              type="textbox"
                              value={
                                elm == "total"
                                  ? inputvalue[index].precio *
                                      inputvalue[index].cantidad >
                                    0
                                    ? formatoDOP(
                                        inputvalue[index].precio *
                                          inputvalue[index].cantidad
                                      )
                                    : ""
                                  : elm == "precio"
                                    ? inputvalue[index].precio === ""
                                      ? ""
                                      : inputvalue[index]?.focusOnPrecio
                                        ? inputvalue[index].precio
                                        : formatoDOP(inputvalue[index].precio)
                                    : inputvalue[index][elm]
                              }
                              title={inputvalue[index][elm]}
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
    width: 100px;
  }
  &:nth-child(6) {
    width: 150px;
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
