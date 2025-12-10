import styled from "styled-components";
import { ClearTheme } from "../../config/theme";

export default function ModalInfo({ setHasAviso, titulo, texto }) {
  return (
    <Container>
      <CajaInfo>
        <BarraHeader>
          <TituloHeader>Informacion</TituloHeader>
          <ParrafoX onClick={() => setHasAviso(false)}>❌</ParrafoX>
        </BarraHeader>
        <ContainerHijo>
          <TituloMensaje>{titulo}</TituloMensaje>
          <CajaTexto>
            <Parrafo>{texto}</Parrafo>
          </CajaTexto>
        </ContainerHijo>
      </CajaInfo>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100vh;
  top: 0;
  left: 0;
  position: fixed;
  background-color: #000000af;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CajaInfo = styled.div`
  width: 500px;
  height: 300px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  border: 1px solid white;
  backdrop-filter: blur(5px);
`;
const BarraHeader = styled.div`
  height: 50px;
  border: 1px solid white;
  position: relative;
`;
const TituloHeader = styled.h2`
  width: 100%;
  text-align: center;
  align-content: center;
  vertical-align: center;
  height: 100%;
  color: white;
`;
const ParrafoX = styled.p`
  position: absolute;
  right: 0;
  top: 50%;
  transform: translate(0, -50%);
  font-size: 1.5rem;
  border: 1px solid transparent;
  padding: 4px;
  &:hover {
    border: 1px solid red;
    cursor: pointer;
  }
`;
const ContainerHijo = styled.div``;
const TituloMensaje = styled.h2`
  width: 100%;
  color: white;
  text-decoration: underline;
  text-align: center;
  margin-top: 10px;
  font-weight: 400;
  font-size: 1.4rem;
  color: ${ClearTheme.complementary.warning};
`;
const CajaTexto = styled.div`
  width: 100%;
  padding: 6px;
`;
const Parrafo = styled.p`
  color: white;
`;
