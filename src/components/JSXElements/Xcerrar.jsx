import React from "react";
import styled from "styled-components";

export default function Xcerrar({ ejecutarOnclick }) {
  return <Parrafo onClick={() => ejecutarOnclick()}>❌</Parrafo>;
}
const Parrafo = styled.p`
  border: 1px solid white;
  padding: 4px;
  cursor: pointer;
  transition: ease all 0.2s;
  background-color: #35242484;
  &:hover {
    background-color: #000000;
    border: 1px solid white;
  }
`;
