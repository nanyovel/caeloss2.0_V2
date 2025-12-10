import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { BotonQuery } from "../../components/BotonQuery";
import { collection, doc, updateDoc, writeBatch } from "firebase/firestore";
import db from "../../firebase/firebaseConfig";
import { ModalLoading } from "../../components/ModalLoading";
import { Alerta } from "../../components/Alerta";
import { OpcionUnica } from "../../components/OpcionUnica";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { getDownloadURL, getStorage, ref, uploadBytes } from "firebase/storage";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition";
import { localidadesAlmacen } from "../../components/corporativo/Corporativo";

import MenuPestannias from "../../components/MenuPestannias";
import { CSSLoader } from "../../components/CSSLoader";
import { ElementoPrivilegiado } from "../../context/ElementoPrivilegiado";
import { ClearTheme, Tema, Theme } from "../../config/theme";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../components/InputGeneral";
import { choferSchema } from "../schemas/choferSchema";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import { vehiculosSchema } from "../schemas/vehiculosSchema.js";

export default function AddChofer({ userMaster, modoDisabled }) {
  // // ******************** RECURSOS GENERALES ******************** //
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  // ******************************MANEJANDO LOS INPUTS********************************
  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: "Interno",
      opcion: 0,
      select: true,
      prefijo: "IN",
    },
    {
      nombre: "Externo Indep.",
      opcion: 1,
      select: false,
      prefijo: "EI",
    },
    {
      nombre: "Externo Empresa",
      opcion: 2,
      select: false,
      prefijo: "EE",
    },
    {
      nombre: "Ayudante adicional",
      opcion: 3,
      select: false,
      prefijo: "AE",
    },
  ]);

  const handlePestannias = (e) => {
    console.log("as");
    let index = Number(e.target.dataset.id);
    const name = e.target.name;
    console.log(name);
    if (true) {
      setArrayOpciones((prevOpciones) =>
        prevOpciones.map((opcion, i) => ({
          ...opcion,
          select: i === index,
        }))
      );
    }
    setChoferEditable({ ...choferSchema });
    setChoferAyudante((preState) =>
      preState.map((state, i) => {
        return {
          ...state,
          select: i == 0,
        };
      })
    );
  };

  // 7877
  const [choferAyudante, setChoferAyudante] = useState([
    {
      nombre: "Chofer",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Ayudante",
      opcion: 1,
      select: false,
    },
  ]);
  const handleChoferAyudante = (e) => {
    setChoferEditable({ ...choferSchema });
    const index = Number(e.target.dataset.id);
    console.log(index);
    setChoferAyudante((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i == index,
      }))
    );
  };

  const [choferEditable, setChoferEditable] = useState({
    ...choferSchema,
  });
  const initialHasVisible = {
    codigo: true,
    nombre: true,
    apellido: true,
    cedula: true,
    flota: true,
    placa: true,
    localidad: true,
    vehiculo: true,
    foto: true,
    celular: true,
    empresa: true,
  };
  const [hasVisible, setHasVisible] = useState({
    ...initialHasVisible,
  });
  useEffect(() => {
    if (arrayOpciones[0].select) {
      if (choferAyudante[0].select) {
        setHasVisible({
          ...initialHasVisible,
          empresa: false,
        });
      } else if (choferAyudante[1].select) {
        setHasVisible({
          ...initialHasVisible,
          empresa: false,
          vehiculo: false,
          placa: false,
          flota: false,
        });
      }
    }
    if (arrayOpciones[1].select) {
      setHasVisible({
        ...initialHasVisible,
        flota: false,
        empresa: false,
      });
    }
    if (arrayOpciones[2].select) {
      setHasVisible({
        ...initialHasVisible,
        flota: false,
      });
    }
    if (arrayOpciones[3].select) {
      setHasVisible({
        ...initialHasVisible,
        flota: false,
        empresa: false,
        vehiculo: false,
        placa: false,
      });
    }
  }, [arrayOpciones, choferAyudante]);
  // ******************************MANEJANDO LOS INPUTS********************************
  const [fotoPerfil, setFotoPerfil] = useState("");
  const handleInput = (e) => {
    const { name, value } = e.target;

    if (name == "urlFotoPerfil") {
      setFotoPerfil(e.target.files[0]);
    } else if (name == "placa") {
      setChoferEditable((preventState) => ({
        ...preventState,
        unidadVehicular: {
          ...choferEditable.unidadVehicular,
          placa: value,
        },
      }));
    } else if (name == "vehiculo") {
      const vehiculoFind = vehiculosSchema.find((vehi, index) => {
        if (vehi.descripcion == value) {
          return vehi;
        }
      });

      if (vehiculoFind) {
        setChoferEditable((preventState) => ({
          ...preventState,
          unidadVehicular: {
            ...choferEditable.unidadVehicular,
            descripcion: vehiculoFind.descripcion,
            code: vehiculoFind.code,
            urlFoto: vehiculoFind.urlFoto,
          },
        }));
      }
    } else {
      setChoferEditable((preventState) => ({
        ...preventState,
        [name]: name == "numeroDoc" ? value.toUpperCase() : value,
      }));
    }
  };

  //***********************ENVIAR OBJETO GUARDAR***********************
  const [datosIncompletos, setDatosIncompletos] = useState(false);
  const [dbChoferes, setDBchoferes] = useState([]);

  const enviarObjeto = async () => {
    const hasPermiso = userMaster.permisos.includes("createDriverTMS");
    if (!hasPermiso) {
      console.log("salir");
      return;
    }
    let valorIncompletos = false;
    // *********SI ALGUN DATO ESTA VACIO*********

    // DATOS GENERALES PARA TODOS
    if (
      choferEditable.numeroDoc == "" ||
      choferEditable.nombre == "" ||
      choferEditable.apellido == "" ||
      choferEditable.cedula == "" ||
      choferEditable.celular == "" ||
      // choferEditable.unidadVehicular.placa == "" ||
      choferEditable.localidad == ""
    ) {
      valorIncompletos = true;
      console.log("datos generales incompletos");
    }
    console.log(choferEditable);
    // Si es un chofer interno - tiene flota
    if (
      arrayOpciones[0].select == true &&
      choferAyudante[1].select == false &&
      choferEditable.flota == ""
    ) {
      valorIncompletos = true;
      console.log("flota incompleta");
    }
    // Si no es un ayudante - tiene vehiculo colocado
    if (choferAyudante[1].select == false && arrayOpciones[3].select == false) {
      if (choferEditable.unidadVehicular.placa == "") {
        console.log("vehiculo incompleto");
        valorIncompletos = true;
      }
    }

    if (valorIncompletos) {
      setDatosIncompletos(true);

      setMensajeAlerta("Campos obligatorios incompletos.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      return;
    }

    const batch = writeBatch(db);

    // Si el codigo de chofer ya existe

    const listaChoferes = await fetchDocsByConditionGetDocs(
      "choferes",
      setDBchoferes
    );

    const hasNumero = listaChoferes.some(
      (chofer) => chofer.numeroDoc == choferEditable.numeroDoc
    );
    console.log(listaChoferes);
    if (hasNumero) {
      setMensajeAlerta("El codigo de chofer ya existe.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setIsLoading(true);
    try {
      const tipoChoferSelect = arrayOpciones.find((opcion) => {
        if (opcion.select == true) {
          return opcion;
        }
      });

      let isAyudante = false;
      if (choferAyudante[1].select && arrayOpciones[0].select) {
        isAyudante = true;
      }
      if (arrayOpciones[3].select) {
        isAyudante = true;
      }

      const choferEnviar = {
        ...choferEditable,
        isAyudante: isAyudante,
        fechaCreacion: format(new Date(), `dd/MM/yyyy hh:mm:ss:SSS aa`, {
          locale: es,
        }),

        tipo: tipoChoferSelect.opcion,
        // Ayudante solo puede estar disponible o inactivo
        estadoDoc: isAyudante ? 1 : 0,
      };
      // Cargar foto de perfil
      const storage = getStorage();
      const nombreFoto = "avatars/choferes" + choferEnviar.numeroDoc;
      const storageRefFoto = ref(storage, nombreFoto);
      let newUrlFoto = "";

      // Agregar nuevo documento a choferes en el mismo lote
      const collectionChoferesRef = collection(db, "choferes");
      const nuevoDocumentoRef = doc(collectionChoferesRef);
      batch.set(nuevoDocumentoRef, {
        ...choferEnviar,
        urlFotoPerfil: newUrlFoto,
      });

      await batch.commit();
      setChoferEditable({ ...choferSchema });

      if (fotoPerfil) {
        await uploadBytes(storageRefFoto, fotoPerfil).then(() => {});
        // Ahora entregame la url de la foto de perfil y colocasela en una propiedad del objeto de este usuario en la base de datos
        getDownloadURL(ref(storage, storageRefFoto)).then((url) =>
          updateDoc(nuevoDocumentoRef, {
            urlFotoPerfil: url,
          })
        );
        setIsLoading(false);
        setFotoPerfil("");
      }

      setMensajeAlerta("Chofer creado con exito.");
      setTipoAlerta("success");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
      setDatosIncompletos(false);
    } catch (error) {
      console.log(error);
      setMensajeAlerta("Error con la base de datos");
      setTipoAlerta("error");
      setDispatchAlerta(true);
      setTimeout(() => {
        setDispatchAlerta(false);
      }, 3000);
      setIsLoading(false);
    }
  };

  const hasPermiso = userMaster.permisos.includes("createDriverTMS");
  // const navegacion = useNavigate();

  return (
    <>
      <BotonQuery
        choferEditable={choferEditable}
        arrayOpciones={arrayOpciones}
      />
      {true && hasPermiso && (
        <>
          <ContainerSuperior
            className={Theme.config.modoClear ? "clearModern" : ""}
          >
            <MenuPestannias
              arrayOpciones={arrayOpciones}
              handlePestannias={handlePestannias}
            />
            <ContenedorFoto>
              <CajaNombre>
                {choferEditable?.nombre ? (
                  <NombreTexto>
                    {choferEditable?.nombre + " " + choferEditable?.apellido}
                  </NombreTexto>
                ) : (
                  <NombreTexto>_</NombreTexto>
                )}
              </CajaNombre>
            </ContenedorFoto>
            <CajaBtnHead></CajaBtnHead>
            <Container>
              {arrayOpciones[0].select == true && (
                <>
                  <OpcionUnica
                    titulo="Tipo"
                    name="fechappp"
                    arrayOpciones={choferAyudante}
                    handleOpciones={(e) => handleChoferAyudante(e)}
                  />
                </>
              )}
              <CajasInterna>
                {hasVisible.codigo && (
                  <CajitaDetalle>
                    <TituloDetalle>Codigo:</TituloDetalle>

                    <InputEditable
                      className={`
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        ${datosIncompletos ? "rojo" : ""}
                        `}
                      type="text"
                      value={choferEditable.numeroDoc}
                      name="numeroDoc"
                      autoComplete="off"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  </CajitaDetalle>
                )}
                {hasVisible.nombre && (
                  <CajitaDetalle>
                    <TituloDetalle>Nombre:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.nombre}>
                        {choferEditable.nombre}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.nombre}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="nombre"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}

                {hasVisible.apellido && (
                  <CajitaDetalle>
                    <TituloDetalle>Apellido:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.apellido}>
                        {choferEditable.apellido}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.apellido}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="apellido"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}

                {hasVisible.empresa && (
                  <CajitaDetalle>
                    <TituloDetalle>Empresa:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.empresa}>
                        {choferEditable.empresa}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.empresa}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="empresa"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}
                {hasVisible.cedula && (
                  <CajitaDetalle>
                    <TituloDetalle>Cedula:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.cedula}>
                        {choferEditable.cedula}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.cedula}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="cedula"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}
                {hasVisible.flota && (
                  <CajitaDetalle>
                    <TituloDetalle>Numero flota:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.flota}>
                        {choferEditable.flota}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.flota}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="flota"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}
                {hasVisible.celular && (
                  <CajitaDetalle>
                    <TituloDetalle>Celular:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.celular}>
                        {choferEditable.celular}
                      </DetalleTexto>
                    ) : (
                      <InputEditable
                        type="text"
                        value={choferEditable.celular}
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        name="celular"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}
                {hasVisible.placa && (
                  <CajitaDetalle>
                    <TituloDetalle>Placa:</TituloDetalle>

                    <InputEditable
                      type="text"
                      value={choferEditable.unidadVehicular.placa}
                      className={`
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        ${datosIncompletos ? "rojo" : ""}
                        `}
                      name="placa"
                      autoComplete="off"
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    />
                  </CajitaDetalle>
                )}
                {hasVisible.localidad && (
                  <CajitaDetalle>
                    <TituloDetalle>Localidad:</TituloDetalle>
                    {modoDisabled ? (
                      <DetalleTexto title={choferEditable.localidad}>
                        {choferEditable.localidad}
                      </DetalleTexto>
                    ) : (
                      <MenuDesplegable2
                        value={choferEditable.localidad}
                        name="localidad"
                        autoComplete="off"
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          ${datosIncompletos ? "rojo" : ""}
                          `}
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      >
                        <Opciones2
                          value={""}
                          disabled
                          className={`
                            ${Theme.config.modoClear ? "clearModern" : ""}
                            `}
                        >
                          Selecione Localidad
                        </Opciones2>
                        {localidadesAlmacen.map((loc, index) => {
                          return (
                            <Opciones2
                              key={index}
                              className={`
                              ${Theme.config.modoClear ? "clearModern" : ""}
                              `}
                            >
                              {loc.descripcion}
                            </Opciones2>
                          );
                        })}
                      </MenuDesplegable2>
                    )}
                  </CajitaDetalle>
                )}
                {hasVisible.vehiculo && (
                  <CajitaDetalle>
                    <TituloDetalle>Vehiculo:</TituloDetalle>

                    <MenuDesplegable2
                      value={choferEditable.unidadVehicular.descripcion}
                      name="vehiculo"
                      autoComplete="off"
                      className={`
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        ${datosIncompletos ? "rojo" : ""}
                        `}
                      onChange={(e) => {
                        handleInput(e);
                      }}
                    >
                      <Opciones2
                        value={""}
                        disabled
                        className={`
                          ${Theme.config.modoClear ? "clearModern" : ""}
                          `}
                      >
                        Selecione Vehiculo
                      </Opciones2>
                      {vehiculosSchema.map((veh, index) => {
                        return (
                          <Opciones2
                            key={index}
                            value={veh.descripcion}
                            className={`
                            ${Theme.config.modoClear ? "clearModern" : ""}
                            `}
                          >
                            {veh.descripcion}
                          </Opciones2>
                        );
                      })}
                    </MenuDesplegable2>
                  </CajitaDetalle>
                )}
                {hasVisible.foto && (
                  <CajitaDetalle>
                    <TituloDetalle>Foto:</TituloDetalle>
                    {modoDisabled ? (
                      "📷"
                    ) : (
                      <InputEditable
                        className={`
                        ${Theme.config.modoClear ? "clearModern" : ""}
                        `}
                        type="file"
                        value={choferEditable.urlFotoPerfil}
                        name="urlFotoPerfil"
                        autoComplete="off"
                        onChange={(e) => {
                          handleInput(e);
                        }}
                      />
                    )}
                  </CajitaDetalle>
                )}
              </CajasInterna>
            </Container>
            <ElementoPrivilegiado
              userMaster={userMaster}
              privilegioReq={"createDriverTMS"}
            >
              <BtnSimple onClick={() => enviarObjeto()}>Enviar</BtnSimple>
            </ElementoPrivilegiado>
          </ContainerSuperior>
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
}

const ContainerSuperior = styled.div`
  text-align: center;
  background-color: ${Tema.secondary.azulProfundo};
  padding: 15px;
  border: 2px solid ${Tema.neutral.blancoHueso};
  color: ${Tema.secondary.azulOpaco};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);
    color: white;
  }
`;
const ContenedorFoto = styled.div`
  width: 100%;
`;

const CajaNombre = styled.div``;
const NombreTexto = styled.h2`
  text-align: center;
  color: inherit;
  &.status {
    color: inherit;
  }
`;
const CajaBtnHead = styled.div`
  min-height: 50px;
  width: 100%;
  padding-left: 10px;
  /* height: 50px; */
`;
const Container = styled.div`
  border: 2px solid ${Tema.neutral.blancoHueso};
  border-radius: 10px;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
`;

const CajasInterna = styled.div`
  width: 50%;
  border-radius: 10px;
  padding: 10px;
  /* border: 2px solid ${Tema.neutral.blancoHueso}; */
`;

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;

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
  width: 50%;
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
const DetalleTexto = styled.p`
  text-align: end;
  height: 20px;
  width: 49%;
  white-space: nowrap;
  overflow: hidden;
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
`;
const BtnSimple = styled(BtnGeneralButton)``;

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
  width: 50%;
  border-radius: 5px;
  font-size: 0.8rem;
  padding: 4px;
  border-radius: 4px;

  margin: 0;
  &.codigo {
    width: 65px;
  }
  &.celda {
    width: 100%;
  }
  &.rojo {
    border: 1px solid ${Tema.complementary.danger};
  }
`;
const MenuDesplegable2 = styled(MenuDesplegable)`
  outline: none;
  border: none;
  height: 30px;
  width: 50%;
  border-radius: 4px;
  &.cabecera {
    border: 1px solid ${Tema.secondary.azulOscuro2};
  }
  color: ${Tema.primary.azulBrillante};

  &:focus {
    border: 1px solid ${Tema.primary.azulBrillante};
  }
  &.rojo {
    border: 1px solid ${Tema.complementary.danger};
  }
`;

const Opciones2 = styled(Opciones)`
  border: none;
  background-color: ${Tema.secondary.azulProfundo};
`;
