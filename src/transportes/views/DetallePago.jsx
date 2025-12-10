import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle";
import AvatarMale from "./../../../public/img/avatares/maleAvatar.svg";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import { useNavigate, useParams } from "react-router-dom";
import { useDocByCondition } from "../../libs/useDocByCondition";
import { formatoDOP } from "../../libs/StringParsed";
import { dicionarioElementosOrigenReq } from "../libs/generarElementoReq";
import { localidades } from "../../components/corporativo/Corporativo";
import { BotonQuery } from "../../components/BotonQuery";

export default function DetallePago({ userMaster }) {
  // ************************ RECURSOS GENERALES ************************
  const navigate = useNavigate();
  useEffect(() => {
    if (userMaster) {
      if (!userMaster.permisos.includes("accessAddPagosTMS")) {
        navigate("/transportes/");
      }
    }
  }, [userMaster]);
  const diccTipoChofer = [
    "Chofer interno",
    "Chofer externo independiente",
    "Chofer externo empresa",
  ];
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const location = useParams();
  const [docUser, setDocUser] = useState(location.id);

  const [pagoMasterDB, setPagoMasterDB] = useState({});
  const [pagoMaster, setPagoMaster] = useState(null);
  const [datosParsed, setDatosParsed] = useState(false);
  useDocByCondition(
    "pagosChoferes",
    setPagoMasterDB,
    "numeroDoc",
    "==",
    Number(docUser)
  );
  useEffect(() => {
    setPagoMaster(pagoMasterDB[0]);
    setDatosParsed(true);
  }, [pagoMasterDB]);
  return (
    datosParsed &&
    pagoMaster && (
      <Container>
        <BotonQuery pagoMaster={pagoMaster} />
        <Seccion className="horizontal ">
          <CajaDetalles>
            <Detalle1Wrap>
              <Detalle2Titulo>Numero:</Detalle2Titulo>
              <Detalle3OutPut>{pagoMaster.numeroDoc}</Detalle3OutPut>
            </Detalle1Wrap>
            <Detalle1Wrap>
              <Detalle2Titulo>Fecha:</Detalle2Titulo>
              <Detalle3OutPut className="sinAbreviar">
                {pagoMaster.createdAd.slice(0, 16) +
                  " " +
                  pagoMaster.createdAd.slice(-2)}
              </Detalle3OutPut>
            </Detalle1Wrap>
            <Detalle1Wrap>
              <Detalle2Titulo>Tipo chofer:</Detalle2Titulo>
              <Detalle3OutPut>
                {diccTipoChofer[pagoMaster.beneficiario.tipo]}
              </Detalle3OutPut>
            </Detalle1Wrap>
            <Detalle1Wrap>
              <Detalle2Titulo>Creado por*:</Detalle2Titulo>
              <Detalle3OutPut>
                <Enlace
                  to={"/perfiles/" + pagoMaster.createdBy}
                  target="_blank"
                >
                  {pagoMaster.createdBy}
                </Enlace>
              </Detalle3OutPut>
            </Detalle1Wrap>
            <Detalle1Wrap className="vertical">
              <Detalle2Titulo className="vertical">Comentarios:</Detalle2Titulo>
              <Detalle3OutPut className="vertical">
                {pagoMaster.comentarios}
              </Detalle3OutPut>
            </Detalle1Wrap>
          </CajaDetalles>
          <CajaDetalles>
            <CajaPerfiles>
              <CajaInterna className="izq">
                <NombreTexto className="titulo">Beneficiario:</NombreTexto>
                <CajaFotoMain>
                  <FotoMain
                    src={
                      pagoMaster.beneficiario.urlFotoPerfil
                        ? pagoMaster.beneficiario.urlFotoPerfil
                        : AvatarMale
                    }
                  />
                </CajaFotoMain>
                <CajaNombre>
                  <Enlace
                    to={
                      "/transportes/maestros/choferes/" +
                      pagoMaster.beneficiario.numeroDoc
                    }
                    target="_blank"
                  >
                    <NombreTexto className="nombreMain">
                      {/* {extraerPrimerNombreApellido(
                    requestMaster.datosSolicitante?.nombre,
                    requestMaster.datosSolicitante?.apellido
                  )} */}
                      {pagoMaster.beneficiario.nombre +
                        " " +
                        pagoMaster.beneficiario.apellido}
                    </NombreTexto>
                  </Enlace>
                </CajaNombre>
              </CajaInterna>
              <CajaInterna className="der">
                <TituloMonto>Monto Total:</TituloMonto>
                <Monto>
                  {pagoMaster.beneficiario.tipo == 0
                    ? formatoDOP(
                        pagoMaster.elementos.reduce(
                          (acumulador, item) => acumulador + item.costoInterno,
                          0
                        )
                      )
                    : formatoDOP(
                        pagoMaster.elementos.reduce(
                          (acumulador, item) => acumulador + item.monto,
                          0
                        )
                      )}
                </Monto>
              </CajaInterna>
            </CajaPerfiles>
          </CajaDetalles>
        </Seccion>
        <CajaTablaGroup>
          <TablaGroup>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Solicitud*</CeldaHeadGroup>
                <CeldaHeadGroup>Cliente</CeldaHeadGroup>
                <CeldaHeadGroup>Fecha</CeldaHeadGroup>
                <CeldaHeadGroup>Solicitante</CeldaHeadGroup>
                <CeldaHeadGroup>Origen</CeldaHeadGroup>
                <CeldaHeadGroup>Destino</CeldaHeadGroup>
                <CeldaHeadGroup>Rol</CeldaHeadGroup>
                <CeldaHeadGroup>Monto</CeldaHeadGroup>
              </FilasGroup>
            </thead>
            <tbody>
              {pagoMaster.elementos.map((el, index) => {
                return (
                  <FilasGroup key={index} className="body">
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      <Enlace
                        to={`/transportes/maestros/solicitudes/${el.datosSolicitud.numeroReq}`}
                        target="_blank"
                      >
                        {el.datosSolicitud.numeroReq}
                      </Enlace>
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {el.datosSolicitud.cliente}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {el.datosSolicitud.fechaSolicitud.slice(0, 10)}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {el.datosSolicitud.nombreSolicitante}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {
                        localidades.find(
                          (loc) => loc.code == el.datosSolicitud.puntoPartida
                        ).nombreSucursalOrigen
                      }
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {el.datosSolicitud.destino}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {
                        dicionarioElementosOrigenReq.find(
                          (pay) =>
                            pay.codigoElementoOrigen == el.codigoElementoOrigen
                        ).descripcionViajesExternos
                      }
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>
                      {pagoMaster.beneficiario.tipo == 0
                        ? formatoDOP(el.costoInterno)
                        : formatoDOP(el.monto)}
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
            </tbody>
          </TablaGroup>
        </CajaTablaGroup>
      </Container>
    )
  );
}
const Container = styled.div`
  width: 100%;
  position: relative;
`;
const Seccion = styled.div`
  width: 100%;
  min-height: 40px;
  /* 787878 */
  margin: 10px 0;
  gap: 10px;
  padding: 0 15px;
  color: ${Tema.secondary.azulOpaco};
  margin-bottom: 25px;
  &.horizontal {
    display: flex;
    /* height: 350px; */
    justify-content: start;
  }
  position: relative;
  &.vehiculo {
    display: flex;
    flex-direction: column;
    /* height: 350px; */
  }
  @media screen and (max-width: 780px) {
    flex-direction: column;
  }
`;
const CajaDetalles = styled.div`
  width: 50%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;

  background-color: ${ClearTheme.secondary.azulFrosting};
  backdrop-filter: blur(3px);

  border: 1px solid white;

  color: white;
  @media screen and (max-width: 780px) {
    width: 94%;
  }
`;
const CajaPerfiles = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-around;
  height: 100%;
`;
const CajaInterna = styled.div`
  width: 50%;
  border: none;
  border-radius: 10px;
  padding: 5px;
  overflow: hidden;
  &.der {
    border: 1px solid red;
    border: 2px solid ${Tema.neutral.neutral550};
  }
`;

const CajaFotoMain = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const FotoMain = styled.img`
  width: 100px;
  height: 100px;
  object-fit: contain;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
  &.inactivo {
    filter: grayscale(100%);
  }
`;

const CajaNombre = styled.div`
  width: 100%;
  height: 20%;
`;
const NombreTexto = styled.h2`
  text-align: center;
  color: inherit;
  font-weight: 400;

  &.titulo {
    font-size: 1rem;
    margin-bottom: 5px;
    text-decoration: underline;
  }

  &.nombreMain {
    font-size: 1.1rem;
  }
`;
const TituloMonto = styled.h2`
  text-align: center;
  text-decoration: underline;
  height: 20%;
  color: ${ClearTheme.complementary.warning};
`;
const Monto = styled.h3`
  text-align: center;
  font-weight: lighter;
  font-size: 1.5rem;
  height: 80%;
  align-content: center;
`;
