import { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
  TextArea,
} from "../../../components/InputGeneral.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { BotonQuery } from "../../../components/BotonQuery.jsx";
import { Link } from "react-router-dom";
import { faPlus, faSave, faXmark } from "@fortawesome/free-solid-svg-icons";
import {
  fetchDocsByConditionGetDocs,
  useDocByCondition,
} from "../../../libs/useDocByCondition.js";

import TablaProporcionCarga from "./../TablaProporcionCarga.jsx";
import MenuPestannias from "../../../components/MenuPestannias.jsx";
import { OpcionUnica } from "../../../components/OpcionUnica.jsx";
import { ClearTheme, Tema, Theme } from "../../../config/theme.jsx";
import { hoyManniana } from "../../../libs/FechaFormat.jsx";
import { ModalLoading } from "../../../components/ModalLoading.jsx";
import { Alerta } from "../../../components/Alerta.jsx";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton.jsx";

import { formatoDOP } from "../../../libs/StringParsed.jsx";
import TextoEptyG from "../../../components/TextoEptyG.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla.jsx";
import { StyleTextStateReq } from "../../libs/DiccionarioNumberString.js";
import MontosReqNuevo from "./MontosReqNuevo.jsx";
import MontosReqViejo from "./MontosReqViejo.jsx";
import { diccionarioStatusAyudanteInRequest } from "../../schemas/ayudanteAddSchema.js";
import { vehiculosSchema } from "../../schemas/vehiculosSchema.js";

export default function ModalAccionesReq({
  requestMaster,
  requestEditable,
  userMaster,
  handleAcciones,
  congloAcciones,
  setCongloAcciones,
  hasDesplegableParentesco,
  hasIncoherencia,
  setRequestEditable,
  listaAyudantesAdicionales,
  setListaAyudantesAdicionales,
}) {
  // *********************** RECURSOS GENERALES ***********************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // ************************** PESTAÑAS DEL MENU **************************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Vehiculo",
      select: false,
      permisoCode: ["changeDriverTMS"],
    },
    {
      nombre: "Montos",
      select: false,
      permisoCode: ["addMontoTMS"],
    },
    {
      nombre: "Relacion",
      select: false,
      permisoCode: ["modifiedRelationTMS"],
    },
    {
      nombre: "Reset",
      select: false,
      permisoCode: ["defaultStateRequestTMS", "defaultPagosTMS"],
    },
    {
      nombre: "Aprobaciones",
      select: false,
      permisoCode: ["approvedPriceChangesAdd"],
    },
    {
      nombre: "Esquemas",
      select: false,
      permisoCode: ["editSchemaReg"],
    },
  ]);
  useEffect(() => {
    const pestaniaAux = arrayOpciones.filter((opcion, index) => {
      const tieneUnPermiso = userMaster.permisos.some((item) =>
        opcion.permisoCode.includes(item)
      );
      if (tieneUnPermiso) {
        return { ...opcion };
      }
    });
    console.log(pestaniaAux);
    setArrayOpciones([...pestaniaAux]);
  }, []);

  //
  const handlePestannias = async (e) => {
    const { name } = e.target;
    let index = Number(e.target.dataset.id);
    console.log(name);
    if (name == "Vehiculo") {
      const hasPermiso = userMaster.permisos.includes("changeDriverTMS");
      if (!hasPermiso) {
        setMensajeAlerta("No posee los permisos necesarios.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    } else if (name == "Montos") {
      const hasPermiso = userMaster.permisos.includes("addMontoTMS");
      if (!hasPermiso) {
        setMensajeAlerta("No posee los permisos necesarios.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
      if (requestMaster.familia.parentesco == 1) {
        setMensajeAlerta("No puedes agregar montos a una solicitud hija.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    } else if (name == "Relacion") {
      const hasPermiso = userMaster.permisos.includes("modifiedRelationTMS");
      if (!hasPermiso) {
        setMensajeAlerta("No posee los permisos necesarios.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }

      if (requestMaster.tipo != 1) {
        setMensajeAlerta(
          "Solo se permite relacionar, solicitudes de tipo traslado."
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    } else if (name == "Reset") {
      const canResetPagos = userMaster.permisos.includes("defaultPagosTMS");
      const canResetEstadoReq = userMaster.permisos.includes(
        "defaultStateRequestTMS"
      );

      if (!canResetPagos && !canResetEstadoReq) {
        console.log("asss");
        setMensajeAlerta("No posee los permisos necesarios.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return "";
      }
    } else if (name == "Aprobaciones") {
      const hasPermiso = userMaster.permisos.includes(
        "approvedPriceChangesAdd"
      );
      if (!hasPermiso) {
        setMensajeAlerta("No posee los permisos necesarios.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 3000);
        return;
      }
    } else if (name == "Esquemas") {
      const ayudAddAux = await fetchDocsByConditionGetDocs(
        "choferes",
        undefined,
        "isAyudante",
        "==",
        true
      );
      setListaAyudantesAdicionales(
        ayudAddAux.map((ayuAdd) => {
          return {
            ...ayuAdd,
            valueInput: "",
          };
        })
      );
    }
    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };

  // ***************************  RELACION ***************************
  // Este bloque de codigo, evalue que es necesario que permanezca dentro de este componente hijo
  // traeme las solicitudes hijas
  const [listaDBHijasAux, setListaDBHijasAux] = useState([]);
  useDocByCondition(
    "transferRequest",
    setListaDBHijasAux,
    "familia.solicitudMadre.id",
    "==",
    requestMaster.id
  );
  useEffect(() => {
    if (listaDBHijasAux.length > 0) {
      setCongloAcciones((prevState) => ({
        ...prevState,
        relacion: {
          ...prevState.relacion,
          listaDBHijas: listaDBHijasAux,
        },
      }));
    }
  }, [listaDBHijasAux]);

  const [hasTablaProporcion, setHasTablaProporcion] = useState(false);

  // General fracion de barras
  const divPadreRef = useRef(null);
  const [hijasPrint, setHijasPrint] = useState([]);
  const [totalPorcentaje, setTotalPorcentaje] = useState(0);

  const coloresHijos = [
    Tema.primary.azulBrillante,
    Tema.complementary.danger,
    Tema.complementary.warning,
    Tema.secondary.azulProfundo,
  ];
  useEffect(() => {
    const listaDBHijas = congloAcciones.relacion.listaDBHijas;
    setTimeout(() => {
      let anchoPadre = 0;
      let porcentajeOcupado = 0;
      if (divPadreRef.current) {
        anchoPadre = divPadreRef.current.getBoundingClientRect().width;
      }

      const listaHijasPrint = listaDBHijas.map((hija, index) => {
        const porcentajeFraccionario = Number(
          (
            hija.datosFlete.vehiculoSeleccionado.fraccionesCarga /
            requestMaster.datosFlete.vehiculoSeleccionado.fraccionesCarga
          ).toFixed(2)
        );
        const anchoPixeles = porcentajeFraccionario * anchoPadre;
        const anchoPorcentaje = porcentajeFraccionario * 100;
        porcentajeOcupado = porcentajeOcupado + anchoPorcentaje;
        return {
          id: hija.id,
          numero: hija.numeroDoc,

          anchoPixeles: anchoPixeles,
          anchoPorcentaje: anchoPorcentaje,
          nombreSolicitante: hija.datosSolicitante.nombre,
          apellidoSolicitante: hija.datosSolicitante.apellido,
        };
      });
      setTotalPorcentaje(porcentajeOcupado);
      setHijasPrint(listaHijasPrint);
    }, 1500);
  }, [congloAcciones.relacion.listaDBHijas, requestMaster]); // Sin `divPadreRef` como dependencia

  // **************************** ESQUEMAS ****************************
  useEffect(() => {
    const ayudantesConValueInput =
      requestEditable?.datosFlete?.ayudantesAdicionales?.map((ayuAdd) => {
        return {
          ...ayuAdd,
          datosAyudante: {
            ...ayuAdd.datosAyudante,
            valueInput: "",
          },
        };
      });

    setRequestEditable({
      ...requestEditable,
      datosFlete: {
        ...requestEditable.datosFlete,
        ayudantesAdicionales: ayudantesConValueInput,
      },
    });
  }, []);
  //
  const editarEsquema = () => {
    const hasPermiso = userMaster.permisos.includes("auditAyudanteEsquemas");
    if (!hasPermiso) {
      return;
    }

    const requesAux = {
      ...requestEditable,
      datosFlete: {
        ...requestEditable.datosFlete,
        ayudantesAdicionales:
          requestEditable.datosFlete.ayudantesAdicionales.map((ayudante) => {
            let apellidoParsedConEspacio = ayudante.datosAyudante.apellido
              ? " " + ayudante.datosAyudante.apellido
              : "";
            return {
              ...ayudante,
              datosAyudante: {
                ...ayudante.datosAyudante,
                valueInput:
                  ayudante.datosAyudante.nombre + apellidoParsedConEspacio,
              },
            };
          }),
      },
    };

    setRequestEditable(requesAux);

    setCongloAcciones((prevState) => ({
      ...prevState,
      esquemas: {
        ...prevState.esquemas,
        editable: true,
      },
    }));
  };
  //
  const editarEsquemaVehAdd = (e) => {
    const hasPermiso = userMaster.permisos.includes("auditAyudanteEsquemas");
    if (!hasPermiso) {
      return;
    }
    const indexDataset = e.target.dataset.index;
    // 7878
    const requesAux = {
      ...requestEditable,
      datosFlete: {
        ...requestEditable.datosFlete,
        vehiculosAdicionales:
          requestEditable.datosFlete.vehiculosAdicionales.map((vehiAdd) => {
            const ayudantesAdicionales = vehiAdd.ayudantesAdicionales.map(
              (ayudante) => {
                const apellidoParsedConEspacio = ayudante.datosAyudante.apellido
                  ? " " + ayudante.datosAyudante.apellido
                  : "";
                return {
                  ...ayudante,
                  datosAyudante: {
                    ...ayudante.datosAyudante,
                    valueInput:
                      ayudante.datosAyudante.nombre + apellidoParsedConEspacio,
                  },
                };
              }
            );

            return {
              ...vehiAdd,
              ayudantesAdicionales: ayudantesAdicionales,
            };
          }),
      },
    };

    setRequestEditable(requesAux);

    setCongloAcciones((prevState) => ({
      ...prevState,
      esquemas: {
        ...prevState.esquemas,
        editableVehiAdd: requestEditable.datosFlete.vehiculosAdicionales.map(
          (vehi, index) => {
            return index == indexDataset;
          }
        ),
      },
    }));
  };

  const cancelarEdicionRevisionEsquema = () => {
    setRequestEditable({ ...requestMaster });
    setCongloAcciones((prevState) => ({
      ...prevState,
      esquemas: {
        ...prevState.esquemas,
        editable: false,
        enRevision: false,
        editableVehiAdd: prevState.esquemas.editableVehiAdd.map(
          (edicion) => false
        ),
        revisionVehAdd: prevState.esquemas.revisionVehAdd.map(
          (edicion) => false
        ),
      },
    }));
  };

  const parsearChofer = (nombre, apellido) => {
    if (apellido) {
      return nombre + " " + apellido;
    } else {
      return nombre;
    }
  };

  // *********************** APROBACIONES ***********************
  const [pantallasAprobaciones, setPantallasAprobaciones] = useState([
    {
      nombre: "Pago manual",
      select: true,
      codigoInterno: "pagoManual",
    },
    {
      nombre: "Ayudante adicional",
      select: false,
      codigoInterno: "ayudanteAdicional",
    },
  ]);
  const handleOpcionesAprobaciones = (e) => {
    const indexDataset = e.target.dataset.id;
    console.log(indexDataset);
    setPantallasAprobaciones(
      pantallasAprobaciones.map((pantalla, index) => {
        return {
          ...pantalla,
          select: index == indexDataset,
        };
      })
    );
  };

  return (
    <Container>
      <BotonQuery
        congloAcciones={congloAcciones}
        requestEditable={requestEditable}
        requestMaster={requestMaster}
        listaAyudantesAdicionales={listaAyudantesAdicionales}
      />
      <CajaBarraOpciones>
        <MenuPestannias
          arrayOpciones={arrayOpciones}
          handlePestannias={handlePestannias}
        />
      </CajaBarraOpciones>
      {arrayOpciones.find((opcion) => opcion.select)?.nombre == "Vehiculo" &&
        userMaster.permisos.includes("changeDriverTMS") &&
        (requestMaster.estadoDoc == -1 ? (
          <TextoEptyG
            texto={"~ No disponible para solicitudes en estado de borrador ~"}
          />
        ) : (
          <WrapInternalContenido>
            <CajaSubWrapInternal
              className={`vehiculo ${Theme.config.modoClear ? "clearModern" : ""}`}
            >
              <WrapEdiciones className="vehiculo ">
                <CajaIzqEdiciones>
                  <CajitaDetalle className="detalles">
                    <TituloDetalle>Tipo de vehiculo:</TituloDetalle>
                    <MenuDesplegableSimple
                      className={Theme.config.modoClear ? "clearModern" : ""}
                      value={
                        requestEditable.datosFlete.vehiculoSeleccionado
                          .descripcion
                      }
                      autoComplete="off"
                      name="vehiculo"
                      data-tipo="vehiculo"
                      data-nivelvehiculo="default"
                      onChange={(e) => {
                        handleAcciones(e);
                      }}
                    >
                      {vehiculosSchema.map((veh, index) => {
                        return (
                          <Opciones
                            className={
                              Theme.config.modoClear ? "clearModern" : ""
                            }
                            key={index}
                            value={veh.descripcion}
                          >
                            {veh.descripcion}
                          </Opciones>
                        );
                      })}
                    </MenuDesplegableSimple>{" "}
                    <TituloLow>Montos previo:</TituloLow>
                    <CajitaDetalle>
                      <TituloDetalle className="oneLine">
                        Costo Caeloss:
                      </TituloDetalle>
                      <DetalleTexto>
                        {formatoDOP(requestMaster?.datosFlete.costo)}
                      </DetalleTexto>
                    </CajitaDetalle>
                    <CajitaDetalle>
                      <TituloDetalle className="oneLine">
                        Precio Caeloss:
                      </TituloDetalle>
                      <DetalleTexto>
                        {formatoDOP(requestMaster?.datosFlete.precio)}
                      </DetalleTexto>
                    </CajitaDetalle>
                    <TituloLow>Montos nuevos:</TituloLow>
                    <CajitaDetalle>
                      <TituloDetalle className="oneLine">
                        Costo Caeloss:
                      </TituloDetalle>
                      <DetalleTexto>
                        {formatoDOP(requestEditable?.datosFlete.costo)}
                      </DetalleTexto>
                    </CajitaDetalle>
                    <CajitaDetalle>
                      <TituloDetalle className="oneLine">
                        Precio Caeloss:
                      </TituloDetalle>
                      <DetalleTexto>
                        {formatoDOP(requestEditable?.datosFlete.precio)}
                      </DetalleTexto>
                    </CajitaDetalle>
                  </CajitaDetalle>
                  <CajitaDetalle className="detalles mgBottom">
                    <TituloDetalle>Justificacion</TituloDetalle>
                    <CajaTextArea>
                      <TextAreaJus
                        className={Theme.config.modoClear ? "clearModern" : ""}
                        type="text"
                        value={congloAcciones.vehiculo.justificacion}
                        name="justificacion"
                        data-tipo="vehiculo"
                        autoComplete="off"
                        data-nivelvehiculo="default"
                        onChange={(e) => {
                          handleAcciones(e);
                        }}
                      />
                    </CajaTextArea>
                  </CajitaDetalle>
                </CajaIzqEdiciones>
                <CajaInternaFlete className="izquierda">
                  <ImgSimple
                    src={
                      requestEditable.datosFlete.vehiculoSeleccionado.urlFoto
                    }
                  />
                  <TextoCamion>
                    {
                      requestEditable.datosFlete.vehiculoSeleccionado
                        .descripcion
                    }
                  </TextoCamion>
                </CajaInternaFlete>
              </WrapEdiciones>
              <br />
              <br />
              <br />
              <br />
              <TituloVA>Vehiculos adicionales</TituloVA>
              {requestEditable?.datosFlete?.vehiculosAdicionales?.length > 0 ? (
                <>
                  {requestEditable?.datosFlete?.vehiculosAdicionales?.map(
                    (vehiculo, index) => {
                      return (
                        <WrapEdiciones className="vehiculo " key={index}>
                          <CajaIzqEdiciones>
                            <CajitaDetalle className="detalles">
                              <TituloDetalle>Tipo de vehiculo:</TituloDetalle>
                              <MenuDesplegableSimple
                                className={
                                  Theme.config.modoClear ? "clearModern" : ""
                                }
                                value={
                                  requestEditable?.datosFlete
                                    ?.vehiculosAdicionales[index]?.descripcion
                                }
                                autoComplete="off"
                                name="vehiculo"
                                data-tipo="vehiculo"
                                data-nivelvehiculo="adcional"
                                data-index={index}
                                onChange={(e) => {
                                  handleAcciones(e);
                                }}
                              >
                                {vehiculosSchema.map((veh, index) => {
                                  return (
                                    <Opciones
                                      className={
                                        Theme.config.modoClear
                                          ? "clearModern"
                                          : ""
                                      }
                                      key={index}
                                      value={veh.descripcion}
                                    >
                                      {veh.descripcion}
                                    </Opciones>
                                  );
                                })}
                              </MenuDesplegableSimple>{" "}
                              <TituloLow>Montos previo:</TituloLow>
                              <CajitaDetalle>
                                <TituloDetalle className="oneLine">
                                  Costo Caeloss:
                                </TituloDetalle>
                                <DetalleTexto>
                                  {formatoDOP(vehiculo?.resultado?.costo)}
                                </DetalleTexto>
                              </CajitaDetalle>
                              <CajitaDetalle>
                                <TituloDetalle className="oneLine">
                                  Precio Caeloss:
                                </TituloDetalle>
                                <DetalleTexto>
                                  {/* {requestMaster?.datosFlete.precio} */}
                                  {formatoDOP(vehiculo?.resultado?.precio)}
                                </DetalleTexto>
                              </CajitaDetalle>
                            </CajitaDetalle>
                          </CajaIzqEdiciones>
                          <CajaInternaFlete className="izquierda adiciona">
                            <ImgSimple
                              className="adiciona"
                              src={vehiculo.urlFoto}
                            />
                            <TextoCamion>{vehiculo.descripcion}</TextoCamion>
                          </CajaInternaFlete>
                        </WrapEdiciones>
                      );
                    }
                  )}
                </>
              ) : (
                <TextoEptyG texto={" ~ Sin vehiculos adicionales. ~"} />
              )}
            </CajaSubWrapInternal>
            {requestMaster.estadoDoc <= 1 && (
              <CajaBotonGuardar>
                <BtnSimple
                  name="addVehiculo"
                  data-tipo="vehiculo"
                  onClick={(e) => {
                    handleAcciones(e);
                  }}
                >
                  +
                </BtnSimple>
                <BtnSimple
                  name="minusVehiculo"
                  data-tipo="vehiculo"
                  onClick={(e) => {
                    handleAcciones(e);
                  }}
                >
                  -
                </BtnSimple>
                <BtnSimple
                  name="guardar"
                  data-tipo="vehiculo"
                  onClick={(e) => {
                    handleAcciones(e);
                  }}
                >
                  Guardar
                </BtnSimple>
              </CajaBotonGuardar>
            )}
          </WrapInternalContenido>
        ))}

      {arrayOpciones.find((opcion) => opcion.select)?.nombre == "Montos" &&
        userMaster.permisos.includes("addMontoTMS") &&
        (requestMaster.estadoDoc == -1 ? (
          <TextoEptyG
            texto={"~ No disponible para solicitudes en estado de borrador ~"}
          />
        ) : (
          <WrapInternalContenido>
            <CajaSubWrapInternal
              className={Theme.config.modoClear ? "clearModern" : ""}
            >
              {requestMaster.datosMontos[0]?.nuevoFormato ? (
                <MontosReqNuevo
                  datosMontos={requestMaster.datosMontos}
                  userMaster={userMaster}
                  datosFlete={requestMaster.datosFlete}
                  modo={"edicion"}
                />
              ) : (
                <MontosReqViejo
                  datosMontos={requestMaster.datosMontos}
                  userMaster={userMaster}
                  datosFlete={requestMaster.datosFlete}
                  modo={"edicion"}
                />
              )}
              {requestMaster.estadoDoc <= 1 && (
                <ContainerInputsMontos>
                  <TituloInputsMontos>Agregar nuevo monto</TituloInputsMontos>
                  <CajaInputsMontos>
                    <CajitaInputsMontos>
                      <InputCelda
                        placeholder="Costo"
                        name="costoManual"
                        data-tipo="montos"
                        value={congloAcciones.montos.costoManual}
                        autoComplete="off"
                        onChange={(e) => handleAcciones(e)}
                        disabled={requestMaster.familia.parentesco == 1}
                        className={`
                    ${requestMaster.familia.parentesco == 1 ? "disabled" : ""}
                    ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                      />
                    </CajitaInputsMontos>
                    <CajitaInputsMontos>
                      <InputCelda
                        placeholder="Precio"
                        name="precioManual"
                        data-tipo="montos"
                        value={congloAcciones.montos.precioManual}
                        autoComplete="off"
                        onChange={(e) => handleAcciones(e)}
                        disabled={requestMaster.familia.parentesco == 1}
                        className={`
                                         ${
                                           requestMaster.familia.parentesco == 1
                                             ? "disabled"
                                             : ""
                                         }
                                         ${Theme.config.modoClear ? "clearModern" : ""}
                                            `}
                      />
                    </CajitaInputsMontos>
                    <CajitaInputsMontos>
                      {" "}
                      <TextAreaJus
                        placeholder="Justificacion"
                        name="justificacion"
                        data-tipo="montos"
                        // className="celda"
                        value={congloAcciones.montos.justificacion}
                        autoComplete="off"
                        onChange={(e) => handleAcciones(e)}
                        disabled={requestMaster.familia.parentesco == 1}
                        className={`
                                                                    ${
                                                                      requestMaster
                                                                        .familia
                                                                        .parentesco ==
                                                                      1
                                                                        ? "disabled celda"
                                                                        : ""
                                                                    }
                                                                    ${Theme.config.modoClear ? "clearModern" : ""}
                                                                    `}
                      />
                    </CajitaInputsMontos>
                  </CajaInputsMontos>
                </ContainerInputsMontos>
              )}
            </CajaSubWrapInternal>
            {requestMaster.estadoDoc <= 1 && (
              <CajaBotonGuardar>
                <BtnSimple
                  data-tipo="montos"
                  name="guardar"
                  onClick={(e) => {
                    handleAcciones(e);
                  }}
                >
                  Agregar
                </BtnSimple>
              </CajaBotonGuardar>
            )}
          </WrapInternalContenido>
        ))}

      {arrayOpciones.find((opcion) => opcion.select)?.nombre == "Relacion"
        ? userMaster.permisos.includes("modifiedRelationTMS") &&
          (requestMaster.estadoDoc == -1 ? (
            <TextoEptyG
              texto={"~ No disponible para solicitudes en estado de borrador ~"}
            />
          ) : (
            <WrapInternalContenido>
              {requestMaster.tipo == 1 && (
                <>
                  <CajaSubWrapInternal
                    className={`
${Theme.config.modoClear ? "clearModern" : ""}

            `}
                  >
                    <CajaEncabezadoRelacion>
                      <CajaInternaEncabezado className="superior">
                        <CajitaDetalle className="parentesco">
                          <TituloDetalle>Tipo de parentesco:</TituloDetalle>
                          <DetalleTexto className="parentesco">
                            {requestMaster?.familia.parentesco == 0
                              ? "Madre"
                              : requestMaster?.familia.parentesco == 1
                                ? "Hija"
                                : "Sin definir"}
                          </DetalleTexto>
                        </CajitaDetalle>

                        {hasDesplegableParentesco == true ? (
                          <>
                            <BtnSimple
                              className="sinMargin danger"
                              name="cancelar"
                              onClick={(e) => handleAcciones(e)}
                              data-tipo="relacion"
                            >
                              <Icono icon={faXmark} />
                              Cancelar
                            </BtnSimple>
                            <BtnSimple
                              className="sinMargin"
                              name="guardar"
                              onClick={(e) => handleAcciones(e)}
                              data-tipo="relacion"
                            >
                              <Icono
                                name="guardar"
                                dataset-name="guardar"
                                onClick={(e) => handleAcciones(e)}
                                data-tipo="relacion"
                                icon={faSave}
                              />
                              Guardar
                            </BtnSimple>
                          </>
                        ) : (
                          userMaster.permisos.includes("addMontoTMS") && (
                            <BtnSimple
                              className="sinMargin"
                              name="cambiar"
                              onClick={(e) => handleAcciones(e)}
                              data-tipo="relacion"
                            >
                              Cambiar
                            </BtnSimple>
                          )
                        )}
                      </CajaInternaEncabezado>

                      {hasDesplegableParentesco && (
                        <CajaInternaEncabezado>
                          <MenuDesplegableSimple
                            className={
                              Theme.config.modoClear ? "clearModern" : ""
                            }
                            value={congloAcciones.relacion.valueDesplegable}
                            name="valueDesplegable"
                            data-tipo="relacion"
                            onChange={(e) => handleAcciones(e)}
                          >
                            <Opciones
                              value={""}
                              disabled
                              className={
                                Theme.config.modoClear ? "clearModern" : ""
                              }
                            >
                              Seleccion parentesco
                            </Opciones>
                            <Opciones
                              value={0}
                              className={
                                Theme.config.modoClear ? "clearModern" : ""
                              }
                            >
                              Madre
                            </Opciones>
                            <Opciones
                              value={1}
                              className={
                                Theme.config.modoClear ? "clearModern" : ""
                              }
                            >
                              Hija
                            </Opciones>
                          </MenuDesplegableSimple>
                        </CajaInternaEncabezado>
                      )}
                    </CajaEncabezadoRelacion>
                    {/* Esta advertencia nunca deberia mostrarse, dado a que la app no debe permitir agregar hijas que igualen o sobre pasen la cantidad de fracciones de la madre. */}
                    {hasIncoherencia && (
                      <CajAdvertencia>
                        <TituloTablaRelacion className="warning">
                          La sumatoria de las fracciones de las hijas, debe ser
                          menor a la cantidad de fracciones de la solicitud
                          madre.
                        </TituloTablaRelacion>
                        <SubtituloAdver>
                          Esta solicitud madre se esta realizando con{" "}
                          {
                            requestMaster.datosFlete.vehiculoSeleccionado
                              .descripcion
                          }{" "}
                          por lo tanto su cantidad de cuota es{" "}
                          {
                            requestMaster.datosFlete.vehiculoSeleccionado
                              .fraccionesCarga
                          }
                          , pero la sumatoria de todas las hijas es{" "}
                          {sumatoriaFracc}.
                        </SubtituloAdver>
                      </CajAdvertencia>
                    )}
                    {requestMaster.familia.parentesco == 0 &&
                      requestMaster.familia.solicitudesHijas.length > 0 && (
                        <CajaGraficoBarraMadre ref={divPadreRef}>
                          {hijasPrint.map((hija, index) => {
                            return (
                              <CajaHijoGrafico
                                key={index}
                                // className={`color${index + 1}`}
                                style={{
                                  width: `${hija.anchoPorcentaje}%`,

                                  backgroundColor: `
                          ${coloresHijos[index]}`,
                                }}
                              >
                                <TituloHijo>{index + 1}</TituloHijo>
                              </CajaHijoGrafico>
                            );
                          })}

                          <CajaHijoGrafico
                            className="hijaSobrante"
                            style={{
                              width: `${100 - totalPorcentaje}%`,
                            }}
                          >
                            <TituloHijo>Solicitud madre</TituloHijo>
                          </CajaHijoGrafico>
                        </CajaGraficoBarraMadre>
                      )}

                    {
                      // Si la solicitud es parentesco 0, significa que es Padre
                      requestMaster.familia.parentesco == 0 &&
                      //
                      requestMaster.familia?.solicitudesHijas.length > 0 ? (
                        <CajaContenidoRelacion>
                          <TituloTablaRelacion>
                            A continuacion se muestran las hijas de esta
                            solicitud:
                          </TituloTablaRelacion>

                          <CajaTabla>
                            <Tabla>
                              <thead>
                                <Filas className="cabeza">
                                  <CeldaHead>N°</CeldaHead>
                                  <CeldaHead>Numero*</CeldaHead>
                                  <CeldaHead>Cliente</CeldaHead>
                                  <CeldaHead>Fecha</CeldaHead>
                                  <CeldaHead>Solicitante*</CeldaHead>
                                  <CeldaHead className="fraccion">
                                    Fraccion de carga
                                  </CeldaHead>
                                  <CeldaHead className="fraccion">
                                    Porcentaje
                                  </CeldaHead>
                                  <CeldaHead> Costo </CeldaHead>
                                  <CeldaHead> Precio </CeldaHead>
                                  <CeldaHead>Quitar</CeldaHead>
                                </Filas>
                              </thead>
                              <tbody>
                                {congloAcciones.relacion.listaDBHijas.map(
                                  (request, index) => {
                                    return (
                                      <Filas className="body" key={index}>
                                        <CeldasBody>{index + 1}</CeldasBody>

                                        <CeldasBody>
                                          <Enlaces
                                            target="_blank"
                                            to={`/transportes/maestros/solicitudes/${request.numeroDoc}`}
                                          >
                                            {request.numeroDoc}
                                          </Enlaces>
                                        </CeldasBody>
                                        <CeldasBody>
                                          {request.datosReq.socioNegocio}
                                        </CeldasBody>
                                        <CeldasBody>
                                          {request.fechaReq.slice(0, 10)}
                                        </CeldasBody>
                                        <CeldasBody>
                                          <Enlaces
                                            target="_blank"
                                            to={`/perfiles/${request?.datosSolicitante.userName}`}
                                          >
                                            {request.datosSolicitante.nombre +
                                              " "}
                                            {request.datosSolicitante.apellido}
                                          </Enlaces>
                                        </CeldasBody>
                                        <CeldasBody>
                                          {request.datosFlete
                                            .vehiculoSeleccionado
                                            .fraccionesCarga + "/"}
                                          {
                                            requestMaster.datosFlete
                                              .vehiculoSeleccionado
                                              .fraccionesCarga
                                          }
                                        </CeldasBody>
                                        <CeldasBody>
                                          {(((requestMaster.datosFlete.costo /
                                            requestMaster.datosFlete
                                              .vehiculoSeleccionado
                                              .fraccionesCarga) *
                                            request.datosFlete
                                              .vehiculoSeleccionado
                                              .fraccionesCarga) /
                                            requestMaster.datosFlete.costo) *
                                            100 +
                                            "%"}
                                        </CeldasBody>

                                        <CeldasBody>
                                          {(
                                            (requestMaster.datosFlete.costo /
                                              requestMaster.datosFlete
                                                .vehiculoSeleccionado
                                                .fraccionesCarga) *
                                            request.datosFlete
                                              .vehiculoSeleccionado
                                              .fraccionesCarga
                                          ).toFixed(0)}
                                        </CeldasBody>
                                        <CeldasBody>
                                          {(
                                            (requestMaster.datosFlete.precio /
                                              requestMaster.datosFlete
                                                .vehiculoSeleccionado
                                                .fraccionesCarga) *
                                            request.datosFlete
                                              .vehiculoSeleccionado
                                              .fraccionesCarga
                                          ).toFixed(0)}
                                        </CeldasBody>
                                        <CeldasBody>
                                          <Xmarc
                                            data-id={request.id}
                                            data-tipo={"relacion"}
                                            data-name="quitarHija"
                                            onClick={(e) => handleAcciones(e)}
                                          >
                                            ❌
                                          </Xmarc>
                                        </CeldasBody>
                                      </Filas>
                                    );
                                  }
                                )}
                              </tbody>
                            </Tabla>
                          </CajaTabla>
                        </CajaContenidoRelacion>
                      ) : (
                        ""
                      )
                    }
                    {requestMaster.familia.parentesco == 0 &&
                    requestMaster.familia?.solicitudesHijas.length == 0 ? (
                      <TituloTablaRelacion className="centrar">
                        Esta solicitud aun no tiene solicitudes hijas.
                      </TituloTablaRelacion>
                    ) : (
                      ""
                    )}
                    {requestMaster.familia.parentesco == 1 &&
                    requestMaster.familia?.solicitudMadre == null ? (
                      <TituloTablaRelacion className="centrar">
                        Solicitud madre no especificada.
                      </TituloTablaRelacion>
                    ) : (
                      ""
                    )}

                    {requestMaster.familia.parentesco == 1 &&
                    requestMaster.familia?.solicitudMadre != null ? (
                      <TituloTablaRelacion className="centrar ">
                        Solicitud madre N°{" "}
                        <Enlaces
                          target="_blank"
                          to={`/transportes/maestros/solicitudes/${requestMaster.familia?.solicitudMadre.numero}`}
                        >
                          {requestMaster.familia.solicitudMadre.numero}
                        </Enlaces>
                      </TituloTablaRelacion>
                    ) : (
                      ""
                    )}
                    <ContenedorTablaProporcion>
                      <TextoTablaProporcion
                        onClick={() =>
                          setHasTablaProporcion(!hasTablaProporcion)
                        }
                      >
                        Ver tabla de proporcion 👁️
                      </TextoTablaProporcion>
                      {hasTablaProporcion && <TablaProporcionCarga />}
                    </ContenedorTablaProporcion>
                  </CajaSubWrapInternal>

                  <CajaBotonGuardar className="addHija">
                    {requestMaster.familia.parentesco == 0 ? (
                      <>
                        <TituloObtReq>Numero solicitud:</TituloObtReq>
                        <InputReqEspecifica
                          value={congloAcciones.relacion.valueInputReqObt}
                          onChange={(e) => handleAcciones(e)}
                          data-tipo="relacion"
                          name="valueInputReqObt"
                          autoComplete="off"
                          className={
                            Theme.config.modoClear ? "clearModern" : ""
                          }
                          placeholder="Numero"
                        />
                        <BtnSimple
                          className="sinMargin"
                          data-tipo="relacion"
                          name="traerSolicitudHija"
                          onClick={(e) => {
                            handleAcciones(e);
                          }}
                        >
                          <Icono icon={faPlus} />
                          Hijas
                        </BtnSimple>
                      </>
                    ) : (
                      ""
                    )}
                  </CajaBotonGuardar>
                </>
              )}
            </WrapInternalContenido>
          ))
        : ""}

      {arrayOpciones.find((opcion) => opcion.select)?.nombre == "Reset" &&
        userMaster.permisos.some((item) =>
          ["defaultStateRequestTMS", "defaultPagosTMS"].includes(item)
        ) &&
        (requestMaster.estadoDoc == -1 ? (
          <TextoEptyG
            texto={"~ No disponible para solicitudes en estado de borrador ~"}
          />
        ) : (
          <WrapInternalContenido>
            <CajaSubWrapInternal
              className={`${Theme.config.modoClear ? "clearModern" : ""}`}
            >
              {userMaster.permisos.includes("defaultStateRequestTMS") ||
              userMaster.permisos.includes("defaultPagosTMS") ? (
                <CajaReset>
                  <OpcionUnica
                    titulo={"Tipo"}
                    name="estadoPagos"
                    arrayOpciones={congloAcciones.reset.opcionesReset}
                    handleOpciones={handleAcciones}
                  />
                  {congloAcciones.reset.opcionesReset[0].select &&
                    userMaster.permisos.includes("defaultStateRequestTMS") && (
                      <CajaEstadoReset>
                        {requestMaster.estadoDoc == 0 && (
                          <MensajeTextoSencillo>
                            Esta solicitud ya se encuentra en estado a la
                            espera.
                          </MensajeTextoSencillo>
                        )}
                        {requestMaster.estadoDoc == 4 && (
                          <MensajeTextoSencillo>
                            Las solicitudes anuladas no se pueden regresar a su
                            valores por defecto.
                          </MensajeTextoSencillo>
                        )}

                        <CajaTextArea2>
                          <TituloTextArea>Justificacion</TituloTextArea>
                          <TextAreaRazon
                            placeholder="Indique el motivo para resetear"
                            className={`clearModern 
                     ${
                       requestMaster.estadoDoc == 0 ||
                       requestMaster.estadoDoc == 4
                         ? "disabled"
                         : ""
                     }
                     `}
                            disabled={
                              requestMaster.estadoDoc == 0 ||
                              requestMaster.estadoDoc == 4
                            }
                            data-tipo="reset"
                            name="justificacion"
                            value={congloAcciones.reset.estados.justificacion}
                            onChange={(e) => handleAcciones(e)}
                          />
                        </CajaTextArea2>
                        <BtnSimple
                          data-tipo="reset"
                          name="resetearEstados"
                          className={` 
                   ${requestMaster.estadoDoc == 0 || requestMaster.estadoDoc == 4 ? "disabled" : ""}
                   `}
                          disabled={
                            requestMaster.estadoDoc == 0 ||
                            requestMaster.estadoDoc == 4
                          }
                          onClick={(e) => handleAcciones(e)}
                        >
                          Resetear
                        </BtnSimple>
                      </CajaEstadoReset>
                    )}
                  {congloAcciones.reset.opcionesReset[1].select &&
                    userMaster.permisos.includes("defaultPagosTMS") && (
                      <CajaPagosReset>
                        {requestMaster.contabilidad.statusPagoChofer == 3 && (
                          <MensajeTextoSencillo>
                            Este pago ya fue aprobado por contabilidad.
                          </MensajeTextoSencillo>
                        )}

                        {requestMaster.contabilidad.statusPagoChofer == 6 && (
                          <MensajeTextoSencillo>
                            El pago de esta solicitud fue rechazado por
                            contabilidad
                          </MensajeTextoSencillo>
                        )}

                        <BtnSimple
                          data-tipo="reset"
                          name="resetearPagos"
                          onClick={(e) => handleAcciones(e)}
                        >
                          Resetear Pagos
                        </BtnSimple>
                      </CajaPagosReset>
                    )}
                </CajaReset>
              ) : (
                ""
              )}
            </CajaSubWrapInternal>
          </WrapInternalContenido>
        ))}
      {arrayOpciones.find((opcion) => opcion.select)?.nombre ==
        "Aprobaciones" && (
        <CajaSubWrapInternal>
          <OpcionUnica
            name={"pantallasAprobaciones"}
            arrayOpciones={pantallasAprobaciones}
            handleOpciones={handleOpcionesAprobaciones}
          />

          {pantallasAprobaciones.find((opcion) => opcion.select)
            ?.codigoInterno == "pagoManual" && (
            <>
              {requestMaster.estadoDoc == -1 ? (
                <>
                  {userMaster.permisos.includes("approvedPriceChangesAdd") && (
                    <CajaAprobaciones>
                      <CajaTopStatus
                        className={
                          StyleTextStateReq.find(
                            (state) => state.numero == requestMaster.estadoDoc
                          )?.codigo || "default"
                        }
                      >
                        <TextoStatus>
                          {StyleTextStateReq.find(
                            (state) => state.numero == requestMaster.estadoDoc
                          )?.texto || "default"}

                          {requestMaster.estadoDoc == 1
                            ? " - " +
                              hoyManniana(
                                requestMaster.current.fechaDespProg.slice(0, 10)
                              )
                            : ""}
                        </TextoStatus>
                      </CajaTopStatus>

                      {requestMaster.datosMontos[0]?.nuevoFormato ? (
                        <MontosReqNuevo
                          datosMontos={requestMaster.datosMontos}
                          userMaster={userMaster}
                          datosFlete={requestMaster.datosFlete}
                          // modo={"edicion"}
                        />
                      ) : (
                        <MontosReqViejo
                          datosMontos={requestMaster.datosMontos}
                          userMaster={userMaster}
                          datosFlete={requestMaster.datosFlete}
                          // modo={"edicion"}
                        />
                      )}

                      <CajaBtnAprobaciones>
                        <BtnSimple
                          data-tipo="aprobaciones"
                          name="aprobar"
                          onClick={(e) => handleAcciones(e)}
                        >
                          Aprobar
                        </BtnSimple>
                        <BtnSimple
                          data-tipo="aprobaciones"
                          name="rechazar"
                          onClick={(e) => handleAcciones(e)}
                          className="danger"
                        >
                          Rechazar
                        </BtnSimple>
                      </CajaBtnAprobaciones>
                    </CajaAprobaciones>
                  )}
                </>
              ) : (
                <TextoEptyG texto={"Esta opcion es solo para borradores."} />
              )}
            </>
          )}
          {pantallasAprobaciones.find((opcion) => opcion.select)
            ?.codigoInterno == "ayudanteAdicional" && (
            <>
              {userMaster.permisos.includes("approvedAyudanteAdicionales") ? (
                <>
                  <CajaSubWrapInternal className="aprobaciones">
                    <TituloAprobaciones>
                      Ayudantes adicionales camion principal
                    </TituloAprobaciones>
                    <CajaWrapTabla>
                      <CajaTablaGroup>
                        <TablaGroup>
                          <thead>
                            <FilasGroup className="cabeza">
                              <CeldaHeadGroup>N°</CeldaHeadGroup>
                              <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                              <CeldaHeadGroup>Monto</CeldaHeadGroup>
                              <CeldaHeadGroup>Obs</CeldaHeadGroup>
                              <CeldaHeadGroup>Status</CeldaHeadGroup>
                              <CeldaHeadGroup>Accion</CeldaHeadGroup>
                            </FilasGroup>
                          </thead>
                          <tbody>
                            {requestMaster.datosFlete.ayudantesAdicionales.map(
                              (ayudante, index) => {
                                return (
                                  <FilasGroup key={index} className="body">
                                    <CeldasBodyGroup>
                                      {index + 1}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup className="startText">
                                      {ayudante.datosAyudante.nombre +
                                        " " +
                                        ayudante.datosAyudante.apellido}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.costo}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.obs}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {
                                        diccionarioStatusAyudanteInRequest[
                                          ayudante.status
                                        ]
                                      }
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {
                                        // Solo permite aprobar/rechazar si esta a la espera
                                        ayudante.status === 0 && (
                                          <>
                                            <ParrafoAction
                                              onClick={(e) => handleAcciones(e)}
                                              data-tipo="aprobaciones"
                                              data-name="aprobarAyudAdd"
                                              data-nombre="1"
                                              data-indexayudante={index}
                                              data-nivel="ayudaAddVehPrincipal"
                                              title="Aprobar ayudante adicional"
                                            >
                                              ✅
                                            </ParrafoAction>
                                            <ParrafoAction
                                              onClick={(e) => handleAcciones(e)}
                                              data-tipo="aprobaciones"
                                              data-name="denegarAyudAdd"
                                              data-nombre="2"
                                              data-indexayudante={index}
                                              data-nivel="ayudaAddVehPrincipal"
                                              title="Rechazar ayudante adicional"
                                            >
                                              ❌
                                            </ParrafoAction>
                                          </>
                                        )
                                      }
                                    </CeldasBodyGroup>
                                  </FilasGroup>
                                );
                              }
                            )}
                          </tbody>
                        </TablaGroup>
                      </CajaTablaGroup>
                    </CajaWrapTabla>
                  </CajaSubWrapInternal>
                  <CajaSubWrapInternal className="aprobaciones">
                    <TituloAprobaciones>
                      Ayudantes adicionales camiones adicionales
                    </TituloAprobaciones>
                    <CajaWrapTabla>
                      <CajaTablaGroup>
                        <TablaGroup>
                          <thead>
                            <FilasGroup className="cabeza">
                              <CeldaHeadGroup>N°</CeldaHeadGroup>
                              <CeldaHeadGroup>Chofer</CeldaHeadGroup>
                              <CeldaHeadGroup>Vehiculo</CeldaHeadGroup>
                              <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                              <CeldaHeadGroup>Monto</CeldaHeadGroup>
                              <CeldaHeadGroup>Obs</CeldaHeadGroup>
                              <CeldaHeadGroup>Status</CeldaHeadGroup>
                              <CeldaHeadGroup>Accion</CeldaHeadGroup>
                            </FilasGroup>
                          </thead>
                          <tbody>
                            {requestMaster.datosFlete.vehiculosAdicionales
                              .flatMap((vehiAd, indexCam) => {
                                return vehiAd.ayudantesAdicionales.map(
                                  (ayu, index) => {
                                    return {
                                      ...ayu,
                                      indexAyudDesglose: index,
                                      idCamionAdd: vehiAd.idCamionComoElemento,
                                      descripcionCamion: vehiAd.descripcion,
                                      nombreCompletoChofer:
                                        vehiAd.datosEntrega.chofer.nombre +
                                        " " +
                                        vehiAd.datosEntrega.chofer.apellido,
                                    };
                                  }
                                );
                              })
                              // requestMaster.datosFlete.ayudantesAdicionales
                              .map((ayudante, index) => {
                                return (
                                  <FilasGroup key={index} className="body">
                                    <CeldasBodyGroup>
                                      {index + 1}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.nombreCompletoChofer}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup className="startText">
                                      {ayudante.descripcionCamion}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.datosAyudante.nombre +
                                        " " +
                                        ayudante.datosAyudante.apellido}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.costo}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {ayudante.obs}
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {
                                        diccionarioStatusAyudanteInRequest[
                                          ayudante.status
                                        ]
                                      }
                                    </CeldasBodyGroup>
                                    <CeldasBodyGroup>
                                      {
                                        // Solo permite aprobar/rechazar si esta a la espera
                                        ayudante.status === 0 && (
                                          <>
                                            <ParrafoAction
                                              onClick={(e) => handleAcciones(e)}
                                              data-tipo="aprobaciones"
                                              data-name="aprobarAyudAdd"
                                              data-nombre="1"
                                              data-indexayudante={
                                                ayudante.indexAyudDesglose
                                              }
                                              data-idcamionadd={
                                                ayudante.idCamionAdd
                                              }
                                              data-nivel="ayudaAddVehAdd"
                                              title="Aprobar ayudante adicional"
                                            >
                                              ✅
                                            </ParrafoAction>
                                            <ParrafoAction
                                              onClick={(e) => handleAcciones(e)}
                                              data-tipo="aprobaciones"
                                              data-name="denegarAyudAdd"
                                              data-nombre="2"
                                              data-indexayudante={
                                                ayudante.indexAyudDesglose
                                              }
                                              data-idcamionadd={
                                                ayudante.idCamionAdd
                                              }
                                              data-nivel="ayudaAddVehAdd"
                                              title="Rechazar ayudante adicional"
                                            >
                                              ❌
                                            </ParrafoAction>
                                          </>
                                        )
                                      }
                                    </CeldasBodyGroup>
                                  </FilasGroup>
                                );
                              })}
                          </tbody>
                        </TablaGroup>
                      </CajaTablaGroup>
                    </CajaWrapTabla>
                  </CajaSubWrapInternal>
                </>
              ) : (
                <TextoEptyG texto={"Sin los permisos necesarios."} />
              )}
            </>
          )}
          {/* (
       ) : (
        
       )) */}
        </CajaSubWrapInternal>
      )}
      {arrayOpciones.find((opcion) => opcion.select)?.nombre == "Esquemas" &&
        userMaster.permisos.includes("editSchemaReg") &&
        (requestMaster.estadoDoc == -1 ? (
          <TextoEptyG
            texto={"~ No disponible para solicitudes en estado de borrador ~"}
          />
        ) : (
          <WrapInternalContenido>
            <CajaSubWrapInternal
              className={`esquema ${Theme.config.modoClear ? "clearModern" : ""}`}
            >
              <TituloCualVehi>Vehiculo principal</TituloCualVehi>
              <WrapEdiciones className="esquema ">
                <CajaEsquema className="camion">
                  <ImgSimple
                    className="schema"
                    src={
                      requestEditable.datosFlete.vehiculoSeleccionado.urlFoto
                    }
                  />
                  <TextoCamion>
                    {
                      requestEditable.datosFlete.vehiculoSeleccionado
                        .descripcion
                    }
                  </TextoCamion>
                  <br />
                  <TituloSchema>Colaboradores:</TituloSchema>
                  <WrapRol>
                    <CajitaRol>
                      <TituloRol>Rol principal:</TituloRol>
                      <TextoRol>Chofer</TextoRol>
                    </CajitaRol>
                    <CajitaRol>
                      <TituloRol>Rol secundario:</TituloRol>
                      <TextoRol>Ayudante</TextoRol>
                    </CajitaRol>
                  </WrapRol>
                </CajaEsquema>
                <CajaEsquema className="roles">
                  <WrapRol>
                    <CajaAyudantesAdd>
                      <TituloAyudanteAdd>
                        Ayudantes adicionales1
                      </TituloAyudanteAdd>
                      <CajitaAyudantesAdd>
                        <CajaTablaGroup>
                          <TablaGroup>
                            <thead>
                              <FilasGroup className="cabeza">
                                <CeldaHeadGroup>N°</CeldaHeadGroup>
                                <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                                <CeldaHeadGroup>Monto</CeldaHeadGroup>
                                <CeldaHeadGroup>Obs</CeldaHeadGroup>
                                <CeldaHeadGroup>Status</CeldaHeadGroup>
                                {congloAcciones.esquemas.enRevision && (
                                  <CeldaHeadGroup>Revisar</CeldaHeadGroup>
                                )}
                              </FilasGroup>
                            </thead>
                            <tbody>
                              {requestEditable.datosFlete?.ayudantesAdicionales?.map(
                                (ayudante, index) => {
                                  return (
                                    <FilasGroup
                                      key={index}
                                      className={`body
                                      ${index % 2 ? "impar" : "par"}`}
                                    >
                                      <CeldasBodyGroup>
                                        {index + 1}
                                      </CeldasBodyGroup>
                                      <CeldasBodyGroup>
                                        {congloAcciones.esquemas.editable && (
                                          <>
                                            {ayudante.status != 1 &&
                                            ayudante.status != 2 &&
                                            ayudante.createdAt == "" ? (
                                              <>
                                                <InputCelda
                                                  placeholder="Ayudante adicional"
                                                  name="datosAyudante"
                                                  // disabled={
                                                  //   ayudante.status == 1 ||
                                                  //   ayudante.status == 2
                                                  // }
                                                  className="celdaClear"
                                                  data-tipo="esquemas"
                                                  data-index={index}
                                                  // value={

                                                  //   ayudante.datosAyudante.nombre +
                                                  //   " " +
                                                  //   ayudante.datosAyudante.apellido
                                                  // }
                                                  value={
                                                    ayudante.datosAyudante
                                                      .valueInput
                                                  }
                                                  list="ayudantesListData"
                                                  autoComplete="off"
                                                  onChange={(e) =>
                                                    handleAcciones(e)
                                                  }
                                                />
                                                <DataList id="ayudantesListData">
                                                  {listaAyudantesAdicionales.map(
                                                    (chofer, index) => {
                                                      return (
                                                        <Opcion
                                                          key={index}
                                                          // value={'asd'}
                                                          value={parsearChofer(
                                                            chofer.nombre,
                                                            chofer.apellido ||
                                                              ""
                                                          )}
                                                        >
                                                          {chofer.tipo == 0
                                                            ? "Interno"
                                                            : chofer.tipo == 1
                                                              ? "Externo Independiente"
                                                              : chofer.tipo == 2
                                                                ? "Externo Empresa"
                                                                : chofer.tipo ==
                                                                    3
                                                                  ? "Ayudante adicional"
                                                                  : ""}
                                                        </Opcion>
                                                      );
                                                    }
                                                  )}
                                                </DataList>
                                              </>
                                            ) : (
                                              ayudante.datosAyudante.nombre +
                                              " " +
                                              ayudante.datosAyudante.apellido
                                            )}
                                          </>
                                        )}
                                        {!congloAcciones.esquemas.editable &&
                                          ayudante.datosAyudante.nombre +
                                            " " +
                                            ayudante.datosAyudante.apellido}
                                      </CeldasBodyGroup>
                                      <CeldasBodyGroup>
                                        {/* Si el ayudante esta a la espera, entonces muestra input si esta editable y celda si no esta editable */}

                                        {
                                          // && ayudante.datosAyudante.tipo != 0
                                          // Ahora pregunta si esta en modo editable o no:
                                          // 1-En modo normal muestra la info del requestMaster en una celda fija
                                          ayudante.status == 0 &&
                                          congloAcciones.esquemas.editable &&
                                          ayudante.datosAyudante.tipo !== 0 &&
                                          ayudante.createdAt == "" ? (
                                            //
                                            // 2-En modo editable muestra un input con el valor editable
                                            <InputCelda
                                              className="celdaClear"
                                              data-tipo="esquemas"
                                              value={ayudante.costo}
                                              data-index={index}
                                              onChange={(e) =>
                                                handleAcciones(e)
                                              }
                                              name="costo"
                                              autoComplete="off"
                                            />
                                          ) : (
                                            ayudante.costo
                                          )
                                        }
                                      </CeldasBodyGroup>

                                      <CeldasBodyGroup>
                                        {/* Si el ayudante esta a la espera, entonces muestra input si esta editable y celda si no esta editable */}
                                        {ayudante.status == 0 ? (
                                          // Ahora pregunta si esta en modo editable o no:
                                          // 1-En modo normal muestra la info del requestMaster en una celda fija

                                          congloAcciones.esquemas.editable &&
                                          ayudante.createdAt == "" ? (
                                            <InputCelda
                                              title={ayudante.obs}
                                              className="celdaClear"
                                              data-tipo="esquemas"
                                              autoComplete="off"
                                              value={ayudante.obs}
                                              data-index={index}
                                              onChange={(e) =>
                                                handleAcciones(e)
                                              }
                                              name="obs"
                                            />
                                          ) : (
                                            // 2-En modo editable muestra un input con el valor editable
                                            ayudante.obs
                                          )
                                        ) : (
                                          // Si el ayudante esta aprobado o rechazado muestra la info del requestMaster en una celda fija
                                          ayudante.obs
                                        )}
                                      </CeldasBodyGroup>
                                      {congloAcciones.esquemas.enRevision ? (
                                        <CeldasBodyGroup>
                                          {/* Si el ayudante esta a la espera, entonces muestra input si esta editable y celda si no esta editable */}
                                          {requestEditable.datosFlete
                                            .ayudantesAdicionales
                                            ? requestEditable.datosFlete
                                                ?.ayudantesAdicionales[index]
                                                ?.status == 0
                                              ? "A la espera..."
                                              : requestEditable.datosFlete
                                                    ?.ayudantesAdicionales[
                                                    index
                                                  ]?.status == 1
                                                ? "Aprobado"
                                                : requestEditable.datosFlete
                                                      ?.ayudantesAdicionales[
                                                      index
                                                    ]?.status == 2
                                                  ? "Rechazado"
                                                  : ""
                                            : ""}
                                        </CeldasBodyGroup>
                                      ) : (
                                        <CeldasBodyGroup>
                                          {requestMaster.datosFlete
                                            .ayudantesAdicionales
                                            ? requestMaster.datosFlete
                                                ?.ayudantesAdicionales[index]
                                                ?.status == 0
                                              ? "A la espera"
                                              : requestMaster.datosFlete
                                                    ?.ayudantesAdicionales[
                                                    index
                                                  ]?.status == 1
                                                ? "Aprobado"
                                                : requestMaster.datosFlete
                                                      ?.ayudantesAdicionales[
                                                      index
                                                    ]?.status == 2
                                                  ? "Rechazado❌"
                                                  : ""
                                            : ""}
                                        </CeldasBodyGroup>
                                      )}
                                      {congloAcciones.esquemas.enRevision
                                        ? ayudante.status == 0 && (
                                            <CeldasBodyGroup>
                                              (
                                              <WrapParrafoBtn>
                                                <ParrafoBtn
                                                  onClick={(e) =>
                                                    handleAcciones(e)
                                                  }
                                                  data-tipo="esquemas"
                                                  data-name="aprobarDenegar"
                                                  data-nombre="1"
                                                  data-index={index}
                                                >
                                                  ✅
                                                </ParrafoBtn>
                                                <ParrafoBtn
                                                  onClick={(e) =>
                                                    handleAcciones(e)
                                                  }
                                                  data-tipo="esquemas"
                                                  data-name="aprobarDenegar"
                                                  data-nombre="2"
                                                  data-index={index}
                                                >
                                                  ❌
                                                </ParrafoBtn>
                                              </WrapParrafoBtn>
                                              )
                                            </CeldasBodyGroup>
                                          )
                                        : ""}
                                    </FilasGroup>
                                  );
                                }
                              )}
                            </tbody>
                          </TablaGroup>
                        </CajaTablaGroup>
                      </CajitaAyudantesAdd>

                      {requestMaster.estadoDoc < 3 && (
                        <CajaBtnSchema>
                          {congloAcciones.esquemas.editable && (
                            <>
                              <BtnsSchema
                                onClick={(e) => handleAcciones(e)}
                                data-tipo="esquemas"
                                name="add"
                                className="add"
                              >
                                +
                              </BtnsSchema>
                              <BtnsSchema
                                onClick={(e) => handleAcciones(e)}
                                data-tipo="esquemas"
                                name="minus"
                                className="add"
                              >
                                -
                              </BtnsSchema>
                            </>
                          )}

                          {!congloAcciones.esquemas.editable &&
                          !congloAcciones.esquemas.enRevision ? (
                            <>
                              {userMaster.permisos.includes(
                                "auditAyudanteEsquemas"
                              ) && (
                                <BtnsSchema
                                  onClick={(e) => editarEsquema()}
                                  data-tipo="esquemas"
                                  name="guardar"
                                >
                                  Editar
                                </BtnsSchema>
                              )}
                            </>
                          ) : (
                            ""
                          )}

                          {congloAcciones.esquemas.editable ||
                          congloAcciones.esquemas.enRevision ? (
                            <>
                              <BtnsSchema
                                onClick={(e) =>
                                  cancelarEdicionRevisionEsquema()
                                }
                                data-tipo="esquemas"
                                name="guardar"
                                className="danger"
                              >
                                Cancelar
                              </BtnsSchema>
                              <BtnsSchema
                                onClick={(e) => handleAcciones(e)}
                                data-tipo="esquemas"
                                name="guardar"
                              >
                                Guardar
                              </BtnsSchema>
                            </>
                          ) : (
                            ""
                          )}
                        </CajaBtnSchema>
                      )}
                    </CajaAyudantesAdd>
                  </WrapRol>
                </CajaEsquema>
              </WrapEdiciones>
              <br />
              <br />
              <hr />
              <br />
              <br />
              <TituloCualVehi>Vehiculos adicionales2</TituloCualVehi>
              {requestEditable?.datosFlete?.vehiculosAdicionales?.map(
                (vehiculo, indexVehiculo) => {
                  return (
                    <WrapEdiciones key={indexVehiculo} className="esquema ">
                      <CajaEsquema className="camion">
                        <ImgSimple className="schema" src={vehiculo.urlFoto} />
                        <TextoCamion>{vehiculo.descripcion}</TextoCamion>
                        <br />
                        <TituloSchema>Colaboradores:</TituloSchema>
                        <WrapRol>
                          <CajitaRol>
                            <TituloRol>Rol principal:</TituloRol>
                            <TextoRol>Chofer</TextoRol>
                          </CajitaRol>
                          <CajitaRol>
                            <TituloRol>Rol secundario:</TituloRol>
                            <TextoRol>Ayudante</TextoRol>
                          </CajitaRol>
                        </WrapRol>
                      </CajaEsquema>
                      <CajaEsquema className="roles">
                        <WrapRol>
                          <CajaAyudantesAdd>
                            <TituloAyudanteAdd>
                              Ayudantes adicionales2
                            </TituloAyudanteAdd>
                            <CajitaAyudantesAdd>
                              <CajaTablaGroup>
                                <TablaGroup>
                                  <thead>
                                    <FilasGroup className="cabeza">
                                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                                      <CeldaHeadGroup>Nombre</CeldaHeadGroup>
                                      <CeldaHeadGroup>Monto</CeldaHeadGroup>
                                      <CeldaHeadGroup>Obs</CeldaHeadGroup>
                                      <CeldaHeadGroup>Status</CeldaHeadGroup>
                                      {congloAcciones.esquemas.revisionVehAdd[
                                        indexVehiculo
                                      ] && (
                                        <CeldaHeadGroup>Revisar</CeldaHeadGroup>
                                      )}
                                    </FilasGroup>
                                  </thead>
                                  <tbody>
                                    {vehiculo?.ayudantesAdicionales?.map(
                                      (ayudante, indexAyudante) => {
                                        return (
                                          <FilasGroup
                                            key={indexAyudante}
                                            className={`body
                                            ${indexAyudante % 2 ? "impar" : "par"}`}
                                          >
                                            <CeldasBodyGroup>
                                              {indexAyudante + 1}
                                            </CeldasBodyGroup>
                                            <CeldasBodyGroup>
                                              {congloAcciones.esquemas
                                                .editableVehiAdd[
                                                indexVehiculo
                                              ] &&
                                              ayudante.status != 1 &&
                                              ayudante.status != 2 &&
                                              ayudante.createdAt == "" ? (
                                                <>
                                                  <InputCelda
                                                    placeholder="Ayudante adicional"
                                                    name="datosAyudante"
                                                    className="celdaClear"
                                                    data-nivel="vehiAdd"
                                                    data-tipo="esquemas"
                                                    data-indexvehiculo={
                                                      indexVehiculo
                                                    }
                                                    data-indexayudante={
                                                      indexAyudante
                                                    }
                                                    value={
                                                      ayudante.datosAyudante
                                                        .valueInput
                                                    }
                                                    list="ayudantesListData2"
                                                    autoComplete="off"
                                                    onChange={(e) =>
                                                      handleAcciones(e)
                                                    }
                                                  />
                                                  <DataList id="ayudantesListData2">
                                                    {listaAyudantesAdicionales.map(
                                                      (chofer, index) => {
                                                        return (
                                                          <Opcion
                                                            key={index}
                                                            // value={'asd'}
                                                            value={parsearChofer(
                                                              chofer.nombre,
                                                              chofer.apellido ||
                                                                ""
                                                            )}
                                                          >
                                                            {chofer.tipo == 0
                                                              ? "Interno"
                                                              : chofer.tipo == 1
                                                                ? "Externo Independiente"
                                                                : chofer.tipo ==
                                                                    2
                                                                  ? "Externo Empresa"
                                                                  : chofer.tipo ==
                                                                      3
                                                                    ? "Ayudante adicional"
                                                                    : ""}
                                                          </Opcion>
                                                        );
                                                      }
                                                    )}
                                                  </DataList>
                                                </>
                                              ) : (
                                                ayudante.datosAyudante.nombre +
                                                " " +
                                                ayudante.datosAyudante.apellido
                                              )}
                                            </CeldasBodyGroup>

                                            <CeldasBodyGroup>
                                              {/* Si el ayudante esta a la espera, entonces muestra input si esta editable y celda si no esta editable */}

                                              {
                                                // && ayudante.datosAyudante.tipo != 0
                                                // Ahora pregunta si esta en modo editable o no:
                                                // 1-En modo normal muestra la info del requestMaster en una celda fija
                                                ayudante.status == 0 &&
                                                congloAcciones.esquemas
                                                  .editableVehiAdd[
                                                  indexVehiculo
                                                ] &&
                                                ayudante.datosAyudante.tipo !==
                                                  0 &&
                                                ayudante.createdAt == "" ? (
                                                  //
                                                  // 2-En modo editable muestra un input con el valor editable
                                                  <InputCelda
                                                    data-nivel="vehiAdd"
                                                    data-indexvehiculo={
                                                      indexVehiculo
                                                    }
                                                    data-indexayudante={
                                                      indexAyudante
                                                    }
                                                    className="celdaClear"
                                                    data-tipo="esquemas"
                                                    value={ayudante.costo}
                                                    onChange={(e) =>
                                                      handleAcciones(e)
                                                    }
                                                    name="costo"
                                                    autoComplete="off"
                                                  />
                                                ) : (
                                                  ayudante.costo
                                                )
                                              }
                                            </CeldasBodyGroup>
                                            <CeldasBodyGroup>
                                              {/* Si el ayudante esta a la espera, entonces muestra input si esta editable y celda si no esta editable */}
                                              {ayudante.status == 0 ? (
                                                // Ahora pregunta si esta en modo editable o no:
                                                // 1-En modo normal muestra la info del requestMaster en una celda fija

                                                congloAcciones.esquemas
                                                  .editableVehiAdd[
                                                  indexVehiculo
                                                ] &&
                                                ayudante.createdAt == "" ? (
                                                  <InputCelda
                                                    data-nivel="vehiAdd"
                                                    data-indexvehiculo={
                                                      indexVehiculo
                                                    }
                                                    data-indexayudante={
                                                      indexAyudante
                                                    }
                                                    title={ayudante.obs}
                                                    className="celdaClear"
                                                    data-tipo="esquemas"
                                                    autoComplete="off"
                                                    value={ayudante.obs}
                                                    onChange={(e) =>
                                                      handleAcciones(e)
                                                    }
                                                    name="obs"
                                                  />
                                                ) : (
                                                  // 2-En modo editable muestra un input con el valor editable
                                                  ayudante.obs
                                                )
                                              ) : (
                                                // Si el ayudante esta aprobado o rechazado muestra la info del requestMaster en una celda fija
                                                ayudante.obs
                                              )}
                                            </CeldasBodyGroup>
                                            <CeldasBodyGroup>
                                              {ayudante.status == 0
                                                ? "Espera"
                                                : ayudante.status == 1
                                                  ? "Aprob✅"
                                                  : ayudante.status == 2
                                                    ? "Rechaz❌"
                                                    : ""}
                                            </CeldasBodyGroup>

                                            {congloAcciones.esquemas
                                              .revisionVehAdd[indexVehiculo]
                                              ? ayudante.status == 0 && (
                                                  <CeldasBodyGroup>
                                                    <WrapParrafoBtn>
                                                      <ParrafoBtn
                                                        onClick={(e) =>
                                                          handleAcciones(e)
                                                        }
                                                        data-tipo="esquemas"
                                                        data-name="aprobarDenegar"
                                                        data-nombre="1"
                                                        data-indexvehiculo={
                                                          indexVehiculo
                                                        }
                                                        data-indexayudante={
                                                          indexAyudante
                                                        }
                                                        data-nivel="vehiAdd"
                                                      >
                                                        ✅
                                                      </ParrafoBtn>
                                                      <ParrafoBtn
                                                        data-nivel="vehiAdd"
                                                        onClick={(e) =>
                                                          handleAcciones(e)
                                                        }
                                                        data-tipo="esquemas"
                                                        data-name="aprobarDenegar"
                                                        data-nombre="2"
                                                        data-indexvehiculo={
                                                          indexVehiculo
                                                        }
                                                        data-indexayudante={
                                                          indexAyudante
                                                        }
                                                      >
                                                        ❌
                                                      </ParrafoBtn>
                                                    </WrapParrafoBtn>
                                                  </CeldasBodyGroup>
                                                )
                                              : ""}
                                          </FilasGroup>
                                        );
                                      }
                                    )}
                                  </tbody>
                                </TablaGroup>
                              </CajaTablaGroup>
                            </CajitaAyudantesAdd>

                            {requestMaster.estadoDoc < 3 && (
                              <CajaBtnSchema>
                                {congloAcciones.esquemas.editableVehiAdd[
                                  indexVehiculo
                                ] && (
                                  <>
                                    <BtnsSchema
                                      onClick={(e) => handleAcciones(e)}
                                      data-tipo="esquemas"
                                      data-nivel="vehiAdd"
                                      data-index={indexVehiculo}
                                      name="add"
                                      className="add"
                                    >
                                      +
                                    </BtnsSchema>
                                    <BtnsSchema
                                      onClick={(e) => handleAcciones(e)}
                                      data-tipo="esquemas"
                                      data-nivel="vehiAdd"
                                      data-index={indexVehiculo}
                                      name="minus"
                                      className="add"
                                    >
                                      -
                                    </BtnsSchema>
                                  </>
                                )}

                                {!congloAcciones.esquemas.editableVehiAdd[
                                  indexVehiculo
                                ] &&
                                !congloAcciones.esquemas.revisionVehAdd[
                                  indexVehiculo
                                ] ? (
                                  <>
                                    {userMaster.permisos.includes(
                                      "auditAyudanteEsquemas"
                                    ) && (
                                      <BtnsSchema
                                        onClick={(e) => editarEsquemaVehAdd(e)}
                                        data-tipo="esquemas"
                                        data-index={indexVehiculo}
                                        name="guardar"
                                      >
                                        Editar
                                      </BtnsSchema>
                                    )}
                                  </>
                                ) : (
                                  ""
                                )}

                                {congloAcciones.esquemas.editableVehiAdd[
                                  indexVehiculo
                                ] ||
                                congloAcciones.esquemas.revisionVehAdd[
                                  indexVehiculo
                                ] ? (
                                  <>
                                    <BtnsSchema
                                      onClick={(e) =>
                                        cancelarEdicionRevisionEsquema()
                                      }
                                      data-tipo="esquemas"
                                      name="guardar"
                                      className="danger"
                                    >
                                      Cancelar
                                    </BtnsSchema>
                                    <BtnsSchema
                                      onClick={(e) => handleAcciones(e)}
                                      data-tipo="esquemas"
                                      data-indexvehiculo={indexVehiculo}
                                      name="guardarVehAdd"
                                    >
                                      Guardar
                                    </BtnsSchema>
                                  </>
                                ) : (
                                  ""
                                )}
                              </CajaBtnSchema>
                            )}
                          </CajaAyudantesAdd>
                        </WrapRol>
                      </CajaEsquema>
                    </WrapEdiciones>
                  );
                }
              )}
            </CajaSubWrapInternal>
          </WrapInternalContenido>
        ))}

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {isLoading ? <ModalLoading completa={true} /> : ""}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 200px;
`;
const CajaBarraOpciones = styled.div`
  color: ${Tema.neutral.blancoHueso};
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
`;
const WrapInternalContenido = styled.div`
  display: flex;
  width: 100%;
  min-height: 50px;
  justify-content: center;
  flex-direction: column;
`;

const TituloLow = styled.h3`
  font-size: 1.1rem;
  text-decoration: underline;

  color: ${Tema.primary.azulBrillante};
  align-content: center;
`;
const WrapEdiciones = styled.div`
  width: 100%;
  display: flex;
  height: 90%;
  &.vehiculo {
    align-items: center;
    justify-content: center;
    gap: 15px;
  }
  &.esquema {
    align-items: center;
    justify-content: center;
    gap: 15px;
    padding: 10px;
    margin-bottom: 15px;
  }
`;
const CajaIzqEdiciones = styled.div`
  height: 100%;
  width: 50%;
  display: flex;
  flex-direction: column;
  padding: 10px;
  &.mgBottom {
    margin-bottom: 45px;
    background-color: red;
  }
`;
const MenuDesplegableSimple = styled(MenuDesplegable)`
  min-width: 150px;
  width: 300px;

  margin-bottom: 15px;
`;

const TituloDetalle = styled.p`
  width: 49%;
  color: inherit;
  text-align: start;

  &.oneLine {
    width: 85%;
  }
  &.anchoal100 {
    width: 100%;
  }
`;

const DetalleTexto = styled.p`
  text-align: end;
  /* height: 20px; */
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: inherit;

  &.detalles {
    width: 100%;
    padding: 6px;
    height: auto;
    white-space: normal;
    text-align: start;
  }
  &.sinNoWrap {
    white-space: normal;
    text-overflow: clip;
    overflow: visible;
  }
  &.parentesco {
    font-size: 1.2rem;
    text-align: start;
    /* width: auto; */
  }
`;
const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  /* color: ${Tema.neutral.blancoHueso}; */

  &.detalles {
    flex-direction: column;
    gap: 5px;
  }

  width: 300px;
  /* border: 1px solid red; */
  &.parentesco {
    /* width: ; */
    padding: 5px;
  }
`;
const CajaTextArea = styled.div`
  display: flex;
  justify-content: end;
  margin-top: 5px;
  /* width: 100%; */
  /* height: 100%; */
  margin-bottom: 25px;
`;

const TextAreaJus = styled(TextArea)`
  outline: none;

  /* color: ${Tema.primary.azulBrillante}; */
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }

  width: 100%;
  min-width: 100%;
  min-height: 20px;
  height: 100%;
  resize: vertical;
  border: 1px solid ${Tema.secondary.azulOscuro2};
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;
  &.celda {
    width: 100%;
    height: 30px;
    min-height: 30px;
    border: none;
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: black;
    resize: none;
    height: 10px;
    min-height: 10px;
  }
`;

const CajaInternaFlete = styled.div`
  width: 49%;
  height: 70%;
  overflow: hidden;
  text-align: center;

  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid #535353;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid white;
  &.izquierda {
    width: 40%;

    &.adiciona {
      width: 35%;
      height: 50%;
      background-color: #864545;
    }
  }
  &.derecha {
    width: 52%;
  }
  min-height: 250px;
`;

const ImgSimple = styled.img`
  width: 100%;
  &.adiciona {
    width: 80%;
  }
  &.schema {
    width: 60%;
  }
`;
const TextoCamion = styled.h2`
  /* color: ${Tema.neutral.blancoHueso}; */
  font-size: 1rem;
`;
const CajaBotonGuardar = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  /* border: 2px solid blue; */
  border-top: 1px solid ${Tema.secondary.azulOpaco};
  &.addHija {
    /* border: 1px solid red; */
    display: flex;
    align-items: center;
    padding: 4px;
  }
`;

const BtnSimple = styled(BtnGeneralButton)`
  margin-bottom: 4px;
  &.cancelada {
    background-color: ${Tema.primary.grisNatural};
    cursor: auto;
    &:hover {
      color: white;
      background-color: ${Tema.primary.grisNatural};
    }
  }
  &.pequennio {
    font-size: 0.8rem;
    min-width: 60px;
  }
  &.sinMargin {
    margin: 0;
    margin-left: 15px;
    flex: 2;
  }
`;
const BtnsSchema = styled(BtnSimple)`
  min-width: 60px;
  width: 80px;
  &.add {
    width: 60px;
  }
`;

const CajaSubWrapInternal = styled.div`
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
  height: 340px;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulVerdeOsc};
    background-color: transparent;
    color: white;
  }
  &.aprobaciones {
    min-height: auto;
    height: auto;
  }
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  padding: 0 20px;
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
`;

const Tabla = styled.table`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled.tr`
  &.body {
    font-weight: normal;
    /* border-bottom: 1px solid #49444457; */
    border: none;
    background-color: ${ClearTheme.secondary.azulSuave};
    color: #00496b;
    background-color: white;
  }

  &.cabeza {
    background-color: ${ClearTheme.secondary.azulSuaveOsc};
    color: white;
  }
  color: ${Tema.neutral.blancoHueso};
  &.inpar {
    background-color: #e1eef4;
    font-weight: bold;
  }
  &:hover {
    background-color: #bdbdbd;
    background-color: ${ClearTheme.neutral.blancoAzul};
    /* background-color: #183f6e; */
    /* background-color: ${ClearTheme.secondary.azulSuave2}; */
  }
`;

const CeldaHead = styled.th`
  text-align: center;
  font-weight: bold;
  font-size: 1rem;
  border-left: #0070a8;
  height: 25px;
  background: -webkit-gradient(
    linear,
    left top,
    left bottom,
    color-stop(0.05, #006699),
    color-stop(1, #00557f)
  );
`;
const CeldasBody = styled.td`
  font-size: 15px;
  font-weight: 400;
  /* border: 1px solid black; */
  height: 25px;
  text-align: center;
  &.par {
    border-left: 1px solid #e1eef4;
  }
`;
const InputCelda = styled(InputSimpleEditable)`
  border: none;
  outline: none;
  height: 100%;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};

  border: none;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: ${Tema.primary.grisNatural};
    color: black;
  }
`;
const CajaEncabezadoRelacion = styled.div`
  display: flex;
  width: 100%;
  padding: 5px 10px;
  margin-bottom: 15px;
  flex-direction: column;
`;
const CajaContenidoRelacion = styled.div`
  width: 100%;
  min-height: 50px;
`;
const TituloTablaRelacion = styled.h2`
  /* color: ${Tema.neutral.blancoHueso}; */
  font-weight: 400;
  font-size: 1rem;
  width: 100%;
  padding-left: 10px;
  margin-bottom: 5px;
  &.centrar {
    width: 100%;
    text-align: center;
  }
  &.warning {
    color: ${Tema.complementary.warning};
  }
`;
const SubtituloAdver = styled.p`
  color: ${Tema.complementary.warning};
  margin-left: 15px;
`;
const CheckBox = styled.input`
  width: 30px;
  appearance: none;
  cursor: pointer;
  background-color: #fff;
  background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  width: 20px;
  height: 20px;
  border: 2px solid #888;
  transition: background-color 0.3s ease-in-out;
  &:checked {
    background-color: ${Tema.primary.azulBrillante};
  }
  &:focus {
    border-color: ${Tema.primary.azulBrillante};
  }
  &:disabled {
    background-color: rgb(198, 198, 198);
    background-image: none;
  }
  &:disabled:checked {
    background-color: rgb(241, 239, 239);
    background-image: url("data:image/svg+xml,%3csvg viewBox='0 0 16 16' fill='white' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M12.207 4.793a1 1 0 010 1.414l-5 5a1 1 0 01-1.414 0l-2-2a1 1 0 011.414-1.414L6.5 9.086l4.293-4.293a1 1 0 011.414 0z'/%3e%3c/svg%3e");
  }
`;

const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;
const Icono = styled(FontAwesomeIcon)`
  margin-right: 5px;
`;
const Xmarc = styled.p`
  cursor: pointer;
`;
const CajaInternaEncabezado = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 10px;
  &.superior {
    border: 1px solid ${Tema.secondary.azulOpaco};
  }
`;
const InputReqEspecifica = styled(InputSimpleEditable)`
  margin: 0;
`;
const TituloObtReq = styled.p`
  color: white;
  margin-right: 4px;
`;
const CajAdvertencia = styled.div``;
const CajaGraficoBarraMadre = styled.div`
  background-color: ${Tema.secondary.azulOpaco};
  width: 100%;
  height: 30px;
  margin-bottom: 5px;
  display: flex;
`;
const CajaHijoGrafico = styled.div`
  border-right: 1px solid black;
  height: 30px;
  background-color: yellow;
  &.hijaSobrante {
    background-color: green;
  }
`;

const TituloHijo = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  width: 100%;
  text-align: center;
  color: black;
`;
const ContenedorTablaProporcion = styled.div`
  width: 100%;
  margin-top: 50px;
  border: 1px solid ${Tema.secondary.azulOpaco};
  margin-bottom: 50px;
`;
const TextoTablaProporcion = styled.p`
  /* color: ${Tema.secondary.azulOpaco}; */
  text-decoration: underline;
  margin-left: 10px;
  cursor: pointer;
  margin-bottom: 10px;
`;

const CajaReset = styled.div`
  padding: 10px 15px;
  width: 100%;
  height: 200px;
`;
const CajaEstadoReset = styled.div`
  width: 100%;
  min-height: 150px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const MensajeTextoSencillo = styled.p`
  color: ${Tema.complementary.edicionYellow};
`;
const CajaPagosReset = styled.div`
  width: 100%;
  min-height: 350px;
`;
const CajaTextArea2 = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  padding: 10px;
`;
const TituloTextArea = styled.h3`
  font-size: 1rem;
`;
const TextAreaRazon = styled(TextArea)``;

const CajaAprobaciones = styled.div`
  width: 100%;
`;
const CajaBtnAprobaciones = styled.div`
  display: flex;
  align-items: center;
  height: 100px;
  justify-content: center;
  gap: 5px;
`;
const CajaTopStatus = styled.div`
  border-bottom: 1px solid ${Tema.neutral.blancoHueso};
  width: 100%;

  &.espera {
    background-color: #a3a3a3da;
    color: black;
  }
  &.planificacion {
    background-color: #ffc107;
    color: ${Tema.secondary.azulOlivo};
  }
  &.ejecucion {
    color: white;
    background-color: ${Tema.complementary.azulStatic};
  }
  &.realizada {
    background-color: ${Tema.complementary.success};
    color: white;
  }
  &.cancelada {
    background-color: ${ClearTheme.complementary.danger};
    color: white;
    border: 1px solid black;
  }
  &.borrador {
    background-color: ${ClearTheme.complementary.narajanBrillante};
    color: black;
  }

  height: 15%;
`;
const TextoStatus = styled.h2`
  text-align: center;
  font-size: 1.3rem;
`;
const ContainerInputsMontos = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 15px;
`;
const TituloInputsMontos = styled.h3`
  font-weight: 400;
`;
const CajaInputsMontos = styled.div`
  width: 90%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* border: 1px solid red; */
`;
const CajitaInputsMontos = styled.div`
  width: calc(100% / 3);
`;
// Contenedor vehiculos adicionales
const TituloVA = styled.h2`
  color: white;
  font-weight: 400;
  padding-left: 20px;
  text-decoration: underline 2px solid ${ClearTheme.primary.azulBrillante};
  margin-bottom: 15px;
`;

const CajaEsquema = styled.div`
  /* height: 90%; */
  overflow: hidden;
  text-align: center;

  height: 300px;

  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  padding: 10px;
  border-radius: 5px;
  border: 1px solid white;

  /* min-height: 250px; */
  &.camion {
    width: 40%;
    background-color: #4b4b4b;
    border: 2px solid ${Theme.complementary.warning};
  }
  &.roles {
    width: 60%;
    overflow-y: auto;
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
  }
`;
const WrapRol = styled.div`
  padding: 8px;
`;
const TituloSchema = styled.h3`
  font-weight: 400;
  text-decoration: underline;
  width: 100%;
  text-align: start;
`;

const CajitaRol = styled.div`
  width: 100%;
  display: flex;
`;
const TituloRol = styled.h3`
  text-decoration: underline;
  margin-right: 4px;
  font-weight: 400;
  color: ${Theme.neutral.blancoHueso};
`;
const TextoRol = styled.h3`
  font-weight: 400;
  color: ${Theme.neutral.neutral400};
`;
const CajaAyudantesAdd = styled.div`
  margin-top: 15px;
  width: 100%;
  border: 1px solid ${Theme.complementary.warning};
  min-height: 50px;
`;
const TituloAyudanteAdd = styled.h3`
  color: ${Theme.complementary.warning};
  text-decoration: underline;
  font-weight: 400;
`;
const CajitaAyudantesAdd = styled.div``;
const TituloCualVehi = styled.h2`
  padding: 8px;
  text-decoration: underline 2px ${Theme.primary.azulBrillante};
`;
const CajaBtnSchema = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`;
const WrapParrafoBtn = styled.div`
  width: 100%;
  display: flex;
`;
const ParrafoBtn = styled.p`
  border: 1px solid transparent;
  &:hover {
    cursor: pointer;
    border: 1px solid red;
  }
`;

const Opcion = styled.option`
  background-color: red;
`;
const DataList = styled.datalist`
  background-color: red;
  width: 150%;
`;
const CajaWrapTabla = styled.div`
  min-height: 100px;
`;
const TituloAprobaciones = styled.h2`
  font-weight: 400;
  color: white;
  font-size: 1.2rem;
  text-decoration: underline 2px solid ${ClearTheme.primary.azulBrillante};
  margin: 10px;
`;
