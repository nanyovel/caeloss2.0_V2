import React from "react";
import styled from "styled-components";

import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Tema } from "../../../../config/theme";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";

export default function Controles({
  productMaster,
  activarEdicion,
  cancelarEdicion,
  modoEditar,
}) {
  console.log(productMaster);
  return (
    <Container>
      {modoEditar ? (
        <BtnSimple className="danger" onClick={() => cancelarEdicion()}>
          Cancelar
        </BtnSimple>
      ) : (
        <BtnSimple onClick={() => activarEdicion()}>Editar</BtnSimple>
      )}
      <ContenedorBuscar>
        <InputBuscar type="text" name="buscarDocInput" />
        <BtnSimple type="submit" onClick={() => buscarDoc()}>
          <Icono icon={faMagnifyingGlass} />
          Buscar
        </BtnSimple>
      </ContenedorBuscar>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 8px;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 0 ${Tema.config.paddingLateralCaja};
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 0;
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
`;

const Texto = styled.h2`
  color: inherit;
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;
`;
const InputBuscar = styled.input`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.primary.azulBrillante};
  margin-right: 5px;
`;

const ContenedorBuscar = styled.div`
  background-color: ${Tema.secondary.azulGraciel};
  display: inline-block;
  padding: 5px;
  /* padding: 0 4px; */
  margin: 4px;
  border-radius: 5px;
  color: ${Tema.primary.azulBrillante};
`;
