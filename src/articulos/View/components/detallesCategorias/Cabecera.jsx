import React, { useEffect, useState } from "react";
import styled from "styled-components";

// import { generatorIconFlagURL } from "../../../components/ListaPaises";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleDown,
  faEye,
  faEyeSlash,
} from "@fortawesome/free-regular-svg-icons";
import { Link } from "react-router-dom";
import { faLink } from "@fortawesome/free-solid-svg-icons";
// import ImgCertified from "./../../public/img/calidad.png";
import ImgCertified from "./../../../../../public/img/calidad.png";
import {
  Detalle2Titulo,
  Detalle3OutPut,
} from "../../../../components/JSXElements/GrupoDetalle";
import { ClearTheme, Tema, Theme } from "../../../../config/theme";
import { SubCategorias } from "../../../libs/SubCategoriasDB";
import articulosDB2 from "../../../Database/itemsSubir2";
import ModalGeneral from "../../../../components/ModalGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  FilasGroup,
  TablaGroup,
} from "../../../../components/JSXElements/GrupoTabla";

export default function Cabecera({ categoriaMaster }) {
  // Trae las sub categorias y las marcas
  const [subCategoriasSelect, setSubCategoriasSelect] = useState([]);
  const [marcasSelect, setMarcasSelect] = useState([]);

  useEffect(() => {
    if (categoriaMaster) {
      const itemsCat = articulosDB2.filter((item) => {
        if (item.head.categoria == categoriaMaster.code) {
          return item;
        }
      });
      // 1-sub categorias
      const listaSubCategorias = itemsCat.map((item) => {
        return item.head.subCategoria;
      });
      const sinRepetidosSubCat = [...new Set(listaSubCategorias)];
      const subCatParsed = SubCategorias.filter((subCat) => {
        const existe = sinRepetidosSubCat.includes(subCat.code);
        if (existe) {
          return {
            ...subCat,
            select: false,
          };
        }
      });
      setSubCategoriasSelect(subCatParsed);
      // 2- marcas
      const listaMarcas = itemsCat.map((item) => {
        return item.head.marca;
      });
      const sinRepetidosMarcas = [...new Set(listaMarcas)];
      const marcasParsed = sinRepetidosMarcas.map((marca) => {
        return {
          nombre: marca,
          select: false,
        };
      });

      setMarcasSelect(marcasParsed);
    }
  }, [categoriaMaster]);

  //seleccionar sub categoria
  const [modalSubCat, setModalSubCat] = useState(false);
  const [itemsSubCat, setItemsSubCat] = useState([]);
  const [subCatSelected, setSubCatSelected] = useState({});
  const selectSubCat = (codeCat) => {
    let catSelectAux = {};
    const subCategorias = subCategoriasSelect.map((subCat) => {
      if (subCat.code == codeCat) {
        catSelectAux = subCat;
        return {
          ...subCat,
          select: true,
        };
      }
      return {
        ...subCat,
        select: false,
      };
    });
    //
    setSubCatSelected(catSelectAux);
    const itemsSubCatAux = articulosDB2.filter((item) => {
      if (
        item.head.subCategoria == catSelectAux.code &&
        item.head.categoria == categoriaMaster.code
      ) {
        return item;
      }
    });
    setItemsSubCat(itemsSubCatAux);
    setSubCategoriasSelect(subCategorias);
    setModalSubCat(true);
  };

  // seleccionar marca
  const [modalMarca, setModalMarca] = useState(false);
  const [itemsMarca, setItemsMarca] = useState([]);
  const [marcaSelected, setMarcaSelected] = useState({});
  const selectMarca = (nombreMarca) => {
    let marcaAux = {};
    // 123
    const marcas = marcasSelect.map((marca) => {
      if (marca.nombre == nombreMarca) {
        marcaAux = marca;
        return {
          ...marca,
          select: true,
        };
      }
      return {
        ...marca,
        select: false,
      };
    });
    setMarcaSelected(marcaAux);
    const itemsMarcasAux = articulosDB2.filter((item) => {
      if (
        item.head.marca == marcaAux.nombre &&
        item.head.categoria == categoriaMaster.code
      ) {
        return item;
      }
    });
    setModalMarca(true);
    setItemsMarca(itemsMarcasAux);
  };

  return (
    <Container>
      <CajaDetalles
        className={`izq
${Theme.config.modoClear ? "clearModern" : ""}
`}
      >
        <Detalle1Wrap className="vertical transparent alto50X100">
          <Detalle2Titulo className="vertical">Sub categorias:</Detalle2Titulo>

          {/* <Detalle3OutPut> */}
          <ListaDes>
            {subCategoriasSelect.map((subCat, index) => {
              return (
                <Categoria
                  key={index}
                  className={subCat.select ? "seleccionado" : ""}
                >
                  <Span>
                    {subCat.select ? (
                      <Icono
                        icon={faEye}
                        onClick={() => selectSubCat(subCat.code)}
                      />
                    ) : (
                      <Icono
                        className="disabled"
                        icon={faEyeSlash}
                        onClick={() => selectSubCat(subCat.code)}
                      />
                    )}
                  </Span>
                  {subCat.nombre}
                </Categoria>
              );
            })}
          </ListaDes>

          {/* </Detalle3OutPut> */}
          {/* <Detalle3OutPut>{productMaster.head.codigo}</Detalle3OutPut> */}
        </Detalle1Wrap>
        <Detalle1Wrap className="vertical transparent alto50X100">
          <Detalle2Titulo className="vertical">Marcas:</Detalle2Titulo>
          <ListaDes>
            {marcasSelect.map((marca, index) => {
              return (
                <Categoria
                  key={index}
                  className={marca.select ? "seleccionado" : ""}
                >
                  <Span>
                    {marca.select ? (
                      <Icono
                        icon={faEye}
                        onClick={() => selectMarca(marca.nombre)}
                      />
                    ) : (
                      <Icono
                        className="disabled"
                        icon={faEyeSlash}
                        onClick={() => selectMarca(marca.nombre)}
                      />
                    )}
                  </Span>
                  {marca.nombre}
                </Categoria>
              );
            })}
          </ListaDes>{" "}
        </Detalle1Wrap>
      </CajaDetalles>
      <CajaDetalles
        className={`der
         ${Theme.config.modoClear ? "clearModern" : ""}
        `}
      >
        <CajaFotoProducto>
          <Img className="imagenDestacada" src={categoriaMaster.urlImg} />
        </CajaFotoProducto>
        <CajaNombreProducto>
          <TituloProducto>{categoriaMaster.nombre}</TituloProducto>
        </CajaNombreProducto>
      </CajaDetalles>
      {modalSubCat && (
        <ModalGeneral
          setHasModal={setModalSubCat}
          titulo={"Sub Categoria:" + " " + subCatSelected.nombre}
        >
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {itemsSubCat.map((item, index) => {
                  return (
                    <FilasGroup key={index} className="body">
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlace
                          target="_blank"
                          to={
                            "/articulos/maestros/productos/" + item.head.codigo
                          }
                        >
                          {item.head.codigo}
                        </Enlace>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        {item.head.descripcion}
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </ModalGeneral>
      )}
      {modalMarca && (
        <ModalGeneral
          setHasModal={setModalMarca}
          titulo={"Marca: " + marcaSelected.nombre}
        >
          <CajaTablaGroup>
            <TablaGroup>
              <thead>
                <FilasGroup className="cabeza">
                  <CeldaHeadGroup>N°</CeldaHeadGroup>
                  <CeldaHeadGroup>Codigo*</CeldaHeadGroup>
                  <CeldaHeadGroup>Descripcion</CeldaHeadGroup>
                </FilasGroup>
              </thead>
              <tbody>
                {itemsMarca.map((item, index) => {
                  return (
                    <FilasGroup key={index} className="body">
                      <CeldasBodyGroup>{index + 1}</CeldasBodyGroup>
                      <CeldasBodyGroup>
                        <Enlace
                          target="_blank"
                          to={
                            "/articulos/maestros/productos/" + item.head.codigo
                          }
                        >
                          {item.head.codigo}
                        </Enlace>
                      </CeldasBodyGroup>
                      <CeldasBodyGroup className="startText">
                        {item.head.descripcion}
                      </CeldasBodyGroup>
                    </FilasGroup>
                  );
                })}
              </tbody>
            </TablaGroup>
          </CajaTablaGroup>
        </ModalGeneral>
      )}
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
  padding: 2px;
  border-radius: 5px;
  background-color: ${Tema.secondary.azulProfundo};
  overflow: hidden;
  color: ${Tema.secondary.azulOpaco};
  height: 200px;
  &.clearModern {
    background-color: ${ClearTheme.secondary.azulFrosting};
    backdrop-filter: blur(3px);

    border: 1px solid white;

    color: white;
  }
  &.der {
    padding: 0;
  }
`;
const Img = styled.img`
  &.flag {
    height: 20px;
    margin-left: 10px;
  }
  &.imagenDestacada {
    height: 100%;
    max-height: 240px;
    width: 100%;
    object-fit: cover;
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
  height: 100%;
  display: flex;
  justify-content: center;
`;
const CajaNombreProducto = styled.div`
  position: absolute;
  bottom: 25px;
  padding-left: 15px;
  background-color: white;
`;
const TituloProducto = styled.h2`
  width: 100%;
  font-size: 1.3rem;
  text-align: center;
  font-weight: lighter;
  color: ${ClearTheme.primary.azulBrillante};
  color: ${ClearTheme.complementary.warning};
  font-weight: bold;
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
const ListaDes = styled.ul`
  /* padding-left: 25px; */
  color: #d4d4d4;
  width: 100%;
  padding-left: 35px;
`;
//
//
//

const ContainerMaster = styled.div`
  position: relative;
  padding: 0 15px;
  width: 100%;
  display: flex;
  padding: 8px;
`;
const WrapCategorias = styled.div`
  width: 49%;
  min-height: 400px;
  &.cajitas {
  }
`;

const Titulo = styled.h2`
  color: white;
  font-weight: 400;
  font-size: 1.5rem;
  text-decoration: underline;
  margin-bottom: 5px;
`;
const Lista = styled.ol`
  padding-left: 30px;
`;
const Categoria = styled.li`
  color: #dcdcdc;
  &.seleccionado {
    text-decoration: underline;
    color: ${ClearTheme.primary.azulBrillante};
  }
`;
const Span = styled.span``;

const CajitaDer = styled.div`
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  border: 1px solid white;
  box-shadow: ${ClearTheme.config.sombra};
  &.foto {
    padding: 0;
    height: 200px;
    overflow: hidden;
    position: relative;
  }
  &.subCategorias {
    width: 100%;
    min-height: 100px;
  }
`;
const Foto = styled.img`
  width: 100%;
  height: 100%;
  max-height: 200px;
  object-fit: cover;
`;
const CajaTituloFoto = styled.div`
  position: absolute;
  bottom: 25px;
  padding-left: 15px;
  background-color: white;
`;
const TituloCajitas = styled.h2`
  color: ${ClearTheme.primary.azulBrillante};
  color: ${ClearTheme.complementary.warning};

  text-decoration: underline;
`;
const Detalle1Wrap = styled.div`
  display: flex;

  width: 100%;
  height: 50%;
  color: white;

  border-radius: 5px;
  flex-direction: column;
  border: none;

  background-color: transparent;
  border: 1px solid transparent;
  transition: all ease 0.3s;
  padding: 4px;
  border-bottom: 1px solid #3e5871;
  overflow: auto;
  &:hover {
    color: white;

    border: 1px solid white;
  }
`;
