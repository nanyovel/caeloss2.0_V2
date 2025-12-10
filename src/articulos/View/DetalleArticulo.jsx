import { useEffect, useState } from "react";
import styled from "styled-components";
import { Tema } from "../../config/theme";
import { useParams } from "react-router-dom";
import {
  generatorIconFlagURL,
  ListaPaises,
} from "../../components/ListaPaises";
import Controles from "./components/detallesItems/Controles";
import Descripcion from "./components/detallesItems/Descripcion";
import DatosTecnicos from "./components/detallesItems/DatosTecnicos";
import Galeria from "./components/detallesItems/Galeria";
import Comentarios from "./components/detallesItems/Comentarios";
import {
  fetchDocsByArrayContains,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import articulosDB2 from "../Database/itemsSubir2";

import Cabecera from "./components/detallesItems/Cabecera";
import { ModalLoading } from "../../components/ModalLoading";
import TextoEptyG from "../../components/TextoEptyG";
import TablaResultadoConjunto from "../components/TablaResultadoConjunto";
import { DataExample } from "./DataExample";
import { UnidadesMedidas } from "../libs/UnidadesMedida";
import { BotonQuery } from "../../components/BotonQuery";

export default function DetalleArticulo({ userMaster }) {
  // **************** RECURSOS GENERALES ****************
  const location = useParams();
  const docUser = location.id;

  // ************** LLAMADA A LA BASE DE DATOS ****************
  const [productDB, setProductDB] = useState(null);
  const [productMaster, setProductMaster] = useState(null);
  const [assetsDB, setAssetsDB] = useState(null);

  useDocByCondition("productos", setProductDB, "head.codigo", "==", docUser);
  const [hasProduct, setHasProduct] = useState(null);
  useEffect(() => {
    if (productDB?.length > 0) {
      // const itemFind = articulosDB2.find((item) => item.head.codigo == docUser);
      const itemFind = productDB[0];
      console.log(itemFind);
      setHasProduct(itemFind ? true : false);
      const assetAux = assetsDB || [];
      console.log(assetAux);
      const imagenes = assetAux.filter((asset) => asset.tipo === 0);

      // if (docUser == "03019") {
      if (false) {
        setProductMaster(DataExample);
      } else {
        setProductMaster({
          ...itemFind,
          galeria: {
            ...itemFind.galeria,
            imagenes: imagenes.length > 0 ? imagenes : [],
          },
        });
      }
    }
  }, [docUser, assetsDB, productDB]);

  useEffect(() => {
    fetchDocsByArrayContains(
      "productoResource",
      setAssetsDB,
      "itemsCodigos",
      docUser
    );
  }, [docUser]);

  // **************** EDICION ****************
  const [modoEditar, setModoEditar] = useState(false);
  const activarEdicion = () => {
    setModoEditar(true);
  };
  const cancelarEdicion = () => {
    setModoEditar(false);
  };

  return productMaster ? (
    <Container>
      <Cabecera productMaster={productMaster} modoEditar={modoEditar} />
      <BotonQuery productMaster={productMaster} />
      <Controles
        productMaster={productMaster}
        activarEdicion={activarEdicion}
        cancelarEdicion={cancelarEdicion}
        modoEditar={modoEditar}
      />
      <Seccion>
        <Titulo>Descripcion</Titulo>
        <CajaElemento>
          <Descripcion productMaster={productMaster} />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Caracteristicas</Titulo>
        <CajaElemento>{/* <Caracteristicas /> */}</CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Usos</Titulo>
        <CajaElemento>{/* <Usos /> */}</CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Datos tecnicos:</Titulo>
        <CajaElemento>
          <DatosTecnicos productMaster={productMaster} />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Info adicional:</Titulo>
        <CajaElemento>
          {/* <InfoAdicional productMaster={productMaster} /> */}
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Galeria:</Titulo>
        <CajaElemento>
          <Galeria productMaster={productMaster} />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Conjuntos:</Titulo>
        <CajaElemento>{/* <TablaResultadoConjunto /> */}</CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Comentarios:</Titulo>
        <CajaElemento>
          <Comentarios productMaster={productMaster} userMaster={userMaster} />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Se instala con: (Complementos)</Titulo>
        <CajaElemento>
          {/* <Complementos
              productMaster={productMaster}
              userMaster={userMaster}
            /> */}
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Alternativas:</Titulo>
        <CajaElemento>{/* <Alternativas /> */}</CajaElemento>
      </Seccion>
      <br />
      <br />
      <br />
    </Container>
  ) : hasProduct === false ? (
    <TextoEptyG texto="El articulo que buscas no existe." />
  ) : (
    <ModalLoading />
  );
}
const Container = styled.div``;
const Seccion = styled.section`
  margin-bottom: 40px;
  padding: 0 15px;
`;
const CajaElemento = styled.div`
  padding: 0 30px;
`;
const Titulo = styled.h2`
  color: ${Tema.primary.azulBrillante};
  color: white;
  font-weight: 400;
  text-decoration: underline;
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
