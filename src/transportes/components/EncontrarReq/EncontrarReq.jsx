import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { useAuth } from "../../../context/AuthContext";

import MenuPestannias from "../../../components/MenuPestannias";
import EncontrarReqKeyWord from "./EncontrarReqKeyWord";

import { ClearTheme, Tema, Theme } from "../../../config/theme";
import { Alerta } from "../../../components/Alerta";
import EncontrarMisReq from "./EncontrarMisReq";
import EncontrarViewDraft from "./EncontrarViewDraft";

export default function EncontrarReq({
  hasEncontrar,
  setHasEncontrar,
  userMaster,
}) {
  // *************** CONFIG GENERAL *******************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  // ********** FUNCIONES ESPECIFICAS **********

  const cerrarVentana = (e) => {
    const nameData = e.target.dataset.name;
    if (nameData == "cerrar") {
      setHasEncontrar(false);
    }
  };

  // ********** OPCIONES MENU SUPERIOR **********
  const opcionesInitial = [
    {
      nombre: "Keyword",
      select: true,
    },
    {
      nombre: "Mis solicitudes",
      select: false,
    },
  ];
  const [arrayOpciones, setArrayOpciones] = useState([...opcionesInitial]);
  const hasPermiso = userMaster.permisos.includes("accessReqDraft");
  useEffect(() => {
    if (hasPermiso) {
      const permisoDrafReq = {
        nombre: "Draft",
        select: false,
      };
      setArrayOpciones([...opcionesInitial, permisoDrafReq]);
    }
  }, [userMaster]);

  const handlePestannias2 = (e) => {
    let index = Number(e.target.dataset.id);
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  return (
    <Container>
      <CajaModal className={Theme.config.modoClear ? "clearModern" : ""}>
        <BarraTituloCerrar
          className={Theme.config.modoClear ? "clearModern" : ""}
        >
          <TituloChange>Encontrar solicitud</TituloChange>
          <XCerrarChange data-name="cerrar" onClick={(e) => cerrarVentana(e)}>
            ❌
          </XCerrarChange>
        </BarraTituloCerrar>{" "}
        <CajaSubWrapInternal>
          <MenuPestannias
            arrayOpciones={arrayOpciones}
            handlePestannias={handlePestannias2}
          />

          {arrayOpciones.find((opcion) => opcion.select).nombre ==
            "Keyword" && <EncontrarReqKeyWord arrayOpciones={arrayOpciones} />}

          {arrayOpciones.find((opcion) => opcion.select).nombre ==
            "Mis solicitudes" && (
            <EncontrarMisReq
              arrayOpciones={arrayOpciones}
              userMaster={userMaster}
            />
          )}

          {arrayOpciones.find((opcion) => opcion.select).nombre == "Draft" &&
            hasPermiso && (
              <EncontrarViewDraft
                arrayOpciones={arrayOpciones}
                userMaster={userMaster}
              />
            )}
        </CajaSubWrapInternal>
      </CajaModal>
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  position: absolute;
  top: 0;
  background-color: #000000c1;
  display: flex;
  justify-content: center;
  /* border: 1px solid red; */
  height: 100vh;
`;
const CajaModal = styled.div`
  width: 700px;
  /* min-height: 450px; */
  position: fixed;
  /* top: 200px; */
  border-radius: 10px;
  border: 1px solid ${Tema.primary.azulBrillante};
  overflow: hidden;
  background-color: ${Tema.secondary.azulOscuro2};
  z-index: 50;
  /* border: 1px solid black; */
  border-radius: 0 0 10px 10px;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(15px);
    color: white;
    border: 1px solid white;
  }
`;

const BarraTituloCerrar = styled.div`
  height: 30px;
  border: 1px solid ${Tema.primary.grisNatural};
  background-color: ${Tema.neutral.neutral600};
  overflow: hidden;
  display: flex;
  height: 10%;
  position: relative;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerde};
    backdrop-filter: blur(15px);
    color: white;
  }
`;
const TituloChange = styled.h2`
  color: inherit;
  width: 100%;
  text-align: center;
  vertical-align: 1.4rem;
  font-size: 1.4rem;

  align-content: center;
`;
const XCerrarChange = styled.p`
  width: 10%;
  height: 100%;
  align-content: center;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid black;
  position: absolute;
  right: 0;
  &:hover {
    cursor: pointer;
    border-radius: 5px;
    transition: ease 0.1s;
    border: 1px solid white;
  }
`;
const CajaSubWrapInternal = styled.div`
  border: 1px solid black;
  width: 100%;
  padding: 5px;

  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 5px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  /* background-color: ${Tema.secondary.azulProfundo}; */
  border: none;
  min-height: 300px;
  overflow: auto;
  height: 400px;
`;
