import { useEffect, useState } from "react";
import styled from "styled-components";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ParrafoAction,
  TablaGroup,
} from "../../../components/JSXElements/GrupoTabla";
import { NavLink } from "react-router-dom";

import { OrdenParsedConDespDB } from "../../libs/OrdenParsedConDespDB";
import { collection, getDocs, limit, query, where } from "firebase/firestore";
import db from "../../../firebase/firebaseConfig";
import { ModalLoading } from "../../../components/ModalLoading";
import ModalGeneral from "../../../components/ModalGeneral";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../../components/JSXElements/GrupoDetalle";
import { ClearTheme } from "../../../config/theme";
import TextoEptyG from "../../../components/TextoEptyG";
import { BotonQuery } from "../../../components/BotonQuery";

export default function ItemsSinEnviar({
  ordenesAbiertas,
  setOrdenesAbiertas,
  materialesOrdenes,

  // Variables globales
  setDBGlobalOrdenes,
  dbGlobalOrdenes,
}) {
  const [isLoading, setIsLoading] = useState(true);
  //********************* CARGAR EL ESTADO GLOBAL (ORDENES ABIERTAS)************************** */
  const fetchDocsByConditionGetDocs = async (
    collectionName,
    setState,
    campo,
    condicion,
    valor
  ) => {
    console.log("DB 😐😐😐😐😐" + collectionName);
    let q = {};

    if (campo) {
      q = query(
        collection(db, collectionName),
        where(campo, condicion, valor)
        // Esto funciona; limit(5)
        // 1-Se debe optimizar esta consulta, que inicialmente traiga una cantidad reducidad de ordenes
        // 2-Si el usuario hace scroll hasta abajo cuando llega al final entonces carga el segundo grupo segun la cantidad establecidad en cada grupo,
        // Ejemplo si la cantidad establecida es 100, cuando el usuario hace scroll hasta el final, cargara el segundo grupo de 100
        // 3-Si el usuario escribe un codigo en el input search entonces se hace otra consulta a la base de datos
        //
        //
      );
    }

    const consultaDB = await getDocs(q);
    const coleccion = consultaDB.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    }));

    // Si tiene useState de react, entonces guardar ahi
    // setState(coleccion);
    if (setState) {
      setState(coleccion);

      return coleccion;
    }
    // Si no tiene useState siginifica que es en una variable de js
    return coleccion;
  };
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
      traerData();
    }
  }, []);

  useEffect(() => {
    if (materialesOrdenes.length > 0) {
      setIsLoading(false);
    }
  }, [materialesOrdenes]);

  useEffect(() => {
    const cargarOrdenes = async () => {
      const listaOrdenesParsed = await Promise.all(
        dbGlobalOrdenes.map(async (orden) => {
          return await OrdenParsedConDespDB(orden);
        })
      );

      setOrdenesAbiertas(listaOrdenesParsed);
    };

    if (dbGlobalOrdenes.length > 0) {
      cargarOrdenes();
    }
  }, [dbGlobalOrdenes]);

  const [itemParsedFinal, setItemParsedFinal] = useState([]);
  useEffect(() => {
    const itemsParsed = materialesOrdenes.map((item) => {
      const pendiente = item.qty - item.valoresAux.cantidadTotalDespachosDB;
      return {
        ...item,
        pendiente: parseFloat(pendiente.toFixed(2)),
      };
    });

    setItemParsedFinal(itemsParsed.filter((item) => item.pendiente > 0));
  }, [materialesOrdenes]);

  // *********** Mostrar proyecciones ***********
  const [modalProyecciones, setModalPoryecciones] = useState(false);
  const [itemSelectProy, setItemSelectProy] = useState({});

  const mostrarProyecciones = (item) => {
    setModalPoryecciones(true);
    const ordenFind = ordenesAbiertas.find(
      (orden) => orden.numeroDoc == item.ordenCompra
    );

    const partidasThisItem =
      ordenFind?.partidas?.filter((part) => {
        const hasItem = part.materiales.find(
          (product) => product.codigo == item.codigo
        );

        if (hasItem) {
          return part;
        }
      }) || [];

    const partidasParsed2 = partidasThisItem.flatMap((part) => {
      return part.materiales.map((mat) => ({
        fechaProgAux: part.fechaProyectada,
        ...mat,
      }));
    });

    console.log(partidasParsed2);
    const soloEsteItem = partidasParsed2.filter(
      (proy) => proy.codigo == item.codigo
    );

    setItemSelectProy({
      ...item,
      partidasAux: soloEsteItem,
    });
  };

  return (
    <>
      <CajaTabla>
        <Tabla>
          <thead>
            <Filas className="cabeza">
              <CeldaHead>N°</CeldaHead>
              <CeldaHead>Codigo*</CeldaHead>
              <CeldaHead>Descripcion</CeldaHead>
              <CeldaHead className="qtyPendiente">Total</CeldaHead>
              <CeldaHead className="qtyPendiente pendiente">Pend.</CeldaHead>
              <CeldaHead className="proyecciones">Proyecciones</CeldaHead>
              <CeldaHead className="proveedor">Proveedor</CeldaHead>
              <CeldaHead>O/C*</CeldaHead>
              <CeldaHead className="comentarios">Comentarios</CeldaHead>
              <CeldaHead className="comentarios">Comentarios Orden</CeldaHead>
            </Filas>
          </thead>
          <tbody>
            {itemParsedFinal.map((item, index) => {
              return (
                <Filas
                  key={index}
                  className={`body
                      ${index % 2 ? "impar" : "par"} `}
                >
                  <CeldasBody>{index + 1}</CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      to={`/importaciones/maestros/articulos/${encodeURIComponent(item.codigo)}`}
                      target="_blank"
                    >
                      {item.codigo}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody title={item.descripcion} className="descripcion">
                    {item.descripcion}
                  </CeldasBody>
                  <CeldasBody>{item.qty}</CeldasBody>
                  <CeldasBody>{item.pendiente}</CeldasBody>
                  <CeldasBody>
                    <ParrafoAction onClick={() => mostrarProyecciones(item)}>
                      👁️
                    </ParrafoAction>
                  </CeldasBody>

                  <CeldasBody title={item.proveedor} className="proveedor">
                    {item.proveedor}
                  </CeldasBody>
                  <CeldasBody>
                    <Enlaces
                      to={`/importaciones/maestros/ordenescompra/${encodeURIComponent(item.ordenCompra)}`}
                      target="_blank"
                    >
                      {item.ordenCompra}
                    </Enlaces>
                  </CeldasBody>
                  <CeldasBody title={item.comentarios}>
                    {item.comentarios}
                  </CeldasBody>
                  <CeldasBody title={item.comentarioOrden}>
                    {item.comentarioOrden}
                  </CeldasBody>
                </Filas>
              );
            })}
          </tbody>
        </Tabla>
      </CajaTabla>
      {isLoading ? <ModalLoading completa={true} /> : ""}
      {modalProyecciones && (
        <ModalGeneral
          titulo={
            "Proyecciones de llegada a puerto del producto: " +
            itemSelectProy.codigo +
            " de la orden de compra " +
            itemSelectProy.ordenCompra
          }
          setHasModal={setModalPoryecciones}
        >
          <CajaProyecciones>
            <CajaDetalles>
              <Detalle1Wrap>
                <Detalle2Titulo>Codigo:</Detalle2Titulo>
                <Detalle3OutPut>{itemSelectProy.codigo}</Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo className="ancho40-60">
                  Descripcion:
                </Detalle2Titulo>
                <Detalle3OutPut
                  className="ancho60-40"
                  title={itemSelectProy.descripcion}
                >
                  {itemSelectProy.descripcion}
                </Detalle3OutPut>
              </Detalle1Wrap>
              <Detalle1Wrap>
                <Detalle2Titulo className="ancho40-60" title="Cantidad total">
                  Qty total:
                </Detalle2Titulo>
                <Detalle3OutPut>{itemSelectProy.qty}</Detalle3OutPut>
              </Detalle1Wrap>
            </CajaDetalles>
            <BotonQuery itemSelectProy={itemSelectProy} />
            <ParrafoProyecciones>
              Cantidades proyectadas a recibir de este producto:
            </ParrafoProyecciones>
            <CajaTablaGroup>
              {itemSelectProy?.partidasAux?.length > 0 ? (
                <TablaGroup>
                  <thead>
                    <FilasGroup className="cabeza">
                      <CeldaHeadGroup>N°</CeldaHeadGroup>
                      <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                      <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                      <CeldaHeadGroup>Fecha</CeldaHeadGroup>
                      <CeldaHeadGroup>Cantidad</CeldaHeadGroup>
                    </FilasGroup>
                  </thead>
                  <tbody>
                    {itemSelectProy.partidasAux.map((proyec, index) => {
                      return (
                        <FilasGroup className="body" key={index}>
                          <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                          <CeldasBodyGroup>{proyec.codigo}</CeldasBodyGroup>
                          <CeldasBodyGroup>
                            {proyec.descripcion}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>
                            {proyec.fechaProgAux.slice(0, 10)}
                          </CeldasBodyGroup>
                          <CeldasBodyGroup>{proyec.qty}</CeldasBodyGroup>
                        </FilasGroup>
                      );
                    })}
                  </tbody>
                </TablaGroup>
              ) : (
                <TextoEptyG texto={"~ Sin proyecciones. ~"} />
              )}
            </CajaTablaGroup>
          </CajaProyecciones>
        </ModalGeneral>
      )}
      {/* <ModalLoading completa={true} /> */}
    </>
  );
}

const CajaTabla = styled(CajaTablaGroup)``;

const Tabla = styled(TablaGroup)`
  @media screen and (max-width: 650px) {
    margin-bottom: 200px;
  }
  @media screen and (max-width: 380px) {
    margin-bottom: 130px;
  }
`;

const Filas = styled(FilasGroup)``;

// const CeldaHead = styled(CeldaHeadGroup)``;
// const CeldasBody = styled(CeldasBodyGroup)``;
const CeldaHead = styled(CeldaHeadGroup)`
  &.pendiente {
    max-width: 20px;
  }
  &.qty {
    width: 300px;
  }
  &.comentarios {
    max-width: 200px;
  }

  @media screen and (max-width: 715px) {
    font-size: 14px;
  }
  @media screen and (max-width: 460px) {
    font-weight: normal;
  }
  &.qtyPendiente {
    font-size: 12px;
  }
`;
const CeldasBody = styled(CeldasBodyGroup)`
  &.etas {
    padding: 0;
  }
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
    max-width: 150px;
  }
  &.ordenCompra {
  }
  &.comentarios {
    max-width: 100px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  &.status {
    max-width: 150px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    @media screen and (max-width: 650px) {
      max-width: 60px;
      padding: 0;
    }
  }

  @media screen and (max-width: 715px) {
    font-size: 14px;
    padding-left: 2px;
    padding-right: 2px;
  }
`;

const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }
`;

const CajaProyecciones = styled.div`
  width: 100%;
`;
const CajaDetalles = styled.div`
  width: 60%;
  padding: 8px;
`;
const ParrafoProyecciones = styled.p`
  width: 100%;
  text-decoration: underline;
  color: ${ClearTheme.complementary.warning};
  padding: 8px;
`;
