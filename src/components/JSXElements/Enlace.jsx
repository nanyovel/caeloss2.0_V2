import { NavLink } from "react-router-dom";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../config/theme";
import { Enlace } from "./GrupoTabla";

export const EnlacesPerfil = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  width: 100%;
  height: 100%;
  display: block;
  /* width: 70%; */
  /* border: 1px solid red; */
  transition: all ease 0.2s;
  border-radius: 10px;
  border: 1px solid transparent;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
    background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
    img {
      border: 3px solid ${ClearTheme.complementary.warning};
    }
    color: ${ClearTheme.complementary.warning};
    text-decoration: underline;
  }

  &.static {
    &:hover {
      cursor: auto;
      border: 1px solid transparent;
      background-color: transparent;
      img {
        border: 3px solid black;
      }
      color: white;
      text-decoration: underline;
      h2 {
      }
    }
  }
`;

export const EnlaceRRSS = styled(Enlace)`
  width: 60px;
  padding: 0 40px;
  font-weight: 400;
  min-height: 30px;
  border: 1px solid white;
  color: white;
  display: flex;
  align-items: center;
  font-size: 14px;
  justify-content: center;
  cursor: pointer;

  border-radius: 5px;
  &.caja-whatsapp {
    background-color: #25d366; /* Verde WhatsApp */
  }
  &.caja-llamar {
    background-color: #007bff; /* Azul */
  }
  &.caja-email {
    background-color: #224366; /* Azul */
  }
  &.caja-info {
    background-color: #1c7174; /* Azul */
  }
  @media screen and (max-width: 400px) {
    width: 70px;
    padding: 0 5px;
    min-height: 25px;
    font-size: 13px;
  }
`;
