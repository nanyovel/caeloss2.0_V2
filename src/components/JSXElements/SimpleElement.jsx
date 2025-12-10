import styled from "styled-components";
import { ClearTheme } from "../../config/theme";

export const WrapSeccion = styled.div`
  width: 100%;
`;

export const TituloSeccion = styled.h2`
  text-decoration: underline;
  width: 100%;
  text-align: start;
  color: white;
  margin-bottom: 10px;
`;
export const ContainerSeccion = styled.div`
  position: relative;
  border-radius: 10px;
  display: flex;
  justify-content: center;

  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);
  border: 1px solid white;
  color: white;
`;
