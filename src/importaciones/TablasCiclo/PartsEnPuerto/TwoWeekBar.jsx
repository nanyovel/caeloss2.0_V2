import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../../config/theme";

export default function TwoWeekBar({ weekSelected, selecionarDia }) {
  return (
    <ContainerWeek>
      <WrapSemana>
        <TextoWeek>Actual: </TextoWeek>
        <CajaWeek>
          {weekSelected.week1?.map((dia, index) => {
            return (
              <CajaDay
                key={index}
                // className={dia.selected?'selected':''}
                className={`
                        ${dia.selected ? "selected " : ""}
                        ${dia.disabled ? "disabled " : ""}
                      `}
                onClick={(e) => {
                  selecionarDia(e);
                }}
                data-id={index}
                data-nombre="semana1"
              >
                <TextoDay
                  onClick={(e) => selecionarDia(e)}
                  data-id={index}
                  data-nombre="semana1"
                >
                  {dia.nombre == "Miercoles" ? "MI" : dia.nombre[0]}
                </TextoDay>
              </CajaDay>
            );
          })}
        </CajaWeek>
      </WrapSemana>
      <WrapSemana>
        <TextoWeek>Próxima: </TextoWeek>
        <CajaWeek>
          {weekSelected.week2?.map((dia, index) => {
            return (
              <CajaDay
                key={index}
                className={`
                        ${dia.selected ? "selected " : ""}
                        ${dia.disabled ? "disabled " : ""}
                      `}
                data-id={index}
                onClick={(e) => {
                  selecionarDia(e);
                }}
                data-nombre="semana2"
              >
                <TextoDay
                  data-nombre="semana2"
                  data-id={index}
                  onClick={(e) => {
                    selecionarDia(e);
                  }}
                >
                  {dia.nombre == "Miercoles" ? "MI" : dia.nombre[0]}
                </TextoDay>
              </CajaDay>
            );
          })}
        </CajaWeek>
      </WrapSemana>
    </ContainerWeek>
  );
}

const ContainerWeek = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: 15px;
  margin-top: 15px;
  margin-bottom: 15px;
  @media screen and (max-width: 1000px) {
    flex-direction: column;
    gap: 10px;
    justify-content: start;
    align-items: end;
  }
  @media screen and (max-width: 300px) {
    overflow-x: scroll;
    display: block;
    width: 100%;
    background-color: red;
  }
  background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
`;
const WrapSemana = styled.div`
  display: flex;
  align-items: center;
  /* width: 60%; */
`;
const TextoWeek = styled.h2`
  color: ${Tema.primary.azulBrillante};
  color: white;
  @media screen and (max-width: 400px) {
    font-size: 20px;
  }
`;
const CajaWeek = styled.div`
  display: flex;
  justify-content: space-between;
  /* width: 60%; */
  border: 1px solid ${Tema.secondary.azulOpaco};
  padding: 4px;
`;

const CajaDay = styled.div`
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 5px;
  color: ${Tema.primary.azulBrillante};
  color: white;
  cursor: pointer;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.selected {
    background-color: white;
    border: 1px solid ${Tema.primary.azulBrillante};
    color: ${ClearTheme.primary.azulBrillante};
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: white;
    cursor: auto;
    border: none;
    &:hover {
      border: none;
    }
  }
`;

const TextoDay = styled.h2`
  margin: 10px;
  color: inherit;
  /* font-size: 18px; */

  @media screen and (max-width: 400px) {
    font-size: 20px;
    margin: 6px;
  }
`;
