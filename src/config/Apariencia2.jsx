import styled from "styled-components";
import { useAuth } from "../context/AuthContext";

import React from "react";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowsLeftRight,
  faArrowsLeftRightToLine,
} from "@fortawesome/free-solid-svg-icons";
import { ClearTheme } from "./theme";

export default function Apariencia2() {
  const { config, setConfig } = useAuth();

  return (
    <Icono
      icon={faArrowsLeftRightToLine}
      onClick={() =>
        setConfig({
          ...config,
          fullWidth: !config.fullWidth,
        })
      }
    />
  );
}

const Icono = styled(FontAwesomeIcon)`
  color: #000000;
  font-size: 18px;
  font-weight: 400;
  /* position: absolute; */
  /* right: 15px; */
  transition: all 0.4s ease;
  border: 1px solid black;
  padding: 5px;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #000000;
    color: ${ClearTheme.complementary.warning};
  }
`;
