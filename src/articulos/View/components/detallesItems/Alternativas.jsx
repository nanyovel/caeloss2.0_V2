import React from "react";
import styled from "styled-components";
import { Tema, Theme } from "../../../../config/theme";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ImgCelda,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";

export default function Alternativas({
  productMaster,
  productEditable,
  modoEditar,
}) {
  return (
    <Container>
      {modoEditar ? (
        <WrapEdit>
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Imagen</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Observaciones</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {productEditable.alternativas.map((item, index) => {
                  return (
                    <FilasGroup key={index} className="body">
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ImgCelda src={item.img} />
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.descripcion}</CeldasBodyGroup>
                      <CeldasBodyGroup>{item.obs}</CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
          <CajaBtn>
            <BtnSimple>-</BtnSimple>
            <BtnSimple>+</BtnSimple>
          </CajaBtn>{" "}
        </WrapEdit>
      ) : (
        productMaster.alternativas.map((item, index) => {
          return (
            <CajaArticulo key={index}>
              <CajaFoto>
                <Img src={item.img} />
              </CajaFoto>
              <CajaTitulo>
                <CajaInternaArticulo>
                  <CajaDetalles>
                    <CajitaDetalle className="vertical">
                      <TituloDetalle className="vertical">SKU:</TituloDetalle>
                      <DetalleTexto className="vertical">
                        {item.codigo}
                      </DetalleTexto>
                    </CajitaDetalle>
                    <CajitaDetalle className="vertical">
                      <TituloDetalle className="vertical">
                        Descripcion:
                      </TituloDetalle>
                      <DetalleTexto className="vertical">
                        {item.descripcion}
                      </DetalleTexto>
                    </CajitaDetalle>
                    <CajitaDetalle className="vertical">
                      <TituloDetalle className="vertical">Obs:</TituloDetalle>
                      <DetalleTexto className="vertical">
                        {item.obs}
                      </DetalleTexto>
                    </CajitaDetalle>
                  </CajaDetalles>
                </CajaInternaArticulo>
              </CajaTitulo>
            </CajaArticulo>
          );
        })
      )}
    </Container>
  );
}

const Container = styled.div`
  width: 100%;
  height: 500px;
  border: 1px solid ${Tema.primary.azulBrillante};
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 15px;
  overflow-y: scroll;
  border-radius: 8px;
  box-shadow: ${Theme.config.sombra};

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 6px;
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
const CajaArticulo = styled.div`
  width: 100%;
  height: 300px;
  background-color: ${Tema.neutral.grisTextoGoogle};
  padding: 4px;
  box-shadow: ${Tema.config.sombra};
  border-radius: 5px;
  display: flex;
  gap: 5px;
  border: 2px solid transparent;
  transition: ease all 0.2s;
  &:hover {
    cursor: pointer;
    border: 2px solid ${Tema.primary.azulBrillante};
    transform: scale(1.03);
    background-color: ${Tema.neutral.neutral500};
  }
`;
const CajaFoto = styled.div`
  width: 50%;
  height: 100%;
  border: 1px solid white;
  border-radius: 5px;
  box-shadow: ${Tema.config.sombra2};
`;
const CajaTitulo = styled.div`
  width: 50%;
  height: 100%;
  overflow-y: scroll;
  /* border: 1px solid white; */
  display: flex;
  align-items: center;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaInternaArticulo = styled.div`
  border: 1px solid ${Tema.secondary.azulBrillanteTG};
  min-height: 50%;
  width: 100%;
  padding: 5px;
`;

const CajaDetalles = styled.div`
  width: 100%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid ${Tema.primary.grisNatural};
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.secondary.azulOpaco};
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};

  justify-content: space-between;
  &.vertical {
    flex-direction: column;
    border: none;
    width: 100%;
    background-color: ${Tema.secondary.azulSuave};
    padding: 4px;
    margin-bottom: 3px;
  }
`;
const TituloDetalle = styled.p`
  width: 49%;
  text-align: start;
  color: ${Tema.neutral.blancoHueso};

  &.vertical {
    width: 100%;
    text-align: start;
    text-decoration: underline;
    margin-bottom: 5px;
  }
`;

const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: ${Tema.neutral.blancoHueso};
  &.vertical {
    width: 100%;
    text-align: start;
    margin-bottom: 4px;
    padding-left: 15px;
    overflow: visible;
    white-space: wrap;
    height: auto;
  }
  &.lista {
    /* border: 1px solid red; */
    text-align: start;
    padding-left: 15px;
    width: 100%;
  }
`;
const Img = styled.img`
  width: 100%;
  height: 100%;
  object-fit: contain;
`;
const WrapEdit = styled.div`
  display: flex;
  flex-direction: column;
`;
const CajaBtn = styled.div``;
const BtnSimple = styled(BtnGeneralButton)``;
