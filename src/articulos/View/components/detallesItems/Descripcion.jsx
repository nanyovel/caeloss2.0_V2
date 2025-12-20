import React, { Fragment } from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../../../../config/theme";
import { TextArea } from "../../../../components/InputGeneral";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";

export default function Descripcion({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const handleInputs = (e) => {
    const dataIndex = e.target.dataset.index;
    const { value } = e.target;
    const textoDescripUp = productEditable.textosDetalles.map(
      (texto, index) => {
        if (index == dataIndex) {
          return value;
        }
        return texto;
      }
    );

    setProductoEditable({
      ...productEditable,
      textosDetalles: textoDescripUp,
    });
  };

  const addParrafo = () => {
    setProductoEditable({
      ...productEditable,
      textosDetalles: [...productEditable.textosDetalles, ""],
    });
  };
  const removeParrafo = () => {
    setProductoEditable({
      ...productEditable,
      textosDetalles: productEditable.textosDetalles.slice(0, -1),
    });
  };
  return (
    <Container>
      {modoEditar ? (
        <>
          {productEditable.textosDetalles.map((parrafo, index) => {
            return (
              <Fragment key={index}>
                {
                  <TextArea2
                    onChange={(e) => handleInputs(e)}
                    data-index={index}
                    value={parrafo}
                  />
                }
              </Fragment>
            );
          })}
          <CajaBtn>
            <BtnGeneralButton onClick={() => removeParrafo()}>
              -
            </BtnGeneralButton>
            <BtnGeneralButton onClick={() => addParrafo()}>+</BtnGeneralButton>
          </CajaBtn>
        </>
      ) : (
        productMaster.textosDetalles.map((parrafo, index) => {
          return (
            <Fragment key={index}>{<Parrafo>{parrafo}</Parrafo>}</Fragment>
          );
        })
      )}
    </Container>
  );
}
const Container = styled.div`
  min-height: 40px;
  /* padding: 0 25px; */
`;

const Parrafo = styled.p`
  color: ${ClearTheme.neutral.blancoCalido};
  /* color: #e7e3e3; */
  font-size: 1.2rem;
  margin-bottom: 15px;
`;
const TextArea2 = styled(TextArea)``;
const CajaBtn = styled.div``;
//
//
//
//
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
