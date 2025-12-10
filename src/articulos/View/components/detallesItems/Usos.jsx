import React from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";

export default function Usos() {
  return (
    <Container>
      <Lista>
        <Elemento>Muros.</Elemento>
        <Elemento>Se puede usar en interiores y exteriores.</Elemento>
        <Elemento>Muros con acabado cerámico o pétreo.</Elemento>
        <Elemento>Cielos rasos.</Elemento>
        <Elemento>Elementos de fachada.</Elemento>
        <Elemento>Muros divisorios de baños.</Elemento>
        <Elemento>Cocinas industriales.</Elemento>
        <Elemento>Cuartos de lavado.</Elemento>
      </Lista>
    </Container>
  );
}

const Container = styled.div``;

const Lista = styled.ul`
  color: ${Tema.neutral.blancoHueso};
  padding-left: 15px;
  font-size: 1.2rem;
`;
const Elemento = styled.li``;
