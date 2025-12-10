import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../config/theme";

export const InputSimpleEditable = styled.input`
  outline: none;
  height: 30px;
  border-radius: 4px;
  padding: 5px;
  width: 100%;
  min-width: 180px;
  border: 1px solid transparent;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  /* ClearModern */
  background-color: ${ClearTheme.secondary.azulVerde};
  color: #ffffff;
  border: 1px solid #494949;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
    color: #ffffff;
    border: 1px solid #494949;
    &::placeholder {
      color: #535353;
    }
    &:focus {
      border: 1px solid white;
    }
  }
  &::placeholder {
    color: #535353;
  }
  &:focus {
    border: 1px solid white;
  }

  &.celda {
    min-width: 30px;
    height: 100%;
    /* height: 20px; */
    border: none;
    border-radius: 0;
    /* border: 1px solid gray; */
    &:focus {
      border: none;
    }
    background-color: transparent;
    color: black;
  }
  &.celdaClear {
    color: black;
    background-color: transparent;
    height: 100%;
    width: 100%;
    max-width: auto;
    min-width: auto;
    /* height: 20px; */
    border: none;
    border-radius: 0;
    border: 1px solid gray;

    &:focus {
      border: 1px solid black;
    }
  }

  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: white;
    /* background-color: red; */
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: white;
  }
  &.mayuscula {
    text-transform: uppercase;
  }
  &.grupoDetalle {
    height: 100%;
    border-radius: 0;
    width: 100%;
  }
`;

export const MenuDesplegable = styled.select`
  outline: none;
  border: 1px solid transparent;
  height: 30px;
  width: 100%;
  padding: 5px;
  /* margin-bottom: 1px; */
  border-radius: 4px;
  &.cabecera {
    border: 1px solid ${Tema.secondary.azulProfundo};
  }
  color: ${Tema.primary.azulBrillante};

  &:focus {
    border: 1px solid white;
  }

  background-color: ${ClearTheme.secondary.azulVerde};
  color: white;
  &.clearModern {
    color: white;
    background-color: ${ClearTheme.secondary.azulVerde};
    border: 1px solid #494949;
    &::placeholder {
      color: #535353;
    }

    &:focus {
      border: 1px solid white;
    }
  }
  &.celda {
    height: 100%;
    color: black;
    border-radius: 0;
    border: none;
    border: 1px solid gray;
    background-color: transparent;
    &:focus {
      border: none;
    }
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: white;
  }
  &.grupoDetalle {
    height: 100%;
    border-radius: 0;
  }
`;
export const TextArea = styled.textarea`
  font-family: "lato", "Lucida Sans", "Lucida Sans Regular", "Lucida Grande",
    "Lucida Sans Unicode", Geneva, Verdana, sans-serif;
  height: 100px;
  width: 100%;
  min-height: 100px;
  resize: vertical;
  border: 1px solid ${Tema.secondary.azulOscuro2};

  outline: none;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  color: ${Tema.primary.azulBrillante};
  border: 1px solid transparent;
  &:focus {
    border: 1px solid white;
  }

  background-color: ${ClearTheme.secondary.azulVerde};
  color: #ffffff;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
    color: #ffffff;
    border: 1px solid #494949;
    &::placeholder {
      color: #535353;
    }
    &:focus {
      border: 1px solid white;
    }
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;
export const Opciones = styled.option`
  border: none;

  background-color: ${ClearTheme.secondary.azulVerdeOsc};
  color: white;
  &.celda {
    color: black;
    border-radius: 0;
    border: none;
    border: 1px solid gray;
    background-color: transparent;
  }
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
    color: white;
  }
  &:focus {
    border: 1px solid white;
  }
  &:disabled {
    color: #6b6b6b;
    background-color: aliceblue;
    border: 2px solid blue;
  }
  &.disabled {
    color: #1f0d0d;
    border: 2px solid blue;
    background-color: #b8b8b8;
  }
`;
