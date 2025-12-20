import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../../../config/theme";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import { InputSimpleEditable } from "../../../../components/InputGeneral";

export default function Usos({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const handleInputs = (e) => {
    const dataIndex = e.target.dataset.index;
    const { value } = e.target;
    const usosUp = productEditable.usos.map((texto, index) => {
      if (index == dataIndex) {
        return value;
      }
      return texto;
    });

    setProductoEditable({
      ...productEditable,
      usos: usosUp,
    });
  };
  const addParrafo = () => {
    console.log("aaaaaa");
    setProductoEditable({
      ...productEditable,
      usos: [...productEditable.usos, ""],
    });
  };
  const removeParrafo = () => {
    setProductoEditable({
      ...productEditable,
      usos: productEditable.usos.slice(0, -1),
    });
  };
  return (
    <Container>
      {modoEditar ? (
        <>
          <Lista>
            {productEditable.usos.map((uso, index) => {
              return (
                <Elemento key={index}>
                  <InputSimple
                    onChange={(e) => handleInputs(e)}
                    data-index={index}
                    value={uso}
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
          {productMaster.usos.map((uso, index) => {
            return <Elemento key={index}>{uso}</Elemento>;
          })}
        </Lista>
      )}
    </Container>
  );
}

const Container = styled.div``;

const Lista = styled.ul`
  color: ${Tema.neutral.blancoHueso};
  color: ${ClearTheme.neutral.blancoCalido};
  padding-left: 15px;
  font-size: 1.2rem;
`;
const Elemento = styled.li``;
const InputSimple = styled(InputSimpleEditable)``;
const CajaBtn = styled.div``;
