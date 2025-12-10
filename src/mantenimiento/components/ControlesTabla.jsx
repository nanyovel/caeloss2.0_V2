import React from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { OpcionUnica } from "../../components/OpcionUnica";
import { BotonQuery } from "../../components/BotonQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassArrowRight } from "@fortawesome/free-solid-svg-icons";
import { Tema, Theme } from "../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
} from "../../components/InputGeneral";

export const ControlesTablas = ({
  controles,
  titulo,
  tipo,
  // Filtros
  valueSearch,
  valueStatus,
  valueTipo,
  valueMiSolicitud,
  handleFiltros,
  handleControles,
}) => {
  return (
    <Container>
      {/* <BotonQuery controles={controles} /> */}
      <TituloEncabezadoTabla>{titulo}</TituloEncabezadoTabla>
      <ContenedorInputTextMenuDesplegable className={tipo}>
        {controles.search.active && (
          <ContenedorInputs className={tipo}>
            <TituloBuscar>{controles.search.nombre}</TituloBuscar>
            <InputBuscar
              onChange={(e) => handleFiltros(e)}
              value={valueSearch}
              name={controles.search.name}
              className={tipo + " clearModern"}
              autoComplete="off"
            />
          </ContenedorInputs>
        )}
        {controles?.menuDesplegable?.length > 0 &&
          controles.menuDesplegable.map((menuDes, index) => {
            return (
              <ContenedorInputs className={tipo} key={index}>
                <TituloBuscar>{menuDes.nombre}</TituloBuscar>
                <MenuDesplegable2
                  onChange={(e) => handleFiltros(e)}
                  // value={menuDes.state}
                  name={menuDes.name}
                  className={tipo + " clearModern"}
                  autoComplete="off"
                >
                  {menuDes.opciones.map((opc, index) => {
                    return (
                      <Opciones
                        key={index}
                        value={opc.stringValue ? opc.descripcion : index}
                        // selected={opc.select}
                        disabled={opc.disabled}
                      >
                        {opc.descripcion}
                      </Opciones>
                    );
                  })}
                </MenuDesplegable2>
              </ContenedorInputs>
            );
          })}

        {controles?.opcionesUnicas && (
          <OpcionUnica
            titulo=""
            name={controles.opcionesUnicas.name}
            arrayOpciones={valueMiSolicitud}
            handleOpciones={(e) => handleFiltros(e)}
            hasControles={true}
          />
        )}
        {/* <ContenedorInputs className="btns"> */}
        {controles.btns &&
          controles.btns.map((btn, index) => {
            return (
              <BtnNormal
                key={index}
                className={`${btn.tipo + " "}  ${btn.disabled ? " disabled " : ""} 
                    ${btn.disabled ? " disabled " : ""} 
                  `}
                onClick={(e) => handleControles(e)}
                name={btn.tipo}
              >
                {btn.icono && (
                  <Icono
                    data-name="asdda"
                    // onClick={(e) => e.stopPropagation()}
                    icon={faMagnifyingGlassArrowRight}
                  />
                )}
                {btn.texto}
              </BtnNormal>
            );
          })}
        {/* </ContenedorInputs> */}
      </ContenedorInputTextMenuDesplegable>
    </Container>
  );
};

const Container = styled.div`
  background-color: ${Theme.primary.azulBrillante};
  width: 100%;
  /* border: 2px solid blue; */
  padding: 5px;
  padding-left: 10px;
`;
const TituloEncabezadoTabla = styled.h2`
  /* color: ${Tema.neutral.blancoHueso}; */
  color: black;
  font-size: 1.2rem;
  font-weight: normal;
  text-decoration: underline;
`;

const ContenedorInputTextMenuDesplegable = styled.div`
  display: flex;
  align-items: center;
  /* border: 1px solid red; */
`;

const ContenedorInputs = styled.div`
  border-radius: 5px;
  margin-right: 10px;
  display: flex;
  flex-direction: column;
  height: 40px;
  &.btns {
    display: flex;
    align-items: end;
    justify-content: end;
    flex-direction: row;
    gap: 10px;
  }
`;

const TituloBuscar = styled.h2`
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

  color: white;
`;

const InputBuscar = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 25px;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.primary.azulBrillante};
  width: 150px;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;
const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  border: 1px solid ${Tema.secondary.azulOpaco};
  border-radius: 4px;
  background-color: ${Tema.secondary.azulGraciel};
  height: 25px;
  width: 150px;
  color: ${Tema.primary.azulBrillante};
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: inherit;
    color: inherit;
  }
`;

const Opciones = styled.option`
  border: none;
  background-color: ${Tema.secondary.azulProfundo};
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 5px;
  height: 25px;
  padding: 0;
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;

const BtnNormal = styled(BtnGeneralButton)`
  position: relative;
  top: 8px;
  white-space: nowrap;
  margin: 0;
  margin-right: 5px;
  width: auto;
  &.btnEliminar {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
  }

  &.btnDesactivar {
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    cursor: default;
    &:hover {
      /* color: red; */
      color: white;
      background-color: ${Tema.primary.grisNatural};
    }
  }
`;
