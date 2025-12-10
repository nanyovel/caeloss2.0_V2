import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../config/theme";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
  TextArea,
} from "../../components/InputGeneral";
import { Alerta } from "../../components/Alerta";
import { puntoFinal, soloNumeros } from "../../libs/StringParsed";
import { BotonQuery } from "../../components/BotonQuery";

export default function UnItem({
  ventaPerdida,
  MotivoPerdida,
  ListaArticulos,
  setVentaPerdida,
  initialVentaPerdida,
  enviarObjeto,
  formatoDOP,
}) {
  const [precioConFormato, setPrecioConFormato] = useState("");
  const [focusMonto, setFocusMonto] = useState(false);
  const [hasDataList, setHasDataList] = useState(false);

  const handleInputs = (e) => {
    const { name, value } = e.target;
    const evento = e.type;

    if (name != "codigo") {
      setHasDataList(false);
    }

    if (name == "codigo") {
      setHasDataList(true);
      const articuloBuscado = ListaArticulos.find((item) => {
        if (item.codigo == value) {
          return item;
        }
      });

      setVentaPerdida((prevState) => ({
        ...prevState,
        codigo: value,
        descripcion: articuloBuscado ? articuloBuscado.descripcion : "",
        costo: articuloBuscado ? articuloBuscado.costo : "",
        precio: articuloBuscado ? articuloBuscado.precio : "",
      }));
      setPrecioConFormato(
        formatoDOP(articuloBuscado ? articuloBuscado.precio : "")
      );
    } else if (name == "cantidad") {
      console.log(value);
      let valueParsed = value;
      if (evento == "blur") {
        const ultCaracter = value.charAt(value.length - 1);
        if (ultCaracter == ".") {
          valueParsed = Number(valueParsed);
        }
      }
      if (soloNumeros(valueParsed)) {
        setVentaPerdida((prevState) => ({
          ...prevState,
          cantidad: Number(valueParsed),
        }));
      } else if (puntoFinal(valueParsed)) {
        setVentaPerdida((prevState) => ({
          ...prevState,
          cantidad: valueParsed,
        }));
      }
    } else if (name == "descripcion") {
      setVentaPerdida((prevState) => ({
        ...prevState,
        descripcion: value,
      }));
    }
    //
    else if (name == "precio") {
      let valueParsed = value;
      if (evento == "focus") {
        setFocusMonto(true);
      } else if (evento == "blur") {
        setFocusMonto(false);
        const ultCaracter = value.charAt(value.length - 1);
        if (ultCaracter == ".") {
          valueParsed = Number(valueParsed);
        }
      }
      if (soloNumeros(valueParsed)) {
        setPrecioConFormato(formatoDOP(valueParsed));
        setVentaPerdida((prevState) => ({
          ...prevState,
          precio: Number(valueParsed),
        }));
      } else if (puntoFinal(valueParsed)) {
        setVentaPerdida((prevState) => ({
          ...prevState,
          precio: valueParsed,
        }));
      }
    }
    //
    else if (name == "motivo") {
      setPrecioConFormato("");
      setVentaPerdida((prevState) => ({
        ...initialVentaPerdida,
        motivo: value,
      }));
    } else {
      setVentaPerdida((prevState) => ({
        ...prevState,
        [name]: value,
      }));
    }
  };

  return (
    <CajaContenedora>
      <BotonQuery ventaPerdida={ventaPerdida} />
      <CajaTitulo>
        <Titulo>Por favor ingrese el producto a registrar</Titulo>
      </CajaTitulo>
      <CajaDetalles>
        <TituloCaja>
          Motivo<Span> *</Span>
        </TituloCaja>
        <MenuSimple
          name="motivo"
          className="clearModern"
          value={ventaPerdida.motivo}
          onChange={(e) => handleInputs(e)}
        >
          <Opciones className="clearModern" disabled value={""}>
            Seleccione motivo
          </Opciones>
          {MotivoPerdida.map((motivo, index) => {
            return (
              <Opciones className="clearModern" key={index} value={motivo}>
                {motivo}
              </Opciones>
            );
          })}
        </MenuSimple>
      </CajaDetalles>
      {ventaPerdida.motivo != "" && (
        <>
          <CajaDetalles>
            <TituloCaja>
              Codigo
              {ventaPerdida.motivo != "Producto no de inventario" && (
                <Span> *</Span>
              )}
            </TituloCaja>
            <InputSimple
              placeholder="Escribir producto"
              name="codigo"
              disabled={ventaPerdida.motivo == "Producto no de inventario"}
              className={
                ventaPerdida.motivo == "Producto no de inventario"
                  ? "disabled"
                  : "clearModern"
              }
              value={ventaPerdida.codigo}
              list="articulos"
              onChange={(e) => handleInputs(e)}
              autoComplete="off"
            />
            {hasDataList && (
              <DataList id="articulos">
                {ListaArticulos.map((item, index) => {
                  return (
                    <Opcion value={item.codigo} key={index}>
                      {item.descripcion}
                    </Opcion>
                  );
                })}
              </DataList>
            )}
          </CajaDetalles>

          <CajaDetalles>
            <TituloCaja>
              Descripcion
              {ventaPerdida.motivo == "Producto no de inventario" && (
                <Span> *</Span>
              )}
            </TituloCaja>
            <InputSimple
              disabled={
                ventaPerdida.motivo !== "Producto no de inventario"
                  ? true
                  : false
              }
              value={ventaPerdida.descripcion}
              placeholder="Escribir producto"
              name="descripcion"
              className={`clearModern 
                         ${ventaPerdida.motivo !== "Producto no de inventario" ? "disabled" : ""}
   
                       `}
              list="articulos"
              onChange={(e) => handleInputs(e)}
              autoComplete="off"
            />
          </CajaDetalles>
          <CajaDetalles>
            <TituloCaja>
              Cantidad<Span> *</Span>
            </TituloCaja>
            <InputSimple
              placeholder="Cantidad"
              name="cantidad"
              autoComplete="off"
              className="clearModern"
              value={ventaPerdida.cantidad}
              onChange={(e) => handleInputs(e)}
              onFocus={(e) => handleInputs(e)}
              onBlur={(e) => handleInputs(e)}
            />
          </CajaDetalles>
          <CajaDetalles>
            <TituloCaja>Cliente</TituloCaja>
            <InputSimple
              placeholder="Cliente"
              name="cliente"
              autoComplete="off"
              className="clearModern"
              value={ventaPerdida.cliente}
              onChange={(e) => handleInputs(e)}
            />
          </CajaDetalles>
          <CajaDetalles>
            <TituloCaja>Precio:</TituloCaja>
            <InputSimple
              placeholder="Precio"
              name="precio"
              autoComplete="off"
              className={`clearModern`}
              value={focusMonto ? ventaPerdida.precio : precioConFormato}
              onChange={(e) => handleInputs(e)}
              onFocus={(e) => handleInputs(e)}
              onBlur={(e) => handleInputs(e)}
            />
          </CajaDetalles>
          <CajaDetalles>
            <TituloCaja>Total RD$:</TituloCaja>
            <InputSimple
              placeholder="Total RD$"
              autoComplete="off"
              disabled
              className={`clearModern disabled`}
              value={formatoDOP(ventaPerdida.precio * ventaPerdida.cantidad)}
            />
          </CajaDetalles>

          <CajaDetalles>
            <TituloCaja>
              Observaciones
              {ventaPerdida.motivo == "Otros" ? <Span> *</Span> : ""}
            </TituloCaja>
            <TextArea2
              placeholder="Observaciones"
              name="observaciones"
              onChange={(e) => handleInputs(e)}
              value={ventaPerdida.observaciones}
              className="clearModern"
            />
          </CajaDetalles>
          <CajaDetalles className="boton">
            <BtnSimple name="unItem" onClick={(e) => enviarObjeto(e)}>
              Enviar
            </BtnSimple>
          </CajaDetalles>
        </>
      )}
    </CajaContenedora>
  );
}

const ParrafoTabla = styled.p`
  width: 100%;
  color: ${Tema.complementary.warning};
`;
const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;
const CajaTitulo = styled.div`
  width: 100%;
  padding: 15px;
`;
const Titulo = styled.h2`
  color: white;
  text-decoration: underline;
`;
const CajaBtnHead = styled.div`
  width: 100%;
  margin-bottom: 15px;
  padding-left: 30px;
  padding-top: 15px;
`;
const CajaContenedora = styled.div`
  border: 1px solid white;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(15px);

  border-radius: 5px;
  width: 65%;
  padding: 10px;
  &.anchoCompleto {
    width: 100%;
  }
  @media screen and (max-width: 500px) {
    width: 90%;
    margin-bottom: 100px;
  }
`;

const CajaDetalles = styled.div`
  /* border: 1px solid white; */
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  margin-bottom: 15px;
  &.boton {
    margin-top: 20px;
  }
  &.lista {
    width: 50%;
    /* border: 1px solid blue; */
    margin: 0;
    justify-content: center;
    align-items: center;
    @media screen and (max-width: 500px) {
      width: 70%;
    }
    @media screen and (max-width: 400px) {
      width: 90%;
    }
  }
  &.tabla {
    width: 100%;
  }
  @media screen and (max-width: 850px) {
    width: 90%;
  }
`;
const TituloCaja = styled.p``;
const InputSimple = styled(InputSimpleEditable)`
  height: 35px;
  /* width: 100%; */
`;
const TextArea2 = styled(TextArea)`
  border: none;
  min-height: 70px;
  outline: none;
  border-radius: 4px;
  padding: 5px;
  resize: vertical;
  width: 100%;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.lista {
    min-height: 35px;
    max-height: 200px;
    height: 35px;
  }
  &.tabla {
    width: 180px;
  }
  @media screen and (max-width: 800px) {
    /* width: 220px; */
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  width: 50%;
  margin: auto;
  &.lista {
    position: relative;
    top: 10px;
  }
`;
const MenuSimple = styled(MenuDesplegable)`
  height: 35px;
`;
const DataList = styled.datalist`
  width: 150%;
`;

const Opcion = styled.option``;
const CajaHeadLista = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    /* width: 90%; */
    flex-direction: column;
  }
`;
const ContainerMaster = styled.div`
  position: relative;
  min-height: 100dvh;
  /* display: grid;
  grid-template-rows: auto 1fr auto; */

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
const Span = styled.span`
  color: ${ClearTheme.complementary.warningClear};
  font-size: 1.1rem;
`;
