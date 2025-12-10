import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton.jsx";
import { formatoDOP, soloNumeros } from "../../../libs/StringParsed.jsx";

import { ClearTheme, Tema, Theme } from "../../../config/theme.jsx";
import { ES6AFormat } from "../../../libs/FechaFormat.jsx";
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
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { BotonQuery } from "../../../components/BotonQuery.jsx";
import { useLocation } from "react-router-dom";
import { montoSchemaViejo } from "../../schemas/montosSchema.js";
import { vehiculosSchema } from "../../schemas/vehiculosSchema.js";

export default function MontosReqViejo({
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

  const [hasModal, setHasModal] = useState(false);

  const initialValue = {
    costo: "",
    precio: "",
    justificacion: "",
    ejecucion: null,
  };
  const [valueInput, setValueInput] = useState(initialValue);

  const location = useLocation();
  const rutaActual = location.pathname;
  const ultimaParte = rutaActual.split("/").filter(Boolean).pop();
  const [currentPage, setCurrentPage] = useState(ultimaParte);
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name == "precio" || name == "costo") {
      if (soloNumeros(value)) {
        const valorParsed = Number(value);
        setValueInput({
          ...valueInput,
          [name]: valorParsed,
        });
      }
    } else if (name == "justificacion") {
      setValueInput({
        ...valueInput,
        justificacion: value,
      });
    }
  };
  const manejarModal = (e) => {
    const { name } = e.target;
    const precioParsed = valueInput.precio == "" ? 0 : valueInput.precio;
    const costoParsed = valueInput.costo == "" ? 0 : valueInput.costo;

    if (
      // valueInput.precio == "" ||
      // valueInput.precio < 0 ||
      valueInput.justificacion == "" &&
      name == "guardar"
    ) {
      setMensajeAlerta("Agregar nuevo precio y justificacion.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    }

    if (name == "guardar") {
      if (datosMontos.length > 1) {
        return "";
      }

      // si solamente tenemos un solo monto, dado que al crear solo debe permitir agregar un solo monto y este editarlo
      if (datosMontos.length == 1) {
        const auxMonto = [
          ...datosMontos,
          {
            ...montoSchemaViejo,
            tipo: 1,
            costo: datosMontos[0].costo,
            precio: precioParsed,
            justificacion: valueInput.justificacion,
            usuario: userMaster.userName,
            codeVehiculo: datosFlete.vehiculoSeleccionado.code,
            codeVehiculosAdd: [],
            fecha: ES6AFormat(new Date()),
            vehiculosAdd: datosFlete?.vehiculosAdicionales,
          },
        ];
        setDatosMontos(auxMonto);
        setMontosEditando(null);
        setHasModal(false);
        setValueInput({ ...initialValue });
      }
    } else if (name == "cancelar") {
      setMontosEditando(null);
      setHasModal(false);
      if (tipoModal == "agregar") {
        setValueInput({ ...initialValue });
      } else if (tipoModal == "editar") {
        setValueInput({ ...initialValue });
        setDatosMontos([...datosMontos, montosEditando]);
      }
    }
  };

  const handleAccion = (e) => {
    const { name, index } = e.target.dataset;
    if (name == "quitar") {
      if (modo == "edicion") {
        return;
      }
    }
    if (datosMontos[index].usuario != userMaster.userName) {
      setMensajeAlerta("No creado por su usuario.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return "";
    } else if (datosMontos[index].usuario == userMaster.userName) {
      if (datosMontos.length == 2 && datosMontos[index].tipo == 1) {
        if (name == "quitar") {
          const datosAux = datosMontos.filter((monto, i) => {
            if (i != index) {
              return monto;
            }
          });
          setDatosMontos(datosAux);
        }
      }
    }
  };
  const [tipoModal, setTipoModal] = useState({});
  const [montosEditando, setMontosEditando] = useState(null);
  const mostrarModal = (e) => {
    const name = e?.target?.name || e.target.dataset.name;
    setTipoModal(name);
    setHasModal(true);

    if (name == "editar") {
      const mondoEditar = { ...datosMontos[1] };
      setValueInput({
        ...mondoEditar,
      });
      setDatosMontos([datosMontos[0]]);
      setMontosEditando(mondoEditar);
    }
  };
  // ***************************
  return (
    <Container
      className={`
    ${modo}
    ${hasModal ? "marginBotomn" : ""}
    ${Theme.config.modoClear ? "clearModern" : ""}
    `}
    >
      <BotonQuery datosMontos={datosMontos} />
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
              // ******** SI ESTAMOS CREANDO UNA NUEVA REQ ******
              // ******** SI ESTAMOS CREANDO UNA NUEVA REQ ******
              // En esta tabla se debe tomar en cuenta varias cosas para imprimir los montos:
              // *****La primera fila*****
              // Esta sera sencilla ya que siempre sera la de la formula oficial, la cual sera la siguiente manera:
              // 1-Tiene varios camiones--->Entonces suma el costo y precio oficial mas los de cada camion
              // 2-No tiene varios camiones--->Entonces solo muestra el costo y precio oficial
              //
              // *****La segunda fila*****
              // Se debe tomar en cuenta varias cosas:
              // **Se esta creando una nueva solicitud o se esta visualizando
              // 1-Creando una nueva solicitud

              //
              // ******** SI ESTAMOS CREANDO UNA NUEVA REQ ******
              // ******** SI ESTAMOS CREANDO UNA NUEVA REQ ******
              //
              // *****La primera fila*****
              // Sera igual que creando una nueva req
              //
              // *****Las demas filas*****
              // *****Las demas filas*****
              // *****Las demas filas*****
              //
              // Ojo: la segunda fila puede ser agregada por ventas o por logisticas
              // ***Fila agregada por el usuario de ventas en la creacion****
              // La celda costo mostrara el costo oficial mas el costo de cada camion si existiecen camiones adicionales

              // *** Filas agregada por logistica ****
              // Se mostrara el costo y el precio oficial de manera llana es decir sin sumar los montos de cada vehiculo adicional, dado a que esto es colocado manualmente
              //

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
                        {
                          //  COSTO
                          //  0-Si es de tipo formula
                          //  1-Si es de manual creacion ventas
                          monto.tipo == 0 || monto.tipo == 1
                            ? monto.vehiculosAdd
                              ? monto.vehiculosAdd?.length === 0
                                ? formatoDOP(monto.costo)
                                : formatoDOP(
                                    monto.vehiculosAdd?.reduce(
                                      (accumulator, currentValue) =>
                                        accumulator +
                                        currentValue.resultado.costo,
                                      0
                                    ) + monto.costo
                                  )
                              : formatoDOP(monto.costo)
                            : ""
                        }
                        {
                          //  2-Si es de manual edicion logistica/adm
                          monto.tipo == 2 ? formatoDOP(monto.costo) : ""
                        }
                      </CeldasBody>
                      <CeldasBody>
                        {
                          //  PRECIO
                          //  0-Si es de tipo formula
                          monto.tipo == 0
                            ? monto.vehiculosAdd
                              ? monto.vehiculosAdd?.length === 0
                                ? formatoDOP(monto.precio)
                                : formatoDOP(
                                    monto.vehiculosAdd?.reduce(
                                      (accumulator, currentValue) =>
                                        accumulator +
                                        currentValue.resultado.precio,
                                      0
                                    ) + monto.precio
                                  )
                              : formatoDOP(monto.precio)
                            : ""
                        }
                        {
                          //  1-Si es de manual creacion ventas
                          //  2-Si es de manual edicion logistica/adm
                          monto.tipo == 1 || monto.tipo == 2
                            ? formatoDOP(monto.precio)
                            : ""
                        }
                      </CeldasBody>
                      <CeldasBody>{monto.usuario}</CeldasBody>
                      <CeldasBody title={monto.justificacion}>
                        {monto.justificacion}
                      </CeldasBody>
                      <CeldasBody>
                        {monto.tipo == 0
                          ? "Formula"
                          : monto.tipo == 1
                            ? "Manual Solicitante"
                            : monto.tipo == 2
                              ? "Manual Adm"
                              : ""}
                      </CeldasBody>
                      <CeldasBody className="textAligStart">
                        {monto.vehiculosAdd?.length === 0 &&
                          vehiculosSchema.find(
                            (vehiculo) => vehiculo.code === monto.codeVehiculo
                          )?.descripcion}

                        {monto.vehiculosAdd?.length > 0 && (
                          <>
                            {"1-" +
                              vehiculosSchema.find(
                                (vehiculo) =>
                                  vehiculo.code === monto.codeVehiculo
                              )?.descripcion}
                            <br />
                            {monto.vehiculosAdd?.map((vehiculo, index) => (
                              <React.Fragment key={index}>
                                {index + 2 + "-"}
                                {vehiculo.descripcion}
                                <br />
                              </React.Fragment>
                            ))}
                          </>
                        )}
                      </CeldasBody>
                      <CeldasBody>{monto?.aprobadoPor}</CeldasBody>

                      {modo == "creacion" ? (
                        monto.tipo > 0 ? (
                          <CeldasBody className="accion">
                            {modo == "creacion" ? (
                              <>
                                <ParrafoAccion
                                  onClick={(e) => handleAccion(e)}
                                  data-name="quitar"
                                  data-index={index}
                                >
                                  ❌
                                </ParrafoAccion>
                                <ParrafoAccion
                                  onClick={(e) => mostrarModal(e)}
                                  data-name="editar"
                                  data-index={index}
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
          <BtnSimple name="agregar" onClick={(e) => mostrarModal(e)}>
            Agregar
          </BtnSimple>
        </CajaBtn>
      ) : (
        ""
      )}
      {hasModal && (
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
                  <CeldaHead>Usuario</CeldaHead>
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
                        {monto.vehiculosAdd?.length === 0
                          ? monto.costo
                          : formatoDOP(
                              monto.vehiculosAdd?.reduce(
                                (accumulator, currentValue) =>
                                  accumulator + currentValue.resultado.costo,
                                0
                              ) + monto.costo
                            )}
                      </CeldasBody>
                      <CeldasBody>
                        {monto.vehiculosAdd?.length === 0
                          ? monto.precio
                          : formatoDOP(
                              monto.vehiculosAdd?.reduce(
                                (accumulator, currentValue) =>
                                  accumulator + currentValue.resultado.precio,
                                0
                              ) + monto.precio
                            )}
                      </CeldasBody>
                      <CeldasBody>
                        {monto.oficialCaeloss ? "Caeloss" : monto.usuario}
                      </CeldasBody>
                      <CeldasBody>
                        {monto.oficialCaeloss ? "Initial" : monto.justificacion}
                      </CeldasBody>
                    </Fila>
                  );
                })}
              </tbody>
            </Tabla>
            <CajitaDetalle>
              <TituloDetalle
                className={Theme.config.modoClear ? "clearModern" : ""}
              >
                Nuevo precio
              </TituloDetalle>
              <InputEditable
                className={Theme.config.modoClear ? "clearModern" : ""}
                type="text"
                value={valueInput.precio}
                name="precio"
                autoComplete="off"
                onChange={(e) => {
                  handleInput(e);
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
                  value={valueInput.justificacion}
                  name="justificacion"
                  autoComplete="off"
                  onChange={(e) => {
                    handleInput(e);
                  }}
                />
              </CajaTextArea>
            </CajitaDetalle>
            <CajitaDetalle className="cajaBtn">
              <BtnSimple name="guardar" onClick={(e) => manejarModal(e)}>
                Guardar
              </BtnSimple>
              <BtnSimple
                name="cancelar"
                className="danger"
                onClick={(e) => manejarModal(e)}
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
