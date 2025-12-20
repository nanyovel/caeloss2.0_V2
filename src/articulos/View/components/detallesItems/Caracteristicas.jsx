import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../../../config/theme";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../../components/InputGeneral";

export default function Caracteristicas({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const handleInputs = (e) => {
    const dataIndex = e.target.dataset.index;
    const { value } = e.target;
    const caracteristicasUp = productEditable.caracteristicas.map(
      (texto, index) => {
        if (index == dataIndex) {
          return value;
        }
        return texto;
      }
    );

    setProductoEditable({
      ...productEditable,
      caracteristicas: caracteristicasUp,
    });
  };
  const addParrafo = () => {
    setProductoEditable({
      ...productEditable,
      caracteristicas: [...productEditable.caracteristicas, ""],
    });
  };
  const removeParrafo = () => {
    setProductoEditable({
      ...productEditable,
      caracteristicas: productEditable.caracteristicas.slice(0, -1),
    });
  };
  return (
    <Container>
      {modoEditar ? (
        <>
          <Lista>
            {productEditable.caracteristicas.map((caract, index) => {
              return (
                <Elemento key={index}>
                  <InputSimple
                    onChange={(e) => handleInputs(e)}
                    data-index={index}
                    value={caract}
                  />
                </Elemento>
              );
            })}
          </Lista>
          <CajaBtn>
            <BtnGeneralButton onClick={() => removeParrafo()}>
              -
            </BtnGeneralButton>
            <BtnGeneralButton onClick={() => addParrafo()}>+</BtnGeneralButton>
          </CajaBtn>
        </>
      ) : (
        <Lista>
          {productMaster.caracteristicas.map((caract, index) => {
            return <Elemento key={index}>{caract}</Elemento>;
          })}
        </Lista>
      )}
    </Container>
  );
}

const Container = styled.div``;

const Lista = styled.ul`
  color: ${ClearTheme.neutral.blancoCalido};
  color: ${ClearTheme.neutral.blancoCalido};
  padding-left: 15px;
  font-size: 1.2rem;
`;
const Elemento = styled.li``;
const CajaBtn = styled.div``;
const InputSimple = styled(InputSimpleEditable)``;
