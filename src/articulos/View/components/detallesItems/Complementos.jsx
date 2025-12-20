import { useEffect, useState } from "react";
import styled from "styled-components";
import Item from "./Item";
import SliderInstItem from "./SliderInstItem";
import { ClearTheme, Tema } from "../../../../config/theme";
import {
  fetchDocsByArrayContains,
  fetchDocsByArrayContainsAny,
  fetchDocsByConditionGetDocs,
  fetchDocsByIn,
} from "../../../../libs/useDocByCondition";
import {
  complementosSchema,
  productoSchema,
} from "../../../schemas/productoSchema";
import { BtnGeneralButton } from "../../../../components/BtnGeneralButton";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  ImgCelda,
  ParrafoAction,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";
import {
  InputSimpleEditable,
  TextArea,
} from "../../../../components/InputGeneral";
import { PRODUCT_FULL2 } from "../../../../components/corporativo/PRODUCT_FULL2.JS";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";
import { ModalLoading } from "../../../../components/ModalLoading";
import { BotonQuery } from "../../../../components/BotonQuery";
import { Alerta } from "../../../../components/Alerta";
import ModalGeneral from "../../../../components/ModalGeneral";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../../../components/JSXElements/GrupoDetalle";

export default function Complementos({
  productMaster,
  productEditable,
  modoEditar,
  setProductoEditable,
}) {
  const [dispatchAlerta, setDispatchAlerta] = useState(false);
  const [mensajeAlerta, setMensajeAlerta] = useState("");
  const [tipoAlerta, setTipoAlerta] = useState("");

  const ListaArticulos = PRODUCT_FULL2;
  const [hasSlider, setHasSlider] = useState(false);
  const [items, setItems] = useState([]);
  const [itemsEditable, setItemsEditable] = useState([]);

  // ************* LLamadas a la base de datos para complementar info de los items *******
  useEffect(() => {
    const productCurrent = modoEditar ? productEditable : productMaster;
    const codigosItems = productCurrent.complementos.map((item) => item.codigo);
    (async () => {
      setIsLoading(true);
      const productosDB =
        codigosItems.length > 0
          ? await fetchDocsByIn(
              "productos",
              undefined,
              "head.codigo",
              codigosItems
            )
          : [];
      const itemsSinImgDestacada = productosDB.filter((producto) => {
        if (!producto.head.imagenDestacada) {
          return producto;
        }
      });

      const codigosSinImg = itemsSinImgDestacada.map((item) => {
        return item.head.codigo;
      });
      const assetsProducts =
        codigosSinImg.length > 0
          ? await fetchDocsByArrayContainsAny(
              "productoResource",
              undefined,
              "itemsCodigos",
              codigosSinImg
            )
          : [];
      const itemsParsed = itemsSinImgDestacada.map((item) => {
        const imagenes = assetsProducts.filter(
          (asset) =>
            asset.tipo === 0 && asset.itemsCodigos.includes(item.head.codigo)
        );
        const itemParsed = {
          ...item,
          galeria: {
            ...item.galeria,
            imagenes: imagenes,
          },
        };

        return {
          ...itemParsed,
          head: {
            ...itemParsed.head,
            imagenDestacada: imagenes[0].url,
          },
        };
      });
      //
      const itemsConImgDestacada = productosDB.filter((producto) => {
        if (producto.head.imagenDestacada) {
          return producto;
        }
      });

      // QUEDE AQUI, NECESITO QUE EL LISTADO NO SE ORDENE SEGUN UN ORDEN X, SINO QUE SEGUN SE AGREGUEN LOS ITEMS APAREZCAN DE ULTIMO
      // 1:55AM DEL 14-12-25
      const conglo = [...itemsParsed, ...itemsConImgDestacada];
      console.log(conglo);
      console.log(itemsParsed);
      setItems(conglo);
      setItemsEditable(conglo);
      setIsLoading(false);
    })();
  }, [modoEditar, productMaster, productEditable]);

  //****************/ seleccionando un producto ********************/
  //*****************/ para el slider  **************************//
  const [productSelect, setProductSelect] = useState({ ...productoSchema });
  const abrirItem = (producto) => {
    setHasSlider(true);

    const productFind = productMaster.complementos.find(
      (item) => item.codigo == producto.head.codigo
    );

    setProductSelect({ ...producto, datosAux: productFind });
  };

  //********** BUSCANDO EL ITEM A AGREGAR ***********/
  const initialInput = {
    codigo: "",
    descripcion: "",
  };
  const [articuloBuscar, setArticuloBuscar] = useState({ ...initialInput });
  const [articuloDB, setArticuloDB] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const handleInputs = async (e) => {
    const { name, value } = e.target;

    const articuloBuscado = ListaArticulos.find((item) => {
      if (item.codigo == value) {
        return item;
      }
    });

    setArticuloBuscar({
      ...articuloBuscar,
      codigo: value,
      descripcion: articuloBuscado ? articuloBuscado.descripcion : "",
    });
  };

  // LLaMANDO IMAGENES DEL ITEM BUSCADO
  useEffect(() => {
    if (articuloBuscar.descripcion) {
      setIsLoading(true);
      (async () => {
        const itemDB = await fetchDocsByConditionGetDocs(
          "productos",
          undefined,
          "head.codigo",
          "==",
          articuloBuscar.codigo
        );

        if (itemDB) {
          const assetsDB = await fetchDocsByArrayContains(
            "productoResource",
            undefined,
            "itemsCodigos",
            itemDB[0].head.codigo
          );
          const assetAux = assetsDB || [];
          const imagenes = assetAux.filter((asset) => asset.tipo === 0);

          setArticuloDB({
            ...itemDB[0],
            galeria: {
              ...itemDB[0].galeria,
              imagenes: imagenes.length > 0 ? imagenes : [],
            },
          });
        }
      })();
      setIsLoading(false);
    }
  }, [articuloBuscar]);

  // ADD Y REMOVE ITEM
  const addItem = () => {
    const itemAdd = {
      ...complementosSchema,
      codigo: articuloBuscar.codigo,
    };
    const yaAgregado = productEditable.complementos.find(
      (item) => item.codigo == itemAdd.codigo
    );
    if (yaAgregado) {
      setMensajeAlerta("Producto ya agregado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }

    const itemFind = ListaArticulos.find(
      (item) => item.codigo == itemAdd.codigo
    );
    if (!itemFind) {
      setMensajeAlerta("Producto no encontrado.");
      setTipoAlerta("warning");
      setDispatchAlerta(true);
      setTimeout(() => setDispatchAlerta(false), 3000);
      return;
    }
    setProductoEditable({
      ...productEditable,
      complementos: [...productEditable.complementos, itemAdd],
    });
    setArticuloBuscar({ ...initialInput });
    setArticuloDB(null);
  };

  const quitarItem = (item) => {
    console.log(item);
    setProductoEditable({
      ...productEditable,
      complementos: productEditable.complementos.filter(
        (product) => product.codigo != item.head.codigo
      ),
    });
  };

  // modal edicion mas detalles
  const [hasModal, setHasModal] = useState(false);
  const [itemSelectDetalles, setHasItemSelectDetalles] = useState({
    itemDB: null,
    itemComplemento: null,
  });
  const abrirEdicionDetalles = (item) => {
    setHasModal(true);

    const itemComplemento = productEditable.complementos.find(
      (product) => product.codigo == item.head.codigo
    );

    setHasItemSelectDetalles({
      itemDB: item,
      itemComplemento: itemComplemento,
    });
    console.log(item);
  };
  const addAltenativasItem = () => {};
  const removeAltenativasItem = () => {};
  return (
    <Container>
      {modoEditar ? (
        <WrapEdit>
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Imagen</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  <CeldaHeadGroup>Detalles</CeldaHeadGroup>
                  <CeldaHeadGroup>Quitar</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {itemsEditable.map((item, index) => {
                  return (
                    <FilasGroup className="body" key={index}>
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ImgCelda src={item.head.imagenDestacada} />{" "}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>{item.head.codigo}</CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        {item.head.descripcion}
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ParrafoAction
                          onClick={() => abrirEdicionDetalles(item)}
                        >
                          ℹ️
                        </ParrafoAction>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <ParrafoAction onClick={() => quitarItem(item)}>
                          ❌
                        </ParrafoAction>
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
          <br />
          <CajaBtn>
            <CajaInput>
              <WrapCodigo>
                <Icono icon={faMagnifyingGlass} />
                <InputSimple
                  name="codigo"
                  className="codigo"
                  value={articuloBuscar.codigo}
                  placeholder="Codigo"
                  list="articulos"
                  onChange={(e) => handleInputs(e)}
                  autoComplete="off"
                />
              </WrapCodigo>
              <DataList id="articulos">
                {ListaArticulos.map((item, index) => {
                  return (
                    <Opcion value={item.codigo} key={index}>
                      {item.descripcion}
                    </Opcion>
                  );
                })}
              </DataList>

              <InputSimple
                placeholder="Descripcion"
                disabled
                className="disabled"
                value={articuloBuscar.descripcion}
              />
              <BotonQuery
                itemsEditable={itemsEditable}
                productEditable={productEditable}
              />
              <CajaImg>
                {articuloDB && articuloBuscar.descripcion && (
                  <ImgCurrent
                    src={
                      articuloDB?.head?.imagenDestacada
                        ? articuloDB?.head?.imagenDestacada
                        : articuloDB?.galeria.imagenes[0].url
                    }
                  />
                )}
              </CajaImg>
            </CajaInput>
            <BtnSimple onClick={() => addItem()}>+</BtnSimple>
          </CajaBtn>
        </WrapEdit>
      ) : (
        <>
          {items.map((producto, index) => {
            return (
              <CajaItem key={index} onClick={() => abrirItem(producto)}>
                <Item key={index} producto={producto} />
              </CajaItem>
            );
          })}
          {hasSlider && (
            <SliderInstItem
              hasSlider={hasSlider}
              setHasSlider={setHasSlider}
              productSelect={productSelect}
            />
          )}
        </>
      )}
      {isLoading && <ModalLoading />}
      <Alerta
        estadoAlerta={dispatchAlerta}
        tipo={tipoAlerta}
        mensaje={mensajeAlerta}
      />
      {hasModal && (
        <ModalGeneral
          titulo={"Detalles de: " + itemSelectDetalles.itemDB.head.descripcion}
          hasModal={hasModal}
          setHasModal={setHasModal}
        >
          <CajaInternaModal>
            <Detalle1Wrap className="vertical">
              <Detalle2Titulo className="vertical">Funcion:</Detalle2Titulo>
              <Detalle3OutPut className="vertical">
                <TextArea2 />
              </Detalle3OutPut>
            </Detalle1Wrap>
            <br />

            <Detalle1Wrap className="vertical">
              <Detalle2Titulo className="vertical">
                Como utilizar:
              </Detalle2Titulo>
              <Detalle3OutPut className="vertical">
                <TextArea2 />
              </Detalle3OutPut>{" "}
            </Detalle1Wrap>
            <br />
            <CajaTablaGroup className="altoAuto">
              <TablaGroup>
                <thead>
                  <FilasGroup className="cabeza">
                    <CeldaHeadGroup>N°</CeldaHeadGroup>
                    <CeldaHeadGroup>Codigo</CeldaHeadGroup>
                    <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                  </FilasGroup>
                </thead>
                <tbody>
                  {itemSelectDetalles.itemComplemento.altenativas.map(
                    (item, index) => {
                      return (
                        <FilasGroup className="body" key={index}>
                          <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                          <CeldasBodyGroup>{item.codigo}</CeldasBodyGroup>
                          <CeldasBodyGroup className="startText">
                            {item.descripcion}
                          </CeldasBodyGroup>
                        </FilasGroup>
                      );
                    }
                  )}
                </tbody>
              </TablaGroup>
              <CajaBtn>
                <BtnGeneralButton onClick={() => addAltenativasItem()}>
                  -
                </BtnGeneralButton>
                <BtnGeneralButton onClick={() => removeAltenativasItem()}>
                  +
                </BtnGeneralButton>
              </CajaBtn>
            </CajaTablaGroup>
          </CajaInternaModal>
        </ModalGeneral>
      )}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  min-height: 100px;
  display: flex;
  border: 1px solid ${Tema.primary.azulBrillante};

  gap: 5px;
  overflow-x: scroll;
  overflow-y: hidden;
  padding: 4px;
  *,
  *:before,
  *:after {
    box-sizing: border-box;
  }
  &::-webkit-scrollbar {
    width: 8px;
    height: 8px;
  }
  &::-webkit-scrollbar-thumb {
    background-color: #19b4ef;
    border-radius: 7px;
  }
`;
const CajaItem = styled.div`
  min-width: calc(100% / 3 - 30px);
  margin-bottom: 5px;
  height: 200px;
`;
const WrapEdit = styled.div`
  display: flex;
  flex-direction: column;
`;
const CajaBtn = styled.div``;
const BtnSimple = styled(BtnGeneralButton)``;
const CajaInput = styled.div`
  width: 350px;
`;

const DataList = styled.datalist`
  width: 150%;
`;
const Opcion = styled.option``;
const WrapCodigo = styled.div`
  width: 100%;
  position: relative;
  /* padding-left: 35px; */
`;

const Icono = styled(FontAwesomeIcon)`
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translate(0, -50%);
  color: #353232;
`;
const InputSimple = styled(InputSimpleEditable)`
  &.codigo {
    padding-left: 35px;
  }
`;
const CajaImg = styled.div`
  border: 1px solid white;
  min-height: 150px;
  box-shadow: ${ClearTheme.config.sombra};
  border-radius: 6px;
`;
const ImgCurrent = styled.img`
  width: 100%;
  max-height: 150px;
  object-fit: contain;
`;
const CajaInternaModal = styled.div`
  width: 100%;
  height: 100%;
  padding: 8px;
`;
const TextArea2 = styled(TextArea)`
  height: 50px;
  min-height: 50px;
`;
