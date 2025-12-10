import React, { useEffect, useState } from "react";
import MenuPestannias from "../../components/MenuPestannias";
import styled from "styled-components";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import {
  CajaTablaGroup,
  CeldaHeadGroup,
  CeldasBodyGroup,
  Enlace,
  FilasGroup,
  TablaGroup,
} from "../../components/JSXElements/GrupoTabla";
import {
  fetchDocsByArrayContains,
  fetchDocsByConditionGetDocs,
  useDocByCondition,
} from "../../libs/useDocByCondition";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";
import TablaResultadoConjunto from "../components/TablaResultadoConjunto";

export default function ConjuntoMain() {
  // Llamada a la base de datos
  const [conjuntoDB, setConjuntoDB] = useState([]);
  useDocByCondition("conjuntos", setConjuntoDB);
  const [listaConjunto, setListaConjunto] = useState([]);
  useEffect(() => {
    if (conjuntoDB.length > 0) {
      setListaConjunto(conjuntoDB);
    }
  }, [conjuntoDB]);

  // Menu pestannia
  const [arrayPestannia, setArrayPestania] = useState([
    {
      nombre: "Items",
      code: "items",
      select: true,
    },

    {
      nombre: "Proyectos",
      code: "noProyecto",
      select: false,
    },
    {
      nombre: "Todos",
      code: "todos",
      select: false,
    },
  ]);

  const handlePestannias = (e) => {
    reset();

    const indexDataset = Number(e.target.dataset.id);
    setArrayPestania(
      arrayPestannia.map((opcion, index) => {
        return {
          ...opcion,
          select: index === indexDataset,
        };
      })
    );
  };
  const reset = () => {
    setHasResultado(false);
    setArticuloBuscar({ ...initialInput });
    setProyectoBuscar("");
  };

  // Por items
  const ListaArticulos = PRODUCT_FULL2;
  const initialInput = {
    codigo: "",
    descripcion: "",
  };
  const [articuloBuscar, setArticuloBuscar] = useState({ ...initialInput });
  const [proyectoBuscar, setProyectoBuscar] = useState("");
  const handleInputs = (e) => {
    const { name, value } = e.target;

    if (name == "producto") {
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
    } else if (name == "proyecto") {
      setProyectoBuscar(value);
    }
  };

  // Mostrar datos de la DB
  const [hasResultado, setHasResultado] = useState(false);
  const [listaItems, setListaItems] = useState([]);
  const buscarConjuntoDB = async () => {
    const codeOpcion = arrayPestannia.find((opcion) => opcion.select).code;
    if (codeOpcion === "items") {
      const data = await fetchDocsByArrayContains(
        "conjuntos",
        undefined,
        "arrayCodigoItems",
        articuloBuscar.codigo
      );
      console.log(data);
      setListaItems(data);
    } else if (codeOpcion === "noProyecto") {
      const data = await fetchDocsByConditionGetDocs(
        "conjuntos",
        undefined,
        "noProyecto",
        "==",
        proyectoBuscar.toLowerCase()
      );
      console.log(data);
      setListaItems(data);
    } else if (codeOpcion === "todos") {
    }

    setHasResultado(true);
  };
  return (
    <Container>
      <MenuPestannias
        arrayOpciones={arrayPestannia}
        handlePestannias={handlePestannias}
      />
      {arrayPestannia.find((opcion) => opcion.select).code == "items" && (
        <CajaItem>
          <CajaInput>
            <Titulo>Buscar conjunto por producto</Titulo>
            <InputSimple
              className="codigo"
              value={articuloBuscar.codigo}
              name="producto"
              list="articulos"
              autoComplete="off"
              onChange={(e) => handleInputs(e)}
            />
            <br />
            <InputSimple
              className="disabled"
              disabled
              value={articuloBuscar.descripcion}
            />
            <DataList id="articulos">
              {ListaArticulos.map((item, index) => {
                return (
                  <Opcion value={item.codigo} key={index}>
                    {item.descripcion}
                  </Opcion>
                );
              })}
            </DataList>
            <BtnGeneralButton onClick={() => buscarConjuntoDB()}>
              Buscar
            </BtnGeneralButton>
          </CajaInput>
        </CajaItem>
      )}

      {arrayPestannia.find((opcion) => opcion.select).code == "noProyecto" && (
        <CajaItem>
          <CajaInput>
            <Titulo>Buscar conjunto por N° Proyecto</Titulo>
            <InputSimple
              className="codigo"
              value={proyectoBuscar}
              name="proyecto"
              onChange={(e) => handleInputs(e)}
              autoComplete="off"
            />
            <br />
            <BtnGeneralButton onClick={() => buscarConjuntoDB()}>
              Buscar
            </BtnGeneralButton>
          </CajaInput>
        </CajaItem>
      )}
      {arrayPestannia.find((opcion) => opcion.select).code == "todos" && (
        <TablaResultadoConjunto datos={listaConjunto} />
      )}

      {hasResultado && <TablaResultadoConjunto datos={listaItems} />}
    </Container>
  );
}
const Container = styled.div`
  width: 100%;
`;
const CajaItem = styled.div`
  padding: 25px;
  display: flex;
  justify-content: center;
`;

const CajaInput = styled.div`
  width: 50%;
  border: 1px solid white;
  padding: 16px;
  border-radius: 6px;
`;
const Titulo = styled.h2`
  color: white;
  font-weight: 400;
  font-size: 1.2rem;
`;
const InputSimple = styled(InputSimpleEditable)`
  &.codigo {
    margin-bottom: 6px;
  }
`;
const DataList = styled.datalist`
  width: 150%;
`;
const Opcion = styled.option``;
