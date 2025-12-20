import { useEffect, useState } from "react";
import styled from "styled-components";
import { useParams } from "react-router-dom";
import Controles from "./components/detallesItems/Controles";
import Descripcion from "./components/detallesItems/Descripcion";
import DatosTecnicos from "./components/detallesItems/DatosTecnicos";
import Galeria from "./components/detallesItems/Galeria";
import Comentarios from "./components/detallesItems/Comentarios";
import {
  fetchDocsByArrayContains,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import Cabecera from "./components/detallesItems/Cabecera";
import { ModalLoading } from "../../components/ModalLoading";
import TextoEptyG from "../../components/TextoEptyG";
import { DataExample } from "./DataExample";
import { BotonQuery } from "../../components/BotonQuery";
import Caracteristicas from "./components/detallesItems/Caracteristicas";
import { ClearTheme, Tema } from "../../config/theme";
import Usos from "./components/detallesItems/Usos";
import InfoAdicional from "./components/detallesItems/InfoAdicional";
import Complementos from "./components/detallesItems/Complementos";
import Alternativas from "./components/detallesItems/Alternativas";
import TablaResultadoConjunto from "../components/TablaResultadoConjunto";
import {
  datoTecnicoSchema,
  datoTecnicoSchemaTipoDimensiones,
} from "../schemas/productoSchema";
import { Alerta } from "../../components/Alerta";
import { generarUUID } from "../../libs/generarUUID";

export default function DetalleArticulo({ userMaster }) {
  // **************** RECURSOS GENERALES ****************
  const location = useParams();
  const docUser = location.id;
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

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
      setHasProduct(itemFind ? true : false);
      const assetAux = assetsDB || [];
      const imagenes = assetAux.filter((asset) => asset.tipo === 0);

      if (docUser == "03019") {
        // if (false) {
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
  const [productEditable, setProductoEditable] = useState(null);
  const activarEdicion = () => {
    setModoEditar(true);
    // ****************** PARCHE 🔴🔴🔴🔴🔴🔴🔴🔴****************** ******
    // ****************** PARCHE 🔴🔴🔴🔴🔴🔴🔴🔴****************** ******
    const dimensionesfind = productMaster.datosTecnicos.find(
      (dato) => dato.tipo == "dimensiones"
    );
    const datoDimensiones = {
      ...datoTecnicoSchemaTipoDimensiones,
      tipo: "dimensiones",
    };
    const datosTecnicosUp = !dimensionesfind
      ? [...productMaster.datosTecnicos, datoDimensiones]
      : productMaster.datosTecnicos;

    const datosTecnicosId = datosTecnicosUp.map((dato) => {
      return {
        ...dato,
        idAux: generarUUID(),
      };
    });
    setProductoEditable({
      ...productMaster,
      datosTecnicos: datosTecnicosId,
    });
  };
  const cancelarEdicion = () => {
    setModoEditar(false);
    setProductoEditable(null);
  };

  // console.log(error);
  // setMensajeAlerta("Error 1 con la base de datos.");
  // setTipoAlerta("error");
  // setDispatchAlerta(true);
  // setTimeout(() => setDispatchAlerta(false), 3000);
  // return "";
  return productMaster ? (
    <Container>
      <Cabecera productMaster={productMaster} modoEditar={modoEditar} />
      <BotonQuery
        productMaster={productMaster}
        productEditable={productEditable}
      />
      <Controles
        productMaster={productMaster}
        activarEdicion={activarEdicion}
        cancelarEdicion={cancelarEdicion}
        modoEditar={modoEditar}
      />
      <Seccion>
        <Titulo>Descripcion</Titulo>
        <CajaElemento>
          <Descripcion
            productMaster={productMaster}
            productEditable={productEditable}
            setProductoEditable={setProductoEditable}
            modoEditar={modoEditar}
          />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Caracteristicas</Titulo>
        <CajaElemento>
          <Caracteristicas
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Usos</Titulo>
        <CajaElemento>
          <Usos
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Datos tecnicos:</Titulo>
        <CajaElemento>
          <DatosTecnicos
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
        </CajaElemento>
      </Seccion>

      <Seccion>
        <Titulo>Info adicional:</Titulo>
        <CajaElemento>
          <InfoAdicional
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
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
      {/* {!modoEditar && (
        <Seccion>
          <Titulo>Comentarios:</Titulo>
          <CajaElemento>
            <Comentarios
              productMaster={productMaster}
              userMaster={userMaster}
              setProductoEditable={setProductoEditable}
            />
          </CajaElemento>
        </Seccion>
      )} */}
      <Seccion>
        <Titulo>Se instala con: (Complementos)</Titulo>
        <CajaElemento>
          <Complementos
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
        </CajaElemento>
      </Seccion>
      <Seccion>
        <Titulo>Alternativas:</Titulo>
        <CajaElemento>
          <Alternativas
            productMaster={productMaster}
            productEditable={productEditable}
            modoEditar={modoEditar}
            setProductoEditable={setProductoEditable}
          />
        </CajaElemento>
      </Seccion>
      <br />
      <br />
      <br />
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
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
  color: white;
  color: ${ClearTheme.complementary.warning};
  font-weight: 400;
  text-decoration: underline;
  margin-left: 15px;
  margin-top: 10px;
  margin-bottom: 10px;
`;
