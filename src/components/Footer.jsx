import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../config/theme";

export default function Footer({ tipo }) {
  return (
    <>
      <Container
        className={`
        ${tipo == "home" ? "home" : ""}
      ${Tema.config.modoClear ? "clearModern" : ""}`}
      >
        Cielos Acústicos © 2025. Todos los derechos reservados.{" "}
        <TextoBible>Lucas 1:37</TextoBible>
      </Container>
    </>
  );
}
const Container = styled.div`
  width: 100%;
  padding: 14px;
  font-size: 14px;

  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.primary.azulBrillante};
  text-align: center;

  position: absolute;
  bottom: 0;

  &.home {
    position: static;
  }
  &.clearModern {
    background-color: #0e488f67;
    /* background-image: repeating-linear-gradient(-135deg, #0e488f, #609ce6 350px); */
    backdrop-filter: blur(4px);
    color: white;
    background-color: ${ClearTheme.primary.grisCielos};
  }
`;
const TextoBible = styled.p`
  display: inline;
  /* font-style: italic; */
`;
