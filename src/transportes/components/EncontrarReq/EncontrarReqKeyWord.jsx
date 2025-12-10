import React, { useEffect, useState } from "react";
import styled from "styled-components";

import { InputSimpleEditable } from "../../../components/InputGeneral";
import { BtnGeneralButton } from "../../../components/BtnGeneralButton";
import { fetchEncontrarReq } from "../../../libs/useDocByCondition";
import { useAuth } from "../../../context/AuthContext";
import { Alerta } from "../../../components/Alerta";
import { NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { OpcionUnica } from "../../../components/OpcionUnica";
import { ClearTheme, Tema, Theme } from "../../../config/theme";

export default function EncontrarReqKeyWord({ arrayOpciones }) {
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
      nombre: "Ult. 3 dias",
      qtyDias: 3,
      select: true,
    },
    {
      nombre: "Ult. 7 dias",
      qtyDias: 7,
      select: false,
    },
    {
      nombre: "Ult. 14 dias",
      qtyDias: 14,
      select: false,
    },
  ]);

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

  // ****************** CODIGO ENCONTRAR POR PALABRA CLAVE ******************
  const [valueKeyWord, setValueKeyWor] = useState("");
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
    if (name == "keyWord") {
      setValueKeyWor(value);
    }
  };

  // ****************** LLAMADA A LA BASE DE DATOS ******************
  const [listaSolicitudesDB, setListaSolicitudesDB] = useState([]);
  const [datosEncontrado, setDatosEncontrados] = useState(false);
  const traerSolicitudesPorKeyWord = async (e) => {
    e.preventDefault();
    if (valueKeyWord == "") {
      // Si el usuario no coloca palabra clave, entonces que no se realice la consulta
      setMensajeAlerta("Colocar al menos una palabra clave.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    // console.log()
    const palabrasParsed = valueKeyWord.split(" ");
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
        console.log(arrayOpciones[0].select);
        const datos = await fetchEncontrarReq(
          "keyWord",
          "transferRequest",
          fechaInicial,
          fechaFinal,
          palabrasMinus
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
    <>
      <CajaContenido>
        <CajaOpciones>
          <OpcionUnica
            titulo="Seleccione rango de fecha"
            name={"fecha"}
            arrayOpciones={rangoFecha}
            handleOpciones={(e) => handleInput(e)}
          />
        </CajaOpciones>
        <TituloMenor>Busqueda por palabras clave (keyword)</TituloMenor>
        {datosEncontrado == false && (
          <ContenedorInput>
            <Subtitulo>
              Escriba palabras clave que se encuentren en uno de los campos
              principales, ejemplo; socio de negocio, destino, detalles, N°
              proyectos, numero de factura/orden de ventas etc, puede escribir
              una sola palabra o hacer combinaciones separando las palabras por
              espacios.
            </Subtitulo>
            <Formulario
              action=""
              onSubmit={(e) => traerSolicitudesPorKeyWord(e)}
            >
              <InputSimple
                value={valueKeyWord}
                className={Theme.config.modoClear ? "clearModern" : ""}
                name="keyWord"
                autoComplete="off"
                onChange={(e) => handleInput(e)}
              />
              <BtnSimple
                type="submit"
                onClick={(e) => traerSolicitudesPorKeyWord(e)}
              >
                Buscar
              </BtnSimple>
            </Formulario>
          </ContenedorInput>
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
                      <CeldasBody>
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
                          req.datosFlete?.provinciaSeleccionada
                            ?.municipioSeleccionado?.label
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
      </CajaContenido>

      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
    </>
  );
}
const CajaContenido = styled.div`
  width: 100%;

  padding: 10px;
`;
const CajaOpciones = styled.div`
  margin-bottom: 10px;
  padding: 15px;
`;
const TituloMenor = styled.h2`
  color: ${Tema.neutral.blancoHueso};
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
  margin-bottom: 15px;
  text-decoration: underline;
`;
const ContenedorInput = styled.div`
  width: 90%;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: auto;
`;
const Formulario = styled.form`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 90%;
`;
const Subtitulo = styled.h3`
  color: ${Tema.secondary.azulOpaco};
  font-weight: 400;
  color: white;
  font-size: 1rem;
  margin: auto;
  margin-bottom: 5px;
`;
const InputSimple = styled(InputSimpleEditable)`
  width: 100%;
  height: 35px;
`;
const BtnSimple = styled(BtnGeneralButton)`
  &.noMargin {
    margin: 0;
    margin-bottom: 4px;
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
