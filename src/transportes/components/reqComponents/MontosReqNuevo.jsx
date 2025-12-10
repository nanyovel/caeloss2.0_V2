import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton.jsx";
import { formatoDOP, soloNumeros } from "../../../libs/StringParsed.jsx";
import { ClearTheme, Tema, Theme } from "../../../config/theme.jsx";
import { Alerta } from "../../../components/Alerta.jsx";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../components/InputGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  JSXChildrenFooterModal,
  ParrafoAction,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { BotonQuery } from "../../../components/BotonQuery.jsx";
import {
  aprobacionMonto,
  OrigenMonto,
} from "../../libs/DiccionarioNumberString.js";
import ModalGeneral from "../../../components/ModalGeneral.jsx";
import { GenerarMonto } from "../../libs/GenerarMonto.js";

export default function MontosReqNuevo({
  datosMontos,
  setDatosMontos,
  userMaster,
  datosFlete,
  modo,
}) {
  // ********** RECURSOS GENERALES **********
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [hasModalElementos, setHasModalElementos] = useState(false);
  const [montoSelect, setMontoSelect] = useState(null);
  const mostrarElementos = (monto) => {
    setHasModalElementos(true);
    setMontoSelect(monto);
  };

  // Manejando input
  const initialValue2 = {
    costoManual: "",
    precioManual: "",
    justificacion: "",
    ejecucion: null,
  };
  const [valueInput2, setValueInput2] = useState({ ...initialValue2 });
  const handleInput2 = (e) => {
    const { name, value } = e.target;
    console.log(name);
    if (name == "precioManual" || name == "costoManual") {
      if (soloNumeros(value)) {
        console.log(value);
        const valorParsed = Number(value);
        setValueInput2({
          ...valueInput2,
          [name]: valorParsed,
        });
      }
    } else if (name == "justificacion") {
      setValueInput2({
        ...valueInput2,
        justificacion: value,
      });
    }
  };

  //
  //🟢🟢🟢🟢 ************** MONTO ORIGEN 1 - MONTO PRECIO MANUAL **************
  const [hasModalOrigen1, setHasModalOrigen1] = useState(false);
  const agregarMontoOrigen1 = (e) => {
    setHasModalOrigen1(true);
  };
  const editarMontoOrigen1 = (monto) => {
    // El unico monto que se puede editar es el monto manual que agrega el solicitante mientras crea la solicitud
    if (monto.origen != 1) {
      return;
    }
    setHasModalOrigen1(true);
    setValueInput2(monto);
  };
  const guardarMontoOrigen1 = () => {
    const precioParsed =
      valueInput2.precioManual == "" ? 0 : valueInput2.precioManual;
    if (valueInput2.justificacion == "") {
      setMensajeAlerta("Agregar nuevo precio y justificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }
    //
    const montoAux = GenerarMonto({
      datosFlete: datosFlete,
      origen: 1,
      justificacion: valueInput2.justificacion,
      userMaster: userMaster,
      precioManual: precioParsed,
    });

    setDatosMontos([datosMontos[0], montoAux]);
    resetMontoOrigen1();
  };
  const resetMontoOrigen1 = () => {
    setHasModalOrigen1(false);
    setMontoSelect(null);
    setValueInput2({ ...initialValue2 });
  };
  const quitarMontoOrigen1 = (monto, index) => {
    if (modo == "edicion") {
      return;
    }
    // Este if nunca deberia ejecutarse, dado que todo esta programado para que la edicion y quitar monto sea posible solo mientras el solicitante solicita, es decir luego de que la solicitud esta creada no permite ni editar un monto ni tampoco quitarlo

    if (monto.createdBy != userMaster.userName) {
      setMensajeAlerta("No creado por su usuario.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    } else if (monto.createdBy == userMaster.userName) {
      console.log(datosMontos.length);
      console.log(monto.origen);
      if (datosMontos.length == 2 && monto.origen == 1) {
        const datosAux = datosMontos.filter((monto, i) => {
          if (i != index) {
            return monto;
          }
        });
        setDatosMontos(datosAux);
      }
    }
  };
  return (
    <>
      <Container
        className={`
    ${modo}
    ${hasModalOrigen1 ? "marginBotomn" : ""}
    ${Theme.config.modoClear ? "clearModern" : ""}
    `}
      >
        <BotonQuery datosMontos={datosMontos} valueInput2={valueInput2} />
        <CajaTabla>
          <Tabla>
            <thead>
              <Fila
                className={`
                    cabeza 
                    ${Theme.config.modoClear ? "clearModern" : "  "}
                    `}
              >
                <CeldaHead>N°</CeldaHead>
                <CeldaHead className="costo">Costo</CeldaHead>
                <CeldaHead className="costo">Precio</CeldaHead>
                <CeldaHead>Usuario</CeldaHead>
                <CeldaHead>Justificacion</CeldaHead>
                <CeldaHead>Origen</CeldaHead>
                <CeldaHead>Elementos</CeldaHead>
                <CeldaHead>Aprobado por</CeldaHead>
                {modo == "creacion" && <CeldaHead>Accion</CeldaHead>}
              </Fila>
            </thead>
            <tbody>
              {datosMontos?.map((monto, index) => {
                return (
                  <React.Fragment key={index}>
                    {
                      <Fila
                        className={`
                    body 
                    ${monto.oficialCaeloss ? "initial" : " body "}
                             ${index % 2 ? "impar" : "par"}
                    `}
                        key={index}
                      >
                        <CeldasBody>{index + 1}</CeldasBody>
                        <CeldasBody>
                          {monto.costoManual
                            ? formatoDOP(monto.costoManual)
                            : formatoDOP(
                                monto?.elementos?.reduce(
                                  (suma, ele) => suma + Number(ele.costo || 0),
                                  0
                                )
                              )}
                        </CeldasBody>
                        <CeldasBody>
                          {monto.precioManual !== ""
                            ? formatoDOP(monto.precioManual)
                            : formatoDOP(
                                monto?.elementos?.reduce(
                                  (suma, ele) => suma + Number(ele.precio || 0),
                                  0
                                )
                              )}
                        </CeldasBody>
                        <CeldasBody>{monto.createdBy}</CeldasBody>
                        <CeldasBody title={monto.justificacion}>
                          {monto.justificacion}
                        </CeldasBody>
                        <CeldasBody>{OrigenMonto[monto.origen]}</CeldasBody>
                        <CeldasBody className="">
                          <ParrafoAction
                            onClick={() => mostrarElementos(monto)}
                          >
                            👁️
                          </ParrafoAction>
                        </CeldasBody>
                        <CeldasBody>
                          {monto?.aprobaciones?.aprobado == 2
                            ? monto?.aprobaciones?.aprobadoPor
                            : aprobacionMonto[monto?.aprobaciones?.aprobado]}
                        </CeldasBody>

                        {modo == "creacion" ? (
                          monto.origen == 1 ? (
                            <CeldasBody className="accion">
                              {modo == "creacion" ? (
                                <>
                                  <ParrafoAccion
                                    onClick={() =>
                                      quitarMontoOrigen1(monto, index)
                                    }
                                  >
                                    ❌
                                  </ParrafoAccion>
                                  <ParrafoAccion
                                    onClick={() => editarMontoOrigen1(monto)}
                                  >
                                    🖋️
                                  </ParrafoAccion>
                                </>
                              ) : (
                                ""
                              )}
                            </CeldasBody>
                          ) : (
                            <CeldasBody></CeldasBody>
                          )
                        ) : (
                          ""
                        )}
                      </Fila>
                    }
                  </React.Fragment>
                );
              })}
            </tbody>
          </Tabla>
        </CajaTabla>
        {modo == "creacion" && datosMontos?.length == 1 ? (
          <CajaBtn>
            <BtnSimple name="agregar" onClick={(e) => agregarMontoOrigen1(e)}>
              Agregar
            </BtnSimple>
          </CajaBtn>
        ) : (
          ""
        )}
        {hasModalOrigen1 && (
          <ContainerModal>
            <CajaModal className={Theme.config.modoClear ? "clearModern" : ""}>
              <Tabla>
                <thead>
                  <Fila
                    className={`
                    cabeza 
                    ${Theme.config.modoClear ? "clearModern" : "  "}
                    `}
                  >
                    <CeldaHead>Costo</CeldaHead>
                    <CeldaHead>Precio</CeldaHead>
                    <CeldaHead>Justificacion</CeldaHead>
                  </Fila>
                </thead>
                <tbody>
                  {datosMontos?.map((monto, index) => {
                    // En esta tabla se coloca una configuracion sencilla de costos, dado a que solo se mostrara la primera fila que corresponde a lo que sale de la formula cuando el usuario de ventas esta creando la solicitud y agregando un monto
                    return (
                      <Fila
                        className={`
                        body
                         ${monto.oficialCaeloss ? "initial" : " body "}
                         ${index % 2 ? "impar" : "par"}
                         
                         `}
                        key={index}
                      >
                        <CeldasBody>
                          {monto.costoManual
                            ? formatoDOP(monto.costoManual)
                            : formatoDOP(
                                monto?.elementos?.reduce(
                                  (suma, ele) => suma + ele.costo,
                                  0
                                )
                              )}
                        </CeldasBody>
                        <CeldasBody>
                          {monto.precioManual
                            ? formatoDOP(monto.precioManual)
                            : formatoDOP(
                                monto?.elementos?.reduce(
                                  (suma, ele) => suma + ele.precio,
                                  0
                                )
                              )}
                        </CeldasBody>

                        <CeldasBody>{monto.justificacion}</CeldasBody>
                      </Fila>
                    );
                  })}
                </tbody>
              </Tabla>
              <BotonQuery valueInput2={valueInput2} />
              <CajitaDetalle>
                <TituloDetalle className={"clearModern"}>
                  Nuevo precio
                </TituloDetalle>
                <InputEditable
                  className={"clearModern"}
                  type="text"
                  value={valueInput2.precioManual}
                  name="precioManual"
                  autoComplete="off"
                  onChange={(e) => {
                    handleInput2(e);
                  }}
                />
              </CajitaDetalle>
              <CajitaDetalle className="cajaDetalles">
                <TituloDetalle
                  className={Theme.config.modoClear ? "clearModern" : ""}
                >
                  Justificacion
                </TituloDetalle>
                <CajaTextArea>
                  <TextArea2
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    type="text"
                    value={valueInput2.justificacion}
                    name="justificacion"
                    autoComplete="off"
                    onChange={(e) => {
                      handleInput2(e);
                    }}
                  />
                </CajaTextArea>
              </CajitaDetalle>
              <CajitaDetalle className="cajaBtn">
                <BtnSimple onClick={(e) => guardarMontoOrigen1(e)}>
                  Guardar1
                </BtnSimple>
                <BtnSimple
                  name="cancelar"
                  className="danger"
                  onClick={(e) => resetMontoOrigen1(e)}
                >
                  Cancelar
                </BtnSimple>
              </CajitaDetalle>
            </CajaModal>
          </ContainerModal>
        )}
        <Alerta
          estadoAlerta={dispatchAlerta}
          tipo={tipoAlerta}
          mensaje={mensajeAlerta}
        />
      </Container>
      {hasModalElementos && (
        <ModalGeneral
          titulo={"Lista de elementos"}
          setHasModal={setHasModalElementos}
          childrenFooter={JSXChildrenFooterModal({
            total:
              "Costo" +
              " " +
              formatoDOP(
                montoSelect?.elementos?.reduce(
                  (acumulador, item) => acumulador + Number(item.costo || 0),
                  0
                )
              ) +
              " " +
              "-" +
              " " +
              "Precio" +
              " " +
              formatoDOP(
                montoSelect?.elementos?.reduce(
                  (acumulador, item) => acumulador + Number(item.precio || 0),
                  0
                )
              ),
          })}
        >
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Descripcion</CeldaHead>
                  <CeldaHead>Costo</CeldaHead>
                  <CeldaHead>Precio</CeldaHead>
                  <CeldaHead>Obs</CeldaHead>
                </FilasGroup>
              </thead>
              <tbody>
                {montoSelect?.elementos?.map((el, index) => {
                  return (
                    <FilasGroup className="body" key={index}>
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody className="startText">
                        {el.descripcion}
                      </CeldasBody>
                      <CeldasBody>{formatoDOP(el.costo)}</CeldasBody>
                      <CeldasBody>{formatoDOP(el.precio)}</CeldasBody>
                      <CeldasBody>{el.obs}</CeldasBody>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </ModalGeneral>
      )}
    </>
  );
}
const Container = styled.div`
  min-height: 120px;
  background-color: ${Tema.secondary.azulProfundo};
  border: 2px solid ${Tema.neutral.blancoHueso};
  border-radius: 8px;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  flex-direction: column;
  position: relative;
  /* overflow: hidden; */
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    border: 1px solid white;
  }
  &.marginBotomn {
    margin-bottom: 300px;
  }
`;
const CajaTabla = styled(CajaTablaGroup)`
  border: none;
`;

const Tabla = styled(TablaGroup)``;

const Fila = styled(FilasGroup)``;

const CeldaHead = styled(CeldaHeadGroup)`
  &.costo {
    min-width: 120px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.accion {
    cursor: pointer;
    display: flex;
    justify-content: space-evenly;
    align-items: center;
  }
  &.textAligStart {
    text-align: start;
  }
`;

const CajaBtn = styled.div`
  display: flex;
  justify-content: center;
`;
const BtnSimple = styled(BtnGeneralButton)``;
const ContainerModal = styled.div`
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  position: absolute;
  background-color: #00000097;
  border-radius: 5px;
`;
const CajaModal = styled.div`
  width: 80%;
  padding: 20px;
  height: 380px;
  border: 1px solid ${Tema.neutral.blancoHueso};
  border-radius: 5px;
  position: fixed;
  top: 0%;
  left: 10%;
  background-color: ${Tema.secondary.azulProfundo};
  z-index: 5;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
    border: 2px solid white;
  }
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.secondary.azulOpaco};

  &.cajaBtn {
    background-color: transparent;
    justify-content: center;
  }

  &.cajaDetalles {
    flex-direction: column;
  }
`;

const TituloDetalle = styled.p`
  width: 50%;
  padding-left: 5px;
  color: ${Tema.neutral.blancoHueso};
  text-align: start;
  &.clearModern {
    color: white;
  }
`;
const InputCelda = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  width: 100%;
`;
const InputEditable = styled(InputCelda)`
  height: 30px;
  width: 50%;
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;

  &.celda {
    width: 100%;
  }
  &.creacion {
    background-color: ${Tema.primary.grisNatural};
  }
`;

const TextArea2 = styled(TextArea)``;
const CajaTextArea = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
`;
const ParrafoAccion = styled.p`
  cursor: pointer;
  border: 1px solid ${Tema.complementary.danger};
  padding: 3px;
  font-size: 0.8rem;
  transition: ease 0.1s all;
  &:hover {
    border-radius: 4px;
  }
`;
const WrapTable = styled.div`
  height: 300px;
`;
