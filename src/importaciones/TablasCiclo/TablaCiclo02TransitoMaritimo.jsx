import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { Alerta } from "../../components/Alerta";
import { doc, writeBatch } from "firebase/firestore";
import imgTransito from "./../../importaciones/img/02-ship.png";
import db from "../../firebase/firebaseConfig";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { ModalLoading } from "../../components/ModalLoading";
import FuncionUpWayDate from "../components/FuncionUpWayDate";
import { faFloppyDisk } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  calcDiasRestante,
  colorDaysRemaining,
  fechaConfirmada,
} from "../components/libs.jsx";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { InputSimpleEditable } from "../../components/InputGeneral.jsx";
import ImgInfo from "../../../public/img/informacion.png";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import {
  fetchDocsByConditionGetDocs,
  fetchDocsByIn,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";
import { CSSLoader } from "../../components/CSSLoader.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";
import { inputAFormat } from "../../libs/FechaFormat.jsx";
import { FuncionEnviarCorreo } from "../../libs/FuncionEnviarCorreo.js";
import { PlantillaBL } from "../../libs/PlantillasCorreo/PlantillaBL.js";
import MenuPestannias from "../../components/MenuPestannias.jsx";

export const TablaCiclo02TransitoMaritimo = ({
  userMaster,
  //
}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [habilitar, setHabilitar] = useState({
    search: true,
    // status:true,
    opcionesUnicas: true,
  });

  //********************* CARGAR EL ESTADO GLOBAL (ORDENES ABIERTAS)************************** */
  const [dbBLTransito, setDBBLTransito] = useState([]);
  useDocByCondition("billOfLading2", setDBBLTransito, "isTransito", "==", true);

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);
  useEffect(() => {
    if (dbBLTransito.length > 0) {
      setIsLoading(false);
    }

    if (dbBLTransito.length == 0) {
      setIsLoading(true);
    }
  }, [dbBLTransito]);
  // // ************************* CONSOLIDACION ************************* //
  const [listaBLs, setListaBLs] = useState([]);
  const [initialValueBLs, setInitialValueBLs] = useState([]);
  const [listaBLsEditable, setListaBLsEditable] = useState([]);
  const [initialValueEditable, setInitialValueEditable] = useState([]);
  const [cargaComplete, setCargaComplete] = useState(false);
  useEffect(() => {
    //Agregar propiedad de dias restantes
    console.log(dbBLTransito);
    const blParsed = dbBLTransito.map((bill) => {
      const diasRestantes = calcDiasRestante(
        bill.llegada02AlPais.fecha,
        bill.diasLibres
      );
      console.log(diasRestantes);
      return {
        ...bill,
        diasRestantes: diasRestantes,
      };
    });

    // Ordenar por dias libres
    const blsOrdenados = blParsed.sort((a, b) => {
      return a.diasRestantes - b.diasRestantes;
    });

    setInitialValueBLs(blsOrdenados);
    setListaBLs(blsOrdenados);

    const editable = blsOrdenados.map((bl) => ({
      ...bl,
      valoresAux: {
        // initialValueLlegadaAlPais: bl.llegadaAlPais,
        llegadaAlPaisMostrar: "",
        fijado: false,
      },
    }));
    setListaBLsEditable(editable);
    setInitialValueEditable(editable);
    setCargaComplete(true);
  }, [dbBLTransito]);

  // // ******************** MANEJANDO Pestañas ******************** //

  const [arrayPestannias, setArrayPestannias] = useState([
    {
      nombre: "BLs",
      select: true,
      code: "bls",
    },

    {
      nombre: "Avanzar",
      select: false,
      code: "avanzar",
    },
  ]);

  const handlePestannias = (e) => {
    const codeDataset = e.target.dataset.code;

    const arrayPestanniasAux = arrayPestannias.map((opcion) => {
      console.log(codeDataset);
      console.log(opcion.code);
      return {
        ...opcion,
        select: codeDataset === opcion.code,
      };
    });
    setArrayPestannias(arrayPestanniasAux);
    const opcionSelec = arrayPestanniasAux.find((opcion) => opcion.select);
  };

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entradaMaster = e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);
    const pestanniaSelect = arrayPestannias.find((opcion) => opcion.select);
    if (pestanniaSelect.code == "bls") {
      if (e.target.name == "inputBuscar") {
        setListaBLs(
          initialValueBLs.filter((bl) => {
            if (
              bl.numeroDoc.toLowerCase().includes(entradaMaster) ||
              bl.proveedor.toLowerCase().includes(entradaMaster) ||
              bl.naviera.toLowerCase().includes(entradaMaster) ||
              bl.puerto.toLowerCase().includes(entradaMaster)
            ) {
              return bl;
            }
          })
        );
      }
    } else if (pestanniaSelect.code == "avanzar") {
      if (e.target.name == "inputBuscar") {
        setListaBLsEditable(
          initialValueEditable.filter((bill) => {
            if (
              bill.numeroDoc.toLowerCase().includes(entradaMaster) ||
              bill.proveedor.toLowerCase().includes(entradaMaster) ||
              bill.naviera.toLowerCase().includes(entradaMaster) ||
              bill.puerto.toLowerCase().includes(entradaMaster)
            ) {
              return bill;
            }
          })
        );
      }
    }

    if (e.target.value == "" && buscarDocInput == "") {
      // setListaBLsMaster(initialValueBLs);
      setListaBLs(initialValueBLs);
      setListaFurgonesMaster(initialValueFurgones);
      // setListaMat(initialValueMat);
      setListaBLsEditable(initialValueEditable);
    }
  };

  // **************************** CODIGO AVANZAR ****************************

  const handleInputsTabla = (e) => {
    let index = Number(e.target.dataset.id);
    const { name, value } = e.target;
    console.log(value);
    const fechaCorrecta = validarFecha(value);

    if (fechaCorrecta == false) {
      console.log(555555555555);
      return;
    } else {
      setListaBLsEditable(
        listaBLsEditable.map((bl, i) => {
          if (i == index) {
            return {
              ...bl,
              llegada02AlPais: {
                ...bl.llegada02AlPais,
                fecha: inputAFormat(value),
                confirmada: true,
              },
              valoresAux: {
                ...bl.valoresAux,
                llegadaAlPaisMostrar: value,
              },
            };
          } else {
            return { ...bl };
          }
        })
      );
    }
  };

  function validarFecha(valor) {
    // 1️⃣ Verifica si está vacío
    if (valor === "") {
      setMensajeAlerta("Colocar fecha.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return false;
    }

    // 2️⃣ Verifica si es una fecha válida
    const fecha = new Date(valor);
    const esValida = !isNaN(fecha.getTime()); // true si es válida

    if (!esValida) {
      setMensajeAlerta("La fecha ingresada no es válida.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return false;
    }

    // 3️⃣ (Opcional) Verifica si es una fecha futura, pasada, etc.
    // Ejemplo: si no puede ser una fecha futura
    const hoy = new Date();
    if (fecha > hoy) {
      setMensajeAlerta("La fecha no puede ser futura.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return false;
    }

    // ✅ Todo correcto
    return true;
  }

  const fijar = (e) => {
    let indexDataset = Number(e.target.dataset.index);
    let proceder = true;
    console.log(listaBLsEditable);
    listaBLsEditable.forEach((bl, index) => {
      if (indexDataset == index) {
        if (bl.valoresAux.llegadaAlPaisMostrar == "") {
          setMensajeAlerta("Favor indicar fecha.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          proceder = false;
        }
      }
    });
    if (!proceder) {
      return;
    }

    const blAux = listaBLsEditable.map((bl, index) => {
      if (index == indexDataset) {
        const fechaCorrecta = validarFecha(bl.valoresAux.llegadaAlPaisMostrar);
        if (fechaCorrecta) {
          return {
            ...bl,
            valoresAux: {
              ...bl.valoresAux,
              fijado: e.target.checked,
            },
          };
        }
      }
      return { ...bl };
    });

    setListaBLsEditable(blAux);
    setInitialValueEditable(blAux);
  };

  const guardarDatos = async () => {
    const hasPermiso = userMaster.permisos.includes("blIngresarPaisIMS");
    if (!hasPermiso) {
      return;
    }

    // Si el usuario no ha fijado ninguna fecha
    const hasFijado = listaBLsEditable.some((bl) => bl.valoresAux.fijado);
    if (!hasFijado) {
      setMensajeAlerta("Aun no fija fecha a ningun BL.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    try {
      setIsLoading(true);
      const batch = writeBatch(db);
      for (const bl of listaBLsEditable) {
        if (bl.valoresAux.fijado) {
          let tipoBL = 0;
          if (bl?.tipo == 1) {
            tipoBL = 1;
          }
          let furgonesMaster = [];
          if (tipoBL === 0) {
            furgonesMaster = await fetchDocsByConditionGetDocs(
              "furgones",
              undefined,
              "datosBL.numeroBL",
              "==",
              bl.numeroDoc,
              undefined
            );
          }
          // Actualiza los furgones de cada BL
          const fechaInput = bl.valoresAux.llegadaAlPaisMostrar;
          const annio = fechaInput.slice(0, 4);
          const mes = fechaInput.slice(5, 7);
          const dia = fechaInput.slice(8, 10);

          const {
            llegadaAlPais,
            llegadaAlmacen,
            llegadaDptoImport,
            llegadaSap,
          } = FuncionUpWayDate(annio, mes, dia, 2);

          let furgonesUpdate = [];
          const blActualizar = doc(db, "billOfLading2", bl.id);
          let partidasUP = bl.fleteSuelto.partidas;

          // Si el BL es de furgones normal
          if (tipoBL === 0) {
            furgonesUpdate = furgonesMaster;
            //
            //
            //
            furgonesUpdate.forEach((furgon) => {
              const furgonActualizar = doc(db, "furgones", furgon.id);
              batch.update(furgonActualizar, {
                status: 2,
                fechas: {
                  ...furgon.fechas,
                  llegada02AlPais: {
                    fecha: llegadaAlPais,
                    confirmada: true,
                  },
                  llegada03Almacen: {
                    fecha: llegadaAlmacen,
                    confirmada: false,
                  },
                  llegada04DptoImport: {
                    fecha: llegadaDptoImport,
                    confirmada: false,
                  },
                  llegada05Concluido: {
                    fecha: llegadaSap,
                    confirmada: false,
                  },
                },
              });
            });
          }
          // Si el BL es de carga suelta
          else if (tipoBL === 1) {
            furgonesUpdate = bl.fleteSuelto.partidas;
            partidasUP = furgonesUpdate.map((part) => {
              return {
                ...part,
                status: 2,
                fechas: {
                  ...part.fechas,
                  llegada02AlPais: {
                    fecha: llegadaAlPais,
                    confirmada: true,
                  },
                  llegada03Almacen: {
                    fecha: llegadaAlmacen,
                    confirmada: false,
                  },
                  llegada04DptoImport: {
                    fecha: llegadaDptoImport,
                    confirmada: false,
                  },
                  llegada05Concluido: {
                    fecha: llegadaSap,
                    confirmada: false,
                  },
                },
              };
            });
          }

          //
          // Actualiza el BL

          batch.update(blActualizar, {
            llegada02AlPais: bl.llegada02AlPais,
            diasRestantes: null,
            isTransito: false,
            "fleteSuelto.partidas": partidasUP,
          });

          // 🟢🟢🟢🟢🟢********* ENVIAR CORREOS *************🟢🟢🟢🟢🟢*
          let idsOrdenes = [];
          let codigosItems = [];
          if (tipoBL === 0) {
            furgonesUpdate.forEach((furgon) => {
              furgon.materiales.forEach((item) => {
                idsOrdenes.push(item.idOrdenCompra);
              });
            });
            codigosItems = furgonesUpdate
              .flatMap((furgon) => furgon.materiales)
              .map((item) => item.codigo);
          } else if (tipoBL === 1) {
            codigosItems = bl.fleteSuelto.materiales.map((item) => item.codigo);

            bl.fleteSuelto.materiales.forEach((item) => {
              idsOrdenes.push(item.idOrdenCompra);
            });
          }

          const notificacionesOrdenes = await fetchDocsByIn(
            "notificaciones",
            undefined,
            "idDoc",
            idsOrdenes
          );

          const notificacionesArticulos = await fetchDocsByIn(
            "notificaciones",
            undefined,
            "idDoc",
            codigosItems
          );

          // Conglo
          const notificaciones = [
            ...notificacionesOrdenes,
            ...notificacionesArticulos,
          ];
          const correoDestinos = notificaciones
            .flatMap((not) => not.destinatarios)
            .map((dest) => dest.correo);

          const destinos = [...new Set(correoDestinos)];

          if (destinos.length > 0) {
            FuncionEnviarCorreo({
              para: destinos,
              asunto: "📍 Mercancia en el pais.",
              mensaje: PlantillaBL({
                billOfLading: bl,
                furgones: furgonesUpdate,
                // Mercancia en el pais es estado 2,
                estadoDoc: 2,
              }),
            });
          }
        }
      }

      await batch.commit();
      setIsLoading(false);

      setMensajeAlerta("Actualizado correctamente.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
    } catch (error) {
      console.error("Error al realizar la transacción:", error);
      setIsLoading(false);
      setMensajeAlerta("Error con la base de datos.");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 7000);
    }
  };
  const [hasAviso, setHasAviso] = useState(false);
  return (
    <>
      <ElementoPrivilegiado
        userMaster={userMaster}
        privilegioReq="blIngresarPaisIMS"
      >
        <MenuPestannias
          arrayOpciones={arrayPestannias}
          handlePestannias={handlePestannias}
        />{" "}
      </ElementoPrivilegiado>

      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de BLs rumbo a Rep. Dom.
          </TituloEncabezadoTabla>
          <CajaImgInfo onClick={() => setHasAviso(true)}>
            <ImgIconInfo src={ImgInfo} />
          </CajaImgInfo>
          {hasAviso ? (
            <ModalInfo
              setHasAviso={setHasAviso}
              titulo={"Transito Marítimo"}
              texto={
                "Es la segunda etapa del ciclo, inicia cuando el proveedor carga el contenedor y lo envía hacia Rep. Dominicana y finaliza cuando el contenedor llega al país"
              }
            ></ModalInfo>
          ) : null}
        </EncabezadoTabla>

        <CajaControles>
          {arrayPestannias.find((opcion) => opcion.select).code ===
            "avanzar" && (
            <ElementoPrivilegiado
              userMaster={userMaster}
              privilegioReq="blIngresarPaisIMS"
            >
              <CajaBtnAvanzar>
                {
                  <CajaBtnS>
                    <BtnAvanzar onClick={() => guardarDatos()}>
                      <Icono icon={faFloppyDisk} />
                      Guardar
                    </BtnAvanzar>
                  </CajaBtnS>
                }
              </CajaBtnAvanzar>
            </ElementoPrivilegiado>
          )}
          <ControlesTablasMain
            habilitar={habilitar}
            handleSearch={handleSearch}
            buscarDocInput={buscarDocInput}
            tipo={"transito"}
          />
        </CajaControles>
      </CabeceraListaAll>

      <br />
      <>
        {arrayPestannias.find((opcion) => opcion.select).code === "bls" && (
          <>
            <CajaDescrip>
              <TextoDescriptivo>
                La pestaña BLs muestra una lista de todos los BL en transito
                maritimo.
              </TextoDescriptivo>
            </CajaDescrip>

            <CajaTabla>
              <Tabla>
                <thead>
                  <Filas className="cabeza">
                    <CeldaHead>N°</CeldaHead>
                    <CeldaHead>Numero1111*</CeldaHead>
                    <CeldaHead>Proveedor</CeldaHead>
                    <CeldaHead>Naviera</CeldaHead>
                    <CeldaHead>Puerto</CeldaHead>
                    <CeldaHead>DL</CeldaHead>
                    <CeldaHead>DR</CeldaHead>
                    <CeldaHead>Llegada al pais</CeldaHead>
                  </Filas>
                </thead>
                <tbody>
                  {listaBLs.map((bl, index) => {
                    return (
                      <Filas
                        key={index}
                        className={`
                          body 
                          `}
                      >
                        <CeldasBody>{index + 1}</CeldasBody>
                        <CeldasBody data-id={index}>
                          <Enlaces
                            to={`/importaciones/maestros/billoflading/${encodeURIComponent(bl.numeroDoc)}`}
                            target="_blank"
                          >
                            {bl.numeroDoc}
                          </Enlaces>
                        </CeldasBody>
                        <CeldasBody title={bl.proveedor} className="proveedor">
                          {bl.proveedor}
                        </CeldasBody>
                        <CeldasBody>{bl.naviera}</CeldasBody>
                        <CeldasBody>{bl.puerto}</CeldasBody>
                        <CeldasBody>{bl.diasLibres}</CeldasBody>
                        <CeldasBody>
                          {bl.tipo != 1 && (
                            <>
                              {bl.diasRestantes}

                              {colorDaysRemaining(bl.diasRestantes)}
                            </>
                          )}
                        </CeldasBody>
                        <CeldasBody
                          title={
                            bl.llegada02AlPais?.fecha?.slice(0, 10) +
                            " " +
                            fechaConfirmada(
                              bl.llegada02AlPais?.confirmada,
                              true
                            )
                          }
                        >
                          {bl.llegada02AlPais?.fecha?.slice(0, 10)}

                          {fechaConfirmada(bl.llegada02AlPais?.confirmada)}
                        </CeldasBody>
                      </Filas>
                    );
                  })}
                </tbody>
              </Tabla>
            </CajaTabla>
          </>
        )}
        {listaBLs.length == 0 && cargaComplete == true ? (
          <CajaSinFurgones>
            <TextoSinFurgones>
              ~ No existen BLs en status Transito Maritimo. ~
            </TextoSinFurgones>
            <CajaImagen>
              <Imagen src={imgTransito} />
              <Xmark>❌</Xmark>
            </CajaImagen>
          </CajaSinFurgones>
        ) : (
          ""
        )}
      </>
      {arrayPestannias.find((opcion) => opcion.select).code === "avanzar" && (
        <>
          <CajaTabla>
            <Tabla>
              <thead>
                <Filas className="cabeza">
                  <CeldaHead>N°</CeldaHead>
                  <CeldaHead>Numero*</CeldaHead>
                  <CeldaHead>Proveedor</CeldaHead>
                  <CeldaHead>Naviera</CeldaHead>
                  <CeldaHead>Puerto</CeldaHead>
                  <CeldaHead>DL</CeldaHead>
                  <CeldaHead>DR</CeldaHead>
                  <CeldaHead>Llegó al país:</CeldaHead>
                  <CeldaHead>Fijar Fecha</CeldaHead>
                </Filas>
              </thead>
              <tbody>
                {listaBLsEditable.map((bl, index) => {
                  return (
                    <Filas
                      key={index}
                      className={`
                      body 
                      `}
                      // ${listaBLsEditable[index].valoresAux.fijado ? " fijado " : ""}
                    >
                      <CeldasBody>{index + 1}</CeldasBody>
                      <CeldasBody data-id={index}>
                        <Enlaces
                          to={`/importaciones/maestros/billoflading/${encodeURIComponent(bl.numeroDoc)}`}
                          target="_blank"
                        >
                          {bl.numeroDoc}
                        </Enlaces>
                      </CeldasBody>
                      <CeldasBody title={bl.proveedor} className="proveedor">
                        {bl.proveedor}
                      </CeldasBody>
                      <CeldasBody>{bl.naviera}</CeldasBody>
                      <CeldasBody>{bl.puerto}</CeldasBody>
                      <CeldasBody>{bl.diasLibres}</CeldasBody>
                      <CeldasBody>
                        {bl.tipo != 1 && (
                          <>
                            {bl.diasRestantes}
                            {colorDaysRemaining(bl.diasRestantes)}
                          </>
                        )}
                      </CeldasBody>

                      <CeldasBody>
                        <InputEditable
                          type="date"
                          data-id={index}
                          value={bl.valoresAux.llegadaAlPaisMostrar}
                          name="llegadaAlPais"
                          onChange={(e) => {
                            handleInputsTabla(e);
                          }}
                          disabled={listaBLsEditable[index].fijado}
                        />
                      </CeldasBody>
                      <CeldasBody className="celdaBtn">
                        <CheckboxContainer>
                          {/* 123 */}
                          <HiddenCheckbox
                            className="checkbox"
                            name="checkboxRecibido"
                            type="checkbox"
                            data-index={index}
                            onChange={(e) => fijar(e)}
                            checked={bl.valoresAux.fijado}
                          />
                          <Checkmark> </Checkmark>
                        </CheckboxContainer>

                        {/* {bl.fijado ? (
                          <BtnFijar
                            data-index={index}
                            onClick={(e) => editar(e)}
                          >
                            Quitar 🟡
                          </BtnFijar>
                        ) : (
                          <BtnFijar
                            data-index={index}
                            onClick={(e) => fijar(e)}
                          >
                            Fijar 🖋️
                          </BtnFijar>
                        )} */}
                      </CeldasBody>
                    </Filas>
                  );
                })}
              </tbody>
            </Tabla>
          </CajaTabla>
          {listaBLs.length == 0 && cargaComplete == true ? (
            <CajaSinFurgones>
              <TextoSinFurgones>
                ~ No existen BLs en status Transito Maritimo ~
              </TextoSinFurgones>
              <CajaImagen>
                <Imagen src={imgTransito} />
                <Xmark>❌</Xmark>
              </CajaImagen>
            </CajaSinFurgones>
          ) : (
            ""
          )}
        </>
      )}
      {isLoading ? <ModalLoading completa={true} /> : ""}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
};
const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
  margin-top: 10px;
`;
const CajaTabla = styled(CajaTablaGroup)`
  overflow-x: scroll;
  padding: 0 10px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }

  margin-bottom: 100px;
`;
const Tabla = styled(TablaGroup)`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
`;

const Filas = styled(FilasGroup)`
  /* Este azul opaco era el color anterior de los texto */
  /* Se ve bien pero donde hay luz se ve menos */
  color: ${Tema.secondary.azulOpaco};
  color: ${Tema.neutral.blancoHueso};
  &.body {
    font-weight: normal;
    border-bottom: 1px solid #49444457;
  }
  &.descripcion {
    text-align: start;
  }

  &.filaSelected {
    background-color: ${Tema.secondary.azulProfundo};
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }

  &:hover {
    /* background-color: ${Tema.secondary.azulProfundo}; */
  }
  &.fijado {
    background-color: ${Tema.primary.grisNatural};
    color: white;
  }
  &.negativo {
    &.bodyEditabe {
      background-color: #888120b1;
    }
    color: ${Tema.complementary.danger};
  }
`;

const CeldaHead = styled(CeldaHeadGroup)`
  border-bottom: 1px solid #605e5e;
  padding: 3px 7px;
  text-align: center;
  border: 1px solid #000;
  font-size: 0.9rem;
  &.qty {
    width: 300px;
  }
  &.comentarios {
    max-width: 200px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  /* background-color: blue; */
  /* height: 60px; */
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
  &.index {
    /* max-width: 5px; */
    /* background-color: red; */
  }

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 150px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }
  &.comentarios {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.status {
    max-width: 80px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &.celdaBtn {
    /* display: flex; */
    flex-direction: row;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const EncabezadoTabla = styled.div`
  text-decoration: underline;
  display: flex;
  justify-content: start;
  align-items: center;
  @media screen and (max-width: 720px) {
    padding-left: 0;
  }
`;
const TituloEncabezadoTabla = styled.h2`
  color: black;
  font-size: 1.2rem;
  font-weight: normal;
  padding: 0 10px;
  @media screen and (max-width: 500px) {
    font-size: 16px;
  }
  @media screen and (max-width: 420px) {
    font-size: 14px;
  }

  &.descripcionEtapa {
    font-size: 0.9rem;
    margin: 0;
    padding: 0 15px;
    @media screen and (max-width: 480px) {
      font-size: 12px;
      /* border: 1px solid red; */
    }
  }
`;

const CajaControles = styled.div`
  display: flex;
  align-items: center;
  @media screen and (max-width: 480px) {
    display: flex;
    flex-direction: column;
    justify-content: start;
  }
`;
const CajaBtnAvanzar = styled.div`
  /* min-width: 150px; */
  display: flex;
  justify-content: start;
  padding-left: 15px;
  @media screen and (max-width: 480px) {
    width: 100%;
  }
`;

const BtnAvanzar = styled(BtnGeneralButton)`
  height: 30px;
  margin: 0;
  &.avanzar {
    background-color: ${Tema.complementary.warning};
    color: black;

    &.modoAvanzar {
      background-color: #a79d9d;
      color: #383e44;
    }
    &:focus {
      border: 1px solid white;
    }
    &:hover {
      background-color: white;
    }
    &:active {
      background-color: #0074d9;
      color: white;
    }
  }
  /* min-width: 100px; */
`;

const InputCelda = styled.input`
  border: none;
  outline: none;
  height: 25px;
  padding: 5px;
  background-color: ${Tema.secondary.azulGraciel};
  &.filaSelected {
    background-color: inherit;
  }
  border: none;
  color: ${Tema.primary.azulBrillante};
  width: 100%;
  display: flex;
  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
`;

const InputEditable = styled(InputSimpleEditable)`
  height: 30px;
  width: 100px;
  min-width: 130px;
  border: 1px solid ${Tema.secondary.azulProfundo};
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 0;
  color: inherit;
  color: white;
  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
  &.fijado {
    background-color: red;
  }
`;

const BtnFijar = styled(BtnGeneralButton)`
  /* width: 40%; */
  margin: 5px;
  height: 30px;
  margin: 0;
  font-size: 0.9rem;
  @media screen and (max-width: 900px) {
    /* width: 90%; */
  }
`;

const CajaSinFurgones = styled.div`
  height: 200px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TextoSinFurgones = styled.h2`
  color: ${Tema.primary.azulBrillante};
`;

const Imagen = styled.img`
  width: 150px;
  filter: grayscale(100%);
`;
const CajaImagen = styled.div`
  /* border: 1px solid red; */
  position: relative;
`;
const Xmark = styled.h2`
  font-size: 4rem;
  position: absolute;
  bottom: 0;
`;

const Icono = styled(FontAwesomeIcon)`
  margin-right: 10px;
  &.accion {
    cursor: pointer;
  }
`;
const CajaImgInfo = styled.div`
  position: absolute;
  right: 0;
  /* top: -10px; */
  width: 35px;
  height: 35px;
  margin-left: 25px;
  border: 1px solid white;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: ease all 0.2s;
  background-color: #818181;
  border-radius: 4px;
  &:hover {
    transform: scale(1.1);
    right: 5px;
    background-color: ${ClearTheme.complementary.warning};
    cursor: pointer;
  }
`;
const ImgIconInfo = styled.img`
  width: 25px;
`;
const CajaBtnS = styled.div`
  display: flex;
  gap: 8px;
  /* margin-right: 20px; */
  width: auto;
`;
const CajaDescrip = styled.div`
  width: 100%;
  min-height: 40px;
  padding: 8px;
  color: ${ClearTheme.complementary.warning};
`;
const TextoDescriptivo = styled.p``;

// checkbox
const CheckboxContainer = styled.label`
  position: relative;
  cursor: pointer;
  font-size: 16px;
  user-select: none;
  color: #333;
  width: 100%;
  display: flex;
  height: 30px;

  justify-content: center;
  align-items: center;
`;

const HiddenCheckbox = styled.input.attrs({ type: "checkbox" })`
  position: absolute;
  opacity: 0;
  cursor: pointer;
`;

const Checkmark = styled.span`
  position: absolute;
  left: 50%;
  top: 50%;
  /* transform: translateY(-50%); */
  transform: translate(-50%, -50%);
  height: 25px;
  width: 100%;
  background-color: #eee;
  border-radius: 6px;
  transition: all 0.3s ease;
  border: 1px solid #ccc;

  /* ✅ Hover del contenedor afecta al checkmark */
  ${CheckboxContainer}:hover ${HiddenCheckbox} ~ & {
    /* background-color: #cacaca; */
    border: 1px solid #18571a;
  }

  /* ✅ Cuando está marcado */
  ${HiddenCheckbox}:checked ~ & {
    background-color: #4caf50;
    border-color: #4caf50;
  }

  /* Check interno (✔) */
  &::after {
    content: "";
    position: absolute;
    display: none;
  }

  ${HiddenCheckbox}:checked ~ &::after {
    display: block;
    left: 50%;
    top: 20%;
    width: 5px;
    height: 10px;
    border: solid white;
    border-width: 0 3px 3px 0;
    transform: rotate(45deg);
    /* transform: translate(-50%, -50%); */
  }
`;
