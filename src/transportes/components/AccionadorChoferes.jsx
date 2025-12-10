import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

import { Alerta } from "../../components/Alerta";
import { BotonQuery } from "../../components/BotonQuery";

import { doc, writeBatch } from "firebase/firestore";
import { localidadesAlmacen } from "../../components/corporativo/Corporativo.js";

import { InterruptorOficial } from "../../components/InterruptorOficial";
import { Link } from "react-router-dom";
import db from "../../firebase/firebaseConfig";
import { Tema } from "../../config/theme.jsx";
import AvatarGeneral from "./../../../public/img/avatares/maleAvatar.svg";

export default function AccionadorChoferes({
  propsAccion,
  accionar,
  listaChoferes,
  setHasAccion,
  setPropsAccion,
  userMaster,
}) {
  // Alertas
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [localidadValue, setLocalidadValue] = useState("");
  const [initialOrdenados, setInitialOrdenados] = useState([]);
  const [choferesOrdenados, setChoferesOrdenados] = useState([]);

  // Este estado es como solucion a que pasa si:
  // En la mañana antes de realizar la programacion de choferes, se asignan viaje a X chofer,
  // automaticamente el chofer se colocara en estado ejecucion, por lo tanto no aparecera en el organizador, es decir se necesita una forma de definir el orden aunque el chofer este en modo ejecucion
  const [choferesForce, setChoferesForce] = useState([]);
  const [initialForce, setInitialForce] = useState([]);

  useEffect(() => {
    // Dame solamente los choferes de la localidad selecionada & que ademas no sean ayudantes
    console.log(localidadValue);
    const choferesAux = listaChoferes.filter((chofer) => {
      console.log(chofer.localidad);
      if (chofer.localidad == localidadValue && chofer.isAyudante != true) {
        return chofer;
      }
    });
    // Todos esos choferes colocalo aqui en choferesForce
    setChoferesForce(choferesAux);
    setInitialForce(choferesAux);

    // De esa localidad seleccionada dame solamente los choferes off y disponible para jugar
    const initialAux = choferesAux.filter((chofer) => {
      if (chofer.estadoDoc == 0 || chofer.estadoDoc == 1) {
        return chofer;
      }
    });

    setChoferesOrdenados(initialAux);
    setInitialOrdenados(initialAux);
  }, [listaChoferes, localidadValue]);

  const handleInput = (e) => {
    const { name, value } = e.target;
    const index = e.target.dataset.index;

    const nameData = e.target.dataset.name;
    // Controles
    if (nameData == "cerrar") {
      setHasAccion(false);
    }
    console.log(value);
    if (name == "todosDisponible") {
      if (localidadValue == "") {
        setMensajeAlerta("Primero selecione una localidad.");
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => {
          setDispatchAlerta(false);
        }, 3000);
      } else {
        const estado = !propsAccion.todosDisponible;
        setPropsAccion({
          ...propsAccion,
          todosDisponible: estado,
        });
        setChoferesOrdenados(
          choferesOrdenados.map((chofer) => {
            return {
              ...chofer,
              current: {
                ...chofer.current,
                numeroCarga: "",
              },
            };
          })
        );
      }
    }

    // ***** CONTENIDO *****

    // Si el usuario no ha agrupado los choferes que afecte de esta manera:
    if (hasAgrupados == false) {
      if (name == "localidad") {
        setLocalidadValue(value);
      }
      if (name == "numeroCarga") {
        const regex = /^[0-9]+$/;
        const isNumber = regex.test(value);
        if (modoForzar == false) {
          if (isNumber) {
            setChoferesOrdenados(
              choferesOrdenados.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga:
                      i == index ? Number(value) : chofer.current.numeroCarga,
                  },
                };
              })
            );
          }
          if (value == "") {
            setChoferesOrdenados(
              choferesOrdenados.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga: i == index ? "" : chofer.current.numeroCarga,
                  },
                };
              })
            );
          }
        } else if (modoForzar) {
          console.log(value);
          if (isNumber) {
            setChoferesForce(
              choferesForce.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga:
                      i == index ? Number(value) : chofer.current.numeroCarga,
                  },
                };
              })
            );
          }
          if (value == "") {
            setChoferesForce(
              choferesForce.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga: i == index ? "" : chofer.current.numeroCarga,
                  },
                };
              })
            );
          }
        }
      }

      if (name == "disponible") {
        const disponible = e.target.checked;
        const estado = disponible == true ? 1 : 0;
        setChoferesOrdenados(
          choferesOrdenados.map((chofer, i) => {
            const numeroCargaAux =
              estado == 1 ? chofer.current.numeroCarga : "";
            return {
              ...chofer,
              estadoDoc: i == index ? estado : chofer.estadoDoc,
              current: {
                ...chofer.current,
                numeroCarga:
                  i == index ? numeroCargaAux : chofer.current.numeroCarga,
              },
            };
          })
        );
      }
    }
    // Si el usuario agrupo los choferes:
    else if (hasAgrupados) {
      const tipo = e.target.dataset.tipo;
      if (name == "numeroCarga") {
        const regex = /^[0-9]+$/;
        const isNumber = regex.test(value);

        if (tipo == "grupoDisponible") {
          // Solamente grupo disponible
          if (isNumber) {
            setGrupoDisponible(
              grupoDisponible.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga:
                      i == index ? Number(value) : chofer.current.numeroCarga,
                  },
                };
              })
            );
          }
          if (value == "") {
            setGrupoDisponible(
              grupoDisponible.map((chofer, i) => {
                return {
                  ...chofer,
                  current: {
                    ...chofer.current,
                    numeroCarga: "",
                  },
                };
              })
            );
          }
        }
      }
    }
  };

  // TODOS DISPONIBLES // OFF
  useEffect(() => {
    setChoferesOrdenados(
      choferesOrdenados.map((chofer) => {
        return {
          ...chofer,
          estadoDoc: propsAccion.todosDisponible == true ? 1 : 0,
        };
      })
    );
  }, [propsAccion.todosDisponible]);

  // AGRUPAR
  const [grupoDisponible, setGrupoDisponible] = useState([]);
  const [grupoOFF, setGrupoOFF] = useState([]);
  const [hasAgrupados, setHasAgrupados] = useState(false);
  const agruparChoferes = (e) => {
    if (modoForzar) {
      return;
    }
    if (localidadValue == "") {
      setMensajeAlerta("Primero selecione una localidad.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    const { name } = e.target;
    if (name == "agrupar") {
      setHasAgrupados(true);
      setGrupoDisponible(
        choferesOrdenados.filter((chofer) => {
          if (chofer.estadoDoc == 1) {
            return chofer;
          }
        })
      );
      setGrupoOFF(
        choferesOrdenados.filter((chofer) => {
          if (chofer.estadoDoc == 0) {
            return chofer;
          }
        })
      );
    } else if (name == "desagrupar") {
      setHasAgrupados(false);
      setGrupoDisponible([]);
      setGrupoOFF([]);
    }
  };
  // ***** ORDENAR ******
  const [updateLista, setUpdateLista] = useState(false);
  const ordenarTodo = () => {
    console.log(hasAgrupados);
    if (hasAgrupados == false) {
      if (modoForzar == false) {
        setChoferesOrdenados(
          choferesOrdenados.sort((a, b) => {
            return a.current.numeroCarga - b.current.numeroCarga;
          })
        );
      } else if (modoForzar) {
        setChoferesForce(
          choferesForce.sort((a, b) => {
            return a.current.numeroCarga - b.current.numeroCarga;
          })
        );
      }
      setUpdateLista(!updateLista);
    } else if (hasAgrupados == true) {
      // Solamente choferes disponible
      setGrupoDisponible(
        grupoDisponible.sort((a, b) => {
          return a.current.numeroCarga - b.current.numeroCarga;
        })
      );
      setUpdateLista(!updateLista);
    }
  };

  // MODO FORZAR
  const [modoForzar, setModoForzar] = useState(false);

  const forzar = (e) => {
    const { name } = e.target;
    if (localidadValue == "") {
      setMensajeAlerta("Primero selecione una localidad.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    if (name == "forzar") {
      // Reinicia todo
      setHasAgrupados(false);
      setChoferesOrdenados([]);
      setGrupoDisponible([]);
      setGrupoOFF([]);

      // Activa el modo forzar
      setModoForzar(true);
      setChoferesForce(initialForce);
    } else if (name == "normal") {
      setModoForzar(false);
      setChoferesForce([]);
      setChoferesOrdenados(initialOrdenados);
    }
  };

  // ***** GUARDAR ******
  const guardarCambios = async () => {
    const hasPermiso = userMaster.permisos.includes("sortDriver");
    if (!hasPermiso) {
      return;
    }
    // Si no hay localidad selecionada
    if (localidadValue == "") {
      setMensajeAlerta("Primero selecione una localidad.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return "";
    }
    // Si existen numeros duplicados

    if (modoForzar == false) {
      // return "";
      // Si los choferes no estan agrupados, sencillamente toma la informacion de choferesOrdenados
      if (hasAgrupados == false) {
        guardarOrdenDB(choferesOrdenados);
      }
      // Si los choferes si estan agrupados, unifica la informacion de los dos grupos; disponibles y off, y esta informacion unificada carga a la base de datos
      else if (hasAgrupados) {
        const arrayUnificador = [...grupoDisponible, ...grupoOFF];
        guardarOrdenDB(arrayUnificador);
      }
    } else if (modoForzar) {
      // Si hay choferes con mismo numero
      const numerosVistos = new Set();
      const choferesDuplicados = [];
      choferesForce.forEach((chofer, index) => {
        if (numerosVistos.has(chofer.current.numeroCarga)) {
          choferesDuplicados.push(chofer.nombre);
          return;
        } else {
          numerosVistos.add(chofer.current.numeroCarga);
        }
      });
      console.log(numerosVistos);
      if (choferesDuplicados.length > 0) {
        setMensajeAlerta(
          `Existen duplicados: ${choferesDuplicados.map((chofer) => {
            return chofer;
          })}.`
        );
        setTipoAlerta("warning");
        setDispatchAlerta(true);
        setTimeout(() => setDispatchAlerta(false), 4000);
        return "";
      }
    }
  };

  const guardarOrdenDB = (arrayActualizado) => {
    const batch = writeBatch(db);
    arrayActualizado.forEach((item) => {
      const itemActualizar = doc(db, "choferes", item.id);
      batch.update(itemActualizar, {
        estadoDoc: item.estadoDoc,
        "current.numeroCarga": item.current.numeroCarga,
      });
    });
    try {
      batch.commit().then(() => {
        console.log("lote actualizado correctamente!");
      });

      setHasAccion(false);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContainerModalFuntion>
      <BotonQuery
        propsAccion={propsAccion}
        localidadValue={localidadValue}
        listaChoferes={listaChoferes}
        choferesOrdenados={choferesOrdenados}
        choferesForce={choferesForce}
        modoForzar={modoForzar}
        grupoDisponible={grupoDisponible}
        grupoOFF={grupoOFF}
      />
      <CajarModalFunction>
        <ContenedorCabeza>
          <CajaTitulo>
            <Titulo>{propsAccion.titulo}</Titulo>
            <XCerrar data-name="cerrar" onClick={(e) => handleInput(e)}>
              ❌
            </XCerrar>
          </CajaTitulo>
          <WrapControlesHead>
            <CajitaDetalle>
              <TituloDetalle>Localidad:</TituloDetalle>
              <MenuDesplegable
                value={localidadValue}
                name="localidad"
                autoComplete="off"
                disabled={hasAgrupados}
                className={hasAgrupados ? "disabled" : ""}
                onChange={(e) => {
                  handleInput(e);
                }}
              >
                <Opciones value={""} disabled>
                  Selecione Localidad
                </Opciones>
                {localidadesAlmacen.map((loc, index) => {
                  return <Opciones key={index}>{loc.descripcion}</Opciones>;
                })}
              </MenuDesplegable>
            </CajitaDetalle>
            <CajitaDetalle className={hasAgrupados ? "hasAgrupados" : ""}>
              <TituloDetalle>A todos:</TituloDetalle>
              <InterruptorOficial
                handleChange={handleInput}
                name="todosDisponible"
                tipo={"organizarChoferes"}
                valor={propsAccion.todosDisponible}
                // valor={true}
                disabled={hasAgrupados ? true : modoForzar ? true : false}
              />
            </CajitaDetalle>

            <CajitaDetalle className="center">
              {hasAgrupados ? (
                <BtnSimple
                  className={modoForzar ? "modoForzar" : ""}
                  name="desagrupar"
                  onClick={(e) => agruparChoferes(e)}
                >
                  Desagrupar
                </BtnSimple>
              ) : (
                <BtnSimple
                  className={modoForzar ? "modoForzar" : ""}
                  name="agrupar"
                  onClick={(e) => agruparChoferes(e)}
                >
                  Agrupar
                </BtnSimple>
              )}
            </CajitaDetalle>
            <CajitaDetalle>
              {modoForzar ? (
                <BtnSimple name="normal" onClick={(e) => forzar(e)}>
                  Normal
                </BtnSimple>
              ) : (
                <BtnSimple name="forzar" onClick={(e) => forzar(e)}>
                  Forzar
                </BtnSimple>
              )}
            </CajitaDetalle>
          </WrapControlesHead>
        </ContenedorCabeza>
        <ContenedorCuerpo>
          <CajaContenido>
            {modoForzar == false && (
              <>
                {hasAgrupados == false ? (
                  choferesOrdenados.map((chofer, index) => {
                    return (
                      <CardChoferes key={index}>
                        <CajaInterna className="start">
                          <NombreTexto>{index + 1}</NombreTexto>
                          <CajaFotoMain>
                            <Enlaces
                              target="_blank"
                              to={`maestros/choferes/${chofer.numeroDoc}`}
                            >
                              <FotoMain
                                src={chofer.urlFotoPerfil || AvatarGeneral}
                              />
                            </Enlaces>
                          </CajaFotoMain>
                          <CajaNombres>
                            <NombreTexto className="nombreMain">
                              {chofer.nombre + " " + chofer.apellido}
                            </NombreTexto>
                          </CajaNombres>
                        </CajaInterna>
                        <CajaInterna className="center">
                          <CajaNombres>
                            <NombreTexto className="nombreMain">
                              {"Flota: " + chofer.flota + " "}
                            </NombreTexto>
                            <NombreTexto className="nombreMain">
                              {"Telefono: " + chofer.celular}
                            </NombreTexto>
                          </CajaNombres>
                        </CajaInterna>
                        <CajaInterna className="end">
                          <InputNumerador
                            onChange={(e) => handleInput(e)}
                            value={chofer.current.numeroCarga}
                            name="numeroCarga"
                            data-index={index}
                            className={chofer.estadoDoc == 0 ? "disabled" : ""}
                            autoComplete="off"
                            disabled={chofer.estadoDoc == 0 ? true : false}
                          />

                          <InterruptorOficial
                            index={index}
                            handleChange={handleInput}
                            name="disponible"
                            tipo={"chofer"}
                            valor={
                              chofer.estadoDoc == 1
                                ? true
                                : chofer.estadoDoc == 0
                                  ? false
                                  : null
                            }
                          />
                        </CajaInterna>
                      </CardChoferes>
                    );
                  })
                ) : (
                  <>
                    <LineaDivisora className="disponible">
                      <TituloGrupos>Choferes Disponible</TituloGrupos>
                    </LineaDivisora>
                    {grupoDisponible.map((chofer, index) => {
                      return (
                        <CardChoferes key={index}>
                          <CajaInterna className="start">
                            <NombreTexto>{index + 1}</NombreTexto>
                            <CajaFotoMain>
                              <FotoMain src={chofer.urlFotoPerfil} />
                            </CajaFotoMain>
                            <CajaNombres>
                              <NombreTexto className="nombreMain">
                                {chofer.nombre + " " + chofer.apellido}
                              </NombreTexto>
                              <NombreTexto className="nombreMain">
                                <Enlaces
                                  target="_blank"
                                  to={`maestros/choferes/${chofer.numeroDoc}`}
                                >
                                  {chofer.numeroDoc}
                                </Enlaces>
                              </NombreTexto>
                            </CajaNombres>
                          </CajaInterna>
                          <CajaInterna className="center">
                            <CajaNombres>
                              <NombreTexto className="nombreMain">
                                {"Flota: " + chofer.flota + " "}
                              </NombreTexto>
                              <NombreTexto className="nombreMain">
                                {"Telefono: " + chofer.celular}
                              </NombreTexto>
                            </CajaNombres>
                          </CajaInterna>
                          <CajaInterna className="end">
                            <InputNumerador
                              onChange={(e) => handleInput(e)}
                              value={chofer.current.numeroCarga}
                              name="numeroCarga"
                              data-index={index}
                              data-tipo={"grupoDisponible"}
                              // className={tipo}
                              autoComplete="off"
                            />
                          </CajaInterna>
                        </CardChoferes>
                      );
                    })}
                    <LineaDivisora>
                      <TituloGrupos>Choferes OFF</TituloGrupos>
                    </LineaDivisora>
                    {grupoOFF.map((chofer, index) => {
                      return (
                        <CardChoferes key={index}>
                          <CajaInterna className="start">
                            <NombreTexto>{index + 1}</NombreTexto>
                            <CajaFotoMain>
                              <FotoMain src={chofer.urlFotoPerfil} />
                            </CajaFotoMain>
                            <CajaNombres>
                              <NombreTexto className="nombreMain">
                                {chofer.nombre + " " + chofer.apellido}
                              </NombreTexto>
                              <NombreTexto className="nombreMain">
                                <Enlaces
                                  target="_blank"
                                  to={`maestros/choferes/${chofer.numeroDoc}`}
                                >
                                  {chofer.numeroDoc}
                                </Enlaces>
                              </NombreTexto>
                            </CajaNombres>
                          </CajaInterna>
                          <CajaInterna className="center">
                            <CajaNombres>
                              <NombreTexto className="nombreMain">
                                {"Flota: " + chofer.flota + " "}
                              </NombreTexto>
                              <NombreTexto className="nombreMain">
                                {"Telefono: " + chofer.celular}
                              </NombreTexto>
                            </CajaNombres>
                          </CajaInterna>
                        </CardChoferes>
                      );
                    })}
                  </>
                )}
              </>
            )}

            {/* CONTENIDO MODO FORZAR */}
            {modoForzar &&
              choferesForce.map((chofer, index) => {
                return (
                  <CardChoferes key={index}>
                    <CajaInterna className="start">
                      <NombreTexto>{index + 1}</NombreTexto>
                      <CajaFotoMain>
                        <FotoMain src={chofer.urlFotoPerfil} />
                      </CajaFotoMain>
                      <CajaNombres>
                        <NombreTexto className="nombreMain">
                          {chofer.nombre + " " + chofer.apellido}
                        </NombreTexto>
                        <NombreTexto className="nombreMain">
                          <Enlaces
                            target="_blank"
                            to={`maestros/choferes/${chofer.numeroDoc}`}
                          >
                            {chofer.numeroDoc}
                          </Enlaces>
                        </NombreTexto>
                      </CajaNombres>
                    </CajaInterna>
                    <CajaInterna className="center">
                      <CajaNombres>
                        <NombreTexto className="nombreMain">
                          {"Flota: " + chofer.flota + " "}
                        </NombreTexto>
                        <NombreTexto className="nombreMain">
                          {"Telefono: " + chofer.celular}
                        </NombreTexto>
                      </CajaNombres>
                    </CajaInterna>
                    <CajaInterna className="end">
                      <InputNumerador
                        onChange={(e) => handleInput(e)}
                        value={chofer.current.numeroCarga}
                        name="numeroCarga"
                        data-index={index}
                        // className={chofer.estadoDoc == 0 ? "disabled" : ""}
                        autoComplete="off"
                        // disabled={chofer.estadoDoc == 0 ? true : false}
                      />
                      <CajaEstado
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
                        <TextoEstado>
                          {chofer.estadoDoc == "0"
                            ? "OFF"
                            : chofer.estadoDoc == "1"
                              ? "Disponible"
                              : chofer.estadoDoc == "2"
                                ? "Ejecucion"
                                : chofer.estadoDoc == "3"
                                  ? "Inactivo"
                                  : ""}
                        </TextoEstado>
                      </CajaEstado>
                    </CajaInterna>
                  </CardChoferes>
                );
              })}
          </CajaContenido>
          <WrapBtnFinal>
            <BtnSimple onClick={() => ordenarTodo()}>Ordenar</BtnSimple>
            <BtnSimple onClick={() => guardarCambios()}>Guardar</BtnSimple>
          </WrapBtnFinal>
        </ContenedorCuerpo>
      </CajarModalFunction>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </ContainerModalFuntion>
  );
}
const ContainerModalFuntion = styled.div`
  width: 100%;
  height: 100%;
  background-color: #00000077;
  position: absolute;
  top: 0;
  overflow: hidden;
  z-index: 1;
  display: flex;
  justify-content: center;
`;
const CajarModalFunction = styled.div`
  width: 700px;
  height: 80vh;
  border: 1px solid ${Tema.complementary.warning};
  position: fixed;
  top: 10%;
  border-radius: 14px 0 14px 0;
  overflow: hidden;
  background-color: ${Tema.primary.azulOscuro};
`;

const CajaTitulo = styled.div`
  min-height: 30px;
  border: 1px solid ${Tema.primary.grisNatural};
  background-color: #0f1c28;
  overflow: hidden;
  display: flex;
  position: relative;
`;
const Titulo = styled.h2`
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  text-align: center;
  vertical-align: 1.4rem;
  font-size: 1.4rem;

  align-content: center;
`;
const XCerrar = styled.p`
  width: 10%;
  height: 100%;
  align-content: center;
  text-align: center;
  font-size: 1.2rem;
  border: 1px solid red;
  cursor: pointer;
  position: absolute;
  right: 0;
`;

const CajitaDetalle = styled.div`
  display: flex;
  width: auto;
  gap: 5px;
  justify-content: space-between;
  color: ${Tema.secondary.azulOpaco};
  &.center {
    justify-content: center;
  }
  &.hasAgrupados {
    background-color: ${Tema.primary.grisNatural};
    color: ${Tema.neutral.neutral700};
  }
`;

const TituloDetalle = styled.p`
  padding-left: 5px;
  color: inherit;
  text-align: start;
  &.tituloArray {
    text-decoration: underline;
  }
  &.modoDisabled {
    text-decoration: underline;
  }
`;
const MenuDesplegable = styled.select`
  outline: none;
  border: none;
  background-color: ${Tema.secondary.azulGraciel};
  height: 30px;
  width: 150px;
  border-radius: 4px;

  color: ${Tema.primary.azulBrillante};

  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: ${Tema.neutral.neutral700};
    color: #000;
  }
`;

const Opciones = styled.option`
  border: none;
  background-color: ${Tema.secondary.azulProfundo};
`;
const BtnSimple = styled(BtnGeneralButton)`
  margin: 0;
  &.modoForzar {
    background-color: ${Tema.primary.grisNatural};
    cursor: auto;
    &:hover {
      color: white;
    }
  }
`;

const CardChoferes = styled.div`
  width: 100%;
  height: 50px;
  /* border: 1px solid ${Tema.primary.azulBrillante}; */
  border-radius: 8px 0 8px 0;
  display: flex;
  overflow: hidden;
`;
const CajaInterna = styled.div`
  width: 50%;
  display: flex;
  align-items: center;

  gap: 5px;
  height: 100%;
  border: 1px solid ${Tema.primary.grisNatural};
  &.start {
    width: 40%;
  }
  &.center {
    width: 30%;
  }
  &.end {
    width: 30%;
    display: flex;
    justify-content: center;
    gap: 15px;
  }
`;

const CajaFotoMain = styled.div`
  height: 100%;
  display: flex;
  justify-content: center;
`;
const FotoMain = styled.img`
  width: 45px;
  height: 45px;
  object-fit: contain;
  border: 2px solid ${Tema.primary.azulBrillante};
  border-radius: 50%;
`;

const CajaNombres = styled.div`
  height: 100%;
`;
const NombreTexto = styled.h2`
  color: ${Tema.primary.azulBrillante};
  font-size: 13px;
  font-weight: 200;
  padding-left: 5px;
`;
const InputNumerador = styled.input`
  border: none;
  outline: none;
  height: 100%;
  border-radius: 4px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  border: 1px solid ${Tema.secondary.azulOpaco};
  color: ${Tema.primary.azulBrillante};
  width: 60px;
  font-size: 2rem;
  text-align: center;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.disabled {
    background-color: ${Tema.neutral.neutral700};
    border: 1px solid black;
  }
`;
const Enlaces = styled(Link)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const LineaDivisora = styled.div`
  width: 100%;
  height: 30px;
  background-color: ${Tema.primary.grisNatural};
  margin-top: 50px;
  display: flex;
  justify-content: center;
  color: ${Tema.neutral.neutral700};
  &.disponible {
    margin-top: 0;
    background-color: ${Tema.complementary.success};
    color: white;
  }
`;
const TituloGrupos = styled.h2``;

const CajaEstado = styled.div`
  width: 100%;
  height: 100%;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  &.off {
    background-color: gray;
    color: ${Tema.neutral.neutral700};
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
    color: #000;
  }
`;
const TextoEstado = styled.h2``;

const ContenedorCabeza = styled.div`
  /* height: 10%; */
`;
const ContenedorCuerpo = styled.div`
  border: 1px solid #5a4343;
  max-height: 100%;
`;
const CajaContenido = styled.div`
  height: 350px;

  padding: 5px;
  overflow-y: scroll;
  padding-bottom: 10px;
`;
const WrapControlesHead = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  width: 100%;
  border: 1px solid ${Tema.primary.grisNatural};
  display: flex;
  gap: 10px;
  padding: 5px;
  height: 60px;
`;
// 7878
const WrapBtnFinal = styled.div`
  background-color: ${Tema.secondary.azulProfundo};
  width: 100%;
  border: 1px solid ${Tema.primary.grisNatural};
  display: flex;
  gap: 10px;
  padding: 5px;
  height: 60px;

  position: absolute;
  bottom: 0;
  min-height: 50px;
  justify-content: center;
`;
