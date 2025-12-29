import React from "react";
import styled from "styled-components";
import { TodosLosCorreosCielosDB } from "../components/corporativo/TodosLosCorreosCielosDB";

export default function CopiarCorreos() {
  const correosGmail = TodosLosCorreosCielosDB.map((item) => item.correo.trim())
    .filter(Boolean)
    .join(", ");

  console.log(correosGmail);

  return <Container>CopiarCorreos</Container>;
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
  border: 1px solid red;
`;
