import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../components/BtnGeneralButton";
import { Alerta } from "../components/Alerta";
import { Tema } from "../config/theme";

export default function MostrarJSON({ datos }) {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  console.log(datos);
  const copiarDatos = () => {
    const datosCopiar = JSON.stringify(datos, null, 2);
    navigator.clipboard.writeText(datosCopiar);
    setMensajeAlerta("Datos copiado.");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };
  return (
    <Container>
      <BtnSimple onClick={() => copiarDatos()}>Copiar datos</BtnSimple>
      <Texto>{JSON.stringify(datos, null, 2)}</Texto>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
}

const Container = styled.div`
  color: ${Tema.primary.azulBrillante};
`;

const Texto = styled.pre`
  color: ${Tema.primary.azulBrillante};
  /* text-overflow: ellipsis; */
  /* width: 300px; */
`;
const BtnSimple = styled(BtnGeneralButton)``;
