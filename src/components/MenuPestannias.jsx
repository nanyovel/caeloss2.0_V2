import React from "react";
import { ClearTheme, Tema, Theme } from "../config/theme";
import styled from "styled-components";

import imgArrowRight from "./../../public/img/arrowRight2.png";
import { Fragment } from "react";

export default function MenuPestannias({
  arrayOpciones,
  handlePestannias,
  ciclo,
}) {
  return (
    <CajaBarraOpciones className={Theme.config.modoClear ? "clearModern" : ""}>
      <ListaOpciones>
        {arrayOpciones.map((opciones, index) => {
          return (
            <Fragment key={index}>
              <OpcionLI
                key={index}
                // name={opciones.nombre}
                className={opciones.select ? " selected " : ""}
              >
                <AnchorText
                  data-id={index}
                  data-key={opciones.key}
                  data-code={opciones.code}
                  name={opciones.nombre}
                  title={opciones.title}
                  onClick={(e) => handlePestannias(e)}
                >
                  {opciones.nombre}
                </AnchorText>
              </OpcionLI>
              {ciclo == true && index < arrayOpciones.length - 1 ? (
                <ImgSimple src={imgArrowRight} />
              ) : null}
            </Fragment>
          );
        })}
      </ListaOpciones>
    </CajaBarraOpciones>
  );
}

const CajaBarraOpciones = styled.div`
  color: ${Tema.neutral.blancoHueso};
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  border-color: #e8e8e8;
  &.clearModern {
    color: white;
  }
`;
const ListaOpciones = styled.ul`
  display: flex;
  list-style: none;
  overflow-x: auto;
`;
const OpcionLI = styled.li`
  font-size: 1.1rem;
  margin-right: 3px;
  padding: 6px;
  border-bottom: 4px solid transparent;
  &.selected {
    border-bottom-color: ${Tema.primary.azulBrillante};
    color: ${Tema.primary.azulBrillante};
  }
`;
const AnchorText = styled.a`
  cursor: pointer;

  padding: 4px;
  &:hover {
    color: ${Tema.neutral.blancoHueso};
  }
`;
const ImgSimple = styled.img`
  width: 15px;
  object-fit: contain;
`;
