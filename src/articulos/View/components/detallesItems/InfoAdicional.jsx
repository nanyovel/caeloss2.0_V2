import React from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";

export default function InfoAdicional() {
  return (
    <Container>
      <CajaDatosAdicional>
        <Subtitulo>Instalacion:</Subtitulo>
        <Parrafo>
          Los tableros de cemento se instalan sobre bastidores metálicos, tanto
          en muros como en sistemas de cielo raso.
        </Parrafo>
        <Parrafo>
          Diseñado para cargas positivas o negativas uniformes de hasta 293
          kg/m2 (60 psf).
        </Parrafo>
      </CajaDatosAdicional>
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
