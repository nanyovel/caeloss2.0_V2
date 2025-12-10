import styled from "styled-components";
import { DetalleOrden } from "../view/DetalleOrden";

export const ListaOrdenCompra = ({ userMaster }) => {
  return (
    <>
      <Container>
        <DetalleOrden userMaster={userMaster} />
      </Container>
    </>
  );
};
const Container = styled.div`
  margin-bottom: 100px;
`;
