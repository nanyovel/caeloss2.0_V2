import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CSSLoader } from "../../components/CSSLoader";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import {
  fetchDocsByConditionGetDocs,
  useDocByCondition,
} from "../../libs/useDocByCondition.js";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import ModalGeneral from "../../components/ModalGeneral.jsx";
import { qtyDisponiblePartida } from "../libs/qtyDisponiblePartidaOrden.js";

export const TablaListaTodasLasOC = ({
  dbGlobalOrdenes,
  setDBGlobalOrdenes,
}) => {
  //********************* CARGAR EL ESTADO GLOBAL (ORDENES ABIERTAS)************************** */
  useEffect(() => {
    const traerData = async () => {
      const listaDocs = await fetchDocsByConditionGetDocs(
        "ordenesCompra2",
        setDBGlobalOrdenes,
        "estadoDoc",
        "<",
        2
      );
    };
    // Esto para que la llamada a la base de datos se realice una sola vez
    if (dbGlobalOrdenes.length == 0) {
      console.log("✅✅✅✅");
      traerData();
    }
  }, []);

  // // ******************** RECURSOS GENERALES ******************** //
  // const [habilitar,setHabilitar]=useState({
  const habilitar = {
    search: true,
    // status:true,
    // destino:true
  };

  // // ************************** CODIGO LOADING ************************** //
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    if (dbGlobalOrdenes.length > 0) {
      setIsLoading(false);
    }
    if (dbGlobalOrdenes.length == 0) {
      setIsLoading(true);
    }
  }, [dbGlobalOrdenes]);

  const [initialValueOrden, setInitialValueOrden] = useState([]);
  // // ************************* CONSOLIDACION ************************* //

  const [listaOrdenes, setListaOrdenes] = useState([]);
  useEffect(() => {
    const ordenesSort = dbGlobalOrdenes.sort(
      (x, y) => x.numeroDoc - y.numeroDoc
    );

    setInitialValueOrden(ordenesSort);
    setListaOrdenes(ordenesSort);
  }, [dbGlobalOrdenes]);

  // ******************** MANEJANDO EL INPUT SEARCH ******************** //

  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entrada = e.target.value;
    setBuscarDocInput(entrada);
    const textoMin = entrada.toLowerCase();

    setListaOrdenes(
      initialValueOrden.filter((orden) => {
        if (
          orden.numeroDoc.toLowerCase().includes(textoMin) ||
          orden.proveedor.toLowerCase().includes(textoMin) ||
          orden.comentarios.toLowerCase().includes(textoMin)
        ) {
          return orden;
        }
      })
    );

    if (e.target.value == "") {
      setListaOrdenes(initialValueOrden);
    }
  };

  // *************** PROYECCIONES ***************
  const [modalProyecciones, setModalProyecciones] = useState(false);
  const [ordenSelect, setOrdenSelect] = useState({});
  const mostrarProyecciones = (orden) => {
    setModalProyecciones(true);
    setOrdenSelect(orden);
  };

  return (
    <>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de todas las ordenes de compras abiertas.
          </TituloEncabezadoTabla>
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          buscarDocInput={buscarDocInput}
        />
      </CabeceraListaAll>
      <CajaTabla>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Numero*</CeldaHead>
              <CeldaHead>Proveedor</CeldaHead>
              <CeldaHead>Status</CeldaHead>
              <CeldaHead>Creacion</CeldaHead>
              <CeldaHead>Proyecciones</CeldaHead>
              <CeldaHead>Comentarios</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {listaOrdenes?.map((orden, index) => {
              return (
                <Filas
                  key={index}
                  className={`body ${index % 2 ? "impar" : "par"}`}
                >
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(orden.numeroDoc)}`}
                      target="_blank"
                    >
                      {orden.numeroDoc}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody className="proveedor">
                    {orden.proveedor}
                  </CeldasBody>
                  <CeldasBody className="proveedor">
                    {orden.estadoDoc == 0 ? "Abierta" : "Proceso"}
                  </CeldasBody>
                  <CeldasBody className="proveedor">
                    {orden.createdAt.slice(0, 10)}
                  </CeldasBody>
                  <CeldasBody className="">
                    <ParrafoAction onClick={() => mostrarProyecciones(orden)}>
                      👁️
                    </ParrafoAction>
                  </CeldasBody>

                  <CeldasBody>{orden.comentarios}</CeldasBody>
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
      {modalProyecciones && (
        <ModalGeneral
          titulo={
            "Proyecciones de llegada a puerto orden N°: " +
            ordenSelect.numeroDoc
          }
          setHasModal={setModalProyecciones}
        >
          <CajaProyecciones>
            <CajaTablaGroup>
              <TablaGroup>
                <thead>
                  <FilasGroup className="cabeza">
                    <CeldaHeadGroup>N°</CeldaHeadGroup>
                    <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                    <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                    <CeldaHeadGroup>Qty</CeldaHeadGroup>
                    {ordenSelect.partidas?.map((partidas, index) => {
                      return (
                        <CeldaHeadGroup key={index}>
                          {partidas.fechaProyectada.slice(0, 10)}
                        </CeldaHeadGroup>
                      );
                    })}
                    <CeldaHeadGroup>Restante</CeldaHeadGroup>
                  </FilasGroup>
                </thead>
                <tbody>
                  {true &&
                    ordenSelect.materiales.map((item, index) => {
                      return (
                        <FilasGroup key={index} className={"body"}>
                          <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                          <CeldasBodyGroup>
                            <Enlaces
                              to={`/importaciones/maestros/articulos/${encodeURIComponent(item.codigo)}`}
                              target="_blank"
                            >
                              {item.codigo}
                            </Enlaces>
                          </CeldasBodyGroup>
                          <CeldasBodyGroup className="startText">
                            {item.descripcion}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>{item.qty}</CeldasBodyGroup>

                          {ordenSelect?.partidas
                            ?.flatMap((partida, index) => {
                              return partida.materiales;
                            })
                            .filter((produc, index) => {
                              if (produc.codigo == item.codigo) {
                                return item;
                              }
                            })
                            .map((item, index) => {
                              return (
                                <CeldasBodyGroup key={index + "a"}>
                                  {item.qty}
                                </CeldasBodyGroup>
                              );
                            })}
                          <CeldasBodyGroup>
                            {qtyDisponiblePartida(item.codigo, ordenSelect)}
                          </CeldasBodyGroup>
                        </FilasGroup>
                      );
                    })}
                </tbody>
              </TablaGroup>
            </CajaTablaGroup>
          </CajaProyecciones>
        </ModalGeneral>
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
`;
const CeldasBody = styled(CeldasBodyGroup)`
  font-size: 0.9rem;
  border: 1px solid black;
  height: 25px;
  &.clicKeable {
    cursor: pointer;
    &:hover {
      text-decoration: underline;
    }
  }

  text-align: center;

  &.proveedor {
    text-align: start;
    padding-left: 5px;
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
const CajaProyecciones = styled.div`
  width: 100%;
  min-height: 100px;
`;
