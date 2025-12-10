import { useEffect, useState } from "react";
import { CATEGORIASDB } from "../libs/CATEGORIASDB";
import styled from "styled-components";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-regular-svg-icons";
import { ClearTheme } from "../../config/theme";
import articulosDB2 from "../Database/itemsSubir2";
import { SubCategorias } from "../libs/SubCategoriasDB";
import ModalGeneral from "../../components/ModalGeneral";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";

export default function CategoriasMain() {
  const [categoriasParsed, setCategoriasParse] = useState([]);
  const [catSelect, setCatSelect] = useState(null);
  useEffect(() => {
    const categorias = CATEGORIASDB.map((cat) => {
      return {
        ...cat,
        select: false,
      };
    });
    setCategoriasParse(categorias);
  }, []);
  //
  //
  const selectCat = (codeCat) => {
    const categorias = CATEGORIASDB.map((cat) => {
      if (cat.code == codeCat) {
        setCatSelect(cat);
        return {
          ...cat,
          select: true,
        };
      }
      return {
        ...cat,
        select: false,
      };
    });
    setCategoriasParse(categorias);
  };

  // Trae las sub categorias y las marcas
  const [subCategoriasSelect, setSubCategoriasSelect] = useState([]);
  const [marcasSelect, setMarcasSelect] = useState([]);
  useEffect(() => {
    if (catSelect) {
      const itemsCat = articulosDB2.filter((item) => {
        if (item.head.categoria == catSelect.code) {
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
  }, [catSelect]);
  //
  //
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
        item.head.categoria == catSelect.code
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
        item.head.categoria == catSelect.code
      ) {
        return item;
      }
    });
    setModalMarca(true);
    setItemsMarca(itemsMarcasAux);
  };

  return (
    <ContainerMaster>
      <WrapCategorias>
        <Titulo>Categorias*:</Titulo>
        <Lista>
          {categoriasParsed.map((cat) => (
            <Categoria
              key={cat.code}
              className={cat.select ? "seleccionado" : ""}
            >
              <Span>
                {cat.select ? (
                  <Icono icon={faEye} onClick={() => selectCat(cat.code)} />
                ) : (
                  <Icono
                    className="disabled"
                    icon={faEyeSlash}
                    onClick={() => selectCat(cat.code)}
                  />
                )}
              </Span>
              <Enlace
                target="_blank"
                to={"/articulos/maestros/categorias/" + cat.code}
              >
                {cat.nombre}
              </Enlace>
            </Categoria>
          ))}
        </Lista>
      </WrapCategorias>
      <WrapCategorias className="cajitas">
        {catSelect && (
          <>
            <CajitaDer className="foto">
              <Foto src={catSelect.urlImg} />
              <CajaTituloFoto>
                <TituloCajitas className="foto">
                  {catSelect.nombre}
                </TituloCajitas>
              </CajaTituloFoto>
            </CajitaDer>
            <br />
            <CajitaDer className="subCategorias">
              <TituloCajitas>Sub Categorias</TituloCajitas>

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
            </CajitaDer>
            <br />
            <CajitaDer className="marcas">
              <TituloCajitas>Marcas</TituloCajitas>

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
              </ListaDes>
            </CajitaDer>
          </>
        )}
      </WrapCategorias>
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
    </ContainerMaster>
  );
}
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
const Icono = styled(FontAwesomeIcon)`
  color: inherit;
  cursor: pointer;
  transition: ease all 0.2s;
  &.disabled {
    color: gray;

    &:hover {
      color: white;
    }
  }
  &.select {
    /* color: ${ClearTheme.complementary.warning}; */
  }
`;
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
const ListaDes = styled.ul`
  padding-left: 25px;
  color: #d4d4d4;
`;
