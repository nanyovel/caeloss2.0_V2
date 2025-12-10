import React, { useEffect, useState } from "react";
import styled from "styled-components";

import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../../components/InputGeneral";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { fetchEncontrarReq } from "../../../libs/useDocByCondition";
import { useAuth } from "../../../context/AuthContext";
import { Alerta } from "../../../components/Alerta";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { OpcionUnica } from "../../../components/OpcionUnica";
import { ClearTheme, Tema, Theme } from "../../../config/theme";
import Table from "../../../components/JSXElements/Tablas/Table";

export default function EncontrarMisReq({ userMaster }) {
  // *************** CONFIG GENERAL *******************
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);

  // ********** FUNCIONES ESPECIFICAS **********
  const regresar = () => {
    setDatosEncontrados(false);
    setListaSolicitudesDB([]);
  };

  // ****************** MANEJAR RANGO DE FECHAS ******************
  const [rangoFecha, setRangoFecha] = useState([
    {
      nombre: "Ult. 30 dias",
      qtyDias: 30,
      select: true,
    },
    {
      nombre: "Ult. 60 dias",
      qtyDias: 60,
      select: false,
    },
    {
      nombre: "Ult. 90 dias",
      qtyDias: 90,
      select: false,
    },
  ]);
  const handleInput = (e) => {
    let index = Number(e.target.dataset.id);
    const { value, name } = e.target;
    if (name == "fecha") {
      setRangoFecha(
        rangoFecha.map((rango, i) => {
          return {
            ...rango,
            select: i == index,
          };
        })
      );
    }
  };
  const [fechaInicial, setFechaInicial] = useState();
  const ahora = new Date();
  const [fechaFinal, setFechaFin] = useState(
    new Date(
      ahora.getFullYear(),
      ahora.getMonth(),
      ahora.getDate(),
      23,
      59,
      59,
      999
    )
  );
  useEffect(() => {
    const fechaInicio = new Date();

    fechaInicio.setDate(
      fechaInicio.getDate() -
        rangoFecha.find((rango) => rango.select).qtyDias +
        1
    ); // Restamos los días
    fechaInicio.setHours(0, 0, 0, 0); // Ajustamos a las 00:00
    setFechaInicial(fechaInicio);
  }, [rangoFecha]);

  // ****************** CODIGO ENCONTRAR MIS SOLICITUDES ******************
  const [paramsSearch, setParamsSearch] = useState({
    tipoSolicitud: "",
    palabraClave: "",
  });
  const handleDetalles = (e) => {
    const { name, value } = e.target;
    setParamsSearch({
      ...paramsSearch,
      [name]: name == "tipoSolicitud" ? Number(value) : value,
    });
  };

  // ****************** LLAMADA A LA BASE DE DATOS******************
  const [listaSolicitudesDB, setListaSolicitudesDB] = useState([]);
  const [datosEncontrado, setDatosEncontrados] = useState(false);

  const traerSolicitudes = async (e) => {
    e.preventDefault();
    let solicitudSeleccionada = false;
    if (paramsSearch.tipoSolicitud >= 0) {
      solicitudSeleccionada = true;
    }
    if ((solicitudSeleccionada = false)) {
      console.log(paramsSearch);
      // Si el usuario no coloca palabra clave, entonces que no se realice la consulta
      setMensajeAlerta("Seleccione el tipo de solicitud deseado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    if (paramsSearch.palabraClave == "") {
      // Si el usuario no coloca palabra clave, entonces que no se realice la consulta
      setMensajeAlerta("Colocar al menos una palabra clave.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    const palabrasParsed = paramsSearch.palabraClave.split(" ");
    const palabrasFilter = palabrasParsed.filter((palabra) => {
      if (palabra != "") {
        return palabra;
      }
    });
    const palabrasMinus = palabrasFilter.map((palabra) =>
      palabra.toLocaleLowerCase()
    );
    // return "";
    if (usuario) {
      try {
        const datos = await fetchEncontrarReq(
          "misSolicitudes",
          "transferRequest",
          fechaInicial,
          fechaFinal,
          palabrasMinus,
          Number(paramsSearch.tipoSolicitud),
          userMaster.id
        );

        if (datos == "error") {
          setMensajeAlerta("Error 1 con la base de datos.");
          setTipoAlerta("error");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return "";
        }

        if (datos.length == 0) {
          setMensajeAlerta("No existen coincidencias.");
          setTipoAlerta("warning");
          setDispatchAlerta(true);
          setTimeout(() => setDispatchAlerta(false), 3000);
          return;
        } else if (datos.length > 0) {
          console.log(datos);
          setDatosEncontrados(true);
          setListaSolicitudesDB(datos);
          setValueKeyWor("");
        }
      } catch (error) {
        console.log(error);
      }
    }
  };
  return (
    <CajaContenido>
      {/* <BotonQuery paramsSearch={paramsSearch} /> */}

      {!datosEncontrado && (
        <>
          <CajaOpciones>
            <OpcionUnica
              titulo="Seleccione rango de fecha"
              name={"fecha"}
              arrayOpciones={rangoFecha}
              handleOpciones={(e) => handleInput(e)}
            />
          </CajaOpciones>
          <TituloMenor>Busqueda de tus solicitudes:</TituloMenor>
          <WrapDesplegables>
            <Formulario action="" onSubmit={(e) => traerSolicitudes(e)}>
              <CajitaDetalle>
                <TituloDetalle className="oneLine">Tipo</TituloDetalle>
                <MenuDesplesgableSimple
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  value={paramsSearch.tipoSolicitud}
                  autoComplete="off"
                  name="tipoSolicitud"
                  onChange={(e) => {
                    handleDetalles(e);
                  }}
                >
                  <Opciones
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    disabled
                    value={""}
                  >
                    Seleccione tipo
                  </Opciones>
                  <Opciones
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    value={0}
                  >
                    Entrega
                  </Opciones>
                  <Opciones
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    value={1}
                  >
                    Traslado
                  </Opciones>
                  <Opciones
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    value={2}
                  >
                    Retiro obra
                  </Opciones>
                  <Opciones
                    className={Theme.config.modoClear ? "clearModern" : ""}
                    value={3}
                  >
                    Retiro Proveedor
                  </Opciones>
                </MenuDesplesgableSimple>
              </CajitaDetalle>

              <CajitaDetalle>
                <TituloDetalle className="oneLine">Palabra clave</TituloDetalle>
                <InputSimple
                  className={Theme.config.modoClear ? "clearModern" : ""}
                  value={paramsSearch.palabraClave}
                  placeholder="Palabra clave"
                  name="palabraClave"
                  autoComplete="off"
                  onChange={(e) => handleDetalles(e)}
                />
              </CajitaDetalle>

              <BtnSimple type="submit" onClick={(e) => traerSolicitudes(e)}>
                Buscar
              </BtnSimple>
            </Formulario>
          </WrapDesplegables>
        </>
      )}
      {datosEncontrado && (
        <CajaTabla>
          <BtnSimple onClick={(e) => regresar()} className="noMargin">
            <Icono icon={faArrowLeft} />
            Regresar
          </BtnSimple>
          <Tabla>
            <thead>
              <Filas className="cabeza">
                <CeldaHead>N°</CeldaHead>
                <CeldaHead>Numero*</CeldaHead>
                <CeldaHead>Socio de negocio</CeldaHead>
                <CeldaHead>Punto Partida</CeldaHead>
                <CeldaHead>Destino</CeldaHead>
                <CeldaHead>Fecha</CeldaHead>
                <CeldaHead>Detalles</CeldaHead>
              </Filas>
            </thead>
            <tbody>
              {listaSolicitudesDB.map((req, index) => {
                return (
                  <Filas
                    key={index}
                    className={`
                  body
                  ${index % 2 ? "inpar" : "par"}
                  `}
                  >
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {index + 1}
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      <Enlaces
                        to={`/transportes/maestros/solicitudes/${encodeURIComponent(req.numeroDoc)}`}
                        target="_blank"
                      >
                        {req.numeroDoc}
                      </Enlaces>
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {req.datosReq.socioNegocio}
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {req.datosFlete.puntoPartidaSeleccionado.nombre}
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {
                        req.datosFlete.provinciaSeleccionada
                          .municipioSeleccionado.label
                      }
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {req.fechaReqCorta}
                    </CeldasBody>
                    <CeldasBody className={index % 2 ? "inpar" : "par"}>
                      {req.datosReq.detalles}
                    </CeldasBody>
                  </Filas>
                );
              })}
            </tbody>
          </Tabla>
        </CajaTabla>
      )}

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </CajaContenido>
  );
}

const CajaContenido = styled.div`
  width: 100%;

  padding: 10px;
  /* border-radius: 0 0 10px 10px; */
`;
const CajaOpciones = styled.div`
  margin-bottom: 10px;
  padding: 15px;
`;
const TituloMenor = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  color: white;
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-decoration: underline;
`;

const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
`;

const InputSimple = styled(InputSimpleEditable)`
  &.px35 {
    width: 100%;
    height: 35px;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  &.noMargin {
    margin: 0;
    margin-bottom: 4px;
  }
`;

const CajaTabla = styled.div`
  overflow-x: scroll;
  width: 100%;
  height: 100%;
  padding: 5px 20px;
  border: 1px solid white;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    height: 7px;
    width: 7px;
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
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const Icono = styled(FontAwesomeIcon)``;

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

const CajitaDetalle = styled.div`
  display: flex;
  border-bottom: 1px solid ${Tema.secondary.azulOpaco};
  display: flex;
  justify-content: space-between;
  color: ${Tema.neutral.blancoHueso};
  color: white;
  &.detalles {
    flex-direction: column;
    gap: 5px;
  }

  width: 300px;
  /* border: 1px solid red; */
  &.parentesco {
    /* width: ; */
  }
`;
const WrapDesplegables = styled.div`
  display: flex;
  gap: 15px;
`;
const MenuDesplesgableSimple = styled(MenuDesplegable)`
  /* min-width: 200px; */
`;
