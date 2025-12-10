import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema } from "../config/theme";
import { BtnNormal } from "./BtnNormal";

export default function Advertencia2({
  mensaje,
  tipo,
  setDispatchAdvertencia,
  accionAceptar,
  ocultarBtnCancelar,
}) {
  return (
    <Container>
      <CajaContenido className={tipo}>
        <CajaInterna>
          <Texto>{mensaje} </Texto>
        </CajaInterna>
        <CajaInterna>
          <BtnNormal className="normal" onClick={(e) => accionAceptar(e)}>
            Aceptar
          </BtnNormal>
          {!ocultarBtnCancelar && (
            <BtnNormal
              className="danger"
              onClick={() => setDispatchAdvertencia(false)}
            >
              Cancelar
            </BtnNormal>
          )}
        </CajaInterna>
      </CajaContenido>
    </Container>
  );
}
const Container = styled.div`
  position: fixed;
  height: 100vh;
  width: 100%;
  left: 0;
  z-index: 100;
  background-color: #000000ce;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const CajaContenido = styled.div`
  display: flex;
  width: 500px;
  min-height: 150px;
  border: 1px solid aliceblue;
  flex-direction: column;
  align-items: center;
  border-radius: 0.31rem; /* 5px */
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(15px);
  color: white;
  &.error {
    background: ${Tema.complementary.danger};
    color: black;
  }
  &.warning {
    background: ${Tema.complementary.warning};
    color: #000;
  }
  &.success {
    background: ${Tema.complementary.success};
  }
  &.info {
    background: ${Tema.complementary.info};
  }
`;
const CajaInterna = styled.div``;
const Texto = styled.p`
  /* background: ${Tema.complementary.warning}; */
  padding: 1.25rem 2.5rem; /* 20px 40px */
  box-shadow: 0px 0px 15px rgba(0, 0, 0, 0.1);
  text-align: center;
  display: flex;
  flex-direction: column;
`;
