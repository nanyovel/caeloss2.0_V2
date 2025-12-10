import React from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleRight,
  faBan,
  faBolt,
  faClipboardCheck,
  faCloudArrowDown,
  faDollarSign,
  faFloppyDisk,
  faInfo,
  faLockOpen,
  faPencil,
  faTrashCan,
  faTruck,
  faX,
} from "@fortawesome/free-solid-svg-icons";
import { InterruptorOficial } from "../../components/InterruptorOficial";
import { BotonQuery } from "../../components/BotonQuery";
import { MenuDesplegable, Opciones } from "../../components/InputGeneral";
import { faComment, faCopy } from "@fortawesome/free-regular-svg-icons";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PlantillaDocDevolucionPDF } from "./PlantillaDocDevolucionPDF";

export default function ControlesDoc({
  tipo,
  titulo,
  controles,
  handleControles,
  requestMaster,
}) {
  const cliente = "Juan Pérez";
  const productos = [
    { nombre: "Construccion MT2", cantidad: 2, precio: 100 },
    { nombre: "Material", cantidad: 1, precio: 150 },
  ];
  return (
    <Container className={Theme.config.modoClear ? "clearModern" : ""}>
      {/* <BotonQuery controles={controles} /> */}
      <TituloEncabezadoTabla>{titulo}</TituloEncabezadoTabla>
      <WrapFunciones className={tipo}>
        {controles.btns
          .filter((btn) => {
            if (btn.visible) {
              return btn;
            }
          })
          .map((btn, index) => {
            return (
              <BtnNormal
                key={index}
                className={`${btn.tipo + " "}  ${btn.disabled ? " disabled " : ""} 
                    ${btn.disabled ? " disabled " : ""} 
                  `}
                onClick={(e) => handleControles(e)}
                name={btn.tipo}
                disabled={btn.disabled}
                // disabled={btn}
                title={btn.title}
              >
                {btn.icono && (
                  <Icono
                    // data-name={btn.tipo}
                    // onClick={(e) => e.stopPropagation()}
                    icon={
                      btn.tipo == "btnEditar"
                        ? faPencil
                        : btn.tipo == "btnEstados"
                          ? faAngleRight
                          : btn.tipo == "btnAcciones"
                            ? faBolt
                            : btn.tipo == "btnComentar"
                              ? faComment
                              : btn.tipo == "btnCopiar"
                                ? faCopy
                                : btn.tipo == "btnEliminar"
                                  ? faTrashCan
                                  : btn.tipo == "btnSalir"
                                    ? faX
                                    : btn.tipo == "btnConcluir"
                                      ? faClipboardCheck
                                      : btn.tipo == "btnDesactivar"
                                        ? faBan
                                        : btn.tipo == "btnGuardar"
                                          ? faFloppyDisk
                                          : btn.tipo == "btnAbrir"
                                            ? faLockOpen
                                            : btn.tipo == "btnMasInfo"
                                              ? faInfo
                                              : ""
                    }
                  />
                )}
                {btn.texto}
              </BtnNormal>
            );
          })}
        {controles?.menusDesplegables?.map((desplegable, index) => {
          return (
            <CajitaDetalle key={index}>
              <TituloDetalle>{`${desplegable.texto}: `}</TituloDetalle>
              {desplegable.visible == false ? (
                <DetalleTexto>
                  {desplegable.opciones.find((estado) => estado.select)
                    ? desplegable.opciones.find((estado) => estado.select)
                        .nombre
                    : ""}
                </DetalleTexto>
              ) : (
                <DesplegableSimple
                  disabled={desplegable.disabled}
                  value={
                    desplegable.opciones.find((opciones) => opciones.select)
                      ? desplegable.opciones.find((opciones) => opciones.select)
                          .nombre
                      : " "
                  }
                  name={desplegable.tipo}
                  onChange={(e) => {
                    handleControles(e);
                  }}
                  className={`
                    ${desplegable.disabled ? "disabled" : ""}
                    ${Theme.config.modoClear ? "clearModern" : ""}
                    `}
                >
                  {desplegable.opciones.map((estado, index) => {
                    return (
                      <Opciones
                        className={` ${Theme.config.modoClear ? "clearModern" : ""}`}
                        key={index}
                        value={estado.nombre}
                        disabled={estado.disabled}
                      >
                        {estado.nombre}
                      </Opciones>
                    );
                  })}
                </DesplegableSimple>
              )}
            </CajitaDetalle>
          );
        })}
        {requestMaster?.tipo == 2 && (
          <PDFDownloadLink
            document={<PlantillaDocDevolucionPDF request={requestMaster} />}
            fileName="Doc devolucion.pdf"
          >
            <BtnNormal>
              <Icono icon={faCloudArrowDown} />
              PDF
            </BtnNormal>
          </PDFDownloadLink>
        )}
      </WrapFunciones>
    </Container>
  );
}
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
  pointer-events: none;
`;
const Container = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  width: 100%;
  padding: 5px;
  padding-left: 15px;
  display: flex;
  flex-direction: column;
  align-items: start;
  color: #757575;
  background-color: ${ClearTheme.secondary.azulFrosting};
  color: white;
  backdrop-filter: blur(3px);
  overflow-x: auto;
`;
const WrapFunciones = styled.div`
  display: flex;
`;
const TituloEncabezadoTabla = styled.h2`
  font-size: 1.2rem;
  font-weight: normal;
`;
const CajaBtns = styled.div`
  display: flex;
`;
const CajaBtnCiclo = styled.div`
  display: flex;
  gap: 5px;
  margin-right: 15px;
`;
const BtnNormal = styled(BtnGeneralButton)`
  white-space: nowrap;
  margin: 0;
  margin-right: 5px;
  width: auto;
  &.btnEliminar {
    background-color: red;
    color: white;
    &:hover {
      color: red;
      background-color: white;
    }
  }

  &.btnDesactivar {
  }
  &.disabled {
    background-color: ${Tema.neutral.neutral700};
    cursor: default;
    &:hover {
      /* color: red; */
      color: white;
      background-color: ${Tema.neutral.neutral700};
    }
  }
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.secondary.azulOpaco};
  &.item {
    width: 100%;
    flex-direction: column;
    padding: 10px;
  }
  &.cajaBtn {
    background-color: transparent;
    justify-content: center;
  }
  &.cajaTitulo {
    border: none;
  }
  &.cajaDetalles {
    flex-direction: column;
  }
`;

const TituloDetalle = styled.p`
  /* width: 50%; */
  padding-left: 5px;
  color: inherit;
  text-align: start;
  &.tituloArray {
    text-decoration: underline;
  }
  &.modoDisabled {
    text-decoration: underline;
  }
  display: block;
  /* border: 1px solid red; */
  margin-right: 10px;
  color: white;
`;
const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  /* overflow: hidden; */
  text-overflow: ellipsis;
  color: inherit;
  &.textArea {
    width: 100%;
    white-space: initial;
    text-overflow: initial;
    height: auto;
    padding: 5px;
    text-align: start;
    padding-left: 15px;
    min-height: 90px;
  }
  &.itemArray {
    padding: 5px;
    width: 50%;
    height: 31px;
  }

  /* border: 1px solid blue; */
  /* border-bottom: 2px solid ; */
  color: white;
  text-decoration: underline;
  margin-right: 10px;
`;
const InterruptorSimple = styled(InterruptorOficial)`
  height: 10px;
  border: 1px solid red;
`;
const DesplegableSimple = styled(MenuDesplegable)``;
