import styled from "styled-components";
import { CSSLoader } from "./CSSLoader";
import { useAuth } from "../context/AuthContext";
import { useEffect, useState } from "react";

export const ModalLoading = () => {
  const { config, setConfig } = useAuth();
  const [anchoAgrandable, setAnchoAgrandable] = useState();
  useEffect(() => {
    if (config?.contenedorMaster?.ancho == "width1100") {
      setAnchoAgrandable("anchoFull");
    }
  }, [config]);
  return (
    <Container className={anchoAgrandable}>
      <CSSLoader />
    </Container>
  );
};

const Container = styled.div`
  width: 900px;
  &.anchoFull {
    width: 1100px;
  }
  height: 100vh;
  background-color: #000000af;
  backdrop-filter: blur(1px);
  position: fixed;
  top: 0;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 3;
  &.imcompleta {
    background-color: transparent;
    height: 100%;
    backdrop-filter: blur(0px);
  }
`;
