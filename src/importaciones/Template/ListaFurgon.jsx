import { useEffect, useRef, useState } from "react";
import { NavLink, useParams } from "react-router-dom";
import styled from "styled-components";
import { DetalleFurgon } from "../view/DetalleFurgon";
import { calcDiasRestante } from "../components/libs.jsx";
import { Tema } from "../../config/theme.jsx";
import { useDocByCondition } from "../../libs/useDocByCondition.js";
import {
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";

export const ListaFurgon = ({}) => {
  const parametro = useParams();
  const docUser = parametro.id;
  const [furgonesDB, setFurgonesDB] = useState([]);
  const listaDocs = useDocByCondition(
    "furgones",
    setFurgonesDB,
    "numeroDoc",
    "==",
    docUser
  );

  // // ******************** PARSEAR DOC MASTER ******************** //
  const tablaMatRef = useRef(null);
  const [furgonMaster, setFurgonMaster] = useState(null);
  const [refresh, setRefresh] = useState(false);
  const [arrayFurgones, setArrayFurgones] = useState([]);

  useEffect(() => {
    const parsearFurgon = (furgon) => {
      const furgonDB = furgon;
      const diasRestantes = calcDiasRestante(
        furgonDB.fechas.llegada02AlPais.fecha,
        furgonDB?.datosBL.diasLibres
      );
      return {
        ...furgonDB,
        valoresAux: {
          ...(furgonDB.valoresAux || {}),
          diasRestantes: diasRestantes,
        },
      };
    };

    if (furgonesDB.length == 1) {
      setFurgonMaster(parsearFurgon(furgonesDB[0]));
    } else if (furgonesDB.length > 1) {
      setArrayFurgones(furgonesDB.map((furgon) => parsearFurgon(furgon)));
    }
  }, [furgonesDB]);

  const [nClases, setNClases] = useState([]);

  const selecionarFurgon = (e) => {
    let index = Number(e.target.dataset.id);
    let newNClases = [];
    newNClases[index] = "filaSelected";
    setNClases(newNClases);
    setRefresh(!refresh);
    setFurgonMaster(arrayFurgones[index]);
    setTimeout(() => {
      tablaMatRef.current.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  return (
    <>
      <Contenedor>
        {arrayFurgones.length > 1 ? (
          <>
            <EncabezadoTabla>
              <TituloEncabezadoTabla>
                Existen varias importaciones de este contenedor. A continuación,
                una lista de las mismas. Haz click en icono de 👁️ del contenedor
                deseado.
              </TituloEncabezadoTabla>
            </EncabezadoTabla>

            <Tabla>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Contenedor</CeldaHeadGroup>
                  <CeldaHeadGroup>Tamaño</CeldaHeadGroup>
                  <CeldaHeadGroup>BL*</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>Destino</CeldaHeadGroup>
                  <CeldaHeadGroup>Detalles</CeldaHeadGroup>
                  <CeldaHeadGroup>Status</CeldaHeadGroup>
                  <CeldaHeadGroup>LLegada almacen</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {arrayFurgones.length > 0 &&
                  arrayFurgones.map((furgon, index) => {
                    return (
                      <FilasGroup
                        key={index}
                        className={`
                          body
                        ${nClases[index]}
                        ${index % 2 ? "impar" : "par"}
                        `}
                      >
                        <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                        <CeldasBodyGroup>{furgon.numeroDoc}</CeldasBodyGroup>
                        <CeldasBodyGroup>{furgon.tamannio}</CeldasBodyGroup>
                        <CeldasBodyGroup className="clicKeable" data-id={index}>
                          <Enlaces
                            to={`/importaciones/maestros/billoflading/${encodeURIComponent(furgon.datosBL.numeroBL)}`}
                            target="_blank"
                          >
                            {furgon.datosBL.numeroBL}
                          </Enlaces>
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {furgon.datosBL.proveedor}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>{furgon.destino}</CeldasBodyGroup>
                        <CeldasBodyGroup>
                          <IconoREDES
                            data-id={index}
                            onClick={(e) => selecionarFurgon(e)}
                          >
                            👁️
                          </IconoREDES>
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {furgon.status == 1
                            ? "Transito Maritimo"
                            : furgon.status == 2
                              ? "En Almacen"
                              : furgon.status == 3
                                ? "En dpto Importaciones"
                                : furgon.status == 4
                                  ? "Materiales en SAP✅"
                                  : ""}
                        </CeldasBodyGroup>
                        <CeldasBodyGroup>
                          {furgon.fechas.llegada03Almacen.fecha.slice(0, 10)}
                        </CeldasBodyGroup>
                      </FilasGroup>
                    );
                  })}
              </tbody>
            </Tabla>
          </>
        ) : (
          ""
        )}
        {furgonMaster && (
          <DetalleFurgon
            furgonMaster={furgonMaster}
            tablaMatRef={tablaMatRef}
            sliderDow={arrayFurgones.length > 0}
          />
        )}
      </Contenedor>
    </>
  );
};

const Contenedor = styled.div`
  height: 97%;
  padding: 1px;
  margin-bottom: 100px;
`;

const EncabezadoTabla = styled.div`
  margin-top: 20px;
  background-color: ${Tema.secondary.azulProfundo};
  padding-left: 15px;

  display: flex;
  justify-content: start;
  align-items: center;
  /* margin-bottom: 5px; */
  padding-bottom: 10px;
`;
const TituloEncabezadoTabla = styled.h2`
  color: #757575;
  color: ${Tema.complementary.warning};
  font-size: 1.2rem;
  font-weight: normal;
  width: 90%;
`;

const IconoREDES = styled.p`
  cursor: pointer;
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  padding: 5px;
  &:hover {
    text-decoration: underline;
  }
`;
const Tabla = styled(TablaGroup)`
  width: 94%;
  margin: 0;
  padding: 0;
`;
