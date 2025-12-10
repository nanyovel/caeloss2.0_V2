import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CSSLoader } from "../../components/CSSLoader";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import {
  calcDiasRestante,
  colorDaysRemaining,
  fechaConfirmada,
  funcionDiasRestantes,
} from "../components/libs.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { BotonQuery } from "../../components/BotonQuery.jsx";

export const TablaListaTodosLosFurgones = ({
  //
  dbGlobalFurgones,
}) => {
  // // ******************** RECURSOS GENERALES ******************** //
  const userAuth = useAuth().usuario;
  const [usuario, setUsuario] = useState(userAuth);
  const [isLoading, setIsLoading] = useState(false);
  // const [habilitar,setHabilitar]=useState({
  const habilitar = {
    search: true,
    status: true,
    destino: true,
  };

  // // ************************* CONSOLIDACION ************************* //
  const [initialValueArrayFurgones, setInitialValueArrayFurgones] = useState(
    []
  );
  const [arrayFurgones, setArrayFurgones] = useState([]);
  const [listDestinos, setListDestinos] = useState([]);

  useEffect(() => {
    // Ordenar por dias restantes
    const furgonesAux = dbGlobalFurgones.map((furgon, index) => {
      return {
        ...furgon,
        valoresAux: {
          diasRestantes: calcDiasRestante(
            furgon.fechas.llegada02AlPais.fecha,
            furgon?.datosBL.diasLibres
          ),
        },
      };
    });
    const sortFurgones = furgonesAux.sort((a, b) => {
      return a.valoresAux.diasRestantes - b.valoresAux.diasRestantes;
    });
    setInitialValueArrayFurgones(sortFurgones);
    setArrayFurgones(sortFurgones);

    // Obtener listado de destinos para crear el menu desplegable
    let destinos = new Set();
    if (dbGlobalFurgones.length > 0) {
      dbGlobalFurgones.forEach((furgon) => {
        if (destinos.has(furgon.destino) == false) {
          destinos.add(furgon.destino);
        }
      });
    }

    setListDestinos(Array.from(destinos));
  }, [dbGlobalFurgones]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");
  const [statusDocInput, setStatusDocInput] = useState("");
  const [destinoDocInput, setDestinoDocInput] = useState("");

  const handleSearch = (e) => {
    let shadowArray = arrayFurgones;
    let entradaMaster = e.target.value.toLowerCase();
    let entradaSlave1 = "";
    let entradaSlave2 = "";

    if (e.target.name == "inputBuscar") {
      setBuscarDocInput(entradaMaster);
      entradaSlave1 = statusDocInput.toLowerCase();
      entradaSlave2 = destinoDocInput.toLowerCase();
    } else if (e.target.name == "cicloVida") {
      setStatusDocInput(entradaMaster);
      entradaSlave1 = buscarDocInput.toLowerCase();
      entradaSlave2 = destinoDocInput.toLowerCase();
    } else if (e.target.name == "destino") {
      setDestinoDocInput(entradaMaster);
      entradaSlave1 = buscarDocInput.toLowerCase();
      entradaSlave2 = statusDocInput.toLowerCase();
    }

    if (e.target.name == "inputBuscar") {
      // 1er filtrado - Search siendo  Master
      shadowArray = initialValueArrayFurgones.filter((furgon) => {
        if (
          furgon.numeroDoc.toLowerCase().includes(entradaMaster) ||
          furgon.datosBL.proveedor.toLowerCase().includes(entradaMaster) ||
          furgon.datosBL.numeroBL.toLowerCase().includes(entradaMaster) ||
          furgon.datosBL.puerto.toLowerCase().includes(entradaMaster) ||
          furgon.datosBL.naviera.toLowerCase().includes(entradaMaster) ||
          furgon.datosBL.proveedor.toLowerCase().includes(entradaMaster)
        ) {
          return furgon;
        }
      });

      // 2do filtrado - Status siendo Slave1
      if (statusDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (furgon.status == entradaSlave1) {
            return furgon;
          }
        });
      }

      // 3er filtrado - Destinos siendo Slave2
      if (destinoDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (furgon.destino.toLowerCase() == entradaSlave2) {
            return furgon;
          }
        });
      }
    } else if (e.target.name == "cicloVida") {
      // 1er filtrado - Status siendo Master
      if (entradaMaster != "") {
        shadowArray = initialValueArrayFurgones.filter((furgon) => {
          if (furgon.status == entradaMaster) {
            return furgon;
          }
        });
      } else if (entradaMaster == "") {
        shadowArray = initialValueArrayFurgones;
      }

      // 2do filtrado - Search siendo Slave1
      if (buscarDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (
            furgon.numeroDoc.toLowerCase().includes(entradaSlave1) ||
            furgon.datosBL.proveedor.toLowerCase().includes(entradaSlave1) ||
            furgon.bl.toLowerCase().includes(entradaSlave1) ||
            furgon.puerto.toLowerCase().includes(entradaSlave1) ||
            furgon.naviera.toLowerCase().includes(entradaSlave1) ||
            furgon.datosBL.proveedor.toLowerCase().includes(entradaSlave1)
          ) {
            return furgon;
          }
        });
      }

      // 3er filtrado - Destinos siendo Slave2
      if (destinoDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (furgon.destino.toLowerCase() == entradaSlave2) {
            return furgon;
          }
        });
      }
    } else if (e.target.name == "destino") {
      // 1er filtrado - Destinos siendo Master
      if (entradaMaster != "") {
        shadowArray = initialValueArrayFurgones.filter((furgon) => {
          if (furgon.destino.toLowerCase() == entradaMaster) {
            return furgon;
          }
        });
      } else if (entradaMaster == "") {
        shadowArray = initialValueArrayFurgones;
      }

      // 2do filtrado - Search siendo Slave1
      if (buscarDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (
            furgon.numeroDoc.toLowerCase().includes(entradaSlave1) ||
            furgon.datosBL.proveedor.toLowerCase().includes(entradaSlave1) ||
            furgon.bl.toLowerCase().includes(entradaSlave1) ||
            furgon.puerto.toLowerCase().includes(entradaSlave1) ||
            furgon.naviera.toLowerCase().includes(entradaSlave1) ||
            furgon.datosBL.proveedor.toLowerCase().includes(entradaSlave1)
          ) {
            return furgon;
          }
        });
      }

      // 2do filtrado - Status siendo Slave2
      if (statusDocInput != "") {
        shadowArray = shadowArray.filter((furgon) => {
          if (furgon.status == entradaSlave2) {
            return furgon;
          }
        });
      }
    }

    setArrayFurgones(shadowArray);

    if (entradaMaster == "" && entradaSlave1 == "" && entradaSlave2 == "") {
      setArrayFurgones(initialValueArrayFurgones);
    }
  };

  return (
    <>
      <BotonQuery dbGlobalFurgones={dbGlobalFurgones} />
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Contenedores en proceso de importacion
          </TituloEncabezadoTabla>
        </EncabezadoTabla>
        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          buscarDocInput={buscarDocInput}
          statusDocInput={statusDocInput}
          destinoDocInput={destinoDocInput}
          listDestinos={listDestinos}
          tipo={"contenedores"}
        />
      </CabeceraListaAll>
      <CajaTabla>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Numero*</CeldaHead>
              <CeldaHead title="Tamaño">T</CeldaHead>
              <CeldaHead>Proveedor</CeldaHead>
              <CeldaHead>Status</CeldaHead>
              <CeldaHead>BL*</CeldaHead>
              <CeldaHead>Naviera</CeldaHead>
              <CeldaHead>Puerto</CeldaHead>
              <CeldaHead title="Dias Libres">DL</CeldaHead>
              <CeldaHead title="Dias Restantes">DR</CeldaHead>
              <CeldaHead title="Fecha en que los materiales estaran disponible en SAP">
                En SAP
              </CeldaHead>
              <CeldaHead>Destino</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {arrayFurgones.map((furgon, index) => {
              return (
                <Filas
                  key={index}
                  className={`body 
                    ${index % 2 ? "impar" : ""}
                      `}
                >
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      to={`/importaciones/maestros/contenedores/${encodeURIComponent(furgon.numeroDoc)}`}
                      target="_blank"
                    >
                      {furgon.numeroDoc}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody>{furgon.tamannio}</CeldasBody>

                  <CeldasBody
                    title={furgon.datosBL.proveedor}
                    className="proveedor"
                  >
                    {furgon.datosBL.proveedor}
                  </CeldasBody>
                  <CeldasBody className="status">
                    {furgon.status == 1
                      ? "Transito Maritimo"
                      : furgon.status == 2
                        ? "En puerto"
                        : furgon.status == 3
                          ? "Recep. almacen"
                          : furgon.status == 4
                            ? "Dpto Import"
                            : furgon.status == 5
                              ? "Listo en SAP✅"
                              : ""}
                  </CeldasBody>

                  <CeldasBody>
                    <Enlaces
                      to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                      target="_blank"
                    >
                      {furgon.datosBL.numeroBL}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody
                    className="naviera"
                    title={furgon.datosBL.naviera}
                  >
                    {furgon.datosBL.naviera}
                  </CeldasBody>
                  <CeldasBody className="puerto" title={furgon.datosBL.puerto}>
                    {furgon.datosBL.puerto}
                  </CeldasBody>

                  <CeldasBody>{furgon.datosBL.diasLibres}</CeldasBody>
                  <CeldasBody>
                    {furgon.valoresAux.diasRestantes}

                    {colorDaysRemaining(furgon.valoresAux.diasRestantes)}
                  </CeldasBody>
                  <CeldasBody
                    title={
                      furgon?.llegadaSapDetalles?.fechaConfirmada
                        ? "Fecha confirmada"
                        : "Fecha estimada"
                    }
                  >
                    {furgon.fechas.llegada05Concluido.fecha.slice(0, 10)}
                    {fechaConfirmada(
                      furgon?.fechas.llegada05Concluido?.confirmada
                    )}
                  </CeldasBody>
                  <CeldasBody>{furgon.destino}</CeldasBody>
                </Filas>
              );
            })}
          </tbody>
        </Tabla>
      </CajaTabla>

      {isLoading ? (
        <CajaLoader>
          <CSSLoader />
        </CajaLoader>
      ) : (
        ""
      )}
    </>
  );
};

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
`;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CajaTabla = styled(CajaTablaGroup)`
  padding: 0 10px;
  overflow-x: scroll;
  /* border: 1px solid red; */
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
`;

const Tabla = styled(TablaGroup)`
  font-family: Arial, Helvetica, sans-serif;
  border-collapse: collapse;
  width: 95%;
  margin: auto;
  margin-bottom: 25px;
  @media screen and (max-width: 650px) {
    margin-bottom: 200px;
  }
  @media screen and (max-width: 380px) {
    /* overflow: scroll; */
    margin-bottom: 130px;
  }
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
    border: 1px solid red;
  }
  &.cabeza {
    background-color: ${Tema.secondary.azulProfundo};
  }

  &:hover {
    /* background-color: ${Tema.secondary.azulProfundo}; */
  }

  &.negativo {
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
  &.descripcion {
    max-width: 30px;
  }
  &.comentarios {
    max-width: 200px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  padding-left: 5px;
  padding-right: 5px;

  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;

  &.descripcion {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 100px;
  }

  &.status {
    white-space: nowrap;
  }
  &.puerto {
    /* width: 150px; */
    max-width: 300px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &.naviera {
    /* width: 150px; */
    max-width: 300px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }
  &.comentarios {
    max-width: 200px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
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
  padding-left: 10px;
  &.subTitulo {
    color: ${ClearTheme.complementary.warning};
    font-size: 1rem;
    @media screen and (max-width: 460px) {
      font-size: 13px;
    }
  }
  @media screen and (max-width: 590px) {
    font-size: 16px;
  }
  @media screen and (max-width: 400px) {
    font-size: 14px;
  }
`;
