import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { hoyManniana } from "../../libs/FechaFormat";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import AvatarMale from "./../../../public/img/avatares/avatarMale.png";
import AvatarFemale from "./../../../public/img/avatares/avatarFemale.png";
// import { CajaStatusComponent, StyleTextStateReq } from "./StyleTextStateReq";

import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import {
  StyleTextStateReq,
  CajaStatusComponent,
  StyleTextTypeReq,
} from "../libs/DiccionarioNumberString";
import { PlantillaCorreoReqState } from "../libs/PlantillaCorreoReqState";
import { AvatarPerfil } from "../../components/JSXElements/ImgJSX";

export const CardReq = ({
  request,
  dbUsuarios,
  handleEstados,
  numero,
  userMaster,
}) => {
  const [datosParseados, setDatosParseados] = useState(false);

  useEffect(() => {
    setDatosParseados(true);
  }, [dbUsuarios]);

  const [disabled, setDisabled] = useState(true);
  const titleInitial = {
    planificar: "",
    ejecutar: "",
    concluir: "",
    anular: "",
  };
  const [titleBoton, setTitleBoton] = useState({});

  useEffect(() => {
    let titleBtnAux = { ...titleInitial };
    let disabledAux = true;
    if (request.estadoDoc < 3) {
      disabledAux = false;
    }
    if (request.familia.parentesco == 1) {
      disabledAux = true;
      titleBtnAux = {
        ...titleInitial,
        planificar: "No puede cambiar estado a una solicitud hija.",
        ejecutar: "No puede cambiar estado a una solicitud hija.",
        concluir: "No puede cambiar estado a una solicitud hija.",
        anular: "No puede cambiar estado a una solicitud hija.",
      };
    }
    if (request.estadoDoc >= 3) {
      disabledAux = true;
      titleBtnAux = {
        ...titleInitial,
        planificar: "El estado de la solicitud no permite cambios.",
        ejecutar: "El estado de la solicitud no permite cambios.",
        concluir: "El estado de la solicitud no permite cambios.",
        anular: "El estado de la solicitud no permite cambios.",
      };
    }
    if (request.estadoDoc == -1) {
      const texto = "No puede cambiar estado a borradores.";
      disabledAux = true;
      titleBtnAux = {
        ...titleInitial,
        planificar: texto,
        ejecutar: texto,
        concluir: texto,
        anular: texto,
      };
    }
    setDisabled(disabledAux);
    setTitleBoton({ ...titleBtnAux });
  }, [request]);
  //
  //
  //
  const ejecutarFuncion = (e) => {
    if (disabled) {
      return;
    }
    handleEstados(e);
  };
  const anchoPantalla = window.screen.width;

  return (
    <Container
      className={`
      ${Theme.config.modoClear ? "clearModern" : ""}
      ${request.estadoDoc == 4 ? "cancelada" : ""}
      `}
    >
      <CajaInterna className="star">
        <EnlacesPerfil
          target="_blank"
          to={`/perfiles/${request.datosSolicitante.userName}`}
        >
          <WrapMain className="left">
            <CajaFotoMain>
              <NombreTexto>{numero + 1}</NombreTexto>
              <AvatarPerfil2
                className={`
                ${request.estadoDoc == 4 ? "cancelada" : ""}

                      ${request?.datosSolicitante?.genero}
                      xSmall
                `}
                src={
                  datosParseados
                    ? request.datosSolicitante.urlFotoPerfil
                      ? request.datosSolicitante.urlFotoPerfil
                      : request.datosSolicitante.genero == "femenino"
                        ? AvatarFemale
                        : AvatarMale
                    : ""
                }
              />
            </CajaFotoMain>

            <CajaNombre>
              <NombreTexto>
                {request.datosSolicitante.nombre}{" "}
                {request.datosSolicitante.apellido}
              </NombreTexto>
            </CajaNombre>
          </WrapMain>
        </EnlacesPerfil>
        {/*  */}
        {/*  */}
        {/*  */}
        <WrapMain className="right">
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq={"planificatedRequestTMS"}
          >
            {/* <BtnSimple
              title={titleBoton.planificar}
              name="planificar"
              data-id={request.id}
              onClick={() => {
                enviarCorreo(request);
              }}
            >
              Correo
            </BtnSimple> */}
            <BtnSimple
              title={titleBoton.planificar}
              name="planificar"
              data-id={request.id}
              disabled={disabled}
              className={disabled ? "cancelada" : ""}
              onClick={(e) => {
                ejecutarFuncion(e);
              }}
            >
              Planificar
            </BtnSimple>
          </ElementoPrivilegiado>

          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq={"runRequestTMS"}
          >
            <BtnSimple
              title={titleBoton.ejecutar}
              name="ejecutar"
              data-id={request.id}
              disabled={disabled}
              className={disabled ? "cancelada" : ""}
              onClick={(e) => {
                ejecutarFuncion(e);
              }}
            >
              Ejecutar
            </BtnSimple>{" "}
          </ElementoPrivilegiado>
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq={"terminateRequestTMS"}
          >
            <BtnSimple
              title={titleBoton.concluir}
              name="concluir"
              data-id={request.id}
              disabled={disabled}
              className={disabled ? "cancelada" : ""}
              onClick={(e) => {
                ejecutarFuncion(e);
              }}
            >
              Concluir
            </BtnSimple>{" "}
          </ElementoPrivilegiado>
          <ElementoPrivilegiado
            userMaster={userMaster}
            privilegioReq={"annularRequestTMS"}
          >
            <BtnSimple
              title={titleBoton.anular}
              name="cancelar"
              data-id={request.id}
              disabled={disabled}
              className={`danger ${disabled ? "cancelada" : ""}`}
              onClick={(e) => {
                ejecutarFuncion(e);
              }}
            >
              Anular
            </BtnSimple>
          </ElementoPrivilegiado>
        </WrapMain>
      </CajaInterna>

      <CajaInterna className="centro">
        <CajitaDetalle>
          <TituloDetalle>N° Solicitud*:</TituloDetalle>
          <DetalleTexto className="sinNoWrap">
            {StyleTextTypeReq[request.tipo].texto}
            {" - "}
            <Enlaces
              target="_blank"
              to={`maestros/solicitudes/${request.numeroDoc}`}
            >
              {request.numeroDoc}
            </Enlaces>
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Cliente:</TituloDetalle>
          <DetalleTexto title={request.datosReq.socioNegocio}>
            {request.tipo == 1
              ? request?.datosReq?.tipoTraslado[0]?.select == true
                ? // ? sucDestino
                  // : request.datosReq.socioNegocio
                  "Suc. " +
                    request.datosFlete.provinciaSeleccionada
                      .municipioSeleccionado.nombreSucursal || ""
                : request.datosReq.socioNegocio
              : request.datosReq.socioNegocio}
          </DetalleTexto>
        </CajitaDetalle>
        {/* <CajitaDetalle>
          <TituloDetalle>Tipo:</TituloDetalle>
          <DetalleTexto>
           {request.tipo == 0
              ? "Entrega"
              : request.tipo == 1
                ? `Traslado ${request.familia.parentesco == 0 ? " - Madre" : request.familia.parentesco == 1 ? " - Hija" : ""}`
                : request.tipo == 2
                  ? "Retiro en obra"
                  : request.tipo == 3
                    ? "Retiro proveedor"
                    : ""} 
          </DetalleTexto>
        </CajitaDetalle> */}

        <CajitaDetalle>
          <TituloDetalle className="nowrap">Punto de partida:</TituloDetalle>
          <DetalleTexto>
            {request.datosFlete.puntoPartidaSeleccionado.nombre}
          </DetalleTexto>
        </CajitaDetalle>
        <Detalle1Wrap>
          <Detalle2Titulo>Destino:</Detalle2Titulo>
          <Detalle3OutPut
            title={`
              ${
                request.datosFlete.modalidad[0].select
                  ? request.datosFlete.provinciaSeleccionada?.label +
                    " - " +
                    request.datosFlete.provinciaSeleccionada
                      ?.municipioSeleccionado.label
                  : request.datosFlete.distancia + "KM"
              } `}
          >
            {`
              ${
                request.datosFlete.modalidad[0].select
                  ? request.datosFlete.provinciaSeleccionada?.label +
                    " - " +
                    request.datosFlete.provinciaSeleccionada
                      ?.municipioSeleccionado.label
                  : request.datosFlete.distancia + "KM"
              } `}
          </Detalle3OutPut>
        </Detalle1Wrap>
        <Detalle1Wrap>
          <Detalle2Titulo>Fecha:</Detalle2Titulo>
          <Detalle3OutPut className="completa">
            {request.fechaReq.slice(0, 16) + request.fechaReq.slice(24, 26)}
          </Detalle3OutPut>
        </Detalle1Wrap>
        {/* <CajitaDetalle>
          <TituloDetalle>Chofer*:</TituloDetalle>
          <DetalleTexto>
            <Enlaces
              target="_blank"
              to={`maestros/choferes/${request?.datosEntrega?.chofer?.numeroDoc}`}
            >
              {request?.datosEntrega?.chofer?.nombre
                ? request?.datosEntrega?.chofer?.nombre
                : ""}{" "}
              {request?.datosEntrega?.chofer?.apellido
                ? request?.datosEntrega?.chofer?.apellido
                : ""}
            </Enlaces>
          </DetalleTexto>
        </CajitaDetalle> */}
      </CajaInterna>

      <CajaInterna className="end">
        <CajaStatus
          className={
            StyleTextStateReq.find((state) => state.numero == request.estadoDoc)
              ?.codigo || "defaultStateReq"
          }
        >
          <NombreTexto className="status">
            {StyleTextStateReq.find(
              (state) => state.numero == request.estadoDoc
            )?.texto || "defaultStateReq"}

            {request.estadoDoc == 1
              ? " - " + hoyManniana(request.current.fechaDespProg.slice(0, 10))
              : ""}
          </NombreTexto>
        </CajaStatus>
        <CajaParrafoDetalles>
          <ParrafoDetalles>{request.datosReq.detalles}</ParrafoDetalles>
        </CajaParrafoDetalles>
      </CajaInterna>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  /* height: 160px; */
  border-radius: 14px 0 14px 0;
  display: flex;

  background-color: ${ClearTheme.secondary.azulFrosting};
  border: 1px solid white;
  backdrop-filter: blur(15px);
  color: white;
  &.cancelada {
    color: black;
  }
  @media screen and (max-width: 900px) {
    flex-direction: column;
    height: auto;
    border: 2px solid ${ClearTheme.complementary.warning};
  }
`;

const CajaInterna = styled.div`
  /* min-height: 150px; */
  height: 140px;
  width: 30%;
  border: 2px solid ${Tema.neutral.blancoHueso};
  border: none;
  border-radius: 10px;
  padding: 5px;
  overflow: hidden;
  &.star {
    border: none;
    /* border: 1px solid red; */
    display: flex;
    padding: 0;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
  &.centro {
    border: 1px solid ${Tema.neutral.blancoHueso};
    width: 40%;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
  &.end {
    padding: 0;
    border-radius: 0;
    @media screen and (max-width: 900px) {
      width: 100%;
    }
  }
`;
const WrapMain = styled.div`
  border: 1px solid ${Tema.primary.grisNatural};
  &.left {
    width: 100%;
  }
  &.right {
    width: 30%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  font-size: 0.8rem;
  width: 90%;
  margin: 0;
  margin-bottom: 4px;
  min-width: 0;
  &.cancelada {
    background-color: ${Tema.primary.grisNatural};
    cursor: auto;
    &:hover {
      color: white;
      background-color: ${Tema.primary.grisNatural};
    }
  }
`;
const CajaFotoMain = styled.div`
  width: 100%;
  height: 35%;
  display: flex;
  justify-content: center;
  padding-top: 15px;
  /* background-color: blue; */
  /* border: 1px solid ${Tema.primary.azulBrillante}; */
`;
const FotoMain = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  &.cancelada {
    filter: grayscale(1);
  }
`;
const AvatarPerfil2 = styled(AvatarPerfil)`
  /* height: 100px; */
`;
const CajaNombre = styled.div`
  width: 100%;
  height: 20%;
`;
const NombreTexto = styled.h2`
  text-align: center;
  color: inherit;
  /* white-space: nowrap; */
  font-size: 0.9rem;
  font-weight: 400;
  &.status {
    color: inherit;
    white-space: nowrap;
    font-size: 1.2rem;
  }
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${ClearTheme.neutral.neutral400};
  display: flex;
  justify-content: space-between;
  &:hover {
    background-color: #bdbdbd;
    color: #443f3f;
    background-color: ${ClearTheme.neutral.blancoAzul};
  }
`;

const TituloDetalle = styled.p`
  width: 49%;
  color: inherit;
  &.nowrap {
    /* border: 1px solid red; */
    white-space: nowrap;
    /* width: 60%; */
  }
`;
const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 80%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;
  &.completa {
    text-overflow: initial;
    /* overflow: auto; */
  }
  &.sinNoWrap {
    /* border: 1px solid red; */
    white-space: nowrap;
    text-overflow: clip;
    overflow: visible;
  }
`;

const CajaStatus = styled(CajaStatusComponent)`
  height: 20%;
  align-content: center;
`;
const CajaParrafoDetalles = styled.div`
  width: 100%;
  height: 80%;
  /* background-color: red; */
  /* padding: 8px; */
  overflow-y: auto;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 4px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const ParrafoDetalles = styled.p`
  color: ${Tema.neutral.blancoHueso};
  color: inherit;
  text-align: center;
  width: 100%;

  &.ejecucion {
    color: white;
  }
`;

const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const EnlacesPerfil = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  /* background-color: red; */
  /* border: 2px solid yellow; */
  width: 100%;
  height: 100%;
  width: 70%;
  border: 1px solid transparent;
  transition: all ease 0.2s;
  border-radius: 10px;
  &:hover {
    border: 1px solid ${Tema.primary.azulBrillante};
    background-color: ${ClearTheme.secondary.AzulOscSemiTransp};
    /* border: 1px solid red; */
    /* text-decoration: underline; */
    img {
      border: 3px solid ${ClearTheme.complementary.warning};
      /* border: 2px solid white; */
    }
    h2 {
      color: ${ClearTheme.complementary.warning};
      text-decoration: underline;
    }
  }
`;
