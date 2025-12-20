import styled from "styled-components";
import { ClearTheme, Tema } from "../../../../config/theme";
export default function Item({ producto }) {
  return (
    <Container title={producto.head.descripcion}>
      <CajaImg>
        <Img src={producto.head.imagenDestacada} />
      </CajaImg>
      <CajaTitulo>
        <Codigo>{producto.head.codigo}</Codigo>
        <Descripcion>{producto.head.descripcion}</Descripcion>
      </CajaTitulo>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  height: 100%;
  cursor: pointer;
  border: 1px solid transparent;
  transition: ease border 0.2s;
  transition: ease transform 0.2s;
  &:hover {
    box-shadow: ${Tema.config.sombra};
    transform: scale(1.1);
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const CajaImg = styled.div`
  height: 60%;
  display: flex;
  justify-content: center;
  width: 100%;
`;
const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: contain;
`;
const CajaTitulo = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px;
`;
const Codigo = styled.h3`
  color: ${Tema.primary.grisNatural};
  color: ${ClearTheme.neutral.blancoCalido};
  font-weight: 400;
  width: 100%;
  text-align: center;
`;
const Descripcion = styled.h2`
  color: ${Tema.primary.azulBrillante};
  color: ${ClearTheme.neutral.blancoCalido};
  font-weight: 400;
  font-size: 1rem;
  width: 100%;
  text-align: center;
  white-space: nowrap;
  text-overflow: ellipsis;
  overflow: hidden;
`;
