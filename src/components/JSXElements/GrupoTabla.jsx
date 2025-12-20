import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import { Link } from "react-router-dom";
import { formatoDOP } from "../../libs/StringParsed";
import { BtnGeneralButton } from "../BtnGeneralButton";

export const CajaTablaGroup = styled.div`
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  padding: 5px 10px;
  border: 1px solid white;
  &.altoAuto {
    height: auto;
  }
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
export const Enlace = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

export const TablaGroup = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 100%;
  margin: auto;
  margin-bottom: 25px;
`;

export const FilasGroup = styled.tr`
  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  &.body {
    font-weight: normal;
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;

    border-bottom: 1px solid #49444457;
    border-bottom: 1px solid #494444;
  }
  &.warning {
    background-color: ${ClearTheme.complementary.warning};
    color: #00496b;
  }

  &.impar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: white;
  }
  &.descargado {
    background-color: ${Tema.complementary.success};
    color: ${Tema.secondary.azulOlivo};
    color: white;
    &.negativo {
      color: #441818;
    }
  }
  &.filaSelected {
    background-color: ${ClearTheme.complementary.warning};
    color: black;
  }
`;

export const CeldaHeadGroup = styled.th`
  text-align: center;
  padding: 4px;
  font-weight: bold;
  font-size: 0.9rem;
  font-weight: 400;
  border-left: 1px solid #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
export const CeldasBodyGroup = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* height: 25px; */
  text-align: center;
  /* border-bottom: 1px solid #0086c48b; */
  border-left: 1px solid #104a64;
  padding-left: 2px;
  padding-right: 2px;
  &.par {
  }
  &.conInput {
    border: 1px solid #979797;
  }

  &.estandar {
    /* padding-left: 5px; */
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.ancho {
  }

  &.flex {
    display: flex;
    /* border: 1px solid ${Tema.secondary.azulOpaco}; */
    justify-content: center;
  }
  &.startText {
    text-align: start;
  }
  &.start {
    text-align: start;
  }
`;
export const ParrafoAction = styled.span`
  cursor: pointer;
  display: inline-block;
  margin-right: 4px;
  width: 100%;
  height: 100%;
  /* min-height: 45px; */
  align-content: center;
  text-align: center;
  background-color: ${ClearTheme.neutral.neutral200};
  /* border: 1px solid ${Tema.secondary.azulOpaco}; */
  &.boton {
    width: 100px;
    /* margin: 7px; */
    border-radius: 4px;
    background-color: white;
    border: 1px solid #e6e6e6;
    height: 25px;
  }
  transition: ease 0.2s;
  &:hover {
    background-color: transparent;
    background-color: ${ClearTheme.neutral.neutral450};
  }
`;
export const IconoCeldaDeprecated = styled.p`
  display: inline;
  border: 1px solid #b6b6b644;
  cursor: pointer;
  transition: all 0.1s ease;
  border-radius: 2px;
  margin-right: 8px;
  padding: 2px;
  &:hover {
    border: 1px solid #ff0000;
    background-color: #ffffffaf;
  }
`;
export const ImgCelda = styled.img`
  width: 200px;
  max-height: 70px;
  object-fit: contain;
`;

export const JSXChildrenFooterModal = ({ total, btn }) => {
  return (
    <CajaFinalModal>
      <CajaTotalModal>
        <TotalModal>{total}</TotalModal>
      </CajaTotalModal>
      {btn && <BtnSimple>Crear pago</BtnSimple>}
      {/* <BtnSimple>Aceptar</BtnSimple> */}
    </CajaFinalModal>
  );
};

const CajaFinalModal = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
`;
const CajaTotalModal = styled.div`
  height: 100%;
  text-align: center;
  align-content: center;
`;
const TotalModal = styled.h2`
  height: auto;

  color: white;
  font-weight: 400;
  border: 1px solid white;
  padding: 8px;
`;

const BtnSimple = styled(BtnGeneralButton)``;
