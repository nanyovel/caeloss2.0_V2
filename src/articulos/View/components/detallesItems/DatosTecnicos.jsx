import React from "react";

import styled from "styled-components";
import { Tema } from "../../../../config/theme";

export default function DatosTecnicos({ productMaster }) {
  return (
    <Container>
      <CajaDetalles>
        <CajitaDetalle>
          <TituloDetalle>Rendimiento / Convertura:</TituloDetalle>
          {/* <DetalleTexto>2.9768 M²</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Peso:</TituloDetalle>
          {/* <DetalleTexto>75.90 Lib</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Embalaje de almacenamiento:</TituloDetalle>
          {/* <DetalleTexto>30unds / 40 unds</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Resiste interperie / exterior:</TituloDetalle>
          {/* <DetalleTexto>Si</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Resiste moho:</TituloDetalle>
          {/* <DetalleTexto>Si</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle className="vertical">
          <TituloDetalle className="vertical">Se compone de:</TituloDetalle>
          {/* <DetalleTexto className="vertical">
            Fabricado con cemento Portland en su núcleo, y laminado con una
            malla de fibra de vidrio polimerizada en ambas caras.
          </DetalleTexto> */}
        </CajitaDetalle>

        <CajitaDetalle>
          <TituloDetalle>Incombustible</TituloDetalle>
          {/* <DetalleTexto>Aprobado (**Metodo; Norma ASTM**) </DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Propagación de flama</TituloDetalle>
          {/* <DetalleTexto>0 (**Metodo utilizado; Norma ASTM**)</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Emision de humo</TituloDetalle>
          {/* <DetalleTexto>0 (**Metodo; Norma ASTM**)</DetalleTexto> */}
        </CajitaDetalle>
        <CajitaDetalle className="vertical">
          <TituloDetalle className="vertical">Dimensiones:</TituloDetalle>
          <CajaTablaRecuadro>
            <TablaRecuadro>
              <thead>
                <FilaRecuadro className="cabeza">
                  <CeldaHeadRecuadro>U/M</CeldaHeadRecuadro>
                  <CeldaHeadRecuadro>Ancho</CeldaHeadRecuadro>
                  <CeldaHeadRecuadro>Largo</CeldaHeadRecuadro>
                  <CeldaHeadRecuadro>Grosor</CeldaHeadRecuadro>
                </FilaRecuadro>
              </thead>
              <tbody>
                <FilaRecuadro className="body">
                  <CeldaBodyRecuadro>Metros</CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                </FilaRecuadro>
                <FilaRecuadro className="body">
                  <CeldaBodyRecuadro>Pies</CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                </FilaRecuadro>
                <FilaRecuadro className="body">
                  <CeldaBodyRecuadro>Centimetros</CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                </FilaRecuadro>
                <FilaRecuadro className="body">
                  <CeldaBodyRecuadro>Pulgadas</CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                </FilaRecuadro>
                <FilaRecuadro className="body">
                  <CeldaBodyRecuadro>Milimetros</CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                  <CeldaBodyRecuadro></CeldaBodyRecuadro>
                </FilaRecuadro>
              </tbody>
            </TablaRecuadro>
          </CajaTablaRecuadro>
        </CajitaDetalle>
      </CajaDetalles>
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  justify-content: center;
`;

const CajaDetalles = styled.div`
  width: 70%;
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
const CajaTablaRecuadro = styled.div`
  padding: 0 10px;
  overflow-x: scroll;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
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
const TablaRecuadro = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;
const CeldaHeadRecuadro = styled.th`
  padding: 3px 7px;
  text-align: center;
  border: 1px solid ${Tema.secondary.azulOpaco};

  font-size: 0.9rem;
`;
const FilaRecuadro = styled.tr`
  width: 100%;
  color: ${Tema.neutral.blancoHueso};

  &.body {
    font-weight: normal;
    background-color: ${Tema.secondary.azulSuave};
  }

  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }

  &:hover {
    background-color: ${Tema.secondary.azulProfundo};
  }
`;
const CeldaBodyRecuadro = styled.td`
  font-size: 0.9rem;

  border: 1px solid ${Tema.secondary.azulOpaco};
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  text-align: center;
`;
