import { useEffect, useState } from "react";
import styled from "styled-components";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import ImgEasyFinish from "./../../../public/img/cardHomeComp/easyFinish.png";
import { InputSimpleEditable } from "../../components/InputGeneral";
// import CorpListaArticulos from "../../components/corporativo/CorpListaArticulos";
import { useNavigate } from "react-router-dom";
import { ClearTheme, Tema } from "../../config/theme";
// import { itemsInicialSap } from "../Database/itemsSubir2";
import { PRODUCT_FULL2 } from "../../components/corporativo/PRODUCT_FULL2.JS";

export default function Maestros({ setOpcionUnicaSelect, userMaster }) {
  // ******************* Navegacion y seleccion de pantalla *******************
  useEffect(() => {
    setOpcionUnicaSelect(null);
  }, []);
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
    navigate("/articulos/maestros/productos/" + articuloBuscar.codigo);
  };
  return (
    <ContainerMaster>
      <CajaQueryGeneral>
        <Titulo>Consultar Articulo</Titulo>
        <CajaDetalle>
          <div>
            <Texto>Ingrese codigo o empiece a escribir la descripcion:</Texto>
            <form action="" onSubmit={(e) => handleSubmit(e)}>
              <WrapInput>
                <Input
                  placeholder="Escribir producto"
                  name="codigo"
                  value={articuloBuscar.codigo}
                  list="articulos"
                  onChange={(e) => handleInputs(e)}
                  autoComplete="off"
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
                <TituloCaja>Descripcion</TituloCaja>
                <Input
                  className="disabled"
                  disabled
                  value={articuloBuscar.descripcion}
                />
              </WrapInput>
              <BtnEjecutar type="submit">Consultar</BtnEjecutar>
            </form>
          </div>
          <CajaImagen>
            <ImagenMostrar2 src={ImgEasyFinish} className="noPng" />
          </CajaImagen>
        </CajaDetalle>
      </CajaQueryGeneral>
    </ContainerMaster>
  );
}
const ContainerMaster = styled.div`
  position: relative;
  width: 100%;
  min-height: 200px;
  padding: 10px;
  padding-left: 15px;
`;
const TituloCaja = styled.p`
  color: white;
`;
const DataList = styled.datalist`
  width: 150%;
`;
const WrapInput = styled.div`
  /* background-color: red; */
  width: 100%;
`;

const Opcion = styled.option``;
const CajaHeadLista = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-bottom: 10px;
  @media screen and (max-width: 800px) {
    width: 90%;
    flex-direction: column;
  }
`;

const CajaDetalles = styled.div`
  /* border: 1px solid white; */
  display: flex;
  flex-direction: column;
  width: 50%;
  margin: auto;
  margin-bottom: 15px;
  &.boton {
    margin-top: 20px;
  }
  &.lista {
    width: 30%;
    /* border: 1px solid blue; */
    margin: 0;
    justify-content: center;
    align-items: center;
  }
  &.tabla {
    width: 100%;
  }
  @media screen and (max-width: 850px) {
    width: 90%;
  }
`;

const ContainerMain = styled.div`
  width: 100%;
  min-height: 200px;
  padding: 10px;
  padding-left: 15px;
`;

const CajaQueryGeneral = styled.div`
  width: 100%;
  min-height: 100px;
  border: 1px solid black;
  margin-bottom: 20px;
  border-radius: 5px;
  padding: 5px;
  padding-left: 10px;
  /* background-color: ${Tema.secondary.azulProfundo}; */
  background-color: ${ClearTheme.secondary.azulFrosting};
  border: 1px solid white;
  backdrop-filter: blur(15px);
  color: white;
  &.ultima {
    margin-bottom: 100px;
  }
`;
const Titulo = styled.h2`
  text-decoration: underline;
  font-size: 1.5rem;
  margin-bottom: 15px;
  color: #fff;
  font-weight: lighter;
`;

const CajaDetalle = styled.div`
  /* background-color: ${Tema.secondary.azulGraciel}; */
  border: 1px solid white;

  border-radius: 5px;
  padding: 10px;
  padding-left: 15px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  @media screen and (max-width: 500px) {
    flex-direction: column-reverse;
  }
`;
const Input = styled(InputSimpleEditable)``;

const Texto = styled.p`
  color: white;
  margin-bottom: 4px;
`;
const BtnEjecutar = styled(BtnGeneralButton)`
  font-size: 1rem;
  display: inline-block;
  height: 30px;
  text-decoration: underline;
`;

const CajaImagen = styled.div`
  width: 40%;
  height: 140px;
  border: 1px solid ${ClearTheme.primary.azulBrillante};
  border: 2px solid ${ClearTheme.complementary.warning};
  background-image: "./img/rusaFurgon.jpg";
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 8px;
  box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  @media screen and (max-width: 500px) {
    width: auto;
    height: 95%;
    justify-content: center;
    align-items: center;
  }
  display: flex;
  justify-content: center;
  align-items: center;
`;
const ImagenMostrar = styled.img`
  width: 100%;
  object-fit: contain;
  object-position: center;
  transform: translate(0, -15%);
  @media screen and (max-width: 500px) {
    transform: translate(0, 0);
  }
`;

const ImagenMostrar2 = styled(ImagenMostrar)`
  width: 40%;
  /* transform: translate(50%, -15%); */
  &.noPng {
    border-radius: 8px;
    box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  }
  @media screen and (max-width: 500px) {
    transform: translate(0, 0);
  }
`;
