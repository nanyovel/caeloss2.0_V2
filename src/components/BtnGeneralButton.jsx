import { styled } from "styled-components";
import { ClearTheme, Tema } from "../config/theme.jsx";
import React from "react";

export const BtnGeneralButton = styled.button`
  margin: 10px;
  cursor: pointer;

  border-radius: 5px;
  min-width: 100px;
  padding: 5px;
  border: none;
  outline: none;
  font-size: 1rem;
  background-color: ${Tema.complementary.azulStatic};
  color: white;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  display: inline-block;

  &:focus {
    background-color: ${Tema.complementary.azulStatic};
    color: #fff;
  }

  &:hover {
    background-color: #fff;
    color: #0074d9;
  }
  &:active {
    background-color: #135c9d;
    color: #fff;
  }

  &.danger {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
    &:active {
      background-color: #f74a4a;
      color: #fff;
    }
  }
  &.enviar {
    padding: 15px;
  }
  &.disabled {
    background-color: ${ClearTheme.primary.grisCielos};
    cursor: default;
    &:hover {
      color: white;
    }
  }
`;

export const BtnDesarrollo = styled(BtnGeneralButton)`
  &.ocultar {
    display: none;
  }
`;
