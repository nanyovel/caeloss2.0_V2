import { useState } from "react";
import styled from "styled-components";
import { InputSimpleEditable } from "../../components/InputGeneral";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faMagnifyingGlass } from "@fortawesome/free-solid-svg-icons";

import { useNavigate } from "react-router-dom";
import { Franja } from "../components/Franja";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";

export default function ProductosMain({ setOpcionUnicaSelect }) {
  const ListaArticulos = PRODUCT_FULL2;
  const initialInput = {
    codigo: "",
    descripcion: "",
  };
  const [articuloBuscar, setArticuloBuscar] = useState({ ...initialInput });
  const handleInputs = (e) => {
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

  const navigate = useNavigate();
  const handleSubmit = (e) => {
    e.preventDefault();
    setOpcionUnicaSelect(null);
    navigate("/articulos/maestros/productos/" + articuloBuscar.codigo);
  };

  return (
    <ContainerMaster>
      <Franja />
      <br />
      <br />
      <form action="" onSubmit={(e) => handleSubmit(e)}>
        <Contenido>
          <WrapContenido>
            <CajaParrafo>
              <Parrafo>
                Todo lo que necesitas saber de nuestros materiales.
              </Parrafo>
            </CajaParrafo>
            <CajaInput className="codigo">
              <WrapCodigo>
                <Icono icon={faMagnifyingGlass} />
                <InputSimple
                  className="codigo"
                  name="codigo"
                  value={articuloBuscar.codigo}
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
            </CajaInput>
            <CajaInput className="descripcion">
              <InputSimple
                disabled
                className="disabled descripcion"
                value={articuloBuscar.descripcion}
              />
            </CajaInput>
            <CajaInput>
              <BtnSimple type="submit">Aceptar</BtnSimple>
            </CajaInput>
          </WrapContenido>
        </Contenido>
      </form>
      <br />
      <br />
      <Franja className="invertido" />
    </ContainerMaster>
  );
}

const ContainerMaster = styled.div`
  position: relative;
  /* padding: 15px; */
`;

const Contenido = styled.div`
  padding: 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;
const WrapContenido = styled.div`
  width: 70%;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 7px;
`;
const CajaParrafo = styled.div`
  width: 100%;
  margin-bottom: 5px;
`;
const Parrafo = styled.p`
  color: white;
  font-size: 1.2rem;
  text-align: center;
`;
const CajaInput = styled.div`
  width: 500px;
  display: flex;
  flex-direction: column;
  align-items: center;
  &.codigo {
  }
  &.descripcion {
    width: 100%;
  }
`;
const WrapCodigo = styled.div`
  width: 50%;
  position: relative;
`;
const InputSimple = styled(InputSimpleEditable)`
  height: 40px;
  border-radius: 20px;
  padding: 12px;
  &.codigo {
    width: 100%;
    padding-left: 35px;
  }
  &.descripcion {
    width: 100%;
  }
`;
const BtnSimple = styled(BtnGeneralButton)`
  border-radius: 25px;
  height: 40px;
  min-height: auto;
  min-width: auto;
  width: 120px;
  transition: all 0.2s ease;
  margin: 0;
`;
const DataList = styled.datalist`
  width: 150%;
`;
const Opcion = styled.option``;

const Icono = styled(FontAwesomeIcon)`
  position: absolute;
  left: 9px;
  top: 50%;
  transform: translate(0, -50%);
  color: #353232;
`;
