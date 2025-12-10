import React, { useState } from "react";
import styled from "styled-components";

import { BotonQuery } from "./BotonQuery";
import { BtnGeneralButton } from "./BtnGeneralButton";
import { Alerta } from "./Alerta";
import { Tema } from "../config/theme";

export default function ReturnJSON({ collection }) {
  // Convertir el array a una cadena JSON con formato
  const jsonData = JSON.stringify(collection, null, 2); // El `null, 2` es para dar formato bonito

  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const copiarPortaPapeles = () => {
    navigator.clipboard.writeText(jsonData);

    setMensajeAlerta("Texto copiado!");
    setTipoAlerta("success");
    setDispatchAlerta(true);
    setTimeout(() => setDispatchAlerta(false), 3000);
  };

  return (
    <Container>
      <BotonQuery jsonData={jsonData} />
      <BtnSimple onClick={() => copiarPortaPapeles()}>Copiar</BtnSimple>
      <CajaInterna>
        <pre>{jsonData}</pre>
      </CajaInterna>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
}
const BtnSimple = styled(BtnGeneralButton)`
  width: 100px;
  height: 40px;
`;
const Container = styled.div`
  background-color: transparent;
  border: 2px solid red;
  width: 100%;
  height: 1000px;
  position: relative;
  display: flex;
  justify-content: center;
`;
const CajaInterna = styled.div`
  width: 700px;
  height: 800px;
  border: 1px solid red;
  position: absolute;
  margin-top: 100px;
  /* left: 100%; */
  /* transform: translate(-100%, 0); */
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.primary.azulBrillante};
  border: 1px solid ${Tema.primary.azulBrillante};
  padding: 10px;
  border-radius: 10px;
  overflow: auto;
`;
