import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleDown } from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import {
  Detalle1Wrap,
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../../../components/JSXElements/GrupoDetalle";
import { ClearTheme, Tema, Theme } from "../../../../config/theme";
import {
  generatorIconFlagURL,
  ListaPaises,
} from "../../../../components/ListaPaises";
import {
  InputSimpleEditable,
  MenuDesplegable,
  Opciones,
} from "../../../../components/InputGeneral";
import { UnidadesMedidas } from "../../../libs/UnidadesMedida";
import { useState } from "react";
import SelectPaises from "../../../../components/SelectPaises";
import { FindCat } from "../../../libs/CATEGORIASDB";
import { FindSubCat } from "../../../libs/SubCategoriasDB";

export default function Cabecera({ productMaster, modoEditar }) {
  const [selected, setSelected] = useState([]);

  const handleChange = (e) => {
    const values = Array.from(e.target.selectedOptions, (opt) => opt.value);
    setSelected(values);
  };
  return (
    <Container>
      <CajaDetalles
        className={`izq ${Theme.config.modoClear ? "clearModern" : ""}`}
      >
        <Detalle1Wrap>
          <Detalle2Titulo>SKU:</Detalle2Titulo>
          <Detalle3OutPut2222>{productMaster.head.codigo}</Detalle3OutPut2222>
        </Detalle1Wrap>
        <Detalle1Wrap>
          <Detalle2Titulo>Proveedor:</Detalle2Titulo>

          <Detalle3OutPut2222
            title={productMaster.head.proveedorDefault}
            className="input"
          >
            {modoEditar ? (
              <InputSimple className="grupoDetalle" />
            ) : (
              productMaster.head.proveedores[0]
            )}
          </Detalle3OutPut2222>
        </Detalle1Wrap>
        <Detalle1Wrap>
          <Detalle2Titulo>Unidad medida:</Detalle2Titulo>
          <Detalle3OutPut2222 className="input">
            {modoEditar ? (
              <MenuDesplegable className="grupoDetalle">
                {UnidadesMedidas.map((und, index) => {
                  return <Opciones key={index}>{und.descripcion}</Opciones>;
                })}
              </MenuDesplegable>
            ) : (
              productMaster.head.unidadMedida
            )}
          </Detalle3OutPut2222>
        </Detalle1Wrap>
        <Detalle1Wrap className="altoAuto">
          <Detalle2Titulo>Origen:</Detalle2Titulo>

          {modoEditar ? (
            <>
              <SelectPaises seleccionDefault={productMaster.head.paisOrigen} />
            </>
          ) : (
            <Detalle3OutPut2222>
              {productMaster?.head?.paisOrigen?.map((pais, index) => {
                return (
                  <Img
                    key={index}
                    className="flag"
                    title={pais.label}
                    src={generatorIconFlagURL(pais.siglas)}
                  />
                );
              })}
            </Detalle3OutPut2222>
          )}
        </Detalle1Wrap>

        <Detalle1Wrap2222 className={"vertical scroll"}>
          <Detalle2Titulo className={"vertical"}>Documentos:</Detalle2Titulo>
          <SalidaDetalla2 className="vertical">
            {productMaster.head.documentos.map((doc, index) => {
              return (
                <Detalle3OutPut2222 className={"vertical"} key={index}>
                  <Icono icon={faCircleDown} />
                  <Enlace className="enlace" target="_blank" to={doc.url}>
                    {doc.label}
                  </Enlace>
                </Detalle3OutPut2222>
              );
            })}
          </SalidaDetalla2>
        </Detalle1Wrap2222>
        <Detalle1Wrap2222 className={"vertical scroll"}>
          <Detalle2Titulo className={"vertical"}>Enlaces:</Detalle2Titulo>
          <SalidaDetalla2 className={"vertical"}>
            {productMaster.head.enlaces.map((doc, index) => {
              return (
                <Detalle3OutPut2222 className={"vertical"} key={index}>
                  <Enlace className="enlace" target="_blank" to={doc.url}>
                    {doc.label}
                  </Enlace>
                </Detalle3OutPut2222>
              );
            })}
          </SalidaDetalla2>
        </Detalle1Wrap2222>
      </CajaDetalles>
      <CajaDetalles
        className={`der
         ${Theme.config.modoClear ? "clearModern" : ""}
        `}
      >
        <CajaFotoProducto>
          <Img
            className="imagenDestacada"
            src={
              productMaster.head.imagenDestacada
                ? productMaster.head.imagenDestacada
                : productMaster.galeria.imagenes[0]?.url
            }
          />
        </CajaFotoProducto>
        <CajaDentroDetalle>
          <CajaNombreProducto>
            <TituloProducto>{productMaster.head.descripcion}</TituloProducto>
          </CajaNombreProducto>
          <Detalle1Wrap>
            <Detalle2Titulo>Categoria*:</Detalle2Titulo>
            <Detalle3OutPut2222>
              <Enlace
                target="_blank"
                to={
                  "/articulos/maestros/categorias/" +
                  FindCat(productMaster.head.categoria).code
                }
              >
                {FindCat(productMaster.head.categoria).nombre}
              </Enlace>
            </Detalle3OutPut2222>
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Sub categoria:</Detalle2Titulo>
            <Detalle3OutPut2222>
              {FindSubCat(productMaster.head.subCategoria).nombre}
            </Detalle3OutPut2222>
          </Detalle1Wrap>
          <Detalle1Wrap>
            <Detalle2Titulo>Marca:</Detalle2Titulo>
            <Detalle3OutPut2222>{productMaster.head.marca}</Detalle3OutPut2222>
          </Detalle1Wrap>
        </CajaDentroDetalle>
      </CajaDetalles>
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
  display: flex;
  gap: 15px;
  justify-content: center;
  margin-bottom: 20px;
`;

const CajaDetalles = styled.div`
  width: 46%;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  border: 2px solid ${Tema.primary.grisNatural};
  padding: 10px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  color: ${Tema.secondary.azulOpaco};
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);

    border: 1px solid white;

    color: white;
  }
  &.der {
    padding: 0;
    overflow: hidden;
  }
`;
const CajaDentroDetalle = styled.div`
  padding: 8px;
`;
const Img = styled.img`
  &.flag {
    height: 18px;
    margin-left: 2px;
  }
  &.imagenDestacada {
    height: 100%;
    object-fit: contain;
    width: 100%;
  }
`;

//
//
// Particular
const Icono = styled(FontAwesomeIcon)`
  margin-right: 4px;
`;
const Enlace = styled(Link)`
  color: inherit;
  &.enlace {
    transition: ease all 0.2s;
    &:hover {
      cursor: pointer;
      color: ${Tema.primary.azulBrillante};
      color: white;
    }
  }
`;

const CajaFotoProducto = styled.div`
  height: 150px;
  display: flex;
  justify-content: center;
  margin-bottom: 5px;
`;
const CajaNombreProducto = styled.div``;
const TituloProducto = styled.h2`
  width: 100%;
  font-size: 1.3rem;
  text-align: center;
  font-weight: lighter;
`;
const IconoCertified = styled.img`
  height: 70%;
`;
const IconoEpty = styled.span`
  height: 100%;
  display: inline-block;
  width: 15px;
  margin-right: 4px;
`;
const SalidaDetalla2 = styled.div`
  flex-direction: column;
  display: flex;
  width: 100%;
  /* height: 60px; */
  /* height: 40px; */
  min-height: 15px;
`;
const Detalle3OutPut2222 = styled(Detalle3OutPut)`
  height: 30px;
  min-height: 20px;

  &.vertical {
    margin: 0;
    min-height: 20px;
    height: auto;
  }
  &.bandera {
    display: flex;
    justify-content: end;
    align-items: center;
    overflow: visible;
  }
`;
const Detalle1Wrap2222 = styled(Detalle1Wrap)`
  &.vertical {
    min-height: 40px;
    max-height: 100px;
    overflow-y: scroll;
  }
`;
const InputSimple = styled(InputSimpleEditable)``;
const Label = styled.label`
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
`;

const Select = styled.select`
  width: 250px;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid #ccc;
  font-size: 14px;
`;
const MenuListaBandera = styled(MenuDesplegable)`
  height: 150px;
  z-index: 200;
`;
const OpcionBandera = styled(Opciones)`
  height: 30px;
  border: 1px solid white;
  padding: 4px;
  display: flex;
`;
