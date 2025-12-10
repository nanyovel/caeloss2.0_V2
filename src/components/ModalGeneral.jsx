import React from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../config/theme";

export default function ModalGeneral({
  children,
  titulo,
  setHasModal,
  childrenFooter,
}) {
  return (
    <ContenedorChangeState>
      <CajaModal>
        <CajaTitulo>
          <Titulo>{titulo}</Titulo>
          <Xcerrar onClick={() => setHasModal(false)}>❌</Xcerrar>
        </CajaTitulo>
        <CajaContenido className={childrenFooter ? "conBtnFinales" : ""}>
          {children}
        </CajaContenido>
        {childrenFooter && <CajaBtnFinal>{childrenFooter}</CajaBtnFinal>}
      </CajaModal>
    </ContenedorChangeState>
  );
}
const ContenedorChangeState = styled.div`
  width: 100%;
  height: 100%;
  min-height: 300px;
  position: absolute;
  background-color: #000000c7;
  top: 0;
  z-index: 2;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaModal = styled.div`
  width: 800px;
  border-radius: 10px;

  min-height: 350px;
  height: 350px;
  /* max-height: 400px; */
  position: fixed;
  top: 150px;
  overflow: hidden;
  border: 1px solid white;
  background-color: #4643ffcc;
  background-color: ${ClearTheme.secondary.AzulOscSemiTransp};

  @media screen and (max-width: 1000px) {
    left: 70px;
    width: 85%;
  }
  @media screen and (max-width: 620px) {
    left: 10px;
    width: 95%;
    margin: auto;
  }
`;
const CajaTitulo = styled.div`
  border: 1px solid ${ClearTheme.neutral.neutral550};
  min-height: 40px;
  display: flex;
  align-items: center;
  position: relative;
`;
const Titulo = styled.h2`
  width: 95%;
  padding: 4px;
  font-size: 22px;

  font-weight: 400;
  text-align: center;
  color: ${Tema.primary.azulBrillante};
`;
const Xcerrar = styled.p`
  position: absolute;
  right: 5px;
  border: 1px solid red;
  padding: 6px;
  cursor: pointer;
  transition: all ease 0.2s;
  &:hover {
    border-color: white;
  }
`;
const CajaContenido = styled.div`
  width: 100%;
  height: calc(100% - 40px);
  &.conBtnFinales {
    height: calc(100% - 40px - 60px);
  }
  overflow-y: auto;
`;
const CajaBtnFinal = styled.div`
  height: 60px;
  width: 100%;
  display: flex;
  justify-content: center;
  border-top: 1px solid ${Theme.neutral.neutral500};
`;
