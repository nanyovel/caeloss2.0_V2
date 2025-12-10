import React from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { PlantillaCorreoAbierta } from "../libs/PlantillasCorreo/PlantillaCorreoAbierta";
import { FuncionEnviarCorreo } from "../libs/FuncionEnviarCorreo";

export default function EnviarCorreo({ dbUsuario }) {
  const enviarCorreoGeneral = () => {
    // const destinos = dbUsuario.map((user) => user.correo);

    return;
    const mensaje = PlantillaCorreoAbierta();
    // console.log(mensaje);
    FuncionEnviarCorreo({
      para: "jperez@cielosacusticos.com",
      // para: correos,
      asunto: "✅ Actualizacion TMS",
      mensaje: mensaje,
    });
  };
  return (
    <Container>
      <BtnSimple onClick={() => enviarCorreoGeneral()}>Enviar correo</BtnSimple>
    </Container>
  );
}
const Container = styled.div`
  background-color: bisque;
`;

const BtnSimple = styled(BtnGeneralButton)``;
