import React from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";

export default function Caracteristicas() {
  return (
    <Container>
      <Lista>
        <Elemento>
          Exelente solución para áreas en contacto directo con agua.
        </Elemento>
        <Elemento>Se puede usar en interiores y exteriores.</Elemento>
        <Elemento>Incombustible.</Elemento>
        <Elemento>Resistente al moho.</Elemento>
        <Elemento>Fácil de cortar y atornillar.</Elemento>
        <Elemento>
          No sufre deterioro, degradación, deformación, deslaminado, ni se
          desintegra al exponerlo al contacto directo con agua por tiempo
          prolongado.
        </Elemento>
        <Elemento>
          Presenta una de sus caras rugosa para la mejor aplicación de compuesto
          o adhesivo para losetas.
        </Elemento>
        <Elemento>Instalación rápida que acelera la productividad.</Elemento>
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
