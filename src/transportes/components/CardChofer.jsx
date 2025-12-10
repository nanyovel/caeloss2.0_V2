import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Link, NavLink } from "react-router-dom";
import { extraerPrimerNombreApellido } from "../../libs/StringParsed";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import AvatarMale from "./../../../public/img/avatares/maleAvatar.svg";

export const CardChofer = ({ chofer, numero }) => {
  return (
    <Container
      className={`
       ${Theme.config.modoClear ? "clearModern" : ""}
       `}
    >
      <CajaInterna className="start">
        <CajaSuperirorIzq>
          <EnlacesPerfil
            target="_blank"
            to={`maestros/choferes/${chofer.numeroDoc}`}
          >
            <CajaFotoMain
              className={
                chofer.estadoDoc == 0
                  ? "off"
                  : chofer.estadoDoc == 1
                    ? "disponible"
                    : chofer.estadoDoc == 2
                      ? "ejecucion"
                      : chofer.estadoDoc == 3
                        ? "inactivo"
                        : ""
              }
            >
              <NombreTexto>{numero + 1}</NombreTexto>

              <FotoMain
                src={chofer.urlFotoPerfil ? chofer.urlFotoPerfil : AvatarMale}
              />
            </CajaFotoMain>
            <NombreTexto
              className="nombreMain"
              title={chofer.nombre + " " + chofer.apellido}
            >
              <Enlaces
                target="_blank"
                to={`maestros/choferes/${chofer.numeroDoc}`}
              >
                {/* {extraerPrimerNombreApellido(chofer.nombre, chofer.apellido)} */}
                {chofer.nombre + " " + chofer.apellido}
              </Enlaces>
            </NombreTexto>
          </EnlacesPerfil>
          {chofer.isAyudante ? (
            <TituloAyudante>Ayudante</TituloAyudante>
          ) : (
            <ContenedorFotoNombre className="vehiculo">
              <br />
              <CajaFotoMain className="vehiculo">
                <FotoMain
                  className="vehiculo"
                  src={chofer?.unidadVehicular?.urlFoto}
                />
              </CajaFotoMain>
              <NombreTexto className="nombreMain nombreVehiculo">
                {chofer.unidadVehicular?.descripcion}
              </NombreTexto>
            </ContenedorFotoNombre>
          )}
        </CajaSuperirorIzq>
        <CajaInferiorIzq className="">
          <CajitaTextoStatus
            className={
              chofer.estadoDoc == "0"
                ? "off"
                : chofer.estadoDoc == "1"
                  ? "disponible"
                  : chofer.estadoDoc == "2"
                    ? "ejecucion"
                    : chofer.estadoDoc == "3"
                      ? "inactivo"
                      : ""
            }
          >
            <TextoStatus>
              {chofer.estadoDoc == "0"
                ? "OFF"
                : chofer.estadoDoc == "1"
                  ? "Disponible"
                  : chofer.estadoDoc == "2"
                    ? "Ejecucion"
                    : chofer.estadoDoc == "3"
                      ? "Inactivo"
                      : ""}
            </TextoStatus>
          </CajitaTextoStatus>
          <CajaNumerador>
            <TextoStatus>{chofer.current.numeroCarga}</TextoStatus>
          </CajaNumerador>
        </CajaInferiorIzq>
      </CajaInterna>
      <CajaInterna className="centro">
        <CajitaDetalle>
          <TituloDetalle>N° Solicitud*:</TituloDetalle>
          <DetalleTexto>
            <Enlaces
              target="_blank"
              to={`maestros/solicitudes/${chofer.current.solicitud?.numeroDoc || ""}`}
            >
              {chofer.current.solicitud?.numeroDoc}
            </Enlaces>
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Cliente:</TituloDetalle>
          <DetalleTexto>
            {chofer.current.solicitud?.tipo == 1
              ? chofer.current.solicitud?.datosReq?.tipoTraslado[0]?.select ==
                true
                ? // ? sucDestino
                  // : request.datosReq.socioNegocio
                  "Suc. " +
                    chofer.current.solicitud?.datosFlete.destinoSeleccionado
                      ?.municipioSeleccionado?.nombreSucursal || ""
                : ""
              : chofer.current.solicitud?.datosReq?.socioNegocio}
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Tipo:</TituloDetalle>
          <DetalleTexto>
            {chofer.current.solicitud?.tipo == 0
              ? "Entrega"
              : chofer.current.solicitud?.tipo == 1
                ? "Abastecimiento"
                : chofer.current.solicitud?.tipo == 2
                  ? "Retiro Proveedor"
                  : chofer.current.solicitud?.tipo == 3
                    ? "Retiro Obra"
                    : ""}
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle>
          <TituloDetalle>Solicitante:</TituloDetalle>
          <DetalleTexto>
            {chofer.current.solicitud?.datosSolicitante?.nombre}
          </DetalleTexto>
        </CajitaDetalle>
        <CajitaDetalle className="detalles">
          <TituloDetalle>Detalles:</TituloDetalle>
          <DetalleTexto
            title={chofer.current.solicitud?.datosReq?.detalles}
            className="detalles"
          >
            {chofer.current.solicitud?.datosReq?.detalles}
          </DetalleTexto>
        </CajitaDetalle>
      </CajaInterna>

      <CajaInterna className="end">
        <WrapEnd>
          <CajitaDetalle className="padding">
            <TituloDetalle>Codigo*:</TituloDetalle>
            <DetalleTexto>
              <Enlaces
                target="_blank"
                to={`maestros/choferes/${chofer.numeroDoc}`}
              >
                {chofer.numeroDoc}
              </Enlaces>
            </DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle className="padding">
            <TituloDetalle>Flota:</TituloDetalle>
            <DetalleTexto>{chofer.flota}</DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle className="padding">
            <TituloDetalle>Celular:</TituloDetalle>
            <DetalleTexto>{chofer.celular}</DetalleTexto>
          </CajitaDetalle>
          <CajitaDetalle className="padding">
            <TituloDetalle>Localidad*:</TituloDetalle>
            <DetalleTexto>{chofer.localidad}</DetalleTexto>
          </CajitaDetalle>
        </WrapEnd>
        <NombreTexto className={`tipo ${chofer.prefijo}`}>
          {chofer.prefijo == "IN"
            ? "Interno"
            : chofer.prefijo == "EE"
              ? "Externo Empresas"
              : chofer.prefijo == "EI"
                ? "Externo Independiente"
                : ""}
        </NombreTexto>
      </CajaInterna>
    </Container>
  );
};

const Container = styled.div`
  width: 100%;
  border: 2px solid green;
  border: 2px solid ${Tema.neutral.blancoHueso};
  border-radius: 15px 0 15px 0;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.neutral.blancoHueso};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    border: 1px solid white;
    backdrop-filter: blur(15px);
    color: white;
    &.cancelada {
      color: black;
    }
  }
`;

const CajaInterna = styled.div`
  height: 150px;
  border: 1px solid ${Tema.neutral.blancoHueso};
  border: none;
  border-radius: 10px;
  padding: 5px;
  overflow: hidden;
  display: inline-block;
  &.start {
    border: none;
    padding: 0px;
    width: 35%;

    flex-direction: column;
  }
  &.centro {
    border: 1px solid ${Tema.neutral.blancoHueso};
    width: 35%;
  }
  &.end {
    padding: 0;
    width: 30%;
    position: relative;
  }
`;

const CajaSuperirorIzq = styled.div`
  display: flex;
  padding: 4px;
  height: 85%;
`;
const ContenedorFotoNombre = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  &.vehiculo {
    width: 50%;
  }
`;

const CajaFotoMain = styled.div`
  /* height: 100%; */
  display: flex;
  justify-content: center;
  &.inactivo {
    filter: grayscale(100%);
  }
`;
const FotoMain = styled.img`
  width: 90px;
  height: 90px;
  object-fit: contain;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;

  &.vehiculo {
    border: 1px solid red;
    border: none;
    width: 60%;
    height: auto;
  }
`;

const NombreTexto = styled.h2`
  text-align: center;
  color: ${Tema.neutral.blancoHueso};
  font-size: 0.9rem;
  text-align: end;
  color: inherit;
  &.nombreMain {
    text-align: center;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    font-weight: 400;
  }
  &.status {
    color: inherit;
  }
  &.tipo {
    position: absolute;
    bottom: 0;
    width: 100%;
    font-size: 1rem;
    text-align: center;
    color: ${Tema.secondary.azulOpaco};
    &.IN {
      background-color: ${Tema.primary.azulBrillante};
    }
    &.EE {
      background-color: ${Tema.secondary.azulSuave};
      color: ${Tema.complementary.success};
    }
    &.EI {
      background-color: ${Tema.complementary.warning};
    }
  }
  &.nombreVehiculo {
    color: inherit;
    font-size: 1rem;
    text-align: center;
    font-size: 0.9rem;
  }
`;
const CajaInferiorIzq = styled.div`
  height: 15%;

  display: flex;
  width: 100%;
`;
const CajitaTextoStatus = styled.div`
  width: 80%;
  &.off {
    background-color: #a3a3a3da;
    color: black;
  }
  &.disponible {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.ejecucion {
    background-color: ${Tema.complementary.azulStatic};
    color: white;
  }
  &.inactivo {
    background-color: ${Tema.neutral.neutral700};
    color: #ffffff;
  }
`;

const TextoStatus = styled.h2`
  text-align: center;
  font-size: 1.1rem;
  color: inherit;
`;
const CajaNumerador = styled.div`
  width: 30%;
  text-align: center;
  font-size: 1rem;
  color: white;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.primary.azulBrillante};
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 0 0 10px 0;
  background-color: ${ClearTheme.complementary.narajanBrillante};
  color: white;
`;

const CajitaDetalle = styled.div`
  display: flex;
  display: flex;
  justify-content: space-between;
  border-bottom: 1px solid ${ClearTheme.neutral.neutral400};
  &.detalles {
    display: flex;
    flex-direction: column;
    justify-content: start;
    align-items: start;
  }
`;
const WrapEnd = styled.div`
  padding: 5px;
`;
const TituloDetalle = styled.p`
  width: 49%;
  color: inherit;
  &.underline {
    text-decoration: underline;
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
  }
  &.detalles {
    width: 100%;
  }
  &.DetalleTexto {
    width: 100%;
  }
  &.datosChofer {
    width: 100%;
  }
  &.start {
    text-align: start;
    padding-left: 10px;
  }
`;

const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const TituloAyudante = styled.h2`
  text-align: center;
  align-content: center;
  font-weight: 400;
  color: ${Tema.complementary.warning};
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
