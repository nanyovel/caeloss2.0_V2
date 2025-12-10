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
import { BtnGeneralButton } from "../../components/BtnGeneralButton.jsx";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition.js";
import { BotonQuery } from "../../components/BotonQuery.jsx";

export const TablaListaTodosLosBLs = ({ dbGlobalBL, setDBGlobalBL }) => {
  // // ******************** RECURSOS GENERALES ******************** //

  // const [habilitar,setHabilitar]=useState({
  const habilitar = {
    search: true,
  };

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (dbGlobalBL.length > 0) {
      setIsLoading(false);
    }
    if (dbGlobalBL.length == 0) {
      setIsLoading(true);
    }
  }, [dbGlobalBL]);

  //********************* CARGAR EL ESTADO GLOBAL (BILL OF LADING ABIERTOS)************************** */
  useEffect(() => {
    const traerData = async () => {
      const listaDocs = await fetchDocsByConditionGetDocs(
        "billOfLading2",
        setDBGlobalBL,
        "estadoDoc",
        "==",
        0
      );
    };
    // Esto para que la llamada a la base de datos se realice una sola vez
    if (dbGlobalBL.length == 0) {
      console.log("✅✅✅✅");
      traerData();
    }
  }, []);

  // // ************************* CONSOLIDACION ************************* //

  const [listaBLs, setListaBLs] = useState([]);
  const [initialValueBLs, setInitialValueBLs] = useState([]);

  useEffect(() => {
    //Agregar propiedad de dias restantes
    const blParsed = dbGlobalBL.map((bill) => {
      const diasRestantes = calcDiasRestante(
        bill.llegada02AlPais.fecha,
        bill.diasLibres
      );
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
  }, [dbGlobalBL]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //

  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entrada = e.target.value;
    setBuscarDocInput(entrada);
    const textoMin = entrada.toLowerCase();

    setListaBLs(
      initialValueBLs.filter((bl) => {
        if (
          bl.numeroDoc.toLowerCase().includes(textoMin) ||
          bl.proveedor.toLowerCase().includes(textoMin) ||
          bl.naviera.toLowerCase().includes(textoMin) ||
          bl.puerto.toLowerCase().includes(textoMin)
        ) {
          return bl;
        }
      })
    );

    if (e.target.value == "") {
      setListaBLs(initialValueBLs);
    }
  };
  return (
    <>
      <BotonQuery listaBLs={listaBLs} />
      {/* <BtnSimple onClick={() => actualizarBL()}>Actualizar BL</BtnSimple> */}
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de todos los Bill of Lading activos, ordenados por dias
            restantes (DR).
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          buscarDocInput={buscarDocInput}
        />
      </CabeceraListaAll>
      <CajaTablaGroup>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Numero*</CeldaHead>
              <CeldaHead>Proveedor</CeldaHead>
              <CeldaHead>Naviera</CeldaHead>
              <CeldaHead>Puerto</CeldaHead>
              <CeldaHead title="Dias Libres">DL</CeldaHead>
              <CeldaHead title="Dias Restantes">DR</CeldaHead>
              <CeldaHead>Llegada al pais</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {listaBLs.map((bl, index) => {
              return (
                <Filas
                  key={index}
                  className={`body ${index % 2 ? "impar" : ""}`}
                >
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody data-id={index}>
                    <Enlaces
                      to={`/importaciones/maestros/billoflading/${encodeURIComponent(
                        bl.numeroDoc
                      )}`}
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
                    {bl.tipo !== 1 && (
                      <>
                        {bl.diasRestantes}

                        {colorDaysRemaining(bl.diasRestantes)}
                      </>
                    )}
                  </CeldasBody>

                  {/* <CeldasBody>{bl.llegadaAlPais.slice(0, 10)}</CeldasBody> */}

                  <CeldasBody
                    title={
                      bl.llegada02AlPais?.fecha?.slice(0, 10) +
                      " " +
                      fechaConfirmada(bl.llegada02AlPais?.confirmada, true)
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
      </CajaTablaGroup>
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
const BtnSimple = styled(BtnGeneralButton)``;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const CabeceraListaAll = styled.div`
  width: 100%;
  background-color: ${ClearTheme.primary.azulBrillante};
  color: black;
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

const CajaTabla = styled(CajaTablaGroup)`
  overflow-x: scroll;
  padding: 0 10px;
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
  &.negativo {
    color: ${Tema.complementary.danger};
  }
`;

const CeldaHead = styled(CeldaHeadGroup)`
  padding: 3px 8px;
  text-align: center;
  font-size: 0.9rem;
  border: 1px solid black;
  &.qty {
    width: 300px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  font-size: 0.9rem;
  height: 25px;
  border: 1px solid black;
  &.numeroBL {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;
  &.proveedor {
    text-align: start;
    padding-left: 5px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 200px;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
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
