import { useEffect, useState } from "react";
import { BtnGeneralButton } from "../../components/BtnGeneralButton";
import styled from "styled-components";

import imgFurgon from "./../img/chinaEurope.png";
import imgOrdenCompra from "./../img/ordenCompra2.jpg";
import imgEasyFinish from "./../img/easyFinish2.png";
import docBl from "./../img/docBL.png";
import { NavLink, useNavigate } from "react-router-dom";
import { Alerta } from "../../components/Alerta";
import { ClearTheme, Tema } from "../../config/theme";
import { InputSimpleEditable } from "../../components/InputGeneral";

export const Maestros = ({ dbUsuario, userMaster, setOpcionUnicaSelect }) => {
  useEffect(() => {
    document.title = "Caeloss - Importaciones";
    return () => {
      document.title = "Caeloss";
    };
  }, []);

  const [alertaFaltaFurgon, setAlertaFaltaFurgon] = useState(false);
  const [alertaFaltaArticulo, setAlertaFaltaArticulo] = useState(false);
  const [alertaFaltaOrdenCompra, setAlertaFaltaOrdenCompra] = useState(false);
  const [alertaFaltaBL, setAlertaFaltaBL] = useState(false);
  const navigate = useNavigate();

  // const [focusOn, setFocusOn]=useState('');
  const [valueFurgon, setValueFurgon] = useState("");
  const [valueArticulo, setValueArticulo] = useState("");
  const [valueOrdenCompra, setValueOrdenCompra] = useState("");
  const [valueBillOfLading, setValueBillOfLading] = useState("");

  const handleInput = (e) => {
    const { value, name } = e.target;
    let valorParsed = value.trim();
    if (name == "contenedor") {
      setValueFurgon(valorParsed.toUpperCase());
    } else if (name == "articulo") {
      setValueArticulo(valorParsed);
    } else if (name == "ordenCompra") {
      setValueOrdenCompra(valorParsed);
    } else if (name == "billOfLading") {
      setValueBillOfLading(valorParsed.toUpperCase());
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (e.target.name == "formContenedor") {
      if (valueFurgon == "") {
        setAlertaFaltaFurgon(true);
        setTimeout(() => {
          setAlertaFaltaFurgon(false);
        }, 3000);
      } else {
        let nuevoFurgon = valueFurgon.toUpperCase();
        nuevoFurgon = nuevoFurgon.replace(/ /g, "");
        nuevoFurgon = nuevoFurgon.replace(/-/g, "");
        navigate("contenedores/" + encodeURIComponent(nuevoFurgon));
      }
    } else if (e.target.name == "formArticulo") {
      if (valueArticulo == "") {
        setAlertaFaltaArticulo(true);
        setTimeout(() => {
          setAlertaFaltaArticulo(false);
        }, 3000);
      } else {
        navigate("articulos/" + encodeURIComponent(valueArticulo));
      }
    } else if (e.target.name == "formOrdenCompra") {
      if (valueOrdenCompra == "") {
        setAlertaFaltaOrdenCompra(true);
        setTimeout(() => {
          setAlertaFaltaOrdenCompra(false);
        }, 3000);
      } else {
        navigate("ordenescompra/" + encodeURIComponent(valueOrdenCompra));
      }
    } else if (e.target.name == "formBillOfLading") {
      if (valueBillOfLading == "") {
        setAlertaFaltaBL(true);
        setTimeout(() => {
          setAlertaFaltaBL(false);
        }, 3000);
      } else {
        console.log(valueBillOfLading);
        navigate("billoflading/" + encodeURIComponent(valueBillOfLading));
      }
    }
  };

  useEffect(() => {
    setOpcionUnicaSelect(null);
  }, []);

  return (
    <>
      <ContainerMain>
        <CajaQueryGeneral>
          <Titulo>Consultar Contenedor</Titulo>
          <CajaDetalle>
            <div>
              <form
                action=""
                onSubmit={(e) => handleSubmit(e)}
                name="formContenedor"
              >
                <Texto>Ingrese numero de Contenedor:</Texto>
                <Input
                  type="text"
                  name="contenedor"
                  autoComplete="off"
                  //   onFocus={(e)=>handler(e)}
                  value={valueFurgon}
                  onChange={handleInput}
                />
                <BtnEjecutar type="submit">Consultar</BtnEjecutar>
              </form>
            </div>

            <CajaImagen>
              <ImagenMostrar src={imgFurgon} />
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>

        <CajaQueryGeneral>
          <Titulo>Consultar Articulo</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese codigo del producto:</Texto>
              <form
                action=""
                onSubmit={(e) => handleSubmit(e)}
                name="formArticulo"
              >
                <Input
                  type="text"
                  name="articulo"
                  autoComplete="off"
                  //   onFocus={(e)=>handler(e)}
                  value={valueArticulo}
                  onChange={handleInput}
                />
                <BtnEjecutar type="submit">Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <ImagenMostrar2 src={imgEasyFinish} />
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>
        <CajaQueryGeneral>
          <Titulo>Consultar orden de compra</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese numero de orden de compra:</Texto>
              <form
                action=""
                onSubmit={(e) => handleSubmit(e)}
                name="formOrdenCompra"
              >
                <Input
                  type="text"
                  name="ordenCompra"
                  autoComplete="off"
                  //   onFocus={(e)=>handler(e)}
                  value={valueOrdenCompra}
                  onChange={handleInput}
                />
                <BtnEjecutar type="submit">Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <ImagenMostrar2 src={imgOrdenCompra} className="noPng" />
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>
        <CajaQueryGeneral className="ultima">
          <Titulo>Consultar Bill of Lading</Titulo>
          <CajaDetalle>
            <div>
              <Texto>Ingrese numero de Bill of Lading:</Texto>
              <form
                action=""
                onSubmit={(e) => handleSubmit(e)}
                name="formBillOfLading"
              >
                <Input
                  type="text"
                  name="billOfLading"
                  autoComplete="off"
                  //   onFocus={(e)=>handler(e)}
                  value={valueBillOfLading}
                  onChange={handleInput}
                />
                <BtnEjecutar type="submit">Consultar</BtnEjecutar>
              </form>
            </div>
            <CajaImagen>
              <ImagenMostrar src={docBl} className="docBl" />
            </CajaImagen>
          </CajaDetalle>
        </CajaQueryGeneral>

        <Alerta
          estadoAlerta={alertaFaltaFurgon}
          tipo={"warning"}
          mensaje={"Por favor indica un numero de contenedor."}
        />
        <Alerta
          estadoAlerta={alertaFaltaArticulo}
          tipo={"warning"}
          mensaje={"Por favor indica codigo del material que necesitas."}
        />
        <Alerta
          estadoAlerta={alertaFaltaOrdenCompra}
          tipo={"warning"}
          mensaje={"Ingresa numero de orden compra."}
        />
        <Alerta
          estadoAlerta={alertaFaltaBL}
          tipo={"warning"}
          mensaje={"Ingresa numero de Bill of Lading."}
        />
      </ContainerMain>
    </>
  );
};
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
  width: 60%;
  /* transform: translate(50%, -15%); */
  &.noPng {
    border-radius: 8px;
    box-shadow: 3px 3px 3px -1px rgba(0, 0, 0, 0.43);
  }
  @media screen and (max-width: 500px) {
    transform: translate(0, 0);
  }
`;
const Enlaces = styled(NavLink)`
  color: inherit;
  text-decoration: none;
  &:hover {
    text-decoration: underline;
  }

  @media screen and (max-width: 500px) {
    display: flex;
    width: 100%;
    justify-content: center;
  }
`;
