import React, { useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";

import AvatarMale from "./../../../public/img/avatares/maleAvatar.svg";
import { Link } from "react-router-dom";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import {
  extraerPrimerNombreApellido,
  formatoDOP,
} from "../../libs/StringParsed";

export default function CardPagoChofer({ chofer, verPagos, datosMolde }) {
  // *************** CONFIG GENERAL *******************
  return (
    <Card>
      <CajaInterna className="start">
        <CajaFotoNombre>
          <CajaFotoMain>
            <FotoMain
              src={chofer?.urlFotoPerfil ? chofer?.urlFotoPerfil : AvatarMale}
              //   src={AvatarMale}
            />
          </CajaFotoMain>
          <NombreTexto
            className="nombreMain"
            title={chofer.nombre + " " + chofer.apellido}
          >
            <Enlaces
              target="_blank"
              to={`/transportes/maestros/choferes/${chofer.numeroDoc}`}
            >
              {extraerPrimerNombreApellido(chofer.nombre, chofer.apellido)}
            </Enlaces>
          </NombreTexto>
        </CajaFotoNombre>
        <CajaFotoNombre>
          <CajaFotoMain>
            {chofer.isAyudante ? (
              <TextoAyudante>Ayudante</TextoAyudante>
            ) : (
              <FotoMain src={chofer.unidadVehicular.urlFoto} />
            )}
          </CajaFotoMain>
          <NombreTexto
            className="nombreMain"
            title={chofer.unidadVehicular.descripcion}
          >
            {/* {extraerPrimerNombreApellido(chofer.nombre, chofer.apellido)} */}
            {chofer.unidadVehicular.descripcion}
          </NombreTexto>
        </CajaFotoNombre>
      </CajaInterna>
      <CajaInterna className="centro">
        <CajaMonto>
          {chofer?.pagosAux?.length > 0 ? (
            <>
              <TituloMonto>
                {datosMolde.choferTraer === 0
                  ? formatoDOP(
                      chofer?.pagosAux?.reduce(
                        (acumulador, item) => acumulador + item.costoInterno,
                        0
                      )
                    )
                  : formatoDOP(
                      chofer?.pagosAux?.reduce(
                        (acumulador, item) => acumulador + item.monto,
                        0
                      )
                    )}
              </TituloMonto>
              <TituloMonto>Total aprobado</TituloMonto>
            </>
          ) : (
            <TituloMonto className="warning">Sin pagos</TituloMonto>
          )}
        </CajaMonto>
      </CajaInterna>
      <CajaInterna className="end">
        <BtnSimple onClick={() => verPagos(chofer)}>Desglose</BtnSimple>
      </CajaInterna>
    </Card>
  );
}

const Card = styled.div`
  width: 100%;
  height: 120px;
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
  height: 100%;
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
    display: flex;
    justify-content: space-around;
    /* flex-direction: column; */
  }
  &.centro {
    border: 1px solid ${Tema.neutral.blancoHueso};
    width: 35%;
  }
  &.end {
    padding: 0;
    width: 30%;
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
  }
`;
const CajaFotoNombre = styled.div`
  height: 100%;
  width: 30%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const CajaFotoMain = styled.div`
  height: 60%;
  display: flex;
  justify-content: center;
  height: 70px;
  width: 70px;

  &.inactivo {
    filter: grayscale(100%);
  }
`;
const FotoMain = styled.img`
  /* width: 90px; */
  height: 100%;
  width: 80px;
  object-fit: contain;
  border: 1px solid ${Tema.primary.azulBrillante};
  border-radius: 4px;
  /* border-radius: 80%; */
`;

const NombreTexto = styled.h2`
  text-align: center;
  color: ${Tema.neutral.blancoHueso};
  font-size: 0.9rem;
  text-align: center;
  color: inherit;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  font-weight: 400;
  width: 140%;
`;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const CajaMonto = styled.div`
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  /* border: 1px solid red; */
  height: 100%;
`;
const TituloMonto = styled.h2`
  font-weight: 400;
  &.warning {
    color: ${Theme.complementary.warning};
  }
`;
const BtnSimple = styled(BtnGeneralButton)``;
const TextoAyudante = styled.p`
  color: ${Theme.complementary.warning};
  font-size: 1.2rem;
`;
