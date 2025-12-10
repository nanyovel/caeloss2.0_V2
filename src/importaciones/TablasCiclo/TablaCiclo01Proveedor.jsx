import { useEffect, useState } from "react";
import styled from "styled-components";
import { NavLink } from "react-router-dom";
import { CSSLoader } from "../../components/CSSLoader";
import { ControlesTablasMain } from "../components/ControlesTablasMain";
import { fetchDocsByConditionGetDocs } from "../../libs/useDocByCondition.js";
import { ClearTheme, Tema } from "../../config/theme.jsx";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla.jsx";
import ModalInfo from "../../components/Avisos/ModalInfo.jsx";
import ImgInfo from "../../../public/img/informacion.png";

export const TablaCiclo01Proveedor = ({
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
}) => {
  //********************* CARGAR EL ESTADO GLOBAL (ORDENES ABIERTAS)************************** */
  useEffect(() => {
    const traerData = async () => {
      const listaDocs = await fetchDocsByConditionGetDocs(
        "ordenesCompra2",
        setDBGlobalOrdenes,
        "estadoDoc",
        "==",
        0
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
    opcionesUnicas: true,
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

  // // ******************** CONSOLIDACION ******************** //

  const [initialValueMatOC, setInitialValueMatOC] = useState([]);
  const [matOC, setMatOC] = useState([]);

  const [listaOrdenes, setListaOrdenes] = useState([]);
  const [initialValueOrden, setInitialValueOrden] = useState([]);

  useEffect(() => {
    // Obtener materiales de ordenes de compra

    // Calcular y filtrar estado de orden, abiertas o cerradas

    setInitialValueOrden(dbGlobalOrdenes);
    setListaOrdenes(dbGlobalOrdenes);

    const materialesOrdenes = dbGlobalOrdenes.flatMap((orden) =>
      orden.materiales.map((material) => ({
        ...material,
        proveedor: orden.proveedor,
        ordenCompra: orden.numeroDoc,
      }))
    );
    setInitialValueMatOC(materialesOrdenes);
    setMatOC(materialesOrdenes);
  }, [dbGlobalOrdenes]);

  // // ******************** MANEJANDO EL INPUT SEARCH ******************** //
  const [buscarDocInput, setBuscarDocInput] = useState("");

  const handleSearch = (e) => {
    let entradaMaster = e.target.value.toLowerCase();
    setBuscarDocInput(entradaMaster);

    if (arrayOpciones[1].select == true) {
      if (e.target.name == "inputBuscar") {
        setMatOC(
          initialValueMatOC.filter((item) => {
            if (
              item.codigo.toLowerCase().includes(entradaMaster) ||
              item.descripcion.toLowerCase().includes(entradaMaster) ||
              item.qtyPendiente.toString().includes(entradaMaster) ||
              item.proveedor.toLowerCase().includes(entradaMaster) ||
              item.ordenCompra.toLowerCase().includes(entradaMaster) ||
              item.comentarios.toLowerCase().includes(entradaMaster)
            ) {
              return item;
            }
          })
        );
      }
    } else if (arrayOpciones[0].select == true) {
      if (e.target.name == "inputBuscar") {
        setListaOrdenes(
          initialValueOrden.filter((orden) => {
            if (
              orden.numeroDoc.toLowerCase().includes(entradaMaster) ||
              orden.proveedor.toLowerCase().includes(entradaMaster) ||
              orden.comentarios.toLowerCase().includes(entradaMaster)
            ) {
              return orden;
            }
          })
        );
      }
    }

    if (e.target.value == "" && buscarDocInput == "") {
      setMatOC(initialValueMatOC);
      setListaOrdenes(initialValueOrden);
    }
  };

  const [arrayOpciones, setArrayOpciones] = useState([
    {
      nombre: window.innerWidth > 300 ? "Ordenes de compra" : "O/C",
      opcion: 0,
      select: true,
    },
    {
      nombre: "Articulos",
      opcion: 1,
      select: false,
    },
  ]);

  const handleOpciones = (e) => {
    setBuscarDocInput("");
    let index = Number(e.target.dataset.id);

    setArrayOpciones((prevOpciones) =>
      prevOpciones.map((opcion, i) => ({
        ...opcion,
        select: i === index,
      }))
    );
  };
  const [hasAviso, setHasAviso] = useState(false);
  return (
    <>
      <CabeceraListaAll>
        <EncabezadoTabla>
          <TituloEncabezadoTabla>
            Lista de ordenes de compras abiertas.
          </TituloEncabezadoTabla>
          <CajaImgInfo onClick={() => setHasAviso(true)}>
            <ImgIconInfo src={ImgInfo} />
          </CajaImgInfo>
          {hasAviso ? (
            <ModalInfo
              setHasAviso={setHasAviso}
              titulo={"En proveedor"}
              texto={
                "Es la primera etapa del ciclo de vida del proceso de importación e inicia cuando Cielos Acústicos envía la orden de compra y finaliza cuando el proveedor carga los materiales en el contenedor."
              }
            ></ModalInfo>
          ) : null}
        </EncabezadoTabla>

        <ControlesTablasMain
          habilitar={habilitar}
          handleSearch={handleSearch}
          handleOpciones={handleOpciones}
          // arrayOpciones={arrayOpciones}
          buscarDocInput={buscarDocInput}
          tipo={"proveedor"}
        />
      </CabeceraListaAll>

      <>
        {arrayOpciones[1].select == true ? (
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>O/C*</CeldaHeadGroup>
                  <CeldaHeadGroup className="comentarios">
                    Comentarios
                  </CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {matOC.map((item, index) => {
                  return (
                    <FilasGroup
                      key={index}
                      className={`
                        body
                        ${index % 2 ? "impar" : "par"}`}
                    >
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlaces
                          to={`/importaciones/maestros/articulos/${encodeURIComponent(
                            item.codigo
                          )}`}
                          target="_blank"
                        >
                          {item.codigo}
                        </Enlaces>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup
                        title={item.descripcion}
                        className="descripcion"
                      >
                        {item.descripcion}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup
                        title={item.proveedor}
                        className="proveedor"
                      >
                        {item.proveedor}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlaces
                          to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(
                            item.ordenCompra
                          )}`}
                          target="_blank"
                        >
                          {item.ordenCompra}
                        </Enlaces>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{item.comentarios}</CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        ) : arrayOpciones[0].select == true ? (
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Numero*</CeldaHeadGroup>
                  <CeldaHeadGroup>Proveedor</CeldaHeadGroup>
                  <CeldaHeadGroup>Comentarios</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {listaOrdenes?.map((orden, index) => {
                  return (
                    <FilasGroup
                      key={index}
                      className={`body
                      ${index % 2 ? "impar" : "par"}
                      `}
                    >
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlaces
                          to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(
                            orden.numeroDoc
                          )}`}
                          target="_blank"
                        >
                          {orden.numeroDoc}
                        </Enlaces>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup className="proveedor">
                        {orden.proveedor}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{orden.comentarios}</CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        ) : null}
      </>
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
  margin-top: 10px;
`;

const CajaLoader = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
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
const CajaImgInfo = styled.div`
  position: absolute;
  right: 0;
  top: -20px;
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
