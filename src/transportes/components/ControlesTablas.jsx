import React from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { OpcionUnica } from "../../components/OpcionUnica";
import { BotonQuery } from "../../components/BotonQuery";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlassArrowRight } from "@fortawesome/free-solid-svg-icons";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
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
    <Container className={Theme.config.modoClear ? "clearModern" : ""}>
      {/* <TituloEncabezadoTabla
        className={Theme.config.modoClear ? "clearModern" : ""}
      >
        {titulo}
      </TituloEncabezadoTabla> */}
      <ContenedorInputTextMenuDesplegable
        className={`
        ${tipo}
        `}
      >
        {controles.search.active && (
          <ContenedorInputs
            className={`
            ${tipo}
            `}
          >
            <TituloBuscar
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              {controles.search.nombre}
            </TituloBuscar>
            <InputBuscar
              onChange={(e) => handleFiltros(e)}
              placeholder="Buscar"
              value={valueSearch}
              name={controles.search.name}
              className={`
                ${Theme.config.modoClear ? "clearModern" : ""}
                ${tipo}
                `}
              autoComplete="off"
            />
          </ContenedorInputs>
        )}
        {controles?.menuDesplegable?.length > 0 &&
          controles.menuDesplegable.map((menuDes, index) => {
            return (
              <ContenedorInputs className={tipo} key={index}>
                <TituloBuscar
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  {menuDes.nombre}
                </TituloBuscar>
                <MenuDesplegable2
                  onChange={(e) => handleFiltros(e)}
                  // value={menuDes.state}
                  name={menuDes.name}
                  className={`
                    ${Theme.config.modoClear ? "clearModern" : ""}
                    ${tipo}
                    `}
                  autoComplete="off"
                >
                  {menuDes.opciones.map((opc, index) => {
                    return (
                      <Opciones2
                        className={`
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        ${tipo}
                        `}
                        key={index}
                        value={opc.stringValue ? opc.descripcion : opc.opcion}
                        // selected={opc.select}
                        disabled={opc.disabled}
                      >
                        {opc.descripcion}
                      </Opciones2>
                    );
                  })}
                </MenuDesplegable2>
              </ContenedorInputs>
            );
          })}

        {/* {controles?.opcionesUnicas && (
          <OpcionUnica
            titulo=""
            name={controles.opcionesUnicas.name}
            arrayOpciones={valueMiSolicitud}
            handleOpciones={(e) => handleFiltros(e)}
            hasControles={true}
          />
        )} */}
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
                  <Icono data-name="asdda" icon={faMagnifyingGlassArrowRight} />
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
  background-color: ${Tema.secondary.azulProfundo};
  width: 100%;
  /* border: 2px solid blue; */
  padding: 5px;
  padding-left: 10px;
  height: auto;
  &.clearModern {
    background-color: ${ClearTheme.primary.azulBrillante};
    border-top: 1px solid white;
    border-bottom: 1px solid white;
  }
`;
const TituloEncabezadoTabla = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  font-size: 1.2rem;
  font-weight: normal;
  &.clearModern {
    color: ${ClearTheme.complementary.azulStatic};
    color: black;
    text-decoration: underline;
  }
`;

const ContenedorInputTextMenuDesplegable = styled.div`
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  /* border: 1px solid red; */
`;

const ContenedorInputs = styled.div`
  background-color: inherit;
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
  @media screen and (max-width: 800px) {
    height: auto;
    margin-bottom: 4px;
    border: 1px solid gray;
    padding: 3px;
  }
`;

const TituloBuscar = styled.h2`
  font-size: 1rem;
  display: inline-block;
  margin-right: 4px;

  color: ${Tema.neutral.blancoHueso};
  &.clearModern {
    color: white;
    font-weight: 400;
  }
`;

const InputBuscar = styled(InputSimpleEditable)`
  height: 25px;
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

const Opciones2 = styled(Opciones)`
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
  @media screen and (max-width: 800px) {
    position: static;
    top: 8px;
  }
`;
