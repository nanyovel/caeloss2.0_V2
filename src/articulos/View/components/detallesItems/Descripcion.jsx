import React, { Fragment } from "react";
import styled from "styled-components";
import { Tema } from "../../../../config/theme";

export default function Descripcion({ productMaster }) {
  return (
    <Container>
      {productMaster.textosDetalles.map((parrafo, index) => {
        return (
          <Fragment key={index}>
            <Parrafo>{parrafo}</Parrafo>
          </Fragment>
        );
      })}
    </Container>
  );
}
const Container = styled.div`
  min-height: 40px;
  /* padding: 0 25px; */
`;

const Parrafo = styled.p`
  color: ${Tema.neutral.blancoHueso};
  font-size: 1.2rem;
  margin-bottom: 15px;
`;
const Titulo = styled.h2`
  /* text-decoration: underline; */
  color: ${Tema.neutral.blancoHueso};
  border-bottom: 2px solid;
`;
const Subtitulo = styled.h3`
  color: ${Tema.neutral.blancoHueso};
  text-decoration: underline;
`;
const CajaDatosAdicional = styled.div`
  padding-left: 15px;
`;
