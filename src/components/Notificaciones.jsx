import React from "react";
import styled from "styled-components";
import { Tema } from "../config/theme";

export default function Notificaciones({ texto, setHasNotification }) {
  return (
    <Container>
      <Texto>{texto}</Texto>
      <Xcerrar onClick={() => setHasNotification(false)}>❌</Xcerrar>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 50px;
  color: ${Tema.primary.azulBrillante};
  background-color: ${Tema.secondary.azulProfundo};
  border: 1px solid ${Tema.complementary.warning};
  position: relative;
`;
const Texto = styled.p`
  padding: 5px;
`;
const Xcerrar = styled.p`
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translate(0, -50%);
  border: 1px solid ${Tema.complementary.warning};
  padding: 2px;
  border-radius: 4px;
  cursor: pointer;
`;
