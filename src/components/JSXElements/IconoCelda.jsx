import styled from "styled-components";
import { Theme } from "../../config/theme";

export default function IconoCelda({
  children,
  ejecucion,
  index,
  nombre,
  name,
}) {
  return (
    <IconoREDES
      data-index={index}
      data-nombre={nombre}
      name={name}
      onClick={ejecucion}
    >
      {children}
    </IconoREDES>
  );
}

const IconoREDES = styled.p`
  cursor: pointer;
  height: 100%;
  /* transition: all ease 0.1s; */
  align-content: center;
  &:hover {
    background-color: ${Theme.primary.azulBrillante};
  }
`;
