import styled from "styled-components";
import { Tema } from "../../config/theme";

export const CajaSlider = styled.div`
  position: absolute;
  z-index: 2;
  top: 110px;
  right: 0px;
  transform: translate(100%, 0);
  width: 400px;
  border: 1px solid ${Tema.secondary.azulProfundo};
  border-radius: 5px;
  padding: 4px;
  background-color: ${Tema.secondary.azulProfundo};
  transition: transform ease 0.4s;
  min-height: 200px;
  max-height: 450px;
  overflow-y: auto;

  &.abierto {
    right: 5px;
    transform: translate(0, 0);
  }
  /* &:hover {
    right: 0px;
    transform: translate(0, 0);
  } */

  @media screen and (max-width: 550px) {
    width: 98%;
    right: 15px;
    transform: translate(100%, 0);
    &.abierto {
      right: 0;
      transform: translate(0, 0);
    }
  }
`;
