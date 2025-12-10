import { useEffect, useState } from "react";
import styled from "styled-components";
import imgSupplier from "./../img/01-factory.png";
import imgOcean from "./../img/02-ship.png";
import imgPort from "./../img/03-PuertoEste.png";
import imgWhareHouse from "./../img/warehouse.png";
import imgDptoImport from "./../img/05-import-department.png";
import imgSuccess from "./../img/successImport.png";
import chechSencillo from "./../img/check.png";
import workProgress from "./../img/work-in-progress.png";
import "./../components/interruptor.css";
import { NavLink } from "react-router-dom";
import imgCiclo1 from "./../img/lifeCycle.png";
import imgCiclo2 from "./../img/lifeCycle2.png";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../components/JSXElements/GrupoDetalle.jsx";
import { colorDaysRemaining, fechaConfirmada } from "../components/libs.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { diccStatusFurgon } from "../../libs/statusDocImport.js";

export const DetalleFurgon = ({ furgonMaster, tablaMatRef }) => {
  //
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <BotonQuery furgonMaster={furgonMaster} />
      <CajaMenuHamburg>
        <Img
          className={menuOpen == false ? "rayas" : ""}
          onClick={() => setMenuOpen(!menuOpen)}
          src={menuOpen ? imgCiclo1 : imgCiclo2}
        />
      </CajaMenuHamburg>
      <CajaEncabezado>
        <CajaDetalles>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>N° Contenedor:</Detalle2Titulo>
            <Detalle3OutPut>{furgonMaster.numeroDoc}</Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Tamaño:</Detalle2Titulo>
            <Detalle3OutPut>
              {furgonMaster.tamannio ? furgonMaster.tamannio + " pies" : ""}
            </Detalle3OutPut>
          </Detalle1Wrap>

          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Proveedor:</Detalle2Titulo>
            <Detalle3OutPut title={furgonMaster.datosBL.proveedor}>
              {furgonMaster.datosBL.proveedor}
            </Detalle3OutPut>
          </Detalle1Wrap>

          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Bill of Lading (BL):</Detalle2Titulo>
            <Detalle3OutPut>
              <Enlaces
                to={`/importaciones/maestros/billoflading/${encodeURIComponent(
                  furgonMaster.datosBL.numeroBL
                )}`}
                target="_blank"
              >
                {furgonMaster.datosBL.numeroBL}
              </Enlaces>
            </Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Naviera:</Detalle2Titulo>
            <Detalle3OutPut title={furgonMaster.datosBL.naviera}>
              {furgonMaster.datosBL.naviera}
            </Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Puerto:</Detalle2Titulo>
            <Detalle3OutPut>{furgonMaster.datosBL.puerto}</Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Dias Libres:</Detalle2Titulo>
            <Detalle3OutPut>{furgonMaster.datosBL.diasLibres}</Detalle3OutPut>
          </Detalle1Wrap>
          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Dias Restantes:</Detalle2Titulo>

            <Detalle3OutPut>
              {furgonMaster.valoresAux.diasRestantes}
              {colorDaysRemaining(furgonMaster.valoresAux.diasRestantes)}
            </Detalle3OutPut>
          </Detalle1Wrap>

          <Detalle1Wrap className="altoAuto">
            <Detalle2Titulo>Destino:</Detalle2Titulo>
            <Detalle3OutPut>{furgonMaster.destino}</Detalle3OutPut>
          </Detalle1Wrap>
        </CajaDetalles>
        <CajaDetalles className="cajaStatus">
          <CajaFondoLisaStatus></CajaFondoLisaStatus>
          <TextoStatus>{diccStatusFurgon[furgonMaster.status]}</TextoStatus>

          {furgonMaster.status == 1 ? (
            <TextoFalacia>
              Tu producto está en camino hacia Rep. Dom.
            </TextoFalacia>
          ) : furgonMaster.status == 2 ? (
            <TextoFalacia>
              Tu producto llego al país y se encuentra en los procesos
              portuarios.
            </TextoFalacia>
          ) : furgonMaster.status == 3 ? (
            <TextoFalacia>
              Tu producto llegó a nuestros almacenes y se encuentra en el
              proceso de recepción.
            </TextoFalacia>
          ) : furgonMaster.status == 4 ? (
            <TextoFalacia>
              El proceso de recepción de almacén culminó y la documentación fue
              enviada al departamento de importaciones.{" "}
            </TextoFalacia>
          ) : furgonMaster.status == 5 ? (
            <TextoFalacia>
              El ciclo de vida termino correctamente y tu producto se encuentra
              registrado en nuestro ERP (SAP).
            </TextoFalacia>
          ) : (
            ""
          )}
        </CajaDetalles>
      </CajaEncabezado>
      <>
        <CajaTabla>
          <Tabla ref={tablaMatRef}>
            <thead>
              <FilasGroup className="cabeza">
                <CeldaHeadGroup>N°</CeldaHeadGroup>
                <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                <CeldaHeadGroup>Qty</CeldaHeadGroup>
                <CeldaHeadGroup>Comentarios</CeldaHeadGroup>
                <CeldaHeadGroup>Orden Compra*</CeldaHeadGroup>
              </FilasGroup>
            </thead>
            <tbody>
              {furgonMaster?.materiales?.map((item, index) => {
                return (
                  <FilasGroup key={index} className="body">
                    <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      <Enlaces
                        to={`/importaciones/maestros/articulos/${encodeURIComponent(
                          item.codigo
                        )}`}
                        target="_blank"
                      >
                        {item.codigo}
                      </Enlaces>
                    </CeldasBodyGroup>
                    <CeldasBodyGroup className="descripcion startText">
                      {item.descripcion}
                    </CeldasBodyGroup>
                    <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>
                    <CeldasBodyGroup>{item.comentarios}</CeldasBodyGroup>
                    <CeldasBodyGroup>
                      <Enlaces
                        to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(
                          item.ordenCompra
                        )}`}
                        target="_blank"
                      >
                        {item.ordenCompra}
                      </Enlaces>
                    </CeldasBodyGroup>
                  </FilasGroup>
                );
              })}
            </tbody>
          </Tabla>
        </CajaTabla>
        <CajaEspacio></CajaEspacio>
      </>

      <SliderStatus
        className={`
        ${menuOpen ? "abierto" : ""}
        `}
      >
        <CajaTituloYSeguimiento>
          <CajaEncabezadoStatus>
            <TituloStatus>Ciclo de vida</TituloStatus>
          </CajaEncabezadoStatus>
        </CajaTituloYSeguimiento>
        <CajaPoints>
          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={furgonMaster.status == 0 ? workProgress : chechSencillo}
                className={furgonMaster.status > 0 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgSupplier}
                className={furgonMaster.status > 0 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus>Proveedor -</TituloImgStatus>
              <TextoImgStatus>
                Cielos Acusticos le envió la orden de compra al proveedor.
              </TextoImgStatus>
            </CajaTexto>
          </CajitaImg>

          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={furgonMaster.status == 1 ? workProgress : chechSencillo}
                className={furgonMaster.status > 0 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgOcean}
                className={furgonMaster.status > 0 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus>Transito Maritimo </TituloImgStatus>
              <TextoImgStatus>
                El proveedor cargó la mercancia en el contenedor y el barco
                zarpó hacia Rep. Dom.
              </TextoImgStatus>
            </CajaTexto>
          </CajitaImg>

          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={furgonMaster.status == 2 ? workProgress : chechSencillo}
                className={furgonMaster.status > 1 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgPort}
                className={furgonMaster.status > 1 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus
                title={
                  furgonMaster.fechas.llegada02AlPais.fecha.slice(0, 10) +
                  " " +
                  fechaConfirmada(
                    furgonMaster.fechas.llegada02AlPais.confirmada,
                    true
                  )
                }
              >
                <p>En puerto</p>
                <p>
                  {furgonMaster.fechas.llegada02AlPais.fecha.slice(0, 10)}
                  {fechaConfirmada(
                    furgonMaster.fechas.llegada02AlPais.confirmada
                  )}
                </p>
              </TituloImgStatus>
              <TextoImgStatus>La mercancia llego al pais.</TextoImgStatus>
            </CajaTexto>
          </CajitaImg>

          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={furgonMaster.status == 3 ? workProgress : chechSencillo}
                className={furgonMaster.status > 2 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgWhareHouse}
                className={furgonMaster.status > 2 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus
                title={
                  furgonMaster.fechas.llegada03Almacen.fecha.slice(0, 10) +
                  " " +
                  fechaConfirmada(
                    furgonMaster.fechas.llegada03Almacen.confirmada,
                    true
                  )
                }
              >
                <p>Recepcion Almacen</p>
                <p>
                  {furgonMaster.fechas.llegada03Almacen.fecha.slice(0, 10)}
                  {fechaConfirmada(
                    furgonMaster.fechas.llegada03Almacen.confirmada
                  )}
                </p>
              </TituloImgStatus>
              <TextoImgStatus>
                La mercancia llegó a nuestros almacenes donde empieza el proceso
                de recepcion.
              </TextoImgStatus>
            </CajaTexto>
          </CajitaImg>

          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={furgonMaster.status == 4 ? workProgress : chechSencillo}
                className={furgonMaster.status > 3 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgDptoImport}
                className={furgonMaster.status > 3 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus
                title={
                  furgonMaster.fechas.llegada04DptoImport.fecha.slice(0, 10) +
                  " " +
                  fechaConfirmada(
                    furgonMaster.fechas.llegada04DptoImport.confirmada,
                    true
                  )
                }
              >
                <p>Departamento de importacion</p>

                <p>
                  {furgonMaster.fechas.llegada04DptoImport.fecha.slice(0, 10)}
                  {fechaConfirmada(
                    furgonMaster.fechas.llegada04DptoImport.confirmada
                  )}
                </p>
              </TituloImgStatus>
              <TextoImgStatus>
                Almacen recibió correctamente y envio la documentacion al dpto.
                de importaciones.
              </TextoImgStatus>
            </CajaTexto>
          </CajitaImg>
          <CajitaImg>
            <CajaCotejo>
              <ImgCheck
                src={chechSencillo}
                className={furgonMaster.status > 4 ? "" : "incompleta"}
              />
            </CajaCotejo>
            <CajaDirectaImg>
              <ImagenStatus
                src={imgSuccess}
                className={furgonMaster.status > 4 ? "" : "incompleta"}
              />
            </CajaDirectaImg>
            <CajaTexto>
              <TituloImgStatus
                title={
                  furgonMaster.fechas.llegada05Concluido.fecha.slice(0, 10) +
                  " " +
                  fechaConfirmada(
                    furgonMaster.fechas.llegada05Concluido.confirmada,
                    true
                  )
                }
              >
                <p>Completado</p>
                <p>
                  {furgonMaster.fechas.llegada05Concluido.fecha.slice(0, 10)}
                  {fechaConfirmada(
                    furgonMaster.fechas.llegada05Concluido.confirmada
                  )}
                </p>
              </TituloImgStatus>
              <TextoImgStatus>
                Fin del ciclo, la mercancia esta registrada en SAP.
              </TextoImgStatus>
            </CajaTexto>
          </CajitaImg>
        </CajaPoints>
      </SliderStatus>
    </>
  );
};

const CajaEspacio = styled.div`
  width: 100px;
  height: 1px;
`;

const Tabla = styled(TablaGroup)`
  width: 94%;
  margin: 0;
  padding: 0;
`;

const CajaEncabezado = styled.div`
  width: 100%;
  display: flex;
  justify-content: start;
  margin: 10px 0;
  color: ${Tema.secondary.azulOpaco};
  &.negativo {
    color: ${Tema.complementary.danger};
  }

  @media screen and (max-width: 780px) {
    flex-direction: column;
    /* align-items:center; */
  }
`;

const CajaDetalles = styled.div`
  width: 45%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;
  margin-left: 12px;
  margin-bottom: 5px;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
  border: 1px solid white;
  @media screen and (max-width: 780px) {
    width: 85%;
  }
  @media screen and (max-width: 550px) {
    width: 90%;
  }

  &.cajaStatus {
    flex-direction: column;
    /* background-color: #000c1c; */
    display: flex;
    justify-content: center;
    align-items: center;
  }
  @media screen and (max-width: 650px) {
    width: 90%;
    margin-bottom: 5px;
  }
`;

const TextoFalacia = styled.p`
  &.img {
    display: none;
  }
  &.puerto {
    color: white;
    background-color: #565656bc;
  }
  &.almacen {
    color: ${Tema.secondary.azulProfundo};
  }
  &.importaciones {
    color: ${Tema.secondary.azulProfundo};
  }
  &.sap {
    color: ${Tema.secondary.azulProfundo};
  }
`;

const SliderStatus = styled.div`
  position: absolute;
  z-index: 2;
  top: 110px;
  right: 5px;
  transform: translate(88%, 0);
  width: 400px;
  border: 1px solid ${Tema.secondary.azulProfundo};
  border-radius: 5px;
  padding: 4px;
  background-color: ${Tema.secondary.azulProfundo};
  transition: transform ease 0.4s;
  &:hover {
    right: 0;
    transform: translate(0, 0);
  }

  @media screen and (max-width: 550px) {
    width: 98%;
    right: 15px;
    transform: translate(100%, 0);
    &.abierto {
      right: 0;
      transform: translate(0, 0);
    }
  }
`;
const CajaEncabezadoStatus = styled.div`
  min-height: 25px;
  display: flex;
  justify-content: center;
  margin-bottom: 10px;
`;
const TituloStatus = styled.h2`
  font-size: 1.2rem;
  font-weight: bold;
  color: white;
  border-bottom: 1px solid white;
  @media screen and (max-width: 450px) {
    font-size: 1rem;
  }
`;

const CajaPoints = styled.div`
  flex-direction: column;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
`;
const ImagenStatus = styled.img`
  width: 100%;
  &.enProceso {
    border-radius: 4px;
  }
  &.incompleta {
    filter: grayscale(1);
  }
`;

const CajitaImg = styled.div`
  display: flex;
  padding: 5px;
  border-radius: 5px;
  width: 100%;
  background-color: ${Tema.secondary.azulGraciel};
`;
const CajaCotejo = styled.div`
  width: 40px;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ImgCheck = styled.img`
  width: 100%;
  &.incompleta {
    filter: grayscale(1);
  }
`;

const CajaDirectaImg = styled.div`
  width: 15%;
`;
const CajaTexto = styled.div`
  padding-left: 5px;
  width: 85%;
`;
const TituloImgStatus = styled.h2`
  font-size: 1rem;
  color: ${Tema.primary.azulBrillante};
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  font-weight: normal;
  display: flex;
  justify-content: space-between;
  @media screen and (max-width: 450px) {
    font-size: 14px;
  }
`;

const TextoImgStatus = styled.p`
  color: ${Tema.secondary.azulOpaco};
  font-size: 14px;
  @media screen and (max-width: 450px) {
    font-size: 12px;
  }
`;
const CajaTituloYSeguimiento = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
`;
const CajaFondoLisaStatus = styled.div`
  background-color: ${Tema.secondary.azulOpaco};
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CajaTabla = styled(CajaTablaGroup)`
  overflow-x: scroll;
  width: 100%;
  /* padding: 0 20px; */
  display: flex;
  justify-content: start;
  padding: 5px;
  /* border: 1px solid red; */
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 3px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  margin-bottom: 120px;

  @media screen and (max-width: 740px) {
    padding: 0 5px;

    display: flex;
    justify-content: start;
    width: 95%;
  }
`;

const CajaMenuHamburg = styled.div`
  display: none;
  width: 50px;
  height: 50px;
  position: fixed;
  right: 70px;
  bottom: 20px;
  justify-content: center;
  align-items: center;
  z-index: 3;
  @media screen and (max-width: 550px) {
    display: flex;
  }
`;
const Img = styled.img`
  height: 80px;
`;

const TextoStatus = styled.h3`
  font-size: 2rem;
  &.sinDocumento {
    color: red;
  }
  &.success {
    color: ${Tema.complementary.success};
  }
  &.block {
    color: #524a4a;
  }
  &.del {
    color: #8c3d3d;
  }
`;
